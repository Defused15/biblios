'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { BookResult } from '@/lib/sources/types'

interface FavoritesContextValue {
  count: number
  isFavorite: (md5: string) => boolean
  addFavorite: (book: BookResult) => Promise<void>
  removeFavorite: (md5: string) => Promise<void>
  refresh: () => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const refresh = useCallback(async () => {
    const res = await fetch('/api/favorites')
    const data = await res.json()
    setFavorites(new Set((data as { md5: string }[]).map((f) => f.md5)))
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const isFavorite = (md5: string) => favorites.has(md5)

  const addFavorite = async (book: BookResult) => {
    await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    })
    setFavorites((prev) => new Set([...prev, book.md5]))
  }

  const removeFavorite = async (md5: string) => {
    await fetch(`/api/favorites/${md5}`, { method: 'DELETE' })
    setFavorites((prev) => {
      const next = new Set(prev)
      next.delete(md5)
      return next
    })
  }

  return (
    <FavoritesContext.Provider value={{ count: favorites.size, isFavorite, addFavorite, removeFavorite, refresh }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}
