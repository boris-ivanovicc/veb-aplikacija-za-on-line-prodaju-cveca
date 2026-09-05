<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import MainLayout from '@/components/MainLayout.vue'
import { MainService } from '@/services/main.service'

const route = useRoute()
const router = useRouter()
const ad = ref(null)
const activeImageIndex = ref(0)

const fetchAd = async (id) => {
    try {
        const rsp = await MainService.getAdById(id)
        ad.value = rsp.data?.data || rsp.data
        activeImageIndex.value = 0
    } catch (err) {
        console.error("Failed to load ad:", err)
    }
}

onMounted(() => {
    fetchAd(route.params.id)
})

watch(() => route.params.id, (newId) => {
    if (newId) {
        ad.value = null
        fetchAd(newId)
    }
})

const nextImage = () => {
    if (!ad.value?.ad_images || ad.value.ad_images.length === 0) return
    activeImageIndex.value = (activeImageIndex.value + 1) % ad.value.ad_images.length
}

const prevImage = () => {
    if (!ad.value?.ad_images || ad.value.ad_images.length === 0) return
    activeImageIndex.value = (activeImageIndex.value - 1 + ad.value.ad_images.length) % ad.value.ad_images.length
}

const setActiveImage = (index) => {
    activeImageIndex.value = index
}

async function addToCart() {
    if (!ad.value) return

    const authDataRaw = localStorage.getItem('flower_shop_auth')
    let token = null

    if (authDataRaw) {
        try {
            const parsed = JSON.parse(authDataRaw)
            token = parsed.access || parsed.token || authDataRaw
        } catch (e) {
            token = authDataRaw
        }
    }

    if (!token) {
        Swal.fire({
            title: 'Please Log In',
            text: 'You need an active account to reserve flowers.',
            icon: 'info',
            confirmButtonColor: '#059669'
        })
        return
    }

    try {
        await MainService.useAxios('/cart/add', 'post', { ad_id: ad.value.id })

        const result = await Swal.fire({
            title: 'Added to Cart!',
            text: `"${ad.value.title}" is held in your cart for 1 hour.`,
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Go to Cart',
            cancelButtonText: 'Continue Shopping',
            confirmButtonColor: '#059669'
        })

        if (result.isConfirmed) {
            router.push('/cart')
        } else {
            router.push('/shop')
        }
    } catch (err) {
        console.error('Failed to add to cart:', err)
        Swal.fire({
            title: 'Action Failed',
            text: err.response?.data?.error || 'Could not reserve item.',
            icon: 'warning',
            confirmButtonColor: '#059669'
        })
    }
}
</script>

