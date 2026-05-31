import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import type { Article } from '@/lib/blog/types'

interface RelatedArticlesProps {
  posts: Article[]
  relatedProcedures?: string[]
}

export function RelatedArticles({ posts, relatedProcedures = [] }: RelatedArticlesProps) {
  const cta = relatedProcedures[0]

  return (
    <div className="mt-12 space-y-6">
      {cta && (
        <div className="rounded-xl bg-[var(--primary)]/5 border border-[var(--primary)]/20 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-2">
            Try the free generator
          </p>
          <p className="text-[var(--foreground)] font-medium mb-3">
            Generate professional aftercare instructions for your patients in seconds.
          </p>
          <Link
            href={`/aftercare/${cta}`}
            className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] text-white text-sm font-medium px-4 py-2 hover:opacity-90 transition-opacity"
          >
            Open {cta.replace(/-/g, ' ')} generator →
          </Link>
        </div>
      )}

      {posts.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--muted-foreground)] mb-4">
            Related articles
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full transition-shadow group-hover:shadow-md">
                  <CardContent className="pt-5 pb-5">
                    <p className="text-xs text-[var(--muted-foreground)] mb-1">{post.category}</p>
                    <p className="font-medium text-[var(--foreground)] leading-snug group-hover:text-[var(--primary)] transition-colors">
                      {post.title}
                    </p>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">{post.readingTime}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
