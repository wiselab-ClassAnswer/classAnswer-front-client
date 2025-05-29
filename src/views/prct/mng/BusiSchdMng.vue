<template>
    <div>
        <!-- 검색조건 -->
        <div class="section section1">
            <div class="search-box">
                <div class="m-b-10">
                    <h1>검색조건</h1>
                    <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="true" @on-set-button-click="onSetButtonClick"></SetButton>
                    <div class="input-box">
                        <div class="w-10">
                            <h2>프로젝트명</h2>
                            <select  v-model="params.srchPrctNo">
                                <option value = ''></option>
                                <option v-for="item in code.prctInfoList" :key="item.colId" :value="item.colId" >{{ item.colNm }}</option>
                            </select>
                        </div>
                        <div class="w-10">
                            <h2>업무명</h2>
                            <input type="text" v-model="params.srchBusiNm" v-on:keyup.enter="selectList">
                        </div>
                        <div class="w-5">
                            <h2>업무유형</h2>
                            <select v-model="params.srchBusiTypeCd">
                                <option value = ''></option>
                                <option v-for="item in code.busiTypeCdList" :key="item.cdVal" :value="item.cdVal">{{item.cdNm}}</option>
                            </select>
                        </div>
                        <div class="w-7"> 
                            <h2>업무상태</h2>
                            <select v-model="params.srchBusiStatCd">
                                <option value = ''></option>
                                <option v-for="item in code.busiStatCdList" :key="item.cdVal" :value="item.cdVal">{{item.cdNm}}</option>
                            </select>
                        </div>
                        <div class="w-7">
                            <h2>검색기간</h2>
                            <select class="w-100" v-model="params.stndDtDivCd">
                                <option value=""></option>
                                <option key="schd" value="schd" text="예정일자"></option>
                                <option key="real" value="real" text="실제일자"></option>
                            </select>
                        </div>
                        <div class="w-20">
                            <BetweenDatePicker :width="50" :frDt="params.strtDt" :toDt="params.endDt" @onSelected="onSelectBetweenDate"></BetweenDatepicker>
                        </div>
                        <div style="position:relative">
                            <h2>담당자</h2>
                            <input class="search" type="text" v-model="params.srchUserId" disabled>
                            <button class="btn-search"  @click="popupUserSrch()"  >
                                <img src="@/assets/img/btn_search.png" alt="찾기">
                            </button>
                        </div>
                        <div class="w-10">
                            <input type="text" v-model="params.srchUserNm" disabled/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 업무 목록 -->
        <div class="section section2 w-70">
            <div class="section-wrap">
                <h2 class="ib">업무 목록</h2>
                <button class="btn-exel-download only" @click="downloadExcel">
                    <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                    <p>다운로드</p>
                </button>
                <div class="wrapper-content">
                    <Grid ref="grid" :dataParams="params" :paging="true"></Grid>
                </div>
            </div>
        </div>

        <!-- 상세정보 -->
        <div class="section section3 w-30">
            <div class="section-wrap">
                <h2 class="ib m-b-10">업무 정보</h2>
                <div class="btn-group-box">
                    <button class="btn-normal btn-normal-flex" @click="busiMngLink()">업무관리 이동</button>
                    <button class="btn-normal btn-normal-flex" @click="busiChrgMngLink()">업무담당자관리 이동</button>      
                </div>
                <div class="section-part part1">
                    <div class="w-100">
                        <div class="w-50 ib p-r-10">
                            <span class="wd-80">프로젝트번호</span>
                            <div class="c-wd-80 ib">
                                <div class="input-btn w-100">
                                    <input class="w-100" type="text" v-model="busiSchdInfo.prctNo" disabled>
                                </div>
                            </div>
                        </div>
                        <div class="w-50 ib p-l-10">
                            <span class="wd-80">프로젝트명</span>
                            <input class="c-wd-80" type="text" v-model="busiSchdInfo.prctNm" disabled>
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-50 ib p-r-10">
                            <span class="wd-80">업무번호</span>
                            <input class="c-wd-80" type="text" v-model="busiSchdInfo.busiNo" disabled>
                        </div>
                        <div class="w-50 ib p-l-10">
                            <span class="wd-80">업무명</span>
                            <input class="c-wd-80" type="text" v-model="busiSchdInfo.busiNm" disabled>
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-50 ib p-r-10">
                            <span class="wd-80 essn">업무유형</span>
                            <select class="c-wd-80" v-model="busiSchdInfo.busiTypeCd" >
                                <option value = ''></option>
                                <option v-for="item in code.busiTypeCdList" :key="item.cdVal" :value="item.cdVal">{{item.cdNm}}</option>
                            </select>
                        </div>
                        <div class="w-50 ib p-l-10">
                            <span class="wd-80 essn">업무상태</span>
                            <select class="c-wd-80" v-model="busiSchdInfo.busiStatCd" >
                                <option value = ''></option>
                                <option v-for="item in code.busiStatCdList" :key="item.cdVal" :value="item.cdVal">{{item.cdNm}}</option>
                            </select>
                        </div>
                    </div>

                    <div class="w-100">
                        <div class="w-50 ib p-r-10">
                            <span class="wd-80">선행업무번호</span>
                            <div class="c-wd-80 ib">
                                <div class="input-btn w-100">
                                    <input class="w-100" type="text" v-model="busiSchdInfo.prevBusiNo" disabled>
                                </div>
                            </div>
                        </div>
                        <div class="w-50 ib p-l-10">
                            <span class="wd-80">선행업무명</span>
                            <input class="c-wd-80" type="text" v-model="busiSchdInfo.prevBusiNm" disabled>
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-50 ib p-r-10">
                            <span class="wd-80">담당자</span>
                            <div class="c-wd-80 ib">
                                <div class="input-btn w-100">
                                    <input class="w-100" type="text" v-model="busiSchdInfo.chrgUserId" disabled>
                                </div>
                            </div>
                        </div>
                        <div class="w-50 ib p-l-10">
                            <span class="wd-80">담당자명</span>
                            <input class="c-wd-80" type="text" v-model="busiSchdInfo.chrgUserNm" disabled>
                        </div>
                    </div>
                     
                    <div class="w-100">
                        <div class="w-50 ib p-r-10">
                            <span class="wd-80">예정시작일자</span>
                            <div class="c-wd-80 ib">
                                <div class="input-btn w-100">
                                    <Datepicker :stndDt="busiSchdInfo.schdStrtDt" style="width:100%;" @on-selected="onSelectedDatepickerFcstStrtDt"></Datepicker>
                                </div>
                            </div>
                        </div>
                        <div class="w-50 ib p-l-10">
                            <span class="wd-80">예정종료일자</span>
                            <div class="c-wd-80 ib">
                                <div class="input-btn w-100">
                                    <Datepicker :stndDt="busiSchdInfo.schdEndDt" style="width:100%;" @on-selected="onSelectedDatepickerFcstEndDt"></Datepicker>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="w-100">
                        <div class="w-50 ib p-r-10">
                            <span class="wd-80">실제시작일자</span>
                            <div class="c-wd-80 ib">
                                <div class="input-btn w-100" >
                                    <input type="text" class="w-100" v-model="busiSchdInfo.realStrtDt" disabled/>
                                    <button class="cal-btn cal-btn2 input-group-addon" style="float: right;">
                                        <img src="@/assets/img/btn_cal.png" alt="달력">    
                                    </button>
                                    <!-- <Datepicker :stndDt="busiSchdInfo.realStrtDt" style="width:100%;" @on-selected="onSelectedDatepickerRealStrtDt"></Datepicker> -->
                                </div>
                            </div>
                        </div>
                        <div class="w-50 ib p-l-10">
                            <span class="wd-80">실제종료일자</span>
                            <div class="c-wd-80 ib">
                                <div class="input-btn w-100" >
                                    <input type="text" class="w-100" v-model="busiSchdInfo.realEndDt" disabled/>
                                    <button class="cal-btn cal-btn2 input-group-addon" style="float: right;">
                                        <img src="@/assets/img/btn_cal.png" alt="달력">    
                                    </button>
                                    <!-- <Datepicker :stndDt="busiSchdInfo.realEndDt" style="width:100%;" @on-selected="onSelectedDatepickerRealEndDt"></Datepicker> -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="w-100">
                        <div class="w-50 ib p-r-10">
                            <span class="wd-80">예상소요일수</span>
                            <input class="c-wd-80" type="text" v-model="busiSchdInfo.fcstNeedDcnt" disabled>
                        </div>

                        <div class="w-50 ib p-l-10">
                            <span class="wd-80">실제소요일수</span>
                            <input class="c-wd-80" type="text" v-model="params.fcstRealDcnt" disabled>
                        </div>
                    </div>

                    <div class="text-box">
                        <span class="wd-80">비고</span>
                        <textarea class="c-wd-80" cols="30" rows="5" style="height: 339px;" v-model="busiSchdInfo.rmrk"></textarea>
                    </div>
                    
                </div>
            </div>
        </div>
        <UserSrch ref="UserSrchModal" :dataParams="params" @getUserPopRowData="selectedDataUser"></UserSrch>
        <ChrgSchdHist ref="ChrgSchdHistModal" :dataParams="params" @onSelect="selectedDataPrct"></ChrgSchdHist>
    </div>
