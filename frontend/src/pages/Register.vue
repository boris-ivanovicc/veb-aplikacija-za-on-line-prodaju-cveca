<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import MainLayout from '../components/MainLayout.vue'
import { MainService } from '@/services/main.service'
import { Alerts } from '../alerts'

const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const displayName = ref('')

async function doRegister() {
  try {
    await MainService.register(
      username.value,
      email.value,
      password.value,
      displayName.value
    )

    Alerts.showSuccess('Nalog je uspešno kreiran.')
    router.push('/login')

  } catch {
    Alerts.showError('Registracija nije uspela. Proveri podatke.')
  }
}
</script>

<template>
  <MainLayout>
    <div class="card auth-card">

      <div class="card-header">
        <h3>Registracija</h3>
      </div>

      <div class="card-body">

        <div class="mb-3">
          <label>Korisničko ime</label>
          <input class="form-control" v-model="username">
        </div>

        <div class="mb-3">
          <label>Email</label>
          <input class="form-control" v-model="email">
        </div>

        <div class="mb-3">
          <label>Ime i prezime</label>
          <input class="form-control" v-model="displayName">
        </div>

        <div class="mb-3">
          <label>Lozinka</label>
          <input type="password" class="form-control" v-model="password">
        </div>

      </div>

      <div class="card-footer">

        <button class="btn btn-success" @click="doRegister">
          Kreiraj nalog
        </button>

        <RouterLink to="/login" class="btn btn-outline-secondary ms-2">
          Već imate nalog?
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