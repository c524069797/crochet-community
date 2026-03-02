<template>
  <div class="container">
    <div class="post-detail" v-if="post">
      <div class="post-detail-header">
        <router-link to="/forum" style="color:var(--text-muted);font-size:0.9rem">&larr; 返回讨论区</router-link>
        <div style="display:flex;gap:8px;margin:16px 0 12px">
          <span class="tag" :class="tagClassMap[post.category] || 'tag-pink'">{{ categoryMap[post.category] || '讨论' }}</span>
        </div>
        <h1>{{ post.title }}</h1>
        <div class="post-meta" style="margin-top:8px">
          <span>{{ post.author_name }}</span>
          <span>{{ formatDate(post.created_at) }}</span>
        </div>
      </div>

      <div class="post-detail-body">
        <p style="white-space:pre-wrap">{{ post.content }}</p>
      </div>

      <div style="display:flex;gap:12px;margin-bottom:40px">
        <button class="like-btn" :class="{ liked }" @click="likePost">
          ❤ {{ post.likes || 0 }}
        </button>
      </div>

      <!-- Comments -->
      <div class="comments-section">
        <h3>评论 ({{ comments.length }})</h3>
        <div v-for="c in comments" :key="c.id" class="comment-item">
          <div class="comment-meta">
            <span style="font-weight:600;color:var(--text)">{{ c.author_name }}</span>
            <span>{{ formatDate(c.created_at) }}</span>
          </div>
          <p>{{ c.content }}</p>
        </div>
        <div v-if="!comments.length" style="color:var(--text-muted);padding:20px;text-align:center">暂无评论</div>

        <!-- Comment Form -->
        <div class="comment-form">
          <h3 style="margin-bottom:16px">发表评论</h3>
          <form @submit.prevent="submitComment">
            <div class="form-group">
              <input v-model="commentForm.author_name" class="form-control" placeholder="你的昵称" required />
            </div>
            <div class="form-group">
              <textarea v-model="commentForm.content" class="form-control" rows="4" placeholder="写下你的评论..." required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">提交评论</button>
          </form>
        </div>
      </div>
    </div>
    <div v-else class="loading" style="padding:80px">加载中...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const post = ref(null)
const comments = ref([])
const liked = ref(false)
const commentForm = ref({ author_name: '', content: '' })

const categoryMap = { showcase: '作品展示', help: '问题求助', experience: '经验分享', exchange: '闲置交换' }
const tagClassMap = { showcase: 'tag-pink', help: 'tag-blue', experience: 'tag-purple', exchange: 'tag-pink' }

function formatDate(d) {
  if (!d) return ''
  const date = new Date(d)
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
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