</template>

<script>

import { inject, reactive}  from 'vue'
import Grid                 from '@/components/grid/Grid.vue'
import SetButton            from '@/components/SetButton.vue'
import Datepicker           from '@/components/datepicker/Datepicker.vue'
import BetweenDatePicker    from '@/components/datepicker/BetweenDatepicker.vue'
import UserSrch             from '@/views/mng/job/UserSrch.vue'
import ChrgSchdHist         from '@/views/prct/mng/ChrgSchdHistPopup.vue'
import { DateUtil }         from '@/utils/DateUtil'
import { ValdUtil }         from '@/utils/ValdUtil'
import { CmonUtil }         from '@/utils/CmonUtil'
import moment               from 'moment'


export default {
    components: {
        Grid,
        SetButton,
        Datepicker,
        BetweenDatePicker,
        UserSrch,
        ChrgSchdHist
    },
    setup() {        
        //공통코드조회
        const getCmonCdList = inject('getCmonCdList')
        let code = reactive({
            busiTypeCdList : [],
            busiStatCdList : [],
            prctInfoList   : []
        })
        getCmonCdList('BUSI_TYPE_CD', code.busiTypeCdList, 'N', null);
        getCmonCdList('BUSI_STAT_CD', code.busiStatCdList, 'N', null);

        const getColIdNmList = inject('getColIdNmList');

        const prctInfoListData = {
            'tblId': 'tc_prct_base'
            , 'colId': 'prct_no'
            , 'colNm': 'prct_nm'
            , 'where': []
            , 'orderby': [
                { 'orderCol': 'prct_no' }
            ]
        }
        getColIdNmList(prctInfoListData, code.prctInfoList, 'N', null);

        return {
           code
        }
    },
    data: function() {
		return {
            params: {
                srchPrctNo        : '',
                srchBusiNm        : '',
                srchBusiTypeCd    : '',
                srchBusiStatCd    : '',
                srchUserId        : '',
                srchUserNm        : '',
                crud              : 'C',
                fcstRealDcnt      : 0,
                strtDt            : '',
                endDt             : '',
                stndDtDivCd       : '',
                disableDatePicker : true
               
            },
            busiSchdInfo: {
                prctNo            : '',
                prctNm            : '',
                busiNo            : '',
                busiNm            : '',
                busiTypeCd        : '',
                prevBusiNo        : '',
                prevBusiNm        : '',
                prevBusiTypeNm    : '',
                prebBusiStatNm    : '',
                fcstNeedDcnt      : 0,
                schdStrtDt        : '',
                schdEndDt         : '',
                realStrtDt        : '',
                realEndDt         : '',
                chrgUserId        : '',
                chrgUserNm        : '',
                busiStatCd        : '',
                rmrk              : '',
            }
        }
    },
    methods: {
        init: function() {
            const $this = this;
            let data = $this.CmonUtil.getPageLink('U1040');
            $this.initData(data);
            $this.initGrid();
            $this.$refs.grid.clearGridData();
            $this.selectList();
        },
        initData(data) {
            const $this = this;
            if(ValdUtil.isNotNull(data)){
                $this.params.srchPrctNo = data.prctNo;
                $this.params.srchBusiNm = data.busiNm;
                // $this.busiSchdInfo = data.params;
            } else {
                $this.params ={
                srchPrctNo        : '',
                srchBusiNm        : '',
                srchBusiTypeCd    : '',
                srchBusiStatCd    : '',
                crud              : 'C',
                fcstRealDcnt      : 0,
                strtDt            : DateUtil.getCurrDate('YYYY-MM-DD'),
                endDt             : moment().add(+7,'days').format('YYYY-MM-DD'),
                stndDtDivCd       : ''
                }

                $this.busiSchdInfo = {
                    prctNo            : '',
                    prctNm            : '',
                    busiNo            : '',
                    busiNm            : '',
                    busiTypeCd        : '',
                    prevBusiNo        : '',
                    prevBusiNm        : '',
                    prevBusiTypeNm    : '',
                    prebBusiStatNm    : '',
                    fcstNeedDcnt      : 0,
                    schdStrtDt        : DateUtil.getCurrDate('YYYY-MM-DD'),
                    schdEndDt         : moment().add(+7,'days').format('YYYY-MM-DD'),
                    realStrtDt        : '',
                    realEndDt         : '',
                    chrgUserId        : '',
                    chrgUserNm        : '',
                    busiStatCd        : '',
                    rmrk              : ''
                }
            }
            
        },
        
        initGrid() {
            let $this = this;

            let gridOptions = {
                url: '/prct/mng/busiSchdMng/selectList.hb',
                colModels: [
                    {name:'prctNo'      ,label: '프로젝트번호'     , width: 40     , align:'left'     , hidden: true},
                    {name:'prctNm'      ,label: '프로젝트명'       , width: 80     , align:'left'    },
                    {name:'busiNo'      ,label: '업무번호'         , width: 40     , align:'left'     , hidden: true},
                    {name:'busiNm'      ,label: '업무명'           , width: 80     , align:'left'    },
                    {name:'busiTypeCd'  ,label: '업무유형'         , width: 40     , align:'center'  , hidden: true},
                    {name:'busiTypeNm'  ,label: '업무유형'         , width: 35     , align:'center'  },
                    {name:'prevBusiNo'  ,label: '선행업무'         , width: 80     , align:'left'    , hidden: true},
                    {name:'prevBusiNm'  ,label: '선행업무'         , width: 80     , align:'left'    },
                    // {name:'fcstNeedDcnt',label: '예상소요일수'     , width: 45     , align:'center'  },
                    {name:'chrgUserNm'  ,label: '담당자'           , width: 40     , align:'center'  },
                    {name:'busiStatCd'  ,label: '업무상태'         , width: 50     , align:'left'    , hidden: true},
                    {name:'busiStatNm'  ,label: '업무상태'         , width: 40     , align:'center'  },
                    {name:'schdStrtDt'  ,label: '예정시작일자'     , width: 45     , align:'center'   , formatter: $this.formatDate},
                    {name:'schdEndDt'   ,label: '예정종료일자'     , width: 45     , align:'center'   , formatter: $this.formatDate},
                    {name:'realStrtDt'  ,label: '실제시작일자'     , width: 45     , align:'center'   , formatter: $this.formatDate},
                    {name:'realEndDt'   ,label: '실제종료일자'     , width: 45     , align:'center'   , formatter: $this.formatDate},
                    {name:'histBtn'     ,label: '이력'            , width: 35      , align:'center'  
                        , formatter(){
                            return '<button>이력조회</button>';
                        }
                    },
                ],
                options: {
                    onCellSelect(rowId, iCol, val, e){
                        let rowData = $(this).jqGrid('getRowData', rowId);
                        let colNm   = $(this).jqGrid('getGridParam','colModel')[iCol].name;
                        let data    = $(this).jqGrid('getRowData',rowId).busiNo;
                        if (e && e.target.tagName == 'BUTTON') {
                            if (colNm == 'histBtn' ) {
                                $this.popupChrgSchdHist(rowData);
                            }
                        } else {
                            let realStrtDt  = new Date(rowData.realStrtDt);
                            let realEndDt   = new Date(rowData.realEndDt);
                            let realDiffSec = realEndDt.getTime() - realStrtDt.getTime();
                            
                            let schdStrtDt  = new Date(rowData.schdStrtDt);
                            let schdEndDt   = new Date(rowData.schdEndDt);
                            let schdDiffSec = schdEndDt.getTime() - schdStrtDt.getTime();

                            if(isNaN(realDiffSec)){
                                $this.params.fcstRealDcnt = 0;
                            } else {
                                $this.params.fcstRealDcnt = realDiffSec /(1000 * 3600 * 24);
                            }

                            if(isNaN(schdDiffSec)){
                                $this.params.fcstNeedDcnt = 0;
                            } else {
                                $this.params.fcstNeedDcnt = schdDiffSec /(1000 * 3600 * 24);
                            }

                            $this.params.crud = 'U';
                            $this.selectDetl(rowData);
                        }

                    },
                }
            }
            $this.$refs.grid.init(gridOptions);
        },
        selectList() {
            this.$refs.grid.selectList(true);
        },
        selectDetl(rowData) {
            const $this = this;
            let params = {
                busiNo: rowData.busiNo
            }
            $this.doPost('/prct/mng/busiSchdMng/selectDetl.hb', params).then(function(res) {
                if ( res.data.rtnCd != '0000') {
                    $this.alert(res.data.rtnMsg);
                } else {
                    $this.busiSchdInfo = res.data.rtnData;
                    $this.busiSchdInfo.schdStrtDt = DateUtil.dateToDash(res.data.rtnData.schdStrtDt);
                    $this.busiSchdInfo.schdEndDt  = DateUtil.dateToDash(res.data.rtnData.schdEndDt);
                    $this.busiSchdInfo.realStrtDt = DateUtil.dateToDash(res.data.rtnData.realStrtDt);
                    $this.busiSchdInfo.realEndDt  = DateUtil.dateToDash(res.data.rtnData.realEndDt);
                }
            });
            
        },
        save() {
            const $this = this;
            if($this.isValid()){
                let url = '';
                // if($this.params.crud == 'C'){
                //     url = '/prct/mng/busiSchdMng/insert.hb';
                // } else if ($this.params.crud ==='U'){
                //     url = '/prct/mng/busiSchdMng/update.hb';
                // }

                let params = _.cloneDeep($this.busiSchdInfo);

                const schdStrtDt = new Date(params.schdStrtDt);
                const schdEndDt  = new Date(params.schdEndDt);

                const diffSec    = schdEndDt.getTime() - schdStrtDt.getTime();
                if(isNaN(diffSec)){
                    $this.params.fcstNeedDcnt = 0;
                } else {
                    $this.params.fcstNeedDcnt = diffSec /(1000 * 3600 * 24);
                }
                        
                params.fcstNeedDcnt = diffSec /(1000 * 3600 * 24); 
                params.schdStrtDt   = params.schdStrtDt.replaceAll("-", "");
                params.schdEndDt    = params.schdEndDt.replaceAll("-", "");
                // params.realStrtDt   = params.realStrtDt.replaceAll("-", "");
                // params.realEndDt    = params.realEndDt.replaceAll("-", "");
                
                $this.doPost('/prct/mng/busiSchdMng/saveChngChrgSchdMng.hb', params).then(function(res) {
                    if ( res.data.rtnCd == '0000') {
                        $this.alert("저장되었습니다.").then((result) =>{
                            if(result.isConfirmed){
                                $this.initData();
                                $this.selectList();
                            }
                        })
                    } else {
                        $this.alert(res.data.rtnMsg);
                    }
                });
            }
        },
        delete() {
            const $this = this;
            $this.doPost('/prct/mng/busiSchdMng/delete.hb', $this.busiSchdInfo).then(function(res) {
                if ( res.data.rtnCd == '0000') {
                    $this.alert("삭제되었습니다.").then((result) =>{
                        if(result.isConfirmed){
                            $this.initData();
                            $this.selectList();
                        }
                    })
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
        },
        downloadExcel() {
            const $this = this;
            let grid     = $this.$refs.grid.getGridObj();
            let gridData = grid.getRowData();

            if(gridData.length > 0){
                let fileNm = '업무일정관리_업무목록_'+DateUtil.getCurrDate()+'.xlsx';
                this.doDownExcel('/prct/mng/busiSchdMng/selectListDownloadExcel.hb', this.params, fileNm); 
            } else {
                $this.alert("조회된 값이 없습니다.");
            }
        },
        isValid(){
            const $this = this;

            if(!$this.ValdUtil.valdLenNull($this.busiSchdInfo.prctNo        , 10     , '프로젝트번호는')) return false;
            if(!$this.ValdUtil.valdLenNull($this.busiSchdInfo.busiNm        , 200    , '업무명은'      )) return false;
            if(!$this.ValdUtil.valdLenNull($this.busiSchdInfo.busiTypeCd    , 20     , '업무유형은'    )) return false;
            if(!$this.ValdUtil.valdLenNull($this.busiSchdInfo.busiStatCd    , 20     , '업무상태는'    )) return false;

            return true;
        },


        onSelectedDatepickerFcstStrtDt(selectedDate) {
            this.busiSchdInfo.schdStrtDt = selectedDate;
        },
        onSelectedDatepickerFcstEndDt(selectedDate) {
            this.busiSchdInfo.schdEndDt = selectedDate;
        },
        onSelectedDatepickerRealStrtDt(selectedDate) {
            this.busiSchdInfo.realStrtDt = selectedDate;
        },
        onSelectedDatepickerRealEndDt(selectedDate) {
            this.busiSchdInfo.realEndDt = selectedDate;
        },

        //업무관리 이동
        busiMngLink(){
            const $this = this;
            if($this.params.crud ==='C'){
                let params = {
                    prctNo : $this.params.srchPrctNo,
                    busiNm : $this.params.srchBusiNm
                }
                CmonUtil.setPageLink('U1030',params);
            } else if ($this.params.crud ==='U'){
                let params = $this.busiSchdInfo;
                CmonUtil.setPageLink('U1030',params);
            }
        },
        //업무담당자관리 이동
        busiChrgMngLink(){
            const $this = this;
            if($this.params.crud ==='C'){
                
                let params = {
                    prctNo : $this.params.srchPrctNo,
                    busiNm : $this.params.srchBusiNm
                }
                CmonUtil.setPageLink('U1050',params);
            } else if ($this.params.crud ==='U'){
                let params = $this.busiSchdInfo;
                CmonUtil.setPageLink('U1050',params);
            }
        },

        //검색조건 Between
        onSelectBetweenDate(params) {
            const $this = this;
            $this.params.strtDt = params.frDt;
            $this.params.endDt  = params.toDt;
        },
        //업무이력조회팝업
        popupChrgSchdHist(data){
            const $this = this;
            // if(ValdUtil.isNotNull($this.busiSchdInfo.busiNo)){
                this.$refs.ChrgSchdHistModal.show();
                this.$refs.ChrgSchdHistModal.init(data);
            // } else {
            //     $this.alert("조회할 업무를 선택해주세요.");
            // }
            
        },

        popupBusiSrch() {
            this.$refs.BusiSrchModal.show();
            this.$refs.BusiSrchModal.initGrid();
        },
        popupUserSrch() {
            this.$refs.UserSrchModal.show();
            this.$refs.UserSrchModal.initGrid();
        },
        popupPrctSrch() {
            this.$refs.PrctSrchModal.show();
            this.$refs.PrctSrchModal.initGrid();
        },
        selectedDataBusi(data) {
            this.busiSchdInfo.prevBusiNo = data.busiNo;
            this.busiSchdInfo.prevBusiNm = data.busiNm;
        },
        selectedDataUser(data) {
            this.params.srchUserId = data.userId;
            this.params.srchUserNm = data.userNm;
        },
        selectedDataPrct(data) {
            this.busiSchdInfo.prctNo = data.prctNo;
            this.busiSchdInfo.prctNm = data.prctNm;
        },
        
        onSetButtonClick(div) {
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.init();
                    break;
                case 'select':
                    $this.selectList();
                    break;
                case 'save':
                    $this.save();
                    break;
                case 'delete':
                    $this.delete();
                    break;
                default:
                    break;
            }
        }
    },
    mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>
