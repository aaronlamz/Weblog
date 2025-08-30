'use client'

import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { siteConfig } from '@/config/site.config'
import { buildLocalizedPath, detectLocaleFromPath } from '@/lib/i18n-utils'
import { 
  Github, 
  Twitter, 
  Mail, 
  Rss, 
  ArrowUp,
  ArrowLeft,
  Home,
  Linkedin
} from 'lucide-react'

export function Footer() {
  const t = useTranslations('footer')
  const router = useRouter()
  const pathname = usePathname()
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showFloatingBar, setShowFloatingBar] = useState(false)
  const [isHoveringBar, setIsHoveringBar] = useState(false)
  const [mounted, setMounted] = useState(false)
  const idleTimer = useRef<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check if current page is a blog post
  // Patterns: /blog/[slug] (zh default) or /en/blog/[slug] (en)
  // Also handles BASE_PATH like /Weblog/blog/[slug] or /Weblog/en/blog/[slug]
  const isBlogPost = mounted && /\/blog\/[^\/]+\/?$/.test(pathname)
  const currentLocale = mounted ? detectLocaleFromPath(pathname) : 'zh'

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setShowScrollTop(y > 400)

      // 显示浮动条，停止滚动后延迟隐藏
      if (y <= 8) {
        setShowFloatingBar(false)
        if (idleTimer.current) window.clearTimeout(idleTimer.current)
        return
      }

      setShowFloatingBar(true)
      if (idleTimer.current) window.clearTimeout(idleTimer.current)
      idleTimer.current = window.setTimeout(() => {
        if (!isHoveringBar) {
          setShowFloatingBar(false)
        }
      }, 1200)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (idleTimer.current) window.clearTimeout(idleTimer.current)
    }
  }, [isHoveringBar])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const goBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      // Fallback to blog list
      router.push(buildLocalizedPath('/blog', currentLocale) as any)
    }
  }

  const goHome = () => {
    router.push(buildLocalizedPath('/', currentLocale) as any)
  }

  const socialLinks = [
    { 
      name: 'GitHub', 
      href: siteConfig.social.github,
      icon: Github,
      external: true 
    },
    { 
      name: 'Twitter', 
      href: siteConfig.social.twitter,
      icon: Twitter,
      external: true 
    },
    { 
      name: 'LinkedIn', 
      href: siteConfig.social.linkedin,
      icon: Linkedin,
      external: true 
    },
    { 
      name: 'Email', 
      href: siteConfig.social.email ? `mailto:${siteConfig.social.email}` : undefined,
      icon: Mail,
      external: false 
    },
    { 
      name: 'RSS', 
      href: '/rss.xml',
      icon: Rss,
      external: false 
    },
  ].filter(link => link.href) // 只显示配置了的链接
  const hasSocial = socialLinks.length > 0

  return (
    <>
      {/* 文章页面专用的返回按钮 */}
      {isBlogPost && (
        <div className={`
          fixed top-6 left-4 z-50
          transition-all duration-300 ease-out
          ${showScrollTop 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-100 -translate-y-4'
          }
        `}>
          <div className="flex items-center gap-3">
            {/* 返回按钮 */}
            <button
              onClick={goBack}
              className="rounded-full p-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg group transition-all duration-200 hover:scale-105"
              title="返回"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            
            {/* 首页按钮 */}
            <button
              onClick={goHome}
              className="rounded-full p-3 bg-background/90 backdrop-blur-lg border border-border/30 hover:bg-background/95 text-foreground shadow-lg group transition-all duration-200 hover:scale-105"
              title="首页"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* 悬浮式底部工具条（无内容时不渲染） */}
      {(hasSocial || showScrollTop) && (
        <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
          <div className="flex justify-center pb-6 px-4">
            <div
              className={
                `rounded-full px-6 py-3
                 transition-all duration-300 ease-out transform
                 ${showFloatingBar ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}
                 bg-white/8 dark:bg-black/25
                 border border-white/10 dark:border-white/5
                 ring-1 ring-white/5 dark:ring-white/0
                 backdrop-blur-2xl backdrop-saturate-150
                 shadow-xl shadow-black/20`
              }
              onMouseEnter={() => {
                setIsHoveringBar(true)
                if (idleTimer.current) window.clearTimeout(idleTimer.current)
                setShowFloatingBar(true)
              }}
              onMouseLeave={() => {
                setIsHoveringBar(false)
                if (idleTimer.current) window.clearTimeout(idleTimer.current)
                idleTimer.current = window.setTimeout(() => {
                  if (!isHoveringBar && window.scrollY > 8) {
                    setShowFloatingBar(false)
                  }
                }, 800)
              }}
            >
              <div className="flex items-center space-x-4">
                {/* 社交链接（可为空） */}
                {hasSocial && socialLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-all duration-200 group"
                      title={link.name}
                    >
                      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </a>
                  )
                })}
                
                {/* 分隔线：仅当左右两侧都有内容时显示 */}
                {hasSocial && showScrollTop && (
                  <div className="w-px h-4 bg-border/60" />
                )}
                
                {/* 回到顶部按钮（可单独显示） */}
                {showScrollTop && (
                  <button
                    onClick={scrollToTop}
                    className="p-2 rounded-full text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-all duration-200 group"
                    title={t('scrollToTop')}
                  >
                    <ArrowUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 传统底部 - 版权信息 */}
      <footer className="mt-20 border-t bg-background/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {siteConfig.name}. {t('copyright')}
            </div>
            <div className="text-xs text-muted-foreground/60">
              {t('builtWith')}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
} 