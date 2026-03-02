import { initDB } from './database.js'

const db = initDB()

// Seed products
const products = [
  { name: '云朵棉柔棉线', category: 'yarn', subcategory: 'cotton', description: '100%纯棉材质，手感柔软亲肤，适合编织宝宝衣物、玩偶等。颜色丰富，不掉色不起球，是钩织入门首选毛线。每团50g，约120米。', price_range: '¥8-15/团', rating: 4.8, rating_count: 256 },
  { name: '美利奴羊毛线', category: 'yarn', subcategory: 'wool', description: '澳洲进口美利奴羊毛，纤维细腻，保暖性极佳。适合编织围巾、帽子、毛衣等冬季单品。每团100g，约200米。', price_range: '¥35-50/团', rating: 4.6, rating_count: 189 },
  { name: '彩虹段染腈纶线', category: 'yarn', subcategory: 'acrylic', description: '渐变色段染设计，不需要换线就能钩出美丽的渐变效果。腈纶材质易打理可机洗，适合编织毯子、围巾等大件作品。', price_range: '¥12-20/团', rating: 4.5, rating_count: 134 },
  { name: '棉麻混纺线', category: 'yarn', subcategory: 'blend', description: '70%棉+30%亚麻混纺，兼具棉的柔软和麻的透气。自然色系，适合编织夏季包包、杯垫、餐垫等家居饰品。', price_range: '¥15-25/团', rating: 4.7, rating_count: 98 },
  { name: '5号蕾丝棉线', category: 'yarn', subcategory: 'cotton', description: '细号蕾丝线，适合精细钩织。可用于蕾丝花片、桌布、杯垫等精致作品。颜色素雅，成品效果细腻美观。', price_range: '¥10-18/团', rating: 4.4, rating_count: 76 },
  { name: 'Clover可乐牌钩针套装', category: 'hook', subcategory: 'aluminum', description: '日本Clover可乐牌铝制钩针套装，含2.0mm-6.0mm共9支。手柄设计符合人体工学，长时间钩织不疲劳。', price_range: '¥89-120/套', rating: 4.9, rating_count: 312 },
  { name: 'Tulip郁金香钩针', category: 'hook', subcategory: 'ergonomic', description: '日本Tulip ETIMO系列，柔软橡胶手柄，针头光滑不挂线。被誉为"钩针中的爱马仕"，是进阶爱好者的首选。', price_range: '¥45-60/支', rating: 4.9, rating_count: 278 },
  { name: '竹制钩针套装', category: 'hook', subcategory: 'bamboo', description: '天然竹材质，轻巧温润。含12支不同尺寸（2.0-10.0mm），附赠收纳包。适合对金属过敏或偏好自然材质的钩织者。', price_range: '¥25-40/套', rating: 4.3, rating_count: 156 },
  { name: '冰丝线', category: 'yarn', subcategory: 'blend', description: '夏季专用冰丝线材，触感凉爽丝滑。适合编织夏日包包、手机袋、遮阳帽等。光泽度好，成品有丝绸般质感。', price_range: '¥8-15/团', rating: 4.5, rating_count: 203 },
  { name: 'KnitPro可替换头钩针', category: 'hook', subcategory: 'interchangeable', description: 'KnitPro可替换头钩针系统，一个手柄可搭配多种尺寸针头。便携实用，减少收纳空间。适合经常外出钩织的爱好者。', price_range: '¥150-200/套', rating: 4.6, rating_count: 89 },
]

const insertProduct = db.prepare('INSERT INTO products (name, category, subcategory, description, price_range, rating, rating_count) VALUES (?, ?, ?, ?, ?, ?, ?)')
const insertLink = db.prepare('INSERT INTO product_links (product_id, platform, url) VALUES (?, ?, ?)')

for (const p of products) {
  const result = insertProduct.run(p.name, p.category, p.subcategory, p.description, p.price_range, p.rating, p.rating_count)
  const pid = result.lastInsertRowid
  insertLink.run(pid, '淘宝', 'https://www.taobao.com')
  insertLink.run(pid, '京东', 'https://www.jd.com')
  if (Math.random() > 0.5) insertLink.run(pid, '拼多多', 'https://www.pinduoduo.com')
}

// Seed resources
const resources = [
  { title: '初学者入门：锁针与短针基础教学', type: 'video', category: 'other', description: '从零开始学钩织！本视频详细讲解锁针起针法和短针的基本钩法，配合慢动作演示，适合完全没有基础的新手。', video_url: 'https://www.bilibili.com/video/BV1example1', platform: 'bilibili' },
  { title: '可爱小熊玩偶图解', type: 'pattern', category: 'doll', description: '超萌小熊玩偶详细图解，含头部、身体、四肢分片说明。使用棉线+3.0mm钩针，成品约15cm高。新手友好！', file_url: '#' },
  { title: '花朵祖母方格围巾教程', type: 'video', category: 'scarf', description: '经典祖母方格花样的围巾编织教程，从单个花片到拼接完成，手把手教学。成品温暖又文艺。', video_url: 'https://www.bilibili.com/video/BV1example2', platform: 'bilibili' },
  { title: '手提编织包图解（含内衬教程）', type: 'pattern', category: 'bag', description: '时尚手提包完整图解，含包体、提手、装饰花朵的钩法。额外附赠内衬缝制教程，实用与美观兼具。', file_url: '#' },
  { title: '圆形渔夫帽钩织教学', type: 'video', category: 'hat', description: '夏日必备渔夫帽教程！使用冰丝线或棉线，从帽顶开始往下钩，一体成型无需缝合。', video_url: 'https://www.bilibili.com/video/BV1example3', platform: 'bilibili' },
  { title: '经典菠萝花样方巾图解', type: 'pattern', category: 'scarf', description: '传统菠萝花样方巾图解，花样优雅细腻。使用蕾丝线钩织效果最佳，可作为桌布或披肩使用。', file_url: '#' },
  { title: '安抚兔玩偶视频教程', type: 'video', category: 'doll', description: '超人气安抚兔详细视频教程，适合送给宝宝的礼物。使用有机棉线，安全无害。分3集讲解完成。', video_url: 'https://www.bilibili.com/video/BV1example4', platform: 'bilibili' },
  { title: '北欧风杯垫套装图解', type: 'pattern', category: 'other', description: '六款北欧几何风格杯垫图解，简约大方。使用棉线钩织，可作为家居装饰或伴手礼。', file_url: '#' },
  { title: '斜挎手机包编织教程', type: 'video', category: 'bag', description: '实用斜挎手机包教程，含链条带制作方法。小巧精致，出门只带手机时非常方便！', video_url: 'https://www.bilibili.com/video/BV1example5', platform: 'bilibili' },
  { title: '婴儿毯拼花图解合集', type: 'pattern', category: 'blanket', description: '5种花片拼接而成的婴儿毯图解，含花片钩法和拼接方法。柔软棉线材质，给宝宝最温柔的呵护。', file_url: '#' },
]

