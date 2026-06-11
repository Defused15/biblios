import { v4 as uuidv4 } from 'uuid'

export const SESSION_COOKIE = 'biblios-session'

type CookieStore = {
  get(name: string): { value: string } | undefined
  set(name: string, value: string, options: object): void
}

export function getOrCreateSessionId(cookies: CookieStore): string {
  const existing = cookies.get(SESSION_COOKIE)
  if (existing) return existing.value

  const id = uuidv4()
  cookies.set(SESSION_COOKIE, id, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
  return id
}
