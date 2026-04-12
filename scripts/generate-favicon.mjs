import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 现代渐变 monogram "A" favicon
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1"/>
      <stop offset="50%" style="stop-color:#8b5cf6"/>
      <stop offset="100%" style="stop-color:#a78bfa"/>
    </linearGradient>
    <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgba(255,255,255,0.25)"/>
      <stop offset="50%" style="stop-color:rgba(255,255,255,0.05)"/>
      <stop offset="100%" style="stop-color:rgba(255,255,255,0)"/>
    </linearGradient>
  </defs>

  <!-- 圆角方块背景 -->
  <rect width="512" height="512" rx="108" ry="108" fill="url(#bg)"/>

  <!-- 光泽层 -->
  <rect width="512" height="512" rx="108" ry="108" fill="url(#shine)"/>

  <!-- 字母 A — 现代无衬线风格 -->
  <text
    x="256" y="380"
    text-anchor="middle"
    font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif"
    font-weight="700"
    font-size="340"
    fill="white"
    letter-spacing="-8"
  >A</text>
</svg>
`

const outDir = path.resolve(__dirname, '..', 'public')

async function generate() {
  const svgBuffer = Buffer.from(svg)

  // 生成多尺寸 PNG
  const sizes = [16, 32, 48, 64, 128, 256, 512]

  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, `favicon-${size}.png`))
    console.log(`  ✅ favicon-${size}.png`)
  }

  // 生成 favicon.ico (使用 32x32 PNG)
  // ICO 格式本质上是嵌入 PNG 的容器
  const png16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer()
  const png32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer()
  const png48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer()

  // 构建 ICO 文件（多尺寸）
  const ico = buildIco([
    { size: 16, data: png16 },
    { size: 32, data: png32 },
    { size: 48, data: png48 },
  ])
  fs.writeFileSync(path.join(outDir, 'favicon.ico'), ico)
  console.log('  ✅ favicon.ico')

  // 生成 apple-touch-icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(outDir, 'apple-touch-icon.png'))
  console.log('  ✅ apple-touch-icon.png')

  // 保留 SVG 源文件
  fs.writeFileSync(path.join(outDir, 'favicon.svg'), svg.trim())
  console.log('  ✅ favicon.svg')

  // 清理临时 PNG
  for (const size of sizes) {
    fs.unlinkSync(path.join(outDir, `favicon-${size}.png`))
  }

  console.log('\n🎉 Favicon 生成完成！')
}

// 构建 ICO 文件格式
function buildIco(images) {
  const headerSize = 6
  const dirEntrySize = 16
  const numImages = images.length
  const dirSize = headerSize + dirEntrySize * numImages

  let offset = dirSize
  const entries = images.map(img => {
    const entry = {
      size: img.size,
      data: img.data,
      offset,
    }
    offset += img.data.length
    return entry
  })

  const totalSize = offset
  const buffer = Buffer.alloc(totalSize)

  // ICO header
  buffer.writeUInt16LE(0, 0)      // reserved
  buffer.writeUInt16LE(1, 2)      // type: ICO
  buffer.writeUInt16LE(numImages, 4) // count

  // Directory entries
  entries.forEach((entry, i) => {
    const pos = headerSize + i * dirEntrySize
    buffer.writeUInt8(entry.size < 256 ? entry.size : 0, pos)     // width
    buffer.writeUInt8(entry.size < 256 ? entry.size : 0, pos + 1) // height
    buffer.writeUInt8(0, pos + 2)          // color palette
    buffer.writeUInt8(0, pos + 3)          // reserved
    buffer.writeUInt16LE(1, pos + 4)       // color planes
    buffer.writeUInt16LE(32, pos + 6)      // bits per pixel
    buffer.writeUInt32LE(entry.data.length, pos + 8)  // data size
    buffer.writeUInt32LE(entry.offset, pos + 12)      // data offset
  })

  // Image data
  entries.forEach(entry => {
    entry.data.copy(buffer, entry.offset)
  })

  return buffer
}

generate().catch(console.error)
