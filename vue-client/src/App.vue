<script setup lang="ts">
    import { ref, onMounted, onUnmounted, provide, watch } from 'vue'
    import { useRouter } from 'vue-router'
    import Profile from '@/components/Profile.vue'

    const router = useRouter()
    const fullName = ref<string | null>(null)
    const menuOpen = ref(false)

    const updateUser = () => {
        const userData = localStorage.getItem('user')
        fullName.value = userData ? JSON.parse(userData).fullName : null
    }

    const closeMenu = (event: MouseEvent) => {
        const accessibilityMenu = document.querySelector(".accessibility-menu")
        if (accessibilityMenu && accessibilityMenu.contains(event.target as Node)) {
            return //don't hide the menu/popup/panel when clicked inside of
        }

        menuOpen.value = false
        accessibilityOpen.value = false
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

    const fontStyle = ref(loadSettings('fontStyle', 'Sans-Serif'))
    const fontSize = ref(loadSettings('fontSize', 'medium'))
    const colourBlindMode = ref(loadSettings('colourBlindMode', 'none'))
    const darkMode = ref(loadSettings('darkMode', false))

    const accessibilityOpen = ref(false)
    const themeVersion = ref(0) //increments every time theme is changed - had problems with returning chart grid and axis in tickhistory to default styling when dark mode filters are removed, so this sidesteps that, giving the watcher something that is definitely different every time

    provide('theme', { //allows all pages to add watchers to these for theme changes
        colourBlindMode,
        darkMode,
        themeVersion,
    })


    const fontFamilies: Record<string, string> = {
        'Sans-Serif': 'Arial, sans-serif',
        'Serif': 'Arno, serif',
        'Dyslexia-friendly': 'OpenDyslexic, sans-serif'
    }

    const fontSizes: Record<string, number> = { //saves font sizes as multipliers to be applied to a base font size in css
        small: 0.8,
        medium: 1,
        large: 1.4
    }

    const fontFamilyMultipliers: Record<string, number> = { //unique multipliers to allow fonts with slightly different sized to be scaled porperly
        'Sans-Serif': 1,
        'Serif': 1.12,
        'Dyslexia-friendly': 0.92
    }

    
    function changeFontStyle() {
        applyCombinedFontSettings()
    }
    function changeFontSize() {
        applyCombinedFontSettings()
    }
    function applyCombinedFontSettings() {
        const baseMultipliers = fontSizes[fontSize.value]
        const familyMultiplier = fontFamilyMultipliers[fontStyle.value]

        const finalScale = baseMultipliers * familyMultiplier

        document.documentElement.style.setProperty('--font-scale', finalScale.toString())
        document.body.style.fontFamily = fontFamilies[fontStyle.value]
    }


    function changeTheme() {
        const root = document.documentElement
        const modes = ["none", "tritanopia", "achromatopsia", "dark-mode", "dark-tritanopia", "dark-achromatopsia"]

        if (!darkMode.value && colourBlindMode.value == "none") {
            modes.forEach(mode => root.classList.remove(mode))
            root.classList.add()
        }
        else if (darkMode.value && colourBlindMode.value == "none") {
            modes.forEach(mode => root.classList.remove(mode))
            root.classList.add('dark-mode')
        }
        else if (!darkMode.value && colourBlindMode.value !== "none") {
            modes.forEach(mode => root.classList.remove(mode))
            switch (colourBlindMode.value) {
                case "tritanopia":
                    root.classList.add('tritanopia')
                    break
                case "achromatopsia":
                    root.classList.add('achromatopsia')
                    break
            }
        }
        else if (darkMode.value && colourBlindMode.value !== "none") {
            modes.forEach(mode => root.classList.remove(mode))

            switch (colourBlindMode.value) {
                case "tritanopia":
                    root.classList.add('dark-tritanopia')
                    break
                case "achromatopsia":
                    root.classList.add('dark-achromatopsia')
                    break
            }
        }
        themeVersion.value++
    }

    function loadSettings<T>(key: string, fallback: T): T {
        const storedSettings = localStorage.getItem(key)
        return storedSettings ? JSON.parse(storedSettings) as T : fallback
    }

    watch(fontStyle, (val) => {
        localStorage.setItem('fontStyle', JSON.stringify(val))
        applyCombinedFontSettings()
    })

    watch(fontSize, (val) => {
        localStorage.setItem('fontSize', JSON.stringify(val))
        applyCombinedFontSettings()
    })

    watch(colourBlindMode, (val) => {
        localStorage.setItem('colourBlindMode', JSON.stringify(val))
        changeTheme()
    })

    watch(darkMode, (val) => {
        localStorage.setItem('darkMode', JSON.stringify(val))
        changeTheme()
    })

    onMounted(() => {
        applyCombinedFontSettings()
        changeTheme()
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

                <div class="accessibility-menu">
                    <button class="accessibility-btn" @click.stop="accessibilityOpen = !accessibilityOpen"><svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" class="bi bi-universal-access-circle" viewBox="0 0 16 16"><path d="M8 4.143A1.071 1.071 0 1 0 8 2a1.071 1.071 0 0 0 0 2.143m-4.668 1.47 3.24.316v2.5l-.323 4.585A.383.383 0 0 0 7 13.14l.826-4.017c.045-.18.301-.18.346 0L9 13.139a.383.383 0 0 0 .752-.125L9.43 8.43v-2.5l3.239-.316a.38.38 0 0 0-.047-.756H3.379a.38.38 0 0 0-.047.756Z" /><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8" /></svg></button>
                    
                    <Transition name="popup-slide">
                        <div v-if="accessibilityOpen" class="accessibility-panel">
                            <div class="accessibility-header">
                                <span>Accessibility Features</span>
                                <button class="btn btn-close" @click="accessibilityOpen = false">✕</button>
                            </div>

                            <div class="accessibility-body">
                                <div class="control-group">
                                    <div class="control">
                                        <label for="font-style">Font Style:</label>
                                        <select id="font-style" v-model="fontStyle" @change="changeFontStyle">
                                            <option value="Sans-Serif">Sans-Serif</option>
                                            <option value="Serif">Serif</option>
                                            <option value="Dyslexia-friendly">Dyslexia-friendly</option>
                                        </select>
                                    </div>

                                    <div class="control">
                                        <label for="font-size">Font Size:</label>
                                        <select id="font-size" v-model="fontSize" @change="changeFontSize">
                                            <option value="small">Small</option>
                                            <option value="medium">Medium</option>
                                            <option value="large">Large</option>
                                        </select>
                                    </div>

                                    <div class="control">
                                        <label for="colour-blind-mode">Colour Blind Mode:</label>
                                        <select id="colour-blind-mode" v-model="colourBlindMode" @change="changeTheme">
                                            <option value="tritanopia">Tritanopia</option>
                                            <option value="achromatopsia">Achromatopsia</option>
                                            <option value="none">None</option>
                                        </select>
                                    </div>
                                </div>

                                <hr />

                                <div class="control-group">
                                    <div class="control">
                                        <label for="dark-mode">Dark Mode:</label>
                                        <input type="checkbox" id="dark-mode" v-model="darkMode" @change="changeTheme">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
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
        background-color: var(--bg);
        backdrop-filter: blur(12px);
        border-bottom: 2px solid var(--primary-light);
        box-shadow: 0 4px 24px rgba(52, 152, 219, 0.1);
        z-index: 1000;
    }

    .nav-container {
        max-width: 1500px;
        margin: 0 auto;
        height: var(--header-height);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 32px;
        position: relative;
    }

    .logo {
        font-weight: 600;
        font-size: calc(24px * var(--font-scale, 1));
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
            font-size: calc(18px * var(--font-scale, 1));
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

    .popup-slide-enter-active,
    .popup-slide-leave-active {
        transition: all 0.6s ease;
    }

    .popup-slide-enter-from {
        opacity: 0;
        transform: translateY(-10px);
    }

    .popup-slide-leave-to {
        opacity: 0;
        transform: translateY(-10px);
    }

    .btn-close {
        background: transparent;
        border: none;
        color: var(--bg);
        font-size: 20px;
        padding: 4px 8px;
        cursor: pointer;
        line-height: 1;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 28px;
        min-height: 28px;
        border-radius: 4px;
    }

        .btn-close:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }

        .btn-close:active {
            background-color: rgba(255, 255, 255, 0.1);
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

    /*==========
        Accessability CSS styling
    ==========*/

    .accessibility-menu {
        position: relative;
        z-index: 1100000;
    }

    .accessibility-btn {
        cursor: pointer;
        font-size: 32px;
        font-weight: bold;
        border: 1px solid var(--primary);
        background: var(--primary);
        color: var(--bg);
        border-radius: 4px;
        padding: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        transition: background-color 0.3s ease;
    }

        .accessibility-btn:hover {
            background-color: var(--primary-dark);
            border-color: var(--primary-dark);
            color: var(--bg);
        }

    .accessibility-panel {
        position: fixed;
        top: 50px;
        right: 24px;
        width: 300px;
        background: var(--bg);
        border: 1px solid var(--primary);
        z-index: 1100000;
    }

    .accessibility-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: var(--primary);
        padding: 8px 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        color: var(--bg);
    }

    .accessibility-body {
        padding: 12px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .control-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .control {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 6px;
    }

        .control label {
            white-space: nowrap;
            font-size: 16px;
        }

        .control select,
        .control input[type="checkbox"] {
            height: 27px;
        }

    @media (max-width: 900px) {
        .nav-container {
            padding: 0 8px;
            height: var(--mobile-header-height);
        }

        .logo {
            font-size: calc(28px * var(--font-scale, 1));
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
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            border-radius: 0 0 12px 12px;
        }

            .links.open {
                opacity: 1;
                pointer-events: all;
            }

            .links a {
                width: 100%;
                padding: 14px 20px;
                font-size: calc(16px * var(--font-scale, 1));
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
                font-size: calc(14px * var(--font-scale, 1)) !important;
                border-radius: 6px;
            }

        .accessibility-panel {
            width: 100%;
            right: 0;
            top: var(--mobile-header-height);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            border-radius: 0 0 12px 12px;
            max-height: 80vh;
            overflow-y: auto;
        }

        .accessibility-header {
            padding: 16px;
            justify-content: center;
            position: relative;
        }

        .accessibility-header span {
            font-size: calc(26px * var(--font-scale, 1));
        }

        .btn-close {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
        }

        .accessibility-body {
            gap: 20px;
        }

        .control-group {
            gap: 20px;
            padding-right: 10px;
        }

        .control label {
            font-size: calc(22px * var(--font-scale, 1));
        }

        .control select,
        .control input[type="checkbox"] {
            height: 42px;
        }

        .control select {
            font-size: calc(20px * var(--font-scale, 1));
        }

        .control input[type=checkbox] {
            width: 40px;
        }
    }


    @media (prefers-reduced-motion: reduce) {
        .popup-slide-enter-active,
        .popup-slide-leave-active {
            transition: none !important;
        }
    }
</style>