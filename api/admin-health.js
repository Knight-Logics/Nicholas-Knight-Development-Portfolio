'use strict';

const { neon } = require('@neondatabase/serverless');
const {
    getAdminSecret,
    authenticateRequest,
    readJsonBody,
} = require('./_lib/admin-auth');

function sendJson(res, status, payload) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(payload));
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return sendJson(res, 405, { ok: false, error: 'Method not allowed.' });
    }

    if (!getAdminSecret()) {
        return sendJson(res, 503, {
            ok: false,
            error: 'Admin secret not configured on server (KL_ADMIN_SECRET).',
        });
    }

    let body = {};
    try {
        body = await readJsonBody(req);
    } catch (error) {
        return sendJson(res, 400, { ok: false, error: 'Invalid JSON body.' });
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
            console.error('[admin-health] database probe failed', error.message);
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
};
