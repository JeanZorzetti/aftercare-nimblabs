import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/saas-core/auth/session'
import { getIsPro } from '@/lib/saas-core/paywall/requirePro'
import { checkUsageLimit } from '@/lib/saas-core/usage/usage'
import { generateAftercare } from '@/lib/tools/aftercare/generate'
import { getProcedure } from '@/lib/tools/aftercare/procedures'
import { track } from '@/lib/saas-core/analytics/track'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { procedureSlug, clinicName, tone, language } = body as { procedureSlug: string; clinicName: string; tone: string; language: string }
  const procedure = getProcedure(procedureSlug)
  if (!procedure) return NextResponse.json({ error: 'Unknown procedure' }, { status: 400 })

  const userId = await getUserId()
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
    return NextResponse.json({ sheet, remaining: isPro ? null : usage.remaining - 1 })
  } catch {
    return NextResponse.json({ error: 'generation_failed' }, { status: 503 })
  }
}
