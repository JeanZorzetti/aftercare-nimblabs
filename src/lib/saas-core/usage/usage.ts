import { prisma } from '@/lib/prisma'

export const FREE_DAILY_LIMIT = 3
export const ANON_LIMIT = 1

export interface UsageResult { allowed: boolean; remaining: number }

function startOfTodayUTC(): Date {
  const d = new Date()
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

export async function checkUsageLimit({ userId, isPro }: { userId: string | null; isPro: boolean }): Promise<UsageResult> {
  if (isPro) return { allowed: true, remaining: Infinity }
  const limit = userId ? FREE_DAILY_LIMIT : ANON_LIMIT
  // Count today's generations for this identity. For anonymous (userId null) this
  // counts all null-userId rows together — a coarse global anon cap. Callers that
  // need a hard guarantee should require auth (see /api/generate).
  const used = await prisma.generation.count({
    where: { userId, createdAt: { gte: startOfTodayUTC() } },
  })
  const remaining = Math.max(0, limit - used)
  return { allowed: remaining > 0, remaining }
}

export async function recordUsage(params: { userId: string | null; procedureSlug: string; tone: string; language: string }): Promise<void> {
  await prisma.generation.create({ data: params })
}
