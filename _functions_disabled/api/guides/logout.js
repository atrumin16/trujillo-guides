const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Client-Id',
  'Access-Control-Allow-Credentials': 'true'
};

function expire(name) {
  return name + '=; Path=/; Max-Age=0; SameSite=Lax';
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS });
}

export async function onRequestPost() {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...CORS
  });
  headers.append('Set-Cookie', expire('ta_session'));
  headers.append('Set-Cookie', expire('trujillo_ai_token'));
  return new Response(JSON.stringify({ ok: true }), { headers });
}
