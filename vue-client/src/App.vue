<script setup lang="ts">
    import LeafletMap from '@/components/LeafletMap.vue'
</script>

<template>
    <div>
        <nav class="navbar">
            <div class="nav-container">
                <div class="logo"> Elanco TickTracker - Pasa's Demo Version </div>

                <div class="links">
                    <router-link to="/tickinfo">Tick Info</router-link>
                    <router-link to="/">Home</router-link>
                    <router-link to="/map">Map</router-link>
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
</style>

<style>

    body {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
    }

    .navbar {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%; 
        height: 60px;
        background-color: #f5f5f5;
        border: 5px solid gray; 
        box-sizing: border-box; /* makes sure the width includes the border */
        z-index: 1000;
    }

    /* container keeps things centered */

    .nav-container {
        max-width: 1100px;
        margin: auto;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
    }

    /* logo */

    .logo {
        font-size: 22px;
        font-weight: bold;
        color: #2c3e50;
    }

    /* link container */

    .links {
        display: flex;
        gap: 25px;
    }

        /* router links */

        .links a {
            text-decoration: none;
            color: #555;
            font-size: 18px;
            font-weight: 500;
            transition: color 0.2s ease;
        }

            .links a:hover {
                color: #2c7be5;
            }

    /* active route highlight */

    .router-link-active {
        color: #2c7be5;
        font-weight: 600;
    }

    /* prevent content hiding behind navbar */

    .content {
        margin-top: 60px;
    }
</style>