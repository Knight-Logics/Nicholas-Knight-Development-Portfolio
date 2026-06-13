'use strict';

const { neon } = require('@neondatabase/serverless');
const {
    FORGOT_CONTACT,
    ROLES,
    getAdminSecret,
    hashPassword,
    verifySecret,
    issueSessionToken,
    verifySessionToken,
    readJsonBody,
    authenticateRequest,
    setOwnerPasswordHash,
    ownerPasswordConfigured,
} = require('./_lib/admin-auth');

function sendJson(res, status, payload) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(payload));
}

async function handleHealth(req, res, body) {
    if (!getAdminSecret()) {
        return sendJson(res, 503, {
            ok: false,
            error: 'Admin secret not configured on server (KL_ADMIN_SECRET).',
        });
    }

    const auth = await authenticateRequest(req, body);
    if (!auth.ok) {
        return sendJson(res, 403, { ok: false, error: 'Forbidden.' });
    }

    const databaseUrl = process.env.KL_DATABASE_URL;
    const modules = {
        admin_shell: {
            label: 'Knight Command (/admin)',
            status: 'ok',
            detail: 'Cloud shell reachable.',
        },
        referral_crm: {
            label: 'Referral CRM',
            status: databaseUrl ? 'ok' : 'error',
            detail: databaseUrl ? 'Database configured.' : 'KL_DATABASE_URL missing.',
        },
        referral_api: {
            label: 'Referral API',
            status: 'ok',
            detail: 'referral-stats and referral-admin endpoints deployed.',
        },
    };

    if (databaseUrl) {
        try {
            const sql = neon(databaseUrl);
            await sql`SELECT 1 AS ok`;
            modules.referral_crm.detail = 'Database connection OK.';
        } catch (error) {
            modules.referral_crm.status = 'error';
            modules.referral_crm.detail = `Database probe failed: ${error.message}`;
            console.error('[admin] database probe failed', error.message);
        }
    }

    const localModules = [
        {
            id: 'knight_command',
            label: 'Outreach / Knight Command',
            url: 'http://127.0.0.1:5050/',
            port: 5050,
            kind: 'local',
        },
        {
            id: 'email_agent',
            label: 'Email Agent',
            url: 'http://127.0.0.1:5100/',
            port: 5100,
            kind: 'local',
        },
        {
            id: 'social_ops',
            label: 'Social Ops (Engagement Manager)',
            url: 'http://127.0.0.1:8500/?embed=true',
            port: 8500,
            kind: 'local',
        },
        {
            id: 'social_poster',
            label: 'Social Poster',
            url: 'http://127.0.0.1:8501/?embed=true',
            port: 8501,
            kind: 'local',
        },
    ];

    return sendJson(res, 200, {
        ok: true,
        generatedAt: new Date().toISOString(),
        authMethod: auth.method,
        role: auth.role,
        modules,
        localModules,
        notes: [
            'Local modules run on this PC only. Browsers block public sites from probing 127.0.0.1 via fetch; use embedded iframes or open links in a new tab.',
            'Start OutreachEngine with: python app.py (port 5050). Social services: Social-Media-Manager\\run_social_services_hidden.ps1',
        ],
    });
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return sendJson(res, 405, { ok: false, error: 'Method not allowed.' });
    }

    let body = {};
    try {
        body = await readJsonBody(req);
    } catch (error) {
        return sendJson(res, 400, { ok: false, error: 'Invalid JSON body.' });
    }

    const action = String(body.action || 'login').trim().toLowerCase();

    if (action === 'health') {
        return handleHealth(req, res, body);
    }

    if (action === 'forgot-info') {
        return sendJson(res, 200, {
            ok: true,
            contact: FORGOT_CONTACT,
            ownerConfigured: await ownerPasswordConfigured(),
        });
    }

    if (!getAdminSecret()) {
        return sendJson(res, 503, {
            ok: false,
            error: 'Admin secret not configured on server (KL_ADMIN_SECRET).',
        });
    }

    if (action === 'verify') {
        const session = verifySessionToken(body.token || req.headers['x-kl-admin-token']);
        if (!session.ok) {
            return sendJson(res, 403, { ok: false, error: 'Invalid or expired session.' });
        }
        return sendJson(res, 200, { ok: true, valid: true, role: session.role });
    }

    if (action === 'set-owner-password') {
        const session = verifySessionToken(body.token || req.headers['x-kl-admin-token']);
        if (!session.ok || session.role !== ROLES.MASTER) {
            return sendJson(res, 403, { ok: false, error: 'Master access required.' });
        }
        const nextPassword = String(body.newPassword || body.password || '').trim();
        if (nextPassword.length < 8) {
            return sendJson(res, 400, { ok: false, error: 'Owner password must be at least 8 characters.' });
        }
        if (nextPassword === getAdminSecret()) {
            return sendJson(res, 400, { ok: false, error: 'Owner password must differ from the master password.' });
        }
        try {
            await setOwnerPasswordHash(hashPassword(nextPassword));
            console.info('[admin] owner password updated by master');
            return sendJson(res, 200, { ok: true, message: 'Owner password updated.' });
        } catch (error) {
            console.error('[admin] owner password update failed', error.message);
            return sendJson(res, 503, { ok: false, error: 'Could not save owner password.' });
        }
    }

    if (action === 'owner-status') {
        const session = verifySessionToken(body.token || req.headers['x-kl-admin-token']);
        if (!session.ok || session.role !== ROLES.MASTER) {
            return sendJson(res, 403, { ok: false, error: 'Master access required.' });
        }
        return sendJson(res, 200, {
            ok: true,
            ownerConfigured: await ownerPasswordConfigured(),
        });
    }

    const secret = body.secret || '';
    const verified = await verifySecret(secret);
    if (!verified.ok) {
        console.warn('[admin] failed login attempt');
        return sendJson(res, 403, { ok: false, error: 'Incorrect password.' });
    }

    const session = issueSessionToken(verified.role);
    console.info('[admin] session issued', { role: verified.role });
    return sendJson(res, 200, {
        ok: true,
        token: session.token,
        role: session.role,
        expiresAt: session.expiresAt,
    });
};
