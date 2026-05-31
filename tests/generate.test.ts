import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateAftercare } from '@/lib/tools/aftercare/generate'

const groqCreate = vi.fn()
vi.mock('groq-sdk', () => ({ default: class { chat = { completions: { create: (...a: unknown[]) => groqCreate(...a) } } } }))
const recordUsage = vi.fn()
vi.mock('@/lib/saas-core/usage/usage', () => ({ recordUsage: (...a: unknown[]) => recordUsage(...a), checkUsageLimit: vi.fn() }))
vi.mock('@/lib/env', () => ({ env: { GROQ_API_KEY: 'g' } }))

beforeEach(() => { groqCreate.mockReset(); recordUsage.mockReset() })

describe('generateAftercare', () => {
  it('returns parsed sheet and records usage on success', async () => {
    groqCreate.mockResolvedValue({ choices: [{ message: { content: '{"title":"Botox Aftercare","sections":[]}' } }] })
    const r = await generateAftercare({ userId: 'u1', procedureSlug: 'botox', procedureName: 'Botox', clinicName: 'Glow', tone: 'warm', language: 'en' })
    expect(r.title).toBe('Botox Aftercare')
    expect(recordUsage).toHaveBeenCalledOnce()
  })
  it('retries once on failure then succeeds, still records once', async () => {
    groqCreate.mockRejectedValueOnce(new Error('timeout')).mockResolvedValueOnce({ choices: [{ message: { content: '{"title":"T","sections":[]}' } }] })
    const r = await generateAftercare({ userId: 'u1', procedureSlug: 'botox', procedureName: 'Botox', clinicName: 'Glow', tone: 'warm', language: 'en' })
    expect(r.title).toBe('T')
    expect(groqCreate).toHaveBeenCalledTimes(2)
    expect(recordUsage).toHaveBeenCalledOnce()
  })
  it('does NOT record usage when both attempts fail', async () => {
    groqCreate.mockRejectedValue(new Error('down'))
    await expect(generateAftercare({ userId: 'u1', procedureSlug: 'botox', procedureName: 'Botox', clinicName: 'Glow', tone: 'warm', language: 'en' })).rejects.toThrow()
    expect(recordUsage).not.toHaveBeenCalled()
  })
})
