import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { BookMarked } from 'lucide-react'
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
  const topicCount = new Set(posts.flatMap((post) => post.tags)).size

  return (
    <div className="container mx-auto px-5 pb-10 pt-6 sm:px-8 sm:pb-12 sm:pt-7">
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-foreground/10 pb-8 pt-2 sm:pb-9 sm:pt-3">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <BookMarked className="h-4 w-4" />
                <h1>{t('blog')}</h1>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-8 sm:gap-12">
              <div>
                <dd className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{posts.length}</dd>
                <dt className="mt-1 text-xs text-muted-foreground">{t('stories')}</dt>
              </div>
              <div>
                <dd className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{topicCount}</dd>
                <dt className="mt-1 text-xs text-muted-foreground">{t('topics')}</dt>
              </div>
            </dl>
          </div>
        </header>

        <section aria-label={t('allStories')}>
          <Suspense fallback={<BlogListSkeleton />}>
            <BlogPostList posts={posts} />
          </Suspense>
        </section>
      </div>
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
