import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/saas-core/auth/session'
import { getIsPro } from '@/lib/saas-core/paywall/requirePro'
import { getSheet } from '@/lib/tools/aftercare/history'
import { renderAftercarePdf } from '@/lib/tools/aftercare/pdf'

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60)
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'auth_required' }, { status: 401 })

  const { id } = await params
  const saved = await getSheet(userId, id)
  if (!saved) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  const isPro = await getIsPro(userId)
  const buffer = await renderAftercarePdf({
    sheet: saved.sheet,
    clinicName: saved.clinicName || 'Your Clinic',
    watermark: !isPro,
  })
  const filename = `${slugify(saved.sheet.title) || saved.procedureSlug}.pdf`
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
