<template>
    <div>
        <!-- 검색조건 -->
        <div class="section section1">
            <div class="search-box">
                <div class="input-box w-100">
                    <div class="w-5 ib">
                        <h1>검색조건</h1>
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-40 ib">검색어</h2>
                        <input class="c-wd-40 ib" type="text" ref="srchWord" v-model="srchParams.srchWord" v-on:keyup.enter="searchListRwordMng(true)">
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-70 ib">정보취득방법</h2>
                        <select class="c-wd-70" v-model="srchParams.linkProcMethCd" @change="searchListRwordMng(true)">
                            <option v-for="item in code.linkProcMethCdList" :key="item.cdVal" :value="item.cdVal">{{item.cdNm}}</option>
                        </select>
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-50 ib">사용여부</h2>
                        <label v-for="el in code.ynCdList" :key="el">
                            <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="srchParams.useYn" style="top:2px; left:-3px;" @change="searchListRwordMng(true)">
                            <p :class="el.cdVal === '' ?'pointer ib wd-30' : 'pointer ib wd-20'">{{ el.cdVal === '' ? '전체' : el.cdNm }}</p>
                        </label>
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="true" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- 예약어목록 -->
        <div class="section sectionL">
            <div class="section-wrap">
                <h2 class="ib">예약어 목록</h2>
                <button class="btn-exel-download only" v-on:click="downloadExcel()">
                    <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                    <p>다운로드</p>
                </button>
                
                <!-- 그리드 -->
                <Grid ref="grid" :dataParams="srchParams" :paging="true"></Grid>
            </div>
        </div>

        <!-- 상세정보 -->
        <div class="section sectionR">
            <div class="section-wrap p-t-22">
                <h2>예약어 정보</h2>
                <div class="section-part part1 m-b-20">
                    <div class="w-100">
                        <div class="w-50 ib">
                            <span class="wd-80 t-a-r essn">예약어ID</span>
                            <input class="c-wd-80" type="text" v-model="rwordInfo.rwordId" :disabled="params.crud == 'U'">
                        </div>
                        <div class="w-50 ib p-l-10">
                            <span class="wd-80 t-a-r essn">예약어명</span>
                            <input class="c-wd-80" type="text" v-model="rwordInfo.rwordNm">
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-50 ib">
                            <span class="wd-80 t-a-r essn">정보취득방법</span>
                            <select class="c-wd-80" v-model="rwordInfo.linkProcMethCd">
                                <option v-for="item in code.linkProcMethCdList" :key="item.cdVal" :value="item.cdVal">{{item.cdNm}}</option>
                            </select>
                        </div>
                        <div class="w-50 ib p-l-10">
                            <span class="wd-80 t-a-r essn">사용여부</span>
                            <select class="c-wd-80" v-model="rwordInfo.useYn">
                                <option value = 'Y'>사용</option>
                                <option value = 'N'>미사용</option>
                            </select>
                        </div>
                    </div>
                    <div class="text-box">
                        <span class="wd-80 t-a-r">설명</span>
                        <textarea spellcheck="false" class="c-wd-80 ta-r-n" style="height:100px !important;" v-model="rwordInfo.rmrk"></textarea>
                    </div>
                </div>
                <!-- 탭 영역 -->
                <div class="section-part part2">
                    <div id="tabs" class="w-100">
                        <ul class="tab-menu">
                            <li class="pointer" v-for="(tab, index) in tabs" v-bind:key="index" v-bind:class="{active:currentTab===index}" @click="changeTab(index)">
                                <a href="#">{{tab}}</a>
                            </li>
                        </ul>
                        <div class="tab-contents p-b-5" style="min-height: calc(100vh - 485px) !important; ">
                            <!-- DB(SQL) -->
                            <div v-show="currentTab == 0">
                                <div class="inner-tab-content con1">
                                    <div class="b">
                                        <span class="wd-70 t-a-r essn">DB연결ID</span>
                                        <select class="c-wd-70" v-model="rwordInfo.dbConnId">
                                            <option value = ''></option>
                                            <option v-for="el in code.dbConnIdList" :key="el.colId" :value="el.colId">{{el.colId + ' | ' +el.colNm}}</option>
                                        </select>
                                    </div>
                                    <div class="text-box">
                                        <span class="wd-70 t-a-r">SQL문장</span>
                                        <textarea spellcheck="false" class="c-wd-70 ta-r-n" style="height: 370px !important;" v-model="rwordInfo.linkProcSql"></textarea>
                                    </div>
                                </div>
                            </div>
                            <!-- 모듈연동 -->
                            <div v-show="currentTab == 1">
                                <div class="inner-tab-content con2">
                                    <h2>연동설정 정보</h2>
                                    <div>
                                        <span class="wd-80 t-a-r">인증URL</span>
                                        <input class="c-wd-80" type="text" v-model="rwordInfo.authUrl" :disabled="rwordInfo.linkProcMethCd =='10'">
                                    </div>
                                    <div>
                                        <span class="wd-80 t-a-r">인증키</span>
                                        <input class="c-wd-80" type="text" v-model="rwordInfo.authKey" :disabled="rwordInfo.linkProcMethCd =='10'">
                                    </div>
                                    <div class="text-box">
                                        <span class="wd-80 t-a-r">인증값</span>
                                        <textarea spellcheck="false" class="c-wd-80 ta-r-n" style="height: 60px !important;" v-model="rwordInfo.authVal" :disabled="rwordInfo.linkProcMethCd =='10'"></textarea>
                                    </div>
                                    <div class="text-box">
                                        <span class="wd-80 t-a-r">연계처리모듈명</span>
                                        <input class="c-wd-80" type="text" v-model="rwordInfo.linkProcModuNm" :disabled="rwordInfo.linkProcMethCd =='10'">
                                    </div>
                                    <h2>파라미터정의</h2>
                                    <div class="w-50-mr2 ib">
                                        <div  v-for="(el, i) in linkParamList" :key="el.idenSeq">
                                            <span class="wd-80 t-a-r">{{'Key ' + (i+1) }}</span>
                                            <input class="c-wd-80" type="text" v-model="linkParamList[i].linkKey" />
                                        </div> 
                                    </div>
                                    <div class="w-50-ml2 ib">
                                        <div v-for="(el, i) in linkParamList" :key="el.idenSeq">
                                            <span class="wd-80 t-a-r">{{'Value ' + (i +1) }}</span>
                                            <input class="c-wd-80" type="text" v-model="linkParamList[i].linkVal" />
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
</template>

