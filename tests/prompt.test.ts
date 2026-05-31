import { describe, it, expect } from 'vitest'
import { buildPrompt, parseAftercare } from '@/lib/tools/aftercare/prompt'

describe('prompt', () => {
  it('includes procedure, clinic, tone, language in the prompt', () => {
    const p = buildPrompt({ procedureName: 'Botox', clinicName: 'Glow Clinic', tone: 'warm', language: 'en' })
    expect(p).toContain('Botox')
    expect(p).toContain('Glow Clinic')
    expect(p).toContain('warm')
  })
  it('parses well-formed JSON output', () => {
    const r = parseAftercare('{"title":"Botox Aftercare","sections":[{"heading":"Do","items":["rest"]}]}')
    expect(r.title).toBe('Botox Aftercare')
    expect(r.sections[0].items[0]).toBe('rest')
  })
  it('throws a typed error on malformed output', () => {
    expect(() => parseAftercare('not json at all')).toThrow(/parse/i)
  })
  it('extracts JSON even if wrapped in prose/code fences', () => {
    const r = parseAftercare('Here you go:\n```json\n{"title":"T","sections":[]}\n```')
    expect(r.title).toBe('T')
  })
})
