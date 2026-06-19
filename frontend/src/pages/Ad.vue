<script setup>
import MainLayout from '@/components/MainLayout.vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const ad = ref({
    id: 1,
    title: 'Red Rose Bouquet',
    price: 45,
    location: 'Belgrade',
    flowerDetails: {
        flowerName: 'Rose',
        sizeCm: 30.5,
        origin: 'Serbia',
        lifespanDays: 7,
        occasion: 'Anniversary',
        isPotted: false
    },
    images: [
        { originalUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=800', isCover: true }
    ],
    user: {
        username: 'FloralArtist_BG',
        avatarUrl: 'https://ui-avatars.com/api/?name=FloralArtist_BG',
        createdAt: '2025-01-15'
    }
})

const adId = route.params.id
</script>

<template>
    <MainLayout>
        <div class="ad-page" v-if="ad">
            <div class="hero">
                <img :src="ad.images[0].originalUrl" :alt="ad.title" class="cover-image" />
                <div class="hero-content">
                    <h1>{{ ad.title }}</h1>
                    <p class="price">${{ ad.price }}</p>
                </div>
            </div>

            <div class="ad-content">
                <section class="details-section">
                    <h3>Flower Details</h3>
                    <div class="details-grid">
                        <div class="card"><strong>Origin:</strong> {{ ad.flowerDetails.origin }}</div>
                        <div class="card"><strong>Size:</strong> {{ ad.flowerDetails.sizeCm }} cm</div>
                        <div class="card"><strong>Lifespan:</strong> {{ ad.flowerDetails.lifespanDays }} days</div>
                        <div class="card"><strong>Occasion:</strong> {{ ad.flowerDetails.occasion }}</div>
                    </div>
                </section>

                <section class="seller-section">
                    <h3>Seller Information</h3>
                    <div class="user-card">
                        <img :src="ad.user.avatarUrl" alt="Avatar" class="avatar" />
                        <div class="user-meta">
                            <h4>{{ ad.user.username }}</h4>
                            <p>Community member since {{ new Date(ad.user.createdAt).getFullYear() }}</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </MainLayout>
</template>

<style scoped>
.ad-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.cover-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    border-radius: 12px;
}

.hero-content {
    margin: 1.5rem 0;
}

.price {
    font-size: 2rem;
    font-weight: bold;
    color: #059669;
}

.details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1rem;
}

.card {
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.user-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f0fdf4;
    border-radius: 8px;
}

.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
</style>