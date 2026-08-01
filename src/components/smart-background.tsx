'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { AnimatedBackground } from './animated-background'

interface SmartBackgroundProps {
  maxCreatures?: number // 可配置的最大动物数量，默认7个
}

export function SmartBackground(_props: SmartBackgroundProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Only show the ambient background on localized home pages.
  const isHomePage = mounted && (() => {
    // Clean the pathname by removing trailing slashes
    const cleanPath = pathname.replace(/\/$/, '') || '/'

    // Split into segments
    const segments = cleanPath.split('/').filter(Boolean)

    // Home page scenarios:
    // 1. Root: / -> segments: []
    // 2. Localized home: /en or /zh -> one locale segment

    if (segments.length === 0) return true // Root path
    if (segments.length === 1 && ['en', 'zh'].includes(segments[0])) return true

    return false
  })()
  
  if (isHomePage) {
    return <AnimatedBackground />
  }
  
  // For other pages, provide a clean background
  return (
    <div className="fixed inset-0 -z-10 bg-white dark:bg-black" />
  )
}
