'use client'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

export function SiteHeader() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif text-xl font-semibold text-[var(--foreground)] tracking-tight hover:text-[var(--primary)] transition-colors"
        >
          AftercareGen
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--secondary)]"
          >
            Pricing
          </Link>
          {session?.user ? (
            <Link
              href="/dashboard"
              className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors px-3 py-1.5 rounded-lg hover:bg-[var(--secondary)]"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/signin"
              className="text-sm font-medium bg-[var(--primary)] text-white px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
