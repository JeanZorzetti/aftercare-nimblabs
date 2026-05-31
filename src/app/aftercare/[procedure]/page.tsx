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
