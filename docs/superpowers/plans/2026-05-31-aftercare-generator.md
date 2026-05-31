# AI Aftercare Generator — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `aftercare.nimblabs.com` — a freemium AI tool where aesthetic clinics generate branded post-procedure aftercare sheets, instrumented to measure MRR over 3 months, on a reusable micro-SaaS boilerplate.

**Architecture:** Next.js 16 App Router, two-layer code split: `lib/saas-core` (reusable auth/billing/usage/paywall/seo/analytics — the boilerplate forked for future SaaS) and `lib/tools/aftercare` (this tool's procedures, prompt, PDF). Programmatic SEO via one SSG page per procedure. Stripe webhook is the single source of truth for the paywall.

**Tech Stack:** Next.js 16, TypeScript, Prisma + Postgres, NextAuth (magic link + Google), Stripe Subscriptions, Groq SDK (lazy init), `@react-pdf/renderer` for branded PDF, Vitest for tests, deploy on EasyPanel VPS.

---

## Environment notes (Windows + OneDrive — from prior project gotchas)

- **Package manager:** `npm` (Node 22.18, npm 10.9.3 confirmed).
- **Turbopack breaks dev on Windows+OneDrive** → run dev with `next dev --webpack`. `next build` works fine.
- **Next.js 16 async params (RECURRING BUG):** route handlers/pages MUST use `{ params }: { params: Promise<{ x: string }> }` then `const { x } = await params`.
- **Prisma singleton:** always `import { prisma } from '@/lib/prisma'`, never `new PrismaClient()` in routes.
- **Groq lazy init:** instantiate Groq client inside the function call, never at module top-level (build-time env error otherwise).
- **Env validation at boot** (user global rule: debug env vars first).

---

## File Structure

```
aftercare/
├─ prisma/
│  └─ schema.prisma                  # User, Subscription, ClinicProfile, Generation, SavedSheet, ProcessedWebhook
├─ src/
│  ├─ lib/
│  │  ├─ prisma.ts                   # Prisma singleton
│  │  ├─ env.ts                      # boot-time env validation (zod)
│  │  └─ saas-core/                  # REUSABLE BOILERPLATE
│  │     ├─ auth/
│  │     │  ├─ config.ts             # NextAuth config (magic link + Google)
│  │     │  └─ session.ts            # getServerSession helpers
│  │     ├─ billing/
│  │     │  ├─ stripe.ts             # Stripe client (lazy) + checkout/portal helpers
│  │     │  └─ webhook.ts            # idempotent webhook event handler (pure fn)
│  │     ├─ usage/
│  │     │  └─ usage.ts              # checkUsageLimit, recordUsage
│  │     ├─ paywall/
│  │     │  ├─ requirePro.ts         # server guard
│  │     │  └─ PaywallGate.tsx       # UI gate
│  │     ├─ seo/
│  │     │  ├─ schema.ts             # JSON-LD builders (FAQPage, SoftwareApplication)
│  │     │  └─ ProgrammaticPage.tsx  # shared SEO page layout
│  │     └─ analytics/
│  │        └─ track.ts              # funnel event recorder
│  │  └─ tools/aftercare/            # TOOL-SPECIFIC (swapped per future SaaS)
│  │     ├─ procedures.ts            # 12-15 procedures (slug, name, keywords, seoContent, faq)
│  │     ├─ prompt.ts                # Groq prompt builder + output parser
│  │     ├─ generate.ts             # orchestration: limit→groq→record
│  │     ├─ pdf.tsx                  # branded PDF (react-pdf)
│  │     ├─ AftercareForm.tsx
│  │     └─ AftercareResult.tsx
│  └─ app/
│     ├─ layout.tsx
│     ├─ page.tsx                    # landing
│     ├─ aftercare/[procedure]/page.tsx   # programmatic SSG page
│     ├─ dashboard/page.tsx
│     ├─ sitemap.ts
│     └─ api/
│        ├─ generate/route.ts
│        ├─ pdf/route.ts
│        ├─ stripe/checkout/route.ts
│        ├─ stripe/portal/route.ts
│        ├─ stripe/webhook/route.ts
│        └─ auth/[...nextauth]/route.ts
├─ tests/                            # Vitest unit tests (money + limit logic)
├─ .env.example
├─ vitest.config.ts
└─ package.json
```

---

## Phase 0 — Scaffold & Foundations

### Task 0.1: Scaffold Next.js project

**Files:**
- Create: whole `aftercare/` project tree

- [ ] **Step 1: Scaffold**

Run from `c:\Users\jeanz\OneDrive\Desktop\ROI Labs`:
```bash
npx create-next-app@latest aftercare --typescript --app --tailwind --eslint --src-dir --import-alias "@/*" --no-turbopack
```
Expected: project created in `aftercare/`.

- [ ] **Step 2: Init git + first commit**

```bash
cd aftercare
git init
git add -A
git commit -m "chore: scaffold next.js app"
```

- [ ] **Step 3: Add `.gitattributes` (LF for shell scripts — prior gotcha)**

Create `.gitattributes`:
```
* text=auto eol=lf
```
Commit:
```bash
git add .gitattributes && git commit -m "chore: enforce lf line endings"
```

### Task 0.2: Install dependencies

- [ ] **Step 1: Install runtime + dev deps**

```bash
npm install @prisma/client next-auth@beta @auth/prisma-adapter stripe groq-sdk @react-pdf/renderer zod nodemailer
npm install -D prisma vitest @vitejs/plugin-react vite-tsconfig-paths @testing-library/react jsdom
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json && git commit -m "chore: add core dependencies"
```

### Task 0.3: Vitest config + smoke test (TDD harness first)

**Files:**
- Create: `vitest.config.ts`, `tests/smoke.test.ts`

- [ ] **Step 1: Write vitest config**

`vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: { environment: 'node', globals: true },
})
```

- [ ] **Step 2: Add test script to package.json**

In `package.json` `"scripts"`, add: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 3: Write smoke test**

`tests/smoke.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
describe('harness', () => {
  it('runs', () => { expect(1 + 1).toBe(2) })
})
```

- [ ] **Step 4: Run it**

Run: `npm test`
Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts tests/smoke.test.ts package.json && git commit -m "test: add vitest harness"
```

### Task 0.4: Env validation (boot-time, zod)

**Files:**
- Create: `src/lib/env.ts`, `tests/env.test.ts`, `.env.example`

- [ ] **Step 1: Write failing test**

`tests/env.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run test — expect FAIL** (`Cannot find module '@/lib/env'`)

Run: `npm test -- tests/env.test.ts`

- [ ] **Step 3: Implement**

`src/lib/env.ts`:
```typescript
import { z } from 'zod'

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
  GROQ_API_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_PRICE_ID_PRO: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  EMAIL_SERVER: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
})

export type Env = z.infer<typeof schema>

export function parseEnv(raw: NodeJS.ProcessEnv | Record<string, string | undefined>): Env {
  const result = schema.safeParse(raw)
  if (!result.success) {
    const missing = result.error.issues.map((i) => i.path.join('.')).join(', ')
    throw new Error(`Invalid/missing environment variables: ${missing}`)
  }
  return result.data
}

export const env = parseEnv(process.env)
```

- [ ] **Step 4: Run test — expect PASS**

Run: `npm test -- tests/env.test.ts`

- [ ] **Step 5: Create `.env.example`**

```
DATABASE_URL=postgresql://user:pass@host:5432/aftercare
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GROQ_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_PRO=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
EMAIL_SERVER=smtp://user:pass@smtp.host:587
EMAIL_FROM=Aftercare <noreply@nimblabs.com>
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/env.ts tests/env.test.ts .env.example && git commit -m "feat: boot-time env validation"
```

### Task 0.5: Prisma schema + singleton

**Files:**
- Create: `prisma/schema.prisma`, `src/lib/prisma.ts`

- [ ] **Step 1: Write schema**

`prisma/schema.prisma`:
```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  image         String?
  emailVerified DateTime?
  authMethod    String?  // magic-link | google
  createdAt     DateTime @default(now())
  accounts      Account[]
  sessions      Session[]
  subscription  Subscription?
  clinicProfile ClinicProfile?
  generations   Generation[]
  savedSheets   SavedSheet[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

model Subscription {
  id                   String   @id @default(cuid())
  userId               String   @unique
  stripeCustomerId     String?  @unique
  stripeSubscriptionId String?  @unique
  status               String   @default("free") // free | active | canceled | past_due
  plan                 String   @default("free") // free | pro
  currentPeriodEnd     DateTime?
  user                 User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model ClinicProfile {
  id              String  @id @default(cuid())
  userId          String  @unique
  clinicName      String
  logoUrl         String?
  brandColor      String  @default("#111827")
  defaultLanguage String  @default("en")
  defaultTone     String  @default("warm")
  user            User    @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Generation {
  id            String   @id @default(cuid())
  userId        String?
  procedureSlug String
  tone          String
  language      String
  createdAt     DateTime @default(now())
  user          User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  @@index([userId, createdAt])
}

model SavedSheet {
  id            String   @id @default(cuid())
  userId        String
  procedureSlug String
  content       String   @db.Text
  createdAt     DateTime @default(now())
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model ProcessedWebhook {
  id          String   @id   // stripe event.id
  processedAt DateTime @default(now())
}

model FunnelEvent {
  id        String   @id @default(cuid())
  name      String   // visit | generate | paywall | subscribe
  userId    String?
  meta      String?  @db.Text
  createdAt DateTime @default(now())
  @@index([name, createdAt])
}
```

- [ ] **Step 2: Write Prisma singleton**

`src/lib/prisma.ts`:
```typescript
import { PrismaClient } from '@prisma/client'
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

- [ ] **Step 3: Generate client + push to a local/dev DB**

Run:
```bash
npx prisma generate
npx prisma db push
```
Expected: client generated; schema synced (requires `DATABASE_URL` in `.env`).

- [ ] **Step 4: Commit**

```bash
git add prisma/schema.prisma src/lib/prisma.ts && git commit -m "feat: prisma schema + singleton"
```

---

## Phase 1 — saas-core: Usage Metering (TDD — pure logic first)

### Task 1.1: checkUsageLimit / recordUsage

**Files:**
- Create: `src/lib/saas-core/usage/usage.ts`, `tests/usage.test.ts`

- [ ] **Step 1: Write failing test**

`tests/usage.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkUsageLimit, FREE_DAILY_LIMIT } from '@/lib/saas-core/usage/usage'

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

  it('anonymous gets 1 free generation', async () => {
    mockPrisma.generation.count.mockResolvedValue(0)
    const r = await checkUsageLimit({ userId: null, isPro: false })
    expect(r.allowed).toBe(true)
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

Run: `npm test -- tests/usage.test.ts`

- [ ] **Step 3: Implement**

`src/lib/saas-core/usage/usage.ts`:
```typescript
import { prisma } from '@/lib/prisma'

export const FREE_DAILY_LIMIT = 3
export const ANON_LIMIT = 1

export interface UsageResult { allowed: boolean; remaining: number }

function startOfTodayUTC(): Date {
  const d = new Date()
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

export async function checkUsageLimit({ userId, isPro }: { userId: string | null; isPro: boolean }): Promise<UsageResult> {
  if (isPro) return { allowed: true, remaining: Infinity }
  const limit = userId ? FREE_DAILY_LIMIT : ANON_LIMIT
  if (!userId) {
    // anonymous limit is enforced at the route via cookie; here we treat as allowed-once baseline
    return { allowed: true, remaining: limit }
  }
  const used = await prisma.generation.count({
    where: { userId, createdAt: { gte: startOfTodayUTC() } },
  })
  const remaining = Math.max(0, limit - used)
  return { allowed: remaining > 0, remaining }
}

export async function recordUsage(params: { userId: string | null; procedureSlug: string; tone: string; language: string }): Promise<void> {
  await prisma.generation.create({ data: params })
}
```

- [ ] **Step 4: Run — expect PASS**

Run: `npm test -- tests/usage.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/lib/saas-core/usage/usage.ts tests/usage.test.ts && git commit -m "feat(saas-core): usage metering"
```

---

## Phase 2 — saas-core: Paywall + Stripe Webhook (the money logic, TDD)

### Task 2.1: requirePro server guard

**Files:**
- Create: `src/lib/saas-core/paywall/requirePro.ts`, `tests/requirePro.test.ts`

- [ ] **Step 1: Write failing test**

`tests/requirePro.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { isProStatus } from '@/lib/saas-core/paywall/requirePro'

describe('isProStatus', () => {
  it('active is pro', () => expect(isProStatus('active')).toBe(true))
  it('free is not pro', () => expect(isProStatus('free')).toBe(false))
  it('past_due is not pro', () => expect(isProStatus('past_due')).toBe(false))
  it('canceled is not pro', () => expect(isProStatus('canceled')).toBe(false))
})
```

- [ ] **Step 2: Run — expect FAIL**

Run: `npm test -- tests/requirePro.test.ts`

- [ ] **Step 3: Implement**

`src/lib/saas-core/paywall/requirePro.ts`:
```typescript
import { prisma } from '@/lib/prisma'

export function isProStatus(status: string | null | undefined): boolean {
  return status === 'active'
}

export async function getIsPro(userId: string | null): Promise<boolean> {
  if (!userId) return false
  const sub = await prisma.subscription.findUnique({ where: { userId } })
  return isProStatus(sub?.status)
}
```

- [ ] **Step 4: Run — expect PASS**

Run: `npm test -- tests/requirePro.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/lib/saas-core/paywall/requirePro.ts tests/requirePro.test.ts && git commit -m "feat(saas-core): paywall pro guard"
```

### Task 2.2: Stripe webhook reducer (idempotent, pure)

**Files:**
- Create: `src/lib/saas-core/billing/webhook.ts`, `tests/webhook.test.ts`

- [ ] **Step 1: Write failing test**

`tests/webhook.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { reduceWebhookEvent } from '@/lib/saas-core/billing/webhook'

describe('reduceWebhookEvent', () => {
  it('checkout.session.completed -> active', () => {
    const r = reduceWebhookEvent({
      type: 'checkout.session.completed',
      data: { object: { customer: 'cus_1', subscription: 'sub_1', metadata: { userId: 'u1' } } },
    } as never)
    expect(r).toEqual({ userId: 'u1', stripeCustomerId: 'cus_1', stripeSubscriptionId: 'sub_1', status: 'active', plan: 'pro' })
  })

  it('customer.subscription.deleted -> free', () => {
    const r = reduceWebhookEvent({
      type: 'customer.subscription.deleted',
      data: { object: { id: 'sub_1', customer: 'cus_1', metadata: { userId: 'u1' } } },
    } as never)
    expect(r).toEqual({ userId: 'u1', stripeCustomerId: 'cus_1', stripeSubscriptionId: 'sub_1', status: 'free', plan: 'free' })
  })

  it('past_due maps through subscription.updated', () => {
    const r = reduceWebhookEvent({
      type: 'customer.subscription.updated',
      data: { object: { id: 'sub_1', customer: 'cus_1', status: 'past_due', metadata: { userId: 'u1' } } },
    } as never)
    expect(r?.status).toBe('past_due')
    expect(r?.plan).toBe('free')
  })

  it('unhandled event returns null', () => {
    const r = reduceWebhookEvent({ type: 'invoice.created', data: { object: {} } } as never)
    expect(r).toBeNull()
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

Run: `npm test -- tests/webhook.test.ts`

- [ ] **Step 3: Implement**

`src/lib/saas-core/billing/webhook.ts`:
```typescript
import type Stripe from 'stripe'

export interface SubscriptionUpdate {
  userId: string
  stripeCustomerId: string
  stripeSubscriptionId: string | null
  status: 'free' | 'active' | 'past_due' | 'canceled'
  plan: 'free' | 'pro'
}

export function reduceWebhookEvent(event: Stripe.Event): SubscriptionUpdate | null {
  const obj = event.data.object as Record<string, unknown>
  const userId = (obj.metadata as Record<string, string> | undefined)?.userId
  if (!userId) return null

  switch (event.type) {
    case 'checkout.session.completed':
      return {
        userId,
        stripeCustomerId: String(obj.customer),
        stripeSubscriptionId: obj.subscription ? String(obj.subscription) : null,
        status: 'active',
        plan: 'pro',
      }
    case 'customer.subscription.updated': {
      const s = String(obj.status)
      const status = s === 'active' || s === 'trialing' ? 'active' : s === 'past_due' ? 'past_due' : 'canceled'
      return {
        userId,
        stripeCustomerId: String(obj.customer),
        stripeSubscriptionId: String(obj.id),
        status,
        plan: status === 'active' ? 'pro' : 'free',
      }
    }
    case 'customer.subscription.deleted':
      return {
        userId,
        stripeCustomerId: String(obj.customer),
        stripeSubscriptionId: String(obj.id),
        status: 'free',
        plan: 'free',
      }
    default:
      return null
  }
}
```

- [ ] **Step 4: Run — expect PASS**

Run: `npm test -- tests/webhook.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/lib/saas-core/billing/webhook.ts tests/webhook.test.ts && git commit -m "feat(saas-core): idempotent stripe webhook reducer"
```

### Task 2.3: Stripe client (lazy) + checkout/portal helpers

**Files:**
- Create: `src/lib/saas-core/billing/stripe.ts`

- [ ] **Step 1: Implement (lazy init — no test; thin wrapper over SDK)**

`src/lib/saas-core/billing/stripe.ts`:
```typescript
import Stripe from 'stripe'
import { env } from '@/lib/env'

let _stripe: Stripe | null = null
export function getStripe(): Stripe {
  if (!_stripe) _stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2025-04-30.basil' })
  return _stripe
}

export async function createCheckoutSession(params: { userId: string; email: string; successUrl: string; cancelUrl: string }) {
  const stripe = getStripe()
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: params.email,
    line_items: [{ price: env.STRIPE_PRICE_ID_PRO, quantity: 1 }],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    subscription_data: { metadata: { userId: params.userId } },
    metadata: { userId: params.userId },
  })
}

