import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { siteConfig } from '@/config/site.config'
import { getAllDocCategories } from '@/lib/docs'
import { buildLocalizedPath } from '@/lib/i18n-utils'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'

// Banner gradient presets — muted tones that work in both light & dark
const bannerStyles = [
  { bg: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)', emoji: '📘' },
  { bg: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)', emoji: '🎨' },
  { bg: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', emoji: '🛠' },
  { bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', emoji: '🌿' },
  { bg: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', emoji: '🔥' },
  { bg: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', emoji: '💡' },
]

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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Description */}
        <p className="text-center text-base text-muted-foreground mb-10">
          {t('description')}
        </p>

        {/* Category Cards Grid */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const firstDoc = category.docs[0]
              const href = firstDoc
                ? buildLocalizedPath(`/docs/${firstDoc.slug}`, locale as any)
                : buildLocalizedPath('/docs', locale as any)
              const style = bannerStyles[index % bannerStyles.length]

              return (
                <Link
                  key={category.slug}
                  href={href as any}
                  className="group block rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                  style={{
                    boxShadow: '0 2px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Banner */}
                  <div
                    className="h-36 flex flex-col items-center justify-center relative overflow-hidden"
                    style={{ background: style.bg }}
                  >
                    <span className="text-5xl mb-2">{style.emoji}</span>
                    <span className="text-white text-lg font-bold tracking-wide drop-shadow-md">
                      {category.title}
                    </span>
                  </div>

                  {/* Info — solid background, distinct from page bg */}
                  <div
                    className="p-5 space-y-2 border-t-0"
                    style={{
                      background: 'var(--docs-card-bg)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold group-hover:text-primary transition-colors">
                        {category.title}
                      </h2>
                      <span className="text-xs text-muted-foreground bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        {category.docs.length} {t('articles')}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">{t('empty')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
