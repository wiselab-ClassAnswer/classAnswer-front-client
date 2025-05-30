<template>
    <div style="height: 100%; font-size: 14px;">
        <div class="wrapper-main">
            <div class="container-main">
                <div class="inner box-wrap" style="height: 5%;">
                    <div class="horizon-left">
                        <span class="p-l-10">INTEGRATED MONITOR</span>
                    </div>
                    <div class="horizon-right">
                        <label :id="autoRnwlId">
                            <input type="checkbox" class="wd-15 m-t-0 m-r-5" style="vertical-align: middle;" 
                                v-model="params.isInterval" true-value="Y" false-value="N" @change="init"/>
                            <span style="vertical-align: middle;">현황 자동 갱신</span>
                        </label>
                    </div>
                </div>
                <div class="inner" style="height: 95%;">
                    <div class="box-container">
                        <!-- 사용현황 영역 -->
                        <div class="box-wrap ht-100 w-20">
                            <div class="title horizon-mid ht-5">
                                <div class="box-wrap-black w-100 t-a-cc" style="height:50%;">
                                    <span class="m-0">사용현황 Usage Status</span>
                                </div>
                            </div>
                            <!-- 월 누적 사용량 -->
                            <div class="mmUseStat w-100 tooltip-container c-p" @click="movePageLink('mmHist')" >
                                <div class="tooltip-text">GPT 모델 사용이력 화면으로 이동합니다</div>
                                <div class="w-100 flex-box-wrap" style="height: 20%;">
                                    <div class="horizon-left">
                                        <span class="p-l-15">월 누적 사용량</span>
                                    </div>
                                    <div class="horizon-right">
                                        <span class="p-r-15">{{ smryStat.thmmCnt }} 건</span>
                                    </div>
                                </div>
                                <div class="w-100 flex-box-wrap" style="height: 80%;">
                                    <!-- <span class="p-l-15" style="font-size: 30px;">{{smryStat.thmmTokn}}</span> -->
                                    <div class="horizon-right w-100">
                                        <span class="f-s-30">{{smryStat.thmmTokn}}</span>
                                        <span class="p-r-10 f-s-20">Tokens</span>
                                    </div>
                                </div>
                            </div>
                            <!-- 일 누적 사용량 -->
                            <div class="ddUseStat w-100 tooltip-container c-p"  @click="movePageLink('ddHist')">
                                <div class="tooltip-text">GPT 모델 사용이력화면으로 이동합니다</div>
                                <div class="w-100 m-t-10 flex-box-wrap" style="height: 20%;">
                                    <div class="horizon-left">
                                        <span class="p-l-15">일 누적 사용량</span>
                                    </div>
                                    <div class="horizon-right">
                                        <span class="p-r-15">{{ smryStat.thddCnt }} 건</span>
                                    </div>
                                </div>
                                <div class="w-100 flex-box-wrap" style="height: 80%;">
                                    <div class="horizon-right w-100">
                                        <span class="f-s-30">{{smryStat.thddTokn}}</span>
                                        <span class="p-r-10 f-s-20">Tokens</span>
                                    </div>
                                </div>
                            </div>
                            <div class="useTotStat flex-box-wrap">
                                <div class="horizon-mid list-col ">
                                    <div class="info-row w-80 tooltip-container c-p" @click="movePageLink('envSet')">
                                        <div class="tooltip-text-top">환경관리 화면으로 이동합니다.</div>
                                        <div class="info-title" >
                                            <span class="title-text t-a-l">IP 제한 대역</span>
                                            <span class="t-a-r">:</span>
                                        </div>
                                        <span class="info-content">{{ smryStat.avalIpAddr }}</span>
                                    </div>
                                    <div class="info-row w-80 tooltip-container c-p" @click="movePageLink('gmdl')">
                                        <div class="tooltip-text-top">모델관리 화면으로 이동합니다.</div>
                                        <div class="info-title">
                                            <span class="title-text t-a-l">가용모델</span>
                                            <span class="t-a-r">:</span>
                                        </div>
                                        <span class="info-content">{{ smryStat.normGmdlCnt }} 개</span>
                                    </div>
                                    <div class="info-row w-80 tooltip-container c-p" @click="movePageLink('ecous')">
                                        <div class="tooltip-text-top">교육과정관리 화면으로 이동합니다.</div>
                                        <div class="info-title">
                                            <span class="title-text t-a-l">가용교육</span>
                                            <span class="t-a-r">:</span>
                                        </div>
                                        <span class="info-content">{{smryStat.avalEcousCnt }} 개</span>
                                    </div>
                                    <div class="info-row w-80 tooltip-container c-p" @click="movePageLink('user')">
                                        <div class="tooltip-text-top">사용자관리 화면으로 이동합니다.</div>
                                        <div class="info-title">
                                            <span class="title-text t-a-l">강사수</span>
                                            <span class="t-a-r">:</span>
                                        </div>
                                        <span class="info-content">{{ smryStat.avalLectCnt }} 명</span>
                                    </div>
                                    <div class="info-row w-80 tooltip-container c-p" @click="movePageLink('stdt')">
                                        <div class="tooltip-text-top">수강생관리 화면으로 이동합니다.</div>
                                        <div class="info-title">
                                            <span class="title-text t-a-l">교육생수</span>
                                            <span class="t-a-r">:</span>
                                        </div>
                                        <span class="info-content">{{ smryStat.avalStdtCnt }} 명</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ht-100 w-80 ht-50">
                            <div class="vertical-stack">
                                <div class="ht-50 flex-box-wrap" style="gap: 5px;">
                                    <!-- 첫 번째 줄 (좌우 박스 2개) -->
                                    <div class="w-50 ht-100 box-wrap">
                                        <div class="box-header w-100 ht-10 p-10 flex-box-wrap">
                                            <div class="horizon-left">
                                                <div class="box-wrap-black w-70 t-a-cc" style="height:50%;">
                                                    <span class="m-0">GPT 모델별 이용현황</span>
                                                </div>
                                            </div>
                                            <div class="horizon-right">
                                                <span class="m-0">{{ gmdlStat.gmdlStatTotCnt }} EA</span>
                                            </div>
                                        </div>
                                        <div id="gmdlStat" class="p-5" style="height: 90%;">
                                            <div class="wrapper-content" style="background-color: #fff;">
                                                <Grid ref="gmdlStatGrid" :paging=false></Grid>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="w-50 ht-100 box-wrap">
                                        <div class="box-header w-100 ht-10 p-10 flex-box-wrap">
                                            <div class="horizon-left">
                                                <div class="box-wrap-black w-70 t-a-cc" style="height:50%;">
                                                    <span class="m-0">교육과정별 이용현황</span>
                                                </div>
                                            </div>
                                            <div class="horizon-right">
                                                <span class="m-0">{{ ecousStat.ecousStatTotCnt }} 건</span>
                                            </div>
                                        </div>
                                        <div id="ecousStat" class="p-5" style="height: 90%;">
                                            <div class="wrapper-content" style="background-color: #fff;">
                                                <Grid ref="ecousStatGrid" :paging=false></Grid>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="ht-50">
                                    <!-- 두 번째 줄 -->
                                    <div class="w-100 ht-100 box-wrap">
                                        <div class="box-header w-100 ht-10 p-l-10 p-r-10 p-t-5 p-b-5 flex-box-wrap">
                                            <div class="horizon-left">
                                                <div class="box-wrap-black w-35 t-a-cc" style="height:50%;">
                                                    <span class="m-0">사용자별 이용현황</span>
                                                </div>
                                                <span class="m-0 m-l-10" style="font-size:10px;">* 성능을 위해 최대 200명까지 조회합니다</span>
                                            </div>
                                            <div class="horizon-right">
                                                <span class="m-0">{{ userStat.userStatTotcnt }} 명</span>
                                            </div>
                                        </div>
                                        <div id="userStat" class="p-5" style="height: 85% !important;">
                                            <div class="wrapper-content" style="background-color: #fff;">
                                                <Grid ref="userStatGrid" :paging=false></Grid>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <StdtLimtMngPop ref="stdtLmitMngPop" :dataParams="params" @userLmitData="getPopData" ></StdtLimtMngPop>
    </div>
