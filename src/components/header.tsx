'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { siteConfig } from '@/config/site.config'
import { 
  Home, 
  FileText, 
  User, 
  MessageCircle, 
  Menu, 
  X,
  Github,
  Twitter,
  Mail
} from 'lucide-react'

const navIcons = {
  'Home': Home,
  'Blog': FileText,
  'About': User,
  'Contact': MessageCircle,
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* 悬浮式桌面导航 */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="flex justify-center pt-6 px-4">
          <nav className={`
            pointer-events-auto
            bg-background/60 backdrop-blur-lg 
            border border-border/30
            rounded-full px-6 py-3
            shadow-lg shadow-black/10
            transition-all duration-500 ease-out
            ${isScrolled ? 'scale-95 shadow-xl bg-background/80' : 'scale-100'}
          `}>
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <Link 
                href="/" 
                className="font-bold text-lg hover:text-primary transition-colors"
              >
                {siteConfig.name}
              </Link>
              
              {/* 桌面导航链接 */}
              <div className="hidden md:flex items-center space-x-6">
                {siteConfig.nav.main.map((item) => {
                  const Icon = navIcons[item.title as keyof typeof navIcons]
                  return (
                    <Link 
                      key={item.href}
                      href={item.href as any}
                      className="flex items-center space-x-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors group"
                    >
                      {Icon && (
                        <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      )}
                      <span>{item.title}</span>
                    </Link>
                  )
                })}
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                
                {/* 移动端菜单按钮 */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* 移动端全屏菜单 */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-background/95 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {siteConfig.nav.main.map((item) => {
                const Icon = navIcons[item.title as keyof typeof navIcons]
                return (
                  <Link
                    key={item.href}
                    href={item.href as any}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 text-2xl font-medium hover:text-primary transition-colors"
                  >
                    {Icon && <Icon className="w-6 h-6" />}
                    <span>{item.title}</span>
                  </Link>
                )
              })}
              
              {/* 社交链接 */}
              <div className="flex items-center space-x-6 mt-8">
                {siteConfig.social.github && (
                  <a
                    href={siteConfig.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                )}
                {siteConfig.social.twitter && (
                  <a
                    href={siteConfig.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <Twitter className="w-6 h-6" />
                  </a>
                )}
                {siteConfig.social.email && (
                  <a
                    href={`mailto:${siteConfig.social.email}`}
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    <Mail className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 