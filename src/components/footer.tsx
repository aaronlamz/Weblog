'use client'

import { useState, useEffect } from 'react'
import { siteConfig } from '@/config/site.config'
import { 
  Github, 
  Twitter, 
  Mail, 
  Rss, 
  ArrowUp,
  Linkedin
} from 'lucide-react'

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
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

  return (
    <>
      {/* 悬浮式底部社交链接栏 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
        <div className="flex justify-center pb-6 px-4">
          <div className="pointer-events-auto bg-background/60 backdrop-blur-lg border border-border/30 rounded-full px-6 py-3 shadow-lg shadow-black/10">
            <div className="flex items-center space-x-4">
              {/* 社交链接 */}
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="p-2 rounded-full text-foreground/60 hover:text-foreground hover:bg-accent/50 transition-all duration-200 group"
                    title={link.name}
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </a>
                )
              })}
              
              {/* 分隔线 */}
              <div className="w-px h-4 bg-border/60" />
              
              {/* 回到顶部按钮 */}
              {showScrollTop && (
                <button
                  onClick={scrollToTop}
                  className="p-2 rounded-full text-foreground/60 hover:text-foreground hover:bg-accent/50 transition-all duration-200 group"
                  title="回到顶部"
                >
                  <ArrowUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 传统底部 - 版权信息 */}
      <footer className="mt-20 border-t bg-background/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </div>
            <div className="text-xs text-muted-foreground/60">
              Built with Next.js, TypeScript, and Tailwind CSS
            </div>
          </div>
        </div>
      </footer>
    </>
  )
} 