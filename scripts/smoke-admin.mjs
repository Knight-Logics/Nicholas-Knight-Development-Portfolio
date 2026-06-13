#!/usr/bin/env node
/**
 * Smoke tests for Knight Command /admin shell and admin APIs.
 * Usage: node scripts/smoke-admin.mjs [baseUrl]
 * Default baseUrl: http://127.0.0.1:4183
 */
'use strict';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const base = (process.argv[2] || 'http://127.0.0.1:4183').replace(/\/$/, '');

const results = [];

function pass(name, detail) {
    results.push({ name, ok: true, detail: detail || '' });
    console.log('PASS', name, detail ? `- ${detail}` : '');
}

function fail(name, detail) {
    results.push({ name, ok: false, detail: detail || '' });
    console.error('FAIL', name, detail ? `- ${detail}` : '');
}

function read(rel) {
    return fs.readFileSync(path.join(root, rel), 'utf8');
}

async function fetchJson(url, options) {
    const res = await fetch(url, options);
    let data = null;
    try {
        data = await res.json();
    } catch {
        data = null;
    }
    return { res, data };
}

async function main() {
    console.log('Knight Command smoke test');
    console.log('Base URL:', base);
    console.log('---');

    // Static file checks
    for (const file of ['admin.html', 'admin/admin.js', 'admin/admin.css', 'api/admin-auth.js', 'api/admin-health.js', 'api/_lib/admin-auth.js']) {
        if (fs.existsSync(path.join(root, file))) pass(`file exists: ${file}`);
        else fail(`file exists: ${file}`);
    }

    const vercel = read('vercel.json');
    if (vercel.includes('"/admin"') && vercel.includes('/admin.html')) pass('vercel.json /admin rewrite');
    else fail('vercel.json /admin rewrite');

    const serve = read('serve.json');
    if (serve.includes('"/admin"')) pass('serve.json /admin rewrite');
    else fail('serve.json /admin rewrite');

    const robots = read('robots.txt');
    if (robots.includes('Disallow: /admin')) pass('robots.txt blocks /admin');
    else fail('robots.txt blocks /admin');

    // HTTP checks (optional when server running)
    try {
        const adminPage = await fetch(`${base}/admin`);
        if (adminPage.ok) pass('GET /admin', String(adminPage.status));
        else fail('GET /admin', String(adminPage.status));

        const html = await adminPage.text();
        if (html.includes('Knight Command') && html.includes('admin/admin.js')) pass('/admin HTML shell markers');
        else fail('/admin HTML shell markers');

        const css = await fetch(`${base}/admin/admin.css?v=20260613admin1`);
        if (css.ok) pass('GET /admin/admin.css');
        else fail('GET /admin/admin.css', String(css.status));

        const js = await fetch(`${base}/admin/admin.js?v=20260613admin1`);
        if (js.ok) pass('GET /admin/admin.js');
        else fail('GET /admin/admin.js', String(js.status));

        const badLogin = await fetchJson(`${base}/api/admin-auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secret: 'wrong-secret-smoke-test' }),
        });
        if (badLogin.res.status === 403) pass('POST /api/admin-auth rejects bad secret');
        else if (badLogin.res.status === 503) console.log('SKIP POST /api/admin-auth rejects bad secret — KL_ADMIN_SECRET not on server');
        else if (badLogin.res.status === 404) console.log('SKIP POST /api/admin-auth — no API runtime (use vercel dev or production, not plain serve)');
        else fail('POST /api/admin-auth rejects bad secret', `status ${badLogin.res.status}`);

        const healthNoAuth = await fetchJson(`${base}/api/admin-health`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
        });
        if (healthNoAuth.res.status === 403) pass('POST /api/admin-health requires auth');
        else if (healthNoAuth.res.status === 503) console.log('SKIP POST /api/admin-health requires auth — KL_ADMIN_SECRET not on server');
        else if (healthNoAuth.res.status === 404) console.log('SKIP POST /api/admin-health — no API runtime');
        else fail('POST /api/admin-health requires auth', `status ${healthNoAuth.res.status}`);

        const embed = await fetch(`${base}/referral-dashboard?embed=1`);
        if (embed.ok) pass('GET /referral-dashboard?embed=1');
        else fail('GET /referral-dashboard?embed=1', String(embed.status));

        const secret = process.env.KL_ADMIN_SECRET;
        if (secret) {
            const login = await fetchJson(`${base}/api/admin-auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secret }),
            });
            if (login.res.status === 200 && login.data && login.data.token) {
                pass('POST /api/admin-auth accepts KL_ADMIN_SECRET');
                const health = await fetchJson(`${base}/api/admin-health`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: login.data.token }),
                });
                if (health.res.status === 200 && health.data && health.data.ok) {
                    pass('POST /api/admin-health with session token');
                } else {
                    fail('POST /api/admin-health with session token', JSON.stringify(health.data));
                }
            } else if (login.res.status === 503 || login.res.status === 404) {
                console.log('SKIP authenticated API checks — API not available or KL_ADMIN_SECRET missing on server');
            } else {
                fail('POST /api/admin-auth accepts KL_ADMIN_SECRET', JSON.stringify(login.data));
            }
        } else {
            console.log('SKIP authenticated API checks — set KL_ADMIN_SECRET in shell for full API smoke');
        }
    } catch (error) {
        fail('HTTP smoke (is local server running?)', error.message);
    }

    console.log('---');
    const failed = results.filter((r) => !r.ok);
    console.log(`${results.length - failed.length}/${results.length} passed`);
    if (failed.length) {
        process.exitCode = 1;
    }
}

main();
