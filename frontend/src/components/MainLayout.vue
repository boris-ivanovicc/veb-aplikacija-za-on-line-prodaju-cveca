<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

import type { UserModel } from '@/models/user.model'
import { AuthService } from '@/services/auth.service'
import { MainService } from '@/services/main.service'
import { useLogout } from '@/hooks/logout.hook'
import { Alerts } from '@/alerts'

const year = new Date().getFullYear()

const logout = useLogout()

const self = ref<UserModel | null>(null)
const isLoggedIn = ref(false)

function doLogout() {
  Alerts.showConfirm('Da li želite da se odjavite?', () => {
    logout()
    self.value = null
    isLoggedIn.value = false
  })
}

onMounted(async () => {
  const auth = AuthService.getAuth()

  if (!auth || !auth.access) {
    isLoggedIn.value = false
    return
  }

  isLoggedIn.value = true

  try {
    const rsp = await MainService.useAxios('/user/self')
    // Proverite strukturu odgovora
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
  <nav style="background:#e0e0e0;padding:12px;display:flex;justify-content:space-between;">
    <div>
      <RouterLink to="/" style="margin-right:12px;">Početna</RouterLink>

      <template v-if="isLoggedIn">
        <button @click="doLogout" style="border:none;background:none;cursor:pointer;">
          Odjava
        </button>
      </template>

      <template v-else>
        <RouterLink to="/login">Prijava</RouterLink>
      </template>
    </div>

    <div v-if="isLoggedIn && self">
      {{ self.display_name || self.username }}
    </div>
  </nav>

  <slot />

  <footer style="margin-top:20px;text-align:center;">
    &copy; {{ year }} - Flower Store
  </footer>
</template>