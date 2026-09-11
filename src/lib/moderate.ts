const INSULTS = /\b(idiota|imbecil|imbécil|estupido|estúpido|mierda|cabr[oó]n|hijo\s*de\s*puta|gilipollas|maric[oó]n|puta|joder\s+tu)\b/i
const SPAM = /\b(crypto\s*airdrop|guaranteed\s*profit|buy\s*followers|casino\s*bonus|viagra|onlyfans)\b/i
const AFFILIATE = /(\bbit\.ly\/|\bamzn\.to\/|\bsclick\b|\bref=|\baffiliate=|\bcampaign=spam)/i

export type ModerateResult = { ok: true } | { ok: false; reason: string }

export function moderateText(raw: string): ModerateResult {
  const text = String(raw || '').trim()
  if (text.length < 10) return { ok: false, reason: 'too_short' }
  if (INSULTS.test(text)) return { ok: false, reason: 'abuse' }
  if (SPAM.test(text)) return { ok: false, reason: 'spam' }
  if (AFFILIATE.test(text)) return { ok: false, reason: 'affiliate' }
  return { ok: true }
}
