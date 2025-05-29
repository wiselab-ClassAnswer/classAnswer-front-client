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
                        <h2 class="essn wd-80 ib">사용환경번호</h2>
                        <input class="c-wd-80 ib" v-model="params.useEnvNo" disabled>
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="false" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>
        <!-- 채널목록 -->
        <div class="section sectionL w-35">
            <div class="section-wrap h-600">
                <h2 class="ib m-b-10">채널목록</h2>
                <!-- 그리드 -->
                <div :id="etcWrapperId">
                    <table :id="etcGridId"></table>
                    <div :id="etcPagerId"></div>
                    <Grid ref="chnlGrid" :dataParams="params" :paging=true></Grid>
                </div>
            </div>
        </div>
        <!-- 채널목록 -->
        <div class="section sectionR w-65">
            <div class="section-wrap h-600 p-t-22">
                <h2 class="ib m-b-0">연계여부</h2>
                <div class="section-part part1 m-b-10">
                    <div class="w-25 m-t-5">
                        <span class="wd-55 essn">처리구분</span>
                        <select v-model="params.chnlLinkYn" :disabled="true">
                            <option value=""></option>
                            <option value="N">자체연계</option>
                            <option value="Y">외부연계</option>
                        </select>
                    </div>
                    <div class="w-25" v-if="params.chnlLinkYn === 'Y'">
                        <span class="wd-75 ib essn">외부연계방법</span>
                        <select class="c-wd-80 ib" name="linkProcMethCd"  v-model="chnlSetInfo.linkProcMethCd">
                            <option value=""></option>
                            <option v-for=" item in code.linkProcMethCdList" :key="item.cdVal" v-bind:value="item.cdVal">{{ item.cdNm }}</option>
                        </select>
                    </div>
                </div>
                <!-- 자체기능 사용 -->
                <div v-if="params.chnlLinkYn === 'N' && chnlSetInfo.chnlKindCd !== 'MAIL' && chnlSetInfo.chnlKindCd !== 'TGRM'">
                    <h2 class="ib m-b-10">자체연계 설정</h2>
                    <div class="section-part part2 b w-100">
                        <div class="w-100 text-box">
                            <span class="wd-90">비고</span>
                            <textarea class="c-wd-90 h-540" name="baseRmrk" id="baseRmrk" cols="30" rows="10" v-model="chnlSetInfo.baseRmrk"></textarea>
                        </div>
                    </div>
                </div>
                <!-- 메일 자체기능 사용 -->
                <div class="section-part part2 b w-100" v-if="params.chnlLinkYn === 'N' && chnlSetInfo.chnlKindCd === 'MAIL'">
                    <div id="tabs" class="w-100 m-r-20 ">
                        <h2 class="ib m-b-10">이메일 자체연계 설정</h2>
                        <div class="dbconnectTab f-r w-15">
                            <div class="w-50 ib t-a-c">
                                <span class="case case1 m-t-6" v-if="params.excuteMailChckDiv === '01'">성공</span>
                                <span class="case case2 m-t-6" v-if="params.excuteMailChckDiv === '00'">실행전</span>
                                <span class="case case3 m-t-6" v-if="params.excuteMailChckDiv === '02'">실패</span>
                            </div>
                            <div class="w-45 ib">
                                <button class="btn-normal btn-normal-tabup" style="height:27px !important"  @click="sendTestMail">메일테스트</button>
                            </div>
                        </div>
                        <div class="tab-contents-itself">
                            <div class="section-part part2 b w-100">
                                <div class="w-50-mr2 ib m-b-0">
                                    <span class="wd-90 essn">Host</span>
                                    <input class="c-wd-90" type="text" v-model="mailSetInfo.host">
                                </div>
                                <div class="w-50 ib m-b-0">
                                    <span class="wd-90 essn">Port</span>
                                    <input class="c-wd-90" type="text" v-model="mailSetInfo.port">
                                </div>
                                <div class="w-50-mr2 ib m-b-0">
                                    <span class="wd-90 essn">Auth</span>
                                    <input class="c-wd-90" type="text" v-model="mailSetInfo.auth">
                                </div>
                                <div class="w-50 ib m-b-0">
                                    <span class="wd-90">Debug</span>
                                    <input class="c-wd-90" type="text" v-model="mailSetInfo.debug">
                                </div>
                                <div class="w-50-mr2 ib m-b-0">
                                    <span class="wd-90">Encode</span>
                                    <input class="c-wd-90" type="text" v-model="mailSetInfo.encode">
                                </div>
                                <div class="w-50 ib m-b-0">
                                    <span class="wd-90">SSLEnable</span>
                                    <input class="c-wd-90" type="text" v-model="mailSetInfo.sslEnable">
                                </div>
                                <div class="w-50-mr2 ib m-b-0">
                                    <span class="wd-90">SSLTrust</span>
                                    <input class="c-wd-90" type="text" v-model="mailSetInfo.sslTrust">
                                </div>
                                <div class="w-50 ib m-b-0">
                                    <span class="wd-90 essn">StartTLS</span>
                                    <input class="c-wd-90" type="text" v-model="mailSetInfo.starttls">
                                </div>
                                <div class="w-50-mr2 ib m-b-0">
                                    <span class="wd-90 essn">SenderUserNm</span>
                                    <input class="c-wd-90" type="text" v-model="mailSetInfo.senderUserNm">
                                </div>
                                <div class="w-50 ib m-b-0">
                                    <span class="wd-90 essn">SenderAddr</span>
                                    <input class="c-wd-90" type="text" v-model="mailSetInfo.senderAddr">
                                </div>
                                <div class="w-50-mr2 ib m-b-0">
                                    <span class="wd-90 essn">SenderPswd</span>
                                    <input class="c-wd-90" type="text" v-model="mailSetInfo.senderPswd">
                                </div>
                                <div class="w-50 ib m-b-0">
                                    <span class="wd-90">AuthType</span>
                                    <input class="c-wd-90" type="text" v-model="mailSetInfo.authType">
                                </div>
                                <div class="w-100 text-box">
                                    <span class="wd-90">연동설명</span>
                                    <textarea spellcheck="false" class="c-wd-90" style="height:300px; max-height:300px" v-model="mailSetInfo.mailRmrk"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 텔레그램 자체기능 사용 -->
                <div class="section-part part2 b w-100" v-if="params.chnlLinkYn === 'N' && chnlSetInfo.chnlKindCd === 'TGRM'">
                    <div id="tabs" class="w-100">        
                        <div id="tabs" class="w-100 m-r-20">
                            <h2 class="ib m-b-10">텔레그램 자체연계 설정</h2>
                            <div class="dbconnectTab f-r w-15">
                                <div class="w-50 ib t-a-c">
                                    <span class="case case2 m-t-6" v-if="params.isExctTest === '00'">실행전</span>
                                    <span class="case case1 m-t-6" v-if="params.isExctTest === '10'">성공</span>
                                    <span class="case case3 m-t-6" v-if="params.isExctTest === '20'">실패</span>
                                    <span class="case case1 m-t-6" v-if="params.isExctTest === '30'">미지원</span>
                                </div>
                                <div class="w-45 ib">
                                    <button class="btn-normal btn-normal-tabup" style="height:27px !important"
                                        id="connVrfyDbSql" @click="tgrmTestBtn()">테스트</button>
                                </div>
                            </div>
                            <div class="tab-contents-itself">
                                <div class="section-part part2 b w-100">
                                    <div class="w-50-mr2 ib m-b-5">
                                        <span class="wd-90 essn">BotToken</span>
                                        <input class="c-wd-90" type="text" v-model="tgrmSetInfo.botToken">
                                    </div>
                                    <div class="w-50 ib m-b-5">
                                        <span class="wd-90 essn">ChatID</span>
                                        <input class="c-wd-90" type="text" v-model="tgrmSetInfo.chatId">
                                    </div>
                                    <div class="w-100 text-box">
                                        <span class="wd-90">연동설명</span>
                                        <textarea spellcheck="false" class="c-wd-90" style="height:248px; max-height:248px" cols="30" rows="10"
                                            v-model="tgrmSetInfo.tgrmRmrk"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 외부채널연동 -->
                <div class="section-part part2 flex" v-if="params.chnlLinkYn === 'Y'">
                    <div id="tabs" class="w-70 m-r-20">
                        <h2 class="ib m-b-10">외부연계 설정</h2>
                        <ul class="tab-menu">
                            <li class="pointer" v-for="(item, index) in code.linkProcMethCdList"
                                :class="{ active: chnlSetInfo.linkProcMethCd === item.cdVal }" @click="changeTab(item.cdVal)">
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
                                    <button class="btn-normal btn-normal-tabup " style="height:27px !important" @click="connVrfyDbSql()">테스트</button>
                                </div>
                            </div>
                        </ul>
                        <!-- DB(SQL) -->
                        <div class="tab-contents-chnl">
                            <div v-show="chnlSetInfo.linkProcMethCd == '10'">
                                <div class="inner-tab-content con1">
                                    <div class="inner-tab-content con1">
                                        <div class="w-50">
                                            <span class="wd-90 essn">DB연결ID</span>
                                            <select class="c-wd-90" name="linkDbConnId" @blur="chckDBVald"
                                                v-model="chnlSetInfo.linkDbConnId">
                                                <option value=""></option>
                                                <option v-for="el in code.dbConnIdList" :key="el.colId" :value="el.colId">
                                                    {{ el.colId }} | {{ el.colNm }}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="w-100 text-box">
                                            <span class="wd-90 essn">연계처리SQL</span>
                                            <textarea spellcheck="false" class="c-wd-90" style="height:240px; max-height:240px" name="linkProcSql" id="linkProcSql"
                                                @blur="chckDBVald" cols="30" rows="10"
                                                v-model="chnlSetInfo.linkProcSql"></textarea>
                                        </div>
                                        <div class="w-100 text-box">
                                            <span class="wd-90">연동 설명</span>
                                            <textarea spellcheck="false" class="c-wd-90" style="height:253px; max-height:253px" name="rmrk" id="rmrk" cols="30" rows="10"
                                                v-model="chnlSetInfo.dbRmrk"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- 외부연동방법 RESTful 일 때 -->
                            <div v-show="chnlSetInfo.linkProcMethCd == '20'">
                                <div class="inner-tab-content con2">
                                    <div class="w-100">
                                        <span class="wd-90 essn">호출주소(모듈)</span>
                                        <input class="c-wd-90" type="text" name="linkProcModuNm" id="linkProcModuNm"
                                            v-model="chnlSetInfo.restfulLinkProcModuNm">
                                    </div>
                                    <div class="w-50-mr2 ib">
                                        <span class="wd-90">인증URL</span>
                                        <input class="c-wd-90" type="text" name="authUrl" v-model="chnlSetInfo.authUrl">
                                    </div>
                                    <div class="w-50-ml2 ib">
                                        <span class="wd-90">인증키</span>
                                        <input class="c-wd-90" type="text" name="authKey" v-model="chnlSetInfo.authKey">
                                    </div>
                                    <div class="w-50-mr2 ib ">
                                        <span class="wd-90">인증값</span>
                                        <input class="c-wd-90" type="text" name="authVal" v-model="chnlSetInfo.authVal">
                                    </div>
                                    <div class="w-50-ml2 ib ">
                                        <span class="wd-90 essn">객체유형</span>
                                        <select class="c-wd-90" name="parmObjcTypeCd" v-model="chnlSetInfo.parmObjcTypeCd">
                                            <option value=""> </option>
                                            <option v-for="el in code.parmObjcTypeCdList" :key="el.cdVal"
                                                v-bind:value="el.cdVal">{{ el.cdNm }}
                                            </option>
                                        </select>
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
                                        <span class="wd-90">연동 설명</span>
                                        <textarea class="c-wd-90" style="height:78px; max-height:78px" name="rmrk" id="rmrk" cols="30" rows="10"
                                            v-model="chnlSetInfo.restfulRmrk"></textarea>
                                    </div>
                                </div>
                            </div>
                            <!-- 외부연동방법 Shell일 때 -->
                            <div v-show="chnlSetInfo.linkProcMethCd == '30'">
                                <div class="inner-tab-content con3">
                                    <div class="w-100 text-box m-b-0">
                                        <span class="wd-90 essn">Shell명</span>
                                        <input type="text" class="c-wd-90" v-model="chnlSetInfo.shellLinkProcModuNm">
                                    </div>
                                    <!-- 왼쪽 Value -->
                                    <div class="w-50-mr2 ib m-b-0">
                                        <div v-for="(el, i) in shellValList" :key="i">
                                            <span class="wd-90" v-if="i < 5">{{ 'Value ' + (i+1) }}</span>
                                            <input class="c-wd-90" v-if="i < 5" type="text" v-model="shellValList[i].linkVal" />
                                        </div>
                                    </div>
                                    <!-- 오른쪽 Value -->
                                    <div class="w-50-ml2 ib m-b-0">
                                        <div v-for="(el, i) in shellValList" :key="i">
                                            <span class="wd-90" v-if="i >=5">{{ 'Value ' + (i+1) }}</span>
                                            <input class="c-wd-90" v-if="i >=5" type="text" v-model="shellValList[i].linkVal" />
                                        </div>
                                    </div>
                                    <div class="w-100 text-box">
                                        <span class="wd-90">연동 설명</span>
                                        <textarea spellcheck="false" class="c-wd-90" style="height:323px; max-height:323px" name="rmrk" id="rmrk" cols="30" rows="10" v-model="chnlSetInfo.shellRmrk"></textarea>
                                    </div>
                                </div>
                            </div>
                            <!-- 외부연동방법이 CLASS 일때 -->
                            <div v-show="chnlSetInfo.linkProcMethCd == '40'">
                                <div class="inner-tab-content con4">
                                    <div class="w-100 text-box">
                                        <span class="wd-90 essn">Class명</span>
                                        <input type="text" class="c-wd-90" name="linkProcModuNm" cols="30" rows="10" v-model="chnlSetInfo.classLinkProcModuNm">
                                    </div>
                                    <!-- Key -->
                                    <div class="w-50-mr2 ib m-b-0">
                                        <div v-for="(el, i) in classKeyValList" :key="i">
                                            <span class="wd-90">{{ 'Key ' + (i+1) }}</span>
                                            <input type="text" class="c-wd-90" v-model="classKeyValList[i].linkKey" />
                                        </div>
                                    </div>
                                    <!-- Value -->
                                    <div class="w-50-ml2 ib m-b-0">
                                        <div v-for="(el, i) in classKeyValList" :key="i">
                                            <span class="wd-90">{{ 'Value ' + (i+1) }}</span>
                                            <input type="text" class="c-wd-90" v-model="classKeyValList[i].linkVal" />
                                        </div>
                                    </div>
                                    <div class="w-100 text-box">
                                        <span class="wd-90">연동 설명</span>
                                        <textarea spellcheck="false" style="height:148px; max-height:148px" class="c-wd-90" name="rmrk" cols="30" rows="10" v-model="chnlSetInfo.classRmrk"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 사용자역할 -->
                    <div class="w-30 m-t-5">
                        <h2 class="essn">사용자역할</h2>
                        <div class="w-100">
                            <div v-for="(combo, index) in comboList" :key="index">
                                <select class="w-100 m-b-5" v-model="selectValList[index]">
                                    <option value=""></option>
                                    <option v-for="item in userRoleList" :key="item.roleCd" :value="item.roleCd">{{ item.roleNm }}</option>
                                </select>
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
import { CmonUtil }              from '@/utils/CmonUtil';
import SetButton                 from '@/components/SetButton.vue'
import Grid                      from '@/components/grid/Grid.vue'

