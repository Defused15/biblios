'use client'

import { useState, useCallback } from 'react'
import { SearchBar } from '@/components/search-bar'
import { BookCard } from '@/components/book-card'
import { BookSkeleton } from '@/components/book-skeleton'
import type { BookResult } from '@/lib/sources/types'

interface SearchFilters {
  lang?: string
  ext?: string
}

export default function HomePage() {
  const [results, setResults] = useState<BookResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<string | null>(null)

  const handleSearch = useCallback(async (q: string, filters: SearchFilters) => {
    setLoading(true)
    setError(null)
    setSearched(true)

    const params = new URLSearchParams({ q })
    if (filters.lang) params.set('lang', filters.lang)
    if (filters.ext) params.set('ext', filters.ext)

    try {
      const res = await fetch(`/api/search?${params}`)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Error ${res.status}`)
      }
      const data = await res.json()
      setResults(data.results ?? [])
      setSource(data.source ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="font-serif text-5xl font-semibold tracking-tight text-zinc-100 sm:text-6xl">
          Find any book.
          <br />
          <span className="text-amber-400">Download it free.</span>
        </h1>
        <p className="mt-4 text-base text-zinc-500">
          Millions of titles across every format — EPUB, PDF, MOBI, and more.
        </p>
      </div>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {/* Results */}
      <div className="mt-10">
        {loading && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <BookSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {!loading && searched && !error && results.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-serif text-xl text-zinc-500">No results found.</p>
            <p className="mt-2 text-sm text-zinc-600">Try a different title, author, or ISBN.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-zinc-500">
                {results.length} result{results.length !== 1 ? 's' : ''}
                {source === 'annas-archive' && (
                  <span className="ml-2 rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500">
                    via Anna's Archive
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {results.map((book) => (
                <BookCard key={book.md5} book={book} />
              ))}
            </div>
          </>
        )}

        {!searched && !loading && (
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center gap-3 text-zinc-700">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p className="font-serif text-lg">Start searching to find books</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
