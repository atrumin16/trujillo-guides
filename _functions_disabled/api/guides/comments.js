import { readSession, clientVoterId } from '../../lib/social.js';
import { readJsonArray } from '../../lib/community.js';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Client-Id'
};
const INSULTS = /\b(idiota|imbecil|imbécil|estupido|estúpido|mierda|cabr[oó]n|hijo\s*de\s*puta|gilipollas|puta)\b/i;
const SPAM = /\b(crypto\s*airdrop|guaranteed\s*profit|buy\s*followers|casino\s*bonus|viagra)\b/i;

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

function key(slug) {
  return 'guide:comments:' + slug;
}

function moderate(text) {
  const t = String(text || '').trim();
  if (t.length < 2) return 'too_short';
  if (t.length > 2000) return 'too_long';
  if (INSULTS.test(t) || SPAM.test(t)) return 'blocked';
  return '';
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestGet(context) {
  const slug = slugOf(context.request, null);
  if (!slug) return json({ error: 'slug' }, 400);
  const comments = await readJsonArray(context.env.BOT_MEMORY, key(slug));
  return new Response(JSON.stringify({ ok: true, slug, comments: comments.slice(0, 200) }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=15, s-maxage=60, stale-while-revalidate=120',
      ...CORS
    }
  });
}

export async function onRequestPost(context) {
  const kv = context.env && context.env.BOT_MEMORY;
  if (!kv) return json({ error: 'kv' }, 503);
  const body = await context.request.json().catch(() => null);
  const slug = slugOf(context.request, body);
  if (!slug) return json({ error: 'slug' }, 400);
  const session = await readSession(context.request, context.env);
  const voter = clientVoterId(context.request, session);
  if (body && body.id && (body.vote === 1 || body.vote === 'up' || body.vote === -1 || body.vote === 'down')) {
    const comments = await readJsonArray(kv, key(slug));
    const target = comments.filter((c) => c && c.id === body.id)[0];
    if (!target || !voter) return json({ error: 'comment' }, 400);
    const dir = body.vote === -1 || body.vote === 'down' ? -1 : 1;
    target.votes = target.votes || {};
    if (target.votes[voter] === dir) delete target.votes[voter];
    else target.votes[voter] = dir;
    let up = 0;
    Object.keys(target.votes).forEach((k) => { if (target.votes[k] === -1) up -= 1; else up += 1; });
    target.score = up;
    await kv.put(key(slug), JSON.stringify(comments));
    return json({ ok: true, id: target.id, score: target.score });
  }
  if (body && body.id && body.text != null && body.vote == null) {
    const comments = await readJsonArray(kv, key(slug));
    const target = comments.filter((c) => c && c.id === body.id)[0];
    if (!target) return json({ error: 'comment' }, 404);
    const allowed = (session && session.owner) || (target.voter && target.voter === voter) ||
      (session && session.handle && target.handle === session.handle);
    if (!allowed) return json({ error: 'forbidden' }, 403);
    const nextText = String(body.text || '').trim();
    const badEdit = moderate(nextText);
    if (badEdit) return json({ error: badEdit }, 400);
    target.text = nextText;
    target.editedAt = Date.now();
    await kv.put(key(slug), JSON.stringify(comments));
    return json({ ok: true, comment: target });
  }
  const text = String((body && body.text) || '').trim();
  const bad = moderate(text);
  if (bad) return json({ error: bad }, 400);
  const guest = String((body && (body.name || body.authorName)) || '').trim().slice(0, 40);
  const name = (session && (session.name || session.handle)) || guest;
  if (!name) return json({ error: 'name' }, 400);
  const parentId = String((body && body.parentId) || '').slice(0, 40);
  const comments = await readJsonArray(kv, key(slug));
  if (parentId && !comments.some((c) => c && c.id === parentId)) return json({ error: 'parent' }, 400);
  const item = {
    id: crypto.randomUUID().slice(0, 12),
    parentId: parentId || '',
    text: text,
    name: name,
    handle: (session && session.handle) || '',
    picture: (session && session.picture) || '/avatar.png',
    voter: voter,
    score: 0,
    votes: {},
    createdAt: Date.now()
  };
  comments.push(item);
  await kv.put(key(slug), JSON.stringify(comments.slice(-200)));
  return json({ ok: true, comment: item, count: comments.length });
}

export async function onRequestDelete(context) {
  const kv = context.env && context.env.BOT_MEMORY;
  if (!kv) return json({ error: 'kv' }, 503);
  const body = await context.request.json().catch(() => null);
  const slug = slugOf(context.request, body);
  const id = String((body && body.id) || '').slice(0, 40);
  if (!slug || !id) return json({ error: 'id' }, 400);
  const session = await readSession(context.request, context.env);
  const voter = clientVoterId(context.request, session);
  const comments = await readJsonArray(kv, key(slug));
  const target = comments.filter((c) => c && c.id === id)[0];
  if (!target) return json({ ok: true });
  const allowed = (session && session.owner) || (target.voter && target.voter === voter) ||
    (session && session.handle && target.handle === session.handle);
  if (!allowed) return json({ error: 'forbidden' }, 403);
  const next = comments.filter((c) => c && c.id !== id && c.parentId !== id);
  await kv.put(key(slug), JSON.stringify(next));
  return json({ ok: true, count: next.length });
}
