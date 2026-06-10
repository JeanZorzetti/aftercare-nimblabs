import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { getProcedure } from '@/lib/tools/aftercare/procedures'

function ctaTarget(relatedProcedures: string[]): { href: string; procedureName: string | null } {
  const slug = relatedProcedures.find((s) => getProcedure(s))
  if (slug) return { href: `/aftercare/${slug}`, procedureName: getProcedure(slug)!.name }
  return { href: '/aftercare/botox', procedureName: null }
}

/** Slim inline banner — sits right after the article intro. */
export function ProductCTAInline({ relatedProcedures }: { relatedProcedures: string[] }) {
  const { href, procedureName } = ctaTarget(relatedProcedures)
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 px-5 py-3.5 no-underline hover:bg-[var(--primary)]/10 transition-colors"
    >
      <span className="flex items-center gap-2.5 text-sm text-[var(--foreground)]">
        <Sparkles className="w-4 h-4 text-[var(--primary)] shrink-0" />
        <span>
          <strong className="font-medium">
            {procedureName ? `Generate a branded ${procedureName} aftercare sheet` : 'Generate a branded aftercare sheet'}
          </strong>{' '}
          for your clinic — free, in seconds.
        </span>
      </span>
      <ArrowRight className="w-4 h-4 text-[var(--primary)] shrink-0 group-hover:translate-x-0.5 transition-transform" />
    </Link>
  )
}

/** Rich end-of-article card — the conversion moment for BOFU readers. */
export function ProductCTACard({ relatedProcedures }: { relatedProcedures: string[] }) {
  const { href, procedureName } = ctaTarget(relatedProcedures)
  return (
    <div className="rounded-2xl bg-[var(--primary)] px-6 py-8 sm:px-10 sm:py-10 text-center">
      <span className="inline-block mb-3 text-xs font-semibold uppercase tracking-widest text-white/80">
        AftercareGen
      </span>
      <p className="font-serif text-2xl sm:text-3xl font-semibold text-white leading-snug">
        Stop photocopying aftercare sheets
      </p>
      <p className="mt-3 text-sm sm:text-base text-white/85 max-w-md mx-auto leading-relaxed">
        Generate {procedureName ? `${procedureName} aftercare instructions` : 'aftercare instructions'} branded with
        your clinic name in under 60 seconds. 3 free sheets per day — no credit card.
      </p>
      <Link
        href={href}
        className="mt-6 inline-flex items-center justify-center gap-2 h-11 px-8 rounded-xl bg-white text-[var(--primary)] text-sm font-medium hover:opacity-90 active:scale-[0.98] transition-all no-underline"
      >
        Generate your first sheet free <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
