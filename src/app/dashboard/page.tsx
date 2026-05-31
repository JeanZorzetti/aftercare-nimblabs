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
