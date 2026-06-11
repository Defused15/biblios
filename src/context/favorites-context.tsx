'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { BookResult } from '@/lib/sources/types'

interface FavoritesContextValue {
  count: number
  favorites: Map<string, BookResult>
  isFavorite: (md5: string) => boolean
  addFavorite: (book: BookResult) => Promise<void>
  removeFavorite: (md5: string) => Promise<void>
  refresh: () => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Map<string, BookResult>>(new Map())

  const refresh = useCallback(async () => {
    const res = await fetch('/api/favorites')
    const data = await res.json() as BookResult[]
    setFavorites(new Map(data.map((f) => [f.md5, f])))
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const isFavorite = (md5: string) => favorites.has(md5)

  const addFavorite = async (book: BookResult) => {
    await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    })
    setFavorites((prev) => new Map([...prev, [book.md5, book]]))
  }

  const removeFavorite = async (md5: string) => {
    await fetch(`/api/favorites/${md5}`, { method: 'DELETE' })
    setFavorites((prev) => {
      const next = new Map(prev)
      next.delete(md5)
      return next
    })
  }

  return (
    <FavoritesContext.Provider value={{ count: favorites.size, favorites, isFavorite, addFavorite, removeFavorite, refresh }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
