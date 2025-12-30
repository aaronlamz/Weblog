import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { siteConfig } from '@/config/site.config'
import { ContactLinks } from '@/components/contact-links'
import { Code2, Heart, Quote } from 'lucide-react'
import Image from 'next/image'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: `${t('title')} | ${siteConfig.name}`,
      description: t('description'),
      type: 'website',
    },
    twitter: {
      card: siteConfig.seo.twitterCard,
      title: `${t('title')} | ${siteConfig.name}`,
      description: t('description'),
    },
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header with avatar */}
        <header className="mb-8 text-center relative">
          <div className="inline-block mb-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-primary/20 hover:ring-primary/40 transition-all duration-300 hover:scale-105">
              <Image
                src="https://github.com/aaronlamz.png"
                alt={siteConfig.author.name}
                width={96}
                height={96}
                className="object-cover"
                priority
              />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('description')}
          </p>
        </header>

        <div className="space-y-6">
          {/* Intro Card */}
          <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border/40 hover:border-border/60 transition-all">
            <p className="text-base leading-relaxed text-foreground/90">
              {t('intro')}
            </p>
            <p className="text-base leading-relaxed text-muted-foreground mt-3">
              {t('bio')}
            </p>
          </div>

          {/* Working On Card */}
          <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border/40 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Code2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">{t('workingOnTitle')}</h2>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">
              {t('currentWork')}
            </p>
          </div>

          {/* Beyond Code Card */}
          <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border/40 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5 transition-all group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">{t('beyondCodeTitle')}</h2>
            </div>
            <p className="text-base leading-relaxed text-muted-foreground">
              {t('beyondCode')}
            </p>
          </div>

          {/* Connect Card */}
          <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 border border-border/40">
            <h2 className="text-xl font-semibold text-foreground mb-3">{t('connectTitle')}</h2>
            <p className="text-base leading-relaxed text-muted-foreground mb-4">
              {t('connect')}
            </p>
            <ContactLinks />
          </div>

          {/* Quote Card */}
          <div className="relative mt-8">
            <div className="bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm rounded-xl p-8 border border-border/40">
              <Quote className="w-8 h-8 text-primary/30 mb-3 mx-auto" />
              <p className="text-center text-lg italic text-foreground/80 leading-relaxed">
                "{t('quote')}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}