<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import L, { Marker, LeafletMouseEvent } from 'leaflet'
    import 'leaflet/dist/leaflet.css'
    import { ModuleRegistry, AllCommunityModule } from 'ag-charts-community'

    ModuleRegistry.registerModules([AllCommunityModule])

    import { AgCharts } from 'ag-charts-vue3';

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

    onMounted(() => {
        const map = L.map('map').setView([51.505, -0.09], 13)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map)

        let currentMarker: L.Marker | null = null

        map.on('click', async (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng

            if (currentMarker) {
                map.removeLayer(currentMarker)
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
                    if (reverseData.address) {
                        city =
                            reverseData.address.city ||
                            reverseData.address.town ||
                            reverseData.address.village ||
                            city
                    }
                    if (city === 'Greater London' || city === 'City of London') city = 'London'
                }

                const tickResponse = await fetch(
                    `http://localhost:5021/api/TickChart/GetChartData/${city}`
                )
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
                }

            } catch (error) {
                console.error('API error:', error)
            }

            tickInfo.value = { city, count, speciesList, latestDate }

            const message = `You clicked in ${location}. There are ${count} recorded tick sightings here.`

            currentMarker = L.marker([lat, lng])
                .addTo(map)
                .bindPopup(message)
                .openPopup()
        })
    })
</script>

<template>
    <div id="map-container">
        <div id="map"></div>

        <div id="sidebar">
            <h1 style="text-align:center;">Additional Info Panel</h1>


            <p style="font-weight:bold; font-size:25px"> City: {{ tickInfo.city || 'No city selected' }} </p>

            <div style="height: 300px; margin-top: 20px;">
                <AgCharts :options="chartOptions" />
            </div>

            <p style="font-weight:bold; font-size:25px"> Total tick sightings: </p>
            <p> {{ tickInfo.count || 'No count data' }} </p>

            <p style="font-weight:bold; font-size:25px"> Latest sighting: </p>
            <p>{{tickInfo.latestDate || 'No date data'}}</p>

        </div>
    </div>
</template>

<style scoped>
    #map-container {
        display: flex;
        height: 100vh;
    }

    #map {
        height: 100vh;
        width: 80%;
    }

    #sidebar {
        flex: 1;
        padding-top: 60px;
        padding-left: 1px;
        background-color: white;
        border: 3px solid lightgray;
        overflow-y: auto;
    }
</style>