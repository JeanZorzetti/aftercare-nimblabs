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

  const already = await prisma.processedWebhook.findUnique({ where: { id: event.id } })
  if (already) return NextResponse.json({ received: true, duplicate: true })

  const update = reduceWebhookEvent(event)
  if (update) {
    await prisma.subscription.upsert({
      where: { userId: update.userId },
      create: { userId: update.userId, stripeCustomerId: update.stripeCustomerId, stripeSubscriptionId: update.stripeSubscriptionId, status: update.status, plan: update.plan },
      update: { stripeCustomerId: update.stripeCustomerId, stripeSubscriptionId: update.stripeSubscriptionId, status: update.status, plan: update.plan },
    })
    if (update.status === 'active') await track('subscribe', { userId: update.userId })
  }

  await prisma.processedWebhook.create({ data: { id: event.id } })
  return NextResponse.json({ received: true })
}