</template>

<script>
import { reactive, ref }    from 'vue';
import Grid                 from '@/components/grid/Grid.vue'
import StdtLimtMngPop       from '@/views/cmon/sys/StdtLimtMngPop.vue'

import { CmonUtil }         from '@/utils/CmonUtil';
import { SessionUtil }      from '@/utils/SessionUtil';
import { DateUtil }         from '@/utils/DateUtil';


export default {
    components: {
        Grid,
        StdtLimtMngPop
    },  
    setup() {
        let autoRnwlId = reactive({});
        let objId      = Math.random().toString(36);
        autoRnwlId     = 'label_' + objId;
        return {
            autoRnwlId
        }
    },
    props: {
        popupYn: {
            type: String,
            require: false,
            default: 'N',
        }
    },
    data() {
		return {
            refreshInterval: null,
            params : {
                isInterval   : 'N',
                selGmdlNo    : '',  // 셀 선택시 선택 된 행의 모델번호
                selEcousNo   : '', // 셀 선택시 선택 된 행의 교육과정번호 
            },
            smryStat : {
                avalEcousCnt : '0',  // 가용 교육 수
                avalIpAddr   : '',  // IP 제한대역
                avalLectCnt  : 0,  // 강사 수
                avalStdtCnt  : 0,  // 교육생 수
                normGmdlCnt  : 0,  // 가용 모델 수
                thddCnt      : 0,  // 일 누적 사용량
                thddTokn     : 0,  // 일 누적 토큰
                thmmCnt      : 0,  // 월 누적 사용량
                thmmTokn     : 0,  // 월 누적 토큰
            },
            gmdlStat : {
                gmdlStatTotCnt  : 0,  // GPT 모델별 이용현황 옆 건수
                
            },
            ecousStat : {
                ecousStatTotCnt : 0, // 교육과정별 이용현황 건수
            },
            userStat : {
                userStatTotcnt  : 0,  // 사용자별 이용현황 건수 
            }
        }
    },
    methods: {
        init() {            
            this.initGmdlStatGrid();
            this.initEcousStatGrid();
            this.initUserStatGrid();
            this.selectTotMonAll();
            this.startInterval();
        },
        //GPT 모델 현황 그리드
        initGmdlStatGrid() {
            const $this = this;
            const el       = document.getElementById("gmdlStat");
            let gridHeight = el.offsetHeight;
            let gridObj = {
                url: '',
                colModels: [
                    {name:'gmdlNo'    ,label: '모델번호'     ,width: 50     , align:'center'},
                    {name:'gmdlNm'    ,label: '모델명'       ,width: 70     , align:'left'  },
                    {name:'totTokn'   ,label: '총 사용량'    ,width: 50     , align:'right' , formatter:$this.thousandComma },
                    {name:'mmTokn'    ,label: '월사용량'     ,width: 60     , align:'right' , formatter:$this.thousandComma },
                    {name:'ddTokn'    ,label: '일 사용량'    ,width: 30     , align:'right' , formatter:$this.thousandComma },
                ],
                options: {
                    height : 270,
                    onSelectRow : function(rowid){
                        let gridData = $(this).jqGrid('getRowData',rowid);
                        $this.params.selGmdlNo = gridData.gmdlNo;
                        $this.stopInterval();
                        $this.selectTotMonGroup1();
                    },
                },
            };
            $this.$refs.gmdlStatGrid.init(gridObj);
        },
        // 교육과정별 이용현황 그리드
        initEcousStatGrid() {
            const $this = this;
            let isGroupHeaderSet = false;
            const el = document.getElementById("ecousStat");
            let gridHeight = el.offsetHeight;
            let gridObj = {
                url: '',
                colModels: [
                    {name:'gmdlNo'     ,label: '모델번호' , width: 40   , align:'center' , hidden : true},
                    {name:'ecousNo'    ,label: '과정번호' , width: 40   , align:'center' },
                    {name:'ecousNm'    ,label: '과정명'   , width: 200   , align:'left'   },
                    {name:'totTokn'    ,label: '전체기간' , width: 50   , align:'right'  , formatter:$this.thousandComma },
                    {name:'ddTokn'     ,label: '당일'     , width: 50   , align:'right'  , formatter:$this.thousandComma },
                ],
                options: {
                    height : 250,
                    onSelectRow : function(rowid){
                        let gridData = $(this).jqGrid('getRowData',rowid);
                        $this.params.selGmdlNo  = gridData.gmdlNo;
                        $this.params.selEcousNo = gridData.ecousNo;
                        $this.stopInterval();
                        $this.selectTotMonGroup2();
                    },
                    gridComplete() {
                        if(!isGroupHeaderSet) {
                            $(this).jqGrid('setGroupHeaders', {
                                useColSpanStyle: true,
                                groupHeaders: [
                                    {startColumnName: 'ecousNo', numberOfColumns: 2, titleText: '교육과정'},
                                    {startColumnName: 'totTokn', numberOfColumns: 2, titleText: '교육 토큰사용량'}
                                ]
                            });

                            // 플래그 설정 (groupHeader 중복 생성 방지)
                            isGroupHeaderSet = true;    
                        }
                    }
                },
            };
            $this.$refs.ecousStatGrid.init(gridObj);
        },
        // 사용자별 현황 그리드
        initUserStatGrid() {
            const $this = this;
            let isGroupHeaderSet = false;
            const el = document.getElementById("userStat");
            let gridHeight = el.offsetHeight;
            let gridObj = {
                url: '',
                colModels: [
                    {name:'gmdlNo'         ,label: '모델번호'      , width: 50    , align: 'center' , hidden : true},
                    {name:'ecousNo'        ,label: '과정번호'      , width: 50    , align: 'center' },
                    {name:'ecousNm'        ,label: '과정명'        , width: 50    , align: 'center' , hidden : true},
                    {name:'userId'         ,label: '수강생ID'      , width: 50    , align: 'center' },
                    {name:'totTokn'        ,label: '전체기간'      , width: 50    , align: 'right'  , formatter:$this.thousandComma },
                    {name:'ddTokn'         ,label: '당일'          , width: 50    , align: 'right'  , formatter:$this.thousandComma },
                    {name:'useRt'          ,label: '사용자대비(%)' , width: 40    , align: 'right' 
                        ,formatter(cellValue,options,rowObject){
                                return CmonUtil.addThousandComma(cellValue) + '%';
                            }
                        ,unformat: function(cellValue) {
                            return cellValue;
                        }
                    },
                    {name:'gmdlLmitNo'     ,label: '제한번호'      , width: 100   , align: 'left'   , hidden : true},
                    {name:'lmitResn'       ,label: '제한사유'      , width: 150   , align: 'left'   },
                    {name:'gmdlLmitYn'     ,label: '제한여부'      , width: 100   , align: 'left'   , hidden : true},
                    {name:'lmitProc'       ,label: '제한처리'      , width: 100   , align: 'left'   
                        , formatter(cellValue, options, rowObject) {
                            return `<div class="w-100" style="gap:3px; align-items: center; display: flex; justify-content: center;">
                                        <button id="lmit-${options.rowId}" class="btn-normal p-0 ib" style="color:green; border-color:green;">사용 제한</button>
                                        <button id="rels-${options.rowId}" class="btn-normal p-0 ib" style="color:orange; border-color:orange;">변경/해제</button>
                                        <button id="hist" class="btn-normal p-0 ib" style="color:#00b4ff; border-color:#00b4ff;">사용내역</button>
                                        <button id="lmitHist" class="btn-normal p-0 ib" style="color:#4169E1; border-color:#4169E1;">제한 이력</button>
                                    </div>`;
                        }
                    },
                    {name:'lmitTokn'      ,label: '허용량'              , width: 30   , align:'right'  , hidden : true},
                    {name:'gmdlLmitObjCd' ,label: '제한대상코드'        , width: 100  , align:'left'   , hidden : true},
                    {name:'gmdlLmitObjNm' ,label: '제한대상명'          , width: 100  , align:'left'   , hidden : true},
                    {name:'gmdlLmitResnCd',label: '제한사유코드'        , width: 100  , align:'left'   , hidden : true},
                    {name:'gmdlLmitResnNm',label: '제한사유명'          , width: 100  , align:'left'   , hidden : true},
                ],
                options: {
                    height : 230,
                    onSelectRow : function(rowid){
                        $this.stopInterval();
                    },
                    onCellSelect(rowid,iCol,val,e) {
                        if (e && e.target.tagName == 'BUTTON') {
                            let btnId    = e.target.id;
                            let btnType  = btnId.split('-')[0];
                            let gridData = $(this).jqGrid('getRowData',rowid);
                            $this.handlerBtn(btnType, gridData);
                        }
                    },
                    gridComplete() {
                        if(!isGroupHeaderSet) {
                            $(this).jqGrid('setGroupHeaders', {
                                useColSpanStyle: true,
                                groupHeaders: [
                                    {startColumnName: 'totTokn', numberOfColumns: 2, titleText: '교육 토큰사용량'},
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
                                let btn = $(`#lmit-${rowId}`); 
                                btn.prop('disabled', true);
                                btn.addClass('btn-disabled');
                            }
                            // 변경 / 해제 disabled 처리
                            else if(rowData.gmdlLmitYn === 'N'){
                                //jquery 객체
                                let btn = $(`#rels-${rowId}`);
                                btn.prop('disabled', true);
                                btn.addClass('btn-disabled');
                            }
                        });
                    }
                },
            };
            $this.$refs.userStatGrid.init(gridObj);
        },
        // 사용자현황 내 버튼 제어
        handlerBtn(btnId, gridData){
            const $this = this;
            if(btnId === 'lmit' || btnId === 'rels'){
                $this.openPop(btnId, gridData); 
            } else if(btnId === 'hist' || btnId === 'lmitHist'){
                $this.setPageLink(btnId, gridData);
            }
        },
        // 그리드 내 팝업 오픈
        openPop(btnId, gridData){
            const $this = this;
            gridData['isPageDiv'] = btnId;

            $this.$refs.stdtLmitMngPop.show();
            $this.$refs.stdtLmitMngPop.init(gridData);
        },
        // 제한 처리 후 버튼 상태 변경을 위해 재조회
        getPopData() {
            const $this = this;
            $this.selectTotMonGroup1();
        },
        setPageLink(btnId, gridData){
            const $this = this;
            let menuNo = null;
            gridData['isPageDiv'] = btnId;
            if(btnId === 'hist'){
                menuNo = 'H1020';
            } else if (btnId  === 'lmitHist'){
                menuNo = 'H1030';
            }
            console.log("gridData",gridData);
            CmonUtil.setPageLink(menuNo, gridData);
        },

        // 전체 조회
        selectTotMonAll(){
            const $this = this;
            
            let params = {

            }
            
            CmonUtil.processLoading(false);
            $this.doPost("/rept/stat/totMon/selectTotMonAll.hb", params,false).then(function(res){ 
                // CmonUtil.processLoading(false);
                // console.log("res",res);
                let result = res.data;
                if(res.data.rtnCd === '0000'){
                    $this.setStatAll(result.rtnData);
                } else{
                    $this.alert(res.data.rtnMsg);
                }
            });
        },
        // 교육과정별 이용현황 / 사용자별 이용현황 조회
        selectTotMonGroup1(){
            const $this = this;
            let params = {
                gmdlNo  : $this.params.selGmdlNo,
                ecousNo : $this.params.selEcousNo,
            }
            $this.doPost("/rept/stat/totMon/selectTotMonGroup1.hb", params,false).then(function(res){ 
                CmonUtil.processLoading(false);
                console.log("res",res);
                let result = res.data;
                if(res.data.rtnCd === '0000'){
                    $this.setTotMonStatGroup1(result.rtnData);
                } else{
                    $this.alert(res.data.rtnMsg);
                }

            })
        },
        // 사용자별 이용현황 조회 
        // 20250409 김범수 추후 추가 개발요건 고려하여 그룹 조회로 명명 
        selectTotMonGroup2(){
            const $this = this;
            let params = {
                gmdlNo  : $this.params.selGmdlNo,
                ecousNo : $this.params.selEcousNo,
            }
            $this.doPost("/rept/stat/totMon/selectTotMonGroup2.hb", params,false).then(function(res){ 
                CmonUtil.processLoading(false);
                let result = res.data;
                if(res.data.rtnCd === '0000'){
                    $this.setTotMonStatGroup2(result.rtnData);
                } else{
                    $this.alert(res.data.rtnMsg);
                }

            })
        },
        // 전체 현황 세팅
        setStatAll(data){
            const $this = this;
            $this.setSmryStat(data);
            $this.setGmdlStatGrid(data);
            $this.setEcousStatGrid(data);
            $this.setUserStatGrid(data);
        },
        // 교육과정별 이용현황 / 사용자별 이용현황 세팅
        setTotMonStatGroup1(data){
            const $this = this;
            $this.setEcousStatGrid(data);
            $this.setUserStatGrid(data);
        },
        //  사용자별 이용현황 세팅
        setTotMonStatGroup2(data){
            const $this = this; 
            $this.setUserStatGrid(data);
        },
        // 사용현황 세팅
        setSmryStat(data){
            const $this = this;
            let smryStat = data.smryStatMap;
            $this.smryStat.avalEcousCnt = CmonUtil.addThousandComma(smryStat.avalEcousCnt);
            $this.smryStat.avalLectCnt  = CmonUtil.addThousandComma(smryStat.avalLectCnt);
            $this.smryStat.avalStdtCnt  = CmonUtil.addThousandComma(smryStat.avalStdtCnt);
            $this.smryStat.normGmdlCnt  = CmonUtil.addThousandComma(smryStat.normGmdlCnt);
            $this.smryStat.thddCnt      = CmonUtil.addThousandComma(smryStat.thddCnt); 
            $this.smryStat.thddTokn     = CmonUtil.addThousandComma(smryStat.thddTokn);
            $this.smryStat.thmmCnt      = CmonUtil.addThousandComma(smryStat.thmmCnt);
            $this.smryStat.thmmTokn     = CmonUtil.addThousandComma(smryStat.thmmTokn);
            $this.smryStat.avalIpAddr   = smryStat.avalIpAddr;
        },
        //GPT 모델별 이용현황 데이터 세팅
        setGmdlStatGrid(data){
            const $this = this;
            let gmdlGridStat = data.gmdlStatList;
            
            $this.$refs.gmdlStatGrid.clearGridData();
            $this.$refs.gmdlStatGrid.setGridData(gmdlGridStat ,false);
            $this.gmdlStat.gmdlStatTotCnt = CmonUtil.addThousandComma(data.gmdlStatTotCnt);
        },
        // 교육과정별 이용현황 데이터 세팅
        setEcousStatGrid(data){
            const $this = this;
            let ecousGridStat = data.ecousStatList;
            $this.$refs.ecousStatGrid.clearGridData();
            $this.$refs.ecousStatGrid.setGridData(ecousGridStat, false);
            $this.ecousStat.ecousStatTotCnt = CmonUtil.addThousandComma(data.ecousStatTotCnt);
        },
        // 사용자별 이용현황 데이터 세팅
        setUserStatGrid(data){
            const $this = this;
            let userGridStat = data.userStatList;
            $this.$refs.userStatGrid.clearGridData();
            $this.$refs.userStatGrid.setGridData(userGridStat, false);
            $this.userStat.userStatTotcnt = CmonUtil.addThousandComma(data.userStatTotCnt);
        },

        startInterval() {
            if (this.params.isInterval === 'Y') {
                this.refreshInterval = setInterval(() => {
                    this.selectTotMonAll(); 
                }, 5000);
            } 
            else {
                clearInterval(this.refreshInterval);
                this.refreshInterval = null;
                this.params.isInterval = 'N';
            }
            
        },
        stopInterval() {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
            this.params.isInterval = 'N';
        },

        movePageLink(div , data){
            const $this = this;
            if (div === 'mmHist'){
                let currDt = DateUtil.getCurrDate();
                let params = {
                    frDt : DateUtil.getStndStrtDt(currDt),
                    toDt : DateUtil.getStndEndDt(currDt)
                };
                CmonUtil.setPageLink('H1020', params);
            } else if(div === 'ddHist'){
                let currDt = DateUtil.getCurrDate();
                let params = {
                    frDt : currDt,
                    toDt : currDt
                };
                CmonUtil.setPageLink('H1020', params);
            } else if(div === 'hist'){
                CmonUtil.setPageLink('H1020');
            } else if(div === 'lmitHist'){
                CmonUtil.setPageLink('H1030');
            } else if(div === 'envSet'){
                CmonUtil.setPageLink('M1010');
            } else if(div === 'gmdl'){
                CmonUtil.setPageLink('M1020');
            } else if(div === 'user'){
                CmonUtil.setPageLink('M1030');
            } else if(div === 'ecous'){
                CmonUtil.setPageLink('M1040');
            } else if(div === 'stdt'){
                CmonUtil.setPageLink('M1050');
            } else {
                console.log("알수없는 페이지링크");
            }
        },
        
    },
    computed: {
        isPopup() {
            return this.popupYn === 'Y';
        }
    },
    beforeUnmount() {
        this.params.isInterval = 'N';
        clearInterval(this.refreshInterval);
    },
    mounted() {
        this.init();
    }   
}
</script>
<style>

.box-container {
  display: flex;
  gap: 5px; /* 두 박스 사이 간격 */
  width: 100%;
  height: 100%;
}

.box-wrap{
    background-color: #595959;
    border-radius: 10px;
    padding: 10px;
}

.box-wrap-black{
    background-color: #000000;
    border-radius: 10px;
    padding:10px;
}
.t-a-cc{
    display: flex;
    justify-content: center;
    align-items: center;
}

.wrapper-main {
    display: flex;
    width: 100%;
    height: 100%;
    color:#fff;
}

.container-main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px; 
}
/* 세로 정렬 */
.vertical-stack {
  display: flex;
  flex-direction: column;
  gap: 5px; 
  height: 100%;
}