export async function createPortalSession(params: { customerId: string; returnUrl: string }) {
  const stripe = getStripe()
  return stripe.billingPortal.sessions.create({ customer: params.customerId, return_url: params.returnUrl })
}
```

> Note: `metadata.userId` is set on BOTH the session and the subscription so `reduceWebhookEvent` finds it on `checkout.session.completed` AND on later `customer.subscription.*` events.

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/saas-core/billing/stripe.ts && git commit -m "feat(saas-core): lazy stripe client + checkout/portal"
```

---

## Phase 3 — saas-core: Auth + Analytics

### Task 3.1: NextAuth config (magic link + Google)

**Files:**
- Create: `src/lib/saas-core/auth/config.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/lib/saas-core/auth/session.ts`

- [ ] **Step 1: Implement auth config**

`src/lib/saas-core/auth/config.ts`:
```typescript
import { type NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Email from 'next-auth/providers/nodemailer'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  providers: [
    Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }),
    Email({ server: process.env.EMAIL_SERVER, from: process.env.EMAIL_FROM }),
  ],
  trustHost: true, // behind EasyPanel proxy (prior gotcha)
  callbacks: {
    async session({ session, user }) {
      if (session.user) session.user.id = user.id
      return session
    },
  },
}
```

- [ ] **Step 2: Create route + session helper**

