<script setup lang="ts">
    import { onMounted, ref, nextTick, watch, inject } from 'vue'
    import L, { Marker, LeafletMouseEvent } from 'leaflet'
    import 'leaflet/dist/leaflet.css'
    import { ModuleRegistry, AllCommunityModule } from 'ag-charts-community'
    import { SERVER_CONFIG } from '@/config/server';

    ModuleRegistry.registerModules([AllCommunityModule])

    import { AgCharts } from 'ag-charts-vue3'

    const isSidebarOpen = ref(false)
    const isLoading = ref(false)
    const REQUEST_THROTTLE_MS = 1000
    const isChartVisible = ref(false)
    const isChart2Visible = ref(false)

    const searchQuery = ref('');
    let map: any = null;
    let currentMarker: any = null;

    const theme = inject < {
        colourBlindMode: any
        darkMode: any
        themeVersion: any
    }>('theme')

    function makeDraggable(selector: string) {
        nextTick(() => {
            const popup = document.querySelector(selector) as HTMLDivElement
            if (!popup) return

            let isDown = false
            let offsetX = 0
            let offsetY = 0

            popup.addEventListener("mousedown", (e: MouseEvent) => {
                isDown = true
                offsetX = e.clientX - popup.offsetLeft
                offsetY = e.clientY - popup.offsetTop
                popup.style.cursor = "grabbing"
            })

            document.addEventListener("mousemove", (e: MouseEvent) => {
                if (!isDown) return
                popup.style.left = `${e.clientX - offsetX}px`
                popup.style.top = `${e.clientY - offsetY}px`
            })

            document.addEventListener("mouseup", () => {
                isDown = false
                popup.style.cursor = "grab"
            })
        })
    }

    function makeResizable(selector: string) {
        nextTick(() => {
            const popup = document.querySelector(selector) as HTMLDivElement
            if (!popup) return

            const rightBar = popup.querySelector(".resize-bar-right") as HTMLDivElement
            const bottomBar = popup.querySelector(".resize-bar-bottom") as HTMLDivElement

            let resizingX = false
            let resizingY = false

            rightBar.addEventListener("mousedown", (e) => {
                e.stopPropagation()
                resizingX = true
            });

            bottomBar.addEventListener("mousedown", (e) => {
                e.stopPropagation()
                resizingY = true
            });

            document.addEventListener("mousemove", (e) => {
                if (resizingX) {
                    popup.style.width = e.clientX - popup.offsetLeft + "px"
                }
                if (resizingY) {
                    popup.style.height = e.clientY - popup.offsetTop + "px"
                }
            });

            document.addEventListener("mouseup", () => {
                resizingX = false
                resizingY = false
            });
        });
    }

    function initChart1Drag() {
        makeDraggable(".chart1-popup")
        makeResizable(".chart1-popup")
    }

    function initChart2Drag() {
        makeDraggable(".chart2-popup")
        makeResizable(".chart2-popup")
    }

    const serverURL = SERVER_CONFIG.BASE_URL;

    const tickInfo = ref({ city: '', count: 0, speciesList: [] as any[], latestDate: '' })

    const chartOptions = ref<any>({
        height: 280,
        data: [],

        series: [
            {
                type: 'pie',
                angleKey: 'count',
                sectorLabelKey: 'count',
                calloutLabelKey: 'species',
            }
        ],

        title: {
            text: 'Tick Species Distribution'
        },

        legend: {
            position: 'right'
        }
    })

    const scatterOptions = ref<any>({
        height: 280,
        title: { text: 'Tick Population Over Time' },
        legend: { position: 'right' },
        series: []
    })

    watch(
        () => theme?.themeVersion.value,
        async () => {
            await nextTick()
            if (chartOptions.value.data && chartOptions.value.data.length > 0) {
                const rootStyles = getComputedStyle(document.documentElement);
                const bgColor = rootStyles.getPropertyValue('--bg').trim();
                const textColor = rootStyles.getPropertyValue('--text').trim();

                chartOptions.value = {
                    ...chartOptions.value,
                    title: {
                        ...chartOptions.value.title,
                        color: textColor
                    },
                    legend: {
                        ...chartOptions.value.legend,
                        item: { label: { color: textColor } }
                    },
                    background: { fill: bgColor }
                }
                scatterOptions.value = {
                    ...scatterOptions.value,
                    title: {
                        ...scatterOptions.value.title,
                        color: textColor
                    },
                    legend: {
                        ...scatterOptions.value.legend,
                        item: { label: { color: textColor } }
                    },
                    axes: [
                        {
                            type: 'category',
                            position: 'bottom',
                            label: { color: textColor },
                            line: { color: textColor }
                        },
                        {
                            type: 'number',
                            position: 'left',
                            label: { color: textColor },
                            line: { color: textColor }
                        }
                    ],
                    background: { fill: bgColor }
                }
            }
        }
    )

    const closeSidebar = () => {
        isSidebarOpen.value = false
    }

    onMounted(() => {
        map = L.map('map').setView([51.505, -0.09], 6)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map)

        let lastRequestTime = 0
        makeDraggable('.search-pill-container')

        map.on('click', async (e: L.LeafletMouseEvent) => {
            const now = Date.now()
            if (now - lastRequestTime < REQUEST_THROTTLE_MS) return

            lastRequestTime = now
            isLoading.value = true

            const { lat, lng } = e.latlng

            try {
                const reverseResponse = await fetch(
                    `${serverURL}/api/map/reverse?lat=${lat}&lon=${lng}`
                )

                let city = 'Unknown location'
                if (reverseResponse.ok) {
                    const reverseData = await reverseResponse.json()
                    if (reverseData.address) {
                        city =
                            reverseData.address.city ||
                            reverseData.address.town ||
                            reverseData.address.village ||
                            city
                    }
                    if (city === 'Greater London' ||
                        city === 'City of London' ||
                        city === 'City of Westminster' ||
                        city?.includes('London')) {
                        city = 'London'
                    }
                }
                await fetchTickDataForCity(city, lat, lng);

            } catch (error) {
                console.error('API error:', error)
            } finally {
                isLoading.value = false
            }
        })
    })

    const fetchTickDataForCity = async (city: string, lat: number, lng: number) => {
        if (currentMarker) {
            map.removeLayer(currentMarker)
            chartOptions.value.data = []
            scatterOptions.value = { ...scatterOptions.value, series: [], data: undefined }
        }

        try {
            //get theme colours
            const rootStyles = getComputedStyle(document.documentElement);
            const bgColor = rootStyles.getPropertyValue('--bg').trim();
            const text = rootStyles.getPropertyValue('--text').trim();

            const [tickResponse, scatterResponse] = await Promise.all([
                fetch(`http://localhost:5021/api/TickChart/GetChartData/${city}`),
                fetch(`http://localhost:5021/api/TickLineGraph/GetLineGraphData/${city}`)
            ])

            if (tickResponse.ok) {
                const tickData = await tickResponse.json()
                const count = tickData?.sightingsCount ?? 0
                const location = tickData?.city ?? city
                const speciesList = tickData?.species ?? []
                const latestDate = tickData?.latestDate

                const chartData = Array.isArray(speciesList) && typeof speciesList[0] === 'object'
                    ? speciesList
                    : speciesList.map((s: string) => ({ species: s, count: 1 }))

                chartOptions.value = {
                    height: 280,
                    data: [...chartData],
                    series: [
                        {
                            type: 'pie',
                            angleKey: 'count',
                            sectorLabelKey: 'count',
                            calloutLabelKey: 'species',
                            calloutLabel: {
                                color: text
                            }
                        }
                    ],
                    title: {
                        text: 'Tick Species Distribution',
                        color: text
                    },
                    legend: {
                        position: 'right',
                        item: { label: { color: text } }
                    },
                    background: { fill: bgColor }
                }

                tickInfo.value = { city: location, count, speciesList, latestDate }

                const message = `You clicked in ${location}. There are ${count} recorded tick sightings here.`

                map.setView([lat, lng], 8)
                currentMarker = L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup(message)
                    .openPopup()

                isSidebarOpen.value = true
            }

            if (scatterResponse.ok) {
                const rawData: any[] = await scatterResponse.json()
                if (rawData && rawData.length > 0) {
                    const allYears = [...new Set(rawData.map((d: any) => d.year))].sort((a, b) => a - b)
                    const allSpecies = [...new Set(rawData.map((d: any) => d.species))]

                    const lookup: Record<string, Record<number, number>> = {}
                    rawData.forEach((d: any) => {
                        if (!lookup[d.species]) lookup[d.species] = {}
                        lookup[d.species][d.year] = d.count
                    })

                    const sharedData = allYears.map(year => {
                        const row: any = { year }
                        allSpecies.forEach(species => {
                            row[species] = lookup[species]?.[year] ?? 0
                        })
                        return row
                    })

                    const series = allSpecies.map(species => ({
                        type: 'line',
                        xKey: 'year',
                        yKey: species,
                        title: species,
                        marker: { enabled: true },
                    }))

                    scatterOptions.value = {
                        height: 280,
                        title: { text: 'Tick Population Over Time' },
                        legend: { position: 'bottom' },
                        data: sharedData,
                        series: series,
                        background: { fill: bgColor },
                        theme: {
                            overrides: {
                                common: {
                                    title: {
                                        color: text
                                    },
                                    legend: {
                                        item: {
                                            label: {
                                                color: text
                                            }
                                        }
                                    },
                                    axes: {
                                        number: {
                                            label: { color: text },
                                            line: { color: text }
                                        },
                                        // ADD THIS:
                                        category: {
                                            label: { color: text },
                                            line: { color: text }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Backend fetch error:', error)
        }
    };

    
    const searchPostcode = async () => {
        if (!searchQuery.value) return;
        isLoading.value = true;

        try {
            const postcodeRes = await fetch(`https://api.postcodes.io/postcodes/${searchQuery.value.trim()}`);
            if (!postcodeRes.ok) {
                alert("Invalid UK Postcode. Please try again.");
                isLoading.value = false;
                return;
            }

            const pcData = await postcodeRes.json();
            let city = pcData.result.admin_district;

            if (city === 'Greater London' || city === 'City of London' || city === 'City of Westminster' || city?.includes('London')) {
                city = 'London';
            }

            const cityRes = await fetch(`https://nominatim.openstreetmap.org/search?city=${city}&countrycodes=gb&format=json`);
            const cityData = await cityRes.json();

            let cityLat = cityData?.[0]?.lat ?? pcData.result.latitude;
            let cityLng = cityData?.[0]?.lon ?? pcData.result.longitude;

            await fetchTickDataForCity(city, cityLat, cityLng);

        } catch (error) {
            console.error('API error:', error);
        } finally {
            isLoading.value = false;
        }
    };
</script>

<template>
    <div id="map-container">
        <div id="map"></div>

        <div class="search-pill-container">
            <input type="text"
                   v-model="searchQuery"
                   placeholder="Enter Postcode (e.g. S1 1AA)"
                   class="search-pill-input"
                   @keyup.enter="searchPostcode"
                   @mousedown.stop />
            <button @click="searchPostcode"
                    :disabled="isLoading"
                    class="search-pill-btn"
                    @mousedown.stop>
                {{ isLoading ? '...' : 'Search' }}
            </button>
        </div>

        <Transition name="popup" @after-enter="initChart1Drag">
            <div v-if="isChartVisible" class="chart1-popup">
                <button class="chart-close-btn" @click="isChartVisible = false">X</button>

                <div class="popup-content">
                    <AgCharts :options="chartOptions" />
                </div>

                <div class="resize-bar-right"></div>
                <div class="resize-bar-bottom"></div>
            </div>
        </Transition>

        <Transition name="popup" @after-enter="initChart2Drag">
            <div v-if="isChart2Visible" class="chart2-popup">
                <button class="chart-close-btn" @click="isChart2Visible = false">X</button>

                <div class="popup-content">
                    <AgCharts :options="scatterOptions" />
                </div>

                <div class="resize-bar-right"></div>
                <div class="resize-bar-bottom"></div>
            </div>
        </Transition>

        <div id="sidebar" :class="{ open: isSidebarOpen }">
            <button class="sidebar-close-btn" @click="closeSidebar">✕</button>

            <div class="sidebar-header">
                <h1>Additional Info Panel</h1>
            </div>

            <button class="btn btn-secondary info-button" @click="isChartVisible = true">
                Click for tick species distribution
            </button>

            <button class="btn btn-secondary info-button" @click="isChart2Visible = true">
                Click for tick population over time
            </button>

            <div class="sidebar-content">
                <p class="info-label">City: {{ tickInfo.city || 'No city selected' }}</p>
                <p class="info-label">Total tick sightings:</p>
                <p class="nobold">{{ tickInfo.count || 'No count data' }}</p>
                <p class="info-label">Latest sighting:</p>
                <p class="nobold">{{ tickInfo.latestDate || 'No date data' }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
    #map {
        height: 100vh;
        width: 100%;
        isolation: auto;
    }

        #map :deep(.leaflet-control) {
            margin-top: calc(var(--header-height) + 10px);
        }

    #map-container {
        display: flex;
        height: 100vh;
        z-index: 0;
    }

    #sidebar {
        position: fixed;
        right: 0;
        top: var(--header-height);
        width: 25%;
        max-width: 460px;
        height: calc(100vh - var(--header-height));
        padding: 20px;
        background-color: var(--bg);
        border-left: 3px solid lightgray;
        overflow-y: auto;
        overflow-x: visible;
        transform: translateX(100%);
        transition: transform 0.65s ease;
        z-index: 1000;
        box-shadow: -4px 0 12px rgba(0, 0, 0, 0.2);
    }

        #sidebar.open {
            transform: translateX(0);
        }

    .chart-close-btn {
        position: absolute;
        top: 12px;
        left: 10px;
        width: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: none;
        font-size: 20px;
        color: var(--text);
        cursor: pointer;
        transition: all 0.2s ease;
        padding: 0;
        line-height: 1;
        z-index: 10;
    }

        .chart-close-btn:hover {
            background: var(--primary);
            color: white;
            border-radius: 4px;
        }

        .chart-close-btn:active {
            opacity: 0.8;
        }

    .chart1-hover-wrapper {
        position: static;
    }

        .chart1-hover-wrapper:hover {
            color: mediumblue;
        }

    .chart1-popup {
        position: absolute;
        top: var(--header-height);
        left: calc(76% - 450px);
        width: 450px;
        height: 330px;
        background: var(--bg);
        border: 1px solid lightgray;
        border-radius: 8px;
        z-index: 100000;
        cursor: grab;
        overflow: hidden;
    }

    .chart2-hover-wrapper {
        position: static;
    }

        .chart2-hover-wrapper:hover {
            color: mediumblue;
        }

    .chart2-popup {
        position: absolute;
        top: calc(var(--header-height) + 340px);
        left: calc(76% - 450px);
        width: 450px;
        height: 330px;
        background: var(--bg);
        border: 1px solid lightgray;
        border-radius: 8px;
        z-index: 100000;
        cursor: grab;
        overflow: hidden;
    }

    .info-button {
        font-weight: bold;
        font-size: calc(18px * var(--font-scale, 1));
        margin-top: 20px;
        margin-bottom: 8px;
    }

        .info-button:hover {
            cursor: pointer;
        }

    .info-label {
        font-weight: bold;
        font-size: calc(18px * var(--font-scale, 1));
        margin-top: 20px;
        margin-bottom: 8px;
    }

    .popup-content {
        padding: 10px;
        height: calc(100% - 20px);
        width: calc(100% - 20px);
        background: var(--bg);
    }

    .popup-enter-active,
    .popup-leave-active {
        transition: all 0.3s ease;
    }

    .popup-enter-from {
        opacity: 0;
        transform: scale(0.95);
    }

    .popup-leave-to {
        opacity: 0;
        transform: scale(0.95);
    }

    .resize-bar-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 12px;
        width: 100%;
        cursor: ns-resize;
        z-index: 1000000;
    }

    .resize-bar-right {
        position: absolute;
        top: 0;
        right: 0;
        width: 12px;
        height: 100%;
        cursor: ew-resize;
        z-index: 1000000;
    }

    .search-pill-btn {
        background-color: var(--primary, #3498db);
        color: white;
        border: none;
        border-radius: 40px;
        padding: 10px 24px;
        font-weight: bold;
        cursor: pointer;
        transition: opacity 0.2s;
    }

        .search-pill-btn:hover {
            opacity: 0.85;
        }

        .search-pill-btn:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }

    .search-pill-container {
        position: absolute;
        top: 80px;
        left: calc(50% - 200px);
        z-index: 1000;
        display: flex;
        align-items: center;
        background-color: white;
        padding: 6px 6px 6px 20px;
        border-radius: 50px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        width: 400px;
        max-width: 90%;
        cursor: grab;
    }

        .search-pill-container:active {
            cursor: grabbing;
        }

    .search-pill-input {
        flex: 1;
        border: none;
        outline: none;
        font-size: 16px;
        background: transparent;
    }

    .sidebar-close-btn {
        float: right;
        font-size: 24px;
        cursor: pointer;
        color: var(--text);
        background: none;
        border: none;
        padding: 0;
        margin-bottom: 10px;
    }

        .sidebar-close-btn:hover {
            color: var(--primary);
        }

    .sidebar-content {
        margin-top: 20px;
    }

    .sidebar-header {
        clear: both;
        text-align: center;
    }

    @media (max-width: 900px) {
        .search-pill-container {
            position: fixed;
            top: calc(var(--mobile-header-height) + 10px);
            left: 8px;
            right: 8px;
            z-index: 1000;
            display: flex;
            align-items: center;
            background-color: white;
            padding: 6px 6px 6px 12px;
            border-radius: 50px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
            width: auto;
            max-width: none;
            cursor: grab;
            gap: 6px;
        }

            .search-pill-container:active {
                cursor: grabbing;
            }

        .search-pill-input {
            flex: 1;
            border: none;
            outline: none;
            font-size: calc(14px * var(--font-scale, 1));
            background: transparent;
            min-width: 0;
        }

        .search-pill-btn {
            background-color: var(--primary, #3498db);
            color: white;
            border: none;
            border-radius: 40px;
            padding: 8px 16px;
            font-weight: bold;
            font-size: calc(14px * var(--font-scale, 1));
            cursor: pointer;
            transition: opacity 0.2s;
            white-space: nowrap;
            flex-shrink: 0;
        }

            .search-pill-btn:hover {
                opacity: 0.85;
            }

            .search-pill-btn:disabled {
                background-color: #cccccc;
                cursor: not-allowed;
            }

        #map {
            height: 100vh;
            width: 100%;
        }

            #map :deep(.leaflet-control) {
                margin-top: calc(var(--mobile-header-height) + 10px);
            }

            #map :deep(.leaflet-popup-content-wrapper) {
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            }

            #map :deep(.leaflet-popup-content) {
                font-size: calc(18px * var(--font-scale, 1));
                line-height: 1.4;
                margin: 8px;
                word-wrap: break-word;
                max-width: 200px;
            }

            #map :deep(.leaflet-popup-close-button) {
                width: 32px;
                height: 32px;
                font-size: 28px;
                line-height: 32px;
                text-align: center;
                padding: 0;
                right: -6px;
                color: var(--text);
                border-radius: 4px;
                transition: all 0.2s ease;
            }

            #map :deep(.leaflet-popup-close-button:hover) {
                background: var(--primary-dark);
                transform: scale(1.1);
            }

            #map :deep(.leaflet-popup-tip) {
                width: 12px;
                height: 12px;
            }

        #map-container {
            display: flex;
            height: 100vh;
            z-index: 0;
        }

        #sidebar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            top: auto;
            width: 100%;
            max-width: 100%;
            height: auto;
            max-height: 70vh;
            padding: 20px;
            background-color: white;
            border-left: none;
            border-top: 3px solid lightgray;
            overflow-y: auto;
            overflow-x: visible;
            transform: translateY(100%);
            transition: transform 0.65s ease;
            z-index: 1000;
            box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);
            border-radius: 16px 16px 0 0;
        }

            #sidebar.open {
                transform: translateY(0);
            }

        .chart-close-btn {
            color: var(--text);
            background: none;
            border: none;
            font-size: 20px;
            align-self: flex-end;
            padding: 0 4px;
            cursor: pointer;
            flex-shrink: 0;
        }

            .chart-close-btn:hover {
                color: var(--primary);
            }

        .chart1-popup {
            position: fixed;
            top: var(--mobile-header-height);
            right: 8px;
            left: 8px;
            width: auto;
            height: 320px;
            background: white;
            border: 1px solid lightgray;
            border-radius: 8px;
            padding: 4px 8px 8px 8px;
            z-index: 1001;
            overflow: hidden;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
            display: flex;
            flex-direction: column;
        }

            .chart1-popup :deep(.ag-chart-wrapper),
            .chart2-popup :deep(.ag-chart-wrapper) {
                padding: 0 !important;
                margin: 0 !important;
                flex: 1;
                min-height: 0;
            }

        .chart2-popup {
            position: fixed;
            top: var(--mobile-header-height);
            right: 8px;
            left: 8px;
            width: auto;
            height: 320px;
            background: white;
            border: 1px solid lightgray;
            border-radius: 8px;
            padding: 4px 8px 8px 8px;
            z-index: 1001;
            overflow: hidden;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
            display: flex;
            flex-direction: column;
        }

        .info-button {
            font-weight: bold;
            font-size: calc(14px * var(--font-scale, 1));
            margin-top: 12px;
            margin-bottom: 8px;
            width: 100%;
            padding: 12px 16px;
            text-align: center;
        }

        .info-label {
            font-weight: bold;
            font-size: calc(14px * var(--font-scale, 1));
            margin-top: 12px;
            margin-bottom: 6px;
            text-align: center;
        }

        .nobold {
            font-size: calc(14px * var(--font-scale, 1));
            margin-top: 12px;
            margin-bottom: 6px;
            text-align: center;
        }

        .sidebar-close-btn {
            float: right;
            font-size: 20px;
            cursor: pointer;
            color: var(--text);
            background: none;
            border: none;
            padding: 0;
            margin-bottom: 10px;
        }

        .sidebar-content {
            margin-top: 16px;
        }

        .sidebar-header {
            clear: both;
            text-align: center;
        }

            .sidebar-header h1 {
                font-size: calc(18px * var(--font-scale, 1));
                margin: 0;
            }
    }

    @media (prefers-reduced-motion: reduce) {
        #sidebar {
            transition: transform 0.15s ease;
        }

        .popup-enter-active,
        .popup-leave-active {
            transition: none;
        }
    }
</style>