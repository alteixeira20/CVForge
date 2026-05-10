import { type Settings } from '@/types/cv'

interface PreviewEntryTopProps {
  title?: string
  dates?: string
  settings: Settings
}

interface PreviewEntryMetaProps {
  label?: string
  value?: string
  settings: Settings
  italic?: boolean
}

export function PreviewEntryTop({ title, dates, settings }: PreviewEntryTopProps) {
  if (!title && !dates) return null

  return (
    <div className="flex justify-between items-baseline">
      {title ? <span className="font-bold text-gray-900" style={{ fontSize: settings.fontSize }}>{title}</span> : <span />}
      {dates && (
        <span className="text-gray-500 italic" style={{ fontSize: Math.max(8, settings.fontSize-1) }}>
          {dates}
        </span>
      )}
    </div>
  )
}

export function PreviewEntryMeta({ label, value, settings, italic = false }: PreviewEntryMetaProps) {
  if (!label && !value) return null
  const labelClass = italic ? 'text-gray-700 italic' : 'text-gray-700'

  return (
    <div className="flex justify-between items-baseline">
      {label ? <span className={labelClass} style={{ fontSize: Math.max(9, settings.fontSize-1) }}>{label}</span> : <span />}
      {value && <span className="text-gray-500" style={{ fontSize: Math.max(8, settings.fontSize-1) }}>{value}</span>}
    </div>
  )
}
