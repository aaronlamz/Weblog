/**
 * 富途专栏爬虫脚本
 * 通过 __INITIAL_STATE__ 提取文章数据，质量远优于 DOM 解析
 *
 * 用法: npx tsx scripts/scrape-futu-column.ts <专栏URL> [分类slug] [图标名]
 * 示例: npx tsx scripts/scrape-futu-column.ts "https://www.futuhk.com/hans/blog/list/getting-started-with-investment-3" investment-intro TrendingUp
 */

import { chromium, type Page } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

// ============ 配置 ============
const LOCALE = 'zh'
const DOCS_DIR = path.resolve(__dirname, '..', 'content', 'docs', LOCALE)
const DELAY_MS = 2000

// ============ 类型 ============
interface ArticleLink {
  title: string
  url: string
  order: number
}

interface ArticleContent {
  title: string
  description: string
  content: string
  order: number
}

// ============ 工具函数 ============
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60)
}

function htmlToMarkdown(html: string): string {
  let md = html
    // 先处理 figure/figcaption（带描述的图片）
    .replace(/<figure[^>]*>\s*(?:<a[^>]*>)?\s*<img[^>]+src="([^"]*)"[^>]*(?:alt="([^"]*)")?[^>]*\/?>\s*(?:<\/a>)?\s*(?:<figcaption>(.*?)<\/figcaption>)?\s*<\/figure>/gis, (_, src, alt, caption) => {
      return `![${caption || alt || ''}](${src})\n\n`
    })
    // 独立图片（带 alt）
    .replace(/<img[^>]+src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)')
    // 独立图片（无 alt）
    .replace(/<img[^>]+src="([^"]*)"[^>]*\/?>/gi, '![]($1)')
    // 引用块
    .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => {
      const clean = content.replace(/<[^>]+>/g, '').trim()
      return `> ${clean}\n\n`
    })
    // 标题
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, c) => `# ${c.replace(/<[^>]+>/g, '').trim()}\n\n`)
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, c) => `## ${c.replace(/<[^>]+>/g, '').trim()}\n\n`)
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, c) => `### ${c.replace(/<[^>]+>/g, '').trim()}\n\n`)
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, c) => `#### ${c.replace(/<[^>]+>/g, '').trim()}\n\n`)
    // 加粗
    .replace(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, '**$1**')
    // 斜体
    .replace(/<(?:em|i)[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, '*$1*')
    // 链接
    .replace(/<a[^>]+href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
      const cleanText = text.replace(/<[^>]+>/g, '').trim()
      return `[${cleanText}](${href})`
    })
    // 有序列表项
    .replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, content) => {
      let idx = 0
      return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_: string, li: string) => {
        idx++
        return `${idx}. ${li.replace(/<[^>]+>/g, '').trim()}\n`
      }) + '\n'
    })
    // 无序列表项
    .replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, content) => {
      return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_: string, li: string) => {
        return `- ${li.replace(/<[^>]+>/g, '').trim()}\n`
      }) + '\n'
    })
    // 段落
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, c) => `${c.trim()}\n\n`)
    // 换行
    .replace(/<br\s*\/?>/gi, '\n')
    // 去掉 pic-module / div 容器（保留内容）
    .replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, '$1\n')
    // 去掉 span（保留文字）
    .replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1')
    // 清理剩余标签
    .replace(/<[^>]+>/g, '')
    // HTML 实体
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // 清理嵌套的加粗标记
    .replace(/\*\*\s*\*\*/g, '')
    // 清理多余空行
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return md
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// ============ 爬取逻辑 ============

/** 从列表页获取文章链接 */
async function scrapeArticleList(page: Page, columnUrl: string): Promise<{ columnTitle: string; articles: ArticleLink[] }> {
  console.log('📋 正在获取专栏文章列表...')
  await page.goto(columnUrl, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await sleep(6000)

  // 滚动加载
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollBy(0, 800))
    await sleep(500)
  }

  const result = await page.evaluate(() => {
    const titleEl = document.querySelector('.topic-title, .column-title, h1, .blog-list-title')
    const columnTitle = titleEl?.textContent?.trim() || '富途专栏'

    const links: { title: string; url: string; order: number }[] = []
    const selectors = [
      '.course-topic-item a',
      '.blog-item a',
      '.article-item a',
      '.topic-list a[href*="/blog/"]',
      'a[href*="/blog/detail"]',
      '.list-content a',
    ]

    let foundElements: Element[] = []
    for (const sel of selectors) {
      const els = document.querySelectorAll(sel)
      if (els.length > 0) {
        foundElements = Array.from(els)
        break
      }
    }

    if (foundElements.length === 0) {
      foundElements = Array.from(document.querySelectorAll('a[href*="blog"]'))
    }

    const seen = new Set<string>()
    let order = 1
    for (const el of foundElements) {
      const href = (el as HTMLAnchorElement).href
      let title = el.textContent?.trim() || ''
      title = title.replace(/\s*\d+(\.\d+)?万?人?\s*浏览.*$/s, '').trim()
      if (href && title && !seen.has(href) && title.length > 2 && href.includes('/blog/detail')) {
        seen.add(href)
        links.push({ title, url: href, order: order++ })
      }
    }

    return { columnTitle, articles: links }
  })

  console.log(`✅ 找到 ${result.articles.length} 篇文章，专栏: "${result.columnTitle}"`)
  for (const a of result.articles) {
    console.log(`   ${a.order}. ${a.title}`)
  }

  return result
}

