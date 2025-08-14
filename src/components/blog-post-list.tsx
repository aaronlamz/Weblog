'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { Post } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

export interface BlogPostListProps {
  posts: Post[]
}

export function BlogPostList({ posts }: BlogPostListProps) {
  const t = useTranslations()
  const tPosts = useTranslations('posts')
  const searchParams = useSearchParams()

  const activeTag = searchParams.get('tag') || undefined
  const activeYear = searchParams.get('year') || undefined
  const activeMonth = searchParams.get('month') || undefined

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchTag = activeTag ? (p.tags || []).includes(activeTag) : true
      const postYear = new Date(p.date).getFullYear().toString()
      const matchYear = activeYear ? postYear === activeYear : true
      let matchMonth = true
      if (activeMonth) {
        const d = new Date(p.date)
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        matchMonth = ym === activeMonth
      }
      return matchTag && matchYear && matchMonth
    })
  }, [posts, activeTag, activeYear, activeMonth])

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{tPosts('empty')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {filteredPosts.map((post) => (
        <article key={post.slug} className="group">
          <Link href={post.url as any}>
            <div className="bg-card rounded-lg p-6 border hover:shadow-md transition-all duration-200">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <time dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                  <span>•</span>
                  <span>{t('posts.readingTime', { minutes: post.readingTime?.minutes })}</span>
                  {post.featured && (
                    <>
                      <span>•</span>
                      <span className="text-primary font-medium">{tPosts('featured')}</span>
                    </>
                  )}
                </div>

                <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                  {post.title}
                </h2>

                <p className="text-muted-foreground leading-relaxed">
                  {post.description}
                </p>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  )
}


