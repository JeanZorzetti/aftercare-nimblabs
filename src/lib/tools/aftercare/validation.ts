import { z } from 'zod'
import { PROCEDURE_SLUGS } from './procedures'

export const generateBodySchema = z.object({
  procedureSlug: z.enum(PROCEDURE_SLUGS as [string, ...string[]]),
  clinicName: z.string().max(80).optional().default(''),
  tone: z.string().max(20).optional().default('warm'),
  language: z.string().max(10).optional().default('en'),
})

export const aftercareSheetSchema = z.object({
  title: z.string().min(1).max(200),
  sections: z
    .array(
      z.object({
        heading: z.string().min(1).max(120),
        items: z.array(z.string().max(500)).max(30),
      })
    )
    .min(1)
    .max(12),
})

export const pdfBodySchema = z.object({
  sheet: aftercareSheetSchema,
  clinicName: z.string().max(80).optional().default(''),
  brandColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  logoUrl: z.string().url().optional(),
})

// Only allow public https logo URLs — the PDF renderer fetches this server-side,
// so anything else (http, localhost, private ranges, raw IPs) is an SSRF vector.
export function isSafeLogoUrl(raw: string): boolean {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return false
  }
  if (url.protocol !== 'https:') return false
  const host = url.hostname.toLowerCase()
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) return false
  // Reject raw IPv4/IPv6 hosts outright (covers 10.x, 127.x, 169.254.x, etc.)
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return false
  if (host.includes(':') || host.startsWith('[')) return false
  return host.includes('.')
}
