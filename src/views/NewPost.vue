<template>
  <div class="container">
    <div class="form-card" v-if="!submitted">
      <h2 style="margin-bottom:24px">发布新帖</h2>
      <form @submit.prevent="submit">
        <div class="form-group">
          <label>昵称</label>
          <input v-model="form.author_name" class="form-control" placeholder="输入你的昵称" required />
        </div>
        <div class="form-group">
          <label>分类</label>
          <select v-model="form.category" class="form-control" required>
            <option value="">请选择分类</option>
            <option value="showcase">作品展示</option>
            <option value="help">问题求助</option>
            <option value="experience">经验分享</option>
            <option value="exchange">闲置交换</option>
          </select>
        </div>
        <div class="form-group">
          <label>标题</label>
          <input v-model="form.title" class="form-control" placeholder="帖子标题" required />
        </div>
        <div class="form-group">
          <label>内容</label>
          <textarea v-model="form.content" class="form-control" rows="8" placeholder="分享你的想法..." required></textarea>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%">发布</button>
      </form>
    </div>
    <div v-else class="empty-state" style="padding:80px 20px">
      <span>🎉</span>
      <p>帖子发布成功！</p>
      <router-link to="/forum" class="btn btn-primary" style="margin-top:16px">返回讨论区</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const submitted = ref(false)
const form = ref({ author_name: '', category: '', title: '', content: '' })

async function submit() {
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  })
  if (res.ok) {
    submitted.value = true
  }
}
</script>
