import { pageForArtifact, pageForIndex, notFoundPage } from '../lib/render-artifact.js';

const SECURITY = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

function html(body, status, extra) {
  return new Response(body, {
    status: status || 200,
    headers: Object.assign({
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60, s-maxage=86400, stale-while-revalidate=604800',
      'CDN-Cache-Control': 'max-age=86400',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'"
    }, SECURITY, extra || {})
  });
}

export async function onRequestGet(context) {
  const { request, env, params } = context;
  const raw = params.path;
  const slug = Array.isArray(raw) ? raw.filter(Boolean).join('/') : String(raw || '');
  const cache = caches.default;
  const cacheKey = new Request(new URL(request.url), { method: 'GET' });
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  let response;
  if (!slug) {
    let index = [];
    if (env.BOT_MEMORY) {
      const indexStr = await env.BOT_MEMORY.get('art:index');
      if (indexStr) {
        try { index = JSON.parse(indexStr); } catch (e) { index = []; }
      }
    }
    response = html(pageForIndex(Array.isArray(index) ? index : []), 200);
  } else {
    if (!/^[a-z0-9-]{2,64}$/.test(slug)) {
      response = html(notFoundPage(), 404, { 'Cache-Control': 'public, max-age=60, s-maxage=300' });
    } else {
      let record = null;
      if (env.BOT_MEMORY) {
        const rawRec = await env.BOT_MEMORY.get('art:' + slug);
        if (rawRec) {
          try { record = JSON.parse(rawRec); } catch (e) { record = null; }
        }
      }
      response = record
        ? html(pageForArtifact(record), 200)
        : html(notFoundPage(), 404, { 'Cache-Control': 'public, max-age=60, s-maxage=300' });
    }
  }

  if (response.status === 200) {
    context.waitUntil(cache.put(cacheKey, response.clone()));
  }
  return response;
}
