import { LibGenSource } from '@/lib/sources/libgen'

const SEARCH_HTML = `
<table id="searchtable">
  <tr><td></td></tr>
  <tr>
    <td><a href="/book/index.php?md5=AAA">Title One</a></td>
    <td><a href="search.php?req=1">1</a></td>
  </tr>
  <tr>
    <td><a href="/book/index.php?md5=BBB">Title Two</a></td>
    <td><a href="search.php?req=2">2</a></td>
  </tr>
</table>`

const JSON_RESPONSE = [
  {
    id: '1',
    title: 'Title One',
    author: 'Author A',
    year: '2020',
    language: 'English',
    extension: 'epub',
    filesize: '500000',
    md5: 'aaa111bbb222ccc333',
    coverurl: 'https://libgen.is/covers/1.jpg',
    publisher: 'Publisher A',
    isbn: '1234567890',
    pages: '300',
  },
]

const GET_PHP_HTML = `
<html><body>
<a href="https://download.library.lol/main/123/aaa111bbb222ccc333/title-one.epub">GET</a>
</body></html>`

global.fetch = jest.fn()

describe('LibGenSource', () => {
  const source = new LibGenSource()
  beforeEach(() => jest.clearAllMocks())

  it('searches and returns book results', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, text: async () => SEARCH_HTML })
      .mockResolvedValueOnce({ ok: true, json: async () => JSON_RESPONSE })

    const results = await source.search({ q: 'dune' })
    expect(results).toHaveLength(1)
    expect(results[0].title).toBe('Title One')
    expect(results[0].md5).toBe('aaa111bbb222ccc333')
    expect(results[0].extension).toBe('epub')
    expect(results[0].sizeBytes).toBe(500000)
  })

  it('returns empty array when search has no results', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => '<table id="searchtable"><tr><td>No results</td></tr></table>',
    })
    const results = await source.search({ q: 'xyzxyzxyz' })
    expect(results).toEqual([])
  })

  it('resolves download link from get.php', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => GET_PHP_HTML,
    })
    const link = await source.resolveDownload('aaa111bbb222ccc333', 'epub')
    expect(link.url).toBe(
      'https://download.library.lol/main/123/aaa111bbb222ccc333/title-one.epub'
    )
    expect(link.filename).toBe('title-one.epub')
  })

  it('throws when get.php has no download link', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () => '<html><body>Error</body></html>',
    })
    await expect(source.resolveDownload('badmd5', 'epub')).rejects.toThrow(
      'No download link found'
    )
  })
})
