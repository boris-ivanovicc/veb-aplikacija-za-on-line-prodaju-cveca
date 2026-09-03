import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', component: Home, meta: { title: 'Home' } },
    { path: '/login', name: 'Login', component: () => import('@/pages/Login.vue'), meta: { title: 'Login' } },
    { path: '/register', name: 'Register', component: () => import('@/pages/Register.vue'), meta: { title: 'Register' } },
    { path: '/shop', name: 'Shop', component: () => import('@/pages/Shop.vue'), meta: { title: 'Shop' } },

    { path: '/ad/:id', name: 'AdDetails', component: () => import('@/pages/Ad.vue'), meta: { title: 'Ad' } },
    {
      path: '/user',
      name: 'User',
      component: () => import('@/pages/User.vue'),
      meta: { title: 'User', requiresAuth: true }
    },
    { path: '/about', name: 'About', component: () => import('@/pages/About.vue'), meta: { title: 'About' } },
    { path: '/cart', name: 'Cart', component: () => import('@/pages/Cart.vue'), meta: { title: 'Cart' } },
    {
      path: '/create-ad',
      name: 'CreateAd',
      component: () => import('@/pages/CreateAd.vue'),
      meta: { title: 'Create Ad', requiresAuth: true }
    }
  ],
})

export default router