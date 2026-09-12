import { readSession, clientVoterId } from '../../lib/social.js';
import { readJsonArray } from '../../lib/community.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Client-Id'
};
const ALLOWED = /^(pdf|png|jpe?g|jpg|webp|gif|avif|svg|docx?|xlsx?|pptx?|csv|tsv|zip|txt|md|markdown|html?|json|ya?ml|xml|toml|js|mjs|cjs|ts|py|rb|go|rs|java|c|h|cpp|cs|php|css|sh|sql|mmd|mermaid)$/i;
const MAX = 900000;

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS }
  });
}

function slugOf(request, body) {
  const url = new URL(request.url);
  return String((body && body.slug) || url.searchParams.get('slug') || '')
    .toLowerCase().replace(/[^a-z0-9-]+/g, '').slice(0, 48);
}

function listKey(slug) { return 'guide:files:' + slug; }
function blobKey(slug, id) { return 'guide:blob:' + slug + ':' + id; }

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const slug = slugOf(context.request, null);
  if (!slug) return json({ error: 'slug' }, 400);
  const id = String(url.searchParams.get('id') || '').slice(0, 40);
  const kv = context.env.BOT_MEMORY;
  if (id) {
    const raw = await kv.get(blobKey(slug, id));
    if (!raw) return json({ error: 'missing' }, 404);
    let rec;
    try { rec = JSON.parse(raw); } catch (e) { return json({ error: 'corrupt' }, 500); }
    const bytes = Uint8Array.from(atob(rec.b64 || ''), (c) => c.charCodeAt(0));
    const type = rec.type || 'application/octet-stream';
    const preview = url.searchParams.get('preview') === '1';
    const inline = preview || /^(image\/|application\/pdf|text\/|application\/json|image\/svg)/i.test(type);
    const safeName = String(rec.name || 'archivo').replace(/"/g, '');
    return new Response(bytes, {
      headers: {
        'Content-Type': type,
        'Content-Disposition': (inline ? 'inline' : 'attachment') + '; filename="' + safeName + '"',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, immutable',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-Content-Type-Options': 'nosniff'
      }
    });
  }
  const files = await readJsonArray(kv, listKey(slug));
  return new Response(JSON.stringify({ ok: true, slug, files: files.slice(0, 40) }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=30, s-maxage=120, stale-while-revalidate=300',
      ...CORS
    }
  });
}

export async function onRequestPost(context) {
  const kv = context.env && context.env.BOT_MEMORY;
  if (!kv) return json({ error: 'kv' }, 503);
  const session = await readSession(context.request, context.env);
  const body = await context.request.json().catch(() => null);
  const guest = String((body && (body.authorName || body.guestName)) || '').trim().slice(0, 40);
  const by = (session && (session.name || session.handle)) || guest;
  if (!by) return json({ error: 'name' }, 400);
  const slug = slugOf(context.request, body);
  const name = String((body && body.name) || 'archivo').slice(0, 120);
  const ext = String((body && body.ext) || (name.split('.').pop() || '')).toLowerCase();
  if (!slug || !ALLOWED.test(ext)) return json({ error: 'type' }, 400);
  const b64 = String((body && body.data) || '').replace(/^data:[^;]+;base64,/, '');
  let size = 0;
  try { size = Math.floor((b64.length * 3) / 4); } catch (e) { size = 0; }
  if (!b64 || size < 8 || size > MAX) return json({ error: 'size' }, 400);
  const id = crypto.randomUUID().slice(0, 12);
  const voter = clientVoterId(context.request, session);
  const meta = {
    id: id,
    name: name,
    ext: ext,
    type: String((body && body.type) || 'application/octet-stream').slice(0, 80),
    size: size,
    handle: (session && session.handle) || '',
    nameBy: by,
    voter: voter,
    createdAt: Date.now()
  };
  const list = await readJsonArray(kv, listKey(slug));
  list.unshift(meta);
  await kv.put(blobKey(slug, id), JSON.stringify({ name: meta.name, type: meta.type, b64: b64 }));
  await kv.put(listKey(slug), JSON.stringify(list.slice(0, 40)));
  return json({ ok: true, file: meta });
}

export async function onRequestDelete(context) {
  const kv = context.env && context.env.BOT_MEMORY;
  if (!kv) return json({ error: 'kv' }, 503);
  const session = await readSession(context.request, context.env);
  const voter = clientVoterId(context.request, session);
  const body = await context.request.json().catch(() => null);
  const slug = slugOf(context.request, body);
  const id = String((body && body.id) || '').slice(0, 40);
  if (!slug || !id) return json({ error: 'id' }, 400);
  const list = await readJsonArray(kv, listKey(slug));
  const target = list.filter((f) => f && f.id === id)[0];
  if (!target) return json({ ok: true });
  const allowed = (session && session.owner) ||
    (session && session.handle && target.handle === session.handle) ||
    (voter && target.voter && target.voter === voter);
  if (!allowed) return json({ error: 'forbidden' }, 403);
  await kv.delete(blobKey(slug, id));
  const next = list.filter((f) => f && f.id !== id);
  await kv.put(listKey(slug), JSON.stringify(next));
  return json({ ok: true });
}
