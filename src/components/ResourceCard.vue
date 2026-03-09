<template>
  <div class="card resource-card">
    <div class="card-header" :class="resource.type === 'pattern' ? 'header-pattern' : 'header-video'">
      <div class="resource-icon">
        {{ resource.type === 'pattern' ? '📐' : '🎬' }}
      </div>
      <span v-if="resource.platform" class="source-badge">
        {{ platformLabel }}
      </span>
    </div>
    <div class="card-body">
      <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
        <span class="tag" :class="resource.type === 'pattern' ? 'tag-pink' : 'tag-blue'">
          {{ resource.type === 'pattern' ? '图解' : '视频' }}
        </span>
        <span class="tag tag-purple">{{ categoryLabel }}</span>
      </div>
      <h3 class="card-title">{{ resource.title }}</h3>

      <!-- 视频作者信息 -->
      <div v-if="resource.type === 'video' && (resource.platform || resource.author)" class="author-info">
        <span v-if="resource.platform" class="platform-label">{{ platformLabel }}</span>
        <span v-if="resource.author" class="author-name">@{{ resource.author }}</span>
      </div>

      <p class="card-text">{{ resource.description?.slice(0, 80) }}</p>
      <div class="card-actions">
        <a v-if="resource.type === 'video' && resource.video_url" href="#" class="btn btn-sm btn-outline" @click.prevent="handleJump(resource.video_url)">观看视频</a>
        <a v-if="resource.type === 'pattern' && resource.file_url" href="#" class="btn btn-sm btn-outline" @click.prevent="handleJump(resource.file_url)">查看图解</a>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ resource: Object })
const categoryMap = { doll: '玩偶', scarf: '围巾', bag: '包包', hat: '帽子', blanket: '毯子', other: '其他' }
const categoryLabel = categoryMap[props.resource.category] || props.resource.category

const platformMap = { bilibili: 'B站', xiaohongshu: '小红书', douyin: '抖音' }
const platformLabel = platformMap[props.resource.platform] || props.resource.platform || ''

function handleJump(url) {
  if (!url || url === '#') return
  const host = new URL(url).hostname
  const confirmed = confirm(`即将跳转至第三方网站（${host}）\n\n本站仅提供资源索引，不对第三方内容负责。\n是否继续？`)
  if (confirmed) {
    window.open(url, '_blank')
  }
}
</script>

<style scoped>
.resource-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 16px 16px 0 0;
}

.header-pattern {
  background: linear-gradient(135deg, #FFE5F0 0%, #FFD4E5 100%);
}

.header-video {
  background: linear-gradient(135deg, #E5F4FF 0%, #D4EEF7 100%);
}

.resource-icon {
  font-size: 4.5rem;
  line-height: 1;
  opacity: 0.9;
}

.source-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0 10px;
  font-size: 0.85rem;
}

.platform-label {
  color: var(--primary-dark);
  font-weight: 500;
}

.author-name {
  color: var(--text-light);
}

.card-actions {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

@media (max-width: 480px) {
  .card-header {
    height: 120px;
  }

  .resource-icon {
    font-size: 3.5rem;
  }

  .author-info {
    font-size: 0.8rem;
  }
}
</style>
