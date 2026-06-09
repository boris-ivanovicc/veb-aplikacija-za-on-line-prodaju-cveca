<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

const year = new Date().getFullYear()
</script>

<template>
    <nav style="background: #e0e0e0; padding: 12px;">
        <div>
            <RouterLink to="/" style="margin-right: 12px;">Početna</RouterLink>
            <RouterLink to="/login">Prijava</RouterLink>
        </div>
    </nav>

    <RouterView />

    <footer style="margin-top: 20px; text-align: center;">
        &copy; {{ year }} - Flower Store
    </footer>
</template>