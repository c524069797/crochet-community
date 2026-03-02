<template>
  <router-link :to="`/forum/${post.id}`" class="post-item" style="text-decoration:none;color:inherit">
    <div class="post-content">
      <div style="display:flex;gap:8px;margin-bottom:8px">
        <span class="tag" :class="tagClassMap[post.category] || 'tag-pink'">{{ categoryMap[post.category] || '讨论' }}</span>
      </div>
      <h3 class="post-title">{{ post.title }}</h3>
      <div class="post-meta">
        <span>{{ post.author_name }}</span>
        <span>{{ formatDate(post.created_at) }}</span>
      </div>
    </div>
    <div class="post-stats">
      <span>❤ {{ post.likes || 0 }}</span>
      <span>💬 {{ post.comment_count || 0 }}</span>
    </div>
  </router-link>
</template>

<script setup>
defineProps({ post: Object })

const categoryMap = { showcase: '作品展示', help: '问题求助', experience: '经验分享', exchange: '闲置交换' }
const tagClassMap = { showcase: 'tag-pink', help: 'tag-blue', experience: 'tag-purple', exchange: 'tag-pink' }

function formatDate(d) {
  if (!d) return ''
  const date = new Date(d)
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}
</script>
