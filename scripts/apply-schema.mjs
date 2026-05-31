// One-off: create the schema in the production DB (the Prisma 7 CLI `db push`
// is broken under npx+Windows, so we apply the DDL directly via pg).
// Usage: node scripts/apply-schema.mjs "<DATABASE_URL>"
import { Client } from 'pg'

const url = process.argv[2] || process.env.VERIFY_DATABASE_URL
if (!url) { console.error('Pass DATABASE_URL as arg 1'); process.exit(1) }

const DDL = `
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT,
  "image" TEXT,
  "emailVerified" TIMESTAMP(3),
  "authMethod" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Account" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  CONSTRAINT "Account_provider_providerAccountId_key" UNIQUE ("provider","providerAccountId"),
  CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Session" (
  "id" TEXT PRIMARY KEY,
  "sessionToken" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "expires" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VerificationToken_identifier_token_key" UNIQUE ("identifier","token")
);

CREATE TABLE IF NOT EXISTS "Subscription" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE,
  "stripeCustomerId" TEXT UNIQUE,
  "stripeSubscriptionId" TEXT UNIQUE,
  "status" TEXT NOT NULL DEFAULT 'free',
  "plan" TEXT NOT NULL DEFAULT 'free',
  "currentPeriodEnd" TIMESTAMP(3),
  CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "ClinicProfile" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE,
  "clinicName" TEXT NOT NULL,
  "logoUrl" TEXT,
  "brandColor" TEXT NOT NULL DEFAULT '#111827',
  "defaultLanguage" TEXT NOT NULL DEFAULT 'en',
  "defaultTone" TEXT NOT NULL DEFAULT 'warm',
  CONSTRAINT "ClinicProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Generation" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "procedureSlug" TEXT NOT NULL,
  "tone" TEXT NOT NULL,
  "language" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Generation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "Generation_userId_createdAt_idx" ON "Generation"("userId","createdAt");

CREATE TABLE IF NOT EXISTS "SavedSheet" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "procedureSlug" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SavedSheet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "ProcessedWebhook" (
  "id" TEXT PRIMARY KEY,
  "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "FunnelEvent" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "userId" TEXT,
  "meta" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "FunnelEvent_name_createdAt_idx" ON "FunnelEvent"("name","createdAt");
`

const client = new Client({ connectionString: url })
const run = async () => {
  await client.connect()
  await client.query('BEGIN')
  await client.query(DDL)
  await client.query('COMMIT')
  const { rows } = await client.query(
    `SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY 1`
  )
  console.log('Tables now present:')
  console.log(rows.map((r) => '  - ' + r.tablename).join('\n'))
  await client.end()
}
run().catch(async (e) => {
  try { await client.query('ROLLBACK') } catch {}
  console.error('FAILED:', e.message)
  process.exit(1)
})
