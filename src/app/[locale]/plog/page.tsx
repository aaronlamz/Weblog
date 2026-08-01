import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Images, MapPin } from 'lucide-react'
import { getLocalizedPlogEntries } from '@/config/plog.config'
import { buildLocalizedPath } from '@/lib/i18n-utils'
import { PlogMasonry } from '@/components/plog-masonry'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'plog' })
  return { title: t('title'), description: t('description') }
}

export default async function PlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'plog' })
  const entries = getLocalizedPlogEntries(locale)
  const photoCount = entries.reduce((count, entry) => count + entry.photoCount, 0)

  return (
    <div className="container mx-auto px-5 pb-10 pt-6 sm:px-8 sm:pb-12 sm:pt-7">
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-foreground/10 pb-8 pt-2 sm:pb-9 sm:pt-3">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Images className="h-4 w-4" />
              <h1>{t('title')}</h1>
            </div>
            <dl className="grid grid-cols-2 gap-8 sm:gap-12">
              <div>
                <dd className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{entries.length}</dd>
                <dt className="mt-1 text-xs text-muted-foreground">{t('entries')}</dt>
              </div>
              <div>
                <dd className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{photoCount}</dd>
                <dt className="mt-1 text-xs text-muted-foreground">{t('photos')}</dt>
              </div>
            </dl>
          </div>
        </header>

        <section className="pt-7 sm:pt-8" aria-label={t('allEntries')}>
          <PlogMasonry>
          {entries.map((entry) => (
            <Link
              key={entry.slug}
              href={buildLocalizedPath(`/plog/${entry.slug}`, locale as any) as any}
              className="group block w-full"
              aria-label={`${entry.title}, ${t('photoCount', { count: entry.photoCount })}`}
            >
              <article>
                <AlbumPreview
                  slides={entry.slides}
                  photoLabel={t('photoCount', { count: entry.photoCount })}
                />
                <div className="px-1 pb-1 pt-3.5">
                  <h2 className="text-base font-semibold leading-snug tracking-[-0.02em] transition-colors group-hover:text-primary sm:text-lg">
                    {entry.title}
                  </h2>
                  {entry.description && <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">{entry.description}</p>}
                  {(entry.location || entry.date) && (
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground/80">
                      {entry.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {entry.location}
                        </span>
                      )}
                      {entry.date && <time dateTime={entry.date}>{entry.date}</time>}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
          </PlogMasonry>
        </section>
      </div>
    </div>
  )
}

function AlbumPreview({
  slides,
  photoLabel,
}: {
  slides: Array<{ id: string; image: string; alt: string }>
  photoLabel: string
}) {
  const previewSlides = slides.slice(0, 4)
  const isAlbum = previewSlides.length > 1

  return (
    <div className={`relative overflow-hidden rounded-[1.4rem] bg-[#f5f5f7] dark:bg-[#1d1d1f] ${isAlbum ? 'aspect-[4/5]' : 'aspect-square'}`}>
      <div className={isAlbum ? 'grid h-full grid-cols-2 grid-rows-2 gap-px bg-background' : 'h-full'}>
        {previewSlides.map((slide, index) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={slide.id}
            src={slide.image}
            alt=""
            loading="lazy"
            className={`h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.025] ${!isAlbum && index === 0 ? '' : 'min-h-0'}`}
          />
        ))}
      </div>
      <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md">
        <Images className="h-3 w-3" />
        {photoLabel}
      </span>
    </div>
  )
}
