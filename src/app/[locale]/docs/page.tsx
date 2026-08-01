import { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ArrowUpRight, BookOpen, Code2, Library, LineChart, Rocket } from 'lucide-react'
import { siteConfig } from '@/config/site.config'
import { getAllDocCategories } from '@/lib/docs'
import { buildLocalizedPath } from '@/lib/i18n-utils'

const handbookThemes = [
  {
    card: 'bg-[#1d1d1f] text-white',
    badge: 'bg-white/[0.12] text-white',
    line: 'border-white/15',
  },
  {
    card: 'bg-[#f5f5f7] text-[#1d1d1f] dark:bg-[#1d1d1f] dark:text-white',
    badge: 'bg-white text-[#0071e3] dark:bg-white/10 dark:text-[#2997ff]',
    line: 'border-slate-900/10 dark:border-white/15',
  },
  {
    card: 'bg-[#f5f5f7] text-[#1d1d1f] dark:bg-[#1d1d1f] dark:text-white',
    badge: 'bg-white text-[#bf4800] dark:bg-white/10 dark:text-[#ff9f0a]',
    line: 'border-stone-900/10 dark:border-white/15',
  },
  {
    card: 'bg-[#f5f5f7] text-[#1d1d1f] dark:bg-[#1d1d1f] dark:text-white',
    badge: 'bg-white text-[#008009] dark:bg-white/10 dark:text-[#30d158]',
    line: 'border-emerald-900/10 dark:border-white/15',
  },
]

const categoryIcons = {
  BookOpen,
  LineChart,
  Code: Code2,
  Rocket,
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'docs' })
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: `${t('title')} | ${siteConfig.name}`,
      description: t('description'),
      type: 'website',
    },
  }
}

export default async function DocsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'docs' })
  const categories = getAllDocCategories(locale)
  const totalArticles = categories.reduce((total, category) => total + category.docs.length, 0)

  return (
    <div className="container mx-auto px-5 pb-10 pt-6 sm:px-8 sm:pb-12 sm:pt-7">
      <div className="mx-auto max-w-6xl">
        <section className="border-b border-foreground/10 pb-8 pt-2 sm:pb-9 sm:pt-3">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Library className="h-4 w-4" />
                <h1>{t('title')}</h1>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-8 sm:gap-12">
              <div>
                <dd className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{categories.length}</dd>
                <dt className="mt-1 text-xs text-muted-foreground">{t('categories')}</dt>
              </div>
              <div>
                <dd className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{totalArticles}</dd>
                <dt className="mt-1 text-xs text-muted-foreground">{t('chapters')}</dt>
              </div>
            </dl>
          </div>
        </section>

        {categories.length > 0 ? (
          <section className="pt-8 sm:pt-10">
            <div className="mb-8">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('collectionEyebrow')}</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  {t('collectionTitle')}
                </h2>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {categories.map((category, index) => {
                const firstDoc = category.docs[0]
                const href = buildLocalizedPath(`/docs/${firstDoc.slug}`, locale as 'zh' | 'en')
                const theme = handbookThemes[index % handbookThemes.length]
                const Icon = categoryIcons[category.icon as keyof typeof categoryIcons] || BookOpen
                const visibleDocs = category.docs.slice(0, 3)
                const remainingDocs = category.docs.length - visibleDocs.length

                return (
                  <Link
                    key={category.slug}
                    href={href as any}
                    className={`group relative min-h-[24rem] overflow-hidden rounded-[1.75rem] p-7 transition duration-500 hover:-translate-y-1 hover:shadow-xl sm:p-8 ${theme.card}`}
                  >
                    <div className="relative z-10 flex h-full flex-col">
                      <div className="flex items-start justify-between">
                        <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl backdrop-blur-md ${theme.badge}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] opacity-55">
                          {t('handbook')} {String(index + 1).padStart(2, '0')}
                          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-3xl font-semibold tracking-[-0.045em] sm:text-4xl">{category.title}</h3>
                        <p className="mt-4 max-w-md text-sm leading-6 opacity-65">{category.description}</p>
                      </div>

                      <div className={`mt-auto border-t pt-5 ${theme.line}`}>
                        <div className="mb-4 flex items-center justify-between text-xs font-medium opacity-55">
                          <span>{t('contents')}</span>
                          <span>{category.docs.length} {t('chapters')}</span>
                        </div>
                        <ol className="space-y-2.5">
                          {visibleDocs.map((doc, docIndex) => (
                            <li key={doc.slug} className="flex items-center gap-3 text-sm">
                              <span className="w-5 font-mono text-xs opacity-40">{String(docIndex + 1).padStart(2, '0')}</span>
                              <span className="truncate opacity-80">{doc.title}</span>
                            </li>
                          ))}
                        </ol>
                        {remainingDocs > 0 && (
                          <p className="mt-3 pl-8 text-xs opacity-45">
                            {t('moreChapters', { count: remainingDocs })}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        ) : (
          <div className="py-24 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">{t('empty')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
