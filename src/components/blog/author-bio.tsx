import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import type { ArticleAuthor } from '@/lib/blog/types'

interface AuthorBioProps {
  author: ArticleAuthor
}

export function AuthorBio({ author }: AuthorBioProps) {
  return (
    <Card className="mt-10">
      <CardContent className="pt-6 pb-6">
        <div className="flex items-start gap-4">
          {author.image && (
            <Image
              src={author.image}
              alt={`Photo of ${author.name}`}
              width={56}
              height={56}
              className="rounded-full object-cover shrink-0"
            />
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--primary)] mb-1">
              About the author
            </p>
            <p className="font-semibold text-[var(--foreground)]">{author.name}</p>
            <p className="text-sm text-[var(--muted-foreground)]">{author.role}</p>
            <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-relaxed">
              {author.credentials}
            </p>
            {author.url && (
              <a
                href={author.url}
                rel="noopener noreferrer"
                target="_blank"
                className="mt-2 inline-block text-sm text-[var(--primary)] underline underline-offset-2"
              >
                View profile
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
