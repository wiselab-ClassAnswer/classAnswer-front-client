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
        <div class="section sectionR w-100">
            <div class="section-wrap m-r-0 p-t-22">
                <h2 class="m-b-5 m-t-0">연계여부</h2>
                <div class="section-part part1 m-b-10">
                    <div class="w-100 ib">
                        <div class="w-30">
                            <div class="w-50 ib">
                                <span class="wd-90 ib essn">처리구분</span>
                                <select class="c-wd-90 ib" v-model="params.outClineYn" disabled>
                                    <option value=""></option>
                                    <option value="N">자체연계</option>
                                    <option value="Y">외부연계</option>
                                </select>
                            </div>
                            <div class="w-50 ib">
                                <span class="wd-90 ib p-l-10 essn" v-if="params.outClineYn === 'Y'">외부연계방법</span>
                                <select class="c-wd-90" id="linkProcMethCd" name="linkProcMethCd"
                                    v-model="aprvLineSetInfo.linkProcMethCd" v-if="params.outClineYn === 'Y'">
                                    <option value=""></option>
                                    <option v-for="el in code.linkProcMethCdList" :key="el.cdVal" v-bind:value="el.cdVal">{{ el.cdNm }}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="w-100 b">
                        <div class="wd-248 ib">
                            <span class="wd-90 essn">결재상신 Role</span>
                            <select class="c-wd-90" name="aprvCnslRoleCd" id="aprvCnslRoleCd"
                                v-model="aprvLineSetInfo.aprvCnslRoleCd" @change="changeCnslRole">
                                <option value=""></option>
                                <option v-for=" item in userRoleList" :key="item.roleCd" :value="item.roleCd">{{item.roleNm}}</option>
                            </select>
                        </div>
                        <p v-if="cnslUserNmList && cnslUserNmList.length" v-for="item in cnslUserNmList">{{item}}</p>
                        <p v-else>(Role에 해당하는 인력이 없습니다.)</p>
                    </div>
                    <div class="w-100 b">
                        <div class="wd-248 ib">
                            <span class="wd-90 essn">결재승인 Role</span>
                            <select class="c-wd-90" name="aprvAprvRoleCd" id="aprvAprvRoleCd"
                                v-model="aprvLineSetInfo.aprvAprvRoleCd" @change="changeAprvRole">
                                <option value=""></option>
                                <option v-for=" item in userRoleList" :key="item.roleCd" v-bind:value="item.roleCd">{{item.roleNm}}</option>
                            </select>
                        </div>
                        <p v-if="aprvUserNmList && aprvUserNmList.length" v-for="item in aprvUserNmList">{{item}}</p>
                        <p v-else>(Role에 해당하는 인력이 없습니다.)</p>
                    </div>
                </div>
                <!-- 자체연계 -->
                <h2 class="m-b-5 m-t-0" v-if="params.outClineYn == 'N'">자체연계 설정</h2>
                <div class="section-part part2 b w-100" v-if="params.outClineYn == 'N'">
                    <div class="w-100 text-box">
                        <span class="wd-90">비고</span>
                        <textarea spellcheck="false" class="c-wd-90" style="height:532px; max-height:532px;" name="baseRmrk" id="baseRmrk" cols="30" rows="10" v-model="aprvLineSetInfo.baseRmrk"></textarea>
                    </div>
                </div>
                <!-- 외부연계 -->
                <h2 class="m-b-5 m-t-0" v-if="params.outClineYn === 'Y'">외부연계 설정</h2>
                <div class="section-part part3 b w-100" v-if="params.outClineYn === 'Y'">
                    <div class="w-100 b">
                        <div id="tabs" class="w-100">
                            <ul class="tab-menu">
                                <li class="pointer" v-for="(item, index) in code.linkProcMethCdList"
                                    v-bind:class="{ active: aprvLineSetInfo.linkProcMethCd === item.cdVal }" @click="changeTab(item.cdVal)">
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
                                        <button class="btn-normal btn-normal-tabup " style="height:27px !important" id="connVrfyDbSql" @click="connVrfyDbSql">테스트</button>
                                    </div>
                                </div>
                            </ul>
                            <div class="tab-contents-aprv">
                                <!-- DB(SQL)  -->
                                <div v-show="aprvLineSetInfo.linkProcMethCd == '10'">
                                    <div class="inner-tab-content con1">
                                        <div class="inner-tab-content con1">
                                            <div class="w-50 ib">
                                                <span class="wd-90 essn">DB연결ID</span>
                                                <select class="wd-290" @blur="chckDBVald"
                                                    v-model="aprvLineSetInfo.linkDbConnId">
                                                    <option value=""></option>
                                                    <option v-for="el in code.dbConnIdList" :key="el.colId"
                                                        v-bind:value="el.colNm">
                                                        {{ el.colId }} | {{ el.colNm }}
                                                    </option>
                                                </select>
                                            </div>
                                            <div class="w-100 text-box">
                                                <span class="wd-90 essn">결재상신SQL</span>
                                                <textarea class="c-wd-90 h-150" name="linkCnslSql" id="linkCnslSql"
                                                    @blur="chckDBVald" cols="30" rows="10"
                                                    v-model="aprvLineSetInfo.linkCnslSql"></textarea>
                                            </div>
                                            <div class="w-100 text-box">
                                                <span class="wd-90 essn">결과확인SQL</span>
                                                <textarea class="c-wd-90 h-150" name="linkAprvSql" id="linkAprvSql"
                                                    @blur="chckDBVald" cols="30" rows="10"
                                                    v-model="aprvLineSetInfo.linkAprvSql"></textarea>
                                            </div>
                                            <div class="w-100 text-box">
                                                <span class="wd-90">연동설명</span>
                                                <textarea class="c-wd-90 h-130" name="dbRmrk" id="dbRmrk" cols="30" rows="10"
                                                    v-model="aprvLineSetInfo.dbRmrk"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Restful -->
                                <div v-show="aprvLineSetInfo.linkProcMethCd == '20'">
                                    <div class="inner-tab-content con2">
                                        <div class="inner-tab-content con2">
                                            <div class="w-100">
                                                <span class="wd-90 essn">호출주소(모듈)</span>
                                                <input class="c-wd-90" type="text"
                                                    v-model="aprvLineSetInfo.restfulLinkProcModuNm">
                                            </div>
                                            <div class="w-50-mr2 ib  m-b-0">
                                                <div class="w-50 ib">
                                                    <span class="wd-90">인증URL</span>
                                                    <input class="c-wd-90" type="text" v-model="aprvLineSetInfo.authUrl">
                                                </div>
                                                <div class="w-50 ib">
                                                    <span class="wd-90 p-l-10">인증키</span>
                                                    <input class="c-wd-90" type="text" v-model="aprvLineSetInfo.authKey">
                                                </div>
                                            </div>
                                            <div class="w-50-ml2 ib  m-b-0">
                                                <div class="w-50 ib">
                                                    <span class="wd-90">인증값</span>
                                                    <input class="c-wd-90" type="text" v-model="aprvLineSetInfo.authVal">
                                                </div>
                                                <div class="w-50 ib">
                                                    <span class="wd-90 p-l-10 essn">객체유형</span>
                                                    <select class="c-wd-90" name="parmObjcTypeCd" id="parmObjcTypeCd"
                                                        v-model="aprvLineSetInfo.parmObjcTypeCd">
                                                        <option value=""></option>
                                                        <option v-for="item in code.parmObjcTypeCdList" :key="item.cdVal"
                                                            v-bind:value="item.cdVal">{{ item.cdNm }}
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                            <!-- Key -->
                                            <div class="w-50-mr2 ib m-b-0">
                                                <div v-for="(el, i) in restfulKeyValList" :key="i">
                                                    <span class="wd-90">{{ 'Key ' + (i + 1) }}</span>
                                                    <input class="c-wd-90" type="text"
                                                        v-model="restfulKeyValList[i].linkKey" />
                                                </div>
                                            </div>
                                            <!-- Value -->
                                            <div class="w-50-ml2 ib m-b-0">
                                                <div v-for="(el, i) in restfulKeyValList" :key="i">
                                                    <span class="wd-90">{{ 'Value ' + (i + 1) }}</span>
                                                    <input class="c-wd-90" type="text"
                                                        v-model="restfulKeyValList[i].linkVal" />
                                                </div>
                                            </div>
                                            <div class="w-100 text-box">
                                                <span class="wd-90">연동설명</span>
                                                <textarea class="c-wd-90 h-55" name="classRmrk" id="classRmrk" cols="30"
                                                    rows="10" v-model="aprvLineSetInfo.restfulRmrk"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- SHELL -->
                                <div v-show="aprvLineSetInfo.linkProcMethCd == '30'">
                                    <div class="inner-tab-content con3">
                                        <div class="w-100 m-b-0">
                                            <span class="wd-90 essn">Shell명</span>
                                            <input class="c-wd-90" type="text" v-model="aprvLineSetInfo.shellLinkProcModuNm">
                                        </div>
                                        <!-- 왼쪽 Value -->
                                        <div class="w-50-mr2 ib m-t-0 m-b-0">
                                            <div v-for="(el, i) in shellValList" :key="i">
                                                <span class="wd-90" v-if="i < 5">{{ 'Value ' + (i + 1) }}</span>
                                                <input class="c-wd-90" v-if="i < 5" type="text"
                                                    v-model="shellValList[i].linkVal" />
                                            </div>
                                        </div>
                                        <!-- 오른쪽 Value -->
                                        <div class="w-50-ml2 ib m-t-0 m-b-0">
                                            <div v-for="(el, i) in shellValList" :key="i">
                                                <span class="wd-90" v-if="i >= 5">{{ 'Value ' + (i + 1) }}</span>
                                                <input class="c-wd-90" v-if="i >= 5" type="text"
                                                    v-model="shellValList[i].linkVal" />
                                            </div>
                                        </div>
                                        
                                        <div class="w-100 text-box">
                                            <span class="wd-90">연동설명</span>
                                            <textarea class="c-wd-90 h-265" cols="30" rows="10"
                                                v-model="aprvLineSetInfo.shellRmrk"></textarea>
                                        </div>
                                    </div>
                                </div>
                                <!-- 외부연동방법 CLASS 일 때 -->
                                <div v-show="aprvLineSetInfo.linkProcMethCd == '40'">
                                    <div class="inner-tab-content con4">
                                        <div class="w-100 text-box">
                                            <span class="wd-90 essn">Class명</span>
                                            <input class="c-wd-90" type="text"
                                                v-model="aprvLineSetInfo.classLinkProcModuNm">
                                        </div>
                                        <!-- Key -->
                                        <div class="w-50-mr2 ib m-b-0">
                                            <div v-for="(el, i) in classKeyValList" :key="i">
                                                <span class="wd-90">{{ 'Key ' + (i + 1) }}</span>
                                                <input class="c-wd-90" type="text" v-model="classKeyValList[i].linkKey" />
                                            </div>
                                        </div>
                                        <!-- Value -->
                                        <div class="w-50-ml2 ib m-b-0">
                                            <div v-for="(el, i) in classKeyValList" :key="i">
                                                <span class="wd-90">{{ 'Value ' + (i + 1) }}</span>
                                                <input class="c-wd-90" type="text" v-model="classKeyValList[i].linkVal" />
                                            </div>
                                        </div>
                                        <div class="w-100 text-box">
                                            <span class="wd-90">연동설명</span>
                                            <textarea name="classRmrk" id="classRmrk" cols="30" rows="10"
                                                class="c-wd-90 h-90" v-model="aprvLineSetInfo.classRmrk"></textarea>
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
import SetButton                 from '@/components/SetButton.vue'

