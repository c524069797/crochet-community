import { initDB } from './database.js'

const db = initDB()

// 清空已有数据重新填充
db.exec('DELETE FROM product_links')
db.exec('DELETE FROM products')

// Seed products
// 毛线产品 - 基于小红书社区口碑推荐榜单
const yarnProducts = [
  {
    name: '雪妃尔萌娃娃四股牛奶棉',
    category: 'yarn', subcategory: 'cotton',
    description: '小红书钩织圈人手必备！40%涤纶+60%新棉四股牛奶棉，柔软亲肤，颜色鲜艳无色差。钩出来的玩偶精致细腻，可机洗不起球不掉色。新手钩娃娃、发夹的第一选择。每团50g约133米。',
    price_range: '¥4.5-6/团',
    rating: 4.9, rating_count: 5680,
    rank: 1,
    recommend_reason: '小红书钩娃娃首选线材，"新手入门必买，性价比之王"',
    image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
  },
  {
    name: '雪妃尔五股牛奶棉',
    category: 'yarn', subcategory: 'cotton',
    description: '经典五股牛奶棉线，比四股更粗更快出成品。不起球不掉色，扔洗衣机随便洗。适合钩包包、大玩偶、宝宝鞋、毯子等大件作品。颜色选择超过100种，每团50g约95米。',
    price_range: '¥5.9-8/团',
    rating: 4.8, rating_count: 4230,
    rank: 2,
    recommend_reason: '小红书热评："钩包包和大玩偶的不二之选"',
    image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop',
  },
  {
    name: '苏苏姐家四股精梳棉',
    category: 'yarn', subcategory: 'cotton',
    description: '精梳棉工艺，纤维更整齐顺滑，手感比普通牛奶棉更细腻。配套高清大图教程和完整视频，新手友好。适合钩小玩偶、花束、精细图案作品。对新手特别友好，有材料包可选。',
    price_range: '¥6-9/团',
    rating: 4.8, rating_count: 3560,
    rank: 3,
    recommend_reason: '小红书新手最爱，"配套教程最全，闭眼入不踩雷"',
    image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop&sat=-50',
  },
  {
    name: '恒源祥纯羊毛线',
    category: 'yarn', subcategory: 'wool',
    description: '中华老字号品牌，100%澳洲高支美利奴羊毛。纤维细腻保暖性极佳，手感柔软不扎人。适合编织围巾、帽子、毛衣等冬季单品。品质稳定，国民级毛线品牌。每团50g约200米。',
    price_range: '¥10-18/团',
    rating: 4.7, rating_count: 12800,
    rank: 4,
    recommend_reason: '小红书织围巾首推，"国民老品牌，品质有保障"',
    image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop&hue=30',
  },
  {
    name: '九色鹿时尚棉线',
    category: 'yarn', subcategory: 'cotton',
    description: '国内知名毛线品牌，年轻时尚的代名词。纯棉材质亲肤透气，颜色时尚多样。适合编织夏季衣物、包包、家居饰品。品控一流，每年推出多款新品和新色。每团50g约120米。',
    price_range: '¥8-15/团',
    rating: 4.7, rating_count: 2890,
    rank: 5,
    recommend_reason: '小红书达人推荐，"最时尚的国产毛线品牌"',
    image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop&hue=180',
  },
  {
    name: '苏苏姐家段染棉',
    category: 'yarn', subcategory: 'blend',
    description: '颜色清新耐看的段染棉线，不需要换线就能钩出渐变效果。特别适合钩织花朵、花束和渐变围巾。国产段染线性价比最高之选，颜色过渡自然不突兀。每团50g约130米。',
    price_range: '¥7-12/团',
    rating: 4.7, rating_count: 1960,
    rank: 6,
    recommend_reason: '小红书钩花束首选，"段染效果惊艳，颜色仙气十足"',
    image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop&hue=270',
  },
  {
    name: '冰丝线（夏季专用）',
    category: 'yarn', subcategory: 'blend',
    description: '夏季必备线材，触感凉爽丝滑有光泽。适合编织夏日包包、手机袋、遮阳帽等。成品有丝绸般质感，背出去回头率超高。多种颜色可选，是夏日钩织爆款线材。每团50g约120米。',
    price_range: '¥6-12/团',
    rating: 4.6, rating_count: 3450,
    rank: 7,
    recommend_reason: '小红书夏季爆款，"钩包包手感一绝，出片率超高"',
    image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop&hue=200',
  },
  {
    name: '5号蕾丝棉线',
    category: 'yarn', subcategory: 'cotton',
    description: '细号蕾丝线，介于普通棉线和极细蕾丝之间的粗细。钩出来比牛奶棉更精致，又不像3号蕾丝那么费眼睛。适合想要提升作品精致度的进阶玩家，可做花片、桌布、精致玩偶。',
    price_range: '¥8-15/团',
    rating: 4.6, rating_count: 1280,
    rank: 8,
    recommend_reason: '小红书进阶之选，"比牛奶棉精致，比蕾丝线好上手"',
    image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop&brightness=-10',
  },
  {
    name: '棉麻混纺线',
    category: 'yarn', subcategory: 'blend',
    description: '70%棉+30%亚麻混纺，兼具棉的柔软和麻的透气。自然色系，天然质朴的文艺感。适合编织夏季包包、杯垫、餐垫等家居饰品。成品自带高级感。每团50g约110米。',
    price_range: '¥12-20/团',
    rating: 4.5, rating_count: 980,
    rank: 9,
    recommend_reason: '小红书家居博主爱用，"钩杯垫和餐垫自带高级感"',
    image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop&sat=-30',
  },
  {
    name: '三利纯棉毛线',
    category: 'yarn', subcategory: 'cotton',
    description: '老牌毛线企业，100%纯棉材质，品质稳定值得信赖。柔软亲肤不扎手，适合宝宝衣物和贴身织物。颜色素雅自然，每团成分均匀。适合对毛线品质有要求的钩织爱好者。每团50g约125米。',
    price_range: '¥7-12/团',
    rating: 4.5, rating_count: 2150,
    rank: 10,
    recommend_reason: '小红书宝妈推荐，"给宝宝用的线一定要选品牌"',
    image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=400&fit=crop&hue=60',
  },
]

