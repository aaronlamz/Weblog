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

  // Check if current page is home page (/ or /en or /zh)
  const isHomePage = /^\/(en|zh)?\/?$/.test(pathname)

  return (
    <main className={`${
      isHomePage ? "flex-1 flex items-center justify-center" : ""
    } ${className}`}>
      {children}
    </main>
  )
}