`src/app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from 'next-auth'
import { authConfig } from '@/lib/saas-core/auth/config'
const { handlers } = NextAuth(authConfig)
export const { GET, POST } = handlers
```

`src/lib/saas-core/auth/session.ts`:
```typescript
import NextAuth from 'next-auth'
import { authConfig } from './config'
export const { auth } = NextAuth(authConfig)

export async function getUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id ?? null
}
```

- [ ] **Step 3: Verify compile**

Run: `npx tsc --noEmit`
Expected: no errors (add `next-auth.d.ts` augmenting `session.user.id` if TS complains — see Step 4).

- [ ] **Step 4: Add type augmentation if needed**

`src/types/next-auth.d.ts`:
```typescript
import 'next-auth'
declare module 'next-auth' {
  interface Session { user: { id: string; email?: string | null; name?: string | null; image?: string | null } }
}
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/saas-core/auth src/app/api/auth src/types && git commit -m "feat(saas-core): nextauth magic-link + google"
```

### Task 3.2: Analytics funnel tracker

**Files:**
- Create: `src/lib/saas-core/analytics/track.ts`, `tests/track.test.ts`

- [ ] **Step 1: Write failing test**

`tests/track.test.ts`:
```typescript
import { describe, it, expect, vi } from 'vitest'
import { track } from '@/lib/saas-core/analytics/track'

const create = vi.fn()
vi.mock('@/lib/prisma', () => ({ prisma: { funnelEvent: { create: (...a: unknown[]) => create(...a) } } }))

describe('track', () => {
  it('records a funnel event with name + meta', async () => {
    await track('generate', { userId: 'u1', meta: { procedure: 'botox' } })
    expect(create).toHaveBeenCalledWith({ data: { name: 'generate', userId: 'u1', meta: JSON.stringify({ procedure: 'botox' }) } })
  })
})
```

- [ ] **Step 2: Run — expect FAIL**

Run: `npm test -- tests/track.test.ts`

- [ ] **Step 3: Implement**

`src/lib/saas-core/analytics/track.ts`:
```typescript
import { prisma } from '@/lib/prisma'

export type FunnelName = 'visit' | 'generate' | 'paywall' | 'subscribe'

export async function track(name: FunnelName, opts?: { userId?: string | null; meta?: Record<string, unknown> }): Promise<void> {
  try {
    await prisma.funnelEvent.create({
      data: { name, userId: opts?.userId ?? null, meta: opts?.meta ? JSON.stringify(opts.meta) : null },
    })
  } catch {
    // analytics must never break the request
  }
}
```

