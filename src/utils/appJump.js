/**
 * 第三方电商平台 App 跳转工具
 * 支持淘宝、天猫、拼多多、京东等平台
 */

// 检测是否为移动设备
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

// 检测是否为微信浏览器
export function isWeChat() {
  return /MicroMessenger/i.test(navigator.userAgent)
}

// 检测是否为iOS设备
export function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

// 检测是否为Android设备
export function isAndroid() {
  return /Android/i.test(navigator.userAgent)
}

/**
 * 从URL中提取商品ID
 * @param {string} url - 商品链接
 * @param {string} platform - 平台名称
 * @returns {string|null} 商品ID
 */
function extractProductId(url, platform) {
  try {
    const urlObj = new URL(url)

    switch(platform) {
      case '淘宝':
      case '天猫':
        // 淘宝/天猫: id=数字 或 item.htm?id=数字
        const idMatch = url.match(/[?&]id=(\d+)/)
        return idMatch ? idMatch[1] : null

      case '拼多多':
        // 拼多多: goods_id=数字
        const goodsMatch = url.match(/goods_id=(\d+)/)
        return goodsMatch ? goodsMatch[1] : null

      case '京东':
        // 京东: /数字.html
        const jdMatch = url.match(/\/(\d+)\.html/)
        return jdMatch ? jdMatch[1] : null

      default:
        return null
    }
  } catch (e) {
    console.error('提取商品ID失败:', e)
    return null
  }
}

/**
 * 生成App跳转链接
 * @param {string} platform - 平台名称
 * @param {string} url - 原始URL
 * @returns {string|null} App scheme URL
 */
function generateAppScheme(platform, url) {
  const productId = extractProductId(url, platform)

  switch(platform) {
    case '淘宝':
    case '天猫':
      // 淘宝/天猫 App scheme
      if (productId) {
        return `taobao://item.taobao.com/item.htm?id=${productId}`
      }
      // 如果无法提取ID，使用通用打开方式
      return `taobao://` + url.replace(/^https?:\/\//, '')

    case '拼多多':
      // 拼多多 App scheme
      if (productId) {
        return `pinduoduo://com.xunmeng.pinduoduo/goods_detail.html?goods_id=${productId}`
      }
      return null

    case '京东':
      // 京东 App scheme
      if (productId) {
        return `openapp.jdmobile://virtual?params={"category":"jump","des":"productDetail","productId":"${productId}"}`
      }
      return null

    default:
      return null
  }
}

/**
 * 智能跳转：优先打开App，失败则打开网页
 * @param {Object} options
 * @param {string} options.platform - 平台名称
 * @param {string} options.url - 商品链接
 * @param {Function} options.onSuccess - 成功回调
 * @param {Function} options.onFail - 失败回调
 */
export function smartJump({ platform, url, onSuccess, onFail }) {
  // 如果不是移动设备，直接打开网页
  if (!isMobile()) {
    window.open(url, '_blank')
    onSuccess && onSuccess('web')
    return
  }

  // 如果在微信中，提示用户在浏览器中打开
  if (isWeChat()) {
    alert('请点击右上角"..."，选择"在浏览器中打开"以获得最佳体验')
    onFail && onFail('wechat')
    return
  }

  // 尝试生成App scheme
  const appScheme = generateAppScheme(platform, url)

  if (!appScheme) {
    // 如果无法生成scheme，直接打开网页
    window.location.href = url
    onSuccess && onSuccess('web')
    return
  }

  // 尝试打开App
  const startTime = Date.now()
  let timer = null

  // 设置超时检测
  timer = setTimeout(() => {
    const endTime = Date.now()
    // 如果时间差小于2秒，说明可能没有打开App，跳转到网页
    if (endTime - startTime < 2000) {
      window.location.href = url
      onFail && onFail('timeout')
    }
  }, 1500)

  // 监听页面可见性变化
  const visibilityChange = () => {
    if (document.hidden) {
      // 页面隐藏，说明App可能已打开
      clearTimeout(timer)
      onSuccess && onSuccess('app')
    }
  }

  document.addEventListener('visibilitychange', visibilityChange)

  // 尝试打开App
  window.location.href = appScheme

  // 清理监听器
  setTimeout(() => {
    document.removeEventListener('visibilitychange', visibilityChange)
  }, 3000)
}

/**
 * 获取平台图标
 * @param {string} platform - 平台名称
 * @returns {string} 图标emoji或文字
 */
export function getPlatformIcon(platform) {
  const icons = {
    '淘宝': '🛒',
    '天猫': '🐱',
    '拼多多': '🛍️',
    '京东': '📦',
    '1688': '🏭',
    '闲鱼': '🐟'
  }
  return icons[platform] || '🔗'
}

/**
 * 获取平台颜色
 * @param {string} platform - 平台名称
 * @returns {string} 颜色值
 */
export function getPlatformColor(platform) {
  const colors = {
    '淘宝': '#FF6600',
    '天猫': '#FF0036',
    '拼多多': '#E02E24',
    '京东': '#E3393C',
    '1688': '#FF6600',
    '闲鱼': '#FFAE00'
  }
  return colors[platform] || '#666'
}
