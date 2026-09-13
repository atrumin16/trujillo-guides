const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Client-Id'
};

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS }
  });
}

function parseGtx(data) {
  if (!data || !data[0]) return '';
  return data[0].map((row) => (row && row[0] ? row[0] : '')).join('');
}

async function translateOne(text, tl) {
  const src = String(text || '');
  if (!src.trim()) return src;
  try {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' +
      encodeURIComponent(tl) + '&dt=t&q=' + encodeURIComponent(src);
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const out = parseGtx(data);
      if (out && out.trim() && out.trim() !== src.trim()) return out;
    }
  } catch (e) {}
  try {
    const url = 'https://api.mymemory.translated.net/get?q=' +
      encodeURIComponent(src.slice(0, 480)) + '&langpair=es|' + encodeURIComponent(tl);
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const out = data && data.responseData && data.responseData.translatedText;
      if (out && String(out).trim()) return String(out);
    }
  } catch (e) {}
  return src;
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestPost(context) {
  const body = await context.request.json().catch(() => null);
  const tl = String((body && body.tl) || 'en').toLowerCase().replace(/[^a-z-]/g, '').slice(0, 8) || 'en';
  if (tl === 'es') return json({ texts: Array.isArray(body && body.q) ? body.q : [String((body && body.q) || '')] });
  const items = Array.isArray(body && body.q)
    ? body.q.slice(0, 30).map((s) => String(s || '').slice(0, 4500))
    : [String((body && body.q) || '').slice(0, 4500)];
  const texts = [];
  for (const text of items) texts.push(await translateOne(text, tl));
  return json({ ok: true, tl, texts });
}
