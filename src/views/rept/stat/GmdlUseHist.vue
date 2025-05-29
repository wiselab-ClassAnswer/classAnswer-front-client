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
                        <input type="text" v-model="params.user" v-on:keyup.enter="searchListGmdlBase(true)">
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

        <!-- 모델사용이력 그리드 -->
        <div class="section section4" >            
            <div class="section-wrap">
                <h2 class="ib">모델사용이력</h2>
                <button class="btn-exel-download only" @click="downloadExcel()">
                    <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                    <p>다운로드</p>
                </button>
                <!-- 그리드 -->
                <div class="wrapper-content">
                    <Grid ref="modlUseHistGrid" :paging="true" :dataParams="params"></Grid>
                </div>
            </div>
        </div>
        <EduCousSrchPop ref="EduCousSrchModal" :dataParams="params" @getEduCousPopRowData="getEduCousPopRowData"></EduCousSrchPop>
        <GmdlUseHistPop ref="GmdlUseHistModal" :dataParams="params" ></GmdlUseHistPop>
    </div>
</template>

<script>

import { reactive, ref, inject }    from 'vue'
import Grid                         from '@/components/grid/Grid.vue'
import SetButton                    from '@/components/SetButton.vue'
import BetweenDatepicker            from '@/components/datepicker/BetweenDatepicker.vue'
import { CmonUtil }                 from '@/utils/CmonUtil'
import { DateUtil }                 from '@/utils/DateUtil'
import { ValdUtil }                 from '@/utils/ValdUtil.js'
import EduCousSrchPop               from '@/views/rept/stat/EduCousSrchPop.vue'
import GmdlUseHistPop               from '@/views/rept/stat/GmdlUseHistPop.vue'

