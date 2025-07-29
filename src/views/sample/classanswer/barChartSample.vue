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
        chartDataSet() {
            const $this = this;

            $this.graphData = [
                {category: '우정'        , data: 55},
                {category: '인기'        , data: 50},
                {category: '사회적선호   ', data: 45},
                {category: '친사회성     ', data: 40},
                {category: '대인관계공격성', data: 35},
                {category: '외현적공격성'  , data: 30},
                {category: '대인관계피해' , data: 35},
                {category: '외현적피해   ', data: 40},
                {category: '교사학생갈등' , data: 45},
                {category: '교사학생지지' , data: 50},
                {category: '방어자자'    , data: 55},
            ]
        },

        initChart() {
            const $this = this;

            const container = this.$refs.chartContainer;
            const spec = {
                //그래프 타입
                type: 'bar',
                //배열 형태로 데이터 저장
                data: [
                    {
                    id: 'barData',
                    values: $this.graphData
                    }
                ],
                //x축 기준 category
                xField: 'category',
                //y축 기준 values
                yField: 'data',

                //차트 축을 설정하는 옵션, 눈금, 레이블, 선을 그림
                axes: [
                    {
                        orient: 'left',
                        type: 'linear',
                        min: 20,
                        max: 80,
                        nice: false
                    },
                    {
                        orient: 'bottom',
                        type: 'band'
                    }
                ],

                //막대 스타일
                bar: {
                    //선 색상
                    style: {
                        fill: datum => datum.data < $this.avgData ? '#E57373' : '#4CAF50'
                    },
                    label: {
                        visible: true,
                        position: 'top',
                            style: {
                            fill: '#000',
                            fontSize: 12
                        }
                    }
                },

                //기준선, 목표선, 평균선 등 선을 표시할 때 사용하는 옵션
                markLine: [
                    {
                        type: 'line', //선 타입
                        y: $this.avgData, //y축에 평균값에 선을 그림
                        //선 스타일
                        style: {
                            stroke: 'gray',
                            lineDash: [4, 4], //점선
                            lineWidth: 1
                        },
                        //텍스트 라벨
                        label: {
                            visible: true,
                            text: `평균 (${$this.avgData})`,
                            position: 'middle',
                            style: {
                                fill: '#666',
                                fontSize: 12,
                            }
                        }
                    }
                ],

                //마우스 오버 시 툴팁 표시
                tooltip: {
                    visible: true,
                }
            };
            
            //그래프 객체 생성
            this.chart = new VChart(spec, { dom: container });

            //그래프 렌더링
            this.chart.renderAsync();
        }
    },

    mounted() {
        this.chartDataSet();
        this.initChart();
    },

    beforeUnmount() {
        this.chart?.destroy?.();
    }
}

</script>