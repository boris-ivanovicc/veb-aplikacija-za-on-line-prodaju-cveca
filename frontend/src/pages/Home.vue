<script setup lang="ts">
import MainLayout from '@/components/MainLayout.vue'
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
    <MainLayout>
        <div class="hero-section">
            <div class="hero-overlay"></div>

            <div class="hero-content">
                <h1 class="hero-title">
                    Where Stories Bloom & <br />
                    Fresh Beginnings Begin.
                </h1>

                <p class="hero-subtitle">
                    Explore handcrafted bouquets from local florists, or share your own floral creations with a
                    community that
                    loves to grow together.
                </p>

                <div class="hero-actions">
                    <button class="btn btn-primary" @click="$router.push('/shop')">Shop Now</button>
                    <button class="btn btn-secondary">Post an Ad</button>
                </div>
            </div>

            <div class="community-panel-wrapper">
                <div class="community-glass-panel">

                    <div class="panel-stats-vertical">
                        <div class="panel-stat-item">
                            <span class="stat-number">2,400+</span>
                            <span class="stat-label">Active Users</span>
                        </div>
                        <div class="panel-stat-item">
                            <span class="stat-number">1,200+</span>
                            <span class="stat-label">Live Ads</span>
                        </div>
                    </div>

                    <hr class="panel-divider" />

                    <div class="panel-body">
                        <h3>Become a part of the community</h3>
                        <p>Connect with local flower enthusiasts, trade floral arrangements, and grow your local network
                            in
                            Belgrade.</p>
                    </div>

                    <button class="btn-register" @click="$router.push('/register')">Create Account</button>

                </div>
            </div>

        </div>
    </MainLayout>
</template>

<style scoped>
.hero-section {
    position: relative;
    height: calc(100vh - 53px);
    width: 100%;
    display: flex;

    background-image: url('/images/flower-background.jpg');
    background-size: cover;
    background-position: center;
    font-family: sans-serif;
}

.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right,
            rgba(0, 0, 0, 0.70) 0%,
            rgba(0, 0, 0, 0.66) 18%,
            rgba(0, 0, 0, 0.55) 34%,
            rgba(0, 0, 0, 0.41) 50%,
            rgba(0, 0, 0, 0.28) 67%,
            rgba(0, 0, 0, 0.17) 83%,
            rgba(0, 0, 0, 0.10) 100%);
}

.hero-content {
    position: relative;
    z-index: 2;
    max-width: 600px;
    padding: 0 4rem;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1.5rem;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
    font-size: 1.15rem;
    line-height: 1.6;
    margin-bottom: 2.5rem;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.hero-actions {
    display: flex;
    gap: 1rem;
}

.btn {
    padding: 0.8rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
}

.btn-primary {
    background-color: #059669;
    color: white;
}

.btn-primary:hover {
    background-color: #047857;
}

.btn-secondary {
    background-color: rgba(255, 255, 255, 0.15);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(4px);
}

.btn-secondary:hover {
    background-color: rgba(255, 255, 255, 0.3);
    border-color: #ffffff;
}

@media (max-width: 768px) {
    .hero-content {
        padding: 0 2rem;
        text-align: center;
    }

    .hero-section {
        justify-content: center;
        flex-direction: column;
        gap: 3rem;
        height: auto;
        padding: 4rem 0;
        align-items: center;
    }

    .hero-overlay {
        background: rgba(0, 0, 0, 0.55);
    }

    .hero-title {
        font-size: 2.5rem;
    }

    .hero-actions {
        flex-direction: column;
        gap: 0.75rem;
    }

    .community-panel-wrapper {
        padding: 0 2rem !important;
        width: 100%;
        box-sizing: border-box;
        margin-top: 0 !important;
    }

    .community-glass-panel {
        max-width: 100% !important;
        width: 100% !important;
    }
}

.community-panel-wrapper {
    position: relative;
    z-index: 2;
    margin-left: auto;
    padding-right: 5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.community-glass-panel {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border: 2px solid rgba(255, 255, 255, 0.359);
    border-radius: 14px;
    padding: 3rem;
    width: 460px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
    color: #ffffff;
    box-sizing: border-box;
}

.panel-stats-vertical {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin-bottom: 0.5rem;
    align-items: center;
}

.panel-stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.2rem;
}

.stat-number {
    font-size: 2.65rem;
    font-weight: 700;
    color: #e0f5e5;
    line-height: 1;
    text-shadow: 0 3px 6px rgba(8, 21, 17, 0.112);
}

.stat-label {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.85);
    letter-spacing: 0.02em;
}

.panel-divider {
    border: none;
    height: 1px;
    background: rgba(255, 255, 255, 0.25);
    margin: 1.75rem 0;
}

.panel-body h3 {
    margin: 0 0 0.75rem 0;
    font-size: 1.4rem;
    font-weight: 700;
    line-height: 1.3;
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