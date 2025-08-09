import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getAllPosts } from '@/lib/posts'
import { formatDate } from '@/lib/utils'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'posts' });
  
  return {
    title: t('blog'),
    description: 'Read my latest blog posts about web development, technology, and more.',
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale })
  const tPosts = await getTranslations({ locale, namespace: 'posts' })
  const posts = getAllPosts(locale)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{t('navigation.blog')}</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Thoughts, ideas, and insights about web development and technology.
        </p>

        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={post.url as any}>
                <div className="bg-card rounded-lg p-6 border hover:shadow-md transition-all duration-200">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <time dateTime={post.date}>
                        {formatDate(post.date)}
                      </time>
                      <span>•</span>
                      <span>{t('posts.readingTime', { minutes: post.readingTime?.minutes })}</span>
                      {post.featured && (
                        <>
                          <span>•</span>
                          <span className="text-primary font-medium">{tPosts('featured')}</span>
                        </>
                      )}
                    </div>
                    
                    <h2 className="text-2xl font-semibold group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {post.description}
                    </p>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
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
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{tPosts('empty')}</p>
          </div>
        )}
      </div>
    </div>
  )
} 