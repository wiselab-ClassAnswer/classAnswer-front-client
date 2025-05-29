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
                    <div class="w-13 ib">
                        <h2>교육과정번호</h2>
                        <input ref="ecousNo" v-model="srchParams.ecousNo" type="text" v-on:keyup.enter="onSetButtonClick('select')">
                    </div>
                    <div class="w-13 ib">
                        <h2>교육과정명</h2>
                        <input type="text" v-model="srchParams.ecousNm" v-on:keyup.enter="onSetButtonClick('select')">
                    </div>
                    <div class="w-13 ib">
                        <h2>강사명</h2>
                        <input type="text" v-model="srchParams.lectNm" v-on:keyup.enter="onSetButtonClick('select')">
                    </div>
                    <div class="w-13 ib">
                        <h2>가용모델</h2>
                        <select v-model="srchParams.gmdlNo" @change="onSetButtonClick('select')">
                            <option v-for="el in code.useGmdlList" :key="el.colId" :value="el.colId">{{el.colId}}</option>
                        </select>
                    </div>
                    <div class="w-13 ib">
                        <h2>수강생ID</h2>
                        <input ref="userId" v-model="srchParams.userId" type="text" v-on:keyup.enter="onSetButtonClick('select')">
                    </div>
                    <div class="w-30 ib">
                        <label>
                            <input type="checkbox" class="ha p-rl wd-20" true-value="Y" false-value="N" 
                                v-model="srchParams.isEndCousYn" style="top:1px; left: 0px;" @change="onSetButtonClick('select')">
                            <p>종료된 교육은 제외합니다</p>
                        </label>
                    </div>
                </div>
            </div>
        </div>    
        <!-- 교육과정 목록 -->
        <div class="section section2 w-45">
            <div class="section-wrap">
                <h2 class="ib">교육과정 목록</h2>
                <button class="btn-exel-download only" v-on:click="downloadExcel('ecous')">
                    <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                    <p>다운로드</p>
                </button>                
                <!-- 그리드 -->
                <div class="wrapper-content">
                    <Grid ref="ecousGrid" :dataParams="srchParams" :paging="false"></Grid>
                </div>
            </div>
        </div>

        <!-- 상세정보 -->
        <div class="section section3 w-55">
            <div class="section-wrap">
                <h2 class="ib">수강생현황</h2>
                <div class="t-a-r btn-group-box">
                    <button class="btn-normal ib" @click="setPgLink('M1040')">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'caret-right']" />
                        <p class="ib">교육과정 관리</p>
                    </button>
                    <button class="btn-exel-download" v-on:click="downloadExcel('stdt')">
                        <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                        <p>다운로드</p>
                    </button>
                </div>
                <!-- 그리드 -->
                <div class="wrapper-content">
                    <Grid ref="stdtGrid" :dataParams="rowData" :paging="false"></Grid>
                </div>
            </div>
        </div>
        <StdtLimtMngPop ref="stdtLmitMngPop" :dataParams="params" @userLmitData="getPopData" ></StdtLimtMngPop>
    </div>
</template>

<script>

