'use strict';

const Stripe = require('stripe');

const DEFAULT_ALLOWED_ORIGINS = new Set([
    'https://knightlogics.com',
    'https://www.knightlogics.com',
    'http://127.0.0.1:4180',
    'http://localhost:4180'
]);

const LOCAL_DEV_ORIGIN_PATTERN = /^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/;
const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT || 'https://formspree.io/f/xnnggyzp';
const MAX_JSON_BODY_BYTES = 16 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const MIN_AMOUNT_CENTS = 100;     // $1.00 minimum
const MAX_AMOUNT_CENTS = 5000000; // $50,000.00 maximum
const INVOICE_NUMBER_PATTERN = /^[A-Za-z0-9\-_.#/]{1,60}$/;

const requestBuckets = new Map();

function createHttpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function sendJson(res, statusCode, payload) {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.end(JSON.stringify(payload));
}

function sendEmpty(res, statusCode) {
    res.statusCode = statusCode;
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.end();
}

function getClientIp(req) {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.trim()) {
        return forwarded.split(',')[0].trim();
    }
    return (req.socket && req.socket.remoteAddress) ? req.socket.remoteAddress : 'unknown';
}

function getRateLimitState(ip) {
    const now = Date.now();
    const existing = requestBuckets.get(ip);

    if (!existing || now > existing.resetAt) {
        requestBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return { limited: false };
    }

    existing.count += 1;

    if (existing.count > RATE_LIMIT_MAX_REQUESTS) {
        return { limited: true, remainingMs: Math.max(0, existing.resetAt - now) };
    }

    if (requestBuckets.size > 5000) {
        for (const [bucketIp, bucket] of requestBuckets) {
            if (now > bucket.resetAt) requestBuckets.delete(bucketIp);
        }
    }

    return { limited: false };
}

function getAllowedOrigins() {
    const configured = (process.env.CHECKOUT_ALLOWED_ORIGINS || '')
        .split(',').map(o => o.trim()).filter(Boolean);
    return new Set([...DEFAULT_ALLOWED_ORIGINS, ...configured]);
}

function getAllowedOrigin(req) {
    const requestOrigin = req.headers.origin;
    if (!requestOrigin) return null;
    const allowed = getAllowedOrigins();
    return (allowed.has(requestOrigin) || LOCAL_DEV_ORIGIN_PATTERN.test(requestOrigin))
        ? requestOrigin : false;
}

function applyCorsHeaders(res, allowedOrigin) {
    if (!allowedOrigin) return;
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Vary', 'Origin');
}

function getBaseUrl(req) {
    const forwardedProto = (req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
    const forwardedHost = (req.headers['x-forwarded-host'] || '').split(',')[0].trim();
    const host = forwardedHost || req.headers.host;
    const isLocalHost = host && /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host);
    const proto = forwardedProto || (isLocalHost ? 'http' : 'https');
    return `${proto}://${host}`;
}

