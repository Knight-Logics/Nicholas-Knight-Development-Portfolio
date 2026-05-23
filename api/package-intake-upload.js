const Busboy = require('busboy');

const DEFAULT_ALLOWED_ORIGINS = new Set([
    'https://knightlogics.com',
    'https://www.knightlogics.com',
    'http://127.0.0.1:4180',
    'http://localhost:4180'
]);

const LOCAL_DEV_ORIGIN_PATTERN = /^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/;
const FORMSPREE_ENDPOINT = process.env.FORMSPREE_ENDPOINT || 'https://formspree.io/f/xnnggyzp';
const MAX_FILE_BYTES = 2 * 1024 * 1024;
const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
const MAX_FILE_COUNT = 6;
const MAX_MULTIPART_BODY_BYTES = 5 * 1024 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const requestBuckets = new Map();

function createHttpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
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

function applyCorsHeaders(res, allowedOrigin) {
    if (!allowedOrigin) {
        return;
    }

    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Vary', 'Origin');
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

    return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : 'unknown';
}

function getRateLimitState(ip) {
    const now = Date.now();
    const existing = requestBuckets.get(ip);

    if (!existing || now > existing.resetAt) {
        const fresh = {
            count: 1,
            resetAt: now + RATE_LIMIT_WINDOW_MS
        };
        requestBuckets.set(ip, fresh);
        return { limited: false, remainingMs: RATE_LIMIT_WINDOW_MS };
    }

    existing.count += 1;

    if (existing.count > RATE_LIMIT_MAX_REQUESTS) {
        return { limited: true, remainingMs: Math.max(0, existing.resetAt - now) };
    }

    if (requestBuckets.size > 5000) {
        for (const [bucketIp, bucket] of requestBuckets) {
            if (now > bucket.resetAt) {
                requestBuckets.delete(bucketIp);
            }
        }
    }

    return { limited: false, remainingMs: Math.max(0, existing.resetAt - now) };
}

function sanitizeFilename(filename) {
    return String(filename || 'attachment')
        .replace(/[\\/\r\n\t]/g, '_')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 120) || 'attachment';
}

function appendField(fields, name, value) {
    if (Object.prototype.hasOwnProperty.call(fields, name)) {
        if (Array.isArray(fields[name])) {
            fields[name].push(value);
        } else {
            fields[name] = [fields[name], value];
        }
        return;
    }

    fields[name] = value;
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

async function readRawBody(req) {
    if (Buffer.isBuffer(req.rawBody)) {
        return req.rawBody;
    }

    if (typeof req.rawBody === 'string') {
        return Buffer.from(req.rawBody);
    }

    if (req.rawBody instanceof Uint8Array) {
        return Buffer.from(req.rawBody);
    }

    if (Buffer.isBuffer(req.body)) {
        return req.body;
    }

    if (typeof req.body === 'string') {
        return Buffer.from(req.body);
    }

    if (req.body instanceof Uint8Array) {
        return Buffer.from(req.body);
    }

    const chunks = [];
    let totalBytes = 0;

    for await (const chunk of req) {
        const normalizedChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        totalBytes += normalizedChunk.length;

        if (totalBytes > MAX_MULTIPART_BODY_BYTES) {
            throw createHttpError(413, 'Upload payload is too large. Keep uploads under 4 MB total.');
        }

        chunks.push(normalizedChunk);
    }

    const rawBody = Buffer.concat(chunks);
    const declaredContentLength = Number.parseInt(req.headers['content-length'] || '0', 10);

    if (!rawBody.length && Number.isFinite(declaredContentLength) && declaredContentLength > 0) {
        throw createHttpError(400, 'The multipart upload body was empty before parsing.');
    }

    return rawBody;
}

async function parseMultipart(req) {
    const contentType = req.headers['content-type'] || '';

    if (!/multipart\/form-data/i.test(contentType)) {
        throw createHttpError(400, 'Multipart form data is required.');
    }

    const rawBody = await readRawBody(req);

    return new Promise((resolve, reject) => {
        const busboy = Busboy({
            headers: req.headers,
            limits: {
                files: MAX_FILE_COUNT,
                fileSize: MAX_FILE_BYTES
            }
        });

        const fields = {};
        const files = [];
        let totalBytes = 0;
        let streamError = null;

        busboy.on('field', (fieldName, value) => {
            appendField(fields, fieldName, value);
        });

        busboy.on('file', (fieldName, fileStream, info) => {
            const filename = sanitizeFilename(info && info.filename);
            const mimeType = info && info.mimeType ? info.mimeType : 'application/octet-stream';
            const chunks = [];
            let fileBytes = 0;

            if (!filename || filename === 'attachment') {
                fileStream.resume();
                return;
            }

            fileStream.on('data', (chunk) => {
                fileBytes += chunk.length;
                totalBytes += chunk.length;

                if (totalBytes > MAX_TOTAL_BYTES && !streamError) {
                    streamError = createHttpError(413, 'Keep total uploads under 4 MB. Use a share link for larger folders or videos.');
                }

                chunks.push(chunk);
            });

            fileStream.on('limit', () => {
                if (!streamError) {
                    streamError = createHttpError(413, 'Each uploaded file must be 2 MB or smaller. Use a share link for larger media.');
                }
            });

            fileStream.on('end', () => {
                if (streamError) {
                    return;
                }

                files.push({
                    fieldName,
                    filename,
                    mimeType,
                    buffer: Buffer.concat(chunks),
                    size: fileBytes
                });
            });
        });

        busboy.on('filesLimit', () => {
            if (!streamError) {
                streamError = createHttpError(413, 'Attach up to 6 files max. Use a share link for anything larger.');
            }
        });

        busboy.on('error', (error) => {
            reject(error);
        });

        busboy.on('finish', () => {
            if (streamError) {
                reject(streamError);
                return;
            }

            resolve({ fields, files });
        });

        busboy.end(rawBody);
    });
}

async function parseJsonBody(req) {
    const rawBody = await readRawBody(req);

    if (!rawBody.length) {
        throw createHttpError(400, 'JSON package details are required.');
    }

    try {
        return JSON.parse(rawBody.toString('utf8'));
    } catch (error) {
        throw createHttpError(400, 'Invalid JSON package details.');
    }
}

function buildForwardPayload(fields) {
    const forwarded = new FormData();

    Object.entries(fields).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((entry) => {
                forwarded.append(key, entry);
            });
            return;
        }

        forwarded.append(key, value);
    });

    return forwarded;
}

