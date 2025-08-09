'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
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
  home: Home,
  blog: FileText,
  about: User,
  contact: MessageCircle,
}

export function Header() {
  const t = useTranslations('navigation')
  const tSite = useTranslations('site')
  const locale = useLocale()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Navigation items with translations - use pathname to determine locale reliably
  const isZh = pathname.startsWith('/zh') || locale === 'zh'
  
  // Navigation items that work consistently in SSR and client
  const navItems = [
    { key: 'home', href: isZh ? '/zh' : '/' },
    { key: 'blog', href: isZh ? '/zh/blog' : '/blog' },
    { key: 'about', href: isZh ? '/zh/about' : '/about' },
    { key: 'contact', href: isZh ? '/zh/contact' : '/contact' },
  ]

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
            rounded-full px-8 py-3.5
            bg-white/5 dark:bg-black/20
            border border-white/10 dark:border-white/5
            ring-1 ring-white/5 dark:ring-white/0
            backdrop-blur-2xl backdrop-saturate-150
            shadow-xl shadow-black/20
            transition-all duration-500 ease-out
            ${isScrolled 
              ? 'scale-95 bg-white/8 dark:bg-black/25 backdrop-blur-2xl shadow-2xl' 
              : 'scale-100'}
          `}>
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <Link 
                href={navItems[0].href as any} 
                className="font-bold text-lg transition-colors drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] text-foreground hover:text-primary dark:text-white dark:hover:text-primary"
              >
                {tSite('name')}
              </Link>
              
              {/* 桌面导航链接 */}
              <div className="hidden md:flex items-center space-x-6">
                {navItems.map((item) => {
                  const Icon = navIcons[item.key as keyof typeof navIcons]
                  return (
                    <Link 
                      key={item.key}
                      href={item.href as any}
                      className="flex items-center space-x-2 text-sm font-medium transition-colors group drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] text-foreground/85 hover:text-foreground dark:text-white/85 dark:hover:text-white"
                    >
                      {Icon && (
                        <Icon className="w-4 h-4 group-hover:scale-110 transition-transform text-foreground/70 dark:text-white/80" />
                      )}
                      <span>{t(item.key as any)}</span>
                    </Link>
                  )
                })}
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center space-x-3">
                <LanguageSwitcher />
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
              {navItems.map((item) => {
                const Icon = navIcons[item.key as keyof typeof navIcons]
                return (
                  <Link
                    key={item.key}
                    href={item.href as any}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 text-2xl font-medium hover:text-primary transition-colors"
                  >
                    {Icon && <Icon className="w-6 h-6" />}
                    <span>{t(item.key as any)}</span>
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