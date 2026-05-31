import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkUsageLimit, FREE_DAILY_LIMIT, ANON_LIMIT } from '@/lib/saas-core/usage/usage'

const mockPrisma = { generation: { count: vi.fn() } }
vi.mock('@/lib/prisma', () => ({ prisma: { generation: { count: (...a: unknown[]) => mockPrisma.generation.count(...a) } } }))

describe('checkUsageLimit', () => {
  beforeEach(() => mockPrisma.generation.count.mockReset())

  it('pro users are unlimited', async () => {
    const r = await checkUsageLimit({ userId: 'u1', isPro: true })
    expect(r.allowed).toBe(true)
    expect(mockPrisma.generation.count).not.toHaveBeenCalled()
  })

  it('free user under limit is allowed', async () => {
    mockPrisma.generation.count.mockResolvedValue(FREE_DAILY_LIMIT - 1)
    const r = await checkUsageLimit({ userId: 'u1', isPro: false })
    expect(r.allowed).toBe(true)
    expect(r.remaining).toBe(1)
  })

  it('free user at limit is blocked', async () => {
    mockPrisma.generation.count.mockResolvedValue(FREE_DAILY_LIMIT)
    const r = await checkUsageLimit({ userId: 'u1', isPro: false })
    expect(r.allowed).toBe(false)
    expect(r.remaining).toBe(0)
  })

  it('anonymous under the anon limit is allowed (counts DB)', async () => {
    mockPrisma.generation.count.mockResolvedValue(ANON_LIMIT - 1)
    const r = await checkUsageLimit({ userId: null, isPro: false })
    expect(r.allowed).toBe(true)
    expect(mockPrisma.generation.count).toHaveBeenCalled()
  })

  it('anonymous at the anon limit is blocked (no free unlimited)', async () => {
    mockPrisma.generation.count.mockResolvedValue(ANON_LIMIT)
    const r = await checkUsageLimit({ userId: null, isPro: false })
    expect(r.allowed).toBe(false)
    expect(r.remaining).toBe(0)
  })
})
