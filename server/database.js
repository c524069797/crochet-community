import Database from 'better-sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { mkdirSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function initDB() {
  const dataDir = join(__dirname, 'data')
  mkdirSync(dataDir, { recursive: true })

  const db = new Database(join(dataDir, 'crochet.db'))
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('yarn', 'hook')),
      subcategory TEXT,
      description TEXT,
      image_url TEXT,
      price_range TEXT,
      rating REAL DEFAULT 0,
      rating_count INTEGER DEFAULT 0,
      rank INTEGER DEFAULT 0,
      recommend_reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS product_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      platform TEXT NOT NULL,
      url TEXT NOT NULL,
      price TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('pattern', 'video')),
      category TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      file_url TEXT,
      video_url TEXT,
      platform TEXT,
      author TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('showcase', 'help', 'experience', 'exchange')),
      author_name TEXT NOT NULL,
      images TEXT,
      likes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      author_name TEXT NOT NULL,
      likes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );
  `)

  // 迁移：为现有 posts 表添加 images 列（如果不存在）
  try {
    const columns = db.pragma('table_info(posts)')
    const hasImages = columns.some(col => col.name === 'images')
    if (!hasImages) {
      db.exec('ALTER TABLE posts ADD COLUMN images TEXT')
      console.log('✅ 已为 posts 表添加 images 列')
    }
  } catch (err) {
    console.log('⚠️  迁移检查:', err.message)
  }

  // 迁移：为现有 resources 表添加 author 列（如果不存在）
  try {
    const columns = db.pragma('table_info(resources)')
    const hasAuthor = columns.some(col => col.name === 'author')
    if (!hasAuthor) {
      db.exec('ALTER TABLE resources ADD COLUMN author TEXT')
      console.log('✅ 已为 resources 表添加 author 列')
    }
  } catch (err) {
    console.log('⚠️  迁移检查:', err.message)
  }

  return db
}
