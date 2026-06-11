import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { LibGenSource } from '@/lib/sources/libgen'
import { AnnasArchiveSource } from '@/lib/sources/annas-archive'
import { getCachedSearch, setCachedSearch } from '@/lib/cache'
import { getOrCreateSessionId } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import type { SearchParams } from '@/lib/sources/types'

const libgen = new LibGenSource()
const annas = new AnnasArchiveSource()

async function searchWithFallback(params: SearchParams & { page: number }) {
  // Try LibGen first
  try {
    const results = await libgen.search(params)
    if (results.length > 0) return { results, source: 'libgen' }
  } catch (err) {
    console.warn("LibGen search failed, falling back to Anna's Archive:", err)
  }

  // Fallback: Anna's Archive
  const results = await annas.search(params)
  return { results, source: 'annas-archive' }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q = searchParams.get('q')?.trim()
  const lang = searchParams.get('lang') ?? undefined
  const ext = searchParams.get('ext') ?? undefined
  const page = parseInt(searchParams.get('page') ?? '1')

  if (!q) return NextResponse.json({ error: 'Missing query' }, { status: 400 })

  const filters = { lang: lang ?? '', ext: ext ?? '' }

  const cached = await getCachedSearch(q, filters)
  if (cached) {
    const cookieStore = await cookies()
    const sessionId = getOrCreateSessionId(cookieStore)
    await prisma.searchHistory.create({ data: { sessionId, query: q } })
    return NextResponse.json({ results: cached, fromCache: true })
  }

  try {
    const { results, source } = await searchWithFallback({ q, lang, ext, page })
    await setCachedSearch(q, filters, results)

    const cookieStore = await cookies()
    const sessionId = getOrCreateSessionId(cookieStore)
    await prisma.searchHistory.create({ data: { sessionId, query: q } })

    return NextResponse.json({ results, fromCache: false, source })
  } catch (err) {
    console.error('All search sources failed:', err)
    return NextResponse.json(
      { error: 'Search failed. Both sources are unavailable.' },
      { status: 503 }
    )
  }
}
