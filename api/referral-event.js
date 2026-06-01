/**
 * api/referral-event.js
 * Vercel Serverless Function — logs a referral attribution event to Neon Postgres.
 *
 * POST /api/referral-event
 * Body (JSON):
 *   {
 *     eventType:        string,   // 'pageview' | 'form_submit' | 'checkout_start' | 'payment_completed'
 *     referralPartner:  string,   // ?ref= value
 *     referralOffer:    string,   // ?offer= value
 *     utmMedium:        string,
 *     utmCampaign:      string,
 *     firstUrl:         string,
 *     pagePath:         string,
 *     contactEmail:     string,   // optional — from form events
 *     contactName:      string,   // optional
 *     packageName:      string,   // optional — from checkout events
 *     amountCents:      number,   // optional
 *     eventSource:      string,   // optional — starter_package | invoice_payment | formspree | website
 *     externalEventId:  string,   // optional — Stripe session ID or other dedupe key
 *     sessionId:        string,   // client random ID, for dedup
 *   }
 *
 * If KL_DATABASE_URL is not set, the function returns 200 with { skipped: true }
 * so the site never breaks before the DB is wired up.
 */

'use strict';

const { neon } = require('@neondatabase/serverless');
const crypto = require('crypto');
const {
    isStaticApprovedPayoutAttribution,
    normalizeOffer,
    normalizeSlug
} = require('./referral-roster');

const ALLOWED_EVENT_TYPES = new Set(['pageview', 'form_submit', 'checkout_start', 'payment_completed', 'referral_contact_submit']);

const ALLOWED_ORIGINS = new Set([
    'https://knightlogics.com',
    'https://www.knightlogics.com'
]);

