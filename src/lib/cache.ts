import { prisma } from './prisma'
import type { BookResult } from './sources/types'

export async function getCachedSearch(
  query: string,
  filters: Record<string, string>
): Promise<BookResult[] | null> {
  const entry = await prisma.searchCache.findFirst({
    where: {
      query,
      expiresAt: { gt: new Date() },
    },
  })
  if (!entry) return null
  // Check if entry has expired
  if (entry.expiresAt < new Date()) {
    return null
  }
  // Manual check for filters since Prisma JSON filtering with direct comparison may vary
  if (JSON.stringify(entry.filters) !== JSON.stringify(filters)) {
    return null
  }
  return entry.results as unknown as BookResult[]
}

export async function setCachedSearch(
  query: string,
  filters: Record<string, string>,
  results: BookResult[]
): Promise<void> {
  const expiresAt = new Date(Date.now() + 6 * 60 * 60 * 1000)
  await prisma.searchCache.create({
    data: { query, filters: filters as object, results: results as unknown as object[], expiresAt },
  })
}
