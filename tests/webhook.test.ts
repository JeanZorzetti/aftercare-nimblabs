import { describe, it, expect } from 'vitest'
import { reduceWebhookEvent } from '@/lib/saas-core/billing/webhook'

describe('reduceWebhookEvent', () => {
  it('checkout.session.completed -> active', () => {
    const r = reduceWebhookEvent({
      type: 'checkout.session.completed',
      data: { object: { customer: 'cus_1', subscription: 'sub_1', metadata: { userId: 'u1' } } },
    } as never)
    expect(r).toEqual({ userId: 'u1', stripeCustomerId: 'cus_1', stripeSubscriptionId: 'sub_1', status: 'active', plan: 'pro' })
  })

  it('customer.subscription.deleted -> free', () => {
    const r = reduceWebhookEvent({
      type: 'customer.subscription.deleted',
      data: { object: { id: 'sub_1', customer: 'cus_1', metadata: { userId: 'u1' } } },
    } as never)
    expect(r).toEqual({ userId: 'u1', stripeCustomerId: 'cus_1', stripeSubscriptionId: 'sub_1', status: 'free', plan: 'free' })
  })

  it('past_due maps through subscription.updated', () => {
    const r = reduceWebhookEvent({
      type: 'customer.subscription.updated',
      data: { object: { id: 'sub_1', customer: 'cus_1', status: 'past_due', metadata: { userId: 'u1' } } },
    } as never)
    expect(r?.status).toBe('past_due')
    expect(r?.plan).toBe('free')
  })

  it('unhandled event returns null', () => {
    const r = reduceWebhookEvent({ type: 'invoice.created', data: { object: {} } } as never)
    expect(r).toBeNull()
  })
})
