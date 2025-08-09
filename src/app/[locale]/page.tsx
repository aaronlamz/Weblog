import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getAllPosts } from '@/lib/posts'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { siteConfig } from '@/config/site.config'
import { AnimatedText } from '@/components/animated-text'
import { TypewriterText } from '@/components/typewriter-text'
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  Star,
  Code,
  Palette,
  Zap,
  FileText
} from 'lucide-react'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale })
  const posts = getAllPosts(locale).slice(0, 6)
  const featuredPosts = posts.filter(post => post.featured).slice(0, 3)
  const recentPosts = posts.slice(0, 3)

  const skills = [
    { 
      name: t('skills.frontend'), 
      icon: Code, 
      description: t('skillsDesc.frontend'),
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    { 
      name: t('skills.design'), 
      icon: Palette, 
      description: t('skillsDesc.design'),
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    { 
      name: t('skills.backend'), 
      icon: Zap, 
      description: t('skillsDesc.backend'),
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
  ]

  return (
    <div className="min-h-screen relative">
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative">
        <div className="max-w-4xl mx-auto relative">
          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-foreground">{t('hero.greeting')} </span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {siteConfig.author.name}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              {t('hero.introduction')} <span className="text-foreground font-semibold">
                <TypewriterText 
                  texts={[
                    t('hero.roles.fullstack'), 
                    t('hero.roles.web'), 
                    t('hero.roles.ui'), 
                    t('hero.roles.solver')
                  ]}
                  speed={120}
                  deleteSpeed={80}
                  pauseTime={1500}
                />
              </span>
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button asChild size="lg" className="group">
                <Link href={`${locale === 'zh' ? '/zh' : ''}/blog`}>
                  {t('navigation.blog')}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`${locale === 'zh' ? '/zh' : ''}/about`}>
                  {t('navigation.about')}
                </Link>
              </Button>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto relative z-10">
            {skills.map((skill, index) => {
              const Icon = skill.icon
              return (
                <div 
                  key={skill.name}
                  className={`
                    p-6 rounded-2xl border backdrop-blur-sm
                    bg-card/20 hover:bg-card/40 hover:scale-105 hover:shadow-xl
                    transition-all duration-300 group cursor-pointer
                    ${skill.bgColor} hover:${skill.bgColor.replace('bg-', 'bg-').replace('/30', '/50')}
                    border-border/20 hover:border-${skill.color.split(' ')[0].replace('text-', '')}-300
                  `}
                  style={{
                    animationDelay: `${index * 200}ms`
                  }}
                >
                  <div className={`w-12 h-12 rounded-xl ${skill.bgColor} flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${skill.color} group-hover:scale-110 transition-transform`} />
                  </div>
                  <h3 className={`font-semibold mb-2 ${skill.color} group-hover:text-foreground transition-colors`}>
                    {skill.name}
                  </h3>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    {skill.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center gap-2 mb-8">
            <Star className="w-5 h-5 text-yellow-500" />
            <h2 className="text-3xl font-bold">{t('posts.featured')}</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.map((post, index) => (
              <article 
                key={post.slug} 
                className={`group ${index === 0 ? 'lg:row-span-2' : ''}`}
              >
                <Link href={post.url as any}>
                  <div className="bg-gradient-to-br from-card/40 to-card/20 backdrop-blur-sm rounded-2xl p-8 h-full border border-border/40 hover:shadow-xl hover:shadow-primary/5 hover:bg-card/60 transition-all duration-300 group-hover:scale-[1.02]">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span>•</span>
                      <Clock className="w-4 h-4" />
                      <span>{post.readingTime?.text}</span>
                      <Star className="w-4 h-4 text-yellow-500 ml-auto" />
                    </div>
                    
                    <h3 className={`font-bold mb-4 group-hover:text-primary transition-colors ${
                      index === 0 ? 'text-2xl lg:text-3xl' : 'text-xl'
                    }`}>
                      {post.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {post.description}
                    </p>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-secondary/50 text-secondary-foreground text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Latest Posts Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">{t('posts.latest')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={post.url as any}>
                <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 h-full border border-border/40 hover:shadow-lg hover:shadow-primary/5 hover:bg-card/60 transition-all duration-300 group-hover:scale-[1.02]">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span>•</span>
                    <Clock className="w-4 h-4" />
                    <span>{post.readingTime?.text}</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                  
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-secondary/50 text-secondary-foreground text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
        
        {posts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg">No posts yet. Check back soon!</p>
          </div>
        )}
        
        {posts.length > 0 && (
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="group">
              <Link href={`${locale === 'zh' ? '/zh' : ''}/blog`}>
                {t('posts.readMore')}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  )
} 