export default {
    components: {
        Grid
       ,SetButton
       ,BetweenDatepicker
       ,EduCousSrchPop
       ,GmdlUseHistPop
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

        // console.log(' ########### code.gmdlCdList : ', code.gmdlCdList);

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
            }
           ,statCdList : [
                {cdVal : '50' ,cdNm:'관리자'}
               ,{cdVal : '30' ,cdNm:'강사'}
               ,{cdVal : '20' ,cdNm:'교육생'}
            ]
           ,gmdlUseSpec : ''
           ,name : 'GmdlUseHist.vue'
        }
    },
    methods: {
        init: function() { 
            const $this = this;
            $this.initParams();
            $this.initGrid();
        },
        // 검색조건 초기화
        initParams(){
            const $this = this;
            let data = CmonUtil.getPageLink('H1020');
            if(ValdUtil.isNotNull(data)){
                $this.params.frDt    = data.frDt;
                $this.params.toDt    = data.toDt;
                $this.params.user    = data.userId;
            } else {
                let currDt           = DateUtil.getCurrDate();
                $this.params.frDt    = DateUtil.addDay(currDt, -30); 
                $this.params.toDt    = currDt;
                $this.params.ecousNo = '';
                $this.params.ecousNm = '';
                $this.params.gmdlNo  = '';
                $this.params.user    = '';
                $this.params.userDiv = '';
            }
        },

        resetScreen(){
            const $this = this;
            console.log(">>>>>>>>>>>>>>>>");
            //  검색조건 초기화
            $this.initParams();
            //  Grid 초기화
            $this.initGrid();
            // $this.searchListGmdlBase();
        },
        initGrid() {
            let $this = this;
            $this.gridObj = {
                url: '/rept/stat/gmdlUseHist/selectListGmdlUseHist.hb',
                colModels : [
                    { name : 'useNo'       , label : '이력번호'    , width : 7  , align : 'center'  },
                    { name : 'qustDt'      , label : '발생일자'    , width : 7  , align : 'center' , formatter: $this.formatDate },
                    { name : 'qustTm'      , label : '발생시각'    , width : 7  , align : 'center' , formatter: $this.formatTime },
                    { name : 'gmdlCntn'    , label : '사용GPT모델' , width : 17 , align : 'left'    },
                    { name : 'userDivNm'   , label : '구분'        , width : 7  , align : 'center'  },
                    { name : 'userId'      , label : '사용자ID'    , width : 7  , align : 'left'    },
                    { name : 'userNm'      , label : '사용자명'    , width : 7  , align : 'center'  },
                    { name : 'ecousNm'     , label : '교육과정'    , width : 23 , align : 'left'    },
                    { name : 'qustCntn'    , label : '질의내용'    , width : 23 , align : 'left',
                        formatter: function (cellvalue) {
                            var text = cellvalue || "";
                            var safe = $.jgrid.htmlEncode(text);

                            return '' +
                            '<div style="white-space: nowrap; overflow: hidden; ' +
                                    'text-overflow: ellipsis; width: 100%; display: inline-block;" ' +
                                'title="' + safe + '">' +
                                safe +
                            '</div>';
                        }
                    },
                    { name : 'totalCnt'    , label : '합계'        , width : 7  , align : 'right'  , formatter:'integer' , formatoptions : { defaultValue: '', thousandsSeparator: ',' } },
                    { name : 'qustToknCnt' , label : '질의'        , width : 7  , align : 'right'  , formatter:'integer' , formatoptions : { defaultValue: '', thousandsSeparator: ',' } },
                    { name : 'answToknCnt' , label : '응답'        , width : 7  , align : 'right'  , formatter:'integer' , formatoptions : { defaultValue: '', thousandsSeparator: ',' } },
                    { name : 'specSrch'    , label : '상세'        , width : 7  , align : 'center' ,
                        formatter() {
                            return '<button id="gridCellRequLogBtn" style="color: #00b4ff; border-color: #00b4ff; height:18px; width: 55px;">상세보기</button>';
                        }
                    },
                    { name : 'answCntn'    , label : '응답내용'    , width : 29 , align : 'left'   , hidden : true},
                ],
                options: {
                    onCellSelect(rowid, icol, val ,event){
                        let gridData         = $(this).jqGrid('getRowData', rowid);
                        let colNm            = $(this).jqGrid('getGridParam', 'colModel')[icol].name;
                        $this.gmdlUseSpec.useNo = gridData.useNo;
                        $this.gmdlUseSpec.qustCntn = gridData.qustCntn;
                        $this.gmdlUseSpec.answCntn = gridData.answCntn;
                        // 상세보기 버튼
                        if(colNm =='specSrch'){
                            $this.popUpGmdlUseHist();
                        }
                    },
                }
            };
            $this.$refs.modlUseHistGrid.init($this.gridObj);
            $this.searchListGmdlBase();
        },
        onSelectedBetweenDatepicker(selectedDate) {
            const $this = this;
            $this.params.frDt = selectedDate.frDt;
            $this.params.toDt = selectedDate.toDt;
            // $this.alert($this.params.toDt);
        },
        searchListGmdlBase(){
            const $this = this;
            // console.log(' ########### params :', $this.params);
            if(!$this.isValid ()){
                return false;
            };
            $this.$refs.modlUseHistGrid.selectList(true);
        },
        //vald 체크
        isValid() {
            const $this = this;
            // null 체크 및 길이 체크 (data / 길이 / msg / null 체크 여부=디폴트 true)
            if(ValdUtil.isNull($this.params.frDt) || ValdUtil.isNull($this.params.toDt)) {
                $this.alert('교육기간을 선택하세요');
                return false;
            }

            return true;
        },
        //교육과정 검색 팝업
        popUpEduCousSrch(){
            const $this = this;
            $this.$refs.EduCousSrchModal.show();
            $this.$refs.EduCousSrchModal.initGrid();
        },
        //모델사용이력 상세보기 검색 팝업
        popUpGmdlUseHist(){
            const $this = this;
            $this.alert('아직 지원하지 않는 기능입니다.');
            return false;

            // 향후 오픈
            // $this.$refs.GmdlUseHistModal.show();
            // $this.$refs.GmdlUseHistModal.init($this.gmdlUseSpec);
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
        // 엑셀다운로드        
        downloadExcel(){        
            const $this = this;
            
            if($this.$refs.modlUseHistGrid.getGridObj().jqGrid('getGridParam','records') < 1) {
                $this.alert('검색된 모델사용이력 목록이 없습니다.');
                return false;
            }
            let labelsArray = $this.gridObj.colModels.map((obj) => {
                return obj.label;
            });

            let url = '/rept/stat/gmdlUseHist/selectListGmdlUseHistExcel.hb';
            let param = $this.params;
            param.excelHeader = labelsArray;
            let fileNm = '모델사용이력_' + DateUtil.getCurrDate('YYYYMMDD') + '.xlsx';
            
            this.doDownExcel(url, param, fileNm);
        },
        // 공통버튼(초기화, 조회, 저장, 삭제) 컴포넌트 핸들러
        onSetButtonClick(div) {
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.resetScreen();
                    break;
                case 'select':
                    $this.searchListGmdlBase();
                    break;
                default:
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
