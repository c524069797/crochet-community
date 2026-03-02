import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/products', name: 'Products', component: () => import('../views/Products.vue') },
  { path: '/products/:id', name: 'ProductDetail', component: () => import('../views/ProductDetail.vue') },
  { path: '/resources', name: 'Resources', component: () => import('../views/Resources.vue') },
  { path: '/forum', name: 'Forum', component: () => import('../views/Forum.vue') },
  { path: '/forum/new', name: 'NewPost', component: () => import('../views/NewPost.vue') },
  { path: '/forum/:id', name: 'ForumPost', component: () => import('../views/ForumPost.vue') },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})
