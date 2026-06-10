'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Loader2, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked: 'This email is already registered with a different sign-in method. Try the other option.',
  Verification: 'That sign-in link has expired. Request a new one below.',
  Default: 'Something went wrong signing you in. Please try again.',
}

export function SignInCard({ callbackUrl, hasGoogle, hasEmail, error }: {
  callbackUrl: string
  hasGoogle: boolean
  hasEmail: boolean
  error?: string
}) {
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  async function onEmailSignIn() {
    if (!email.includes('@')) {
      setLocalError('Enter a valid email address.')
      return
    }
    setSending(true)
    setLocalError(null)
    const res = await signIn('nodemailer', { email, callbackUrl, redirect: false })
    setSending(false)
    if (res?.error) {
      setLocalError(ERROR_MESSAGES.Default)
      return
    }
    setSent(true)
  }

  const errorMessage = localError ?? (error ? (ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default) : null)

  if (sent) {
    return (
      <Card>
        <CardContent className="pt-8 pb-8 text-center">
          <CheckCircle className="w-8 h-8 text-[var(--success)] mx-auto mb-3" />
          <h2 className="font-serif text-xl font-semibold text-[var(--foreground)]">Check your email</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            We sent a sign-in link to <strong className="text-[var(--foreground)]">{email}</strong>.
            Click it to continue right where you left off.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-8 pb-8 space-y-4">
        {errorMessage && (
          <div className="flex items-start gap-2 text-sm text-[var(--destructive)] bg-red-50 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {errorMessage}
          </div>
        )}

        {hasGoogle && (
          <Button
            onClick={() => signIn('google', { callbackUrl })}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.16-3.16A11 11 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
            </svg>
            Continue with Google
          </Button>
        )}

        {hasGoogle && hasEmail && (
          <div className="flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
            <span className="h-px flex-1 bg-[var(--border)]" />
            or
            <span className="h-px flex-1 bg-[var(--border)]" />
          </div>
        )}

        {hasEmail && (
          <div className="space-y-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourclinic.com"
              onKeyDown={(e) => e.key === 'Enter' && !sending && onEmailSignIn()}
            />
            <Button onClick={onEmailSignIn} disabled={sending} size="lg" className="w-full">
              {sending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending link…</>
              ) : (
                <><Mail className="w-4 h-4 mr-2" /> Email me a sign-in link</>
              )}
            </Button>
          </div>
        )}

        {!hasGoogle && !hasEmail && (
          <p className="text-sm text-center text-[var(--muted-foreground)]">
            Sign-in is temporarily unavailable. Please try again later.
          </p>
        )}

        <p className="text-xs text-center text-[var(--muted-foreground)]">
          No password needed. We&apos;ll create your account automatically.
        </p>
      </CardContent>
    </Card>
  )
}
