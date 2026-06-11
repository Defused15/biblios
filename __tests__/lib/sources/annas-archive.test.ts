import { AnnasArchiveSource } from '@/lib/sources/annas-archive'

const SEARCH_HTML = `
<html><body>
  <div class="js-vim-focus">
    <a href="/md5/aabbcc112233">
      <div>Dune</div>
      <div>Frank Herbert</div>
    </a>
    <div>epub</div>
    <img src="https://covers.openlibrary.org/b/id/1-M.jpg" />
  </div>
</body></html>`

const MD5_PAGE_HTML = `
<html><body>
  <img src="https://covers.openlibrary.org/b/id/12345-L.jpg" class="h-full" />
  <div class="mt-4">A story about a desert planet and spice.</div>
</body></html>`

global.fetch = jest.fn()

describe('AnnasArchiveSource', () => {
  const source = new AnnasArchiveSource()
  beforeEach(() => jest.clearAllMocks())

  it('returns empty array when search fetch fails', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('timeout'))
    const results = await source.search({ q: 'dune' })
    expect(results).toEqual([])
  })

  it('returns empty array when search returns non-ok response', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, text: async () => '' })
    const results = await source.search({ q: 'dune' })
    expect(results).toEqual([])
  })

  it('returns synopsis and cover from md5 page', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => MD5_PAGE_HTML,
    })
    const detail = await source.enrichDetail('aaa111')
    expect(detail.synopsis).toBeTruthy()
    expect(detail.hdCoverUrl).toContain('openlibrary.org')
  })

  it('returns empty object when enrichDetail fetch fails', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('timeout'))
    const detail = await source.enrichDetail('aaa111')
    expect(detail).toEqual({})
  })
})
