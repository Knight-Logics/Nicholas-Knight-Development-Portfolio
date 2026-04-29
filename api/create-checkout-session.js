const Stripe = require('stripe');

const DEFAULT_ALLOWED_ORIGINS = new Set([
    'https://knightlogics.com',
    'https://www.knightlogics.com',
    'http://127.0.0.1:4180',
    'http://localhost:4180'
]);

const LOCAL_DEV_ORIGIN_PATTERN = /^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/;
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xnnggyzp';
const VALID_PREFERRED_CONTACTS = new Set(['email', 'phone', 'text']);

const PACKAGE_DEFINITIONS = {
    'website-local-seo-starter': {
        mode: 'payment',
        name: 'Website + Local SEO Starter Package',
        description: 'Hand-coded website build or rebuild with technical SEO, Search Console setup, and Google Business Profile alignment.',
        amount: 199700,
        currency: 'usd',
        priceDisplay: '$1,997',
        metadata: {
            packageType: 'website_local_seo_starter',
            fulfillment: 'project'
        }
    },
    'gbp-optimization': {
        mode: 'payment',
        name: 'Google Business Profile Optimization',
        description: 'One-time Google Business Profile cleanup with positioning, category tuning, and conversion-path improvements.',
        amount: 29700,
        currency: 'usd',
        priceDisplay: '$297',
        metadata: {
            packageType: 'gbp_optimization',
            fulfillment: 'service'
        }
    },
    'monthly-local-seo-starter': {
        mode: 'subscription',
        name: 'Monthly Local SEO Starter',
        description: 'Monthly local SEO support with website and GBP alignment checks plus ongoing cleanup and tuning.',
        amount: 39700,
        currency: 'usd',
        priceDisplay: '$397 / month',
        recurring: {
            interval: 'month'
        },
        metadata: {
            packageType: 'monthly_local_seo_starter',
            fulfillment: 'subscription'
        }
    }
};

function getBaseUrl(req) {
    const forwardedProto = (req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
    const forwardedHost = (req.headers['x-forwarded-host'] || '').split(',')[0].trim();
    const host = forwardedHost || req.headers.host;
    const isLocalHost = host && /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host);
    const proto = forwardedProto || (isLocalHost ? 'http' : 'https');

    return `${proto}://${host}`;
}

