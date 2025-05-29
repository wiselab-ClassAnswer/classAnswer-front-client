<template>
    <div>
        <!-- 검색조건 -->
        <div class="section section1">
            <div class="search-box">
                <div class="input-box">
                    <div class="w-5 ib">
                        <h1>검색조건</h1>
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-40 ib">검색어</h2>
                        <input class="c-wd-40 ib" ref="srchWord" type="text" v-model="srchParams.srchWord" v-on:keyup.enter="searchListDbConnMngGrid(true)">
                    </div>                    
                    <div class="w-20 ib">
                        <h2 class="wd-50 ib">DB유형</h2>
                        <label v-for="el in code.dbTypeList" :key="el">
                            <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="srchParams.dbTypeCd" style="top:2px; left:-3px;" @change="searchListDbConnMngGrid(true)">
                            <p :class="el.cdVal === '' ?'pointer ib wd-30' : 'pointer ib wd-45'">{{ el.cdVal === '' ? '전체' : el.cdNm }}</p>
                        </label>
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="true" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- 사용자 목록 -->
        <div class="section sectionL">
            <div class="section-wrap">
                <h2 class="ib">DB연결 목록</h2>
                <button class="btn-exel-download only" v-on:click="downloadExcel()">
                    <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                    <p>다운로드</p>
                </button>

                <!-- 그리드 -->
                <Grid ref="grid" :dataParams="srchParams" :paging=true></Grid>
            </div>
        </div>

        <div class="section section5 w-50" style="height:755px !important;">
            <div id="tabs" class="w-100 p-b-0 p-t-8">
                <ul class="tab-menu">
                    <li v-for="(tab, index) in tabs" v-bind:key="index" v-bind:class="{active:currentTabIdx===index}" @click="changeTab(index)" style="cursor: pointer;">
                        <a href="#">{{tab}}</a>
                    </li>
                </ul>
            </div>
            <div class="section-wrap m-t-0" style="height:728px !important;">
                <!-- DB연결정의 -->
                <div v-show="currentTabIdx == 0">
                    <h2 class="ib">DB연결 정보</h2>
                    <div class="t-a-r btn-group-box ib">
                        <button class="btn-normal ib" @click="setPgLink()">
                            <font-awesome-icon class="ib m-r-5" :icon="['fas', 'up-right-from-square']" />
                            <p class="ib">테이블관리</p>
                        </button>  
                    </div>
                    <div class="section-part part1 ib">
                        <div class="w-50 p-r-10">
                            <span class="wd-80 essn">DB연결ID</span>
                            <input class="c-wd-80" type="text" v-model="detlParams.dbConnId" :disabled="disabledDbConnId">
                        </div>
                        <div class="w-50 p-l-10">
                            <span class="wd-80 essn">DB연결명</span>
                            <input class="c-wd-80" type="text" v-model="detlParams.dbConnNm">
                        </div>
                        <div class="w-50 p-r-10">
                            <span class="wd-80 essn">연결유형</span>
                            <select class="c-wd-80" v-model="detlParams.dbTypeCd" @blur="watchChngInfo()">
                                <option v-for="item in code.dbTypeList" :key="item.cdVal" :value="item.cdVal">{{item.cdNm}}</option>
                            </select>
                        </div>
                        <div class="w-50 p-l-10">
                            <span class="wd-80">메타DB연결ID</span>
                            <select class="c-wd-80" v-model="detlParams.metaDbConnId" @blur="watchChngInfo()">
                                    <option value = ''></option>
                                    <option v-for="el in code.metaDbList" :key="el.colId" :value="el.colId">{{el.colId + ' | ' +el.colNm}}</option>
                                </select>
                        </div>
                        <div class="w-50 p-r-10">
                            <span class="wd-80 essn">DB종류</span>
                            <select class="c-wd-80" v-model="detlParams.dbKindCd" @blur="watchChngInfo()">
                                    <option v-for="item in code.dbKindList" :key="item.cdVal" :value="item.cdVal">{{item.cdNm}}</option>
                            </select>
                        </div>
                        <div class="w-50 p-l-10">
                            <span class="wd-80 essn">Host(IP)</span>
                            <input class="c-wd-80" type="text" v-model="detlParams.dbIp" @blur="watchChngInfo()">
                        </div>
                        <div class="w-50 p-r-10">
                            <span class="wd-80 essn">Port No</span>
                            <input class="c-wd-80" type="text" v-model="detlParams.dbPort" @blur="watchChngInfo()">
                        </div>
                    
                        <div class="w-50 p-l-10">
                            <span class="wd-80 essn">DB명</span>
                            <input class="c-wd-80" type="text" v-model="detlParams.dbNm" @blur="watchChngInfo()">
                        </div>
                        <div class="w-50 p-r-10">
                            <span class="wd-80">SID</span>
                            <input class="c-wd-80" type="text" v-model="detlParams.orclSid" :disabled="disabledOrclSid" @blur="watchChngInfo()">
                        </div>
                        <div class="w-50 p-l-10">
                            <span class="wd-80">스키마</span>
                            <input class="c-wd-80" type="text" v-model="detlParams.schId" :disabled="disabledSchId" @blur="watchChngInfo()">
                        </div>                    
                        <div class="w-50 p-r-10">
                            <span class="wd-80 essn">사용자ID</span>
                            <input class="c-wd-80" type="text" v-model="detlParams.dbUserId" @blur="watchChngInfo()">
                        </div>
                        <div class="w-50 p-l-10">
                            <span class="wd-80 essn">비밀번호</span>
                            <input class="c-wd-80" type="password" v-model="detlParams.dbUserPwsd" @blur="watchChngInfo()">
                        </div>
                        <div class="w-100">
                            <span  class="wd-80">TABLE SPACE</span>
                            <input class="c-wd-80" type="text" v-model="detlParams.tsNm" :disabled="disabledOrclSid" @blur="watchChngInfo()">
                        </div>
                        <div class="w-100 text-box">
                            <span class="wd-80">참고사항</span>
                            <textarea class="c-wd-80 ta-r-n" style="height: 114px" name="" id="" cols="30" rows="10" v-model="detlParams.rmrk"></textarea>
                        </div>
                    </div>
                    <div class="ib w-100 m-t-10">
                        <h2 class="ib w-30 ibd">DB연결 테스트</h2>
                        <div class="dbconnect w-70 ib t-a-r ">
                            <span v-if="connTestParams.dbVrfyRslt == 'SUCC'"    class="ib wd-200 case case1 m-0">연결성공</span>
                            <span v-if="connTestParams.dbVrfyRslt == 'NO_TEST'" class="ib wd-200 case case2 m-0">테스트안함</span>
                            <span v-if="connTestParams.dbVrfyRslt == 'FAIL'"    class="ib wd-200 case case3 m-0">연결실패</span>
                            <button class="wd-60 m-l-10 btn-normal" @click="chckConnVrfy">테스트</button>
                        </div>
                    </div>
                    <div class="section-part part2">
                        <div class="w-100 text-box">
                            <span class="wd-80 f-l m-t-5">테스트결과</span>
                            <textarea spellcheck="false" style="height:265px; max-height:265px;" class="c-wd-80 ta-r-n" name="" id="" cols="30" rows="10" v-model="connTestParams.dbConnTestMsg" :disabled="true"></textarea>
                        </div>
                    </div>
                </div>
                <!-- 장치정의 -->
                <div v-show="currentTabIdx == 1" >
                     <h2 class="ib">DB장치 정보</h2>
                    <div class="t-a-r btn-group-box ib">
                        <button class="btn-normal ib" @click="setPgLink()">
                            <font-awesome-icon class="ib m-r-5" :icon="['fas', 'up-right-from-square']" />
                            <p class="ib">테이블관리</p>
                        </button>  
                    </div>
                    <div class="section-part part1 ib">
                        <div class="w-50 p-r-10">
                            <span class="wd-80 essn">DB연결ID</span>
                            <input class="c-wd-80" type="text" v-model="srvrConnParams.dbConnId"  :disabled="disabledDevcInfo" @blur="watchChngInfo()">
                        </div>
                        <div class="w-50 p-l-10">
                            <span class="wd-80">장치명</span>
                            <input class="c-wd-80" type="text" v-model="srvrConnParams.devcNm" @blur="watchChngInfo()">
                        </div>
                        <div class="w-50 p-r-10">
                            <span class="wd-80 essn">장치 IP</span>
                            <input class="c-wd-80" type="text" v-model="srvrConnParams.devcIp" :disabled="disabledDevcInfo" @blur="watchChngInfo()">
                        </div>
                        <div class="w-50 p-l-10">
                            <span class="wd-80 essn">장치 Port No</span>
                            <input class="c-wd-80" type="text" v-model="srvrConnParams.devcPort" @blur="watchChngInfo()">
                        </div>
                        <div class="w-50 p-r-10">
                            <span class="wd-80 essn">DB종류</span>
                            <select class="c-wd-80" v-model="srvrConnParams.dbKindCd" :disabled="disabledDevcInfo" @blur="watchChngInfo()">
                                <option v-for="el in code.dbKindList" :key="el.cdVal" :value="el.cdVal">
                                    {{el.cdNm}}
                                </option>
                            </select>
                        </div>
                        <div class="w-50 p-l-10">
                            <span class="wd-80 essn">SHELL유형</span>
                            <select class="c-wd-80" v-model="srvrConnParams.shelTypeCd">
                                <option v-for="el in code.shelTypeCdList" :key="el.cdVal" :value="el.cdVal" @blur="watchChngInfo()">
                                    {{el.cdVal === '' ? '' : el.cdVal +' | '+ el.cdNm }}
                                </option>
                            </select>
                        </div>
                        <div class="w-50 p-r-10">
                            <span class="wd-80 essn">OS유형</span>
                            <select class="c-wd-80" v-model="srvrConnParams.osTypeCd">
                                <option v-for="el in code.osTypeCdList" :key="el.cdVal" :value="el.cdVal" @blur="watchChngInfo()">
                                    {{el.cdNm}}
                                </option>
                            </select>
                        </div>
                    
                        <div class="w-50 p-l-10">
                            <span class="wd-80 essn">인증방식</span>
                            <select class="c-wd-80" v-model="srvrConnParams.srvrAuthMethCd">
                                <option v-for="el in code.srvrAuthMethCdList" :key="el.cdVal" :value="el.cdVal" @blur="watchChngInfo()">
                                    {{el.cdNm}}
                                </option>
                            </select>
                        </div>
                        <div class="w-50 p-r-10">
                            <span class="wd-80">인증키경로</span>
                            <input class="c-wd-80" type="text" v-model="srvrConnParams.authKeyFilePath" @blur="watchChngInfo()">
                        </div>
                        <div class="w-50 p-l-10">
                            <span class="wd-80">인증키명</span>
                            <input class="c-wd-80" type="text" v-model="srvrConnParams.authKeyFileNm" @blur="watchChngInfo()">
                        </div>                    
                        <div class="w-50 p-r-10">
                            <span class="wd-80 essn">사용자ID</span>
                            <input class="c-wd-80" type="text"  v-model="srvrConnParams.userId" @blur="watchChngInfo()">
                        </div>
                        <div class="w-50 p-l-10">
                            <span class="wd-80 essn">비밀번호</span>
                            <input class="c-wd-80" type="password"  v-model="srvrConnParams.userPwsd" @blur="watchChngInfo()">
                        </div>
                            <div class="w-50 p-r-10">
                                <span  class="wd-80 essn">작업경로</span>
                                <input class="c-wd-80" type="text" v-model="srvrConnParams.jobPath" @blur="watchChngInfo()">
                            </div>
                            <div class="w-50 p-l-10">
                                <span  class="wd-80">오라클디렉토리</span>
                                <input class="c-wd-80" type="text" v-model="srvrConnParams.orclDir" :disabled="disabledOrclDir" @blur="watchChngInfo()">
                            </div>
                        <div class="w-100 text-box">
                            <span class="wd-80">참고사항</span>
                            <textarea class="c-wd-80 ta-r-n" style="height: 114px" name="" id="" cols="30" rows="10" v-model="srvrConnParams.rmrk"></textarea>
                        </div>
                    </div>
                    <div class="ib w-100 m-t-10">
                        <h2 class="ib w-30 ibd">장치연결 테스트</h2>
                        <div class="dbconnect w-70 ib t-a-r ">
                            <span v-if="connTestParams.devcVrfyRslt == 'SUCC'"    class="ib wd-200 case case1 m-0">연결성공</span>
                            <span v-if="connTestParams.devcVrfyRslt == 'NO_TEST'" class="ib wd-200 case case2 m-0">테스트안함</span>
                            <span v-if="connTestParams.devcVrfyRslt == 'FAIL'"    class="ib wd-200 case case3 m-0">연결실패</span>
                            <button class="wd-60 m-l-10 btn-normal" @click="chckConnVrfy">테스트</button>
                        </div>
                    </div>
                    <div class="section-part part2">
                        <div class="w-100 text-box">
                            <span class="wd-80 f-l m-t-5">테스트결과</span>
                            <textarea spellcheck="false" style="height:265px; max-height:265px;" class="c-wd-80 ta-r-n" name="" id="" cols="30" rows="10" v-model="connTestParams.dbSrvrTestMsg" :disabled="true"></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { reactive, ref, inject } from 'vue'
