<template>
  <div class="card">
    <div class="card-img" :style="{ background: resource.image_url ? `url(${resource.image_url}) center/cover` : gradient }">
      <div v-if="resource.type === 'video'" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.2)">
        <span style="font-size:3rem">▶</span>
      </div>
      <span v-if="resource.platform" class="source-badge">
        {{ platformLabel }}
      </span>
    </div>
    <div class="card-body">
      <div style="display:flex;gap:8px;margin-bottom:10px">
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
const colors = ['#C0DBEA','#E8A0BF','#BA90C6','#F5D5C8','#B5E8CC']
const gradient = `linear-gradient(135deg, ${colors[props.resource.id % 5]}, ${colors[(props.resource.id + 3) % 5]})`

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
.card-img { position: relative; }
.source-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
}
.author-info {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 6px 0 8px;
  font-size: 0.8rem;
  color: var(--text-muted);
}
.platform-label {
  color: var(--primary-dark);
  font-weight: 500;
}
.author-name {
  color: var(--text-light);
}
.card-actions {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.source-text {
  font-size: 0.75rem;
  color: #999;
}

@media (max-width: 480px) {
  .author-info {
    font-size: 0.75rem;
  }
}
</style>
