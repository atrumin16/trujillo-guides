import {
  HIDDEN_KEY,
  isHiddenSlug,
  readJsonArray,
  renderGuideMissing
} from '../lib/community.js';
import { STATIC_SLUGS } from '../lib/feed.js';
import { resolveShort, bumpClicks, GUIDES_ORIGIN } from '../lib/shorten.js';

const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://translate.googleapis.com https://da.gd https://tinyurl.com https://api-ssl.bitly.com; frame-src 'self' data: blob: https://s.tradingview.com https://www.tradingview.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests";

function html(body, status) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'no-store',
      'Content-Security-Policy': CSP,
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex, nofollow, noarchive'
    }
  });
}

function destUrl(ptr) {
  const stored = String((ptr && ptr.url) || '');
  if (/^https:\/\/guides\.trujillomingorance\.com(\/|$)/i.test(stored)) return stored;
  const slug = ptr && ptr.slug ? String(ptr.slug) : '';
  if (!slug) return GUIDES_ORIGIN + '/';
  const g = STATIC_SLUGS[slug];
  if (g) return GUIDES_ORIGIN + (g.href || ('/guides/' + slug + '/'));
  return GUIDES_ORIGIN + '/g/' + slug;
}

export async function onRequestGet(context) {
  const kv = context.env && context.env.BOT_MEMORY;
  const raw = context.params.path;
  const code = String(Array.isArray(raw) ? raw[0] : raw || '').toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 16);
  if (!code || !kv) return html(renderGuideMissing(), 404);
  const ptr = await resolveShort(kv, code);
  if (!ptr) return html(renderGuideMissing(), 404);
  await bumpClicks(kv, ptr);
  const slug = ptr.slug;
  if (slug) {
    const hidden = await readJsonArray(kv, HIDDEN_KEY);
    if (isHiddenSlug(hidden, slug)) return html(renderGuideMissing(), 404);
  }
  return Response.redirect(destUrl(ptr), 302);
}
