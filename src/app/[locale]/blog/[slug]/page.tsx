import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import { locales } from '@/i18n/config'
import { getTranslations } from 'next-intl/server'
import ArticleWithTOC from '@/components/article-with-toc'
import Comments from '@/components/comments'

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

  return (
    <div className="container mx-auto px-4 pt-4 pb-8">
      <article className="mx-auto max-w-6xl">
        <header className="mb-12">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
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
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {post.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6">
            {post.description}
          </p>
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <ArticleWithTOC content={post.content} />
        
        {/* 添加评论系统 */}
        <Comments locale={locale} />
      </article>
    </div>
  )
} 