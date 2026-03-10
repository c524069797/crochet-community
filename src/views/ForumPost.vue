<template>
  <div class="container">
    <div class="post-detail" v-if="post">
      <div class="post-detail-header">
        <router-link to="/forum" style="color:var(--text-muted);font-size:0.9rem">&larr; {{ $t('forum.backToForum') }}</router-link>
        <div style="display:flex;gap:8px;margin:16px 0 12px">
          <span class="tag" :class="tagClassMap[post.category] || 'tag-green'">{{ $t(`forum.${post.category}`, $t('forum.discuss')) }}</span>
        </div>
        <h1>{{ post.title }}</h1>
        <div class="post-meta" style="margin-top:8px">
          <span>{{ post.author_name }}</span>
          <span>{{ formatDate(post.created_at) }}</span>
        </div>
      </div>

      <div class="post-detail-body">
        <p style="white-space:pre-wrap">{{ post.content }}</p>

        <!-- 图片展示 -->
        <div v-if="postImages.length > 0" class="post-images">
          <div class="post-images-grid" :class="{ 'single-image': postImages.length === 1 }">
            <div
              v-for="(img, index) in postImages"
              :key="index"
              class="post-image-item"
              @click="viewImage(index)"
            >
              <img :src="img" :alt="`图片 ${index + 1}`" />
            </div>
          </div>
        </div>
      </div>

      <!-- 图片查看器 -->
      <div v-if="viewingImage !== null" class="image-viewer" @click="closeImageViewer">
        <button class="close-viewer-btn" @click.stop="closeImageViewer">×</button>
        <button
          v-if="postImages.length > 1 && viewingImage > 0"
          class="nav-btn prev-btn"
          @click.stop="viewImage(viewingImage - 1)"
        >
          ‹
        </button>
        <img :src="postImages[viewingImage]" @click.stop />
        <button
          v-if="postImages.length > 1 && viewingImage < postImages.length - 1"
          class="nav-btn next-btn"
          @click.stop="viewImage(viewingImage + 1)"
        >
          ›
        </button>
        <div class="image-counter">{{ viewingImage + 1 }} / {{ postImages.length }}</div>
      </div>

      <div style="display:flex;gap:12px;margin-bottom:40px">
        <button class="like-btn" :class="{ liked }" @click="likePost">
          ❤ {{ post.likes || 0 }}
        </button>
      </div>

      <!-- Comments -->
      <div class="comments-section">
        <h3>{{ $t('forum.comments') }} ({{ comments.length }})</h3>
        <div v-for="c in comments" :key="c.id" class="comment-item">
          <div class="comment-meta">
            <span style="font-weight:600;color:var(--text)">{{ c.author_name }}</span>
            <span>{{ formatDate(c.created_at) }}</span>
          </div>
          <p>{{ c.content }}</p>
        </div>
        <div v-if="!comments.length" style="color:var(--text-muted);padding:20px;text-align:center">{{ $t('forum.noComments') }}</div>

        <!-- Comment Form -->
        <div class="comment-form">
          <h3 style="margin-bottom:16px">{{ $t('forum.postComment') }}</h3>
          <form @submit.prevent="submitComment">
            <div class="form-group">
              <input v-model="commentForm.author_name" class="form-control" :placeholder="$t('forum.nicknamePlaceholder')" required />
            </div>
            <div class="form-group">
              <textarea v-model="commentForm.content" class="form-control" rows="4" :placeholder="$t('forum.commentPlaceholder')" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">{{ $t('forum.submitComment') }}</button>
          </form>
        </div>
      </div>
    </div>
    <div v-else class="loading" style="padding:80px">{{ $t('home.loading') }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const post = ref(null)
const comments = ref([])
const liked = ref(false)
const commentForm = ref({ author_name: '', content: '' })
const viewingImage = ref(null)

const tagClassMap = { showcase: 'tag-green', help: 'tag-blue', experience: 'tag-purple', exchange: 'tag-pink' }

const postImages = computed(() => {
  if (!post.value?.images) return []
  try {
    return JSON.parse(post.value.images)
  } catch {
    return []
  }
})

function formatDate(d) {
  if (!d) return ''
  const date = new Date(d)
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
}

function viewImage(index) {
  viewingImage.value = index
  document.body.style.overflow = 'hidden'
}

function closeImageViewer() {
  viewingImage.value = null
  document.body.style.overflow = ''
}

async function loadComments() {
  const res = await fetch(`/api/posts/${route.params.id}/comments`)
  comments.value = await res.json()
}

async function likePost() {
  if (liked.value) return
  await fetch(`/api/posts/${route.params.id}/like`, { method: 'POST' })
  post.value.likes = (post.value.likes || 0) + 1
  liked.value = true
}

async function submitComment() {
  const res = await fetch(`/api/posts/${route.params.id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentForm.value)
  })
  if (res.ok) {
    commentForm.value = { author_name: '', content: '' }
    await loadComments()
  }
}

onMounted(async () => {
  const res = await fetch(`/api/posts/${route.params.id}`)
  post.value = await res.json()
  await loadComments()
})
</script>

<style scoped>
.post-images {
  margin-top: 20px;
}

.post-images-grid {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(3, 1fr);
}

.post-images-grid.single-image {
  grid-template-columns: 1fr;
  max-width: 500px;
}

.post-image-item {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  background: var(--border);
  transition: transform 0.2s;
}

.post-image-item:hover {
  transform: scale(1.02);
}

.post-image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 图片查看器 */
.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.image-viewer img {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 4px;
}

.close-viewer-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  font-size: 32px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 10000;
}

.close-viewer-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  font-size: 32px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 10000;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.prev-btn {
  left: 20px;
}

.next-btn {
  right: 20px;
}

.image-counter {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .post-images-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .image-viewer {
    padding: 10px;
  }

  .close-viewer-btn,
  .nav-btn {
    width: 40px;
    height: 40px;
    font-size: 24px;
  }

  .close-viewer-btn {
    top: 10px;
    right: 10px;
  }

  .prev-btn {
    left: 10px;
  }

  .next-btn {
    right: 10px;
  }
}

@media (max-width: 480px) {
  .post-images-grid {
    gap: 6px;
  }
}
</style>
