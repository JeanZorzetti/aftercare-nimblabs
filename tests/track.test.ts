import { describe, it, expect, vi } from 'vitest'
import { track } from '@/lib/saas-core/analytics/track'

const create = vi.fn()
vi.mock('@/lib/prisma', () => ({ prisma: { funnelEvent: { create: (...a: unknown[]) => create(...a) } } }))

describe('track', () => {
  it('records a funnel event with name + meta', async () => {
    await track('generate', { userId: 'u1', meta: { procedure: 'botox' } })
    expect(create).toHaveBeenCalledWith({ data: { name: 'generate', userId: 'u1', meta: JSON.stringify({ procedure: 'botox' }) } })
  })
})
