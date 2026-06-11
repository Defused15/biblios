import { NextRequest, NextResponse } from 'next/server'
import { LibGenSource } from '@/lib/sources/libgen'
import { AnnasArchiveSource } from '@/lib/sources/annas-archive'

const libgen = new LibGenSource()
const annas = new AnnasArchiveSource()

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ md5: string }> }
) {
  const { md5 } = await params

  const [searchResults, enrichment] = await Promise.all([
    libgen.search({ q: md5 }).catch(() => []),
    annas.enrichDetail(md5).catch(() => ({})),
  ])

  const book = searchResults[0] ?? null
  if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 })

  return NextResponse.json({ ...book, ...enrichment })
}
