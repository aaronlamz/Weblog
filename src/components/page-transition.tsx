'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isEntering, setIsEntering] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setIsEntering(true)
    const timer = setTimeout(() => setIsEntering(false), 160)
    return () => clearTimeout(timer)
  }, [pathname])

  // Check if current page is home page
  const isHomePage = mounted && /^\/(en|zh)?\/?$/.test(pathname)

  return (
    <div className={`page-transition ${isEntering ? 'page-enter' : ''} animate-fade-in-up ${isHomePage ? 'w-full' : ''}`}>
      {children}
    </div>
  )
}


