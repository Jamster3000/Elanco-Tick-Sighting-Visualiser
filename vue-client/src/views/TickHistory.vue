<template>
    <h1>Tick History</h1>
    <h4>The chart below shows the prominence of a selected tick over time.</h4>
    <div class="page-container">
        <div class="controls">
            <select id="ticks" v-model="currentIndex">
                <option v-for="(tick, index) in species" :key="index" :value="index">
                    {{ tick.name }}
                </option>
            </select>
        </div>
        <div class="chart-area">

            <canvas id="tickChart" width="1350" height="450"></canvas>
        </div>
    </div>
</template>

<script lang="ts">
    import { ref, onMounted, onUnmounted, watch, inject, nextTick } from "vue";
    import Chart from "chart.js/auto"; //makes all chart.js features available

    export default {
    name: "TickHistory",

    setup() { //array of different species storing names and images

        let chartInstance: Chart | null = null; //stores the current chart instance

        const species = ref([
            { name: "Fox tick", image: "/Tick-Images/Fox-Badger-Tick.jpg" },
            { name: "Marsh tick", image: "/Tick-Images/marshtick_2.webp" },
            { name: "Southern rodent tick", image: "/Tick-Images/Southern-Rodent-Tick.jpg" },
            { name: "Tree-hole tick", image: "/Tick-Images/Tree-Hole-Tick.jpg" },
            { name: "Passerine tick", image: "/Tick-Images/Passerine-Tick.jpg" }
        ]);

        const currentIndex = ref(0); //tracks currently selected species

        const theme = inject<{
            colourBlindMode: any
            darkMode: any
            themeVersion: any
        }>('theme')


        const fetchChartData = async () => {
        const selected = species.value[currentIndex.value].name;

        const response = await fetch(`http://localhost:5021/api/TickChart/GetYearlyData?species=${encodeURIComponent(selected)}`); //sends get request to backend for tick data for selected species
        const data = await response.json(); //expects a json response
        const years = data.year.map(d => d.year); //takes just the year from each record
        const counts = data.year.map(d => d.count);

        updateChart(years, counts, selected);
        };

        const updateChart = (years, counts, label) =>
        {
            const ctx = document.getElementById("tickChart") as HTMLCanvasElement;

            //gets the primary color from theme
            const rootStyles = getComputedStyle(document.documentElement);
            const primary = rootStyles.getPropertyValue('--primary').trim();
            const text = rootStyles.getPropertyValue('--text').trim();

            if (chartInstance)
            {
                chartInstance.destroy();
                chartInstance = null;
            }

        chartInstance = new Chart(ctx, { //maps the line chart
            type: "line",
            data: {
            labels: years,
            datasets: [
                {
                label: label,
                data: counts,
                borderColor: primary,
                backgroundColor: primary,
                tension: 0.3

                }
            ]
            },
            options: {
            responsive: false,
            maintainAspectRatio: false,
            scales: { //labels the axes, and colours the grid
                x: { title: { display: true, text: "Year", color: text }, grid: {color: text }, ticks: { color: text } },
                y: { title: { display: true, text: "Sightings", color: text }, grid: { color: text }, ticks: { color: text } }                
            },
                plugins: { legend: { labels: { color: text } } }
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

    
        //watches theme from app.vue
        watch(
            () => theme.themeVersion.value,
            async () => {
                await nextTick()
                if (chartInstance) {
                    const rootStyle = getComputedStyle(document.documentElement)
                    const primary = rootStyle.getPropertyValue('--primary').trim()
                    const text = rootStyle.getPropertyValue('--text').trim()

                    chartInstance.data.datasets[0].borderColor = primary
                    chartInstance.data.datasets[0].backgroundColor = primary
                    chartInstance.options.scales.x.grid.color = text
                    chartInstance.options.scales.y.grid.color = text
                    chartInstance.options.scales.x.title.color = text
                    chartInstance.options.scales.y.title.color = text
                    chartInstance.options.scales.x.ticks.color = text
                    chartInstance.options.scales.y.ticks.color = text
                    chartInstance.options.plugins.legend.labels.color = text

                    chartInstance.update()
                }
            }
        );


        onMounted(fetchChartData);

        return {
        species,
        currentIndex,
        };
      }
    };</script>




<style scoped>
    h1 {
        text-align: center;
        padding-top: 80px;
        text-decoration: underline;
        font-size: calc(32px * var(--font-scale, 1));
    }

    h4 {
        text-align: center;
        font-size: calc(18px * var(--font-scale, 1));
    }


    .page-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
    }

    .controls {
        align-self: flex-end;
        margin-right: 60px;
        margin-bottom: 10px;
    }

    #ticks {
        font-size: calc(18px * var(--font-scale, 1));
        padding: 8px 12px;
        border-radius: 8px;
        border: 2px solid #333;
        cursor: pointer;
    }

    .chart-area {
        display: flex;
        align-items: center;
        gap: 30px;
        background: var(--bg);
    }
</style>