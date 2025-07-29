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
                type: 'radar',
                data: [
                    {
                    id: 'radarData',
                    values: [
                        { category: '우정', data: 55 },
                        { category: '인기', data: 50 },
                        { category: '사회적선호', data: 45 },
                        { category: '친사회성', data: 40 },
                        { category: '대인관계공격성', data: 35 },
                        { category: '외현적공격성', data: 30 },
                        { category: '대인관계피해', data: 35 },
                        { category: '외현적피해', data: 40 },
                        { category: '교사학생갈등', data: 45 },
                        { category: '교사학생지지', data: 50 },
                        { category: '방어자자', data: 55 }
                    ]
                    }
                ],
                categoryField: 'category',
                valueField: 'data',

                outerRadius: 0.9,    //차트 외곽 크기
                innerRadius: 0.0,    //중심부터 시작하는 거리 비율

                //꼭짓점 포인트 보여줄지 여부
                point: {
                    visible: false
                },

                //영역 채우기 표시 여부
                area: {
                    visible: true,
                    style: {
                        fillOpacity: 0.3,   //투명도 여부
                        fill: '#4CAF50'     //색상
                    },
                    state: {
                        //마우스 호버시 투명도 여부
                        hover: {
                            fillOpacity: 0.5
                        }
                    }
                },

                //라인 스타일 설정
                line: {
                    style: {
                            lineWidth: 3,        
                            stroke: '#2E7D32'    
                    }
                },

                axes: [
                    {
                    orient: 'radius',      
                    zIndex: 100,
                    min: 20,
                    max: 80,

                    tick: {
                        visible: false,
                        values: [20, 35, 50, 65, 80]
                    },
                    domainLine: {
                        visible: false
                    },
                    label: {
                        visible: true,
                        space: 0,
                        style: {
                        textAlign: 'center',
                        fill: '#000',
                        fontSize: 12,
                        fontWeight: 'bold'
                        }
                    },

                    //축 눈금선 스타일 설정
                    grid: {
                        smooth: false,
                        style: {
                            lineDash: [0],
                            stroke: '#',      
                            lineWidth: 2         
                        }
                    }
                    },
                    {
                    orient: 'angle',        // 각도 축 (항목 이름들이 배치되는 축)
                    zIndex: 50,
                    tick: {
                        visible: false
                    },
                    domainLine: {
                        visible: false
                    },
                    label: {
                        space: 16,
                        style: {
                        fontSize: 12,
                        fontWeight: 'normal',
                        fill: '#333'
                        }
                    },
                    grid: {
                        style: {
                        lineDash: [0],
                        stroke: '#bbb',
                        lineWidth: 1.5
                        }
                    }
                    }
                ]
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