import { auth } from '@/lib/saas-core/auth/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Sparkles } from 'lucide-react'

const freeFeatures = [
  '3 aftercare sheets per day',
  'All 13 procedures',
  'Copy to clipboard',
  'PDF with AftercareGen watermark',
]

const proFeatures = [
  'Unlimited aftercare sheets',
  'Branded PDF (your clinic name, no watermark)',
  'All tones and languages',
  'Saved sheets library',
]

export default async function Dashboard() {
  const session = await auth()
  if (!session?.user?.id) redirect('/api/auth/signin')
  const sub = await prisma.subscription.findUnique({ where: { userId: session.user.id } })
  const isPro = sub?.status === 'active'

  return (
    <div className="mx-auto max-w-2xl px-6 py-16 animate-rise">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-semibold text-[var(--foreground)]">Your account</h1>
        <p className="mt-1.5 text-[var(--muted-foreground)]">
          {session.user.email}
        </p>
      </div>

      {/* Plan card */}
      <Card className={isPro ? 'border-[var(--primary)]/40 shadow-md' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-xl">
              {isPro ? 'Pro plan' : 'Free plan'}
            </CardTitle>
            <Badge variant={isPro ? 'default' : 'secondary'}>
              {isPro ? '✦ Pro' : 'Free'}
            </Badge>
          </div>
          {isPro && (
            <p className="text-sm text-[var(--muted-foreground)]">
              Unlimited sheets · Branded PDFs · All features
            </p>
          )}
        </CardHeader>
        <CardContent>
          {/* Features list */}
          <ul className="space-y-2 mb-6">
            {(isPro ? proFeatures : freeFeatures).map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                <CheckCircle className="w-4 h-4 text-[var(--success)] shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          {/* CTA */}
          {isPro ? (
            <form action="/api/stripe/portal" method="post">
              <button
                type="submit"
                className="w-full h-10 px-5 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors cursor-pointer"
              >
                Manage subscription
              </button>
            </form>
          ) : (
            <div>
              <form action="/api/stripe/checkout" method="post">
                <button
                  type="submit"
                  className="w-full h-11 px-5 rounded-xl bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Upgrade to Pro — $12/month
                </button>
              </form>
              <p className="mt-2 text-xs text-center text-[var(--muted-foreground)]">
                Cancel anytime. Billed monthly.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Free plan teaser (only shown to free users) */}
      {!isPro && (
        <div className="mt-6 rounded-2xl bg-[var(--secondary)] border border-[var(--border)] p-6">
          <p className="font-serif text-lg font-semibold text-[var(--foreground)] mb-3">
            What you get with Pro
          </p>
          <ul className="space-y-2">
            {proFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
