'use strict';

const STATIC_REFERRAL_PARTNERS = Object.freeze([
    { slug: 'ae-printing-graphics', displayName: 'AE Printing & Graphics', latestOffer: 'AEPRINT250' },
    { slug: 'dvc-signs', displayName: 'DVC Signs', latestOffer: 'DVC250' },
    { slug: 'fastsigns-clearwater', displayName: 'FASTSIGNS Clearwater', latestOffer: 'FASTCLR250' },
    { slug: 'fastsigns-largo', displayName: 'FASTSIGNS Largo', latestOffer: 'FASTLARGO250' },
    { slug: 'fastsigns-palm-harbor', displayName: 'FASTSIGNS Palm Harbor', latestOffer: 'FASTPH250' },
    { slug: 'ldi-printing-signs', displayName: 'LDI Printing & Signs', latestOffer: 'LDI250' },
    { slug: 'minuteman-press-dunedin', displayName: 'Minuteman Press Dunedin', latestOffer: 'MMPDUN250' },
    { slug: 'minuteman-press-largo', displayName: 'Minuteman Press Largo', latestOffer: 'MMPLARGO250' },
    { slug: 'post-office-square', displayName: 'Post Office Square', latestOffer: 'POSSH250' },
    { slug: 'print-shop-dunedin', displayName: 'Print Shop Dunedin', latestOffer: 'TPSDUN250' },
    { slug: 'prints2go', displayName: 'Prints2Go', latestOffer: 'P2GO250' },
    { slug: 'davidson-sign-services', displayName: 'Davidson Sign Services Inc', latestOffer: 'DAVID250' },
    { slug: 'sir-speedy-clearwater-142nd', displayName: 'Sir Speedy Clearwater 142nd', latestOffer: 'SIR142250' },
    { slug: 'sir-speedy-clearwater-drew', displayName: 'Sir Speedy Clearwater Drew', latestOffer: 'SIRDRW250' },
    { slug: 'sir-speedy-palm-harbor', displayName: 'Sir Speedy Palm Harbor', latestOffer: 'SIRPH250' }
]);

function cleanText(value, maxLength) {
    if (typeof value !== 'string') return '';
    return value.replace(/[<>"']/g, '').trim().slice(0, maxLength);
}

function normalizeSlug(value, maxLength = 80) {
    return cleanText(value, maxLength)
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, maxLength);
}

function normalizeOffer(value, maxLength = 80) {
    return cleanText(value, maxLength)
        .toUpperCase()
        .replace(/[^A-Z0-9_-]/g, '')
        .slice(0, maxLength);
}

function titleFromSlug(slug) {
    return String(slug || '')
        .split('-')
        .filter(Boolean)
        .map((part) => {
            if (/^[a-z]{2,4}\d*$/i.test(part)) return part.toUpperCase();
            return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join(' ');
}

function normalizeDisplayName(value, slug, maxLength = 120) {
    return cleanText(value, maxLength) || titleFromSlug(slug);
}

function getStaticPartner(slug) {
    const normalizedSlug = normalizeSlug(slug);
    return STATIC_REFERRAL_PARTNERS.find((partner) => partner.slug === normalizedSlug) || null;
}

function isStaticApprovedPayoutAttribution(partnerSlug, offerCode) {
    const partner = getStaticPartner(partnerSlug);
    if (!partner) return false;
    const expectedOffer = normalizeOffer(partner.latestOffer);
    const normalizedOffer = normalizeOffer(offerCode);
    return !normalizedOffer || expectedOffer === normalizedOffer;
}

function isActiveValue(value) {
    return value !== false && value !== 0 && value !== 'false';
}

function mergeReferralPartners(dynamicRows, options = {}) {
    const includeInactive = Boolean(options.includeInactive);
    const partnersBySlug = new Map();

    STATIC_REFERRAL_PARTNERS.forEach((partner) => {
        partnersBySlug.set(partner.slug, { ...partner, source: 'static', isActive: true });
    });

    (dynamicRows || []).forEach((row) => {
        const slug = normalizeSlug(row.partner_slug || row.slug || '');
        if (!slug) return;
        const staticPartner = getStaticPartner(slug);
        const active = isActiveValue(row.is_active);

        if (!active && !includeInactive) {
            partnersBySlug.delete(slug);
            return;
        }

        partnersBySlug.set(slug, {
            slug,
            displayName: normalizeDisplayName(
                row.partner_name || row.displayName || (staticPartner && staticPartner.displayName) || '',
                slug
            ),
            latestOffer: normalizeOffer(row.latest_offer || row.latestOffer || (staticPartner && staticPartner.latestOffer) || ''),
            source: 'database',
            isActive: active
        });
    });

    return Array.from(partnersBySlug.values()).sort((a, b) => {
        return String(a.displayName).localeCompare(String(b.displayName));
    });
}

module.exports = {
    STATIC_REFERRAL_PARTNERS,
    cleanText,
    getStaticPartner,
    isActiveValue,
    isStaticApprovedPayoutAttribution,
    mergeReferralPartners,
    normalizeDisplayName,
    normalizeOffer,
    normalizeSlug,
    titleFromSlug
};
