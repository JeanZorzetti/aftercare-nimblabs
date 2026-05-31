import { type NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Email from 'next-auth/providers/nodemailer'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

// Build providers conditionally. NextAuth instantiates each provider eagerly —
// the Nodemailer provider throws "requires a `server` configuration" if EMAIL_SERVER
// is absent, which crashes `next build` (no env vars at build time, only runtime).
// Google likewise needs its credentials. Registering only what's configured lets the
// production build succeed and still wires both providers when the env is present.
const providers: NextAuthConfig['providers'] = []
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }))
}
if (process.env.EMAIL_SERVER) {
  providers.push(Email({ server: process.env.EMAIL_SERVER, from: process.env.EMAIL_FROM }))
}

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  providers,
  trustHost: true,
  callbacks: {
    async session({ session, user }) {
      if (session.user) session.user.id = user.id
      return session
    },
  },
}
