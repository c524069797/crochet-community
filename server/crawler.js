import { initDB } from './database.js'

const db = initDB()

// B站搜索关键词 → 资源分类映射
const searchQueries = [
  { keyword: '钩针玩偶教程', category: 'doll' },
  { keyword: '毛线玩偶钩法', category: 'doll' },
  { keyword: '钩织围巾教程', category: 'scarf' },
  { keyword: '围巾编织教学', category: 'scarf' },
  { keyword: '钩针包包教程', category: 'bag' },
  { keyword: '毛线包包编织', category: 'bag' },
  { keyword: '钩织帽子教程', category: 'hat' },
  { keyword: '钩针毯子教程', category: 'blanket' },
  { keyword: '钩织入门教程', category: 'other' },
  { keyword: '钩针基础教学', category: 'other' },
]

// 去除B站搜索结果中的HTML高亮标签
function stripHtml(str) {
  if (!str) return ''
  return str.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ').trim()
}

// 确保图片URL使用https
function fixImageUrl(url) {
  if (!url) return null
  if (url.startsWith('//')) return 'https:' + url
  return url
}

// 延时函数，避免请求过快
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// 从B站搜索API抓取视频数据
async function fetchBilibiliVideos(keyword, page = 1) {
  const url = `https://api.bilibili.com/x/web-interface/search/type?search_type=video&keyword=${encodeURIComponent(keyword)}&page=${page}&page_size=20`

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://search.bilibili.com',
  }

  try {
    const res = await fetch(url, { headers })
    const json = await res.json()

    if (json.code !== 0) {
      console.error(`  API error for "${keyword}": ${json.message}`)
      return []
    }

    const results = json.data?.result || []
    return results.map(item => ({
      title: stripHtml(item.title),
      description: stripHtml(item.description),
      image_url: fixImageUrl(item.pic),
      video_url: `https://www.bilibili.com/video/${item.bvid}`,
      bvid: item.bvid,
      author: item.author,
      play: item.play,
      duration: item.duration,
    }))
  } catch (err) {
    console.error(`  Fetch error for "${keyword}": ${err.message}`)
    return []
  }
}

// 主爬取流程
async function crawl() {
  console.log('=== B站钩织资源爬取开始 ===\n')

  // 查询已有的 video_url 用于去重
  const existing = new Set(
    db.prepare('SELECT video_url FROM resources WHERE platform = ?').all('bilibili')
      .map(r => r.video_url)
  )
  console.log(`数据库中已有 ${existing.size} 条B站资源\n`)

  const insert = db.prepare(`
    INSERT INTO resources (title, type, category, description, image_url, file_url, video_url, platform)
    VALUES (?, 'video', ?, ?, ?, NULL, ?, 'bilibili')
  `)

  let totalNew = 0

  for (const { keyword, category } of searchQueries) {
    console.log(`搜索: "${keyword}" (分类: ${category})`)

    const videos = await fetchBilibiliVideos(keyword)
    let newCount = 0

    for (const v of videos) {
      if (existing.has(v.video_url)) continue
      existing.add(v.video_url)

      insert.run(
        v.title,
        category,
        v.description || `${v.author} 的钩织教程视频`,
        v.image_url,
        v.video_url
      )
      newCount++
    }

    totalNew += newCount
    console.log(`  获取 ${videos.length} 条结果，新增 ${newCount} 条\n`)

    // 请求间隔，避免触发限流
    await sleep(1500)
  }

  console.log(`=== 爬取完成，共新增 ${totalNew} 条资源 ===`)
  db.close()
}

crawl().catch(err => {
  console.error('爬取失败:', err)
  process.exit(1)
})
