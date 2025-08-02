import { Metadata } from 'next'

import { siteConfig } from '@/config/site.config'

export const metadata: Metadata = {
  title: siteConfig.pages.about.title,
  description: siteConfig.pages.about.description,
  keywords: [...siteConfig.seo.keywords, 'about'],
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  robots: 'index, follow',
  openGraph: {
    title: `${siteConfig.pages.about.title} | ${siteConfig.name}`,
    description: siteConfig.pages.about.description,
    type: 'website',
  },
  twitter: {
    card: siteConfig.seo.twitterCard,
    title: `${siteConfig.pages.about.title} | ${siteConfig.name}`,
    description: siteConfig.pages.about.description,
  },
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{siteConfig.pages.about.title}</h1>
          <p className="text-xl text-muted-foreground">
            {siteConfig.pages.about.description}
          </p>
        </header>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed">
            {siteConfig.pages.about.content.intro}
          </p>

          <p>
            {siteConfig.pages.about.content.bio}
          </p>

          <h2>What I'm Working On</h2>
          <p>
            {siteConfig.pages.about.content.currentWork}
          </p>

          <h2>Beyond Code</h2>
          <p>
            {siteConfig.pages.about.content.beyondCode}
          </p>

          <h2>Let's Connect</h2>
          <p>
            {siteConfig.pages.about.content.connect}
          </p>

          <div className="mt-12 p-6 bg-secondary rounded-lg">
            <p className="mb-0 text-center italic">
              "{siteConfig.pages.about.content.quote}"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}