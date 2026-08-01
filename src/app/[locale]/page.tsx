import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ArrowRight, Github, Mail } from 'lucide-react'
import { siteConfig } from '@/config/site.config'
import { buildLocalizedPath } from '@/lib/i18n-utils'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  const localizedPath = (path: string) => buildLocalizedPath(path, locale as 'zh' | 'en') as any

  return (
    <div className="home-shell flex w-full items-center justify-center overflow-hidden px-5 py-4 sm:px-8 sm:py-6">
      <section className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <h1 className="home-headline home-reveal home-reveal-delay-1 max-w-4xl py-2 text-balance text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[1.06] tracking-[-0.06em]">
          <span className="home-headline-text" data-text={t('headline')}>
            {t('headline')}
          </span>
        </h1>

        <p className="home-reveal home-reveal-delay-2 mt-5 max-w-xl text-balance text-base leading-7 text-muted-foreground sm:text-lg">
          {t('description')}
        </p>

        <div className="home-reveal home-reveal-delay-3 mt-7 flex items-center justify-center gap-3">
          <Link
            href={localizedPath('/blog')}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition duration-300 hover:scale-[1.02] hover:opacity-85"
          >
            {t('primaryAction')}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href={localizedPath('/about')}
            className="inline-flex h-11 items-center rounded-full border border-foreground/15 bg-background/45 px-5 text-sm font-medium backdrop-blur-xl transition duration-300 hover:border-foreground/30 hover:bg-background/75"
          >
            {t('secondaryAction')}
          </Link>
        </div>

        <div className="home-reveal home-reveal-delay-3 mt-7 flex items-center justify-center gap-1 text-foreground/40">
          {siteConfig.social.github && (
            <a className="home-social-link" href={siteConfig.social.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github className="h-4 w-4" />
            </a>
          )}
          {siteConfig.social.email && (
            <a className="home-social-link" href={`mailto:${siteConfig.social.email}`} aria-label="Email">
              <Mail className="h-4 w-4" />
            </a>
          )}
        </div>
      </section>
    </div>
  )
}
