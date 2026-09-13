import { loadGuideRecord, loadGuideBySlug, detectKind, LANG_MAP } from '../../lib/community.js';
import { mergeGuideFeed, HIDDEN_KEY, STATIC_SLUGS } from '../../lib/feed.js';
import { readSession, canEdit } from '../../lib/social.js';

const ATTACH_OK = /^(pdf|png|jpe?g|jpg|webp|gif|avif|svg|docx?|xlsx?|pptx?|csv|tsv|zip|txt|md|markdown|html?|json|ya?ml|xml|toml|js|mjs|ts|py|css|sql|mmd)$/i;
const ATTACH_MAX = 900000;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Client-Id',
  'Access-Control-Allow-Credentials': 'true'
};

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS }
  });
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

function readIndex(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    return null;
  }
}

function upsertList(list, item, match) {
  const next = (Array.isArray(list) ? list : []).filter(function (it) { return it && !match(it); });
  next.unshift(item);
  return next.slice(0, 200);
}

function studio() {
  return 'https://ai.trujillomingorance.com';
}

const KINDS = ['guide', 'post', 'opinion', 'analysis', 'brief', 'note', 'research', 'changelog'];

function kindOf(value) {
  const k = String(value || '').toLowerCase().trim();
  if (KINDS.indexOf(k) !== -1) return k;
  if (k === 'guides') return 'guide';
  return 'guide';
}

