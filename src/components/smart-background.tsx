'use client'

import { usePathname } from 'next/navigation'
import { AnimatedBackground } from './animated-background'

export function SmartBackground() {
  const pathname = usePathname()
  
  // Only show animated background on home page
  // Home page patterns: /, /zh, /en
  const isHomePage = pathname === '/' || pathname === '/zh' || pathname === '/en'
  
  if (isHomePage) {
    return <AnimatedBackground />
  }
  
  // For other pages, provide a clean background
  return (
    <div className="fixed inset-0 -z-10 bg-background">
      {/* Optional: Add a subtle gradient for non-home pages */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
    </div>
  )
}