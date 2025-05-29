<template>
        <div class="row">
            <div class="col-lg-12 mb-4">
                <div class="card shadow mb-4">

                    <div class="card-header py-3">
                        <h4 class="m-0 font-weight-bold text-primary">일반달력</h4>
                    </div>

                    <div class="card-body">
                        <div class="mb-3">
                            <Datepicker :stnd-dt="params.strtDt" @on-selected="onSelectedDatepicker"></Datepicker>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12 mb-4">
                <div class="card shadow mb-4">
                    <div class="card-header py-3">
                        <h4 class="m-0 font-weight-bold text-primary">달력 세팅 및 출력</h4>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <input type="button" @click="setStrtDt" value="현재날짜 설정" />
                            <input type="button" @click="getStrtDt" value="출력" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12 mb-4">
                <div class="card shadow mb-4">
                    <div class="card-header py-3">
                        <h4 class="m-0 font-weight-bold text-primary">날짜변경버튼 일반달력</h4>
                    </div>

                    <div class="card-body">
                        <div class="mb-3">
                            <StndDatepicker :stnd-dt="params.strtDt" @on-selected="onSelectedStndDatepicker"></StndDatepicker>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12 mb-4">
                <div class="card shadow mb-4">
                    <div class="card-header py-3">
                        <h4 class="m-0 font-weight-bold text-primary">기간달력</h4>
                    </div>

                    <div class="card-body">
                        <div class="mb-3">
                            <BetweenDatepicker :fr-dt="params.betweenStrtDt" :to-dt="params.betweenEndDt" @on-selected="onSelectedBetweenDatepicker"></BetweenDatepicker>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12 mb-4">
                <div class="card shadow mb-4">
                    <div class="card-header py-3">
                        <h4 class="m-0 font-weight-bold text-primary">주별달력(서버 통신으로 주석)</h4>
                    </div>

                    <div class="card-body">
                        <div class="mb-3">
                            <WeekDatepicker :stnd-dt="params.strtDt" :fill-list="params.fillList" @on-selected="onSelectedWeekDatepicker"></WeekDatepicker>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12 mb-4">
                <div class="card shadow mb-4">
                    <div class="card-header py-3">
                        <h4 class="m-0 font-weight-bold text-primary">날짜 / 시간 표기</h4>
                    </div>

                    <div class="card-body">
                        <div class="mb-3">
                            <DateTimepicker :fr-dt="params.betweenStrtDt" :to-dt="params.betweenEndDt" @on-selected="onSelectedBetweenDatepicker"></DateTimepicker>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12 mb-4">
                <div class="card shadow mb-4">
                    <div class="card-header py-3">
                        <h4 class="m-0 font-weight-bold text-primary">시간만 표기</h4>
                    </div>

                    <div class="card-body">
                        <div class="mb-3">
                            <Timepicker :fr-dt="params.betweenStrtDt" :to-dt="params.betweenEndDt" @on-selected="onSelectedBetweenDatepicker"></Timepicker>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12 mb-4">
                <div class="card shadow mb-4">
                    <div class="card-header py-3">
                        <h4 class="m-0 font-weight-bold text-primary">월 달력</h4>
                    </div>

                    <div class="card-body">
                        <div class="mb-3">
                            <MonthDatepicker :fr-dt="params.betweenStrtDt" :to-dt="params.betweenEndDt" @on-selected="onSelectedBetweenDatepicker"></MonthDatepicker>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>

// utils
import moment from 'moment'
import { DateUtil, DATE_FORMAT, TIME_FORMAT, DATETIME_FORMAT, SHORT_DATETIME_FORMAT, DATE_FORMAT_WITHOUT_DELIMETER, TIME_FORMAT_WITHOUT_DELIMETER, DATETIME_FORMAT_WITHOUT_DELIMETER } from '@/utils/DateUtil.js'

// mixins
import baseMixins from '@/views/mixins/baseMixins.vue'

// component
// import GlobalDatepicker  from '@/components/datepicker.vue'
import Datepicker        from '@/components/datepicker/Datepicker.vue'
import StndDatepicker    from '@/components/datepicker/StndDatepicker.vue'
import BetweenDatepicker from '@/components/datepicker/BetweenDatepicker.vue'
import WeekDatepicker    from '@/components/datepicker/WeekDatepicker.vue'
import DateTimepicker    from '@/components/datepicker/DateTimepicker.vue'
import Timepicker    from '@/components/datepicker/Timepicker.vue'
import MonthDatepicker    from '@/components/datepicker/MonthDatePicker.vue'


