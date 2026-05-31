import { describe, it, expect } from 'vitest'
import { parseEnv } from '@/lib/env'

describe('parseEnv', () => {
  it('throws with a clear message when GROQ_API_KEY missing', () => {
    expect(() => parseEnv({ DATABASE_URL: 'postgres://x', NEXTAUTH_SECRET: 's', NEXTAUTH_URL: 'http://x', STRIPE_SECRET_KEY: 'sk', STRIPE_WEBHOOK_SECRET: 'wh', STRIPE_PRICE_ID_PRO: 'price' }))
      .toThrow(/GROQ_API_KEY/)
  })
  it('returns parsed env when all present', () => {
    const env = parseEnv({ DATABASE_URL: 'postgres://x', NEXTAUTH_SECRET: 's', NEXTAUTH_URL: 'http://x', STRIPE_SECRET_KEY: 'sk', STRIPE_WEBHOOK_SECRET: 'wh', STRIPE_PRICE_ID_PRO: 'price', GROQ_API_KEY: 'g' })
    expect(env.GROQ_API_KEY).toBe('g')
  })
})
