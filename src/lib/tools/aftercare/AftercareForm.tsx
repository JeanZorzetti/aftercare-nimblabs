'use client'
import { useEffect, useRef, useState } from 'react'
import { Loader2, Download, Copy, CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import type { AftercareSheet } from './prompt'

const PENDING_KEY = 'aftercare:pending-generation'

export function AftercareForm({ procedureSlug }: { procedureSlug: string }) {
  const [clinicName, setClinicName] = useState('')
  const [loading, setLoading] = useState(false)
  const [sheet, setSheet] = useState<AftercareSheet | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [upgrade, setUpgrade] = useState(false)
  const [copied, setCopied] = useState(false)
  const resumed = useRef(false)

  async function onGenerate(name = clinicName) {
    setLoading(true)
    setError(null)
    setUpgrade(false)
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ procedureSlug, clinicName: name, tone: 'warm', language: 'en' }),
    })
    setLoading(false)
    if (res.status === 401) {
      // Park the form state so we can resume the exact generation after sign-in,
      // and send the user back HERE — not to the dashboard.
      sessionStorage.setItem(PENDING_KEY, JSON.stringify({ procedureSlug, clinicName: name }))
      window.location.href = `/signin?callbackUrl=${encodeURIComponent(`/aftercare/${procedureSlug}`)}`
      return
    }
    if (res.status === 402) {
      setUpgrade(true)
      return
    }
    if (!res.ok) {
      setError('Generation failed. Please try again.')
      return
    }
    const data = await res.json()
    setSheet(data.sheet)
  }

  // Resume a generation interrupted by the sign-in redirect.
  useEffect(() => {
    if (resumed.current) return
    resumed.current = true
    const raw = sessionStorage.getItem(PENDING_KEY)
    if (!raw) return
    try {
      const pending = JSON.parse(raw) as { procedureSlug: string; clinicName: string }
      if (pending.procedureSlug !== procedureSlug) return
      sessionStorage.removeItem(PENDING_KEY)
      // One-time resume after the sign-in redirect — not a render-driven update.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setClinicName(pending.clinicName)
      onGenerate(pending.clinicName)
    } catch {
      sessionStorage.removeItem(PENDING_KEY)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [procedureSlug])

  async function copyText() {
    if (!sheet) return
    const text = sheet.sections.map(s => `${s.heading}\n${s.items.map(i => `• ${i}`).join('\n')}`).join('\n\n')
    await navigator.clipboard.writeText(`${sheet.title}\n\n${text}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function downloadPdf() {
    const res = await fetch('/api/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sheet, clinicName }),
    })
    if (!res.ok) {
      setError('PDF download failed. Please try again.')
      return
    }
    const filename = res.headers.get('Content-Disposition')?.match(/filename="([^"]+)"/)?.[1] ?? 'aftercare.pdf'
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-8 pb-8">
        <h2 className="font-serif text-xl font-semibold text-[var(--foreground)] mb-1">
          Generate aftercare sheet
        </h2>
        <p className="text-sm text-[var(--muted-foreground)] mb-6">
          Enter your clinic name and we&apos;ll create a personalised sheet in seconds.
        </p>

        {/* Form */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1.5">
              Clinic name
            </label>
            <Input
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              placeholder="Glow Aesthetics"
              onKeyDown={(e) => e.key === 'Enter' && !loading && onGenerate()}
            />
          </div>
          <Button
            onClick={() => onGenerate()}
            disabled={loading}
            size="lg"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating…
              </>
            ) : (
              'Generate aftercare sheet'
            )}
          </Button>
        </div>

        {/* Errors */}
        {error && (
          <div className="mt-4 flex items-start gap-2 text-sm text-[var(--destructive)] bg-red-50 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Paywall / upgrade */}
        {upgrade && (
          <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--secondary)] px-5 py-4">
            <p className="text-sm font-medium text-[var(--foreground)]">Free limit reached</p>
            <p className="text-sm text-[var(--muted-foreground)] mt-0.5">
              You&apos;ve used your 3 free sheets for today.
            </p>
            <Link
              href="/dashboard"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--primary)] hover:underline"
            >
              Upgrade to Pro — $12/mo <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Result */}
        {sheet && (
          <div className="mt-8 animate-rise">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-semibold text-[var(--foreground)]">{sheet.title}</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyText}>
                  {copied ? (
                    <><CheckCircle className="w-3.5 h-3.5 mr-1.5 text-[var(--success)]" /> Copied</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copy</>
                  )}
                </Button>
                <Button variant="default" size="sm" onClick={downloadPdf}>
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Download PDF
                </Button>
              </div>
            </div>

            <div className="space-y-5">
              {sheet.sections.map((s, i) => (
                <div key={i}>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-2">
                    {s.heading}
                  </h4>
                  <ul className="space-y-1.5">
                    {s.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--accent)] shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="mt-6 text-xs text-[var(--muted-foreground)]">
              Pro users get branded PDFs with your logo and clinic colours.{' '}
              <Link href="/dashboard" className="text-[var(--primary)] hover:underline">Upgrade →</Link>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
