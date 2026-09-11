import { readJsonArray, renderGuideIndex } from './lib/community.js';

const CSP = "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; frame-src 'self' https://s.tradingview.com https://www.tradingview.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests";

export async function onRequestGet(context) {
  const kv = context.env && context.env.BOT_MEMORY;
  const index = await readJsonArray(kv, 'guide:public');
  const body = renderGuideIndex(index);
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'public, max-age=30, s-maxage=120',
      'Content-Security-Policy': CSP,
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
