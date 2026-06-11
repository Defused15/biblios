'use client'

import Link from 'next/link'
import { Heart, ArrowLeft } from 'lucide-react'
import { useFavorites } from '@/context/favorites-context'
import { BookCard } from '@/components/book-card'
import type { BookResult } from '@/lib/sources/types'

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const books = Array.from(favorites.values()) as BookResult[]

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to search
      </Link>

      <div className="mb-8 flex items-center gap-3">
        <Heart className="h-6 w-6 fill-amber-400 text-amber-400" />
        <h1 className="font-serif text-2xl font-semibold text-zinc-100">Favorites</h1>
        {books.length > 0 && (
          <span className="ml-1 text-sm text-zinc-500">{books.length} book{books.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {books.length === 0 ? (
        <div className="py-20 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 text-zinc-800" />
          <p className="font-serif text-xl text-zinc-500">No favorites yet.</p>
          <p className="mt-2 text-sm text-zinc-600">
            Tap the heart icon on any book to save it here.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-amber-400 transition-colors"
          >
            Browse books
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {books.map((book) => (
            <BookCard key={book.md5} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}