// 钩针产品 - 基于小红书社区口碑推荐榜单
const hookProducts = [
  {
    name: 'Tulip ETIMO Rose 郁金香玫瑰钩针套装',
    category: 'hook', subcategory: 'ergonomic',
    description: '日本Tulip ETIMO Rose系列，被无数织友称为"梦中情针"。粉色柔软橡胶手柄配缓冲垫设计，针头圆润光滑，凹槽深度恰到好处。长时间钩织手不累，蕾丝到粗针全线覆盖。含2/0-10/0号共8支，附精美收纳盒。',
    price_range: '¥328-398/套',
    rating: 4.9, rating_count: 1820,
    rank: 1,
    recommend_reason: '小红书万人推荐，"钩针界的爱马仕"，手感无敌',
    image_url: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop',
  },
  {
    name: 'Clover Amour 可乐暧昧钩针套装',
    category: 'hook', subcategory: 'ergonomic',
    description: '日本Clover经典暧昧系列8件套（2.0mm-6.0mm），彩色软塑胶手柄，每个号数对应不同颜色。针杆哑光涂层摩擦力适中，号数雕刻不易磨损。性价比最高的日系品牌钩针，新手到进阶通用。',
    price_range: '¥189-258/套',
    rating: 4.9, rating_count: 2350,
    rank: 2,
    recommend_reason: '小红书口碑之王，性价比最高的日系钩针，不分线',
    image_url: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&hue=180',
  },
  {
    name: 'Tulip ETIMO Red 郁金香红色钩针套装',
    category: 'hook', subcategory: 'ergonomic',
    description: '日本Tulip ETIMO Red系列，哑光红色调不反光护眼。8支人体工学软垫手柄钩针（1.8-5.0mm），针头哑光银色处理，顺滑不挂线。附带拇指靠垫设计，适合长时间精细钩织。',
    price_range: '¥358-428/套',
    rating: 4.9, rating_count: 986,
    rank: 3,
    recommend_reason: '小红书热评："颜值与实力并存"，蕾丝钩织首选',
    image_url: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&hue=0',
  },
  {
    name: '沪牌钩针',
    category: 'hook', subcategory: 'domestic',
    description: '国货之光！沪牌钩针以精良的做工和顺滑的手感著称，针头打磨细腻，不挂线不分线。性价比远超日系品牌，小红书上被誉为"国产钩针天花板"。4.0mm以下号数表现尤其出色。',
    price_range: '¥22-35/支',
    rating: 4.8, rating_count: 1560,
    rank: 4,
    recommend_reason: '小红书国产钩针NO.1，"4.0以下选国产，首选沪牌"',
    image_url: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&sat=-20',
  },
  {
    name: '可钩牌钩针',
    category: 'hook', subcategory: 'domestic',
    description: '国产品牌中顺滑度最高的钩针之一，有织友评价"比可乐还顺滑"。针头处理精细，凹槽设计合理，入针出针顺畅。握感舒适，适合长时间钩织。多种号数可选，单支购买灵活。',
    price_range: '¥25-45/支',
    rating: 4.7, rating_count: 1230,
    rank: 5,
    recommend_reason: '小红书热议："比日系还顺滑"的国货黑马',
    image_url: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&hue=90',
  },
  {
    name: '七针坊钩针',
    category: 'hook', subcategory: 'domestic',
    description: '老牌国产钩针品牌，品控稳定，多年口碑积累。针尖尖度适中，不易劈线。手柄粗细均匀，长时间使用舒适度好。价格亲民，适合新手入门和日常钩织使用。',
    price_range: '¥20-38/支',
    rating: 4.7, rating_count: 890,
    rank: 6,
    recommend_reason: '小红书新手入门首推国产品牌，品控稳定',
    image_url: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&hue=270',
  },
  {
    name: 'Clover 可乐经典金色笔式钩针',
    category: 'hook', subcategory: 'aluminum',
    description: '日本Clover经典42系列金色铝制笔式钩针，轻巧耐用。针头光滑度极高，适合追求速度的进阶玩家。金属针杆导热性好，夏天使用手感清凉。单支购买，按需选号。',
    price_range: '¥28-42/支',
    rating: 4.8, rating_count: 1680,
    rank: 7,
    recommend_reason: '小红书经典款，"速度型选手的最爱"',
    image_url: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&hue=45',
  },
  {
    name: 'KnitPro Waves 彩木钩针套装',
    category: 'hook', subcategory: 'wood',
    description: 'KnitPro Waves系列彩色层压木钩针套装，色彩绚丽。木质针头温润不凉手，适合对金属过敏的织友。Inline直嘴设计，钩口与针杆同宽，出入针顺畅。含9支不同号数，附收纳包。',
    price_range: '¥128-168/套',
    rating: 4.6, rating_count: 456,
    rank: 8,
    recommend_reason: '小红书颜值担当，"最美钩针没有之一"',
    image_url: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&hue=300',
  },
  {
    name: '潮购牌钩针',
    category: 'hook', subcategory: 'domestic',
    description: '国产新锐品牌，针头弧度设计独特，入针角度舒适。多款配色可选，既有经典金属色也有彩色手柄款。做工精细，价格实惠，是性价比极高的入门到进阶选择。',
    price_range: '¥18-35/支',
    rating: 4.6, rating_count: 670,
    rank: 9,
    recommend_reason: '小红书高性价比之选，新手友好',
    image_url: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&hue=210',
  },
  {
    name: '普通竹制钩针套装',
    category: 'hook', subcategory: 'bamboo',
    description: '天然竹材质钩针12支套装（2.0-10.0mm），轻巧温润不凉手。附赠收纳包。适合纯新手试水入门，价格极其亲民。用来确认自己是否喜欢钩织，零成本试错。',
    price_range: '¥9.9-25/套',
    rating: 4.2, rating_count: 3200,
    rank: 10,
    recommend_reason: '小红书新手试水首选，"不到10块入坑零压力"',
    image_url: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=400&fit=crop&hue=120',
  },
]

