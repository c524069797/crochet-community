<template>
  <nav class="navbar">
    <div class="container">
      <router-link to="/" class="navbar-brand">
        <span>🧶</span> 织趣社区
      </router-link>
      <button class="mobile-toggle" @click="menuOpen = !menuOpen">☰</button>
      <ul class="navbar-nav" :class="{ open: menuOpen }">
        <li><router-link to="/" @click="menuOpen = false">首页</router-link></li>
        <li><router-link to="/products" @click="menuOpen = false">产品库</router-link></li>
        <li><router-link to="/resources" @click="menuOpen = false">资源库</router-link></li>
        <li><router-link to="/forum" @click="menuOpen = false">讨论区</router-link></li>
        <li>
          <button class="theme-toggle" @click="toggleTheme" :title="isDark ? '切换到亮色模式' : '切换到护眼模式'">
            {{ isDark ? '☀️' : '🌙' }}
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const menuOpen = ref(false)
const isDark = ref(false)

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  isDark.value = savedTheme === 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)
})

// 切换主题
function toggleTheme() {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}
</script>

<style scoped>
.theme-toggle {
  background: var(--bg-soft);
  border: 1px solid var(--border);
  font-size: 1.1rem;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 24px;
  transition: var(--transition);
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text);
}

.theme-toggle:hover {
  background: var(--primary-light);
  border-color: var(--primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 768px) {
  .navbar-nav.open .theme-toggle {
    width: 100%;
    justify-content: center;
    padding: 12px;
  }
}
</style>
