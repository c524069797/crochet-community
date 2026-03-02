<template>
  <div class="container">
    <div class="page-header">
      <h1>产品库</h1>
      <p>精选钩织工具与材料，找到你心仪的好物</p>
    </div>

    <div class="filter-bar">
      <button class="filter-btn" :class="{ active: filter === 'all' }" @click="filter = 'all'">全部</button>
      <button class="filter-btn" :class="{ active: filter === 'yarn' }" @click="filter = 'yarn'">🧶 毛线</button>
      <button class="filter-btn" :class="{ active: filter === 'hook' }" @click="filter = 'hook'">🪝 钩针</button>
    </div>

    <div class="filter-bar" v-if="filter === 'yarn'">
      <button class="filter-btn btn-sm" :class="{ active: subFilter === '' }" @click="subFilter = ''">全部毛线</button>
      <button class="filter-btn btn-sm" :class="{ active: subFilter === 'cotton' }" @click="subFilter = 'cotton'">棉线</button>
      <button class="filter-btn btn-sm" :class="{ active: subFilter === 'wool' }" @click="subFilter = 'wool'">羊毛</button>
      <button class="filter-btn btn-sm" :class="{ active: subFilter === 'acrylic' }" @click="subFilter = 'acrylic'">腈纶</button>
      <button class="filter-btn btn-sm" :class="{ active: subFilter === 'blend' }" @click="subFilter = 'blend'">混纺</button>
    </div>

    <div class="grid grid-4" v-if="filtered.length">
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
  return list
})

onMounted(async () => {
  const res = await fetch('/api/products')
  products.value = await res.json()
})
</script>
