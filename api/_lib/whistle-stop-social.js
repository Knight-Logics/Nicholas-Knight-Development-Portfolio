'use strict';

const crypto = require('crypto');

const ALLOWED_ORIGINS = new Set([
  'https://knight-logics.github.io',
  'https://knightlogics.com',
  'https://www.knightlogics.com',
  'http://127.0.0.1:8080',
  'http://localhost:8080',
  'http://127.0.0.1:4178',
  'http://localhost:4178',
]);

const PLATFORMS = [
  {
    id: 'facebook',
    label: 'Facebook',
    group: 'Meta',
    charLimit: 63206,
    posterSupported: true,
    demoAccountId: 'fb_kl',
    productionNote: 'Posts via Graph API (Knight Logics Page until Whistle Stop token is wired).',
    status: 'demo_ready',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    group: 'Meta',
    charLimit: 2200,
    posterSupported: false,
    status: 'not_wired',
    limitation: 'Requires Meta Business API.',
  },
  {
    id: 'x',
    label: 'X (Twitter)',
    group: 'X',
    charLimit: 280,
    posterSupported: true,
    demoAccountId: 'x_kl',
    status: 'demo_ready',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    group: 'LinkedIn',
    charLimit: 3000,
    posterSupported: false,
    status: 'not_wired',
  },
  {
    id: 'gbp',
    label: 'Google Business Profile',
    group: 'Google',
    charLimit: 1500,
    posterSupported: false,
    gbp: true,
    status: 'manual_queue',
    limitation: 'Queued response only on Vercel — paste in Google until OAuth is wired.',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    group: 'TikTok',
    charLimit: 2200,
    posterSupported: false,
    status: 'not_wired',
  },
];

