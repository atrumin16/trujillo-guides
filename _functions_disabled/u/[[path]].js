import {
  HIDDEN_KEY,
  parseCommunityPath,
  readJsonArray,
  renderGuideIndex,
  renderGuideMissing
} from '../lib/community.js';
import { attachSocial } from '../lib/social.js';
import { mergeGuideFeed } from '../lib/feed.js';

const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://translate.googleapis.com https://da.gd https://tinyurl.com https://api-ssl.bitly.com; frame-src 'self' data: blob: https://s.tradingview.com https://www.tradingview.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests";

function html(body, status) {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': status === 200 ? 'public, max-age=30, s-maxage=120' : 'no-store',
      'Content-Security-Policy': CSP,
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  });
}

export async function onRequestGet(context) {
  const kv = context.env && context.env.BOT_MEMORY;
  const hidden = await readJsonArray(kv, HIDDEN_KEY);
  const parsed = parseCommunityPath(context.params.path);
  if (!parsed || parsed.kind === 'missing') return html(renderGuideMissing(), 404);
  if (parsed.kind === 'global') {
    return Response.redirect('https://guides.trujillomingorance.com/', 302);
  }
  if (parsed.kind === 'author') {
    const raw = await readJsonArray(kv, 'guide:index:' + parsed.handle);
    const merged = mergeGuideFeed(raw, hidden).filter((it) => String(it.handle || '').toLowerCase() === parsed.handle);
    const index = await attachSocial(kv, merged);
    const meta = index[0] || { handle: parsed.handle };
    return html(renderGuideIndex(index, {
      handle: parsed.handle,
      authorName: meta.authorName,
      authorPicture: meta.authorPicture,
      skipMerge: true
    }), 200);
  }
  return Response.redirect('https://guides.trujillomingorance.com/g/' + encodeURIComponent(parsed.slug), 301);
}
