'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import type { Post } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

export interface BlogPostListProps {
  posts: Post[]
  batchSize?: number
}

export function BlogPostList({ posts, batchSize }: BlogPostListProps) {
  const t = useTranslations('posts')
  const batch = Math.max(1, Math.min(batchSize ?? 8, 24))
  const [visibleCount, setVisibleCount] = useState(Math.min(batch, posts.length))
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (visibleCount >= posts.length) return
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((current) => Math.min(current + batch, posts.length))
        }
      },
      { rootMargin: '300px 0px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [batch, posts.length, visibleCount])

  if (posts.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-foreground/15 py-20 text-center">
        <p className="text-muted-foreground">{t('empty')}</p>
      </div>
    )
  }

  const visiblePosts = posts.slice(0, visibleCount)

  return (
    <div className="divide-y divide-foreground/10 border-b border-foreground/10">
      {visiblePosts.map((post) => (
        <StoryRow key={post.slug} post={post} />
      ))}
      {visibleCount < posts.length && <div ref={sentinelRef} className="h-px" />}
    </div>
  )
}

function StoryRow({ post }: { post: Post }) {
  const t = useTranslations('posts')

  return (
    <article>
      <Link
        href={post.url as any}
        className="group grid gap-3 py-7 sm:grid-cols-[8.5rem_minmax(0,1fr)_1.5rem] sm:gap-6 sm:py-8"
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground sm:block">
          <time dateTime={post.date} className="block">{formatDate(post.date, post.locale)}</time>
          <span className="sm:hidden">·</span>
          <span className="block sm:mt-2">{t('readingTime', { minutes: Math.ceil(post.readingTime.minutes) })}</span>
        </div>

        <div className="min-w-0">
          <h2 className="text-balance text-xl font-semibold leading-7 tracking-[-0.025em] transition-colors group-hover:text-primary sm:text-2xl">
            {post.title}
          </h2>
          {post.description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{post.description}</p>
          )}
          {post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground/65">
              {post.tags.slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}
            </div>
          )}
        </div>

        <ArrowUpRight className="hidden h-4 w-4 self-start text-muted-foreground/60 transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground sm:block" />
      </Link>
    </article>
  )
}
