import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { initDB } from './database.js'
import { crawlBilibili } from './crawler.js'
import productsRouter from './routes/products.js'
import resourcesRouter from './routes/resources.js'
import forumRouter from './routes/forum.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 5174

app.use(cors())
app.use(express.json())

// Initialize database
const db = initDB()
app.locals.db = db

// Image proxy for remote images (Bilibili thumbnails etc.)
// Bypasses hotlink protection, caches in browser for 7 days
app.get('/api/image-proxy', async (req, res) => {
  const url = req.query.url
  if (!url || (!url.startsWith('https://') && !url.startsWith('http://'))) {
    return res.status(400).json({ error: 'Invalid URL' })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Referer': new URL(url).origin + '/',
        'Accept': 'image/*,*/*',
      },
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch image' })
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const buffer = Buffer.from(await response.arrayBuffer())

    res.set({
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=604800, immutable',
      'X-Image-Proxy': 'true',
    })
    res.send(buffer)
  } catch (err) {
    res.status(502).json({ error: 'Image proxy failed: ' + err.message })
  }
})

// API routes
app.use('/api/products', productsRouter)
app.use('/api/resources', resourcesRouter)
app.use('/api/posts', forumRouter)

// 数据刷新端点：手动触发B站爬取
let crawlInProgress = false
app.post('/api/crawl-refresh', async (req, res) => {
  if (crawlInProgress) {
    return res.status(429).json({ error: '爬取正在进行中，请稍后再试' })
  }
  crawlInProgress = true
  try {
    const newCount = await crawlBilibili(db)
    res.json({ success: true, message: `爬取完成，新增 ${newCount} 条资源` })
  } catch (err) {
    console.error('手动爬取失败:', err)
    res.status(500).json({ error: '爬取失败: ' + err.message })
  } finally {
    crawlInProgress = false
  }
})

// 数据状态查询端点
app.get('/api/status', (req, res) => {
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count
  const resourceCount = db.prepare('SELECT COUNT(*) as count FROM resources').get().count
  const postCount = db.prepare('SELECT COUNT(*) as count FROM posts').get().count
  const bilibiliCount = db.prepare("SELECT COUNT(*) as count FROM resources WHERE platform = 'bilibili'").get().count
  res.json({ products: productCount, resources: resourceCount, posts: postCount, bilibiliResources: bilibiliCount })
})

// Serve uploads
app.use('/uploads', express.static(join(__dirname, '../uploads')))

// Serve product images
app.use('/images', express.static(join(__dirname, '../public/images')))

// Serve Vue frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')))
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'))
  })
}

// 自动初始化：启动时检查数据库是否为空，为空则自动seed
async function autoInit() {
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count
  const resourceCount = db.prepare('SELECT COUNT(*) as count FROM resources').get().count

  if (productCount === 0) {
    console.log('[自动初始化] 产品表为空，正在导入种子数据...')
    // 动态导入 seed 逻辑（seed.js 是自执行的，这里用内联方式）
    try {
      await import('./seed-data.js').then(m => m.seedDatabase(db))
      console.log('[自动初始化] 种子数据导入完成')
    } catch (err) {
      console.error('[自动初始化] 种子数据导入失败:', err)
    }
  }

  if (resourceCount <= 10) {
    console.log('[自动初始化] 资源较少，正在从B站获取视频资源...')
    try {
      const newCount = await crawlBilibili(db)
      console.log(`[自动初始化] B站资源获取完成，新增 ${newCount} 条`)
    } catch (err) {
      console.error('[自动初始化] B站资源获取失败:', err)
    }
  }
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  // 异步执行自动初始化，不阻塞服务启动
  autoInit().catch(err => console.error('[自动初始化] 失败:', err))
})
