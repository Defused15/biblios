'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, Search } from 'lucide-react'

interface HistoryEntry {
  query: string
  createdAt: string
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/history')
      .then((r) => r.json())
      .then((data) => setHistory(data))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false))
  }, [])

  function handleSearch(q: string) {
    router.push(`/?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to search
      </Link>

      <div className="mb-8 flex items-center gap-3">
        <Clock className="h-6 w-6 text-zinc-400" />
        <h1 className="font-serif text-2xl font-semibold text-zinc-100">Search History</h1>
      </div>

      {loading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 rounded-md bg-zinc-900 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && history.length === 0 && (
        <div className="py-20 text-center">
          <Clock className="mx-auto mb-4 h-12 w-12 text-zinc-800" />
          <p className="font-serif text-xl text-zinc-500">No search history yet.</p>
          <p className="mt-2 text-sm text-zinc-600">Your searches will appear here.</p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-400 transition-colors"
          >
            Start searching
          </Link>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div className="flex flex-col divide-y divide-zinc-800 rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
          {history.map((entry, i) => (
            <button
              key={i}
              onClick={() => handleSearch(entry.query)}
              className="flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-800 group"
            >
              <Search className="h-3.5 w-3.5 shrink-0 text-zinc-600 group-hover:text-amber-400 transition-colors" />
              <span className="flex-1 text-sm text-zinc-300 truncate group-hover:text-zinc-100 transition-colors">
                {entry.query}
              </span>
              <span className="text-xs text-zinc-600 shrink-0">
                {timeAgo(entry.createdAt)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
