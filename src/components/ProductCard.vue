<template>
  <router-link :to="`/products/${product.id}`" class="card" style="text-decoration:none;color:inherit">
    <div class="card-img" :style="{ background: product.image_url ? `url(${product.image_url}) center/cover` : gradient }"></div>
    <div class="card-body">
      <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
        <span class="tag" :class="product.category === 'yarn' ? 'tag-pink' : 'tag-purple'">
          {{ product.category === 'yarn' ? '毛线' : '钩针' }}
        </span>
        <span class="rating">{{ '★'.repeat(Math.round(product.rating || 0)) }}{{ '☆'.repeat(5 - Math.round(product.rating || 0)) }}</span>
      </div>
      <h3 class="card-title">{{ product.name }}</h3>
      <p class="card-text">{{ product.description?.slice(0, 60) }}...</p>
      <p style="margin-top:10px;font-weight:600;color:var(--primary-dark)">{{ product.price_range }}</p>
    </div>
  </router-link>
</template>

<script setup>
const props = defineProps({ product: Object })
const colors = ['#E8A0BF','#BA90C6','#C0DBEA','#F5D5C8','#B5E8CC']
const gradient = `linear-gradient(135deg, ${colors[props.product.id % 5]}, ${colors[(props.product.id + 2) % 5]})`
</script>
