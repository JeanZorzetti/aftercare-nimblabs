import Link from 'next/link'
import { PROCEDURES } from '@/lib/tools/aftercare/procedures'

export function SiteFooter() {
  const featured = PROCEDURES.slice(0, 6)

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--secondary)]">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <p className="font-serif text-lg font-semibold text-[var(--foreground)]">AftercareGen</p>
            <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">
              Professional aftercare sheets for aesthetic clinics. Generated in seconds, branded for your practice.
            </p>
          </div>

          {/* Procedures */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">Procedures</p>
            <ul className="space-y-1.5">
              {featured.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/aftercare/${p.slug}`}
                    className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                  >
                    {p.name} aftercare
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">Resources</p>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                >
                  Aftercare blog
                </Link>
              </li>
              <li>
                <span className="text-sm text-[var(--muted-foreground)]">
                  For professional use only.
                </span>
              </li>
              <li>
                <span className="text-sm text-[var(--muted-foreground)]">
                  Not a substitute for medical advice.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} AftercareGen · aftercare.nimblabs.com
          </p>
          <p className="text-xs text-[var(--muted-foreground)]">
            Built for aesthetic professionals
          </p>
        </div>
      </div>
    </footer>
  )
}