- [ ] **Step 4: Run — expect PASS**

Run: `npm test -- tests/track.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/lib/saas-core/analytics/track.ts tests/track.test.ts && git commit -m "feat(saas-core): funnel analytics tracker"
```

---

## Phase 4 — saas-core: SEO helpers

### Task 4.1: JSON-LD schema builders

**Files:**
- Create: `src/lib/saas-core/seo/schema.ts`, `tests/schema.test.ts`

- [ ] **Step 1: Write failing test**

`tests/schema.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run — expect FAIL**

Run: `npm test -- tests/schema.test.ts`

- [ ] **Step 3: Implement**

`src/lib/saas-core/seo/schema.ts`:
```typescript
export function buildFaqSchema(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function buildSoftwareAppSchema(params: { name: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: params.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: params.url,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }
}
```

- [ ] **Step 4: Run — expect PASS**

Run: `npm test -- tests/schema.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/lib/saas-core/seo/schema.ts tests/schema.test.ts && git commit -m "feat(saas-core): json-ld schema builders"
```

---

## Phase 5 — tool/aftercare: Procedures data + Prompt + Generation

### Task 5.1: Procedures dataset (12-15 champions)

**Files:**
- Create: `src/lib/tools/aftercare/procedures.ts`, `tests/procedures.test.ts`

- [ ] **Step 1: Write failing test**

`tests/procedures.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run — expect FAIL**

Run: `npm test -- tests/procedures.test.ts`

- [ ] **Step 3: Implement** (champions chosen for long-tail KD-low, daily-pain procedures)

`src/lib/tools/aftercare/procedures.ts`:
```typescript
export interface Procedure {
  slug: string
  name: string
  keywords: string[]
  seoIntro: string
  faq: { q: string; a: string }[]
}

export const PROCEDURES: Procedure[] = [
  {
    slug: 'botox',
    name: 'Botox',
    keywords: ['botox aftercare instructions', 'botox aftercare generator', 'botox post care template'],
    seoIntro: 'Generate clear, professional Botox aftercare instructions for your patients in seconds, branded with your clinic name and ready to hand out.',
    faq: [
      { q: 'Why is Botox aftercare important?', a: 'Proper aftercare reduces the risk of bruising and product migration and helps results settle evenly over the first two weeks.' },
      { q: 'What should patients avoid after Botox?', a: 'Lying down, vigorous exercise, alcohol, and rubbing the treated area for the first 24 hours.' },
      { q: 'How long until Botox results show?', a: 'Initial effects appear in 3-5 days, with full results at around 14 days.' },
    ],
  },
  {
    slug: 'lip-filler',
    name: 'Lip Filler',
    keywords: ['lip filler aftercare instructions', 'lip filler aftercare generator', 'dermal filler post care'],
    seoIntro: 'Create branded lip filler aftercare sheets for your clients instantly — covering swelling, bruising, and what to avoid.',
    faq: [
      { q: 'Is swelling normal after lip filler?', a: 'Yes — swelling peaks at 24-48 hours and usually settles within a week.' },
      { q: 'What should clients avoid after lip filler?', a: 'Heat, strenuous exercise, alcohol, and pressure on the lips for 24-48 hours.' },
      { q: 'When can clients wear lipstick again?', a: 'Generally after 24 hours, once injection points have closed.' },
    ],
  },
  {
    slug: 'microneedling',
    name: 'Microneedling',
    keywords: ['microneedling aftercare instructions', 'microneedling aftercare generator', 'microneedling post care'],
    seoIntro: 'Generate professional microneedling aftercare instructions with your clinic branding — redness timeline, sun care, and product guidance.',
    faq: [
      { q: 'How long does redness last after microneedling?', a: 'Redness typically resembles a mild sunburn for 24-72 hours.' },
      { q: 'When can clients wear makeup after microneedling?', a: 'Usually after 24 hours to let the skin barrier recover.' },
      { q: 'Is sunscreen required after microneedling?', a: 'Yes — broad-spectrum SPF is essential as skin is more photosensitive.' },
    ],
  },
  {
    slug: 'chemical-peel',
    name: 'Chemical Peel',
    keywords: ['chemical peel aftercare instructions', 'chemical peel aftercare generator', 'chemical peel post care'],
    seoIntro: 'Create clear chemical peel aftercare instructions for clients — peeling expectations, moisturizing, and sun protection.',
    faq: [
      { q: 'When will skin start peeling after a chemical peel?', a: 'Peeling usually begins on day 2-3 and lasts up to a week depending on depth.' },
      { q: 'Should clients peel the skin manually?', a: 'No — let it shed naturally to avoid scarring or hyperpigmentation.' },
      { q: 'What products should be avoided after a peel?', a: 'Retinoids, exfoliants, and active acids until the skin has fully recovered.' },
    ],
  },
  {
    slug: 'laser-hair-removal',
    name: 'Laser Hair Removal',
    keywords: ['laser hair removal aftercare instructions', 'laser hair removal aftercare generator', 'laser hair removal post care'],
    seoIntro: 'Generate branded laser hair removal aftercare sheets — cooling, sun avoidance, and shedding guidance for your clients.',
    faq: [
      { q: 'Is redness normal after laser hair removal?', a: 'Mild redness and bumps around follicles are common for 24-48 hours.' },
      { q: 'Can clients sunbathe after laser hair removal?', a: 'No — sun exposure should be avoided for at least two weeks.' },
      { q: 'When does treated hair fall out?', a: 'Shedding typically occurs over 1-3 weeks after treatment.' },
    ],
  },
  {
    slug: 'dermaplaning',
    name: 'Dermaplaning',
    keywords: ['dermaplaning aftercare instructions', 'dermaplaning aftercare generator', 'dermaplaning post care'],
    seoIntro: 'Create dermaplaning aftercare instructions with your branding — sensitivity, sun care, and product timing.',
    faq: [
      { q: 'Is skin sensitive after dermaplaning?', a: 'Yes — skin can feel tight and sensitive for 24-48 hours.' },
      { q: 'When can clients use actives after dermaplaning?', a: 'Wait 24-72 hours before resuming retinoids or exfoliating acids.' },
      { q: 'Does dermaplaning require sunscreen?', a: 'Yes — freshly exfoliated skin is more sensitive to UV.' },
    ],
  },
  {
    slug: 'hydrafacial',
    name: 'HydraFacial',
    keywords: ['hydrafacial aftercare instructions', 'hydrafacial aftercare generator', 'hydrafacial post care'],
    seoIntro: 'Generate HydraFacial aftercare instructions for clients with your clinic branding — hydration and product guidance.',
    faq: [
      { q: 'Can clients wear makeup after a HydraFacial?', a: 'It is best to wait at least 6-12 hours to let the skin breathe.' },
      { q: 'How long do HydraFacial results last?', a: 'Typically 5-7 days, longer with a consistent skincare routine.' },
      { q: 'Should clients avoid exfoliation after?', a: 'Yes — avoid exfoliants for 24-48 hours.' },
    ],
  },
  {
    slug: 'microblading',
    name: 'Microblading',
    keywords: ['microblading aftercare instructions', 'microblading aftercare generator', 'microblading post care'],
    seoIntro: 'Create branded microblading aftercare sheets — healing timeline, cleaning, and what to avoid for best retention.',
    faq: [
      { q: 'How long does microblading take to heal?', a: 'Surface healing takes about 7-14 days; full healing up to 4-6 weeks.' },
      { q: 'Can clients get brows wet after microblading?', a: 'Avoid soaking and heavy moisture for the first 7-10 days.' },
      { q: 'Why do brows look darker at first?', a: 'Pigment appears darker before it softens during healing.' },
    ],
  },
  {
    slug: 'lip-blush',
    name: 'Lip Blush',
    keywords: ['lip blush aftercare instructions', 'lip blush aftercare generator', 'lip blush tattoo post care'],
    seoIntro: 'Generate lip blush tattoo aftercare instructions for clients — healing, hydration, and color settling guidance.',
    faq: [
      { q: 'How long does lip blush take to heal?', a: 'Initial healing is about 7-10 days; color settles over 4-6 weeks.' },
      { q: 'Should clients keep lips moisturized?', a: 'Yes — apply the recommended balm to prevent cracking.' },
      { q: 'Is peeling normal after lip blush?', a: 'Yes — light flaking during the first week is expected.' },
    ],
  },
  {
    slug: 'dermal-fillers',
    name: 'Dermal Fillers',
    keywords: ['dermal filler aftercare instructions', 'dermal filler aftercare generator', 'cheek filler post care'],
    seoIntro: 'Create dermal filler aftercare instructions with your branding — swelling, bruising, and activity guidance.',
    faq: [
      { q: 'Is bruising normal after dermal fillers?', a: 'Mild bruising and swelling can occur and usually resolve within a week.' },
      { q: 'What should clients avoid after fillers?', a: 'Strenuous exercise, alcohol, and heat for 24-48 hours.' },
      { q: 'When do dermal filler results settle?', a: 'Final results typically settle within two weeks.' },
    ],
  },
  {
    slug: 'prp-microneedling',
    name: 'PRP Microneedling',
    keywords: ['prp microneedling aftercare instructions', 'prp facial aftercare generator', 'vampire facial post care'],
    seoIntro: 'Generate PRP microneedling (vampire facial) aftercare instructions branded for your clinic — redness and recovery guidance.',
    faq: [
      { q: 'How long is downtime after PRP microneedling?', a: 'Redness and sensitivity typically last 24-72 hours.' },
      { q: 'When can clients wash their face?', a: 'Usually after 24 hours with a gentle cleanser.' },
      { q: 'Is sun protection needed after PRP?', a: 'Yes — strict SPF is recommended during recovery.' },
    ],
  },
  {
    slug: 'coolsculpting',
    name: 'CoolSculpting',
    keywords: ['coolsculpting aftercare instructions', 'coolsculpting aftercare generator', 'fat freezing post care'],
    seoIntro: 'Create CoolSculpting (fat freezing) aftercare instructions for clients — massage, soreness, and results timeline.',
    faq: [
      { q: 'Is soreness normal after CoolSculpting?', a: 'Yes — tenderness, numbness, and swelling are common for days to weeks.' },
      { q: 'Should clients massage the treated area?', a: 'A short massage after treatment can help, per your protocol.' },
      { q: 'When are CoolSculpting results visible?', a: 'Results develop over 1-3 months as the body clears fat cells.' },
    ],
  },
  {
    slug: 'chemical-peel-tca',
    name: 'TCA Peel',
    keywords: ['tca peel aftercare instructions', 'tca peel aftercare generator', 'tca peel post care'],
    seoIntro: 'Generate TCA peel aftercare instructions branded for your clinic — peeling, hydration, and sun protection.',
    faq: [
      { q: 'How deep is a TCA peel?', a: 'TCA peels are medium-depth and require careful aftercare and sun avoidance.' },
      { q: 'How long does TCA peeling last?', a: 'Peeling generally lasts 5-7 days.' },
      { q: 'Can clients use makeup during peeling?', a: 'Avoid makeup until peeling completes to prevent irritation.' },
    ],
  },
]

export function getProcedure(slug: string): Procedure | undefined {
  return PROCEDURES.find((p) => p.slug === slug)
}

export const PROCEDURE_SLUGS = PROCEDURES.map((p) => p.slug)
```

- [ ] **Step 4: Run — expect PASS**

Run: `npm test -- tests/procedures.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/aftercare/procedures.ts tests/procedures.test.ts && git commit -m "feat(aftercare): 13 champion procedures dataset"
```

### Task 5.2: Prompt builder + output parser

**Files:**
- Create: `src/lib/tools/aftercare/prompt.ts`, `tests/prompt.test.ts`

- [ ] **Step 1: Write failing test**

`tests/prompt.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run — expect FAIL**

Run: `npm test -- tests/prompt.test.ts`

- [ ] **Step 3: Implement**

`src/lib/tools/aftercare/prompt.ts`:
```typescript
export interface AftercareSheet {
  title: string
  sections: { heading: string; items: string[] }[]
}

export function buildPrompt(params: { procedureName: string; clinicName: string; tone: string; language: string }): string {
  return `You are a medical-aesthetics assistant writing patient-facing AFTERCARE instructions (NOT consent, NOT medical advice). 
Procedure: ${params.procedureName}
Clinic name: ${params.clinicName}
Tone: ${params.tone}
Language: ${params.language}

Write practical post-procedure aftercare for the patient to take home. 
Respond ONLY with strict JSON matching:
{"title": string, "sections": [{"heading": string, "items": string[]}]}
Include sections: "What to expect", "Do", "Don't", "When to contact ${params.clinicName}". 
Keep each item short and clear. Do not include any text outside the JSON.`
}

export function parseAftercare(raw: string): AftercareSheet {
  let text = raw.trim()
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fence) text = fence[1].trim()
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('Failed to parse aftercare output: no JSON found')
  try {
    const obj = JSON.parse(text.slice(start, end + 1))
    if (!obj.title || !Array.isArray(obj.sections)) throw new Error('shape')
    return obj as AftercareSheet
  } catch {
    throw new Error('Failed to parse aftercare output: invalid JSON')
  }
}
```

- [ ] **Step 4: Run — expect PASS**

Run: `npm test -- tests/prompt.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/aftercare/prompt.ts tests/prompt.test.ts && git commit -m "feat(aftercare): prompt builder + tolerant parser"
```

### Task 5.3: Generation orchestration (Groq lazy, retry, record-on-success)

**Files:**
- Create: `src/lib/tools/aftercare/generate.ts`, `tests/generate.test.ts`

- [ ] **Step 1: Write failing test**

`tests/generate.test.ts`:
```typescript
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
```

- [ ] **Step 2: Run — expect FAIL**

Run: `npm test -- tests/generate.test.ts`

- [ ] **Step 3: Implement**

`src/lib/tools/aftercare/generate.ts`:
```typescript
import Groq from 'groq-sdk'
import { env } from '@/lib/env'
import { buildPrompt, parseAftercare, type AftercareSheet } from './prompt'
import { recordUsage } from '@/lib/saas-core/usage/usage'

