'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import type { Post } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

export interface BlogPostListProps {
  posts: Post[]
  batchSize?: number
}

export function BlogPostList({ posts, batchSize }: BlogPostListProps) {
  const tPosts = useTranslations('posts')
  const BATCH_SIZE = Math.max(1, Math.min(batchSize ?? 8, 24))
  const [hydrated, setHydrated] = useState(false)
  const [visibleCount, setVisibleCount] = useState(Math.min(BATCH_SIZE, posts.length))
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setHydrated(true), 120)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (visibleCount >= posts.length) return
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, posts.length))
        }
      })
    }, { rootMargin: '300px 0px' })

    observer.observe(el)
    return () => observer.disconnect()
  }, [hydrated, visibleCount, posts.length])

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{tPosts('empty')}</p>
      </div>
    )
  }

  const visiblePosts = posts.slice(0, visibleCount)

  return (
    <div className="space-y-3">
      {!hydrated ? (
        Array.from({ length: Math.min(BATCH_SIZE, posts.length || 4) }).map((_, idx) => (
          <SkeletonRow key={`skeleton-${idx}`} />
        ))
      ) : (
        <>
          {visiblePosts.map((post) => (
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

          {visibleCount < posts.length && (
            <>
              {/* loading placeholder for the next batch */}
              {Array.from({ length: Math.min(BATCH_SIZE, posts.length - visibleCount) }).map((_, idx) => (
                <SkeletonRow key={`skeleton-next-${idx}`} />
              ))}
              <div ref={sentinelRef} />
            </>
          )}
        </>
      )}
    </div>
  )
}


function SkeletonRow() {
  return (
    <div className="bg-card border border-border/60 rounded-xl p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <div className="h-4 w-48 bg-muted/70 rounded" />
          <div className="h-5 w-14 bg-muted/60 rounded-md" />
        </div>
        <div className="h-3.5 w-28 bg-muted/60 rounded ml-4" />
      </div>
    </div>
  )
}


