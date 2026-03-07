import { getTranslations } from 'next-intl/server'
import { getAllPosts } from '@/lib/posts'
import { BlogPostList } from '@/components/blog-post-list'
import { Suspense } from 'react'
import { FileText } from 'lucide-react'

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

        {/* 页面标题区 — 玻璃卡片风 */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(99,130,240,0.85) 0%, rgba(130,60,210,0.80) 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 16px rgba(99,102,241,0.35)',
                border: '1px solid rgba(180,180,255,0.4)',
              }}
            >
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{t('navigation.blog')}</h1>
          </div>
          <p className="text-muted-foreground leading-relaxed pl-[52px]">
            {tPosts('description')}
          </p>
        </header>

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