<script>

import { reactive, ref, inject } from 'vue'
import Grid                      from '@/components/grid/Grid.vue'
import SetButton                 from '@/components/SetButton.vue'
import { ValdUtil }              from '@/utils/ValdUtil'
import { DateUtil }              from '@/utils/DateUtil.js'

export default {
    components: {
        Grid,
        SetButton,
    },

    setup() {        
        // 전역 mixin의 메소드를 inject를 통해 가져옴
        const getCmonCdList = inject('getCmonCdList');

        let code = reactive({
            linkProcMethCdList : [],
            dbConnIdList       : [],
            ynCdList           : []
        });

        let currentTab = ref(0);
        let tabs       = ['DB(SQL)', '모듈연동'];

        // inject를 통해 가져온 공통코드 호출 함수를 이용하여 공통코드 get
        getCmonCdList('LINK_PROC_METH_CD', code.linkProcMethCdList, 'Y', null);
        const colIdNmDbConnIdData = {   'tblId'  :'te_db_conn_info',
                                        'colId'  :'db_conn_id',
                                        'colNm'  :'db_conn_nm',
                                        'where'  : [
                                            {'andCol' : '1',
                                            'andCalc' : '=',
                                            'andVal'  : "1" }
                                        ],
                                        'orderby' : [
                                            {'orderCol' : 'db_conn_id'}
                                           ,{'orderCol' : 'db_conn_nm'}
                                        ]
        };  
        
        const getDbConnList = inject('getDbConnList');
        getDbConnList(colIdNmDbConnIdData, code.dbConnIdList, 'N', null);
        
        const getYnCdList = inject("getCmonCdList");
        getYnCdList('YN', code.ynCdList, 'Y', null);


        return {
            currentTab,
            tabs,
            code,
        };
    },
    data: function() {
      return {
            srchParams: {
                srchWord       : '',   // 검색조건_검색어
                linkProcMethCd : '',   // 검색조건_정보_취득_방법
                useYn          : '',   // 검색조건_사용여부
            },
            params : {
                crud           : 'C',
                rwordId        : '',    // 그리드_정보_예약어_ID
            },
            rwordInfo: {
                rwordId        : '',    // 예약어_ID
                rwordNm        : '',    // 예약어_명
                linkProcMethCd : '',    // 정보_취득_방법
                dbConnId       : '',    // DB_연결_ID
                linkProcSql    : '',    // DB_연결_SQL
                authUrl        : '',    // 인증_URL
                authKey        : '',    // 인증_KEY
                authVal        : '',    // 인증_VAL
                linkProcModuNm : '',    // 연계_처리_모듈_명
                useYn          : '',    // 사용여부
                rmrk           : '',    // 비고
            },
            linkParamList : [],         // 모듈연동_링크파라미터 리스트
            useEnvInfo    : [],         // 사용환경정보
        }
    },
    methods: {
        init() {
            const $this = this;
            $this.useEnvInfo = [];
            $this.CmonUtil.getUseEnvInfo($this.useEnvInfo, function(obj) {
                $this.useEnvInfo = obj;
                $this.$nextTick(()=>{
                    $this.CmonUtil.setFocus($this.$refs.srchWord);
                    $this.reset();
                    $this.$nextTick(()=>{
                        $this.initGrid();
                    })
                    
                })
            });
        },
        initGrid() {
            let $this = this;

            let gridObj = {
                url: '/cmon/env/rwordMng/selectListRwordMng.hb',
                colModels: [
                    {name:'rwordId'         ,label: '예약어ID'      ,width: 50    , align:'left'   },
                    {name:'rwordNm'         ,label: '예약어명'      ,width: 50    , align:'left'   },
                    {name:'linkProcMethCd'  ,label: '정보취득코드'  ,width: 50    , align:'left'    , hidden : true},
                    {name:'linkProcMethNm'  ,label: '정보취득방법'  ,width: 50    , align:'left'   },
                    {name:'useYn'           ,label: '사용여부'      ,width: 20    , align:'center' },
                ],
                options: {
                    height      : 599,                  
                    rownumbers  : true,
                    onSelectRow : function(rowid){
                        $this.params.rwordId = $(this).jqGrid('getRowData', rowid).rwordId;
                        $this.params.crud    = 'U';
                        $this.selectRwordMngInfo();
                    },
                },
            };
            $this.$refs.grid.init(gridObj);
            $this.searchListRwordMng(true);
        },
        // 그리드 조회
        searchListRwordMng() {
            const $this = this;
            $this.$refs.grid.selectList(true);
        },
        // 상세조회
        selectRwordMngInfo() {
            const $this = this;
            let params  = _.cloneDeep($this.params);
            $this.doPost('/cmon/env/rwordMng/selectRwordMng.hb', params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    $this.rwordInfo     = result.rtnData.rwordInfo;         
                    if(result.rtnData.rwordInfo.linkProcMethCd === '20'){
                        $this.setLinkParamList(result.rtnData.linkParamInfo);
                    }
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },
        // 상세조회 시 링크 파라미터 세팅
        setLinkParamList(data){
            const $this = this;
            data.forEach((el,idx) => {
                $this.linkParamList[idx] = el;
            });
        },
        // Validation
        isVald(div){
            const $this = this;
            // 저장
            if(div === 'C'){
                let linkCd   = $this.rwordInfo.linkProcMethCd;
                // null 체크 및 길이 체크 (data / 길이 / msg / null 체크 여부=디폴트 true)
                if (!$this.ValdUtil.valdLenNull($this.rwordInfo.rwordId,          100,  '예약어ID는'))          return false;
                if (!$this.ValdUtil.valdLenNull($this.rwordInfo.rwordNm,          100,  '예약어명은'))          return false;
                if (!$this.ValdUtil.valdLenNull($this.rwordInfo.linkProcMethCd,    20,  '정보취득방법은'))      return false;
                if (!$this.ValdUtil.valdLenNull($this.rwordInfo.useYn,             20,  '사용여부는'))          return false;

                // DB(SQL)
                if (linkCd == '10') {
                    if (!$this.ValdUtil.valdLenNull($this.rwordInfo.dbConnId,      20,  'DB연결ID는'))          return false;
                    if (!$this.ValdUtil.valdLenNull($this.rwordInfo.linkProcSql, null,  'SQL문장은'))           return false;
                }
                //RESTful
                else if(linkCd === '20'){
                    let errMsg = "Restful 연동인 경우 반드시 Key/Value 값을 지정해야 합니다.";
                    if(ValdUtil.isEmptyList($this.linkParamList)){
                        $this.alert(errMsg);
                        return false;
                    }
                    // Key 또는 Value값 둘 중 한개라도 비어있을 시 alert
                    const isEmptyKey = $this.linkParamList.filter(el => el.linkKey ==''  && el.linkVal !=='');
                    const isEmptyVal = $this.linkParamList.filter(el => el.linkKey !=='' && el.linkVal =='');
                    if(isEmptyKey.length > 0){
                        $this.alert(errMsg);
                        return false;
                    }
                    if(isEmptyVal.length > 0){
                        $this.alert(errMsg);
                        return false;
                    }
                }
            }
            // 삭제
            else if(div === 'D'){
                if($this.params.crud != 'U' && ValdUtil.isNull($this.params.rwordId)){
                    $this.alert("먼저 상세정보를 조회한 다음에 삭제할 수 있습니다.");
                    return false;
                }
            }
           

            return true;
        },
        //저장 컨펌
        saveRwordCnfm(){
            const $this = this;
            if($this.isVald('C')){
                let linkCd = $this.rwordInfo.linkProcMethCd;
                // Restful
                if(linkCd === '20'){
                    if($this.ValdUtil.isNull($this.rwordInfo.authUrl) || $this.ValdUtil.isNull($this.rwordInfo.authKey) || $this.ValdUtil.isNull($this.rwordInfo.authVal)) {
                        $this.confirm({
                            content  : 'Restful 연결인증이 없습니다. 저장하시겠습니까?',
                            callback : {
                                yes() {
                                    $this.saveRwordMng();
                                }
                            }
                        })
                    } else {
                        $this.saveRwordMng();
                    }
                } else {
                    $this.saveRwordMng();
                }
            }
        },
        // 저장
        saveRwordMng(){
            const $this = this;
            let params = {
                useEnvNo       : $this.useEnvInfo.useEnvNo,
                crud           : $this.params.crud,
                rwordId        : $this.rwordInfo.rwordId,
                rwordNm        : $this.rwordInfo.rwordNm,
                linkProcMethCd : $this.rwordInfo.linkProcMethCd,
                dbConnId       : $this.rwordInfo.dbConnId,
                linkProcSql    : $this.rwordInfo.linkProcSql,
                authUrl        : $this.rwordInfo.authUrl,
                authKey        : $this.rwordInfo.authKey,
                authVal        : $this.rwordInfo.authVal,
                linkProcModuNm : $this.rwordInfo.linkProcModuNm,
                useYn          : $this.rwordInfo.useYn,
                rmrk           : $this.rwordInfo.rmrk,
                linkParamList  : $this.linkParamList 
            }
            $this.doPost('/cmon/env/rwordMng/saveRwordMng.hb', params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    $this.alert("저장되었습니다.").then((result) => {
                        if ( result.isConfirmed ) {
                            $this.init();
                        }
                    });
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },

        //삭제 컨펌창
        deltRwordCnfm () {
            const $this = this;
            if($this.isVald('D')){
                $this.confirm({
                    content: '예약어ID : ' + $this.rwordInfo.rwordId + ' 을(를) 삭제하시겠습니까?',
                    callback: {
                        yes() {
                            $this.deltRwordMng();
                        }
                    }
                })
            }
        },
        // 예약어정보 delete
        deltRwordMng() {
            const $this = this;
            let params = _.cloneDeep($this.rwordInfo);
            $this.doPost('/cmon/env/rwordMng/deleteRwordMng.hb', params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    $this.alert("정상 삭제 처리되었습니다.").then((result) => {
                        if ( result.isConfirmed ) {
                            $this.init();
                        }
                    });
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },

            // 초기화
        reset() {
            const $this = this;
            $this.resetList();
            $this.resetParams();
            $this.resetSrchParams();
            $this.resetRwordInfo();
        },
        // 리스트 초기화
        resetList(){
            const $this = this;
            $this.linkParamList = [];
            if(($this.linkParamList.length == 0)){
                for(let i = 0; i < 5; i++){
                    $this.linkParamList.push({'idenSeq':i+1,'linkKey':'','linkVal':''});
                }
            }
        },


        //검색조건 초기화
        resetSrchParams(){
            const $this = this;
            $this.srchParams = {
                srchWord       : '',   // 검색조건_검색어
                linkProcMethCd : '',   // 검색조건_정보_취득_방법
                useYn          : '',
            }
        },
        // 파라미터 초기화
        resetParams(){
            const $this = this;
            $this.params = {
                crud           : 'C',
                rwordId        : '',  
            }
        },
        //  예약어정보 초기화
        resetRwordInfo() {
            const $this = this;
            $this.rwordInfo = {
                rwordId        : '',    // 예약어_ID    
                rwordNm        : '',    // 예약어_명
                linkProcMethCd : '',    // 정보_취득_방법
                dbConnId       : '',    // DB_연결_ID
                linkProcSql    : '',    // DB_연결_SQL
                authUrl        : '',    // 인증_URL
                authKey        : '',    // 인증_KEY
                authVal        : '',    // 인증_VAL
                linkProcModuNm : '',    // 연계_처리_모듈_명
                useYn          : '',    // 사용여부
                rmrk           : '',    // 비고
            };
        },


        // 공통버튼(초기화, 조회, 저장, 삭제) 컴포넌트 핸들러
        onSetButtonClick (div) {
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.init();
                    break;
                case 'select':
                    $this.searchListRwordMng();
                    break;
                case 'save':
                    $this.saveRwordCnfm();
                    break;
                case 'delete':
                    $this.deltRwordCnfm();
                    break;
                default:
                    $this.alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
        },
        //탭 변경
        changeTab(index) {
            if(this.ValdUtil.isNotNull(index)) {
                this.currentTab = index;
            } else {
                index = this.currentTab;
            }
        },
        // 엑셀다운로드        
        downloadExcel(){
            const $this = this;
            let gridData = $this.$refs.grid.getGridObj().jqGrid('getRowData');

            if(!ValdUtil.isEmptyList(gridData)){
                let fileNm = '예약어목록_'+DateUtil.getCurrDate('YYYYMMDD')+'.xlsx';
                let url    = '/cmon/env/rwordMng/selectListRwordDownloadExcel.hb';
                let params = _.cloneDeep($this.srchParams);
                $this.doDownExcel(url, params, fileNm);    
            } else {
                $this.alert('엑셀다운로드 대상이 없습니다');
                return false;
            }
        },
    },
    mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>