function normStr(val, maxLen) {
    if (!val || typeof val !== 'string') return null;
    return val.replace(/[<>"']/g, '').trim().slice(0, maxLen) || null;
}

function normInt(val) {
    const n = parseInt(val, 10);
    return Number.isFinite(n) && n >= 0 ? n : null;
}

function getBountyForAmount(grossAmountCents) {
    if (!grossAmountCents || grossAmountCents < 100) {
        return null;
    }

    if (grossAmountCents < 50000) {
        const payout = Math.round(grossAmountCents * 0.10);
        return { payoutAmountCents: payout, tierLabel: '<$500 => 10%' };
    }

    if (grossAmountCents <= 99999) {
        return { payoutAmountCents: 5000, tierLabel: '$500-$999 => $50' };
    }

    if (grossAmountCents <= 199999) {
        return { payoutAmountCents: 15000, tierLabel: '$1,000-$1,999 => $150' };
    }

    if (grossAmountCents <= 499999) {
        return { payoutAmountCents: 25000, tierLabel: '$2,000-$4,999 => $250' };
    }

    return { payoutAmountCents: 50000, tierLabel: '$5,000+ => $500' };
}

function hashIp(ip) {
    if (!ip) return null;
    return crypto.createHash('sha256').update(ip + (process.env.KL_IP_SALT || 'kl2026')).digest('hex').slice(0, 16);
}

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

async function isApprovedPayoutAttribution(sql, partnerSlug, offerCode) {
    if (!partnerSlug) return false;
    const normalizedSlug = normalizeSlug(partnerSlug);
    const normalizedOffer = normalizeOffer(offerCode);
    if (!normalizedSlug) return false;

    try {
        await ensurePartnerTermsTable(sql);
        const [partner] = await sql`
            SELECT latest_offer, is_active
            FROM kl_referral_partner_terms
            WHERE partner_slug = ${normalizedSlug}
            LIMIT 1
        `;
        if (partner) {
            if (partner.is_active === false) return false;
            const expectedOffer = normalizeOffer(partner.latest_offer || '');
            return !expectedOffer || !normalizedOffer || expectedOffer === normalizedOffer;
        }
    } catch (error) {
        console.error('[referral-event] Partner approval lookup failed:', error && error.message);
    }

    return isStaticApprovedPayoutAttribution(partnerSlug, offerCode);
}

function getCorsHeaders(origin) {
    const allowed = ALLOWED_ORIGINS.has(origin) ? origin : null;
    return {
        'Access-Control-Allow-Origin': allowed || 'https://knightlogics.com',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
    };
}

async function readRawBody(req) {
    if (Buffer.isBuffer(req.rawBody)) return req.rawBody.toString('utf8');
    if (typeof req.rawBody === 'string') return req.rawBody;
    if (typeof req.body === 'string') return req.body;
    if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
        return JSON.stringify(req.body);
    }

    const chunks = [];
    for await (const chunk of req) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString('utf8');
}

module.exports = async function handler(req, res) {
    const origin = req.headers.origin || '';
    const corsHeaders = getCorsHeaders(origin);

    if (req.method === 'OPTIONS') {
        res.writeHead(204, corsHeaders);
        return res.end();
    }

    if (req.method !== 'POST') {
        res.writeHead(405, { ...corsHeaders, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Method not allowed.' }));
    }

    /* Graceful no-op if DB not yet configured */
    if (!process.env.KL_DATABASE_URL) {
        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ skipped: true, reason: 'DB not configured.' }));
    }

    let body;
    try {
        const rawBody = await readRawBody(req);
        body = rawBody ? JSON.parse(rawBody) : {};
    } catch (_) {
        body = {};
    }

    const eventType = normStr(body.eventType, 40);
    if (!eventType || !ALLOWED_EVENT_TYPES.has(eventType)) {
        res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid event type.' }));
    }

    /* Require at least one attribution signal */
    const referralPartner = normalizeSlug(normStr(body.referralPartner, 80) || '');
    const referralOffer   = normalizeOffer(normStr(body.referralOffer, 80) || '');
    if (!referralPartner && !referralOffer) {
        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ skipped: true, reason: 'No attribution signal.' }));
    }

    const utmMedium   = normStr(body.utmMedium,   80);
    const utmCampaign = normStr(body.utmCampaign, 80);
    const firstUrl    = normStr(body.firstUrl,    300);
    const pagePath    = normStr(body.pagePath,    300);
    const email       = normStr(body.contactEmail, 160);
    const name        = normStr(body.contactName,  120);
    const pkgName     = normStr(body.packageName,  120);
    const amountCents = normInt(body.amountCents);
    const eventSource = normStr(body.eventSource, 40);
    const externalEventId = normStr(body.externalEventId, 160);
    const sessionId   = normStr(body.sessionId,    64);

    const ip = req.headers['x-forwarded-for']
        ? String(req.headers['x-forwarded-for']).split(',')[0].trim()
        : (req.socket && req.socket.remoteAddress) || null;
    const ipHash = hashIp(ip);

    const rawUa = req.headers['user-agent'] || '';
    const uaShort = rawUa.slice(0, 120) || null;

    try {
        const sql = neon(process.env.KL_DATABASE_URL);

        const inserted = await sql`
            INSERT INTO kl_referral_events
                (event_type, referral_partner, referral_offer, utm_medium, utm_campaign,
                 first_url, page_path, contact_email, contact_name, package_name,
                 amount_cents, event_source, external_event_id, session_id, ip_hash, user_agent_short)
            VALUES
                (${eventType}, ${referralPartner}, ${referralOffer}, ${utmMedium}, ${utmCampaign},
                 ${firstUrl}, ${pagePath}, ${email}, ${name}, ${pkgName},
                 ${amountCents}, ${eventSource}, ${externalEventId}, ${sessionId}, ${ipHash}, ${uaShort})
            ON CONFLICT (external_event_id) DO NOTHING
            RETURNING id
        `;

        if (
            inserted.length &&
            eventType === 'payment_completed' &&
            await isApprovedPayoutAttribution(sql, referralPartner, referralOffer)
        ) {
            const bounty = getBountyForAmount(amountCents || 0);
            if (bounty) {
                await sql`
                    INSERT INTO kl_referral_payouts
                        (referral_event_id, partner_slug, gross_amount_cents, commission_percent, commission_amount_cents, payout_status, payout_note)
                    VALUES
                        (${inserted[0].id}, ${referralPartner}, ${amountCents}, 0, ${bounty.payoutAmountCents}, 'pending_review', ${'Flat bounty tier: ' + bounty.tierLabel + ' - pending admin review'})
                    ON CONFLICT (referral_event_id) DO NOTHING
                `;
            }
        }

        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ ok: true, duplicate: !inserted.length }));
    } catch (err) {
        console.error('[referral-event] DB error:', err && err.message);
        /* Return 200 to avoid breaking client-side code */
        res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ skipped: true, reason: 'DB write failed.' }));
    }
};
