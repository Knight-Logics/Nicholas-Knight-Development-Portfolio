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

        // Static partner list used by referral dropdowns.
        // Keep this in sync with the active referral campaign roster.
        const partners = [
            { slug: 'ae-printing-graphics', displayName: 'AE Printing & Graphics', latestOffer: 'AEPRINT250' },
            { slug: 'dvc-signs', displayName: 'DVC Signs', latestOffer: 'DVC250' },
            { slug: 'fastsigns-clearwater', displayName: 'FASTSIGNS Clearwater', latestOffer: '' },
            { slug: 'fastsigns-largo', displayName: 'FASTSIGNS Largo', latestOffer: '' },
            { slug: 'fastsigns-palm-harbor', displayName: 'FASTSIGNS Palm Harbor', latestOffer: '' },
            { slug: 'ldi-printing-signs', displayName: 'LDI Printing & Signs', latestOffer: '' },
            { slug: 'minuteman-press-dunedin', displayName: 'Minuteman Press Dunedin', latestOffer: '' },
            { slug: 'minuteman-press-largo', displayName: 'Minuteman Press Largo', latestOffer: '' },
            { slug: 'post-office-square', displayName: 'Post Office Square', latestOffer: 'POSSH250' },
            { slug: 'print-shop-dunedin', displayName: 'Print Shop Dunedin', latestOffer: '' },
            { slug: 'prints2go', displayName: 'Prints2Go', latestOffer: '' },
            { slug: 'davidson-sign-services', displayName: 'Davidson Sign Services Inc', latestOffer: 'DAVID250' },
            { slug: 'sir-speedy-clearwater-142nd', displayName: 'Sir Speedy Clearwater 142nd', latestOffer: '' },
            { slug: 'sir-speedy-clearwater-drew', displayName: 'Sir Speedy Clearwater Drew', latestOffer: '' },
            { slug: 'sir-speedy-palm-harbor', displayName: 'Sir Speedy Palm Harbor', latestOffer: '' }
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


