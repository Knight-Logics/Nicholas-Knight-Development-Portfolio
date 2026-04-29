const Stripe = require('stripe');

const PACKAGE_DEFINITIONS = {
    'website-local-seo-starter': {
        mode: 'payment',
        name: 'Website + Local SEO Starter Package',
        description: 'Hand-coded website build or rebuild with technical SEO, Search Console setup, and Google Business Profile alignment.',
        amount: 199700,
        currency: 'usd',
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

function buildCheckoutMetadata(packageKey, packageDefinition) {
    return {
        packageKey,
        packageName: packageDefinition.name,
        ...packageDefinition.metadata
    };
}

function buildCustomFields() {
    return [
        {
            key: 'business_name',
            label: {
                type: 'custom',
                custom: 'Business or organization name'
            },
            type: 'text',
            optional: false,
            text: {
                minimum_length: 2,
                maximum_length: 80
            }
        },
        {
            key: 'preferred_contact',
            label: {
                type: 'custom',
                custom: 'Preferred contact method'
            },
            type: 'dropdown',
            optional: false,
            dropdown: {
                options: [
                    {
                        label: 'Email',
                        value: 'email'
                    },
                    {
                        label: 'Phone call',
                        value: 'phone'
                    },
                    {
                        label: 'Text message',
                        value: 'text'
                    }
                ]
            }
        },
        {
            key: 'project_notes',
            label: {
                type: 'custom',
                custom: 'Project or job notes'
            },
            type: 'text',
            optional: true,
            text: {
                maximum_length: 255
            }
        }
    ];
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
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

    try {
        const stripe = new Stripe(stripeSecretKey, {
            apiVersion: '2025-03-31.basil'
        });
        const baseUrl = getBaseUrl(req);
        const checkoutMetadata = buildCheckoutMetadata(packageKey, packageDefinition);

        const sessionParams = {
            mode: packageDefinition.mode,
            line_items: [buildLineItem(packageDefinition)],
            billing_address_collection: 'auto',
            phone_number_collection: {
                enabled: true
            },
            custom_fields: buildCustomFields(),
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
        console.error('Stripe Checkout session creation failed:', error);
        return res.status(500).json({ error: 'Unable to start checkout right now.' });
    }
};