import { createShort, ownShortUrl, resolveShort } from '../lib/shorten.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Client-Id'
};

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS }
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestGet(context) {
  const code = String(new URL(context.request.url).searchParams.get('code') || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
  if (!code) return json({ error: 'code' }, 400);
  const rec = await resolveShort(context.env.BOT_MEMORY, code);
  if (!rec) return json({ error: 'missing' }, 404);
  const shortUrl = ownShortUrl(code);
  return json({ ok: true, code, slug: rec.slug || '', clicks: rec.clicks || 0, url: shortUrl, short: shortUrl });
}

export async function onRequestPost(context) {
  const kv = context.env && context.env.BOT_MEMORY;
  if (!kv) return json({ error: 'kv' }, 503);
  const body = await context.request.json().catch(() => null);
  const target = String((body && (body.url || body.href)) || '').trim();
  if (!/^https:\/\//i.test(target) || target.length > 1500) return json({ error: 'url' }, 400);

  const rec = await createShort(kv, { url: target, slug: String((body && body.slug) || '') });
  const shortUrl = ownShortUrl(rec.code);
  return json({
    ok: true,
    code: rec.code,
    own: shortUrl,
    discreet: shortUrl,
    bitly: null,
    url: shortUrl,
    short: shortUrl
  });
}