function normalizeSingleLine(value, maxLength) {
    if (typeof value !== 'string') return '';
    return value.trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function readRawBody(req) {
    if (Buffer.isBuffer(req.rawBody)) return req.rawBody;
    if (typeof req.rawBody === 'string') return Buffer.from(req.rawBody);
    if (req.rawBody instanceof Uint8Array) return Buffer.from(req.rawBody);

    const chunks = [];
    let totalBytes = 0;

    for await (const chunk of req) {
        const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        totalBytes += buf.length;
        if (totalBytes > MAX_JSON_BODY_BYTES) {
            throw createHttpError(413, 'Request body too large.');
        }
        chunks.push(buf);
    }

    return Buffer.concat(chunks);
}

async function parseJsonBody(req) {
    const rawBody = await readRawBody(req);
    if (!rawBody.length) throw createHttpError(400, 'Request body is required.');
    try {
        return JSON.parse(rawBody.toString('utf8'));
    } catch {
        throw createHttpError(400, 'Invalid JSON body.');
    }
}

async function sendReferralEvent(apiBase, payload) {
    if (!apiBase || !payload) {
        return;
    }

    try {
        await fetch(`${apiBase.replace(/\/$/, '')}/api/referral-event`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(() => {});
    } catch (_) {}
}

module.exports = async function handler(req, res) {
    const allowedOrigin = getAllowedOrigin(req);

    if (allowedOrigin === false) {
        return sendJson(res, 403, { error: 'Origin not allowed.' });
    }

    applyCorsHeaders(res, allowedOrigin);

    if (req.method === 'OPTIONS') {
        res.setHeader('Allow', 'POST, OPTIONS');
        return sendEmpty(res, 204);
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST, OPTIONS');
        return sendJson(res, 405, { error: 'Method not allowed.' });
    }

    const rateState = getRateLimitState(getClientIp(req));

    if (rateState.limited) {
        const retryAfter = Math.max(1, Math.ceil(rateState.remainingMs / 1000));
        res.setHeader('Retry-After', String(retryAfter));
        return sendJson(res, 429, { error: 'Too many payment attempts. Please wait and try again.' });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;

    if (!stripeSecretKey) {
        return sendJson(res, 500, { error: 'Payment system is not configured on this deployment.' });
    }

    const contentType = req.headers['content-type'] || '';

    if (!/application\/json/i.test(contentType)) {
        return sendJson(res, 400, { error: 'Send payment details as JSON.' });
    }

    let body;

    try {
        body = await parseJsonBody(req);
    } catch (err) {
        return sendJson(res, err.statusCode || 400, { error: err.message });
    }

    // Extract and validate fields
    const invoiceNumber = normalizeSingleLine(body.invoiceNumber, 60);
    const clientName    = normalizeSingleLine(body.clientName, 120);
    const clientEmail   = normalizeSingleLine(body.clientEmail, 160);
    const clientPhone   = normalizeSingleLine(body.clientPhone || '', 40);
    const description   = normalizeSingleLine(body.description || '', 500);
    const amountCents   = body.amountCents;
    const referralPartner = normalizeSingleLine(body.referralPartner || body.kl_ref || '', 80);
    const referralOffer = normalizeSingleLine(body.referralOffer || body.kl_offer || '', 80);
    const utmMedium = normalizeSingleLine(body.utmMedium || body.kl_utm_medium || '', 80);
    const utmCampaign = normalizeSingleLine(body.utmCampaign || body.kl_utm_campaign || '', 80);
    const utmFirstUrl = normalizeSingleLine(body.utmFirstUrl || body.kl_first_url || '', 300);
    const referralSessionId = normalizeSingleLine(body.sessionId || body.kl_session_id || '', 64);

    if (invoiceNumber && !INVOICE_NUMBER_PATTERN.test(invoiceNumber)) {
        return sendJson(res, 400, { error: 'Invoice number contains invalid characters. Use letters, numbers, dashes, dots, or slashes only.' });
    }

    if (!clientName) {
        return sendJson(res, 400, { error: 'Your full name is required.' });
    }

    if (!clientEmail || !isValidEmail(clientEmail)) {
        return sendJson(res, 400, { error: 'A valid email address is required.' });
    }

    if (!Number.isInteger(amountCents) || amountCents < MIN_AMOUNT_CENTS || amountCents > MAX_AMOUNT_CENTS) {
        return sendJson(res, 400, { error: 'Payment amount must be between $1.00 and $50,000.00.' });
    }

    const baseUrl = getBaseUrl(req);
    const safeInvoice = invoiceNumber ? encodeURIComponent(invoiceNumber) : '';
    const amountDisplay = `$${(amountCents / 100).toFixed(2)}`;
    const lineItemName = invoiceNumber ? `Invoice #${invoiceNumber} — Knight Logics` : 'Invoice Payment — Knight Logics';
    const lineItemDescription = description
        ? description.slice(0, 500)
        : invoiceNumber
            ? `Payment for services rendered by Knight Logics. Invoice: ${invoiceNumber}`
            : 'Payment for services rendered by Knight Logics.';
    const checkoutMetadata = {
        paymentType: 'invoice_payment',
        invoiceNumber,
        clientName,
        clientEmail,
        clientPhone: clientPhone || 'Not provided',
        invoiceDescription: (description || 'Invoice payment').slice(0, 200),
        amountDisplay
    };
    const paymentIntentMetadata = {
        paymentType: 'invoice_payment',
        invoiceNumber,
        clientName,
        clientEmail,
        amountDisplay
    };

    if (referralPartner) {
        checkoutMetadata.referralPartner = referralPartner;
        paymentIntentMetadata.referralPartner = referralPartner;
    }
    if (referralOffer) {
        checkoutMetadata.referralOffer = referralOffer;
        paymentIntentMetadata.referralOffer = referralOffer;
    }
    if (utmMedium) {
        checkoutMetadata.utmMedium = utmMedium;
        paymentIntentMetadata.utmMedium = utmMedium;
    }
    if (utmCampaign) {
        checkoutMetadata.utmCampaign = utmCampaign;
        paymentIntentMetadata.utmCampaign = utmCampaign;
    }
    if (utmFirstUrl) {
        checkoutMetadata.utmFirstUrl = utmFirstUrl;
        paymentIntentMetadata.utmFirstUrl = utmFirstUrl;
    }
    if (referralSessionId) {
        checkoutMetadata.referralSessionId = referralSessionId;
        paymentIntentMetadata.referralSessionId = referralSessionId;
    }

    let session;

    try {
        const stripe = new Stripe(stripeSecretKey, { apiVersion: '2024-06-20' });

        session = await stripe.checkout.sessions.create({
            mode: 'payment',
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: lineItemName,
                        description: lineItemDescription
                    },
                    unit_amount: amountCents
                },
                quantity: 1
            }],
            customer_email: clientEmail,
            metadata: checkoutMetadata,
            payment_intent_data: {
                metadata: paymentIntentMetadata,
                description: lineItemName
            },
            success_url: `${baseUrl}/pay-invoice?payment=success${safeInvoice ? `&invoice=${safeInvoice}` : ''}&amount=${encodeURIComponent(amountDisplay)}`,
            cancel_url: `${baseUrl}/pay-invoice?payment=cancelled`
        });
    } catch (err) {
        console.error('[pay-invoice] Stripe session creation failed:', err.message);
        return sendJson(res, 500, {
            error: 'Unable to create payment session. Please try again or contact support@knightlogics.com.'
        });
    }

    if (referralPartner || referralOffer) {
        await sendReferralEvent(baseUrl, {
            eventType: 'checkout_start',
            referralPartner,
            referralOffer,
            utmMedium,
            utmCampaign,
            firstUrl: utmFirstUrl,
            pagePath: '/pay-invoice',
            contactEmail: clientEmail,
            contactName: clientName,
            packageName: 'invoice_payment',
            amountCents,
            sessionId: referralSessionId,
            eventSource: 'invoice_payment',
            externalEventId: `invoice_checkout_start:${session.id}`
        });
    }

    // Formspree notification — fire-and-forget, never block the Stripe redirect
    const isLocal = allowedOrigin && LOCAL_DEV_ORIGIN_PATTERN.test(allowedOrigin);

    if (FORMSPREE_ENDPOINT && !isLocal) {
        fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
                _subject: `Invoice Payment Started: ${invoiceNumber}`,
                _replyto: clientEmail,
                serviceType: 'Invoice Payment — Stripe Checkout Initiated',
                invoiceNumber,
                clientName,
                clientEmail,
                clientPhone: clientPhone || 'Not provided',
                amountDisplay,
                description: description || 'Not provided',
                notes: 'Client was redirected to Stripe Checkout. Stripe will send a payment confirmation email automatically.'
            })
        }).catch(e => console.warn('[pay-invoice] Formspree notification failed:', e.message));
    }

    return sendJson(res, 200, { url: session.url });
};
