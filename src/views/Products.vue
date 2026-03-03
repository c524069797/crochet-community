<template>
  <div class="container">
    <div class="page-header">
      <h1>产品库</h1>
      <p>精选钩织工具与材料，找到你心仪的好物</p>
    </div>

    <div class="filter-bar">
      <button class="filter-btn" :class="{ active: filter === 'all' }" @click="filter = 'all'; subFilter = ''">全部</button>
      <button class="filter-btn" :class="{ active: filter === 'yarn' }" @click="filter = 'yarn'; subFilter = ''">毛线</button>
      <button class="filter-btn" :class="{ active: filter === 'hook' }" @click="filter = 'hook'; subFilter = ''">钩针</button>
    </div>

    <div class="filter-bar" v-if="filter === 'yarn'">
      <button class="filter-btn btn-sm" :class="{ active: subFilter === '' }" @click="subFilter = ''">全部毛线</button>
      <button class="filter-btn btn-sm" :class="{ active: subFilter === 'cotton' }" @click="subFilter = 'cotton'">棉线</button>
      <button class="filter-btn btn-sm" :class="{ active: subFilter === 'wool' }" @click="subFilter = 'wool'">羊毛</button>
      <button class="filter-btn btn-sm" :class="{ active: subFilter === 'acrylic' }" @click="subFilter = 'acrylic'">腈纶</button>
      <button class="filter-btn btn-sm" :class="{ active: subFilter === 'blend' }" @click="subFilter = 'blend'">混纺</button>
    </div>

    <!-- 榜单声明 -->
    <div v-if="filter === 'hook' || filter === 'yarn'" class="ranking-header">
      <div class="ranking-title-row">
        <h2 class="ranking-title">{{ filter === 'hook' ? '钩针推荐榜' : '毛线推荐榜' }}</h2>
        <span class="ranking-source">数据来源：小红书社区口碑</span>
      </div>
      <p class="ranking-desc">基于小红书700万+钩织笔记中的用户评价、推荐频次和口碑综合排名。购买链接将跳转至第三方电商平台，价格以实际页面为准。</p>
    </div>

    <div class="grid" :class="(filter === 'hook' || filter === 'yarn') ? 'grid-3' : 'grid-4'" v-if="filtered.length">
      <ProductCard v-for="p in filtered" :key="p.id" :product="p" />
    </div>
    <div v-else class="empty-state">
      <span>📦</span>
      <p>暂无相关产品</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'

const products = ref([])
const filter = ref('all')
const subFilter = ref('')

const filtered = computed(() => {
  let list = products.value
  if (filter.value !== 'all') list = list.filter(p => p.category === filter.value)
  if (subFilter.value) list = list.filter(p => p.subcategory === subFilter.value)
  // 钩针和毛线都按 rank 排序
  if (filter.value === 'hook' || filter.value === 'yarn') {
    list = [...list].sort((a, b) => (a.rank || 999) - (b.rank || 999))
  }
  return list
})

onMounted(async () => {
  const res = await fetch('/api/products')
  products.value = await res.json()
})
</script>

<style scoped>
.ranking-header {
  background: linear-gradient(135deg, #fdf2f8, #fce7f3, #f3e8ff);
  border: 1px solid #f0d5e8;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
}
.ranking-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}
.ranking-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #7c3aed;
  margin: 0;
}
.ranking-source {
  font-size: 0.75rem;
  color: #e8a0bf;
  background: #fff;
  padding: 2px 10px;
  border-radius: 20px;
  border: 1px solid #f0d5e8;
}
.ranking-desc {
  font-size: 0.82rem;
  color: #8a6d7b;
  margin: 0;
  line-height: 1.6;
}
</style>