function getCorsHeaders(origin) {
  const allowed = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://knight-logics.github.io';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-WS-Social-Key',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function sendJson(res, status, body, corsHeaders) {
  res.writeHead(status, { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object' && !Buffer.isBuffer(req.body)) {
    return req.body;
  }
  const raw =
    typeof req.body === 'string'
      ? req.body
      : Buffer.isBuffer(req.rawBody)
        ? req.rawBody.toString('utf8')
        : '';
  if (!raw) return {};
  return JSON.parse(raw);
}

function authorizePost(req) {
  const required = process.env.WS_SOCIAL_API_KEY;
  if (!required) {
    return { ok: false, error: 'WS_SOCIAL_API_KEY is not configured on Vercel.' };
  }
  const header = req.headers['x-ws-social-key'] || req.headers['X-WS-Social-Key'];
  if (header !== required) {
    return { ok: false, error: 'Invalid or missing X-WS-Social-Key.' };
  }
  return { ok: true };
}

function fbConfigured() {
  return Boolean(process.env.WS_FB_PAGE_ID && process.env.WS_FB_PAGE_ACCESS_TOKEN);
}

function xConfigured() {
  const env = process.env;
  if (env.WS_X_API_KEY && env.WS_X_API_SECRET && env.WS_X_ACCESS_TOKEN && env.WS_X_ACCESS_TOKEN_SECRET) {
    return true;
  }
  return Boolean(env.WS_X_ACCESS_TOKEN || env.WS_X_BEARER_TOKEN);
}

function oauthEncode(value) {
  return encodeURIComponent(String(value))
    .replace(/!/g, '%21')
    .replace(/\*/g, '%2A')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29');
}

function createOauth1Header(method, url, extraParams = {}) {
  const env = process.env;
  const oauthParams = {
    oauth_consumer_key: env.WS_X_API_KEY,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_token: env.WS_X_ACCESS_TOKEN,
    oauth_version: '1.0',
  };
  const allParams = { ...oauthParams, ...extraParams };
  const normalized = Object.keys(allParams)
    .sort()
    .map((key) => `${oauthEncode(key)}=${oauthEncode(allParams[key])}`)
    .join('&');
  const baseString = [method.toUpperCase(), oauthEncode(url), oauthEncode(normalized)].join('&');
  const signingKey = `${oauthEncode(env.WS_X_API_SECRET)}&${oauthEncode(env.WS_X_ACCESS_TOKEN_SECRET)}`;
  const signature = crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
  const headerParams = { ...oauthParams, oauth_signature: signature };
  return (
    'OAuth ' +
    Object.keys(headerParams)
      .sort()
      .map((key) => `${oauthEncode(key)}="${oauthEncode(headerParams[key])}"`)
      .join(', ')
  );
}

function parseMediaBase64(mediaBase64) {
  if (!mediaBase64 || typeof mediaBase64 !== 'string') return null;
  const match = mediaBase64.match(/^data:((?:image|video)\/[a-z0-9.+-]+);base64,(.+)$/i);
  if (!match) return null;
  const mime = match[1].toLowerCase();
  const buffer = Buffer.from(match[2], 'base64');
  if (!buffer.length) return null;

  const extByMime = {
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
    'video/webm': 'webm',
    'video/x-m4v': 'm4v',
  };
  const ext = extByMime[mime] || (mime.startsWith('video/') ? 'mp4' : 'jpg');
  let kind = 'image';
  if (mime === 'image/gif') kind = 'gif';
  else if (mime.startsWith('video/')) kind = 'video';

  return { mime, buffer, filename: `upload.${ext}`, kind };
}

async function postFacebookTextOnly(text, pageId, token) {
  const body = new URLSearchParams({ message: text, access_token: token });
  const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, { method: 'POST', body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Facebook feed error ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

async function postFacebookWithVideo(text, media, pageId, token) {
  const uploadForm = new FormData();
  uploadForm.append('source', new Blob([media.buffer], { type: media.mime }), media.filename);
  uploadForm.append('description', text);
  uploadForm.append('access_token', token);
  const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/videos`, { method: 'POST', body: uploadForm });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Facebook video upload error ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

async function postFacebookWithPhoto(text, media, pageId, token) {
  const uploadForm = new FormData();
  uploadForm.append('source', new Blob([media.buffer], { type: media.mime }), media.filename);
  uploadForm.append('published', 'false');
  uploadForm.append('access_token', token);
  const uploadRes = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
    method: 'POST',
    body: uploadForm,
  });
  const uploadData = await uploadRes.json().catch(() => ({}));
  if (!uploadRes.ok) {
    const fallback = await postFacebookTextOnly(text, pageId, token);
    return { ...fallback, mediaWarning: 'Photo upload failed; posted text only.' };
  }

  const postForm = new URLSearchParams({
    message: text,
    attached_media: JSON.stringify([{ media_fbid: uploadData.id }]),
    access_token: token,
  });
  const postRes = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, { method: 'POST', body: postForm });
  const postData = await postRes.json().catch(() => ({}));
  if (!postRes.ok) throw new Error(`Facebook feed post error ${postRes.status}: ${JSON.stringify(postData)}`);
  return postData;
}

async function postFacebook(text, mediaBase64) {
  const pageId = process.env.WS_FB_PAGE_ID;
  const token = process.env.WS_FB_PAGE_ACCESS_TOKEN;
  if (!pageId || !token) {
    throw new Error('Facebook Graph API not configured (WS_FB_PAGE_ID / WS_FB_PAGE_ACCESS_TOKEN).');
  }

  const media = parseMediaBase64(mediaBase64);
  if (!media) return postFacebookTextOnly(text, pageId, token);
  if (media.kind === 'gif' || media.kind === 'video') {
    return postFacebookWithVideo(text, media, pageId, token);
  }
  return postFacebookWithPhoto(text, media, pageId, token);
}

function buildXUploadUrl(endpoint, params = {}) {
  const query = new URLSearchParams(params).toString();
  return query ? `${endpoint}?${query}` : endpoint;
}

async function runXUploadCommand(method, endpoint, params, body) {
  const res = await fetch(buildXUploadUrl(endpoint, params), {
    method,
    headers: { Authorization: createOauth1Header(method, endpoint, params) },
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`X media upload error ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

async function waitForXMediaProcessing(endpoint, mediaId, processingInfo) {
  let info = processingInfo || null;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (!info) return;
    if (info.state === 'succeeded') return;
    if (info.state === 'failed') {
      throw new Error(`X media processing failed: ${JSON.stringify(info.error || info)}`);
    }
    const waitMs = Math.max(Number(info.check_after_secs || 2), 1) * 1000;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
    const status = await runXUploadCommand('GET', endpoint, { command: 'STATUS', media_id: mediaId });
    info = status.processing_info || null;
  }
  throw new Error(`X media processing timeout for media_id ${mediaId}`);
}

async function uploadXChunkedMedia(buffer, mime, filename, mediaCategory) {
  const endpoint = 'https://upload.twitter.com/1.1/media/upload.json';
  const initData = await runXUploadCommand('POST', endpoint, {
    command: 'INIT',
    total_bytes: String(buffer.length),
    media_type: mime,
    media_category: mediaCategory,
  });
  if (!initData.media_id_string) {
    throw new Error(`X media INIT missing media_id_string: ${JSON.stringify(initData)}`);
  }

  const mediaId = initData.media_id_string;
  const chunkSize = 4 * 1024 * 1024;
  for (let segmentIndex = 0, offset = 0; offset < buffer.length; segmentIndex += 1, offset += chunkSize) {
    const chunk = buffer.subarray(offset, Math.min(offset + chunkSize, buffer.length));
    const form = new FormData();
    form.append('media', new Blob([chunk], { type: mime }), filename);
    await runXUploadCommand(
      'POST',
      endpoint,
      { command: 'APPEND', media_id: mediaId, segment_index: String(segmentIndex) },
      form
    );
  }

  const finalizeData = await runXUploadCommand('POST', endpoint, {
    command: 'FINALIZE',
    media_id: mediaId,
  });
  await waitForXMediaProcessing(endpoint, mediaId, finalizeData.processing_info);
  return mediaId;
}

async function uploadXMediaSimple(buffer, mime, filename) {
  const endpoint = 'https://upload.twitter.com/1.1/media/upload.json';
  const form = new FormData();
  form.append('media', new Blob([buffer], { type: mime }), filename);
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { Authorization: createOauth1Header('POST', endpoint) },
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`X media upload error ${res.status}: ${JSON.stringify(data)}`);
  if (!data.media_id_string) throw new Error('X media upload missing media_id_string');
  return data.media_id_string;
}

async function uploadXMediaFromParsed(media) {
  if (!process.env.WS_X_API_KEY) {
    throw new Error('X media upload requires OAuth1 keys (WS_X_API_KEY + secret + tokens).');
  }
  if (media.kind === 'gif') {
    return uploadXChunkedMedia(media.buffer, media.mime, media.filename, 'tweet_gif');
  }
  if (media.kind === 'video') {
    return uploadXChunkedMedia(media.buffer, media.mime, media.filename, 'tweet_video');
  }
  return uploadXMediaSimple(media.buffer, media.mime, media.filename);
}

async function postX(text, mediaBase64) {
  if (!xConfigured()) {
    throw new Error('X API not configured (WS_X_* env vars on Vercel).');
  }

  let mediaId = null;
  const media = parseMediaBase64(mediaBase64);
  if (media) mediaId = await uploadXMediaFromParsed(media);

  const body = { text: text.slice(0, 280) };
  if (mediaId) body.media = { media_ids: [mediaId] };

  const endpoint = 'https://api.x.com/2/tweets';
  const headers = { 'Content-Type': 'application/json' };
  if (process.env.WS_X_API_KEY && process.env.WS_X_API_SECRET) {
    headers.Authorization = createOauth1Header('POST', endpoint);
  } else {
    headers.Authorization = `Bearer ${process.env.WS_X_ACCESS_TOKEN || process.env.WS_X_BEARER_TOKEN}`;
  }

  const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`X API error ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

function queueGbp(text, gbpOptions, mediaBase64) {
  const media = parseMediaBase64(mediaBase64);
  const hasMedia = Boolean(media);
  let message = 'GBP draft noted — paste into Google Business Profile.';
  if (media?.kind === 'video') {
    message = 'GBP queue saved — upload this video manually in Google Business Profile (API does not support video).';
  } else if (media?.kind === 'gif') {
    message = 'GBP queue saved — use a still image in Google (GIFs do not animate via API).';
  } else if (hasMedia) {
    message = 'GBP draft noted — copy text and upload photo in Google Business Profile (OAuth queue coming).';
  }

  return {
    platform: 'gbp',
    label: 'Google Business Profile',
    status: 'queued_manual',
    message,
    queue: {
      topicType: gbpOptions?.topicType || 'STANDARD',
      callToAction: gbpOptions?.callToAction || null,
      callToActionUrl: gbpOptions?.callToActionUrl || null,
      text: text.slice(0, 1500),
      hasMedia,
      mediaKind: media?.kind || null,
    },
  };
}

async function handlePost(body) {
  const text = String(body.text || '').trim();
  const platforms = Array.isArray(body.platforms) ? body.platforms : [];
  const mediaBase64 = body.mediaBase64 || '';
  const gbpOptions = body.gbp || {};

  if (!text) throw new Error('Post text is required');
  if (!platforms.length) throw new Error('Select at least one platform');

  const results = [];

  for (const pid of platforms) {
    if (pid === 'facebook') {
      if (!fbConfigured()) {
        results.push({
          platform: 'facebook',
          label: 'Facebook',
          status: 'error',
          error: 'Facebook not configured on server.',
        });
        continue;
      }
      try {
        const data = await postFacebook(text, mediaBase64);
        const media = parseMediaBase64(mediaBase64);
        let fbMessage = data.mediaWarning || 'Posted via Graph API.';
        if (media?.kind === 'gif') fbMessage = 'GIF posted via Facebook video API (loops on Page).';
        else if (media?.kind === 'video') fbMessage = 'Video posted via Graph API.';
        else if (media) fbMessage = data.mediaWarning || 'Photo posted via Graph API.';
        results.push({
          platform: 'facebook',
          label: 'Facebook',
          status: 'ok',
          postId: data.id,
          message: fbMessage,
          demo: true,
        });
      } catch (err) {
        results.push({ platform: 'facebook', label: 'Facebook', status: 'error', error: err.message });
      }
      continue;
    }

    if (pid === 'x') {
      try {
        const data = await postX(text, mediaBase64);
        const tweetId = data?.data?.id;
        const media = parseMediaBase64(mediaBase64);
        let xMessage = 'Posted via X API.';
        if (media?.kind === 'gif') xMessage = 'Animated GIF posted via X API.';
        else if (media?.kind === 'video') xMessage = 'Video posted via X API.';
        else if (media) xMessage = 'Image posted via X API.';
        results.push({
          platform: 'x',
          label: 'X (Twitter)',
          status: 'ok',
          postId: tweetId,
          message: xMessage,
          demo: true,
        });
      } catch (err) {
        results.push({ platform: 'x', label: 'X (Twitter)', status: 'error', error: err.message });
      }
      continue;
    }

    if (pid === 'gbp') {
      results.push(queueGbp(text, gbpOptions, mediaBase64));
      continue;
    }

    const meta = PLATFORMS.find((p) => p.id === pid);
    results.push({
      platform: pid,
      label: meta?.label || pid,
      status: 'not_wired',
      error: meta?.limitation || 'Not connected',
    });
  }

  return {
    ok: true,
    entry: {
      id: `post_${Date.now()}`,
      createdAt: new Date().toISOString(),
      text: text.slice(0, 500),
      platforms,
      results,
      via: 'vercel',
    },
    results,
  };
}

function getPlatformsPayload() {
  const platforms = PLATFORMS.map((p) => {
    let connection = p.status;
    if (p.id === 'facebook') connection = fbConfigured() ? 'demo_ready' : 'needs_login';
    else if (p.id === 'x') connection = xConfigured() ? 'demo_ready' : 'needs_login';
    else if (p.gbp) connection = 'manual_queue';
    else if (!p.posterSupported) connection = 'not_wired';
    return { ...p, connection };
  });

  return {
    ok: true,
    demoMode: true,
    client: 'Whistle Stop Grill & Bar',
    service: 'knightlogics-vercel-social',
    platforms,
    gbpLimitations: {
      apiSupported: ['STANDARD', 'EVENT', 'OFFER'],
      mediaSupported: ['1 still photo per post (PHOTO via public URL)'],
      mediaNotSupported: ['video on local posts', 'animated GIF playback via API', 'multiple photos per post via API'],
      rateLimit: '10 edits per minute per profile',
      oauthScope: 'https://www.googleapis.com/auth/business.manage',
    },
  };
}

module.exports = {
  ALLOWED_ORIGINS,
  getCorsHeaders,
  sendJson,
  readJsonBody,
  authorizePost,
  handlePost,
  getPlatformsPayload,
  fbConfigured,
  xConfigured,
};