const insertResource = db.prepare('INSERT INTO resources (title, type, category, description, image_url, file_url, video_url, platform) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
for (const r of resources) {
  insertResource.run(r.title, r.type, r.category, r.description, r.image_url || null, r.file_url || null, r.video_url || null, r.platform || null)
}

// Seed forum posts
const posts = [
  { title: '新手第一个作品完成啦！一只小鲸鱼🐳', content: '学了一个月终于完成了第一个玩偶作品！虽然有些地方针目不太均匀，但整体效果还是很满意的。用的是云朵棉柔棉线，3.0mm钩针。\n\n分享给大家看看，请多指教！接下来想挑战小熊或者兔子，大家有推荐的图解吗？', category: 'showcase', author_name: '钩织小白' },
  { title: '求助：如何解决钩出来的圆片总是不平？', content: '最近在练习钩圆片，但总是会出现碗状或者波浪形，怎么都钩不平。\n\n已经按照图解的加针规律在钩了，每圈加6针短针，但还是不行。\n\n有没有大神能指导一下是哪里出了问题？是不是针号选得不对？我用的是3.5mm钩针配棉线。', category: 'help', author_name: '迷路的毛线球' },
  { title: '分享我的毛线收纳方案', content: '作为一个毛线囤积狂，收纳一直是个大问题。经过多次尝试，终于找到了适合自己的方案：\n\n1. 用透明收纳箱按颜色分类\n2. 每个箱子里放干燥剂防潮\n3. 在箱子外面贴标签标注颜色和材质\n4. 零散的线团用密封袋单独装\n\n这样找线的时候一目了然，也不怕受潮和虫蛀了！', category: 'experience', author_name: '收纳达人' },
  { title: '出几团闲置毛线，价格很美丽', content: '整理了一下毛线库存，有些买多了用不完的出给需要的姐妹：\n\n1. 云朵棉柔棉线 奶白色 x5团 — ¥5/团\n2. 美利奴羊毛线 雾蓝色 x3团 — ¥20/团\n3. 段染线 彩虹色 x4团 — ¥8/团\n\n都是全新未拆封的，可以走闲鱼。有兴趣的可以留言~', category: 'exchange', author_name: '毛线小仙女' },
  { title: '花了两周完成的毛线包包，太有成就感了！', content: '一直想要一个编织包，终于下决心自己钩了一个！用的是冰丝线，成品质感意外地好，上身效果比想象中更时尚。\n\n整个过程花了大约两周的空闲时间，中间拆了两次才满意。最难的部分是提手的连接，反复试了好几种方法。\n\n强烈推荐大家试试手工编织包，背出去回头率超高的！', category: 'showcase', author_name: '手作时光' },
]

const insertPost = db.prepare('INSERT INTO posts (title, content, category, author_name) VALUES (?, ?, ?, ?)')
const insertComment = db.prepare('INSERT INTO comments (post_id, content, author_name) VALUES (?, ?, ?)')

for (const p of posts) {
  const result = insertPost.run(p.title, p.content, p.category, p.author_name)
  const pid = result.lastInsertRowid
  // Add some comments
  if (pid === 1) {
    insertComment.run(pid, '好可爱啊！第一个作品就这么棒，加油！', '钩织老手')
    insertComment.run(pid, '推荐试试小红书上的小熊图解，很详细的', '毛线爱好者')
  }
  if (pid === 2) {
    insertComment.run(pid, '可能是你的手劲太紧了，试试换大一号的钩针', '钩织达人')
    insertComment.run(pid, '圆片起皱一般是加针太多，波浪是加针不够。你可以数一下每圈的针数对不对', '编织教师')
  }
}

// Update some likes
db.prepare('UPDATE posts SET likes = 23 WHERE id = 1').run()
db.prepare('UPDATE posts SET likes = 8 WHERE id = 2').run()
db.prepare('UPDATE posts SET likes = 45 WHERE id = 3').run()
db.prepare('UPDATE posts SET likes = 12 WHERE id = 4').run()
db.prepare('UPDATE posts SET likes = 67 WHERE id = 5').run()

console.log('Database seeded successfully!')
console.log('- 10 products')
console.log('- 10 resources')
console.log('- 5 forum posts with comments')
