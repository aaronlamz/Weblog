import { notFound } from 'next/navigation'
import { getDocBySlug, getAllDocCategories, getAllDocSlugs } from '@/lib/docs'
import { locales } from '@/i18n/config'
import { getTranslations } from 'next-intl/server'
import { buildLocalizedPath } from '@/lib/i18n-utils'
import { DocsSidebar } from '@/components/docs-sidebar'
import { DocsTopBar } from '@/components/docs-top-bar'
import ArticleWithTOC from '@/components/article-with-toc'

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

      <div className="container mx-auto px-4 pt-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-20">
                <DocsSidebar categories={categories} />
              </div>
            </aside>

            {/* Content */}
            <article>
              <header className="mb-8">
                <div className="text-sm text-primary/80 font-medium mb-2">
                  {doc.categoryTitle}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  {doc.title}
                </h1>
                {doc.description && (
                  <p className="text-lg text-muted-foreground">
                    {doc.description}
                  </p>
                )}
              </header>

              <ArticleWithTOC content={doc.content} />
            </article>
          </div>
        </div>
      </div>
    </>
  )
}
