<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import MainLayout from '../components/MainLayout.vue'
import { AuthService } from '@/services/auth.service';
import { MainService } from '@/services/main.service';
import { Alerts } from '../alerts'

const router = useRouter()

const username = ref('')
const password = ref('')
const isLoading = ref(false)

async function doLogin() {
  if (!username.value || !password.value) {
    Alerts.showError('Molimo popunite sva polja.')
    return
  }

  isLoading.value = true

  try {
    const rsp = await MainService.login(
      username.value,
      password.value
    )

    AuthService.saveAuth({
      access: rsp.data.data.access,
      refresh: rsp.data.data.refresh
    })

    Alerts.showSuccess('Uspešno ste prijavljeni.')
    router.push('/')

  } catch (error: any) {
    console.error('Login error:', error)
    let message = 'Pogrešno korisničko ime ili lozinka.'
    
    if (error.response?.data?.message) {
      message = error.response.data.message
    }
    
    Alerts.showError(message)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <MainLayout>
    <div class="card auth-card">
      <div class="card-header">
        <h3>Prijava</h3>
      </div>

      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">Korisničko ime</label>
          <input 
            type="text" 
            class="form-control" 
            v-model="username"
            :disabled="isLoading"
            placeholder="Unesite korisničko ime"
            @keyup.enter="doLogin"
          >
        </div>

        <div class="mb-3">
          <label class="form-label">Lozinka</label>
          <input 
            type="password" 
            class="form-control" 
            v-model="password"
            :disabled="isLoading"
            placeholder="Unesite lozinku"
            @keyup.enter="doLogin"
          >
        </div>
      </div>

      <div class="card-footer d-flex justify-content-between align-items-center">
        <button 
          class="btn btn-primary" 
          @click="doLogin"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Prijava...</span>
          <span v-else>Prijava</span>
        </button>

        <RouterLink
          to="/register"
          class="btn btn-outline-secondary"
        >
          Nemate nalog? Registrujte se
        </RouterLink>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.auth-card {
  max-width: 600px;
  margin: 30px auto;
}
</style>