import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DownloadButton } from '@/components/download-button'

const defaultProps = {
  md5: 'abc123',
  ext: 'epub',
  filename: 'test-book.epub',
}

describe('DownloadButton', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
    URL.createObjectURL = jest.fn().mockReturnValue('blob:test')
    URL.revokeObjectURL = jest.fn()

    // Mock document.createElement for anchor clicks
    const origCreate = document.createElement.bind(document)
    jest.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = origCreate(tag)
      if (tag === 'a') {
        jest.spyOn(el as HTMLAnchorElement, 'click').mockImplementation(() => {})
      }
      return el
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders idle state with Download label', () => {
    render(<DownloadButton {...defaultProps} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Download')).toBeInTheDocument()
  })

  it('triggers download on click and shows done', async () => {
    const blob = new Blob(['content'], { type: 'application/epub+zip' })
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/epub+zip' },
      blob: () => Promise.resolve(blob),
    })

    render(<DownloadButton {...defaultProps} />)
    fireEvent.click(screen.getByText('Download'))

    await waitFor(() => expect(screen.getByText('Done')).toBeInTheDocument())
  })

  it('shows size warning when response has warning field', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      headers: { get: () => 'application/json' },
      json: () =>
        Promise.resolve({
          warning: 'large file',
          sizeBytes: 60 * 1024 * 1024,
          fallbackUrl: 'https://example.com/file',
        }),
    })

    render(<DownloadButton {...defaultProps} />)
    fireEvent.click(screen.getByText('Download'))

    await waitFor(() =>
      expect(screen.getByText(/Large file/)).toBeInTheDocument()
    )
  })

  it('shows error state when fetch fails', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<DownloadButton {...defaultProps} />)
    fireEvent.click(screen.getByText('Download'))

    await waitFor(() => expect(screen.getByText('Retry')).toBeInTheDocument())
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })

  it('shows error state on non-ok response', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 429,
      json: () => Promise.resolve({ error: 'Rate limit exceeded' }),
    })

    render(<DownloadButton {...defaultProps} />)
    fireEvent.click(screen.getByText('Download'))

    await waitFor(() => expect(screen.getByText('Retry')).toBeInTheDocument())
    expect(screen.getByText('Rate limit exceeded')).toBeInTheDocument()
  })
})
