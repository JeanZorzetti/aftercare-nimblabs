import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/saas-core/auth/session'
import { getIsPro } from '@/lib/saas-core/paywall/requirePro'
import { renderAftercarePdf } from '@/lib/tools/aftercare/pdf'

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  const isPro = await getIsPro(userId)
  const body = await req.json()
  const { sheet, clinicName, brandColor, logoUrl } = body
  const buffer = await renderAftercarePdf({ sheet, clinicName: clinicName || 'Your Clinic', brandColor, logoUrl, watermark: !isPro })
  return new NextResponse(new Uint8Array(buffer), {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="aftercare.pdf"' },
  })
}
