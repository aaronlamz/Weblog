import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Images, MapPin } from 'lucide-react'
import { getLocalizedPlogEntries } from '@/config/plog.config'
import { buildLocalizedPath } from '@/lib/i18n-utils'
import { PlogAlbumPreview } from '@/components/plog-album-preview'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'plog' })
  return { title: t('title'), description: t('description') }
}

export default async function PlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'plog' })
  const entries = getLocalizedPlogEntries(locale)
  const photoCount = entries.reduce(
    (count, entry) => count + entry.photoCount,
    0,
  )
  const timeline = groupEntriesByYear(entries, locale)

  return (
    <div className="container mx-auto px-5 pb-10 pt-6 sm:px-8 sm:pb-12 sm:pt-7">
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-foreground/10 pb-8 pt-2 sm:pb-9 sm:pt-3">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Images className="h-4 w-4" />
                <h1>{t('title')}</h1>
              </div>
              <p className="mt-2 text-sm text-muted-foreground/80">
                {t('description')}
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-8 sm:gap-12">
              <div>
                <dd className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  {entries.length}
                </dd>
                <dt className="mt-1 text-xs text-muted-foreground">
                  {t('entries')}
                </dt>
              </div>
              <div>
                <dd className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  {photoCount}
                </dd>
                <dt className="mt-1 text-xs text-muted-foreground">
                  {t('photos')}
                </dt>
              </div>
            </dl>
          </div>
        </header>

        <section className="pt-8 sm:pt-10" aria-label={t('allEntries')}>
          <div className="space-y-14 sm:space-y-16">
            {timeline.map((group) => (
              <section key={group.year}>
                <div className="mb-7 flex items-baseline gap-3 border-b border-foreground/10 pb-3 sm:mb-9">
                  <h2 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                    {group.year}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {t('entryCount', { count: group.entries.length })}
                  </span>
                </div>

                <div className="relative space-y-10 before:absolute before:bottom-2 before:left-[2.15rem] before:top-2 before:w-px before:bg-foreground/10 sm:space-y-14 sm:before:left-[2.65rem]">
                  {group.entries.map((entry) => (
                    <Link
                      key={entry.slug}
                      href={
                        buildLocalizedPath(
                          `/plog/${entry.slug}`,
                          locale as any,
                        ) as any
                      }
                      className="group relative grid grid-cols-[4.3rem_minmax(0,1fr)] gap-4 sm:grid-cols-[5.3rem_minmax(0,1fr)] sm:gap-7"
                      aria-label={`${entry.title}, ${entry.displayDate}, ${t('photoCount', { count: entry.photoCount })}`}
                    >
                      <time
                        dateTime={entry.date}
                        className="relative z-10 self-start bg-background pr-2 text-right"
                      >
                        <span className="block text-2xl font-semibold leading-none tracking-[-0.04em] sm:text-3xl">
                          {entry.day}
                        </span>
                        <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                          {entry.month}
                        </span>
                        <span
                          className="absolute -right-[0.34rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-foreground transition-transform group-hover:scale-125"
                          aria-hidden="true"
                        />
                      </time>

                      <article className="max-w-[38rem] border-b border-foreground/10 pb-10 sm:pb-14">
                        <h3 className="text-base font-semibold leading-snug tracking-[-0.02em] transition-colors group-hover:text-primary sm:text-lg">
                          {entry.title}
                        </h3>
                        {entry.description && (
                          <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
                            {entry.description}
                          </p>
                        )}
                        <div className="mt-3.5 max-w-[26rem]">
                          <PlogAlbumPreview
                            slides={entry.slides}
                            photoLabel={t('photoCount', {
                              count: entry.photoCount,
                            })}
                          />
                        </div>
                        {entry.location && (
                          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground/80">
                            <MapPin className="h-3.5 w-3.5" />
                            {entry.location}
                          </div>
                        )}
                      </article>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

type LocalizedPlogEntry = ReturnType<typeof getLocalizedPlogEntries>[number]

function groupEntriesByYear(entries: LocalizedPlogEntry[], locale: string) {
  const language = locale === 'zh' ? 'zh-CN' : 'en-US'
  const monthFormatter = new Intl.DateTimeFormat(language, {
    month: locale === 'zh' ? 'numeric' : 'short',
    timeZone: 'UTC',
  })
  const dayFormatter = new Intl.DateTimeFormat(language, {
    day: '2-digit',
    timeZone: 'UTC',
  })
  const dateFormatter = new Intl.DateTimeFormat(language, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
  const groups = new Map<
    string,
    {
      year: string
      entries: Array<
        LocalizedPlogEntry & {
          displayDate: string
          day: string
          month: string
        }
      >
    }
  >()

  entries.forEach((entry) => {
    const date = new Date(`${entry.date}T00:00:00Z`)
    const year = entry.date.slice(0, 4)
    const group = groups.get(year) ?? { year, entries: [] }
    group.entries.push({
      ...entry,
      displayDate: dateFormatter.format(date),
      day: dayFormatter.format(date).replace('日', ''),
      month: monthFormatter.format(date),
    })
    groups.set(year, group)
  })

  return Array.from(groups.values())
}
