import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/saas-core/billing/stripe'
import { reduceWebhookEvent } from '@/lib/saas-core/billing/webhook'
import { prisma } from '@/lib/prisma'
import { env } from '@/lib/env'
import { track } from '@/lib/saas-core/analytics/track'

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'no signature' }, { status: 400 })
  const raw = await req.text()

  let event
  try {
    event = await getStripe().webhooks.constructEventAsync(raw, sig, env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 })
  }

  // Claim the event atomically BEFORE processing. The unique PK on ProcessedWebhook
  // makes this the idempotency lock: if a concurrent retry already claimed it, the
  // create throws P2002 and we bail as a duplicate (no double-processing, no retry loop).
  try {
    await prisma.processedWebhook.create({ data: { id: event.id } })
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'P2002') {
      return NextResponse.json({ received: true, duplicate: true })
    }
    throw e
  }

  try {
    const update = reduceWebhookEvent(event)
    if (update) {
      await prisma.subscription.upsert({
        where: { userId: update.userId },
        create: { userId: update.userId, stripeCustomerId: update.stripeCustomerId, stripeSubscriptionId: update.stripeSubscriptionId, status: update.status, plan: update.plan },
        update: { stripeCustomerId: update.stripeCustomerId, stripeSubscriptionId: update.stripeSubscriptionId, status: update.status, plan: update.plan },
      })
      if (update.status === 'active') await track('subscribe', { userId: update.userId })
    }
  } catch (e) {
    // Processing failed after we claimed the event — release the claim so Stripe's
    // retry can reprocess it, then surface a 500 to trigger that retry.
    await prisma.processedWebhook.delete({ where: { id: event.id } }).catch(() => {})
    throw e
  }

  return NextResponse.json({ received: true })
}
