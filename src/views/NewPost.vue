<template>
  <div class="container">
    <div class="form-card" v-if="!submitted">
      <h2 style="margin-bottom:24px">{{ $t('newPost.title') }}</h2>
      <form @submit.prevent="submit">
        <div class="form-group">
          <label>{{ $t('newPost.nickname') }}</label>
          <input v-model="form.author_name" class="form-control" :placeholder="$t('newPost.nicknamePlaceholder')" required />
        </div>
        <div class="form-group">
          <label>{{ $t('newPost.categoryLabel') }}</label>
          <select v-model="form.category" class="form-control" required>
            <option value="">{{ $t('newPost.categoryPlaceholder') }}</option>
            <option value="showcase">{{ $t('forum.showcase') }}</option>
            <option value="help">{{ $t('forum.help') }}</option>
            <option value="experience">{{ $t('forum.experience') }}</option>
            <option value="exchange">{{ $t('forum.exchange') }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>{{ $t('newPost.postTitle') }}</label>
          <input v-model="form.title" class="form-control" :placeholder="$t('newPost.postTitlePlaceholder')" required />
        </div>
        <div class="form-group">
          <label>{{ $t('newPost.content') }}</label>
          <textarea v-model="form.content" class="form-control" rows="8" :placeholder="$t('newPost.contentPlaceholder')" required></textarea>
        </div>

        <!-- 图片上传 -->
        <div class="form-group">
          <label>{{ $t('newPost.images') }}</label>
          <div class="image-upload-area">
            <div class="image-preview-grid">
              <div v-for="(preview, index) in imagePreviews" :key="index" class="image-preview-item">
                <img :src="preview" :alt="$t('newPost.preview')" />
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
                <div class="upload-text">{{ $t('newPost.addImage') }}</div>
              </label>
            </div>
            <p class="upload-hint">{{ $t('newPost.imageHint') }}</p>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="uploading" style="width:100%">
          {{ uploading ? $t('newPost.publishing') : $t('newPost.publish') }}
        </button>
      </form>
    </div>
    <div v-else class="empty-state" style="padding:80px 20px">
      <span>🎉</span>
      <p>{{ $t('newPost.success') }}</p>
      <router-link to="/forum" class="btn btn-primary" style="margin-top:16px">{{ $t('newPost.backToForum') }}</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const submitted = ref(false)
const uploading = ref(false)
const form = ref({ author_name: '', category: '', title: '', content: '' })
const selectedFiles = ref([])
const imagePreviews = ref([])

function handleFileSelect(event) {
  const files = Array.from(event.target.files)
  const remainingSlots = 9 - selectedFiles.value.length

  if (files.length > remainingSlots) {
    alert(t('newPost.maxImages', { remaining: remainingSlots }))
    return
  }

  files.forEach(file => {
    if (file.size > 5 * 1024 * 1024) {
      alert(t('newPost.fileTooLarge', { name: file.name }))
      return
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert(t('newPost.unsupportedFormat', { name: file.name }))
      return
    }

    selectedFiles.value.push(file)

    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreviews.value.push(e.target.result)
    }
    reader.readAsDataURL(file)
  })

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
      alert(error.error || t('newPost.publishFailed'))
    }
  } catch (err) {
    alert(t('newPost.publishError') + err.message)
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
