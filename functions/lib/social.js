import { STATIC_GUIDES } from './feed.js';

export const PINNED_KEY = 'guide:pinned';
export const STATS_PREFIX = 'guide:stats:';
const JWT_FALLBACK = 'trujillo_jwt_secret_2026';
const OWNERS = ['alberto@trujillomingorance.com', 'atrumin16@gmail.com'];

function b64urlToBytes(s) {
  const pad = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function verifyJwtToken(token, secret) {
  try {
    const parts = String(token || '').split('.');
    if (parts.length !== 3) return null;
    const [header, payload, sig] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret || JWT_FALLBACK),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const binarySig = Uint8Array.from(atob(sig.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, binarySig, enc.encode(header + '.' + payload));
    if (!valid) return null;
    const obj = JSON.parse(atob(payload));
    if (obj.exp && obj.exp < Math.floor(Date.now() / 1000)) return null;
    return obj;
  } catch (e) {
    return null;
  }
}

function cookieMap(request) {
  const raw = request.headers.get('Cookie') || '';
  const out = Object.create(null);
  raw.split(';').forEach((part) => {
    const i = part.indexOf('=');
    if (i < 1) return;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

export async function readSession(request, env) {
  const auth = request.headers.get('Authorization') || '';
  let token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token) {
    const cookies = cookieMap(request);
    token = cookies.auth_token || cookies.ta_session || cookies.session_token || cookies.token || '';
  }
  if (!token) return null;
  const payload = await verifyJwtToken(token, (env && env.JWT_SECRET) || JWT_FALLBACK);
  if (!payload) return null;
  const email = String(payload.email || '').toLowerCase();
  let user = null;
  if (email && env && env.BOT_MEMORY) {
    try {
      const raw = await env.BOT_MEMORY.get('user_email_' + email);
      if (raw) user = JSON.parse(raw);
    } catch (e) {}
  }
  const handle = String((user && user.handle) || '').replace(/^@/, '').toLowerCase();
  return {
    id: (user && user.id) || payload.sub || '',
    email: email,
    handle: handle,
    name: (user && user.name) || '',
    picture: (user && user.picture) || '',
    owner: OWNERS.indexOf(email) !== -1
  };
}

export function clientVoterId(request, session) {
  if (session && (session.id || session.email)) return 'u:' + String(session.id || session.email).slice(0, 80);
  const hdr = String(request.headers.get('X-Client-Id') || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
  if (hdr.length >= 8) return 'c:' + hdr;
  return '';
}

export function voteValue(v) {
  if (v === -1 || v === 'down') return -1;
  if (v === 1 || v === 'up' || (typeof v === 'number' && v > 1)) return 1;
  return 0;
}

export function tallyVotes(votes) {
  let up = 0;
  let down = 0;
  Object.keys(votes || {}).forEach((k) => {
    if (voteValue(votes[k]) === -1) down += 1;
    else up += 1;
  });
  return { up, down, likes: up, score: up - down };
}

const STATS_CACHE = new Map();
const STATS_TTL_MS = 60000;
let PINNED_CACHE = { list: null, exp: 0 };

export async function loadStats(kv, slug) {
  const empty = { likes: 0, up: 0, down: 0, score: 0, voters: {}, pinned: false };
  if (!kv || !slug) return empty;
  const now = Date.now();
  const cached = STATS_CACHE.get(slug);
  if (cached && cached.exp > now) {
    return cached.val;
  }
  const raw = await kv.get(STATS_PREFIX + slug);
  if (!raw) {
    STATS_CACHE.set(slug, { val: empty, exp: now + STATS_TTL_MS });
    return empty;
  }
  try {
    const parsed = JSON.parse(raw);
    const voters = parsed.voters && typeof parsed.voters === 'object' ? parsed.voters : {};
    const t = tallyVotes(voters);
    const result = {
      likes: t.likes,
      up: t.up,
      down: t.down,
      score: t.score,
      voters: voters,
      pinned: !!parsed.pinned
    };
    STATS_CACHE.set(slug, { val: result, exp: now + STATS_TTL_MS });
    return result;
  } catch (e) {
    return empty;
  }
}

export async function saveStats(kv, slug, stats) {
  if (!kv || !slug) return;
  STATS_CACHE.delete(slug);
  const voters = stats.voters || {};
  const keys = Object.keys(voters);
  if (keys.length > 400) {
    keys.slice(0, keys.length - 400).forEach((k) => { delete voters[k]; });
  }
  const t = tallyVotes(voters);
  await kv.put(STATS_PREFIX + slug, JSON.stringify({
    likes: t.likes,
    up: t.up,
    down: t.down,
    score: t.score,
    voters: voters,
    pinned: !!stats.pinned
  }));
}

export async function loadPinned(kv) {
  if (!kv) return [];
  const now = Date.now();
  if (PINNED_CACHE.list && PINNED_CACHE.exp > now) {
    return PINNED_CACHE.list;
  }
  const raw = await kv.get(PINNED_KEY);
  if (!raw) {
    PINNED_CACHE = { list: [], exp: now + STATS_TTL_MS };
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
    PINNED_CACHE = { list, exp: now + STATS_TTL_MS };
    return list;
  } catch (e) {
    return [];
  }
}

export async function savePinned(kv, list) {
  PINNED_CACHE = { list: null, exp: 0 };
  if (!kv) return;
  const uniq = [];
  const seen = Object.create(null);
  (list || []).forEach((slug) => {
    const s = String(slug || '');
    if (!s || seen[s]) return;
    seen[s] = 1;
    uniq.push(s);
  });
  await kv.put(PINNED_KEY, JSON.stringify(uniq.slice(0, 24)));
}

export async function attachSocial(kv, guides, voter) {
  const pinned = await loadPinned(kv);
  const pinSet = Object.create(null);
  pinned.forEach((s) => { pinSet[s] = 1; });
  const list = Array.isArray(guides) ? guides : [];
  const stats = await Promise.all(list.map((g) => loadStats(kv, g && g.slug)));
  return list.map((g, i) => {
    const st = stats[i] || { likes: 0, voters: {}, pinned: false };
    const mine = voter && st.voters ? voteValue(st.voters[voter]) : 0;
    return Object.assign({}, g, {
      likes: st.likes || 0,
      up: st.up || 0,
      down: st.down || 0,
      score: st.score || 0,
      pinned: !!(pinSet[g.slug] || st.pinned),
      liked: mine === 1,
      disliked: mine === -1
    });
  });
}

export function featuredGuides(guides) {
  const list = Array.isArray(guides) ? guides.slice() : [];
  const pinned = list.filter((g) => g && g.pinned);
  if (pinned.length) {
    pinned.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    return pinned;
  }
  list.sort((a, b) => (b.likes || 0) - (a.likes || 0) || (b.updatedAt || 0) - (a.updatedAt || 0));
  return list.slice(0, 8);
}

export function canPin(session, guide) {
  if (!session) return false;
  if (session.owner) return true;
  const h = String((guide && guide.handle) || '').replace(/^@/, '').toLowerCase();
  return !!(session.handle && h && session.handle === h);
}

export function canEdit(session, guide) {
  if (!session || !guide) return false;
  const h = String(guide.handle || '').replace(/^@/, '').toLowerCase();
  if (session.handle && h && session.handle === h) return true;
  if (session.owner && guide.static) return true;
  return false;
}

export { STATIC_GUIDES, b64urlToBytes };
