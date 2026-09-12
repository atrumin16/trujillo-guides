import { loadStats, saveStats, loadPinned, savePinned, readSession, canPin } from '../../lib/social.js';
import { STATIC_SLUGS } from '../../lib/feed.js';
import { loadGuideBySlug } from '../../lib/community.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Client-Id',
  'Access-Control-Allow-Credentials': 'true'
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
  const session = await readSession(context.request, context.env);
  if (!session) return json({ error: 'login', login: 'https://ai.trujillomingorance.com/login' }, 401);
  const body = await context.request.json().catch(() => null);
  const slug = String((body && body.slug) || '').toLowerCase().replace(/[^a-z0-9-]+/g, '').slice(0, 48);
  if (!slug) return json({ error: 'slug' }, 400);
  const record = (await loadGuideBySlug(kv, slug)) || STATIC_SLUGS[slug] || { slug, handle: '' };
  if (!canPin(session, record)) return json({ error: 'forbidden' }, 403);
  const want = body.pinned !== false && body.pinned !== 0 && body.pinned !== '0';
  const stats = await loadStats(kv, slug);
  stats.pinned = want;
  await saveStats(kv, slug, stats);
  let pinned = await loadPinned(kv);
  pinned = pinned.filter((s) => s !== slug);
  if (want) pinned.unshift(slug);
  await savePinned(kv, pinned);
  return json({ ok: true, slug, pinned: want, likes: stats.likes, list: pinned });
}
