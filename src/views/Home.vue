<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-text">
          <h1>{{ $t('home.heroTitle') }}</h1>
          <p>{{ $t('home.heroSubtitle') }}</p>
          <div class="hero-actions">
            <router-link to="/resources" class="btn btn-primary">{{ $t('home.heroAction') }}</router-link>
            <router-link to="/products" class="btn btn-secondary">{{ $t('home.browseProducts') }}</router-link>
          </div>
        </div>
        <div class="hero-visual">
          <span class="hero-emoji">🧶</span>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">{{ $t('home.featuresTitle') }}</h2>
        <p class="section-desc">{{ $t('home.featuresDesc') }}</p>
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">🧶</div>
            <h3>{{ $t('home.featureProducts') }}</h3>
            <p>{{ $t('home.featureProductsDesc') }}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📖</div>
            <h3>{{ $t('home.featureResources') }}</h3>
            <p>{{ $t('home.featureResourcesDesc') }}</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💬</div>
            <h3>{{ $t('home.featureForum') }}</h3>
            <p>{{ $t('home.featureForumDesc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Products -->
    <section class="section" style="background:var(--bg-card)">
      <div class="container">
        <h2 class="section-title">{{ $t('home.hotProducts') }}</h2>
        <p class="section-desc">{{ $t('home.hotProductsDesc') }}</p>
        <div class="grid grid-4" v-if="products.length">
          <ProductCard v-for="p in products.slice(0, 4)" :key="p.id" :product="p" />
        </div>
        <div v-else-if="loadError" class="error-state">{{ $t('home.loadFailed') }}</div>
        <div class="loading" v-else>{{ $t('home.loading') }}</div>
        <div style="text-align:center;margin-top:30px">
          <router-link to="/products" class="btn btn-outline">{{ $t('home.viewAllProducts') }}</router-link>
        </div>
      </div>
    </section>

    <!-- Latest Resources -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">{{ $t('home.latestResources') }}</h2>
        <p class="section-desc">{{ $t('home.latestResourcesDesc') }}</p>
        <div class="grid grid-3" v-if="resources.length">
          <ResourceCard v-for="r in resources.slice(0, 3)" :key="r.id" :resource="r" />
        </div>
        <div v-else-if="loadError" class="error-state">{{ $t('home.loadFailed') }}</div>
        <div class="loading" v-else>{{ $t('home.loading') }}</div>
        <div style="text-align:center;margin-top:30px">
          <router-link to="/resources" class="btn btn-outline">{{ $t('home.viewAllResources') }}</router-link>
        </div>
      </div>
    </section>

    <!-- Latest Posts -->
    <section class="section" style="background:var(--bg-card)">
      <div class="container">
        <h2 class="section-title">{{ $t('home.communityUpdates') }}</h2>
        <p class="section-desc">{{ $t('home.communityUpdatesDesc') }}</p>
        <div class="post-list" v-if="posts.length">
          <PostCard v-for="p in posts.slice(0, 5)" :key="p.id" :post="p" />
        </div>
        <div v-else-if="loadError" class="error-state">{{ $t('home.loadFailed') }}</div>
        <div class="loading" v-else>{{ $t('home.loading') }}</div>
        <div style="text-align:center;margin-top:30px">
          <router-link to="/forum" class="btn btn-outline">{{ $t('home.enterForum') }}</router-link>
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
const loadError = ref(false)

onMounted(async () => {
  try {
    const [pRes, rRes, fRes] = await Promise.all([
      fetch('/api/products?limit=4'),
      fetch('/api/resources?limit=3'),
      fetch('/api/posts?limit=5')
    ])
    if (pRes.ok) products.value = await pRes.json()
    if (rRes.ok) resources.value = await rRes.json()
    if (fRes.ok) posts.value = await fRes.json()
  } catch (err) {
    console.error('Failed to load data:', err)
    loadError.value = true
  }
})
</script>