export default {
    components: {
        SetButton
    },
    setup() {
        // 전역 mixin의 메소드를 inject를 통해 가져옴
        const getCmonCdList = inject('getCmonCdList');

        let code = reactive({
            linkProcMethCdList : [],
            parmObjcTypeCdList : [],
            dbConnIdList       : [],
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
                userId                   : '',     // 사용자 아이디
                isExctTest               : '00',   // 검증 테스트 여부 // 00: 검증 안함 01: 검증 성공 02: 검증 실패 
                chckDBValdDiv            : false,  // 변경 체크 여부
                linkKindCd               : 'CNFM', // 연계종류코드
                useEnvNo                 : '',     // 사용환경번호
                outClineYn               : '',     // 결재선 사용 여부
                crud                     : 'C'     // CRUD  
            },
            aprvLineSetInfo: {
                useEnvNo                 : '',     // 사용환경번호
                linkProcMethCd           : '',     // 연계처리방법코드
                linkDbConnId             : '',     // 연계DB연결ID
                linkCnslSql              : '',     // 결재품의SQL
                linkAprvSql              : '',     // 결재승인SQL
                authUrl                  : '',     // 인증URl
                authKey                  : '',     // 인증Key
                authVal                  : '',     // 인증Val
                parmObjcTypeCd           : '',     // 파라미터객체유형코드
                linkProcModuNm           : '',     // 연계처리모듈명
                restfulLinkProcModuNm    : '',     // RESTFUL연계처리모듈명
                shellLinkProcModuNm      : '',     // SHELL연계처리모듈명
                classLinkProcModuNm      : '',     // CLASS연계처리모듈명
                rmrk                     : '',     // 비고
                baseRmrk                 : '',     // 자체연계 설정설명 
                dbRmrk                   : '',     // DB/SQL 설정설명
                restfulRmrk              : '',     // RESTFUL 설정설명
                shellRmrk                : '',     // SHELL 설정설명
                classRmrk                : '',     // CLASS 설정설명
                aprvAprvRoleCd           : '',     // 승인 기본 ROLE CD 지정
                aprvCnslRoleCd           : '',     // 상신 기본 ROLE CD 지정
            },
            chckedAprvLineSetInfo: {
                chckedLinkCnslSql        : '',     // 테스트 성공한 결재품의SQL
                chckedLinkAprvSql        : '',     // 테스트 성공한 결재승인SQL
                chckedLinkDbConnId       : '',     // 테스트 성공한 연계DB연결ID
            },
            userRoleList                 : [],     // 사용자 역할 리스트
            userInfoList                 : [],     // 사용자 역할 별 사용자명 리스트
            cnslUserNmList               : [],     // cnsl UserNm 리스트
            aprvUserNmList               : [],     // aprv UserNm 리스트

            restfulKeyValList            : [],     // RESTFUL 파라미터 리스트
            shellValList                 : [],     // SHELL 파라미터 리스트
            classKeyValList              : [],     // CLASS 파라미터 리스트
        }
    },
    methods: {
        init: function () {
            const $this = this;

            $this.refreshPage();
            $this.selectUseEnvNo();
            $this.selectListUserRole();
            $this.selectListUserInfo();
            $this.searchAprvLineSetInfo();
            $this.changeAprvRole();
            $this.changeCnslRole();
            $this.CmonUtil.setFocus($this.$refs.useEnvNo);
        },
        initData() {
            const $this = this;

            this.params.userId = SessionUtil.getUserId();
            $this.restfulKeyValList = [];
            $this.shellValList = [];
            $this.classKeyValList = [];

            if (($this.restfulKeyValList.length == 0)) {
                for (let i = 0; i < 10; i++) {
                    $this.restfulKeyValList.push({ 'idenSeq': i + 1, 'linkKey': '', 'linkVal': '' });
                }
            }
            if (($this.shellValList.length == 0)) {
                for (let i = 0; i < 10; i++) {
                    $this.shellValList.push({ 'idenSeq': i + 1, 'linkKey': '', 'linkVal': '' });
                }
            }
            if (($this.classKeyValList.length == 0)) {
                for (let i = 0; i < 10; i++) {
                    $this.classKeyValList.push({ 'idenSeq': i + 1, 'linkKey': '', 'linkVal': '' });
                }
            }
        },
        //외부기능상세 탭 선택
        changeTab(item) {
            const $this = this;
            // $this.reset();
            $this.aprvLineSetInfo.linkProcMethCd = item;
            return false;
        },
        // 사용환경번호 / 결재선사용여부 조회
        selectUseEnvNo: function () {
            let $this = this;
            let param = {
                useEnvNo: $this.params.useEnvNo
            }
            $this.doPost('/cmon/sys/aprvLineSet/selectUseEnvNo.hb', param).then(function (response) {
                if (response.data.rtnCd === '0000') {
                    $this.params.useEnvNo = response.data.rtnData.result.useEnvNo;
                    $this.params.outClineYn = response.data.rtnData.result.outClineYn;
                } else {
                    $this.alert("사용환경정보를 가져오는 도중 오류가 발생했습니다.");
                }
            });
        },
        // UserRole 조회
        selectListUserRole: function () {
            let $this = this;
            let param = $this.params;
            $this.userRoleList = [];     // 사용자 역할 리스트
            $this.doPost('/cmon/sys/aprvLineSet/selectListUserRole.hb', param).then(function (response) {
                for (let i = 0; i < response.data.rtnData.result.length; i++) {
                    $this.userRoleList.push(response.data.rtnData.result[i]);
                }
            });
        },
        // 사용자 역할 별 사용자명 리스트 조회
        selectListUserInfo: function () {
            let $this = this;
            let param = $this.params;
            $this.userInfoList   = [];     // 사용자 정보 리스트
            $this.cnslUserNmList = [];     // cnsl UserNm 리스트
            $this.aprvUserNmList = [];     // aprv UserNm 리스트

            $this.doPost('/cmon/sys/aprvLineSet/selectListUserInfo.hb', param).then(function (response) {

                for (let i = 0; i < response.data.rtnData.result.length; i++) {
                    $this.userInfoList.push(response.data.rtnData.result[i]);
                }
                // 리스트의 'roleCd' 값과 일치하는 'userNm' 값을 배열로 가져와서 업데이트
                const selectedCnslRoleCd = $this.aprvLineSetInfo.aprvCnslRoleCd;
                $this.cnslUserNmList = $this.userInfoList.filter(item => item.roleCd === selectedCnslRoleCd).map(item => item.userNm);
                // 'roleCd' 값과 일치하는 'userNm' 값을 배열로 가져와서 업데이트
                const selectedAprvRoleCd = $this.aprvLineSetInfo.aprvAprvRoleCd;
                $this.aprvUserNmList = $this.userInfoList.filter(item => item.roleCd === selectedAprvRoleCd).map(item => item.userNm);
            });
        },
        //결재 상신 Role 별 사용자 표현
        changeCnslRole: function () {
            const selectedCnslRoleCd = this.aprvLineSetInfo.aprvCnslRoleCd;
            // 리스트의 'roleCd' 값과 일치하는 'userNm' 값을 배열로 가져와서 업데이트
            this.cnslUserNmList = this.userInfoList.filter(item => item.roleCd === selectedCnslRoleCd).map(item => item.userNm);
        },
        //결재 승인 Role 별 사용자 표현
        changeAprvRole: function () {
            const selectedAprvRoleCd = this.aprvLineSetInfo.aprvAprvRoleCd;
            // 'roleCd' 값과 일치하는 'userNm' 값을 배열로 가져와서 업데이트
            this.aprvUserNmList = this.userInfoList.filter(item => item.roleCd === selectedAprvRoleCd).map(item => item.userNm);
        },
        //  결재선 정보 조회
        searchAprvLineSetInfo: function () {
            let $this = this;
            let sendParam = {
                useEnvNo: $this.params.useEnvNo
            }
            $this.doPost('/cmon/sys/aprvLineSet/selectAprvLineSetInfo.hb', sendParam).then(function (response) {
                if (response.data.rtnCd === '0000') {
                    let result = response.data.rtnData;
                    let keyValList = result.keyValList;
                    let linkCd = result.aprvSetInfo.linkProcMethCd;
                    let aprvSet = result.aprvSetInfo;

                    if (result.length != 0) {
                        $this.aprvLineSetInfo.linkProcMethCd = linkCd;
                        $this.aprvLineSetInfo = aprvSet;
                    }
                    if ((linkCd == '' || linkCd == null) && $this.params.outClineYn === 'Y') {
                        $this.aprvLineSetInfo.linkProcMethCd = '10';
                    }
                    //자체연계
                    if ($this.params.outClineYn === 'N') {
                        $this.aprvLineSetInfo.linkProcMethCd = '';
                        $this.aprvLineSetInfo.baseRmrk = aprvSet.rmrk;
                    }
                    else if ($this.params.outClineYn === 'Y') {
                        // DB(SQL)
                        if (linkCd === '10') {
                            $this.aprvLineSetInfo.dbRmrk = aprvSet.rmrk;
                            // Restful
                        } else if (linkCd === '20') {
                            $this.aprvLineSetInfo.restfulLinkProcModuNm = aprvSet.linkProcModuNm;
                            $this.aprvLineSetInfo.restfulRmrk = aprvSet.rmrk;

                            if (keyValList.length != 0) {
                                keyValList.forEach((el, idx) => {
                                    $this.restfulKeyValList[idx] = el;
                                });
                            }
                            // Shell
                        } else if (linkCd === '30') {
                            $this.aprvLineSetInfo.shellLinkProcModuNm = aprvSet.linkProcModuNm;
                            $this.aprvLineSetInfo.shellRmrk = aprvSet.rmrk;

                            if (keyValList.length != 0) {
                                keyValList.forEach((el, idx) => {
                                    $this.shellValList[idx] = el;
                                });
                            }
                            // Class
                        } else if (linkCd === '40') {
                            $this.aprvLineSetInfo.classLinkProcModuNm = aprvSet.linkProcModuNm;
                            $this.aprvLineSetInfo.classRmrk = aprvSet.rmrk;
                            if (keyValList.length != 0) {
                                keyValList.forEach((el, idx) => {
                                    $this.classKeyValList[idx] = el;
                                });
                            }
                        }
                    }
                } else {
                    $this.alert(response.data.rtnMsg);
                }
            });
        },
        // DB 연결, SQL 문장 검증
        connVrfyDbSql: function () {
            let $this = this;
            $this.params.isExctTest = '00';
            //DB(SQL)일 때
            if ($this.isValid('test')) {
                if ($this.aprvLineSetInfo.linkProcMethCd === '10') {
                    let testParam = {
                        cnslSql  : $this.aprvLineSetInfo.linkCnslSql,
                        aprvSql  : $this.aprvLineSetInfo.linkAprvSql,
                        dbConnId : $this.aprvLineSetInfo.linkDbConnId
                    }
                    $this.doPost('cmon/sys/aprvLineSet/connVrfyDbSql.hb', testParam).then(function (response) {
                        if (response.data.rtnCd === '0000') {
                            //SQL문 검증 성공
                            if (response.data.rtnData.aprvSqlMsg === 'Y' && response.data.rtnData.cnslSqlMsg === 'Y') {
                                $this.params.isExctTest = '10';
                                $this.alert("결재상신, 결과확인 SQL문이 정상입니다.");
                                // 테스트 성공 한 DB_CONN_ID 와 LINK_PROC_SQL을 저장
                                $this.chckedAprvLineSetInfo.chckedLinkCnslSql = testParam.cnslSql;
                                $this.chckedAprvLineSetInfo.chckedLinkAprvSql = testParam.aprvSql;
                                $this.chckedAprvLineSetInfo.chckedLinkDbConnId = testParam.dbConnId;
                                // 결재상신 SQL문 검증 실패
                            } else if (response.data.rtnData.cnslSqlMsg === 'N') {
                                $this.params.isExctTest = '20';
                                $this.alert("결재상신 SQL문장에 오류가 있습니다.");
                                // 결과확인 SQL문 검증 실패
                            } else if (response.data.rtnData.aprvSqlMsg === 'N') {
                                $this.params.isExctTest = '20';
                                $this.alert("결과확인 SQL문장에 오류가 있습니다.");
                            }
                            else {
                                $this.params.isExctTest = '20';
                                $this.alert("테스트 도중 오류가 발생했습니다.");
                            }
                        } else {
                            $this.alert(response.data.rtnMsg);
                        }
                    });
                    //Restful
                } else if ($this.aprvLineSetInfo.linkProcMethCd === '20') {
                    let testParam = {};
                    $this.params.isExctTest = '30';
                    $this.alert("현재 Restful 연동 테스트는 지원하지 않으며, 저장 기능만 이용할 수 있습니다.");
                } else if ($this.aprvLineSetInfo.linkProcMethCd === '30') {
                    let testParam = {};
                    $this.params.isExctTest = '30';
                    $this.alert("현재 Shell 연동 테스트는 지원하지 않으며, 저장 기능만 이용할 수 있습니다.");
                    // Class
                } else if ($this.aprvLineSetInfo.linkProcMethCd === '40') {
                    let testParam = {};
                    $this.params.isExctTest = '30';
                    $this.alert("현재 Class 연동 테스트는 지원하지 않으며, 저장 기능만 이용할 수 있습니다.");
                }
            }
        },
        // 결재선 저장
        updateAprvLineSetInfo: function () {
            let $this = this;
            if ($this.isValid('save')) {
                let linkCd    = $this.aprvLineSetInfo.linkProcMethCd;
                let sendParam = {};
                let baseParam = {
                    useEnvNo       : $this.params.useEnvNo,
                    userId         : $this.params.userId,
                    outClineYn     : $this.params.outClineYn,
                    linkKindCd     : $this.params.linkKindCd,
                    linkProcMethCd : $this.aprvLineSetInfo.linkProcMethCd,
                    crud           : $this.params.crud,
                    aprvCnslRoleCd : $this.aprvLineSetInfo.aprvCnslRoleCd,
                    aprvAprvRoleCd : $this.aprvLineSetInfo.aprvAprvRoleCd
                }
                // 자체연계
                if (linkCd === '' || ValdUtil.isNull(linkCd)) {
                    let paramSpec = {
                        rmrk: $this.aprvLineSetInfo.baseRmrk
                    }
                    sendParam = Object.assign({}, baseParam, paramSpec);
                    // DB(SQL)    
                } else if (linkCd === '10') {
                    let paramSpec = {
                        linkCnslSql       : $this.chckedAprvLineSetInfo.chckedLinkCnslSql,
                        linkAprvSql       : $this.chckedAprvLineSetInfo.chckedLinkAprvSql,
                        linkDbConnId      : $this.chckedAprvLineSetInfo.chckedLinkDbConnId,
                        rmrk              : $this.aprvLineSetInfo.dbRmrk
                    }
                    sendParam = Object.assign({}, baseParam, paramSpec);
                    // Restful
                } else if (linkCd === '20') {
                    let paramSpec = {
                        authUrl           : $this.aprvLineSetInfo.authUrl,
                        authKey           : $this.aprvLineSetInfo.authKey,
                        authVal           : $this.aprvLineSetInfo.authVal,
                        linkProcModuNm    : $this.aprvLineSetInfo.restfulLinkProcModuNm,
                        parmObjcTypeCd    : $this.aprvLineSetInfo.parmObjcTypeCd,
                        rmrk              : $this.aprvLineSetInfo.restfulRmrk
                    }
                    sendParam = Object.assign({}, baseParam, paramSpec, { keyValList: $this.restfulKeyValList });
                    // Shell   
                } else if (linkCd === '30') {
                    let paramSpec = {
                        rmrk              : $this.aprvLineSetInfo.shellRmrk,
                        linkProcModuNm    : $this.aprvLineSetInfo.shellLinkProcModuNm
                    }
                    sendParam = Object.assign({}, baseParam, paramSpec, { keyValList: $this.shellValList });
                    // Class
                } else if (linkCd === '40') {
                    let paramSpec = {
                        rmrk              : $this.aprvLineSetInfo.classRmrk,
                        linkProcModuNm    : $this.aprvLineSetInfo.classLinkProcModuNm
                    }
                    sendParam = Object.assign({}, baseParam, paramSpec, { keyValList: $this.classKeyValList });
                }
                $this.confirm({
                    content: '저장하시겠습니까?',
                    callback: {
                        yes() {
                            $this.doPost('/cmon/sys/aprvLineSet/updateAprvLineSetInfo.hb', sendParam).then(function (response) {
                                if (response.data.rtnCd === '0000') {
                                    $this.alert("저장되었습니다").then((result) => {
                                        if (result.isConfirmed) {
                                            $this.init();
                                        }
                                    })
                                } else {
                                    $this.alert(response.data.rtnMsg);
                                }
                            });
                        }
                    }
                })
            }
        },

        // DB연결ID, SQL 변경 여부 체크
        chckDBVald: function () {
            let $this = this;
            if (($this.params.isExctTest === '10') && ($this.chckedAprvLineSetInfo.chckedLinkDbConnId !== $this.aprvLineSetInfo.linkDbConnId)) {
                $this.params.chckDBValdDiv = true;
                $this.params.isExctTest    = '00';
            } else if (($this.params.isExctTest === '10') && ($this.chckedAprvLineSetInfo.chckedLinkCnslSql !== $this.aprvLineSetInfo.linkCnslSql)) {
                $this.params.chckDBValdDiv = true;
                $this.params.isExctTest    = '00';
            } else if (($this.params.isExctTest === '10') && ($this.chckedAprvLineSetInfo.chckedLinkAprvSql !== $this.aprvLineSetInfo.linkAprvSql)) {
                $this.params.chckDBValdDiv = true;
                $this.params.isExctTest    = '00';
            }
            else {
                $this.params.chckDBValdDiv = false;
            }
        },
        // 초기화
        reset: function () {
            let $this = this;

            //params
            $this.params.isExctTest                        = '00';
            $this.params.chckDBValdDiv                     = false;
            $this.params.crud                              = 'C';
            //aprvLineSetInfo
            $this.aprvLineSetInfo.useEnvNo                 = '';
            $this.aprvLineSetInfo.linkProcMethCd           = '';
            $this.aprvLineSetInfo.linkDbConnId             = '';
            $this.aprvLineSetInfo.linkCnslSql              = '';
            $this.aprvLineSetInfo.linkAprvSql              = '';
            $this.aprvLineSetInfo.authUrl                  = '';
            $this.aprvLineSetInfo.authKey                  = '';
            $this.aprvLineSetInfo.authVal                  = '';
            $this.aprvLineSetInfo.parmObjcTypeCd           = '';
            $this.aprvLineSetInfo.linkProcModuNm           = '';
            $this.aprvLineSetInfo.restfulLinkProcModuNm    = '';
            $this.aprvLineSetInfo.shellLinkProcModuNm      = '';
            $this.aprvLineSetInfo.classLinkProcModuNm      = '';
            $this.aprvLineSetInfo.rmrk                     = '';
            $this.aprvLineSetInfo.baseRmrk                 = '';
            $this.aprvLineSetInfo.dbRmrk                   = '';
            $this.aprvLineSetInfo.restfulRmrk              = '';
            $this.aprvLineSetInfo.shellRmrk                = '';
            $this.aprvLineSetInfo.classRmrk                = '';
            $this.aprvLineSetInfo.aprvAprvRoleCd           = '';
            $this.aprvLineSetInfo.aprvCnslRoleCd           = '';
            //chckedAprvLineSetInfo
            $this.chckedAprvLineSetInfo.chckedLinkCnslSql  = '';
            $this.chckedAprvLineSetInfo.chckedLinkAprvSql  = '';
            $this.chckedAprvLineSetInfo.chckedLinkDbConnId = '';

        },
        //화면 초기화
        refreshPage: function () {
            let $this = this;
            //값 초기화
            $this.reset();
            //조회
            $this.searchAprvLineSetInfo();
            $this.initData();
            $this.CmonUtil.setFocus($this.$refs.useEnvNo);
        },
        //유효성 검증
        isValid(div) {
            const $this = this;
            if (div == 'test') {
                if ($this.params.outClineYn === 'Y') {
                    if (!$this.isExctValid($this.aprvLineSetInfo.linkProcMethCd, '외부연계방법', 'rqir')) {
                        return false;
                    }
                    //DB(SQL)
                    if ($this.aprvLineSetInfo.linkProcMethCd === '10') {
                        if (!$this.isExctValid($this.aprvLineSetInfo.linkDbConnId, 'DB연결ID', 'rqir')
                            || !$this.isExctValid($this.aprvLineSetInfo.linkCnslSql, '결재상신SQL', 'rqir')
                            || !$this.isExctValid($this.aprvLineSetInfo.linkAprvSql, '결과확인SQL', 'rqir')) {
                            return false;
                        }
                    }
                    //Restful
                    if ($this.aprvLineSetInfo.linkProcMethCd === '20') {
                        if (!$this.isExctValid($this.aprvLineSetInfo.parmObjcTypeCd, '객체유형', 'rqir')
                            || !$this.isExctValid($this.aprvLineSetInfo.restfulLinkProcModuNm, '호출주소(모듈)', 'rqir')) {
                            return false;
                        }
                    }
                    //Shell
                    if ($this.aprvLineSetInfo.linkProcMethCd === '30') {
                        if (!$this.isExctValid($this.aprvLineSetInfo.shellLinkProcModuNm, 'Shell명', 'rqir')) {
                            return false;
                        }
                    }
                    //Class
                    if ($this.aprvLineSetInfo.linkProcMethCd == '40') {
                        if (!$this.isExctValid($this.aprvLineSetInfo.classLinkProcModuNm, 'Class명', 'rqir')) {
                            return false;
                        }
                    }
                }
                return true;
            } else if (div === 'save') {
                if ($this.params.outClineYn == 'Y') {
                    if (!$this.isExctValid($this.aprvLineSetInfo.linkProcMethCd, '외부연계방법', 'rqir')
                        || !$this.isExctValid($this.aprvLineSetInfo.aprvCnslRoleCd, '결재상신Role', 'rqir')
                        || !$this.isExctValid($this.aprvLineSetInfo.aprvAprvRoleCd, '결재승인Role', 'rqir')) {
                        return false;
                    }
                    //DB(SQL)
                    if ($this.aprvLineSetInfo.linkProcMethCd === '10') {
                        if (!$this.isExctValid($this.aprvLineSetInfo.linkDbConnId, 'DB연결ID', 'rqir')
                            || !$this.isExctValid($this.aprvLineSetInfo.linkCnslSql, '결재상신SQL', 'rqir')
                            || !$this.isExctValid($this.aprvLineSetInfo.linkAprvSql, '결재승인SQL', 'rqir')) {
                            return false;
                        }
                    }
                    //Restful
                    if ($this.aprvLineSetInfo.linkProcMethCd === '20') {
                        if (!$this.isExctValid($this.aprvLineSetInfo.parmObjcTypeCd, '객체유형', 'rqir')
                            || !$this.isExctValid($this.aprvLineSetInfo.restfulLinkProcModuNm, '호출주소(모듈)', 'rqir')) {
                            return false;
                        }
                    }
                    //Shell
                    if ($this.aprvLineSetInfo.linkProcMethCd === '30') {
                        if (!$this.isExctValid($this.aprvLineSetInfo.shellLinkProcModuNm, 'Shell명', 'rqir')) {
                            return false;
                        }
                    }
                    //Class
                    if ($this.aprvLineSetInfo.linkProcMethCd == '40') {
                        if (!$this.isExctValid($this.aprvLineSetInfo.classLinkProcModuNm, 'Class명', 'rqir')) {
                            return false;
                        }
                    }
                    if ($this.params.chckDBValdDiv === true) {
                        $this.alert("작성하신 DB연결 정보가 변경되었습니다. 다시 연결 테스트를 해주세요.");
                        return false;
                    }
                    if ($this.aprvLineSetInfo.linkProcMethCd == '10' && $this.params.isExctTest == '00') {
                        $this.alert('연동 테스트가 완료되지 않았습니다.');
                        return false;
                    }
                } else if ($this.params.outClineYn == 'N') {
                    if (!$this.isExctValid($this.aprvLineSetInfo.aprvCnslRoleCd, '결재상신Role', 'rqir')
                        || !$this.isExctValid($this.aprvLineSetInfo.aprvAprvRoleCd, '결재승인Role', 'rqir')) {
                        return false;
                    }
                }
                return true;
            }
        },
        //유효성 검증
        isExctValid(chkVal, stmt, div) {
            const $this = this;
            let alertStmt = stmt + (div == 'rqir' ? '은(는) 필수 입력입니다.' : ' 선택하세요');
            if (ValdUtil.isNull(chkVal)) {
                $this.alert(alertStmt);
                return false;
            }
            return true;
        },
        // 공통버튼(초기화, 조회, 저장, 삭제) 컴포넌트 핸들러
        onSetButtonClick(div) {
            switch (div) {
                case 'init':
                    this.refreshPage();
                    break;
                case 'select':
                    this.init();
                    break;
                case 'save':
                    this.updateAprvLineSetInfo();
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
    }
}
</script>
<style>
/* 결재선 설정 탭 */
#tabs .tab-contents-aprv {
    display: block;
    border: 1px solid #d1d1dd;
    border-radius: 3px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    background-color: #ffffff;
    color: #333333;
    padding: 5px 10px;
    /* min-height: calc(100vh - 200px); */
    min-height: 493px;
}

#tabs .tab-contents-aprv .radio-box input[type="radio"] {
    display: inline-block;
    width: auto;
    height: auto;
    vertical-align: middle;
}
</style>

