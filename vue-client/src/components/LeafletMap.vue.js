import { onMounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-charts-community';
ModuleRegistry.registerModules([AllCommunityModule]);
import { AgCharts } from 'ag-charts-vue3';
const isSidebarOpen = ref(false);
const isLoading = ref(false);
const REQUEST_THROTTLE_MS = 1000;
const isChartVisible = ref(false);
const isChart2Visible = ref(false);
const tickInfo = ref({ city: '', count: 0, speciesList: [], latestDate: '' });
const chartOptions = ref({
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
});
const scatterOptions = ref({
    title: { text: 'Tick Population Over Time' },
    legend: { position: 'bottom' },
    series: []
});
const closeSidebar = () => {
    isSidebarOpen.value = false;
};
onMounted(() => {
    const map = L.map('map').setView([51.505, -0.09], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    let currentMarker = null;
    let lastRequestTime = 0;
    map.on('click', async (e) => {
        const now = Date.now();
        if (now - lastRequestTime < REQUEST_THROTTLE_MS)
            return;
        lastRequestTime = now;
        isLoading.value = true;
        const { lat, lng } = e.latlng;
        if (currentMarker) {
            map.removeLayer(currentMarker);
            chartOptions.value.data = [];
            scatterOptions.value = { ...scatterOptions.value, series: [], data: undefined };
        }
        let city = 'Unknown location';
        let count = 0;
        let location = "";
        let speciesList = [];
        let latestDate = "";
        try {
            const reverseResponse = await fetch(`http://localhost:5021/api/map/reverse?lat=${lat}&lon=${lng}`);
            if (reverseResponse.ok) {
                const reverseData = await reverseResponse.json();
                console.log(reverseData);
                if (reverseData.address) {
                    city =
                        reverseData.address.city ||
                            reverseData.address.town ||
                            reverseData.address.village ||
                            city;
                }
                if (city === 'Greater London' ||
                    city === 'City of London' ||
                    city === 'City of Westminster' ||
                    city?.includes('London')) {
                    city = 'London';
                }
            }
            const [tickResponse, scatterResponse] = await Promise.all([
                fetch(`http://localhost:5021/api/TickChart/GetChartData/${city}`),
                fetch(`http://localhost:5021/api/TickLineGraph/GetLineGraphData/${city}`)
            ]);
            if (tickResponse.ok) {
                const tickData = await tickResponse.json();
                count = tickData?.sightingsCount ?? 0;
                location = tickData?.city;
                speciesList = tickData?.species ?? [];
                latestDate = tickData?.latestDate;
                console.log('Chart data being set:', JSON.stringify(speciesList));
                const chartData = Array.isArray(speciesList) && typeof speciesList[0] === 'object'
                    ? speciesList
                    : speciesList.map((s) => ({ species: s, count: 1 }));
                chartOptions.value = {
                    ...chartOptions.value,
                    data: [...chartData]
                };
                tickInfo.value = { city, count, speciesList, latestDate };
                const message = `You clicked in ${location}. There are ${count} recorded tick sightings here.`;
                currentMarker = L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup(message)
                    .openPopup();
                isSidebarOpen.value = true;
            }
            if (scatterResponse.ok) {
                const rawData = await scatterResponse.json();
                const allYears = [...new Set(rawData.map((d) => d.year))].sort((a, b) => a - b);
                const allSpecies = [...new Set(rawData.map((d) => d.species))];
                const lookup = {};
                rawData.forEach((d) => {
                    if (!lookup[d.species])
                        lookup[d.species] = {};
                    lookup[d.species][d.year] = d.count;
                });
                const sharedData = allYears.map(year => {
                    const row = { year };
                    allSpecies.forEach(species => {
                        row[species] = lookup[species]?.[year] ?? 0;
                    });
                    return row;
                });
                const series = allSpecies.map(species => ({
                    type: 'line',
                    xKey: 'year',
                    yKey: species,
                    title: species,
                    marker: { enabled: true }
                }));
                scatterOptions.value = {
                    title: { text: 'Tick Population Over Time' },
                    legend: { position: 'bottom' },
                    data: sharedData,
                    series: series
                };
            }
        }
        catch (error) {
            console.error('API error:', error);
        }
        finally {
            isLoading.value = false;
        }
    });
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['sidebar-close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['chart-close-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['info-button']} */ ;
/** @type {__VLS_StyleScopedClasses['chart1-hover-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['chart2-hover-wrapper']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    id: "map-container",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    id: "map",
});
let __VLS_0;
/** @ts-ignore @type {typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    name: "popup",
}));
const __VLS_2 = __VLS_1({
    name: "popup",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
if (__VLS_ctx.isChartVisible) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "chart1-popup" },
    });
    /** @type {__VLS_StyleScopedClasses['chart1-popup']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.isChartVisible))
                    return;
                __VLS_ctx.isChartVisible = false;
                // @ts-ignore
                [isChartVisible, isChartVisible,];
            } },
        ...{ class: "chart-close-btn" },
    });
    /** @type {__VLS_StyleScopedClasses['chart-close-btn']} */ ;
    let __VLS_6;
    /** @ts-ignore @type {typeof __VLS_components.AgCharts} */
    AgCharts;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        options: (__VLS_ctx.chartOptions),
    }));
    const __VLS_8 = __VLS_7({
        options: (__VLS_ctx.chartOptions),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
}
// @ts-ignore
[chartOptions,];
var __VLS_3;
let __VLS_11;
/** @ts-ignore @type {typeof __VLS_components.Transition | typeof __VLS_components.Transition} */
Transition;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
    name: "popup",
}));
const __VLS_13 = __VLS_12({
    name: "popup",
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
const { default: __VLS_16 } = __VLS_14.slots;
if (__VLS_ctx.isChart2Visible) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "chart2-popup" },
    });
    /** @type {__VLS_StyleScopedClasses['chart2-popup']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.isChart2Visible))
                    return;
                __VLS_ctx.isChart2Visible = false;
                // @ts-ignore
                [isChart2Visible, isChart2Visible,];
            } },
        ...{ class: "chart-close-btn" },
    });
    /** @type {__VLS_StyleScopedClasses['chart-close-btn']} */ ;
    let __VLS_17;
    /** @ts-ignore @type {typeof __VLS_components.AgCharts} */
    AgCharts;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
        options: (__VLS_ctx.scatterOptions),
    }));
    const __VLS_19 = __VLS_18({
        options: (__VLS_ctx.scatterOptions),
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
}
// @ts-ignore
[scatterOptions,];
var __VLS_14;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    id: "sidebar",
    ...{ class: ({ open: __VLS_ctx.isSidebarOpen }) },
});
/** @type {__VLS_StyleScopedClasses['open']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.closeSidebar) },
    ...{ class: "sidebar-close-btn" },
});
/** @type {__VLS_StyleScopedClasses['sidebar-close-btn']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "sidebar-header" },
});
/** @type {__VLS_StyleScopedClasses['sidebar-header']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.isChartVisible = true;
            // @ts-ignore
            [isChartVisible, isSidebarOpen, closeSidebar,];
        } },
    ...{ class: "btn btn-secondary info-button" },
});
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['info-button']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.isChart2Visible = true;
            // @ts-ignore
            [isChart2Visible,];
        } },
    ...{ class: "btn btn-secondary info-button" },
});
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['info-button']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "sidebar-content" },
});
/** @type {__VLS_StyleScopedClasses['sidebar-content']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "info-label" },
});
/** @type {__VLS_StyleScopedClasses['info-label']} */ ;
(__VLS_ctx.tickInfo.city || 'No city selected');
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "info-label" },
});
/** @type {__VLS_StyleScopedClasses['info-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.tickInfo.count || 'No count data');
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "info-label" },
});
/** @type {__VLS_StyleScopedClasses['info-label']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
(__VLS_ctx.tickInfo.latestDate || 'No date data');
// @ts-ignore
[tickInfo, tickInfo, tickInfo,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
//# sourceMappingURL=LeafletMap.vue.js.map