<template>
    <div>
        <!-- 검색 조건 -->
        <div class="section section1">
            <div class="search-box">
                <div class="m-b-10">
                    <h1>검색조건</h1>
                    <SetButton :showInit="true" :showSelect="true" :showSave="false" :showDelete="false" @on-set-button-click="onSetButtonClick"></SetButton>
                </div>
                <div class="input-box search">
                    <div class="w-100">
                        <div class="w-20 ib">
                            <h2 class="essn">기간</h2>
                            <BetweenDatepicker :isInputBtn="true" :fr-dt="srchDate.frDt" :to-dt="srchDate.toDt" @on-selected="onSelectedBetweenDatepicker"></BetweenDatepicker>
                        </div>
                        <div class="w-10 ib m-l-10">
                            <h2>발생출처</h2>
                            <select v-model="srchParam.evntSrcCd"  ref="refEvntDivCd">
                                <option v-for="item in code.evntSrc" v-bind:key="item.cdVal" v-bind:value="item.cdVal" v-bind:text="item.cdNm"></option>
                            </select>
                        </div>
                        <div class="w-10 ib m-l-10">
                            <h2>발생구분</h2>
                            <select v-model="srchParam.evntDivCd">
                                <option v-for="item in code.evntDiv" v-bind:key="item.cdVal" v-bind:value="item.cdVal" v-bind:text="item.cdNm"></option>
                            </select>
                        </div>
                        <div class="w-10 ib m-l-10">
                            <h2>결과</h2>
                            <select v-model="srchParam.evntRsltCd">
                                <option v-for="item in code.evntRslt" v-bind:key="item.cdVal" v-bind:value="item.cdVal" v-bind:text="item.cdNm"></option>
                            </select>
                        </div>
                        <div class="w-10 ib m-l-10">
                            <h2>사용자ID</h2>
                            <input type="text" v-model="srchParam.evntUserId" v-on:keyup.enter="selectListEventLog()">
                        </div>
                    <!-- </div>
                    <div class="w-100 m-t-10"> -->
                        <div class="w-10 ib m-l-10">
                            <h2>KEY검색</h2>
                            <input type="text" v-model="srchParam.evntSrchKey" v-on:keyup.enter="selectListEventLog()">
                        </div>
                        <div class="w-10 ib m-l-10">
                            <h2>요청내용</h2>
                            <input type="text" v-model="srchParam.evntRequCntn" v-on:keyup.enter="selectListEventLog()">
                        </div>
                        <div class="w-10 ib m-l-10">
                            <h2>로그기록</h2>
                            <input type="text" v-model="srchParam.evntLog" v-on:keyup.enter="selectListEventLog()">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 이벤트 목록 그리드 -->
        <div class="section section4" >            
            <div class="section-wrap">
                <h2 class="ib">이벤트 목록</h2>
                <button class="btn-exel-download only" @click="downloadExcel()">
                    <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                    <p>다운로드</p>
                </button>
                <!-- 그리드 -->
                <div class="wrapper-content b">
                    <Grid ref="refEventLogGrid" :paging="true" :dataParams="srchParam"></Grid>
                </div>
            </div>
        </div>
        <EventDetlInfo ref="refEventDetlInfo"></EventDetlInfo>        
        <!-- <DataRstrAply ref="refDataRstrAply"></DataRstrAply>
        <DataRstrAprvProcDetl ref="refDataRstrAprvProcDetl"></DataRstrAprvProcDetl> -->
    </div>
</template>

<script>

import { reactive, ref, inject }    from 'vue'
import Grid                         from '@/components/grid/Grid.vue'
import SetButton                    from '@/components/SetButton.vue'
import BetweenDatepicker            from '@/components/datepicker/BetweenDatepicker.vue'
import { CmonUtil }                 from '@/utils/CmonUtil'
import EventDetlInfo                from './EventDetlInfo.vue'

