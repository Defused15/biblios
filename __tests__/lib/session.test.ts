jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-12345678-1234-1234-1234-123456789012'),
}))

import { getOrCreateSessionId, SESSION_COOKIE } from '@/lib/session'

const mockCookies = (value: string | undefined) => ({
  get: jest.fn().mockReturnValue(value ? { value } : undefined),
  set: jest.fn(),
})

describe('session', () => {
  it('returns existing session id from cookie', () => {
    const cookies = mockCookies('existing-uuid-123')
    const id = getOrCreateSessionId(cookies as any)
    expect(id).toBe('existing-uuid-123')
    expect(cookies.set).not.toHaveBeenCalled()
  })

  it('creates and sets a new uuid when cookie is absent', () => {
    const cookies = mockCookies(undefined)
    const id = getOrCreateSessionId(cookies as any)
    expect(id).toBe('test-uuid-12345678-1234-1234-1234-123456789012')
    expect(cookies.set).toHaveBeenCalledWith(
      SESSION_COOKIE,
      id,
      expect.objectContaining({ httpOnly: true, path: '/' })
    )
  })
})
