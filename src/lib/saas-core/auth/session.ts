import NextAuth from 'next-auth'
import { authConfig } from './config'
export const { auth } = NextAuth(authConfig)

export async function getUserId(): Promise<string | null> {
  const session = await auth()
  return session?.user?.id ?? null
}