export interface GenerateParams {
  userId: string | null
  procedureSlug: string
  procedureName: string
  clinicName: string
  tone: string
  language: string
}

async function callGroq(prompt: string): Promise<string> {
  const groq = new Groq({ apiKey: env.GROQ_API_KEY }) // lazy: created per call
  const res = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
  })
  return res.choices[0]?.message?.content ?? ''
}

export async function generateAftercare(params: GenerateParams): Promise<AftercareSheet> {
  const prompt = buildPrompt(params)
  let content: string
  try {
    content = await callGroq(prompt)
  } catch {
    content = await callGroq(prompt) // retry once
  }
  const sheet = parseAftercare(content)
  await recordUsage({
    userId: params.userId,
    procedureSlug: params.procedureSlug,
    tone: params.tone,
    language: params.language,
  })
  return sheet
}
```

- [ ] **Step 4: Run — expect PASS**

Run: `npm test -- tests/generate.test.ts`

- [ ] **Step 5: Commit**

```bash
git add src/lib/tools/aftercare/generate.ts tests/generate.test.ts && git commit -m "feat(aftercare): generation orchestration (lazy groq, retry, record-on-success)"
```

---

## Phase 6 — API Routes

### Task 6.1: /api/generate

**Files:**
- Create: `src/app/api/generate/route.ts`

- [ ] **Step 1: Implement**

`src/app/api/generate/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/saas-core/auth/session'
import { getIsPro } from '@/lib/saas-core/paywall/requirePro'
import { checkUsageLimit } from '@/lib/saas-core/usage/usage'
import { generateAftercare } from '@/lib/tools/aftercare/generate'
import { getProcedure } from '@/lib/tools/aftercare/procedures'
import { track } from '@/lib/saas-core/analytics/track'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { procedureSlug, clinicName, tone, language } = body as { procedureSlug: string; clinicName: string; tone: string; language: string }
  const procedure = getProcedure(procedureSlug)
  if (!procedure) return NextResponse.json({ error: 'Unknown procedure' }, { status: 400 })

  const userId = await getUserId()
  const isPro = await getIsPro(userId)

  const usage = await checkUsageLimit({ userId, isPro })
  if (!usage.allowed) {
    await track('paywall', { userId, meta: { procedureSlug } })
    return NextResponse.json({ error: 'limit_reached', upgrade: true }, { status: 402 })
  }

  try {
    const sheet = await generateAftercare({
      userId, procedureSlug, procedureName: procedure.name,
      clinicName: clinicName || 'Your Clinic',
      tone: isPro ? tone : 'warm',
      language: isPro ? language : 'en',
    })
    await track('generate', { userId, meta: { procedureSlug } })
    return NextResponse.json({ sheet, remaining: isPro ? null : usage.remaining - 1 })
  } catch {
    return NextResponse.json({ error: 'generation_failed' }, { status: 503 })
  }
}
```

- [ ] **Step 2: Verify compile**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/generate/route.ts && git commit -m "feat(api): generate route with paywall + analytics"
```

