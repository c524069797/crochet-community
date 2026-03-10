<template>
  <div class="container">
    <div class="page-header">
      <h1>{{ $t('resources.title') }}</h1>
      <p>{{ $t('resources.subtitle') }}</p>
    </div>

    <div class="third-party-notice">
      <span class="notice-icon">ℹ️</span>
      <span>{{ $t('resources.thirdPartyNotice') }}</span>
    </div>

    <div class="tab-bar">
      <button class="tab-btn" :class="{ active: tab === 'all' }" @click="tab = 'all'">{{ $t('resources.all') }}</button>
      <button class="tab-btn" :class="{ active: tab === 'pattern' }" @click="tab = 'pattern'">📖 {{ $t('resources.pattern') }}</button>
      <button class="tab-btn" :class="{ active: tab === 'video' }" @click="tab = 'video'">🎬 {{ $t('resources.video') }}</button>
    </div>

    <div class="filter-bar">
      <button class="filter-btn" :class="{ active: category === '' }" @click="category = ''">{{ $t('resources.allCategories') }}</button>
      <button class="filter-btn" :class="{ active: category === 'doll' }" @click="category = 'doll'">{{ $t('resources.doll') }}</button>
      <button class="filter-btn" :class="{ active: category === 'scarf' }" @click="category = 'scarf'">{{ $t('resources.scarf') }}</button>
      <button class="filter-btn" :class="{ active: category === 'bag' }" @click="category = 'bag'">{{ $t('resources.bag') }}</button>
      <button class="filter-btn" :class="{ active: category === 'hat' }" @click="category = 'hat'">{{ $t('resources.hat') }}</button>
      <button class="filter-btn" :class="{ active: category === 'blanket' }" @click="category = 'blanket'">{{ $t('resources.blanket') }}</button>
    </div>

    <div class="grid grid-3" v-if="filtered.length">
      <ResourceCard v-for="r in filtered" :key="r.id" :resource="r" />
    </div>
    <div v-else-if="loadError" class="empty-state">
      <span>⚠️</span>
      <p>{{ $t('resources.loadFailed') }}</p>
    </div>
    <div v-else class="empty-state">
      <span>📚</span>
      <p>{{ $t('resources.empty') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ResourceCard from '../components/ResourceCard.vue'

const resources = ref([])
const tab = ref('all')
const category = ref('')
const loadError = ref(false)

const filtered = computed(() => {
  let list = resources.value
  if (tab.value !== 'all') list = list.filter(r => r.type === tab.value)
  if (category.value) list = list.filter(r => r.category === category.value)
  return list
})

onMounted(async () => {
  try {
    const res = await fetch('/api/resources')
    if (res.ok) {
      resources.value = await res.json()
    } else {
      loadError.value = true
    }
  } catch (err) {
    console.error('Failed to load resources:', err)
    loadError.value = true
  }
})
</script>

<style scoped>
.third-party-notice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #FFFBEB;
  border: 1px solid #F5DCA0;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 0.85rem;
  color: #8A6D3B;
  line-height: 1.5;
}
.notice-icon {
  flex-shrink: 0;
}
</style>
