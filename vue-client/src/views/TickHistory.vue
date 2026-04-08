<script lang="ts">
    import { ref, onMounted, watch, onUnmounted } from "vue";
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

            const fetchChartData = async () => {
                const selected = species.value[currentIndex.value].name;

                const response = await fetch(`/api/TickChart/GetYearlyData?species=${encodeURIComponent(selected)}`); //sends get request to backend for tick data for selected species
                const data = await response.json(); //expects a json response
                const years = data.year.map((d: any) => d.year); //takes just the year from each record
                const counts = data.year.map((d: any) => d.count);

                updateChart(years, counts, selected);
            };

            const updateChart = (years: number[], counts: number[], label: string) => {
                const ctx = document.getElementById("tickChart") as HTMLCanvasElement;

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
                                    borderColor: "#1529d6",
                                    backgroundColor: "rgba(76, 175, 80, 0.2)",
                                    tension: 0.3
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: true,
                            animation: {
                                duration: 750
                            },
                            scales: {
                                x: { title: { display: true, text: "Year" } },
                                y: { title: { display: true, text: "Sightings" }, beginAtZero: true }
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

            watch(currentIndex, fetchChartData);

            onMounted(fetchChartData);

            return {
                species,
                currentIndex,
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
        <div class="chart-area">
            <canvas id="tickChart"></canvas>
        </div>
    </div>
</template>

<style scoped>
    .page-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        max-height: calc(100vh - var(--header-height));
        overflow-y: auto;
    }

    .chart-area {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-height: 60vh;
        margin: 0 auto;
    }

    #tickChart {
        max-width: 100%;
    }

    h1 {
        text-align: center;
        padding-top: 80px;
        text-decoration: underline;
    }

    h4 {
        text-align: center;
    }

    .controls {
        align-self: flex-end;
        margin-right: 60px;
        margin-bottom: 10px;
    }

    #ticks {
        font-size: 16px;
        padding: 8px 12px;
        border-radius: 8px;
        border: 2px solid var(--primary);
        cursor: pointer;
    }
    </style>