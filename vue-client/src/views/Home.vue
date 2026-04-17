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
                <button class="btn btn-secondary btn-large" @click="router.push('/login')">Login</button>
                <button class="btn btn-primary btn-large" @click="router.push('/Signup')">Sign Up</button>
            </div>
        </div>
        <div class="map-section">
            <h2 class="map-section-title">Tick Visualization Map</h2>
            <button class="btn btn-primary btn-large" @click="router.push('/map')">Explore the Map</button>
        </div>
    </div>
</template>

<style scoped>
    .auth-buttons {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .hero-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(60vh - var(--header-height));
      padding: 60px 80px;
    }

    .hero-content {
      text-align: left;
      max-width: 600px;
      animation: fadeInUp 0.8s ease;
    }

    .hero-subtitle {
      font-size: calc(24px * var(--font-scale, 1));
      color: var(--primary);
      font-weight: 500;
      margin-bottom: 32px;
    }

    .hero-title {
      font-size: calc(56px * var(--font-scale, 1));
      font-weight: 700;
      color: var(--text);
      margin-bottom: 16px;
      letter-spacing: -1px;
    }

    .map-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
      padding: 60px 40px;
      border-top: 3px solid rgba(52, 152, 219, 0.12);
      animation: fadeInUp 1s ease 0.2s both;
    }

    .map-section-title {
      font-size: calc(32px * var(--font-scale, 1));
      font-weight: 600;
      color: var(--text);
      opacity: 0.85;
      text-align: center;
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

    @media (max-width: 900px) {
      .auth-buttons {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }

      .auth-buttons .btn {
        width: 100%;
        padding: 14px 16px;
        box-sizing: border-box;
        font-size: 16px;
        border-radius: 6px;
      }

      .hero-container {
        flex-direction: column;
        padding: 40px 16px;
        text-align: center;
        width: 100%;
        align-items: stretch;
        min-height: auto;
      }

      .hero-content {
        text-align: center;
        margin: 0 auto;
      }

      .hero-subtitle {
        font-size: 16px;
        margin-bottom: 24px;
      }

      .hero-title {
        font-size: 28px;
        letter-spacing: -0.3px;
        margin-bottom: 12px;
      }

      .map-section {
        padding: 40px 16px;
        border-top: 2px solid rgba(52, 152, 219, 0.12);
        gap: 16px;
      }

      .map-section .btn {
        width: 100%;
        padding: 14px 16px;
        font-size: 16px;
        border-radius: 6px;
      }

      .map-section-title {
        font-size: 24px;
      }
    }
</style>