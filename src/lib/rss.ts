import { Feed } from 'feed'
import { getAllPosts } from './posts'
import { siteConfig } from '@/config/site.config'

export function generateRSSFeed() {
  const feed = new Feed({
    title: siteConfig.name,
    description: siteConfig.description,
    id: siteConfig.url,
    link: siteConfig.url,
    language: 'en',
    image: siteConfig.seo.ogImage || `${siteConfig.url}/images/og-image.png`,
    favicon: `${siteConfig.url}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} ${siteConfig.author.name}. All rights reserved.`,
    updated: new Date(),
    feedLinks: {
      rss2: `${siteConfig.url}/rss.xml`,
      json: `${siteConfig.url}/rss.json`,
      atom: `${siteConfig.url}/atom.xml`,
    },
    author: {
      name: siteConfig.author.name,
      email: siteConfig.author.email,
      link: siteConfig.url,
    },
  })

  const posts = getAllPosts()

  posts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${siteConfig.url}${post.url}`,
      link: `${siteConfig.url}${post.url}`,
      description: post.description,
      content: post.content,
      author: [
        {
          name: post.author,
          email: siteConfig.author.email,
          link: siteConfig.url,
        },
      ],
      date: new Date(post.date),
      category: post.tags.map(tag => ({ name: tag })),
    })
  })

  return feed
}