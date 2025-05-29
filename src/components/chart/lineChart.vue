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
    name: 'line-chart',
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
            id: 'line-chart',
            type: 'line',
            data: {
                labels: [''],
                datasets: [{}]
            },
            plugins: [ChartDataLabels],
            options : {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                        labels: {
                            // This more specific font property overrides the global property
                            font: {
                                size: 14
                            },
                            boxWidth : 40
                        }
                    },
                    title: {
                        display: true,
                        text: props.title
                    }
                },
                scales: {
                    x: {
                        display: false,
                        title: {
                            display: false,
                            text: ''
                        }
                    },
                    y: {
                        display: false,
                        title: {
                            display: false,
                            text: ''
                        }
                    }
                }
            }
        }

        let chartHeight = {
            height  : {
                height: ''
            }
        }

        const updateChart = (data) => {
            chart.data.datasets                 = data.datasets
            chart.data.labels                   = data.labels

            chartRef.value.update(250);
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