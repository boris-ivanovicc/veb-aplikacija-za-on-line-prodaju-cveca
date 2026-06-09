import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '@/pages/Login.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
      meta: {
        title: 'Početna'
      }
    },
    {
      path: '/login',
      component: Login,
      meta: {
        title: 'Login'
      }
    }
  ],
})

export default router

