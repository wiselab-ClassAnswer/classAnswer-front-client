<template>
    <div>
        <!-- 검색조건 -->
        <div class="section section1">
            <div class="search-box">
                <div class="m-b-10">
                    <h1>검색조건</h1>
                    <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="true" @on-set-button-click="onSetButtonClick"></SetButton>
                </div>
                <div class="input-box">
                    <div class="w-15 ib">
                        <h2>모델번호</h2>
                        <input ref="srchWord" type="text" v-model="srchParams.gmdlNo" v-on:keyup.enter="onSetButtonClick('select')">
                    </div>
                    <div class="w-15 ib">
                        <h2>모델명</h2>
                        <input type="text" v-model="srchParams.gmdlNm" v-on:keyup.enter="onSetButtonClick('select')">
                    </div>
                    <div class="w-15 ib">
                        <h2>모델상태</h2>
                        <select v-model="srchParams.gmdlStatCd" @change="onSetButtonClick('select')">
                            <option v-for="el in code.gmdlStatCdList" :key="el.cdVal" :value="el.cdVal">
                                {{ el.cdNm }}
                            </option>
                        </select>
                    </div>          
                </div>
            </div>
        </div>

        <!-- GPT모델 목록 -->
        <div class="section section2">
            <div class="section-wrap">
                <h2 class="ib">GPT모델 목록</h2>
                <button class="btn-exel-download only" v-on:click="downloadExcel()">
                    <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                    <p>다운로드</p>
                </button>
                <!-- 그리드 -->
                <Grid ref="grid" :dataParams="srchParams" :paging=true></Grid>
            </div>
        </div>

        <div class="section section5 w-50">
            <div id="tabs" class="w-100 p-b-0 p-t-8">
                <ul class="tab-menu">
                    <li v-for="(tab, index) in tabs" v-bind:key="index" v-bind:class="{active:currentTabIdx===index}" @click="changeTab(index)" style="cursor: pointer;">
                        <a href="#">{{tab}}</a>
                    </li>
                </ul>
            </div>
            <div class="section-wrap m-t-0"  style="min-height: calc(100vh - 275px);">
                <div id="tabArea" class="w-100">
                    <!-- 모델정보 -->
                    <div v-show="currentTabIdx == 0">
                        <h2 class="ib">기본모델정보</h2>
                        <div class="section-part part1 ib">
                            <div class="w-50 ib">
                                <span class="wd-80 essn">모델번호</span>
                                <input class="c-wd-80" v-model="params.gmdlNo" :disabled="params.crud === 'U'">
                            </div>
                            <div class="w-50 ib">
                                <span class="wd-80 t-a-r essn">사용모델</span>
                                <select class="c-wd-80" v-model="params.gmdlKindCd" ref="gmdlKindCd">
                                    <option v-for="el in code.gmdlKindCdList" :key="el.cdVal" :value="el.cdVal">
                                        {{ el.cdNm }}
                                    </option>
                                </select>
                            </div>
                            <div class="w-100">
                                <span class="wd-80 essn">모델명</span>
                                <input class="c-wd-80" v-model="params.gmdlCntn">
                            </div>
                            <div class="w-100" style="display: flex; align-items: center; gap: 5px;">
                                <div class="w-90" style="flex: 1;">
                                    <span class="wd-80">API Key</span>
                                    <input class="c-wd-80" v-model="params.gmdlApiKey" ref="gmdlApiKey" @input="apiKeyFocusOut()" />
                                </div>
                                <div class="w-10" style="flex: 0 0 auto;">
                                    <button class="btn-normal" @click="keyVerify()">
                                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                                        <p class="ib">Key검증</p>
                                    </button>
                                </div>
                            </div>
                            <div class="w-100">
                                <div class="text-box">
                                <span class="wd-80 f-l m-t-5">설명</span>
                                    <textarea spellcheck="false" class="c-wd-80 ta-r-n" 
                                        name="" id="" cols="30" rows="10" v-model="params.rmrk" ></textarea>
                                </div>
                            </div>
                            <div class="w-100">
                                <div class="w-50 ib">
                                    <span class="wd-80">상태</span>
                                    <div class="dbconnect c-wd-80 p-l-5 ib">
                                        <span v-if="params.gmdlStatCd      === 'STBY'" class="ib case case2 m-l-5 m-0">미인증</span>
                                        <span v-else-if="params.gmdlStatCd === 'NORM'" class="ib case case1 m-l-5 m-0">정상</span>
                                        <span v-else-if="params.gmdlStatCd === 'HALT'" class="ib case case3 m-l-5 m-0">중지</span>
                                        <span v-else-if="params.gmdlStatCd === 'DEPR'" class="ib case case2 m-l-5 m-0">폐기</span>
                                    </div>
                                </div>
                                <div class="w-50 ib">
                                    <span class="wd-80">관리자전용여부</span>
                                    <div class="c-wd-80 p-l-10 ib">
                                        <label>
                                            <input type="radio" class="ha p-rl wd-20" value="Y" v-model="params.mngrOnlyYn" style="top:2px; left:-3px;">
                                            <span class="ib c-wd-20">예</span>
                                        </label>
                                        <label>
                                            <input type="radio" class="ha p-rl wd-20" value="N" v-model="params.mngrOnlyYn" style="top:2px; left:-3px;">
                                            <span class="ib c-wd-20">아니오</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <h2 class="ib m-t-30">토큰제한설정</h2>
                            <div class="section-part part1 ib">
                                <div class="w-100">
                                    <div class="w-60">
                                        <span class="wd-80">적용기간</span>
                                        <div class="c-wd-80 ib">
                                            <div class="w-50-mr ib">
                                                <Datepicker :stndDt="params.aplyStrtDt" :disabled="tokenLimitDisable" @onSelected="onSelectBetweenDatePicker"></Datepicker>    
                                            </div>
                                            <div class="w-50-ml ib">
                                                <Datepicker :stndDt="params.aplyEndDt" :disabled="tokenLimitDisable" @onSelected="onSelectBetweenDatePicker"></Datepicker>    
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div class="w-100">
                                    <div class="w-60">
                                        <span class="wd-80 ib">일별 제한</span>
                                        <div class="c-wd-80 ib">
                                            <div class="w-50-mr ib">
                                                <div class="radio-box m-0 ib">
                                                    <label>
                                                        <input type="radio" name="dayLmitY" id="dayLmitY"  value="Y" v-model="params.ddlyToknLmitYn" :disabled="tokenLimitDisable">
                                                        <p class="p-l-5" style="color:#333333">예</p>
                                                    </label>
                                                    <label>
                                                        <input type="radio" name="dayLmitN" id="dayLmitN"  value="N" v-model="params.ddlyToknLmitYn" :disabled="tokenLimitDisable">
                                                        <p class="p-l-5" style="color:#333333">아니오</p>
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="w-50-ml ib">
                                                <input class="w-60 ib" v-model="params.ddlyToknLmitCnt" :disabled="tokenLimitDisable">
                                                <span class="w-40 ib p-l-5 m-r-0">토큰(Tokens)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="w-100">
                                    <div class="w-60">
                                        <span class="wd-80 ib">시간대별 제한</span>
                                        <div class="c-wd-80 ib">
                                            <div class="w-50-mr ib">
                                                <div class="radio-box m-0 ib">
                                                    <label>
                                                        <input type="radio" name="timeLmitY" id="timeLmitY"  value="Y" v-model="params.tcntToknLmitYn" :disabled="tokenLimitDisable">
                                                        <p class="p-l-5" style="color:#333333">예</p>
                                                    </label>
                                                    <label>
                                                        <input type="radio" name="timeLmitN" id="timeLmitN"  value="N" v-model="params.tcntToknLmitYn" :disabled="tokenLimitDisable">
                                                        <p class="p-l-5" style="color:#333333">아니오</p>
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="w-50-ml ib">
                                                <input class="w-60 ib" :disabled="tokenLimitDisable" v-model="params.tcntToknLmitCnt">
                                                <span class="w-40 ib p-l-5 m-r-0">토큰(Tokens)</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                <div class="w-100">
                                    <div class="w-60">
                                        <span class="wd-80 ib">1일 사용자 제한</span>
                                        <div class="c-wd-80 ib">
                                            <div class="w-50-mr ib">
                                                <div class="radio-box m-0 ib">
                                                    <label>
                                                        <input type="radio" name="oneDayLmitY" id="oneDayLmitY"  value="Y" v-model="params.userToknLmitYn" :disabled="tokenLimitDisable">
                                                        <p class="p-l-5" style="color:#333333">예</p>
                                                    </label>
                                                    <label>
                                                        <input type="radio" name="oneDayLmitN" id="oneDayLmitN"  value="N" v-model="params.userToknLmitYn" :disabled="tokenLimitDisable">
                                                        <p class="p-l-5" style="color:#333333">아니오</p>
                                                    </label>
                                                </div>
                                            </div>
                                            <div class="w-50-ml ib">
                                                <input class="w-60 ib" :disabled="tokenLimitDisable" v-model="params.userAvalToknCnt">
                                                <span class="w-40 ib p-l-5 m-r-0">토큰(Tokens)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 설정이력 -->
                    <div v-show="currentTabIdx == 1" >
                        <div class="wrapper-content">
                            <Grid ref="setHistGrid" :dataParams="srchParams" :paging=true></Grid>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { reactive, ref, inject } from 'vue'