async function forwardToFormspree(fields, files) {
    const formData = buildForwardPayload(fields);

    files.forEach((file) => {
        formData.append(
            file.fieldName,
            new Blob([file.buffer], { type: file.mimeType }),
            file.filename
        );
    });

    const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
            Accept: 'application/json'
        },
        body: formData
    });

    if (!response.ok) {
        throw createHttpError(502, 'We could not forward the package files right now. Please try again or send a share link instead.');
    }
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
        const retryAfterSeconds = Math.max(1, Math.ceil(rateState.remainingMs / 1000));
        res.setHeader('Retry-After', String(retryAfterSeconds));
        return sendJson(res, 429, { error: 'Too many upload attempts. Please wait and try again.' });
    }

    try {
        const contentType = req.headers['content-type'] || '';
        const isMultipart = /multipart\/form-data/i.test(contentType);
        const isJson = /application\/json/i.test(contentType);

        if (!isMultipart && !isJson) {
            return sendJson(res, 400, { error: 'Send package details as multipart form data or JSON.' });
        }

        const parsedMultipart = isMultipart ? await parseMultipart(req) : null;
        const normalizedFields = parsedMultipart ? parsedMultipart.fields : await parseJsonBody(req);
        const files = parsedMultipart ? parsedMultipart.files : [];

        const submissionStage = normalizeSingleLine(normalizedFields.submissionStage, 40) || 'precheckout';
        const contactName = normalizeSingleLine(normalizedFields.contactName, 120);
        const businessName = normalizeSingleLine(normalizedFields.businessName, 120);
        const email = normalizeSingleLine(normalizedFields.email, 160);
        const projectDetails = normalizeMultiLine(normalizedFields.projectDetails, 2000);
        const assetLink = normalizeSingleLine(normalizedFields.assetLink, 255);

        if (!contactName || !email || !isValidEmail(email)) {
            return sendJson(res, 400, { error: 'Add a valid name and email before continuing.' });
        }

        if (submissionStage === 'precheckout' && !businessName) {
            return sendJson(res, 400, { error: 'Add a business or project name before continuing.' });
        }

        if (submissionStage === 'precheckout' && !projectDetails) {
            return sendJson(res, 400, { error: 'Add a short project goal before continuing.' });
        }

        if (submissionStage === 'followup' && !projectDetails && !assetLink && files.length === 0) {
            return sendJson(res, 400, { error: 'Add notes, a share link, or files before sending the handoff.' });
        }

        const shouldForwardExternally = Boolean(FORMSPREE_ENDPOINT) && !(allowedOrigin && LOCAL_DEV_ORIGIN_PATTERN.test(allowedOrigin));

        if (shouldForwardExternally) {
            await forwardToFormspree(normalizedFields, files);
        }

        return sendJson(res, 200, {
            ok: true,
            forwarded: shouldForwardExternally,
            fileCount: files.length
        });
    } catch (error) {
        console.error('Package intake upload failed:', error);
        return sendJson(res, error.statusCode || 500, {
            error: error.message || 'We could not process the uploaded files right now.'
        });
    }
};
