import { initDB } from './database.js'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// 延时函数
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 从淘宝搜索获取商品图片
async function fetchTaobaoImage(productName) {
  try {
    // 使用淘宝搜索API（公开接口）
    const keyword = encodeURIComponent(productName)
    const url = `https://s.taobao.com/search?q=${keyword}&imgfile=&js=1&stats_click=search_radio_all%3A1&initiative_id=staobaoz_20220101&ie=utf8`

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://www.taobao.com/',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    }

    const response = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(10000)
    })

    const html = await response.text()

    // 从HTML中提取图片URL（淘宝图片格式：//gXXX.alicdn.com/...）
    const imgRegex = /\/\/g[^"'\s]+\.alicdn\.com\/[^"'\s]+\.jpg/g
    const matches = html.match(imgRegex)

    if (matches && matches.length > 0) {
      // 返回第一张图片，添加https协议
      return 'https:' + matches[0]
    }

    return null
  } catch (err) {
    console.error(`  淘宝搜索失败: ${err.message}`)
    return null
  }
}

// 从京东搜索获取商品图片
async function fetchJDImage(productName) {
  try {
    const keyword = encodeURIComponent(productName)
    const url = `https://search.jd.com/Search?keyword=${keyword}&enc=utf-8`

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://www.jd.com/',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    }

    const response = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(10000)
    })

    const html = await response.text()

    // 从HTML中提取图片URL（京东图片格式：//img.jd.com/...）
    const imgRegex = /\/\/img\d*\.360buyimg\.com\/[^"'\s]+\.jpg/g
    const matches = html.match(imgRegex)

    if (matches && matches.length > 0) {
      return 'https:' + matches[0]
    }

    return null
  } catch (err) {
    console.error(`  京东搜索失败: ${err.message}`)
    return null
  }
}

// 主爬取流程
async function crawlProductImages() {
  console.log('=== 开始爬取产品图片 ===\n')

  const db = initDB()

  // 获取所有产品
  const products = db.prepare('SELECT id, name, category FROM products').all()

  console.log(`找到 ${products.length} 个产品\n`)

  let updated = 0

  for (const product of products) {
    console.log(`处理: ${product.name}`)

    // 构建搜索关键词
    const keyword = product.category === 'yarn'
      ? `${product.name} 毛线`
      : `${product.name} 钩针`

    // 先尝试淘宝
    let imageUrl = await fetchTaobaoImage(keyword)

    // 如果淘宝失败，尝试京东
    if (!imageUrl) {
      await sleep(1000)
      imageUrl = await fetchJDImage(keyword)
    }

    if (imageUrl) {
      // 更新数据库
      db.prepare('UPDATE products SET image_url = ? WHERE id = ?').run(imageUrl, product.id)
      console.log(`  ✓ 已更新图片: ${imageUrl.substring(0, 60)}...`)
      updated++
    } else {
      console.log(`  ✗ 未找到图片`)
    }

    // 延时避免请求过快
    await sleep(2000)
    console.log()
  }

  db.close()

  console.log(`=== 完成！共更新 ${updated}/${products.length} 个产品图片 ===`)
}

// 运行爬虫
crawlProductImages().catch(err => {
  console.error('爬取失败:', err)
  process.exit(1)
})
