<template>
  <div class="container" v-if="product">
    <div class="product-detail">
      <div class="product-detail-img">
        <div :style="{ height: '400px', borderRadius: '16px', background: product.image_url ? `url(${product.image_url}) center/cover` : gradient, position: 'relative' }">
          <span v-if="product.rank && product.rank > 0" class="detail-rank" :class="rankClass">
            TOP {{ product.rank }}
          </span>
        </div>
      </div>
      <div class="product-info">
        <span class="tag" :class="product.category === 'yarn' ? 'tag-green' : 'tag-purple'" style="margin-bottom:16px">
          {{ $t(`category.${product.category}`) }}
        </span>
        <h1>{{ product.name }}</h1>

        <p v-if="product.recommend_reason" class="recommend-reason">{{ product.recommend_reason }}</p>

        <div class="rating" style="margin-bottom:12px">
          {{ '★'.repeat(Math.round(product.rating || 0)) }}{{ '☆'.repeat(5 - Math.round(product.rating || 0)) }}
          <span style="color:var(--text-muted);margin-left:8px">{{ product.rating_count || 0 }} {{ $t('products.rated') }}</span>
        </div>
        <p class="price">{{ product.price_range }}</p>
        <p class="description">{{ product.description }}</p>

        <h3 style="margin-bottom:8px">{{ $t('products.buyLinks') }}</h3>
        <p class="buy-notice">{{ $t('products.buyNotice') }}</p>
        <div class="buy-links">
          <a v-for="link in links" :key="link.id" :href="link.url" target="_blank" class="buy-link" @click.prevent="handleBuyClick(link)">
            <div class="buy-link-info">
              <span class="platform-icon">{{ getPlatformIcon(link.platform) }}</span>
              <div class="platform-details">
                <span class="platform-name">{{ link.platform }}</span>
                <span v-if="link.price" class="platform-price">{{ link.price }}</span>
              </div>
            </div>
            <span class="btn btn-sm btn-primary">{{ $t('products.goBuy') }}</span>
          </a>
          <div v-if="!links.length" style="color:var(--text-muted);padding:12px">{{ $t('products.noBuyLinks') }}</div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading" style="padding:80px">{{ $t('home.loading') }}</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { smartJump, isMobile, getPlatformIcon, getPlatformColor } from '../utils/appJump'

const { t } = useI18n()
const route = useRoute()
const product = ref(null)
const links = ref([])

const colors = ['#4A7C59','#8B6F47','#D4A574','#7C9885','#B5C4A3']
const gradient = `linear-gradient(135deg, ${colors[0]}, ${colors[2]})`

const rankClass = computed(() => {
  const r = product.value?.rank
  if (r === 1) return 'rank-gold'
  if (r === 2) return 'rank-silver'
  if (r === 3) return 'rank-bronze'
  return 'rank-normal'
})

function handleBuyClick(link) {
  const mobile = isMobile()

  const message = mobile
    ? t('products.jumpConfirmMobile', { platform: link.platform, price: link.price || '-' })
    : t('products.jumpConfirm', { platform: link.platform, price: link.price || '-' })

  const confirmed = confirm(message)

  if (confirmed) {
    if (mobile) {
      smartJump({
        platform: link.platform,
        url: link.url,
        onSuccess: () => {},
        onFail: () => {}
      })
    } else {
      window.open(link.url, '_blank')
    }
  }
}

onMounted(async () => {
  const [pRes, lRes] = await Promise.all([
    fetch(`/api/products/${route.params.id}`),
    fetch(`/api/products/${route.params.id}/links`)
  ])
  product.value = await pRes.json()
  links.value = await lRes.json()
})
</script>

<style scoped>
.detail-rank {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 6px 16px;
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
  border-radius: 8px;
}
.rank-gold { background: linear-gradient(135deg, #f7971e, #ffd200); }
.rank-silver { background: linear-gradient(135deg, #8e9eab, #c3cfe2); }
.rank-bronze { background: linear-gradient(135deg, #c9702e, #e8a87c); }
.rank-normal { background: rgba(0,0,0,0.45); }
.recommend-reason {
  font-size: 0.85rem;
  color: var(--primary);
  background: var(--primary-light);
  padding: 8px 12px;
  border-radius: 6px;
  margin: 8px 0 12px;
  line-height: 1.5;
  border-left: 3px solid var(--primary);
}
.buy-notice {
  font-size: 0.78rem;
  color: #999;
  margin-bottom: 12px;
}
.buy-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-bottom: 10px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  cursor: pointer;
}
.buy-link:hover {
  background: var(--primary-light);
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(232, 160, 191, 0.15);
}
.buy-link-info {
  display: flex;
  align-items: center;
  gap: 12px;
}
.platform-icon {
  font-size: 1.5rem;
  line-height: 1;
}
.platform-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.platform-name {
  font-weight: 600;
  font-size: 0.95rem;
}
.platform-price {
  font-weight: 700;
  color: #e53e3e;
  font-size: 1.05rem;
}

@media (max-width: 480px) {
  .buy-link {
    padding: 12px 14px;
  }
  .platform-icon {
    font-size: 1.3rem;
  }
  .platform-name {
    font-size: 0.9rem;
  }
  .platform-price {
    font-size: 0.95rem;
  }
}
</style>
