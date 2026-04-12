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

        <p className="text-center text-base text-muted-foreground mb-10">
          {tPosts('description')}
        </p>

        {/* 文章列表 */}
        <Suspense
          fallback={
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="lg-card rounded-xl p-4 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-48 bg-foreground/10 rounded-full" />
                    <div className="h-3.5 w-24 bg-foreground/8 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <BlogPostList posts={posts} />
        </Suspense>
      </div>
    </div>
  )
}
