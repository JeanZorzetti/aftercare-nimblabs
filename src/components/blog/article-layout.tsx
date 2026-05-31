import Image from 'next/image'
import Link from 'next/link'
import type { Article } from '@/lib/blog/types'
import { AuthorBio } from './author-bio'
import { FaqAccordion } from './faq-accordion'
import { TableOfContents } from './table-of-contents'
import { RelatedArticles } from './related-articles'
import { buildArticleSchema, buildBreadcrumbSchema, buildFaqSchema } from '@/lib/saas-core/seo/schema'
import type { Article as RelatedArticle } from '@/lib/blog/types'

interface TocItem {
  id: string
  text: string
  level: number
}

interface ArticleLayoutProps {
  post: Article
  children: React.ReactNode
  toc: TocItem[]
  relatedPosts: RelatedArticle[]
}

const BASE_URL = 'https://aftercare.nimblabs.com'

export function ArticleLayout({ post, children, toc, relatedPosts }: ArticleLayoutProps) {
  const postUrl = `${BASE_URL}/blog/${post.slug}`
  const imageUrl = post.heroImage.src.startsWith('http')
    ? post.heroImage.src
    : `${BASE_URL}${post.heroImage.src}`

  const articleSchema = buildArticleSchema({
    title: post.title,
    description: post.description,
    url: postUrl,
    image: imageUrl,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: post.author,
  })

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', url: BASE_URL },
    { name: 'Blog', url: `${BASE_URL}/blog` },
    { name: post.title, url: postUrl },
  ])

  const faqSchema = buildFaqSchema(post.faq)

  const publishedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <div className="bg-[var(--secondary)] border-b border-[var(--border)]">
        <div className="mx-auto max-w-3xl px-6 py-12 animate-rise">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4 flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
            <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[var(--foreground)] transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-[var(--foreground)]">{post.category}</span>
          </nav>

          <span className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)]">
            {post.category}
          </span>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl font-semibold text-[var(--foreground)] leading-tight">
            {post.title}
          </h1>
          <p className="mt-4 text-[var(--muted-foreground)] leading-relaxed max-w-xl">
            {post.description}
          </p>

          {/* Meta */}
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[var(--muted-foreground)]">
            <span>By <strong className="text-[var(--foreground)]">{post.author.name}</strong></span>
            <span>·</span>
            <time dateTime={post.publishedAt}>{publishedDate}</time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
        </div>
      </div>

      {/* Hero image */}
      {post.heroImage.src && (
        <div className="mx-auto max-w-3xl px-6 -mt-0 pt-8">
          <Image
            src={post.heroImage.src}
            alt={post.heroImage.alt}
            width={post.heroImage.width ?? 800}
            height={post.heroImage.height ?? 450}
            className="rounded-xl w-full object-cover shadow-sm"
            priority
          />
        </div>
      )}

      {/* Content area */}
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex gap-12">
          {/* Main content */}
          <article className="min-w-0 flex-1">
            {children}

            {/* FAQ */}
            {post.faq.length > 0 && (
              <div className="mt-12">
                <h2 className="font-serif text-2xl font-semibold text-[var(--foreground)] mb-6">
                  Frequently asked questions
                </h2>
                <FaqAccordion items={post.faq} />
              </div>
            )}

            <AuthorBio author={post.author} />
          </article>

          {/* Sticky TOC (desktop) */}
          {toc.length > 0 && (
            <aside className="hidden xl:block w-56 shrink-0">
              <div className="sticky top-24">
                <TableOfContents items={toc} />
              </div>
            </aside>
          )}
        </div>

        <RelatedArticles posts={relatedPosts} relatedProcedures={post.relatedProcedures} />
      </div>
    </>
  )
}
