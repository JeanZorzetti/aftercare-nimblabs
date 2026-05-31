import type Stripe from 'stripe'

export interface SubscriptionUpdate {
  userId: string
  stripeCustomerId: string
  stripeSubscriptionId: string | null
  status: 'free' | 'active' | 'past_due' | 'canceled'
  plan: 'free' | 'pro'
}

export function reduceWebhookEvent(event: Stripe.Event): SubscriptionUpdate | null {
  const obj = event.data.object as Record<string, unknown>
  const userId = (obj.metadata as Record<string, string> | undefined)?.userId
  if (!userId) return null

  switch (event.type) {
    case 'checkout.session.completed':
      return {
        userId,
        stripeCustomerId: String(obj.customer),
        stripeSubscriptionId: obj.subscription ? String(obj.subscription) : null,
        status: 'active',
        plan: 'pro',
      }
    case 'customer.subscription.updated': {
      const s = String(obj.status)
      const status = s === 'active' || s === 'trialing' ? 'active' : s === 'past_due' ? 'past_due' : 'canceled'
      return {
        userId,
        stripeCustomerId: String(obj.customer),
        stripeSubscriptionId: String(obj.id),
        status,
        plan: status === 'active' ? 'pro' : 'free',
      }
    }
    case 'customer.subscription.deleted':
      return {
        userId,
        stripeCustomerId: String(obj.customer),
        stripeSubscriptionId: String(obj.id),
        status: 'free',
        plan: 'free',
      }
    default:
      return null
  }
}
