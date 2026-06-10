'use strict';

const lib = require('./_lib/whistle-stop-social');

function routeSegment(req) {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const parts = url.pathname.replace(/^\/api\/whistle-stop-social\/?/, '').split('/').filter(Boolean);
    if (parts[0]) return parts[0];
    const fromSearch = url.searchParams.get('route');
    if (fromSearch) return fromSearch.split('/')[0];
  } catch (_) {}

  const query = req.query || {};
  const q = query.route;
  if (typeof q === 'string' && q) return q.split('/')[0];
  if (Array.isArray(q) && q[0]) return String(q[0]).split('/')[0];

  return 'health';
}

module.exports = async function handler(req, res) {
  try {
    const origin = req.headers.origin || '';
    const cors = lib.getCorsHeaders(origin);

    if (req.method === 'OPTIONS') {
      res.writeHead(204, cors);
      return res.end();
    }

    const route = routeSegment(req);

    if (route === 'health' || route === '') {
      if (req.method !== 'GET') {
        return lib.sendJson(res, 405, { ok: false, error: 'Method not allowed' }, cors);
      }
      return lib.sendJson(
        res,
        200,
        {
          ok: true,
          service: 'whistle-stop-social-vercel',
          facebook: lib.fbConfigured(),
          x: lib.xConfigured(),
          demoMode: true,
        },
        cors
      );
    }

    if (route === 'platforms') {
      if (req.method !== 'GET') {
        return lib.sendJson(res, 405, { ok: false, error: 'Method not allowed' }, cors);
      }
      return lib.sendJson(res, 200, lib.getPlatformsPayload(), cors);
    }

    if (route === 'post') {
      if (req.method !== 'POST') {
        return lib.sendJson(res, 405, { ok: false, error: 'Method not allowed' }, cors);
      }
      const auth = lib.authorizePost(req);
      if (!auth.ok) {
        return lib.sendJson(res, 401, { ok: false, error: auth.error }, cors);
      }
      try {
        const body = await lib.readJsonBody(req);
        const payload = await lib.handlePost(body);
        return lib.sendJson(res, 200, payload, cors);
      } catch (err) {
        return lib.sendJson(res, 400, { ok: false, error: err.message || String(err) }, cors);
      }
    }

    if (route === 'history') {
      if (req.method !== 'GET') {
        return lib.sendJson(res, 405, { ok: false, error: 'Method not allowed' }, cors);
      }
      return lib.sendJson(
        res,
        200,
        {
          ok: true,
          history: [],
          note: 'Post history is stored in the staff browser (localStorage) on the Vercel bridge.',
        },
        cors
      );
    }

    return lib.sendJson(res, 404, { ok: false, error: 'Not found' }, cors);
  } catch (err) {
    return lib.sendJson(
      res,
      500,
      { ok: false, error: err.message || 'Internal server error' },
      lib.getCorsHeaders(req.headers.origin || '')
    );
  }
};
