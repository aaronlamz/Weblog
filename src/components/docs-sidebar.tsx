'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { BookOpen, ChevronRight } from 'lucide-react'
import { buildLocalizedPath, detectLocaleFromPath } from '@/lib/i18n-utils'
import type { DocCategory } from '@/lib/docs'

interface DocsSidebarProps {
  categories: DocCategory[]
}

export function DocsSidebar({ categories }: DocsSidebarProps) {
  const pathname = usePathname()
  const locale = detectLocaleFromPath(pathname)

  // Auto-expand the category that contains the current doc
  const currentCategory = categories.find(cat =>
    cat.docs.some(doc => pathname.includes(`/docs/${doc.slug}`))
  )

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(currentCategory ? [currentCategory.slug] : categories.length > 0 ? [categories[0].slug] : [])
  )

  const toggleCategory = (slug: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  const isSingleCategory = categories.length === 1

  return (
    <nav className="rounded-2xl bg-foreground/[0.025] p-3 dark:bg-foreground/[0.045]">
      {categories.map(category => {
        const isExpanded = isSingleCategory || expandedCategories.has(category.slug)
        return (
          <div key={category.slug}>
            {!isSingleCategory ? (
              <button
                onClick={() => toggleCategory(category.slug)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-foreground/90 hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors"
              >
                <span>{category.title}</span>
                <ChevronRight
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
              </button>
            ) : (
              <div className="px-2 pb-3 pt-2">
                <span className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-background text-primary shadow-sm ring-1 ring-foreground/[0.06]">
                  <BookOpen className="h-4 w-4" />
                </span>
                <div className="text-sm font-semibold leading-5 text-foreground">
                  {category.title}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {locale === 'zh' ? `${category.docs.length} 章` : `${category.docs.length} chapters`}
                </div>
              </div>
            )}
            {isExpanded && (
              <div className="space-y-1">
                {category.docs.map((doc, index) => {
                  const href = buildLocalizedPath(`/docs/${doc.slug}`, locale as any)
                  const isActive = pathname.includes(`/docs/${doc.slug}`)
                  return (
                    <Link
                      key={doc.slug}
                      href={href as any}
                      className={`grid grid-cols-[1.5rem_minmax(0,1fr)] items-start rounded-xl px-2 py-2 text-sm transition-colors ${
                        isActive
                          ? 'bg-background font-medium text-foreground shadow-sm ring-1 ring-foreground/[0.06]'
                          : 'text-muted-foreground hover:bg-background/70 hover:text-foreground'
                      }`}
                    >
                      <span className={`pt-px text-[10px] tabular-nums ${isActive ? 'text-primary' : 'text-foreground/35'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="leading-5">{doc.title}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
