'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { AnimatedBackground } from './animated-background'

interface SmartBackgroundProps {
  maxCreatures?: number // 可配置的最大动物数量，默认7个
}

export function SmartBackground({ maxCreatures }: SmartBackgroundProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Only show animated background on home page (/ or /en)
  const isHomePage = mounted && (() => {
    // Clean the pathname by removing trailing slashes
    const cleanPath = pathname.replace(/\/$/, '') || '/'

    // Split into segments
    const segments = cleanPath.split('/').filter(Boolean)

    // Home page scenarios:
    // 1. Root: / -> segments: []
    // 2. English locale: /en -> segments: ['en']

    if (segments.length === 0) return true // Root path
    if (segments.length === 1 && segments[0] === 'en') return true // English locale

    return false
  })()
  
  if (isHomePage) {
    return <AnimatedBackground maxCreatures={maxCreatures || 3} />
  }
  
  // For other pages, provide a clean background
  return (
    <div className="fixed inset-0 -z-10 bg-background">
      {/* Optional: Add a subtle gradient for non-home pages */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
    </div>
  )
}