'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { BookOpen, FileText, Home, Images, UserRound, type LucideIcon } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'
import { siteConfig } from '@/config/site.config'
import { buildLocalizedPath, detectLocaleFromPath } from '@/lib/i18n-utils'

type DockItemProps = {
  href: string
  label: string
  active: boolean
  icon: LucideIcon
}

function NavigationItem({ href, label, active, icon: Icon }: DockItemProps) {
  return (
    <Link
      href={href as any}
      className="group flex w-[38px] flex-col items-center justify-center gap-1 sm:w-[68px]"
      aria-current={active ? 'page' : undefined}
    >
      <span
        className={`nav-product-icon flex h-7 w-10 items-center justify-center transition-colors duration-200 ${
          active
            ? 'text-[#0071e3] dark:text-[#2997ff]'
            : 'text-[#1d1d1f]/72 group-hover:text-[#1d1d1f] dark:text-white/70 dark:group-hover:text-white'
        }`}
      >
        <Icon className="h-6 w-6" strokeWidth={1.35} />
      </span>
      <span className={`relative text-[10px] leading-none transition-colors ${
        active
          ? 'font-semibold text-[#1d1d1f] dark:text-white'
          : 'font-medium text-[#1d1d1f]/70 group-hover:text-[#1d1d1f] dark:text-white/65 dark:group-hover:text-white'
      }`}>
        {label}
        {active && <span className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#0071e3] dark:bg-[#2997ff]" />}
      </span>
    </Link>
  )
}

export function Header() {
  const t = useTranslations('navigation')
  const pathname = usePathname()
  const locale = detectLocaleFromPath(pathname)

  const isBlogPost = /\/blog\/[^/]+\/?$/.test(pathname)
  const isPlogDetail = /\/plog\/[^/]+\/?$/.test(pathname)
  const isDocDetail = /\/docs\/[^/]+\/[^/]+\/?$/.test(pathname)

  if (isBlogPost || isPlogDetail || isDocDetail) return null

  const items = [
    {
      key: 'home',
      href: buildLocalizedPath('/', locale),
      icon: Home,
    },
    {
      key: 'blog',
      href: buildLocalizedPath('/blog', locale),
      icon: FileText,
    },
    {
      key: 'plog',
      href: buildLocalizedPath('/plog', locale),
      icon: Images,
    },
    {
      key: 'docs',
      href: buildLocalizedPath('/docs', locale),
      icon: BookOpen,
    },
    {
      key: 'about',
      href: buildLocalizedPath('/about', locale),
      icon: UserRound,
    },
  ] as const

  const isActive = (href: string) => {
    const current = pathname.replace(/\/$/, '') || '/'
    const target = href.replace(/\/$/, '') || '/'
    if (target === '/' || target === `/${locale}`) return current === target
    return current.startsWith(target)
  }

  return (
    <header className="global-nav sticky top-0 z-50 bg-white/90 backdrop-blur-xl dark:bg-black/90">
      <div className="mx-auto flex h-16 max-w-5xl items-center px-3 sm:px-8">
        <Link
          href={items[0].href as any}
          className="siri-logo shrink-0"
          aria-label={siteConfig.author.name}
        >
          <span className="siri-logo-halo" aria-hidden="true" />
          <span className="siri-logo-ring" aria-hidden="true" />
          <span className="siri-logo-core">
            {siteConfig.author.avatar ? (
              // Use the configured image URL directly so the header logo stays lightweight.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={siteConfig.author.avatar}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              'A'
            )}
          </span>
        </Link>

        <nav className="site-section-nav min-w-0 flex-1" aria-label="Primary navigation">
        <div className="mx-auto flex h-16 items-center justify-center gap-0 sm:gap-3">
          {items.map((item) => {
            const active = isActive(item.href)
            return (
              <NavigationItem
                key={item.key}
                href={item.href}
                label={t(item.key)}
                active={active}
                icon={item.icon}
              />
            )
          })}
        </div>
        </nav>

        <div className="flex shrink-0 items-center gap-0.5">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
