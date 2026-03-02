<template>
  <div class="container" v-if="product">
    <div class="product-detail">
      <div class="product-detail-img">
        <div :style="{ height: '400px', borderRadius: '12px', background: product.image_url ? `url(${product.image_url}) center/cover` : gradient }"></div>
      </div>
      <div class="product-info">
        <span class="tag" :class="product.category === 'yarn' ? 'tag-pink' : 'tag-purple'" style="margin-bottom:16px">
          {{ product.category === 'yarn' ? '毛线' : '钩针' }}
        </span>
        <h1>{{ product.name }}</h1>
        <div class="rating" style="margin-bottom:12px">
          {{ '★'.repeat(Math.round(product.rating || 0)) }}{{ '☆'.repeat(5 - Math.round(product.rating || 0)) }}
          <span style="color:var(--text-muted);margin-left:8px">{{ product.rating_count || 0 }} 人评分</span>
        </div>
        <p class="price">{{ product.price_range }}</p>
        <p class="description">{{ product.description }}</p>

        <h3 style="margin-bottom:12px">购买链接</h3>
        <div class="buy-links">
          <a v-for="link in links" :key="link.id" :href="link.url" target="_blank" class="buy-link">
            <span style="font-weight:600">{{ link.platform }}</span>
            <span class="btn btn-sm btn-primary">去购买</span>
          </a>
          <div v-if="!links.length" style="color:var(--text-muted);padding:12px">暂无购买链接</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading" style="padding:80px">加载中...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const product = ref(null)
const links = ref([])

const colors = ['#E8A0BF','#BA90C6','#C0DBEA','#F5D5C8','#B5E8CC']
const gradient = `linear-gradient(135deg, ${colors[0]}, ${colors[2]})`

onMounted(async () => {
  const [pRes, lRes] = await Promise.all([
    fetch(`/api/products/${route.params.id}`),
    fetch(`/api/products/${route.params.id}/links`)
  ])
  product.value = await pRes.json()
  links.value = await lRes.json()
})
</script>
