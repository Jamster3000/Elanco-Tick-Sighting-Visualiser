<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue'
    import { SERVER_CONFIG } from '@/config/server';

    interface Species {
        SPECIES_ID: number
        SPECIES: string
        LATIN: string
        BIO_CHARACTERISTIC: string
        TYPICAL_HABITAT: string
        HEALTH_RISKS: string
        IMAGE?: string
    }

    const species = ref<Species[]>([])
    const currentIndex = ref(0)
    const isLightboxOpen = ref(false)
    const isLightboxClosing = ref(false)

    const serverURL = SERVER_CONFIG.BASE_URL;

    const fetchSpecies = async () => {
        try {
            const response = await fetch(`${serverURL}/api/tick/species`)
            const data = await response.json()

            species.value = data.map((s: Species) => ({
                ...s,
                IMAGE: `${serverURL}${s.IMAGE}`
            }))
            console.log(species.value)
        } catch (error) {
            console.error("Failed to fetch tick data")
        }
    }

    onMounted(() => {
        fetchSpecies()
        window.addEventListener("keydown", handleKeyPress)
    })

    onUnmounted(() => {
        window.removeEventListener("keydown", handleKeyPress)
    })

    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key == "ArrowLeft" || event.key == "a" || event.key == "A") {
            previousSpecies()
        } else if (event.key == "ArrowRight" || event.key == "d" || event.key == "D") {
            nextSpecies()
        }
    }

    const direction = ref("forward")

    const nextSpecies = () => {

        direction.value = "forward";

        if (currentIndex.value < species.value.length - 1) {
            currentIndex.value++
        } else {
            currentIndex.value = 0
        }
    }

    const previousSpecies = () => {

        direction.value = "backward";

        if (currentIndex.value > 0) {
            currentIndex.value--
        } else {
            currentIndex.value = species.value.length - 1
        }
    }

    const showLightbox = () => {
        isLightboxOpen.value = true
    }

    const closeLightbox = () => {
        isLightboxClosing.value = true
        setTimeout(() => {
            isLightboxOpen.value = false
            isLightboxClosing.value = false
        }, 300)
    }
</script>

<template>
    <h1 class="title">Tick Information</h1>
    <div class="species-container">
        <div class="nav-buttons-wrapper">
            <button class="nav-arrow nav-prev" title="Press `A` or Left arrow key" @click="previousSpecies">
                <svg xmlns="http://www.w3.org/2000/svg" width="66" height="66" fill="currentColor" class="bi bi-caret-left-fill" viewBox="0 0 16 16">
                    <path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                </svg>
            </button>
            <button class="nav-arrow nav-next" title="Press `D` or Right arrow key" @click="nextSpecies">
                <svg xmlns="http://www.w3.org/2000/svg" width="66" height="66" fill="currentColor" class="bi bi-caret-right-fill" viewBox="0 0 16 16">
                    <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                </svg>
            </button>
        </div>
        <transition :name ="direction === 'forward' ? 'slide-left' : 'slide-right'" mode="out-in">
            <div class="card card-center" :key = "currentIndex" v-if="species.length > 0">
                <h2>{{ species[currentIndex].SPECIES }}</h2>
                <p>{{ species[currentIndex].LATIN }}</p>
                <img :src="species[currentIndex].IMAGE" :alt="species[currentIndex].SPECIES" @click="showLightbox" />

                <div class="info-columns">
                    <div class="info-column">
                        <p class="Sub-Title">Bio Characteristics</p>
                        <p class="Information">{{ species[currentIndex].BIO_CHARACTERISTIC }}</p>
                    </div>
                    <div class="info-column">
                        <p class="Sub-Title">Typical Habitat</p>
                        <p class="Information">{{ species[currentIndex].TYPICAL_HABITAT }}</p>
                    </div>
                    <div class="info-column">
                        <p class="Sub-Title">Health Risks</p>
                        <p class="Information">{{ species[currentIndex].HEALTH_RISKS }}</p>
                     </div>
                </div>

        <p class="current">{{ currentIndex + 1 }} / {{ species.length }}</p>
        </div>
        </transition>
    </div>

    <div class="lightbox" :class="{ 'fade-out': isLightboxClosing }" v-if="isLightboxOpen" @click="closeLightbox">
        <div class="lightbox-content" @click.stop>
            <button class="lightbox-close" @click="closeLightbox">×</button>
            <img :src="species[currentIndex].IMAGE" :alt="species[currentIndex].SPECIES" />
        </div>
    </div>