function getAllowedOrigins() {
    const configuredOrigins = (process.env.CHECKOUT_ALLOWED_ORIGINS || '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

    return new Set([...DEFAULT_ALLOWED_ORIGINS, ...configuredOrigins]);
}

function getAllowedOrigin(req) {
    const requestOrigin = req.headers.origin;

    if (!requestOrigin) {
        return null;
    }

    return getAllowedOrigins().has(requestOrigin) || LOCAL_DEV_ORIGIN_PATTERN.test(requestOrigin)
        ? requestOrigin
        : false;
}

function applyCorsHeaders(req, res, allowedOrigin) {
    if (!allowedOrigin) {
        return;
    }

    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Vary', 'Origin');
}

function buildLineItem(packageDefinition) {
    const priceData = {
        currency: packageDefinition.currency,
        product_data: {
            name: packageDefinition.name,
            description: packageDefinition.description
        },
        unit_amount: packageDefinition.amount
    };

    if (packageDefinition.mode === 'subscription') {
        priceData.recurring = packageDefinition.recurring;
    }

    return {
        price_data: priceData,
        quantity: 1
    };
}

function normalizeSingleLine(value, maxLength) {
    if (typeof value !== 'string') {
        return '';
    }

    return value.trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

function normalizeMultiLine(value, maxLength) {
    if (typeof value !== 'string') {
        return '';
    }

    return value.trim().replace(/\r\n/g, '\n').replace(/\r/g, '\n').slice(0, maxLength);
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildIntakeDetails(body) {
    const intakeDetails = {
        businessName: normalizeSingleLine(body && body.businessName, 120),
        contactName: normalizeSingleLine(body && body.contactName, 120),
        email: normalizeSingleLine(body && body.email, 160),
        phone: normalizeSingleLine(body && body.phone, 40),
        preferredContact: normalizeSingleLine(body && body.preferredContact, 20).toLowerCase(),
        websiteOrProfile: normalizeSingleLine(body && body.websiteOrProfile, 255),
        projectDetails: normalizeMultiLine(body && body.projectDetails, 1500)
    };

    if (!intakeDetails.businessName || !intakeDetails.contactName || !intakeDetails.email || !intakeDetails.projectDetails) {
        return {
            error: 'Complete the required intake fields before checkout.'
        };
    }

    if (!isValidEmail(intakeDetails.email)) {
        return {
            error: 'Enter a valid email address before checkout.'
        };
    }

    if (!VALID_PREFERRED_CONTACTS.has(intakeDetails.preferredContact)) {
        return {
            error: 'Select a preferred contact method before checkout.'
        };
    }

    return {
        intakeDetails
    };
}

function buildCheckoutMetadata(packageKey, packageDefinition, intakeDetails) {
    const metadata = {
        packageKey,
        packageName: packageDefinition.name,
        ...packageDefinition.metadata
    };

    metadata.businessName = intakeDetails.businessName;
    metadata.contactName = intakeDetails.contactName;
    metadata.preferredContact = intakeDetails.preferredContact;
    metadata.intakeEmail = intakeDetails.email;

    if (intakeDetails.phone) {
        metadata.contactPhone = intakeDetails.phone;
    }

    if (intakeDetails.websiteOrProfile) {
        metadata.websiteOrProfile = intakeDetails.websiteOrProfile.slice(0, 200);
    }

    metadata.intakeSummary = intakeDetails.projectDetails.slice(0, 400);

    return metadata;
}

function buildFormspreePayload(packageDefinition, intakeDetails) {
    return {
        businessName: intakeDetails.businessName,
        contactName: intakeDetails.contactName,
        email: intakeDetails.email,
        serviceType: `Starter Package Checkout - ${packageDefinition.name}`,
        timeline: 'Submitted immediately before Stripe checkout',
        budget: packageDefinition.priceDisplay,
        projectDetails: intakeDetails.projectDetails,
        preferredContact: intakeDetails.preferredContact,
        phone: intakeDetails.phone || 'Not provided',
        websiteOrProfile: intakeDetails.websiteOrProfile || 'Not provided',
        packageName: packageDefinition.name,
        packagePrice: packageDefinition.priceDisplay,
        packageBillingMode: packageDefinition.mode,
        additionalDetails: 'Buyer is prompted after payment to send final files, share links, or additional notes through the confirmation-screen handoff form, with support@knightlogics.com as the fallback.',
        _replyto: intakeDetails.email,
        _subject: `Starter Package Intake: ${packageDefinition.name}`
    };
}

async function submitIntakeToFormspree(packageDefinition, intakeDetails) {
    const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(buildFormspreePayload(packageDefinition, intakeDetails))
    });

    if (!response.ok) {
        const error = new Error('Unable to send intake details right now.');
        error.code = 'INTAKE_SUBMISSION_FAILED';
        throw error;
    }
}

module.exports = async function handler(req, res) {
    const allowedOrigin = getAllowedOrigin(req);

    if (allowedOrigin === false) {
        return res.status(403).json({ error: 'Origin not allowed.' });
    }

    applyCorsHeaders(req, res, allowedOrigin);

    if (req.method === 'OPTIONS') {
        res.setHeader('Allow', 'POST, OPTIONS');
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST, OPTIONS');
        return res.status(405).json({ error: 'Method not allowed.' });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;

    if (!stripeSecretKey) {
        return res.status(500).json({ error: 'Stripe is not configured on this deployment.' });
    }

    const packageKey = req.body && req.body.packageKey;
    const packageDefinition = PACKAGE_DEFINITIONS[packageKey];

    if (!packageDefinition) {
        return res.status(400).json({ error: 'Invalid package selected.' });
    }

    const intakeResult = buildIntakeDetails(req.body || {});

    if (intakeResult.error) {
        return res.status(400).json({ error: intakeResult.error, intakeAccepted: false });
    }

    const { intakeDetails } = intakeResult;

    try {
        await submitIntakeToFormspree(packageDefinition, intakeDetails);

        const stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2025-03-31.basil'
        });
        const baseUrl = allowedOrigin || getBaseUrl(req);
        const checkoutMetadata = buildCheckoutMetadata(packageKey, packageDefinition, intakeDetails);

        const sessionParams = {
            mode: packageDefinition.mode,
            line_items: [buildLineItem(packageDefinition)],
            billing_address_collection: 'auto',
            customer_email: intakeDetails.email,
            success_url: `${baseUrl}/?purchase=success&package=${encodeURIComponent(packageKey)}`,
            cancel_url: `${baseUrl}/?purchase=cancelled&package=${encodeURIComponent(packageKey)}`,
            metadata: checkoutMetadata
        };

        if (packageDefinition.mode === 'payment') {
            sessionParams.customer_creation = 'always';
            sessionParams.payment_intent_data = {
                metadata: checkoutMetadata
            };
        } else {
            sessionParams.subscription_data = {
                metadata: checkoutMetadata
            };
        }

        const session = await stripe.checkout.sessions.create(sessionParams);

        return res.status(200).json({ url: session.url });
    } catch (error) {
        if (error.code === 'INTAKE_SUBMISSION_FAILED') {
            console.error('Formspree intake submission failed:', error);
            return res.status(502).json({
                error: 'We could not send your package intake right now. Please try again or use the contact form.',
                intakeAccepted: false
            });
        }

        console.error('Stripe Checkout session creation failed:', error);
        return res.status(502).json({
            error: 'Your intake details were received, but Stripe checkout could not be started right now.',
            intakeAccepted: true
        });
    }
};