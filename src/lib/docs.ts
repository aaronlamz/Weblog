import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { readingTime } from './reading-time'
import { locales } from '@/i18n/config'

export interface DocMeta {
  slug: string
  title: string
  description: string
  order: number
  category: string
  categoryTitle: string
  categoryOrder: number
  categoryIcon?: string
}

export interface Doc extends DocMeta {
  content: string
  readingTime: {
    text: string
    minutes: number
    words: number
  }
}

export interface DocCategory {
  slug: string
  title: string
  description: string
  icon?: string
  order: number
  docs: DocMeta[]
}

const docsDirectory = path.join(process.cwd(), 'content/docs')

function parseCategoryMeta(categoryDir: string): { title: string; description: string; icon?: string; order: number } {
  const metaPath = path.join(categoryDir, '_meta.json')
  if (fs.existsSync(metaPath)) {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'))
    return {
      title: meta.title || '',
      description: meta.description || '',
      icon: meta.icon,
      order: meta.order ?? 99,
    }
  }
  return { title: path.basename(categoryDir), description: '', order: 99 }
}

export function getAllDocCategories(locale: string = 'zh'): DocCategory[] {
  try {
    const localeDir = path.join(docsDirectory, locale)
    if (!fs.existsSync(localeDir)) return []

    const entries = fs.readdirSync(localeDir, { withFileTypes: true })
    const categories: DocCategory[] = []

    for (const entry of entries) {
      if (!entry.isDirectory()) continue

      const categoryDir = path.join(localeDir, entry.name)
      const meta = parseCategoryMeta(categoryDir)

      const docs = getDocsInCategory(locale, entry.name, meta)
      categories.push({
        slug: entry.name,
        title: meta.title,
        description: meta.description,
        icon: meta.icon,
        order: meta.order,
        docs,
      })
    }

    return categories.sort((a, b) => a.order - b.order)
  } catch (error) {
    console.error('Error reading doc categories:', error)
    return []
  }
}

function getDocsInCategory(locale: string, categorySlug: string, categoryMeta: { title: string; order: number; icon?: string }): DocMeta[] {
  const categoryDir = path.join(docsDirectory, locale, categorySlug)
  if (!fs.existsSync(categoryDir)) return []

  const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.mdx'))
  const docs: DocMeta[] = []

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, '')
    const fullPath = path.join(categoryDir, file)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)

    docs.push({
      slug: `${categorySlug}/${slug}`,
      title: data.title || slug,
      description: data.description || '',
      order: data.order ?? 99,
      category: categorySlug,
      categoryTitle: categoryMeta.title,
      categoryOrder: categoryMeta.order,
      categoryIcon: categoryMeta.icon,
    })
  }

  return docs.sort((a, b) => a.order - b.order)
}

export function getDocBySlug(slugParts: string[], locale: string = 'zh'): Doc | null {
  try {
    if (slugParts.length !== 2) return null
    const [category, docSlug] = slugParts
    const fullPath = path.join(docsDirectory, locale, category, `${docSlug}.mdx`)
    if (!fs.existsSync(fullPath)) return null

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    const categoryDir = path.join(docsDirectory, locale, category)
    const categoryMeta = parseCategoryMeta(categoryDir)

    return {
      slug: `${category}/${docSlug}`,
      title: data.title || docSlug,
      description: data.description || '',
      order: data.order ?? 99,
      category,
      categoryTitle: categoryMeta.title,
      categoryOrder: categoryMeta.order,
      categoryIcon: categoryMeta.icon,
      content,
      readingTime: readingTime(content),
    }
  } catch (error) {
    console.error(`Error reading doc ${slugParts.join('/')}:`, error)
    return null
  }
}

export function getAllDocSlugs(locale: string = 'zh'): string[][] {
  const categories = getAllDocCategories(locale)
  const slugs: string[][] = []
  for (const cat of categories) {
    for (const doc of cat.docs) {
      slugs.push(doc.slug.split('/'))
    }
  }
  return slugs
}
