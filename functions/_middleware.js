const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests"
};

const COMMUNITY_CSP = "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self'; frame-src 'self' https://s.tradingview.com https://www.tradingview.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests";

export async function onRequest(context) {
  const response = await context.next();
  const headers = new Headers(response.headers);
  const path = context.request && context.request.url ? new URL(context.request.url).pathname : '';
  const isCommunity = path === '/u' || path.startsWith('/u/') || path === '/g' || path.startsWith('/g/');
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
