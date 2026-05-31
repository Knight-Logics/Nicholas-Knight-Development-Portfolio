'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OAUTH_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const ACCOUNTS_API = 'https://mybusinessaccountmanagement.googleapis.com/v1/accounts';
const LOCATIONS_API_ROOT = 'https://mybusinessbusinessinformation.googleapis.com/v1';
const REVIEWS_API_ROOT = 'https://mybusiness.googleapis.com/v4';
const OUTPUT_PATH = path.resolve(__dirname, '..', 'data', 'google-reviews.json');

const STAR_MAP = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5
};

const AVATAR_COLORS = ['#1d4ed8', '#156f43', '#b42318', '#8a5a00', '#17623b', '#274690', '#7c3aed', '#0f766e'];

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

function loadDefaultEnvs() {
    const root = path.resolve(__dirname, '..');
    loadEnvFile(path.join(root, '.env.local'));
    loadEnvFile(path.join(root, '.env.production'));

    const secretPath = process.env.KL_ACCOUNTS_ENV_PATH || 'C:/Users/nknig/.copilot-secrets/accounts.env';
    loadEnvFile(secretPath);
}

function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

function normalizeAccountName(input) {
    if (!input) return null;
    return input.startsWith('accounts/') ? input : `accounts/${input}`;
}

function normalizeLocationName(input) {
    if (!input) return null;
    return input.startsWith('locations/') ? input : `locations/${input}`;
}

async function apiGet(url, accessToken) {
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json'
        }
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(`API request failed (${response.status}) ${url} :: ${JSON.stringify(payload)}`);
    }

    return payload;
}

async function getAccessToken() {
    const clientId = requireEnv('GBP_OAUTH_CLIENT_ID');
    const clientSecret = requireEnv('GBP_OAUTH_CLIENT_SECRET');
    const refreshToken = requireEnv('GBP_REFRESH_TOKEN');

    const body = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
    });

    const response = await fetch(OAUTH_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok || !payload.access_token) {
        throw new Error(`OAuth token refresh failed (${response.status}): ${JSON.stringify(payload)}`);
    }

    return payload.access_token;
}

async function listAllLocations(accessToken, accountName) {
    const locations = [];
    let pageToken = '';

    do {
        const query = new URLSearchParams({
            readMask: 'name,title,metadata'
        });

        if (pageToken) {
            query.set('pageToken', pageToken);
        }

        const payload = await apiGet(`${LOCATIONS_API_ROOT}/${accountName}/locations?${query.toString()}`, accessToken);
        locations.push(...(payload.locations || []));
        pageToken = payload.nextPageToken || '';
    } while (pageToken);

    return locations;
}

function selectAccount(accounts) {
    const preferred = normalizeAccountName(process.env.GBP_ACCOUNT_NAME || process.env.GBP_ACCOUNT_ID);
    if (preferred) {
        const exact = accounts.find((a) => a.name === preferred);
        if (exact) return exact;
    }

    if (accounts.length === 1) {
        return accounts[0];
    }

    const hint = (process.env.GBP_ACCOUNT_HINT || '').toLowerCase().trim();
    if (hint) {
        const found = accounts.find((a) => {
            const name = (a.accountName || '').toLowerCase();
            return name.includes(hint);
        });
        if (found) return found;
    }

    throw new Error(
        'Unable to auto-select GBP account. Set GBP_ACCOUNT_NAME (accounts/...) or GBP_ACCOUNT_ID. ' +
        `Available accounts: ${accounts.map((a) => `${a.name} (${a.accountName || 'no-label'})`).join(', ')}`
    );
}

function selectLocation(locations) {
    const preferred = normalizeLocationName(process.env.GBP_LOCATION_NAME || process.env.GBP_LOCATION_ID);
    if (preferred) {
        const exact = locations.find((l) => l.name === preferred);
        if (exact) return exact;
    }

    const titleHint = (process.env.GBP_LOCATION_TITLE || 'Knight Logics').toLowerCase().trim();
    const byTitle = locations.find((l) => (l.title || '').toLowerCase().includes(titleHint));
    if (byTitle) {
        return byTitle;
    }

    if (locations.length === 1) {
        return locations[0];
    }

    throw new Error(
        'Unable to auto-select GBP location. Set GBP_LOCATION_NAME (locations/...) or GBP_LOCATION_ID. ' +
        `Available locations: ${locations.map((l) => `${l.name} (${l.title || 'no-title'})`).join(', ')}`
    );
}

async function listAllReviews(accessToken, accountName, locationName) {
    const reviews = [];
    let pageToken = '';

    do {
        const query = new URLSearchParams({ pageSize: '50' });
        if (pageToken) {
            query.set('pageToken', pageToken);
        }

        const endpoint = `${REVIEWS_API_ROOT}/${accountName}/${locationName}/reviews?${query.toString()}`;
        const payload = await apiGet(endpoint, accessToken);
        reviews.push(...(payload.reviews || []));
        pageToken = payload.nextPageToken || '';
    } while (pageToken);

    return reviews;
}

function hashColor(value) {
    const digest = crypto.createHash('sha1').update(String(value || '')).digest();
    return AVATAR_COLORS[digest[0] % AVATAR_COLORS.length];
}

function mapStars(starValue) {
    if (typeof starValue === 'number') {
        return Math.max(1, Math.min(5, Math.round(starValue)));
    }

    if (!starValue) {
        return 5;
    }

    const normalized = String(starValue).toUpperCase().trim();
    return STAR_MAP[normalized] || 5;
}

