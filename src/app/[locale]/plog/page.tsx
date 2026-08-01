import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Images } from 'lucide-react'
import { PlogSlideshow } from '@/components/plog-slideshow'
import { getLocalizedPlogItems } from '@/config/plog.config'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'plog' })
  return { title: t('title'), description: t('description') }
}

export default async function PlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'plog' })
  const slides = getLocalizedPlogItems(locale)

  return (
    <div className="container mx-auto px-5 pb-10 pt-6 sm:px-8 sm:pb-12 sm:pt-7">
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-foreground/10 pb-8 pt-2 sm:pb-9 sm:pt-3">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Images className="h-4 w-4" />
              <h1>{t('title')}</h1>
            </div>
            <dl>
              <div>
                <dd className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{slides.length}</dd>
                <dt className="mt-1 text-xs text-muted-foreground">{t('frames')}</dt>
              </div>
            </dl>
          </div>
        </header>

        <section className="pt-7 sm:pt-8" aria-label={t('description')}>
          <PlogSlideshow slides={slides} />
        </section>
      </div>
    </div>
  )
}
