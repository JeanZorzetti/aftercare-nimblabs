import type { MetadataRoute } from 'next'

// Explicit whitelist for AI crawlers (GEO-01). The `Allow: /` on `*` already covers every one of
// them — what the nominal list changes is auditability: it is what GEO/AEO tools read, and it
// records the decision for whoever touches this next.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'meta-externalagent',
  'CCBot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_CRAWLERS, allow: '/' },
    ],
    sitemap: 'https://aftercare.nimblabs.com/sitemap.xml',
  }
}
