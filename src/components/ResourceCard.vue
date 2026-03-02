<template>
  <div class="card">
    <div class="card-img" :style="{ background: resource.image_url ? `url(${resource.image_url}) center/cover` : gradient }">
      <div v-if="resource.type === 'video'" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.2)">
        <span style="font-size:3rem">▶</span>
      </div>
    </div>
    <div class="card-body">
      <div style="display:flex;gap:8px;margin-bottom:10px">
        <span class="tag" :class="resource.type === 'pattern' ? 'tag-pink' : 'tag-blue'">
          {{ resource.type === 'pattern' ? '图解' : '视频' }}
        </span>
        <span class="tag tag-purple">{{ categoryLabel }}</span>
      </div>
      <h3 class="card-title">{{ resource.title }}</h3>
      <p class="card-text">{{ resource.description?.slice(0, 80) }}</p>
      <div style="margin-top:12px">
        <a v-if="resource.type === 'video' && resource.video_url" :href="resource.video_url" target="_blank" class="btn btn-sm btn-outline">观看视频</a>
        <a v-if="resource.type === 'pattern' && resource.file_url" :href="resource.file_url" target="_blank" class="btn btn-sm btn-outline">查看图解</a>
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
</script>

<style scoped>
.card-img { position: relative; }
</style>
