import { NextRequest, NextResponse } from 'next/server'
import { LibGenSource } from '@/lib/sources/libgen'
import { checkRateLimit } from '@/lib/rate-limit'

const source = new LibGenSource()
const SIZE_WARNING_BYTES = 50 * 1024 * 1024

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    '0.0.0.0'
  )
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const md5 = searchParams.get('md5')
  const ext = searchParams.get('ext') ?? 'epub'

  if (!md5) return NextResponse.json({ error: 'Missing md5' }, { status: 400 })

  const ip = getClientIp(req)
  const limit = await checkRateLimit(ip)
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded', resetAt: limit.resetAt },
      { status: 429 }
    )
  }

  let downloadLink
  try {
    downloadLink = await source.resolveDownload(md5, ext)
  } catch {
    return NextResponse.json({ error: 'Could not resolve download link' }, { status: 502 })
  }

  const fileRes = await fetch(downloadLink.url)
  if (!fileRes.ok || !fileRes.body) {
    return NextResponse.json(
      { error: 'Download failed', fallbackUrl: downloadLink.url },
      { status: 502 }
    )
  }

  const contentLength = fileRes.headers.get('content-length')
  const sizeBytes = contentLength ? parseInt(contentLength) : undefined

  if (sizeBytes && sizeBytes > SIZE_WARNING_BYTES) {
    return NextResponse.json(
      { warning: 'File too large for streaming', fallbackUrl: downloadLink.url, sizeBytes },
      { status: 200 }
    )
  }

  return new NextResponse(fileRes.body, {
    headers: {
      'Content-Type': fileRes.headers.get('content-type') ?? 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${downloadLink.filename}"`,
      ...(contentLength ? { 'Content-Length': contentLength } : {}),
    },
  })
}
