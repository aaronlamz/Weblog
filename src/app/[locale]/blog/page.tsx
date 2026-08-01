import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { getAllPosts } from '@/lib/posts'
import { BlogPostList } from '@/components/blog-post-list'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'posts' })

  return {
    title: t('blog'),
    description: t('description'),
  }
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'posts' })
  const posts = getAllPosts(locale)

  return (
    <div className="mx-auto max-w-[980px] px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
        <header className="border-b border-foreground/10 pb-7 sm:pb-8">
          <h1 className="text-4xl font-semibold tracking-[-0.045em] sm:text-[2.75rem]">{t('blog')}</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            {t('description')}
          </p>
        </header>

        <section aria-label={t('allStories')}>
          <Suspense fallback={<BlogListSkeleton />}>
            <BlogPostList posts={posts} />
          </Suspense>
        </section>
    </div>
  )
}

function BlogListSkeleton() {
  return (
    <div className="divide-y divide-foreground/10 animate-pulse">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-40 py-7">
          <div className="h-full rounded-xl bg-foreground/[0.04]" />
        </div>
      ))}
    </div>
  )
}