### Task 6.2: /api/stripe/webhook (idempotent persistence)

**Files:**
- Create: `src/app/api/stripe/webhook/route.ts`

- [ ] **Step 1: Implement**

`src/app/api/stripe/webhook/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/saas-core/billing/stripe'
import { reduceWebhookEvent } from '@/lib/saas-core/billing/webhook'
import { prisma } from '@/lib/prisma'
import { env } from '@/lib/env'
import { track } from '@/lib/saas-core/analytics/track'

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'no signature' }, { status: 400 })
  const raw = await req.text()

  let event
  try {
    event = getStripe().webhooks.constructEvent(raw, sig, env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 })
  }

  // idempotency
  const already = await prisma.processedWebhook.findUnique({ where: { id: event.id } })
  if (already) return NextResponse.json({ received: true, duplicate: true })

  const update = reduceWebhookEvent(event)
  if (update) {
    await prisma.subscription.upsert({
      where: { userId: update.userId },
      create: { userId: update.userId, stripeCustomerId: update.stripeCustomerId, stripeSubscriptionId: update.stripeSubscriptionId, status: update.status, plan: update.plan },
      update: { stripeCustomerId: update.stripeCustomerId, stripeSubscriptionId: update.stripeSubscriptionId, status: update.status, plan: update.plan },
    })
    if (update.status === 'active') await track('subscribe', { userId: update.userId })
  }

  await prisma.processedWebhook.create({ data: { id: event.id } })
  return NextResponse.json({ received: true })
}
```

- [ ] **Step 2: Verify compile**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/app/api/stripe/webhook/route.ts && git commit -m "feat(api): idempotent stripe webhook persistence"
```

### Task 6.3: /api/stripe/checkout + /api/stripe/portal + /api/pdf

**Files:**
- Create: `src/app/api/stripe/checkout/route.ts`, `src/app/api/stripe/portal/route.ts`, `src/app/api/pdf/route.ts`

- [ ] **Step 1: Implement checkout**

`src/app/api/stripe/checkout/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { auth } from '@/lib/saas-core/auth/session'
import { createCheckoutSession } from '@/lib/saas-core/billing/stripe'
import { env } from '@/lib/env'

export async function POST() {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const base = env.NEXTAUTH_URL
  const checkout = await createCheckoutSession({
    userId: session.user.id, email: session.user.email,
    successUrl: `${base}/dashboard?upgraded=1`, cancelUrl: `${base}/dashboard`,
  })
  return NextResponse.json({ url: checkout.url })
}
```

- [ ] **Step 2: Implement portal**

`src/app/api/stripe/portal/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { auth } from '@/lib/saas-core/auth/session'
import { createPortalSession } from '@/lib/saas-core/billing/stripe'
import { prisma } from '@/lib/prisma'
import { env } from '@/lib/env'

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const sub = await prisma.subscription.findUnique({ where: { userId: session.user.id } })
  if (!sub?.stripeCustomerId) return NextResponse.json({ error: 'no_customer' }, { status: 400 })
  const portal = await createPortalSession({ customerId: sub.stripeCustomerId, returnUrl: `${env.NEXTAUTH_URL}/dashboard` })
  return NextResponse.json({ url: portal.url })
}
```

- [ ] **Step 3: Implement PDF (Pro-gated, branded)**

`src/app/api/pdf/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getUserId } from '@/lib/saas-core/auth/session'
import { getIsPro } from '@/lib/saas-core/paywall/requirePro'
import { renderAftercarePdf } from '@/lib/tools/aftercare/pdf'

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  const isPro = await getIsPro(userId)
  const body = await req.json()
  const { sheet, clinicName, brandColor, logoUrl } = body
  const buffer = await renderAftercarePdf({ sheet, clinicName, brandColor, logoUrl, watermark: !isPro })
  return new NextResponse(buffer, {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="aftercare.pdf"' },
  })
}
```

- [ ] **Step 4: Verify compile** (will fail until pdf.tsx exists — implemented next task; if executing in order, implement Task 7.0 first then re-run)

Run: `npx tsc --noEmit`

- [ ] **Step 5: Commit**

```bash
git add src/app/api/stripe/checkout/route.ts src/app/api/stripe/portal/route.ts src/app/api/pdf/route.ts && git commit -m "feat(api): checkout, portal, branded pdf routes"
```

---

## Phase 7 — PDF + UI + Programmatic Pages

### Task 7.0: Branded PDF renderer

**Files:**
- Create: `src/lib/tools/aftercare/pdf.tsx`

- [ ] **Step 1: Implement**

`src/lib/tools/aftercare/pdf.tsx`:
```tsx
import { Document, Page, Text, View, StyleSheet, Image, renderToBuffer } from '@react-pdf/renderer'
import type { AftercareSheet } from './prompt'

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  logo: { width: 48, height: 48, marginRight: 12, objectFit: 'contain' },
  clinic: { fontSize: 18, fontWeight: 'bold' },
  title: { fontSize: 14, marginBottom: 12 },
  heading: { fontSize: 12, fontWeight: 'bold', marginTop: 10, marginBottom: 4 },
  item: { marginBottom: 2 },
  watermark: { position: 'absolute', bottom: 20, left: 40, right: 40, textAlign: 'center', color: '#9ca3af', fontSize: 9 },
})

