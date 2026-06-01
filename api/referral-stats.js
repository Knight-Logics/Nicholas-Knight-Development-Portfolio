/**
 * api/referral-stats.js
 * Vercel Serverless Function — returns referral CRM stats for the internal dashboard.
 *
 * GET /api/referral-stats?secret=YOUR_ADMIN_SECRET&partner=signshop-x&days=30
 *
 * Query params (all optional except secret):
 *   secret   — must match KL_ADMIN_SECRET env var
 *   partner  — filter to one partner slug (omit = all partners)
 *   offer    — filter to one offer code
 *   days     — lookback window in days (default 30, max 365)
 *
 * Returns summary, partner and offer rollups, recent events,
 * and payout queue data for the admin dashboard.
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

    if (req.method !== 'GET') return json(405, { error: 'Method not allowed.' });

    /* Auth */
    const adminSecret = process.env.KL_ADMIN_SECRET;
    if (!adminSecret) return json(503, { error: 'Admin secret not configured.' });

    const params = new URLSearchParams(
        (req.url || '').includes('?') ? req.url.split('?')[1] : ''
    );
    if (params.get('secret') !== adminSecret) {
        return json(403, { error: 'Forbidden.' });
    }

    if (!process.env.KL_DATABASE_URL) {
        return json(503, { error: 'Database not configured.' });
    }

    const partner  = params.get('partner') || null;
    const offer    = params.get('offer') || null;
    const rawDays  = parseInt(params.get('days') || '30', 10);
    const days     = Math.min(Math.max(rawDays || 30, 1), 365);
    const since    = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    try {
        const sql = neon(process.env.KL_DATABASE_URL);
        function normalizeText(value) {
            return typeof value === 'string' ? value.trim() : '';
        }

        function moneyCents(value) {
            const num = parseInt(value, 10);
            return Number.isFinite(num) ? num : 0;
        }

        function isMatch(row) {
            const rowPartner = normalizeText(row.referral_partner);
            const rowOffer = normalizeText(row.referral_offer);
            if (partner && rowPartner !== partner) return false;
            if (offer && rowOffer !== offer) return false;
            return true;
        }

        function initBucket(labelKey) {
            return {
                [labelKey]: '',
                pageviews: 0,
                form_submits: 0,
                checkout_starts: 0,
                payments_completed: 0,
                gross_revenue_cents: 0,
                payout_outstanding_cents: 0,
                payout_paid_cents: 0,
                first_seen: null,
                last_seen: null
            };
        }

        function updateSeen(bucket, createdAt) {
            if (!createdAt) return;
            if (!bucket.first_seen || createdAt < bucket.first_seen) bucket.first_seen = createdAt;
            if (!bucket.last_seen || createdAt > bucket.last_seen) bucket.last_seen = createdAt;
        }

        let eventRows;
        if (partner && offer) {
            eventRows = await sql`
                SELECT
                    id,
                    event_type,
                    referral_partner,
                    referral_offer,
                    amount_cents,
                    package_name,
                    page_path,
                    session_id,
                    created_at
                FROM kl_referral_events
                WHERE created_at >= ${since}
                  AND referral_partner = ${partner}
                  AND referral_offer = ${offer}
                ORDER BY created_at DESC
            `;
        } else if (partner) {
            eventRows = await sql`
                SELECT
                    id,
                    event_type,
                    referral_partner,
                    referral_offer,
                    amount_cents,
                    package_name,
                    page_path,
                    session_id,
                    created_at
                FROM kl_referral_events
                WHERE created_at >= ${since}
                  AND referral_partner = ${partner}
                ORDER BY created_at DESC
            `;
        } else if (offer) {
            eventRows = await sql`
                SELECT
                    id,
                    event_type,
                    referral_partner,
                    referral_offer,
                    amount_cents,
                    package_name,
                    page_path,
                    session_id,
                    created_at
                FROM kl_referral_events
                WHERE created_at >= ${since}
                  AND referral_offer = ${offer}
                ORDER BY created_at DESC
            `;
        } else {
            eventRows = await sql`
                SELECT
                    id,
                    event_type,
                    referral_partner,
                    referral_offer,
                    amount_cents,
                    package_name,
                    page_path,
                    session_id,
                    created_at
                FROM kl_referral_events
                WHERE created_at >= ${since}
                ORDER BY created_at DESC
            `;
        }

        let payoutRows;
        if (partner && offer) {
            payoutRows = await sql`
                SELECT
                    p.id,
                    p.partner_slug,
                    e.referral_offer,
                    e.package_name,
                    p.gross_amount_cents,
                    p.commission_amount_cents,
                    p.payout_status,
                    p.payout_note,
                    e.created_at AS event_created_at
                FROM kl_referral_payouts p
                JOIN kl_referral_events e ON e.id = p.referral_event_id
                WHERE e.created_at >= ${since}
                  AND e.referral_partner = ${partner}
                  AND e.referral_offer = ${offer}
                ORDER BY e.created_at DESC, p.id DESC
            `;
        } else if (partner) {
            payoutRows = await sql`
                SELECT
                    p.id,
                    p.partner_slug,
                    e.referral_offer,
                    e.package_name,
                    p.gross_amount_cents,
                    p.commission_amount_cents,
                    p.payout_status,
                    p.payout_note,
                    e.created_at AS event_created_at
                FROM kl_referral_payouts p
                JOIN kl_referral_events e ON e.id = p.referral_event_id
                WHERE e.created_at >= ${since}
                  AND e.referral_partner = ${partner}
                ORDER BY e.created_at DESC, p.id DESC
            `;
        } else if (offer) {
            payoutRows = await sql`
                SELECT
                    p.id,
                    p.partner_slug,
                    e.referral_offer,
                    e.package_name,
                    p.gross_amount_cents,
                    p.commission_amount_cents,
                    p.payout_status,
                    p.payout_note,
                    e.created_at AS event_created_at
                FROM kl_referral_payouts p
                JOIN kl_referral_events e ON e.id = p.referral_event_id
                WHERE e.created_at >= ${since}
                  AND e.referral_offer = ${offer}
                ORDER BY e.created_at DESC, p.id DESC
            `;
        } else {
            payoutRows = await sql`
                SELECT
                    p.id,
                    p.partner_slug,
                    e.referral_offer,
                    e.package_name,
                    p.gross_amount_cents,
                    p.commission_amount_cents,
                    p.payout_status,
                    p.payout_note,
                    e.created_at AS event_created_at
                FROM kl_referral_payouts p
                JOIN kl_referral_events e ON e.id = p.referral_event_id
                WHERE e.created_at >= ${since}
                ORDER BY e.created_at DESC, p.id DESC
            `;
        }

        const summary = {
            pageviews: 0,
            form_submits: 0,
            checkout_starts: 0,
            payments_completed: 0,
            paid_revenue_cents: 0,
            payout_outstanding_cents: 0,
            payout_paid_cents: 0,
            unique_sessions: 0,
            unique_partners: 0
        };

        const partnerMap = new Map();
        const offerMap = new Map();
        const sessionSet = new Set();
        const partnerSet = new Set();

        for (const row of eventRows) {
            if (!isMatch(row)) continue;
            const partnerKey = normalizeText(row.referral_partner);
            const offerKey = normalizeText(row.referral_offer);
            const createdAt = row.created_at || null;

            if (row.event_type === 'pageview') summary.pageviews += 1;
            if (row.event_type === 'form_submit') summary.form_submits += 1;
            if (row.event_type === 'checkout_start') summary.checkout_starts += 1;
            if (row.event_type === 'payment_completed') {
                summary.payments_completed += 1;
                summary.paid_revenue_cents += moneyCents(row.amount_cents);
            }

            if (normalizeText(row.session_id)) sessionSet.add(normalizeText(row.session_id));
            if (partnerKey) partnerSet.add(partnerKey);

            if (partnerKey) {
                if (!partnerMap.has(partnerKey)) {
                    partnerMap.set(partnerKey, {
                        referral_partner: partnerKey,
                        pageviews: 0,
                        form_submits: 0,
                        checkout_starts: 0,
                        payments_completed: 0,
                        gross_revenue_cents: 0,
                        payout_outstanding_cents: 0,
                        payout_paid_cents: 0,
                        first_seen: null,
                        last_seen: null
                    });
                }
                const bucket = partnerMap.get(partnerKey);
                if (row.event_type === 'pageview') bucket.pageviews += 1;
                if (row.event_type === 'form_submit') bucket.form_submits += 1;
                if (row.event_type === 'checkout_start') bucket.checkout_starts += 1;
                if (row.event_type === 'payment_completed') {
                    bucket.payments_completed += 1;
                    bucket.gross_revenue_cents += moneyCents(row.amount_cents);
                }
                updateSeen(bucket, createdAt);
            }

            if (offerKey) {
                if (!offerMap.has(offerKey)) {
                    offerMap.set(offerKey, {
                        referral_offer: offerKey,
                        pageviews: 0,
                        form_submits: 0,
                        checkout_starts: 0,
                        payments_completed: 0,
                        gross_revenue_cents: 0,
                        first_seen: null,
                        last_seen: null
                    });
                }
                const bucket = offerMap.get(offerKey);
                if (row.event_type === 'pageview') bucket.pageviews += 1;
                if (row.event_type === 'form_submit') bucket.form_submits += 1;
                if (row.event_type === 'checkout_start') bucket.checkout_starts += 1;
                if (row.event_type === 'payment_completed') {
                    bucket.payments_completed += 1;
                    bucket.gross_revenue_cents += moneyCents(row.amount_cents);
                }
                updateSeen(bucket, createdAt);
            }
        }

        for (const row of payoutRows) {
            if (!isMatch(row)) continue;
            const partnerKey = normalizeText(row.partner_slug);
            const amount = moneyCents(row.commission_amount_cents);
            if (row.payout_status === 'owed' || row.payout_status === 'pending_review') summary.payout_outstanding_cents += amount;
            if (row.payout_status === 'paid') summary.payout_paid_cents += amount;

            if (partnerKey && partnerMap.has(partnerKey)) {
                const bucket = partnerMap.get(partnerKey);
                if (row.payout_status === 'owed' || row.payout_status === 'pending_review') bucket.payout_outstanding_cents += amount;
                if (row.payout_status === 'paid') bucket.payout_paid_cents += amount;
            }
        }

        summary.unique_sessions = sessionSet.size;
        summary.unique_partners = partnerSet.size;

        const byPartner = Array.from(partnerMap.values()).sort(function (a, b) {
            const aTime = a.last_seen ? new Date(a.last_seen).getTime() : 0;
            const bTime = b.last_seen ? new Date(b.last_seen).getTime() : 0;
            return bTime - aTime || a.referral_partner.localeCompare(b.referral_partner);
        });

        const byOffer = Array.from(offerMap.values()).sort(function (a, b) {
            const aTime = a.last_seen ? new Date(a.last_seen).getTime() : 0;
            const bTime = b.last_seen ? new Date(b.last_seen).getTime() : 0;
            return bTime - aTime || a.referral_offer.localeCompare(b.referral_offer);
        });

        const recent = eventRows
            .filter(isMatch)
            .slice(0, 100)
            .map(function (row) {
                return {
                    event_type: row.event_type,
                    referral_partner: normalizeText(row.referral_partner),
                    referral_offer: normalizeText(row.referral_offer),
                    package_name: normalizeText(row.package_name),
                    amount_cents: moneyCents(row.amount_cents),
                    page_path: normalizeText(row.page_path),
                    created_at: row.created_at
                };
            });

        await ensurePartnerTermsTable(sql);

        let partnerTerms;
        if (partner) {
            partnerTerms = await sql`
                SELECT
                    partner_slug,
                    partner_name,
                    latest_offer,
                    commission_percent,
                    is_active,
                    notes,
                    created_at,
                    updated_at
                FROM kl_referral_partner_terms
                WHERE partner_slug = ${partner}
                ORDER BY partner_slug ASC
            `;
        } else {
            partnerTerms = await sql`
                SELECT
                    partner_slug,
                    partner_name,
                    latest_offer,
                    commission_percent,
                    is_active,
                    notes,
                    created_at,
                    updated_at
                FROM kl_referral_partner_terms
                ORDER BY partner_slug ASC
            `;
        }

        const allPartnerTerms = partner
            ? await sql`
                SELECT
                    partner_slug,
                    partner_name,
                    latest_offer,
                    commission_percent,
                    is_active,
                    notes,
                    created_at,
                    updated_at
                FROM kl_referral_partner_terms
                ORDER BY partner_slug ASC
            `
            : partnerTerms;

        const payoutQueue = payoutRows
            .filter(isMatch)
            .sort(function (a, b) {
                const statusA = normalizeText(a.payout_status) === 'paid' ? 1 : 0;
                const statusB = normalizeText(b.payout_status) === 'paid' ? 1 : 0;
                const aTime = a.event_created_at ? new Date(a.event_created_at).getTime() : 0;
                const bTime = b.event_created_at ? new Date(b.event_created_at).getTime() : 0;
                return statusA - statusB || bTime - aTime || Number(b.id || 0) - Number(a.id || 0);
            })
            .map(function (row) {
                return {
                    id: row.id,
                    partner_slug: normalizeText(row.partner_slug),
                    referral_offer: normalizeText(row.referral_offer),
                    package_name: normalizeText(row.package_name),
                    gross_amount_cents: moneyCents(row.gross_amount_cents),
                    commission_amount_cents: moneyCents(row.commission_amount_cents),
                    payout_status: normalizeText(row.payout_status),
                    payout_method: normalizeText(row.payout_note),
                    payout_reference: '',
                    event_created_at: row.event_created_at
                };
            });

        return json(200, {
            summary,
            byPartner,
            byOffer,
            recent,
            partnerTerms: partnerTerms || [],
            partnerRoster: mergeReferralPartners(allPartnerTerms || [], { includeInactive: true }),
            payoutQueue,
            filter: { partner, offer, days, since },
            generatedAt: new Date().toISOString()
        });
    } catch (err) {
        console.error('[referral-stats] DB error:', err && err.message);
        return json(500, { error: 'Failed to query referral data.' });
    }
};
