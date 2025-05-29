<template>
    <div class="detailType2" @click="clicked">
        <div class="head">
            <div class="left">
                <!-- <img v-if="isBlue"   :src="require('@/static/img/stress/status_ico_good.svg')" />
                <img v-if="isYellow" :src="require('@/static/img/stress/status_ico_warning.svg')" />
                <img v-if="isRed   " :src="require('@/static/img/stress/status_ico_bad.svg')" /> -->
                <h1>{{params.title}}</h1>
                <div v-show="!params.measure">{{params.measure}}</div>
            </div>
            <div class="right">
                <h1>{{getCurVal + '%'}}</h1>
            </div>
        </div>
        <div class="content">
            <!-- <p>신체적 스트레스가 <span class="textColorBlue">양호한 수준</span>입니다</p> -->
            <div class="bar">
                <div class="barActive"
                     v-bind:class="{'backgroundRed'    : isRed ,
                                    'backgroundBlue'   : isBlue,
                                    'backgroundYellow' : isYellow,
                                    'green'  : isGreen,
                                    'orange' : isOrange, }"
                    v-bind:style="{ width: getCurVal + '%'}"></div>
            </div>
        </div>
    </div>
<!-- 
    <div class="mb-4" @click="clicked">
        <h4 class="small font-weight-bold">
            {{params.title}}
            {{params.measure}}
            <span class="float-right">{{params.curVal}}/{{params.maxVal}}</span>
        </h4>
        
        <div style="display:flex;" >
            <div class="small font-weight-bold float-left" style="width: 5%">
                <span>{{params.minVal}}</span>
            </div>
            
            <div class="progress" style="height: 20px; width: 83%">
                <div class="progress-bar" 
                    v-bind:class="{ 'red'    : isRed ,
                                    'green'  : isGreen,
                                    'blue'   : isBlue,
                                    'orange' : isOrange}"
                    role="progressbar" 
                    v-bind:style="{ width: getCurVal + '%'}"
                    aria-valuenow="getCurVal"
                    aria-valuemin="params.minVal"
                    aria-valuemax="params.maxVal">
                    {{params.curVal}}
                </div>
            </div>   

            <div class="small font-weight-bold float-right text-right" style="width:12%">
                <span>{{params.maxVal}}</span>
            </div>
        </div>
    </div> -->
</template>

<script>

// import "bootstrap/dist/css/bootstrap.min.css"
// import "bootstrap"

export default {
    name: 'progress-bar',
    props: {
        minVal : {
            type: Number,
            require: false,
            default: 0
        },
        maxVal : {
            type: Number,
            require: false,
            default: 100
        },
        curVal : {
            type: Number,
            require: true,
            default: 0
        },
        title: {
            type: String,
            require: false,
            default: ''
        },
        measure: {
            type: String,
            require: false,
            default: ''
        },
        color: {
            type: String,
            require: false,
            default: 'red'
        },
        progDiv: {
            type: String,
            require: false,
            default: ''
        }
    },
    data() {
        return {
            params: {
                minVal: 0,
                maxVal: 100,
                curVal: 0,
                title: '프로그래스 타이틀',
                measure: '',
                color: 'yellow',
                progDiv: ''
            },
            
        }
    },
    methods: {
        init: function() {
            let $this = this;
            
            $this.initData();
        },
        initData: function() {
            let $this = this;
        },
        clicked: function() {
            this.$emit('onClicked', this.params.progDiv);
        }
    },
    updated: function () {
    
    },
    computed: {
        getCurVal: function() {
            let curVal = this.params.curVal / (this.params.maxVal - this.params.minVal) * 100;            
            return Math.round(curVal * 100) / 100;
        },
        isBlue: function() {
            return this.params.color === 'blue';
        },
        isYellow: function() {
            return this.params.color === 'yellow';
        },
        isRed: function() {
            return this.params.color === 'red';
        },
        isGreen: function() {
            return this.params.color === 'green';
        },
        isOrange: function() {
            return this.params.color === 'orange';
        },
        
    },
    watch: {
        minVal: function(val) {
            this.params.minVal = val;
        },
        maxVal: function(val) {
            this.params.maxVal = val;
        },
        curVal: function(val) {
            this.params.curVal = val;
        },
        title: function(val) {
            this.params.title = val;
        },
        measure: function(val) {
            this.params.measure = val;
        },
        color: function(val) {
            this.params.color = val;
        },
        progDiv: function(val) {
            this.params.progDiv = val;
        }
    },
    mounted: function() {
        let $this = this;
    }
}

</script>

<style scoped>
.red {
    background-color: red !important;
}
.green {
    background-color: green !important;
}
.blue {
    background-color: blue !important;
}
.orange {
    background-color: orange !important;
}
</style>