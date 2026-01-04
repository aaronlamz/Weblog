'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function DynamicMain({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode
  className?: string
}) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if current page is a blog post
  const isBlogPost = mounted && /\/blog\/[^\/]+\/?$/.test(pathname)
  // Check if current page is home page (/ or /en or /zh)
  const isHomePage = mounted && /^\/(en|zh)?\/?$/.test(pathname)
  
  return (
    <main className={`${
      isBlogPost ? "pb-32" : 
      isHomePage ? "flex items-center justify-center" : 
      "pt-24 pb-32"
    } ${className}`}>
      {children}
    </main>
  )
}