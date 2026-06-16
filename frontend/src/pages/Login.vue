<script setup lang="ts">
import MainLayout from '@/components/MainLayout.vue'
</script>

<template>
    <MainLayout>
        div class="card auth-card">
            <div class="card-header">
                <h3>Prijavi se</h3>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="username" class="form-label">Korisničko ime</label>
                    <input type="text" class="form-control" id="username" v-model="username">
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Lozinka</label>
                    <input type="password" class="form-control" id="password" v-model="password">
                </div>
            </div>
            <div class="card-footer">
                <button type="button" class="btn btn-primary" @click="doLogin">
                    <i class="fa-solid fa-arrow-right-to-bracket"></i> Prijava
                </button>
            </div>
        </div>
    </MainLayout>
</template>

<style>
.auth-card {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}
</style>