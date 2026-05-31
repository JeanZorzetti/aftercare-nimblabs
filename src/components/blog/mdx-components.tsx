import Image from 'next/image'
import type { MDXComponents } from 'mdx/types'

interface MDXImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  caption?: string
}

function MDXImage({ src, alt, width = 800, height = 450, caption }: MDXImageProps) {
  return (
    <figure className="my-8">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="rounded-xl w-full object-cover"
      />
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-[var(--muted-foreground)]">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

function Callout({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warning' | 'tip' }) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    tip: 'bg-green-50 border-green-200 text-green-900',
  }
  const labels = { info: 'Note', warning: 'Warning', tip: 'Tip' }
  return (
    <div className={`my-6 rounded-lg border-l-4 p-4 ${styles[type]}`}>
      <p className="text-xs font-bold uppercase tracking-wider mb-1">{labels[type]}</p>
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  )
}

export function getMDXComponents(): MDXComponents {
  return {
    h2: ({ children, id }) => (
      <h2 id={id} className="mt-10 mb-4 font-serif text-2xl font-semibold text-[var(--foreground)] scroll-mt-24">
        {children}
      </h2>
    ),
    h3: ({ children, id }) => (
      <h3 id={id} className="mt-7 mb-3 font-serif text-xl font-semibold text-[var(--foreground)] scroll-mt-24">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mb-4 text-[var(--foreground)] leading-7">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="mb-4 ml-6 list-disc space-y-1.5 text-[var(--foreground)] leading-7">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-1.5 text-[var(--foreground)] leading-7">{children}</ol>
    ),
    li: ({ children }) => <li className="leading-7">{children}</li>,
    strong: ({ children }) => (
      <strong className="font-semibold text-[var(--foreground)]">{children}</strong>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-[var(--primary)] pl-5 italic text-[var(--muted-foreground)]">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-8 border-[var(--border)]" />,
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-[var(--primary)] underline underline-offset-2 hover:opacity-80 transition-opacity"
        {...(href?.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {children}
      </a>
    ),
    MDXImage,
    Callout,
  }
}
