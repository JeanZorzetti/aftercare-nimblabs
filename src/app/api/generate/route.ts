import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/saas-core/auth/session'
import { getIsPro } from '@/lib/saas-core/paywall/requirePro'
import { checkUsageLimit } from '@/lib/saas-core/usage/usage'
import { generateAftercare } from '@/lib/tools/aftercare/generate'
import { getProcedure } from '@/lib/tools/aftercare/procedures'
import { track } from '@/lib/saas-core/analytics/track'
import { generateBodySchema } from '@/lib/tools/aftercare/validation'
import { saveSheet } from '@/lib/tools/aftercare/history'

export async function POST(req: NextRequest) {
  const parsed = generateBodySchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'invalid_request' }, { status: 400 })
  const { procedureSlug, clinicName, tone, language } = parsed.data
  const procedure = getProcedure(procedureSlug)
  if (!procedure) return NextResponse.json({ error: 'Unknown procedure' }, { status: 400 })

  const userId = await getUserId()
  // Require sign-in before any Groq call. Anonymous generation can't be metered
  // reliably (no per-user row) and would let visitors burn the Groq budget for
  // free. The free tier (3/day) lives behind a free account.
  if (!userId) {
    await track('paywall', { userId: null, meta: { procedureSlug, reason: 'auth_required' } })
    return NextResponse.json({ error: 'auth_required', requireAuth: true }, { status: 401 })
  }
  const isPro = await getIsPro(userId)

  const usage = await checkUsageLimit({ userId, isPro })
  if (!usage.allowed) {
    await track('paywall', { userId, meta: { procedureSlug } })
    return NextResponse.json({ error: 'limit_reached', upgrade: true }, { status: 402 })
  }

  try {
    const sheet = await generateAftercare({
      userId, procedureSlug, procedureName: procedure.name,
      clinicName: clinicName || 'Your Clinic',
      tone: isPro ? tone : 'warm',
      language: isPro ? language : 'en',
    })
    await track('generate', { userId, meta: { procedureSlug } })
    await saveSheet({ userId, procedureSlug, clinicName, sheet })
    return NextResponse.json({ sheet, remaining: isPro ? null : usage.remaining - 1 })
  } catch {
    return NextResponse.json({ error: 'generation_failed' }, { status: 503 })
  }
}
