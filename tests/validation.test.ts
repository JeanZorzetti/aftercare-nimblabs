import { describe, it, expect } from 'vitest'
import { generateBodySchema, pdfBodySchema, isSafeLogoUrl } from '@/lib/tools/aftercare/validation'

describe('generateBodySchema', () => {
  it('accepts a valid body and applies defaults', () => {
    const parsed = generateBodySchema.parse({ procedureSlug: 'botox' })
    expect(parsed.clinicName).toBe('')
    expect(parsed.tone).toBe('warm')
    expect(parsed.language).toBe('en')
  })

  it('rejects unknown procedures', () => {
    expect(generateBodySchema.safeParse({ procedureSlug: 'liposuction' }).success).toBe(false)
  })

  it('rejects oversized clinic names', () => {
    expect(generateBodySchema.safeParse({ procedureSlug: 'botox', clinicName: 'x'.repeat(81) }).success).toBe(false)
  })
})

describe('pdfBodySchema', () => {
  const sheet = { title: 'Botox Aftercare', sections: [{ heading: 'Do', items: ['Rest'] }] }

  it('accepts a valid sheet', () => {
    expect(pdfBodySchema.safeParse({ sheet }).success).toBe(true)
  })

  it('rejects a malformed sheet', () => {
    expect(pdfBodySchema.safeParse({ sheet: { title: '', sections: [] } }).success).toBe(false)
  })

  it('rejects invalid brand colors', () => {
    expect(pdfBodySchema.safeParse({ sheet, brandColor: 'red' }).success).toBe(false)
    expect(pdfBodySchema.safeParse({ sheet, brandColor: '#6B8E7F' }).success).toBe(true)
  })
})

describe('isSafeLogoUrl', () => {
  it('allows public https URLs', () => {
    expect(isSafeLogoUrl('https://cdn.example.com/logo.png')).toBe(true)
  })

  it('blocks SSRF vectors', () => {
    expect(isSafeLogoUrl('http://example.com/logo.png')).toBe(false)
    expect(isSafeLogoUrl('https://localhost/logo.png')).toBe(false)
    expect(isSafeLogoUrl('https://127.0.0.1/logo.png')).toBe(false)
    expect(isSafeLogoUrl('https://10.0.0.5/logo.png')).toBe(false)
    expect(isSafeLogoUrl('https://169.254.169.254/latest/meta-data')).toBe(false)
    expect(isSafeLogoUrl('https://internal-host/logo.png')).toBe(false)
    expect(isSafeLogoUrl('https://[::1]/logo.png')).toBe(false)
    expect(isSafeLogoUrl('file:///etc/passwd')).toBe(false)
    expect(isSafeLogoUrl('not a url')).toBe(false)
  })
})
