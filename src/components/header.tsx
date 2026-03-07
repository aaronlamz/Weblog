'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { siteConfig } from '@/config/site.config'
import { buildLocalizedPath, detectLocaleFromPath } from '@/lib/i18n-utils'
import { 
  Home, 
  FileText, 
  User, 
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
  // contact: MessageCircle,
}

// 滑动高亮块导航组件 — 鼠标悬停时玻璃胶囊流畅滑过
function SliderNavigation({ navItems, currentLocale }: { navItems: any[], currentLocale: string }) {
  const t = useTranslations('navigation')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 })
  const navRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])

  const updatePill = (index: number | null) => {
    if (index === null || !navRef.current || !itemRefs.current[index]) {
      setPillStyle(s => ({ ...s, opacity: 0 }))
      return
    }
    const nav = navRef.current.getBoundingClientRect()
    const item = itemRefs.current[index]!.getBoundingClientRect()
    setPillStyle({
      left: item.left - nav.left,
      width: item.width,
      opacity: 1,
    })
  }

  return (
    <div
      ref={navRef}
      className="relative flex items-center gap-1 px-2 py-1"
      onMouseLeave={() => {
        setHoveredIndex(null)
        updatePill(null)
      }}
    >
      {/* 滑动玻璃胶囊 */}
      <span
        aria-hidden
        className="liquid-pill pointer-events-none absolute top-1 bottom-1 rounded-full"
        style={{
          left: pillStyle.left,
          width: pillStyle.width,
          opacity: pillStyle.opacity,
          transition: 'left 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.18s ease',
        }}
      />

      {navItems.map((item, index) => {
        const Icon = navIcons[item.key as keyof typeof navIcons]
        const isActive = hoveredIndex === index

        return (
          <Link
            key={item.key}
            href={item.href as any}
            ref={el => { itemRefs.current[index] = el }}
            onMouseEnter={() => {
              setHoveredIndex(index)
              updatePill(index)
            }}
            className="relative z-10 flex items-center gap-1.5 px-3.5 py-2 rounded-full cursor-pointer select-none"
            style={{
              transition: 'color 0.2s ease',
              color: isActive ? 'hsl(var(--primary))' : undefined,
            }}
          >
            {Icon && (
              <Icon
                className="w-4 h-4 transition-all duration-200"
                style={{
                  color: isActive ? 'hsl(var(--primary))' : undefined,
                  filter: isActive ? 'drop-shadow(0 0 4px rgba(99,102,241,0.45))' : 'none',
                  transform: isActive ? 'scale(1.12)' : 'scale(1)',
                }}
              />
            )}
            <span
              className="text-sm font-medium text-foreground/80 dark:text-white/80 transition-all duration-200"
              style={{
                color: isActive ? 'hsl(var(--primary))' : undefined,
                fontWeight: isActive ? 600 : 500,
              }}
            >
              {t(item.key as any)}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

export function Header() {
  const t = useTranslations('navigation')
  const tSite = useTranslations('site')
  const locale = useLocale()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Navigation items with translations - use pathname to determine locale reliably
  const currentLocale = mounted ? detectLocaleFromPath(pathname) : locale
  
  // Check if current page is a blog post (hide navigation for article pages)
  // Patterns: /blog/[slug] (zh default) or /en/blog/[slug] (en)
  // Also handles BASE_PATH like /Weblog/blog/[slug] or /Weblog/en/blog/[slug]
  const isBlogPost = mounted && /\/blog\/[^\/]+\/?$/.test(pathname)
  
  // Navigation items without manual basePath; Next.js handles basePath automatically
  const navItems = [
    { key: 'home', href: buildLocalizedPath('/', currentLocale as any) },
    { key: 'blog', href: buildLocalizedPath('/blog', currentLocale as any) },
    { key: 'about', href: buildLocalizedPath('/about', currentLocale as any) },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Don't render navigation on blog post pages
  if (isBlogPost) {
    return null
  }

  return (
    <>
      {/* 悬浮式桌面导航 */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="flex justify-center pt-6 px-4">
          <nav className={`
            pointer-events-auto
            rounded-full px-8 py-3.5
            liquid-glass
            transition-all duration-500 ease-out
            ${isScrolled 
              ? 'scale-95 liquid-glass-scrolled' 
              : 'scale-100'}
          `}>
            {/* 光带动画层，独立 overflow:hidden 不影响下拉菜单 */}
            <div className="liquid-glass-fx" aria-hidden />
            <div className="flex items-center space-x-8 relative z-10">
              {/* Logo */}
              <Link 
                href={navItems[0].href as any} 
                className="flex items-center"
              >
                {siteConfig.author.avatar ? (
                  <img
                    src={siteConfig.author.avatar}
                    alt={`${siteConfig.author.name}'s avatar`}
                    className="w-8 h-8 rounded-full ring-2 ring-white/10 dark:ring-white/20 hover:ring-primary/30 dark:hover:ring-primary/30 transition-all duration-300"
                  />
                ) : (
                  <span className="font-bold text-lg transition-colors drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] text-foreground hover:text-primary dark:text-white dark:hover:text-primary">
                    {tSite('name')}
                  </span>
                )}
              </Link>
              
              {/* 桌面导航链接 */}
              <div className="hidden md:flex">
                <SliderNavigation navItems={navItems} currentLocale={currentLocale} />
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
                  onClick={() => {
                    if (isMobileMenuOpen) {
                      setIsClosing(true)
                      setTimeout(() => {
                        setIsMobileMenuOpen(false)
                        setIsClosing(false)
                      }, 300)
                    } else {
                      setIsMobileMenuOpen(true)
                      setIsClosing(false)
                    }
                  }}
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
        <div 
          className={`fixed inset-0 z-40 md:hidden ${isClosing ? 'mobile-menu-exit' : 'mobile-menu-enter'}`}
          onClick={() => {
            setIsClosing(true)
            setTimeout(() => {
              setIsMobileMenuOpen(false)
              setIsClosing(false)
            }, 300)
          }}
        >
          <div className="fixed inset-0 bg-background/95 backdrop-blur-sm">
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {navItems.map((item, index) => {
                const Icon = navIcons[item.key as keyof typeof navIcons]
                return (
                  <Link
                    key={item.key}
                    href={item.href as any}
                    onClick={() => {
                      setIsClosing(true)
                      setTimeout(() => {
                        setIsMobileMenuOpen(false)
                        setIsClosing(false)
                      }, 200)
                    }}
                    className={`flex items-center space-x-3 text-2xl font-medium hover:text-primary transition-all duration-300 transform hover:scale-110 ${
                      isClosing ? 'mobile-menu-item-exit' : 'mobile-menu-item-enter'
                    }`}
                    style={{
                      animationDelay: isClosing ? `${(navItems.length - index - 1) * 40}ms` : `${index * 80}ms`
                    }}
                  >
                    {Icon && <Icon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />}
                    <span>{t(item.key as any)}</span>
                  </Link>
                )
              })}
              
              {/* 社交链接 */}
              <div 
                className={`flex items-center space-x-6 mt-8 ${
                  isClosing ? 'mobile-menu-item-exit' : 'mobile-menu-item-enter'
                }`}
                style={{
                  animationDelay: isClosing ? '0ms' : `${navItems.length * 80}ms`
                }}
              >
                {siteConfig.social.github && (
                  <a
                    href={siteConfig.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/60 hover:text-foreground transition-all duration-300 transform hover:scale-125"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                )}
                {siteConfig.social.twitter && (
                  <a
                    href={siteConfig.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/60 hover:text-foreground transition-all duration-300 transform hover:scale-125"
                  >
                    <Twitter className="w-6 h-6" />
                  </a>
                )}
                {siteConfig.social.email && (
                  <a
                    href={`mailto:${siteConfig.social.email}`}
                    className="text-foreground/60 hover:text-foreground transition-all duration-300 transform hover:scale-125"
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