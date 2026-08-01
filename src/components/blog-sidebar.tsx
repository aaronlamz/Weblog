'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Post } from '@/lib/posts'

type SidebarPost = Pick<Post, 'slug' | 'title' | 'url'>

export function BlogSidebar({ posts }: { posts: SidebarPost[] }) {
  const pathname = usePathname()
  const t = useTranslations('posts')

  return (
    <nav className="rounded-2xl bg-foreground/[0.025] p-3 dark:bg-foreground/[0.045]" aria-label={t('allStories')}>
      <div className="px-2 pb-3 pt-2">
        <span className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-background text-primary shadow-sm ring-1 ring-foreground/[0.06]">
          <FileText className="h-4 w-4" />
        </span>
        <div className="text-sm font-semibold leading-5 text-foreground">{t('blog')}</div>
        <div className="mt-1 text-[11px] text-muted-foreground">
          {posts.length} {t('stories')}
        </div>
      </div>

      <div className="space-y-1">
        {posts.map((post, index) => {
          const isActive = pathname.includes(`/blog/${post.slug}`)
          return (
            <Link
              key={post.slug}
              href={post.url as any}
              className={`grid grid-cols-[1.5rem_minmax(0,1fr)] items-start rounded-xl px-2 py-2 text-sm transition-colors ${
                isActive
                  ? 'bg-background font-medium text-foreground shadow-sm ring-1 ring-foreground/[0.06]'
                  : 'text-muted-foreground hover:bg-background/70 hover:text-foreground'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={`pt-px text-[10px] tabular-nums ${isActive ? 'text-primary' : 'text-foreground/35'}`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="line-clamp-3 leading-5">{post.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