export default {
    data() {
        return {
            params: {
                strtDt: '',
                endDt: '',
                btnStrtDt:'',
                betweenStrtDt:'',
                betweenEndDt:''
            }
        }
    },
    mixins : [baseMixins],
    components: {
        Datepicker,
        StndDatepicker,
        BetweenDatepicker,
        WeekDatepicker,
        DateTimepicker,
        Timepicker,
        MonthDatepicker
    },
    methods: {
        init: function() {
            let $this = this;
            
            $this.initData();
        }
        ,initData: function() {
            let $this = this;

            $this.params.strtDt = DateUtil.getCurrDate();
            // console.log($this.params.strtDt);

            // console.log($this.params.strtDt);

            // $this.params.endDt = DateUtil.getCurrDate();

            // $this.params.endDt = DateUtil.addDay($this.params.endDt, 10);

            // $this.params.fillList = [];
            // $this.params.fillList.push('20220319');
            // $this.params.fillList.push('20220321');
            // $this.params.fillList.push('20220323');
            // $this.params.fillList.push('20220325');
            // $this.params.fillList.push('20220327');
            // $this.params.fillList.push('20220328');
                   // $this.params.fillList.push('20220330');


            // console.log(DateUtil.getDate('20220518'));
            // console.log(DateUtil.getDate('2022/05/18'));
            // console.log(DateUtil.getDate('20220518', DATE_FORMAT));
            // console.log(DateUtil.getDate('20220518', DATE_FORMAT_WITHOUT_DELIMETER));
            // console.log(DateUtil.getCurrDateTime(DATETIME_FORMAT));
            // console.log(DateUtil.getCurrDateTime(SHORT_DATETIME_FORMAT));
            // console.log(DateUtil.getCurrDateTime(DATE_FORMAT_WITHOUT_DELIMETER));
            // console.log(DateUtil.getShortCurrDateTime());
            // console.log(DateUtil.getCurrDate());
            // console.log(DateUtil.getCurrDate(DATE_FORMAT));
            // console.log(DateUtil.getCurrDate(DATE_FORMAT_WITHOUT_DELIMETER));
            // console.log(DateUtil.getCurrTime());
            // console.log(DateUtil.getCurrTime(TIME_FORMAT));
            // console.log(DateUtil.getCurrTime(TIME_FORMAT_WITHOUT_DELIMETER));
            
        }
        ,setStrtDt: function(selectedDate) {
            this.params.strtDt = DateUtil.getCurrDate();
        }

        ,getStrtDt: function() {
            // console.log("getStrtDt",this.params.strtDt);
        }
        ,onSelectedDatepicker: function(selectedDate) {
            // console.log('onSelectedDatepicker : ' + selectedDate);
            this.params.strtDt = selectedDate;
        }
        // ,onSelectedGlobalDatepicker: function(selectedDate) {
        //     console.log('onSelectedGlobalDatepicker : ' + selectedDate);
        // }
        ,onSelectedStndDatepicker: function(selectedDate) {
            // console.log('onSelectedStndDatepicker : ' + selectedDate);
            this.params.strtDt = selectedDate;
        }
        ,onSelectedBetweenDatepicker: function(params) {

            this.params.betweenStrtDt = params.frDt;
            this.params.betweenEndDt = params.toDt;
            // console.log('onSelectedBetweenDatepicker : ' + params.frDt);
            // console.log('onSelectedBetweenDatepicker : ' + params.toDt);

        }
        ,onSelectedWeekDatepicker: function(selectedDate) {
            // console.log('onSelectedStndDatepicker : ' + selectedDate);
        }
    },
    watch:{
        strtDt: function(newVal, oldVal) {
            let $this = this;
            this.params.strtDt = newVal;
        },
        endDt: function(newVal, oldVal) {
            let $this = this;
            this.params.endDt = newVal;

        },
    },
    mounted: function() {
        let $this = this;
        $this.init();
    }
}
</script>