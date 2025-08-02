import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site.config'

export default function HomePage() {
  const posts = getAllPosts().slice(0, 6)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {siteConfig.pages.home.hero.title}
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {siteConfig.pages.home.hero.description}
        </p>
        <Button asChild size="lg">
          <Link href="/blog">
            Read the Blog
          </Link>
        </Button>
      </section>

      {/* Featured Posts */}
      <section className="py-16">
        <h2 className="text-3xl font-bold mb-8">Latest Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`}>
                <div className="bg-card rounded-lg p-6 h-full border hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <time dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                    <span>{post.readingTime?.text}</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts yet. Check back soon!</p>
          </div>
        )}
        
        {posts.length > 0 && (
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link href="/blog">
                View All Posts
              </Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  )
} 