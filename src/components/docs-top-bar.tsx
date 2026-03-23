'use client'

import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

interface DocsTopBarProps {
  backHref: string
  backLabel: string
  homeHref: string
}

export function DocsTopBar({ backHref, backLabel, homeHref }: DocsTopBarProps) {
  return (
    <div className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-12">
          {/* Left: back */}
          <Link
            href={backHref as any}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </Link>

          {/* Right: home + theme */}
          <div className="flex items-center gap-2">
            <Link
              href={homeHref as any}
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Home className="w-4 h-4" />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}
