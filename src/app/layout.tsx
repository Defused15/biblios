import type { Metadata } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import './globals.css'
import { FavoritesProvider } from '@/context/favorites-context'
import { Navbar } from '@/components/navbar'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Biblios — Find & Download Books',
  description: 'Search millions of books and download them instantly.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} dark antialiased`}
    >
      <body className="min-h-full bg-zinc-950 text-zinc-100">
        <FavoritesProvider>
          <Navbar />
          <main className="pt-14">{children}</main>
        </FavoritesProvider>
        <Toaster />
      </body>
    </html>
  )
}
