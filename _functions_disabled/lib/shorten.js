const ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';

export const GUIDES_ORIGIN = 'https://guides.trujillomingorance.com';

export function mintCode(len) {
  const n = len || 7;
  const buf = crypto.getRandomValues(new Uint8Array(n));
  let s = '';
  for (let i = 0; i < buf.length; i++) s += ALPHABET[buf[i] % ALPHABET.length];
  return s;
}

export function ownShortUrl(code) {
  return GUIDES_ORIGIN + '/s/' + String(code || '');
}

export async function bitlyShorten(env, longUrl) {
  const token = String((env && (env.BITLY_TOKEN || env.BITLY_ACCESS_TOKEN || env.BITLY_API_KEY)) || '').trim();
  if (!token) return '';
  try {
    const res = await fetch('https://api-ssl.bitly.com/v4/shorten', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ long_url: longUrl, domain: 'bit.ly' })
    });
    if (!res.ok) return '';
    const data = await res.json();
    const link = String((data && (data.link || data.id)) || '');
    if (/^https:\/\/bit\.ly\//i.test(link)) return link;
    if (/^bit\.ly\//i.test(link)) return 'https://' + link;
  } catch (e) {}
  return '';
}

export async function createDiscreetShortUrl(env, targetUrl) {
  // 1. Bitly if configured
  const bitly = await bitlyShorten(env, targetUrl);
  if (bitly) return bitly;

  // 2. da.gd (17 chars, ultra clean and neutral)
  try {
    const res = await fetch('https://da.gd/s?url=' + encodeURIComponent(targetUrl), {
      headers: { 'User-Agent': 'curl/7.88' }
    });
    if (res.ok) {
      const txt = (await res.text()).trim();
      if (/^https?:\/\/da\.gd\/\w+/i.test(txt)) return txt;
    }
  } catch (e) {}

  // 3. TinyURL fallback
  try {
    const res = await fetch('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(targetUrl));
    if (res.ok) {
      const txt = (await res.text()).trim();
      if (/^https?:\/\/tinyurl\.com\/\w+/i.test(txt)) return txt;
    }
  } catch (e) {}

  return '';
}

export async function createShort(kv, payload) {
  const slug = payload && payload.slug ? String(payload.slug) : '';
  if (slug) {
    const prev = await kv.get('share:slug:' + slug);
    if (prev) {
      const code = String(prev);
      const raw = await kv.get('share:id:' + code);
      let rec = { code, slug };
      try { if (raw) rec = Object.assign(JSON.parse(raw), { code }); } catch (e) {}
      return rec;
    }
  }
  let code = '';
  for (let i = 0; i < 8; i++) {
    const tryCode = mintCode(7);
    const taken = await kv.get('share:id:' + tryCode);
    if (!taken) {
      code = tryCode;
      break;
    }
  }
  if (!code) throw new Error('code');
  const rec = {
    code,
    slug: slug,
    url: payload && payload.url ? String(payload.url).slice(0, 1500) : '',
    createdAt: Date.now(),
    clicks: 0
  };
  await kv.put('share:id:' + code, JSON.stringify(rec));
  if (slug) await kv.put('share:slug:' + slug, code);
  return rec;
}

export async function resolveShort(kv, code) {
  if (!kv || !code) return null;
  const raw = await kv.get('share:id:' + code);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}

export async function bumpClicks(kv, rec) {
  if (!kv || !rec || !rec.code) return;
  rec.clicks = (Number(rec.clicks) || 0) + 1;
  rec.lastClick = Date.now();
  await kv.put('share:id:' + rec.code, JSON.stringify(rec));
}
