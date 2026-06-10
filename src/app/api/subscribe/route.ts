import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { track } from '@/lib/saas-core/analytics/track'
import { sendWelcomeEmail } from '@/lib/saas-core/email/welcome'

const bodySchema = z.object({
  email: z.string().email().max(254),
  source: z.string().max(120).optional().default('blog'),
})

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
  const { email, source } = parsed.data

  const existing = await prisma.subscriber.findUnique({ where: { email: email.toLowerCase() } })
  if (!existing) {
    await prisma.subscriber.create({ data: { email: email.toLowerCase(), source } })
    await track('subscribe', { userId: null, meta: { source } })
    // Best-effort: a broken SMTP config must not surface as a failed signup.
    sendWelcomeEmail(email).catch(() => {})
  }
  return NextResponse.json({ ok: true })
}
