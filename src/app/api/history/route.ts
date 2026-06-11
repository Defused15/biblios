import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getOrCreateSessionId } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const cookieStore = await cookies()
  const sessionId = getOrCreateSessionId(cookieStore)

  const history = await prisma.searchHistory.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json(history.map((h) => ({ query: h.query, createdAt: h.createdAt })))
}