</template>

<style scoped>

    .slide-left-enter-active, .slide-left-leave-active {
        transition: all 0.3s ease;
    }

    .slide-left-enter-from{
        opacity: 0;
        transform: translateX(20px);
    }

    .slide-left-enter-to {
        opacity: 1;
        transform: translateX(0px);
    }

    .slide-left-leave-from{
        opacity: 1;
        transform: translateX(0px);
    }

    .slide-left-leave-to{
        opacity: 0;
        transform: translateX(-20px);
    }

    .slide-right-enter-active, .slide-right-leave-active {
        transition: all 0.3s ease;
    }

    .slide-right-enter-from {
        opacity: 0;
        transform: translateX(-20px);
    }

    .slide-right-enter-to {
        opacity: 1;
        transform: translateX(0px);
    }

    .slide-right-leave-from {
        opacity: 1;
        transform: translateX(0px);
    }

    .slide-right-leave-to {
        opacity: 0;
        transform: translateX(20px);
    }

    h1.title {
        text-align: center;
        padding-top: var(--top-padding);
        text-decoration: underline;
        font-size: calc(32px * var(--font-scale, 1));
    }

    h1.tick-name {
        text-decoration: underline;
        font-size: calc(32px * var(--font-scale, 1));
    }

    h2.tick-name {
        text-decoration: underline;
        font-size: calc(24px * var(--font-scale, 1));
    }

    h2 {
        font-size: calc(24px * var(--font-scale, 1));
        text-decoration: underline;
        margin: 5px 0 10px 0;
        text-align: center;
    }

    .card {
        margin-top: 0;
        display: flex;
        flex-direction: column;
        width: 700px;
        flex: 0 0 900px;
        height: 100%;
        box-sizing: border-box;
        padding: 15px 20px;
        order: 2;
    }

    .species-container {
        display: flex;
        gap: 0;
        align-items: stretch;
        justify-content: center;
        padding: 20px;
        width: 100%;
        height: calc(90vh - var(--header-height));
    }

    .nav-buttons-wrapper {
        display: contents;
    }

    .species-container img {
        width: 180px;
        height: 180px;
        object-fit: contain;
        border: 2px solid var(--primary);
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
        margin: 10px auto;
        transition: all 0.3s ease;
    }

        .species-container img:hover {
            box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
            transform: scale(1.05);
            cursor: pointer;
        }

    .nav-arrow {
        width: 50px;
        flex: 0 0 50px;
        background: var(--bg);
        border: 2px solid var(--primary);
        cursor: pointer;
        font-size: calc(40px * var(--font-scale, 1));
        color: var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        height: 20vh;
        align-self: center;
    }

        .nav-arrow:hover {
            background: var(--primary);
            color: var(--bg);
        }

    .nav-prev {
        border-radius: 8px 0 0 8px;
        order: 1;
    }

    .nav-next {
        border-radius: 0 8px 8px 0;
        order: 3;
    }

    .info-columns {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 15px;
        width: 100%;
        flex: 1;
    }

    .info-column {
        display: flex;
        flex-direction: column;
        padding: 12px;
        border-radius: 8px;
        background: var(--bg);
        overflow-y: auto;
    }

    .Sub-Title {
        text-decoration: underline;
        font-size: calc(20px * var(--font-scale, 1));
        font-weight: bold;
        margin-bottom: 10px;
        color: var(--primary);
        text-align: center;
    }

    .Information {
        font-size: calc(18px * var(--font-scale, 1));
        line-height: 1.5;
        text-align: center;
    }

    .current {
        text-align: center;
        font-size: calc(22px * var(--font-scale, 1));
        margin-top: 8px;
        color: var(--text);
    }

    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--text);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    }

    .lightbox-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
    }

        .lightbox-content img {
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 8px;
        }

    .lightbox.fade-out {
        animation: fadeOut 0.3s ease forwards;
    }

    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: none;
        border: none;
        color: var(--bg));
        font-size: calc(40px * var(--font-scale, 1));
        cursor: pointer;
        transition: color 0.3s;
    }

        .lightbox-close:hover {
            color: var(--primary);
        }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }

        to {
            opacity: 0;
        }
    }

    @media (max-width: 900px) {
        h1 {
            text-align: center;
            padding-top: var(--mobile-header-height);
            font-size: 20px;
            text-decoration: underline;
            margin-bottom: 0px;
        }

        h2 {
            font-size: 18px;
            text-decoration: underline;
            margin: 0px 0 1px 0;
            text-align: center;
        }

        .card {
            margin-top: 0;
            display: flex;
            flex-direction: column;
            width: 100%;
            flex: 0 0 auto;
            height: auto;
            box-sizing: border-box;
            padding: 12px 16px;
            order: unset;
        }

        .species-container {
            display: flex;
            flex-direction: column;
            gap: 6px;
            width: 100%;
            padding: 12px;
            box-sizing: border-box;
            height: auto;
            align-items: center;
        }

        .nav-buttons-wrapper {
            display: flex;
            gap: 12px;
            justify-content: center;
            width: 100%;
            order: unset;
        }

        .nav-arrow {
            width: 44px;
            height: 44px;
            background: white;
            border: 2px solid var(--primary);
            cursor: pointer;
            font-size: 28px;
            color: var(--primary);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
            padding: 8px;
            flex: 0 0 44px;
        }

            .nav-arrow:hover {
                background: var(--primary);
                color: white;
            }

            .nav-arrow svg {
                width: 28px;
                height: 28px;
            }

        .nav-prev {
            border-radius: 8px;
            order: unset;
        }

        .nav-next {
            border-radius: 8px;
            order: unset;
        }

        .species-container img {
            width: 120px;
            height: 120px;
            object-fit: contain;
            border: 2px solid var(--primary);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
            margin: 8px auto;
            transition: all 0.3s ease;
        }

            .species-container img:hover {
                box-shadow: 0 8px 20px rgba(52, 152, 219, 0.4);
                transform: scale(1.05);
                cursor: pointer;
            }

        .info-columns {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
            width: 100%;
            flex: 1;
        }

        .info-column {
            display: flex;
            flex-direction: column;
            padding: 12px;
            border-radius: 8px;
            background: rgba(52, 152, 219, 0.05);
            overflow-y: auto;
            max-height: 200px;
        }

        .Sub-Title {
            text-decoration: underline;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 8px;
            color: var(--primary);
            text-align: center;
        }

        .Information {
            font-size: 13px;
            line-height: 1.4;
            text-align: center;
        }

        .current {
            text-align: center;
            font-size: 14px;
            margin-top: 8px;
            color: var(--text);
        }

        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        }

        .lightbox-content {
            position: relative;
            max-width: 95vw;
            max-height: 80vh;
        }

            .lightbox-content img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 8px;
            }

        .lightbox-close {
            position: absolute;
            top: -35px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 32px;
            cursor: pointer;
            transition: color 0.3s;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .slide-left-enter-active,
        .slide-left-leave-active,
        .slide-right-enter-active,
        .slide-right-leave-active {
            transition: none !important;
        }

        .nav-arrow {
            transition: all 0.1s;
        }

        .lightbox {
            animation: fadeIn 0.1s ease;
        }

        .lightbox.fade-out {
            animation: fadeOut 0.1s ease forwards;
        }

        .lightbox-close {
            transition: color 0.1s;
        }
    }
</style>