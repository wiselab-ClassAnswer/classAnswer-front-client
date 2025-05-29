<template>
    <div>
         <!-- 검색조건 -->
         <div class="section section1">
            <div class="search-box">
                <div class="m-b-10">
                    <h1>검색조건</h1>
                    <SetButton :showInit="true" :showSelect="true" :showSave="false" :showDelete="false" @on-set-button-click="onSetButtonClick"></SetButton>
                </div>
                <div class="input-box w-100">
                    <div class="w-20 ib">
                        <h2>교육기간</h2>
                        <BetweenDatepicker :isInputBtn="true" :fr-dt="params.frDt" :to-dt="params.toDt" @on-selected="onSelectedBetweenDatepicker"></BetweenDatepicker>
                    </div>
                    <div class="w-10" style="position:relative">
                        <h2>교육과정</h2>
                        <input v-clear @change="clearVal()" class="search" v-model="params.ecousNo" type="text" disabled>
                        <button class="btn-search" @click="popUpEduCousSrch()">
                            <img src="@/assets/img/btn_search.png" alt="찾기">
                        </button>
                    </div>
                    <div class="w-10">
                        <input type="text" v-model="params.ecousNm" disabled>
                    </div>
                    <div class="w-10">
                        <h2>GPT모델</h2>
                        <select v-model="params.gmdlNo">
                            <option v-for="item in code.gmdlCdList" :key="item.colId" :value="item.colId">{{item.colNm}}</option>
                        </select>
                    </div>
                    <div class="w-10">
                        <h2>사용자</h2>
                        <input type="text" v-model="params.user" v-on:keyup.enter="searchListGmdlLmitBase(true)">
                    </div>
                    <div class="w-20">
                        <h2>대상구분</h2>
                        <div class="radio-container" >
                            <label>
                                <input type="radio" v-model="params.userDiv" value="" checked>
                                전체
                            </label>        
                            <label>
                                <input type="radio" v-model="params.userDiv" value="50">
                                관리자
                            </label>
                            <label>
                                <input type="radio" v-model="params.userDiv" value="30">
                                강사
                            </label>
                            <label>
                                <input type="radio" v-model="params.userDiv" value="20">
                                교육생
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>    

        <!-- 모델사용제한이력 그리드 -->
        <div class="section section4" >            
            <div class="section-wrap">
                <h2 class="ib">모델사용제한이력</h2>
                <button class="btn-exel-download only" @click="downloadExcel()">
                    <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                    <p>다운로드</p>
                </button>
                <!-- 그리드 -->
                <div class="wrapper-content">
                    <Grid ref="gmdlLmitHistGrid" :paging="true" :dataParams="params"></Grid>
                </div>
            </div>
        </div>
        <EduCousSrchPop ref="EduCousSrchModal" :dataParams="params" @getEduCousPopRowData="getEduCousPopRowData"></EduCousSrchPop>
    </div>
</template>

<script>

import { reactive, ref, inject }    from 'vue'
import Grid                         from '@/components/grid/Grid.vue'
import SetButton                    from '@/components/SetButton.vue'
import BetweenDatepicker            from '@/components/datepicker/BetweenDatepicker.vue'
import { DateUtil }                 from '@/utils/DateUtil'
import { CmonUtil }                 from '@/utils/CmonUtil'
import { ValdUtil }                 from '@/utils/ValdUtil.js'
import EduCousSrchPop               from '@/views/rept/stat/EduCousSrchPop.vue'