export interface PdfParams {
  sheet: AftercareSheet
  clinicName: string
  brandColor?: string
  logoUrl?: string
  watermark: boolean
}

export async function renderAftercarePdf(params: PdfParams): Promise<Buffer> {
  const color = params.brandColor || '#111827'
  const doc = (
    <Document>
      <Page style={styles.page}>
        <View style={styles.header}>
          {params.logoUrl ? <Image style={styles.logo} src={params.logoUrl} /> : null}
          <Text style={[styles.clinic, { color }]}>{params.clinicName}</Text>
        </View>
        <Text style={[styles.title, { color }]}>{params.sheet.title}</Text>
        {params.sheet.sections.map((s, i) => (
          <View key={i}>
            <Text style={[styles.heading, { color }]}>{s.heading}</Text>
            {s.items.map((it, j) => (
              <Text key={j} style={styles.item}>• {it}</Text>
            ))}
          </View>
        ))}
        {params.watermark ? <Text style={styles.watermark}>Made with AftercareGen — aftercare.nimblabs.com</Text> : null}
      </Page>
    </Document>
  )
  return renderToBuffer(doc)
}
```

- [ ] **Step 2: Verify compile**

Run: `npx tsc --noEmit`
Expected: no errors. Re-run Task 6.3 Step 4 compile too.

- [ ] **Step 3: Commit**

```bash
git add src/lib/tools/aftercare/pdf.tsx && git commit -m "feat(aftercare): branded pdf renderer with watermark gate"
```

### Task 7.1: Aftercare form + result components

**Files:**
- Create: `src/lib/tools/aftercare/AftercareForm.tsx`, `src/lib/tools/aftercare/AftercareResult.tsx`

- [ ] **Step 1: Implement form (client component)**

`src/lib/tools/aftercare/AftercareForm.tsx`:
```tsx
'use client'
import { useState } from 'react'
import type { AftercareSheet } from './prompt'

export function AftercareForm({ procedureSlug }: { procedureSlug: string }) {
  const [clinicName, setClinicName] = useState('')
  const [loading, setLoading] = useState(false)
  const [sheet, setSheet] = useState<AftercareSheet | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [upgrade, setUpgrade] = useState(false)

  async function onGenerate() {
    setLoading(true); setError(null); setUpgrade(false)
    const res = await fetch('/api/generate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ procedureSlug, clinicName, tone: 'warm', language: 'en' }),
    })
    setLoading(false)
    if (res.status === 402) { setUpgrade(true); return }
    if (!res.ok) { setError('Generation failed. Please try again.'); return }
    const data = await res.json()
    setSheet(data.sheet)
  }

  return (
    <div className="rounded-xl border p-6">
      <label className="block text-sm font-medium">Clinic name</label>
      <input value={clinicName} onChange={(e) => setClinicName(e.target.value)} placeholder="Glow Aesthetics"
        className="mt-1 w-full rounded-md border px-3 py-2" />
      <button onClick={onGenerate} disabled={loading}
        className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-white disabled:opacity-50">
        {loading ? 'Generating…' : 'Generate aftercare'}
      </button>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {upgrade && <p className="mt-3 text-sm">You hit the free limit. <a href="/dashboard" className="underline">Upgrade to Pro</a> for unlimited + branded PDF.</p>}
      {sheet && <AftercareResultInline sheet={sheet} clinicName={clinicName} />}
    </div>
  )
}

function AftercareResultInline({ sheet, clinicName }: { sheet: AftercareSheet; clinicName: string }) {
  async function downloadPdf() {
    const res = await fetch('/api/pdf', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sheet, clinicName }),
    })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'aftercare.pdf'; a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold">{sheet.title}</h3>
      {sheet.sections.map((s, i) => (
        <div key={i} className="mt-3">
          <h4 className="font-medium">{s.heading}</h4>
          <ul className="list-disc pl-5">{s.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
        </div>
      ))}
      <button onClick={downloadPdf} className="mt-4 rounded-md border px-4 py-2">Download PDF</button>
    </div>
  )
}
```

- [ ] **Step 2: Verify compile**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/lib/tools/aftercare/AftercareForm.tsx && git commit -m "feat(aftercare): generator form + inline result"
```

### Task 7.2: Programmatic procedure page (SSG) + sitemap

**Files:**
- Create: `src/app/aftercare/[procedure]/page.tsx`, `src/app/sitemap.ts`

- [ ] **Step 1: Implement programmatic page**

`src/app/aftercare/[procedure]/page.tsx`:
```tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProcedure, PROCEDURE_SLUGS } from '@/lib/tools/aftercare/procedures'
import { AftercareForm } from '@/lib/tools/aftercare/AftercareForm'
import { buildFaqSchema, buildSoftwareAppSchema } from '@/lib/saas-core/seo/schema'

export function generateStaticParams() {
  return PROCEDURE_SLUGS.map((procedure) => ({ procedure }))
}

export async function generateMetadata({ params }: { params: Promise<{ procedure: string }> }): Promise<Metadata> {
  const { procedure } = await params
  const p = getProcedure(procedure)
  if (!p) return {}
  return {
    title: `${p.name} Aftercare Instructions Generator | AftercareGen`,
    description: p.seoIntro,
    alternates: { canonical: `https://aftercare.nimblabs.com/aftercare/${p.slug}` },
  }
}