function formatDate(isoDate) {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10);
}

function toFeedReview(review) {
    const reviewerName = (review.reviewer && review.reviewer.displayName) || 'Google User';
    const starCount = mapStars(review.starRating);
    const comment = review.comment || '';
    const reply = review.reviewReply;

    return {
        name: reviewerName,
        meta: 'Google review',
        date: formatDate(review.createTime || review.updateTime),
        text: comment,
        stars: starCount,
        avatarColor: hashColor(reviewerName),
        replied: Boolean(reply && reply.comment),
        ownerReply: reply && reply.comment
            ? {
                name: 'Knight Logics',
                date: formatDate(reply.updateTime),
                text: reply.comment
            }
            : undefined
    };
}

function buildPayload(sourceReviews, location) {
    const reviews = sourceReviews
        .map(toFeedReview)
        .filter((r) => r.text || r.stars)
        .sort((a, b) => String(b.date).localeCompare(String(a.date)));

    const ratingTotal = reviews.reduce((sum, r) => sum + (Number(r.stars) || 0), 0);
    const ratingValue = reviews.length ? Number((ratingTotal / reviews.length).toFixed(1)) : 0;

    return {
        ratingValue,
        reviewCount: reviews.length,
        fetchedAt: new Date().toISOString(),
        source: {
            account: process.env.GBP_ACCOUNT_NAME || null,
            location: location.name,
            locationTitle: location.title || null
        },
        reviews
    };
}

function toErrorMessage(error) {
    if (!error) return '';
    if (typeof error === 'string') return error;
    return String(error.message || error);
}

function looksLikeQuotaBlocked(error, apiUrlFragment) {
    const msg = toErrorMessage(error);
    return msg.includes('API request failed (429)') && (!apiUrlFragment || msg.includes(apiUrlFragment));
}

function extractActivationUrl(error) {
    const msg = toErrorMessage(error);
    const match = msg.match(/https?:\/\/[^\s"']*console\.developers\.google\.com[^\s"']*/i);
    return match ? match[0] : null;
}

function looksLikeServiceDisabled(error) {
    const msg = toErrorMessage(error);
    return msg.includes('SERVICE_DISABLED') || msg.includes('API has not been used') || msg.includes('it is disabled');
}

function writeOutput(payload, dryRun) {
    const json = `${JSON.stringify(payload, null, 2)}\n`;
    if (dryRun) {
        console.log('[dry-run] Would write', OUTPUT_PATH);
        console.log('[dry-run] reviewCount =', payload.reviewCount, 'ratingValue =', payload.ratingValue);
        return;
    }

    fs.writeFileSync(OUTPUT_PATH, json, 'utf8');
    console.log('Wrote review feed:', OUTPUT_PATH);
    console.log('reviewCount =', payload.reviewCount, 'ratingValue =', payload.ratingValue);
}

async function run() {
    loadDefaultEnvs();

    const dryRun = process.argv.includes('--dry-run');
    const accessToken = await getAccessToken();

    const explicitAccountName = normalizeAccountName(process.env.GBP_ACCOUNT_NAME || process.env.GBP_ACCOUNT_ID);
    const explicitLocationName = normalizeLocationName(process.env.GBP_LOCATION_NAME || process.env.GBP_LOCATION_ID);

    let accountName = explicitAccountName;
    let location = explicitLocationName
        ? {
            name: explicitLocationName,
            title: process.env.GBP_LOCATION_TITLE || null
        }
        : null;

    if (!accountName) {
        let accountsPayload;
        try {
            accountsPayload = await apiGet(ACCOUNTS_API, accessToken);
        } catch (error) {
            if (looksLikeQuotaBlocked(error, ACCOUNTS_API)) {
                throw new Error(
                    'Account discovery is quota-blocked for mybusinessaccountmanagement.googleapis.com (likely 0 requests/min). ' +
                    'Set GBP_ACCOUNT_NAME and GBP_LOCATION_NAME to skip discovery, or request a quota increase for this API.'
                );
            }
            throw error;
        }

        const accounts = accountsPayload.accounts || [];
        if (!accounts.length) {
            throw new Error('No Google Business accounts found for the authorized user.');
        }

        const account = selectAccount(accounts);
        accountName = account.name;
        process.env.GBP_ACCOUNT_NAME = accountName;
    }

    if (!location) {
        const locations = await listAllLocations(accessToken, accountName);
        if (!locations.length) {
            throw new Error(`No locations found under account ${accountName}.`);
        }

        location = selectLocation(locations);
    }

    const reviews = await listAllReviews(accessToken, accountName, location.name);
    const payload = buildPayload(reviews, location);

    writeOutput(payload, dryRun);
}

run().catch((error) => {
    if (looksLikeServiceDisabled(error)) {
        const activationUrl = extractActivationUrl(error) ||
            'https://console.cloud.google.com/apis/library/mybusiness.googleapis.com';
        console.error(
            'GBP review sync failed: Google My Business API is disabled or not allowlisted for this project. ' +
            `Enable/request access first: ${activationUrl} ` +
            'If quota remains 0/min, submit Basic API Access at https://support.google.com/business/contact/api_default ' +
            'and choose "Application For Basic API Access".'
        );
    } else {
        console.error('GBP review sync failed:', error.message || error);
    }
    process.exitCode = 1;
});
