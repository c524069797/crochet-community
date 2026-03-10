# 织趣社区 (Crochet Community) — 项目代码地图

> 本文件供 Claude Code 自动读取，快速定位代码修改位置，减少探索开销。

## 一句话概述

Vue 3 + Express + SQLite 全栈项目，钩织爱好者社区网站。三大板块：**产品推荐库** / **教程资源库**（B站爬取） / **社区讨论区**。

---

## 技术栈速查

| 层 | 技术 | 版本 |
|---|---|---|
| 前端框架 | Vue 3 (Composition API `<script setup>`) | 3.5+ |
| 构建工具 | Vite | 6.x |
| 路由 | Vue Router | 4.x |
| 国际化 | vue-i18n (中/英双语) | 9.x |
| 后端 | Express.js | 4.x |
| 数据库 | SQLite (better-sqlite3) | — |
| 样式 | 纯 CSS（CSS 变量暖色主题，无 UI 框架） | — |

- 前端开发端口：`3000`（Vite）
- 后端 API 端口：`3001`（Express）
- Vite 代理了 `/api`、`/uploads`、`/images` 到后端

---

## 目录结构 → 功能映射

```
crochet-community/
│
├── CLAUDE.md                  ← 你正在读的文件（项目代码地图）
├── package.json               ← scripts: dev / build / seed / crawl / crawl-images
├── vite.config.js             ← Vite 配置 + 代理规则
├── index.html                 ← SPA 入口 HTML
│
├── src/                       ── 前端 Vue 源码 ──
│   ├── main.js                ← Vue 应用初始化 + 插件注册
│   ├── App.vue                ← 根组件（Navbar + RouterView + Footer）
│   ├── router/index.js        ← 路由定义（6个页面路由）
│   ├── i18n/
│   │   ├── zh.js              ← 中文翻译 KV（所有 UI 文案在这里）
│   │   └── en.js              ← 英文翻译 KV
│   ├── styles/
│   │   └── main.css           ← 全局样式（CSS 变量、网格、卡片、按钮等）
│   ├── components/
│   │   ├── Navbar.vue         ← 顶部导航（响应式 + 移动端汉堡菜单 + 语言切换）
│   │   ├── Footer.vue         ← 页脚
│   │   ├── ProductCard.vue    ← 产品卡片（排名角标、评分星星、价格）
│   │   ├── ResourceCard.vue   ← 资源卡片（视频播放按钮、平台标签）
│   │   └── PostCard.vue       ← 帖子预览卡片（分类标签、点赞数）
│   └── views/
│       ├── Home.vue           ← 首页：Hero + 功能介绍 + 热门产品(4) + 最新资源(3) + 社区动态(5)
│       ├── Products.vue       ← 产品列表页：分类筛选(毛线/钩针) + 排序
│       ├── ProductDetail.vue  ← 产品详情页：大图 + 描述 + 购买链接(淘宝/京东/拼多多)
│       ├── Resources.vue      ← 资源列表页：类型筛选(图解/视频) + 分类筛选
│       ├── Forum.vue          ← 讨论区列表：分类标签 + 帖子列表
│       ├── ForumPost.vue      ← 帖子详情：内容 + 评论区 + 点赞
│       └── NewPost.vue        ← 发帖表单：标题/分类/内容/昵称
│
├── server/                    ── 后端 Express 源码 ──
│   ├── index.js               ← 服务器入口：中间件、路由挂载、静态文件、自动初始化逻辑
│   ├── database.js            ← SQLite 建表（5张表，见下方 Schema）
│   ├── seed-data.js           ← 种子数据定义 + seedDatabase() 导出函数
│   ├── seed.js                ← 手动种子命令入口（npm run seed）
│   ├── crawler.js             ← B站视频爬虫：10个关键词 → bilibili search API → 入库
│   ├── crawl-images.js        ← 产品图片爬虫：DuckDuckGo 图片搜索 → 下载到本地
│   ├── routes/
│   │   ├── products.js        ← GET /api/products(?category=&limit=) / GET /:id / GET /:id/links
│   │   ├── resources.js       ← GET /api/resources(?type=&category=&limit=) / GET /:id
│   │   └── forum.js           ← GET/POST /api/posts / GET /:id / POST /:id/like / GET/POST /:id/comments
│   └── data/
│       └── crochet.db         ← SQLite 数据库文件（运行时自动创建）
│
├── public/images/             ── 本地图片资源 ──
│   ├── products/              ← 20个产品图片 product-{id}.jpg（爬虫下载）
│   └── resources/             ← 5个图解封面 resource-{id}.jpg（爬虫下载）
│
└── dist/                      ← 生产构建输出（npm run build）
```

---

## 数据库 Schema（5张表）

定义位置：`server/database.js`

```
products         产品表（毛线+钩针共20条）
├── id           INTEGER PK
├── name         TEXT         产品名
├── category     TEXT         'yarn' | 'hook'
├── subcategory  TEXT         cotton/wool/blend/ergonomic/domestic/wood/bamboo/aluminum
├── description  TEXT         产品描述
├── image_url    TEXT         本地路径 /images/products/product-{id}.jpg
├── price_range  TEXT         如 '¥4.5-6/团'
├── rating       REAL         评分 0-5
├── rating_count INTEGER      评价数
├── rank         INTEGER      排名
├── recommend_reason TEXT     推荐理由
└── created_at   DATETIME

product_links    购买链接表
├── id           INTEGER PK
├── product_id   FK → products
├── platform     TEXT         '淘宝' | '京东' | '拼多多'
├── url          TEXT         搜索链接
└── price        TEXT         参考价格

resources        教程资源表（图解 + B站视频，约110+条）
├── id           INTEGER PK
├── title        TEXT
├── type         TEXT         'pattern' | 'video'
├── category     TEXT         doll/scarf/bag/hat/blanket/other
├── description  TEXT
├── image_url    TEXT         本地路径 或 B站CDN https://i*.hdslb.com/...
├── file_url     TEXT         图解下载链接（目前为 '#' 占位）
├── video_url    TEXT         B站视频链接
├── platform     TEXT         'bilibili' | null
└── created_at   DATETIME

posts            帖子表（5条种子）
├── id           INTEGER PK
├── title        TEXT
├── content      TEXT
├── category     TEXT         'showcase' | 'help' | 'experience' | 'exchange'
├── author_name  TEXT
├── likes        INTEGER
└── created_at   DATETIME

comments         评论表
├── id           INTEGER PK
├── post_id      FK → posts
├── content      TEXT
├── author_name  TEXT
├── likes        INTEGER
└── created_at   DATETIME
```

