<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Swal from 'sweetalert2'
import MainLayout from '@/components/MainLayout.vue'
import { MainService } from '@/services/main.service'

const cartItems = ref<any[]>([])
const purchaseHistory = ref<any[]>([])
const loading = ref(true)

async function loadCartData() {
  loading.value = true;
  
  try {
    const cartRes = await MainService.useAxios('/cart');
    const rawCart = cartRes?.data?.data?.items || cartRes?.data?.items || cartRes?.data || [];
    cartItems.value = Array.isArray(rawCart) ? rawCart : [];
  } catch (err) {
    console.error('Failed loading active cart:', err);
  }

  try {
    const historyRes = await MainService.useAxios('/cart/purchases');
    const rawHistory = historyRes?.data?.data || historyRes?.data || [];
    purchaseHistory.value = Array.isArray(rawHistory) ? rawHistory : [];
  } catch (err) {
    console.error('Failed loading order history:', err);
  } finally {
    loading.value = false;
  }
}

async function removeItem(itemId: number) {
  try {
    await MainService.useAxios(`/cart/item/${itemId}`, 'delete')
    await loadCartData()
  } catch (err) {
    console.error('Failed removing item:', err)
  }
}

async function handleCheckout() {
  const confirm = await Swal.fire({
    title: 'Confirm Order',
    text: `Complete checkout for $${totalPrice.value.toFixed(2)}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Buy Now',
    confirmButtonColor: '#059669'
  })

  if (confirm.isConfirmed) {
    try {
      await MainService.useAxios('/cart/checkout', 'post')
      await Swal.fire('Success!', 'Your purchase is complete.', 'success')
      await loadCartData() 
    } catch (err: any) {
      Swal.fire('Error', err.response?.data?.error || 'Checkout failed', 'error')
    }
  }
}

const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + Number(item.price || 0), 0)
})

onMounted(loadCartData)
</script>

<template>
  <MainLayout>
    <div class="cart-container">
      <h2>Active Cart</h2>
      
      <div v-if="loading" class="loading-state">
        <p>Loading your cart...</p>
      </div>


      <div v-else-if="cartItems.length > 0" class="cart-layout">
        <div class="cart-items-list">
          <div v-for="item in cartItems" :key="item.item_id" class="cart-item-card">
            <img :src="item.cover_image || '/images/default.jpg'" class="item-img" />
            <div class="item-info">
              <h3>{{ item.title }}</h3>
              <p class="item-price">${{ Number(item.price).toFixed(2) }}</p>
              <span class="hold-badge">⏱️ {{ item.minutes_remaining ?? 60 }} mins left</span>
            </div>
            <button @click="removeItem(item.item_id)" class="remove-btn">Remove</button>
          </div>
        </div>

        <div class="cart-summary">
          <h3>Summary</h3>
          <hr />
          <div class="summary-row">
            <span>Items:</span>
            <span>{{ cartItems.length }}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>${{ totalPrice.toFixed(2) }}</span>
          </div>
          <button @click="handleCheckout" class="checkout-btn">Checkout</button>
        </div>
      </div>

      <p v-else class="empty-cart">Your cart is currently empty.</p>


      <div v-if="purchaseHistory.length > 0" class="history-section">
        <h2>Order History & Previous Purchases</h2>
        <div class="history-grid">
          <div v-for="order in purchaseHistory" :key="order.purchase_id" class="history-card">
            <img :src="order.cover_image || '/images/default.jpg'" class="history-img" />
            <div class="history-info">
              <h4>{{ order.title }}</h4>
              <p class="item-price">${{ Number(order.price).toFixed(2) }}</p>
              <small class="purchase-date">
                Purchased on: {{ new Date(order.purchased_at).toLocaleDateString() }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.cart-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: sans-serif;
}

.cart-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-top: 1.5rem;
}

.cart-item-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: white;
}

.item-img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.item-info {
  flex: 1;
}

.item-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.item-price {
  margin: 0;
  color: #059669;
  font-weight: bold;
}

.hold-badge {
  display: inline-block;
  margin-top: 0.4rem;
  font-size: 0.8rem;
  color: #d97706;
  background: #fef3c7;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
}

.remove-btn {
  background: #fee2e2;
  color: #991b1b;
  border: none;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.remove-btn:hover {
  background: #fca5a5;
}

.cart-summary {
  background: white;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  height: fit-content;
}

.cart-summary h3 {
  margin-top: 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.summary-row.total {
  font-size: 1.2rem;
  font-weight: bold;
  color: #065f46;
}

.checkout-btn {
  width: 100%;
  background: #059669;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
}

.checkout-btn:hover {
  background: #047857;
}

.empty-cart, .loading-state {
  text-align: center;
  padding: 3rem;
  color: #64748b;
}

/* History Section */
.history-section {
  margin-top: 3.5rem;
  border-top: 2px solid #e2e8f0;
  padding-top: 2rem;
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.history-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.history-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
}

.history-info h4 {
  margin: 0 0 0.2rem 0;
  font-size: 0.95rem;
}

.purchase-date {
  font-size: 0.75rem;
  color: #64748b;
}
</style>