<template>
    <MainLayout>
        <div v-if="ad" class="details-container">
            <div class="details-grid">
                <div class="left-column">
                    <div class="carousel">
                        <div class="ad-image"
                            :style="{ backgroundImage: `url(${ad.ad_images && ad.ad_images.length > 0 ? ad.ad_images[activeImageIndex].original_url : ''})` }">
                        </div>
                        <button v-if="ad.ad_images && ad.ad_images.length > 1" class="nav-btn prev"
                            @click="prevImage">❮</button>
                        <button v-if="ad.ad_images && ad.ad_images.length > 1" class="nav-btn next"
                            @click="nextImage">❯</button>
                        <div v-if="ad.ad_images && ad.ad_images.length > 0" class="image-counter">{{ activeImageIndex +
                            1 }} / {{ ad.ad_images.length }}</div>
                    </div>

                    <div v-if="ad.ad_images && ad.ad_images.length > 0" class="thumbnail-row">
                        <div v-for="(img, index) in ad.ad_images" :key="img.id" class="thumbnail-container"
                            :class="{ active: index === activeImageIndex }" @click="setActiveImage(index)">
                            <div class="thumbnail-image" :style="{ backgroundImage: `url(${img.thumbnail_url})` }">
                            </div>
                        </div>
                    </div>

                    <div class="seller-card">
                        <img :src="ad.users?.avatar_url || '/default-avatar.png'" alt="Avatar" class="seller-avatar" />
                        <div class="seller-info">
                            <h4>{{ ad.users?.display_name || ad.users?.username || 'Unknown Seller' }}</h4>
                            <p>Member since {{ ad.users?.created_at ? new Date(ad.users.created_at).toLocaleDateString()
                                : 'N/A' }}</p>
                        </div>
                    </div>
                </div>

                <div class="right-column">
                    <h1 class="product-title">{{ ad.title }}</h1>
                    <p class="location-text">📍 {{ ad.location || 'Location not specified' }}</p>

                    <div class="specs-grid">
                        <div class="spec-card">
                            <span class="spec-label">Origin</span>
                            <span class="spec-value">{{ ad.flower_details?.origin || 'N/A' }}</span>
                        </div>
                        <div class="spec-card">
                            <span class="spec-label">Size</span>
                            <span class="spec-value">{{ ad.flower_details?.size_cm ? `${ad.flower_details.size_cm} cm` :
                                'N/A' }}</span>
                        </div>
                        <div class="spec-card">
                            <span class="spec-label">Lifespan</span>
                            <span class="spec-value">{{ ad.flower_details?.lifespan_days ?
                                `${ad.flower_details.lifespan_days} days` : 'N/A' }}</span>
                        </div>
                        <div class="spec-card">
                            <span class="spec-label">Occasion</span>
                            <span class="spec-value">{{ ad.flower_details?.occasion || 'General' }}</span>
                        </div>
                        <div class="spec-card full-width" v-if="ad.ends_at">
                            <span class="spec-label">Expires At</span>
                            <span class="spec-value">{{ new Date(ad.ends_at).toLocaleString() }}</span>
                        </div>
                    </div>

                    <div class="action-bar">
                        <p class="price">${{ Number(ad.price || 0).toFixed(2) }}</p>
                        <button class="buy-btn" @click="addToCart">Buy</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="loading-state">
            <p>Loading ad...</p>
        </div>
    </MainLayout>
</template>

<style scoped>
.details-container {
    max-width: 850px;
    margin: 3rem auto;
    padding: 1.3rem 1rem;
}

.details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
}

.carousel {
    position: relative;
    width: 100%;
    margin-bottom: 1rem;
}

.ad-image {
    width: 100%;
    height: 400px;
    background-size: cover;
    background-position: center;
    border-radius: 12px;
    transition: background-image 0.3s ease;
}

.nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.8);
    border: none;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
}

.prev {
    left: 10px;
}

.next {
    right: 10px;
}

.image-counter {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
    font-size: 0.8rem;
}

.thumbnail-row {
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;
    margin-bottom: 1rem;
}

.thumbnail-container {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    border-radius: 8px;
    cursor: pointer;
    border: 2px solid transparent;
    overflow: hidden;
    transition: border-color 0.2s;
}

.thumbnail-container.active {
    border-color: #059669;
}

.thumbnail-image {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
}

.seller-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1.5rem;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
}

.seller-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
}

.seller-info h4 {
    margin: 0;
}

.seller-info p {
    margin: 0;
    font-size: 0.8rem;
    color: #64748b;
}

.product-title {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
}

.location-text {
    color: #64748b;
    margin-bottom: 2rem;
}

.specs-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
}

.spec-card {
    background: #f8fafc;
    padding: 0.8rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.spec-card.full-width {
    grid-column: span 2;
}

.spec-label {
    display: block;
    font-size: 0.7rem;
    color: #64748b;
    text-transform: uppercase;
}

.spec-value {
    font-weight: 600;
}

.action-bar {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-top: 2rem;
}

.price {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
}

.buy-btn {
    width: 120px;
    background: #059669;
    color: white;
    border: none;
    padding: 0.75rem 0;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
}

.buy-btn:hover {
    background: #047857;
}

.loading-state {
    text-align: center;
    padding: 4rem;
    font-size: 1.2rem;
    color: #666;
}

@media (max-width: 768px) {
    .details-grid {
        grid-template-columns: 1fr;
    }
}
</style>