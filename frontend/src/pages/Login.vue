<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
    Alerts.showError('Please fill all of the fields.')
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

    Alerts.showSuccess('Successfully logged in.')
    router.push('/')

  } catch (error: any) {
    console.error('Login error:', error)
    let message = 'Wrong username or password.'

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
    <div class="login-page">
      <div class="login-overlay"></div>

      <div class="login-card">
        <h2 class="login-title">Welcome Back</h2>
        <p class="login-subtitle">Connect with your community of flower enthusiasts.</p>

        <form class="login-form">
          <div class="form-group">
            <label for="text">Username</label>
            <input type="text" class="form-control" v-model="username" :disabled="isLoading"
              placeholder="Enter your username" @keyup.enter="doLogin">
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" v-model="password" :disabled="isLoading"
              placeholder="Enter your password" @keyup.enter="doLogin">
          </div>

          <button @click="doLogin" :disabled="isLoading" class="btn-submit">
            <span v-if="isLoading">Logging in...</span>
            <span v-else>Login</span>
          </button>
        </form>

        <hr class="panel-divider" />

        <div class="panel-body">
          <h3>New here?</h3>
          <p>Join our community to start sharing your floral arrangements and garden tips with others.</p>
          <button @click="$router.push('/register')" class="btn-register">Create an account</button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.login-page {
  position: relative;
  height: calc(100vh - 53px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/images/login-background.jpg');
  background-size: cover;
  background-position: center;
  font-family: sans-serif;
}

.login-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.login-card {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 2px solid rgba(255, 255, 255, 0.359);
  padding: 3rem;
  border-radius: 14px;
  width: 100%;
  max-width: 400px;
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
}

.login-title {
  font-size: 2.2rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.login-subtitle {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
}

.form-group {
  text-align: left;
  margin-bottom: 1.5rem;
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
  padding: 0.95rem 2rem;
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
  margin: 0 0 2rem 0;
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
  transition: all 0.2s ease;
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(4px);
}

.btn-register:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: #ffffff;
}
</style>