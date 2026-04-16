<script setup lang="ts">import LeafletMap from '@/components/LeafletMap.vue'
    import { ref, onMounted, onUnmounted, provide } from 'vue'

    const fontStyle = ref('Sans-Serif')
    const fontSize = ref('medium')
    const colourBlindMode = ref('none')
    const darkMode = ref(false)
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

    const fontSizes: Record<string, string> = { //saves font sizes as multipliers to be applied to a base font size in css
        small: '0.8',
        medium: '1',
        large: '1.4'
    }

    function changeFontStyle() {
        document.body.style.fontFamily = fontFamilies[fontStyle.value]
    }

    function changeFontSize() {
        document.documentElement.style.setProperty('--font-scale', fontSizes[fontSize.value])
    }

    function changeColourBlindMode() { //includes relevant colour blindness filters - doesnt have deuteranopia or protanopia as these arent as relevant given the blue colour scheme
        const root = document.documentElement
        const modes = ["none", "tritanopia", "achromatopsia"]

        modes.forEach(mode => root.classList.remove(mode))

    if (colourBlindMode.value !== "none") {
        root.classList.add(colourBlindMode.value)
        root.classList.remove('dark-mode')
        darkMode.value = false
    }
    themeVersion.value++
}

function toggleDarkMode() {
  const root = document.documentElement
  if (darkMode.value) {
    root.classList.add('dark-mode')

    colourBlindMode.value = 'none' //resets colour blind mode when dark mode is enabled
    root.classList.remove('tritanopia')
    root.classList.remove('achromatopsia')
  } else {
    root.classList.remove('dark-mode')
  }
  themeVersion.value++
  }
  </script>

<template>
    <div>
        <nav class="navbar">
            <div class="nav-container">
                <div class="logo">Elanco TickTracker - EXT 12 Version</div>

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
                    <br />
                </div>

                <div class="accessibility-menu">
                    <button class="accessibility-btn" @click="accessibilityOpen = !accessibilityOpen"> ♿ </button>

                    <div v-if="accessibilityOpen" class="accessibility-panel">
                        <div class="accessibility-header">
                            <span>Accessibility Features</span>
                            <button @click="accessibilityOpen = false">✕</button>
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
                                    <select id="colour-blind-mode" v-model="colourBlindMode" @change="changeColourBlindMode">
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
                                    <input type="checkbox" id="dark-mode" v-model="darkMode" @change="toggleDarkMode">
                                </div>
                            </div>
                        </div>
                    </div>
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
        max-width: 1500px;
        margin: 0 auto;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 24px;
        gap: 24px;
    }

    .logo {
        font-weight: 600;
        font-size: calc(24px * var(--font-scale, 1));
        color: var(--primary);
        text-shadow: 1px 1px 1px var(--shadow_color);
    }

    .links {
        display: flex;
        align-items: center;
        gap: 25px;
    }

        .links a {
            text-decoration: none;
            color: var(--text);
            font-size: calc(18px * var(--font-scale, 1));
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

    .accessibility-menu {
        position: relative;
    }

    .accessibility-btn {
        cursor: pointer;
        font-size: 22px;
        font-weight: bold;
        border: 1px solid var(--primary);
        background: var(--primary);
        color: var(--primary);
        border-radius: 4px;
    }

    .accessibility-panel {
        position: fixed;
        top: 50px;
        right: 24px;
        width: 300px;
        background: var(--bg);
        border: 1px solid var(--primary);
        z-index: 1100;
    }

    .accessibility-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: var(--primary);
        padding: 8px 12px;
        color: #fff;
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
</style>