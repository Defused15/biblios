import { prisma } from './prisma'

const MAX_DOWNLOADS = 20
const WINDOW_MS = 60 * 60 * 1000

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt?: Date
}

export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const now = new Date()
  const windowEnd = new Date(now.getTime() + WINDOW_MS)

  const record = await prisma.rateLimit.upsert({
    where: { ip },
    update: {
      count: { increment: 1 },
      windowEnd: { set: windowEnd },
    },
    create: { ip, count: 1, windowEnd },
  })

  if (record.count >= MAX_DOWNLOADS) {
    return { allowed: false, remaining: 0, resetAt: record.windowEnd }
  }

  return { allowed: true, remaining: MAX_DOWNLOADS - record.count }
}
