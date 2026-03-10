<template>
  <router-link :to="`/products/${product.id}`" class="card product-card" style="text-decoration:none;color:inherit">
    <div class="card-header" :class="product.category === 'yarn' ? 'header-yarn' : 'header-hook'">
      <img v-if="product.image_url" :src="proxyImg(product.image_url)" :alt="product.name" class="product-image" />
      <div v-else class="category-icon">
        {{ product.category === 'yarn' ? '🧶' : '🪡' }}
      </div>
      <span v-if="product.rank && product.rank > 0" class="rank-badge" :class="rankClass">
        TOP {{ product.rank }}
      </span>
    </div>
    <div class="card-body">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:10px">
        <span class="tag" :class="product.category === 'yarn' ? 'tag-pink' : 'tag-purple'">
          {{ $t(`category.${product.category}`) }}
        </span>
        <span class="rating">{{ '★'.repeat(Math.round(product.rating || 0)) }}{{ '☆'.repeat(5 - Math.round(product.rating || 0)) }}</span>
      </div>
      <h3 class="card-title">{{ product.name }}</h3>
      <p v-if="product.recommend_reason" class="recommend-tag">{{ product.recommend_reason }}</p>
      <p class="card-text">{{ product.description?.slice(0, 60) }}...</p>
      <div class="card-footer">
        <span class="price">{{ product.price_range }}</span>
        <span v-if="product.rating_count" class="review-count">{{ product.rating_count }}{{ $t('products.reviews') }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ product: Object })

function proxyImg(url) {
  if (!url) return ''
  if (url.startsWith('/')) return url
  return '/api/image-proxy?url=' + encodeURIComponent(url)
}

const rankClass = computed(() => {
  const r = props.product.rank
  if (r === 1) return 'rank-gold'
  if (r === 2) return 'rank-silver'
  if (r === 3) return 'rank-bronze'
  return 'rank-normal'
})
</script>

<style scoped>
.product-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-6px);
}

.card-header {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-yarn {
  background: linear-gradient(135deg, #D4EDE4 0%, #E8F5F0 100%);
}

.header-hook {
  background: linear-gradient(135deg, #E5DFF5 0%, #EDE8F5 100%);
}

.category-icon {
  line-height: 1;
  opacity: 0.8;
  color: var(--primary-dark);
}

.category-icon svg {
  display: block;
}

.rank-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 14px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.rank-gold {
  background: linear-gradient(135deg, #FFD700, #FFA500);
}

.rank-silver {
  background: linear-gradient(135deg, #C0C0C0, #A8A8A8);
}

.rank-bronze {
  background: linear-gradient(135deg, #CD7F32, #B8733E);
}

.rank-normal {
  background: rgba(0,0,0,0.5);
}

.recommend-tag {
  font-size: 0.8rem;
  color: var(--primary-dark);
  background: var(--primary-light);
  padding: 6px 12px;
  border-radius: 12px;
  margin: 8px 0;
  line-height: 1.5;
  font-weight: 500;
}

.card-footer {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid var(--border-soft);
}

.price {
  font-weight: 600;
  color: var(--primary-dark);
  font-size: 1.05rem;
}

.review-count {
  font-size: 0.8rem;
  color: var(--text-muted);
}

@media (max-width: 480px) {
  .card-header {
    height: 100px;
  }

  .category-icon {
    font-size: 3rem;
  }
}
</style>
