'use client'
import { useState } from 'react'
import { Loader2, Mail, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function EmailCapture({ source }: { source: string }) {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubscribe() {
    if (!email.includes('@')) {
      setError('Enter a valid email address.')
      return
    }
    setSending(true)
    setError(null)
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source }),
    })
    setSending(false)
    if (!res.ok) {
      setError('Something went wrong. Please try again.')
      return
    }
    setDone(true)
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-6 sm:p-8">
      {done ? (
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-[var(--success)] mt-0.5 shrink-0" />
          <div>
            <p className="font-serif text-lg font-semibold text-[var(--foreground)]">You&apos;re in!</p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Check your inbox — your aftercare template pack is on its way.
            </p>
          </div>
        </div>
      ) : (
        <>
          <p className="font-serif text-lg font-semibold text-[var(--foreground)]">
            Get the free aftercare template pack
          </p>
          <p className="mt-1.5 text-sm text-[var(--muted-foreground)] leading-relaxed">
            Generators for all 13 aesthetic procedures plus practical guides on running aftercare in your clinic. Sent once — no spam, ever.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourclinic.com"
              className="bg-[var(--background)]"
              onKeyDown={(e) => e.key === 'Enter' && !sending && onSubscribe()}
            />
            <Button onClick={onSubscribe} disabled={sending} className="shrink-0">
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <><Mail className="w-4 h-4 mr-2" /> Send it to me</>
              )}
            </Button>
          </div>
          {error && <p className="mt-2 text-sm text-[var(--destructive)]">{error}</p>}
        </>
      )}
    </div>
  )
}
