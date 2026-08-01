import { notFound } from 'next/navigation'
import { getDocBySlug, getAllDocCategories, getAllDocSlugs } from '@/lib/docs'
import { locales } from '@/i18n/config'
import { getTranslations } from 'next-intl/server'
import { buildLocalizedPath } from '@/lib/i18n-utils'
import { DocsSidebar } from '@/components/docs-sidebar'
import { DocsTopBar } from '@/components/docs-top-bar'
import ArticleWithTOC from '@/components/article-with-toc'
import LazyComments from '@/components/lazy-comments'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock3 } from 'lucide-react'

interface DocPageProps {
  params: Promise<{
    slug: string[]
    locale: string
  }>
}

export async function generateStaticParams() {
  const allParams: Array<{ slug: string[]; locale: string }> = []

  for (const locale of locales) {
    const slugs = getAllDocSlugs(locale)
    for (const slug of slugs) {
      allParams.push({ slug, locale })
    }
  }

  return allParams
}

export async function generateMetadata({ params }: DocPageProps) {
  const { slug, locale } = await params
  const doc = getDocBySlug(slug, locale)

  if (!doc) return {}

  return {
    title: doc.title,
    description: doc.description,
    openGraph: {
      title: `${doc.title} | ${doc.categoryTitle}`,
      description: doc.description,
      type: 'article',
    },
  }
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug, locale } = await params
  const doc = getDocBySlug(slug, locale)
  const t = await getTranslations({ locale, namespace: 'docs' })

  if (!doc) {
    notFound()
  }

  const categories = getAllDocCategories(locale)
  // 只取当前文档所在的分类
  const currentCategory = categories.find(cat => cat.slug === doc.category)
  const currentCategoryDocs = currentCategory ? [currentCategory] : []
  const chapterIndex = currentCategory?.docs.findIndex(item => item.slug === doc.slug) ?? -1
  const previousDoc = chapterIndex > 0 ? currentCategory?.docs[chapterIndex - 1] : undefined
  const nextDoc = currentCategory && chapterIndex >= 0 && chapterIndex < currentCategory.docs.length - 1
    ? currentCategory.docs[chapterIndex + 1]
    : undefined
  const hasSections = /^\s{0,3}#{2,3}\s+\S/m.test(doc.content)
  const docsHref = buildLocalizedPath('/docs', locale as any)
  const homeHref = buildLocalizedPath('/', locale as any)

  return (
    <>
      {/* Top bar: back / home / dark mode */}
      <DocsTopBar
        backHref={docsHref}
        backLabel={t('backToDocs')}
        homeHref={homeHref}
      />

      <div className="mx-auto max-w-[1300px] px-5 pb-12 pt-5 sm:px-8 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10">
          {/* Sidebar: only current category */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <DocsSidebar categories={currentCategoryDocs} />
            </div>
          </aside>

          {/* Content */}
          <article className="min-w-0">
            <header className={`${hasSections ? 'grid lg:grid-cols-[minmax(0,760px)_180px] lg:gap-10' : 'mx-auto max-w-[760px]'} border-b border-foreground/[0.08] pb-6 lg:pb-7`}>
              <div>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-medium text-muted-foreground sm:text-xs">
                <span className="uppercase tracking-[0.15em] text-primary">{doc.categoryTitle}</span>
                <span className="h-1 w-1 rounded-full bg-foreground/20" />
                {currentCategory && chapterIndex >= 0 && (
                  <span>{t('chapterProgress', { current: chapterIndex + 1, total: currentCategory.docs.length })}</span>
                )}
                <span className="h-1 w-1 rounded-full bg-foreground/20" />
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" />
                  {t('readingTime', { minutes: Math.ceil(doc.readingTime.minutes) })}
                </span>
              </div>
              <h1 className="text-balance text-[2rem] font-semibold leading-[1.14] tracking-[-0.035em] sm:text-[2.6rem]">
                {doc.title}
              </h1>
              {doc.description && (
                <p className="mt-3 max-w-[720px] text-base leading-7 text-foreground/60 sm:text-[1.0625rem]">
                  {doc.description}
                </p>
              )}
              </div>
            </header>

            <div className="pt-6">
              <ArticleWithTOC content={doc.content} tocPosition="right" />
            </div>

            {(previousDoc || nextDoc) && (
              <nav className={`${hasSections ? 'grid lg:grid-cols-[minmax(0,760px)_180px] lg:gap-10' : 'mx-auto max-w-[760px]'} gap-3 border-t border-foreground/[0.08] pt-6`} aria-label={t('chapterNavigation')}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {previousDoc ? (
                    <Link
                      href={buildLocalizedPath(`/docs/${previousDoc.slug}`, locale as any) as any}
                      className="group rounded-2xl border border-foreground/[0.09] p-4 transition-colors hover:bg-foreground/[0.035]"
                    >
                      <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                        {t('previousChapter')}
                      </span>
                      <span className="mt-2 block text-sm font-medium leading-5 text-foreground">{previousDoc.title}</span>
                    </Link>
                  ) : null}
                  {nextDoc && (
                    <Link
                      href={buildLocalizedPath(`/docs/${nextDoc.slug}`, locale as any) as any}
                      className={`group rounded-2xl border border-foreground/[0.09] p-4 text-right transition-colors hover:bg-foreground/[0.035] ${!previousDoc ? 'sm:col-start-2' : ''}`}
                    >
                      <span className="flex items-center justify-end gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                        {t('nextChapter')}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                      <span className="mt-2 block text-sm font-medium leading-5 text-foreground">{nextDoc.title}</span>
                    </Link>
                  )}
                </div>
              </nav>
            )}

            <div className={hasSections ? 'grid lg:grid-cols-[minmax(0,760px)_180px] lg:gap-10' : 'mx-auto max-w-[760px]'}>
              <div>
                <LazyComments locale={locale} />
              </div>
            </div>
          </article>
        </div>
      </div>
    </>
  )
}
