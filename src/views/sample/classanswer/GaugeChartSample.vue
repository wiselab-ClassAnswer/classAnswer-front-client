<template>
    <div ref="chartContainer" style="width: 100%; height: 400px;"></div>
</template>

<script>
import  VChart  from '@visactor/vchart';

export default {
    data: function () {
        return {
            //데이터 담을 배열
            graphData : [],
            //데이터 평균 예시
            avgData : 40,
        }
    },
    methods: {
        initChart() {
            const $this = this;

            const container = this.$refs.chartContainer;
            const spec = {
            type: 'gauge',
            data: [
                {
                id: 'id0',
                values: [
                    {
                    type: '피어슨상관계수',
                    value: 0.6
                    }
                ]
                }
            ],
            categoryField: 'type',
            valueField: 'value',
            outerRadius: 0.8,
            innerRadius: 0.5,
            startAngle: -180,
            endAngle: 0,
            axis: {
                min: -1,
                max: 1,
                label: {
                visible: true,
                formatter: val => (val === -1 || val === 1 ? val.toString() : '')
                },
                tick: {
                visible: true
                }
            },
            indicator: {
                visible: true,
                shape: 'pointer',
                style: {
                fill: '#4CAF50'
                }
            }
            };

            
            //그래프 객체 생성
            this.chart = new VChart(spec, { dom: container });

            //그래프 렌더링
            this.chart.renderAsync();
        }
    },

    mounted() {
        this.initChart();
    },

    beforeUnmount() {
        this.chart?.destroy?.();
    }
}

</script>