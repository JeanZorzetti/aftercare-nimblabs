import { describe, it, expect } from 'vitest'
import { buildFaqSchema, buildSoftwareAppSchema } from '@/lib/saas-core/seo/schema'

describe('schema builders', () => {
  it('builds FAQPage with questions', () => {
    const s = buildFaqSchema([{ q: 'Is botox aftercare important?', a: 'Yes.' }])
    expect(s['@type']).toBe('FAQPage')
    expect(s.mainEntity[0].acceptedAnswer.text).toBe('Yes.')
  })
  it('builds SoftwareApplication', () => {
    const s = buildSoftwareAppSchema({ name: 'Botox Aftercare Generator', url: 'https://aftercare.nimblabs.com/aftercare/botox' })
    expect(s['@type']).toBe('SoftwareApplication')
    expect(s.offers.price).toBe('0')
  })
})
