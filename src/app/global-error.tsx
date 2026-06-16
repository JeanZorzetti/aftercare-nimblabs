'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    if (error.message?.includes('Server Action')) {
      window.location.reload()
    }
  }, [error])

  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-md text-sm border"
          >
            Reload page
          </button>
        </div>
      </body>
    </html>
  )
}
