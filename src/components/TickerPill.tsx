'use client'

type Props = { symbol: string }

export function TickerPill({ symbol }: Props) {
  const s = String(symbol || '').replace(/^\$/, '').toUpperCase()
  return (
    <a
      href={`https://www.tradingview.com/symbols/${encodeURIComponent(s)}/`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-xs font-semibold text-neutral-200 hover:border-white/25 hover:text-white"
      title={s}
    >
      <span className="opacity-70">$</span>
      {s}
    </a>
  )
}
