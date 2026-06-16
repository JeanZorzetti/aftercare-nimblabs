'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Server Action mismatch between deploys — force a hard reload to pick up
    // the new build's action IDs instead of looping on stale ones.
    if (error.message?.includes('Server Action')) {
      window.location.reload()
    }
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <button
        onClick={reset}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
      >
        Try again
      </button>
    </div>
  )
}
