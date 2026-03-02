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
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
const menuOpen = ref(false)
</script>
