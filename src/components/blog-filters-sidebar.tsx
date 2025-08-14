'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { Post } from '@/lib/posts'

export interface BlogFiltersSidebarProps {
  posts: Post[]
}

export function BlogFiltersSidebar({ posts }: BlogFiltersSidebarProps) {
  const tPosts = useTranslations('posts')
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeTag = searchParams.get('tag') || undefined
  const activeYear = searchParams.get('year') || undefined
  const activeMonth = searchParams.get('month') || undefined

  const { tagCounts, yearCounts, monthCounts } = useMemo(() => {
    const tagCounts: Record<string, number> = {}
    const yearCounts: Record<string, number> = {}
    const monthCounts: Record<string, number> = {}
    for (const post of posts) {
      const year = new Date(post.date).getFullYear().toString()
      yearCounts[year] = (yearCounts[year] || 0) + 1
      const dateObj = new Date(post.date)
      const ym = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`
      monthCounts[ym] = (monthCounts[ym] || 0) + 1
      if (Array.isArray(post.tags)) {
        for (const tag of post.tags) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        }
      }
    }
    return { tagCounts, yearCounts, monthCounts }
  }, [posts])

  const buildHref = (next: { tag?: string; year?: string; month?: string }) => {
    const params = new URLSearchParams()
    if (next.tag) params.set('tag', next.tag)
    if (next.year) params.set('year', next.year)
    if (next.month) params.set('month', next.month)
    const q = params.toString()
    return q ? `${pathname}?${q}` : pathname
  }

  return (
    <aside className="lg:sticky lg:top-28 space-y-8">
      {/* Popular Tags */}
      {Object.keys(tagCounts).length > 0 && (
        <section>
          <div className="mb-3 text-sm font-medium text-muted-foreground">{tPosts('popularTags')}</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(tagCounts)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([tag, count]) => {
                const selected = activeTag === tag
                return (
                  <Link
                    key={`popular-${tag}`}
                    href={buildHref({ tag, year: activeYear, month: activeMonth }) as any}
                    className={
                      `inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        selected
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted'
                      }`
                    }
                  >
                    <span>{tag}</span>
                    <span className={selected ? 'opacity-90' : 'text-muted-foreground'}>({count})</span>
                  </Link>
                )
              })}
          </div>
        </section>
      )}

      {/* Tags */}
      {Object.keys(tagCounts).length > 0 && (
        <section>
          <div className="mb-3 text-sm font-medium text-muted-foreground">{tPosts('tags')}</div>
          <div className="flex flex-wrap gap-2">
            {(activeTag || activeYear || activeMonth) && (
              <Link
                href={buildHref({}) as any}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border bg-background hover:bg-muted transition-colors"
              >
                {tPosts('clearFilters')}
              </Link>
            )}
            {Object.entries(tagCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([tag, count]) => {
                const selected = activeTag === tag
                return (
                  <Link
                    key={tag}
                    href={buildHref({ tag, year: activeYear, month: activeMonth }) as any}
                    className={
                      `inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        selected
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted'
                      }`
                    }
                  >
                    <span>{tag}</span>
                    <span className={selected ? 'opacity-90' : 'text-muted-foreground'}>({count})</span>
                  </Link>
                )
              })}
          </div>
        </section>
      )}

      {/* Archive by year */}
      {Object.keys(yearCounts).length > 0 && (
        <section>
          <div className="mb-3 text-sm font-medium text-muted-foreground">{tPosts('archive')}</div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(yearCounts)
              .sort((a, b) => Number(b) - Number(a))
              .map((year) => {
                const selected = activeYear === year
                const count = yearCounts[year]
                return (
                  <Link
                    key={year}
                    href={buildHref({ tag: activeTag, year }) as any}
                    className={
                      `inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        selected
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted'
                      }`
                    }
                  >
                    <span>{year}</span>
                    <span className={selected ? 'opacity-90' : 'text-muted-foreground'}>({count})</span>
                  </Link>
                )
              })}
          </div>
        </section>
      )}

      {/* Archive by month */}
      {Object.keys(monthCounts).length > 0 && (
        <section>
          <div className="mb-3 text-sm font-medium text-muted-foreground">{tPosts('monthlyArchive')}</div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(monthCounts)
              .sort((a, b) => (a < b ? 1 : -1))
              .map((ym) => {
                const selected = activeMonth === ym
                const count = monthCounts[ym]
                return (
                  <Link
                    key={ym}
                    href={buildHref({ tag: activeTag, month: ym }) as any}
                    className={
                      `inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        selected
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted'
                      }`
                    }
                  >
                    <span>{ym}</span>
                    <span className={selected ? 'opacity-90' : 'text-muted-foreground'}>({count})</span>
                  </Link>
                )
              })}
          </div>
        </section>
      )}
    </aside>
  )
}


