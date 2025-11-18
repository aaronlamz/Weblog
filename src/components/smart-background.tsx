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
  
  // Only show animated background on home page
  // Home page patterns: / (default locale), /en (English locale)
  // With localePrefix: 'as-needed', Chinese (default) has no prefix, English has /en prefix
  const isHomePage = mounted && (pathname === '/' || pathname === '/en')
  
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