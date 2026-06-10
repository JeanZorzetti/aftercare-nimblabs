import type { Metadata } from 'next'
import { Sparkles, FileDown, Clock } from 'lucide-react'
import { SignInCard } from '@/components/signin-card'

export const metadata: Metadata = {
  title: 'Sign in — AftercareGen',
  description: 'Create a free account to generate your first aftercare sheet. No credit card required.',
  robots: { index: false },
}

const perks = [
  { icon: Sparkles, text: '3 free aftercare sheets per day' },
  { icon: FileDown, text: 'Downloadable PDF for every sheet' },
  { icon: Clock, text: 'Ready in seconds — no setup' },
]

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; error?: string }> }) {
  const { callbackUrl, error } = await searchParams
  // Only honour same-site relative callback URLs.
  const safeCallbackUrl = callbackUrl && callbackUrl.startsWith('/') && !callbackUrl.startsWith('//') ? callbackUrl : '/dashboard'

  const hasGoogle = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  const hasEmail = Boolean(process.env.EMAIL_SERVER)

  return (
    <div className="mx-auto max-w-md px-6 py-16 animate-rise">
      <div className="text-center mb-8">
        <span className="inline-block mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--primary)] bg-[var(--secondary)] px-4 py-1.5 rounded-full">
          Free account · No credit card
        </span>
        <h1 className="font-serif text-3xl font-semibold text-[var(--foreground)]">
          Create your free account
        </h1>
        <p className="mt-2 text-[var(--muted-foreground)]">
          Sign in to generate your aftercare sheet — it takes 10 seconds.
        </p>
      </div>

      <SignInCard callbackUrl={safeCallbackUrl} hasGoogle={hasGoogle} hasEmail={hasEmail} error={error} />

      <ul className="mt-8 space-y-2.5">
        {perks.map((p) => (
          <li key={p.text} className="flex items-center gap-2.5 text-sm text-[var(--muted-foreground)]">
            <p.icon className="w-4 h-4 text-[var(--primary)] shrink-0" />
            {p.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
