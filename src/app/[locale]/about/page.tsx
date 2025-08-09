import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { siteConfig } from '@/config/site.config'

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
  const t = await getTranslations('about')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('title')}</h1>
          <p className="text-xl text-muted-foreground">
            {t('description')}
          </p>
        </header>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed">
            {t('intro')}
          </p>

          <p>
            {t('bio')}
          </p>

          <h2>{t('workingOnTitle')}</h2>
          <p>
            {t('currentWork')}
          </p>

          <h2>{t('beyondCodeTitle')}</h2>
          <p>
            {t('beyondCode')}
          </p>

          <h2>{t('connectTitle')}</h2>
          <p>
            {t('connect')}
          </p>

          <div className="mt-12 p-6 bg-secondary rounded-lg">
            <p className="mb-0 text-center italic">
              "{t('quote')}"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}