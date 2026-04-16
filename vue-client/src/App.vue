<script setup lang="ts">
    import { ref, watch, onMounted, onUnmounted } from 'vue'
    import { useRouter } from 'vue-router'
    import Profile from '@/components/Profile.vue'

    const router = useRouter()
    const fullName = ref<string | null>(null)
    const menuOpen = ref(false)

    const updateUser = () => {
        const userData = localStorage.getItem('user')
        fullName.value = userData ? JSON.parse(userData).fullName : null
    }

    const closeMenu = () => {
        menuOpen.value = false
    }

    onMounted(() => {
        document.addEventListener('click', closeMenu)
    })

    onUnmounted(() => {
        document.removeEventListener('click', closeMenu)
    })

    updateUser()

    watch(() => router.currentRoute.value.path, () => {
        updateUser()
        menuOpen.value = false
    })
</script>

<template>
    <div>
        <nav class="navbar">
            <div class="nav-container">
                <div class="logo">Elanco Tick Tracker</div>

                <div class="links" :class="{ open: menuOpen }" @click.stop>
                    <router-link to="/" @click="menuOpen = false">Home</router-link>
                    <router-link to="/tickinfo" @click="menuOpen = false">Explore Tick Species</router-link>
                    <router-link to="/map" @click="menuOpen = false">Map</router-link>
                    <router-link to="/tickHistory" @click="menuOpen = false">Tick History</router-link>
                    <router-link to="/about" @click="menuOpen = false">About</router-link>

                    <div class="auth-mobile">
                        <Profile v-if="fullName" :fullName="fullName" />
                        <template v-else>
                            <router-link to="/signup" class="btn btn-primary" @click="menuOpen = false">Signup</router-link>
                            <router-link to="/login" class="btn btn-secondary" @click="menuOpen = false">Login</router-link>
                        </template>
                    </div>
                </div>

                <div class="auth-desktop">
                    <Profile v-if="fullName" :fullName="fullName" />
                    <template v-else>
                        <router-link to="/signup" class="btn btn-primary">Signup</router-link>
                        <router-link to="/login" class="btn btn-secondary">Login</router-link>
                    </template>
                </div>

                <button class="hamburger" @click.stop="menuOpen = !menuOpen" :aria-expanded="menuOpen" aria-label="Toggle navigation">
                    <span :class="{ open: menuOpen }"></span>
                    <span :class="{ open: menuOpen }"></span>
                    <span :class="{ open: menuOpen }"></span>
                </button>
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
        box-sizing: border-box;
        background-color: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(12px);
        border-bottom: 2px solid var(--primary-light);
        box-shadow: 0 4px 24px rgba(52, 152, 219, 0.1);
        z-index: 1000;
    }

    .nav-container {
        margin: 0 auto;
        height: var(--header-height);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 32px;
        position: relative;
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
        align-items: center;
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

    .auth-desktop {
        display: flex;
        gap: 12px;
        align-items: center;
    }

        .auth-desktop a {
            text-decoration: none;
        }

    .auth-mobile {
        display: none;
    }

    .hamburger {
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 12px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        width: 86px;
        border-radius: 10px;
        transition: background 0.2s;
    }

        .hamburger:hover {
            background: rgba(52, 152, 219, 0.08);
        }

        .hamburger span {
            display: block;
            width: 56px;
            height: 7px;
            background: var(--text);
            border-radius: 3px;
            transition: transform 0.25s ease, opacity 0.25s ease;
            transform-origin: center;
        }

            .hamburger span:nth-child(1).open {
                transform: translateY(19px) rotate(45deg);
            }

            .hamburger span:nth-child(2).open {
                opacity: 0;
            }

            .hamburger span:nth-child(3).open {
                transform: translateY(-19px) rotate(-45deg);
            }

    @media (max-width: 900px) {
        .nav-container {
            padding: 0 8px;
            height: var(--mobile-header-height);
        }

        .logo {
            font-size: 1.8rem;
        }

        .hamburger {
            display: flex;
            width: auto;
            height: 100%;
            padding: 0 16px;
            border-radius: 0;
            align-self: stretch;
            gap: 8px;
        }

            .hamburger span {
                width: 24px;
                height: 3px;
                background: var(--text);
                border-radius: 2px;
                transition: transform 0.25s ease, opacity 0.25s ease;
            }

                .hamburger span:nth-child(1).open {
                    transform: translateY(10px) rotate(45deg);
                }

                .hamburger span:nth-child(2).open {
                    opacity: 0;
                }

                .hamburger span:nth-child(3).open {
                    transform: translateY(-10px) rotate(-45deg);
                }

        .auth-desktop {
            display: none;
        }

        .links {
            flex-direction: column;
            align-items: stretch;
            gap: 0;
            position: fixed;
            top: var(--mobile-header-height);
            left: 0;
            right: 0;
            box-sizing: border-box;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(12px);
            padding: 12px 0;
            z-index: 1001;
            overflow: visible;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
            display: flex;
        }

            .links.open {
                opacity: 1;
                pointer-events: all;
            }

            .links a {
                width: 100%;
                padding: 14px 20px;
                font-size: 16px;
                font-weight: 500;
                border-radius: 0;
                border-bottom: 1px solid rgba(52, 152, 219, 0.08);
                text-align: left;
            }

                .links a:hover {
                    background: rgba(52, 152, 219, 0.08);
                }

                .links a:last-of-type {
                    border-bottom: none;
                }

        .auth-mobile {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 12px 20px;
            border-top: 1px solid rgba(52, 152, 219, 0.08);
            margin-top: auto;
        }

            .auth-mobile a {
                width: 100%;
                text-align: center;
                padding: 12px 16px !important;
                font-size: 14px !important;
                border-radius: 6px;
            }
    }
</style>