.flex-box-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mmUseStat{
    height: 25%;
    color:aquamarine;
    border-bottom: 1px solid aquamarine;
}

.ddUseStat{
    height: 25%;
    color:#eede66;
    border-bottom: 1px solid #eede66;
}

.useTotStat{
    height: 40%;
    gap: 15px;
}

.list-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-row {
  display: flex;
  align-items: center;
  padding-bottom: 6px; 
  border-bottom: 1px solid #fff;
  margin-bottom: 10px;
}

.info-title {
  width: 100px; /* 고정 너비 */
  display: flex;
  justify-content: space-between;
  margin-right: 10px;
}

.title-text::before{
    content: "●";
    color: #ffffff;
    margin-right:5px;
    font-size:8px;
    vertical-align: middle; 
    
}

.info-content {
  flex: 1;
}

.inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.horizon-left,
.horizon-mid,
.horizon-right {
  flex: 1;
  display: flex;
  align-items: center;
}

.horizon-left {
  justify-content: flex-start;
}

.horizon-mid {
  justify-content: center;
}

.horizon-right {
  justify-content: flex-end;
}


/* 그리드 내 버튼 제어 */
.btn-disabled {
  color: #fff !important;
  border-color: gray !important;
  background-color: gray !important;
  cursor: not-allowed;
}

.f-s-20{
    font-size: 20px !important;
}

.f-s-30{
    font-size: 30px !important;
}

.c-p {
    cursor: pointer;
}

.tooltip-container{
    position: relative;
}

.tooltip-text {
  visibility: hidden;
  width: max-content;
  background-color: #595959;
  color: #fff;
  text-align: center;
  padding: 5px 10px;
  border-radius: 6px;
  
  position: absolute;
  z-index: 1;
  left: 50%;
  top: 30%;
  transform: translateX(-50%); 

  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip-text-top {
    visibility: hidden;
    background-color: #595959;
    color: #fff;
    text-align: center;
    border-radius: 5px;
    padding: 5px 8px;
    position: absolute;
    z-index: 1;
    bottom: 110%;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity 0.3s;
    white-space: nowrap;
}

.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
.tooltip-container:hover .tooltip-text-top {
  visibility: visible;
  opacity: 1;
}
</style>