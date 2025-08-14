import { getTranslations } from 'next-intl/server'
import { getAllPosts } from '@/lib/posts'
import { BlogFiltersSidebar } from '@/components/blog-filters-sidebar'
import { BlogPostList } from '@/components/blog-post-list'
import { Suspense } from 'react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'posts' });
  
  return {
    title: t('blog'),
    description: t('description'),
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale })
  const tPosts = await getTranslations({ locale, namespace: 'posts' })
  const posts = getAllPosts(locale)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{t('navigation.blog')}</h1>
        <p className="text-xl text-muted-foreground mb-8">
          {tPosts('description')}
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
              <BlogPostList posts={posts} />
            </Suspense>
          </div>
          <div className="lg:col-span-1">
            <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
              <BlogFiltersSidebar posts={posts} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}