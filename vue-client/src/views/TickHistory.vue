<script lang="ts">
    import { ref, onMounted, onUnmounted, watch, inject, nextTick } from "vue";
    import Chart from "chart.js/auto"; //makes all chart.js features available

    export default {
        name: "TickHistory",

        setup() { //array of different species storing names and images

            let chartInstance: Chart | null = null; //stores the current chart instance

            const percentageObject = ref<any>(null);

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

                const response = await fetch(`/api/TickChart/GetYearlyData?species=${encodeURIComponent(selected)}`); //sends get request to backend for tick data for selected species
                const data = await response.json(); //expects a json response
                const years = data.year.map((d: any) => d.year); //takes just the year from each record
                const counts = data.year.map((d: any) => d.count);

                updateChart(years, counts, selected);
            };

            const fetchPercentageChange = async () => {
                const selected = species.value[currentIndex.value].name;
                const response = await fetch(`/api/TickSightings/species/${encodeURIComponent(selected)}/percentage-change`);
                const data = await response.json();
                percentageObject.value = data;
            };

            const updateChart = (years: number[], counts: number[], label: string) => {
                const ctx = document.getElementById("tickChart") as HTMLCanvasElement;

                //gets the primary color from theme
                const rootStyles = getComputedStyle(document.documentElement);
                const primary = rootStyles.getPropertyValue('--primary').trim();
                const text = rootStyles.getPropertyValue('--text').trim();

                if (chartInstance) {
                    chartInstance.data.labels = years;
                    chartInstance.data.datasets[0].data = counts;
                    chartInstance.data.datasets[0].label = label;
                    chartInstance.update("active");
                } else {
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
                            responsive: true,
                            maintainAspectRatio: false,
                            animation: {
                                duration: 750
                            },
                            scales: { //labels the axes, and colours the grid
                                x: { title: { display: true, text: "Year", color: text }, grid: { color: text }, ticks: { color: text } },
                                y: { title: { display: true, text: "Sightings", color: text }, grid: { color: text }, ticks: { color: text } }
                            },
                                plugins: { legend: { labels: { color: text } } 
                            }
                        }
                    });
                }        
        };

            onUnmounted(() => {
                if (chartInstance) {
                    chartInstance.destroy();
                    chartInstance = null;
                }
            });

            watch(currentIndex, async () => {
                await fetchChartData();
                await fetchPercentageChange();
            });

    
        //watches theme from app.vue
        watch(
            () => theme?.themeVersion.value,
            async () => {
                await nextTick()
                if (chartInstance) {
                    const rootStyle = getComputedStyle(document.documentElement)
                    const primary = rootStyle.getPropertyValue('--primary').trim()
                    const text = rootStyle.getPropertyValue('--text').trim()

                    chartInstance.data.datasets[0].borderColor = primary
                    chartInstance.data.datasets[0].backgroundColor = primary
                    chartInstance.options!.scales!.x!.grid!.color = text
                    chartInstance.options!.scales!.y!.grid!.color = text
                    chartInstance.options!.scales!.x!.ticks!.color = text
                    chartInstance.options!.scales!.y!.ticks!.color = text
                    chartInstance.options!.plugins!.legend!.labels!.color = text

                        chartInstance.update()
                    }
                }
            );


            onMounted(fetchChartData);
            onMounted(async () => {
                await fetchChartData();
                await fetchPercentageChange();
            });

            return {
                species,
                currentIndex,
                percentageObject,
            };
        }
    };
</script>

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
        <div class="content">
            <div class="chart-area">
                <canvas id="tickChart"></canvas>
            </div>
            <div class="statistics" v-if="percentageObject">
                <div class="population">
                    <p><strong>Peak Population</strong></p>
                    <p>{{percentageObject.peakTickCount}} ({{percentageObject.peakYear}})</p>
                    <p><strong>Minimum Population</strong></p>
                    <p>{{percentageObject.lowestTickCount}} ({{percentageObject.lowestYear}})</p>
                    <p><strong>Average Population</strong></p>
                    <p>{{percentageObject.averageTickCount.toFixed(0)}}</p>
                </div>
                <div class="percentage">
                    <p v-if="!percentageObject.message">
                    <p v-if="percentageObject.percentageChange > 0">
                        Between {{percentageObject.firstYear}} and {{percentageObject.mostRecentYear}} there has been a {{percentageObject.percentageChange.toFixed(2)}}% increase in population of {{percentageObject.species}}s
                    </p>
                    <p v-else-if="percentageObject.percentageChange < 0">
                        Between {{percentageObject.firstYear}} and {{percentageObject.mostRecentYear}} there has been a {{Math.abs(percentageObject.percentageChange).toFixed(2)}}% decrease in population of {{percentageObject.species}}s
                    </p>
                    <p v-else>
                        Between {{percentageObject.firstYear}} and {{percentageObject.mostRecentYear}} there has been no change in population of {{percentageObject.species}}s
                    </p>
                    </p>
                    <p v-else>{{percentageObject.message}}</p>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>

    .content {
        height: 80vh;
        display: flex;
        gap: 30px;
        align-items: flex-start;
        align-items: stretch;
    }

    .statistics {
        flex: 1;
        display: flex;
        flex-direction: column;
        font-size: calc(16px * var(--font-scale, 1));
        gap: 30px;
        background-color: var(--primary);
        padding: 16px;
        border-width: 3px;
        border-style: solid;
        border-color: var(--primary);
        border-radius: 12px;
        max-width: 600px;
        text-align: center;
        height: 80%;
    }

    .population p {
        margin-top: 6px 0;
    }

        .population p:nth-child(odd) {
            margin-top: 16px;
        }

    .chart-area {
        flex: 4;
        height: 80%;
        border-style: solid;
        border-width: 3px;
        border-color: var(--primary);
        border-radius: 15px;
        padding-top: 80px;
        text-decoration: underline;
        font-size: calc(32px * var(--font-scale, 1));
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-height: 60vh;
        margin: 0 auto;
        gap: 30px;
        background: var(--bg);
    }

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

    .percentage, .population {
        font-weight: bold;
        color: var(--text);
        padding: 10px;
        padding-top: 30px;
    }


        .page-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            max-height: calc(100vh - var(--header-height));
            overflow-y: auto;
        }

    #tickChart {
        max-width: 100%;
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
        border: 2px solid var(--primary);
        cursor: pointer;
    }
</style>