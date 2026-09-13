import { loadGuideBySlug } from '../../lib/community.js';
import { STATIC_SLUGS } from '../../lib/feed.js';
import { createShort, ownShortUrl } from '../../lib/shorten.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

export async function onRequestPost(context) {
  const kv = context.env && context.env.BOT_MEMORY;
  if (!kv) return json({ error: 'kv' }, 503);
  const body = await context.request.json().catch(() => null);
  const slug = String((body && body.slug) || '').toLowerCase().replace(/[^a-z0-9-]+/g, '').slice(0, 48);
  if (!slug) return json({ error: 'slug' }, 400);
  const exists = (await loadGuideBySlug(kv, slug)) || STATIC_SLUGS[slug];
  if (!exists) return json({ error: 'missing' }, 404);

  const rec = await createShort(kv, { slug });
  const shortUrl = ownShortUrl(rec.code);
  return json({
    ok: true,
    slug,
    code: rec.code,
    own: shortUrl,
    discreet: shortUrl,
    bitly: null,
    cloak: shortUrl,
    compact: shortUrl,
    short: shortUrl,
    url: shortUrl
  });
}
