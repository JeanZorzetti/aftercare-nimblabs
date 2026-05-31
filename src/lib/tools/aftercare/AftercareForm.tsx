'use client'
import { useState } from 'react'
import type { AftercareSheet } from './prompt'

export function AftercareForm({ procedureSlug }: { procedureSlug: string }) {
  const [clinicName, setClinicName] = useState('')
  const [loading, setLoading] = useState(false)
  const [sheet, setSheet] = useState<AftercareSheet | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [upgrade, setUpgrade] = useState(false)

  async function onGenerate() {
    setLoading(true); setError(null); setUpgrade(false)
    const res = await fetch('/api/generate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ procedureSlug, clinicName, tone: 'warm', language: 'en' }),
    })
    setLoading(false)
    if (res.status === 401) { window.location.href = '/api/auth/signin?callbackUrl=/dashboard'; return }
    if (res.status === 402) { setUpgrade(true); return }
    if (!res.ok) { setError('Generation failed. Please try again.'); return }
    const data = await res.json()
    setSheet(data.sheet)
  }

  return (
    <div className="rounded-xl border p-6">
      <label className="block text-sm font-medium">Clinic name</label>
      <input value={clinicName} onChange={(e) => setClinicName(e.target.value)} placeholder="Glow Aesthetics"
        className="mt-1 w-full rounded-md border px-3 py-2" />
      <button onClick={onGenerate} disabled={loading}
        className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-white disabled:opacity-50">
        {loading ? 'Generating…' : 'Generate aftercare'}
      </button>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      {upgrade && <p className="mt-3 text-sm">You hit the free limit. <a href="/dashboard" className="underline">Upgrade to Pro</a> for unlimited + branded PDF.</p>}
      {sheet && <AftercareResultInline sheet={sheet} clinicName={clinicName} />}
    </div>
  )
}

function AftercareResultInline({ sheet, clinicName }: { sheet: AftercareSheet; clinicName: string }) {
  async function downloadPdf() {
    const res = await fetch('/api/pdf', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sheet, clinicName }),
    })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'aftercare.pdf'; a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold">{sheet.title}</h3>
      {sheet.sections.map((s, i) => (
        <div key={i} className="mt-3">
          <h4 className="font-medium">{s.heading}</h4>
          <ul className="list-disc pl-5">{s.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
        </div>
      ))}
      <button onClick={downloadPdf} className="mt-4 rounded-md border px-4 py-2">Download PDF</button>
    </div>
  )
}
