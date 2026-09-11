import { FileArchive, FileCode, FileSpreadsheet, FileText, Presentation } from 'lucide-react'
import { formatBytes, type AttachmentMeta } from '../lib/attachments'

function Icon({ ext }: { ext: string }) {
  if (['xlsx', 'xls', 'csv', 'parquet'].includes(ext)) return <FileSpreadsheet className="h-5 w-5" />
  if (['zip', 'rar', '7z', 'tar', 'gz', 'tgz'].includes(ext)) return <FileArchive className="h-5 w-5" />
  if (['pptx', 'ppt'].includes(ext)) return <Presentation className="h-5 w-5" />
  if (['json', 'yaml', 'yml', 'sh', 'md'].includes(ext)) return <FileCode className="h-5 w-5" />
  return <FileText className="h-5 w-5" />
}

export function AttachmentItem({ name, ext, size, url }: AttachmentMeta) {
  return (
    <a
      href={url}
      download
      className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-neutral-200 hover:border-neutral-700"
    >
      <span className="text-neutral-400"><Icon ext={ext} /></span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-white">{name}</span>
        <span className="text-xs text-neutral-500">{formatBytes(size)}</span>
      </span>
      <span className="rounded-md border border-neutral-800 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-400">
        {ext}
      </span>
    </a>
  )
}
