'use client'

import { useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  items: TocItem[]
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const headings = items.map(({ id }) => document.getElementById(id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '0px 0px -60% 0px' }
    )
    headings.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav aria-label="Table of contents" className="not-prose">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
        On this page
      </p>
      <ol className="space-y-1.5">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 12}px` }}>
            <a
              href={`#${item.id}`}
              className={`text-sm transition-colors hover:text-[var(--foreground)] ${
                active === item.id
                  ? 'text-[var(--primary)] font-medium'
                  : 'text-[var(--muted-foreground)]'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
