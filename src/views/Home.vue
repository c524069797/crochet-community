<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <h1>织趣社区</h1>
      <p>钩织爱好者的温馨家园 — 发现好物、学习技巧、分享作品</p>
      <div class="hero-actions">
        <router-link to="/products" class="btn btn-secondary">浏览产品库</router-link>
        <router-link to="/resources" class="btn btn-primary">探索资源库</router-link>
      </div>
    </section>

    <!-- Features -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">社区特色</h2>
        <p class="section-desc">为钩织爱好者打造的一站式平台</p>
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">🧶</div>
            <h3>产品库</h3>
            <p>精选毛线、钩针等钩织工具，附多平台购买链接与用户评分</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📖</div>
            <h3>资源库</h3>
            <p>丰富的图解教程与视频资源，从入门到进阶一应俱全</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💬</div>
            <h3>讨论区</h3>
            <p>展示作品、求助交流、分享经验，与同好者一起成长</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Products -->
    <section class="section" style="background:var(--bg-card)">
      <div class="container">
        <h2 class="section-title">热门产品</h2>
        <p class="section-desc">社区推荐的高品质钩织好物</p>
        <div class="grid grid-4" v-if="products.length">
          <ProductCard v-for="p in products.slice(0, 4)" :key="p.id" :product="p" />
        </div>
        <div class="loading" v-else>加载中...</div>
        <div style="text-align:center;margin-top:30px">
          <router-link to="/products" class="btn btn-outline">查看全部产品</router-link>
        </div>
      </div>
    </section>

    <!-- Latest Resources -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">最新资源</h2>
        <p class="section-desc">图解教程与视频教学</p>
        <div class="grid grid-3" v-if="resources.length">
          <ResourceCard v-for="r in resources.slice(0, 3)" :key="r.id" :resource="r" />
        </div>
        <div class="loading" v-else>加载中...</div>
        <div style="text-align:center;margin-top:30px">
          <router-link to="/resources" class="btn btn-outline">查看全部资源</router-link>
        </div>
      </div>
    </section>

    <!-- Latest Posts -->
    <section class="section" style="background:var(--bg-card)">
      <div class="container">
        <h2 class="section-title">社区动态</h2>
        <p class="section-desc">来自钩织爱好者的最新分享</p>
        <div class="post-list" v-if="posts.length">
          <PostCard v-for="p in posts.slice(0, 5)" :key="p.id" :post="p" />
        </div>
        <div class="loading" v-else>加载中...</div>
        <div style="text-align:center;margin-top:30px">
          <router-link to="/forum" class="btn btn-outline">进入讨论区</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductCard from '../components/ProductCard.vue'
import ResourceCard from '../components/ResourceCard.vue'
import PostCard from '../components/PostCard.vue'

const products = ref([])
const resources = ref([])
const posts = ref([])

onMounted(async () => {
  const [pRes, rRes, fRes] = await Promise.all([
    fetch('/api/products?limit=4'),
    fetch('/api/resources?limit=3'),
    fetch('/api/posts?limit=5')
  ])
  products.value = await pRes.json()
  resources.value = await rRes.json()
  posts.value = await fRes.json()
})
</script>
