import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getOrCreateSessionId } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ md5: string }> }
) {
  const { md5 } = await params
  const cookieStore = await cookies()
  const sessionId = getOrCreateSessionId(cookieStore)

  await prisma.userFavorite.deleteMany({
    where: { sessionId, md5 },
  })

  return NextResponse.json({ ok: true })
}
