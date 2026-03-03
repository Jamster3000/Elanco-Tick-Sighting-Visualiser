<script setup>
    import { onMounted } from 'vue'

    onMounted(() => {
        const map = L.map('map').setView([51.505, -0.09], 13)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map)

        let currentMarker = null

        map.on('click', async (e) => {const {lat,lng} = e.latlng

            if (currentMarker) {
                map.removeLayer(currentMarker)
            }

            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            )

            const data = await response.json()

            const city =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                "this place does NOT exist in the api, how did you manage this?"

            let message = ""

            message = `You clicked in ${city}`

               currentMarker = L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup(message)
                    .openPopup()
            
        })
    })
</script>

<template>
  <div id="map"></div>
</template>

<style scoped>
    #map {
        height: 90vh;
        width: 100%;
    }
</style>