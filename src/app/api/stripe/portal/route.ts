import { NextResponse } from 'next/server'
import { auth } from '@/lib/saas-core/auth/session'
import { createPortalSession } from '@/lib/saas-core/billing/stripe'
import { prisma } from '@/lib/prisma'
import { env } from '@/lib/env'

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const sub = await prisma.subscription.findUnique({ where: { userId: session.user.id } })
  if (!sub?.stripeCustomerId) return NextResponse.json({ error: 'no_customer' }, { status: 400 })
  const portal = await createPortalSession({ customerId: sub.stripeCustomerId, returnUrl: `${env.NEXTAUTH_URL}/dashboard` })
  return NextResponse.redirect(portal.url, { status: 303 })
}
