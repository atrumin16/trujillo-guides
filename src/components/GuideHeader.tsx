'use client'

import { useState } from 'react'

type Props = {
  title: string
  authorName: string
  handle?: string
  avatar?: string
  category?: string
  publishedAt?: number
}

export function GuideHeader({ title, authorName, handle, avatar, category, publishedAt }: Props) {
  const [copied, setCopied] = useState(false)
  const when = publishedAt
    ? new Date(publishedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {}
  }

  return (
    <header className="mx-auto max-w-3xl px-6 pt-8">
      <h1 className="mb-3 text-3xl font-bold tracking-tight text-white">{title}</h1>
      <div className="mb-8 flex flex-wrap items-center gap-2.5 border-b border-neutral-800 pb-4">
        <img
          src={avatar || '/avatar.png'}
          alt=""
          width={28}
          height={28}
          className="h-7 w-7 rounded-full bg-neutral-800 object-cover"
        />
        <p className="text-[13px] text-neutral-400">
          <span className="font-medium text-neutral-200">{authorName}</span>
          {handle ? <span> · @{handle}</span> : null}
          {category ? <span> · {category}</span> : null}
          {when ? <span> · {when}</span> : null}
        </p>
        <button
          type="button"
          onClick={copy}
          className="ml-auto rounded-lg border border-neutral-800 px-2.5 py-1 text-xs text-neutral-300 hover:text-white"
        >
          {copied ? 'Copiado' : 'Copiar enlace'}
        </button>
      </div>
    </header>
  )
}
