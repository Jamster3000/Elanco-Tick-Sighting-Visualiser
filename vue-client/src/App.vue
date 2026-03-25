<script setup lang="ts">
    import LeafletMap from '@/components/LeafletMap.vue'
</script>

<template>
    <div>
        <nav class="navbar">
            <div class="nav-container">
                <div class="logo"> Elanco TickTracker - EXT 12 Version</div>

                <div class="links">
                    <router-link to="/">Home</router-link>
                    <br />

                    <router-link to="/tickinfo">Explore Tick Species</router-link>
                    <br />

                    <router-link to="/map">Map</router-link>
                    <br />

                    <router-link to="/about">About</router-link>
                </div>

            </div>
        </nav>

        <router-view />
    </div>
</template>

<style scoped>
    h1 {
        margin-bottom: 1rem;
    }

    .navbar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: var(--header-height);
        background: var(--bg);
        backdrop-filter: blur(10px);
        border-bottom: 5px solid var(--primary);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        z-index: 1000;
    }

    .nav-container {
        max-width: 1100px;
        margin: 0 auto;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
    }

    .logo {
        font-weight: 600;
        font-size: 1.1rem;
        color: var(--primary);
        text-shadow: 1px 1px 1px var(--shadow_color);
    }

    .links {
        display: flex;
        gap: 25px;
    }

        .links a {
            text-decoration: none;
            color: var(--text);
            font-size: 18px;
            font-weight: 500;
            transition: color 0.2s ease;
        }

            .links a:hover {
                color: var(--primary);
            }

    .router-link-active {
        color: var(--primary) !important;
        font-weight: 600;
    }

    .content {
        margin-top: 60px;
    }
</style>