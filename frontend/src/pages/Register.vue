<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

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
    <div class="register-page">
      <div class="register-overlay"></div>

      <div class="register-card">
        <h2 class="register-title">Join our Community</h2>
        <p class="register-subtitle">Start sharing your floral creations with local enthusiasts.</p>

        <form class="register-form">
          <div class="form-grid">
            <div class="form-group">
              <label for="name">Username</label>
              <input class="form-control" v-model="username">
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input class="form-control" v-model="email">
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" class="form-control" v-model="password">
            </div>
          </div>

          <button @click="doRegister" class="btn-submit">Register Account</button>
        </form>

        <hr class="panel-divider" />

        <div class="panel-body">
          <h3>Already a member?</h3>
          <p>Sign in to your account to continue connecting with our floral network.</p>
          <button @click="$router.push('/login')" class="btn-register">Sign In</button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.register-page {
  flex-grow: 1;
  width: 100%;
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-image: url('/images/register-background.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}

.register-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.register-card {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 2px solid rgba(255, 255, 255, 0.359);
  padding: 3rem;
  border-radius: 14px;
  width: 100%;
  max-width: 650px;
  color: white;
  text-align: center;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.register-title {
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.register-subtitle {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
}

.form-group {
  text-align: left;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  color: white;
  box-sizing: border-box;
}

.btn-submit {
  width: 100%;
  padding: 0.95rem;
  background-color: #059669;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-submit:hover {
  background-color: #047857;
}

.panel-divider {
  border: none;
  height: 1px;
  background: rgba(255, 255, 255, 0.25);
  margin: 1.75rem 0;
}

.panel-body {
  text-align: left;
}

.panel-body h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.4rem;
  font-weight: 700;
}

.panel-body p {
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
}

.btn-register {
  width: 100%;
  padding: 0.95rem 2rem;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(4px);
}
</style>