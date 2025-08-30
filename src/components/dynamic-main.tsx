'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function DynamicMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if current page is a blog post
  const isBlogPost = mounted && /\/blog\/[^\/]+\/?$/.test(pathname)
  
  return (
    <main className={isBlogPost ? "pb-32" : "pt-24 pb-32"}>
      {children}
    </main>
  )
}