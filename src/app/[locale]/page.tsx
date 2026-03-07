import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site.config'
import { buildLocalizedPath } from '@/lib/i18n-utils'
import { ArrowRight } from 'lucide-react'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale })

  return (
    <div className="w-full px-4 flex flex-col items-center text-center py-8">
      <div className="w-full max-w-xl flex flex-col items-center gap-10">

          {/* 姓名 */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              <span className="text-muted-foreground font-normal">{t('hero.greeting')} </span>
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
                }}
              >
                {siteConfig.author.name}
              </span>
            </h1>

            {/* 签名句 — 来自 hero.description */}
            <p className="text-base md:text-lg text-muted-foreground italic leading-relaxed">
              &ldquo;{t('hero.description')}&rdquo;
            </p>
          </div>

          {/* 装饰分隔 */}
          <div className="flex items-center gap-4 w-full max-w-[180px]">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-primary/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              <div className="w-1 h-1 rounded-full bg-primary/30" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {/* 按钮组 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="group gap-2">
              <Link href={buildLocalizedPath('/blog', locale as any) as any}>
                {t('navigation.blog')}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={buildLocalizedPath('/about', locale as any) as any}>
                {t('navigation.about')}
              </Link>
            </Button>
          </div>

          {/* 社交链接 */}
          <div className="flex items-center gap-2">
            {siteConfig.social.github && (
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="lg-btn-ghost p-2.5 rounded-full text-foreground/50 hover:text-foreground transition-all"
                title="GitHub"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
            )}
            {(siteConfig.social.twitter || siteConfig.social.x) && (
              <a
                href={siteConfig.social.twitter || siteConfig.social.x}
                target="_blank"
                rel="noopener noreferrer"
                className="lg-btn-ghost p-2.5 rounded-full text-foreground/50 hover:text-foreground transition-all"
                title="X / Twitter"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.213 5.567 5.95-5.567zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            )}
            {siteConfig.social.email && (
              <a
                href={`mailto:${siteConfig.social.email}`}
                className="lg-btn-ghost p-2.5 rounded-full text-foreground/50 hover:text-foreground transition-all"
                title="Email"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
            )}
          </div>

        </div>
    </div>
  )
}
