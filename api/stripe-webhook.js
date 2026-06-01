'use strict';

const Stripe = require('stripe');
const { neon } = require('@neondatabase/serverless');
const {
    isStaticApprovedPayoutAttribution,
    normalizeOffer,
    normalizeSlug
} = require('./referral-roster');

const HANDLED_EVENT_TYPES = new Set([
    'checkout.session.completed',
    'checkout.session.async_payment_succeeded'
]);


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

function normStr(value, maxLength) {
    if (typeof value !== 'string') return null;
    const normalized = value.replace(/[<>"']/g, '').trim().slice(0, maxLength);
    return normalized || null;
}

function normInt(value) {
    const num = parseInt(value, 10);
    return Number.isFinite(num) ? num : null;
}

function getBountyForAmount(grossAmountCents) {
    if (!grossAmountCents || grossAmountCents < 100) {
        return null;
    }

    // Special: for test/small sales under $500, pay 10% bounty
    if (grossAmountCents < 50000) {
        const pct = 0.10;
        const payout = Math.round(grossAmountCents * pct);
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
        console.error('[stripe-webhook] Partner approval lookup failed:', error && error.message);
    }

    return isStaticApprovedPayoutAttribution(partnerSlug, offerCode);
}

async function ensurePayout(sql, referralEventId, partnerSlug, offerCode, grossAmountCents, contactEmail) {
    if (!referralEventId || !partnerSlug || !grossAmountCents || grossAmountCents <= 0 || !contactEmail) {
        return;
    }

    if (!await isApprovedPayoutAttribution(sql, partnerSlug, offerCode)) {
        return;
    }

    const [alreadyQualified] = await sql`
        SELECT id
        FROM kl_referral_events
        WHERE event_type = 'payment_completed'
          AND referral_partner = ${partnerSlug}
          AND contact_email = ${contactEmail}
          AND id <> ${referralEventId}
        LIMIT 1
    `;

    if (alreadyQualified) {
        return;
    }

    const bounty = getBountyForAmount(grossAmountCents);
    if (!bounty) {
        return;
    }

    await sql`
        INSERT INTO kl_referral_payouts
            (referral_event_id, partner_slug, gross_amount_cents, commission_percent, commission_amount_cents, payout_status, payout_note)
        VALUES
            (${referralEventId}, ${partnerSlug}, ${grossAmountCents}, 0, ${bounty.payoutAmountCents}, 'pending_review', ${'Flat bounty tier: ' + bounty.tierLabel + ' - pending admin review'})
        ON CONFLICT (referral_event_id) DO NOTHING
    `;
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return sendJson(res, 405, { error: 'Method not allowed.' });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const databaseUrl = process.env.KL_DATABASE_URL;

    if (!stripeSecretKey || !webhookSecret || !databaseUrl) {
        return sendJson(res, 503, { error: 'Stripe webhook is not configured.' });
    }

    const signature = req.headers['stripe-signature'];
    if (!signature) {
        return sendJson(res, 400, { error: 'Missing Stripe signature.' });
    }

    let event;
    try {
        const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-03-31.basil' });
        const rawBody = await readRawBody(req);
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (error) {
        console.error('[stripe-webhook] Signature verification failed:', error && error.message);
        return sendJson(res, 400, { error: 'Invalid Stripe signature.' });
    }

    if (!HANDLED_EVENT_TYPES.has(event.type)) {
        return sendJson(res, 200, { received: true, ignored: true });
    }

    const session = event.data && event.data.object ? event.data.object : null;
    const metadata = session && session.metadata ? session.metadata : {};

    if (!session) {
        return sendJson(res, 200, { received: true, skipped: true, reason: 'No checkout session payload.' });
    }

    if (event.type === 'checkout.session.completed' && session.payment_status !== 'paid') {
        return sendJson(res, 200, {
            received: true,
            skipped: true,
            reason: 'Checkout completed before payment settled.'
        });
    }

    const referralPartner = normalizeSlug(normStr(metadata.referralPartner, 80) || '');
    const referralOffer = normalizeOffer(normStr(metadata.referralOffer, 80) || '');

    if (!referralPartner && !referralOffer) {
        return sendJson(res, 200, { received: true, skipped: true, reason: 'No attribution metadata.' });
    }

    const amountCents = normInt(session.amount_total) || 0;
    const paymentType = metadata.paymentType === 'invoice_payment' ? 'invoice_payment' : 'starter_package';
    const packageName = normStr(
        metadata.packageKey || metadata.packageName || (paymentType === 'invoice_payment'
            ? 'invoice:' + (metadata.invoiceNumber || 'payment')
            : 'starter_checkout'),
        120
    );
    const contactEmail = normStr(
        (session.customer_details && session.customer_details.email) ||
        metadata.intakeEmail ||
        metadata.clientEmail ||
        session.customer_email ||
        '',
        160
    );
    const contactName = normStr(
        (session.customer_details && session.customer_details.name) ||
        metadata.contactName ||
        metadata.clientName ||
        '',
        120
    );
    const utmMedium = normStr(metadata.utmMedium, 80);
    const utmCampaign = normStr(metadata.utmCampaign, 80);
    const firstUrl = normStr(metadata.utmFirstUrl, 300);
    const sessionId = normStr(metadata.referralSessionId, 64);
    const externalEventId = normStr(session.id, 160);
    const pagePath = paymentType === 'invoice_payment' ? '/pay-invoice' : '/pricing';

    try {
        const sql = neon(databaseUrl);

        const inserted = await sql`
            INSERT INTO kl_referral_events
                (event_type, referral_partner, referral_offer, utm_medium, utm_campaign,
                 first_url, page_path, contact_email, contact_name, package_name,
                 amount_cents, event_source, external_event_id, session_id)
            VALUES
                ('payment_completed', ${referralPartner}, ${referralOffer}, ${utmMedium}, ${utmCampaign},
                 ${firstUrl}, ${pagePath}, ${contactEmail}, ${contactName}, ${packageName},
                 ${amountCents}, ${paymentType}, ${externalEventId}, ${sessionId})
            ON CONFLICT (external_event_id) DO NOTHING
            RETURNING id
        `;

        let referralEventId = inserted.length ? inserted[0].id : null;
        if (!referralEventId && externalEventId) {
            const [existing] = await sql`
                SELECT id
                FROM kl_referral_events
                WHERE external_event_id = ${externalEventId}
                LIMIT 1
            `;
            referralEventId = existing ? existing.id : null;
        }

        await ensurePayout(sql, referralEventId, referralPartner, referralOffer, amountCents, contactEmail);

        return sendJson(res, 200, { received: true, ok: true });
    } catch (error) {
        console.error('[stripe-webhook] DB write failed:', error && error.message);
        return sendJson(res, 500, { error: 'Failed to record Stripe payment.' });
    }
};
