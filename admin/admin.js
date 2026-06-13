(function () {
    'use strict';

    var SITE = window.location.origin;
    var SESSION_KEY = 'kl_admin_session';
    var SECRET_KEY = 'kl_admin_secret';
    var ROLE_KEY = 'kl_admin_role';
    var LOG_MAX = 250;

    var AGENCY_MODULES = ['outreach', 'email', 'social-ops', 'social-poster', 'access'];

    var MODULES = {
        overview: { label: 'Command Center', panel: 'panel-overview' },
        referrals: { label: 'Referrals', panel: 'panel-referrals', embed: '/referral-dashboard?embed=1' },
        outreach: {
            label: 'Outreach CRM',
            panel: 'panel-outreach',
            localUrl: 'http://127.0.0.1:5050/',
            help: 'Run OutreachEngine: cd CRM\\OutreachEngine && python app.py',
        },
        email: {
            label: 'Email Agent',
            panel: 'panel-email',
            localUrl: 'http://127.0.0.1:5100/',
            help: 'Started automatically from Knight Command when reachable, or run Email-Agent\\web.py',
        },
        'social-ops': {
            label: 'Social Ops',
            panel: 'panel-social-ops',
            localUrl: 'http://127.0.0.1:8500/?embed=true',
            help: 'Run Social-Media-Manager\\run_social_services_hidden.ps1',
        },
        'social-poster': {
            label: 'Social Poster',
            panel: 'panel-social-poster',
            localUrl: 'http://127.0.0.1:8501/?embed=true',
            help: 'Run Social-Media-Manager\\run_social_services_hidden.ps1',
        },
        logs: { label: 'Logs', panel: 'panel-logs' },
        access: { label: 'Access', panel: 'panel-access', masterOnly: true },
    };

    var state = {
        token: '',
        secret: '',
        role: '',
        activeModule: 'overview',
        logs: [],
        health: null,
        localProbe: {},
    };

    function $(id) { return document.getElementById(id); }

    function log(level, message, detail) {
        var entry = {
            ts: new Date().toISOString(),
            level: level,
            message: message,
            detail: detail || null,
        };
        state.logs.unshift(entry);
        if (state.logs.length > LOG_MAX) {
            state.logs.length = LOG_MAX;
        }
        var prefix = '[Knight Command]';
        if (level === 'error') console.error(prefix, message, detail || '');
        else if (level === 'warn') console.warn(prefix, message, detail || '');
        else console.log(prefix, message, detail || '');
        renderLogs();
    }

    function saveSession(token, role) {
        state.token = token;
        state.role = role || '';
        sessionStorage.setItem(SESSION_KEY, token);
        if (role) sessionStorage.setItem(ROLE_KEY, role);
    }

    function loadSessionRole() {
        return sessionStorage.getItem(ROLE_KEY) || '';
    }

    function clearSession() {
        state.token = '';
        state.secret = '';
        state.role = '';
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SECRET_KEY);
        sessionStorage.removeItem(ROLE_KEY);
    }

    function applyRoleUi() {
        var isMaster = state.role === 'master';
        var badge = $('role-badge');
        if (badge) {
            badge.hidden = !state.role;
            badge.textContent = isMaster ? 'Master' : 'Owner';
            badge.className = 'kc-role-badge ' + (isMaster ? 'master' : 'owner');
        }
        var accessTab = $('tab-access');
        if (accessTab) accessTab.hidden = !isMaster;
        AGENCY_MODULES.forEach(function (moduleId) {
            var tab = document.querySelector('.kc-tab[data-module="' + moduleId + '"]');
            if (tab) tab.hidden = !isMaster;
        });
    }

    function canOpenModule(moduleId) {
        if (state.role === 'master') return true;
        return AGENCY_MODULES.indexOf(moduleId) < 0;
    }

    async function apiPost(path, body) {
        var payload = Object.assign({}, body || {});
        if (state.token && !payload.token && !payload.secret) {
            payload.token = state.token;
        }
        log('info', 'API POST ' + path, payload.token ? { token: '(session)' } : undefined);
        var response = await fetch(SITE + path, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        var data = {};
        try {
            data = await response.json();
        } catch (err) {
            data = { error: 'Non-JSON response (' + response.status + ')' };
        }
        if (!response.ok) {
            log('error', path + ' failed', { status: response.status, data: data });
            throw new Error((data && data.error) || ('HTTP ' + response.status));
        }
        log('info', path + ' OK');
        return data;
    }

    function showAuth(show) {
        $('auth-gate').style.display = show ? 'flex' : 'none';
        $('kc-shell').classList.toggle('open', !show);
    }

    function renderLogs() {
        var list = $('log-list');
        if (!list) return;
        if (!state.logs.length) {
            list.innerHTML = '<li><span class="ts">—</span>No log entries yet.</li>';
            return;
        }
        list.innerHTML = state.logs.map(function (entry) {
            var detail = entry.detail ? ' — ' + JSON.stringify(entry.detail) : '';
            return '<li><span class="ts">' + entry.ts + '</span>' +
                '<span class="lvl-' + entry.level + '">[' + entry.level.toUpperCase() + ']</span> ' +
                entry.message + detail + '</li>';
        }).join('');
    }

    function setActiveModule(moduleId) {
        if (!MODULES[moduleId]) return;
        if (!canOpenModule(moduleId)) {
            moduleId = 'overview';
        }
        state.activeModule = moduleId;
        document.querySelectorAll('.kc-tab').forEach(function (tab) {
            tab.classList.toggle('active', tab.dataset.module === moduleId);
        });
        document.querySelectorAll('.kc-panel').forEach(function (panel) {
            panel.classList.remove('open');
        });
        var cfg = MODULES[moduleId];
        var panel = $(cfg.panel);
        if (panel) panel.classList.add('open');

        if (cfg.embed) {
            mountEmbed(cfg.panel.replace('panel-', ''), cfg.embed);
        } else if (cfg.localUrl) {
            mountLocalEmbed(cfg.panel.replace('panel-', ''), cfg.localUrl, cfg.help || '');
        } else if (moduleId === 'overview') {
            refreshOverview();
        } else if (moduleId === 'access') {
            refreshAccessPanel();
        }
    }

    function mountEmbed(prefix, src) {
        var frame = $(prefix + '-frame');
        if (!frame) return;
        if (state.secret) {
            sessionStorage.setItem(SECRET_KEY, state.secret);
        }
        if (state.token) {
            sessionStorage.setItem(SESSION_KEY, state.token);
        }
        if (state.role) {
            sessionStorage.setItem(ROLE_KEY, state.role);
        }
        if (frame.dataset.loaded !== src) {
            frame.src = src;
            frame.dataset.loaded = src;
            log('info', 'Embed loaded', { src: src });
        }
    }

    function mountLocalEmbed(prefix, url, help) {
        var wrap = $('embed-status-' + prefix);
        var frame = $(prefix + '-frame');
        if (!frame) return;
        if (wrap) {
            wrap.classList.add('open');
            wrap.querySelector('[data-embed-title]').textContent = 'Connecting to local service…';
            wrap.querySelector('[data-embed-detail]').textContent = help || 'Service must run on this PC.';
        }
        frame.onload = function () {
            if (wrap) wrap.classList.remove('open');
            log('info', 'Local iframe loaded', { url: url });
        };
        frame.onerror = function () {
            if (wrap) {
                wrap.classList.add('open');
                wrap.querySelector('[data-embed-title]').textContent = 'Local service unreachable';
                wrap.querySelector('[data-embed-detail]').textContent = (help || '') + ' Open the URL directly if the embed stays blank.';
            }
            log('warn', 'Local iframe error', { url: url });
        };
        if (frame.dataset.loaded !== url) {
            frame.src = url;
            frame.dataset.loaded = url;
        }
        probeLocal(url, prefix);
    }

    async function probeLocal(url, prefix) {
        var statusEl = $('local-status-' + prefix);
        if (statusEl) {
            statusEl.className = 'kc-status pending';
            statusEl.textContent = 'Checking…';
        }
        try {
            var controller = new AbortController();
            var timer = setTimeout(function () { controller.abort(); }, 2500);
            await fetch(url, { mode: 'no-cors', signal: controller.signal });
            clearTimeout(timer);
            state.localProbe[prefix] = 'maybe';
            if (statusEl) {
                statusEl.className = 'kc-status warn';
                statusEl.textContent = 'Probe sent — confirm in iframe';
            }
            log('info', 'Local probe dispatched', { url: url });
        } catch (err) {
            state.localProbe[prefix] = 'fail';
            if (statusEl) {
                statusEl.className = 'kc-status err';
                statusEl.textContent = 'Not reachable from browser';
            }
            log('warn', 'Local probe failed (expected off-PC or service stopped)', { url: url, error: String(err) });
        }
    }

    async function refreshOverview() {
        var grid = $('overview-grid');
        if (grid) {
            grid.innerHTML = '<div class="kc-card"><h3>Status</h3><strong>Loading…</strong><p>Checking cloud modules.</p></div>';
        }
        try {
            var health = await apiPost('/api/admin-health', {});
            state.health = health;
            renderOverview(health);
        } catch (err) {
            if (String(err.message).indexOf('expired') >= 0 || String(err.message).indexOf('Forbidden') >= 0) {
                logout(true);
                return;
            }
            if (grid) {
                grid.innerHTML = '<div class="kc-card"><span class="kc-status err">Error</span><strong>Health check failed</strong><p>' +
                    String(err.message) + '</p></div>';
            }
        }
    }

    function renderOverview(health) {
        var grid = $('overview-grid');
        var notes = $('overview-notes');
        if (!grid) return;

        var cards = [];
        Object.keys(health.modules || {}).forEach(function (key) {
            var mod = health.modules[key];
            cards.push(
                '<div class="kc-card">' +
                '<span class="kc-status ' + (mod.status === 'ok' ? 'ok' : 'err') + '">' + mod.status + '</span>' +
                '<strong>' + mod.label + '</strong>' +
                '<p>' + mod.detail + '</p></div>'
            );
        });

        (health.localModules || []).forEach(function (mod) {
            var probe = state.localProbe[mod.id.replace(/_/g, '-')] || 'pending';
            var statusClass = probe === 'maybe' ? 'warn' : (probe === 'fail' ? 'err' : 'pending');
            cards.push(
                '<div class="kc-card">' +
                '<span class="kc-status ' + statusClass + '" id="local-status-' + mod.id.replace(/_/g, '-') + '">local</span>' +
                '<strong>' + mod.label + '</strong>' +
                '<p>Port ' + mod.port + ' — ' + mod.url + '</p>' +
                '<a class="kc-btn kc-btn-ghost" href="' + mod.url + '" target="_blank" rel="noopener">Open ↗</a></div>'
            );
        });

        grid.innerHTML = cards.join('');

        if (notes && health.notes) {
            notes.innerHTML = health.notes.map(function (n) { return '<div class="kc-note">' + n + '</div>'; }).join('');
        }

        (health.localModules || []).forEach(function (mod) {
            probeLocal(mod.url, mod.id.replace(/_/g, '-'));
        });
    }

    async function tryRestoreSession() {
        var token = sessionStorage.getItem(SESSION_KEY) || '';
        if (!token) return false;
        state.token = token;
        state.role = loadSessionRole();
        try {
            var data = await apiPost('/api/admin-auth', { action: 'verify', token: token });
            state.role = data.role || state.role;
            applyRoleUi();
            showAuth(false);
            log('info', 'Session restored', { role: state.role });
            setActiveModule('overview');
            return true;
        } catch (err) {
            clearSession();
            log('warn', 'Stored session invalid', { error: String(err.message) });
            return false;
        }
    }

    async function login(secret) {
        var data = await apiPost('/api/admin-auth', { secret: secret });
        state.secret = secret;
        state.role = data.role || 'master';
        sessionStorage.setItem(SECRET_KEY, secret);
        saveSession(data.token, state.role);
        applyRoleUi();
        showAuth(false);
        log('info', 'Login successful', { expiresAt: data.expiresAt, role: state.role });
        setActiveModule('overview');
    }

    async function loadForgotInfo() {
        try {
            var data = await fetch(SITE + '/api/admin-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'forgot-info' }),
            }).then(function (r) { return r.json(); });
            var contact = data.contact || {};
            var copy = (contact.note || '') +
                ' Contact: ' + (contact.email || 'nknight@knightgroup.com') + '.';
            var forgotCopy = $('forgot-copy');
            if (forgotCopy) forgotCopy.textContent = copy;
            var accessCopy = $('access-forgot-copy');
            if (accessCopy) {
                accessCopy.textContent = copy + ' Master passwords are updated in the Vercel project environment variables.';
            }
        } catch (err) {
            log('warn', 'Forgot-info load failed', { error: String(err.message) });
        }
    }

    async function refreshAccessPanel() {
        if (state.role !== 'master') return;
        var statusEl = $('owner-status');
        try {
            var data = await apiPost('/api/admin-auth', { action: 'owner-status' });
            if (statusEl) {
                statusEl.textContent = data.ownerConfigured
                    ? 'Owner password is configured.'
                    : 'No owner password yet — set one below before handing dashboard access to a site owner.';
            }
        } catch (err) {
            if (statusEl) statusEl.textContent = 'Could not load owner status.';
        }
    }

    async function saveOwnerPassword(password) {
        var msg = $('owner-password-msg');
        await apiPost('/api/admin-auth', {
            action: 'set-owner-password',
            newPassword: password,
        });
        if (msg) {
            msg.style.display = 'block';
            msg.textContent = 'Owner password saved.';
            msg.style.color = 'var(--ok)';
        }
        refreshAccessPanel();
        log('info', 'Owner password updated');
    }

    function logout(silent) {
        clearSession();
        applyRoleUi();
        showAuth(true);
        document.querySelectorAll('.kc-panel iframe').forEach(function (frame) {
            frame.src = 'about:blank';
            frame.dataset.loaded = '';
        });
        if (!silent) log('info', 'Logged out');
    }

    function bindTabs() {
        document.querySelectorAll('.kc-tab').forEach(function (tab) {
            tab.addEventListener('click', function () {
                setActiveModule(tab.dataset.module);
            });
        });
    }

    function bindAuth() {
        $('auth-form').addEventListener('submit', function (e) {
            e.preventDefault();
            var secret = $('secret-input').value.trim();
            if (!secret) return;
            $('auth-error').style.display = 'none';
            login(secret).catch(function (err) {
                $('auth-error').textContent = err.message || 'Login failed';
                $('auth-error').style.display = 'block';
            });
        });
        $('logout-btn').addEventListener('click', function () { logout(false); });
        $('refresh-overview-btn').addEventListener('click', refreshOverview);
        $('forgot-toggle').addEventListener('click', function () {
            var panel = $('forgot-panel');
            if (!panel) return;
            panel.hidden = !panel.hidden;
        });
        $('owner-password-form').addEventListener('submit', function (e) {
            e.preventDefault();
            var next = $('owner-password-input').value;
            var confirm = $('owner-password-confirm').value;
            var msg = $('owner-password-msg');
            if (next.length < 8) {
                if (msg) {
                    msg.style.display = 'block';
                    msg.style.color = 'var(--err)';
                    msg.textContent = 'Owner password must be at least 8 characters.';
                }
                return;
            }
            if (next !== confirm) {
                if (msg) {
                    msg.style.display = 'block';
                    msg.style.color = 'var(--err)';
                    msg.textContent = 'Passwords do not match.';
                }
                return;
            }
            saveOwnerPassword(next).catch(function (err) {
                if (msg) {
                    msg.style.display = 'block';
                    msg.style.color = 'var(--err)';
                    msg.textContent = err.message || 'Could not save owner password.';
                }
            });
        });
        $('clear-logs-btn').addEventListener('click', function () {
            state.logs = [];
            renderLogs();
            log('info', 'Log buffer cleared');
        });
        $('copy-logs-btn').addEventListener('click', function () {
            var text = state.logs.map(function (e) {
                return e.ts + ' [' + e.level + '] ' + e.message + (e.detail ? ' ' + JSON.stringify(e.detail) : '');
            }).join('\n');
            navigator.clipboard.writeText(text).then(function () {
                log('info', 'Logs copied to clipboard');
            }).catch(function (err) {
                log('error', 'Copy failed', { error: String(err) });
            });
        });

        document.querySelectorAll('[data-open-local]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var url = btn.getAttribute('data-open-local');
                window.open(url, '_blank', 'noopener');
            });
        });
    }

    bindTabs();
    bindAuth();
    renderLogs();
    loadForgotInfo();
    log('info', 'Knight Command shell initialized', { site: SITE });
    tryRestoreSession().then(function (ok) {
        if (!ok) showAuth(true);
    });
})();
