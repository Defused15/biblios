'use client'

import { useState, useRef } from 'react'
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SearchFilters {
  lang?: string
  ext?: string
}

interface SearchBarProps {
  onSearch: (q: string, filters: SearchFilters) => void
  loading?: boolean
}

const LANGUAGES = [
  { value: '', label: 'Cualquier idioma' },
  { value: 'en', label: 'Inglés' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Francés' },
  { value: 'de', label: 'Alemán' },
  { value: 'pt', label: 'Portugués' },
]

const FORMATS = [
  { value: '', label: 'Cualquier formato' },
  { value: 'epub', label: 'EPUB' },
  { value: 'pdf', label: 'PDF' },
  { value: 'mobi', label: 'MOBI' },
]

export function SearchBar({ onSearch, loading = false }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [lang, setLang] = useState('')
  const [ext, setExt] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault()
    const q = query.trim()
    if (!q || loading) return
    onSearch(q, { lang: lang || undefined, ext: ext || undefined })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Busca por título, autor o ISBN…"
            disabled={loading}
            className="pl-10 pr-4 h-12 bg-zinc-900 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-amber-500/50 focus-visible:border-amber-500/50 text-base disabled:opacity-50"
          />
        </div>

        <Button
          onClick={() => handleSubmit()}
          disabled={loading || !query.trim()}
          className="h-12 px-5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold shrink-0 disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>

        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          aria-label="Mostrar filtros"
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md border transition-colors ${
            filtersOpen || lang || ext
              ? 'border-amber-500/60 bg-amber-500/10 text-amber-400'
              : 'border-zinc-700 bg-zinc-900 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      {filtersOpen && (
        <div className="mt-2 flex gap-3 rounded-md border border-zinc-800 bg-zinc-900/80 px-4 py-3">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Idioma
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="rounded bg-zinc-800 border border-zinc-700 px-2 py-1.5 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            >
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <label className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
              Formato
            </label>
            <select
              value={ext}
              onChange={(e) => setExt(e.target.value)}
              className="rounded bg-zinc-800 border border-zinc-700 px-2 py-1.5 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            >
              {FORMATS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