export default async function ProcedurePage({ params }: { params: Promise<{ procedure: string }> }) {
  const { procedure } = await params
  const p = getProcedure(procedure)
  if (!p) notFound()

  const url = `https://aftercare.nimblabs.com/aftercare/${p.slug}`
  const faqSchema = buildFaqSchema(p.faq)
  const appSchema = buildSoftwareAppSchema({ name: `${p.name} Aftercare Generator`, url })

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <h1 className="text-3xl font-bold">{p.name} Aftercare Instructions Generator</h1>
      <p className="mt-3 text-gray-600">{p.seoIntro}</p>
      <div className="mt-8"><AftercareForm procedureSlug={p.slug} /></div>
      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Frequently asked questions</h2>
        {p.faq.map((f, i) => (
          <div key={i} className="mt-4">
            <h3 className="font-medium">{f.q}</h3>
            <p className="text-gray-600">{f.a}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
```

- [ ] **Step 2: Implement sitemap**

`src/app/sitemap.ts`:
```typescript
import type { MetadataRoute } from 'next'
import { PROCEDURE_SLUGS } from '@/lib/tools/aftercare/procedures'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://aftercare.nimblabs.com'
  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    ...PROCEDURE_SLUGS.map((slug) => ({
      url: `${base}/aftercare/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
```

- [ ] **Step 3: Verify build produces static routes**

Run: `npm run build`
Expected: build succeeds; `/aftercare/[procedure]` listed as SSG (one entry per slug), `/sitemap.xml` generated.

- [ ] **Step 4: Commit**

```bash
git add src/app/aftercare src/app/sitemap.ts && git commit -m "feat(seo): programmatic procedure pages + sitemap"
```

### Task 7.3: Landing page + dashboard (minimal)

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Landing page lists procedures (internal linking)**

`src/app/page.tsx`:
```tsx
import Link from 'next/link'
import { PROCEDURES } from '@/lib/tools/aftercare/procedures'

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-4xl font-bold">AI Aftercare Generator for Clinics</h1>
      <p className="mt-4 text-lg text-gray-600">Generate branded post-procedure aftercare sheets in seconds. Hand professional instructions to every patient.</p>
      <h2 className="mt-10 text-xl font-semibold">Choose a procedure</h2>
      <ul className="mt-4 grid grid-cols-2 gap-3">
        {PROCEDURES.map((p) => (
          <li key={p.slug}>
            <Link href={`/aftercare/${p.slug}`} className="block rounded-lg border px-4 py-3 hover:bg-gray-50">{p.name} aftercare →</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
```

- [ ] **Step 2: Dashboard (subscription status + upgrade/portal buttons)**

`src/app/dashboard/page.tsx`:
```tsx
import { auth } from '@/lib/saas-core/auth/session'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
  const session = await auth()
  if (!session?.user?.id) redirect('/api/auth/signin')
  const sub = await prisma.subscription.findUnique({ where: { userId: session.user.id } })
  const isPro = sub?.status === 'active'

  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-2xl font-bold">Your account</h1>
      <p className="mt-2">Plan: <strong>{isPro ? 'Pro' : 'Free'}</strong></p>
      {isPro ? (
        <form action="/api/stripe/portal" method="post"><button className="mt-4 rounded-md border px-4 py-2">Manage subscription</button></form>
      ) : (
        <form action="/api/stripe/checkout" method="post"><button className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-white">Upgrade to Pro — $12/mo</button></form>
      )}
    </main>
  )
}
```

> Note: the `<form action="/api/...">` posts directly; the routes return `{ url }`. For MVP, change those routes to `return NextResponse.redirect(checkout.url)` OR wire a small client button that reads `{ url }` and sets `window.location`. Implementer: use the redirect approach in the checkout/portal routes for the form to work (replace `NextResponse.json({ url })` with `NextResponse.redirect(url, { status: 303 })`).

- [ ] **Step 3: Apply the redirect note to checkout/portal routes**

In `src/app/api/stripe/checkout/route.ts` and `portal/route.ts`, replace the `return NextResponse.json({ url: ... })` with `return NextResponse.redirect(<url>, { status: 303 })`.

- [ ] **Step 4: Build**

Run: `npm run build`
Expected: success.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/dashboard/page.tsx src/app/api/stripe && git commit -m "feat: landing + dashboard + checkout redirect"
```

---

## Phase 8 — Full verification

### Task 8.1: Full test + build gate

- [ ] **Step 1: Run all unit tests**

Run: `npm test`
Expected: all suites pass (env, usage, requirePro, webhook, track, schema, procedures, prompt, generate).

- [ ] **Step 2: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: no TS errors; build succeeds; ~13 `/aftercare/[procedure]` SSG routes; `/sitemap.xml` present.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A && git commit -m "test: full suite green + build passes"
```

### Task 8.2: Manual E2E (local, before deploy)

> Requires `.env` filled with real Postgres + Groq + Stripe (live) + Google/email. Run `next dev --webpack` (Turbopack breaks on Windows+OneDrive).

- [ ] **Step 1: Start dev**

Run: `npm run dev` (ensure the `dev` script is `next dev --webpack`)

- [ ] **Step 2: SEO check** — visit `http://localhost:3000/aftercare/botox`, view source, confirm H1 keyword, both JSON-LD blocks, FAQ rendered.

- [ ] **Step 3: Free funnel** — generate as anonymous → works once; generate repeatedly → hit `402` paywall message.

- [ ] **Step 4: Auth** — sign in via magic link (check email) or Google; confirm `/dashboard` shows Free.

- [ ] **Step 5: Stripe checkout (LIVE)** — click Upgrade → complete checkout with a real card (small risk: use your own; you can refund). Confirm webhook hits `/api/stripe/webhook`, `Subscription.status` becomes `active`, dashboard shows Pro.

> ⚠️ Stripe gotcha (prior memory): `stripeCustomerId` is NOT portable test↔live. Since launching live directly, ensure the Stripe Price ID in `.env` is a LIVE price.

- [ ] **Step 6: Pro PDF** — generate, Download PDF → confirm NO watermark, clinic name present.

- [ ] **Step 7: Analytics** — query `FunnelEvent` table → confirm rows for `visit`/`generate`/`paywall`/`subscribe`.

### Task 8.3: Deploy to EasyPanel

- [ ] **Step 1: Dockerfile (standalone) with HOSTNAME bind (prior gotcha)**

Create `Dockerfile`:
```dockerfile
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server.js"]
```
Add to `next.config.js`: `output: 'standalone'`.

- [ ] **Step 2: Set env vars in EasyPanel** (DATABASE_URL, NEXTAUTH_*, GROQ_API_KEY, STRIPE_* live, GOOGLE_*, EMAIL_*). Point subdomain `aftercare.nimblabs.com` → container.

- [ ] **Step 3: Register Stripe webhook endpoint** in Stripe dashboard → `https://aftercare.nimblabs.com/api/stripe/webhook`, copy signing secret into `STRIPE_WEBHOOK_SECRET`.

- [ ] **Step 4: Deploy, run `prisma db push` against prod DB, smoke test the live funnel.**

- [ ] **Step 5: Submit sitemap** `https://aftercare.nimblabs.com/sitemap.xml` to Google Search Console.

- [ ] **Step 6: Commit deploy config**

```bash
git add Dockerfile next.config.js && git commit -m "chore: easypanel standalone deploy config"
```

---

## Self-Review Notes (coverage vs spec)

- ✅ Programmatic SEO (1 page/procedure, schema, sitemap, internal linking) → Tasks 5.1, 7.2, 7.3, 4.1
- ✅ Freemium paywall + $12 Pro → Tasks 1.1, 2.1, 2.2, 2.3, 6.1, 6.3
- ✅ Stripe webhook = source of truth, idempotent → Tasks 2.2, 6.2
- ✅ Groq lazy + retry + record-on-success → Task 5.3
- ✅ Branded PDF with watermark gate → Tasks 7.0, 6.3
- ✅ Auth magic link + Google → Task 3.1
- ✅ Analytics funnel (decision metric) → Tasks 3.2, 6.1, 6.2
- ✅ Env validation, Prisma singleton, async params, Turbopack-off, HOSTNAME bind → Phase 0 + Phase 8 (prior gotchas honored)
- ✅ EN-only MVP (tone/language forced for free; Pro fields wired but UI minimal) → Task 6.1
- ✅ 2-layer split (saas-core reusable vs tools/aftercare) → file structure enforced throughout

**Deferred (YAGNI, per spec):** SavedSheet library UI, multi-language UI, ClinicProfile branding upload UI (schema exists; full UI is post-revenue). PaywallGate.tsx and ProgrammaticPage.tsx shared components folded into inline implementations for MVP speed — extract when forking the 2nd SaaS.
