import { ref, onMounted, watch, onUnmounted } from "vue";
import Chart from "chart.js/auto"; //makes all chart.js features available
export default {};
;
const __VLS_ctx = {};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "page-container" },
});
/** @type {__VLS_StyleScopedClasses['page-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "controls" },
});
/** @type {__VLS_StyleScopedClasses['controls']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.select, __VLS_intrinsics.select)({
    id: "ticks",
    value: (__VLS_ctx.currentIndex),
});
for (const [tick, index] of __VLS_vFor((__VLS_ctx.species))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.option, __VLS_intrinsics.option)({
        key: (index),
        value: (index),
    });
    (tick.name);
    // @ts-ignore
    [currentIndex, species,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "chart-area" },
});
/** @type {__VLS_StyleScopedClasses['chart-area']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.canvas, __VLS_intrinsics.canvas)({
    id: "tickChart",
    width: "1350",
    height: "450",
});
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    name: "TickHistory",
    setup() {
        let chartInstance = null; //stores the current chart instance
        const species = ref([
            { name: "Fox tick", image: "/Tick-Images/Fox-Badger-Tick.jpg" },
            { name: "Marsh tick", image: "/Tick-Images/marshtick_2.webp" },
            { name: "Southern rodent tick", image: "/Tick-Images/Southern-Rodent-Tick.jpg" },
            { name: "Tree-hole tick", image: "/Tick-Images/Tree-Hole-Tick.jpg" },
            { name: "Passerine tick", image: "/Tick-Images/Passerine-Tick.jpg" }
        ]);
        const currentIndex = ref(0); //tracks currently selected species
        const fetchChartData = async () => {
            const selected = species.value[currentIndex.value].name;
            const response = await fetch(`/api/TickChart/GetYearlyData?species=${encodeURIComponent(selected)}`); //sends get request to backend for tick data for selected species
            const data = await response.json(); //expects a json response
            const years = data.year.map((d) => d.year); //takes just the year from each record
            const counts = data.year.map((d) => d.count);
            updateChart(years, counts, selected);
        };
        const updateChart = (years, counts, label) => {
            const ctx = document.getElementById("tickChart");
            if (chartInstance) {
                chartInstance.destroy();
                chartInstance = null;
            }
            chartInstance = new Chart(ctx, {
                type: "line",
                data: {
                    labels: years,
                    datasets: [
                        {
                            label: label,
                            data: counts,
                            borderColor: "#1529d6",
                            backgroundColor: "rgba(76, 175, 80, 0.2)",
                            tension: 0.3
                        }
                    ]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    scales: {
                        x: { title: { display: true, text: "Year" } },
                        y: { title: { display: true, text: "Sightings" }, beginAtZero: true }
                    }
                }
            });
        };
        onUnmounted(() => {
            if (chartInstance) {
                chartInstance.destroy();
                chartInstance = null;
            }
        });
        watch(currentIndex, fetchChartData);
        onMounted(fetchChartData);
        return {
            species,
            currentIndex,
        };
    }
});
//# sourceMappingURL=TickHistory.vue.js.map