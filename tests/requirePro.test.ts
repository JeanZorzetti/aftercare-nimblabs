import { describe, it, expect } from 'vitest'
import { isProStatus } from '@/lib/saas-core/paywall/requirePro'

describe('isProStatus', () => {
  it('active is pro', () => expect(isProStatus('active')).toBe(true))
  it('free is not pro', () => expect(isProStatus('free')).toBe(false))
  it('past_due is not pro', () => expect(isProStatus('past_due')).toBe(false))
  it('canceled is not pro', () => expect(isProStatus('canceled')).toBe(false))
})
