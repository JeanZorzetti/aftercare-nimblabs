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

let _cached: Env | null = null
export const env: Env = new Proxy({} as Env, {
  get(_t, prop: string) {
    if (!_cached) _cached = parseEnv(process.env)
    return _cached[prop as keyof Env]
  },
})
