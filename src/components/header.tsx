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
  // contact: MessageCircle,
}

// macOS Dock风格导航组件 - 放大镜效果
function DockNavigation({ navItems, currentLocale }: { navItems: any[], currentLocale: string }) {
  const t = useTranslations('navigation')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const navRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLElement | null)[]>([])

  // 计算每个导航项的缩放值，基于鼠标距离
  const getScale = (index: number) => {
    if (!isHovering || !navRef.current || !itemRefs.current[index]) return 1

    // 首先找出距离鼠标最近的项目
    let closestIndex = -1
    let closestDistance = Infinity

    itemRefs.current.forEach((item, i) => {
      if (!item) return
      const rect = item.getBoundingClientRect()
      const itemCenter = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      }
      const distance = Math.sqrt(
        Math.pow(mousePosition.x - itemCenter.x, 2) + 
        Math.pow(mousePosition.y - itemCenter.y, 2)
      )
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = i
      }
    })

    const item = itemRefs.current[index]
    const rect = item.getBoundingClientRect()
    const itemCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }

    // 计算当前项目到鼠标的距离
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - itemCenter.x, 2) + 
      Math.pow(mousePosition.y - itemCenter.y, 2)
    )

    // 放大镜效果配置
    const maxDistance = 60 // 减少影响范围
    const maxScale = 1.25 // 最大缩放值
    const minScale = 1.0 // 最小缩放值

    // 只有最近的项目才能获得最大缩放
    if (index === closestIndex && distance <= maxDistance) {
      const normalizedDistance = distance / maxDistance
      const easeOut = 1 - Math.pow(normalizedDistance, 2)
      return minScale + (maxScale - minScale) * easeOut
    }

    // 相邻项目获得轻微缩放
    if (Math.abs(index - closestIndex) === 1 && distance <= maxDistance * 1.5) {
      const adjacentScale = 1.05 // 相邻项目的轻微缩放
      const normalizedDistance = distance / (maxDistance * 1.5)
      const easeOut = 1 - Math.pow(normalizedDistance, 2)
      return minScale + (adjacentScale - minScale) * easeOut
    }

    return minScale
  }

  // 处理鼠标移动
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  return (
    <div 
      ref={navRef}
      className="flex items-center space-x-1 px-4 py-1"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {navItems.map((item, index) => {
        const Icon = navIcons[item.key as keyof typeof navIcons]
        const scale = getScale(index)
        
        return (
          <Link 
            key={item.key}
            href={item.href as any}
            ref={(el) => {
              itemRefs.current[index] = el
            }}
            className="relative flex items-center space-x-2 px-3 py-2 transition-all duration-300 ease-out cursor-pointer"
            style={{
              transform: `scale(${scale}) translateZ(0)`,
              transformOrigin: 'center center',
              zIndex: Math.floor(scale * 10),
            }}
          >
            {/* 图标 */}
            {Icon && (
              <Icon 
                className="w-4 h-4 transition-all duration-300 text-foreground/70 dark:text-white/80"
                style={{
                  color: scale > 1.05 ? 'rgb(var(--foreground))' : undefined,
                  filter: scale > 1.15 ? `drop-shadow(0 0 ${(scale - 1) * 12}px rgba(99, 102, 241, 0.4)) brightness(${1 + (scale - 1) * 0.2})` : 'none',
                }}
              />
            )}
            
            {/* 文字标签 */}
            <span 
              className="text-sm font-medium transition-all duration-300 text-foreground/85 dark:text-white/85"
              style={{
                color: scale > 1.05 ? 'rgb(var(--foreground))' : undefined,
                textShadow: scale > 1.15 ? `0 0 ${(scale - 1) * 16}px rgba(99, 102, 241, 0.3)` : 'none',
                fontWeight: scale > 1.1 ? '600' : '500',
              }}
            >
              {t(item.key as any)}
            </span>

            {/* 纯净的底部光点指示器 */}
            <div 
              className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.max(0, (scale - 1.05) * 16)}px`,
                height: `${Math.max(0, (scale - 1.05) * 1.5)}px`,
                background: scale > 1.05 ? `radial-gradient(ellipse, rgba(99, 102, 241, ${(scale - 1) * 1.5}) 0%, rgba(99, 102, 241, ${(scale - 1) * 0.8}) 50%, transparent 100%)` : 'transparent',
                opacity: Math.max(0, (scale - 1.05) * 2),
                boxShadow: scale > 1.15 ? `0 0 ${(scale - 1) * 12}px rgba(99, 102, 241, 0.5)` : 'none',
              }}
            />
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
                {siteConfig.ui.navigation.enableDockEffect ? (
                  <DockNavigation navItems={navItems} currentLocale={currentLocale} />
                ) : (
                  <div className="flex items-center space-x-6">
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
                )}
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