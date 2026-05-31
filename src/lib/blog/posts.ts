import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type { Article, ArticleFrontmatter } from './types'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog')

function getPostFiles(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'))
}

export function getAllPostSlugs(): string[] {
  return getPostFiles().map((f) => f.replace(/\.mdx$/, ''))
}

export function getPostBySlug(slug: string): Article | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const fm = data as ArticleFrontmatter
  const rt = readingTime(content)

  return {
    ...fm,
    slug,
    content,
    readingTime: `${Math.ceil(rt.minutes)} min read`,
  }
}

export function getAllPosts(): Article[] {
  return getAllPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is Article => p !== null)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getRelatedPosts(currentSlug: string, relatedProcedures: string[] = []): Article[] {
  return getAllPosts()
    .filter((p) => p.slug !== currentSlug)
    .filter((p) => p.relatedProcedures?.some((rp) => relatedProcedures.includes(rp)))
    .slice(0, 3)
}
