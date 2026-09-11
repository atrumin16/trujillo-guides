export const ALLOWED_EXT = [
  'pdf', 'docx', 'doc', 'txt', 'rtf', 'odt',
  'xlsx', 'xls', 'csv', 'json', 'parquet',
  'pptx', 'ppt',
  'zip', 'tar', 'gz', 'tgz', 'rar', '7z',
  'yaml', 'yml', 'sh', 'md'
] as const

export const BLOCKED_EXT = [
  'exe', 'msi', 'bat', 'cmd', 'vbs', 'scr', 'com', 'pif', 'dll', 'js', 'ps1', 'apk', 'app'
] as const

export type AttachmentMeta = {
  name: string
  ext: string
  size: number
  url: string
}

export function fileExt(name: string) {
  const n = String(name || '').toLowerCase()
  if (n.endsWith('.tar.gz')) return 'tar.gz'
  const i = n.lastIndexOf('.')
  return i >= 0 ? n.slice(i + 1) : ''
}

export function isBlockedExt(ext: string) {
  return (BLOCKED_EXT as readonly string[]).includes(String(ext || '').toLowerCase())
}

export function isAllowedExt(ext: string) {
  const e = String(ext || '').toLowerCase()
  if (isBlockedExt(e)) return false
  return (ALLOWED_EXT as readonly string[]).includes(e) || e === 'tar.gz'
}

export function formatBytes(n: number) {
  const v = Number(n) || 0
  if (v < 1024) return v + ' B'
  if (v < 1024 * 1024) return (v / 1024).toFixed(1) + ' KB'
  return (v / (1024 * 1024)).toFixed(1) + ' MB'
}

export function sanitizeAttachment(raw: Partial<AttachmentMeta> | null): AttachmentMeta | null {
  if (!raw) return null
  const name = String(raw.name || '').replace(/[^\w.\- ()áéíóúñ]+/gi, '').slice(0, 120)
  const ext = fileExt(name || String(raw.ext || ''))
  const url = String(raw.url || '')
  if (!name || !isAllowedExt(ext)) return null
  if (!/^https:\/\//i.test(url) && !url.startsWith('/')) return null
  return { name, ext, size: Math.max(0, Number(raw.size) || 0), url: url.slice(0, 500) }
}
