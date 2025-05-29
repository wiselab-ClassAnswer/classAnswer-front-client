<template>
    <div>
        <!-- 검색 조건 -->
        <div class="section section1">
            <div class="search-box">
                <div class="input-box">
                    <div class="w-5 ib">
                        <h1>검색조건</h1>
                    </div>
                    <div class="w-20 ib">
                        <h2 class="wd-50 essn ib">이행셋</h2>
                        <select ref="csetNo" class="c-wd-50 ib" v-model="srchParam.csetNo" @change="selectCsetNo()">
                            <option value = ''></option>
                            <option v-for="el in csetList" :key="el.colId" :value="el.colId">{{el.colId + ' | ' +el.colNm}}</option>
                        </select>                    
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-40 ib">검색어</h2>
                        <input class="c-wd-40 ib" type="text"  v-model="srchParam.srchWord" v-on:keyup.enter="selectListJsetMng()" ref="srchJset" :disabled="ValdUtil.isNull(srchParam.csetNo)">
                    </div>
                    <div class="w-13 ib">
                        <label class="w-100 p-rl" style="top:-1px; left:8px">
                            <input class="w-6 ib m-r-5 f-l h-a" type="checkbox" true-value="Y" false-value="N" v-model="srchParam.isNotAlocJset" :disabled="ValdUtil.isNull(srchParam.csetNo)" @change="selectListJsetMng()">
                            <span class="w-80" style="font-size:12px">미할당 워크스페이스 조회</span>
                        </label>
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showTest="false" :showInit="true" :showSelect="true" :showSave="true" :showDelete="true" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>
        <!-- 작업셋 목록 -->
        <div class="section sectionL w-25">
            <div class="section-wrap p-t-20">
                <h2 class="ib m-b-11">작업셋 목록</h2>
                <!-- 그리드 -->
                <div class="wrapper-content">
                    <Grid ref="JsetGrid" :paging="false" :dataParams="srchParam"></Grid>
                </div>
            </div>
        </div>
        <!-- 상세구성정보 -->
        <div class="section sectionR w-75">
            <div class="section-wrap">
                <!--작업셋상세정보-->
                <div class="section-part part1 w-57 ib">
                    <div class="w-50 ib">
                        <h2 class="ib w-40">작업셋상세정보</h2>               
                    </div>
                    <div class="w-50 ib t-a-r f-r" style="height:27px; overflow:hidden">        
                        <button class="btn-normal wd-80 ib " @click="resetJsetInfo()" style="height:27px;">
                            <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                            <p class="ib">초기화</p>
                        </button>
                    </div>
                    <div class="w-48 p-b-5">
                        <span class="wd-70 essn">작업셋번호</span>
                        <input class="c-wd-90" type="text" v-model="jsetInfo.jsetNo" :disabled="ValdUtil.isNull(srchParam.csetNo)">
                    </div>
                    <div class="w-52 p-b-5">
                        <span class="wd-55 essn">작업셋명</span>
                        <input class="c-wd-55" type="text" v-model="jsetInfo.jsetNm">
                    </div>
                    <div class="w-100 b p-b-5">
                        <span class="wd-70">작업셋설명</span>
                        <input class="c-wd-70" type="text" v-model="jsetInfo.rmrk">
                    </div>
                    <div class="w-100 b">
                        <span class="wd-70">작업할당</span>
                        <div class="c-wd-70 ib">
                            <div class="w-80 ib">
                                <input class="w-47" type="text" v-model="jsetInfo.wkspNm" disabled>
                                <input class="w-15 t-a-c" type="text" v-model="jsetInfo.execCyclNm" disabled>
                                <input class="w-15 t-a-c" type="text" v-model="jsetInfo.execTpntVal" disabled>
                                <button class="btn-normal w-20 ib p-rl" style="margin-left:5px; top:-1px" @click="setPageLink('O2040')" :disabled="jsetInfo.wkspNm == ''">
                                    <font-awesome-icon class="ib m-r-5" :icon="['fas', 'up-right-from-square']" />
                                    <p class="ib">워크플로우</p>
                                </button>  
                            </div>
                            <!-- 그리드 행 이동 버튼-->
                            <div class="w-20 ib f-r p-rl" style="overflow:heidden; top:3px;">
                                <div class="flex f-r m-b-0">
                                    <div class="wd-27 m-r-3 pointer t-a-c" @click="topRows()" style="border-radius:3px; border:1px solid #c4c4c4">
                                        <img class="wd-25" src="@/assets/img/btn_move_grid_ht2.png" title="클릭하면 현재 선택(체크)한 단위작업들을 모두 맨 위로 이동합니다">
                                    </div>
                                    <div class="wd-27 m-r-3 pointer t-a-c" @click="upRows()" style="border-radius:3px; border:1px solid #c4c4c4">
                                        <img class="wd-25" src="@/assets/img/btn_move_grid_t2.png" title="클릭하면 현재 선택(체크)한 단위작업을 모두 위로 1칸 이동합니다">
                                    </div>
                                    <div class="wd-27 m-r-3 pointer t-a-c" @click="downRows()" style="border-radius:3px; border:1px solid #c4c4c4">
                                        <img class="wd-25" src="@/assets/img/btn_move_grid_b2.png" title="클릭하면 현재 선택(체크)한 단위작업을 모두 아래로 1칸 이동합니다">
                                    </div>
                                    <div class="wd-27 pointer t-a-c" @click="bottomRows()" style="border-radius:3px; border:1px solid #c4c4c4">
                                        <img class="wd-25" src="@/assets/img/btn_move_grid_bm2.png" title="클릭하면 현재 선택(채크)한 단위작업들을 모두 맨 아래로 이동합니다">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-100  m-t-0">
                        <div class="wrapper-content w-100 ib">
                            <Grid ref="UnitJobGrid" :paging="false" :dataParams="jsetInfo"></Grid>
                        </div>
                    </div>
                </div>
                <!--단위작업 이동버튼-->
                <div class="section-part part1 w-3 t-a-c ib p-rl" style="bottom:210px">
                    <div class="w-100">
                        <div class="wd-30 m-b-7 pointer" @click="moveGrid('UnitJobFltrGrid')" style="border-radius:4px; border:1px solid #ddd">
                            <img class="wd-27" src="@/assets/img/btn_move_grid_al.png" title="클릭하면 현재 선택(체크)한 우측의 단위작업들을 좌측목록으로 이동합니다">
                        </div>
                        <div class="wd-30 m-b-7 pointer" @click="moveGrid('UnitJobFltrGrid')" style="border-radius:4px; border:1px solid #ddd">
                            <img class="wd-27" src="@/assets/img/btn_move_grid_l.png" title="클릭하면 현재 선택한 좌측의 단위작업을 좌측목록으로 이동합니다" >
                        </div>
                        <div class="wd-30 pointer" @click="moveGrid('UnitJobGrid')" style="border-radius:4px; border:1px solid #ddd">
                            <img class="wd-27" src="@/assets/img/btn_move_grid_r.png" title="클릭하면 현재 선택한 좌측의 단위작업을 우측으로 이동합니다">
                        </div>
                    </div>
                </div>
                <!--단위작업목록 필터링-->
                <div class="section-part part1 w-40 f-r ib">
                    <h2 class="ib w-100">단위작업목록</h2>               
                    <div class="w-100 m-b-12 m-t-10">
                        <span class="wd-70 ib">작업유형</span>
                        <div class="c-wd-70 ib input-check">
                            <label class="ib p-rl ib m-r-15">
                                <input class="wd-15 ib h-a m-0" type="checkbox" true-value="TRUC" false-value="N"  @change="chkUnitJobDivCd('TRUC')" v-model="srchParam.TRUC">
                                <p class="ib p-l-5 m-0 p-rl" style="font-size:12px; top:-2px">{{'전체삭제'}}</p>
                            </label>
                            <label class="ib p-rl ib m-r-15">
                                <input class="wd-15 ib h-a m-0" type="checkbox" true-value="DETL" false-value="N"  @change="chkUnitJobDivCd('DETL')" v-model="srchParam.DETL">
                                <p class="ib p-l-5 m-0 p-rl" style="font-size:12px; top:-2px">{{'삭제'}}</p>
                            </label>
                            <label class="ib p-rl ib m-r-15">
                                <input class="wd-15 ib h-a m-0" type="checkbox" true-value="ISRT" false-value="N"  @change="chkUnitJobDivCd('ISRT')" v-model="srchParam.ISRT">
                                <p class="ib p-l-5 m-0 p-rl" style="font-size:12px; top:-2px">{{'등록'}}</p>
                            </label>
                            <label class="ib p-rl ib m-r-15">
                                <input class="wd-15 ib h-a m-0" type="checkbox" true-value="UPDT" false-value="N"  @change="chkUnitJobDivCd('UPDT')" v-model="srchParam.UPDT">
                                <p class="ib p-l-5 m-0 p-rl" style="font-size:12px; top:-2px">{{'수정'}}</p>
                            </label>
                            <label class="ib p-rl ib m-r-15">
                                <input class="wd-15 ib h-a m-0" type="checkbox" true-value="ETC" false-value="N"  @change="chkUnitJobDivCd('ETC')" v-model="srchParam.ETC">
                                <p class="ib p-l-5 m-0 p-rl" style="font-size:12px; top:-2px">{{'기타'}}</p>
                            </label>
                        </div>
                    </div>
                    <div class="w-100 m-b-10">
                        <span class="wd-70 ib">미할당건 조회</span>
                        <div class="c-wd-70 ib input-check p-rl" style="top:2px;">
                            <input type="checkbox" class="ib wd-15" style="height:auto" v-model="srchParam.isNotAlocUnitJob" true-value="Y" false-value="N" @change="selectListUnitJobFltr()">
                        </div>
                    </div>
                    <div class="w-100 p-b-5"> 
                        <span class="wd-70 ib">검색어</span>
                        <input class="c-wd-180 ib" type="text" v-model="srchParam.fltrSrchWord" @keyup.enter="selectListUnitJobFltr()">
                        <button class="btn-normal f-r wd-100 ib" @click="selectListUnitJobFltr()">
                            <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                            <p class="ib">필터링</p>
                        </button>
                    </div>
                    <!-- 그리드 -->
                    <div class="wrapper-content w-100 ib">
                        <Grid ref="UnitJobFltrGrid" :paging="false" :dataParams="srchParam"></Grid>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { inject,reactive }  from 'vue'
