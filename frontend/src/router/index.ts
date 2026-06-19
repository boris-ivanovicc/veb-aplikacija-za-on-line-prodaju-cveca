import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: Home, meta: { title: 'Početna' } },
    { path: '/login', name: 'Login', component: () => import('@/pages/Login.vue'), meta: { title: 'Login' } },
    { path: '/register', name: 'Register', component: () => import('@/pages/Register.vue'), meta: { title: 'Register' } },
    { path: '/shop', name: 'Shop', component: () => import('@/pages/Shop.vue'), meta: { title: 'Shop' } },
    { path: '/ad/:id', name: 'AdDetails', component: () => import('@/pages/Ad.vue'), meta: { title: 'Ad' } },
    { path: '/user', name: 'User', component: () => import('@/pages/User.vue'), meta: { title: 'User' } },
    { path: '/about', name: 'About', component: () => import('@/pages/About.vue'), meta: { title: 'About' } },
    { path: '/cart', name: 'Cart', component: () => import('@/pages/Cart.vue'), meta: { title: 'Cart' } },
  ],
})

export default router