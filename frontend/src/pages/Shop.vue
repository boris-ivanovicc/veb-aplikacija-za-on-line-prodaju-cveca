<script setup>
import { ref, computed, watch } from 'vue'
import MainLayout from '@/components/MainLayout.vue'

const ads = ref([
  {
    id: 1,
    title: 'Red Rose Bouquet',
    category: 'Roses',
    price: 45,
    location: 'Belgrade',
    date: '2026-06-15',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?q=80&w=400',
    flowerDetails: { origin: 'Serbia', lifespanDays: 7, occasion: 'Anniversary', isPotted: false }
  },
  {
    id: 2,
    title: 'Minimalist Monstera',
    category: 'Indoor',
    price: 25,
    location: 'Novi Sad',
    date: '2026-06-17',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=400',
    flowerDetails: { origin: 'Tropical', lifespanDays: null, occasion: 'Home Decor', isPotted: true }
  },
  {
    id: 3,
    title: 'Spring Wildflower Mix',
    category: 'Bouquet',
    price: 35,
    location: 'Niš',
    date: '2026-06-10',
    image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?q=80&w=400',
    flowerDetails: { origin: 'Mountainous', lifespanDays: 5, occasion: 'Gift', isPotted: false }
  },
  {
    id: 4,
    title: 'White Wedding Peonies',
    category: 'Bouquet',
    price: 60,
    location: 'Belgrade',
    date: '2026-06-18',
    image: 'https://images.unsplash.com/photo-1533616688419-b7a585564566?q=80&w=400',
    flowerDetails: { origin: 'Local', lifespanDays: 4, occasion: 'Wedding', isPotted: false }
  },
  {
    id: 5,
    title: 'Pink Tulip Bunch',
    category: 'Bouquet',
    price: 20,
    location: 'Kragujevac',
    date: '2026-06-12',
    image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=400',
    flowerDetails: { origin: 'Dutch', lifespanDays: 6, occasion: 'Birthday', isPotted: false }
  },
])

const searchQuery = ref('')
const selectedCategory = ref('')
const sortBy = ref('newest')
const currentPage = ref(1)
const itemsPerPage = 3

const filteredAndSortedAds = computed(() => {
  let result = [...ads.value]
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(ad => ad.title.toLowerCase().includes(query))
  }
  if (selectedCategory.value) result = result.filter(ad => ad.category === selectedCategory.value)
  if (sortBy.value === 'price-low') result.sort((a, b) => a.price - b.price)
  else if (sortBy.value === 'price-high') result.sort((a, b) => b.price - a.price)
  else if (sortBy.value === 'newest') result.sort((a, b) => new Date(b.date) - new Date(a.date))
  return result
})

const totalPages = computed(() => Math.ceil(filteredAndSortedAds.value.length / itemsPerPage))
const paginatedAds = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredAndSortedAds.value.slice(start, start + itemsPerPage)
})

watch([searchQuery, selectedCategory, sortBy], () => { currentPage.value = 1 })
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
            <div class="ad-image" :style="{ backgroundImage: `url(${ad.image})` }"></div>

            <div class="ad-details">
              <span class="ad-category">{{ ad.category }}</span>
              <h3>{{ ad.title }}</h3>

              <div class="ad-chips">
                <span class="chip chip-origin">
                  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {{ ad.flowerDetails?.origin || 'Local' }}
                </span>
                <span class="chip chip-potted" v-if="ad.flowerDetails?.isPotted">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-amphora">
                    <path d="M10 2v5.632c0 .424-.272.795-.653.982A6 6 0 0 0 6 14c.006 4 3 7 5 8" />
                    <path d="M10 5H8a2 2 0 0 0 0 4h.68" />
                    <path d="M14 2v5.632c0 .424.272.795.652.982A6 6 0 0 1 18 14c0 4-3 7-5 8" />
                    <path d="M14 5h2a2 2 0 0 1 0 4h-.68" />
                    <path d="M18 22H6" />
                    <path d="M9 2h6" />
                  </svg>
                  Potted
                </span>
                <span class="chip chip-occasion" v-if="ad.flowerDetails?.occasion">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-gift">
                    <path d="M12 7v14" />
                    <path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
                    <path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5" />
                    <rect x="3" y="7" width="18" height="4" rx="1" />
                  </svg>
                  {{ ad.flowerDetails.occasion }}
                </span>
              </div>
            </div>

            <div class="card-footer">
              <div class="price-info">
                <p class="ad-price">${{ ad.price }}</p>
                <p class="ad-location">{{ ad.location }}</p>
              </div>
              <button class="buy-btn" @click.prevent="addToCart(ad)">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"
                  stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                Buy
              </button>
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

.ad-card svg {
  width: 16px;
  height: 16px;
  stroke-width: 2;
  display: block;
  flex-shrink: 0;
}

.ad-card:hover {
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