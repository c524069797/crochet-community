import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { initDB } from './database.js'
import productsRouter from './routes/products.js'
import resourcesRouter from './routes/resources.js'
import forumRouter from './routes/forum.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Initialize database
const db = initDB()
app.locals.db = db

// API routes
app.use('/api/products', productsRouter)
app.use('/api/resources', resourcesRouter)
app.use('/api/posts', forumRouter)

// Serve uploads
app.use('/uploads', express.static(join(__dirname, '../uploads')))

// Serve Vue frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')))
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
