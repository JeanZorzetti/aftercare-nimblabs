import { prisma } from '@/lib/prisma'

export type FunnelName = 'visit' | 'generate' | 'paywall' | 'subscribe'

export async function track(name: FunnelName, opts?: { userId?: string | null; meta?: Record<string, unknown> }): Promise<void> {
  try {
    await prisma.funnelEvent.create({
      data: { name, userId: opts?.userId ?? null, meta: opts?.meta ? JSON.stringify(opts.meta) : null },
    })
  } catch {
    // analytics must never break the request
  }
}
