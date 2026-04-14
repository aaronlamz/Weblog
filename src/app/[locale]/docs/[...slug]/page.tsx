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
  // 只取当前文档所在的分类
  const currentCategory = categories.find(cat => cat.slug === doc.category)
  const currentCategoryDocs = currentCategory ? [currentCategory] : []
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

      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 max-w-screen-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-0">
          {/* Sidebar: only current category */}
          <aside className="hidden lg:block lg:border-r lg:border-border/50 lg:pr-6">
            <div className="sticky top-14">
              <DocsSidebar categories={currentCategoryDocs} />
            </div>
          </aside>

          {/* Content */}
          <article className="lg:pl-8">
            <header className="mb-4">
              <div className="text-sm text-primary/80 font-medium mb-1">
                {doc.categoryTitle}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {doc.title}
              </h1>
              {doc.description && (
                <p className="text-lg text-muted-foreground">
                  {doc.description}
                </p>
              )}
            </header>

            <ArticleWithTOC content={doc.content} tocPosition="right" />
          </article>
        </div>
      </div>
    </>
  )
}
