import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { CalendarDays, Images, MapPin } from 'lucide-react'
import { locales } from '@/i18n/config'
import { buildLocalizedPath } from '@/lib/i18n-utils'
import { getLocalizedPlogEntry, plogEntries } from '@/config/plog.config'
import { siteConfig } from '@/config/site.config'
import { DocsTopBar } from '@/components/docs-top-bar'
import { PlogSlideshow } from '@/components/plog-slideshow'

type PlogDetailProps = {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    plogEntries.map((entry) => ({ locale, slug: entry.slug })),
  )
}

export async function generateMetadata({
  params,
}: PlogDetailProps): Promise<Metadata> {
  const { locale, slug } = await params
  const entry = getLocalizedPlogEntry(slug, locale)
  if (!entry) return {}
  const cover = entry.cover
    ? new URL(
        entry.cover.replace(/^\//, ''),
        `${siteConfig.url.replace(/\/$/, '')}/`,
      ).toString()
    : undefined
  return {
    title: entry.title,
    description: entry.description,
    openGraph: cover
      ? { title: entry.title, description: entry.description, images: [cover] }
      : undefined,
  }
}

export default async function PlogDetailPage({ params }: PlogDetailProps) {
  const { locale, slug } = await params
  const entry = getLocalizedPlogEntry(slug, locale)
  const t = await getTranslations({ locale, namespace: 'plog' })
  if (!entry) notFound()
  const displayDate = new Intl.DateTimeFormat(
    locale === 'zh' ? 'zh-CN' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    },
  ).format(new Date(`${entry.date}T00:00:00Z`))

  return (
    <>
      <DocsTopBar
        backHref={buildLocalizedPath('/plog', locale as any)}
        backLabel={t('backToPlog')}
        homeHref={buildLocalizedPath('/', locale as any)}
      />
      <main className="mx-auto max-w-6xl px-5 pb-12 pt-6 sm:px-8 sm:pb-16 sm:pt-8">
        <header className="mb-6 border-b border-foreground/10 pb-6 sm:mb-8 sm:pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <Images className="h-4 w-4" />
            {t('title')}
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
            {entry.title}
          </h1>
          {entry.description && (
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              {entry.description}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <time
              dateTime={entry.date}
              className="inline-flex items-center gap-1.5 font-medium text-foreground/75"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              {displayDate}
            </time>
            {entry.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {entry.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Images className="h-3.5 w-3.5" />
              {t('photoCount', { count: entry.photoCount })}
            </span>
          </div>
        </header>
        <PlogSlideshow
          slides={entry.slides}
          previousLabel={t('previousPhoto')}
          nextLabel={t('nextPhoto')}
          timelineLabel={t('timeline')}
          playLabel={t('play')}
          pauseLabel={t('pause')}
          enterSlideshowLabel={t('enterSlideshow')}
          exitSlideshowLabel={t('exitSlideshow')}
          playMusicLabel={t('playMusic')}
          pauseMusicLabel={t('pauseMusic')}
          nextMusicLabel={t('nextMusic')}
          soundtracks={entry.soundtracks}
        />
      </main>
    </>
  )
}
