'use strict';

const { neon } = require('@neondatabase/serverless');

function sendJson(res, statusCode, payload) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(payload));
}

async function readRawBody(req) {
    if (Buffer.isBuffer(req.rawBody)) return req.rawBody;
    if (typeof req.rawBody === 'string') return Buffer.from(req.rawBody);
    if (req.rawBody instanceof Uint8Array) return Buffer.from(req.rawBody);

    const chunks = [];
    for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
}

async function parseJsonBody(req) {
    const rawBody = await readRawBody(req);
    if (!rawBody.length) return {};
    return JSON.parse(rawBody.toString('utf8'));
}

function normStr(value, maxLength) {
    if (typeof value !== 'string') return '';
    return value.replace(/[<>"']/g, '').trim().slice(0, maxLength);
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return sendJson(res, 405, { error: 'Method not allowed.' });
    }

    const adminSecret = process.env.KL_ADMIN_SECRET;
    const databaseUrl = process.env.KL_DATABASE_URL;

    if (!adminSecret || !databaseUrl) {
        return sendJson(res, 503, { error: 'Referral admin is not configured.' });
    }

    let body;
    try {
        body = await parseJsonBody(req);
    } catch (error) {
        return sendJson(res, 400, { error: 'Invalid JSON body.' });
    }

    if ((body && body.secret) !== adminSecret) {
        return sendJson(res, 403, { error: 'Forbidden.' });
    }

    const action = normStr(body && body.action, 40);
    const sql = neon(databaseUrl);

    try {
        if (action === 'mark_payout_paid') {
            const payoutId = parseInt(body.payoutId, 10);
            const payoutNote = normStr(body.payoutNote, 1000);
            const payoutMethod = normStr(body.payoutMethod, 40).toLowerCase();
            const payoutReference = normStr(body.payoutReference, 120);
            const confirmAmountCents = parseInt(body.confirmAmountCents, 10);

            if (!Number.isInteger(payoutId) || payoutId <= 0) {
                return sendJson(res, 400, { error: 'Invalid payout ID.' });
            }

            if (!Number.isInteger(confirmAmountCents) || confirmAmountCents < 0) {
                return sendJson(res, 400, { error: 'Invalid payout confirmation amount.' });
            }

            if (!payoutMethod) {
                return sendJson(res, 400, { error: 'Payout method is required.' });
            }

            const [row] = await sql`
                SELECT id, payout_status, commission_amount_cents
                FROM kl_referral_payouts
                WHERE id = ${payoutId}
                LIMIT 1
            `;

            if (!row) {
                return sendJson(res, 404, { error: 'Payout not found.' });
            }

            if (row.payout_status === 'paid') {
                return sendJson(res, 409, { error: 'Payout is already marked paid.' });
            }

            const expectedAmount = parseInt(row.commission_amount_cents, 10);
            if (confirmAmountCents !== expectedAmount) {
                return sendJson(res, 400, { error: 'Confirmed amount does not match payout amount.' });
            }

            const updated = await sql`
                UPDATE kl_referral_payouts
                SET
                    payout_status = 'paid',
                    paid_at = NOW(),
                    payout_note = ${[
                        payoutMethod ? 'method:' + payoutMethod : '',
                        payoutReference ? 'ref:' + payoutReference : '',
                        payoutNote ? 'note:' + payoutNote : ''
                    ].filter(Boolean).join(' | ') || null}
                WHERE id = ${payoutId}
                RETURNING id
            `;

            if (!updated.length) {
                return sendJson(res, 404, { error: 'Payout not found.' });
            }

            return sendJson(res, 200, { ok: true, payoutId });
        }

        return sendJson(res, 400, { error: 'Unknown admin action.' });
    } catch (error) {
        console.error('[referral-admin] Request failed:', error && error.message);
        return sendJson(res, 500, { error: 'Referral admin action failed.' });
    }
};
