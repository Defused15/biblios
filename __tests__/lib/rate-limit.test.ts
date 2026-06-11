import { checkRateLimit } from '@/lib/rate-limit'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    rateLimit: {
      upsert: jest.fn(),
    },
  },
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('rate limit', () => {
  beforeEach(() => jest.clearAllMocks())

  it('allows request when under limit', async () => {
    mockPrisma.rateLimit.upsert.mockResolvedValue({
      ip: '1.2.3.4',
      count: 5,
      windowEnd: new Date(Date.now() + 30 * 60 * 1000),
    } as any)
    const result = await checkRateLimit('1.2.3.4')
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(15)
  })

  it('blocks request when at limit', async () => {
    mockPrisma.rateLimit.upsert.mockResolvedValue({
      ip: '1.2.3.4',
      count: 20,
      windowEnd: new Date(Date.now() + 30 * 60 * 1000),
    } as any)
    const result = await checkRateLimit('1.2.3.4')
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
    expect(result.resetAt).toBeInstanceOf(Date)
  })
})
