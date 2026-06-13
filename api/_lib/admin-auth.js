'use strict';

const crypto = require('crypto');
const { neon } = require('@neondatabase/serverless');

const SESSION_MS = 8 * 60 * 60 * 1000;
const ROLES = Object.freeze({ MASTER: 'master', OWNER: 'owner' });
const FORGOT_CONTACT = Object.freeze({
    email: 'nknight@knightgroup.com',
    note: 'Knight Logics retains a master access key for site maintenance and support. Owner passwords can be reset by your agency contact.',
});

function getAdminSecret() {
    return process.env.KL_ADMIN_SECRET || '';
}

function getOwnerEnvSecret() {
    return process.env.KL_OWNER_SECRET || '';
}

function timingSafeEqualString(a, b) {
    const left = Buffer.from(String(a));
    const right = Buffer.from(String(b));
    if (left.length !== right.length) {
        return false;
    }
    return crypto.timingSafeEqual(left, right);
}

function hashPassword(password) {
    const salt = crypto.randomBytes(16);
    const hash = crypto.scryptSync(String(password), salt, 32);
    return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

function verifyPasswordHash(password, stored) {
    if (!stored || !password) {
        return false;
    }
    const parts = String(stored).split(':');
    if (parts.length !== 2) {
        return false;
    }
    const salt = Buffer.from(parts[0], 'hex');
    const expected = Buffer.from(parts[1], 'hex');
    if (!salt.length || expected.length !== 32) {
        return false;
    }
    const hash = crypto.scryptSync(String(password), salt, 32);
    return timingSafeEqualString(hash, expected);
}

async function ensureAdminSettingsTable(sql) {
    await sql`
        CREATE TABLE IF NOT EXISTS kl_admin_settings (
            setting_key   VARCHAR(80) PRIMARY KEY,
            setting_value TEXT NOT NULL,
            updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `;
}

async function getOwnerPasswordHash() {
    const databaseUrl = process.env.KL_DATABASE_URL;
    if (!databaseUrl) {
        return '';
    }
    const sql = neon(databaseUrl);
    await ensureAdminSettingsTable(sql);
    const rows = await sql`
        SELECT setting_value
        FROM kl_admin_settings
        WHERE setting_key = 'owner_password_hash'
        LIMIT 1
    `;
    return rows[0]?.setting_value || '';
}

async function setOwnerPasswordHash(hash) {
    const databaseUrl = process.env.KL_DATABASE_URL;
    if (!databaseUrl) {
        throw new Error('Database not configured.');
    }
    const sql = neon(databaseUrl);
    await ensureAdminSettingsTable(sql);
    await sql`
        INSERT INTO kl_admin_settings (setting_key, setting_value, updated_at)
        VALUES ('owner_password_hash', ${hash}, NOW())
        ON CONFLICT (setting_key) DO UPDATE
        SET setting_value = EXCLUDED.setting_value,
            updated_at = EXCLUDED.updated_at
    `;
}

async function ownerPasswordConfigured() {
    if (getOwnerEnvSecret()) {
        return true;
    }
    const hash = await getOwnerPasswordHash();
    return Boolean(hash);
}

function verifyMasterSecret(provided) {
    const expected = getAdminSecret();
    if (!expected || provided == null || provided === '') {
        return false;
    }
    return timingSafeEqualString(String(provided), expected);
}

async function verifyOwnerSecret(provided) {
    if (provided == null || provided === '') {
        return false;
    }
    const envOwner = getOwnerEnvSecret();
    if (envOwner && timingSafeEqualString(String(provided), envOwner)) {
        return true;
    }
    const hash = await getOwnerPasswordHash();
    if (hash && verifyPasswordHash(provided, hash)) {
        return true;
    }
    return false;
}

async function verifySecret(provided) {
    if (verifyMasterSecret(provided)) {
        return { ok: true, role: ROLES.MASTER };
    }
    if (await verifyOwnerSecret(provided)) {
        return { ok: true, role: ROLES.OWNER };
    }
    return { ok: false, role: null };
}

function issueSessionToken(role) {
    const secret = getAdminSecret();
    const exp = Date.now() + SESSION_MS;
    const safeRole = role === ROLES.OWNER ? ROLES.OWNER : ROLES.MASTER;
    const payload = `${exp}.${safeRole}`;
    const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex').slice(0, 32);
    return {
        token: `${payload}.${sig}`,
        role: safeRole,
        expiresAt: new Date(exp).toISOString(),
    };
}

function verifySessionToken(token) {
    const secret = getAdminSecret();
    if (!secret || !token) {
        return { ok: false, role: null };
    }
    const parts = String(token).split('.');
    if (parts.length !== 3) {
        return { ok: false, role: null };
    }
    const [exp, role, sig] = parts;
    const expNum = Number(exp);
    if (!Number.isFinite(expNum) || Date.now() > expNum) {
        return { ok: false, role: null };
    }
    if (role !== ROLES.MASTER && role !== ROLES.OWNER) {
        return { ok: false, role: null };
    }
    const payload = `${exp}.${role}`;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex').slice(0, 32);
    if (!timingSafeEqualString(sig, expected)) {
        return { ok: false, role: null };
    }
    return { ok: true, role };
}

async function readJsonBody(req) {
    if (req.body && typeof req.body === 'object') {
        return req.body;
    }
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    if (!chunks.length) {
        return {};
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function authenticateRequest(req, body) {
    const token = (body && body.token) || req.headers['x-kl-admin-token'];
    const session = verifySessionToken(token);
    if (session.ok) {
        return { ok: true, method: 'token', role: session.role };
    }
    const secret = (body && body.secret) || req.headers['x-kl-admin-secret'];
    const verified = await verifySecret(secret);
    if (verified.ok) {
        return { ok: true, method: 'secret', role: verified.role };
    }
    return { ok: false, role: null };
}

function requireMaster(auth) {
    return auth && auth.ok && auth.role === ROLES.MASTER;
}

module.exports = {
    SESSION_MS,
    ROLES,
    FORGOT_CONTACT,
    getAdminSecret,
    getOwnerEnvSecret,
    hashPassword,
    verifyPasswordHash,
    verifyMasterSecret,
    verifyOwnerSecret,
    verifySecret,
    issueSessionToken,
    verifySessionToken,
    readJsonBody,
    authenticateRequest,
    requireMaster,
    getOwnerPasswordHash,
    setOwnerPasswordHash,
    ownerPasswordConfigured,
};
