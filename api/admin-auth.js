'use strict';

const {
    FORGOT_CONTACT,
    ROLES,
    getAdminSecret,
    hashPassword,
    verifySecret,
    issueSessionToken,
    verifySessionToken,
    readJsonBody,
    requireMaster,
    setOwnerPasswordHash,
    ownerPasswordConfigured,
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

    let body = {};
    try {
        body = await readJsonBody(req);
    } catch (error) {
        return sendJson(res, 400, { ok: false, error: 'Invalid JSON body.' });
    }

    const action = String(body.action || 'login').trim().toLowerCase();

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
            console.info('[admin-auth] owner password updated by master');
            return sendJson(res, 200, { ok: true, message: 'Owner password updated.' });
        } catch (error) {
            console.error('[admin-auth] owner password update failed', error.message);
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
        console.warn('[admin-auth] failed login attempt');
        return sendJson(res, 403, { ok: false, error: 'Incorrect password.' });
    }

    const session = issueSessionToken(verified.role);
    console.info('[admin-auth] session issued', { role: verified.role });
    return sendJson(res, 200, {
        ok: true,
        token: session.token,
        role: session.role,
        expiresAt: session.expiresAt,
    });
};