---

## API 端点速查

| 方法 | 路径 | 用途 | 文件 |
|------|------|------|------|
| GET | `/api/products?category=&limit=` | 产品列表 | `server/routes/products.js` |
| GET | `/api/products/:id` | 产品详情 | 同上 |
| GET | `/api/products/:id/links` | 购买链接 | 同上 |
| GET | `/api/resources?type=&category=&limit=` | 资源列表 | `server/routes/resources.js` |
| GET | `/api/resources/:id` | 资源详情 | 同上 |
| GET | `/api/posts?category=&limit=` | 帖子列表 | `server/routes/forum.js` |
| POST | `/api/posts` | 创建帖子 | 同上 |
| GET | `/api/posts/:id` | 帖子详情 | 同上 |
| POST | `/api/posts/:id/like` | 点赞 | 同上 |
| GET | `/api/posts/:id/comments` | 评论列表 | 同上 |
| POST | `/api/posts/:id/comments` | 发表评论 | 同上 |
| POST | `/api/crawl-refresh` | 手动触发B站爬取 | `server/index.js` |
| GET | `/api/status` | 数据统计 | `server/index.js` |

---

## 数据流与自动初始化

```
服务器启动 (server/index.js)
  │
  ├─ autoInit()
  │   ├─ 产品表为空? → 导入 seed-data.js → seedDatabase(db)
  │   │   写入 20 个产品 + 购买链接 + 5 个图解资源 + 5 个帖子 + 评论
  │   │
  │   └─ 资源 ≤ 10? → 运行 crawler.js → crawlBilibili(db)
  │       搜索 10 个关键词 → B站 API → 入库（含缩略图URL）
  │
  └─ 监听 3001 端口
```

---

## 常见修改场景 → 定位指南

| 我想要... | 改哪里 |
|-----------|--------|
| 修改页面 UI / 布局 | `src/views/*.vue` 对应页面 |
| 修改卡片样式或展示逻辑 | `src/components/ProductCard.vue` / `ResourceCard.vue` / `PostCard.vue` |
| 修改全局样式 / CSS 变量 / 主题色 | `src/styles/main.css` |
| 修改导航栏 / 页脚 | `src/components/Navbar.vue` / `Footer.vue` |
| 修改中文文案 | `src/i18n/zh.js` |
| 修改英文文案 | `src/i18n/en.js` |
| 添加新页面路由 | `src/router/index.js` |
| 修改 API 接口逻辑 | `server/routes/` 下对应文件 |
| 修改数据库表结构 | `server/database.js`（建表） + `server/seed-data.js`（种子数据） |
| 修改种子数据（产品信息、价格等） | `server/seed-data.js` |
| 修改 B站爬虫搜索关键词或逻辑 | `server/crawler.js` |
| 重新爬取产品图片 | `node server/crawl-images.js` 或 `npm run crawl-images` |
| 重新爬取B站视频 | `node server/crawler.js` 或 `npm run crawl` |
| 修改 Vite 代理 / 构建配置 | `vite.config.js` |
| 服务器启动逻辑 / 中间件 / 静态路由 | `server/index.js` |

---

## 运行命令

```bash
npm run dev            # 同时启动前后端（concurrently）
npm run dev:client     # 仅前端 → http://localhost:3000
npm run dev:server     # 仅后端 → http://localhost:3001
npm run build          # 生产构建 → dist/
npm run start          # 生产模式启动
npm run seed           # 重置并填充种子数据
npm run crawl          # 运行B站视频爬虫
npm run crawl-images   # 运行产品图片爬虫（DuckDuckGo）
```

---

## 图片来源说明

- **产品图片**：通过 `crawl-images.js` 从 DuckDuckGo 搜索下载，存储在 `public/images/products/`，数据库存本地路径 `/images/products/product-{id}.jpg`
- **B站视频缩略图**：`crawler.js` 爬取时从 API 获得 `hdslb.com` 域名的远程 URL，数据库直接存远程地址
- **图解资源封面**：通过 DuckDuckGo 搜索下载，存储在 `public/images/resources/`
- 静态文件由 Express（`/images` 路由）和 Vite 代理提供

---

## 关键设计决策备忘

1. **无用户系统**：发帖/评论直接填昵称，无登录注册
2. **购买链接**：跳转到淘宝/京东/拼多多的搜索页（非直接商品链接），避免失效
3. **图片策略**：优先本地存储，fallback 到 CSS 渐变色占位（见 ProductCard.vue 第3行）
4. **B站爬虫**：使用公开搜索 API，2秒间隔+3次重试+指数退避，防限流
5. **国际化**：所有 UI 文案通过 `$t('key')` 引用，改文案只改 `i18n/*.js`
6. **数据库自动初始化**：服务器启动时检测空库自动 seed + crawl，无需手动操作
