'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { siteConfig } from '@/config/site.config'

interface DocsTopBarProps {
  backHref: string
  backLabel: string
  homeHref: string
}

export function DocsTopBar({ backHref, backLabel, homeHref }: DocsTopBarProps) {
  return (
    <header className="global-nav sticky top-0 z-50 bg-background/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-[1300px] items-center justify-between px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href={homeHref as any}
            className="siri-logo shrink-0"
            aria-label={siteConfig.author.name}
          >
            <span className="siri-logo-halo" aria-hidden="true" />
            <span className="siri-logo-ring" aria-hidden="true" />
            <span className="siri-logo-core">
              {siteConfig.author.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={siteConfig.author.avatar}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                'A'
              )}
            </span>
          </Link>

          <Link
            href={backHref as any}
            className="group inline-flex h-9 min-w-0 items-center gap-2 rounded-full bg-foreground/[0.045] px-3 text-sm font-medium text-foreground/65 transition-colors hover:bg-foreground/[0.075] hover:text-foreground dark:bg-foreground/[0.08] dark:hover:bg-foreground/[0.12]"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5" strokeWidth={1.7} />
            <span className="truncate">{backLabel}</span>
          </Link>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