import { DateUtil }              from '@/utils/DateUtil.js'
import { ValdUtil }              from '@/utils/ValdUtil.js'
import { CmonUtil }              from '@/utils/CmonUtil.js'
import Grid                      from '@/components/grid/Grid.vue'
import SetButton                 from '@/components/SetButton.vue'

export default {
    components: {
        Grid,
        SetButton,
    },  
    setup() {        
        // 전역 mixin의 메소드를 inject를 통해 가져옴
        const getCmonCdList = inject('getCmonCdList');

        let code = reactive({
            dbTypeList         : [],
            dbKindList         : [],
            metaDbList         : [],
            shelTypeCdList     : [],
            osTypeCdList       : [],
            srvrAuthMethCdList : [],
        });

        // inject를 통해 가져온 공통코드 호출 함수를 이용하여 공통코드 get
        getCmonCdList('DB_TYPE_CD'        , code.dbTypeList         , 'Y', null);
        getCmonCdList('DB_KIND_CD'        , code.dbKindList         , 'Y', null);
        getCmonCdList('SHEL_TYPE_CD'      , code.shelTypeCdList     , 'Y', null);
        getCmonCdList('OS_TYPE_CD'        , code.osTypeCdList       , 'Y', null);
        getCmonCdList('SRVR_AUTH_METH_CD' , code.srvrAuthMethCdList , 'Y', null);


        // 메타 DB연결ID
        const metaDbListData = {    'tblId'   : 'te_db_conn_info',
                                    'colId'   : 'db_conn_id',
                                    'colNm'   : 'db_conn_nm',
                                    'where'   : [{
                                                    'andCol' : '1',
                                                    'andCalc': '=',
                                                    'andVal' : "'1'"
                                                }],
                                    'orderby' : [{
                                                    'orderCol' : 'db_conn_id'
                                                }]
                                };  
        const getMetaDbList  = inject('getColIdNmList');
        getMetaDbList(metaDbListData, code.metaDbList, 'N', null);


        //탭 구분
        let currentTabIdx = ref(0);
        let tabs          = ['DB연결정의', 'DB장치정의']

        
        return {
            code,
            tabs,
            currentTabIdx
        };

    },

    data: function() {
      return {
            srchParams: {
                srchWord         : '',
                dbTypeCd         : '',
            },
            params : {
                crud             : 'C',
            },
            detlParams: {
                dbConnId         : '',
                dbConnNm         : '',
                dbTypeCd         : '',
                dbKindCd         : '',
                dbIp             : '',
                dbPort           : '',
                dbNm             : '',
                orclSid          : '',
                dbUserId         : '',
                dbUserPwsd       : '',
                schId            : '',
                tsNm             : '',
                rmrk             : '',
                metaDbConnId     : '',
                
            },
            connTestParams: {
                dbVrfyRslt         : 'NO_TEST',
                devcVrfyRslt       : 'NO_TEST',
                dbConnTestMsg      : '',
                dbSrvrTestMsg      : '',
                dbConnTestRslt     : null,
                dbSrvrConnTestRslt : null,
            },
            srvrConnParams: {
                dbConnId        : '',
                devcNm          : '',
                devcIp          : '',
                devcPort        : '',
                userId          : '',
                userPwsd        : '',
                srvrAuthMethCd  : '',
                authKeyFilePath : '',
                authKeyFileNm   : '',
                osTypeCd        : '',
                dbKindCd        : '',
                shelTypeCd      : '',
                jobPath         : '',
                orclDir         : '',
                rmrk            : ''
            },
        }
    },

    methods: {
        init() {
            const $this = this;
            $this.reset();
            $this.initGrid();
            let data = CmonUtil.getPageLink('E1020');
            if(ValdUtil.isNotNull(data)){
                $this.detlParams.dbConnId = data.dbConnId;
                $this.params.crud = 'U';
                $this.selectDbConnMngSpec();   
            }
            CmonUtil.setFocus($this.$refs.srchWord);
        },
        initGrid() {
            const $this = this;

            let gridObj = {
                url: '/mng/obj/dbConnMng/selectListDbConnMng.hb',
                colModels: [
                    {name:'dbConnId'    ,label: 'DB연결ID'      ,width: 50,     align:'center'},
                    {name:'dbConnNm'    ,label: 'DB연결명'      ,width: 70,     align:'left'},
                    {name:'dbTypeNm'    ,label: 'DB연결유형'    ,width: 50,     align:'center'},
                    {name:'dbIp'        ,label: 'HOST(IP)'     ,width: 60,     align:'center'},
                    {name:'dbPort'      ,label: 'PORT'         ,width: 30,     align:'center'},
                    {name:'dbKindNm'    ,label: 'DB종류'        ,width: 50,     align:'center'},
                    {name:'dbNm'        ,label: 'DB명'          ,width: 50,     align:'left'},
                ],
                options: {
                    height      : 599,
                    rownumbers  : true,
                    onSelectRow : function(rowid){
                        let gridData = $(this).jqGrid('getRowData', rowid);
                        $this.detlParams.dbConnId = gridData.dbConnId;
                        $this.params.crud = 'U';
                        $this.selectDbConnMngSpec();
                    },
                },
            };
            $this.$refs.grid.init(gridObj);
            $this.searchListDbConnMngGrid();
        },
        // 그리드 조회
        searchListDbConnMngGrid() {
            const $this = this;
            $this.resetdetlParams();
            $this.resetSrvrConnParams();
            $this.resetConnTestParams();
            $this.$nextTick(() =>{
                $this.$refs.grid.selectList(true);
            })
        },
        //DB연결정보 상세조회
        selectDbConnMngSpec(){
            const $this = this;
            $this.resetConnTestParams();
            let params = {
                dbConnId : $this.detlParams.dbConnId
            }
            $this.doPost("/mng/obj/dbConnMng/selectDbConnMngSpec.hb", params).then(function(res){ 
                if(res.data.rtnCd === '0000'){
                    $this.detlParams = res.data.rtnData.dbConnMngSpec;
                    let srvrMng     = res.data.rtnData.srvrDevcMng;
                    if(ValdUtil.isNotNull(srvrMng)){
                        $this.srvrConnParams = srvrMng;
                    } else {
                        $this.resetSrvrConnParams();
                        $this.srvrConnParams.dbConnId = $this.detlParams.dbConnId;
                        $this.srvrConnParams.dbKindCd = $this.detlParams.dbKindCd;
                        $this.srvrConnParams.devcIp   = $this.detlParams.dbIp;
                    }
                } else{
                    $this.alert(res.data.rtnMsg);
                }

            })
        },
        // 저장 컨펌
        saveDbConnMngCnfm () {
            const $this = this;
            // DB연결정의 탭 저장
            if(this.currentTabIdx == 0){
                if($this.isVald('dbConn')){
                    // 데이터 객체 trim
                    $this.ValdUtil.trimDataObject($this.detlParams);
                    
                    let params  = {
                        div          : 'dbConn',
                        crud         : $this.params.crud,
                        dbConnId     : $this.detlParams.dbConnId,
                        dbConnNm     : $this.detlParams.dbConnNm,
                        dbTypeCd     : $this.detlParams.dbTypeCd,
                        dbKindCd     : $this.detlParams.dbKindCd,
                        dbIp         : $this.detlParams.dbIp,
                        dbPort       : $this.detlParams.dbPort,
                        dbNm         : $this.detlParams.dbNm,
                        orclSid      : $this.detlParams.orclSid,
                        dbUserId     : $this.detlParams.dbUserId,
                        dbUserPwsd   : $this.detlParams.dbUserPwsd,
                        schId        : $this.detlParams.schId,
                        tsNm         : $this.detlParams.tsNm,
                        rmrk         : $this.detlParams.rmrk,
                        metaDbConnId : $this.detlParams.metaDbConnId
                    }
                    if ($this.connTestParams.dbVrfyRslt !='SUCC') {
                            $this.confirm({
                                content: 'DB연결을 확인하지 않고 저장하시겠습니까?',
                                callback: {
                                    yes() {
                                        $this.saveDbConnMng(params);
                                    }
                                }
                            })
                    } else {
                        $this.saveDbConnMng(params);
                    }
                }
            } else if(this.currentTabIdx == 1){
                if($this.isVald('dbSrvr')){
                    let params = {
                        div             : 'dbSrvr',
                        crud            : $this.params.crud,
                        dbConnId        : $this.srvrConnParams.dbConnId,
                        devcNm          : $this.srvrConnParams.devcNm,
                        devcIp          : $this.srvrConnParams.devcIp,
                        devcPort        : $this.srvrConnParams.devcPort,
                        userId          : $this.srvrConnParams.userId,
                        userPwsd        : $this.srvrConnParams.userPwsd,
                        srvrAuthMethCd  : $this.srvrConnParams.srvrAuthMethCd,
                        authKeyFilePath : $this.srvrConnParams.authKeyFilePath,
                        authKeyFileNm   : $this.srvrConnParams.authKeyFileNm,
                        osTypeCd        : $this.srvrConnParams.osTypeCd,
                        dbKindCd        : $this.srvrConnParams.dbKindCd,
                        shelTypeCd      : $this.srvrConnParams.shelTypeCd,
                        jobPath         : $this.srvrConnParams.jobPath,
                        orclDir         : $this.srvrConnParams.orclDir,
                        rmrk            : $this.srvrConnParams.rmrk
                    }
                    if ($this.connTestParams.devcVrfyRslt !='SUCC') {
                            $this.confirm({
                                content: '장치연결을 확인하지 않고 저장하시겠습니까?',
                                callback: {
                                    yes() {
                                        $this.saveDbConnMng(params);
                                    }
                                }
                            })
                    } else {
                        $this.saveDbConnMng(params);
                    }
                }
            }
            
        },
        // DB연결정보 저장
        saveDbConnMng(params){
            const $this = this;
            
            $this.doPost('/mng/obj/dbConnMng/saveDbConnMng.hb', params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    $this.alert("저장되었습니다").then((result) => {
                        if ( result.isConfirmed ) {
                            $this.reset();
                            $this.searchListDbConnMngGrid();
                        }
                    });
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },
        // 삭제 전 DB연결정보가 단위작업에서 사용하는지 체크
        chckIsExistUnitJob(){
            const $this = this;
            // DB연결정의 탭
            if(this.currentTabIdx == 0){
                let params = {
                    dbConnId : $this.detlParams.dbConnId
                }
                $this.doPost('/mng/obj/dbConnMng/checkUnitJob.hb', params).then(function (res) {
                    if (res.data.rtnCd == '0000') {
                        if(ValdUtil.isNotNull(res.data.rtnData.result)){
                            $this.$nextTick(() => {
                                $this.deltDbConnMngCnfm('dbConn', res.data.rtnData.result);
                            })
                        } else {
                            $this.alert(res.data.rtnMsg);    
                        }
                    } else {
                        $this.alert(res.data.rtnMsg);
                    }
                })
            }
            // DB장치정의 탭
            else if(this.currentTabIdx == 1){
                $this.deltDbConnMngCnfm('dbSrvr', null);
            }
            
        },
        deltDbConnMngCnfm(tabDiv, isChck){
            const $this = this;
            // DB연결설정 탭
            if(tabDiv == 'dbConn'){
                if(ValdUtil.isNotNull($this.detlParams.dbConnId) && $this.params.crud == 'U'){
                    let stmt     = 'DB연결ID : ' + $this.detlParams.dbConnId + '<br> DB연결명 : ' + $this.detlParams.dbConnNm + '<br>';
                    let cntnStmt = '';
                    let params   = {
                        div      : tabDiv,
                        dbConnId : $this.detlParams.dbConnId
                    }
                    // 단위작업에서 사용하는 DB연결정보인 경우
                    if(isChck ==='EXIST'){
                        cntnStmt = stmt + '해당 DB연결ID로 작성된 단위작업이 있습니다. <br> 정말로 삭제하시겠습니까?';
                    // 단위작업에서 사용하는 DB연결정보가 아닌 경우
                    } else if(isChck === 'NOT'){
                        cntnStmt = stmt + '현재 조회된 DB연결정보를 삭제합니다.';
                    } else {
                        $this.alert("오류가 발생하였습니다.");
                        return false;
                    }
                    $this.confirm({
                        content  :  cntnStmt,
                        callback : {
                            yes() {
                                $this.deleteDbConnMng(params);
                            }
                        }
                    })
                } else {
                    $this.alert("삭제할 DB연결정보를 선택해주세요.");
                }
            }
            // DB장치정의 탭
            else if(tabDiv == 'dbSrvr'){
                if(ValdUtil.isNotNull($this.srvrConnParams.dbConnId)){
                    let params = {
                        div      : tabDiv,
                        dbConnId : $this.srvrConnParams.dbConnId
                    }
                    $this.confirm({
                        content  : 'DB연결ID: '+ $this.srvrConnParams.dbConnId + ' 의 장치연결 정보를 삭제하시겠습니까?',
                        callback : {
                            yes() {
                                $this.deleteDbConnMng(params);
                            }
                        }
                    });
                } else {
                    $this.alert("삭제할 DB장치정보를 선택해주세요.");
                }
            }
        },
        // DB연결정보 삭제
        deleteDbConnMng(params) {
            const $this = this;
            
            $this.doPost('/mng/obj/dbConnMng/deleteDbConnMng.hb', params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    $this.alert("삭제되었습니다.").then((result) => {
                        if ( result.isConfirmed ) {
                            $this.reset();
                            $this.searchListDbConnMngGrid();
                        }
                    });
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },
        //  초기화
        reset(){
            const $this = this;
            $this.resetSrchParams();
            $this.resetParams();
            $this.resetdetlParams();
            $this.resetConnTestParams();
            $this.resetSrvrConnParams();
            this.currentTabIdx = 0;
            
            $this.CmonUtil.setFocus($this.$refs.dbConnId);
        },
        //  검색조건 초기화
        resetSrchParams(){
            const $this = this;
            $this.srchParams = {
                srchWord : '',
                dbTypeCd : '',
            };
        },
        // 파라미터 초기화
        resetParams(){
            const $this = this;
            $this.params = {
                crud          : 'C',
            };
        },

        //  DB연결정보 초기화
        resetdetlParams(){
            const $this = this;
            $this.detlParams = {
                dbConnId      : '',
                dbConnNm      : '',
                dbTypeCd      : '',
                dbKindCd      : '',
                dbIp          : '',
                dbPort        : '',
                dbNm          : '',
                orclSid       : '',
                dbUserId      : '',
                dbUserPwsd    : '',
                schId         : '',
                tsNm          : '',
                rmrk          : '',
                metaDbConnId  : '',
            };
        },
        //장치정의 초기화
        resetSrvrConnParams(){
            const $this = this;
            $this.srvrConnParams = {
                dbConnId        : '',
                devcNm          : '',
                devcIp          : '',
                devcPort        : '',
                userId          : '',
                userPwsd        : '',
                srvrAuthMethCd  : '',
                authKeyFilePath : '',
                authKeyFileNm   : '',
                osTypeCd        : '',
                dbKindCd        : '',
                shelTypeCd      : '',
                jobPath         : '',
                orclDir         : '',
                rmrk            : ''
            };
        },
        //  DB연결테스트 정보 초기화
        resetConnTestParams(){
            const $this = this;
            $this.connTestParams = {
                dbVrfyRslt         : 'NO_TEST',
                devcVrfyRslt       : 'NO_TEST',
                dbConnTestMsg      : '',
                dbSrvrTestMsg      : '',
                dbConnTestRslt     : null,
                dbSrvrConnTestRslt : null,
            };
        },
        //VALIDATION
        isVald(div){
            const $this = this;

            // DB 연결정의 탭 저장 VALIDATION
            if(div =='dbConn'){
                if(!ValdUtil.valdLenNull($this.detlParams.dbConnId  , 30,  'DB연결ID는' )) return false;
                if(!ValdUtil.valdLenNull($this.detlParams.dbConnNm  , 40,  'DB연결명은' )) return false;
                if(!ValdUtil.srchValdNull($this.detlParams.dbTypeCd , '연결유형', 'slct'))  return false;
                if(!ValdUtil.srchValdNull($this.detlParams.dbKindCd , 'DB종류' , 'slct'))  return false;
                if(!ValdUtil.valdLenNull($this.detlParams.dbIp      , 20,  'Host(IP)는'))  return false;
                if(!ValdUtil.valdLenNull($this.detlParams.dbPort    , 10,  'Port No는' ))  return false;
                if(!ValdUtil.valdLenNull($this.detlParams.dbNm      , 40,  'DB명은'    ))  return false;
                if(!ValdUtil.valdLenNull($this.detlParams.dbUserId  , 20,  '사용자ID는'))   return false;
                if(!ValdUtil.valdLenNull($this.detlParams.dbUserPwsd, 256, '비밀번호는'))   return false;
            }
            // DB 장치정의 탭 저장 VALIDATION
            if(div == 'dbSrvr'){
                if(!ValdUtil.valdLenNull($this.srvrConnParams.dbConnId       , 30, 'DB연결ID는'    ))  return false;
                if(!ValdUtil.valdLenNull($this.srvrConnParams.devcIp         , 20, '장치 IP는'     ))  return false;
                if(!ValdUtil.valdLenNull($this.srvrConnParams.devcPort       , 10, '장치 Port No는'))  return false;
                if(!ValdUtil.srchValdNull($this.srvrConnParams.dbKindCd      , 'DB종류'   , 'slct' ))  return false;
                if(!ValdUtil.srchValdNull($this.srvrConnParams.shelTypeCd    , 'SHELL유형', 'slct' ))  return false;
                if(!ValdUtil.srchValdNull($this.srvrConnParams.osTypeCd      , 'OS유형'   , 'slct' ))  return false;
                if(!ValdUtil.srchValdNull($this.srvrConnParams.srvrAuthMethCd, '인증방식' , 'slct'  ))  return false;
                if(!ValdUtil.valdLenNull($this.srvrConnParams.userId         , 20 , '사용자ID는'   ))  return false;
                if(!ValdUtil.valdLenNull($this.srvrConnParams.userPwsd       , 256, '비밀번호는'   ))  return false;
                if(!ValdUtil.valdLenNull($this.srvrConnParams.jobPath        , 256, '작업경로는'   ))  return false;
            
                if($this.srvrConnParams.dbKindCd == 'ORACLE'){
                    if(ValdUtil.isNull($this.srvrConnParams.orclDir)){
                        $this.alert("DB종류가 ORACLE인 경우, <br> 오라클 디렉토리는 필수 입력입니다.");
                        return false;
                    }
                }
            }
            if($this.detlParams.dbKindCd == 'ORACLE') {
                // if(!ValdUtil.valdLenNull($this.detlParams.orclSid, 40,  'SID는'))               return false;
                // if(!ValdUtil.valdLenNull($this.detlParams.schId,   200, '스키마는'))            return false;
                // if(!ValdUtil.valdLenNull($this.detlParams.tsNm,    100, 'TABLESPACE는'))        return false;
            }
            
            return true;
        },
        // 연결 테스트
        chckConnVrfy(){
            const $this = this;
            let params = {};
            // DB연결정의
            if($this.currentTabIdx == 0) {
                $this.connTestParams.dbVrfyRslt     = 'NO_TEST';
                $this.connTestParams.dbConnTestMsg  = '';
                $this.connTestParams.dbConnTestRslt = null;
                params = _.cloneDeep($this.detlParams);
                params['div'] = 'dbConn';
            } 
            // DB장치정의
            else if($this.currentTabIdx == 1) {
                $this.connTestParams.devcVrfyRslt       = 'NO_TEST';
                $this.connTestParams.dbSrvrTestMsg      = '';
                $this.connTestParams.dbSrvrConnTestRslt = null;
                params = _.cloneDeep($this.srvrConnParams);
                params['div'] = 'dbSrvr';
            }
            if ($this.ValdUtil.isNotNull(params.dbConnId)) {                
                $this.doPost('/mng/obj/dbConnMng/chckConnVrfy.hb', params).then((response) => {
                    if(response.data.rtnCd == '0000'){
                        $this.connTestParams.dbConnTestRslt = Object.assign({}, $this.detlParams);
                        let result = response.data.rtnData;
                        let div    = result.div;
                        if(div == 'dbConn'){
                            $this.connTestParams.dbConnTestMsg  = result.testMsg;
                            $this.connTestParams.dbVrfyRslt     = result.dbMsg;
                            if(result.dbMsg == 'SUCC'){
                                $this.alert("테스트 성공입니다.");
                            }
                            else if(result.dbMsg == 'FAIL'){
                                $this.alert("테스트 실패입니다.");
                            } else {
                                $this.connTestParams.dbVrfyRslt = "FAIL";
                                $this.alert("오류가 발생하였습니다.");
                            }
                        }
                        else if(div == 'dbSrvr'){
                            $this.connTestParams.dbSrvrConnTestRslt = Object.assign({}, $this.srvrConnParams);
                            $this.connTestParams.dbSrvrTestMsg = result.testMsg;
                            $this.connTestParams.devcVrfyRslt  = result.connMsg;
                            if(result.connMsg == 'SUCC'){
                                $this.alert("테스트 성공입니다.");
                            } else if(result.connMsg == 'FAIL'){
                                $this.alert("테스트 실패입니다.");
                            } else {
                                $this.connTestParams.devcVrfyRslt = "FAIL";
                                $this.alert("오류가 발생하였습니다.");
                            }
                        }
                    }

                });
            }
            else {
                $this.alert("테스트할 DB연결ID를 선택하세요.");
            }
        },
        //DB연결 상세정보 테스트 후 값 변경 체크
        watchChngInfo() {
            if(this.currentTabIdx == 0){
                const isNotDiff = _.isEqual(this.detlParams, this.connTestParams.dbConnTestRslt);
                if (!isNotDiff) {
                    this.connTestParams.dbVrfyRslt = 'NO_TEST';
                }
            } else if(this.currentTabIdx == 1){
                const isNotDiffSrvr = _.isEqual(this.srvrConnParams, this.connTestParams.dbSrvrConnTestRslt);
                if (!isNotDiffSrvr) {
                    this.connTestParams.devcVrfyRslt = 'NO_TEST';
                }
            }
        },
        // 엑셀다운로드        
        downloadExcel(){
            const $this = this;

            let gridObj  = $this.$refs.grid.getGridObj();
            let gridData = gridObj.jqGrid('getRowData');
            
            if(ValdUtil.isEmptyList(gridData)){
                $this.alert('엑셀다운로드 대상이 없습니다.');
                return false;
            }

            let fileNm = 'DB연결목록_' + DateUtil.getCurrDate('YYYYMMDD') + '.xlsx';
            let url    = '/mng/obj/dbConnMng/selectListDoDownLoadExcel.hb';
            let params = _.cloneDeep($this.srchParams);

            $this.doDownExcel(url, params, fileNm);
        },
        //페이지링크 설정
        setPgLink(){
            const $this = this;
            let params = {
                dbConnId : $this.detlParams.dbConnId
            }
            if(ValdUtil.isNotNull($this.detlParams.dbConnId)){
                CmonUtil.setPageLink('O1040',params);
            } else {
                $this.alert("DB연결 정보를 선택해주세요");
            }
        },
        // 공통버튼(초기화, 조회, 저장, 삭제) 컴포넌트 핸들러
        onSetButtonClick (div) {
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.reset();
                    break;
                case 'select':
                    $this.searchListDbConnMngGrid();
                    break;
                case 'save':
                    $this.saveDbConnMngCnfm();
                    break;
                case 'delete':
                    $this.chckIsExistUnitJob();
                    break;
                default:
                    $this.alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
        },
        changeTab(index) {
            if(this.ValdUtil.isNotNull(index)) {
                if(index == 1){
                    if(ValdUtil.isNotNull(this.detlParams.dbConnId) && this.params.crud == 'U'){
                        this.currentTabIdx = index;
                    } else {
                        this.alert("DB연결정보를 선택 후 탭 이동을 해주세요");
                    }
                } else {
                    this.currentTabIdx = index;
                }
            }
        },
    },
    computed: {
        // DB연결ID 활성화 여부
        disabledDbConnId(){
            const $this = this;
            if($this.params.crud === 'C'){
                return false;
            } else {
                return true;
            }
        },
        disabledDevcInfo(){
            const $this = this;
            if(ValdUtil.isNull($this.srvrConnParams.dbConnId)){
                return false;
            } else {
                return true;
            }
        },
        // 스키마ID 활성화 여부
        disabledSchId() {
            // const $this = this;
            // if ($this.detlParams.dbTypeCd == 'ORG' || $this.detlParams.dbTypeCd == 'TDT') {
            //     return false;
            // } 
            // return true;
        },

        disabledOrclDir(){
            const $this = this;
            if($this.srvrConnParams.dbKindCd == 'ORACLE'){
                return false;
            } else {
                return true;
            }
        },

        // SID, TABLESPACE 활성화/비활성화 여부
        disabledOrclSid() {
            const $this = this;
            if ($this.detlParams.dbKindCd == 'ORACLE') {
                return false;
            } else {
                $this.detlParams.orclSid = '';
                $this.detlParams.tsNm    = '';
            }

            return true;
        },
    },
    mounted: function() {
        const $this = this;
        $this.init();
    }   
}
</script>
