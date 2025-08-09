import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { readingTime } from './reading-time'
import { locales } from '@/i18n/config'

export interface Post {
  slug: string
  title: string
  description: string
  date: string
  published: boolean
  featured: boolean
  tags: string[]
  author: string
  content: string
  readingTime: {
    text: string
    minutes: number
    words: number
  }
  url: string
  locale: string
}

const postsDirectory = path.join(process.cwd(), 'content/blog')

export function getAllPosts(locale: string = 'zh'): Post[] {
  try {
    const localePostsDir = path.join(postsDirectory, locale)
    
    // Check if locale directory exists
    if (!fs.existsSync(localePostsDir)) {
      console.warn(`Posts directory for locale '${locale}' does not exist`)
      return []
    }

    const fileNames = fs.readdirSync(localePostsDir)
    const allPostsData = fileNames
      .filter((name) => name.endsWith('.mdx'))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '')
        const fullPath = path.join(localePostsDir, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        // as-needed: en 无前缀，zh 使用 /zh。不要手动拼接 basePath，交给 Next.js 处理
        const baseUrl = `${locale === 'zh' ? '/zh' : ''}`
        
        return {
          slug,
          title: data.title || '',
          description: data.description || data.summary || '',
          date: data.date || '',
          published: data.published !== false,
          featured: data.featured || false,
          tags: data.tags || [],
          author: data.author || 'Admin',
          content,
          readingTime: readingTime(content),
          url: `${baseUrl}/blog/${slug}`,
          locale,
          ...data,
        } as Post
      })
      .filter((post) => post.published)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return allPostsData
  } catch (error) {
    console.error('Error reading posts:', error)
    return []
  }
}

export function getPostBySlug(slug: string, locale: string = 'zh'): Post | null {
  try {
    const localePostsDir = path.join(postsDirectory, locale)
    const fullPath = path.join(localePostsDir, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const baseUrl = `${locale === 'zh' ? '/zh' : ''}`

    return {
      slug,
      title: data.title || '',
      description: data.description || data.summary || '',
      date: data.date || '',
      published: data.published !== false,
      featured: data.featured || false,
      tags: data.tags || [],
      author: data.author || 'Admin',
      content,
      readingTime: readingTime(content),
      url: `${baseUrl}/blog/${slug}`,
      locale,
      ...data,
    } as Post
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
} 