const products = [...yarnProducts, ...hookProducts]

const insertProduct = db.prepare('INSERT INTO products (name, category, subcategory, description, price_range, rating, rating_count, rank, recommend_reason, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
const insertLink = db.prepare('INSERT INTO product_links (product_id, platform, url, price) VALUES (?, ?, ?, ?)')

// 钩针产品购买链接 - 具体价格 + 搜索链接
const hookLinks = {
  'Tulip ETIMO Rose 郁金香玫瑰钩针套装': [
    { platform: '淘宝', url: 'https://s.taobao.com/search?q=Tulip+ETIMO+Rose+%E9%92%A9%E9%92%88%E5%A5%97%E8%A3%85', price: '¥358' },
    { platform: '京东', url: 'https://search.jd.com/Search?keyword=Tulip+ETIMO+Rose+%E9%92%A9%E9%92%88', price: '¥398' },
    { platform: '拼多多', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=Tulip+ETIMO+Rose+%E9%92%A9%E9%92%88', price: '¥328' },
  ],
  'Clover Amour 可乐暧昧钩针套装': [
    { platform: '淘宝', url: 'https://s.taobao.com/search?q=Clover+Amour+%E5%8F%AF%E4%B9%90%E6%9A%A7%E6%98%A7%E9%92%A9%E9%92%88%E5%A5%97%E8%A3%85', price: '¥199' },
    { platform: '京东', url: 'https://search.jd.com/Search?keyword=%E5%8F%AF%E4%B9%90+Clover+%E6%9A%A7%E6%98%A7%E9%92%A9%E9%92%88%E5%A5%97%E8%A3%85', price: '¥258' },
    { platform: '拼多多', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=%E5%8F%AF%E4%B9%90%E6%9A%A7%E6%98%A7%E9%92%A9%E9%92%88%E5%A5%97%E8%A3%85', price: '¥189' },
  ],
  'Tulip ETIMO Red 郁金香红色钩针套装': [
    { platform: '淘宝', url: 'https://s.taobao.com/search?q=Tulip+ETIMO+Red+%E9%92%A9%E9%92%88%E5%A5%97%E8%A3%85', price: '¥388' },
    { platform: '京东', url: 'https://search.jd.com/Search?keyword=Tulip+ETIMO+Red+%E9%92%A9%E9%92%88', price: '¥428' },
    { platform: '拼多多', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=Tulip+ETIMO+Red+%E9%92%A9%E9%92%88', price: '¥358' },
  ],
  '沪牌钩针': [
    { platform: '淘宝', url: 'https://s.taobao.com/search?q=%E6%B2%AA%E7%89%8C%E9%92%A9%E9%92%88', price: '¥25' },
    { platform: '京东', url: 'https://search.jd.com/Search?keyword=%E6%B2%AA%E7%89%8C%E9%92%A9%E9%92%88', price: '¥32' },
    { platform: '拼多多', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=%E6%B2%AA%E7%89%8C%E9%92%A9%E9%92%88', price: '¥22' },
  ],
  '可钩牌钩针': [
    { platform: '淘宝', url: 'https://s.taobao.com/search?q=%E5%8F%AF%E9%92%A9%E7%89%8C%E9%92%A9%E9%92%88', price: '¥28' },
    { platform: '京东', url: 'https://search.jd.com/Search?keyword=%E5%8F%AF%E9%92%A9%E7%89%8C%E9%92%A9%E9%92%88', price: '¥38' },
    { platform: '拼多多', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=%E5%8F%AF%E9%92%A9%E7%89%8C%E9%92%A9%E9%92%88', price: '¥25' },
  ],
  '七针坊钩针': [
    { platform: '淘宝', url: 'https://s.taobao.com/search?q=%E4%B8%83%E9%92%88%E5%9D%8A%E9%92%A9%E9%92%88', price: '¥22' },
    { platform: '京东', url: 'https://search.jd.com/Search?keyword=%E4%B8%83%E9%92%88%E5%9D%8A%E9%92%A9%E9%92%88', price: '¥30' },
    { platform: '拼多多', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=%E4%B8%83%E9%92%88%E5%9D%8A%E9%92%A9%E9%92%88', price: '¥20' },
  ],
  'Clover 可乐经典金色笔式钩针': [
    { platform: '淘宝', url: 'https://s.taobao.com/search?q=Clover+%E5%8F%AF%E4%B9%90+%E9%87%91%E8%89%B2%E7%AC%94%E5%BC%8F%E9%92%A9%E9%92%88', price: '¥32' },
    { platform: '京东', url: 'https://search.jd.com/Search?keyword=%E5%8F%AF%E4%B9%90+%E9%87%91%E8%89%B2%E7%AC%94%E5%BC%8F%E9%92%A9%E9%92%88', price: '¥42' },
    { platform: '拼多多', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=%E5%8F%AF%E4%B9%90+%E9%87%91%E8%89%B2%E7%AC%94%E5%BC%8F%E9%92%A9%E9%92%88', price: '¥28' },
  ],
  'KnitPro Waves 彩木钩针套装': [
    { platform: '淘宝', url: 'https://s.taobao.com/search?q=KnitPro+Waves+%E9%92%A9%E9%92%88%E5%A5%97%E8%A3%85', price: '¥148' },
    { platform: '京东', url: 'https://search.jd.com/Search?keyword=KnitPro+%E9%92%A9%E9%92%88%E5%A5%97%E8%A3%85', price: '¥168' },
    { platform: '拼多多', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=KnitPro+%E9%92%A9%E9%92%88%E5%A5%97%E8%A3%85', price: '¥128' },
  ],
  '潮购牌钩针': [
    { platform: '淘宝', url: 'https://s.taobao.com/search?q=%E6%BD%AE%E8%B4%AD%E7%89%8C%E9%92%A9%E9%92%88', price: '¥20' },
    { platform: '京东', url: 'https://search.jd.com/Search?keyword=%E6%BD%AE%E8%B4%AD%E7%89%8C%E9%92%A9%E9%92%88', price: '¥30' },
    { platform: '拼多多', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=%E6%BD%AE%E8%B4%AD%E7%89%8C%E9%92%A9%E9%92%88', price: '¥18' },
  ],
  '普通竹制钩针套装': [
    { platform: '淘宝', url: 'https://s.taobao.com/search?q=%E7%AB%B9%E5%88%B6%E9%92%A9%E9%92%88%E5%A5%97%E8%A3%85', price: '¥12.9' },
    { platform: '京东', url: 'https://search.jd.com/Search?keyword=%E7%AB%B9%E5%88%B6%E9%92%A9%E9%92%88%E5%A5%97%E8%A3%85', price: '¥19.9' },
    { platform: '拼多多', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=%E7%AB%B9%E5%88%B6%E9%92%A9%E9%92%88%E5%A5%97%E8%A3%85', price: '¥9.9' },
  ],
}

// 毛线产品购买链接 - 具体价格 + 搜索链接
const yarnLinks = {
  '雪妃尔萌娃娃四股牛奶棉': [
    { platform: '淘宝', url: 'https://s.taobao.com/search?q=%E9%9B%AA%E5%A6%83%E5%B0%94+%E8%90%8C%E5%A8%83%E5%A8%83+%E5%9B%9B%E8%82%A1%E7%89%9B%E5%A5%B6%E6%A3%89', price: '¥4.5' },
    { platform: '京东', url: 'https://search.jd.com/Search?keyword=%E9%9B%AA%E5%A6%83%E5%B0%94+%E8%90%8C%E5%A8%83%E5%A8%83+%E7%89%9B%E5%A5%B6%E6%A3%89', price: '¥5.9' },
    { platform: '拼多多', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=%E9%9B%AA%E5%A6%83%E5%B0%94+%E8%90%8C%E5%A8%83%E5%A8%83+%E7%89%9B%E5%A5%B6%E6%A3%89', price: '¥3.9' },
  ],
  '雪妃尔五股牛奶棉': [
    { platform: '淘宝', url: 'https://s.taobao.com/search?q=%E9%9B%AA%E5%A6%83%E5%B0%94+%E4%BA%94%E8%82%A1%E7%89%9B%E5%A5%B6%E6%A3%89', price: '¥5.9' },
    { platform: '京东', url: 'https://search.jd.com/Search?keyword=%E9%9B%AA%E5%A6%83%E5%B0%94+%E4%BA%94%E8%82%A1%E7%89%9B%E5%A5%B6%E6%A3%89', price: '¥7.5' },
    { platform: '拼多多', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=%E9%9B%AA%E5%A6%83%E5%B0%94+%E4%BA%94%E8%82%A1%E7%89%9B%E5%A5%B6%E6%A3%89', price: '¥5.2' },
  ],
  '苏苏姐家四股精梳棉': [
    { platform: '淘宝', url: 'https://s.taobao.com/search?q=%E8%8B%8F%E8%8B%8F%E5%A7%90%E5%AE%B6+%E5%9B%9B%E8%82%A1%E7%B2%BE%E6%A2%B3%E6%A3%89', price: '¥6.8' },
    { platform: '京东', url: 'https://search.jd.com/Search?keyword=%E8%8B%8F%E8%8B%8F%E5%A7%90%E5%AE%B6+%E5%9B%9B%E8%82%A1%E7%B2%BE%E6%A2%B3%E6%A3%89', price: '¥8.5' },
    { platform: '拼多多', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=%E8%8B%8F%E8%8B%8F%E5%A7%90%E5%AE%B6+%E5%9B%9B%E8%82%A1%E7%B2%BE%E6%A2%B3%E6%A3%89', price: '¥6' },
  ],
  '恒源祥纯羊毛线': [
    { platform: '淘宝', url: 'https://s.taobao.com/search?q=%E6%81%92%E6%BA%90%E7%A5%A5+%E7%BA%AF%E7%BE%8A%E6%AF%9B%E7%BA%BF+%E4%B8%AD%E7%B2%97', price: '¥10' },
    { platform: '京东', url: 'https://search.jd.com/Search?keyword=%E6%81%92%E6%BA%90%E7%A5%A5+%E7%BA%AF%E7%BE%8A%E6%AF%9B%E7%BA%BF', price: '¥15' },
    { platform: '拼多多', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=%E6%81%92%E6%BA%90%E7%A5%A5+%E7%BA%AF%E7%BE%8A%E6%AF%9B%E7%BA%BF', price: '¥8.9' },
  ],
  '九色鹿时尚棉线': [
    { platform: '淘宝', url: 'https://s.taobao.com/search?q=%E4%B9%9D%E8%89%B2%E9%B9%BF+%E6%A3%89%E7%BA%BF+%E9%92%A9%E7%BB%87', price: '¥9.9' },
    { platform: '京东', url: 'https://search.jd.com/Search?keyword=%E4%B9%9D%E8%89%B2%E9%B9%BF+%E6%A3%89%E7%BA%BF', price: '¥12' },
  ],
  '苏苏姐家段染棉': [
    { platform: '淘宝', url: 'https://s.taobao.com/search?q=%E8%8B%8F%E8%8B%8F%E5%A7%90%E5%AE%B6+%E6%AE%B5%E6%9F%93%E6%A3%89', price: '¥8.5' },
    { platform: '京东', url: 'https://search.jd.com/Search?keyword=%E8%8B%8F%E8%8B%8F%E5%A7%90%E5%AE%B6+%E6%AE%B5%E6%9F%93%E6%A3%89', price: '¥11' },
    { platform: '拼多多', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=%E8%8B%8F%E8%8B%8F%E5%A7%90%E5%AE%B6+%E6%AE%B5%E6%9F%93%E6%A3%89', price: '¥7' },
  ],
  '冰丝线（夏季专用）': [
    { platform: '淘宝', url: 'https://s.taobao.com/search?q=%E5%86%B0%E4%B8%9D%E7%BA%BF+%E9%92%A9%E7%BB%87+%E5%8C%85%E5%8C%85', price: '¥6.8' },
    { platform: '京东', url: 'https://search.jd.com/Search?keyword=%E5%86%B0%E4%B8%9D%E7%BA%BF+%E9%92%A9%E7%BB%87', price: '¥9.9' },
    { platform: '拼多多', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=%E5%86%B0%E4%B8%9D%E7%BA%BF+%E9%92%A9%E7%BB%87', price: '¥5.8' },
  ],
  '5号蕾丝棉线': [
    { platform: '淘宝', url: 'https://s.taobao.com/search?q=5%E5%8F%B7%E8%95%BE%E4%B8%9D%E6%A3%89%E7%BA%BF+%E9%92%A9%E7%BB%87', price: '¥8.5' },
    { platform: '京东', url: 'https://search.jd.com/Search?keyword=5%E5%8F%B7%E8%95%BE%E4%B8%9D%E6%A3%89%E7%BA%BF', price: '¥12' },
    { platform: '拼多多', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=5%E5%8F%B7%E8%95%BE%E4%B8%9D%E6%A3%89%E7%BA%BF', price: '¥7' },
  ],
  '棉麻混纺线': [
    { platform: '淘宝', url: 'https://s.taobao.com/search?q=%E6%A3%89%E9%BA%BB%E6%B7%B7%E7%BA%BA%E7%BA%BF+%E9%92%A9%E7%BB%87', price: '¥13' },
    { platform: '京东', url: 'https://search.jd.com/Search?keyword=%E6%A3%89%E9%BA%BB%E6%B7%B7%E7%BA%BA%E7%BA%BF+%E9%92%A9%E7%BB%87', price: '¥18' },
  ],
  '三利纯棉毛线': [
    { platform: '淘宝', url: 'https://s.taobao.com/search?q=%E4%B8%89%E5%88%A9+%E7%BA%AF%E6%A3%89%E6%AF%9B%E7%BA%BF', price: '¥7.9' },
    { platform: '京东', url: 'https://search.jd.com/Search?keyword=%E4%B8%89%E5%88%A9+%E7%BA%AF%E6%A3%89%E6%AF%9B%E7%BA%BF', price: '¥10' },
    { platform: '拼多多', url: 'https://mobile.yangkeduo.com/search_result.html?search_key=%E4%B8%89%E5%88%A9+%E7%BA%AF%E6%A3%89%E6%AF%9B%E7%BA%BF', price: '¥6.8' },
  ],
}

const allLinks = { ...yarnLinks, ...hookLinks }

for (const p of products) {
  const result = insertProduct.run(p.name, p.category, p.subcategory, p.description, p.price_range, p.rating, p.rating_count, p.rank || 0, p.recommend_reason || null, p.image_url || null)
  const pid = result.lastInsertRowid
  const links = allLinks[p.name]
  if (links) {
    for (const link of links) {
      insertLink.run(pid, link.platform, link.url, link.price)
    }
  }
}

// Seed resources
const resources = [
  {
    title: '初学者入门：锁针与短针基础教学',
    type: 'video',
    category: 'other',
    description: '从零开始学钩织！本视频详细讲解锁针起针法和短针的基本钩法，配合慢动作演示，适合完全没有基础的新手。',
    video_url: 'https://www.bilibili.com/video/BV1example1',
    platform: 'bilibili',
    author: '钩织小课堂',
    image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=300&fit=crop',
  },
  {
    title: '可爱小熊玩偶图解',
    type: 'pattern',
    category: 'doll',
    description: '超萌小熊玩偶详细图解，含头部、身体、四肢分片说明。使用棉线+3.0mm钩针，成品约15cm高。新手友好！',
    file_url: '#',
    image_url: 'https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=400&h=300&fit=crop',
  },
  {
    title: '花朵祖母方格围巾教程',
    type: 'video',
    category: 'scarf',
    description: '经典祖母方格花样的围巾编织教程，从单个花片到拼接完成，手把手教学。成品温暖又文艺。',
    video_url: 'https://www.bilibili.com/video/BV1example2',
    platform: 'bilibili',
    author: '编织达人小美',
    image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=300&fit=crop&hue=330',
  },
  {
    title: '手提编织包图解（含内衬教程）',
    type: 'pattern',
    category: 'bag',
    description: '时尚手提包完整图解，含包体、提手、装饰花朵的钩法。额外附赠内衬缝制教程，实用与美观兼具。',
    file_url: '#',
    image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=300&fit=crop',
  },
  {
    title: '圆形渔夫帽钩织教学',
    type: 'video',
    category: 'hat',
    description: '夏日必备渔夫帽教程！使用冰丝线或棉线，从帽顶开始往下钩，一体成型无需缝合。',
    video_url: 'https://www.bilibili.com/video/BV1example3',
    platform: 'bilibili',
    author: '手工生活馆',
    image_url: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=300&fit=crop',
  },
  {
    title: '经典菠萝花样方巾图解',
    type: 'pattern',
    category: 'scarf',
    description: '传统菠萝花样方巾图解，花样优雅细腻。使用蕾丝线钩织效果最佳，可作为桌布或披肩使用。',
    file_url: '#',
    image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=300&fit=crop&hue=60',
  },
  {
    title: '安抚兔玩偶视频教程',
    type: 'video',
    category: 'doll',
    description: '超人气安抚兔详细视频教程，适合送给宝宝的礼物。使用有机棉线，安全无害。分3集讲解完成。',
    video_url: 'https://www.bilibili.com/video/BV1example4',
    platform: 'bilibili',
    author: '钩织妈妈',
    image_url: 'https://images.unsplash.com/photo-1585399000684-d2f72660f092?w=400&h=300&fit=crop',
  },
  {
    title: '北欧风杯垫套装图解',
    type: 'pattern',
    category: 'other',
    description: '六款北欧几何风格杯垫图解，简约大方。使用棉线钩织，可作为家居装饰或伴手礼。',
    file_url: '#',
    image_url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop',
  },
  {
    title: '斜挎手机包编织教程',
    type: 'video',
    category: 'bag',
    description: '实用斜挎手机包教程，含链条带制作方法。小巧精致，出门只带手机时非常方便！',
    video_url: 'https://www.bilibili.com/video/BV1example5',
    platform: 'bilibili',
    author: '时尚编织坊',
    image_url: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=300&fit=crop&hue=180',
  },
  {
    title: '婴儿毯拼花图解合集',
    type: 'pattern',
    category: 'blanket',
    description: '5种花片拼接而成的婴儿毯图解，含花片钩法和拼接方法。柔软棉线材质，给宝宝最温柔的呵护。',
    file_url: '#',
    image_url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&h=300&fit=crop',
  },
]

const insertResource = db.prepare('INSERT INTO resources (title, type, category, description, image_url, file_url, video_url, platform, author) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
for (const r of resources) {
  insertResource.run(r.title, r.type, r.category, r.description, r.image_url || null, r.file_url || null, r.video_url || null, r.platform || null, r.author || null)
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
console.log(`- ${yarnProducts.length} yarn products (ranked by 小红书 recommendations)`)
console.log(`- ${hookProducts.length} hook products (ranked by 小红书 recommendations)`)
console.log('- 10 resources')
console.log('- 5 forum posts with comments')
