import * as cheerio from 'cheerio'
import type { BookDetail, BookResult, SearchParams } from './types'

const BASE = 'https://annas-archive.org'
const HEADERS = { 'User-Agent': 'Mozilla/5.0 (compatible; Biblios/1.0)' }

async function fetchWithTimeout(url: string, timeoutMs = 12_000): Promise<Response> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { signal: controller.signal, headers: HEADERS })
  } finally {
    clearTimeout(timer)
  }
}

export class AnnasArchiveSource {
  async search(params: SearchParams): Promise<BookResult[]> {
    try {
      const url = new URL(`${BASE}/search`)
      url.searchParams.set('q', params.q)
      if (params.ext) url.searchParams.set('ext', params.ext)
      if (params.lang) url.searchParams.set('lang', params.lang)
      if (params.page && params.page > 1) url.searchParams.set('page', String(params.page))

      const res = await fetchWithTimeout(url.toString())
      if (!res.ok) return []

      const html = await res.text()
      const $ = cheerio.load(html)
      const results: BookResult[] = []

      $('a[href^="/md5/"]').each((_, el) => {
        const href = $(el).attr('href') ?? ''
        const md5 = href.replace('/md5/', '').split('?')[0]
        if (!md5 || md5.length < 10) return

        const text = $(el).text().trim()
        const lines = text.split('\n').map((l: string) => l.trim()).filter(Boolean)
        const title = lines[0] ?? ''
        const author = lines[1] ?? ''

        const img = $(el).find('img').attr('src') ?? $(el).closest('div').find('img').attr('src')
        const extMatch = $(el).closest('div').text().match(/\b(epub|pdf|mobi|azw3|djvu|fb2)\b/i)

        if (title) {
          results.push({
            md5,
            title,
            author,
            extension: extMatch ? extMatch[1].toLowerCase() : 'unknown',
            coverUrl: img,
          })
        }
      })

      return results
    } catch {
      return []
    }
  }

  async enrichDetail(md5: string): Promise<Partial<BookDetail>> {
    try {
      const res = await fetchWithTimeout(`${BASE}/md5/${md5}`)
      if (!res.ok) return {}

      const html = await res.text()
      const $ = cheerio.load(html)

      const hdCoverUrl = $('img[src*="openlibrary"], img[src*="covers"]').first().attr('src')
      const synopsis = $('div.mt-4, div[class*="description"]').first().text().trim() || undefined

      return { hdCoverUrl, synopsis }
    } catch {
      return {}
    }
  }
}
