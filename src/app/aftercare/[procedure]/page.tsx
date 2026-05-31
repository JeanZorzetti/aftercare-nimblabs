import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProcedure, PROCEDURE_SLUGS } from '@/lib/tools/aftercare/procedures'
import { AftercareForm } from '@/lib/tools/aftercare/AftercareForm'
import { buildFaqSchema, buildSoftwareAppSchema } from '@/lib/saas-core/seo/schema'
import { Card, CardContent } from '@/components/ui/card'

export function generateStaticParams() {
  return PROCEDURE_SLUGS.map((procedure) => ({ procedure }))
}

export async function generateMetadata({ params }: { params: Promise<{ procedure: string }> }): Promise<Metadata> {
  const { procedure } = await params
  const p = getProcedure(procedure)
  if (!p) return {}
  return {
    title: `${p.name} Aftercare Instructions Generator`,
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
    <div>
      {/* JSON-LD — SEO critical, must stay */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero strip */}
      <div className="bg-[var(--secondary)] border-b border-[var(--border)]">
        <div className="mx-auto max-w-3xl px-6 py-12 animate-rise">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">
            Aftercare generator
          </span>
          {/* H1 with SEO keyword — preserved exactly */}
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl font-semibold text-[var(--foreground)] leading-tight">
            {p.name} Aftercare Instructions Generator
          </h1>
          <p className="mt-4 text-[var(--muted-foreground)] leading-relaxed max-w-xl">
            {p.seoIntro}
          </p>
        </div>
      </div>

      {/* Generator card — above the fold */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        <AftercareForm procedureSlug={p.slug} />
      </div>

      {/* FAQ */}
      <div className="bg-[var(--secondary)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <h2 className="font-serif text-2xl font-semibold text-[var(--foreground)] mb-8">
            Frequently asked questions
          </h2>
          <div className="space-y-4">
            {p.faq.map((f, i) => (
              <Card key={i}>
                <CardContent className="pt-5 pb-5">
                  <h3 className="font-medium text-[var(--foreground)]">{f.q}</h3>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">{f.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
