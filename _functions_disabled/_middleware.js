import { loadGuideBySlug } from './lib/community.js';

const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://accounts.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://accounts.google.com https://translate.googleapis.com https://da.gd https://tinyurl.com https://api-ssl.bitly.com; frame-src 'self' data: blob: https://s.tradingview.com https://www.tradingview.com https://accounts.google.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests"
};

const COMMUNITY_CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://accounts.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://accounts.google.com https://translate.googleapis.com https://da.gd https://tinyurl.com https://api-ssl.bitly.com; frame-src 'self' data: blob: https://s.tradingview.com https://www.tradingview.com https://accounts.google.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests";

const OVERLAY_CACHE = new Map();

export async function onRequest(context) {
  const url = context.request && context.request.url ? new URL(context.request.url) : null;
  const path = url ? url.pathname : '';
  const hostname = url ? url.hostname.toLowerCase() : '';
  const isSavingsHost = hostname.startsWith('savings.') || hostname.startsWith('finance.');

  // 1. ISOLATED DOMAIN: savings.trujillomingorance.com
  if (isSavingsHost) {
    if (path.startsWith('/api/')) {
      return context.next();
    }
    if (/\.(css|js|png|jpg|jpeg|webp|svg|ico|woff|woff2|json|txt|map)$/i.test(path)) {
      if (context.env && context.env.ASSETS && !path.startsWith('/savings/')) {
        let assetRes = await context.env.ASSETS.fetch(new URL(`/savings${path}`, url));
        if (assetRes.status === 404) {
          assetRes = await context.env.ASSETS.fetch(new URL(path, url));
        }
        return assetRes;
      }
      return context.next();
    }

    if (context.env && context.env.ASSETS) {
      const targetPath = path === '/' || path === '' ? '/savings/index.html' : (path.startsWith('/savings/') ? path : `/savings${path}`);
      const assetUrl = new URL(targetPath, url);
      let assetResponse = await context.env.ASSETS.fetch(assetUrl);
      if (assetResponse.status === 404 && !path.includes('.')) {
        assetResponse = await context.env.ASSETS.fetch(new URL('/savings/index.html', url));
      }
      const headers = new Headers(assetResponse.headers);
      for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
        if (!headers.has(name)) headers.set(name, value);
      }
      return new Response(assetResponse.body, {
        status: assetResponse.status,
        statusText: assetResponse.statusText,
        headers
      });
    }
  }

  // 2. ISOLATION ON GUIDES: redirect any /savings request to the dedicated domain
  if (!isSavingsHost && (path === '/savings' || path.startsWith('/savings/'))) {
    return Response.redirect('https://savings.trujillomingorance.com/', 301);
  }

  // Fast-path: bypass middleware logic and KV lookups for non-savings static assets
  if (/\.(css|js|png|jpg|jpeg|webp|svg|ico|woff|woff2|json|txt|map)$/i.test(path)) {
    return context.next();
  }

  if (path === '/editor' || path === '/editor/') {
    return Response.redirect(new URL('/write' + (url.search || ''), context.request.url), 302);
  }

  const staticGuide = path.match(/^\/guides\/([a-z0-9-]+)\/?$/i);
  if (staticGuide && context.env && context.env.BOT_MEMORY) {
    const slug = staticGuide[1].toLowerCase();
    const now = Date.now();
    const cached = OVERLAY_CACHE.get(slug);

    if (cached && cached.exp > now) {
      if (cached.hasOverlay) {
        return Response.redirect('https://guides.trujillomingorance.com/g/' + slug, 302);
      }
    } else {
      try {
        const overlay = await loadGuideBySlug(context.env.BOT_MEMORY, slug);
        OVERLAY_CACHE.set(slug, { hasOverlay: !!overlay, exp: now + 300000 }); // 5 min cache
        if (overlay) {
          return Response.redirect('https://guides.trujillomingorance.com/g/' + slug, 302);
        }
      } catch (e) {
        OVERLAY_CACHE.set(slug, { hasOverlay: false, exp: now + 60000 });
      }
    }
  }
  const response = await context.next();
  const headers = new Headers(response.headers);
  const isCommunity = path === '/u' || path.startsWith('/u/') || path === '/g' || path.startsWith('/g/') || path === '/s' || path.startsWith('/s/');
  const headersToApply = isCommunity
    ? { ...SECURITY_HEADERS, 'Content-Security-Policy': COMMUNITY_CSP }
    : SECURITY_HEADERS;
  for (const [name, value] of Object.entries(headersToApply)) {
    if (!headers.has(name)) headers.set(name, value);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
