<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import L, { Marker, LeafletMouseEvent } from 'leaflet'
    import 'leaflet/dist/leaflet.css'
    import { ModuleRegistry, AllCommunityModule } from 'ag-charts-community'

    ModuleRegistry.registerModules([AllCommunityModule])

    import { AgCharts } from 'ag-charts-vue3';

    const isSidebarOpen = ref(false)
    const isLoading = ref(false)
    const REQUEST_THROTTLE_MS = 1000
    const isChartVisible = ref(false)
    const isChart2Visible = ref(false)

    const tickInfo = ref({ city: '', count: 0, speciesList: [] as any[], latestDate: '' })

    const chartOptions = ref<any>({
        data: [],

        series: [
            {
                type: 'pie',
                angleKey: 'count',
                calloutLabelKey: 'species',
                sectorLabelKey: 'count',
            }
        ],

        title: {
            text: 'Tick Species Distribution'
        },

        legend: {
            position: 'bottom'
        }
    })


    const scatterOptions = ref<any>({
        title: { text: 'Tick Population Over Time' },
        legend: { position: 'bottom' },
        series: []
    })

    const closeSidebar = () => {
        isSidebarOpen.value = false
    }

    onMounted(() => {
        const map = L.map('map').setView([51.505, -0.09], 6)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map)

        let currentMarker: L.Marker | null = null
        let lastRequestTime = 0

        map.on('click', async (e: L.LeafletMouseEvent) => {
            const now = Date.now()
            if (now - lastRequestTime < REQUEST_THROTTLE_MS) return

            lastRequestTime = now
            isLoading.value = true

            const { lat, lng } = e.latlng

            if (currentMarker) {
                map.removeLayer(currentMarker)
                chartOptions.value.data = []
                scatterOptions.value = { ...scatterOptions.value, series: [], data: undefined }
            }

            let city = 'Unknown location'
            let count = 0
            let location = ""
            let speciesList: any[] = []
            let latestDate = ""

            try {
                const reverseResponse = await fetch(
                    `http://localhost:5021/api/map/reverse?lat=${lat}&lon=${lng}`
                )

                if (reverseResponse.ok) {
                    const reverseData = await reverseResponse.json()
                    console.log(reverseData);
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

                const [tickResponse, scatterResponse] = await Promise.all([
                    fetch(`http://localhost:5021/api/TickChart/GetChartData/${city}`),
                    fetch(`http://localhost:5021/api/TickLineGraph/GetLineGraphData/${city}`)
                ])

                if (tickResponse.ok) {
                    const tickData = await tickResponse.json()

                    count = tickData?.sightingsCount ?? 0
                    location = tickData?.city
                    speciesList = tickData?.species ?? []
                    latestDate = tickData?.latestDate

                    console.log('Chart data being set:', JSON.stringify(speciesList))

                    const chartData = Array.isArray(speciesList) && typeof speciesList[0] === 'object'
                        ? speciesList
                        : speciesList.map((s: string) => ({ species: s, count: 1 }))

                    chartOptions.value = {
                        ...chartOptions.value,
                        data: [...chartData]
                    }

                    tickInfo.value = { city, count, speciesList, latestDate }

                    const message = `You clicked in ${location}. There are ${count} recorded tick sightings here.`

                    currentMarker = L.marker([lat, lng])
                        .addTo(map)
                        .bindPopup(message)
                        .openPopup()

                    isSidebarOpen.value = true
                }

                if (scatterResponse.ok) {
                    const rawData: any[] = await scatterResponse.json()

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
                        marker: { enabled: true }
                    }))

                    scatterOptions.value = {
                        title: { text: 'Tick Population Over Time' },
                        legend: { position: 'bottom' },
                        data: sharedData,
                        series: series
                    }
                }


            } catch (error) {
                console.error('API error:', error)
            } finally {
                isLoading.value = false
            }
        })
    })
</script>

<template>
    <div id="map-container">
        <div id="map"></div>

        <Transition name="popup">
            <div v-if="isChartVisible" class="chart1-popup">
                <button class="chart-close-btn" @click="isChartVisible = false">X</button>
                <AgCharts :options="chartOptions" />
            </div>
        </Transition>

        <Transition name="popup">
            <div v-if="isChart2Visible" class="chart2-popup">
                <button class="chart-close-btn" @click="isChart2Visible = false">X</button>
                <AgCharts :options="scatterOptions" />
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
                Click for tick something idk
            </button>


            <div class="sidebar-content">
                <p class="info-label">City: {{ tickInfo.city || 'No city selected' }}</p>
                <p class="info-label">Total tick sightings:</p>
                <p>{{ tickInfo.count || 'No count data' }}</p>
                <p class="info-label">Latest sighting:</p>
                <p>{{ tickInfo.latestDate || 'No date data' }}</p>
            </div>

        </div>

    </div>

</template>

<style scoped>
    #map-container {
        display: flex;
        height: 100vh;
        z-index: 0;
    }

    #map {
        height: 100vh;
        width: 100%;
        isolation: auto;
    }

    #sidebar {
        position: fixed;
        right: 0;
        top: var(--header-height);
        width: 25%;
        max-width: 460px;
        height: calc(100vh - var(--header-height));
        padding: 20px;
        background-color: white;
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

    .chart-close-btn {
        color: var(--text); 
        background: none; 
        border: none;
        font-size: 18px;
    }
        .chart-close-btn:hover {
            color: var(--primary);
            cursor: pointer;
        }
    

    .sidebar-header {
        clear: both;
        text-align: center;
    }

    .sidebar-content {
        margin-top: 20px;
    }

    .info-label {
        font-weight: bold;
        font-size: 18px;
        margin-top: 20px;
        margin-bottom: 8px;
    }

    .info-button {
        font-weight: bold;
        font-size: 18px;
        margin-top: 20px;
        margin-bottom: 8px;
    }

    .info-button:hover {
        cursor: pointer;
    }

    .chart1-hover-wrapper {
        position: static; 
    }

        .chart1-hover-wrapper:hover {
            color: mediumblue;
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

    .chart1-popup {
        position: fixed;
        top: var(--header-height);
        right: 23.98%;
        width: 450px;
        background: white;
        border: 1px solid lightgray;
        border-radius: 8px;
        padding: 10px;
        padding-top: 5px;
        z-index: 100000;
    }

    .chart2-hover-wrapper {
        position: static;
    }

        .chart2-hover-wrapper:hover {
            color: mediumblue;
        }

    .chart2-popup {
        position: fixed;
        top: 56.7%;
        right: 23.98%;
        width: 450px;
        height: auto;
        background: white;
        border: 1px solid lightgray;
        border-radius: 8px;
        padding: 10px;
        z-index: 100000;
    }
</style>