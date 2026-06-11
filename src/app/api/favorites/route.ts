import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getOrCreateSessionId } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const cookieStore = await cookies()
  const sessionId = getOrCreateSessionId(cookieStore)
  const favorites = await prisma.userFavorite.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(favorites.map((f) => ({ md5: f.md5, ...(f.metadata as object) })))
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const sessionId = getOrCreateSessionId(cookieStore)
  const body = await req.json()
  const { md5, ...metadata } = body

  if (!md5) return NextResponse.json({ error: 'Missing md5' }, { status: 400 })

  await prisma.userFavorite.upsert({
    where: { sessionId_md5: { sessionId, md5 } },
    update: {},
    create: { sessionId, md5, metadata },
  })

  return NextResponse.json({ ok: true })
}
