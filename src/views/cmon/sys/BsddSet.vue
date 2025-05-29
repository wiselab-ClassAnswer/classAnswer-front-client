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
                        <h2 class="wd-80 ib essn">사용환경번호</h2>
                        <input class="c-wd-80 ib" ref="useEnvNo" type="text" v-model="params.useEnvNo" disabled>
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="false" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>
        <!-- 상세정보 -->
        <div class="section sectionL w-100">
            <div class="section-wrap m-r-0 p-t-22">
                <h2 class="m-t-0 m-b-5">연계여부</h2>
                <div class="section-part part1">
                    <div class="w-100 ib">
                        <div class="w-30">
                            <div class="w-50 ib">
                                <span class="wd-90 ib essn">처리구분</span>
                                <select ref="procDivCd" class="c-wd-90 ib" v-model="params.bsddLinkYn" disabled>
                                    <option value=""></option>
                                    <option value="N">자체연계</option>
                                    <option value="Y">외부연계</option>
                                </select>
                            </div>
                            <div class="w-50 ib" v-if="params.bsddLinkYn === 'Y'">
                                <span class="wd-90 ib p-l-10 essn">외부연계방법</span>
                                <select class="c-wd-90" id="linkProcMethCd" name="linkProcMethCd" v-model="bsddSetInfo.linkProcMethCd">
                                    <option value=""></option>
                                    <option v-for=" item in code.linkProcMethCdList" :key="item.cdVal" v-bind:value="item.cdVal">{{item.cdNm}}</option>
                                </select>        
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 자체 영업일 설정  -->
                <div  v-if="params.bsddLinkYn === 'N'">
                    <h2 class="m-t-5">자체연계 설정</h2>
                    <div class="section-part part2 b w-100">
                        <div class="w-100 text-box">
                            <span class="wd-90">비고</span>
                            <textarea spellcheck="false" style="height:598px; max-height:598px;" class="c-wd-90" name="baseRmrk" id="baseRmrk" cols="30" rows="10" v-model="bsddSetInfo.baseRmrk"></textarea>
                        </div>
                    </div>
                </div>
                <!-- 외부 영업일 연동  -->
                <div v-if="params.bsddLinkYn === 'Y'">
                <h2 class="m-t-0 m-b-5">외부연계 설정</h2>
                <div class="section-part part3 b w-100">
                    <div class="w-100 b">
                        <div id="tabs" class="w-100">
                            <ul class="tab-menu">
                                <li class="pointer" v-for="(item, index) in code.linkProcMethCdList"
                                    v-bind:class="{ active: bsddSetInfo.linkProcMethCd === item.cdVal }" @click="changeTab(item.cdVal)">
                                    <a>{{ item.cdNm }}</a>
                                </li>
                                <div class="dbconnectTab f-r">
                                    <div class="w-50 ib t-a-c">
                                        <span class="case case2 m-t-6" v-if="params.isExctTest === '00'">실행전</span>
                                        <span class="case case1 m-t-6" v-if="params.isExctTest === '10'">성공</span>
                                        <span class="case case3 m-t-6" v-if="params.isExctTest === '20'">실패</span>
                                        <span class="case case1 m-t-6" v-if="params.isExctTest === '30'">미지원</span>
                                    </div>
                                    <div class="w-50 ib t-a-r">
                                        <button class="btn-normal btn-normal-tabup " style="height:27px !important"  @click="connVrfyDbSql">테스트</button>
                                    </div>
                                </div>
                            </ul>
                            <!-- DB(SQL) -->
                            <div class="tab-contents-bsdd ">
                                <div v-show="bsddSetInfo.linkProcMethCd === '10'">
                                    <div class="inner-tab-content con1">
                                        <div class="inner-tab-content con1">
                                            <div class="w-50 ib">
                                                <span class="wd-90 essn">DB연결ID</span>
                                                <select class="wd-150" id="linkDbConnId" name="linkDbConnId"
                                                    @blur="chckDBVald" v-model="bsddSetInfo.linkDbConnId">
                                                    <option value=""></option>
                                                    <option v-for="el in code.dbConnIdList" :key="el.colId" :value="el.colId">
                                                        {{ el.colId }} | {{ el.colNm }}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="w-100 text-box">
                                                <span class="wd-90 essn">연계처리SQL</span>
                                                <textarea class="c-wd-90 h-265" name="linkProcSql" id="linkProcSql"
                                                    @blur="chckDBVald" cols="30" rows="10"
                                                    v-model="bsddSetInfo.linkProcSql"></textarea>
                                            </div>
                                            <div class="w-100 text-box">
                                                <span class="wd-90">연동설명</span>
                                                <textarea class="c-wd-90 h-230" name="rmrk" id="rmrk" cols="30" rows="10"
                                                    v-model="bsddSetInfo.dbRmrk"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Restful -->
                                <div v-show="bsddSetInfo.linkProcMethCd == '20'">
                                    <div class="inner-tab-content con2">
                                        <div class="inner-tab-content con2">
                                            <div class="w-50-mr2 ib">
                                                <span class="wd-90">인증URL</span>
                                                <input class="c-wd-90" type="text" v-model="bsddSetInfo.authUrl">
                                            </div>
                                            <div class="w-50-ml2 ib">
                                                <span class="wd-90">인증키</span>
                                                <input class="c-wd-90" type="text" v-model="bsddSetInfo.authKey">
                                            </div>
                                            <div class="w-50-mr2 ib">
                                                <span class="wd-90">인증값</span>
                                                <input class="c-wd-90" type="text" v-model="bsddSetInfo.authVal">
                                            </div>
                                            <div class="w-50-ml2 ib">
                                                <span class="wd-90 essn">객체유형</span>
                                                <select class="c-wd-90" id="parmObjcTypeCd" name="parmObjcTypeCd"
                                                    v-model="bsddSetInfo.parmObjcTypeCd">
                                                    <option value=""></option>
                                                    <option v-for="el in code.parmObjcTypeCdList" :key="el.cdVal"
                                                        v-bind:value="el.cdVal">{{ el.cdNm }}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="w-100 ib">
                                                <span class="wd-90 essn">호출주소(모듈)</span>
                                                <input class="c-wd-90" type="text" v-model="bsddSetInfo.restfulLinkProcModuNm">
                                            </div>
                                               <!-- Key -->
                                            <div class="w-50-mr2 ib m-b-0">
                                                <div v-for="(el, i) in restfulKeyValList" :key="i">
                                                    <span class="wd-90">{{ 'Key ' + (i+1) }}</span>
                                                    <input class="c-wd-90" type="text" v-model="restfulKeyValList[i].linkKey" />
                                                </div>
                                            </div>
                                            <!-- Value -->
                                            <div class="w-50-ml2 ib m-b-0">
                                                <div v-for="(el, i) in restfulKeyValList" :key="i">
                                                    <span class="wd-90">{{ 'Value ' + (i+1) }}</span>
                                                    <input class="c-wd-90" type="text"
                                                        v-model="restfulKeyValList[i].linkVal" />
                                                </div>
                                            </div>
                                            <div class="w-100 text-box">
                                                <span class="wd-90">연동설명</span>
                                                <textarea class="c-wd-90 h-80" name="rmrk" id="rmrk" cols="30" rows="10"
                                                    v-model="bsddSetInfo.restfulRmrk"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- SHELL -->
                                <div v-show="bsddSetInfo.linkProcMethCd == '30'">
                                    <div class="inner-tab-content con3">
                                        <div class="w-100 m-b-0">
                                            <span class="wd-90 essn">Shell명</span>
                                            <input class="c-wd-90" type="text" v-model="bsddSetInfo.shellLinkProcModuNm">
                                        </div>
                                         <!-- 왼쪽 Value -->
                                        <div class="w-50-mr2 ib m-t-0 m-b-0">
                                            <div v-for="(el, i) in shellValList" :key="i">
                                                <span class="wd-90" v-if="i < 5">{{ 'Value ' + (i+1) }}</span>
                                                <input class="c-wd-90" v-if="i < 5" type="text" v-model="shellValList[i].linkVal" />
                                            </div>
                                        </div>
                                        <!-- 오른쪽 Value -->
                                        <div class="w-50-ml2 ib m-t-0 m-b-0">
                                            <div v-for="(el, i) in shellValList" :key="i">
                                                <span class="wd-90" v-if="i >=5">{{ 'Value ' + (i+1) }}</span>
                                                <input class="c-wd-90" v-if="i >=5" type="text" v-model="shellValList[i].linkVal" />
                                            </div>
                                        </div>
                                        <div class="w-100 text-box">
                                            <span class="wd-90">연동설명</span>
                                            <textarea class="c-wd-90 h-325" cols="30" rows="10" v-model="bsddSetInfo.shellRmrk"></textarea>
                                        </div>
                                    </div>
                                </div>
                                <!-- CLASS -->
                                <div v-show="bsddSetInfo.linkProcMethCd == '40'">
                                    <div class="inner-tab-content con4">
                                        <div class="w-100 text-box">
                                            <span class="wd-90 essn">Class명</span>
                                            <input type="c-wd-90 text" v-model="bsddSetInfo.classLinkProcModuNm">
                                        </div>
                                         <!-- Key -->
                                        <div class="w-50-mr2 ib m-b-0">
                                            <div v-for="(el, i) in classKeyValList" :key="i">
                                                <span class="wd-90">{{ 'Key ' + (i+1) }}</span>
                                                <input class="c-wd-90" type="text" v-model="classKeyValList[i].linkKey" />
                                            </div>
                                        </div>
                                        <!-- Value -->
                                        <div class="w-50-ml2 ib m-b-0">
                                            <div v-for="(el, i) in classKeyValList" :key="i">
                                                <span class="wd-90">{{ 'Value ' + (i+1) }}</span>
                                                <input class="c-wd-90" type="text" v-model="classKeyValList[i].linkVal" />
                                            </div>
                                        </div>
                                        <div class="w-100 text-box">
                                            <span class="wd-90">연동설명</span>
                                            <textarea class="c-wd-90 h-150" name="rmrk" cols="30" rows="10" v-model="bsddSetInfo.classRmrk"></textarea>
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
    </div>
