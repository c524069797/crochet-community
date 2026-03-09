import { Router } from 'express'
import multer from 'multer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { mkdirSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const router = Router()

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = join(__dirname, '../../uploads/posts')
    mkdirSync(uploadDir, { recursive: true })
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = file.originalname.split('.').pop()
    cb(null, `post-${uniqueSuffix}.${ext}`)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 9 // 最多9张图片
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('只支持 JPG、PNG、GIF、WebP 格式的图片'))
    }
  }
})

// List posts
router.get('/', (req, res) => {
  const { db } = req.app.locals
  const limit = req.query.limit ? parseInt(req.query.limit) : 100
  const category = req.query.category || ''
  let sql = `SELECT p.*, (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count FROM posts p`
  const params = []
  if (category) { sql += ' WHERE p.category = ?'; params.push(category) }
  sql += ' ORDER BY p.created_at DESC LIMIT ?'
  params.push(limit)
  res.json(db.prepare(sql).all(...params))
})

// Get single post
router.get('/:id', (req, res) => {
  const { db } = req.app.locals
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id)
  if (!post) return res.status(404).json({ error: 'Post not found' })
  res.json(post)
})

// Create post
router.post('/', upload.array('images', 9), (req, res) => {
  const { db } = req.app.locals
  const { title, content, category, author_name } = req.body
  if (!title || !content || !category || !author_name) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // 处理上传的图片
  const images = req.files ? req.files.map(file => `/uploads/posts/${file.filename}`) : []
  const imagesJson = images.length > 0 ? JSON.stringify(images) : null

  const result = db.prepare(
    'INSERT INTO posts (title, content, category, author_name, images) VALUES (?, ?, ?, ?, ?)'
  ).run(title, content, category, author_name, imagesJson)

  res.status(201).json({
    id: result.lastInsertRowid,
    images: images
  })
})

// Like post
router.post('/:id/like', (req, res) => {
  const { db } = req.app.locals
  db.prepare('UPDATE posts SET likes = likes + 1 WHERE id = ?').run(req.params.id)
  res.json({ ok: true })
})

// Get comments for post
router.get('/:id/comments', (req, res) => {
  const { db } = req.app.locals
  const comments = db.prepare('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC').all(req.params.id)
  res.json(comments)
})

// Add comment
router.post('/:id/comments', (req, res) => {
  const { db } = req.app.locals
  const { content, author_name } = req.body
  if (!content || !author_name) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  const result = db.prepare(
    'INSERT INTO comments (post_id, content, author_name) VALUES (?, ?, ?)'
  ).run(req.params.id, content, author_name)
  res.status(201).json({ id: result.lastInsertRowid })
})

export default router
