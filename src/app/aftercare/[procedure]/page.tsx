import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Check, X, AlertTriangle, ArrowRight } from 'lucide-react'
import { getProcedure, PROCEDURE_SLUGS } from '@/lib/tools/aftercare/procedures'
import { getProcedureContent } from '@/lib/tools/aftercare/procedure-content'
import { getAllPosts } from '@/lib/blog/posts'
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

  const content = getProcedureContent(p.slug)
  const url = `https://aftercare.nimblabs.com/aftercare/${p.slug}`
  const allFaq = [...p.faq, ...(content?.extraFaq ?? [])]
  const faqSchema = buildFaqSchema(allFaq)
  const appSchema = buildSoftwareAppSchema({ name: `${p.name} Aftercare Generator`, url })

  const relatedProcedures = (content?.related ?? [])
    .map((slug) => getProcedure(slug))
    .filter((rp): rp is NonNullable<typeof rp> => Boolean(rp))

  const relatedPosts = getAllPosts()
    .filter((post) => post.relatedProcedures?.includes(p.slug))
    .slice(0, 4)

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

      {content && (
        <>
          {/* Why aftercare matters */}
          <div className="border-t border-[var(--border)]">
            <div className="mx-auto max-w-3xl px-6 py-14">
              <h2 className="font-serif text-2xl font-semibold text-[var(--foreground)] mb-6">
                Why {p.name} aftercare matters
              </h2>
              <div className="space-y-4">
                {content.overview.map((paragraph, i) => (
                  <p key={i} className="text-[var(--muted-foreground)] leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Recovery timeline */}
          <div className="bg-[var(--secondary)] border-t border-[var(--border)]">
            <div className="mx-auto max-w-3xl px-6 py-14">
              <h2 className="font-serif text-2xl font-semibold text-[var(--foreground)] mb-8">
                {p.name} recovery timeline
              </h2>
              <ol className="relative space-y-8 border-l border-[var(--border)] pl-6">
                {content.timeline.map((phase, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <h3 className="font-medium text-[var(--foreground)]">{phase.phase}</h3>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">
                        {phase.window}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm text-[var(--muted-foreground)] leading-relaxed">
                      {phase.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Do's and don'ts */}
          <div className="border-t border-[var(--border)]">
            <div className="mx-auto max-w-3xl px-6 py-14">
              <h2 className="font-serif text-2xl font-semibold text-[var(--foreground)] mb-8">
                {p.name} aftercare do&apos;s and don&apos;ts
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <Card>
                  <CardContent className="pt-5 pb-5">
                    <h3 className="font-medium text-[var(--foreground)] mb-4">Do</h3>
                    <ul className="space-y-3">
                      {content.dos.map((item, i) => (
                        <li key={i} className="flex gap-2.5 text-sm text-[var(--muted-foreground)] leading-relaxed">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5 pb-5">
                    <h3 className="font-medium text-[var(--foreground)] mb-4">Don&apos;t</h3>
                    <ul className="space-y-3">
                      {content.donts.map((item, i) => (
                        <li key={i} className="flex gap-2.5 text-sm text-[var(--muted-foreground)] leading-relaxed">
                          <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Red flags */}
          <div className="bg-[var(--secondary)] border-t border-[var(--border)]">
            <div className="mx-auto max-w-3xl px-6 py-14">
              <h2 className="font-serif text-2xl font-semibold text-[var(--foreground)] mb-3">
                When patients should contact the clinic
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] mb-6 max-w-xl leading-relaxed">
                Every {p.name} aftercare sheet should list the warning signs that need a professional review.
                Make sure patients know these before they leave:
              </p>
              <ul className="space-y-3">
                {content.redFlags.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-[var(--muted-foreground)] leading-relaxed">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Notes for clinics */}
          <div className="border-t border-[var(--border)]">
            <div className="mx-auto max-w-3xl px-6 py-14">
              <h2 className="font-serif text-2xl font-semibold text-[var(--foreground)] mb-6">
                Notes for clinics and practitioners
              </h2>
              <div className="space-y-4">
                {content.clinicNotes.map((note, i) => (
                  <Card key={i}>
                    <CardContent className="pt-5 pb-5">
                      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{note}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* FAQ */}
      <div className="bg-[var(--secondary)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <h2 className="font-serif text-2xl font-semibold text-[var(--foreground)] mb-8">
            {p.name} aftercare — frequently asked questions
          </h2>
          <div className="space-y-4">
            {allFaq.map((f, i) => (
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

      {/* Further reading — internal links to blog */}
      {relatedPosts.length > 0 && (
        <div className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-14">
            <h2 className="font-serif text-2xl font-semibold text-[var(--foreground)] mb-6">
              Further reading on {p.name} aftercare
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group no-underline">
                  <Card className="h-full transition-colors group-hover:border-[var(--primary)]/40">
                    <CardContent className="pt-5 pb-5">
                      <h3 className="font-medium text-[var(--foreground)] leading-snug group-hover:text-[var(--primary)] transition-colors">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed line-clamp-2">
                        {post.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Related generators — cross-links between procedure pages */}
      {relatedProcedures.length > 0 && (
        <div className="bg-[var(--secondary)] border-t border-[var(--border)]">
          <div className="mx-auto max-w-3xl px-6 py-14">
            <h2 className="font-serif text-2xl font-semibold text-[var(--foreground)] mb-6">
              Other aftercare generators
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedProcedures.map((rp) => (
                <Link key={rp.slug} href={`/aftercare/${rp.slug}`} className="group no-underline">
                  <Card className="h-full transition-colors group-hover:border-[var(--primary)]/40">
                    <CardContent className="pt-5 pb-5">
                      <h3 className="font-medium text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                        {rp.name}
                      </h3>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                        Aftercare generator <ArrowRight className="h-3 w-3" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
