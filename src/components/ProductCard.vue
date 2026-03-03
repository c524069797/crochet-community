<template>
  <router-link :to="`/products/${product.id}`" class="card product-card" style="text-decoration:none;color:inherit">
    <div class="card-img" :style="{ background: product.image_url ? `url(${product.image_url}) center/cover` : gradient }">
      <span v-if="product.rank && product.rank > 0" class="rank-badge" :class="rankClass">
        TOP {{ product.rank }}
      </span>
    </div>
    <div class="card-body">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
        <span class="tag" :class="product.category === 'yarn' ? 'tag-pink' : 'tag-purple'">
          {{ product.category === 'yarn' ? '毛线' : '钩针' }}
        </span>
        <span class="rating">{{ '★'.repeat(Math.round(product.rating || 0)) }}{{ '☆'.repeat(5 - Math.round(product.rating || 0)) }}</span>
      </div>
      <h3 class="card-title">{{ product.name }}</h3>
      <p v-if="product.recommend_reason" class="recommend-tag">{{ product.recommend_reason }}</p>
      <p class="card-text">{{ product.description?.slice(0, 60) }}...</p>
      <div class="card-footer">
        <span class="price">{{ product.price_range }}</span>
        <span v-if="product.rating_count" class="review-count">{{ product.rating_count }}人评价</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ product: Object })
const colors = ['#E8A0BF','#BA90C6','#C0DBEA','#F5D5C8','#B5E8CC']
const gradient = `linear-gradient(135deg, ${colors[props.product.id % 5]}, ${colors[(props.product.id + 2) % 5]})`
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
  transition: transform 0.2s;
}
.product-card:hover {
  transform: translateY(-4px);
}
.card-img {
  position: relative;
}
.rank-badge {
  position: absolute;
  top: 0;
  left: 0;
  padding: 4px 12px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  border-radius: 12px 0 8px 0;
}
.rank-gold { background: linear-gradient(135deg, #f7971e, #ffd200); }
.rank-silver { background: linear-gradient(135deg, #8e9eab, #c3cfe2); }
.rank-bronze { background: linear-gradient(135deg, #c9702e, #e8a87c); }
.rank-normal { background: rgba(0,0,0,0.5); }
.recommend-tag {
  font-size: 0.75rem;
  color: #e8a0bf;
  background: #fdf2f8;
  padding: 4px 8px;
  border-radius: 4px;
  margin: 4px 0 8px;
  line-height: 1.4;
}
.card-footer {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price {
  font-weight: 600;
  color: var(--primary-dark);
}
.review-count {
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
