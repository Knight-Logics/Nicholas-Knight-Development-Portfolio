/**
 * api/referral-verify.js
 * Vercel Serverless Function — partner-facing referral verification endpoint.
 *
 * GET /api/referral-verify?partner=post-office-square&verify_code=abc123
 *
 * Returns partner-specific referral stats without requiring admin secret.
 * Verify code is derived from partner slug + KL_VERIFY_SALT secret.
 */

'use strict';

const { neon } = require('@neondatabase/serverless');
const crypto = require('crypto');

function generateVerifyCode(partnerSlug) {
    const salt = process.env.KL_VERIFY_SALT || 'kl-partner-verify-2026';
    const hash = crypto.createHmac('sha256', salt)
        .update(partnerSlug.toLowerCase().trim())
        .digest('hex');
    return hash.slice(0, 16);
}

function json(res, status, data) {
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify(data));
}

module.exports = async function handler(req, res) {
    try {
        // Validate request
        if (req.method !== 'GET') {
            return json(res, 405, { ok: false, error: 'Method not allowed' });
        }

        const { partner, verify_code } = req.query;
        if (!partner || !verify_code) {
            return json(res, 400, { ok: false, error: 'Missing partner or verify_code' });
        }

        const partnerSlug = String(partner).trim();
        const providedCode = String(verify_code).trim().toLowerCase();
        const expectedCode = generateVerifyCode(partnerSlug);

        if (providedCode !== expectedCode) {
            return json(res, 401, { ok: false, error: 'Invalid verification code' });
        }

        if (!process.env.KL_DATABASE_URL) {
            return json(res, 503, { ok: false, error: 'Database not configured' });
        }

        const sql = neon(process.env.KL_DATABASE_URL);

        // Fetch all events for this partner
        const allEvents = await sql`
            SELECT
                event_type,
                referral_offer,
                amount_cents,
                created_at,
                contact_email,
                contact_name,
                page_path,
                session_id
            FROM kl_referral_events
            WHERE referral_partner = ${partnerSlug}
            ORDER BY created_at DESC
            LIMIT 100
        `;

        // Calculate stats
        const stats = {
            pageviews: 0,
            form_submits: 0,
            checkout_starts: 0,
            payments_completed: 0,
            gross_revenue_cents: 0,
            sessions: new Set()
        };

        allEvents.forEach(e => {
            if (e.event_type === 'pageview') stats.pageviews++;
            if (e.event_type === 'form_submit') stats.form_submits++;
            if (e.event_type === 'checkout_start') stats.checkout_starts++;
            if (e.event_type === 'payment_completed') {
                stats.payments_completed++;
                stats.gross_revenue_cents += (e.amount_cents || 0);
            }
            if (e.session_id) stats.sessions.add(e.session_id);
        });

        // Fetch payout info
        const payouts = await sql`
            SELECT
                payout_status,
                payout_note,
                commission_amount_cents
            FROM kl_referral_payouts
            WHERE partner_slug = ${partnerSlug}
            ORDER BY created_at DESC
            LIMIT 1
        `;

        const payout = payouts[0] || {};

        return json(res, 200, {
            ok: true,
            partner: partnerSlug,
            stats: {
                pageviews: stats.pageviews,
                form_submits: stats.form_submits,
                checkout_starts: stats.checkout_starts,
                payments_completed: stats.payments_completed,
                gross_revenue_cents: stats.gross_revenue_cents,
                commission_cents: payout.commission_amount_cents || 0,
                unique_sessions: stats.sessions.size,
                payout_status: payout.payout_status || 'pending',
                payout_method: payout.payout_note || 'Awaiting first referral payment'
            },
            events: allEvents.slice(0, 20).map(e => ({
                type: e.event_type,
                offer: e.referral_offer || null,
                amount: e.amount_cents ? `$${(e.amount_cents / 100).toFixed(2)}` : null,
                contact: e.contact_email || e.contact_name || null,
                path: e.page_path || null,
                timestamp: e.created_at
            })),
            generatedAt: new Date().toISOString()
        });

    } catch (err) {
        console.error('[referral-verify]', err);
        return json(res, 500, { ok: false, error: 'Server error' });
    }
};
