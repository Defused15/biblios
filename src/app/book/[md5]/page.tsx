import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import type { BookDetail } from '@/lib/sources/types'
import { FormatBadge } from '@/components/format-badge'
import { FavoriteButton } from '@/components/favorite-button'
import { DownloadButton } from '@/components/download-button'

interface Props {
  params: Promise<{ md5: string }>
}

async function getBook(md5: string): Promise<BookDetail | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/book/${md5}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function BookDetailPage({ params }: Props) {
  const { md5 } = await params
  const book = await getBook(md5)

  if (!book) notFound()

  const filename = `${book.title.replace(/[^a-zA-Z0-9\s-]/g, '').trim()}.${book.extension}`

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Back */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Volver a la búsqueda
      </Link>

      <div className="flex flex-col gap-8 sm:flex-row sm:gap-10">
        {/* Cover */}
        <div className="shrink-0 sm:w-40">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-800 sm:w-40">
            {book.hdCoverUrl || book.coverUrl ? (
              <Image
                src={(book.hdCoverUrl ?? book.coverUrl)!}
                alt={book.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 160px"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-zinc-700">
                <svg className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-1 flex-col gap-4">
          <div>
            <h1 className="font-serif text-2xl font-semibold leading-snug text-zinc-100 sm:text-3xl">
              {book.title}
            </h1>
            {book.author && (
              <p className="mt-1.5 text-base text-zinc-400">{book.author}</p>
            )}
          </div>

          {/* Details grid */}
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
            {book.year && (
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-zinc-600">Año</dt>
                <dd className="text-zinc-300">{book.year}</dd>
              </div>
            )}
            {book.publisher && (
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-zinc-600">Editorial</dt>
                <dd className="text-zinc-300 truncate">{book.publisher}</dd>
              </div>
            )}
            {book.language && (
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-zinc-600">Idioma</dt>
                <dd className="text-zinc-300 capitalize">{book.language}</dd>
              </div>
            )}
            {book.pages && (
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-zinc-600">Páginas</dt>
                <dd className="text-zinc-300">{book.pages}</dd>
              </div>
            )}
            {book.isbn && (
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-zinc-600">ISBN</dt>
                <dd className="font-mono text-xs text-zinc-300">{book.isbn}</dd>
              </div>
            )}
            {book.sizeBytes && (
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-zinc-600">Tamaño</dt>
                <dd className="text-zinc-300">{(book.sizeBytes / (1024 * 1024)).toFixed(1)} MB</dd>
              </div>
            )}
          </dl>

          {/* Format + actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <FormatBadge format={book.extension} />
            <div className="ml-auto flex items-center gap-2">
              <FavoriteButton md5={book.md5} book={book} />
              <DownloadButton md5={book.md5} ext={book.extension} filename={filename} />
            </div>
          </div>

          {/* Subjects */}
          {book.subjects && book.subjects.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {book.subjects.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 text-xs text-zinc-400"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Synopsis */}
      {book.synopsis && (
        <div className="mt-10 border-t border-zinc-800 pt-8">
          <h2 className="mb-3 font-serif text-xl font-semibold text-zinc-200">Sobre este libro</h2>
          <p className="leading-relaxed text-zinc-400">{book.synopsis}</p>
        </div>
      )}
    </div>
  )
}
