/**
 * 清洗富途专栏内容：去除品牌推广、开户链接、广告等
 * 用法: npx tsx scripts/clean-futu-content.ts [目录路径]
 */

import * as fs from 'fs'
import * as path from 'path'

const TARGET_DIR = process.argv[2] || path.resolve(__dirname, '..', 'content', 'docs', 'zh', 'investment-intro')

// ============ 清洗规则 ============

function cleanContent(content: string): string {
  let cleaned = content

  // 1. 去掉包含富途推广链接的整行（开户、注册、下载、入金等）
  const promoPatterns = [
    /^.*(?:立即开户|立即注册|如何开户|如何存入资金|立即下载|迎新奖赏|开户奖赏|开户享|新客优惠|新客户更可享|限时.*礼品|受相关条款及细则约束).*$/gm,
    /^.*(?:invest\.futu|setup\d*\.futu|funds\.futu).*$/gm,
    // 广告横幅图片（链接到 futuhk/futunn 的图片）
    /^\[?!\[.*?\]\(https:\/\/(?:blogimg|courseimg)\.futunn\.com\/[^)]+\)\]?\(https?:\/\/[^)]*futu[^)]+\)\s*$/gm,
    // 纯推广段落
    /^.*(?:一个账户投资全球|0佣金|真0息|0手续费).*(?:开户|注册|下载).*$/gm,
  ]

  for (const pattern of promoPatterns) {
    cleaned = cleaned.replace(pattern, '')
  }

  // 2. 去掉推广性质的图片（alt 包含"活动"、"开户"、"优惠"等）
  cleaned = cleaned.replace(/^!\[.*?(?:活动|开户|优惠|迎新|奖赏|仅限)[^\]]*\]\(https?:\/\/[^)]+\)\s*$/gm, '')

  // 3. 清洗富途品牌相关链接，保留链接文本
  // [文本](https://www.futunn.com/...) → 文本
  // [文本](https://www.futuhk.com/...) → 文本
  // [文本](https://course.futunn.com/...) → 文本
  // [文本](https://news.futunn.com/...) → 文本
  cleaned = cleaned.replace(/\[([^\]]*)\]\(https?:\/\/(?:www\.|course\.|news\.)?futu(?:nn|hk)\.com[^)]*\)/gi, '$1')

  // 4. 替换品牌名称
  const brandReplacements: [RegExp, string][] = [
    [/富途牛牛/g, '券商平台'],
    [/在富途(?:证券)?/g, '在券商平台'],
    [/(?:通过|使用|下载|打开)富途/g, '通过券商平台'],
    [/富途(?:证券|官网|账户|平台)?/g, '券商平台'],
    [/moomoo/gi, '券商平台'],
  ]

  for (const [pattern, replacement] of brandReplacements) {
    cleaned = cleaned.replace(pattern, replacement)
  }

  // 5. 清理残留的 HTML 属性碎片（data-desc-show-status 等）
  cleaned = cleaned.replace(/[^!\[]*?" data-desc-show-status="[^"]*" data-text-align="[^"]*" style="[^"]*">/gm, '')
  cleaned = cleaned.replace(/[^"]*"\/>[^!\n]*/gm, (match) => {
    // 只清理包含 data- 属性残留的行
    if (match.includes('data-') || match.includes('"/>')) {
      return ''
    }
    return match
  })

  // 6. 清理多余空行
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim()

  return cleaned
}

function cleanMetaFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const meta = JSON.parse(content)
  if (meta.description) {
    meta.description = meta.description
      .replace(/来自富途专栏：/, '')
      .replace(/富途/g, '')
  }
  fs.writeFileSync(filePath, JSON.stringify(meta, null, 2), 'utf-8')
  console.log(`  ✅ 清洗 _meta.json`)
}

function cleanMdxFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8')

  // 分离 frontmatter 和正文
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!fmMatch) {
    console.log(`  ⚠️ 跳过（无 frontmatter）: ${path.basename(filePath)}`)
    return
  }

  let frontmatter = fmMatch[1]
  let body = fmMatch[2]

  // 清洗 frontmatter
  frontmatter = frontmatter
    .replace(/富途教你/g, '')
    .replace(/富途/g, '')
    .replace(/futu/gi, '')

  // 清洗正文
  body = cleanContent(body)

  const result = `---\n${frontmatter}\n---\n${body}\n`

  const before = content.length
  const after = result.length
  const removed = before - after

  fs.writeFileSync(filePath, result, 'utf-8')
  console.log(`  ✅ ${path.basename(filePath)} (${removed > 0 ? '去除' : '变化'} ${Math.abs(removed)} 字符)`)
}

function renameFileIfNeeded(dir: string, file: string): string {
  if (file.includes('富途')) {
    const newName = file.replace(/富途教你/g, '').replace(/富途/g, '')
    const oldPath = path.join(dir, file)
    const newPath = path.join(dir, newName)
    fs.renameSync(oldPath, newPath)
    console.log(`  📝 重命名: ${file} → ${newName}`)
    return newName
  }
  return file
}

// ============ 主流程 ============
function main() {
  console.log(`🧹 正在清洗 (第二轮): ${TARGET_DIR}\n`)

  let files = fs.readdirSync(TARGET_DIR)

  // 先重命名文件
  files = files.map(file => renameFileIfNeeded(TARGET_DIR, file))

  for (const file of files) {
    const filePath = path.join(TARGET_DIR, file)
    if (file === '_meta.json') {
      cleanMetaFile(filePath)
    } else if (file.endsWith('.mdx')) {
      cleanMdxFile(filePath)
    }
  }

  console.log('\n✅ 清洗完成！')
}

main()
