import { prisma } from '@/lib/prisma'
import type { AftercareSheet } from './prompt'
import { aftercareSheetSchema } from './validation'

// SavedSheet.content stores a JSON envelope so clinicName travels with the
// sheet without a schema migration (prod schema is applied via raw DDL).
interface SheetEnvelope {
  sheet: AftercareSheet
  clinicName: string
}

export interface SavedSheetSummary {
  id: string
  procedureSlug: string
  clinicName: string
  title: string
  createdAt: Date
}

const HISTORY_LIMIT = 50

export async function saveSheet(params: { userId: string; procedureSlug: string; clinicName: string; sheet: AftercareSheet }): Promise<void> {
  const envelope: SheetEnvelope = { sheet: params.sheet, clinicName: params.clinicName }
  try {
    await prisma.savedSheet.create({
      data: {
        userId: params.userId,
        procedureSlug: params.procedureSlug,
        content: JSON.stringify(envelope),
      },
    })
    // Cap history per user so a heavy Pro user doesn't grow the table unbounded.
    const excess = await prisma.savedSheet.findMany({
      where: { userId: params.userId },
      orderBy: { createdAt: 'desc' },
      skip: HISTORY_LIMIT,
      select: { id: true },
    })
    if (excess.length > 0) {
      await prisma.savedSheet.deleteMany({ where: { id: { in: excess.map((s) => s.id) } } })
    }
  } catch {
    // History is best-effort — never fail a generation because the save failed.
  }
}

function parseEnvelope(content: string): SheetEnvelope | null {
  try {
    const raw = JSON.parse(content)
    const sheet = aftercareSheetSchema.parse(raw.sheet ?? raw)
    return { sheet, clinicName: typeof raw.clinicName === 'string' ? raw.clinicName : '' }
  } catch {
    return null
  }
}

export async function listSheets(userId: string, limit = 10): Promise<SavedSheetSummary[]> {
  const rows = await prisma.savedSheet.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
  return rows.flatMap((row) => {
    const envelope = parseEnvelope(row.content)
    if (!envelope) return []
    return [{
      id: row.id,
      procedureSlug: row.procedureSlug,
      clinicName: envelope.clinicName,
      title: envelope.sheet.title,
      createdAt: row.createdAt,
    }]
  })
}

export async function getSheet(userId: string, id: string): Promise<(SheetEnvelope & { procedureSlug: string }) | null> {
  const row = await prisma.savedSheet.findUnique({ where: { id } })
  if (!row || row.userId !== userId) return null
  const envelope = parseEnvelope(row.content)
  if (!envelope) return null
  return { ...envelope, procedureSlug: row.procedureSlug }
}
