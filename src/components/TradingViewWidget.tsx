'use client'

import { useMemo } from 'react'

type Props = {
  symbol: string
  interval?: string
  theme?: 'dark' | 'light'
}

export function TradingViewWidget({ symbol, interval = 'D', theme = 'dark' }: Props) {
  const src = useMemo(() => {
    const qs = new URLSearchParams({
      symbol: String(symbol || 'NASDAQ:AAPL').toUpperCase(),
      interval: interval || 'D',
      hidesidetoolbar: '1',
      theme: theme === 'light' ? 'light' : 'dark',
      style: '1',
      locale: 'es',
      hideideas: '1'
    })
    return 'https://s.tradingview.com/widgetembed/?' + qs.toString()
  }, [symbol, interval, theme])

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-neutral-800 bg-[#0a0a0a]">
      <iframe
        src={src}
        title={`TradingView ${symbol}`}
        className="h-[420px] w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
