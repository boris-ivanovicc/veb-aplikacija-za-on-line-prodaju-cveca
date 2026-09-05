<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { MainService } from '@/services/main.service'
import MainLayout from '@/components/MainLayout.vue'

const router = useRouter()

type AdImageFileType = 'jpeg' | 'png'

interface AdImageInput {
    original_url: string
    thumbnail_url?: string
    file_type?: AdImageFileType
    is_cover: boolean
}

const newAd = ref({
    title: '',
    price: 0,
    location: '',
    description: '',
    endsAt: '',
    flowerDetails: {
        origin: '',
        sizeCm: null as number | null,
        lifespanDays: null as number | null,
        occasion: '',
        isPotted: false
    },
    images: [] as AdImageInput[]
})

const isSubmitting = ref(false)
const message = ref('')

const checkAuthAndRedirect = () => {
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
            text: 'You need an active account to create an ad.',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Log In',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#059669'
        }).then((result) => {
            if (result.isConfirmed) {
                router.push('/login')
            } else {
                router.push('/')
            }
        })
        return false
    }
    return true
}

onMounted(() => {
    checkAuthAndRedirect()
})

function handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    if (!file) return

    if (newAd.value.images.length >= 3) {
        alert('You can only upload a maximum of 3 images.')
        input.value = ''
        return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
        const originalBase64 = e.target?.result as string
        const img = new Image()

        img.onload = () => {
            const canvas = document.createElement('canvas')
            const scale = 300 / img.width

            canvas.width = 300
            canvas.height = img.height * scale

            const ctx = canvas.getContext('2d')
            if (!ctx) return

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

            const validFileType: AdImageFileType =
                file.type === 'image/png' || file.type === 'png' ? 'png' : 'jpeg'

            newAd.value.images.push({
                original_url: originalBase64,
                thumbnail_url: canvas.toDataURL('image/jpeg', 0.5),
                file_type: validFileType,
                is_cover: newAd.value.images.length === 0
            })

            input.value = ''
        }

        img.src = originalBase64
    }

    reader.readAsDataURL(file)
}

function removeImage(index: number) {
    const image = newAd.value.images[index]
    if (!image) return

    const wasCover = image.is_cover
    newAd.value.images.splice(index, 1)

    if (wasCover && newAd.value.images.length > 0) {
        newAd.value.images[0]!.is_cover = true
    }
}

function setCover(index: number) {
    newAd.value.images.forEach((img, i) => {
        img.is_cover = i === index
    })
}

async function submitAd() {
    if (!checkAuthAndRedirect()) return

    isSubmitting.value = true
    message.value = ''

    const payload = {
        title: newAd.value.title,
        location: newAd.value.location,
        price: Number(newAd.value.price),
        ad_description: newAd.value.description,
        ends_at: newAd.value.endsAt || null,
        details: {
            flower_name: newAd.value.title,
            occasion: newAd.value.flowerDetails.occasion,
            size_cm: newAd.value.flowerDetails.sizeCm,
            origin: newAd.value.flowerDetails.origin,
            lifespan_days: newAd.value.flowerDetails.lifespanDays,
            is_potted: newAd.value.flowerDetails.isPotted ? 1 : 0
        },
        images: newAd.value.images
    }

    try {
        await MainService.createAd(payload)
        
        await Swal.fire({
            title: 'Success!',
            text: 'Your ad has been created successfully.',
            icon: 'success',
            confirmButtonColor: '#059669'
        })

        router.push('/shop')
    } catch (err: any) {
        message.value =
            err.response?.status === 413
                ? 'Image size too large. Try fewer or smaller images.'
                : 'Error creating ad.'
        
        Swal.fire({
            title: 'Action Failed',
            text: message.value,
            icon: 'warning',
            confirmButtonColor: '#059669'
        })
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <MainLayout>
        <div class="create-ad-container">
            <h1>Create New Ad</h1>

            <form @submit.prevent="submitAd" class="ad-form">
                <label>
                    Title
                    <input v-model="newAd.title" required />
                </label>

                <label>
                    Price
                    <input type="number" v-model.number="newAd.price" required />
                </label>

                <label>
                    Location
                    <input v-model="newAd.location" required />
                </label>

                <label>
                    Ends At
                    <input type="datetime-local" v-model="newAd.endsAt" />
                </label>

                <label>
                    Description
                    <textarea v-model="newAd.description" />
                </label>

                <label>
                    Images
                    <input type="file" accept="image/*" @change="handleFileUpload" />
                </label>

                <div v-if="newAd.images.length" class="image-preview-grid">
                    <div v-for="(img, index) in newAd.images" :key="index" class="thumbnail-item">
                        <img :src="img.thumbnail_url" />
                        <div class="actions-overlay">
                            <button type="button" @click="setCover(index)" :class="{ active: img.is_cover }">
                                {{ img.is_cover ? 'Cover' : 'Set Cover' }}
                            </button>
                            <button type="button" @click="removeImage(index)" class="delete-btn">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                <h3>Flower Details</h3>

                <label>
                    Origin
                    <input v-model="newAd.flowerDetails.origin" />
                </label>

                <label>
                    Size (cm)
                    <input type="number" v-model.number="newAd.flowerDetails.sizeCm" />
                </label>

                <label>
                    Lifespan (days)
                    <input type="number" v-model.number="newAd.flowerDetails.lifespanDays" />
                </label>

                <label>
                    Occasion
                    <select v-model="newAd.flowerDetails.occasion">
                        <option disabled value="">Select an occasion</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Anniversary">Anniversary</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Valentine">Valentine</option>
                        <option value="Mother's Day">Mother's Day</option>
                        <option value="General">General / Everyday</option>
                    </select>
                </label>

                <label class="checkbox-label">
                    <input type="checkbox" v-model="newAd.flowerDetails.isPotted" />
                    Potted
                </label>

                <button type="submit" :disabled="isSubmitting">
                    {{ isSubmitting ? 'Submitting...' : 'Create Ad' }}
                </button>
            </form>

            <p v-if="message">{{ message }}</p>
        </div>
    </MainLayout>
</template>

<style scoped>
.create-ad-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.ad-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.ad-form label {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.checkbox-label {
    flex-direction: row !important;
    align-items: center;
    gap: 0.5rem !important;
}

.ad-form input,
.ad-form select,
.ad-form textarea {
    padding: 0.75rem;
    border: 1px solid #cbd5e0;
    border-radius: 6px;
}

.image-preview-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
}

.thumbnail-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.thumbnail-item img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.actions-overlay {
    display: flex;
    gap: 5px;
    margin-top: 5px;
}

.active {
    background: #08664a;
    color: white;
}

.delete-btn {
    background: #e53e3e;
    color: white;
}

button {
    padding: 0.75rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>