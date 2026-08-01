import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import { locales } from '@/i18n/config'
import { getTranslations } from 'next-intl/server'
import { buildLocalizedPath } from '@/lib/i18n-utils'
import { DocsTopBar } from '@/components/docs-top-bar'
import ArticleWithTOC from '@/components/article-with-toc'
import LazyComments from '@/components/lazy-comments'
import { BlogSidebar } from '@/components/blog-sidebar'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock3 } from 'lucide-react'

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
  const posts = getAllPosts(locale)
  const postIndex = posts.findIndex(item => item.slug === post.slug)
  const previousPost = postIndex > 0 ? posts[postIndex - 1] : undefined
  const nextPost = postIndex >= 0 && postIndex < posts.length - 1 ? posts[postIndex + 1] : undefined
  const hasSections = /^\s{0,3}#{2,3}\s+\S/m.test(post.content)

  return (
    <>
      <DocsTopBar
        backHref={blogHref}
        backLabel={t('backToBlog')}
        homeHref={homeHref}
      />
      <main className="article-page mx-auto max-w-[1300px] px-5 pb-16 pt-5 sm:px-8 sm:pb-20 sm:pt-6">
      <div className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <BlogSidebar posts={posts.map(({ slug, title, url }) => ({ slug, title, url }))} />
          </div>
        </aside>

      <article className="min-w-0">
        <header className={`${hasSections ? 'grid lg:grid-cols-[minmax(0,760px)_180px] lg:gap-10' : 'mx-auto max-w-[760px]'} border-b border-foreground/[0.08] pb-6 lg:pb-7`}>
          <div>
          <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-medium text-muted-foreground sm:text-xs">
            <span className="uppercase tracking-[0.16em] text-foreground/70">{t('blog')}</span>
            <span className="h-1 w-1 rounded-full bg-foreground/25" />
            <time dateTime={post.date}>
              {formatDate(post.date, locale)}
            </time>
            <span className="h-1 w-1 rounded-full bg-foreground/25" />
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5" />
              {t('readingTime', { minutes: Math.ceil(post.readingTime.minutes) })}
            </span>
            {post.featured && (
              <>
                <span className="h-1 w-1 rounded-full bg-foreground/25" />
                <span className="text-primary">{t('featured')}</span>
              </>
            )}
          </div>

          <h1 className="max-w-3xl text-balance text-[2rem] font-semibold leading-[1.14] tracking-[-0.035em] sm:text-[2.6rem]">
            {post.title}
          </h1>

          {post.description && (
            <p className="mt-3 max-w-[720px] text-base leading-7 text-foreground/60 sm:text-[1.0625rem]">
              {post.description}
            </p>
          )}

          </div>
        </header>

        <div className="pt-6">
          <ArticleWithTOC content={post.content} variant="article" tocPosition="right" />
        </div>

        {(previousPost || nextPost) && (
          <nav className={`${hasSections ? 'grid lg:grid-cols-[minmax(0,760px)_180px] lg:gap-10' : 'mx-auto max-w-[760px]'} gap-3 border-t border-foreground/[0.08] pt-6`} aria-label={t('postNavigation')}>
            <div className="grid gap-3 sm:grid-cols-2">
              {previousPost ? (
                <Link
                  href={previousPost.url as any}
                  className="group rounded-2xl border border-foreground/[0.09] p-4 transition-colors hover:bg-foreground/[0.035]"
                >
                  <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                    {t('previousPost')}
                  </span>
                  <span className="mt-2 block text-sm font-medium leading-5 text-foreground">{previousPost.title}</span>
                </Link>
              ) : null}
              {nextPost && (
                <Link
                  href={nextPost.url as any}
                  className={`group rounded-2xl border border-foreground/[0.09] p-4 text-right transition-colors hover:bg-foreground/[0.035] ${!previousPost ? 'sm:col-start-2' : ''}`}
                >
                  <span className="flex items-center justify-end gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    {t('nextPost')}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <span className="mt-2 block text-sm font-medium leading-5 text-foreground">{nextPost.title}</span>
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
    </main>
    </>
  )
}
