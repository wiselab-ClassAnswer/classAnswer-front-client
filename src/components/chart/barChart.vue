<template>
    <div>
        <Vue3ChartJs
            :id="chart.id"
            ref="chartRef"
            :type="chart.type"
            :data="chart.data"
            :options="chart.options"
        >
        </Vue3ChartJs>
    </div>
</template>

<script>
import { ref } from 'vue'
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'

Vue3ChartJs.registerGlobalPlugins([ChartDataLabels])

export default {
    name: 'bar-chart',
    components: {
        Vue3ChartJs,
    },
    props: {
        title: {
            type: String
        },
        chartdata: {
            type: Object
        }
    },
    setup (props) {
        const chartRef = ref(null)
        
        const chart = {
            id: 'bar-chart',
            type: 'bar',
            data: {
                labels: [''],
                datasets: [{}]
            },
            plugins: [ChartDataLabels],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: false,
                        text: props.title,
                    },
                    tooltip: {
                        enabled: false
                    },
                },
                layout: {
                    padding: {                
                        top: 20                
                    }
                },
                scales: {
                    x: {
                        display: false,
                    },
                    y: {
                        grid: {
                            drawBorder: false,
                            display: false
                        },
                        ticks: {
                            display:false,
                        },
                        
                    },
                }
            }
        }

        const updateChart = (data) => {
            chart.data.labels   = data.labels
            chart.data.datasets = data.datasets

            chartRef.value.update(250)
        }

        return {
            chart,
            updateChart,
            chartRef
        }
    },
    methods: {
        updateData: function(data) {
            this.updateChart(data);
        }
    },
    mounted: function() {
        
    }
}
</script>