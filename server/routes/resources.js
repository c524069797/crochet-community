import { Router } from 'express'
const router = Router()

router.get('/', (req, res) => {
  const { db } = req.app.locals
  const limit = req.query.limit ? parseInt(req.query.limit) : 100
  const type = req.query.type || ''
  const category = req.query.category || ''
  let sql = 'SELECT * FROM resources WHERE 1=1'
  const params = []
  if (type) { sql += ' AND type = ?'; params.push(type) }
  if (category) { sql += ' AND category = ?'; params.push(category) }
  sql += ' ORDER BY created_at DESC LIMIT ?'
  params.push(limit)
  res.json(db.prepare(sql).all(...params))
})

router.get('/:id', (req, res) => {
  const { db } = req.app.locals
  const resource = db.prepare('SELECT * FROM resources WHERE id = ?').get(req.params.id)
  if (!resource) return res.status(404).json({ error: 'Resource not found' })
  res.json(resource)
})

export default router
