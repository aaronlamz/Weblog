'use client'

import { usePathname } from 'next/navigation'

export function DynamicMain({
  children,
  className = ""
}: {
  children: React.ReactNode
  className?: string
}) {
  const pathname = usePathname()

  // Check if current page is a blog post
  const isBlogPost = /\/blog\/[^\/]+\/?$/.test(pathname)
  // Check if current page is home page (/ or /en or /zh)
  const isHomePage = /^\/(en|zh)?\/?$/.test(pathname)
  // Check if current page is a doc detail page
  const isDocDetail = /\/docs\/[^\/]+\/[^\/]+/.test(pathname)

  return (
    <main className={`${
      isBlogPost ? "pb-16" :
      isHomePage ? "flex-1 flex items-center justify-center" :
      isDocDetail ? "pb-8" :
      "pt-20 pb-8"
    } ${className}`}>
      {children}
    </main>
  )
}
