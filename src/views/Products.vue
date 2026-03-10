<template>
  <div class="container">
    <div class="page-header">
      <h1>{{ $t('products.title') }}</h1>
      <p>{{ $t('products.subtitle') }}</p>
    </div>

    <div class="filter-bar">
      <button class="filter-btn" :class="{ active: filter === 'all' }" @click="filter = 'all'; subFilter = ''">{{ $t('products.all') }}</button>
      <button class="filter-btn" :class="{ active: filter === 'yarn' }" @click="filter = 'yarn'; subFilter = ''">{{ $t('products.yarn') }}</button>
      <button class="filter-btn" :class="{ active: filter === 'hook' }" @click="filter = 'hook'; subFilter = ''">{{ $t('products.hook') }}</button>
    </div>

    <div class="filter-bar" v-if="filter === 'yarn'">
      <button class="filter-btn btn-sm" :class="{ active: subFilter === '' }" @click="subFilter = ''">{{ $t('products.allYarn') }}</button>
      <button class="filter-btn btn-sm" :class="{ active: subFilter === 'cotton' }" @click="subFilter = 'cotton'">{{ $t('products.cotton') }}</button>
      <button class="filter-btn btn-sm" :class="{ active: subFilter === 'wool' }" @click="subFilter = 'wool'">{{ $t('products.wool') }}</button>
      <button class="filter-btn btn-sm" :class="{ active: subFilter === 'acrylic' }" @click="subFilter = 'acrylic'">{{ $t('products.acrylic') }}</button>
      <button class="filter-btn btn-sm" :class="{ active: subFilter === 'blend' }" @click="subFilter = 'blend'">{{ $t('products.blend') }}</button>
    </div>

    <!-- Ranking Notice -->
    <div v-if="filter === 'hook' || filter === 'yarn'" class="ranking-header">
      <div class="ranking-title-row">
        <h2 class="ranking-title">{{ filter === 'hook' ? $t('products.hookRanking') : $t('products.yarnRanking') }}</h2>
        <span class="ranking-source">{{ $t('products.rankingSource') }}</span>
      </div>
      <p class="ranking-desc">{{ $t('products.rankingDesc') }}</p>
    </div>

    <div class="grid" :class="(filter === 'hook' || filter === 'yarn') ? 'grid-3' : 'grid-4'" v-if="filtered.length">
      <ProductCard v-for="p in filtered" :key="p.id" :product="p" />
    </div>
    <div v-else class="empty-state">
      <span>📦</span>
      <p>{{ $t('products.empty') }}</p>
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
  background: var(--primary-light);
  border: 1px solid rgba(74, 124, 89, 0.2);
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
  color: var(--primary-dark);
  margin: 0;
}
.ranking-source {
  font-size: 0.75rem;
  color: var(--primary);
  background: #fff;
  padding: 2px 10px;
  border-radius: 20px;
  border: 1px solid rgba(74, 124, 89, 0.2);
}
.ranking-desc {
  font-size: 0.82rem;
  color: var(--text-light);
  margin: 0;
  line-height: 1.6;
}
</style>
