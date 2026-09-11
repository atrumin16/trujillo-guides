import { loadGuideRecord } from '../../lib/community.js';
import { mergeGuideFeed } from '../../lib/feed.js';

const INSULTS = /\b(idiota|imbecil|imbécil|estupido|estúpido|mierda|cabr[oó]n|hijo\s*de\s*puta|gilipollas|puta)\b/i;
const SPAM = /\b(crypto\s*airdrop|guaranteed\s*profit|buy\s*followers|casino\s*bonus|viagra)\b/i;
const AFFILIATE = /(\bbit\.ly\/|\bamzn\.to\/|\baffiliate=)/i;
const BLOCKED = /^(exe|msi|bat|cmd|vbs|scr|com|pif|dll|js|ps1)$/i;
const ALLOWED = /^(pdf|docx|doc|txt|rtf|odt|xlsx|xls|csv|json|parquet|pptx|ppt|zip|tar|gz|tgz|rar|7z|yaml|yml|sh|md)$/i;

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

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestPost(context) {
  const env = context.env || {};
  const secret = env.TRUJILLO_AI_SYNC_SECRET || '';
  const auth = context.request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (secret && token !== secret) return json({ error: 'unauthorized' }, 401);

  const body = await context.request.json().catch(() => ({}));
  const title = String(body.title || '').trim().slice(0, 120);
  const markdown = String(body.markdown || body.content || '').replace(/\r\n/g, '\n');
  const rawAuthor = String(body.author || '').trim();
  const handle = String(body.handle || (looksLikeHandle(rawAuthor) ? rawAuthor : '') || 'atrumin16')
    .replace(/^@/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 24);
  const authorName = String(body.authorName || (!looksLikeHandle(rawAuthor) && rawAuthor) || 'Alberto Trujillo Mingorance').slice(0, 80);

  const reason = moderate(title + '\n' + markdown);
  if (reason) return json({ error: 'moderation', reason }, 400);
  if (!title || !markdown.trim()) return json({ error: 'missing_fields' }, 400);

  let slug = slugify(body.slug || title);
  const kv = env.BOT_MEMORY;
  if (!kv) return json({ error: 'kv' }, 503);

  for (let i = 0; i < 20; i++) {
    const trySlug = i === 0 ? slug : slug.slice(0, 40) + '-' + (i + 1);
    const ptr = await kv.get('pub:guide:' + trySlug);
    if (!ptr) { slug = trySlug; break; }
    try {
      const p = JSON.parse(ptr);
      if (p.handle === handle) { slug = trySlug; break; }
    } catch (e) {}
  }

  const attachments = Array.isArray(body.attachments) ? body.attachments.slice(0, 20).map((a) => {
    const name = String(a.name || '').slice(0, 120);
    const ext = String(a.ext || (name.split('.').pop() || '')).toLowerCase();
    if (BLOCKED.test(ext) || !ALLOWED.test(ext)) return null;
    const url = String(a.url || '');
    if (!url.startsWith('https://') && !url.startsWith('/')) return null;
    return { name, ext, size: Number(a.size) || 0, url: url.slice(0, 500) };
  }).filter(Boolean) : [];

  const existing = await loadGuideRecord(kv, handle, slug);
  const now = Date.now();
  const parsedDate = body.date ? Date.parse(body.date) : NaN;
  const createdAt = (existing && existing.createdAt) || (Number.isFinite(parsedDate) ? parsedDate : now);

  const record = {
    slug,
    title,
    dest: 'guide',
    lang: 'markdown',
    content: markdown,
    handle,
    authorName,
    authorPicture: String(body.authorPicture || '/avatar.png').slice(0, 400),
    category: String(body.category || 'Guides').slice(0, 40),
    date: body.date || new Date(createdAt).toISOString().slice(0, 10),
    extras: { attachments, widgets: body.widgets || [] },
    createdAt,
    updatedAt: now
  };

  await kv.put('guide:' + handle + ':' + slug, JSON.stringify(record));
  await kv.put('pub:guide:' + slug, JSON.stringify({ handle, dest: 'guide', slug }));

  let index = [];
  try { index = JSON.parse((await kv.get('guide:index:' + handle)) || '[]'); } catch (e) { index = []; }
  if (!Array.isArray(index)) index = [];
  index = index.filter((it) => it && it.slug !== slug);
  index.unshift({ slug, title, handle, dest: 'guide', updatedAt: now, authorName: record.authorName, authorPicture: record.authorPicture, category: record.category });
  await kv.put('guide:index:' + handle, JSON.stringify(index.slice(0, 200)));

  let pub = [];
  try { pub = JSON.parse((await kv.get('guide:public')) || '[]'); } catch (e) { pub = []; }
  if (!Array.isArray(pub)) pub = [];
  pub = pub.filter((it) => !(it && it.slug === slug && it.handle === handle));
  pub.unshift({ slug, title, handle, dest: 'guide', updatedAt: now, authorName: record.authorName, authorPicture: record.authorPicture, category: record.category });
  await kv.put('guide:public', JSON.stringify(pub.slice(0, 200)));

  return json({
    success: true,
    count: mergeGuideFeed(pub).length,
    slug: slug,
    url: 'https://guides.trujillomingorance.com/g/' + slug
  }, 200);
}
