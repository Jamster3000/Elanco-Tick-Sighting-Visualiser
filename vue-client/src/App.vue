<script setup lang="ts">
    import { ref, watch } from 'vue'
    import { useRouter } from 'vue-router'
    import LeafletMap from '@/components/LeafletMap.vue'
    import Profile from '@/components/Profile.vue'

    const router = useRouter()
    const fullName = ref<string | null>(null)

    const updateUser = () => {
        const userData = localStorage.getItem('user')
        fullName.value = userData ? JSON.parse(userData).fullName : null
    }

    updateUser()

    watch(() => router.currentRoute.value.path, () => {
        updateUser()
    })
</script>

<template>
    <div>
        <nav class="navbar">
            <div class="nav-container">
                <div class="logo"> Elanco TickTracker</div>

                <div class="links">
                    <router-link to="/">Home</router-link>
                    <br />

                    <router-link to="/tickinfo">Explore Tick Species</router-link>
                    <br />

                    <router-link to="/map">Map</router-link>
                    <br />

                    <router-link to="/tickHistory">Tick History</router-link>
                    <br />

                    <router-link to="/about">About</router-link>
                </div>

                <div class="auth-buttons">
                    <Profile v-if="fullName" :fullName="fullName" />
                    <template v-else>
                        <router-link to="/signup" class="btn btn-primary" style="text-decoration: none;">Signup</router-link>
                        <router-link to="/login" class="btn btn-secondary" style="text-decoration: none;">Login</router-link>
                    </template>
                </div>
            </div>
        </nav>

        <router-view />
    </div>
</template>

<style scoped>
    .navbar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: var(--header-height);
        background-color: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(12px);
        border-bottom: 2px solid var(--primary-light);
        box-shadow: 0 4px 24px rgba(52, 152, 219, 0.1);
        z-index: 1000;
    }

    .nav-container {
        margin: 0 auto;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 32px;
    }

    .logo {
        font-weight: 700;
        font-size: 1.1rem;
        color: var(--primary);
        letter-spacing: -0.3px;
    }

    .links {
        display: flex;
        gap: 8px;
    }

        .links a {
            text-decoration: none;
            color: var(--text);
            font-size: 15px;
            font-weight: 500;
            padding: 6px 12px;
            border-radius: 6px;
            transition: all 0.2s ease;
        }

            .links a:hover {
                color: var(--primary);
                background: rgba(52, 152, 219, 0.08);
            }

    .router-link-active {
        color: var(--primary) !important;
        background: rgba(52, 152, 219, 0.1) !important;
        font-weight: 600;
    }

    .auth-buttons {
        display: flex;
        gap: 12px;
        align-items: center;
    }
</style>