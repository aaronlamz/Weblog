'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
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
    <nav className="space-y-1">
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
              <div className="px-3 py-2 text-sm font-semibold text-foreground/90">
                {category.title}
              </div>
            )}
            {isExpanded && (
              <div className="ml-3 border-l border-border/60 pl-3 space-y-0.5 mt-0.5">
                {category.docs.map(doc => {
                  const href = buildLocalizedPath(`/docs/${doc.slug}`, locale as any)
                  const isActive = pathname.includes(`/docs/${doc.slug}`)
                  return (
                    <Link
                      key={doc.slug}
                      href={href as any}
                      className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
                        isActive
                          ? 'text-primary font-medium bg-primary/5'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                      }`}
                    >
                      {doc.title}
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
