import { prisma } from '@/lib/prisma'

export function isProStatus(status: string | null | undefined): boolean {
  return status === 'active'
}

export async function getIsPro(userId: string | null): Promise<boolean> {
  if (!userId) return false
  const sub = await prisma.subscription.findUnique({ where: { userId } })
  return isProStatus(sub?.status)
}
