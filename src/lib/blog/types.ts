export interface ArticleAuthor {
  name: string
  role: string
  credentials: string
  url?: string
  image?: string
}

export interface ArticleHeroImage {
  src: string
  alt: string
  width?: number
  height?: number
}

export interface ArticleFrontmatter {
  slug: string
  title: string
  description: string
  keywords: string[]
  publishedAt: string
  updatedAt?: string
  author: ArticleAuthor
  heroImage: ArticleHeroImage
  faq: { q: string; a: string }[]
  relatedProcedures?: string[]
  category: string
  readingTime?: string
}

export interface Article extends ArticleFrontmatter {
  content: string
  readingTime: string
}
