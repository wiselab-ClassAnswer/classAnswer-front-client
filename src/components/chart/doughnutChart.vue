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
import doughnutlabel from 'chartjs-plugin-doughnutlabel-v3'

Vue3ChartJs.registerGlobalPlugins([doughnutlabel])

export default {
    name: 'doughnut-chart',
    components: {
        Vue3ChartJs,
    },
    props: {
        title: {
            type: String,
            default: ''
        },
        chartdata: {
            type: Object,
            default(rawProps) {
                return {
                    labels: [],
                    datasets: [],
                    doughnutLabel: {}
                }
            }
        }
    },
    setup (props) {

        const chartRef = ref(null)

        let chartdata = props.chartdata;
        // let title   = props.title;

        if ( chartdata === null ) {
            chartdata = {
                labels : [],
                datasets : [{}],
                doughnutLabel : {}
            }
        }

        if ( chartdata.labels == null ) {
            chartdata.labels = [];
        }

        if ( chartdata.datasets == null ) {
            chartdata.datasets = [{}];
        }

        if ( chartdata.doughnutLabel == null ) {
            chartdata.doughnutLabel = {};
        }

        let chart = {
            id: 'doughnut-chart',
            type: 'doughnut',
            data: {
                labels       : chartdata.labels,
                datasets     : chartdata.datasets
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: props.title,
                    },
                    doughnutLabel: {
                        labels: [chartdata.doughnutLabel]
                    }
                }
            }
        }

        // const updateChart = (data) => {
        //     chart.data.labels   = data.labels
        //     chart.data.datasets = data.datasets
        //     console.log('진짜 짜증나네 data :: ', data);            
        //     console.log('진짜 짜증나네 title :: ', title);
        //     chartRef.value.update(250)
        // }

        return {
            chart,
            // updateChart,
            chartRef,
            // title
        }
    },
    methods: {
        updateData(data) {
            this.$refs.chartRef.options.plugins.doughnutLabel.labels[0] = data.doughnutLabel;
            this.updateChart(data);
        },
        updateChart(data) {
            this.chart.data.labels   = data.labels
            this.chart.data.datasets = data.datasets
            console.log('진짜 짜증나네 data :: ', data);            
            console.log('진짜 짜증나네 title :: ', this.$props.title);
            this.chart.options.plugins.title.text = this.$props.title;
            this.chartRef.update(250)
        }
    },
    mounted: function() {
        
    }
}
</script>