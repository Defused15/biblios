'use client'

import { Heart } from 'lucide-react'
import { useFavorites } from '@/context/favorites-context'
import type { BookResult } from '@/lib/sources/types'

interface FavoriteButtonProps {
  md5: string
  book: BookResult
}

export function FavoriteButton({ md5, book }: FavoriteButtonProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const favorited = isFavorite(md5)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (favorited) {
      removeFavorite(md5)
    } else {
      addFavorite(book)
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      className="group flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-zinc-800"
    >
      <Heart
        className={`h-4 w-4 transition-all duration-200 ${
          favorited
            ? 'fill-amber-400 text-amber-400 scale-110'
            : 'text-zinc-500 group-hover:text-amber-400'
        }`}
      />
    </button>
  )
}
