import {
  loadGuideBySlug,
  readJsonArray,
  renderGuideIndex,
  renderGuideMissing,
  renderGuidePage
} from '../lib/community.js';

const CSP = "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; frame-src 'self' https://s.tradingview.com https://www.tradingview.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests";

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
  const raw = context.params.path;
  const slug = (Array.isArray(raw) ? raw[0] : String(raw || '')).toLowerCase().replace(/[^a-z0-9-]+/g, '').slice(0, 48);
  if (!slug) {
    const index = await readJsonArray(kv, 'guide:public');
    return html(renderGuideIndex(index), 200);
  }
  const record = await loadGuideBySlug(kv, slug);
  if (!record) return html(renderGuideMissing(), 404);
  record.dest = 'guide';
  return html(renderGuidePage(record), 200);
}
