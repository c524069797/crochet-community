import { Router } from 'express'
const router = Router()

router.get('/', (req, res) => {
  const { db } = req.app.locals
  const limit = req.query.limit ? parseInt(req.query.limit) : 100
  const category = req.query.category || ''
  let sql = 'SELECT * FROM products'
  const params = []
  if (category) {
    sql += ' WHERE category = ?'
    params.push(category)
  }
  sql += ' ORDER BY created_at DESC LIMIT ?'
  params.push(limit)
  res.json(db.prepare(sql).all(...params))
})

router.get('/:id', (req, res) => {
  const { db } = req.app.locals
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
  if (!product) return res.status(404).json({ error: 'Product not found' })
  res.json(product)
})

router.get('/:id/links', (req, res) => {
  const { db } = req.app.locals
  const links = db.prepare('SELECT * FROM product_links WHERE product_id = ?').all(req.params.id)
  res.json(links)
})

export default router