async function storeAttachments(kv, slug, session, incoming, previous) {
  const prev = Array.isArray(previous) ? previous : [];
  if (!Array.isArray(incoming)) return prev.slice(0, 40);
  const keep = [];
  const incomingList = incoming.slice(0, 12);
  for (let i = 0; i < incomingList.length; i++) {
    const a = incomingList[i];
    if (!a) continue;
    const name = String(a.name || 'archivo').slice(0, 120);
    const ext = String(a.ext || (name.split('.').pop() || '')).toLowerCase();
    if (!a.data) {
      const old = prev.filter(function (p) { return p && ((a.id && p.id === a.id) || (a.url && p.url === a.url)); })[0];
      if (old) keep.push(old);
      else if (a.url) keep.push({ id: a.id || '', name: name, ext: ext, type: a.type || '', url: String(a.url).slice(0, 500), size: Number(a.size) || 0 });
      continue;
    }
    if (!ATTACH_OK.test(ext)) continue;
    const b64 = String(a.data || '').replace(/^data:[^;]+;base64,/, '');
    let size = 0;
    try { size = Math.floor((b64.length * 3) / 4); } catch (e) { size = 0; }
    if (!b64 || size < 8 || size > ATTACH_MAX) continue;
    const id = crypto.randomUUID().slice(0, 12);
    const type = String(a.type || 'application/octet-stream').slice(0, 80);
    await kv.put('guide:blob:' + slug + ':' + id, JSON.stringify({ name: name, type: type, b64: b64 }));
    keep.push({
      id: id,
      name: name,
      ext: ext,
      type: type,
      size: size,
      url: '/api/guides/files?slug=' + slug + '&id=' + id + '&preview=1',
      handle: (session && session.handle) || ''
    });
  }
  await kv.put('guide:files:' + slug, JSON.stringify(keep));
  return keep;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestGet(context) {
  const session = await readSession(context.request, context.env);
  if (!session) return json({ error: 'login', login: studio() + '/login' }, 401);
  const url = new URL(context.request.url);
  const slug = String(url.searchParams.get('slug') || '').toLowerCase().replace(/[^a-z0-9-]+/g, '').slice(0, 48);
  if (!slug) return json({ ok: true, me: { handle: session.handle, name: session.name, owner: session.owner } });
  const kv = context.env.BOT_MEMORY;
  const record = await loadGuideBySlug(kv, slug);
  const stat = STATIC_SLUGS[slug] || null;
  const guide = record || stat;
  if (!guide) return json({ error: 'missing' }, 404);
  if (!canEdit(session, guide)) return json({ error: 'forbidden' }, 403);
  const extra = (record && record.extras) || {};
  let content = (record && record.content) || '';
  let lang = (record && record.lang) || '';
  if (!record && stat && context.env.ASSETS) {
    try {
      const htmlRes = await context.env.ASSETS.fetch(new URL('/guides/' + slug + '/index.html', context.request.url));
      if (htmlRes && htmlRes.ok) {
        content = await htmlRes.text();
        lang = 'html';
      }
    } catch (e) {}
  }
  if (!lang) lang = detectKind('', content) || 'markdown';
  return json({
    ok: true,
    slug: slug,
    static: !record && !!stat,
    title: (record && record.title) || (stat && stat.title) || slug,
    content: content,
    lang: lang,
    attachments: Array.isArray(extra.attachments) ? extra.attachments : [],
    kind: kindOf((record && record.category) || extra.kind),
    summary: extra.summary || '',
    pinned: !!(extra.pinned || extra.fixada),
    references: Array.isArray(extra.references) ? extra.references : [],
    level: extra.level || 'intermediate',
    langDoc: extra.langDoc || 'es',
    handle: (record && record.handle) || (stat && stat.handle) || session.handle,
    authorName: (record && record.authorName) || (stat && stat.authorName) || session.name,
    url: record ? ('/g/' + slug) : (stat ? ('/guides/' + slug + '/') : '/g/' + slug),
    studio: studio()
  });
}

export async function onRequestPost(context) {
  const kv = context.env && context.env.BOT_MEMORY;
  if (!kv) return json({ error: 'kv' }, 503);
  const session = await readSession(context.request, context.env);
  if (!session) return json({ error: 'login', login: studio() + '/login' }, 401);
  const body = await context.request.json().catch(function () { return null; });
  const title = String((body && body.title) || '').trim().slice(0, 120);
  const markdown = String((body && (body.markdown || body.content)) || '').replace(/\r\n/g, '\n');
  if (!title || !markdown.trim()) return json({ error: 'missing_fields' }, 400);
  const langIn = String((body && body.lang) || '').toLowerCase().trim();
  const lang = LANG_MAP[langIn] ? langIn : detectKind(langIn, markdown);
  const handle = String(
    session.handle ||
    (session.owner && ((body && body.handle) || 'atrumin16')) ||
    ''
  ).replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 24);
  if (!handle) return json({ error: 'handle', login: studio() + '/login' }, 400);

  let slug = slugify((body && body.slug) || title);
  if (!slug) return json({ error: 'invalid_slug' }, 400);

  for (let i = 0; i < 20; i++) {
    const trySlug = i === 0 ? slug : slug.slice(0, 40) + '-' + (i + 1);
    const ptrRaw = await kv.get('pub:guide:' + trySlug);
    if (!ptrRaw) { slug = trySlug; break; }
    try {
      const ptr = JSON.parse(ptrRaw);
      if (ptr && ptr.handle === handle) { slug = trySlug; break; }
    } catch (e) {
      return json({ error: 'index_corrupt' }, 500);
    }
  }

  const existing = await loadGuideRecord(kv, handle, slug);
  if (existing && !canEdit(session, existing)) return json({ error: 'forbidden' }, 403);

  const now = Date.now();
  const authorName = String(session.name || (existing && existing.authorName) || handle).slice(0, 80);
  const prevExtra = (existing && existing.extras) || {};
  const attachments = await storeAttachments(kv, slug, session, body.attachments, prevExtra.attachments);
  const kind = kindOf((body && (body.kind || body.category)) || (existing && existing.category));
  const summary = String((body && body.summary) || '').trim().slice(0, 220);
  const record = {
    slug: slug,
    title: title,
    dest: 'guide',
    lang: lang,
    content: markdown,
    handle: handle,
    authorName: authorName,
    authorPicture: String(session.picture || (existing && existing.authorPicture) || '/avatar.png').slice(0, 400),
    category: kind,
    date: (existing && existing.date) || new Date(now).toISOString().slice(0, 10),
    extras: Object.assign({}, prevExtra, {
      attachments: attachments,
      kind: kind,
      summary: summary,
      pinned: !!(body && (body.pinned || body.fixada)),
      fixada: !!(body && (body.pinned || body.fixada)),
      references: (body && body.references) || [],
      level: (body && body.level) || 'intermediate',
      langDoc: (body && body.langDoc) || 'es'
    }),
    createdAt: (existing && existing.createdAt) || now,
    updatedAt: now
  };

  const indexRaw = await kv.get('guide:index:' + handle);
  const pubRaw = await kv.get('guide:public');
  const index = readIndex(indexRaw);
  const pub = readIndex(pubRaw);
  if (indexRaw && index === null) return json({ error: 'index_corrupt' }, 500);
  if (pubRaw && pub === null) return json({ error: 'index_corrupt' }, 500);

  const isPin = !!(body && (body.pinned || body.fixada));
  const card = {
    slug: slug,
    title: title,
    handle: handle,
    dest: 'guide',
    updatedAt: now,
    authorName: record.authorName,
    authorPicture: record.authorPicture,
    category: kind,
    summary: summary,
    pinned: isPin,
    fixada: isPin
  };

  await kv.put('guide:' + handle + ':' + slug, JSON.stringify(record));
  await kv.put('pub:guide:' + slug, JSON.stringify({ handle: handle, dest: 'guide', slug: slug }));
  await kv.put('guide:index:' + handle, JSON.stringify(upsertList(index || [], card, function (it) { return it.slug === slug; })));
  const nextPub = upsertList(pub || [], card, function (it) { return it && it.slug === slug; });
  await kv.put('guide:public', JSON.stringify(nextPub));
  const hidden = readIndex(await kv.get(HIDDEN_KEY)) || [];
  const nextHidden = hidden.filter(function (it) {
    const s = typeof it === 'string' ? it : (it && it.slug);
    return s !== slug;
  });
  if (nextHidden.length !== hidden.length) await kv.put(HIDDEN_KEY, JSON.stringify(nextHidden));

  return json({
    ok: true,
    slug: slug,
    url: 'https://guides.trujillomingorance.com/g/' + slug,
    studio: studio(),
    count: mergeGuideFeed(nextPub, nextHidden).length
  });
}