export default {
    components: {
        Grid,
        SetButton,
        BetweenDatepicker,
        EventDetlInfo,
        // DataRstrAply,
        // DataRstrAprvProcDetl,
    },

    setup() {

        const refEventDetlInfo = ref(null);

        let initDate = CmonUtil.getPeriodDate('RECENT_WEEK'); 
        let srchDate = reactive({
            frDt: '',
            toDt: '',
        });

        let refEventLogGrid = ref(null);
        let eventLogGrid = null;
        
        let code = reactive({
            evntDiv: [],
            evntSrc: [],
            evntRslt: [],
        });

        const getCmonCdList = inject('getCmonCdList');
        getCmonCdList('EVNT_DIV_CD', code.evntDiv, 'Y', null);
        getCmonCdList('EVNT_SRC_CD', code.evntSrc, 'Y', null);
        getCmonCdList('EVNT_RSLT_CD', code.evntRslt, 'Y', null);

        return {
            refEventDetlInfo,
            initDate,
            srchDate,
            refEventLogGrid,
            eventLogGrid,
            code,
        }
    },

    data: function() {
		return {
            gridObj: null,
            srchParam: ref({
                evntDtFr: '',
                evntDtTo: '',
                evntDivCd: '',
                evntDivNm: '',
                evntSrcCd: '',
                evntSrcNm: '',
                evntUserId: '',
                evntSrchKey: '',
                evntRequCntn: '',
                evntLog: '',
                evntRsltCd: '',
            }),
            gridData: {
                selRow: null,                
            },
            recvParam: {
                jobExecNo: '',
                jobStrtDt: '',
            },
        }
    },
    methods: {
        init: function() {  
            this.srchDate.frDt = this.initDate.strDt;
            this.srchDate.toDt = this.initDate.endDt;

            this.recvParam = this.CmonUtil.getPageLink('R1090');
            if (this.recvParam) {
                if (this.recvParam.lnkDiv && this.recvParam.lnkDiv == 'TOT_MON') {
                    this.srchParam.evntRsltCd   = 'FAIL';
                    this.srchParam.evntSrcCd    = this.recvParam.evntSrcCd;
                    this.srchParam.evntDivCd    = this.recvParam.evntDivCd;
                    this.srchParam.evntDtFr     = this.recvParam.evntDtFr;
                    this.srchParam.evntDtTo     = this.recvParam.evntDtTo;
                    this.srchDate.frDt          = this.recvParam.evntDtFr;
                    this.srchDate.toDt          = this.recvParam.evntDtTo;
                } else if (this.recvParam.lnkDiv && this.recvParam.lnkDiv == 'EXCP_PROC_HIST') {
                    this.srchParam.evntSrchKey  = this.recvParam.jobExecNo;
                    this.srchParam.evntDtFr     = this.recvParam.updtDt;
                    this.srchParam.evntDtTo     = this.recvParam.updtDt;
                    this.srchDate.frDt          = this.DateUtil.dateToDash(this.recvParam.updtDt);
                    this.srchDate.toDt          = this.DateUtil.dateToDash(this.recvParam.updtDt);
                } else if (this.recvParam.lnkDiv && this.recvParam.lnkDiv == 'JOB_SCHD_STAT') {
                    this.srchParam.evntSrchKey  = this.recvParam.jobExecNo;
                    this.srchParam.evntDtFr     = this.recvParam.jobStrtDt;
                    this.srchParam.evntDtTo     = this.recvParam.jobEndDt;
                    this.srchDate.frDt          = this.DateUtil.dateToDash(this.recvParam.jobStrtDt); 
                    this.srchDate.toDt          = this.DateUtil.dateToDash(this.recvParam.jobEndDt);
                }
            }
            this.initGrid();
        },
        initGrid() {
            let $this = this;
            $this.eventLogGrid = {
                url: '/rept/stat/eventLog/selectListEventLogGrid.hb',
                colModels : [
                    { name: 'evntNo'            , label: '이벤트번호'       , width: 6     , align: 'center'   },
                    { name: 'regiDt'            , label: '발생일자'         , width: 10      , align: 'center'   , hidden:true},
                    { name: 'regitm'            , label: '발생시각'         , width: 10     , align: 'center'   , hidden:true},
                    { name: 'regiDttm'          , label: '발생일시'         , width: 12    , align: 'center'    },
                    { name: 'evntSrcCd'         , label: '발생출처'         , width: 8     , align: 'center'   , hidden:true},
                    { name: 'evntSrcNm'         , label: '발생출처'         , width: 9     , align: 'center'   },
                    { name: 'evntDivCd'         , label: '발생구분'         , width: 9      , align: 'center'   , hidden:true},
                    { name: 'evntDivNm'         , label: '발생구분'         , width: 10     , align: 'center'   },
                    { name: 'evntRsltCd'        , label: '결과코드'         , width: 10     , align: 'center'   , hidden:true},
                    { name: 'evntRsltNm'        , label: '결과'             , width: 6     , align: 'center'   ,
                        formatter(value) {
                            return $this.fontColor(value);
                        }
                    },
                    { name: 'regiUserId'        , label: '사용자ID'         , width: 6     , align: 'left'    },
                    { name: 'requLogBtn'        , label: '요청/로그'         , width: 7    , align: 'center'    ,
                        formatter() {
                            return '<button id="gridCellRequLogBtn" style="color: #00b4ff; border-color: #00b4ff; height:18px; width: 55px;">상세정보</button>';
                        }
                    },
                    { name: 'pageLnkBtn'        , label: '관련 PAGE'         , width: 5    , align: 'center'   ,formatter: this.pageLnkButton},
                    { name: 'idenKey1'          , label: '연계Key1'         , width: 15    , align: 'left'     ,
                        formatter(value) {
                            if ($this.ValdUtil.isNotNull(value)) {
                                return `<div style="display: flex; justify-content: space-between; align-items: center;">${value}<img id="evntClipboardKey1" style="cursor: pointer; height: 18px; padding-right: 5px;" src="/event_clipboard.png" alt=""></div>`;
                            }
                            return '';
                        },
                    },
                    { name: 'idenKey2'          , label: '연계Key2'         , width: 15    , align: 'left'     ,
                        formatter(value) {
                            if ($this.ValdUtil.isNotNull(value)) {
                                return `<div style="display: flex; justify-content: space-between; align-items: center;">${value}<img id="evntClipboardKey2" style="cursor: pointer; height: 18px; padding-right: 5px;" src="/event_clipboard.png" alt=""></div>`;
                            }
                            return '';
                        },
                    },
                    { name: 'idenKey3'          , label: '연계Key3'         , width: 15    , align: 'left'     ,
                        formatter(value) {
                            if ($this.ValdUtil.isNotNull(value)) {
                                return `<div style="display: flex; justify-content: space-between; align-items: center;">${value}<img id="evntClipboardKey3" style="cursor: pointer; height: 18px; padding-right: 5px;" src="/event_clipboard.png" alt=""></div>`;
                            }
                            return '';
                        },
                    },
                    { name: 'idenKey4'          , label: '연계Key4'         , width: 15    , align: 'left'     ,
                        formatter(value) {
                            if ($this.ValdUtil.isNotNull(value)) {
                                return `<div style="display: flex; justify-content: space-between; align-items: center;">${value}<img id="evntClipboardKey4" style="cursor: pointer; height: 18px; padding-right: 5px;" src="/event_clipboard.png" alt=""></div>`;
                            }
                            return '';
                        },
                    },
                    { name: 'idenKey5'          , label: '연계Key5'         , width: 15    , align: 'left'     ,
                        formatter(value) {
                            if ($this.ValdUtil.isNotNull(value)) {
                                return `<div style="display: flex; justify-content: space-between; align-items: center;">${value}<img id="evntClipboardKey5" style="cursor: pointer; height: 18px; padding-right: 5px;" src="/event_clipboard.png" alt=""></div>`;
                            }
                            return '';
                        },
                    },                 
                ],
                options: {
                    height: 548,
                    // loadonce: true,
                    onSelectRow : function(rowId, is, event) {
                        $this.gridData.selRow = $this.gridObj.jqGrid('getRowData', rowId);

                        if($this.ValdUtil.isNotNull(event)) {
                            if (event.target.id == 'gridCellRequLogBtn') {
                                $this.eventDetlInfoPop($this.gridData.selRow.evntNo);
                            } else if (event.target.id == 'gridCellPageLnkBtn') {
                                if($this.srchParam.evntDivCd  != 'RSTR_REQU_DEL' && $this.srchParam.evntDivCd  != 'RSTR_APRV_DEL'){
                                    $this.eventDetlPageLnkPop($this.gridData.selRow);
                                }
                            }
                            if (event.target.id == 'evntClipboardKey1' ) {
                                $this.copyToClipboardKey('idenKey1', event);
                            } else if (event.target.id == 'evntClipboardKey2' ) {
                                $this.copyToClipboardKey('idenKey2', event);
                            } else if (event.target.id == 'evntClipboardKey3' ) {
                                $this.copyToClipboardKey('idenKey3', event);
                            } else if (event.target.id == 'evntClipboardKey4' ) {
                                $this.copyToClipboardKey('idenKey4', event);
                            } else if (event.target.id == 'evntClipboardKey5' ) {
                                $this.copyToClipboardKey('idenKey5', event);
                            }
                        }
                    },
                }
            };
            $this.refEventLogGrid.init($this.eventLogGrid);
            $this.gridObj = $this.refEventLogGrid.getGridObj();
            $this.gridObj.jqGrid('setFrozenColumns');
            $this.selectListEventLog();
        },
        copyToClipboardKey(text, event) {
            let copy = this.extractTextFromHTML(this.getGridRow(text));
            navigator.clipboard.writeText(copy).then(() => {
                // console.log('클립보드에 복사되었습니다.');
                this.showClipboardMessage(event.clientX, event.clientY);
            }).catch((err) => {
                console.error('클립보드에 복사 실패 :', err);
            });
        },
        extractTextFromHTML(htmlString) {
            const doc = new DOMParser().parseFromString(htmlString, 'text/html');
            return doc.body.textContent || "";
        },
        showClipboardMessage(x, y) {
            const messageElement = document.createElement('div');
            messageElement.textContent              = '클립보드에 복사되었습니다';
            messageElement.style.position           = 'fixed';
            messageElement.style.top                = `${y}px`;
            messageElement.style.left               = `${x + 20}px`;
            messageElement.style.backgroundColor    = 'white';
            messageElement.style.fontSize           = '12px';
            messageElement.style.padding            = '8px';
            messageElement.style.border             = '1px solid #ccc';
            messageElement.style.zIndex             = '1000';

            document.body.appendChild(messageElement);

            setTimeout(() => {
                document.body.removeChild(messageElement);
            }, 500);
        },
        // getClipboardImgPath() {
        //     return require('@/assets/img/event_clipboard.png');
        // },
        // 그리드 데이터 전체 가져오기
        getGridAll() {
            return this.gridObj.jqGrid('getRowData');
        },
        // 그리드 데이터 선택행(셀) 가져오기
        getGridRow(cell) {
            if(this.ValdUtil.isNotNull(cell) && this.ValdUtil.isNotNull(this.gridData.selRow)) {
                return this.gridData.selRow[cell];
            }
            return this.gridData.selRow;
        },
        // 초기화
        resetData() {
            this.CmonUtil.resetObjData(this.srchParam);
            this.CmonUtil.resetObjData(this.gridData);
            this.CmonUtil.resetObjData(this.recvParam);
            this.srchDate.frDt = this.initDate.strDt;
            this.srchDate.toDt = this.initDate.endDt;
            this.gridObj.clearGridData();
            this.setFocus();
        },
        selectListEventLog() {
            this.srchParam.evntDtFr = this.DateUtil.dateToYYYYMMDD(this.srchDate.frDt);
            this.srchParam.evntDtTo = this.DateUtil.dateToYYYYMMDD(this.srchDate.toDt);
            // 조회조건 날짜 유효성 검사
            if(!this.valdDate(this.srchParam.evntDtFr, this.srchParam.evntDtTo)) {
                this.alert('입력된 기간이 유효하지 않습니다.');
                return false;
            }
            this.refEventLogGrid.selectList(true);

            this.setFocus();
        },
        fontColor(value) {
            if (value == '실패') {
                return '<span style="color: red; ">' + value + '</span>';
            } else {
                return value;
            }
        },
        onSelectedBetweenDatepicker(selectedDate) {
            this.srchDate.frDt = selectedDate.frDt;
            this.srchDate.toDt = selectedDate.toDt;
        },
        // 엑셀다운로드        
        downloadExcel(){            
            if(this.gridObj.jqGrid('getGridParam','records') < 1) {
                this.alert('검색된 이벤트로그 목록이 없습니다.');
                return false;
            }

            let labelsArray = this.eventLogGrid.colModels.filter(
                obj => obj.label != '요청/로그' && obj.label != '관련 PAGE' && obj.label != '결과코드' && obj.hidden != true
            ).map(obj => obj.label);
            
            let url     = '/rept/stat/eventLog/selectListEventLogGridExcel.hb';
            let dt      = this.DateUtil.getCurrDate('YYYYMMDD');
            let fileNm  = '이벤트목록_'+ dt + '.xlsx';
            let param   = this.srchParam;
            param.excelHeader = labelsArray;
            
            this.doDownExcel(url, param, fileNm);
        },
        valdDate(fr, to) {
            return this.DateUtil.isValidTerm(fr, to);
        },
        eventDetlInfoPop(evntNo) {
            this.refEventDetlInfo.show();
            this.refEventDetlInfo.openPop(evntNo);
        },
        eventDetlPageLnkPop(row) {
            const params = {
                evntDivCd: this.extractTextFromHTML(row.evntDivCd),
                idenKey1:  this.extractTextFromHTML(row.idenKey1),
                idenKey2:  this.extractTextFromHTML(row.idenKey2),
                idenKey3:  this.extractTextFromHTML(row.idenKey3),
                idenKey4:  this.extractTextFromHTML(row.idenKey4),
                idenKey5:  this.extractTextFromHTML(row.idenKey5),
                dt: row.regiDt,
            }
            
            if (params.evntDivCd == 'TEMP_JOB_REQU' || params.evntDivCd == 'TEMP_JOB_APRV' || params.evntDivCd == 'TEMP_JOB_DENY') {
                // 임시작업 관리
                this.CmonUtil.setPageLink('P2040', params);
            } else if (params.evntDivCd == 'QRNT_APRV_PERMIT' || params.evntDivCd == 'QRNT_APRV_DENY') {
                // 분리보관 결재 현황
                this.CmonUtil.setPageLink('D1050', params);
            } else if (params.evntDivCd == 'RSTR_REQU_CNCL' || params.evntDivCd == 'RSTR_REQU') {
                // 자료복원신청 팝업 : 복원요청취소, 복원요청
                this.$refs.refDataRstrAply.openPopup(params.idenKey1,'event');
            } else if (params.evntDivCd == 'RSTR_APRV' || params.evntDivCd == 'RSTR_DENY') {
                // 자료복원승인처리상세 팝업 : 복원승인, 복원반려
                this.$refs.refDataRstrAprvProcDetl.openPopup(params.idenKey1,'event');

            } else if (params.evntDivCd == 'OPEN_PITM_INFO') {
                // 세부 분리보관 현황 : 개인정보열람
                let sendParams = {
                                    idenKey1  : params.idenKey1,
                                    idenKey2  : params.idenKey2, 
                                    idenKey3  : params.idenKey3, 
                                    idenKey4  : params.idenKey4, 
                                    idenKey5  : params.idenKey5, 
                                }
                this.CmonUtil.setPageLink('D1020',sendParams); 
            } else if (params.evntDivCd == 'OPEN_PDST_INFO') {
                // 영구파기이력 : 파기정보열람
                let sendParams = {
                                    idenKey1  : params.idenKey1,
                                    idenKey2  : params.idenKey2, 
                                    idenKey3  : params.idenKey3, 
                                    idenKey4  : params.idenKey4, 
                                    idenKey5  : params.idenKey5, 
                                }
                this.CmonUtil.setPageLink('D1030',sendParams); 
            } else if (params.evntDivCd == 'TLB_LAY_REFR') {
                // 테이블명세 : 테이블정보현행화
                let sendParams = {
                                    dbConnId  : params.idenKey1,
                                    srchWord  : params.idenKey2, 
                                }
                this.CmonUtil.setPageLink('E1090',sendParams); 
            } else if (params.evntDivCd == 'TLB_LAY_SYNC') {
                // 테이블명세 : 테이블변경반영
                let sendParams = {
                                    dbConnId  : params.idenKey1,
                                    srchWord  : params.idenKey2, 
                                }
                this.CmonUtil.setPageLink('E1090',sendParams); 
            }else if (params.evntDivCd == 'JOB_EXEC_REGI') {
                // 작업스케줄링현황
                let sendParams = {
                                    stndDt  : params.idenKey3 
                                }
                this.CmonUtil.setPageLink('R1012',sendParams); 
            }else if (params.evntDivCd == 'KMAP_GEN_REQU') {
                // 키맵메타관리
                let sendParams = {
                                    kmapMetaNo    : params.idenKey1,
                                    kmapMetaNm    : params.idenKey2
                                }

                this.CmonUtil.setPageLink('P1032',sendParams); 
            } else if (params.evntDivCd == 'OBJ_DATA_GEN_REQU') {
                // 대상자료선정                
                let sendParams = {  
                                    plcyNo      : params.idenKey1,
                                    kmapMetaN0  : params.idenKey2
                                }
                
                this.CmonUtil.setPageLink('P1040',sendParams);
            } else if (params.evntDivCd == 'PITM_MAPP_REQU') {
                // 개인정보항목매핑            
                let sendParams = {  
                                    pitmCd      : params.idenKey1,
                                    pitmNm      : params.idenKey2,
                                    kmapMetaNo  : ''
                                }
                
                this.CmonUtil.setPageLink('P1022',sendParams);
            } else if (params.evntDivCd == 'JOB_EXEC_STRT' || params.evntDivCd == 'JOB_EXEC_END' || params.evntDivCd == 'JOB_EXEC_ERR') {
                // 작업실행이력
                let sendParams = {  
                    jobExecNo   : params.idenKey1,
                    strtDt      : this.DateUtil.addDay(params.dt, -2, 'YYYYMMDD'),
                    endDt       : this.DateUtil.addDay(params.dt, +2, 'YYYYMMDD'),
                }
                this.CmonUtil.setPageLink('R1020',sendParams);
            } else if(params.evntDivCd =='LGIN' || params.evntDivCd == 'LOUT'){
                let sendParams ={
                    srchWord      : params.idenKey1
                }
                this.CmonUtil.setPageLink('E1010',sendParams);
            } else if (params.evntDivCd == 'QRNT_INFO_OPEN') {
                let sendParams = {
                    dt : params.dt
                }
                // '분리보관 정보열람' 화면에서 발생한 이벤트이지만 해당 화면 특성(열람 제한)으로 인해 '분리보관 열람이력/승인' 화면으로 링크함
                this.CmonUtil.setPageLink('D1023',sendParams);
            } else {
                this.alert('해당로그는 화면이 연결되지 않았습니다. 개발팀에 문의 바랍니다.');
            }
            
        },
        pageLnkButton(){
            let str = '<button id="gridCellPageLnkBtn" style="color: #ffa900; border-color: #ffa900; height:18px; width: 40px;">열람</button>'
            if(this.srchParam.evntDivCd =='RSTR_REQU_DEL' || this.srchParam.evntDivCd =='RSTR_APRV_DEL'){
                str = '<button id="gridCellPageLnkBtn" style="color: #999999; border-color: #999999; height:18px; width: 40px;">열람</button>';
            }
            return str;
        },
        setFocus() {
            this.$refs.refEvntDivCd.focus();
        },
        // 공통버튼(초기화, 조회, 저장, 삭제) 컴포넌트 핸들러
        onSetButtonClick(div) {
            switch ( div ) {
                case 'init':
                    this.resetData();
                    break;
                case 'select':
                    this.selectListEventLog();
                    break;
                default:
                    this.alert('처리할 수 없는 버튼 이벤트입니다.');
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