import { reactive, ref, inject } from 'vue'
import Grid                      from '@/components/grid/Grid.vue'
import SetButton                 from '@/components/SetButton.vue'
import Datepicker                from '@/components/datepicker/Datepicker.vue'
import { DateUtil }              from '@/utils/DateUtil.js'
import { ValdUtil }              from '@/utils/ValdUtil'
import { CmonUtil }              from '@/utils/CmonUtil'
import moment                    from "moment";
import BetweenDatepicker         from '@/components/datepicker/BetweenDatepicker.vue'
import Timepicker                from '@/components/datepicker/Timepicker.vue'
import StdtLimtMngPop            from './StdtLimtMngPop.vue'
export default {
    components: {
        Grid,
        SetButton,
        Datepicker,
        BetweenDatepicker,
        Timepicker,
        StdtLimtMngPop
    },

    setup() {
        let objectId     = Math.random().toString(36);
        objectId         = objectId.replaceAll('.', '');

        let code = reactive({
            gmdlKIndCdList : [],
            useGmdlList    : [],
        })

        const colIdNmListData = { 'tblId'   :'tm_gmdl_base',
                                  'colId'   :'gmdl_no',
                                  'colNm'   :'gmdl_cntn',
                                  'where'   : [
                                    {'andCol' :'1',
                                     'andCalc':'=',
                                     'andVal' :"'1'"}
                                  ],
                                  'orderby' : [
                                    {'orderCol' : 'gmdl_no'}
                                   ,{'orderCol' : 'gmdl_cntn'}
                                  ]
        };  
        const getColIdNmList = inject('getColIdNmList');
        getColIdNmList(colIdNmListData, code.useGmdlList, 'Y', null);


        const getCmonCdList = inject('getCmonCdList');
        getCmonCdList('GMDL_KIND_CD', code.gmdlKIndCdList, 'Y', null);  // YN / YN
        return {
            code,
            objectId
        }
    },

    data: function() {
      return {
            params : {
                selEcousNo  : '',
                isCellSlct  : false,
            },
            srchParams : { 
                ecousNo     : '',
                ecousNm     : '',
                lectNm      : '',
                gmdlNo      : '',
                isEndCousYn : 'Y',
                userId      : '',
            },
            rowData  : '',

        }
    },

    methods: {
        init(data) {
            const $this = this;
            if(ValdUtil.isNull(data)){
                data = this.CmonUtil.getPageLink('M1050');
            } 
            $this.initData(data);
            $this.initEcousGrid();
            $this.initStdtGrid();
            $this.$nextTick(()=>{
                $this.selectListEcousGrid();
            });
            $this.CmonUtil.setFocus($this.$refs.ecousNo);
        },
        initData(data){
            const $this = this;
            
            $this.initParams();
            $this.initSrchParams(data);
            $this.resetGrid();
        },
        initParams(){
            const $this = this;
            $this.rowData           = '';
        },
        initSrchParams(data){
            const $this = this;
            if(ValdUtil.isNotNull(data)){        
                $this.srchParams.ecousNo     = data.ecousNo;
                $this.srchParams.ecousNm     = data.ecousNm;
                $this.srchParams.lectNm      = data.lectNm;
                $this.srchParams.gmdlNo      = data.gmdlNo;
                $this.srchParams.isEndCousYn = data.isEndCousYn;
                $this.srchParams.userId      = data.userId;
                $this.params.isCellSlct      = true;
                $this.params.selEcousNo      = data.ecousNo;
            } else {
                $this.srchParams.ecousNo     = '';
                $this.srchParams.ecousNm     = '';
                $this.srchParams.lectNm      = '';
                $this.srchParams.gmdlNo      = '';
                $this.srchParams.isEndCousYn = 'Y';
                $this.srchParams.userId      = '';
                $this.params.isCellSlct      = false;
                $this.params.selEcousNo      = '';
            }
        },
        // 그리드 초기화
        resetGrid(){
            const $this = this;
            
            $this.$refs.ecousGrid.clearGridData();
            $this.$refs.stdtGrid.clearGridData();
        },
        // 조회
        searchList(){
            const $this = this;
            $this.rowData     = '';
            $this.initEcousGrid();
            $this.initStdtGrid();
            $this.selectListEcousGrid();
        },
        // 교육과정목록 그리드
        initEcousGrid() {
            let $this = this;

            let ecousGridObj = {
                url: '/cmon/sys/stdtMng/selectListEcousList.hb',
                colModels: [
                    {name:'ecousNo'     ,label: '교육과정번호' , width: 40   , align:'center' , key : true},
                    {name:'ecousNm'     ,label: '교육과정명'   , width: 100  , align:'left'   },
                    {name:'gmdlNo'      ,label: '가용모델번호' , width: 100  , align:'left'   , hidden : true },
                    {name:'lectId'      ,label: '강사아이디'   , width: 10   , align:'left'   , hidden : true },
                    {name:'lectNm'      ,label: '강사명'       , width: 50   , align:'center' },
                    {name:'stdtCnt'     ,label: '교육생수'     , width: 30   , align:'right'  , formatter:$this.thousandComma },
                    {name:'ecousStrtDt' ,label: '교육시작일'   , width: 30   , align:'center' , formatter:$this.formatDate },
                    {name:'ecousEndDt'  ,label: '교육종료일'   , width: 30   , align:'center' , formatter:$this.formatDate },
                ],
                options: {
                    onSelectRow : function(rowid){
                        let gridData = $(this).jqGrid('getRowData',rowid);
                        $this.rowData = gridData;
                        $this.params.selEcousNo = gridData.ecousNo;
                        $this.$nextTick(()=>{
                            $this.selectListStdtGrid();
                        });
                    },
                    gridComplete: function(){
                        if($this.params.isCellSlct){
                            if(ValdUtil.isNotNull($this.params.selEcousNo)){
                                $(this).jqGrid('setSelection', $this.params.selEcousNo);
                            }
                        }
                    },
                },
            };
            $this.$refs.ecousGrid.init(ecousGridObj);
        },
        // 그리드 조회
        selectListEcousGrid(){
            const $this = this;
            $this.$refs.ecousGrid.selectList(true);
        },
        // 수강생 현황 그리드
        initStdtGrid() {
            let $this = this;
            let isGroupHeaderSet = false;

            let stdtGridObj = {
                url: '/cmon/sys/stdtMng/selectListStdtList.hb',
                colModels: [
                    {name:'gmdlNo'        ,label: '교육모델번호'         , width: 30   , align:'center' , hidden: true },
                    {name:'ecousNo'       ,label: '교육과정번호'         , width: 30   , align:'center' , hidden: true },
                    {name:'ecousNm'       ,label: '교육과정명'           , width: 30   , align:'center' , hidden: true },
                    {name:'userId'        ,label: '수강생ID'             , width: 30   , align:'center' },
                    {name:'totTokn'       ,label: '사용량'               , width: 30   , align:'right'  , formatter:$this.thousandComma },
                    {name:'lmitTokn'      ,label: '허용량'               , width: 30   , align:'right'  , formatter:$this.thousandComma },
                    {name:'useRt'         ,label: '사용자제한 대비(%)'   , width: 40   , align:'right'  
                        ,formatter(cellValue,options,rowObject){
                            return CmonUtil.addThousandComma(cellValue) + '%';
                        }
                        ,unformat: function(cellValue) {
                            return cellValue;
                        }
                    },
                    {name:'gmdlLmitResnCd',label: '제한사유코드'        , width: 100  , align:'left'   , hidden : true},
                    {name:'gmdlLmitResnNm',label: '제한사유'            , width: 100  , align:'left'   },
                    {name:'lmitResn'      ,label: '제한내용'            , width: 100  , align:'left'   , hidden : true},
                    {name:'lmitProc'      ,label: '제한처리'            , width: 50   , align: 'center'
                        ,formatter(cellValue, options, rowObject) {
                            const uuId = $this.objectId+'_'+options.rowId;
                            return  `<div class="w-100" style="gap:3px; align-items: center; display: flex; justify-content: center;">
                                        <button id="lmit-${uuId}" class="btn-normal p-0 ib" style="color:green; border-color:green;">사용제한</button>
                                        <button id="rels-${uuId}" class="btn-normal p-0 ib" style="color:orange; border-color:orange;">변경/해제</button>
                                    </div>`;
                        }
                    },
                    {name:'gmdlLmitNo'    ,label: '제한번호'            , width: 100  , align:'left'   , hidden : true},
                    {name:'gmdlLmitYn'    ,label: '제한여부'            , width: 100  , align:'left'   , hidden : true},
                    {name:'gmdlLmitObjCd' ,label: '제한대상코드'        , width: 100  , align:'left'   , hidden : true},
                    {name:'gmdlLmitObjNm' ,label: '제한대상명'          , width: 100  , align:'left'   , hidden : true},
                ],
                options: {
                    height      : 524,
                    rownumbers  : true,
                    onSelectRow : function(rowid){
                    },
                    onCellSelect(rowid,iCol,val,e) {
                        if (e && e.target.tagName == 'BUTTON') {
                            let btnId    = e.target.id;
                            let btnType  = btnId.split('-')[0];
                            let gridData = $(this).jqGrid('getRowData',rowid);
                            $this.openPop(btnType, gridData);
                        }
                    },
                    gridComplete() {
                        if(!isGroupHeaderSet) {
                            $(this).jqGrid('setGroupHeaders', {
                                useColSpanStyle: true,
                                groupHeaders: [
                                    {startColumnName: 'totTokn', numberOfColumns: 2, titleText: '교육토큰사용량'}
                                ]
                            });
                            // 플래그 설정 (groupHeader 중복 생성 방지)
                            isGroupHeaderSet = true;    
                        }
                        // 버튼 disabled 처리
                        const rowIds = $(this).jqGrid('getDataIDs');
                        rowIds.forEach(rowId => {
                            const rowData = $(this).jqGrid('getRowData', rowId);
                            // 제한버튼 disabled 처리
                            if (rowData.gmdlLmitYn === 'Y') {
                                // jquery 객체
                                let btn = $(`#lmit-${$this.objectId}_${rowId}`); 
                                btn.prop('disabled', true);
                                btn.addClass('btn-disabled');
                            }
                            // 변경 / 해제 disabled 처리
                            else if(rowData.gmdlLmitYn === 'N'){
                                //jquery 객체
                                let btn = $(`#rels-${$this.objectId}_${rowId}`);
                                btn.prop('disabled', true);
                                btn.addClass('btn-disabled');
                            }
                        });
                    }
                },
            };
            $this.$refs.stdtGrid.init(stdtGridObj);
        },
        // 수강생 현황 그리드 조회
        selectListStdtGrid(){
            const $this = this;
            $this.$refs.stdtGrid.selectList(true);
        },
        // 팝업 호출
        openPop(btnType, gridData) {
            const $this = this;
            gridData['isPageDiv'] = btnType;
            $this.$refs.stdtLmitMngPop.show();
            $this.$refs.stdtLmitMngPop.init(gridData);
        },
        // 팝업 리턴 데이터
        getPopData(popRowData) {
            const $this = this;
            
            if(ValdUtil.isNotNull(popRowData)){
                $this.params.isCellSlct = true;
                $this.params.selEcousNo = popRowData.ecousNo;
                $this.resetGrid();
                $this.selectListEcousGrid();
            }
        },
        // 엑셀다운로드        
        downloadExcel(div){
            const $this = this;
            let url        = '';
            let param      = _.cloneDeep($this.srchParams);
            let currDt     = DateUtil.getCurrDate('YYYYMMDD');
            let fileNm     = '';
            let gridObj    = '';
            if(div === 'ecous'){
                url     = '/cmon/sys/stdtMng/selectListEcousListDownExcel.hb';
                fileNm  = '교육과정_목록_';
                gridObj = $this.$refs.ecousGrid.getGridObj();
            } else if(div === 'stdt'){
                url     = '/cmon/sys/stdtMng/selectListStdtListDownExcel.hb';
                param   = _.cloneDeep($this.rowData);
                fileNm  = '수강생현황_목록_';
                gridObj = $this.$refs.stdtGrid.getGridObj();
            } else {
                $this.alert('엑셀다운로드 대상이 없습니다');
                return false;
            }
            let exclFileNm = fileNm + currDt + ".xlsx"; 
            
            if(gridObj.jqGrid('getGridParam','records') < 1) {
                $this.alert('엑셀다운로드 대상이 없습니다');
                return false;
            }
            $this.doDownExcel(url, param, exclFileNm);
        },
        //페이지 이동
        setPgLink(pageNo){
            const $this = this;
            let params = {
                ecousNo     : $this.rowData.ecousNo,
                ecousNm     : $this.rowData.ecousNm,
                gmdlNo      : $this.rowData.gmdlNo,
                lectId      : $this.rowData.lectId,
                lectNm      : $this.rowData.lectNm,
                stdtCnt     : $this.rowData.stdtCnt,
                ecousStrtDt : $this.rowData.ecousStrtDt,
                ecousEndDt  : $this.rowData.ecousEndDt
            }
            CmonUtil.setPageLink(pageNo, params);
        },

        // 공통버튼(초기화, 조회, 저장, 삭제) 컴포넌트 핸들러
        onSetButtonClick (div) {
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.init();
                    break;
                case 'select':
                    $this.searchList();
                    $this.$refs.stdtGrid.clearGridData();
                    break;
                case 'save':
                    break;
                case 'delete':
                    break;
                default:
                    $this.alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
        },
       
    },
    computed: {
    },
    mounted: function() {
        const $this = this;
        $this.init();
    }   
}
</script>
<style>
/* 그리드 내 버튼 제어 */
.btn-disabled {
  color: #fff !important;
  border-color: gray !important;
  background-color: gray !important;
  cursor: not-allowed;
}

</style>