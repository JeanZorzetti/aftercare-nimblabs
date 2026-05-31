import { describe, it, expect } from 'vitest'
import { PROCEDURES, getProcedure } from '@/lib/tools/aftercare/procedures'

describe('procedures', () => {
  it('has between 12 and 15 champions', () => {
    expect(PROCEDURES.length).toBeGreaterThanOrEqual(12)
    expect(PROCEDURES.length).toBeLessThanOrEqual(15)
  })
  it('every procedure has slug, name, keywords, seoIntro, faq>=3', () => {
    for (const p of PROCEDURES) {
      expect(p.slug).toMatch(/^[a-z-]+$/)
      expect(p.name.length).toBeGreaterThan(0)
      expect(p.keywords.length).toBeGreaterThan(0)
      expect(p.seoIntro.length).toBeGreaterThan(40)
      expect(p.faq.length).toBeGreaterThanOrEqual(3)
    }
  })
  it('slugs are unique', () => {
    expect(new Set(PROCEDURES.map((p) => p.slug)).size).toBe(PROCEDURES.length)
  })
  it('getProcedure returns by slug, undefined otherwise', () => {
    expect(getProcedure('botox')?.name).toBe('Botox')
    expect(getProcedure('nope')).toBeUndefined()
  })
})
