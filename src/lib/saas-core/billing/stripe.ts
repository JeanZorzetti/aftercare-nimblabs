import Stripe from 'stripe'
import { env } from '@/lib/env'

let _stripe: Stripe | null = null
export function getStripe(): Stripe {
  if (!_stripe) _stripe = new Stripe(env.STRIPE_SECRET_KEY)
  return _stripe
}

export async function createCheckoutSession(params: { userId: string; email: string; successUrl: string; cancelUrl: string }) {
  const stripe = getStripe()
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: params.email,
    line_items: [{ price: env.STRIPE_PRICE_ID_PRO, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    subscription_data: { metadata: { userId: params.userId } },
    metadata: { userId: params.userId },
    allow_promotion_codes: true, // lets users redeem coupons (early-bird, test 100%-off)
  })
}

export async function createPortalSession(params: { customerId: string; returnUrl: string }) {
  const stripe = getStripe()
  return stripe.billingPortal.sessions.create({ customer: params.customerId, return_url: params.returnUrl })
}
