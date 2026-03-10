import { initDB } from './database.js'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const IMAGE_DIR = join(__dirname, '../public/images/products')

if (!existsSync(IMAGE_DIR)) {
  mkdirSync(IMAGE_DIR, { recursive: true })
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 产品搜索关键词
const productSearchKeywords = {
  '雪妃尔萌娃娃四股牛奶棉': '雪妃尔 萌娃娃 四股牛奶棉 毛线',
  '雪妃尔五股牛奶棉': '雪妃尔 五股牛奶棉 毛线',
  '苏苏姐家四股精梳棉': '苏苏姐家 四股精梳棉 毛线',
  '恒源祥纯羊毛线': '恒源祥 纯羊毛线 中粗',
  '九色鹿时尚棉线': '九色鹿 棉线 毛线',
  '苏苏姐家段染棉': '苏苏姐家 段染棉 毛线',
  '冰丝线（夏季专用）': '冰丝线 钩织 夏季 毛线',
  '5号蕾丝棉线': '5号蕾丝棉线 钩织 毛线',
  '棉麻混纺线': '棉麻混纺线 钩织 毛线',
  '三利纯棉毛线': '三利 纯棉毛线',
  'Tulip ETIMO Rose 郁金香玫瑰钩针套装': 'Tulip ETIMO Rose 钩针套装 郁金香',
  'Clover Amour 可乐暧昧钩针套装': 'Clover Amour 可乐暧昧钩针套装',
  'Tulip ETIMO Red 郁金香红色钩针套装': 'Tulip ETIMO Red 钩针套装 郁金香',
  '沪牌钩针': '沪牌钩针 钩织',
  '可钩牌钩针': '可钩牌钩针 钩织',
  '七针坊钩针': '七针坊钩针 钩织',
  'Clover 可乐经典金色笔式钩针': 'Clover 可乐 金色笔式钩针',
  'KnitPro Waves 彩木钩针套装': 'KnitPro Waves 彩木钩针套装',
  '潮购牌钩针': '潮购牌钩针 钩织',
  '普通竹制钩针套装': '竹制钩针套装 钩织',
}

const headers = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

// 通过 DuckDuckGo 图片搜索获取产品图片
async function searchDuckDuckGoImages(keyword) {
  try {
    // Step 1: 获取 vqd token
    const tokenUrl = `https://duckduckgo.com/?q=${encodeURIComponent(keyword)}&iar=images&iax=images&ia=images`
    const tokenRes = await fetch(tokenUrl, { headers, signal: AbortSignal.timeout(15000) })
    const tokenText = await tokenRes.text()

    const vqdMatch = tokenText.match(/vqd=['"]([^'"]+)/)
    if (!vqdMatch) {
      console.error('  无法获取 DuckDuckGo vqd token')
      return []
    }

    // Step 2: 用 token 搜索图片
    const imgUrl = `https://duckduckgo.com/i.js?l=cn-zh&o=json&q=${encodeURIComponent(keyword)}&vqd=${vqdMatch[1]}&f=,,,,,&p=1`
    const imgRes = await fetch(imgUrl, {
      headers: { ...headers, 'Referer': 'https://duckduckgo.com/' },
      signal: AbortSignal.timeout(15000),
    })
    const imgJson = await imgRes.json()
    const results = imgJson.results || []

    // 优先选择高质量的产品图片
    return results
      .filter(r => r.image && r.width > 200 && r.height > 200)
      .map(r => ({
        url: r.image,
        thumb: r.thumbnail,
        width: r.width,
        height: r.height,
        source: r.source,
      }))
      .slice(0, 5)
  } catch (err) {
    console.error(`  DuckDuckGo 搜索失败: ${err.message}`)
    return []
  }
}

// 下载图片到本地
async function downloadImage(imageUrl, filename) {
  try {
    const res = await fetch(imageUrl, {
      headers: { ...headers, 'Referer': 'https://duckduckgo.com/' },
      signal: AbortSignal.timeout(30000),
    })
    if (!res.ok) {
      console.error(`  下载失败: HTTP ${res.status}`)
      return null
    }

    const contentType = res.headers.get('content-type') || ''
    const buffer = Buffer.from(await res.arrayBuffer())

    // 跳过太小的图片（可能是占位图）
    if (buffer.length < 5000) {
      console.error(`  图片太小 (${buffer.length} bytes)，跳过`)
      return null
    }

    let ext = '.jpg'
    if (contentType.includes('png')) ext = '.png'
    else if (contentType.includes('webp')) ext = '.webp'
    else if (imageUrl.includes('.png')) ext = '.png'
    else if (imageUrl.includes('.webp')) ext = '.webp'

    const filepath = join(IMAGE_DIR, `${filename}${ext}`)
    writeFileSync(filepath, buffer)
    console.log(`  已下载: ${filename}${ext} (${(buffer.length / 1024).toFixed(1)}KB)`)
    return `/images/products/${filename}${ext}`
  } catch (err) {
    console.error(`  下载异常: ${err.message}`)
    return null
  }
}

async function main() {
  const db = initDB()

  console.log('=== 产品图片爬取开始 ===\n')

  const products = db.prepare('SELECT id, name, image_url FROM products').all()
  console.log(`共 ${products.length} 个产品\n`)

  let updated = 0
  let failed = 0

  for (const product of products) {
    if (product.image_url && !product.image_url.includes('example')) {
      console.log(`[跳过] ${product.name} - 已有图片`)
      continue
    }

    console.log(`[搜索] #${product.id} ${product.name}...`)
    const keyword = productSearchKeywords[product.name] || product.name

    const images = await searchDuckDuckGoImages(keyword)

    if (images.length > 0) {
      // 尝试下载前几张，直到成功
      let success = false
      for (const img of images.slice(0, 3)) {
        console.log(`  尝试: ${img.url.substring(0, 80)}... (${img.width}x${img.height})`)
        const localPath = await downloadImage(img.url, `product-${product.id}`)
        if (localPath) {
          db.prepare('UPDATE products SET image_url = ? WHERE id = ?').run(localPath, product.id)
          updated++
          success = true
          console.log(`  ✓ 数据库已更新\n`)
          break
        }
      }
      if (!success) {
        // 所有下载都失败了，使用缩略图 URL
        const thumbUrl = images[0].thumb || images[0].url
        db.prepare('UPDATE products SET image_url = ? WHERE id = ?').run(thumbUrl, product.id)
        updated++
        console.log(`  ✓ 使用远程缩略图\n`)
      }
    } else {
      console.log(`  ✗ 未找到图片\n`)
      failed++
    }

    // 请求间隔 3 秒，避免被限流
    await sleep(3000)
  }

  console.log(`\n=== 爬取完成 ===`)
  console.log(`成功: ${updated}/${products.length}`)
  console.log(`失败: ${failed}/${products.length}`)

  db.close()
}

main().catch(err => {
  console.error('爬取失败:', err)
  process.exit(1)
})
