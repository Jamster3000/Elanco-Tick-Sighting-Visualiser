<script setup lang="ts">
    import { useRouter } from 'vue-router'

    const router = useRouter()
</script>

<template>
    <div class="container">
        <div class="hero-container">
            <div class="hero-content">
                <h1 class="hero-title">Tick Sighting Visualiser</h1>
                <p class="hero-subtitle">Track and analyze tick populations in the UK</p>
            </div>
            <div class="auth-buttons">
                <button class="btn btn-secondary btn-large" @click="router.push('/login')">
                    Login
                </button>
                <button class="btn btn-primary btn-large" @click="router.push('/Signup')">
                    Sign Up
                </button>
            </div>
        </div>

        <div class="map-section">
            <h2 class="map-section-title">Tick Visualization Map</h2>
            <button class="btn btn-primary btn-large" @click="router.push('/map')">
                Explore the Map
            </button>
        </div>
    </div>
</template>

<style scoped>
    .hero-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: calc(50vh - var(--header-height));
        background: linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(52, 152, 219, 0.05) 100%);
        padding: 40px 20px;
    }

    .hero-content {
        text-align: center;
        max-width: 600px;
        animation: fadeInUp 0.8s ease;
    }

    .hero-title {
        font-size: 56px;
        font-weight: 700;
        color: var(--text);
        margin-bottom: 16px;
        letter-spacing: -1px;
    }

    .hero-subtitle {
        font-size: 24px;
        color: var(--primary);
        font-weight: 600;
        margin-bottom: 24px;
    }

    .auth-buttons {
        display: flex;
        gap: 24px;
        margin-left: auto;
        padding-right: 80px;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }

    .map-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 24px;
        padding: 80px 40px;
        background: linear-gradient(135deg, rgba(52, 152, 219, 0.05) 0%, rgba(52, 152, 219, 0.02) 100%);
        border-top: 1px solid rgba(52, 152, 219, 0.1);
        animation: fadeInUp 1s ease 0.2s both;
    }

    .map-section-title {
        font-size: 32px;
        font-weight: 600;
        color: var(--text);
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(15px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>