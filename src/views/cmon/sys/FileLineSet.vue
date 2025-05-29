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
                        <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="true" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>
        <!-- 자체연계 -->
        <div class="section section2 w-100" v-show="params.fileLinkYn=='N'">
            <div class="section-wrap">
                <h2 class="ib m-b-10">자체파일연계</h2>       
                <div class="section-part part1 m-b-5">             
                    <div class="w-100 ib">
                        <span class="wd-90 essn">처리구분</span>
                        <!-- <input :value="params.fileLinkYn == 'Y'? '외부파일연계': '자체파일연계'" disabled> -->
                        <!-- :disabled="params.disableProcDiv"> -->
                        <select class="wd-180" ref="fileLinkYn" v-model="params.fileLinkYn" :disabled="true"> 
                            <option value=""></option>
                            <option value="N">자체연계</option>
                            <option value="Y">외부연계</option>
                        </select>
                    </div>
                    <div class="section-part part2 b w-100">
                        <div class="w-100 text-box">
                            <span class="wd-90">비고</span>
                            <textarea class="c-wd-90 h-540"  v-model="fileLinkDetlInfo.baseRmrk" cols="30" rows="10" ></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 외부연계 -->
        <div>
        <!-- 파일목록 -->
        <div class="section sectionL w-35" v-show="params.fileLinkYn=='Y'">
            <div class="section-wrap p-t-15">
                <div class="section-part m-0 p-0">
                    <h2 class="ib m-b-10">파일목록</h2>       
                    <!-- 그리드 -->           
                    <div class="w-50 ib p-l-15">
                        <span class="wd-55 essn">처리구분</span>
                        <!-- <input :value="params.fileLinkYn == 'Y'? '외부파일연계': '자체파일연계'" disabled> -->
                        <select ref="fileLinkYn" style="height:29px;" v-model="params.fileLinkYn" :disabled="true">
                            <option value=""></option>
                            <option value="N">자체연계</option>
                            <option value="Y">외부연계</option>
                        </select>
                    </div>
                </div>
                <div :id="etcWrapperId">
                    <table :id="etcGridId"></table>
                    <div :id="etcPagerId"></div>
                    <Grid ref="fileLineSetGrid" :dataParams="params" :paging="true" :sortable="true"></Grid>
                </div>
            </div>
        </div>
        <!-- 파일연동상세 -->
        <div class="section sectionR w-65" v-if="params.fileLinkYn == 'Y'">
            <div class="section-wrap ">
                <div class="section-part part1  m-b-10"  v-if="params.fileLinkYn != ''">
                    <!-- <h2 class="ib m-b-5">{{params.fileLinkYn == "Y" ? '외부기능상세': '자체기능상세'}}</h2>-->
                    <h2 class="ib m-b-5">외부기능상세</h2>
                    <!--상단 input-->
                    <div class="w-100 b" v-if="params.fileLinkYn =='Y' ">
                        <div class="w-25 p-r-10 ib">
                            <span class="wd-80 essn">파일접근방식</span>
                            <select class="c-wd-80" v-model="fileLinkDetlInfo.fileAccsMethCd" @change="changeFileAccsMethCd()">
                                <option value=""></option>
                                <option v-for="item in code.fileAccsMethCdList" :key="item.cdVal" :value="item.cdVal">{{item.cdNm}}</option>
                            </select>
                        </div>
                        <div class="w-25 p-r-10 ib">
                            <span class="wd-80 essn">파일연계명</span>
                            <input type="text" class="c-wd-80" v-model="fileLinkDetlInfo.fileLinkNm">
                        </div>
                        <div class="w-25 p-r-10 ib">
                            <span class="wd-80 essn">파일연계유형</span>
                            <select class="c-wd-80" v-model="fileLinkDetlInfo.fileLinkTypeCd">
                                <option value=""></option>
                                <option v-for="item in code.fileLinkTypeCdList" :key="item.cdVal" :value="item.cdVal">{{item.cdNm}}</option>
                            </select>
                        </div>
                    </div>
                </div>
                <!--하단-->
                <!-- 자체기능 사용 -->
                <!-- <div v-if=" params.fileLinkYn == 'N'">
                    <div class="section-part part2 w-100">
                        <div class="w-100 text-box">
                            <span class="wd-80">비고</span>
                            <textarea class="c-wd-80 h-540"  v-model="fileLinkDetlInfo.baseRmrk" cols="30" rows="10" ></textarea>
                        </div>
                    </div>
                </div> -->
                <!-- 외부 연동기능 사용 -->
                <div class="section-part part2 b w-100 m-t-5" v-if="params.fileLinkYn == 'Y' && fileLinkDetlInfo.fileAccsMethCd !==''">
                    <div class="w-100">
                        <h2 class="ib m-b-5">외부연계설정</h2>
                        <div id="tabs" class="w-100">
                            <ul class="tab-menu">
                                <!-- 탭 -->
                                <li class="pointer" v-for="(item, index) in code.fileAccsMethCdList" :key="index" :class="{ active: fileLinkDetlInfo.fileAccsMethCd === item.cdVal }" @click="changeTab(item.cdVal)">
                                    <a>{{ item.cdNm }}</a>
                                </li>
                                <!-- 테스트버튼,문구 -->
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
                            <div class="tab-contents-file">
                                <!-- 파일 접근 방식 DB(SQL)일 때-->
                                <div v-show="fileLinkDetlInfo.fileAccsMethCd == '10'">
                                    <div class="inner-tab-content con1">
                                        <div class="inner-tab-content con1">
                                            <div class="w-50">
                                                <span class="wd-70 essn">DB연결ID</span>
                                                <select class="c-wd-70" name="dbConnId" v-model="fileLinkDetlInfo.dbConnId"  @blur="chckDBVald">
                                                    <option value=""></option>
                                                    <option v-for="el in code.dbConnIdList" :key="el.colId" :value="el.colId">{{el.colId + ' | ' +el.colNm}}</option>
                                                </select>
                                            </div>
                                            <div class="w-100 text-box">
                                                <span class="wd-70 essn">연계처리SQL</span>
                                                <textarea class="c-wd-70 h-300" name="linkProcSql"  cols="30" rows="10" v-model="fileLinkDetlInfo.linkProcSql"  @blur="chckDBVald"></textarea>
                                            </div>
                                            <div class="w-100 text-box">
                                                <span class="wd-70">연동설명</span>
                                                <textarea spellcheck="false" class="c-wd-70" style="height:200px; max-height:200px;" name="dbRmrk"  cols="30" rows="10" v-model="fileLinkDetlInfo.dbRmrk"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--파일 접근 방식 Restful일 때-->
                                <div v-show="fileLinkDetlInfo.fileAccsMethCd == '20'">
                                    <div class="inner-tab-content con2">
                                        <div class="inner-tab-content con2">
                                            <div class="w-100">
                                                <span class="wd-70 essn">요청URL</span>
                                                <input class="c-wd-70" type="text" v-model="fileLinkDetlInfo.restfulFileProcModuNm">
                                            </div>
                                            <div class="w-50-mr2 ib">
                                                <span class="wd-70">인증URL</span>
                                                <input class="c-wd-70" type="text" v-model="fileLinkDetlInfo.authUrl">
                                            </div>
                                            <div class="w-50-ml2 ib">
                                                <span class="wd-70">인증키</span>
                                                <input class="c-wd-70" type="text" v-model="fileLinkDetlInfo.authKey">
                                            </div>
                                            <div class="w-50-mr2 ib">
                                                <span class="wd-70">인증값</span>
                                                <input class="c-wd-70" type="text" v-model="fileLinkDetlInfo.authVal">
                                            </div>
                                            <div class="w-50-ml2 ib">
                                                <span class="wd-70 essn">객체유형</span>
                                                <select class="c-wd-70" name="parmObjcTypeCd" v-model="fileLinkDetlInfo.restfulParmObjcTypeCd">
                                                    <option value=""></option>
                                                    <option v-for="item in code.parmObjcTypeCdList" :key="item.cdVal" :value="item.cdVal">{{ item.cdNm }} </option>
                                                </select>
                                            </div>
                                            <!-- Key -->
                                            <div class="w-50-mr2 ib m-b-0">
                                                <div v-for="(el, i) in restfulKeyValList" :key="i">
                                                    <span class="wd-70">{{ 'Key ' + (i+1) }}</span>
                                                    <input class="c-wd-70" type="text" v-model="restfulKeyValList[i].linkKey" />
                                                </div>
                                            </div>
                                            <!-- Value -->
                                            <div class="w-50-ml2 ib m-b-0">
                                                <div v-for="(el, i) in restfulKeyValList" :key="i">
                                                    <span>{{ 'Value ' + (i+1)  }}</span>
                                                    <input type="text" v-model="restfulKeyValList[i].linkVal" />
                                                </div>
                                            </div>
                                            <div class="w-100 text-box">
                                                <span class="wd-70">연동설명</span>
                                                <textarea spellcheck="false" class=" c-wd-70"  style="height:85px; max-height:85px;" cols="30" rows="10" v-model="fileLinkDetlInfo.restfulRmrk"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- 파일 접근 방식 SHELL일 때-->
                                <div v-show="fileLinkDetlInfo.fileAccsMethCd == '30'">
                                    <div class="inner-tab-content con3">
                                        <div class="w-100 m-b-0">
                                            <span class="wd-70 essn">Shell명</span>
                                            <input class="c-wd-70" type="text" v-model="fileLinkDetlInfo.shellFileProcModuNm">
                                        </div>
                                        <!-- Value -->
                                        <div class="w-50-mr2 ib m-b-0" >
                                            <div v-for="(el, i) in shellValList" :key="i">
                                                <span class="wd-70" v-if="i < 5">{{ 'Value ' + (i+1) }}</span>
                                                <input class="c-wd-70" v-if="i < 5" type="text" v-model="shellValList[i].linkVal" />
                                            </div>
                                        </div>
                                        <div class="w-50-ml2 ib m-b-0">
                                            <div v-for="(el, i) in shellValList" :key="i">
                                                <span  class="wd-70" v-if="i >= 5">{{ 'Value ' + (i+1) }}</span>
                                                <input class="c-wd-70" v-if="i >= 5" type="text" v-model="shellValList[i].linkVal" />
                                            </div>
                                        </div>
                                        <div class="w-100 text-box">
                                            <span>연동설명</span>
                                            <textarea spellcheck="false" style="height:330px; max-height:330px;"  name="shellRmrk" id="shellRmrk" cols="30" rows="10" v-model="fileLinkDetlInfo.shellRmrk"></textarea>
                                        </div>
                                    </div>
                                </div>
                                <!-- 파일 접근 방식 CLASS일 때-->
                                <div v-show="fileLinkDetlInfo.fileAccsMethCd == '40'">
                                    <div class="inner-tab-content con4">
                                        <div class="w-50-mr2 ib">
                                            <span class="wd-70 essn">Class명</span>
                                            <input class="c-wd-70" type="text" v-model="fileLinkDetlInfo.classFileProcModuNm">
                                        </div>
                                        <div class="w-50-ml2 ib">
                                            <span class="wd-70 essn">객체유형</span>
                                            <select class="c-wd-70" v-model="fileLinkDetlInfo.classParmObjcTypeCd">
                                                <option value=""></option>
                                                <option v-for="item in code.parmObjcTypeCdList" :key="item.cdVal" :value="item.cdVal">
                                                    {{item.cdNm}}
                                                </option>
                                            </select>
                                        </div>
                                        <!-- Key -->
                                        <div class="w-50-mr2 ib m-b-0">
                                            <div v-for="(el, i) in classKeyValList" :key="i">
                                                <span class="wd-70">{{ 'Key ' + (i+1) }}</span>
                                                <input class="c-wd-70" type="text" v-model="classKeyValList[i].linkKey" />
                                            </div>
                                        </div>
                                        <!-- Val -->
                                        <div class="w-50-ml2 ib m-b-0">
                                            <div v-for="(el, i) in classKeyValList" :key="i">
                                                <span class="wd-70">{{ 'Value ' + (i+1) }}</span>
                                                <input class="c-wd-70" type="text" v-model="classKeyValList[i].linkVal" />
                                            </div>
                                        </div>
                                        <div class="w-100 text-box">
                                            <span>연동설명</span>
                                            <textarea spellcheck="false" style="height:155px; max-height:155px;" name="classRmrk" cols="30" rows="10" v-model="fileLinkDetlInfo.classRmrk"></textarea>
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
import { reactive, inject } from 'vue';
import { ValdUtil }         from '@/utils/ValdUtil';
import { SessionUtil }      from '@/utils/SessionUtil';
import { CmonUtil }         from '@/utils/CmonUtil';
import Grid                 from '@/components/grid/Grid.vue';
import SetButton            from '@/components/SetButton.vue';

