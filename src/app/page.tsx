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
