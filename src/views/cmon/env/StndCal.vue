<template>
    <div>
        <!-- 검색조건 -->
        <div class="section section1">
            <div class="search-box">
                <div class="input-box w-100">
                    <div class="w-5 ib">
                        <h1>검색조건</h1>
                    </div>
                    <div>
                        <h2 class="essn wd-55 ib">기준년월</h2>
                        <MonthDatepicker :stndDt="params.stndDt" @on-selected="onSelectedDatepicker"></MonthDatepicker>
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="false" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>  
            </div>
        </div>
        <!-- 표준달력 -->
        <div class="section sectionL w-65">
            <div class="section-wrap">
                <h2 class="ib m-b-10">표준달력</h2>
                <div class="table-wrap">
                    <table class="calendar">
                        <colgroup>
                            <col width="14.28571428571429%">
                            <col width="14.28571428571429%">
                            <col width="14.28571428571429%">
                            <col width="14.28571428571429%">
                            <col width="14.28571428571429%">
                            <col width="14.28571428571429%">
                            <col width="14.28571428571429%">
                        </colgroup>
                        <thead>
                            <tr>
                                <th style="background-color:#989898; text-align: center" scope="col" v-for="(weekNm, idx) in weekNm" v-bind:key="idx"
                                    :style="{ color: isWeekend(weekNm) ? 'red' : '#fff' }">{{ weekNm }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="week in monthList" :key="week">
                                <td v-for="day in week" :key="day" v-on:click="searchStndCalDetl(day.stndDay)" class="cal-shape p-0">
                                    <div v-show="day.stndDay != ''" :style="{ color: day.dayColor }" class="w-100 ht-100 t-a-c p-t-10 p-r-5 p-l-5">
                                        <span class="f-s-18">{{ day.stndDay }}</span>
                                        <p class="m-b-5 m-t-10" style="color:#777"><span style="font-size:12px; color:#c0c0c0">음력</span> {{ day.moonMnth }}.{{ day.moonDay }}</p>
                                        <span v-show="day.termKor != '' && day.termKor != null">
                                            {{ day.termKor }}
                                            <br>
                                        </span>
                                        <span v-show="day.scalEvnt != '' && day.scalEvnt != null">
                                            / {{ day.scalEvnt }}
                                            <br>
                                        </span>
                                        <span v-show="day.moonEvnt != '' && day.moonEvnt != null">
                                            / {{ day.moonEvnt }}
                                            <br>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- 상세정보 -->
        <div class="section sectionR w-35">            
            <div class="section-wrap ">
                <h2 class="m-t-5">기본 정보</h2>
                <div class="section-part m-b-20">
                    <div class="w-100">
                        <div class="w-50 ib">
                            <div class="w-30 ib m-0">
                                <span>기준일자</span>
                            </div>
                            <div class="w-70 ib">
                                <input class="w-100" type="text" v-model="params.showStndDt" disabled />
                            </div>
                        </div>
                        <div class="w-50 ib">
                            <div class="w-30 ib p-l-10">
                                <span>단기년도</span>
                            </div>
                            <div class="w-70 ib">
                                <input class="w-100" type="text" v-model="stndCalInfo.korYear" disabled />
                            </div>
                        </div>
                    </div>      
                    <div class="w-100">       
                        <div class="w-50 ib">
                            <div class="w-30 ib m-0">
                                <span>년도간지</span>
                            </div>
                            <div class="w-70 ib">
                                <input class="w-100" type="text" disabled  
                                :value="stndCalInfo.yearGanjiKor != '' && stndCalInfo.yearGanjiKor != undefined ? stndCalInfo.yearGanjiKor+'('+stndCalInfo.yearGanjiChn+')' : ''"/>
                            </div>
                        </div>
                        <div class="w-50 ib">
                            <div class="w-30 ib p-l-10">
                                <span>년도띠</span>
                            </div>
                            <div class="w-70 ib">
                                <input class="w-100" type="text" v-model="stndCalInfo.ddiNm" disabled />
                            </div>
                        </div>
                    </div>
                    <div class="w-100">       
                        <div class="w-50 ib">
                            <div class="w-30 ib m-0">
                                <span>날짜간지</span>
                            </div>
                            <div class="w-70 ib">
                                <input class="w-100" type="text" disabled  
                                :value="stndCalInfo.dayGanjiKor != '' && stndCalInfo.dayGanjiKor != undefined ? stndCalInfo.dayGanjiKor+'('+stndCalInfo.dayGanjiChn+')' : ''"/>
                            </div>
                        </div>
                        <div class="w-50 ib">
                            <div class="w-30 ib p-l-10">
                        <span>음력일자</span>
                            </div>
                            <div class="w-70 ib">
                                <input class="w-100" type="text" v-model="params.showMoonDt" disabled />
                            </div>
                        </div>
                    </div>
                    <div class="w-100">       
                        <div class="w-50 ib">
                            <div class="w-30 ib m-0">
                        <span>절기</span>
                            </div>
                            <div class="w-70 ib">
                                <input class="w-100" type="text" disabled  
                                :value="stndCalInfo.termKor != '' && stndCalInfo.termKor != undefined ? stndCalInfo.termKor+'('+stndCalInfo.termChn+')' : ''"/>
                            </div>
                        </div>
                        <div class="w-50 ib">
                            <div class="w-30 ib p-l-10">
                                <span>윤달여부</span>
                            </div>
                            <div class="w-70 ib">
                                <select class="w-100" v-model="stndCalInfo.leapMnthYn" disabled>
                                    <option value="Y">윤달</option>
                                    <option value="N">평달</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div> 

                <h2>휴무/행사 정보</h2>
                <div class="section-part m-b-20">
                    <div class="w-100">
                        <div class="w-50 ib">
                            <div class="w-30 ib m-0">
                                <span>기념일구분</span>
                            </div>
                            <div class="w-70 ib" v-if="stndCalInfo.stndDt != null">
                                <select class="w-100" v-model="stndCalInfo.anniDivCd">
                                    <option value=""></option>
                                    <option v-for="item in frmlAnivList" :key="item.cdVal" v-bind:value="item.cdVal">{{
                                        item.cdNm }}</option>
                                </select>
                            </div>
                            <!-- 날짜 선택 X -->
                            <div class="w-70 ib" v-if="stndCalInfo.stndDt == null">
                                <select class="w-100">
                                    <option value=""></option>
                                    <option v-for="item in frmlAnivList" :key="item.cdVal" v-bind:value="item.cdVal">{{
                                        item.cdNm }}</option>
                                </select>
                            </div>
                        </div>
                        <div class="w-50 ib">
                            <div class="w-30 ib p-l-10 m-0">
                                <span>휴일여부</span>
                            </div>
                            <div class="w-70 ib" v-if="stndCalInfo.stndDt != null">
                                <select class="w-100" v-model="stndCalInfo.hdayYn">
                                    <option value=""></option>
                                    <option value="Y">예</option>
                                    <option value="N">아니오</option>
                                </select>
                            </div>
                            <!-- 날짜 선택 X -->
                            <div class="w-70 ib" v-if="stndCalInfo.stndDt == null">
                                <select class="w-100">
                                    <option value="" readonly hidden selected></option>
                                    <option value=""></option>
                                    <option value="Y">예</option>
                                    <option value="N">아니오</option>
                                </select>
                            </div>
                            <!-- 날짜 선택 시 -->
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-15 ib m-0">
                            <span>양력행사</span>
                        </div>
                        <div class="w-85 ib">
                            <input class="w-100" type="text" id="scalEvnt" name="scalEvnt" v-model="stndCalInfo.scalEvnt" />
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-15 ib m-0">
                            <span>음력행사</span>
                        </div>
                        <div class="w-85 ib">
                            <input class="w-100" id="moonEvnt" name="moonEvnt" v-model="stndCalInfo.moonEvnt" />
                        </div>
                    </div>

                </div>
                <h2>저장 옵션</h2>
                
                <div class="section-part m-b-20">
                    <div class="w-100">
                        <div class="w-15 ib m-t-10">
                            <span>저장옵션</span>
                        </div>
                        <div class="w-85 radio-box m-b-0 f-r p-rl" style="top:2px;">
                            <label>지정일만 해당
                                <input type="radio" name="day" v-model="params.saveOption" value="0" checked>
                            </label>
                            <label>매년반복 (양력)
                                <input type="radio" name="scal" v-model="params.saveOption" value="1">
                            </label>
                            <label>매년반복 (음력)
                                <input type="radio" name="moon" v-model="params.saveOption" value="2">
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

import { DateUtil } from '@/utils/DateUtil';
import { CmonUtil } from '@/utils/CmonUtil';
import { ValdUtil } from '@/utils/ValdUtil';
import { SessionUtil } from '@/utils/SessionUtil';
import SetButton from '@/components/SetButton.vue'
import MonthDatepicker from '@/components/datepicker/MonthDatePicker.vue';

export default {
    components: {
        MonthDatepicker,
        SetButton,
    },
    data: function () {
        return {
            params: {
                currDt        : '',
                stndDt        : '',
                stndYear      : '',
                stndMnth      : '',
                stndDay       : '',
                showStndDt    : '',
                showMoonDt    : '',
                userId        : '',
                saveOption    : '0',
                anniDivCdDiv  : false
            },
            stndCalInfo: {
                regiNo        : 0,
                stndDt        : '',
                stndDay       : '',
                korYear       : '',
                moonDt        : '',
                moonYear      : '',
                moonMnth      : '',
                moonDay       : '',
                yearGanjiChn  : '',
                yearGanjiKor  : '',
                dayGanjiChn   : '',
                dayGanjiKor   : '',
                termChn       : '',
                termKor       : '',
                weekNm        : '',
                scalEvnt      : '',
                moonEvnt      : '',
                ddayNm        : '',
                ddiNm         : '',
                leapMnthYn    : '',
                anniDivCd     : '',
                hdayYn        : '',
            },
            monthList         : [],
            frmlAnivList      : [],
            anniDivList       : [],
            weekNm: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],



        }
    },
    methods: {
        init: function () {
            let $this = this;
            this.params.currDt = DateUtil.getCurrDate();
            this.params.userId = SessionUtil.getUserId();
            this.initData();
            this.setStndDt();
            this.searchStndCalList();
            this.searchFrmlAnivCdList();
        },

        initData: function () {
            let $this = this;
            $this.monthList = [];
            for (let i = 0; i < 6; i++) {
                let week = [];
                for (let j = 0; j < 7; j++) {
                    week.push({ stndDay: '', moonMnth: '', moonDay: '', termKor: '', scalEvnt: '', dayColor: '', moonEvnt: '' })
                }
                $this.monthList.push(week);
            }
        },

        // 현재 시점으로 기준년월 설정
        setStndDt: function () {
            let $this = this;

            this.params.currDt = DateUtil.getCurrDate();
            this.params.stndYear = this.params.currDt.substring(0, 4);
            this.params.stndMnth = this.params.currDt.substring(5, 7);
            this.params.stndDt = this.params.stndYear+'-'+this.params.stndMnth; 
            


        },

        // 기준년월에 해당하는 달력정보 조회
        searchStndCalList: function () {
            let $this = this;
            $this.initData();
            $this.stndCalInfo = '';
            $this.params.showStndDt = '';
            $this.params.showMoonDt = '';
            $this.params.saveOption = '0';
            let param = {
                stndYear: $this.params.stndYear,
                stndMnth: $this.params.stndMnth,
                stndDay: $this.params.stndDay
            }
            $this.doPost('/cmon/env/stndCal/selectListStndCal.hb', param).then(function (response) {
                $this.setStndCalList(response.data.rtnData.result);
            });

        },


        showStndDt:function(){
            const $this = this;

            // console.log("params.",$this.params.stndDt);
        },

        // 주말 색상 변경 함수
        isWeekend: function (day) {
            let $this = this;

            return day === 'SUN' || day === 'SAT'

        },

        //달력 설정 함수
        setStndCalList: function (result) {
            let $this = this;
            let sunDayYn = 'N';

            for (let day of result) {
                let weekSeq = day.mnthWeekSeq;
                let daySeq = 0;
                let dayColor = "black";
                switch (day.weekNm) {
                    case '일': {
                        daySeq = 0;
                        if (day.stndDay != '01') {
                            weekSeq = weekSeq + 1;
                        } else if (day.stndDay == '01') {
                            sunDayYn = 'Y';
                        }

                    } break;
                    case '월': daySeq = 1; break;
                    case '화': daySeq = 2; break;
                    case '수': daySeq = 3; break;
                    case '목': daySeq = 4; break;
                    case '금': daySeq = 5; break;
                    case '토': daySeq = 6; break;

                }

                if (day.hdayYn == 'Y') {
                    dayColor = "red";

                }
                else if (day.hdayYn == '-' || day.termKor != null) {
                    dayColor = "green";
                }
                else if (day.hdayYn == '-' || day.scalEvnt != null || day.moonEvnt != null) {

                    if (day.scalEvnt == '') {
                        dayColor = 'black';
                    }
                    else if (day.moonEvnt == '') {
                        dayColor = 'black';
                    }
                    else {
                        dayColor = "green";
                    }
                }
                else {
                    dayColor = "black";

                }

                if (sunDayYn == 'Y' && day.stndDay != '01') weekSeq = weekSeq - 1;

                $this.monthList[weekSeq - 1][daySeq].stndDay = day.stndDay;
                $this.monthList[weekSeq - 1][daySeq].moonMnth = day.moonMnth;
                $this.monthList[weekSeq - 1][daySeq].moonDay = day.moonDay;
                $this.monthList[weekSeq - 1][daySeq].termKor = day.termKor;
                $this.monthList[weekSeq - 1][daySeq].scalEvnt = day.scalEvnt;
                $this.monthList[weekSeq - 1][daySeq].moonEvnt = day.moonEvnt;
                $this.monthList[weekSeq - 1][daySeq].dayColor = dayColor;

            }

        },


        // 검색조건 기준년월 달력으로 값 변경 시 stndDt / stndYear / stndMnth 값 변경
        onSelectedDatepicker: function (selectedDate) {

            let $this = this;
            
            
            this.params.stndYear = selectedDate.substring(0, 4);
            this.params.stndMnth = selectedDate.substring(5, 7);
            this.params.stndDt   = selectedDate.substring(0, 7); 
            $this.searchStndCalList();


        },

        //공인기념일 조회
        searchFrmlAnivCdList: function () {
            let $this = this;
            $this.doPost('/cmon/env/stndCal/selectListAnniDivCd.hb', this.params).then(function (response) {
                if (response.data.rtnCd == '0000') {
                    for (let i = 0; i < response.data.rtnData.result.length; i++) {
                        $this.frmlAnivList.push(response.data.rtnData.result[i]);
                    }
                }
                else {
                    $this.alert(result.rtnMsg);
                }
            });
        },


        // 표준달력에서 날짜를 클릭하면 우측 상세정보 영역에 세부 날짜 정보 표기
        searchStndCalDetl: function (stndDay) {
            let $this = this;
            let param = {
                stndYear: $this.params.stndYear,
                stndMnth: $this.params.stndMnth,
                stndDay: stndDay
            }
            if (ValdUtil.isNotNull(param.stndDay)) {

                $this.doPost('/cmon/env/stndCal/selectListStndCalDetl.hb', param).then(function (response) {
                    if (response.data.rtnCd == '0000') {
                        $this.stndCalInfo = response.data.rtnData.result;
                        $this.params.showStndDt = $this.stndCalInfo.stndYear + '-' + $this.stndCalInfo.stndMnth + '-' + $this.stndCalInfo.stndDay;
                        $this.params.showMoonDt = $this.stndCalInfo.moonYear + '-' + $this.stndCalInfo.moonMnth + '-' + $this.stndCalInfo.moonDay;

                        if (response.data.rtnData.result.saveOption == null || response.data.rtnData.result.saveOption == '') {
                            $this.params.saveOption = '0';
                        }

                    }
                    else {
                        $this.alert(result.rtnMsg);
                    }
                });
            }

        },

        // 휴무/행사정보 저장
        saveStndCalInfo: function () {
            let $this = this;

            let param = {
                scalEvnt      : $this.stndCalInfo.scalEvnt,
                moonEvnt      : $this.stndCalInfo.moonEvnt,
                anniDivCd     : $this.stndCalInfo.anniDivCd,
                hdayYn        : $this.stndCalInfo.hdayYn,
                stndDt        : $this.stndCalInfo.stndDt,
                stndMnth      : $this.stndCalInfo.stndMnth,
                stndDay       : $this.stndCalInfo.stndDay,
                moonMnth      : $this.stndCalInfo.moonMnth,
                moonDay       : $this.stndCalInfo.moonDay,
                userId        : $this.params.userId,
                saveOption    : $this.params.saveOption

            };        

            // null 값 체크 (양력/음력행사는 필수 입력이 아니므로 필수입력 메소드 따로 사용)
            let chkIsNull = true;
            let maxLen    = 40; 
            let scalMsg   = '양력행사는';
            let moonMsg   = '음력행사는';

            // 양력 null 체크
            if(ValdUtil.isNull(param.scalEvnt)){
                chkIsNull = true;
            }
            if(ValdUtil.isNotNull(param.scalEvnt)){
                let bytes = CmonUtil.getBytesUTF8(param.scalEvnt);
                if (ValdUtil.isNotNull(maxLen) && bytes > maxLen) {
                    CmonUtil.alert(`${scalMsg} 최대 ${maxLen}자리 이하이어야 합니다.`);
                    return false;
                }
            }

            // 음력 null 체크
            if(ValdUtil.isNull(param.moonEvnt)){
                chkIsNull = true;
            }
            if(ValdUtil.isNotNull(param.moonEvnt)){
                let bytes = CmonUtil.getBytesUTF8(param.moonEvnt);
                if (ValdUtil.isNotNull(maxLen) && bytes > maxLen) {
                    CmonUtil.alert(`${moonMsg} 최대 ${maxLen}자리 이하이어야 합니다.`);
                    return false;
                }
            }

            $this.doPost('/cmon/env/stndCal/updateStndCalDetl.hb', param).then(function (response) {
                if(response.data.rtnData.result === '1'){
                    $this.alert("저장이 완료되었습니다.").then((result) =>{
                        if ( result.isConfirmed) {
                            $this.resetSearchParam();
                        }
                    });
                } else {
                    $this.alert(response.data.rtnMsg);
                }
                
            });
           

        },

        // 입력 값 저장 컨펌창
        showConfirm: function () {
            let $this = this;
            let saveOptionVal = ' 해당 지정일만 ';

               //기념일 구분이 공휴일, 법정기념일, 국가기념일인 경우
            if($this.stndCalInfo.anniDivCd === '01' && $this.stndCalInfo.hdayYn ==='N' ){
                $this.alert(`기념일구분영역의 값이 공휴일 또는 법정공휴일인 경우 휴일여부는 "예" 로 지정해야합니다.`);
                return false;
            } else if($this.stndCalInfo.anniDivCd === '02' && $this.stndCalInfo.hdayYn ==='N' ){
                $this.alert(`기념일구분영역의 값이 공휴일 또는 법정공휴일인 경우 휴일여부는 "예" 로 지정해야합니다.`);
                return false;
            }

            if ($this.params.saveOption == 1) {
                this.saveOptionVal = ' 매년(양력) ';
            }
            else if ($this.params.saveOption == 2) {
                this.saveOptionVal = ' 매년(음력) ';
            }
            else {
                this.saveOptionVal = ' 해당 지정일만 ';
            }
            this.confirm({
                content: '현재 작성된 내용을' + this.saveOptionVal + '반영하시겠습니까?',
                callback: {
                    yes: function () {
                        if ($this.stndCalInfo.stndDt != null && $this.stndCalInfo.stndDt != '') {
                            $this.saveStndCalInfo();
                            
                        }
                        else {
                            $this.alert("반영할 날짜를 먼저 선택해주세요.");
                        }
                    },
                    no: function () {

                    }
                }
            });

        },

        // 화면 초기화
        resetSearchParam: function () {
            let $this = this;

            this.params.userId = SessionUtil.getUserId();
            this.initData();
            this.setStndDt();
            $this.searchStndCalList();

        },

        //조회 버튼 함수
        selectBtnSrch: function(){
            let $this = this;
            this.initData();
            $this.searchStndCalList();
        },

        // 공통버튼(초기화, 조회, 저장, 삭제) 컴포넌트 핸들러
        onSetButtonClick(div) {
            switch (div) {
                case 'init':
                    this.resetSearchParam();
                    break;
                case 'select':
                    this.selectBtnSrch();
                    break;
                case 'save':
                    this.showConfirm();
                    break;

                default:
                    alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
        },

    },
    updated: function () {

    },
    watch: {
        'stndCalInfo.anniDivCd': function () {
            let $this = this;

            //기념일 구분이 공휴일, 법정기념일, 국가기념일인 경우
            if ($this.stndCalInfo.anniDivCd === '01' || $this.stndCalInfo.anniDivCd === '02' || $this.stndCalInfo.anniDivCd === '03') {
                $this.stndCalInfo.hdayYn = 'Y';
                
            } else if($this.stndCalInfo.anniDivCd === '04' || $this.stndCalInfo.anniDivCd === '05') {
                $this.stndCalInfo.hdayYn = 'N';
            }
        },
    },
    mounted: function () {
        let $this = this;
        $this.init();
    }
}
</script>