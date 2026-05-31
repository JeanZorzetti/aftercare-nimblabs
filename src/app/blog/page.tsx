import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '@/lib/blog/posts'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Aftercare Blog — Expert Aesthetic Recovery Guides',
  description:
    'Evidence-based aftercare guides for aesthetic procedures: Botox, fillers, microneedling, laser, and more. Written by aesthetic professionals.',
  alternates: {
    canonical: 'https://aftercare.nimblabs.com/blog',
  },
  openGraph: {
    title: 'Aftercare Blog — Expert Aesthetic Recovery Guides',
    description:
      'Evidence-based aftercare guides for aesthetic procedures: Botox, fillers, microneedling, laser, and more.',
    url: 'https://aftercare.nimblabs.com/blog',
    type: 'website',
  },
}

export default function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <div>
      {/* Hero */}
      <div className="bg-[var(--secondary)] border-b border-[var(--border)]">
        <div className="mx-auto max-w-3xl px-6 py-12 animate-rise">
          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">
            Aftercare library
          </span>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl font-semibold text-[var(--foreground)] leading-tight">
            Expert aesthetic aftercare guides
          </h1>
          <p className="mt-4 text-[var(--muted-foreground)] leading-relaxed max-w-xl">
            Evidence-based recovery guides for every major aesthetic procedure — written by experienced practitioners and optimized for patient outcomes.
          </p>
        </div>
      </div>

      {/* Posts grid */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        {posts.length === 0 ? (
          <p className="text-[var(--muted-foreground)]">No articles yet. Check back soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-md">
                  {post.heroImage?.src && (
                    <div className="relative w-full h-44 overflow-hidden">
                      <Image
                        src={post.heroImage.src}
                        alt={post.heroImage.alt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                  )}
                  <CardContent className="pt-5 pb-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-1">
                      {post.category}
                    </p>
                    <h2 className="font-serif text-lg font-semibold text-[var(--foreground)] leading-snug group-hover:text-[var(--primary)] transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)] line-clamp-2 leading-relaxed">
                      {post.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
                      <span>{post.author.name}</span>
                      <span>·</span>
                      <time dateTime={post.publishedAt}>
                        {new Date(post.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                      <span>·</span>
                      <span>{post.readingTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
