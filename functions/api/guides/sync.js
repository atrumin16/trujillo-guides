import { loadGuideRecord } from '../../lib/community.js';
import { mergeGuideFeed } from '../../lib/feed.js';

const INSULTS = /\b(idiota|imbecil|imbécil|estupido|estúpido|mierda|cabr[oó]n|hijo\s*de\s*puta|gilipollas|puta)\b/i;
const SPAM = /\b(crypto\s*airdrop|guaranteed\s*profit|buy\s*followers|casino\s*bonus|viagra)\b/i;
const AFFILIATE = /(\bbit\.ly\/|\bamzn\.to\/|\baffiliate=)/i;
const BLOCKED = /^(exe|msi|bat|cmd|vbs|scr|com|pif|dll|js|ps1)$/i;
const ALLOWED = /^(pdf|docx|doc|xlsx|xls|csv|zip)$/i;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Max-Age': '86400'
};

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
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

function looksLikeHandle(value) {
  return /^@?[a-zA-Z0-9_]{2,24}$/.test(String(value || '').trim());
}

function moderate(text) {
  const t = String(text || '').trim();
  if (t.length < 10) return 'too_short';
  if (INSULTS.test(t)) return 'abuse';
  if (SPAM.test(t)) return 'spam';
  if (AFFILIATE.test(t)) return 'affiliate';
  return '';
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

function sanitizeAttachments(list) {
  if (!Array.isArray(list)) return [];
  return list.slice(0, 20).map(function (a) {
    if (!a) return null;
    const name = String(a.name || '').slice(0, 120);
    const ext = String(a.ext || (name.split('.').pop() || '')).toLowerCase();
    if (BLOCKED.test(ext) || !ALLOWED.test(ext)) return null;
    const url = String(a.url || '');
    if (!url.startsWith('https://') && !url.startsWith('/')) return null;
    return { name: name || ('archivo.' + ext), ext: ext, size: Number(a.size) || 0, url: url.slice(0, 500) };
  }).filter(Boolean);
}

function upsertList(list, item, match) {
  const next = (Array.isArray(list) ? list : []).filter(function (it) { return it && !match(it); });
  next.unshift(item);
  return next.slice(0, 200);
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestPost(context) {
  const env = context.env || {};
  const secret = String(env.TRUJILLO_AI_SYNC_SECRET || '');
  const auth = context.request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!secret) return json({ error: 'sync_secret_unconfigured' }, 503);
  if (!token || token !== secret) return json({ error: 'unauthorized' }, 401);

  const body = await context.request.json().catch(function () { return null; });
  if (!body || typeof body !== 'object') return json({ error: 'invalid_json' }, 400);

  const title = String(body.title || '').trim().slice(0, 120);
  const markdown = String(body.markdown || body.content || '').replace(/\r\n/g, '\n');
  const rawAuthor = String(body.author || '').trim();
  const handle = String(body.handle || (looksLikeHandle(rawAuthor) ? rawAuthor : '') || 'atrumin16')
    .replace(/^@/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 24);

  const reason = moderate(title + '\n' + markdown);
  if (reason) return json({ error: 'moderation', reason }, 400);
  if (!title || !markdown.trim()) return json({ error: 'missing_fields' }, 400);

  const kv = env.BOT_MEMORY;
  if (!kv) return json({ error: 'kv' }, 503);

  let slug = slugify(body.slug || title);
  if (!slug) return json({ error: 'invalid_slug' }, 400);

  for (let i = 0; i < 20; i++) {
    const trySlug = i === 0 ? slug : slug.slice(0, 40) + '-' + (i + 1);
    const ptrRaw = await kv.get('pub:guide:' + trySlug);
    if (!ptrRaw) { slug = trySlug; break; }
    try {
      const ptr = JSON.parse(ptrRaw);
      if (ptr && ptr.handle === handle) { slug = trySlug; break; }
    } catch (e) {
      return json({ error: 'index_corrupt', key: 'pub:guide:' + trySlug }, 500);
    }
  }

  const existing = await loadGuideRecord(kv, handle, slug);
  const incomingAttachments = sanitizeAttachments(body.attachments);
  const prevExtras = (existing && existing.extras) || {};
  const extras = {
    attachments: incomingAttachments.length ? incomingAttachments : (prevExtras.attachments || []),
    widgets: Array.isArray(body.widgets) && body.widgets.length ? body.widgets.slice(0, 20) : (prevExtras.widgets || []),
    sources: Array.isArray(body.sources) && body.sources.length ? body.sources.slice(0, 20) : (prevExtras.sources || []),
    resources: Array.isArray(body.resources) && body.resources.length ? body.resources.slice(0, 20) : (prevExtras.resources || [])
  };

  const now = Date.now();
  const parsedDate = body.date ? Date.parse(body.date) : NaN;
  const createdAt = (existing && existing.createdAt) || (Number.isFinite(parsedDate) ? parsedDate : now);
  const authorName = String(
    body.authorName ||
    (existing && existing.authorName) ||
    (!looksLikeHandle(rawAuthor) && rawAuthor) ||
    'Alberto Trujillo Mingorance'
  ).slice(0, 80);

  const record = {
    slug: slug,
    title: title,
    dest: 'guide',
    lang: 'markdown',
    content: markdown,
    handle: handle,
    authorName: authorName,
    authorPicture: String(body.authorPicture || (existing && existing.authorPicture) || '/avatar.png').slice(0, 400),
    category: String(body.category || (existing && existing.category) || 'Guides').slice(0, 40),
    date: body.date || (existing && existing.date) || new Date(createdAt).toISOString().slice(0, 10),
    extras: extras,
    createdAt: createdAt,
    updatedAt: now
  };

  const indexRaw = await kv.get('guide:index:' + handle);
  const pubRaw = await kv.get('guide:public');
  const index = readIndex(indexRaw);
  const pub = readIndex(pubRaw);
  if (indexRaw && index === null) return json({ error: 'index_corrupt', key: 'guide:index:' + handle }, 500);
  if (pubRaw && pub === null) return json({ error: 'index_corrupt', key: 'guide:public' }, 500);

  const card = {
    slug: slug,
    title: title,
    handle: handle,
    dest: 'guide',
    updatedAt: now,
    authorName: record.authorName,
    authorPicture: record.authorPicture,
    category: record.category
  };

  await kv.put('guide:' + handle + ':' + slug, JSON.stringify(record));
  await kv.put('pub:guide:' + slug, JSON.stringify({ handle: handle, dest: 'guide', slug: slug }));
  await kv.put('guide:index:' + handle, JSON.stringify(upsertList(index || [], card, function (it) { return it.slug === slug; })));
  const nextPub = upsertList(pub || [], card, function (it) { return it && it.slug === slug && it.handle === handle; });
  await kv.put('guide:public', JSON.stringify(nextPub));

  return json({
    success: true,
    count: mergeGuideFeed(nextPub).length,
    slug: slug,
    url: 'https://guides.trujillomingorance.com/g/' + slug
  }, 200);
}
