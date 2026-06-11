import { getCachedSearch, setCachedSearch } from '@/lib/cache'
import { prisma } from '@/lib/prisma'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    searchCache: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  },
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('search cache', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns null when no cache entry exists', async () => {
    mockPrisma.searchCache.findFirst.mockResolvedValue(null)
    const result = await getCachedSearch('dune', {})
    expect(result).toBeNull()
  })

  it('returns null when cache entry is expired', async () => {
    mockPrisma.searchCache.findFirst.mockResolvedValue({
      id: '1',
      query: 'dune',
      filters: {},
      results: [{ md5: 'abc', title: 'Dune' }],
      expiresAt: new Date(Date.now() - 1000),
      createdAt: new Date(),
    })
    const result = await getCachedSearch('dune', {})
    expect(result).toBeNull()
  })

  it('returns results when cache entry is valid', async () => {
    const results = [{ md5: 'abc', title: 'Dune', author: 'Herbert', extension: 'epub' }]
    mockPrisma.searchCache.findFirst.mockResolvedValue({
      id: '1',
      query: 'dune',
      filters: {},
      results,
      expiresAt: new Date(Date.now() + 60000),
      createdAt: new Date(),
    })
    const result = await getCachedSearch('dune', {})
    expect(result).toEqual(results)
  })

  it('saves results with 6h expiry', async () => {
    mockPrisma.searchCache.create.mockResolvedValue({} as any)
    const results = [{ md5: 'abc', title: 'Dune', author: 'Herbert', extension: 'epub' }]
    await setCachedSearch('dune', {}, results)
    expect(mockPrisma.searchCache.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ query: 'dune', results }),
      })
    )
    const call = mockPrisma.searchCache.create.mock.calls[0][0]
    const expiry = call.data.expiresAt as Date
    const sixHoursMs = 6 * 60 * 60 * 1000
    expect(expiry.getTime()).toBeGreaterThan(Date.now() + sixHoursMs - 5000)
    expect(expiry.getTime()).toBeLessThan(Date.now() + sixHoursMs + 5000)
  })
})