export default {
    components: {
        SetButton,
        Grid
    },
    setup() {
        let code = reactive({
            linkProcMethCdList : [],
            parmObjcTypeCdList : [],
            fileLinkTypeCdList : [],
            dbConnIdList       : []
        });
        const getCmonCdList = inject('getCmonCdList');
        getCmonCdList('LINK_PROC_METH_CD', code.linkProcMethCdList, 'N', null); //연계처리방법
        getCmonCdList('PARM_OBJC_TYPE_CD', code.parmObjcTypeCdList, 'N', null); //전달객체유형
        getCmonCdList('FILE_LINK_TYPE_CD', code.fileLinkTypeCdList, 'N', null); //파일연계유형

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

        let etcGridId    = reactive({});
        let etcPagerId   = reactive({});
        let etcWrapperId = reactive({});

        let objectId     = Math.random().toString(36);
        objectId         = objectId.replaceAll('.', '');
        etcGridId        = 'grid_list_' + objectId;
        etcPagerId       = 'pager_list_' + objectId;
        etcWrapperId     = 'list_wrapper_' + objectId;
        
        return {
            code,
            etcGridId,
            etcPagerId,
            etcWrapperId
        }
    },

    data: function () {
        return {
            params: {
                userId                    : '',               // 사용자 아이디(RoleCd조회용)
                isExctTest                : '00',             // 검증 테스트 여부 // 00: 검증 안함 01: 검증 성공 02: 검증 실패 
                excuteMailChckDiv         : '00',             // 메일 검증 테스트 여부 // 00: 검증 안함 01: 검증 성공 02: 검증 실패
                chckDBValdDiv             : false,            // 변경 체크 여부
                disableProcDiv            : false,            // 처리구분 Disabled 여부
                linkKindCd                : 'CHNL',           // 연계종류코드
                useEnvNo                  : '',               // 사용환경번호
                chnlLinkYn                : '',               // 채널설정구분
                smsUseYn                  : '',               // sms사용여부
                mailUseYn                 : '',               // mail 사용여부
                pushUseYn                 : '',               // push 사용여부
                atokUseYn                 : '',               // 카카오톡 사용여부
                tgrmUseYn                 : '',               // 텔레그램 사용여부
            },
            chnlSetInfo: {
                useEnvNo                  : '',                // 사용환경번호
                chnlKindCd                : '',                // 채널종류코드
                linkProcMethCd            : '',                // 연계처리방법코드
                linkDbConnId              : '',                // DB연결ID
                linkProcSql               : '',                // 연계처리SQL
                authUrl                   : '',                // 인증URL
                authKey                   : '',                // 인증키
                authVal                   : '',                // 인증값
                parmObjcTypeCd            : '',                // 파라미터객체코드
                linkProcModuNm            : '',                // 연계처리모듈명
                restfulLinkProcModuNm     : '',                // restful 연계처리모듈명
                shellLinkProcModuNm       : '',                // shell 연계처리모듈명
                classLinkProcModuNm       : '',                // class 연계처리모듈명
                rmrk                      : '',                // 비고
                baseRmrk                  : '',                // 자체연계 비고
                dbRmrk                    : '',                // db 비고
                restfulRmrk               : '',                // restful 비고
                shellRmrk                 : '',                // shell 비고
                classRmrk                 : ''                 // class 비고

            },
            mailSetInfo: {
                host                      : '',                // 메일 host                
                port                      : '',                // 메일 port
                auth                      : '',                // 메일 auth
                debug                     : '',                // 메일 debug
                encode                    : '',                // 메일 encode
                sslEnable                 : '',                // 메일 sslEnable
                sslTrust                  : '',                // 메일 sslTrust
                starttls                  : '',                // 메일 startTLS
                senderUserNm              : '',                // 메일 senderUserNm
                senderAddr                : '',                // 메일 senderAddr
                senderPswd                : '',                // 메일 senderPswd
                authType                  : '',                // 메일 authType
                mailRmrk                  : '',                // 메일 자체기능 비고
            },
            tgrmSetInfo: {
                botToken                  : '',                // 텔레그램 botToken
                chatId                    : '',                // 텔레그램 chatID
                tgrmRmrk                  : '',                // 텔레그램 자체기능 비고
            },
            // 테스트 검증 된 DB_CONN_ID, LINK_DB_PROC_SQL
            chckedChnlSetInfo: {
                chckedLinkDbConnId        : '',
                chckedLinkDbProcSql       : ''
            },
            linkDbConnIdList              : [],                // DB 연결 ID 리스트
            userRoleList                  : [],                // 사용자 역할 리스트
            setUserRoleList               : [],                // 사용자 역할 저장 리스트 

            comboList                     : Array(5).fill({ roleCd: '', roleNm: '' }), // 사용자역할 콤보박스 빈 객체 배열 생성
            selectValList                 : [],                // 선택된 값들을 저장할 배열 생성

            restfulKeyValList : [],                            // RESTFUL 파라미터 리스트
            shellValList      : [],                            // SHELL 파라미터 리스트
            classKeyValList   : [],                            // CLASS 파라미터 리스트
            keyList: [],     // 각 연동 방법 별 key를 가져올 때 사용하는 리스트
            valList: [],     // 각 연동 방법 별 value를 가져올 때 사용하는 리스트
        }
    },
    methods: {
        init: function () {
            const $this = this;

            $this.reset();
            this.params.userId = SessionUtil.getUserId();
            this.chnlSetInfo.linkProcMethCd = '10';
            $this.selectListUseEnvInfo();
            $this.selectListUserRole();
            $this.initGrid();
            $this.searchList();
            
        },
        initData(){
            const $this = this;
            this.params.userId      = SessionUtil.getUserId();
            $this.selectValList     = [];
            $this.restfulKeyValList = [];
            $this.shellValList      = [];
            $this.classKeyValList   = [];
            $this.comboList         = Array(5).fill({ roleCd: '', roleNm: '' }); // 5개의 콤보박스를 위한 빈 객체 배열 생성

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
        //외부기능상세 탭 선택
        changeTab(item){
            const $this = this;
            // $this.reset();
            $this.chnlSetInfo.linkProcMethCd = item;
            return false;
        },
        initGrid() {
            const $this = this;
            //채널 목록 그리드
            let gridObj = {
                url: '/cmon/sys/chnlSet/selectListChnlList.hb',
                colModels: [
                    { name: 'cdVal'     , label: '채널코드'     , width: 10     , align: 'left' },
                    { name: 'cdNm'      , label: '채널명'       , width: 10     , align: 'left' },
                    { name: 'aplyyn'    , label: '적용여부'     , width: 5      , align: 'center' },
                ],
                options: {
                    onSelectRow(rowid) {
                        let chnlCd = $(this).jqGrid('getRowData', rowid).cdVal;
                        $this.reset();
                        $this.chnlSetInfo.chnlKindCd = chnlCd;
                        $this.selectChnlSetInfoDetl($(this).getRowData(rowid).cdVal);
                        $this.selectListUserRole();
                        // sms 사용설정 여부
                        if($this.params.smsUseYn === 'N' && chnlCd === 'SMS'){
                            $this.alert("SMS 채널 서비스 사용 여부가 비활성화 되어있습니다. 채널 서비스 사용 비활성화 시 저장 기능만 이용 가능합니다.");
                        }
                        // mail 사용설정 여부
                        if ($this.params.mailUseYn === 'N' && chnlCd === 'MAIL'){
                            $this.alert("MAIL 채널 서비스 사용 여부가 비활성화 되어있습니다. 채널 서비스 사용 비활성화 시 저장 기능만 이용 가능합니다.");
                        }
                        // push 사용설정 여부
                        if($this.params.pushUseYn === 'N' && chnlCd === 'PUSH'){
                            $this.alert("PUSH 채널 서비스 사용 여부가 비활성화 되어있습니다. 채널 서비스 사용 비활성화 시 저장 기능만 이용 가능합니다.");
                        }
                        // atok 사용설정 여부
                        if($this.params.atokUseYn === 'N' && chnlCd === 'ATOK'){
                            $this.alert("ATOK 채널 서비스 사용 여부가 비활성화 되어있습니다. 채널 서비스 사용 비활성화 시 저장 기능만 이용 가능합니다.");
                        }
                        // tgrm 사용설정 여부
                        if($this.params.tgrmUseYn === 'N' && chnlCd === 'TGRM'){
                            $this.alert("TGRM 채널 서비스 사용 여부가 비활성화 되어있습니다. 채널 서비스 사용 비활성화 시 저장 기능만 이용 가능합니다.");
                        }
                    }
                }
            };
            this.$refs.chnlGrid.init(gridObj);
            this.searchList();
        },
        //grid init
        initGridDataSrch() {
            const $this = this;
            $this.params['div'] = 'val';

            // 그리드 초기화
            $.jgrid.gridUnload($this.etcGridId);

            // url방식
            $("#" + $this.etcGridId).jqGrid($.extend(true, {}, GridUtil.gridOptions(), {
                datatype: 'local',
                mtype: 'post',
                url: '/cmon/sys/chnlSet/selectListChnlList.hb',
                colModel: $this.params.colModel,
                pager: '#' + this.etcPagerId,
                height: 560,
                onPaging: function (data) {
                    GridUtil.onPagingCommon(data, $(this), function (res) {
                        $this.params.rowCount     = res.rowCount;
                        $this.params.currentPage  = res.currentPage;
                        $this.params.currentIndex = res.currentIndex;
                        $this.params.totalCount   = res.totalCount;
                        $this.searchDataSrch(false);
                    })
                }
            }));
            GridUtil.resizeJqGridWidth($this.etcGridId, $this.etcWrapperId);
            $this.searchDataSrch(true);
        },
        //조회 데이터검색
        searchDataSrch(isSearch) {
            const $this = this;

            if (isSearch) {
                $this.params.currentPage = 1;
                $this.params.currentIndex = 0;
            }
            if (CmonUtil.isLoading() && !isIgnoreLoading) {
                return false;
            }
            CmonUtil.processLoading(true);
            $("#" + $this.etcGridId).setGridParam({
                datatype: "json",
                postData: JSON.stringify($this.params),
                page: 1,
                loadComplete: function (res) {
                    CmonUtil.processLoading(false);
                    if (res.rtnCd == '0000') {
                        if (res.rtnData.result.length == 0) {
                            $this.alert("조회 내용이 없습니다.");
                        }
                    } else {
                        $this.alert(res.data.rtnMsg);
                    }
                }
            }).trigger("reloadGrid");
        },
        //리스트 조회
        searchList() {
            const $this = this;
            $this.$refs.chnlGrid.selectList(true);
        },
        // 사용 환경 정보 조회
        selectListUseEnvInfo: function () {
            let $this = this;
            let param = {
                useEnvNo: $this.params.useEnvNo
            };
            $this.doPost('/cmon/sys/chnlSet/selectListUseEnvInfo.hb', param).then(function (res) {
                if (res.data.rtnCd === '0000') {
                    $this.params.useEnvNo      = res.data.rtnData.result.useEnvNo;
                    $this.params.chnlLinkYn    = res.data.rtnData.result.chnlLinkYn;

                    if (res.data.rtnData.result.chnlLinkYn === 'Y') {
                        $this.params.smsUseYn  = res.data.rtnData.result.smsUseYn;
                        $this.params.mailUseYn = res.data.rtnData.result.mailUseYn;
                        $this.params.pushUseYn = res.data.rtnData.result.pushUseYn;
                        $this.params.atokUseYn = res.data.rtnData.result.atokUseYn;
                        $this.params.tgrmUseYn = res.data.rtnData.result.tgrmUseYn;
                    } 
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
        },
        // 테스트 메일 전송
        sendTestMail: function () {
            let $this = this;
            if(!$this.isExctValid($this.mailSetInfo.host         ,'Host', 'rqir')
            || !$this.isExctValid($this.mailSetInfo.port         ,'Port','rqir')
            || !$this.isExctValid($this.mailSetInfo.auth         ,'Auth','rqir')
            || !$this.isExctValid($this.mailSetInfo.starttls     ,'startTLS','rqir')
            || !$this.isExctValid($this.mailSetInfo.senderUserNm ,'senderUserNm','rqir')
            || !$this.isExctValid($this.mailSetInfo.senderAddr   ,'senderAddr','rqir')
            || !$this.isExctValid($this.mailSetInfo.senderPswd   ,'senderPswd','rqir')){
                return false;
            }
            let param = {
                useEnvNo        : $this.params.useEnvNo,
                userId          : $this.params.userId,
                chnlKindCd      : "MAIL",
                emalAddr        : $this.mailSetInfo.senderAddr,
                senderUserNm    : $this.mailSetInfo.senderUserNm
            }
            $this.doPost('/cmon/sys/chnlSet/sendMail.hb', param).then(function (res) {
                if (res.data.rtnCd === '0000') {
                    $this.params.excuteMailChckDiv = '01';
                    $this.alert("현재 로그인된 사용자의 메일주소로 연동 테스트 메일이 전송되었습니다.");
                } else {
                    $this.params.excuteMailChckDiv = '02';
                    $this.alert(res.data.rtnMsg);
                }

            });
        },
        // 텔레그램 연동테스트
        tgrmTestBtn: function () {
            let $this = this;
            if(!$this.isExctValid($this.tgrmSetInfo.botToken,'BotToken', 'rqir')
            || !$this.isExctValid($this.tgrmSetInfo.chatId,'ChatID','rqir')){
                return false;
            }
            let param = {
                useEnvNo        : $this.params.useEnvNo,
                userId          : $this.params.userId,
                chnlKindCd      : "TGRM",
            }
            // $this.doPost('/cmon/sys/chnlSet/.hb', param).then(function (res) {
            // });
            $this.params.isExctTest = '30';
            $this.alert("현재 텔레그램 연동 테스트는 지원하지 않으며, 저장 기능만 이용할 수 있습니다.");

        },
        //채널연동 상세정보 조회
        selectChnlSetInfoDetl: function (cdVal) {
            let $this = this;
            let detlParam = {
                useEnvNo    : $this.params.useEnvNo,
                chnlKindCd  : cdVal
            }
            $this.reset();
            $this.doPost('/cmon/sys/chnlSet/selectListChnlSetInfo.hb', detlParam).then(function (res) {
                CmonUtil.processLoading(false);
                if (res.data.rtnCd === '0000') {
                    let result = res.data.rtnData;
                    let keyValList = result.keyValList; 
                    let linkCd = result.chnlSetInfo.linkProcMethCd;
                    // chnlLinkYn ='Y' 외부연계  
                    if ($this.params.chnlLinkYn === 'Y') {
                        //사용자 역할 조회
                        $this.selectValList = [];
                        if (ValdUtil.isNotNull(res.data.rtnData.roleList)) {
                            for (let i = 0; i < res.data.rtnData.roleList.length; i++) {
                                $this.selectValList.push(res.data.rtnData.roleList[i].roleCd);
                            }
                        }
                    }
                    if(result.length != 0){
                        $this.chnlSetInfo.linkProcMethCd = linkCd;
                        $this.chnlSetInfo                = result.chnlSetInfo;
                    }
                    if((linkCd == '' || linkCd == null) && $this.params.chnlLinkYn === 'Y'){
                        $this.chnlSetInfo.linkProcMethCd = '10';
                    }
                    // 자체연계
                    if($this.params.chnlLinkYn === 'N' && result.chnlSetInfo.chnlKindCd !=='MAIL' && result.chnlSetInfo.chnlKindCd !== 'TGRM'){
                        $this.chnlSetInfo.baseRmrk = result.chnlSetInfo.rmrk;

                    // 메일 자체연계
                    } else if($this.params.chnlLinkYn === 'N' && result.chnlSetInfo.chnlKindCd =='MAIL'){
                            const data = JSON.parse(result.chnlSetInfo.rmrk);
                            if (ValdUtil.isNotNull(data)) {
                                $this.mailSetInfo.host          = data.host;
                                $this.mailSetInfo.port          = data.port;
                                $this.mailSetInfo.auth          = data.auth;
                                $this.mailSetInfo.debug         = data.debug;
                                $this.mailSetInfo.encode        = data.encode;
                                $this.mailSetInfo.sslEnable     = data.sslEnable;
                                $this.mailSetInfo.sslTrust      = data.sslTrust;
                                $this.mailSetInfo.starttls      = data.starttls;
                                $this.mailSetInfo.senderUserNm  = data.senderUserNm;
                                $this.mailSetInfo.senderAddr    = data.senderAddr;
                                $this.mailSetInfo.senderPswd    = data.senderPswd;
                                $this.mailSetInfo.authType      = data.authType;
                                $this.mailSetInfo.mailRmrk      = data.rmrk;
                            }
                      //텔레그램 자체연계      
                    } else if($this.params.chnlLinkYn === 'N' && result.chnlSetInfo.chnlKindCd =='TGRM'){
                            const data = JSON.parse(result.chnlSetInfo.rmrk);
                            if (ValdUtil.isNotNull(data)) {
                                $this.tgrmSetInfo.botToken      = data.botToken;
                                $this.tgrmSetInfo.chatId        = data.chatId;
                                $this.tgrmSetInfo.tgrmRmrk      = data.rmrk;
                            }
                    //DB(SQL)
                    } else if(linkCd === '10') {
                        $this.chnlSetInfo.dbRmrk = result.chnlSetInfo.rmrk;

                     // Restful   
                    } else if(linkCd === '20') {
                        $this.chnlSetInfo.restfulLinkProcModuNm = result.chnlSetInfo.linkProcModuNm;
                        $this.chnlSetInfo.restfulRmrk           = result.chnlSetInfo.rmrk;
                        if(keyValList.length != 0){
                                keyValList.forEach((el,idx) =>{
                                    $this.restfulKeyValList[idx] = el;
                                })
                            }
                      //Shell
                    } else if(linkCd === '30') {
                        $this.chnlSetInfo.shellLinkProcModuNm = result.chnlSetInfo.linkProcModuNm;
                        $this.chnlSetInfo.shellRmrk           = result.chnlSetInfo.rmrk;
                        if(keyValList.length != 0){
                                keyValList.forEach((el,idx) =>{
                                    $this.shellValList[idx] = el;
                                })
                            }
                      // Class
                    } else if(linkCd === '40'){
                        $this.chnlSetInfo.classLinkProcModuNm = result.chnlSetInfo.linkProcModuNm;
                        $this.chnlSetInfo.classRmrk           = result.chnlSetInfo.rmrk;
                        if(keyValList.length != 0){
                            keyValList.forEach((el,idx) =>{
                                $this.classKeyValList[idx] = el;
                            })
                        }
                    }
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
        },
        // DB연결ID, SQL 변경 여부 체크
        chckDBVald: function () {
            let $this = this;
            if (($this.params.isExctTest === '10') && ($this.chckedChnlSetInfo.chckedLinkDbConnId !== $this.chnlSetInfo.linkDbConnId)) {
                $this.params.chckDBValdDiv = true;
                $this.params.isExctTest = '00';
            } else if (($this.params.isExctTest === '10') && ($this.chckedChnlSetInfo.chckedLinkDbProcSql !== $this.chnlSetInfo.linkProcSql)) {
                $this.params.chckDBValdDiv = true;
                $this.params.isExctTest = '00';
            } else {
                $this.params.chckDBValdDiv = false;
            }
        },
        selectBtnSrch: function () {
            let $this = this;
            $this.refreshPage();
            $this.searchList();
        },
        // 사용자 역할 조회
        selectListUserRole: function () {
            let $this = this;
            let param = $this.params;
            $this.userRoleList = [];
            $this.doPost('/cmon/sys/chnlSet/selectListUserRole.hb', param).then(function (res) {
                for (let i = 0; i < res.data.rtnData.result.length; i++) {
                    $this.userRoleList.push(res.data.rtnData.result[i]);
                }
            });
        },
        // db 연결, sql 검증테스트
        connVrfyDbSql: function () {
            let $this = this;
            $this.params.isExctTest = '00';
            if(ValdUtil.isNull($this.chnlSetInfo.chnlKindCd)){
                    $this.alert("연계설정할 채널을 선택해주세요.");
                    return false;
            }
            if($this.isValid('test')){
                //DB(SQL)
                if($this.chnlSetInfo.linkProcMethCd === '10'){
                    let testParam = {
                        linkProcSql : $this.chnlSetInfo.linkProcSql,
                        dbConnId    : $this.chnlSetInfo.linkDbConnId
                    }
                    $this.doPost('/cmon/sys/chnlSet/connVrfyDbSql.hb', testParam).then(function (response) {
                        if (response.data.rtnCd === '0000') {                    
                            //SQL문 검증 성공
                            if(response.data.rtnData.sqlMsg === 'Y'){
                                $this.params.isExctTest    = '10';
                                $this.params.chckDBValdDiv = false;
                                // 테스트 성공 한 DB_CONN_ID 와 LINK_PROC_SQL을 저장
                                $this.chckedChnlSetInfo.chckedLinkDbProcSql = testParam.linkProcSql;
                                $this.chckedChnlSetInfo.chckedLinkDbConnId  = testParam.dbConnId;
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
                // Restful
                } else if($this.chnlSetInfo.linkProcMethCd === '20'){
                    let testParam = {};
                    $this.params.isExctTest = '30';
                    $this.alert("현재 Restful 연동 테스트는 지원하지 않으며, 저장 기능만 이용할 수 있습니다.");
                // Shell
                } else if($this.chnlSetInfo.linkProcMethCd === '30'){
                    let testParam = {};
                    $this.params.isExctTest = '30';
                    $this.alert("현재 Shell 연동 테스트는 지원하지 않으며, 저장 기능만 이용할 수 있습니다.");
                // Class
                } else if($this.chnlSetInfo.linkProcMethCd === '40'){
                    let testParam = {};
                    $this.params.isExctTest = '30';
                    $this.alert("현재 Class 연동 테스트는 지원하지 않으며, 저장 기능만 이용할 수 있습니다.");
                }
            }
        },
        // 채널 설정 정보 저장
        updateChnlSetInfo: function () {
            let $this = this;
            let chckUserRoleValdDiv = '00';     // 00:정상 10:순서문제 20:선택X 30:중복
            if($this.isValid('save')){
                if(!$this.chnlSetInfo.linkProcMethCd === '' || ValdUtil.isNotNull($this.chnlSetInfo.linkProcMethCd)){
                
                    let isDuplicate       = false;
                    $this.setUserRoleList = [];
                    for(let i = 0; i < $this.selectValList.length ; i ++){
                        $this.setUserRoleList.push({'idenSeq': (i+1), 'roleCd':$this.selectValList[i]});
                    }
                    const isAllEmpty      = $this.selectValList.every(value => value === "");
                    if(isAllEmpty){
                        $this.alert("사용자역할은 필수 입력입니다.");
                        return false;
                    }
                    //중복체크
                    $this.setUserRoleList.forEach((value, index, self) => {
                        isDuplicate = self.findIndex((item) => item.roleCd === value.roleCd) !== index;
                    });
                    if(isDuplicate){
                        $this.alert("중복된 사용자역할이 있습니다.");
                        return false;
                    } 
                }
                let linkCd    = $this.chnlSetInfo.linkProcMethCd;
                let sendParam = {};
                let baseParam = {
                    useEnvNo       : $this.params.useEnvNo,
                    userId         : $this.params.userId,
                    chnlLinkYn     : $this.params.chnlLinkYn,
                    linkKindCd     : $this.params.linkKindCd,
                    chnlKindCd     : $this.chnlSetInfo.chnlKindCd,
                    linkProcMethCd : $this.chnlSetInfo.linkProcMethCd,
                } 
                //자체연계
                if( (linkCd === '' || ValdUtil.isNull(linkCd)) && $this.chnlSetInfo.chnlKindCd !== 'MAIL' && $this.chnlSetInfo.chnlKindCd !== 'TGRM' ) {
                    let paramSpec = {
                        rmrk : $this.chnlSetInfo.baseRmrk
                    }
                    sendParam = Object.assign({},baseParam, paramSpec);
                // 메일 자체연계
                } else if((linkCd === '' || ValdUtil.isNull(linkCd)) && $this.chnlSetInfo.chnlKindCd === 'MAIL') {
                    let paramSpec = {
                        rmrk            : $this.mailSetInfo.mailRmrk,
                        host            : $this.mailSetInfo.host,
                        port            : $this.mailSetInfo.port,
                        auth            : $this.mailSetInfo.auth,
                        debug           : $this.mailSetInfo.debug,
                        encode          : $this.mailSetInfo.encode,
                        sslEnable       : $this.mailSetInfo.sslEnable,
                        sslTrust        : $this.mailSetInfo.sslTrust,
                        starttls        : $this.mailSetInfo.starttls,
                        senderUserNm    : $this.mailSetInfo.senderUserNm,
                        senderAddr      : $this.mailSetInfo.senderAddr,
                        senderPswd      : $this.mailSetInfo.senderPswd,
                        authType        : $this.mailSetInfo.authType,
                        rmrk            : $this.mailSetInfo.mailRmrk,
                    }
                    sendParam = Object.assign({},baseParam, paramSpec);
                  // 텔레그램 자체연계
                } else if((linkCd === '' || ValdUtil.isNull(linkCd)) && $this.chnlSetInfo.chnlKindCd === 'TGRM') {
                    let paramSpec = {   
                        botToken        : $this.tgrmSetInfo.botToken,
                        chatId          : $this.tgrmSetInfo.chatId,
                        tgrmRmrk        : $this.tgrmSetInfo.tgrmRmrk 
                    }
                    sendParam = Object.assign({},baseParam, paramSpec);
                //DB(SQL)
                } else if( linkCd === '10') {
                    let paramSpec = {
                        linkDbConnId   : $this.chckedChnlSetInfo.chckedLinkDbConnId,
                        linkProcSql    : $this.chckedChnlSetInfo.chckedLinkDbProcSql,
                        rmrk           : $this.chnlSetInfo.dbRmrk,
                    }
                    sendParam = Object.assign({},baseParam, paramSpec, {userRoleList: $this.setUserRoleList});
                  //Restful
                } else if( linkCd === '20') {
                    let paramSpec = {
                        rmrk                : $this.chnlSetInfo.restfulRmrk,
                        authUrl             : $this.chnlSetInfo.authUrl,
                        authKey             : $this.chnlSetInfo.authKey,
                        authVal             : $this.chnlSetInfo.authVal,
                        linkProcModuNm      : $this.chnlSetInfo.restfulLinkProcModuNm,
                        parmObjcTypeCd      : $this.chnlSetInfo.parmObjcTypeCd,
                    }
                    sendParam = Object.assign({},baseParam, paramSpec, {userRoleList: $this.setUserRoleList}, {keyValList : $this.restfulKeyValList});
                  //Shell
                } else if ( linkCd === '30'){
                    let paramSpec = {
                        rmrk                : $this.chnlSetInfo.shellRmrk,
                        linkProcModuNm      : $this.chnlSetInfo.shellLinkProcModuNm,
                    }
                    sendParam = Object.assign({},baseParam, paramSpec, {userRoleList: $this.setUserRoleList}, {keyValList : $this.shellValList});
                 //Class
                } else if ( linkCd === '40') {
                    let paramSpec = {
                        rmrk                : $this.chnlSetInfo.classRmrk,
                        linkProcModuNm      : $this.chnlSetInfo.classLinkProcModuNm,
                    }
                    sendParam = Object.assign({},baseParam, paramSpec, {userRoleList: $this.setUserRoleList}, {keyValList : $this.classKeyValList});
                }
            $this.confirm({
                content  : '저장하시겠습니까?',
                    callback : {
                        yes() {
                            $this.doPost('/cmon/sys/chnlSet/updateChnlSetInfo.hb', sendParam, false).then(function (res) {
                                if (res.data.rtnCd === '0000') {
                                    $this.alert("저장되었습니다").then((result) =>{
                                        if( result.isConfirmed ){
                                           
                                        }
                                    })
                                } else {
                                    $this.alert(res.data.rtnMsg);
                                }
                            });
                            $this.init();
                        }
                    }
                })
            }
        },
        // 파라미터 초기화
        reset: function () {
            //params
            this.params.isExctTest                     = '00';
            this.params.excuteMailChckDiv              = '00';
            this.params.chckDBValdDiv                  = false;
            this.params.disableProcDiv                 = false;
            //chnlSetInfo
            this.chnlSetInfo.chnlKindCd                = '';
            this.chnlSetInfo.linkProcMethCd            = '';
            this.chnlSetInfo.linkDbConnId              = '';
            this.chnlSetInfo.linkProcSql               = '';
            this.chnlSetInfo.authUrl                   = '';
            this.chnlSetInfo.authKey                   = '';
            this.chnlSetInfo.authVal                   = '';
            this.chnlSetInfo.parmObjcTypeCd            = '';
            this.chnlSetInfo.linkProcModuNm            = '';
            this.chnlSetInfo.restfulLinkProcModuNm     = '';
            this.chnlSetInfo.shellLinkProcModuNm       = '';
            this.chnlSetInfo.classLinkProcModuNm       = '';
            this.chnlSetInfo.rmrk                      = '';
            this.chnlSetInfo.baseRmrk                  = '';
            this.chnlSetInfo.dbRmrk                    = '';
            this.chnlSetInfo.restfulRmrk               = '';
            this.chnlSetInfo.shellRmrk                 = '';
            this.chnlSetInfo.classRmrk                 = '';
            //mailSetInfo
            this.mailSetInfo.host                      = '';
            this.mailSetInfo.port                      = '';
            this.mailSetInfo.auth                      = '';    
            this.mailSetInfo.debug                     = '';
            this.mailSetInfo.encode                    = '';
            this.mailSetInfo.sslEnable                 = '';
            this.mailSetInfo.sslTrust                  = '';
            this.mailSetInfo.starttls                  = '';
            this.mailSetInfo.senderUserNm              = '';
            this.mailSetInfo.senderAddr                = '';
            this.mailSetInfo.senderPswd                = '';
            this.mailSetInfo.authType                  = '';
            this.mailSetInfo.mailRmrk                  = '';
            //tgrmSetInfo
            this.tgrmSetInfo.botToken                  = '';
            this.tgrmSetInfo.chatId                    = '';
            this.tgrmSetInfo.tgrmRmrk                  = '';
            //chckedChnlSetInfo
            this.chckedChnlSetInfo.chckedLinkDbConnId  = '';
            this.chckedChnlSetInfo.chckedLinkDbProcSql = '';

            this.initData();
        },
        refreshPage: function () {
            let $this = this;

            $this.reset();
            this.params.userId = SessionUtil.getUserId();
            $this.selectListUseEnvInfo();
            $this.initGrid();
            $this.selectListUserRole();
            // $this.$refs.chnlGrid.clearGridData();
            if(($this.chnlSetInfo.linkProcMethCd == '' || $this.chnlSetInfo.linkProcMethCd == null) && $this.params.chnlLinkYn === 'Y'){
                $this.chnlSetInfo.linkProcMethCd = '10';
            }
        },
        isValid(div){
            const $this = this;
            if(ValdUtil.isNull($this.params.chnlLinkYn)){
                $this.alert("처리구분은 필수값입니다.");
                return false;
            }
            if(div == 'test'){
                if($this.params.chnlLinkYn == 'Y'){
                    if(!$this.isExctValid($this.chnlSetInfo.linkProcMethCd,'외부연계방법', 'rqir')){
                        return false;
                    }
                    //DB(SQL)
                    if($this.chnlSetInfo.linkProcMethCd === '10'){
                        if(!$this.isExctValid($this.chnlSetInfo.linkDbConnId,'DB연결ID','rqir')
                        || !$this.isExctValid($this.chnlSetInfo.linkProcSql,'연계처리SQL','rqir')){
                            return false;
                        }
                    }
                    //Restful
                    if($this.chnlSetInfo.linkProcMethCd === '20'){
                        if(!$this.isExctValid($this.chnlSetInfo.parmObjcTypeCd,'객체유형','rqir')
                        || !$this.isExctValid($this.chnlSetInfo.restfulLinkProcModuNm,'호출주소(모듈)','rqir')){
                            return false;
                        }
                    }
                    //Shell
                    if($this.chnlSetInfo.linkProcMethCd === '30'){
                        if(!$this.isExctValid($this.chnlSetInfo.shellLinkProcModuNm,'Shell명','rqir')){
                            return false;
                        }
                    }
                    //Class
                    if($this.chnlSetInfo.linkProcMethCd == '40'){
                        if(!$this.isExctValid($this.chnlSetInfo.classLinkProcModuNm,'Class명','rqir')){
                            return false;
                        }
                    }
                } 
                return true;
            } else if(div == 'save') {
                if($this.params.chnlLinkYn == 'Y'){
                    if(!$this.isExctValid($this.chnlSetInfo.linkProcMethCd,'외부연계방법', 'rqir')){
                        return false;
                    }
                    //DB(SQL)
                    if($this.chnlSetInfo.linkProcMethCd === '10'){
                        if(!$this.isExctValid($this.chnlSetInfo.linkDbConnId,'DB연결ID','rqir')
                        || !$this.isExctValid($this.chnlSetInfo.linkProcSql,'연계처리SQL','rqir')){
                            return false;
                        }
                    }
                    //Restful
                    if($this.chnlSetInfo.linkProcMethCd === '20'){
                        if(!$this.isExctValid($this.chnlSetInfo.parmObjcTypeCd,'객체유형','rqir')
                        || !$this.isExctValid($this.chnlSetInfo.restfulLinkProcModuNm,'호출주소(모듈)','rqir')){
                            return false;
                        }
                    }
                    //Shell
                    if($this.chnlSetInfo.linkProcMethCd === '30'){
                        if(!$this.isExctValid($this.chnlSetInfo.shellLinkProcModuNm,'Shell명','rqir')){
                            return false;
                        }
                    }
                    //Class
                    if($this.chnlSetInfo.linkProcMethCd == '40'){
                        if(!$this.isExctValid($this.chnlSetInfo.classLinkProcModuNm,'Class명','rqir')){
                            return false;
                        }
                    }
                    if($this.params.chckDBValdDiv  === true ){
                        $this.alert("작성하신 DB연결 정보가 변경되었습니다. 다시 연결 테스트를 해주세요.");
                        return false;
                    }
                    if($this.chnlSetInfo.linkProcMethCd == '10' && $this.params.isExctTest == '00'){
                        $this.alert('연동 테스트가 완료되지 않았습니다.');
                        return false;
                    }
                } else if($this.params.chnlLinkYn == 'N'){
                    if($this.chnlSetInfo.chnlKindCd === 'MAIL' && $this.params.isExctTest === '00'){
                        $this.alert('연동 테스트가 완료되지 않았습니다.');
                        return false;
                    }
                    if($this.chnlSetInfo.chnlKindCd === 'TGRM' && $this.params.isExctTest === '00'){
                        $this.alert("연동 테스트가 완료되지 않았습니다.");
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
        // 공통버튼(초기화, 조회, 저장, 삭제) 컴포넌트 핸들러
        onSetButtonClick(div) {
            switch (div) {
                case 'init':
                    this.refreshPage();
                    break;
                case 'select':
                    // this.refreshPage();
                    this.selectBtnSrch();
                    break;
                case 'save':
                    this.updateChnlSetInfo();
                    break;
                default:
                    alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
        },
    },
    updated: function () {
    },
    computed: {
    },
    watch: {
},
    mounted: function () {
        const $this = this;
        $this.init();
    }
}
</script>
<style>
/* 채널 설정 탭 */
#tabs .tab-contents-chnl {
    display: block;
    border: 1px solid #d1d1dd;
    border-radius: 3px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    background-color: #ffffff;
    color: #333333;
    padding: 10px 10px;
    /* min-height: calc(100vh - 200px); */
    min-height: 505px;
}
#tabs .tab-contents-chnl .radio-box input[type="radio"] {
    display: inline-block;
    width: auto;
    height: auto;
    vertical-align: middle;
}
/* 메일, 텔레그램 자체기능 설정 탭 */
#tabs .tab-contents-itself {
    display: block;
    border: 1px solid #d1d1dd;
    border-radius: 3px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    background-color: #ffffff;
    color: #333333;
    padding: 15px 10px;
    /* min-height: calc(100vh - 200px); */
    min-height: 330px;
}
#tabs .tab-contents-itself .radio-box input[type="radio"] {
    display: inline-block;
    width: auto;
    height: auto;
    vertical-align: middle;
}

</style>

