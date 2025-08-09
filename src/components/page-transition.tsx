'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isEntering, setIsEntering] = useState(true)

  useEffect(() => {
    setIsEntering(true)
    const timer = setTimeout(() => setIsEntering(false), 400)
    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div className={`page-transition ${isEntering ? 'page-enter' : ''} animate-fade-in-up`}>
      {children}
    </div>
  )
}


