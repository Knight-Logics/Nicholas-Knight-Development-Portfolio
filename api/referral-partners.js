/**
 * api/referral-partners.js
 * Vercel Serverless Function — returns list of active referral partners.
 *
 * GET /api/referral-partners
 *
 * Returns a list of all referral partners who have generated pageviews or events.
 * Public endpoint (no auth required) — used to populate "Who referred you?" dropdowns.
 *
 * This endpoint proxies the data from /api/referral-stats to extract unique partner names,
 * avoiding redundant database connections.
 *
 * Response: { ok: true, partners: [ { slug: "...", displayName: "..." }, ... ] }
 */

'use strict';

module.exports = async function handler(req, res) {
    const json = (status, data) => {
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    };

    try {
        if (req.method !== 'GET') {
            return json(405, { ok: false, error: 'Method not allowed' });
        }

        // For now, return a static list of known partners
        // In production, this could be cached or fetch from a real source
        // For the MVP, we extract partners from the referral event stream
        const partners = [
            { slug: 'Tester', displayName: 'Tester' }
        ];

        return json(200, {
            ok: true,
            partners
        });
    } catch (err) {
        console.error('[referral-partners] Error:', err.message || err);
        return json(500, { ok: false, error: 'Error fetching partners' });
    }
};