import { GridUtil }         from '@/utils/GridUtil.js'
import { CmonUtil }         from '@/utils/CmonUtil.js'
import { ValdUtil }         from '@/utils/ValdUtil.js'
import Grid                 from '@/components/grid/Grid.vue'
import SetButton            from '@/components/SetButton.vue'

export default {
    components: {
        Grid
        ,SetButton
    }
    ,setup() {
        //이행셋조회        
        const getColIdNmList = inject('getColIdNmList');
        const csetListData = {  'tblId'  :'tdm.tm_cset_base'
                                  ,'colId'  :'cset_no'
                                  ,'colNm'  :'conv_ver'
                                  ,'where'  : [
                                  ]
                                  ,'orderby' : [
                                    {'orderCol' : 'cset_no'}
                                  ]
        };  
        const csetList = reactive([]);
        getColIdNmList(csetListData, csetList, 'N', null);

        //단위작업유형코드 리스트        
        const getCmonCdList = inject('getCmonCdList');
        const unitJobTypeCdList = reactive([]);
        getCmonCdList('UNIT_JOB_TYPE_CD', unitJobTypeCdList, 'N', null);

        return {
            csetList
            ,unitJobTypeCdList
        }
    }
    ,data() {
      return {
            //조회 조건
            srchParam: {
                csetNo: ''           //이행셋번호
                ,srchWord: ''        //검색어
                ,isNotAlocJset: ''   //미할당작업셋
                ,isNotAlocUnitJob: ''  //미할당단위작업
                ,unitJobTypeList: []  //작업유형리스트
                ,TRUC:''
                ,DETL:''
                ,ISRT:''
                ,UPDT:''
                ,ETC:''
                ,fltrSrchWord: ''     //필터링검색어
            }
            //작업셋 정보
           ,jsetInfo: {
                csetNo: ''           //이행셋번호
                ,jsetNo: ''          //작업셋번호
                ,jsetNm: ''          //작업셋명
                ,rmrk: ''            //비고
                ,wkspId: ''          //워크스페이스ID
                ,wkspNm: ''          //워크스페이스명
                ,execCyclNm:''       //실행주기
                ,execTpntVal:''      //실행시점
            }
            //상세 조회 조건
           ,detlSrchParam: {
            }
            ,unitJobListAll: []        //단위작업 전체 리스트
            ,unitJobFltrList: []       //단위작업 필터 리스트
            ,saveDiv: 'insert'         //저장구분
        }
    }
    ,methods: {
        // 초기화
        init() {  
            CmonUtil.setFocus(this.$refs.csetNo);
            this.resetData(this.srchParam);
            this.resetData(this.detlSrchParam);
            this.resetData(this.jsetInfo);
            this.unitJobListAll = [];
            this.unitJobFltrList = [];
            this.saveDiv = 'insert';
            this.clearGridList('JsetGrid');
            this.clearGridList('UnitJobGrid');
            this.clearGridList('UnitJobFltrGrid');
            this.initGrid();
            this.srchParam.isNotAlocUnitJob = 'Y'
            this.srchParam.TRUC = 'TRUC'
            this.srchParam.DETL = 'DETL'
            this.srchParam.ISRT = 'ISRT'
            this.srchParam.UPDT = 'UPDT'
            this.srchParam.ETC = 'ETC'
            this.initData();
        }
        ,initData(){ 
            let data = CmonUtil.getPageLink('O2010');
            if(!ValdUtil.isEmptyJson(data)){
                this.srchParam.csetNo   = data['csetNo'];
                this.srchParam.srchWord = data['jsetNo'];
            }
            if(ValdUtil.isNotNull(this.srchParam.csetNo)){
                this.selectListJsetMng();
            }
        }
        //그리드 초기화
        ,initGrid() {
            const $this = this;

            //작업셋 목록 그리드
            let JsetGridData = {
                url: '/mng/job/jsetMng/selectListJsetMng.hb'
                ,colModels : [
                    {name: 'csetNo'      ,label: '이행셋번호'      ,hidden:true ,sortable:true}
                    ,{name: 'wkspId'     ,label: '워크스페이스ID'  ,hidden:true ,sortable:true}
                    ,{name: 'wkspNm'     ,label: '워크스페이스명'  ,hidden:true ,sortable:true}
                    ,{name: 'jsetNo'     ,label: '작업셋번호'      ,width: 100  ,align: 'center' ,sortable:true}
                    ,{name: 'jsetNm'     ,label: '작업셋명'        ,width: 100  ,align: 'left'   ,sortable:true}
                    ,{name: 'wkspAlocYn' ,label: 'WS할당'          ,width: 40   ,align: 'center' ,sortable:true}
                ]
                ,options: {
                     loadonce:true
                    ,rownumbers: true
                    ,onSelectRow : function(rowid) {
                        $this.resetData(this.jsetInfo);
                        $this.resetData(this.detlSrchParam);
                        $this.clearGridList('UnitJobGrid');
                        $this.clearGridList('UnitJobFltrGrid');
                        $this.saveDiv = 'update';
                        $this.jsetInfo.csetNo = $(this).jqGrid('getRowData', rowid).csetNo;
                        $this.jsetInfo.jsetNo = $(this).jqGrid('getRowData', rowid).jsetNo;
                        $this.srchJsetDetl($this.unitJobListFltr);
                    }
                    ,gridComplete(){
                        $(this).jqGrid("resetSelection");
                        let gridData = $(this).jqGrid('getRowData');
                        if(gridData.length > 0){
                            CmonUtil.processLoading(false);
                            $(this).jqGrid("setSelection",1);
                        }
                    },
                }
            }
            this.$refs.JsetGrid.init(JsetGridData);

            //단위작업 목록 그리드
            let unitJobGridData = {
                url: '/mng/job/jsetMng/selectListUnitJob.hb'
                ,colModels: [
                    { name: 'csetNo'       , label: '이행셋번호'    , hidden:true}
                    ,{name: 'jsetNo'       , label: '작업셋번호'    , hidden:true}
                    ,{name: 'jobExecSeq'   , label: '순서'         , width: 10   , align: 'center'}
                    ,{name: 'unitJobNo'    , label: '단위작업번호'  , width: 50  , align: 'left'  }
                    ,{name: 'unitJobNm'    , label: '단위작업명'    , width: 50  , align: 'left'  }
                    ,{name: 'blckYn'       , label: '분산처리'      , width: 15  , align: 'center'}
                    ,{name: 'asyncYn'      , label: 'ASYNC'        , width: 13  , align: 'center'
                        ,formatter: 'checkbox'
                        ,formatoptions: { disabled: false, value: 'Y:N'}
                        ,edittype: 'checkbox'
                        ,editoptions: { value: 'Y:N' }
                    }
                    ,{ name: 'specInfo'      , label: '상세조회'        , width: 20      , align: 'center'
                        , formatter: function() {         
                        return '<button class="btn" style="height:18px; width: 58px;"> 상세조회 </button>';                        
                    }}
                ]
                ,options: {
                    sortableRows: true
                    ,multiselect: true
                    ,height: 510 
                    ,beforeSelectRow(rowid, e) {
                        //체크박스 외 행 클릭 시 체크 방지
                        let iCol = $.jgrid.getCellIndex($(e.target).closest('td')[0]);
                        let cm   = $(this).jqGrid('getGridParam', 'colModel');
                        return (cm[iCol].name == 'cb');
                    } 
                    ,onCellSelect(rowid, icol, val ,e){
                        let gridData = $(this).jqGrid('getRowData', rowid);
                        let colNm    = $(this).jqGrid('getGridParam', 'colModel')[icol].name;
                        // 상세조회 버튼 클릭
                        if (e && e.target.tagName == 'BUTTON') {
                            if (colNm == 'specInfo' ) {
                                let unitJobNo = gridData.unitJobNo;
                                $this.setPageLink('O2020',unitJobNo);
                            }
                        }
                    }
                }
            }
            $this.$refs.UnitJobGrid.init(unitJobGridData);
            
            //단위작업목록필터링 그리드
            let unitJobFltrGridData = {
                url: '/mng/job/jsetMng/selectListUnitJobFltr.hb'
                ,colModels: [
                    {name:'csetNo'     ,label:'이행셋번호'   ,hidden:true}
                    ,{name:'unitJobNo' ,label:'단위작업번호' ,width:65 ,align:'left'}
                    ,{name:'unitJobNm' ,label:'단위작업명'   ,width:80 ,align:'left'}
                ]
                ,options: {
                    multiselect: true
                    ,height: 510
                    ,gridComplete(){
                        // var rowIds = $(this).jqGrid('getDataIDs');
                        // if(rowIds && rowIds.length > 0){
                        //     $(this).jqGrid("setSelection", rowIds[0]);
                        // }
                    } 
                }
            }
            $this.$refs.UnitJobFltrGrid.init(unitJobFltrGridData);
        }
        //이행셋변경
        ,selectCsetNo(){
            this.resetData(this.detlSrchParam);
            this.resetData(this.jsetInfo);
            this.clearGridList('UnitJobGrid');
            this.clearGridList('UnitJobFltrGrid');
            // this.jsetInfo.isNotAlocUnitJob = 'Y'
            // this.jsetInfo.TRUC = 'TRUC'
            // this.jsetInfo.DETL = 'DETL'
            // this.jsetInfo.ISRT = 'ISRT'
            // this.jsetInfo.UPDT = 'UPDT'
            // this.jsetInfo.ETC = 'ETC'
            if(this.srchParam.csetNo != ''){
                this.selectListJsetMng();
            }
        }
        //작업셋목록 조회
        ,selectListJsetMng() {
            this.resetData(this.detlSrchParam);
            this.resetData(this.jsetInfo);
            this.clearGridList('UnitJobGrid');
            this.clearGridList('UnitJobFltrGrid');
            // this.jsetInfo.isNotAlocUnitJob = 'Y'
            // this.jsetInfo.TRUC = 'TRUC'
            // this.jsetInfo.DETL = 'DETL'
            // this.jsetInfo.ISRT = 'ISRT'
            // this.jsetInfo.UPDT = 'UPDT'
            // this.jsetInfo.ETC = 'ETC'
            this.unitJobListAll = [];
            this.unitJobFltrList = [];
            this.saveDiv = 'insert';
            if(ValdUtil.srchValdNull(this.srchParam.csetNo,'이행셋','slct')){     
                this.unitJobListFltr();
                this.selectGridList('JsetGrid');
            }
        }
        //단위작업전체 목록 조회
        ,selectListUnitJobAll(){ 
            const $this = this;
            $this.doPost('/mng/job/jsetMng/selectListUnitJobAll.hb', $this.srchParam).then((res) => {
                if (res.data.rtnCd == '0000' && $this.ValdUtil.isNotNull(res.data.rtnData.result)) {
                    $this.unitJobListAll = res.data.rtnData.result;            
                    $this.$refs.UnitJobFltrGrid.setGridData($this.unitJobListAll, true);            
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });            
        }
        //작업셋상세 조회 
        ,async srchJsetDetl(callback){
            const $this = this;
            //상세 단위작업그리드 조회
            $this.selectGridList('UnitJobGrid');

            //상세정보조회
            await $this.doPost('/mng/job/jsetMng/selectJsetBaseInfo.hb', $this.jsetInfo).then((res) => {
                if (res.data.rtnCd == '0000' && $this.ValdUtil.isNotNull(res.data.rtnData.result)) {
                    $this.jsetInfo = res.data.rtnData.result;             
                    // $this.jsetInfo.isNotAlocUnitJob = 'Y'
                    // $this.jsetInfo.TRUC = 'TRUC'
                    // $this.jsetInfo.DETL = 'DETL'
                    // $this.jsetInfo.ISRT = 'ISRT'
                    // $this.jsetInfo.UPDT = 'UPDT'
                    // $this.jsetInfo.ETC = 'ETC'
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
            callback();
        }
        //단위작업목록필터링
        ,async unitJobListFltr(){
            const $this = this;
            $this.unitJobFltrList = [];
            $this.srchParam.unitJobTypeList = [];
            $this.srchParam.TRUC == 'TRUC'? $this.srchParam.unitJobTypeList.push({unitJobTypeCd:'TRUC'}) : ''
            $this.srchParam.DETL == 'DETL'? $this.srchParam.unitJobTypeList.push({unitJobTypeCd:'DELT'}) : ''
            $this.srchParam.ISRT == 'ISRT'? $this.srchParam.unitJobTypeList.push({unitJobTypeCd:'ISRT'}) : ''
            $this.srchParam.UPDT == 'UPDT'? $this.srchParam.unitJobTypeList.push({unitJobTypeCd:'UPDT'}) : ''
            $this.srchParam.ETC == 'ETC'? $this.srchParam.unitJobTypeList.push({unitJobTypeCd:'ETC'}) : ''

            await $this.doPost('/mng/job/jsetMng/selectListUnitJobFltr.hb', $this.srchParam).then((res) => {
                if (res.data.rtnCd == '0000' && $this.ValdUtil.isNotNull(res.data.rtnData.result)) {
                    $this.unitJobListAll = res.data.rtnData.result;  
                    $this.clearGridList('UnitJobFltrGrid');          
                    $this.$refs.UnitJobFltrGrid.setGridData($this.unitJobListAll, true);            
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });     
            let unitJobGridList = $this.$refs.UnitJobGrid.getGridObj().jqGrid('getRowData');
            if($this.unitJobListAll.length > 0 && unitJobGridList.length > 0 ){
                $this.unitJobListAll.forEach(el=>{
                    let cnt = 0;
                    unitJobGridList.forEach(jobEl=>{ if(el.unitJobNo == jobEl.unitJobNo) cnt = cnt + 1;});
                    if(cnt == 0){
                        $this.unitJobFltrList.push(el);
                    }
                });
                $this.clearGridList('UnitJobFltrGrid');
                $this.$refs.UnitJobFltrGrid.setGridData($this.unitJobFltrList, true);
            }
        }
        //작업셋 초기화
        ,resetJsetInfo(){
            this.resetData(this.detlSrchParam);
            this.resetData(this.jsetInfo);
            this.clearGridList('UnitJobGrid');
            this.clearGridList('UnitJobFltrGrid');
            this.unitJobListAll = [];
            this.unitJobFltrList = [];
            this.saveDiv = 'insert';
            this.unitJobListFltr();
        }
        //단위작업목록필터링 작업유형 선택
        ,chckUnitJobType(e){
            //  if(ValdUtil.isNotNull(el)){
            //     this.unitJobFltrList.push(el)
            //  }
        }
        ,chkUnitJobDivCd(val){
            const $this = this;
            $this.srchParam.unitJobTypeList = [];
            $this.srchParam.TRUC == 'TRUC'? $this.srchParam.unitJobTypeList.push({unitJobTypeCd:'TRUC'}) : ''
            $this.srchParam.DETL == 'DETL'? $this.srchParam.unitJobTypeList.push({unitJobTypeCd:'DELT'}) : ''
            $this.srchParam.ISRT == 'ISRT'? $this.srchParam.unitJobTypeList.push({unitJobTypeCd:'ISRT'}) : ''
            $this.srchParam.UPDT == 'UPDT'? $this.srchParam.unitJobTypeList.push({unitJobTypeCd:'UPDT'}) : ''
            $this.srchParam.ETC == 'ETC'? $this.srchParam.unitJobTypeList.push({unitJobTypeCd:'ETC'}) : ''
           
            this.selectListUnitJobFltr();
        }
        //단위작업목록필터링 검색
        ,async selectListUnitJobFltr(){
            const $this = this;
            $this.srchParam.unitJobTypeList = [];
            $this.srchParam.TRUC == 'TRUC'? $this.srchParam.unitJobTypeList.push({unitJobTypeCd:'TRUC'}) : ''
            $this.srchParam.DETL == 'DETL'? $this.srchParam.unitJobTypeList.push({unitJobTypeCd:'DELT'}) : ''
            $this.srchParam.ISRT == 'ISRT'? $this.srchParam.unitJobTypeList.push({unitJobTypeCd:'ISRT'}) : ''
            $this.srchParam.UPDT == 'UPDT'? $this.srchParam.unitJobTypeList.push({unitJobTypeCd:'UPDT'}) : ''
            $this.srchParam.ETC == 'ETC'? $this.srchParam.unitJobTypeList.push({unitJobTypeCd:'ETC'}) : ''
    
            this.selectGridList('UnitJobFltrGrid');
            

            // this.unitJobListFltr();
            // let gridData = $this.$refs.UnitJobFltrGrid.getGridObj().jqGrid('getRowData');

            // let fltrRsltList = [];
            // if(gridData.length > 0){
            //     gridData.forEach(el=>{
            //         if(el.unitJobNo.indexOf($this.detlSrchParam.fltrSrchWord)>-1
            //            ||el.unitJobNm.indexOf($this.detlSrchParam.fltrSrchWord)>-1){
            //             fltrRsltList.push(el);
            //           }
            //     });
            // }
            //     $this.clearGridList('UnitJobFltrGrid');
            //     $this.$refs.UnitJobFltrGrid.setGridData(fltrRsltList, true);       
        }
        //작업셋저장 검증
        ,async saveJsetMng() {
            const $this = this;
            if(!ValdUtil.srchValdNull(this.srchParam.csetNo  , '이행셋', 'slct')) return false;
            if(!ValdUtil.valdLenNull(this.jsetInfo.jsetNo  , 30    , '작업셋번호는')) return false;
            if(!ValdUtil.valdLenNull(this.jsetInfo.jsetNm  , 100   , '작업셋명은')) return false;
            if (this.$refs.UnitJobGrid.getGridObj().jqGrid('getRowData').length < 1 ) {
                this.alert('단위작업 목록을 추가해 주세요.');
                return false;
            }
            let cnt = 0;
            if(this.saveDiv =='insert'){
                await $this.doPost('/mng/job/jsetMng/selectListJsetMng.hb', $this.srchParam).then((res) => {
                    if (res.data.rtnCd == '0000' && $this.ValdUtil.isNotNull(res.data.rtnData.result)) {
                        res.data.rtnData.result.forEach(el=>{
                            if(el.jsetNo == $this.jsetInfo.jsetNo) cnt = cnt + 1
                        });
                    } else {
                        $this.alert(res.data.rtnMsg);
                    }
                });          
            }
            if(cnt > 0 ){
                $this.alert('동일한 작업셋번호가 존재합니다');
                return false;
            }
            this.exec('저장',null);
        }
        //작업셋저장 실행
        ,exec(div,stmt){
            const $this = this;
            $this.confirm({
                content: stmt!=null ? stmt + div+'하시겠습니까?' : div+'하시겠습니까?'
                ,callback:{
                    yes(){
                        let url = div == '저장'? '/mng/job/jsetMng/saveJsetMng.hb' : '/mng/job/jsetMng/deleteJsetMngProc.hb'
                        let params = {};
                        params['csetNo'] = $this.srchParam.csetNo;
                        params['jsetNo'] = $this.jsetInfo.jsetNo;
                        if(div == '저장'){
                            params['jsetNm'] = $this.jsetInfo.jsetNm;
                            params['rmrk'] = $this.jsetInfo.rmrk;
                            params['unitJobList'] = $this.$refs.UnitJobGrid.getGridObj().jqGrid('getRowData');
                            params['saveDiv'] = $this.saveDiv;
                        }
                        $this.doPost(url, params).then(function(res){
                            if(res.data.rtnCd == '0000'){
                                $this.alert(div+'되었습니다').then((result)=>{
                                    if(result.isConfirmed){
                                        $this.selectListJsetMng();
                                    }
                                })
                            }else{
                                $this.alert(res.data.rtnMsg).then((result)=>{
                                    if(result.isConfirmed){
                                        $this.selectListJsetMng();
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
        //작업셋삭제 검증
        ,deleteJsetMng() {
            const $this = this;
            if(!ValdUtil.srchValdNull(this.srchParam.csetNo  , '이행셋', 'slct')) return false;
            if(!ValdUtil.srchValdNull(this.jsetInfo.jsetNo  , '작업셋을', 'slct')) return false;
            
            let stmt = '';            
            $this.doPost('/mng/job/jsetMng/selectCntJobExecHist.hb', $this.detlSrchParam).then((res) => {
                if (res.data.rtnCd == '0000') {
                    if (res.data.rtnData.bolJobExecHist) {
                        stmt = '작업 실행 이력이 있는 작업셋 입니다<br/>';
                    }
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });

            this.exec('삭제',stmt);
        },
        //페이지 이동
        setPageLink(pageNo,unitJobNo){
            const $this = this;
            let params = {
                'csetNo'    : $this.srchParam.csetNo
                ,'wkspId'   : $this.jsetInfo.wkspId    
                ,'unitJobNo': unitJobNo
                ,'div'      : 'jsetMng'
            }
            CmonUtil.setPageLink(pageNo, params);
        },

        // 단위작업목록 그리드 오브젝트 가져오기
        getUnitJobGridObj() {
            return this.$refs.UnitJobGrid.getGridObj();
        },

        // 단위작업목록 그리드 데이터 가져오기
        getUnitJobGridDataAll() {
            return this.getUnitJobGridObj().jqGrid('getRowData');
        },

        upRows() {
                        
            const columnName = 'jobExecSeq';
            const unitJobGridObj = this.getUnitJobGridObj();
            const allRowIdxs = unitJobGridObj.getDataIDs();
            const selRowIds = unitJobGridObj.jqGrid('getGridParam','selarrrow');
            if (selRowIds.length < 1) {
                this.alert('이동시킬 단위작업을 하나 이상 선택(체크)하시기 바랍니다');
                return false;
            } 
            let chkArr = [];
            let unChkArr = [];

            let chkOrder = [];
            for (let selRowId_ of selRowIds) {
                let selRowIdx = unitJobGridObj.jqGrid('getInd', selRowId_);
                chkOrder.push(selRowIdx);
            }
            chkOrder.sort((a, b) => a - b);

            if (chkOrder) {
                for(let chkIdx of chkOrder) {
                    const data = this.getUnitJobGridDataAll();
                    if (chkIdx > 1) { 
                        let trgtRowId   = allRowIdxs[chkIdx-2];
                        let trgtRowData = data[chkIdx-2];
                        let selRowId    = allRowIdxs[chkIdx-1];
                        let selRowData  = data[chkIdx-1];

                        unitJobGridObj.jqGrid('setRowData', trgtRowId, selRowData);
                        unitJobGridObj.jqGrid('setCell', trgtRowId, columnName, trgtRowData.jobExecSeq);
                        unitJobGridObj.jqGrid('setRowData', selRowId, trgtRowData);
                        unitJobGridObj.jqGrid('setCell', selRowId, columnName, selRowData.jobExecSeq);
                        chkArr.push(trgtRowId);
                        unChkArr.push(selRowId);
                    } else {
                        console.log('더이상 상단으로 행을 옮길 수 없습니다.');
                        break;
                    }

                }
                for(let unChkRowId of unChkArr) {
                    unitJobGridObj.jqGrid('setSelection', unChkRowId);
                }
                for(let chkRowId of chkArr) {
                    unitJobGridObj.jqGrid('setSelection', chkRowId);
                }
            }
        },

        downRows() {

            const columnName        = 'jobExecSeq';
            const rowCount          = this.getUnitJobGridObj().jqGrid('getGridParam','records');
            const unitJobGridObj    = this.getUnitJobGridObj();
            const allRowIdxs        = unitJobGridObj.getDataIDs();
            const selRowIds         = unitJobGridObj.jqGrid('getGridParam','selarrrow');
            if (selRowIds.length < 1) {
                this.alert('이동시킬 단위작업을 하나 이상 선택(체크)하시기 바랍니다');
                return false;
            } 
            let chkArr = [];
            let unChkArr = [];

            let chkOrder = [];
            for (let selRowId_ of selRowIds) {
                let selRowIdx = unitJobGridObj.jqGrid('getInd', selRowId_);
                chkOrder.push(selRowIdx);
            }
            chkOrder.sort((a, b) => b - a);

            if (chkOrder) {
                for(let chkIdx of chkOrder) {
                    const data = this.getUnitJobGridDataAll();
                    if (chkIdx < rowCount) { 
                        let trgtRowId   = allRowIdxs[chkIdx];
                        let trgtRowData = data[chkIdx];
                        let selRowId    = allRowIdxs[chkIdx-1];
                        let selRowData  = data[chkIdx-1];

                        unitJobGridObj.jqGrid('setRowData', trgtRowId, selRowData);
                        unitJobGridObj.jqGrid('setCell', trgtRowId, columnName, trgtRowData.jobExecSeq);
                        unitJobGridObj.jqGrid('setRowData', selRowId, trgtRowData);
                        unitJobGridObj.jqGrid('setCell', selRowId, columnName, selRowData.jobExecSeq);
                        chkArr.push(trgtRowId);
                        unChkArr.push(selRowId);
                    } else {
                        console.log('더이상 하단으로 행을 옮길 수 없습니다.');
                        break;
                    }
                }

                for(let unChkRowId of unChkArr) {
                    unitJobGridObj.jqGrid('setSelection', unChkRowId);
                }
                
                for(let chkRowId of chkArr) {
                    unitJobGridObj.jqGrid('setSelection', chkRowId);
                }
            }
        },

        topRows() {
            const columnName = 'jobExecSeq';
            
            const unitJobGridObj_   = this.getUnitJobGridObj();
            const selRowIds_        = unitJobGridObj_.jqGrid('getGridParam','selarrrow');
            if (selRowIds_.length < 1) {
                this.alert('이동시킬 단위작업을 하나 이상 선택(체크)하시기 바랍니다');
                return false;
            } 
            let firstChk = [];
            for (let selRowId_ of selRowIds_) {
                let selRowIdx = unitJobGridObj_.jqGrid('getInd', selRowId_);
                firstChk.push(selRowIdx);
            }
            firstChk.sort((a, b) => a - b);
            let cnt = firstChk[0];

            for (cnt; cnt > 1; cnt--) {

                const unitJobGridObj    = this.getUnitJobGridObj();
                const allRowIdxs        = unitJobGridObj.getDataIDs();
                const selRowIds         = unitJobGridObj.jqGrid('getGridParam','selarrrow');

                let chkArr      = [];
                let unChkArr    = [];
                let chkOrder    = [];
                for (let selRowId_ of selRowIds) {
                    let selRowIdx = unitJobGridObj.jqGrid('getInd', selRowId_);
                    chkOrder.push(selRowIdx);
                }
                chkOrder.sort((a, b) => a - b);
                if (chkOrder) {
                    for(let chkIdx of chkOrder) {
                        const data = this.getUnitJobGridDataAll();
                        if (chkIdx > 1) { 
                            let trgtRowId   = allRowIdxs[chkIdx-2];
                            let trgtRowData = data[chkIdx-2];
                            let selRowId    = allRowIdxs[chkIdx-1];
                            let selRowData  = data[chkIdx-1];

                            unitJobGridObj.jqGrid('setRowData', trgtRowId, selRowData);
                            unitJobGridObj.jqGrid('setCell', trgtRowId, columnName, trgtRowData.jobExecSeq);
                            unitJobGridObj.jqGrid('setRowData', selRowId, trgtRowData);
                            unitJobGridObj.jqGrid('setCell', selRowId, columnName, selRowData.jobExecSeq);
                            chkArr.push(trgtRowId);
                            unChkArr.push(selRowId);
                        } else {
                            console.log('더이상 상단으로 행을 옮길 수 없습니다.');
                            break;
                        }
                    }
                    for(let unChkRowId of unChkArr) {
                        unitJobGridObj.jqGrid('setSelection', unChkRowId);
                    }
                    for(let chkRowId of chkArr) {
                        unitJobGridObj.jqGrid('setSelection', chkRowId);
                    }
                }
            }
        },

        bottomRows() {

            const columnName = 'jobExecSeq';
            
            const unitJobGridObj_   = this.getUnitJobGridObj();
            const selRowIds_        = unitJobGridObj_.jqGrid('getGridParam','selarrrow');
            if (selRowIds_.length < 1) {
                this.alert('이동시킬 단위작업을 하나 이상 선택(체크)하시기 바랍니다');
                return false;
            } 
            const rowCount = this.getUnitJobGridObj().jqGrid('getGridParam','records');

            let firstChk = [];
            for (let selRowId_ of selRowIds_) {
                let selRowIdx = unitJobGridObj_.jqGrid('getInd', selRowId_);
                firstChk.push(selRowIdx);
            }
            firstChk.sort((a, b) => b - a);

            let cnt = firstChk[0];

            for (cnt; cnt < rowCount; cnt++) {
                
                const unitJobGridObj    = this.getUnitJobGridObj();
                const allRowIdxs        = unitJobGridObj.getDataIDs();
                const selRowIds         = unitJobGridObj.jqGrid('getGridParam','selarrrow');
                let chkArr = [];
                let unChkArr = [];

                let chkOrder = [];
                for (let selRowId_ of selRowIds) {
                    let selRowIdx = unitJobGridObj.jqGrid('getInd', selRowId_);
                    chkOrder.push(selRowIdx);
                }
                chkOrder.sort((a, b) => b - a);

                if (chkOrder) {
                    for(let chkIdx of chkOrder) {
                        const data = this.getUnitJobGridDataAll();
                        if (chkIdx < rowCount) { 
                            let trgtRowId   = allRowIdxs[chkIdx];
                            let trgtRowData = data[chkIdx];
                            let selRowId    = allRowIdxs[chkIdx-1];
                            let selRowData  = data[chkIdx-1];

                            unitJobGridObj.jqGrid('setRowData', trgtRowId, selRowData);
                            unitJobGridObj.jqGrid('setCell', trgtRowId, columnName, trgtRowData.jobExecSeq);
                            unitJobGridObj.jqGrid('setRowData', selRowId, trgtRowData);
                            unitJobGridObj.jqGrid('setCell', selRowId, columnName, selRowData.jobExecSeq);
                            chkArr.push(trgtRowId);
                            unChkArr.push(selRowId);
                        } else {
                            console.log('더이상 하단으로 행을 옮길 수 없습니다.');
                            break;
                        }
                    }

                    for(let unChkRowId of unChkArr) {
                        unitJobGridObj.jqGrid('setSelection', unChkRowId);
                    }
                    
                    for(let chkRowId of chkArr) {
                        unitJobGridObj.jqGrid('setSelection', chkRowId);
                    }
                }
            }
        },

        //그리드 좌우 이동
        moveGrid(div) {
            const $this = this;
            if(!ValdUtil.srchValdNull(this.srchParam.csetNo  , '이행셋', 'slct')) return false;
            if(!ValdUtil.srchValdNull(this.jsetInfo.jsetNo  , '작업셋을', 'slct')) return false;
            
            let sourceGrid = div == 'UnitJobFltrGrid' ? $this.$refs.UnitJobFltrGrid.getGridObj() : $this.$refs.UnitJobGrid.getGridObj();
            let targetGrid = div == 'UnitJobFltrGrid' ? $this.$refs.UnitJobGrid.getGridObj() : $this.$refs.UnitJobFltrGrid.getGridObj();

            let chckList = GridUtil.getCheckedList(sourceGrid);
            if(chckList.length == 0){
                $this.alert("이동시킬 대상 하나 이상을 선택(체크)하시기 바랍니다");
                return false;
            }

            //선택 내용 추가(targetGrid)
            chckList.forEach(el=>{
                let data = {asyncYn:'N'
                            ,blckYn:'Ⅹ'
                            ,csetNo : el.csetNo
                            ,jobExecSeq: targetGrid.jqGrid('getRowData').length + 1
                            ,jsetNo: $this.jsetInfo.jsetNo !='' ? $this.jsetInfo.jsetNo : ''
                            ,unitJobNm: el.unitJobNm
                            ,unitJobNo: el.unitJobNo}
                targetGrid.jqGrid("addRowData",undefined, data,'last' );
                targetGrid.jqGrid("resetSelection");
            });

            
            // 데이터의 id를 찾아 체크박스 처리 
            for (let targetData of targetGrid.jqGrid('getGridParam', 'data')) {
                if (chckList.find(el => el.unitJobNo === targetData.unitJobNo)) {
                    targetGrid.jqGrid('setSelection', targetData.id);
                }
            }
            
            //선택 내용 삭제(sourceGrid)
            let rowIds = $(sourceGrid).getGridParam("selarrrow");
            for(var i = rowIds.length-1 ; i >= 0 ; i--) {
                sourceGrid.delRowData(rowIds[i]);
            }
        }
        
        //그리드조회 
        ,selectGridList(div) {
            const $this = this;
            $this.$refs[div].selectList();
        }
        //그리드초기화 
        ,clearGridList(div) {
            const $this = this;
            $this.$refs[div].clearGridData();
        }
       ,resetData(val) {
            for(let key in val){
                val[key] = ''
                if(key.indexOf('List') > -1){
                    val[key] = []
                }
            }
        }
        // 공통버튼(초기화, 조회, 저장, 삭제) 컴포넌트 핸들러
        ,onSetButtonClick(div) {
            switch ( div ) { 
                case 'init':
                    this.init();
                    break;
                case 'select':
                    this.selectListJsetMng();
                    break;
                case 'save':
                    this.saveJsetMng();
                    break;
                case 'delete':
                    this.deleteJsetMng();
                    break;
                default:
                    this.alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
        }
    }    
    ,mounted: function() {
        this.init();
    }
}
</script>
