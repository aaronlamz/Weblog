import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Images } from 'lucide-react'
import { getLocalizedPlogEntries } from '@/config/plog.config'
import { buildLocalizedPath } from '@/lib/i18n-utils'

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

        <section className="grid gap-5 pt-7 sm:grid-cols-2 sm:pt-8" aria-label={t('allEntries')}>
          {entries.map((entry) => (
            <Link
              key={entry.slug}
              href={buildLocalizedPath(`/plog/${entry.slug}`, locale as any) as any}
              className="group block"
            >
              <article>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#f5f5f7] dark:bg-[#1d1d1f]">
                  {entry.cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={entry.cover}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.02]"
                    />
                  )}
                  <span className="absolute bottom-4 right-4 rounded-full bg-black/45 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
                    {t('photoCount', { count: entry.photoCount })}
                  </span>
                </div>
                <div className="px-1 pb-2 pt-4">
                  <h2 className="text-xl font-semibold tracking-[-0.025em] transition-colors group-hover:text-primary sm:text-2xl">
                    {entry.title}
                  </h2>
                  {entry.description && <p className="mt-1 text-sm text-muted-foreground">{entry.description}</p>}
                </div>
              </article>
            </Link>
          ))}
        </section>
      </div>
    </div>
  )
}
