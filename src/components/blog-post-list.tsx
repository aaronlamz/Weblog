'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { Post } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

export interface BlogPostListProps {
  posts: Post[]
}

export function BlogPostList({ posts }: BlogPostListProps) {
  const tPosts = useTranslations('posts')

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{tPosts('empty')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <article key={post.slug}>
          <Link href={post.url as any}>
            <div className="group bg-card border border-border/60 rounded-xl p-4 hover:border-border hover:shadow-md hover:bg-card/80 transition-all duration-200 hover:scale-[0.998] active:scale-[0.995]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <h2 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {post.title}
                  </h2>
                  {post.featured && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary shrink-0">
                      {tPosts('featured')}
                    </span>
                  )}
                </div>
                <time 
                  dateTime={post.date}
                  className="text-sm text-muted-foreground shrink-0 ml-4 font-mono"
                >
                  {formatDate(post.date, post.locale)}
                </time>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
}


