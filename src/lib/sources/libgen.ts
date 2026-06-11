import * as cheerio from 'cheerio'
import type { BookSource, BookResult, DownloadLink, SearchParams } from './types'

const BASE = 'https://libgen.is'
const TIMEOUT_MS = 15_000

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, { signal: controller.signal })
  } finally {
    clearTimeout(timer)
  }
}

export class LibGenSource implements BookSource {
  async search(params: SearchParams): Promise<BookResult[]> {
    const url = new URL(`${BASE}/search.php`)
    url.searchParams.set('req', params.q)
    url.searchParams.set('res', '25')
    url.searchParams.set('view', 'simple')
    url.searchParams.set('phrase', '1')
    url.searchParams.set('column', 'def')
    if (params.ext) url.searchParams.set('ext', params.ext)
    if (params.lang) url.searchParams.set('language', params.lang)
    if (params.page) url.searchParams.set('page', String(params.page))

    const res = await fetchWithTimeout(url.toString())
    const html = await res.text()
    const $ = cheerio.load(html)

    const ids: string[] = []
    $('#searchtable tr:not(:first-child) td:nth-child(2) a').each((_, el) => {
      const href = $(el).attr('href') ?? ''
      const match = href.match(/req=(\d+)/)
      if (match) ids.push(match[1])
    })

    if (ids.length === 0) return []

    const jsonUrl = `${BASE}/json.php?ids=${ids.join(',')}&fields=Title,Author,Year,Language,Extension,Filesize,MD5,CoverURL,Publisher,ISBN,Pages`
    const jsonRes = await fetchWithTimeout(jsonUrl)
    const data = await jsonRes.json()

    return (data as any[]).map((item): BookResult => ({
      md5: item.md5?.toLowerCase() ?? '',
      title: item.title ?? '',
      author: item.author ?? '',
      year: item.year,
      language: item.language,
      extension: (item.extension ?? 'unknown').toLowerCase(),
      sizeBytes: item.filesize ? parseInt(item.filesize) : undefined,
      coverUrl: item.coverurl ? `${BASE}/${item.coverurl}` : undefined,
      publisher: item.publisher,
      isbn: item.isbn,
      pages: item.pages,
    }))
  }

  async resolveDownload(md5: string, ext: string): Promise<DownloadLink> {
    const url = `${BASE}/get.php?md5=${md5}`
    const res = await fetchWithTimeout(url)
    const html = await res.text()
    const $ = cheerio.load(html)

    const link = $('a[href]').filter((_, el) => {
      const href = $(el).attr('href') ?? ''
      return href.startsWith('http') && !href.includes('libgen.is')
    }).first()

    const href = link.attr('href')
    if (!href) throw new Error('No download link found')

    const filename = href.split('/').pop() ?? `book.${ext}`
    return { url: href, filename }
  }
}
