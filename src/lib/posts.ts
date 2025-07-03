import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { readingTime } from './reading-time'

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
}

const postsDirectory = path.join(process.cwd(), 'content/blog')

export function getAllPosts(): Post[] {
  try {
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
      .filter((name) => name.endsWith('.mdx'))
      .map((fileName) => {
        const slug = fileName.replace(/\.mdx$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data, content } = matter(fileContents)

        return {
          slug,
          title: data.title || '',
          description: data.description || '',
          date: data.date || '',
          published: data.published !== false,
          featured: data.featured || false,
          tags: data.tags || [],
          author: data.author || 'Admin',
          content,
          readingTime: readingTime(content),
          url: `/blog/${slug}`,
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

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || '',
      description: data.description || '',
      date: data.date || '',
      published: data.published !== false,
      featured: data.featured || false,
      tags: data.tags || [],
      author: data.author || 'Admin',
      content,
      readingTime: readingTime(content),
      url: `/blog/${slug}`,
      ...data,
    } as Post
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
} 