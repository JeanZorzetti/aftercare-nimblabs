import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/saas-core/auth/session'
import { getIsPro } from '@/lib/saas-core/paywall/requirePro'
import { renderAftercarePdf } from '@/lib/tools/aftercare/pdf'
import { pdfBodySchema, isSafeLogoUrl } from '@/lib/tools/aftercare/validation'

function pdfFilename(title: string, clinicName: string): string {
  const slugify = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
  const parts = [slugify(title) || 'aftercare', slugify(clinicName)].filter(Boolean)
  return `${parts.join('-')}.pdf`
}

export async function POST(req: NextRequest) {
  // PDF rendering is CPU-heavy and the renderer fetches logoUrl server-side —
  // never expose it to anonymous traffic.
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'auth_required' }, { status: 401 })

  const parsed = pdfBodySchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'invalid_request' }, { status: 400 })
  const { sheet, clinicName, brandColor, logoUrl } = parsed.data

  const isPro = await getIsPro(userId)
  const safeLogoUrl = logoUrl && isSafeLogoUrl(logoUrl) ? logoUrl : undefined

  const buffer = await renderAftercarePdf({
    sheet,
    clinicName: clinicName || 'Your Clinic',
    brandColor,
    logoUrl: safeLogoUrl,
    watermark: !isPro,
  })
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${pdfFilename(sheet.title, clinicName)}"`,
    },
  })
}
