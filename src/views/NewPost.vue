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

        <!-- 图片上传 -->
        <div class="form-group">
          <label>图片（最多9张）</label>
          <div class="image-upload-area">
            <div class="image-preview-grid">
              <div v-for="(preview, index) in imagePreviews" :key="index" class="image-preview-item">
                <img :src="preview" alt="预览图" />
                <button type="button" class="remove-image-btn" @click="removeImage(index)">×</button>
              </div>
              <label v-if="imagePreviews.length < 9" class="image-upload-btn">
                <input
                  type="file"
                  ref="fileInput"
                  @change="handleFileSelect"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  multiple
                  style="display: none"
                />
                <div class="upload-icon">📷</div>
                <div class="upload-text">添加图片</div>
              </label>
            </div>
            <p class="upload-hint">支持 JPG、PNG、GIF、WebP 格式，单张最大 5MB</p>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="uploading" style="width:100%">
          {{ uploading ? '发布中...' : '发布' }}
        </button>
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
const uploading = ref(false)
const form = ref({ author_name: '', category: '', title: '', content: '' })
const selectedFiles = ref([])
const imagePreviews = ref([])

function handleFileSelect(event) {
  const files = Array.from(event.target.files)
  const remainingSlots = 9 - selectedFiles.value.length

  if (files.length > remainingSlots) {
    alert(`最多只能上传9张图片，当前还可以添加${remainingSlots}张`)
    return
  }

  files.forEach(file => {
    // 检查文件大小
    if (file.size > 5 * 1024 * 1024) {
      alert(`图片 ${file.name} 超过 5MB，已跳过`)
      return
    }

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert(`图片 ${file.name} 格式不支持，已跳过`)
      return
    }

    selectedFiles.value.push(file)

    // 生成预览
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreviews.value.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })

  // 清空 input
  event.target.value = ''
}

function removeImage(index) {
  selectedFiles.value.splice(index, 1)
  imagePreviews.value.splice(index, 1)
}

async function submit() {
  uploading.value = true

  try {
    const formData = new FormData()
    formData.append('author_name', form.value.author_name)
    formData.append('category', form.value.category)
    formData.append('title', form.value.title)
    formData.append('content', form.value.content)

    // 添加图片文件
    selectedFiles.value.forEach(file => {
      formData.append('images', file)
    })

    const res = await fetch('/api/posts', {
      method: 'POST',
      body: formData
    })

    if (res.ok) {
      submitted.value = true
    } else {
      const error = await res.json()
      alert(error.error || '发布失败，请重试')
    }
  } catch (err) {
    alert('发布失败：' + err.message)
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.image-upload-area {
  margin-top: 8px;
}

.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  margin-bottom: 8px;
}

.image-preview-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: var(--border);
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.remove-image-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.image-upload-btn {
  aspect-ratio: 1;
  border: 2px dashed var(--border);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--bg);
}

.image-upload-btn:hover {
  border-color: var(--primary);
  background: rgba(232, 160, 191, 0.05);
}

.upload-icon {
  font-size: 2rem;
  margin-bottom: 4px;
}

.upload-text {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.upload-hint {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

@media (max-width: 480px) {
  .image-preview-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .upload-icon {
    font-size: 1.5rem;
  }

  .upload-text {
    font-size: 0.75rem;
  }
}
</style>
