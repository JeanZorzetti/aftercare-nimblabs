// Read-only funnel verification against the production DB.
// Usage: node scripts/verify-funnel.mjs "<DATABASE_URL>"
// Never commit a real URL — pass it as an argument.
import { Client } from 'pg'

const url = process.argv[2] || process.env.VERIFY_DATABASE_URL
if (!url) {
  console.error('Pass the DATABASE_URL as the first argument.')
  process.exit(1)
}

const client = new Client({ connectionString: url })

async function q(label, sql) {
  try {
    const { rows } = await client.query(sql)
    console.log(`\n=== ${label} ===`)
    console.table(rows)
  } catch (e) {
    console.log(`\n=== ${label} === ERROR: ${e.message}`)
  }
}

const run = async () => {
  await client.connect()

  await q('Users (latest 5)', `
    SELECT id, email, "authMethod", "createdAt"
    FROM "User" ORDER BY "createdAt" DESC LIMIT 5`)

  await q('Subscriptions', `
    SELECT "userId", status, plan, "stripeCustomerId" IS NOT NULL AS has_customer,
           "stripeSubscriptionId" IS NOT NULL AS has_sub
    FROM "Subscription" ORDER BY 1 LIMIT 10`)

  await q('Generations today (count per user)', `
    SELECT COALESCE("userId",'(anon)') AS userid, "procedureSlug", count(*) AS n
    FROM "Generation"
    WHERE "createdAt" >= date_trunc('day', now())
    GROUP BY 1, 2 ORDER BY n DESC LIMIT 20`)

  await q('Funnel events (counts by name)', `
    SELECT name, count(*) AS n, max("createdAt") AS last_seen
    FROM "FunnelEvent" GROUP BY name ORDER BY n DESC`)

  await q('Processed webhooks (latest 5)', `
    SELECT id, "processedAt" FROM "ProcessedWebhook"
    ORDER BY "processedAt" DESC LIMIT 5`)

  await client.end()
}

run().catch((e) => { console.error(e); process.exit(1) })
