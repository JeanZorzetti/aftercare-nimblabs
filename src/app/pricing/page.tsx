import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Sparkles, X } from 'lucide-react'
import { auth } from '@/lib/saas-core/auth/session'
import { buildFaqSchema } from '@/lib/saas-core/seo/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Pricing — AftercareGen for Aesthetic Clinics',
  description:
    'Simple pricing for aftercare software. Free plan with 3 sheets per day, or Pro at $12/month for unlimited branded aftercare PDFs. No contracts, cancel anytime.',
  alternates: { canonical: 'https://aftercare.nimblabs.com/pricing' },
}

const freePlan = {
  name: 'Free',
  price: '$0',
  tagline: 'Try it on your next patient — no credit card.',
  features: [
    { text: '3 aftercare sheets per day', included: true },
    { text: 'All 13 aesthetic procedures', included: true },
    { text: 'Copy to clipboard', included: true },
    { text: 'PDF download (with AftercareGen watermark)', included: true },
    { text: 'Sheet history in your dashboard', included: true },
    { text: 'Branded PDFs — your clinic, no watermark', included: false },
    { text: 'All tones and languages', included: false },
  ],
}

const proPlan = {
  name: 'Pro',
  price: '$12',
  tagline: 'Less than one syringe of filler pays for a year.',
  features: [
    { text: 'Unlimited aftercare sheets', included: true },
    { text: 'All 13 aesthetic procedures', included: true },
    { text: 'Branded PDFs — your clinic name, no watermark', included: true },
    { text: 'All tones and languages', included: true },
    { text: 'Sheet history in your dashboard', included: true },
    { text: 'Priority support', included: true },
    { text: 'Cancel anytime, no contract', included: true },
  ],
}

const faq = [
  {
    q: 'How much does AftercareGen cost?',
    a: 'AftercareGen has a free plan with 3 aftercare sheets per day, and a Pro plan at $12 per month with unlimited sheets, clinic-branded PDFs without watermark, and all tones and languages. There are no contracts and you can cancel anytime.',
  },
  {
    q: 'Do I need a credit card to start?',
    a: 'No. The free plan only requires an email address or Google account. You can generate and download aftercare sheets immediately, and upgrade to Pro only if the tool earns its place in your workflow.',
  },
  {
    q: 'What does the Pro plan include?',
    a: 'Pro includes unlimited aftercare sheet generation, branded PDFs with your clinic name and no watermark, every available tone and language, and your full sheet history. It is billed monthly at $12 and can be cancelled anytime from your dashboard.',
  },
  {
    q: 'Which procedures are covered?',
    a: 'All 13 aesthetic procedures are available on both plans: Botox, lip filler, dermal fillers, microneedling, chemical peels, laser hair removal, microblading, and more. New procedures are added regularly at no extra cost.',
  },
  {
    q: 'Can I cancel my subscription?',
    a: 'Yes. Pro is billed monthly with no contract or minimum term. You can cancel in one click from your dashboard via the Stripe billing portal, and you keep Pro access until the end of the period you already paid for.',
  },
]

export default async function PricingPage() {
  const session = await auth()
  const signedIn = Boolean(session?.user?.id)
  const faqSchema = buildFaqSchema(faq)

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-12 text-center animate-rise">
        <span className="inline-block mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--primary)] bg-[var(--secondary)] px-4 py-1.5 rounded-full">
          Pricing
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[var(--foreground)] leading-tight">
          Simple pricing.<span className="text-[var(--primary)] italic"> No surprises.</span>
        </h1>
        <p className="mt-5 text-lg text-[var(--muted-foreground)] max-w-xl mx-auto">
          Start free, upgrade when your clinic is ready. One avoided follow-up call pays for the month.
        </p>
      </section>

      {/* Plans */}
      <section className="mx-auto max-w-4xl px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Free */}
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-xl">{freePlan.name}</CardTitle>
                <Badge variant="secondary">Free forever</Badge>
              </div>
              <p className="mt-2">
                <span className="font-serif text-4xl font-semibold text-[var(--foreground)]">{freePlan.price}</span>
                <span className="text-sm text-[var(--muted-foreground)]"> /month</span>
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">{freePlan.tagline}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 mb-8">
                {freePlan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2 text-sm">
                    {f.included ? (
                      <CheckCircle className="w-4 h-4 mt-0.5 text-[var(--success)] shrink-0" />
                    ) : (
                      <X className="w-4 h-4 mt-0.5 text-[var(--muted-foreground)]/40 shrink-0" />
                    )}
                    <span className={f.included ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]/60'}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/aftercare/botox"
                className="flex items-center justify-center w-full h-11 px-5 rounded-xl border border-[var(--border)] text-sm font-medium text-[var(--foreground)] hover:bg-[var(--secondary)] transition-colors"
              >
                Generate your first sheet free
              </Link>
            </CardContent>
          </Card>

          {/* Pro */}
          <Card className="h-full border-[var(--primary)]/40 shadow-md relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-xl">{proPlan.name}</CardTitle>
                <Badge>✦ Most popular</Badge>
              </div>
              <p className="mt-2">
                <span className="font-serif text-4xl font-semibold text-[var(--foreground)]">{proPlan.price}</span>
                <span className="text-sm text-[var(--muted-foreground)]"> /month</span>
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">{proPlan.tagline}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 mb-8">
                {proPlan.features.map((f) => (
                  <li key={f.text} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                    <CheckCircle className="w-4 h-4 mt-0.5 text-[var(--success)] shrink-0" />
                    {f.text}
                  </li>
                ))}
              </ul>
              {signedIn ? (
                <form action="/api/stripe/checkout" method="post">
                  <button
                    type="submit"
                    className="w-full h-11 px-5 rounded-xl bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Upgrade to Pro
                  </button>
                </form>
              ) : (
                <Link
                  href="/signin?callbackUrl=/pricing"
                  className="flex items-center justify-center gap-2 w-full h-11 px-5 rounded-xl bg-[var(--primary)] text-white text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Start with Pro
                </Link>
              )}
              <p className="mt-2 text-xs text-center text-[var(--muted-foreground)]">
                Cancel anytime. Billed monthly via Stripe.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[var(--secondary)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="font-serif text-2xl font-semibold text-[var(--foreground)] mb-8 text-center">
            Pricing questions, answered
          </h2>
          <div className="space-y-4">
            {faq.map((f) => (
              <Card key={f.q}>
                <CardContent className="pt-5 pb-5">
                  <h3 className="font-medium text-[var(--foreground)]">{f.q}</h3>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">{f.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="font-serif text-3xl font-semibold text-[var(--foreground)]">
          Your next patient deserves better than a photocopy
        </h2>
        <p className="mt-3 text-[var(--muted-foreground)] max-w-xl mx-auto">
          Generate a branded aftercare sheet in the next 60 seconds — free.
        </p>
        <Link
          href="/aftercare/botox"
          className="mt-8 inline-flex items-center justify-center h-12 px-10 rounded-xl bg-[var(--primary)] text-white font-medium hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Try it free now
        </Link>
      </section>
    </div>
  )
}
