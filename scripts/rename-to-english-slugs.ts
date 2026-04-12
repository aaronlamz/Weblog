/**
 * 将中文文件名重命名为英文 slug
 */
import * as fs from 'fs'
import * as path from 'path'
import matter from 'gray-matter'

const TARGET_DIR = process.argv[2] || path.resolve(__dirname, '..', 'content', 'docs', 'zh', 'investment-intro')

// 中文标题 → 英文 slug 映射
const slugMap: Record<string, string> = {
  '期权教学-从入门到实战-基础认识-期权策略-实战技巧': 'options-trading-guide',
  '新手股票入门教学-炒股入门': 'stock-trading-basics',
  '美股入门-新手投资必读-美股开市时间-基本规则-三大交易所': 'us-stock-market-guide',
  '一文睇清牛熊证是什么-最新牛熊证玩法': 'cbbc-guide',
  'reits-香港-2026-房地产信托基金投资指南': 'reits-investment-guide',
  '2026证券行边间好-证券行vs银行股票户口比较': 'brokerage-vs-bank-comparison',
  '卖出股票有息收-一文解答什么是除净日及常见问题': 'ex-dividend-date-guide',
  'etf是什么-香港投资者必看etf投资指南': 'etf-investment-guide',
  '月供股票推介2026-月供港股-美股有咩好处': 'monthly-investment-plan',
  '期指入门-快速看懂港美指数期货玩法及注意事项': 'index-futures-guide',
  '孖展玩法-2026最新炒孖展攻略': 'margin-trading-guide',
  '债券投资指南-在香港怎么买债券方便': 'bonds-investment-guide',
  'ipo是什么-如何0手续费抽新股': 'ipo-guide',
  '新手投资入门教学-2026最新投资懒人包': 'investment-beginners-guide',
  '投资黄金是避险必备-什么因素会影响黄金价格': 'gold-investment-guide',
  '财报攻略-一口气搞懂财务报表': 'financial-statements-guide',
  '结构性产品-structured-investments-是什么-了解特点及潜在风险': 'structured-products-guide',
  'kdj指标-短线指标之王-敏锐预测反转行情': 'kdj-indicator-guide',
  '投资入门必学的20个阴阳烛形态': 'candlestick-patterns-guide',
}

function main() {
  console.log(`📝 重命名文件: ${TARGET_DIR}\n`)

  const files = fs.readdirSync(TARGET_DIR).filter(f => f.endsWith('.mdx'))

  for (const file of files) {
    const stem = file.replace(/\.mdx$/, '')
    const newSlug = slugMap[stem]

    if (!newSlug) {
      console.log(`  ⚠️ 无映射: ${file}`)
      continue
    }

    const oldPath = path.join(TARGET_DIR, file)
    const newPath = path.join(TARGET_DIR, `${newSlug}.mdx`)

    fs.renameSync(oldPath, newPath)
    console.log(`  ✅ ${stem}.mdx → ${newSlug}.mdx`)
  }

  console.log('\n✅ 重命名完成！')
}

main()
