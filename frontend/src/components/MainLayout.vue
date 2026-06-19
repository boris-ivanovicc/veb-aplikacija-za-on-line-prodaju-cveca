<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import type { UserModel } from '@/models/user.model'
import { AuthService } from '@/services/auth.service'
import { MainService } from '@/services/main.service'
import { useLogout } from '@/hooks/logout.hook'
import { Alerts } from '@/alerts'

const currentYear = new Date().getFullYear()

const logout = useLogout()

const self = ref<UserModel | null>(null)
const isLoggedIn = ref(false)

function doLogout() {
  Alerts.showConfirm('Would you like to log out?', () => {
    logout()
    self.value = null
    isLoggedIn.value = false
  })
}

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'About', path: '/about' }
]

onMounted(async () => {
  const auth = AuthService.getAuth()

  if (!auth || !auth.access) {
    isLoggedIn.value = false
    return
  }

  isLoggedIn.value = true

  try {
    const rsp = await MainService.useAxios('/user/self')
    self.value = rsp.data?.data || rsp.data
  } catch (error) {
    console.error('Failed to load profile:', error)
    logout()
    self.value = null
    isLoggedIn.value = false
  }
})
</script>

<template>
  <nav class="navbar">
    <div class="logo">
      <strong>FlowerShop</strong>
    </div>

    <div class="menu">
      <RouterLink v-for="item in navItems" :key="item.name" :to="item.path">
        {{ item.name }}
      </RouterLink>
    </div>

    <div class="actions">
      <a href="#cart">
        <!--Cart SVG-->
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"
          stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
      </a>

      <template v-if="isLoggedIn && self">
        <span style="color: #ffe5e5ea; font-size: 0.9rem;">{{ self.display_name || self.username }}</span>
        <button @click="doLogout" class="auth-btn">Logout</button>
      </template>
      <template v-else>
        <RouterLink to="/login" class="login-link">Login</RouterLink>
      </template>
    </div>
  </nav>

  <main class="page-content">
    <slot />
  </main>

  <footer>
    <p>&copy; {{ currentYear }} FlowerShop. | Belgrade, Serbia</p>
  </footer>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
</style>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  font-family: sans-serif;
  background-color: rgb(221, 107, 120);
  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E"),
    linear-gradient(to right, rgba(0, 0, 0, 0.19) 1%, rgba(0, 0, 0, 0.19) 100%);
}

.logo,
.menu,
.actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.logo {
  color: #ffe5e5ea;
  font-size: 1.27rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

a {
  text-decoration: none;
  color: #ffe5e5ea;
  font-size: 1rem;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

a:hover {
  color: #de9ba0;
}

.login-link {
  font-weight: 600;
}

footer {
  padding: 1.2rem;
  text-align: center;
  background-color: #121d12;
  font-family: sans-serif;
}

footer p {
  margin: 0;
  font-size: 0.85rem;
  color: #b8c5b4;
  letter-spacing: 0.05em;
}

.actions a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.actions svg {
  display: block;
  stroke-width: 2.6;
}
</style>