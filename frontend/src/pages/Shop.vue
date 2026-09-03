<script setup>
import { ref, computed, watch, onMounted, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import MainLayout from '@/components/MainLayout.vue'
import { MainService } from '@/services/main.service'

const router = useRouter()
const ads = ref([])
const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('newest')
const currentPage = ref(1)
const itemsPerPage = 9

async function loadAds() {
  try {
    const rsp = await MainService.useAxios('/ads?page=1&limit=1000', 'get')
    const rawData = rsp.data?.data?.ads || rsp.data?.data || rsp.data?.ads || rsp.data
    ads.value = Array.isArray(rawData) ? rawData : []
  } catch (err) {
    console.error("Failed to load ads:", err)
  }
}

onMounted(loadAds)
onActivated(loadAds)

const filteredAndSortedAds = computed(() => {
  let result = [...ads.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(ad => ad.title?.toLowerCase().includes(query))
  }

  if (selectedCategory.value) {
    const targetCategory = selectedCategory.value.toLowerCase()
    result = result.filter(ad => {
      const adCat = (ad.category || '').toLowerCase()
      const flowerOccasion = (ad.flower_details?.occasion || ad.flowerDetails?.occasion || '').toLowerCase()
      const flowerName = (ad.flower_details?.flower_name || ad.flowerDetails?.flowerName || '').toLowerCase()

      return adCat === targetCategory || 
             flowerOccasion === targetCategory || 
             flowerName.includes(targetCategory)
    })
  }

  if (sortBy.value === 'price-low') {
    result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
  } else if (sortBy.value === 'price-high') {
    result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
  } else if (sortBy.value === 'newest') {
    result.sort((a, b) => new Date(b.created_at || b.date || 0) - new Date(a.created_at || a.date || 0))
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredAndSortedAds.value.length / itemsPerPage))
const paginatedAds = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredAndSortedAds.value.slice(start, start + itemsPerPage)
})

watch([searchQuery, selectedCategory, sortBy], () => { currentPage.value = 1 })

function getCoverImage(ad) {
  if (!ad.ad_images || ad.ad_images.length === 0) return ''
  const coverImage = ad.ad_images.find(img => img.is_cover === 1 || img.is_cover === true)
  return (coverImage || ad.ad_images[0])?.thumbnail_url || (coverImage || ad.ad_images[0])?.original_url || ''
}

async function addToCart(ad) {
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
    await MainService.useAxios('/cart/add', 'post', { ad_id: ad.id })

    const result = await Swal.fire({
      title: 'Added to Cart!',
      text: `"${ad.title}" is held in your cart for 1 hour.`,
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Go to Cart',
      cancelButtonText: 'Continue Shopping',
      confirmButtonColor: '#059669',
      cancelButtonColor: '#6B7280'
    })

    if (result.isConfirmed) {
      router.push('/cart')
    } else {
      await loadAds()
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
    <div class="shop-container">
      <header class="shop-header">
        <h1>Marketplace</h1>
        <p>Browse fresh floral arrangements posted by our community.</p>
      </header>

      <div class="shop-controls">
        <input v-model="searchQuery" type="text" placeholder="Search flowers..." class="search-input" />
        <div class="control-groups">
          <select v-model="selectedCategory">
            <option value="">All Categories</option>
            <option value="Bouquet">Bouquets</option>
            <option value="Indoor">Indoor Plants</option>
            <option value="Roses">Roses</option>
            <option value="Gift">Gifts</option>
          </select>
          <select v-model="sortBy">
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div v-if="paginatedAds.length > 0" class="ads-grid">
        <router-link v-for="ad in paginatedAds" :key="ad.id" :to="{ name: 'AdDetails', params: { id: ad.id } }"
          class="ad-card-link">
          <div class="ad-card">
            <div class="ad-image" :style="{ backgroundImage: `url(${getCoverImage(ad)})` }"></div>

            <div class="ad-details">
              <span class="ad-category">{{ ad.category || ad.flower_details?.occasion || 'Flower' }}</span>
              <h3>{{ ad.title }}</h3>

              <div class="ad-chips">
                <span class="chip chip-origin">
                  {{ ad.flower_details?.origin || ad.flowerDetails?.origin || 'Local' }}
                </span>
                <span class="chip chip-potted"
                  v-if="ad.flower_details?.is_potted || ad.flowerDetails?.isPotted">Potted</span>
                <span class="chip chip-occasion" v-if="ad.flower_details?.occasion || ad.flowerDetails?.occasion">
                  {{ ad.flower_details?.occasion || ad.flowerDetails?.occasion }}
                </span>
              </div>
            </div>

            <div class="card-footer">
              <div class="price-info">
                <p class="ad-price">${{ Number(ad.price || 0).toFixed(2) }}</p>
                <p class="ad-location">{{ ad.location || 'Local Shop' }}</p>
              </div>
              <button class="buy-btn" @click.prevent="addToCart(ad)">Buy</button>
            </div>
          </div>
        </router-link>
      </div>

      <div v-else class="empty-state">
        <p>No ads found matching your criteria.</p>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <button :disabled="currentPage === 1" @click="currentPage--" class="page-btn">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="currentPage++" class="page-btn">Next</button>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.shop-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: sans-serif;
}

.shop-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.shop-controls {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input,
select {
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
}

.search-input {
  width: 300px;
}

.control-groups {
  display: flex;
  gap: 0.5rem;
}

.ads-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.ad-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
  transition: transform 0.2s;
}

.ad-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.ad-card-link:hover .ad-card {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

.ad-image {
  height: 200px;
  background-size: cover;
  background-position: center;
}

.ad-details {
  padding: 1.25rem;
}

.ad-category {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #059669;
  font-weight: bold;
}

.ad-details h3 {
  margin: 0.4rem 0;
  font-size: 1.15rem;
}

.ad-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.chip {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 600;
}

.chip-origin {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.chip-potted {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #dcfce7;
}

.chip-occasion {
  background: #fff1f2;
  color: #9f1239;
  border: 1px solid #ffe4e6;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background-color: #f0fdf4;
  border-top: 1px solid #dcfce7;
}

.ad-price {
  font-weight: 800;
  font-size: 1.25rem;
  color: #065f46;
  margin: 0;
}

.ad-location {
  font-size: 0.75rem;
  color: #059669;
  margin: 0;
  font-weight: 500;
}

.buy-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #059669;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.buy-btn:hover {
  background: #047857;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 3rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}
</style>