</template>

<script>
import { reactive, ref, inject } from 'vue'
import { SessionUtil }           from '@/utils/SessionUtil';
import { ValdUtil }              from '@/utils/ValdUtil';
import { CmonUtil }              from '@/utils/CmonUtil'
import SetButton                 from '@/components/SetButton.vue'

export default {
    components: {
        SetButton
    },
    setup() {
        // 전역 mixin의 메소드를 inject를 통해 가져옴
        const getCmonCdList = inject('getCmonCdList');

        let code = reactive({
            linkProcMethCdList: [],
            parmObjcTypeCdList: [],
            dbConnIdList      : [],
            yn: [{
                cdVal: 'Y',
                cdNm: '예'
            }, {
                cdVal: 'N',
                cdNm: '아니오'
            }],
        });

        const colIdNmDbConnIdData = { 'tblId'  :'te_db_conn_info',
                                      'colId'  :'db_conn_id',
                                      'colNm'  :'db_conn_nm',
                                      'where'  : [
                                     {'andCol' :'db_type_cd',
                                      'andCalc':'=',
                                      'andVal' :"'ORG'"}
                                  ], 
                                  'orderby' : [
                                    {'orderCol' : 'db_conn_id'}
                                   ,{'orderCol' : 'db_conn_nm'}
                                  ]
        };  
        const getDbConnList = inject('getDbConnList');
        getDbConnList(colIdNmDbConnIdData, code.dbConnIdList, 'N', null);

        // inject를 통해 가져온 공통코드 호출 함수를 이용하여 공통코드 get
        getCmonCdList('LINK_PROC_METH_CD', code.linkProcMethCdList, 'N', null);
        getCmonCdList('PARM_OBJC_TYPE_CD', code.parmObjcTypeCdList, 'N', null);

        return {
            code
        }
    },
    data: function () {
        return {
            params: {
                userId                : '',               // 사용자 아이디(조회용)
                procDivCd             : '00',             // 처리구분 코드    // 00: 빈값 01:자체기능 02:외부기능
                isExctTest            : '00',             // 검증 테스트 여부 // 00: 검증 안함 01: 검증 성공 02: 검증 실패 
                chckDBValdDiv         : false,            // 변경 체크 여부
                disableDiv            : false,            // DB(SQL)제외 나머지 값 저장 시
                disableProcDiv        : false,            // 처리구분 여부
                chckBsddDiv           : '',               // 영업일 있는지 확인
                currTab               : '00',             // 탭번호
                linkKindCd            : 'BSDD',           // 연계종류코드
                useEnvNo              : '',               // 사용환경번호
                bsddLinkYn            : '',               // 영업일 연계 사용여부
                crud                  : 'C',
            },
            bsddSetInfo: {
                useEnvNo              : '',               // 사용환경번호
                linkProcMethCd        : '',               // 연계처리방법코드
                linkDbConnId          : '',               // 연계DB연결ID
                linkProcSql           : '',               // 연계처리SQL
                authUrl               : '',               // 인증URL
                authKey               : '',               // 인증KEY
                authVal               : '',               // 인증VAL
                parmObjcTypeCd        : '',               // 파라미터객체유형코드
                linkProcModuNm        : '',               // 연계처리모듈명
                shellLinkProcModuNm   : '',               // SHELL 연계처리모듈명
                classLinkProcModuNm   : '',               // CLASS 연계처리모듈명
                rmrk                  : '',               // 설명
                baseRmrk              : '',               // 자체연계 설명
                dbRmrk                : '',               // DB/SQL 설명
                restfulRmrk           : '',               // RESTFUL 설명
                shellRmrk             : '',               // SHELL 설명
                classRmrk             : '',               // CLASS 설명
            },
            // 테스트 후 변경 시 변경된 값이 저장되기 때문에 구분
            chckedBsddSetInfo: {
                chckedLinkDbConnId    : '',               // 테스트 후 linkDbConnId 값
                chckedLinkDbProcSql   : '',               // 테스트 후 linkProcSql 값
            },
            restfulKeyValList         : [],               // RESTFUL 파라미터 리스트
            shellValList              : [],               // SHELL 파라미터 리스트
            classKeyValList           : [],               // CLASS 파라미터 리스트
        }
    },
    methods: {
        init: function () {
            let $this = this;
            $this.params.userId = SessionUtil.getUserId();
            $this.resetSearchParam();
            $this.selectUseEnvNo();
            $this.searchBsddSetInfo();
            $this.CmonUtil.setFocus($this.$refs.procDivCd);

        },
        initData(){
            const $this = this;

            this.params.userId = SessionUtil.getUserId();
            $this.restfulKeyValList = [];
            $this.shellValList      = [];
            $this.classKeyValList   = [];

            if(($this.restfulKeyValList.length == 0)){
                for(let i = 0; i < 10; i++){
                    $this.restfulKeyValList.push({'idenSeq':i+1,'linkKey':'','linkVal':''});
                }
            }
            if(($this.shellValList.length == 0)){
                for(let i = 0; i < 10; i++){
                    $this.shellValList.push({'idenSeq':i+1,'linkKey':'','linkVal':''});
                }
            }
            if(($this.classKeyValList.length == 0)){
                for(let i = 0; i < 10; i++){
                    $this.classKeyValList.push({'idenSeq':i+1,'linkKey':'','linkVal':''});
                }
            }
        },
        // 영업일 조회
        searchBsddSetInfo: function () {
            let $this = this;
            let sendParam = {
                useEnvNo: $this.params.useEnvNo
            }
            $this.doPost('/cmon/sys/bsddSet/selectBsddSetInfo.hb', sendParam).then(function (response) {
                CmonUtil.processLoading(false);
                if (response.data.rtnCd === '0000') {
                        let result       = response.data.rtnData;
                        let keyValList   = result.keyValList;
                        let linkCd       = result.bsddSetInfo.linkProcMethCd;
                        let bsddSet      = result.bsddSetInfo;
                        if(result.length != 0){
                            $this.bsddSetInfo.linkProcMethCd = linkCd;
                            $this.bsddSetInfo                = bsddSet;
                        }
                        if((linkCd == '' || linkCd == null) && $this.params.bsddLinkYn === 'Y'){
                            $this.bsddSetInfo.linkProcMethCd = '10';
                        }
                        //자체연계
                        if($this.params.bsddLinkYn === 'N'){
                            $this.bsddSetInfo.linkProcMethCd = '';
                            $this.bsddSetInfo.baseRmrk       = bsddSet.rmrk;
                          //DB(SQL)
                        } else if(linkCd === '10') {
                            $this.bsddSetInfo.dbRmrk = bsddSet.rmrk;
                          //Restful
                        } else if(linkCd === '20') {
                            $this.bsddSetInfo.restfulLinkProcModuNm = bsddSet.linkProcModuNm;
                            $this.bsddSetInfo.restfulRmrk           = bsddSet.rmrk;
                            if(keyValList.length != 0){
                                keyValList.forEach((el,idx) =>{
                                    $this.restfulKeyValList[idx] = el;
                                });
                            }
                         // Shell
                        } else if(linkCd === '30') {
                            $this.bsddSetInfo.shellLinkProcModuNm = bsddSet.linkProcModuNm;
                            $this.bsddSetInfo.shellRmrk           = bsddSet.rmrk;

                            if(keyValList.length != 0){
                                keyValList.forEach((el,idx) =>{
                                    $this.shellValList[idx] = el;
                                });
                            }
                          // Class
                        } else if(linkCd === '40'){
                            $this.bsddSetInfo.classLinkProcModuNm = bsddSet.linkProcModuNm;
                            $this.bsddSetInfo.classRmrk           = bsddSet.rmrk;
                            if(keyValList.length != 0){
                                keyValList.forEach((el,idx) =>{
                                    $this.classKeyValList[idx] = el;
                                });
                            }
                        }
                    } else {
                        $this.alert(response.data.rtnMsg);
                    }
                
                });
        },
        // 사용환경번호, 사용여부 조회 
        selectUseEnvNo: function () {
            let $this = this;
            let param = {
                useEnvNo: $this.params.useEnvNo
            }
            $this.doPost('/cmon/sys/bsddSet/selectUseEnvNo.hb', param).then(function (response) {
                if (response.data.rtnCd === '0000') {
                    $this.params.useEnvNo   = response.data.rtnData.result.useEnvNo;
                    $this.params.bsddLinkYn = response.data.rtnData.result.bsddLinkYn;
                } else {
                    $this.alert("사용환경정보를 가져오는 도중 오류가 발생했습니다.");
                }
            });
        },
        // DB연결ID, SQL 변경 여부 체크
        chckDBVald: function () {
            let $this = this;
            if (($this.params.isExctTest === '10') && ($this.chckedBsddSetInfo.chckedLinkDbConnId !== $this.bsddSetInfo.linkDbConnId)) {
                $this.params.chckDBValdDiv = true;
                $this.params.isExctTest    = '00';
            } else if (($this.params.isExctTest === '10') && ($this.chckedBsddSetInfo.chckedLinkDbProcSql !== $this.bsddSetInfo.linkProcSql)) {
                $this.params.chckDBValdDiv = true;
                $this.params.isExctTest    = '00';
            } else {
                $this.params.chckDBValdDiv = false;
            }
        },
        // db 연결, sql 검증
        connVrfyDbSql: function () {
            let $this = this;
            $this.params.isExctTest = '00';
            if($this.isValid('test')){
                if($this.bsddSetInfo.linkProcMethCd ==='10'){
                    let testParam ={
                        linkProcSql : $this.bsddSetInfo.linkProcSql,
                        dbConnId    : $this.bsddSetInfo.linkDbConnId
                    }
                    $this.doPost('/cmon/sys/bsddSet/connVrfyDbSql.hb', testParam).then(function (response) {
                        if (response.data.rtnCd === '0000') {
                            if(response.data.rtnData.sqlMsg === 'Y'){
                                $this.params.isExctTest    = '10';
                                $this.params.chckDBValdDiv = false;
                                // 테스트 성공 한 DB_CONN_ID 와 LINK_PROC_SQL을 저장
                                $this.chckedBsddSetInfo.chckedLinkDbProcSql = testParam.linkProcSql;
                                $this.chckedBsddSetInfo.chckedLinkDbConnId  = testParam.dbConnId;
                                $this.alert("SQL문이 정상입니다.");
                            // SQL문 검증 실패
                            } else if(response.data.rtnData.sqlMsg === 'N'){
                                $this.params.isExctTest = '20';
                                $this.alert("SQL문장에 오류가 있습니다.");
                            } else {
                                $this.params.isExctTest = '20';
                                $this.alert("테스트 도중 오류가 발생했습니다.");
                            }
                        } else {
                            $this.alert(response.data.rtnMsg);
                        }
                    });
                 //Restful
                } else if($this.bsddSetInfo.linkProcMethCd === '20'){
                    let testParam = {};
                    $this.params.isExctTest = '30';
                    $this.alert("현재 Restful 연동 테스트는 지원하지 않으며, 저장 기능만 이용할 수 있습니다.");
                } else if($this.bsddSetInfo.linkProcMethCd === '30'){
                    let testParam = {};
                    $this.params.isExctTest = '30';
                    $this.alert("현재 Shell 연동 테스트는 지원하지 않으며, 저장 기능만 이용할 수 있습니다.");
                 // Class
                } else if($this.bsddSetInfo.linkProcMethCd === '40'){
                    let testParam = {};
                    $this.params.isExctTest = '30';
                    $this.alert("현재 Class 연동 테스트는 지원하지 않으며, 저장 기능만 이용할 수 있습니다.");
                }
            }
        },
        // 영업일 연동 저장
        updateBsddSetInfo: function () {
            let $this = this;
            if($this.isValid('save')){
                let linkCd    = $this.bsddSetInfo.linkProcMethCd;
                let sendParam = {};
                let baseParam = {
                    useEnvNo               : $this.params.useEnvNo,
                    userId                 : $this.params.userId,
                    bsddLinkYn             : $this.params.bsddLinkYn,
                    linkKindCd             : $this.params.linkKindCd,
                    linkProcMethCd         : $this.bsddSetInfo.linkProcMethCd,
                    crud                   : $this.params.crud
                }
                //자체연계
                if( (linkCd === '' || ValdUtil.isNull(linkCd)) ) {
                    let paramSpec = {
                        rmrk               : $this.bsddSetInfo.baseRmrk
                    }
                    sendParam = Object.assign({},baseParam, paramSpec);
                //DB(SQL)
                } else if ( linkCd === '10'){
                    let paramSpec = {
                        linkDbConnId        : $this.chckedBsddSetInfo.chckedLinkDbConnId,
                        linkProcSql         : $this.chckedBsddSetInfo.chckedLinkDbProcSql,
                        rmrk                : $this.bsddSetInfo.dbRmrk,
                    }
                    sendParam = Object.assign({},baseParam, paramSpec);
                //Restful
                } else if ( linkCd ==='20'){
                    let paramSpec = {
                        rmrk                : $this.bsddSetInfo.restfulRmrk,
                        authUrl             : $this.bsddSetInfo.authUrl,
                        authKey             : $this.bsddSetInfo.authKey,
                        authVal             : $this.bsddSetInfo.authVal,
                        linkProcModuNm      : $this.bsddSetInfo.restfulLinkProcModuNm,
                        parmObjcTypeCd      : $this.bsddSetInfo.parmObjcTypeCd,
                    }
                    sendParam = Object.assign({},baseParam, paramSpec, {keyValList : $this.restfulKeyValList});
                //Shell
                } else if ( linkCd === '30'){
                    let paramSpec = {
                        rmrk                : $this.bsddSetInfo.shellRmrk,
                        linkProcModuNm      : $this.bsddSetInfo.shellLinkProcModuNm,
                    }
                    sendParam = Object.assign({},baseParam, paramSpec, {keyValList : $this.shellValList});
                  //Class
                } else if ( linkCd === '40') {
                    let paramSpec = {
                        rmrk                : $this.bsddSetInfo.classRmrk,
                        linkProcModuNm      : $this.bsddSetInfo.classLinkProcModuNm,
                    }
                    sendParam = Object.assign({},baseParam, paramSpec, {keyValList : $this.classKeyValList});
                }
                $this.confirm({
                content  : '저장하시겠습니까?',
                    callback : {
                        yes() {
                            $this.doPost('/cmon/sys/bsddSet/updateBsddSetInfo.hb', sendParam, false).then(function (res) {
                                if (res.data.rtnCd === '0000') {
                                    $this.alert("저장되었습니다").then((result) =>{
                                        if( result.isConfirmed ){ 
                                            $this.init();                             
                                        }
                                    })
                                } else {
                                    $this.alert(res.data.rtnMsg);
                                }
                            });
                        }
                    }
                })
            }
        },
        selectBtnSrch: function () {
            let $this = this;
            //reset();
            $this.searchBsddSetInfo();
        },
        // 초기화
        resetSearchParam: function () {
            let $this = this;
            //params
            $this.params.isExctTest                     = '00';
            $this.params.chckDBValdDiv                  = false;
            $this.params.crud                           = 'C';
            //bsddSetInfo
            $this.bsddSetInfo.linkProcMethCd            = '';
            $this.bsddSetInfo.linkDbConnId              = '',
            $this.bsddSetInfo.linkProcSql               = '';
            $this.bsddSetInfo.authUrl                   = '';
            $this.bsddSetInfo.authKey                   = '';
            $this.bsddSetInfo.authVal                   = '';
            $this.bsddSetInfo.parmObjcTypeCd            = '';
            $this.bsddSetInfo.linkProcModuNm            = '';
            $this.bsddSetInfo.shellLinkProcModuNm       = '';
            $this.bsddSetInfo.classLinkProcModuNm       = '';
            $this.bsddSetInfo.rmrk                      = '';
            $this.bsddSetInfo.baseRmrk                  = '';
            $this.bsddSetInfo.dbRmrk                    = '';
            $this.bsddSetInfo.restfulRmrk               = '';
            $this.bsddSetInfo.shellRmrk                 = '';
            $this.bsddSetInfo.classRmrk                 = '';
            //chckBsddSetInfo
            $this.chckedBsddSetInfo.chckedLinkDbConnId  = '';
            $this.chckedBsddSetInfo.chckedLinkDbProcSql = '';
            $this.initData();
        },
        //페이지 리로드
        refreshPage: function () {
            let $this = this;
            $this.resetSearchParam();
            $this.selectUseEnvNo();
            $this.searchBsddSetInfo();
            $this.initData();
            $this.CmonUtil.setFocus($this.$refs.procDivCd);
        },
        //유효성 검증
        isValid(div){
            const $this = this;
            if(div == 'test'){
                if($this.params.bsddLinkYn ==='Y'){
                    if(!$this.isExctValid($this.bsddSetInfo.linkProcMethCd, '외부연계방법', 'rqir')){
                        return false;
                    }
                    //DB(SQL)
                    if($this.bsddSetInfo.linkProcMethCd === '10'){
                        if(!$this.isExctValid($this.bsddSetInfo.linkDbConnId,'DB연결ID','rqir')
                        || !$this.isExctValid($this.bsddSetInfo.linkProcSql,'연계처리SQL','rqir')){
                            return false;
                        }
                    }
                    //Restful
                    if($this.bsddSetInfo.linkProcMethCd === '20'){
                        if(!$this.isExctValid($this.bsddSetInfo.parmObjcTypeCd,'객체유형','rqir')
                        || !$this.isExctValid($this.bsddSetInfo.restfulLinkProcModuNm,'호출주소(모듈)','rqir')){
                            return false;
                        }
                    }
                    //Shell
                    if($this.bsddSetInfo.linkProcMethCd === '30'){
                        if(!$this.isExctValid($this.bsddSetInfo.shellLinkProcModuNm,'Shell명','rqir')){
                            return false;
                        }
                    }
                    //Class
                    if($this.bsddSetInfo.linkProcMethCd == '40'){
                        if(!$this.isExctValid($this.bsddSetInfo.classLinkProcModuNm,'Class명','rqir')){
                            return false;
                        }
                    }
                }
                return true;
            } else if(div === 'save'){
                if($this.params.bsddLinkYn == 'Y'){
                    if(!$this.isExctValid($this.bsddSetInfo.linkProcMethCd,'외부연계방법', 'rqir')){
                        return false;
                    }
                    //DB(SQL)
                    if($this.bsddSetInfo.linkProcMethCd === '10'){
                        if(!$this.isExctValid($this.bsddSetInfo.linkDbConnId,'DB연결ID','rqir')
                        || !$this.isExctValid($this.bsddSetInfo.linkProcSql,'연계처리SQL','rqir')){
                            return false;
                        }
                    }
                    //Restful
                    if($this.bsddSetInfo.linkProcMethCd === '20'){
                        if(!$this.isExctValid($this.bsddSetInfo.parmObjcTypeCd,'객체유형','rqir')
                        || !$this.isExctValid($this.bsddSetInfo.restfulLinkProcModuNm,'호출주소(모듈)','rqir')){
                            return false;
                        }
                    }
                    //Shell
                    if($this.bsddSetInfo.linkProcMethCd === '30'){
                        if(!$this.isExctValid($this.bsddSetInfo.shellLinkProcModuNm,'Shell명','rqir')){
                            return false;
                        }
                    }
                    //Class
                    if($this.bsddSetInfo.linkProcMethCd == '40'){
                        if(!$this.isExctValid($this.bsddSetInfo.classLinkProcModuNm,'Class명','rqir')){
                            return false;
                        }
                    }
                    if($this.params.chckDBValdDiv  === true ){
                        $this.alert("작성하신 DB연결 정보가 변경되었습니다. 다시 연결 테스트를 해주세요.");
                        return false;
                    }
                    if($this.bsddSetInfo.linkProcMethCd == '10' && $this.params.isExctTest == '00'){
                        $this.alert('연동 테스트가 완료되지 않았습니다.');
                        return false;
                    }
                } 
                return true;
            }
        },
        //유효성 검증
        isExctValid(chkVal,stmt,div){
            const $this = this;
            let alertStmt = stmt + (div =='rqir'?'은(는) 필수 입력입니다.':' 선택하세요');
            if(ValdUtil.isNull(chkVal)){
                $this.alert(alertStmt);
                return false;
            }
            return true;
        },
        //외부기능상세 탭 선택
        changeTab(item){
            const $this = this;
            // $this.reset();
            $this.bsddSetInfo.linkProcMethCd = item;
            return false;
        },
        // 공통버튼(초기화, 조회, 저장, 삭제) 컴포넌트 핸들러
        onSetButtonClick(div) {
            switch (div) {
                case 'init':
                    this.refreshPage();
                    break;
                case 'select':
                    this.selectBtnSrch();
                    break;
                case 'save':
                    this.updateBsddSetInfo();
                    break;
                default:
                    alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
        },
    },
    mounted: function () {
        let $this = this;
        $this.init();
    },
    computed: {
    },
}
</script>
<style>
/* 영업일 설정 탭 */
#tabs .tab-contents-bsdd {
    display: block;
    border: 1px solid #d1d1dd;
    border-radius: 3px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    background-color: #ffffff;
    color: #333333;
    padding: 10px 10px;
    /* min-height: calc(100vh - 200px); */
    min-height: 522px;
}

#tabs .tab-contents-bsdd .radio-box input[type="radio"] {
    display: inline-block;
    width: auto;
    height: auto;
    vertical-align: middle;
}
</style>