'use strict';

const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');

const checkoutModule = require('../api/create-checkout-session.js');
const PACKAGE_DEFINITIONS = checkoutModule.PACKAGE_DEFINITIONS || {};
const PACKAGE_PAYMENT_OPTIONS = checkoutModule.PACKAGE_PAYMENT_OPTIONS || {};

const KL_PRODUCT_KEY_META = 'kl_package_key';
const KL_PAYMENT_OPTION_META = 'kl_payment_option';

function loadEnvFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return;
    }

    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);

    for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith('#')) {
            continue;
        }

        const idx = trimmed.indexOf('=');
        if (idx === -1) {
            continue;
        }

        const key = trimmed.slice(0, idx).trim();
        let value = trimmed.slice(idx + 1).trim();

        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        if (!(key in process.env)) {
            process.env[key] = value;
        }
    }
}

function toDollars(cents) {
    return (Number(cents || 0) / 100).toFixed(2);
}

function csvEscape(value) {
    if (value === null || value === undefined) {
        return '';
    }

    const text = String(value);

    if (/[",\n]/.test(text)) {
        return '"' + text.replace(/"/g, '""') + '"';
    }

    return text;
}

async function listAllProducts(stripe) {
    const results = [];
    let startingAfter;

    while (true) {
        const page = await stripe.products.list({ active: true, limit: 100, starting_after: startingAfter });
        results.push(...(page.data || []));

        if (!page.has_more || !page.data || page.data.length === 0) {
            break;
        }

        startingAfter = page.data[page.data.length - 1].id;
    }

    return results;
}

async function listAllPricesForProduct(stripe, productId) {
    const results = [];
    let startingAfter;

    while (true) {
        const page = await stripe.prices.list({ product: productId, active: true, limit: 100, starting_after: startingAfter });
        results.push(...(page.data || []));

        if (!page.has_more || !page.data || page.data.length === 0) {
            break;
        }

        startingAfter = page.data[page.data.length - 1].id;
    }

    return results;
}

function priceMatches(price, packageDefinition, paymentOption, amount) {
    if (!price) {
        return false;
    }

    if (price.currency !== packageDefinition.currency || price.unit_amount !== amount) {
        return false;
    }

    const storedOption = (price.metadata && price.metadata[KL_PAYMENT_OPTION_META]) || 'full';
    if (storedOption !== paymentOption) {
        return false;
    }

    if (packageDefinition.mode === 'subscription') {
        return Boolean(
            price.recurring &&
            packageDefinition.recurring &&
            String(price.recurring.interval || '').toLowerCase() === String(packageDefinition.recurring.interval || '').toLowerCase() &&
            Number(price.recurring.interval_count || 1) === Number(packageDefinition.recurring.interval_count || 1)
        );
    }

    return !price.recurring;
}

function getPaymentVariants(packageKey, packageDefinition) {
    const variants = [
        {
            paymentOption: 'full',
            amount: packageDefinition.amount,
            label: packageDefinition.mode === 'subscription'
                ? packageDefinition.priceDisplay
                : packageDefinition.priceDisplay
        }
    ];

    const deposit = PACKAGE_PAYMENT_OPTIONS[packageKey] && PACKAGE_PAYMENT_OPTIONS[packageKey].deposit;
    if (deposit && packageDefinition.mode === 'payment') {
        variants.push({
            paymentOption: 'deposit',
            amount: deposit.amount,
            label: deposit.priceDisplay
        });
    }

    return variants;
}

async function ensureCatalogProduct(stripe, allProducts, packageKey, packageDefinition) {
    const existing = allProducts.find((product) =>
        product && product.metadata && product.metadata[KL_PRODUCT_KEY_META] === packageKey
    );

    if (existing) {
        return existing;
    }

    const created = await stripe.products.create({
        name: `KL - ${packageDefinition.name}`,
        description: packageDefinition.description,
        metadata: {
            [KL_PRODUCT_KEY_META]: packageKey,
            kl_package_name: packageDefinition.name,
            kl_mode: packageDefinition.mode,
            kl_family: (packageDefinition.metadata && packageDefinition.metadata.family) || ''
        }
    });

    allProducts.push(created);
    return created;
}

async function ensureCatalogPrice(stripe, product, packageKey, packageDefinition, paymentOption, amount) {
    const prices = await listAllPricesForProduct(stripe, product.id);
    const existing = prices.find((price) => priceMatches(price, packageDefinition, paymentOption, amount));

    if (existing) {
        return { price: existing, created: false };
    }

    const payload = {
        product: product.id,
        currency: packageDefinition.currency,
        unit_amount: amount,
        nickname: paymentOption === 'deposit'
            ? `${packageDefinition.name} Deposit`
            : `${packageDefinition.name} Full`,
        metadata: {
            [KL_PRODUCT_KEY_META]: packageKey,
            [KL_PAYMENT_OPTION_META]: paymentOption,
            kl_package_name: packageDefinition.name
        }
    };

    if (packageDefinition.mode === 'subscription') {
        payload.recurring = packageDefinition.recurring;
    }

    const created = await stripe.prices.create(payload);
    return { price: created, created: true };
}

async function main() {
    const rootDir = path.resolve(__dirname, '..');
    loadEnvFile(path.join(rootDir, '.env.local'));

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;

    if (!stripeSecretKey) {
        throw new Error('Missing STRIPE_SECRET_KEY or STRIPE_API_KEY.');
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-03-31.basil' });
    const allProducts = await listAllProducts(stripe);

    const mappingRows = [];
    const csvRows = [
        [
            'package_key',
            'package_name',
            'family',
            'billing_mode',
            'payment_option',
            'amount_usd',
            'interval',
            'product_name',
            'product_id',
            'price_id',
            'created_now'
        ]
    ];

    const packageKeys = Object.keys(PACKAGE_DEFINITIONS);

    for (const packageKey of packageKeys) {
        const packageDefinition = PACKAGE_DEFINITIONS[packageKey];
        const product = await ensureCatalogProduct(stripe, allProducts, packageKey, packageDefinition);
        const paymentVariants = getPaymentVariants(packageKey, packageDefinition);

        for (const variant of paymentVariants) {
            const result = await ensureCatalogPrice(
                stripe,
                product,
                packageKey,
                packageDefinition,
                variant.paymentOption,
                variant.amount
            );

            const row = {
                packageKey,
                packageName: packageDefinition.name,
                family: (packageDefinition.metadata && packageDefinition.metadata.family) || '',
                billingMode: packageDefinition.mode,
                paymentOption: variant.paymentOption,
                amountUsd: toDollars(variant.amount),
                interval: packageDefinition.mode === 'subscription' ? packageDefinition.recurring.interval : '',
                productName: product.name,
                productId: product.id,
                priceId: result.price.id,
                createdNow: result.created
            };

            mappingRows.push(row);
            csvRows.push([
                row.packageKey,
                row.packageName,
                row.family,
                row.billingMode,
                row.paymentOption,
                row.amountUsd,
                row.interval,
                row.productName,
                row.productId,
                row.priceId,
                row.createdNow ? 'yes' : 'no'
            ]);
        }
    }

    const outputDir = path.join(rootDir, 'stripe');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const mapPath = path.join(outputDir, 'knightlogics-catalog-map.json');
    const csvPath = path.join(outputDir, 'knightlogics-catalog-map.csv');

    fs.writeFileSync(mapPath, JSON.stringify({ generatedAt: new Date().toISOString(), rows: mappingRows }, null, 2));
    fs.writeFileSync(
        csvPath,
        csvRows.map((row) => row.map(csvEscape).join(',')).join('\n') + '\n'
    );

    const createdCount = mappingRows.filter((row) => row.createdNow).length;

    console.log(`Synced ${mappingRows.length} package price entries.`);
    console.log(`Created ${createdCount} new prices in Stripe.`);
    console.log(`Wrote mapping JSON: ${mapPath}`);
    console.log(`Wrote mapping CSV: ${csvPath}`);
}

main().catch((error) => {
    console.error('Stripe catalog sync failed:', error.message || error);
    process.exit(1);
});
