# 织趣社区项目 - 开发上下文记录

## 项目路径
/Users/chailei/project/crochet-community

## 项目概述
面向钩织爱好者的垂直社区网站，核心功能：产品库、资源库、讨论区

## 技术栈
- 前端：Vue 3 + Vite + Vue Router
- 后端：Express.js + better-sqlite3 (SQLite)
- 样式：自定义 CSS（暖色系主题：粉色/紫色/蓝色）

## 已完成的工作

### 1. 项目结构（全部文件已创建）
```
crochet-community/
├── package.json
├── vite.config.js          # Vite 配置，端口3000，代理API到3001
├── index.html              # 已添加移动端优化 meta 标签
├── .gitignore
├── src/
│   ├── main.js
│   ├── App.vue
│   ├── router/index.js     # Vue Router 路由配置
│   ├── styles/main.css     # 全局样式（暖色系主题 + 完整移动端适配）
│   ├── utils/
│   │   └── appJump.js      # 第三方电商 App 跳转工具（淘宝/拼多多/京东等）
│   ├── components/
│   │   ├── Navbar.vue      # 导航栏（响应式+移动端菜单）
│   │   ├── Footer.vue
│   │   ├── ProductCard.vue # 产品卡片组件
│   │   ├── ResourceCard.vue# 资源卡片组件
│   │   └── PostCard.vue    # 帖子卡片组件
│   └── views/
│       ├── Home.vue        # 首页（英雄区+特色+最新内容）
│       ├── Products.vue    # 产品列表（分类筛选）
│       ├── ProductDetail.vue# 产品详情（购买链接 + App 跳转）
│       ├── Resources.vue   # 资源列表（图解/视频标签+分类）
│       ├── Forum.vue       # 讨论区列表
│       ├── NewPost.vue     # 发帖页面
│       └── ForumPost.vue   # 帖子详情（评论+点赞）
├── server/
│   ├── index.js            # Express 服务器入口，端口3001
│   ├── database.js         # SQLite 数据库初始化（5张表）
│   ├── seed.js             # 种子数据（10产品+10资源+5帖子+评论）
│   └── routes/
│       ├── products.js     # 产品API
│       ├── resources.js    # 资源API
│       └── forum.js        # 论坛API（帖子+评论+点赞）
```

### 2. 数据库表结构
- products（产品）: id, name, category(yarn/hook), subcategory, description, image_url, price_range, rating, rating_count
- product_links（购买链接）: id, product_id, platform, url
- resources（资源）: id, title, type(pattern/video), category, description, image_url, file_url, video_url, platform
- posts（帖子）: id, title, content, category(showcase/help/experience/exchange), author_name, likes
- comments（评论）: id, post_id, content, author_name, likes

### 3. 依赖已安装 ✅
### 4. 数据库已填充种子数据 ✅
### 5. API 已测试可用 ✅
### 6. Git 已初始化并提交 ✅（commit: bab479d）
### 7. 移动端完整适配 ✅（新增）
- 响应式布局：支持 768px、480px、360px 多断点
- 触摸优化：44px 最小触摸目标、tap 高亮、禁用长按
- 安全区域：支持 iPhone X+ 刘海屏适配
- 移动端 meta 标签：viewport、theme-color、PWA 支持
### 8. 第三方 App 跳转 ✅（新增）
- 智能跳转：移动端优先打开 App，失败则打开网页
- 支持平台：淘宝、天猫、拼多多、京东、1688、闲鱼
- 设备检测：自动识别 iOS/Android/微信浏览器
- 平台图标：每个平台显示对应的 emoji 图标
### 9. 讨论区图片上传 ✅（新增）
- 多图上传：支持最多9张图片，单张最大5MB
- 图片格式：JPG、PNG、GIF、WebP
- 实时预览：上传前可预览和删除图片
- 图片展示：帖子详情页网格显示，支持点击查看大图
- 图片查看器：支持左右切换、关闭、计数显示
- 缩略图：帖子列表显示前3张缩略图
- 移动端优化：触摸友好的交互体验

## 未完成的工作

### GitHub 推送
- 仓库地址: https://github.com/c524069797/crochet-community
- GitHub 用户: c524069797
- 推送命令：
  ```bash
  cd /Users/chailei/project/crochet-community
  git push -u origin main
  ```

## 启动命令
```bash
cd /Users/chailei/project/crochet-community
npm run seed          # 重新填充数据（如需要）
npm run dev           # 同时启动前后端开发服务器
# 或分别启动：
npm run dev:server    # 后端 http://localhost:3001
npm run dev:client    # 前端 http://localhost:3000
```

## 后续可优化项
- 用户登录/注册系统
- 收藏功能
- 产品评分功能
- 图片上传（已配置 multer）
- 搜索功能
- 部署（可用 Vercel/Railway）
