/* attribution.js — Knight Logics referral & UTM capture
 * Captures referral partner, offer code, and UTM parameters from the URL
 * on first visit, stores them in both localStorage AND a 365-day cookie so
 * attribution survives mobile cross-domain redirects (e.g. Stripe → back),
 * persists across browser sessions, and injects hidden fields into every
 * Formspree form and the package intake form so attribution data flows into
 * every lead submission and Stripe checkout.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'kl_attr';
    var COOKIE_NAME = 'kl_attr';
    var COOKIE_DAYS = 365;
    var EXPIRY_MS = COOKIE_DAYS * 24 * 60 * 60 * 1000; // 365 days

    /* ── Sanitize helpers ── */
    function clean(val, maxLen) {
        if (!val || typeof val !== 'string') return '';
        return val.replace(/[<>"']/g, '').trim().slice(0, maxLen || 120);
    }

    /* ── Cookie helpers (survive mobile cross-domain redirects, 365-day) ── */
    function writeCookie(data) {
        try {
            var expires = new Date(Date.now() + EXPIRY_MS).toUTCString();
            var val = encodeURIComponent(JSON.stringify(data));
            document.cookie = COOKIE_NAME + '=' + val +
                '; expires=' + expires +
                '; path=/; SameSite=Lax; Secure';
        } catch (e) {}
    }

    function readCookie() {
        try {
            var match = document.cookie.match(
                new RegExp('(?:^|;)\\s*' + COOKIE_NAME + '=([^;]*)')
            );
            if (!match) return null;
            var parsed = JSON.parse(decodeURIComponent(match[1]));
            if (parsed && parsed.expiry && Date.now() > parsed.expiry) return null;
            return parsed;
        } catch (e) { return null; }
    }

    /* ── LocalStorage + cookie combined helpers ── */
    function readStorage() {
        var fromLS = null;
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (!parsed.expiry || Date.now() <= parsed.expiry) {
                    fromLS = parsed;
                } else {
                    localStorage.removeItem(STORAGE_KEY);
                }
            }
        } catch (e) {}

        /* If localStorage had referral data, use it */
        if (fromLS && (fromLS.ref || fromLS.offer)) return fromLS;

        /* Fall back to cookie (survives mobile Stripe redirects) */
        var fromCookie = readCookie();
        if (fromCookie && (fromCookie.ref || fromCookie.offer)) {
            /* Restore into localStorage so subsequent reads are fast */
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(fromCookie)); } catch (e) {}
            return fromCookie;
        }

        /* Return whichever has any data at all */
        return fromLS || fromCookie;
    }

    function writeStorage(data) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {}
        writeCookie(data);
    }

    /* ── Capture from current URL params ── */
    function captureFromUrl() {
        try {
            var params = new URLSearchParams(window.location.search);
            var ref     = clean(params.get('ref'), 80);
            var offer   = clean(params.get('offer'), 80);
            var src     = clean(params.get('utm_source'), 80);
            var medium  = clean(params.get('utm_medium'), 80);
            var campaign = clean(params.get('utm_campaign'), 80);
            var content  = clean(params.get('utm_content'), 80);

            if (!ref && window.location.pathname.indexOf('/ref/') === 0) {
                ref = clean(decodeURIComponent(window.location.pathname.split('/')[2] || ''), 80);
            }

            /* Use utm_source as fallback ref when no explicit ref param */
            if (!ref && src) ref = src;

            if (!ref && !offer && !medium && !campaign) return;

            var existing = readStorage() || {};
            var updated = Object.assign({}, existing);

            if (ref)      updated.ref      = ref;
            if (offer)    updated.offer    = offer;
            if (medium)   updated.medium   = medium;
            if (campaign) updated.campaign = campaign;
            if (content)  updated.content  = content;
            if (src)      updated.utmSrc   = src;

            /* Record the very first attributed URL only */
            if (!existing.firstUrl && (ref || offer)) {
                updated.firstUrl  = window.location.href.slice(0, 300);
                updated.firstTime = new Date().toISOString();
            }

            updated.expiry = Date.now() + EXPIRY_MS;
            writeStorage(updated);
        } catch (e) {}
    }

    /* ── Build the list of fields to inject ── */
    function getFields() {
        var attr = readStorage();
        if (!attr) return [];
        var fields = [
            { name: 'kl_ref',         value: attr.ref      || '' },
            { name: 'kl_offer',       value: attr.offer    || '' },
            { name: 'kl_utm_medium',  value: attr.medium   || '' },
            { name: 'kl_utm_campaign',value: attr.campaign || '' },
            { name: 'kl_first_url',   value: attr.firstUrl || '' },
            { name: 'kl_session_id',  value: getSessionId() }
        ];
        return fields.filter(function (f) { return f.value; });
    }

    function getAttributionSnapshot() {
        var attr = readStorage();
        if (!attr) return null;
        return {
            referralPartner: attr.ref || '',
            referralOffer: attr.offer || '',
            utmMedium: attr.medium || '',
            utmCampaign: attr.campaign || '',
            firstUrl: attr.firstUrl || '',
            sessionId: getSessionId()
        };
    }

    /* ── Inject hidden inputs into a single form ── */
    function injectIntoForm(form, fields) {
        fields.forEach(function (field) {
            /* Don't add duplicates */
            if (form.querySelector('[name="' + field.name + '"]')) return;
            var input = document.createElement('input');
            input.type  = 'hidden';
            input.name  = field.name;
            input.value = field.value;
            form.appendChild(input);
        });
    }

    /* ── Inject into all target forms after DOM is ready ── */
    function injectAttributionFields() {
        var fields = getFields();
        if (!fields.length) return;

        /* All Formspree forms */
        var fsforms = document.querySelectorAll('form[action*="formspree"]');
        for (var i = 0; i < fsforms.length; i++) {
            injectIntoForm(fsforms[i], fields);
        }

        /* Package intake form (POSTs JSON to /api/create-checkout-session) */
        var intakeForm = document.getElementById('starterPackageIntakeForm');
        if (intakeForm) injectIntoForm(intakeForm, fields);
    }

    function firstValue(form, names) {
        var i;
        for (i = 0; i < names.length; i += 1) {
            var field = form.querySelector('[name="' + names[i] + '"]');
            if (field && typeof field.value === 'string' && field.value.trim()) {
                return clean(field.value, names[i] === 'email' || /email/i.test(names[i]) ? 160 : 120);
            }
        }
        return '';
    }

    function attachFormSubmitTracking() {
        var forms = document.querySelectorAll('form[action*="formspree"]');
        var i;
        for (i = 0; i < forms.length; i += 1) {
            var form = forms[i];
            if (form.dataset.klReferralSubmitTracked === '1') continue;
            form.dataset.klReferralSubmitTracked = '1';
            form.addEventListener('submit', function (event) {
                var targetForm = event.currentTarget;
                fireReferralEvent('form_submit', {
                    contactEmail: firstValue(targetForm, ['email', '_replyto', 'clientEmail']),
                    contactName: firstValue(targetForm, ['name', 'contactName', 'clientName', 'fullName']),
                    packageName: firstValue(targetForm, ['serviceType', 'packageName', 'packageKey'])
                });
            });
        }
    }

    /* ── Session ID for dedup / funnel tracking ── */
    function getSessionId() {
        try {
            var key = 'kl_sid';
            var id = sessionStorage.getItem(key);
            if (!id) {
                id = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
                sessionStorage.setItem(key, id);
            }
            return id;
        } catch (e) { return 'unknown'; }
    }

    /* ── Fire a referral event to the API (fire-and-forget) ── */
    function fireReferralEvent(eventType, extra) {
        var attr = readStorage();
        if (!attr) return; // nothing to attribute
        if (!attr.ref && !attr.offer) return;

        try {
            var payload = {
                eventType: eventType,
                referralPartner: attr.ref     || '',
                referralOffer:   attr.offer   || '',
                utmMedium:       attr.medium  || '',
                utmCampaign:     attr.campaign|| '',
                firstUrl:        attr.firstUrl|| '',
                pagePath:        window.location.pathname,
                sessionId:       getSessionId()
            };
            if (extra) {
                for (var k in extra) { if (extra.hasOwnProperty(k)) payload[k] = extra[k]; }
            }
            fetch('/api/referral-event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                keepalive: true
            }).catch(function () {});
        } catch (e) {}
    }

    /* ── Public helper for other pages to call ── */
    window.klTrackReferral = fireReferralEvent;
    window.klGetAttribution = getAttributionSnapshot;

    /* ── Entry point ── */
    captureFromUrl();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            injectAttributionFields();
            attachFormSubmitTracking();
            /* Fire pageview only on first page in session where ref/offer present */
            var attr = readStorage();
            if (attr && (attr.ref || attr.offer) && !sessionStorage.getItem('kl_pv_fired')) {
                sessionStorage.setItem('kl_pv_fired', '1');
                fireReferralEvent('pageview');
            }
        });
    } else {
        injectAttributionFields();
        attachFormSubmitTracking();
        var attr = readStorage();
        if (attr && (attr.ref || attr.offer) && !sessionStorage.getItem('kl_pv_fired')) {
            sessionStorage.setItem('kl_pv_fired', '1');
            fireReferralEvent('pageview');
        }
    }
}());
