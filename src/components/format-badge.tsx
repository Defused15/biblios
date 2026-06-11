interface FormatBadgeProps {
  format: string
}

const FORMAT_COLORS: Record<string, string> = {
  epub: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30',
  pdf: 'bg-red-500/15 text-red-400 ring-red-500/30',
  mobi: 'bg-blue-500/15 text-blue-400 ring-blue-500/30',
  azw3: 'bg-purple-500/15 text-purple-400 ring-purple-500/30',
  djvu: 'bg-orange-500/15 text-orange-400 ring-orange-500/30',
}

export function FormatBadge({ format }: FormatBadgeProps) {
  const key = format.toLowerCase()
  const colors = FORMAT_COLORS[key] ?? 'bg-zinc-500/15 text-zinc-400 ring-zinc-500/30'

  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold tracking-widest uppercase ring-1 ring-inset ${colors}`}
    >
      {format.toUpperCase()}
    </span>
  )
}