/** 从文章页的 __INITIAL_STATE__ 提取内容 */
async function scrapeArticle(page: Page, article: ArticleLink): Promise<ArticleContent> {
  console.log(`📖 正在爬取: ${article.title}...`)
  await page.goto(article.url, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await sleep(6000)

  const result = await page.evaluate(() => {
    const state = (window as any).__INITIAL_STATE__
    const detail = state?.prefetch?.courseDetail

    if (!detail) return { error: 'no courseDetail', title: '', description: '', contentHtml: '' }

    const section = detail.section || {}
    const sectionDetail = section.detail || {}

    return {
      title: section.title || detail.course_title || '',
      description: section.description || detail.course_subtitle || '',
      contentHtml: sectionDetail.content || '',
    }
  })

  if (!result.contentHtml) {
    console.log(`  ⚠️ 未从 __INITIAL_STATE__ 获取到内容，标题: ${result.title}`)
  }

  const content = htmlToMarkdown(result.contentHtml)

  return {
    title: result.title || article.title,
    description: result.description || article.title,
    content,
    order: article.order,
  }
}

/** 生成 MDX 文件 */
function generateMdxFile(article: ArticleContent, categorySlug: string): string {
  const docSlug = slugify(article.title) || `article-${article.order}`
  const filePath = path.join(DOCS_DIR, categorySlug, `${docSlug}.mdx`)

  // 截断过长的 description
  const desc = article.description.length > 200
    ? article.description.substring(0, 200) + '...'
    : article.description

  const frontmatter = [
    '---',
    `title: "${article.title.replace(/"/g, '\\"')}"`,
    `description: "${desc.replace(/"/g, '\\"')}"`,
    `order: ${article.order}`,
    '---',
  ].join('\n')

  const fileContent = `${frontmatter}\n\n${article.content}\n`

  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, fileContent, 'utf-8')

  const sizeKb = (Buffer.byteLength(fileContent, 'utf-8') / 1024).toFixed(1)
  console.log(`  ✅ ${filePath} (${sizeKb} KB)`)

  return docSlug
}

/** 生成分类 _meta.json */
function generateMeta(categorySlug: string, columnTitle: string, icon: string) {
  const metaDir = path.join(DOCS_DIR, categorySlug)
  fs.mkdirSync(metaDir, { recursive: true })
  const metaPath = path.join(metaDir, '_meta.json')
  const meta = {
    title: columnTitle,
    description: `来自富途专栏：${columnTitle}`,
    icon,
    order: 10,
  }
  fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf-8')
  console.log(`✅ 已生成分类配置: ${metaPath}`)
}

// ============ 主流程 ============
async function main() {
  const columnUrl = process.argv[2]
  const categorySlug = process.argv[3] || 'investment-intro'
  const icon = process.argv[4] || 'TrendingUp'

  if (!columnUrl) {
    console.error('❌ 请提供专栏 URL')
    console.error('用法: npx tsx scripts/scrape-futu-column.ts <专栏URL> [分类slug] [图标名]')
    process.exit(1)
  }

  console.log('🚀 启动浏览器...')
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'zh-CN',
  })
  const page = await context.newPage()

  try {
    // 1. 获取文章列表
    const { columnTitle, articles } = await scrapeArticleList(page, columnUrl)

    if (articles.length === 0) {
      console.error('❌ 未找到任何文章')
      await page.screenshot({ path: 'debug-screenshot.png', fullPage: true })
      process.exit(1)
    }

    // 2. 逐一爬取文章内容
    const allArticles: ArticleContent[] = []
    for (const article of articles) {
      try {
        const content = await scrapeArticle(page, article)
        allArticles.push(content)
        await sleep(DELAY_MS)
      } catch (err) {
        console.error(`  ❌ 爬取失败: ${article.title}`, err)
      }
    }

    // 3. 生成文件
    console.log('\n📝 正在生成 MDX 文件...')
    generateMeta(categorySlug, columnTitle, icon)
    for (const article of allArticles) {
      generateMdxFile(article, categorySlug)
    }

    console.log(`\n🎉 完成！共生成 ${allArticles.length} 篇文档到 content/docs/${LOCALE}/${categorySlug}/`)
  } finally {
    await browser.close()
  }
}

main().catch(err => {
  console.error('❌ 脚本执行失败:', err)
  process.exit(1)
})
