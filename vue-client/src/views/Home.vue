
<style>

    h2{
    text-align:center;
    }

    p{
    padding-left:40px;
    font-size: 20px;
    }
</style>
<template> 

    <h2 style="font-size: 40px; padding-top: 100px;">Welcome to Pasa's demo version of the Elanco Tick Finder</h2>
    <h2>Go to "Map" to see the working demo</h2>
    <p style=" font-size: 25px; font-weight: bold;">Current Architecture:</p>
    <p>
        User clicks map =>
    </p>
    <p>
        Leaflet gives latitude + longitude (important coodinates for our reverse geocoding)=>
    </p>
    <p>
        Vue fetch → /api/map/reverse (goes to controller which calls the api so that it's CORS compatible)=>
    </p>
    <p>
        ASP.NET MapController =>
    </p>
    <p>
        Nominatim reverse geocoding (Nominatim is the service we use, which returns a suitable JSON)=>
    </p>
    <p>
        City name returned =>
    </p>
    <p>
        Vue fetch → /api/TickSightings/city/{city} (goes to controller which fetches our DB to find suitable matches for displaying tick data) =>
    </p>
    <p>
        Database query (using .NET Entity Framework) =>
    </p>
    <p>
        JSON relating to tick data is returned =>
    </p>
    <p>
        Popup displaying count and city on map
    </p>

</template>