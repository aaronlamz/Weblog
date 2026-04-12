'use client'

import { usePathname } from 'next/navigation'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHomePage = /^\/(en|zh)?\/?$/.test(pathname)

  return (
    <div className={isHomePage ? 'w-full' : ''}>
      {children}
    </div>
  )
}
