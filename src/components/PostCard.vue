<template>
  <router-link :to="`/forum/${post.id}`" class="post-item" style="text-decoration:none;color:inherit">
    <div class="post-content">
      <div style="display:flex;gap:8px;margin-bottom:8px">
        <span class="tag" :class="tagClassMap[post.category] || 'tag-pink'">{{ categoryMap[post.category] || '讨论' }}</span>
      </div>
      <h3 class="post-title">{{ post.title }}</h3>

      <!-- 图片缩略图 -->
      <div v-if="postImages.length > 0" class="post-thumbnails">
        <div
          v-for="(img, index) in postImages.slice(0, 3)"
          :key="index"
          class="post-thumbnail"
        >
          <img :src="img" :alt="`图片 ${index + 1}`" />
        </div>
        <div v-if="postImages.length > 3" class="more-images">
          +{{ postImages.length - 3 }}
        </div>
      </div>

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
import { computed } from 'vue'

const props = defineProps({ post: Object })

const categoryMap = { showcase: '作品展示', help: '问题求助', experience: '经验分享', exchange: '闲置交换' }
const tagClassMap = { showcase: 'tag-pink', help: 'tag-blue', experience: 'tag-purple', exchange: 'tag-pink' }

const postImages = computed(() => {
  if (!props.post?.images) return []
  try {
    return JSON.parse(props.post.images)
  } catch {
    return []
  }
})

function formatDate(d) {
  if (!d) return ''
  const date = new Date(d)
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}
</script>

<style scoped>
.post-thumbnails {
  display: flex;
  gap: 6px;
  margin: 10px 0;
  position: relative;
}

.post-thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  background: var(--border);
  flex-shrink: 0;
}

.post-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.more-images {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .post-thumbnail,
  .more-images {
    width: 60px;
    height: 60px;
  }
}
</style>
