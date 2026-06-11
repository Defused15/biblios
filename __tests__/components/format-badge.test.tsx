import { render, screen } from '@testing-library/react'
import { FormatBadge } from '@/components/format-badge'

describe('FormatBadge', () => {
  it('renders the format in uppercase', () => {
    render(<FormatBadge format="epub" />)
    expect(screen.getByText('EPUB')).toBeInTheDocument()
  })

  it('applies green color for epub', () => {
    render(<FormatBadge format="epub" />)
    const badge = screen.getByText('EPUB')
    expect(badge.className).toContain('emerald')
  })

  it('applies red color for pdf', () => {
    render(<FormatBadge format="pdf" />)
    const badge = screen.getByText('PDF')
    expect(badge.className).toContain('red')
  })

  it('applies blue color for mobi', () => {
    render(<FormatBadge format="mobi" />)
    const badge = screen.getByText('MOBI')
    expect(badge.className).toContain('blue')
  })

  it('applies purple color for azw3', () => {
    render(<FormatBadge format="azw3" />)
    const badge = screen.getByText('AZW3')
    expect(badge.className).toContain('purple')
  })

  it('applies orange color for djvu', () => {
    render(<FormatBadge format="djvu" />)
    const badge = screen.getByText('DJVU')
    expect(badge.className).toContain('orange')
  })

  it('applies zinc color for unknown formats', () => {
    render(<FormatBadge format="txt" />)
    const badge = screen.getByText('TXT')
    expect(badge.className).toContain('zinc')
  })

  it('handles uppercase input', () => {
    render(<FormatBadge format="EPUB" />)
    expect(screen.getByText('EPUB')).toBeInTheDocument()
  })
})
