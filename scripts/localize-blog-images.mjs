// One-off: download hot-linked Pexels hero images into public/blog/ and rewrite
// the MDX frontmatter to the local path. Hot-linking makes 60 articles' LCP
// depend on a third-party CDN that can change URLs at any time.
// Usage: node scripts/localize-blog-images.mjs
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const BLOG_DIR = 'content/blog'
const OUT_DIR = 'public/blog'
mkdirSync(OUT_DIR, { recursive: true })

const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))
let downloaded = 0
let rewritten = 0

for (const file of files) {
  const path = join(BLOG_DIR, file)
  const content = readFileSync(path, 'utf8')
  const match = content.match(/src:\s*"(https:\/\/images\.pexels\.com\/photos\/(\d+)\/[^"]+)"/)
  if (!match) continue

  const [, url, photoId] = match
  const localFile = `pexels-${photoId}.jpg`
  const localPath = join(OUT_DIR, localFile)

  if (!existsSync(localPath)) {
    const res = await fetch(url)
    if (!res.ok) {
      console.error(`FAILED ${file}: HTTP ${res.status} for ${url}`)
      continue
    }
    writeFileSync(localPath, Buffer.from(await res.arrayBuffer()))
    downloaded++
    console.log(`downloaded ${localFile}`)
  }

  writeFileSync(path, content.replace(match[1], `/blog/${localFile}`))
  rewritten++
}

console.log(`Done: ${downloaded} images downloaded, ${rewritten} articles rewritten.`)
