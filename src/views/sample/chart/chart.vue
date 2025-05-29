<template>
    <div class="row"> 
        <div class="col-lg-12 mb-4">
            <div class="card shadow mb-4">

                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Vertical Bar Chart</h6>
                </div>

                <div class="card-body">
                    <BarChart
                        :title="barChart.title"
                        :chartdata="barChart.data"
                        :options="barChart.options"
                        ref="refBarChart">
                    </BarChart>
                    <hr>
                    <button class="btn btn-primary" @click="updateBarChartData">Update Data BarChart</button>
                </div>
            </div>
        </div>
    </div>
    
    <div class="row">
        <div class="col-lg-12 mb-4">
            <div class="card shadow mb-4">

                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Single Line Chart</h6>
                </div>

                <div class="card-body">
                    <LineChart
                        :title="lineChart.title"
                        :chartdata="lineChart.data"
                        :options="lineChart.options"
                        ref="refLineChart">
                    </LineChart>
                    <hr>
                    <button class="btn btn-info" @click="updateLineChartData">Update Data Single LineChart</button>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-12 mb-4">
            <div class="card shadow mb-4">

                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Multiple Line Chart</h6>
                </div>

                <div class="card-body">
                    <LineChart
                        :title="multiLineChart.title"
                        :chartdata="multiLineChart.data"
                        :options="multiLineChart.options"
                        ref="refMultiLineChart">
                    </LineChart>
                    <hr>
                    <button class="btn btn-warning" @click="updateMultiLineChartData">Update Data Multi LineChart</button>
                </div>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col-lg-12 mb-4">
            <div class="card shadow mb-4">

                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">Doughnut Chart</h6>
                </div>

                <div class="card-body">
                    <DoughnutChart
                        :title="doughnutChart.title"
                        :chartdata="doughnutChart.data"
                        :options="doughnutChart.options"
                        ref="refDoughnutChart">
                    </DoughnutChart>
                    <hr>
                    <button class="btn btn-warning" @click="updateDoughnutChartData">Update Data DoughnutChart</button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

// import BarChart      from '@/components/chart/barChart.vue'
import BarChart      from '@/components/echart/barChart.vue'
import LineChart     from '@/components/chart/lineChart.vue'
import DoughnutChart from '@/components/chart/doughnutChart.vue'

export default {
    components: {
        BarChart,
        LineChart,
        DoughnutChart
    },
    data() {
        return {
            barChart: {
                title: '바차트 타이틀',
                data: null,
                options: null
            },
            lineChart: {
                title: '라인차트 타이틀',
                data: null,
                options: null
            },
            multiLineChart: {
                title: '멀티라인차트 타이틀',
                data: null,
                options: null
            },
            doughnutChart: {
                title: '도넛차트 타이틀',
                data: null,
                options: null
            }
        }
    },
    methods: {
        init: function() {
            let $this = this;
            $this.initData();
        }
        ,initData: function() {
            this.updateBarChartData();
            this.updateLineChartData();
            this.updateMultiLineChartData();
            this.updateDoughnutChartData();
        },
        updateBarChartData: function() {
            let $this = this;

            $this.barChart = {
                data: {
                    labels : ['02-13', '02-14', '02-15', '02-16', '02-17', '02-18'],
                    datasets: [{
                        data: [1812, 1657, 1548, 1255, 2500, 2654],
                        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16']
                    }]
                }
            }
            // $this.$refs.refBarChart.updateData($this.barChart.data);
        },
        updateLineChartData: function() {
            let $this = this;

            $this.lineChart = {
                data: {
                    labels : ['02-13', '02-14', '02-15', '02-16', '02-17', '02-18'],
                    datasets: [{
                        data: [1812, 1657, 1548, 1255, 2500, 2654],
                        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16']
                    }]
                }
            }
            this.$refs.refLineChart.updateData($this.lineChart.data);
        },
        updateMultiLineChartData: function() {
            let $this = this;

            $this.multiLineChart = {
                data: {
                    labels : ['02-13', '02-14', '02-15', '02-16', '02-17', '02-18'],
                    datasets: [{
                        data: [1812, 1657, 1548, 1255, 2500, 2654],
                        backgroundColor: '#41B883'
                    }, {
                        data: [1812, 1657, 1756, 1548, 2800, 3054],
                        backgroundColor: '#E46651'
                    }]
                }
            }
            this.$refs.refMultiLineChart.updateData($this.multiLineChart.data);
        }
        ,updateDoughnutChartData: function() {
            let $this = this;

            $this.doughnutChart = {
                data: {
                    labels : ['비만지수', ''],
                    datasets: [{
                        data: [87, 13],
                        backgroundColor: ['#41B883', '#FFFFFF']
                    }],
                    doughnutLabel: {
                        text: '87',
                        color: '#41B883',
                        font: {
                            size: '40',
                            family: 'Arial, Helvetica, sans-serif',
                            weight: 'bold'
                        }
                    }
                }
            }
            this.$refs.refDoughnutChart.updateData($this.doughnutChart.data);
        }
    },
    mounted: function() {
        let $this = this;
        $this.init();
    }
}

</script>
