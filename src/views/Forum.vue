<template>
  <div class="container">
    <div class="page-header">
      <h1>讨论区</h1>
      <p>展示作品、交流经验、互帮互助</p>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;flex-wrap:wrap;gap:12px">
      <div class="filter-bar" style="margin-bottom:0">
        <button class="filter-btn" :class="{ active: category === '' }" @click="category = ''">全部</button>
        <button class="filter-btn" :class="{ active: category === 'showcase' }" @click="category = 'showcase'">作品展示</button>
        <button class="filter-btn" :class="{ active: category === 'help' }" @click="category = 'help'">问题求助</button>
        <button class="filter-btn" :class="{ active: category === 'experience' }" @click="category = 'experience'">经验分享</button>
        <button class="filter-btn" :class="{ active: category === 'exchange' }" @click="category = 'exchange'">闲置交换</button>
      </div>
      <router-link to="/forum/new" class="btn btn-primary">✏ 发帖</router-link>
    </div>

    <div class="post-list" v-if="filtered.length">
      <PostCard v-for="p in filtered" :key="p.id" :post="p" />
    </div>
    <div v-else class="empty-state">
      <span>💬</span>
      <p>暂无帖子，来发第一帖吧！</p>
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
