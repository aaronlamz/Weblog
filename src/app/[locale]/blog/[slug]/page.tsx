import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import { locales } from '@/i18n/config'
import { getTranslations } from 'next-intl/server'
import { buildLocalizedPath } from '@/lib/i18n-utils'
import { DocsTopBar } from '@/components/docs-top-bar'
import ArticleWithTOC from '@/components/article-with-toc'
import LazyComments from '@/components/lazy-comments'

interface PostPageProps {
  params: Promise<{
    slug: string
    locale: string
  }>
}

export async function generateStaticParams() {
  const allParams: Array<{ slug: string; locale: string }> = []
  
  for (const locale of locales) {
    const posts = getAllPosts(locale)
    posts.forEach((post) => {
      allParams.push({
        slug: post.slug,
        locale: locale,
      })
    })
  }
  
  return allParams
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug, locale } = await params
  const post = getPostBySlug(slug, locale)

  if (!post) {
    return {}
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug, locale } = await params
  const post = getPostBySlug(slug, locale)
  const t = await getTranslations({ locale, namespace: 'posts' })

  if (!post) {
    notFound()
  }

  const blogHref = buildLocalizedPath('/blog', locale as any)
  const homeHref = buildLocalizedPath('/', locale as any)

  return (
    <>
      <DocsTopBar
        backHref={blogHref}
        backLabel={t('backToBlog')}
        homeHref={homeHref}
      />
      <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 max-w-screen-2xl">
      <article>
        <header className="mb-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-3">
            <time dateTime={post.date}>
              {formatDate(post.date, locale)}
            </time>
            <span>•</span>
            <span>{t('readingTime', { minutes: post.readingTime?.minutes })}</span>
            {post.featured && (
              <>
                <span>•</span>
                <span className="text-primary font-medium">{t('featured')}</span>
              </>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            {post.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-4">
            {post.description}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <ArticleWithTOC content={post.content} />

        {/* 添加评论系统（进入视口再加载） */}
        <LazyComments locale={locale} />
      </article>
    </div>
    </>
  )
} 