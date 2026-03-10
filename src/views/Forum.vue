<template>
  <div class="container">
    <div class="page-header">
      <h1>{{ $t('forum.title') }}</h1>
      <p>{{ $t('forum.subtitle') }}</p>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:12px">
      <div class="filter-bar" style="margin-bottom:0">
        <button class="filter-btn" :class="{ active: category === '' }" @click="category = ''">{{ $t('forum.all') }}</button>
        <button class="filter-btn" :class="{ active: category === 'showcase' }" @click="category = 'showcase'">{{ $t('forum.showcase') }}</button>
        <button class="filter-btn" :class="{ active: category === 'help' }" @click="category = 'help'">{{ $t('forum.help') }}</button>
        <button class="filter-btn" :class="{ active: category === 'experience' }" @click="category = 'experience'">{{ $t('forum.experience') }}</button>
        <button class="filter-btn" :class="{ active: category === 'exchange' }" @click="category = 'exchange'">{{ $t('forum.exchange') }}</button>
      </div>
      <router-link to="/forum/new" class="btn btn-primary">✏ {{ $t('forum.newPost') }}</router-link>
    </div>

    <div class="post-list" v-if="filtered.length">
      <PostCard v-for="p in filtered" :key="p.id" :post="p" />
    </div>
    <div v-else class="empty-state">
      <span>💬</span>
      <p>{{ $t('forum.empty') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import PostCard from '../components/PostCard.vue'

const posts = ref([])
const category = ref('')

const filtered = computed(() => {
  if (!category.value) return posts.value
  return posts.value.filter(p => p.category === category.value)
})

onMounted(async () => {
  const res = await fetch('/api/posts')
  posts.value = await res.json()
})
</script>