export default {
    components: {
        Grid
       ,SetButton
       ,BetweenDatepicker
       ,EduCousSrchPop
    },

    setup() {
        //  전역 MIXIN의 메소드를 inject를 통해 가져옴
        const colIdNmListData = {'tblId' : 'tm_gmdl_base'
                                ,'colId' : 'gmdl_no'
                                ,'colNm' : 'gmdl_cntn'
                                ,'where' : [
                                    {'andCol'  : '1'
                                    ,'andCalc' : '='
                                    ,'andVal'  : "'1'"}
                                ]
                                ,'orderby' : [
                                    {'orderCol' : 'gmdl_no'}
                                ]
        };
        let code = reactive({
            gmdlCdList : []
        });
        const getColIdNmList = inject('getColIdNmList');
        getColIdNmList(colIdNmListData, code.gmdlCdList, 'Y', null);

        return {
            code
        }
    },

    data: function() {
		return {
            params : {
                frDt : ''
               ,toDt : ''
               ,ecousNo : ''
               ,ecousNm : ''
               ,gmdlNo : ''
               ,user : ''
               ,userDiv : ''
            },
            statCdList: [
                {cdVal : '50' ,cdNm:'관리자'}
               ,{cdVal : '30' ,cdNm:'강사'}
               ,{cdVal : '20' ,cdNm:'교육생'}
            ]
        }
    },
    methods: {
        init: function() {  
            const $this = this;
            $this.params.frDt = DateUtil.addDay(DateUtil.getCurrDate(), -30); 
            $this.params.toDt = DateUtil.getCurrDate();
            let data = $this.CmonUtil.getPageLink('H1030');
            if(ValdUtil.isNotNull(data)){        
                $this.params.user  = data.userId;
            }
            $this.initGrid();
        },

        resetScreen(){
            const $this = this;
            //  검색조건 초기화
            $this.resetParams();
            //  Grid 초기화
            $this.$refs.gmdlLmitHistGrid.clearGridData();
            //  그리드 조회
            $this.initGrid();
        },

        //  검색조건 초기화
        resetParams(){
            const $this = this;
            $this.params.frDt = DateUtil.addDay(DateUtil.getCurrDate(), -30);
            $this.params.toDt = DateUtil.getCurrDate();
            $this.params.ecousNo = '';
            $this.params.ecousNm  = '';
            $this.params.gmdlNo = '';
            $this.params.user = '';
            $this.params.userDiv  = '';
            $this.lmitNo = '';
        },

        initGrid() {
            let $this = this;
            $this.gridObj = {
                url : '/rept/stat/gmdlLmitHist/selectListGmdlLmitHist.hb',
                colModels : [
                    { name : 'lmitNo'         , label : '제한이력번호'      , width : 7   , align : 'center' },
                    { name : 'gmdlLmitDt'     , label : '발생일자'          , width : 7   , align : 'center' , formatter: $this.formatDate },
                    { name : 'gmdlLmitTm'     , label : '발생시각'          , width : 7   , align : 'center' , formatter: $this.formatTime },
                    { name : 'gmdlLmitUserId' , label : '제한처리사용자ID'  , width : 7   , align : 'left'   },
                    { name : 'gmdlLmitObjNm'  , label : '구분'              , width : 7   , align : 'center' },
                    { name : 'refrVal'        , label : '참조값'            , width : 7   , align : 'left'    ,cellattr: function () { return 'style="color:blue;cursor:pointer;text-decoration:underline"';}},
                    { name : 'gmdlLmitResnNm' , label : '제한사유'          , width : 13  , align : 'left'   },
                    { name : 'gmdlLmitCntn'   , label : '제한내용'          , width : 23  , align : 'left'   },
                    { name : 'gmdlLmitObjCd'  , label : '제한대상구분코드'  , width : 7   , align : 'left'    ,hidden : true},
                    { name : 'userDiv'        , label : '사용자구분'        , width : 7   , align : 'left'    ,hidden : true},
                ],
                options: {
                    onCellSelect: function(rowid, iCol, val, e) {     
                        var colNm = $(this).jqGrid('getGridParam','colModel')[iCol].name; 
                        if(colNm == "refrVal"){
                            $this.refrValLink(rowid);
                        }
                    },
                    
                }
            };
            $this.$refs.gmdlLmitHistGrid.init($this.gridObj);
            $this.searchListGmdlLmitBase();
        },

        refrValLink(rowid){
            const $this = this;
            let gridData = $this.$refs.gmdlLmitHistGrid.getGridObj().getRowData(rowid);

            //전달 값 
            let sendParams = {};            
            
            if(ValdUtil.isNotNull(gridData.refrVal)) {
                if(gridData.gmdlLmitObjCd == "10") {
                    sendParams.gmdlNo  = gridData.refrVal;
                    $this.CmonUtil.setPageLink('M1020',sendParams); // GPT모델관리
                } else if(gridData.gmdlLmitObjCd == "20") {
                    sendParams.ecousNo  = gridData.refrVal;
                    $this.CmonUtil.setPageLink('M1040',sendParams); // 교육과정관리
                } else if(gridData.gmdlLmitObjCd == "30") {
                    if (gridData.userDiv == "20") {
                        sendParams.userId  = gridData.refrVal;
                        $this.CmonUtil.setPageLink('M1050',sendParams); // 수강생관리
                    } else {
                        sendParams.userId  = gridData.refrVal;
                        $this.CmonUtil.setPageLink('M1030',sendParams); // 사용자관리
                    }
                }
            }
        },

        onSelectedBetweenDatepicker(selectedDate) {
            const $this = this;
            $this.params.frDt = selectedDate.frDt;
            $this.params.toDt = selectedDate.toDt;
            // $this.alert($this.params.toDt);
        },

        //교육과정 검색 팝업
        popUpEduCousSrch(){
            const $this = this;
            $this.$refs.EduCousSrchModal.show();
            $this.$refs.EduCousSrchModal.initGrid();
        },

         //팝업 교육과정 정보 받기
         getEduCousPopRowData(data){
            const $this = this;
            $this.params.ecousNo = data.ecousNo;
            $this.params.ecousNm = data.ecousNm;
        },

        clearVal(){
            const $this = this;
            $this.params.ecousNo = '';
            $this.params.ecousNm = '';
        },

        searchListGmdlLmitBase(){
            const $this = this;
            // console.log(' ########### params :', $this.params);
            if ($this.validationSrchCond()) {
                $this.$refs.gmdlLmitHistGrid.selectList(true);
            }
        },

        //  조회 조건 VALIDATION
        validationSrchCond(){
            const $this = this;
            
            if(ValdUtil.isNull($this.params.frDt) || ValdUtil.isNull($this.params.toDt)) {
                $this.alert('교육기간을 선택하세요');
                return false;
            }

            if(($this.params.ecousNo && $this.params.gmdlNo) || ($this.params.ecousNo && $this.params.user) || ($this.params.ecousNo && $this.params.userDiv)) {
                $this.$refs.gmdlLmitHistGrid.clearGridData();
                $this.alert('교육과정, GPT모델, 사용자, 대상구분을 검색조건으로 함께 사용하면 검색결과가 없습니다.');
                return false;
            }
            if(($this.params.gmdlNo && $this.params.user) || ($this.params.gmdlNo && $this.params.userDiv)) {
                $this.$refs.gmdlLmitHistGrid.clearGridData();
                $this.alert('교육과정, GPT모델, 사용자, 대상구분을 검색조건으로 함께 사용하면 검색결과가 없습니다.');
                return false;
            }

            return true;
        },

        // 엑셀다운로드        
        downloadExcel(){            
            const $this = this;
            if($this.$refs.gmdlLmitHistGrid.getGridObj().jqGrid('getGridParam','records') < 1) {
                this.alert('검색된 모델사용 제한이력 목록이 없습니다.');
                return false;
            }
            let url     = '/rept/stat/gmdlLmitHist/selectListGmdlLmitHistExcel.hb';
            let fileNm  = '모델사용제한이력_'+ DateUtil.getCurrDate('YYYYMMDD') + '.xlsx';
            let param   = $this.params;
            // param.excelHeader = labelsArray;
            
            $this.doDownExcel(url, param, fileNm);
        },
        // 공통버튼(초기화, 조회, 저장, 삭제) 컴포넌트 핸들러
        onSetButtonClick(div) {
            const $this = this;
            switch ( div ) {
                case 'init' :
                    $this.resetScreen();
                    break;
                case 'select' :
                $this.searchListGmdlLmitBase();
                    break;
                default :
                    $this.alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
        },
    },
    mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>
