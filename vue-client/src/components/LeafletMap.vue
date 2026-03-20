<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import L, { Marker, LeafletMouseEvent } from 'leaflet'
    import 'leaflet/dist/leaflet.css'

    const tickInfo = ref({ city: '', count: 0, speciesList: [] as string[], latestDate: '' })

    onMounted(() => {
        const map = L.map('map').setView([51.505, -0.09], 6)

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
            let speciesList: string[] = []
            let latestDate = ""

            try {
                // FETCH #1: Reverse geocode
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

                // FETCH #2: Tick sightings count
                const tickResponse = await fetch(
                    `http://localhost:5021/api/TickSightings/city/${city}`
                )
                if (tickResponse.ok) {
                    var tickData = await tickResponse.json()
                    count = tickData?.sightingsCount ?? 0
                    location = tickData?.city
                    speciesList = tickData?.species ?? []
                    latestDate = tickData?.latestDate

                }
            } catch (error) {
                console.error('API error:', error)
            }

            tickInfo.value = { city, count, speciesList, latestDate }

            // Only show tick count in popup
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
            <p style="text-align:center; padding-right:40px">Demo version</p>
            <p style="font-weight:bold; font-size:25px"> City: </p>
            <p> {{ tickInfo.city || 'No city selected' }} </p>
            <br />
            <p style="font-weight:bold; font-size:25px"> Tick sightings: </p>
            <p> {{ tickInfo.count || 'No count data' }} </p>
            <br />
            <p style="font-weight:bold; font-size:25px">Tick species:</p>
            <p> {{ tickInfo.speciesList.join(', ') || 'No species data' }} </p>
            <br />
            <p style="font-weight:bold; font-size:25px"> Latest sighting of a tick: </p>
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
        padding-left: 15px;
        background-color: #f5f5f5;
        border: 5px solid gray;  
        overflow-y: auto;
    }
</style>