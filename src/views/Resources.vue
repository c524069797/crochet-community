<template>
  <div class="container">
    <div class="page-header">
      <h1>资源库</h1>
      <p>图解教程与视频教学，助你提升钩织技能</p>
    </div>

    <div class="third-party-notice">
      <span class="notice-icon">ℹ️</span>
      <span>本页面部分资源来自第三方平台（B站等），点击将跳转至原始网站。本站仅提供索引服务，不存储任何第三方内容，相关权利归原作者所有。</span>
    </div>

    <div class="tab-bar">
      <button class="tab-btn" :class="{ active: tab === 'all' }" @click="tab = 'all'">全部</button>
      <button class="tab-btn" :class="{ active: tab === 'pattern' }" @click="tab = 'pattern'">📖 图解</button>
      <button class="tab-btn" :class="{ active: tab === 'video' }" @click="tab = 'video'">🎬 视频</button>
    </div>

    <div class="filter-bar">
      <button class="filter-btn" :class="{ active: category === '' }" @click="category = ''">全部分类</button>
      <button class="filter-btn" :class="{ active: category === 'doll' }" @click="category = 'doll'">玩偶</button>
      <button class="filter-btn" :class="{ active: category === 'scarf' }" @click="category = 'scarf'">围巾</button>
      <button class="filter-btn" :class="{ active: category === 'bag' }" @click="category = 'bag'">包包</button>
      <button class="filter-btn" :class="{ active: category === 'hat' }" @click="category = 'hat'">帽子</button>
      <button class="filter-btn" :class="{ active: category === 'blanket' }" @click="category = 'blanket'">毯子</button>
    </div>

    <div class="grid grid-3" v-if="filtered.length">
      <ResourceCard v-for="r in filtered" :key="r.id" :resource="r" />
    </div>
    <div v-else class="empty-state">
      <span>📚</span>
      <p>暂无相关资源</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ResourceCard from '../components/ResourceCard.vue'

const resources = ref([])
const tab = ref('all')
const category = ref('')

const filtered = computed(() => {
  let list = resources.value
  if (tab.value !== 'all') list = list.filter(r => r.type === tab.value)
  if (category.value) list = list.filter(r => r.category === category.value)
  return list
})

onMounted(async () => {
  const res = await fetch('/api/resources')
  resources.value = await res.json()
})
</script>

<style scoped>
.third-party-notice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #fef9ef;
  border: 1px solid #f0dca0;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 0.85rem;
  color: #8a6d3b;
  line-height: 1.5;
}
.notice-icon {
  flex-shrink: 0;
}
</style>
