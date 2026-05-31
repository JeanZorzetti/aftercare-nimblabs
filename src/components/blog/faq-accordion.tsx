'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FaqItem {
  q: string
  a: string
}

interface FaqAccordionProps {
  items: FaqItem[]
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="border border-[var(--border)] rounded-lg overflow-hidden"
        >
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="w-full flex items-center justify-between px-5 py-4 text-left bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 transition-colors"
          >
            <span className="font-medium text-[var(--foreground)] pr-4">{item.q}</span>
            <ChevronDown
              size={18}
              className={`shrink-0 text-[var(--muted-foreground)] transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
            />
          </button>
          {open === i && (
            <div className="px-5 py-4 text-sm text-[var(--muted-foreground)] leading-relaxed border-t border-[var(--border)]">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