import Grid                      from '@/components/grid/Grid.vue'
import SetButton                 from '@/components/SetButton.vue'
import Datepicker                from '@/components/datepicker/Datepicker.vue'
import { DateUtil }              from '@/utils/DateUtil.js'
import { CmonUtil }              from '@/utils/CmonUtil'
import BetweenDatepicker         from '@/components/datepicker/BetweenDatepicker.vue'
import { SessionUtil }           from '@/utils/SessionUtil'
import { ValdUtil }              from '@/utils/ValdUtil'

export default {
    components: {
        Grid,
        SetButton,
        Datepicker,
        BetweenDatepicker
    },

    setup() {
        let code = reactive({
            roleCdList          : [],
            ynCdList            : [],
            gmdlStatCdList      : [],
            gmdlKindCdList      : [],
        })

        const getColIdNmList = inject('getColIdNmList');
        const colIdNmListData = { 'tblId'  :'tc_role_base',
                                  'colId'  :'role_cd',
                                  'colNm'  :'role_nm',
                                  'where'  : [
                                    {'andCol' :'1',
                                     'andCalc':'=',
                                     'andVal' :"'1'"}
                                  ],
                                  'orderby' : [
                                    {'orderCol' : 'role_cd'}
                                   ,{'orderCol' : 'role_nm'}
                                  ]
        };  
        getColIdNmList(colIdNmListData, code.roleCdList, 'Y', null);
        
        const getCmonCdList = inject('getCmonCdList');
        getCmonCdList('YN', code.ynCdList, 'Y', null);  // YN / YN
        getCmonCdList('GMDL_KIND_CD', code.gmdlKindCdList, 'Y', null);  // GPT 모델 코드
        getCmonCdList('GMDL_STAT_CD', code.gmdlStatCdList, 'Y', null);  // GPT 모델 상태 코드
        
           //탭 구분
        let currentTabIdx = ref(0);
        let tabs = ['모델정보', '설정이력']


        return {
            code,
            currentTabIdx,
            tabs
        }
    },

    data: function() {
        return {
            srchParams : {
                gmdlNo             : '',
                gmdlNm             : '',
                gmdlStatCd         : '',
            },
            params: {
                // 기본모델정보
                crud               : 'C',
                gmdlNo             : '',
                gmdlKindCd         : '',
                gmdlApiKey         : '',
                gmdlCntn           : '',
                gmdlStatCd         : 'STBY',
                mngrOnlyYn         : 'N',
                rmrk               : '',
                // 토큰제한설정
                // gmdl_no            : '',
                aplyStrtDt         : '',
                aplyEndDt          : '',
                ddlyToknLmitYn     : '',
                ddlyToknLmitCnt    : '',
                tcntToknLmitYn     : '',
                tcntToknLmitCnt    : '',
                userToknLmitYn     : '',
                userAvalToknCnt    : '',
                // 사용자 정보
                regiUserId         : '',
                updtUserId         : '',
            },
            tokenLimitDisable: true,
            currDbMngrGmdlNo : null,
            isChngMngrYn     : 'N',
        }
    },

    methods: {
        init() {
            const $this = this;
            let data = this.CmonUtil.getPageLink('M1020');
            $this.initData(data);
            $this.initGrid();
            $this.initSetHistGrid();

            $this.$nextTick(() => {
                $this.selectList();
                if(data != '') {
                    $this.selectOne(data.gmdlNo);
                }
                CmonUtil.setFocus($this.$refs.srchWord);
            });
        },
        initData(data){
            const $this = this;
            $this.initSrchParams(data);
            $this.initParams();
        },
        initSrchParams(data){
            const $this = this;
            if(data != '') {
                $this.srchParams.gmdlNo         = data.gmdlNo;
                $this.srchParams.gmdlNm         = '';
                $this.srchParams.gmdlStatCd     = '';
            } else {
                $this.srchParams.gmdlNo         = '';
                $this.srchParams.gmdlNm         = '';
                $this.srchParams.gmdlStatCd     = '';
            }
        },
        initParams(){
            const $this = this;
            $this.params.crud               = 'C';
            $this.params.gmdlNo             = '';
            $this.params.gmdlKindCd         = '';
            $this.params.gmdlApiKey         = '';
            $this.params.gmdlCntn           = '';
            $this.params.gmdlStatCd         = 'STBY';
            $this.params.mngrOnlyYn         = 'N';
            $this.params.rmrk               = '';
            const userId                    = SessionUtil.getUserId();
            $this.params.regiUserId         = userId;            
            $this.params.updtUserId         = userId;   


            //토큰제한설정
            $this.params.aplyStrtDt         = DateUtil.getCurrDate('YYYY-MM-DD');
            $this.params.aplyEndDt          = '9999-12-31';
            $this.params.ddlyToknLmitYn     = 'N';
            $this.params.ddlyToknLmitCnt    = 0; 
            $this.params.tcntToknLmitYn     = 'N';
            $this.params.tcntToknLmitCnt    = 0;
            $this.params.userToknLmitYn     = 'N';
            $this.params.userAvalToknCnt    = 0;
        },
        // 그리드 init
        initGrid() {
            let $this = this;
            let gridObj = {
                url: '/cmon/sys/gmdlMng/selectListGmdlList.hb',
                colModels: [
                    {name:'gmdlNo'         ,label: '모델번호'       , width: 50    , align:'center' },
                    {name:'gmdlCntn'       ,label: '모델명'         , width: 60    , align:'left'   },
                    {name:'gmdlStatCd'     ,label: '모델상태코드'   , width: 10    , align:'left'   , hidden : true },
                    {name:'gmdlStatNm'     ,label: '모델상태'       , width: 20   , align:'center',
                        formatter: function(cellValue, options, rowObject) { 
                            let val = '';
                            if (rowObject.gmdlStatCd != null) {
                                val = $this.formatGridComboValue(rowObject.gmdlStatCd, $this.code.gmdlStatCdList);
                            }
                            return val;
                        }
                    },
                    {name:'mngrOnlyYn'     ,label: '관리자전용여부' , width: 20    , align:'center'  
                        ,formatter: function(cellValue, options, rowObject) {
                            return cellValue === 'Y' ? '예' : '아니오';
                        }
                        ,unformat: function (cellValue) {
                            return cellValue === '예' ? 'Y' : 'N';
                        }
                    },
                ],
                options: {                  
                    onSelectRow : function(rowid){
                        let params = $(this).jqGrid('getRowData', rowid);
                        console.log("parmas",params);
                        $this.selectOne(params.gmdlNo);
                    },
                    gridComplete: function() {
                        const $grid = $(this);
                        const rowIds = $grid.jqGrid('getDataIDs');

                        // 저장 후 자동 selection
                        if($this.params.crud === 'U') {
                                rowIds.forEach(rowId => {
                                const row = $grid.jqGrid('getRowData', rowId);
                                if (row.gmdlNo === $this.params.gmdlNo) {
                                    $grid.jqGrid('setSelection', rowId, true);
                                }
                            });
                        }
                    }
                },
            };
            $this.$refs.grid.init(gridObj);
        },
        // 그리드 조회
        selectList(){
            const $this = this;
            $this.$refs.grid.selectList(true);
        },
        // GPT 모델 정보 조회
        selectOne(gmdlNo) {
            const $this = this;
            let param = {
                gmdlNo : gmdlNo
            }
            $this.doPost('/cmon/sys/gmdlMng/selectOneGmdl.hb', param).then(function (res) {
                if(res.status === 200) {
                    // 여기서 값 세팅
                    const rtnData = res.data.rtnData;
                    // GPT 모델 정보 
                    $this.params.crud       = 'U';
                    $this.params.gmdlNo     = rtnData.gmdlInfo.gmdlNo;
                    $this.params.gmdlKindCd = rtnData.gmdlInfo.gmdlKindCd;
                    $this.params.gmdlApiKey = rtnData.gmdlInfo.gmdlApiKey;
                    $this.params.gmdlCntn   = rtnData.gmdlInfo.gmdlCntn;
                    $this.params.gmdlStatCd = rtnData.gmdlInfo.gmdlStatCd;
                    $this.params.mngrOnlyYn = rtnData.gmdlInfo.mngrOnlyYn;
                    $this.params.rmrk       = rtnData.gmdlInfo.rmrk;
                }
            });
        },
        initSetHistGrid(){
            let $this = this;
            let isGroupHeaderSet = false;
            let setHistGridObj = {
                url: '',
                colModels: [
                    {name:'aprvStrtDt'  ,label: '적용시작일'    , width: 50    , align:'center' },
                    {name:'aprvEndDt'   ,label: '적용종료일'    , width: 50    , align:'left'   },
                    {name:'aprvYn1'     ,label: '여부'          , width: 30    , align:'left'   },
                    {name:'toknCnt'     ,label: '토큰수'        , width: 100   , align:'center' },
                    {name:'aprvYn2'     ,label: '여부'          , width: 30   , align:'center' },
                    {name:'toknCnt'     ,label: '토큰수'        , width: 100   , align:'center' },
                    {name:'aprvYn3'     ,label: '여부'          , width: 30   , align:'center' },
                    {name:'toknCnt'     ,label: '토큰수'        , width: 100   , align:'center' },
                ],
                options: {                  
                    onSelectRow : function(rowid){
                    },
                    gridComplete() {
                        if(!isGroupHeaderSet) {
                            $(this).jqGrid('setGroupHeaders', {
                                useColSpanStyle: true,
                                groupHeaders: [
                                    {startColumnName: 'aprvYn1', numberOfColumns: 2, titleText: '일별 토큰 제한'},
                                    {startColumnName: 'aprvYn2', numberOfColumns: 2, titleText: '시간대별 토큰 제한'},
                                    {startColumnName: 'aprvYn3', numberOfColumns: 2, titleText: '1일 사용자 토큰 제한'}
                                ]
                            });

                            // 플래그 설정 (groupHeader 중복 생성 방지)
                            isGroupHeaderSet = true;    
                        }
                    }
                },
            };
            $this.$refs.setHistGrid.init(setHistGridObj);
            
        },
        // 엑셀다운로드        
        downloadExcel(){
            const $this = this;
            let url    = '/cmon/sys/gmdlMng/gmdlListExcelDownload.hb';
            let param  = _.cloneDeep($this.srchParams);
            let fileNm = 'GPT모델목록_'+DateUtil.getCurrDate('YYYYMMDD')+'.xlsx';

            if($this.$refs.grid.getGridObj().jqGrid('getGridParam','records') < 1) {
                $this.alert('엑셀다운로드 대상이 없습니다');
                return false;
            }
            $this.doDownExcel(url, param, fileNm);
        },
        // 유효성 검증
        validateParam() {
            const $this = this;

            if(ValdUtil.isNull($this.params.gmdlNo)){
                $this.alert("모델번호를 입력해주세요");
                return false;
            }

            if(ValdUtil.isNull($this.params.gmdlKindCd)) {
                $this.alert("사용모델을 선택해주세요.");
                return false;
            }

            if(ValdUtil.isNull($this.params.gmdlCntn)) {
                $this.alert("모델명을 입력해주세요.");
                return false;
            } 

            return true;
        },


        async saveCnfm(){
            const $this = this;

            if(!$this.validateParam()) {
                return false;
            }
            let msg           = '저장하시겠습니까?';
            await $this.doPost('/cmon/sys/gmdlMng/selectChckMngrOnlyGmdlNo.hb', $this.params).then(function (res) {
                if(res.data.rtnCd === '0000') {
                    $this.currDbMngrGmdlNo = res.data.rtnData.result;
                } else {
                    $this.alert(res.data.message); 
                }
            });
            $this.$nextTick(() =>{
                
                if(ValdUtil.isNotNull($this.currDbMngrGmdlNo) && $this.currDbMngrGmdlNo !== this.params.gmdlNo && this.params.mngrOnlyYn === 'Y') {
                    msg = '이미 ' + $this.currDbMngrGmdlNo + ' 모델번호가 <br> 관리자 전용으로 등록되어있습니다. <br>' + $this.params.gmdlNo + ' 모델번호로 변경하시겠습니까?';
                    $this.isChngMngrYn = 'Y';
                } else {
                    $this.isChngMngrYn = 'N';
                }
                $this.confirm({
                    content:  msg,
                    callback: {
                        yes() {
                            $this.saveStatCdCnfm(msg);
                        }
                    }
                });
            });
        },
        // 검증 여부 알림
        bfSaveStatCnfm(){
            const $this = this;
            if(!$this.validateParam()) {
                return false;
            }

            let msg = "저장하시겠습니까?";
            if($this.params.gmdlStatCd != 'NORM'){
                msg = "입력한 API Key가 검증되지 않았습니다. <br> 저장하시겠습니까?";
            }
            $this.confirm({
                    content:  msg,
                    callback: {
                        yes() {
                            $this.bfSaveIsChngMngrYn();
                        }
                    }
                });
        },
        // 관리자 전용여부 변경체크
        async bfSaveIsChngMngrYn(){
            const $this = this;
            let msg = '저장하시겠습니까?';
            await $this.doPost('/cmon/sys/gmdlMng/selectChckMngrOnlyGmdlNo.hb', $this.params).then(function (res) {
                if(res.data.rtnCd === '0000') {
                    $this.currDbMngrGmdlNo = res.data.rtnData.result;
                } else {
                    $this.alert(res.data.message); 
                }
            });
            $this.$nextTick(() =>{
                
                if(ValdUtil.isNotNull($this.currDbMngrGmdlNo) && $this.currDbMngrGmdlNo !== this.params.gmdlNo && this.params.mngrOnlyYn === 'Y') {
                    msg = '이미 ' + $this.currDbMngrGmdlNo + ' 모델번호가 <br> 관리자 전용으로 등록되어있습니다. <br>' + $this.params.gmdlNo + ' 모델번호로 변경하시겠습니까?';
                    $this.isChngMngrYn = 'Y';
                    $this.confirm({
                        content:  msg,
                        callback: {
                            yes() {
                                $this.saveGmdlMng();
                            }
                        }
                    });
                } else {
                    $this.isChngMngrYn = 'N';
                    $this.saveGmdlMng();
                }
               
            });
        },
        // 저장
        saveGmdlMng(){
            const $this = this;
            $this.params['isChngMngrYn'] = $this.isChngMngrYn;
            $this.doPost('/cmon/sys/gmdlMng/saveGmdlInfo.hb', $this.params).then(function (res) {
                if(res.data.rtnCd === '0000') {
                    const rtnData = res.data.rtnData;
                    $this.alert("저장이 완료되었습니다.");
                    $this.params.crud = "U";
                    $this.selectList();
                } else {
                    $this.alert(res.data.message); 
                    return false;
                }
            });
        },
        deltCnfm(){
            const $this = this;
            const params = {
                gmdlNo     : $this.params.gmdlNo,
                gmdlStatCd : "DEPR"
            };
            $this.confirm({
                content:  "삭제하시겠습니까?",
                callback: {
                    yes() {
                        $this.doPost('/cmon/sys/gmdlMng/deleteGmdlInfo.hb', params).then(function(res) {
                            if(res.data.rtnCd === '0000') {
                                $this.alert("삭제가 완료 되었습니다.");
                                $this.init();
                            } else {
                               $this.alert(res.data.message); 
                               return false;
                            }
                        });
                    }
                }
            })
        },
        // onSelectBetweenDatePicker(date) {
        //     this.params.strtDt = date.frDt;
        //     this.params.endDt  = date.toDt;
        // },
        changeTab(index) {
            const $this = this;

            if(index == 1) {
                // 토큰제한 설정이력 기능 제한
                $this.alert("현재 지원하지 않는 기능입니다.");
                return false;
            }

            $this.currentTabIdx = index;
            if(index === 1){
                let gridObj        = $this.$refs.setHistGrid.getGridObj();
                const wrapperWidth = $("#tabArea").width();
                $(gridObj).jqGrid('setGridWidth', wrapperWidth).trigger('reloadGrid');
            }
        },        
         // 공통버튼(초기화, 조회, 저장, 삭제) 컴포넌트 핸들러
        onSetButtonClick (div) {
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.init();
                    break;
                case 'select':
                    $this.selectList();
                    $this.initParams();
                    break;
                case 'save':
                    $this.bfSaveStatCnfm();
                    break;
                case 'delete':
                    $this.deltCnfm();
                    break;
                default:
                    $this.alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
        },
        // 그리드 콤보박스 바인딩
        formatGridComboValue(value, code) {
            let selectedItem = code.find(function(item) {
                return item.cdVal === value;
            })
            return selectedItem ? selectedItem.cdNm : value;
        },
        apiKeyFocusOut() {
            const $this = this;
            const reg = /[ㄱ-ㅎㅏ-ㅣ가-힣]/;
            
            // 한글이 포함되어 있다면 제거
            if (reg.test(this.params.gmdlApiKey)) {
                this.params.gmdlApiKey = this.params.gmdlApiKey.replace(reg, '');
            }

            $this.params.gmdlStatCd = "STBY";
        },
        // API 키 검증
        keyVerify() {
            const $this = this;
            const gmdlApiKey = $this.params.gmdlApiKey;
            const gmdlKindCd = $this.params.gmdlKindCd;
            const gmdlStatCd = $this.params.gmdlStatCd;

            let params = {
                gmdlKindCd : gmdlKindCd,
                gmdlApiKey : gmdlApiKey
            };

            if(ValdUtil.isNull(gmdlKindCd)) {
                $this.alert("사용모델을 선택해주세요.");
                return false;
            }

            if(ValdUtil.isNull(gmdlApiKey)) {
                $this.alert("API Key를 입력해주세요.");
                return false;
            }

            if(gmdlStatCd != "STBY") {
                $this.alert("이미 API 키 검증/변환처리 완료된 상태입니다");
                return false;
            }

            $this.confirm({
                content:  "Key 검증을 진행하시겠습니까?",
                callback: {
                    yes() {
                        $this.doPost('/cmon/sys/gmdlMng/doApiKeyValidation.hb', params).then(function (res) {
                            let result = res.data;
                            console.log("res",res);
                            if (result.rtnCd === '0000') {
                                if(result.rtnData.rsltCd === '00'){
                                    $this.params.gmdlApiKey = result.rtnData.gmdlApiKey;
                                    $this.params.gmdlStatCd = result.rtnData.gmdlStatCd;
                                    $this.alert("Key 검증이 완료되었습니다.");
                                    
                                } else {
                                    $this.alert(result.rtnData.rsltCntn);
                                }
                            }
                        });
                    }
                }
            });
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