export async function onRequestDelete(context) {
  const kv = context.env && context.env.BOT_MEMORY;
  if (!kv) return json({ error: 'kv' }, 503);
  const session = await readSession(context.request, context.env);
  if (!session) return json({ error: 'login', login: studio() + '/login' }, 401);
  const body = await context.request.json().catch(function () { return null; });
  const slug = String((body && body.slug) || '').toLowerCase().replace(/[^a-z0-9-]+/g, '').slice(0, 48);
  if (!slug) return json({ error: 'slug' }, 400);
  const record = await loadGuideBySlug(kv, slug);
  const stat = STATIC_SLUGS[slug] || null;
  const guide = record || stat;
  if (!guide) return json({ ok: true });
  if (!canEdit(session, guide)) return json({ error: 'forbidden' }, 403);

  const handle = String((record && record.handle) || (stat && stat.handle) || session.handle || '').replace(/^@/, '');
  if (record && handle) {
    await kv.delete('guide:' + handle + ':' + slug);
    await kv.delete('pub:guide:' + slug);
    const index = readIndex(await kv.get('guide:index:' + handle)) || [];
    await kv.put('guide:index:' + handle, JSON.stringify(index.filter(function (it) { return it && it.slug !== slug; })));
  }
  const pub = readIndex(await kv.get('guide:public')) || [];
  await kv.put('guide:public', JSON.stringify(pub.filter(function (it) { return it && it.slug !== slug; })));
  const hidden = readIndex(await kv.get(HIDDEN_KEY)) || [];
  if (stat && !hidden.some(function (it) { return (typeof it === 'string' ? it : it && it.slug) === slug; })) {
    hidden.unshift(slug);
    await kv.put(HIDDEN_KEY, JSON.stringify(hidden.slice(0, 200)));
  }
  return json({ ok: true, slug: slug });
}
