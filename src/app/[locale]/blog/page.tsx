import { getTranslations } from 'next-intl/server'
import { getAllPosts } from '@/lib/posts'
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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-4">{t('navigation.blog')}</h1>
          <p className="text-muted-foreground">
            {tPosts('description')}
          </p>
        </header>
        
        <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
          <BlogPostList posts={posts} />
        </Suspense>
      </div>
    </div>
  )
}