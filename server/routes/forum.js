import { Router } from 'express'
const router = Router()

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
router.post('/', (req, res) => {
  const { db } = req.app.locals
  const { title, content, category, author_name } = req.body
  if (!title || !content || !category || !author_name) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  const result = db.prepare(
    'INSERT INTO posts (title, content, category, author_name) VALUES (?, ?, ?, ?)'
  ).run(title, content, category, author_name)
  res.status(201).json({ id: result.lastInsertRowid })
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
