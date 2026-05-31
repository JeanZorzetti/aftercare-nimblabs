import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { evaluate } from 'next-mdx-remote-client/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { getAllPostSlugs, getPostBySlug, getRelatedPosts } from '@/lib/blog/posts'
import { ArticleLayout } from '@/components/blog/article-layout'
import { getMDXComponents } from '@/components/blog/mdx-components'

const BASE_URL = 'https://aftercare.nimblabs.com'

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const imageUrl = post.heroImage.src.startsWith('http')
    ? post.heroImage.src
    : `${BASE_URL}${post.heroImage.src}`

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords.join(', '),
    alternates: {
      canonical: `${BASE_URL}/blog/${post.slug}`,
    },
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${BASE_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author.name],
      images: [{ url: imageUrl, alt: post.heroImage.alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [imageUrl],
    },
  }
}

function extractToc(content: string) {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const toc: { id: string; text: string; level: number }[] = []
  let match
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
    toc.push({ id, text, level })
  }
  return toc
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const relatedPosts = getRelatedPosts(post.slug, post.relatedProcedures)
  const toc = extractToc(post.content)

  const { content } = await evaluate({
    source: post.content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
      },
    },
    components: getMDXComponents(),
  })

  return (
    <ArticleLayout post={post} toc={toc} relatedPosts={relatedPosts}>
      {content}
    </ArticleLayout>
  )
}
