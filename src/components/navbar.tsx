'use client'

import Link from 'next/link'
import { Heart, Clock } from 'lucide-react'
import { useFavorites } from '@/context/favorites-context'

export function Navbar() {
  const { count } = useFavorites()

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="group flex items-baseline gap-0.5">
          <span className="font-serif text-xl font-semibold tracking-tight text-zinc-100">
            Biblio
          </span>
          <span className="font-serif text-xl font-semibold text-amber-400 transition-colors group-hover:text-amber-300">
            s
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          <Link
            href="/favorites"
            className="relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
          >
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Favorites</span>
            {count > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-zinc-950">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </Link>

          <Link
            href="/history"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
