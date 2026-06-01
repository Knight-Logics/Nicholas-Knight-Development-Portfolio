/**
 * api/referral-partners.js
 * Vercel Serverless Function — returns list of active referral partners.
 *
 * GET /api/referral-partners
 *
 * Returns the active referral partner roster.
 * Public endpoint (no auth required) — used to populate "Who referred you?" dropdowns.
 *
 * The DB-backed roster is merged with the original campaign roster so generated partners
 * appear in checkout/forms while old partners remain available as a safe fallback.
 *
 * Response: { ok: true, partners: [ { slug: "...", displayName: "..." }, ... ] }
 */

'use strict';

const { neon } = require('@neondatabase/serverless');
const { mergeReferralPartners } = require('./referral-roster');

async function ensurePartnerTermsTable(sql) {
    await sql`
        CREATE TABLE IF NOT EXISTS kl_referral_partner_terms (
            partner_slug        VARCHAR(80) PRIMARY KEY,
            partner_name        VARCHAR(120),
            commission_percent  NUMERIC(6,3) NOT NULL DEFAULT 0,
            is_active           BOOLEAN NOT NULL DEFAULT TRUE,
            notes               TEXT,
            created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    `;
    await sql`ALTER TABLE kl_referral_partner_terms ADD COLUMN IF NOT EXISTS latest_offer VARCHAR(80)`;
}

module.exports = async function handler(req, res) {
    const json = (status, data) => {
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    };

    try {
        if (req.method !== 'GET') {
            return json(405, { ok: false, error: 'Method not allowed' });
        }

        let dynamicRows = [];
        const databaseUrl = process.env.KL_DATABASE_URL || process.env.DATABASE_URL;
        if (databaseUrl) {
            try {
                const sql = neon(databaseUrl);
                await ensurePartnerTermsTable(sql);
                dynamicRows = await sql`
                    SELECT partner_slug, partner_name, latest_offer, is_active
                    FROM kl_referral_partner_terms
                    ORDER BY partner_name ASC, partner_slug ASC
                `;
            } catch (dbError) {
                console.error('[referral-partners] DB fallback:', dbError && dbError.message);
            }
        }

        return json(200, {
            ok: true,
            partners: mergeReferralPartners(dynamicRows)
        });
    } catch (err) {
        console.error('[referral-partners] Error:', err.message || err);
        return json(500, { ok: false, error: 'Error fetching partners' });
    }
};


