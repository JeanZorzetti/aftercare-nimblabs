import { NextResponse } from 'next/server'
import { auth } from '@/lib/saas-core/auth/session'
import { createCheckoutSession } from '@/lib/saas-core/billing/stripe'
import { env } from '@/lib/env'

export async function POST() {
  const session = await auth()
  const base = env.NEXTAUTH_URL
  // Form posts land here directly (pricing page, dashboard) — send anonymous
  // visitors to sign-in instead of dumping a JSON error in the browser.
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.redirect(`${base}/signin?callbackUrl=${encodeURIComponent('/pricing')}`, { status: 303 })
  }
  const checkout = await createCheckoutSession({
    userId: session.user.id, email: session.user.email,
    successUrl: `${base}/dashboard?upgraded=1`, cancelUrl: `${base}/dashboard`,
  })
  if (!checkout.url) return NextResponse.json({ error: 'no_url' }, { status: 500 })
  return NextResponse.redirect(checkout.url, { status: 303 })
}
