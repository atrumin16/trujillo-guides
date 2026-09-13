import {
  HIDDEN_KEY,
  isHiddenSlug,
  loadGuideBySlug,
  readJsonArray,
  renderGuideIndex,
  renderGuideMissing,
  renderGuidePage,
  staticGuideRedirect
} from '../lib/community.js';

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
  const raw = context.params.path;
  const slug = (Array.isArray(raw) ? raw[0] : String(raw || '')).toLowerCase().replace(/[^a-z0-9-]+/g, '').slice(0, 48);
  if (!slug) {
    const index = await readJsonArray(kv, 'guide:public');
    return html(renderGuideIndex(index, { hidden }), 200);
  }
  if (isHiddenSlug(hidden, slug)) return html(renderGuideMissing(), 404);
  const record = await loadGuideBySlug(kv, slug);
  if (!record && (slug.indexOf('correo') !== -1 || slug.indexOf('enterprise') !== -1)) {
    return Response.redirect('https://guides.trujillomingorance.com/guides/enterprise-email/', 301);
  }
  if (!record && (slug.indexOf('glossar') !== -1 || slug.indexOf('glosario') !== -1)) {
    return Response.redirect('https://guides.trujillomingorance.com/guides/it-glossary/', 301);
  }
  if (!record && (slug.indexOf('berkshire') !== -1 || slug.indexOf('desglose') !== -1)) {
    return Response.redirect('https://guides.trujillomingorance.com/guides/desglose-de-cartera-y-simulador-de-berkshire-hat/', 301);
  }
  if (!record && (slug.indexOf('msft') !== -1 || slug.indexOf('microsoft') !== -1)) {
    return Response.redirect('https://guides.trujillomingorance.com/guides/informe-msft/', 301);
  }
  if (!record) {
    const redir = staticGuideRedirect(slug, hidden);
    if (redir) return redir;
    return html(renderGuideMissing(), 404);
  }
  record.dest = 'guide';
  return html(renderGuidePage(record), 200);
}
