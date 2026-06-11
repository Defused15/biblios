'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { BookResult } from '@/lib/sources/types'
import { FormatBadge } from '@/components/format-badge'
import { FavoriteButton } from '@/components/favorite-button'
import { DownloadButton } from '@/components/download-button'

interface BookCardProps {
  book: BookResult
}

export function BookCard({ book }: BookCardProps) {
  const filename = `${book.title.replace(/[^a-zA-Z0-9\s-]/g, '').trim()}.${book.extension}`

  return (
    <div className="group relative flex gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition-all duration-200 hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]">
      {/* Cover */}
      <Link
        href={`/book/${book.md5}`}
        className="shrink-0"
        tabIndex={-1}
      >
        <div className="relative h-[135px] w-[90px] overflow-hidden rounded bg-zinc-800">
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={book.title}
              fill
              className="object-cover"
              sizes="90px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Metadata */}
      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <Link href={`/book/${book.md5}`} className="group/link">
          <h3 className="font-serif text-base font-semibold leading-snug text-zinc-100 line-clamp-2 group-hover/link:text-amber-300 transition-colors">
            {book.title}
          </h3>
        </Link>

        {book.author && (
          <p className="text-sm text-zinc-400 truncate">{book.author}</p>
        )}

        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-zinc-500">
          {book.year && <span>{book.year}</span>}
          {book.publisher && (
            <>
              {book.year && <span>·</span>}
              <span className="truncate">{book.publisher}</span>
            </>
          )}
        </div>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <FormatBadge format={book.extension} />
          {book.sizeBytes && (
            <span className="text-xs text-zinc-600">
              {(book.sizeBytes / (1024 * 1024)).toFixed(1)} MB
            </span>
          )}
          <div className="ml-auto flex items-center gap-1">
            <FavoriteButton md5={book.md5} book={book} />
            <DownloadButton md5={book.md5} ext={book.extension} filename={filename} />
          </div>
        </div>
      </div>
    </div>
  )
}