export default {
    components: {
        Grid
       ,SetButton
    }
   ,setup() {
        let code = reactive({
            fileAccsMethCdList : [],
            parmObjcTypeCdList : [],
            fileLinkTypeCdList : [],
            dbConnIdList       : [],
        });
        const getCmonCdList = inject('getCmonCdList');
        getCmonCdList('FILE_ACCS_METH_CD', code.fileAccsMethCdList, 'N', null); //파일접근방식
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
    data() {
        return {
            params: {
                useEnvNo               : '',     // 사용환경번호
                fileLinkYn             : '',     // 사용환경설정 파일연계사용 여부
                isExctTest             : '00',   // 검증테스트 여부 // 00: 검증안함 / 10:검증성공 / 20:검증실패 // 30:미지원
                linkKindCd             : 'FILE', // 연계종류코드
                chckDBValdDiv          : false,  // DB변경 여부 체크
                crud                   : 'C',
                // disableProcDiv         : false   // 사용환경설정 파일연계 설정 사용 여부 
            },
            fileLinkDetlInfo: {
                fileLinkSeq            : '',     // 파일연계순번
                fileAccsMethCd         : '',     // 파일접근방식코드
                fileLinkTypeCd         : '',     // 파일연계유형코드
                fileLinkNm             : '',     // 파일연계명
                dbConnId               : '',     // DB연결ID        
                linkProcSql            : '',     // 연계처리SQL       
                authUrl                : '',     // 인증URL          
                authKey                : '',     // 인증키            
                authVal                : '',     // 인증값            
                parmObjcTypeCd         : '',     // 전달객체유형   
                fileProcModuNm         : '',     // 파일처리모듈명      
                rmrk                   : '',     // 비고

                baseRmrk               : '',     // 자체연계 비고

                dbRmrk                 : '',     // DB(SQL) 비고 
                
                restfulFileProcModuNm  : '',     // Restful 파일처리모듈명 // 요청URL임
                restfulParmObjcTypeCd  : '',     // Restful 전달객체유형 
                restfulRmrk            : '',     // Restful 비고 

                shellFileProcModuNm    : '',     // Shell 파일처리모듈명 
                shellRmrk              : '',     // Shell 비고

                classFileProcModuNm    : '',     // Class 파일처리모듈명 
                classParmObjcTypeCd    : '',     // Class 전달객체유형 
                classRmrk              : '',     // Class 비고                
            },
            chckedFileLineSetInfo : {
                chckedLinkDbProcSql    : '',     // 연동 테스트 후 linkProcSql
                chckedLinkDbConnId     : ''      // 연동 테스트 후 dbConnId
            },
            restfulKeyValList          : [],     // Restful KEY,VALUE 리스트 
            shellValList               : [],     // Shell   VALUE 리스트 
            classKeyValList            : [],     // Class   KEY,VALUE 리스트
        }
    },
    methods: {
        init() {
            let $this = this;
            $this.reset();
            $this.searchUseEnvNo();  // 사용 환경 번호, 외부연계사용여부 조회
            $this.CmonUtil.setFocus($this.$refs.fileLinkYn);
            $this.changeTab('10')
        }
       ,initData(){
            const $this = this;
            this.params.userId      = SessionUtil.getUserId();
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
        }
        // 그리드 생성
       ,initGrid() {
            const $this = this;
            let gridObj = {
                url: '/cmon/sys/fileLineSet/selectListFileLineSetInfo.hb',
                colModels: [
                    { name: 'fileLinkSeq'      , label: '순번'          , width: 5  , align: 'center' }
                   ,{ name: 'fileLinkNm'       , label: '파일명'        , width: 15  , align: 'center' }
                   ,{ name: 'fileAccsMethNm'   , label: '파일접근방식'  , width: 10  , align: 'center' }
                   ,{ name: 'fileLinkTypeNm'   , label: '파일연계유형'  , width: 10  , align: 'center' }
                   ,{ name: 'fileLinkTypeCd'   , label: '파일연계유형'  , hidden:true }
                   ,{ name: 'fileAccsMethCd'   , label: '파일접근방식'  , hidden:true }
                ],
                options: {
                    height:598
                   ,onSelectRow(rowid) {
                        $this.fileLinkDetlInfo.fileLinkSeq = $(this).jqGrid("getRowData",rowid).fileLinkSeq;
                        $this.searchFileLinkDetlInfo();
                    }
                }
            };
            $this.$nextTick(function(){
                $this.$refs.fileLineSetGrid.init(gridObj);
                $this.searchListFile();
            })
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
                url: '/cmon/sys/fileLineSet/selectListFileLineSetInfo.hb',
                colModel: $this.params.colModel,
                pager: '#' + this.etcPagerId,
                height: 500,
                onPaging: function (data) {
                    GridUtil.onPagingCommon(data, $(this), function (response) {
                        $this.params.rowCount     = response.rowCount;
                        $this.params.currentPage  = response.currentPage;
                        $this.params.currentIndex = response.currentIndex;
                        $this.params.totalCount   = response.totalCount;
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
                    if (response.rtnCd == '0000') {
                        if (response.rtnData.result.length == 0) {
                            $this.alert("조회 내용이 없습니다.");
                        }
                    } else {
                        $this.alert(res.data.rtnMsg);
                    }
                }
            }).trigger("reloadGrid");
        },
        // 사용 환경 번호 조회
        searchUseEnvNo() {
            let $this  = this;
            let params = {};
            $this.params.useEnvNo      = ''; 
            $this.params.fileLinkYn    = '';
            $this.reset();
            $this.doPost('/cmon/sys/fileLineSet/selectUseEnvNo.hb', params, false).then(function (res) {
                if(res.data.rtnCd == '0000'){
                    $this.params.useEnvNo      = res.data.rtnData.result.useEnvNo; 
                    $this.params.fileLinkYn    = res.data.rtnData.result.fileLinkYn;
                    
                    if(res.data.rtnData.result.fileLinkYn ==='Y'){
                        $this.initGrid();
                    } else if(res.data.rtnData.result.fileLinkYn ==='N') {
                        $this.searchFileLinkInfo();
                    }
                }else{
                    $this.alert(res.data.rtnMsg);
                }
            });
            // CmonUtil.processLoading(false);
        },
        //파일목록 조회
        searchListFile() {
            const $this = this;
            $this.$refs.fileLineSetGrid.clearGridData();
            $this.$refs.fileLineSetGrid.selectList(); 
            
            CmonUtil.processLoading(false);
        },
        //파일연동 상세정보 조회
        searchFileLinkDetlInfo() {
            let $this = this; 
            let detlParam = {
                'useEnvNo'       : $this.params.useEnvNo
               ,'fileLinkYn'     : $this.params.fileLinkYn
               ,'fileLinkSeq'    : $this.fileLinkDetlInfo.fileLinkSeq
               ,'fileAccsMethCd' : $this.fileLinkDetlInfo.fileAccsMethCd 
               ,'linkKindCd'     : $this.fileLinkDetlInfo.linkKindCd 
            }   
            $this.reset();
            $this.doPost('/cmon/sys/fileLineSet/selectFileLinkDetlInfo.hb', detlParam).then(function (res) {
                CmonUtil.processLoading(false);
                if (res.data.rtnCd === '0000') {
                    let result     = res.data.rtnData.result;
                    let keyValList = result.keyValList;  

                    if (result.length != 0) {
                        $this.fileLinkDetlInfo.fileAccsMethCd            = result.fileLinkDetlInfo.fileAccsMethCd;
                        $this.fileLinkDetlInfo                           = result.fileLinkDetlInfo;
                        $this.params.crud                                = 'U';

                        //자체연계
                        if(ValdUtil.isNull(result.fileLinkDetlInfo.fileAccsMethCd)){
                            $this.fileLinkDetlInfo.baseRmrk              = result.fileLinkDetlInfo.rmrk;
                        // DB(SQL)
                        } else if(result.fileLinkDetlInfo.fileAccsMethCd === '10'){
                            $this.fileLinkDetlInfo.dbRmrk                = result.fileLinkDetlInfo.rmrk;
                        //restful
                        } else if(result.fileLinkDetlInfo.fileAccsMethCd === '20'){
                            $this.fileLinkDetlInfo.restfulFileProcModuNm = result.fileLinkDetlInfo.fileProcModuNm;
                            $this.fileLinkDetlInfo.restfulParmObjcTypeCd = result.fileLinkDetlInfo.parmObjcTypeCd;
                            $this.fileLinkDetlInfo.restfulRmrk           = result.fileLinkDetlInfo.rmrk;

                            if(keyValList.length != 0){
                                keyValList.forEach(_el => {
                                    $this.restfulKeyValList.forEach(el=>{
                                        if(_el.idenSeq == el.idenSeq){
                                            el.linkKey = _el.linkKey;
                                            el.linkVal = _el.linkVal;
                                        }
                                    });
                                });
                            }
                        // shell
                        } else if(result.fileLinkDetlInfo.fileAccsMethCd === '30'){
                            $this.fileLinkDetlInfo.shellFileProcModuNm   = result.fileLinkDetlInfo.fileProcModuNm;
                            $this.fileLinkDetlInfo.shellRmrk             = result.fileLinkDetlInfo.rmrk;

                            if(keyValList.length != 0){
                                keyValList.forEach(_el => {
                                    $this.shellValList.forEach(el=>{
                                        if(_el.idenSeq == el.idenSeq){
                                            el.linkKey = _el.linkKey;
                                            el.linkVal = _el.linkVal;
                                        }
                                    });
                                });
                            }
                        // class
                        } else if(result.fileLinkDetlInfo.fileAccsMethCd === '40'){
                            $this.fileLinkDetlInfo.classFileProcModuNm   = result.fileLinkDetlInfo.fileProcModuNm;
                            $this.fileLinkDetlInfo.classParmObjcTypeCd   = result.fileLinkDetlInfo.parmObjcTypeCd;
                            $this.fileLinkDetlInfo.classRmrk             = result.fileLinkDetlInfo.rmrk;

                            if(keyValList.length != 0){
                                keyValList.forEach(_el => {
                                    $this.classKeyValList.forEach(el=>{
                                        if(_el.idenSeq == el.idenSeq){
                                            el.linkKey = _el.linkKey;
                                            el.linkVal = _el.linkVal;
                                        }
                                    });
                                });
                            }
                        }
                    }
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
        },
        //파일연동 자체연계 조회
        searchFileLinkInfo() {
            let $this = this; 
            let detlParam = {
                'useEnvNo'       : $this.params.useEnvNo
            }   
            // $this.reset();
            $this.doPost('/cmon/sys/fileLineSet/selectFileLinkInfo.hb', detlParam).then(function (res) {
                // CmonUtil.processLoading(false);
                if (res.data.rtnCd === '0000') {
                    if(ValdUtil.isNotNull(res.data.rtnData.result)){
                        $this.fileLinkDetlInfo.baseRmrk    =  res.data.rtnData.result.rmrk;
                        $this.params.crud = 'U';
                    }
                    
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
        },

        // DB연결ID, SQL 변경 여부 체크
        chckDBVald: function () {
            let $this = this;
            if (($this.params.isExctTest === '10') && ($this.chckedFileLineSetInfo.chckedLinkDbConnId !== $this.fileLinkDetlInfo.dbConnId)) {
                $this.params.chckDBValdDiv = true;
                $this.params.isExctTest    = '00';
            } else if (($this.params.isExctTest === '10') && ($this.chckedFileLineSetInfo.chckedLinkDbProcSql !== $this.fileLinkDetlInfo.linkProcSql)) {
                $this.params.chckDBValdDiv = true;
                $this.params.isExctTest    = '00';
            } else {
                $this.params.chckDBValdDiv = false;
            }
        },
        // db 연결, sql 검증테스트
        connVrfyDbSql: function () {
            let $this = this;
            $this.params.isExctTest = '00';

            if($this.isValid('test')){
                // DB(SQL)
                if($this.fileLinkDetlInfo.fileAccsMethCd === '10'){
                    let testParam = {
                        linkProcSql : $this.fileLinkDetlInfo.linkProcSql,
                        dbConnId    : $this.fileLinkDetlInfo.dbConnId
                    }
                    $this.doPost('/cmon/sys/fileLineSet/connVrfyDbSql.hb', testParam).then(function (response) {
                        if (response.data.rtnCd === '0000') {                    
                            //SQL문 검증 성공
                            if(response.data.rtnData.sqlMsg === 'Y'){
                                $this.params.isExctTest    = '10';
                                $this.params.chckDBValdDiv = false;
                                
                                // 테스트 성공 한 DB_CONN_ID 와 LINK_PROC_SQL을 저장
                                $this.chckedFileLineSetInfo.chckedLinkDbProcSql = testParam.linkProcSql;
                                $this.chckedFileLineSetInfo.chckedLinkDbConnId  = testParam.dbConnId;

                                $this.alert("SQL문이 정상입니다.");
                            
                            // // SQL문 검증 실패
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
                } else if($this.fileLinkDetlInfo.fileAccsMethCd === '20'){
                    let testParam = {};
                    $this.params.isExctTest = '30';
                    $this.alert("현재 Restful 연동 테스트는 지원하지 않으며, 저장 기능만 이용할 수 있습니다.");
                // Shell
                } else if($this.fileLinkDetlInfo.fileAccsMethCd === '30'){
                    let testParam = {}
                    $this.params.isExctTest = '30';
                    $this.alert("현재 Shell 연동 테스트는 지원하지 않으며, 저장 기능만 이용할 수 있습니다.");
                // Class
                } else if($this.fileLinkDetlInfo.fileAccsMethCd === '40'){
                    let testParam = {}
                    $this.params.isExctTest = '30';
                    $this.alert("현재 Class 연동 테스트는 지원하지 않으며, 저장 기능만 이용할 수 있습니다.");
                }
            }
        }
        //파일연계저장
       ,saveFileLine() {
            const $this = this;
            if($this.isValid('save')){
                // let params = $.extend($this.params, $this.fileLinkDetlInfo);
                let fileAccsCd    = $this.fileLinkDetlInfo.fileAccsMethCd;
                let sendParam     = {};
                let baseParam     = {
                        useEnvNo          : $this.params.useEnvNo,
                        fileLinkYn        : $this.params.fileLinkYn,
                        linkKindCd        : $this.params.linkKindCd,
                        crud              : $this.params.crud,
                        fileLinkSeq       : $this.fileLinkDetlInfo.fileLinkSeq,
                        fileAccsMethCd    : $this.fileLinkDetlInfo.fileAccsMethCd,
                        fileLinkTypeCd    : $this.fileLinkDetlInfo.fileLinkTypeCd,
                        fileLinkNm        : $this.fileLinkDetlInfo.fileLinkNm,
                        
                }                
                //자체연계
                if( fileAccsCd === '' || ValdUtil.isNull(fileAccsCd)){
                    let paramSpec = {
                        rmrk : $this.fileLinkDetlInfo.baseRmrk,
                    }
                    sendParam = Object.assign({},baseParam, paramSpec);
                // DB(SQL)
                } else if( fileAccsCd === '10'){
                    let paramSpec = {
                            dbConnId       : $this.fileLinkDetlInfo.dbConnId,
                            linkProcSql    : $this.fileLinkDetlInfo.linkProcSql,
                            rmrk           : $this.fileLinkDetlInfo.dbRmrk
                        };

                    sendParam = Object.assign({}, baseParam, paramSpec);

                } else if( fileAccsCd === '20'){
                    let paramSpec = {
                            authUrl        : $this.fileLinkDetlInfo.authUrl,
                            authKey        : $this.fileLinkDetlInfo.authKey,
                            authVal        : $this.fileLinkDetlInfo.authVal,
                            rmrk           : $this.fileLinkDetlInfo.restfulRmrk,
                            fileProcModuNm : $this.fileLinkDetlInfo.restfulFileProcModuNm,
                            parmObjcTypeCd : $this.fileLinkDetlInfo.restfulParmObjcTypeCd,
                        };   
                    let assignParam = Object.assign({}, baseParam, paramSpec);
                    sendParam       = Object.assign({},assignParam, {keyValList : $this.restfulKeyValList});
                    
                } else if ( fileAccsCd === '30'){
                    let keyValList = $this.shellValList;
                    let paramSpec = {
                            fileProcModuNm : $this.fileLinkDetlInfo.shellFileProcModuNm,
                            rmrk           : $this.fileLinkDetlInfo.shellRmrk
                        };
                    let assignParam = Object.assign({}, baseParam, paramSpec);
                    sendParam       = Object.assign({},assignParam, {keyValList : $this.shellValList});

                } else if ( fileAccsCd === '40'){
                    let keyList = $this.classKeyValList;
                    let paramSpec = {
                            fileProcModuNm : $this.fileLinkDetlInfo.classFileProcModuNm,
                            parmObjcTypeCd : $this.fileLinkDetlInfo.classParmObjcTypeCd,
                            rmrk           : $this.fileLinkDetlInfo.classRmrk
                        };                  
                    let assignParam = Object.assign({}, baseParam, paramSpec);
                    sendParam       = Object.assign({},assignParam, {keyValList : $this.classKeyValList});
                }
                $this.confirm({
                    content  : '저장하시겠습니까?',
                    callback : {
                        yes() {
                            $this.doPost('/cmon/sys/fileLineSet/saveFileLine.hb', sendParam, false).then(function (res) {
                                if (res.data.rtnCd === '0000') {
                                    $this.alert("저장되었습니다").then((result) =>{
                                        if( result.isConfirmed ){
                                            $this.init();
                                            if($this.params.fileLinkYn === 'Y'){
                                                $this.searchListFile();
                                            }
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
        //파일연계삭제
        deleteFileLine(){
            const $this = this;
            if($this.isValid('delete')){
                $this.confirm({
                    content:'삭제하시겠습니까?',
                    callback:{
                        yes(){
                            let params = {
                                useEnvNo    : $this.params.useEnvNo,
                                fileLinkSeq : $this.fileLinkDetlInfo.fileLinkSeq
                            }
                            $this.doPost('/cmon/sys/fileLineSet/deleteFileLineSetInfo.hb', params).then(function (res) {
                                if (res.data.rtnCd === '0000') {
                                    $this.alert("삭제되었습니다.").then((result) => {
                                        if( result.isConfirmed ){
                                            $this.init();
                                            if($this.params.fileLinkYn === 'Y'){
                                                $this.searchListFile();
                                            }
                                        }
                                    });
                                } else {
                                    $this.alert(res.data.rtnMsg);
                                    $this.init();
                                }
                            });
                        }
                    }
                });
            }
        },
        //저장 시 유효성 검증
        isValid(div){
            const $this = this;
             if(ValdUtil.isNull($this.params.fileLinkYn)){
                $this.alert('처리구분은 필수값입니다.');
                return false;
            }            
            if(div == 'test'){
                if($this.params.fileLinkYn == 'N'){
                }else{
                    if(!$this.isExctValid($this.fileLinkDetlInfo.fileAccsMethCd,'파일접근방식','rqir')
                    || !$this.isExctValid($this.fileLinkDetlInfo.fileLinkNm ,'파일연계명','rqir')
                    || !$this.isExctValid($this.fileLinkDetlInfo.fileLinkTypeCd,'파일연계유형','rqir')){
                        return false;
                    }
                    if($this.fileLinkDetlInfo.fileAccsMethCd == '10'){
                        if(!$this.isExctValid($this.fileLinkDetlInfo.dbConnId,'DB연결ID','rqir')
                        || !$this.isExctValid($this.fileLinkDetlInfo.linkProcSql,'연계처리SQL','rqir')){
                            return false;
                        }
                    }
                    if($this.fileLinkDetlInfo.fileAccsMethCd == '20'){
                        if(!$this.isExctValid($this.fileLinkDetlInfo.restfulFileProcModuNm,'요청URL','rqir')
                        || !$this.isExctValid($this.fileLinkDetlInfo.restfulParmObjcTypeCd,'객체유형','rqir')){
                            return false;
                        }
                    }
                    if($this.fileLinkDetlInfo.fileAccsMethCd == '30'){
                        if(!$this.isExctValid($this.fileLinkDetlInfo.shellFileProcModuNm,'Shell명','rqir')){
                            return false;
                        }
                    }
                    if($this.fileLinkDetlInfo.fileAccsMethCd == '40'){
                        if(!$this.isExctValid($this.fileLinkDetlInfo.classFileProcModuNm,'Class명','rqir')
                        || !$this.isExctValid($this.fileLinkDetlInfo.classParmObjcTypeCd,'객체유형','rqir')){
                            return false;
                        }
                    }
                }
                return true;
            } else if(div == 'save'){
                if($this.params.fileLinkYn == 'N'){
                }else{
                    if(!$this.isExctValid($this.fileLinkDetlInfo.fileAccsMethCd,'파일접근방식','rqir')
                    || !$this.isExctValid($this.fileLinkDetlInfo.fileLinkNm ,'파일연계명','rqir')
                    || !$this.isExctValid($this.fileLinkDetlInfo.fileLinkTypeCd,'파일연계유형','rqir')){
                        return false;
                    }
                    if($this.fileLinkDetlInfo.fileAccsMethCd == '10'){
                        if(!$this.isExctValid($this.fileLinkDetlInfo.dbConnId,'DB연결ID','rqir')
                        || !$this.isExctValid($this.fileLinkDetlInfo.linkProcSql,'연계처리SQL','rqir')){
                            return false;
                        }
                    }
                    if($this.fileLinkDetlInfo.fileAccsMethCd == '20'){
                        if(!$this.isExctValid($this.fileLinkDetlInfo.restfulFileProcModuNm,'요청URL','rqir')
                        || !$this.isExctValid($this.fileLinkDetlInfo.restfulParmObjcTypeCd,'객체유형','rqir')){
                            return false;
                        }
                    }
                    if($this.fileLinkDetlInfo.fileAccsMethCd == '30'){
                        if(!$this.isExctValid($this.fileLinkDetlInfo.shellFileProcModuNm,'Shell명','rqir')){
                            return false;
                        }
                    }
                    if($this.fileLinkDetlInfo.fileAccsMethCd == '40'){
                        if(!$this.isExctValid($this.fileLinkDetlInfo.classFileProcModuNm,'Class명','rqir')
                        || !$this.isExctValid($this.fileLinkDetlInfo.classParmObjcTypeCd,'객체유형','rqir')){
                            return false;
                        }
                    }
                    if($this.params.chckDBValdDiv === true){
                        $this.alert("작성하신 DB 연결 정보가 변경되었습니다. 다시 연결 테스트를 해주세요.");
                        return false;
                    }
                    if($this.fileLinkDetlInfo.fileAccsMethCd == '10' && $this.params.isExctTest == '00'){
                        $this.alert('연동 테스트가 완료되지 않았습니다.');
                        return false;
                    }
                }
                return true;
            } else if(div == 'delete'){
                if($this.params.fileLinkYn == 'Y'){
                    if(!$this.isExctValid($this.fileLinkDetlInfo.fileLinkSeq,'삭제대상을','선택')){
                        return false;
                    };
                }else if($this.params.fileLinkYn == 'N'){
                    $this.alert('삭제 대상이 존재하지 않습니다.');
                    return false;
                }else if($this.params.fileLinkYn == 'N'){
                    if(!$this.isExctValid($this.fileLinkDetlInfo.fileLinkSeq,'삭제대상을','선택')){
                        return false;
                    };
                }
                return true;
            }
        },
        //파일접근방식 선택
        changeFileAccsMethCd(){
            const $this = this;
            let fileAccsMethCd = $this.fileLinkDetlInfo.fileAccsMethCd;
            // $this.reset();
            $this.fileLinkDetlInfo.fileAccsMethCd = fileAccsMethCd;
        },
        //외부기능상세 탭 선택
        changeTab(item){
            const $this = this;
            // $this.reset();
            $this.fileLinkDetlInfo.fileAccsMethCd = item;
            return false;
        },
        //초기화버튼
        initBtn(){
            const $this = this;
            $this.reset();
            $this.initData();
            if($this.params.fileLinkYn === 'Y'){
                $this.searchListFile();    
            } else {
                $this.searchFileLinkInfo();
            }
        },

        //조회 버튼
        selectBtn(){
            const $this = this;
            if($this.params.fileLinkYn === 'Y'){
            $this.searchListFile();    
            } else {
                $this.searchFileLinkInfo();
            }
        },
        //유효성 검증
        isExctValid(chkVal,stmt,div){
            const $this = this;
            let alertStmt = stmt + (div =='rqir'?'은(는) 필수값입니다.':' 선택하세요.');
            
            if(ValdUtil.isNull(chkVal)){
                $this.alert(alertStmt);
                return false;
            }
            return true;
        }
        //초기화
       ,reset(){
                this.params.isExctTest                          = '00';      // 검증테스트 여부 
                this.params.chckDBValdDiv                       = false;     // DB 연결정보 변경 체크
                this.params.crud                                = 'C';

                this.fileLinkDetlInfo.fileAccsMethCd            = '';        // 탭번호
                this.fileLinkDetlInfo.fileLinkSeq               = '';        // 파일연계순번
                this.fileLinkDetlInfo.fileAccsMethCd            = '';        // 파일_접근_방식_코드
                this.fileLinkDetlInfo.fileLinkTypeCd            = '';        // 파일_연계_유형_코드
                this.fileLinkDetlInfo.fileLinkNm                = '';        // 파일_연계_명
                this.fileLinkDetlInfo.dbConnId                  = '';        // DB_연결_ID        
                this.fileLinkDetlInfo.linkProcSql               = '';        // 연계_처리_SQL          
                this.fileLinkDetlInfo.authUrl                   = '';        // 인증_URL          
                this.fileLinkDetlInfo.authKey                   = '';        // 인증_키            
                this.fileLinkDetlInfo.authVal                   = '';        // 인증_값            
                this.fileLinkDetlInfo.parmObjcTypeCd            = '';        // 전달객체유형   
                this.fileLinkDetlInfo.fileProcModuNm            = '';        // 파일_처리_모듈_명      
                this.fileLinkDetlInfo.rmrk                      = '';        // 비고

                this.fileLinkDetlInfo.baseRmrk                  = '';        // 자체연계 비고
                this.fileLinkDetlInfo.dbRmrk                    = '';        // DB 비고
                
                this.fileLinkDetlInfo.restfulFileProcModuNm     = '';        // Restful 파일처리모듈명 // 요청URL
                this.fileLinkDetlInfo.restfulParmObjcTypeCd     = '';        // Restful 전달객체유형
                this.fileLinkDetlInfo.restfulRmrk               = '';        // Restful 비고
                
                this.fileLinkDetlInfo.shellFileProcModuNm       = '';        // Shell 파일처리모듈명
                this.fileLinkDetlInfo.shellRmrk                 = '';        // Shell 비고
                
                this.fileLinkDetlInfo.classFileProcModuNm       = '';        // Class 파일처리모듈명
                this.fileLinkDetlInfo.classParmObjcTypeCd       = '';        // Class 전달객체유형
                this.fileLinkDetlInfo.classRmrk                 = '';        // Class 비고

                this.restfulKeyValList                          = [];        // Restful KEY,VALUE 리스트 
                this.shellValList                               = [];        // Shell VALUE 리스트 
                this.classKeyValList                            = [];        // Class KEY,VALUE 리스트
                
                this.initData();
        }
        // 공통버튼(초기화, 조회, 저장, 삭제) 컴포넌트 핸들러
       ,onSetButtonClick(div) {
            const $this = this;
            switch (div) {
                case 'init':
                    this.init();
                    // this.initBtn();
                    break;
                case 'select':
                    this.selectBtn();
                    break;
                case 'save':
                    this.saveFileLine();
                    break;
                case 'delete':
                    $this.deleteFileLine();
                    break;
                default:
                    alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
        }
    }
    ,watch:{
        // 'params.fileLinkYn'(newVal, oldVal){
        //     if(newVal == 'Y'){
        //         this.initGrid();
        //     } else if(newVal =='N'){
        //         this.searchFileLinkInfo();
        //     }
        // }
    }
   ,mounted: function () {
        let $this = this;
        $this.init();
    }
}
</script>
<style>
/* 결재선 설정 탭 */
#tabs .tab-contents-file {
    display: block;
    border: 1px solid #d1d1dd;
    border-radius: 3px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    background-color: #ffffff;
    color: #333333;
    padding: 7px 15px 2px 15px;
    
    /* min-height: calc(100vh - 200px); */
    height: 565px;
}

#tabs .tab-contents-file .radio-box input[type="radio"] {
    display: inline-block;
    width: auto;
    height: auto;
    vertical-align: middle;
}

</style>