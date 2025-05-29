<template>
    <div>
        <!-- 검색 조건 -->
        <div class="section section1">
            <div class="search-box">
                <div class="input-box">
                    <div class="w-5 ib">
                        <h1>검색조건</h1>
                    </div>
                    <div class="w-20 ib">
                        <h2 class="wd-50 essn ib">이행셋</h2>
                        <select ref="cset" class="c-wd-50 ib" v-model="srchParam.csetNo" @change="changeCset()">
                            <option value=''></option>
                            <option v-for="el in code.csetList" :key="el.colId" :value="el.colId">{{el.colId + ' | ' +el.colNm}}</option>
                        </select>
                    </div>
                    <div class="w-15">
                        <h2 class="w-30 ib">단위작업구분</h2>
                        <select class="w-35 ib" v-model="srchParam.unitJobTypeCd" @change="changeSrchParams()">
                            <option v-for="item in code.unitJobTypeCd" :key="item.cdVal" :value="item.cdVal" :text="item.cdNm"></option>
                        </select>
                        <select class="w-35 f-r" v-model="srchParam.unitJobDivCd" @click="changeSrchParams()">
                            <option v-for="item in code.unitJobDivCd" :key="item.cdVal" :value="item.cdVal" :text="item.cdNm"></option>
                        </select>
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-40 ib">검색어</h2>
                        <input class="c-wd-40 ib" type="text" v-model="srchParam.srchWord" v-on:keyup.enter="selectListUnitJobMng()">
                    </div>
                    <div class="w-14">
                        <h2 class="w-35 ib">분산처리여부</h2>
                        <div class="w-65 ib">
                            <label v-for="el in code.ynCdList" :key="el">
                                <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="srchParam.blckYn" style="top:2px; left:-3px;" @change="changeSrchParams()">
                                <p :class="el.cdVal === '' ?'pointer ib wd-30' : 'pointer ib wd-20'">{{ el.cdVal === '' ? '전체' : el.cdNm }}</p>
                            </label>
                        </div>
                    </div>
                    <div class="w-10 ib">
                        <div class="input-check">
                            <input type="checkbox" class="ib w-10 p-rl" style="height:auto; top:1px;" v-model="srchParam.notAlocJsetYn" true-value="Y" false-value="N"  @change="changeSrchParams()">
                            <p>미할당 단위작업 조회</p>
                        </div>
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="true" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>
        <!-- 단위작업 목록 -->
        <div class="section sectionL w-40">
            <div class="section-wrap">
                <h2 class="ib">단위작업 목록</h2>
                <div class="t-a-r btn-group-box">
                    <button class="btn-normal ib wd-180 ib" @click="saveAnchorUnitJob()">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                        <p class="ib">전/후처리 단위작업생성</p>
                    </button>
                    <button class="btn-exel-download" v-on:click="downloadExcel()">
                        <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                        <p>다운로드</p>
                    </button>
                </div>
                <div class="wrapper-content">
                    <Grid ref="unitJobGrid" :paging="true" :dataParams="srchParam"></Grid>
                </div>
            </div>
        </div>
        <!-- 탭 -->
        <div class="section sectionR w-60">
            <div class="section-wrap trans"> 
                <div class="section-part part1"> 
                    <div id="tabs" class="w-100" style="height:100% !important">
                        <ul class="tab-menu">
                            <li v-for="(tab, index) in tabs" v-bind:key="index" v-bind:class="{active:currentTabIdx===index}" @click="changeTab(index)" style="cursor: pointer;">
                                <a href="#">{{tab}}</a>
                            </li>
                        </ul>
                        <div class="tab-contents"  style="height:calc(100vh - 223px) !important">
                            <!--탭1 작업정의-->
                            <div v-show="currentTabIdx == 0" style="height:100% !important">
                                <div class="inner-tab-content con1" style="height:100% !important">
                                    <div class="w-100 ib m-b-3">
                                        <h2 class="w-50 ib w-40">단위작업상세정보</h2>     
                                        <div class="w-50 ib m-0 t-a-r f-r" style="height:27px;">        
                                            <div class="ib">
                                                <span class="w-100 guidTextBlue p-rl" style="top:3px;">*현재전환버전 :&nbsp;{{unitJobInfo.convVer == '' ? srchParam.convVer : unitJobInfo.convVer}} </span>
                                            </div>
                                            <button class="btn-normal wd-80 ib p-rl p-l-10 p-r-10" @click="resetUnitJobInfo()" style="height:30px; top:-3px;">
                                                <font-awesome-icon class="ib" :icon="['fas', 'gear']" />
                                                <p class="ib">초기화</p>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="w-50 ib">
                                        <span class="wd-80 essn">단위작업번호</span>
                                        <input class="c-wd-80" type="text" v-model="unitJobInfo.unitJobNo" :disabled="saveDiv=='update' || ValdUtil.isNull(srchParam.csetNo)">
                                    </div>
                                    <div class="w-50 ib">
                                        <span class="wd-80 p-l-10 essn">단위작업명</span>
                                        <input class="c-wd-80" type="text" v-model="unitJobInfo.unitJobNm" :disabled="ValdUtil.isNull(srchParam.csetNo)">
                                    </div>
                                    <div class="w-30 ib">
                                        <span class="wd-80 essn ib">단위작업구분</span>
                                        <div class="c-wd-80 ib m-b-0">
                                            <select class="w-50 ib" v-model="unitJobInfo.unitJobTypeCd" :disabled="ValdUtil.isNull(srchParam.csetNo)">
                                                <option v-for="item in code.unitJobTypeCd" :key="item" :value="item.cdVal" >{{item.cdNm}}</option>
                                            </select>
                                            <select class="w-50 ib m-b-0" v-model="unitJobInfo.unitJobDivCd" :disabled="ValdUtil.isNull(srchParam.csetNo)">
                                                <option v-for="item in code.unitJobDivCd" :key="item" :value="item.cdVal" >{{item.cdNm}}</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="w-70 ib m-b-0">
                                        <div class="w-100 ib m-b-0" v-if="ValdUtil.isNotNull(unitJobInfo.unitJobDivCd) && unitJobInfo.unitJobDivCd !='10'" >
                                            <span class="p-l-10 wd-80 essn">처리모듈명</span>
                                            <input class="c-wd-80" type="text" v-model="unitJobInfo.procModuNm">
                                        </div>
                                        <div class="w-100" v-if="ValdUtil.isNull(unitJobInfo.unitJobDivCd)  || unitJobInfo.unitJobDivCd =='10'" >
                                            <div class="w-100 ib m-b-0">
                                                <span class="wd-70 p-l-10">관련테이블</span>
                                                <div class="c-wd-70 ib m-b-0">
                                                    <div class="input-btn group w-100">
                                                        <input class="w-50" type="text" :value="ValdUtil.isNotNull(unitJobInfo.targTblId) ? unitJobInfo.targSchId+ '.' +unitJobInfo.targTblId:''" disabled>
                                                        <input class="w-50" type="text" v-model="unitJobInfo.targTblNm" disabled>
                                                        <span class="searchClear" style="top: 0 !important;" @click="clearVal('tblInfo')">x</span>
                                                        <button class="post-btn" @click="tblSrchPopup()">
                                                            <img src="@/assets/img/btn_search.png" alt="찾기">
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="w-100 text-box" >
                                        <span class="wd-80">비고</span>
                                        <textarea class="ta-r-n" spellcheck="false" cols="30" rows="10" v-model="unitJobInfo.rmrk" :disabled="ValdUtil.isNull(srchParam.csetNo)"
                                        :class="ValdUtil.isNotNull(unitJobInfo.unitJobDivCd) && unitJobInfo.unitJobDivCd !='10'? 'c-wd-80 h-560' : 'c-wd-80 h-60' "></textarea>
                                    </div>
                                    <div class="w-100" v-if="ValdUtil.isNull(unitJobInfo.unitJobDivCd) || unitJobInfo.unitJobDivCd =='10'" > 
                                        <h2 class="w-50 ib w-40">처리문장</h2>  
                                        <div class="w-100  p-0">
                                            <div class="p-0 w-50 ib f-l" style="height: 462px">
                                                <span class="m-b-5">이전문장</span>
                                                <textarea spellcheck="false" class="w-100 ta-r-n" style="height:453px; max-height:453px" cols="30" rows="10" v-model="unitJobInfo.bfProcSql" :disabled="unitJobInfo.unitJobDivCd !='10'"></textarea>
                                            </div>
                                            <div class="p-0 w-49 f-r ib" style="height: 462px">
                                                <div class="w-100 ">
                                                    <span class="w-10 ib m-0">현재문장</span>
                                                    <div class="w-90 ib m-0 t-a-r f-r p-rl" style="height:27px; top:-12px">        
                                                        <span v-if="unitJobInfo.unitJobDivCd =='10' && sqlVrfyFailYn == 'N'" class="case ib rstrCase4">검증성공</span>
                                                        <span v-if="unitJobInfo.unitJobDivCd =='10' && sqlVrfyFailYn == 'Y'" class="ib rstrCase5">검증실패</span>
                                                        <button class="btn-normal wd-90 ib m-r-5" @click="unitJobSqlChecker()" :disabled="unitJobInfo.unitJobDivCd !='10'">
                                                            <font-awesome-icon class="ib" :icon="['fas', 'gear']" />
                                                            <p class="ib">문장검증</p>
                                                        </button> 
                                                        <button class="wd-120 ib btn-normal " @click="generateUnitJobProc()" :disabled="unitJobInfo.unitJobDivCd !='10'">
                                                            <font-awesome-icon class="ib" :icon="['fas', 'gear']" />
                                                            <p class="ib">처리문장재생성</p>
                                                        </button> 
                                                    </div>
                                                </div>
                                                <textarea spellcheck="false" class="w-100 p-rl ta-r-n" style="top:-5px; height:453px; max-height:453px" cols="30" rows="10" v-model="unitJobInfo.procSql" :disabled="unitJobInfo.unitJobDivCd !='10'"></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--탭2 분산처리분석-->
                            <div v-show="currentTabIdx == 1" style="height:100%">
                                <div class="inner-tab-content p-0" style="height:100%">
                                    <div class="w-100 ib m-b-3">
                                        <h2 class="w-15 ib">분산처리조건</h2>       
                                        <span v-if ="saveDiv=='insert'" class="w-80 t-a-r ib guidTextBlue">※단위작업 저장 후 사용가능합니다</span> 
                                    </div>   
                                    <div class="w-100 m-b-0">
                                        <div class="w-40 ib p-b-0 m-b-0">
                                            <div class="w-100 ">
                                                <div class="w-55 ib">
                                                    <span class="wd-65">분산처리여부</span>
                                                    <div class="radio-box m-0 m-b-3 p-0 c-wd-65 ib p-rl p-t-5" style="top:2px;">
                                                        <label class="p-0 m-r-5">
                                                            <input class="wd-15 ib p-0" type="radio" name="blckYn" id="blckYn" v-model="unitJobInfo.blckYn" value="Y" :disabled="saveDiv=='insert' || unitJobInfo.unitJobDivCd !='10'">
                                                            <span class="m-0 p-0 ib c-wd-20">예</span>
                                                        </label>
                                                        <label class="p-0 w-65 p-l-10 m-r-0">
                                                            <input class="wd-15 ib" type="radio" name="blckYn" id="blckYn" v-model="unitJobInfo.blckYn" value="N" :disabled="saveDiv=='insert' || unitJobInfo.unitJobDivCd !='10'">
                                                            <span class="ib c-wd-20 m-r-0">아니오</span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="w-45 ib">
                                                    <span class="p-l-5 wd-50">분석상태</span>
                                                    <div class="c-wd-50 ib m-b-0">
                                                        <input class="w-100  t-a-c" v-model="unitJobInfo.analStatNm" disabled/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="w-100">
                                                <div class="w-55 ib">
                                                    <span class="wd-65">분산처리건수</span>
                                                    <input class="c-wd-65 t-a-r" type="text" v-model="unitJobInfo.blckCnt" @blur="unitJobInfo.blckCnt = ValdUtil.onlyStayNum(unitJobInfo.blckCnt,1,20000)" :disabled="unitJobInfo.blckYn == 'N' || unitJobInfo.unitJobDivCd !='10'">
                                                </div>
                                                <div class="w-45 ib">
                                                    <span class="wd-50 p-l-5">스레드수</span>
                                                    <input class="c-wd-50 t-a-r" type="text" v-model="unitJobInfo.blckThrds" @blur="unitJobInfo.blckThrds = ValdUtil.onlyStayNum(unitJobInfo.blckThrds,1,10)" :disabled="unitJobInfo.blckYn == 'N' || unitJobInfo.unitJobDivCd !='10'">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="w-60 p-l-10 f-r ib p-b-0 m-b-0">
                                            <div class="w-45 ib  m-b-3">
                                                <span class="wd-65 p-l-5">테이블건수</span>
                                                <input class="c-wd-65 t-a-r" type="text" :value="CmonUtil.addThousandComma(unitJobInfo.tblCnt)" disabled>
                                            </div>
                                            <div class="w-41 ib p-r-5 m-b-0">
                                                <span class="wd-50 p-l-5">대상건수</span>
                                                <input class="c-wd-50 t-a-r" type="text" :value="CmonUtil.addThousandComma(unitJobInfo.objCnt)" disabled>
                                            </div>
                                            <div class="w-14 ib m-b-0">
                                                <button class="btn-normal ib w-100 p-rl p-0 m-0" style="top:-1px" :disabled="unitJobInfo.blckYn == 'N' || unitJobInfo.unitJobDivCd !='10'" @click="unitJobBlckTblInfo()">
                                                    <font-awesome-icon class="ib" :icon="['fas', 'gear']" />
                                                    <p class="m-l-5 ib">가져오기</p>
                                                </button>  
                                            </div>
                                            <div class="w-100">
                                                <span class="wd-65 ib p-l-5">분석처리값</span>
                                                <div class="c-wd-65 ib p-rl">
                                                    <input class="w-100" type="text" v-model="unitJobInfo.blckVals" disabled>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="w-100">
                                        <div class="w-40 ib f-l p-rl" style="top:-1px">
                                            <h2 class="wd-70 ib">기준컬럼</h2>
                                            <div class="c-wd-60 p-l-5 ib t-a-l">
                                                <input type="text" class="w-100" v-model="unitJobInfo.orgnTblId" disabled/>
                                            </div>
                                            <div class="wrapper-content w-100 ib m-r-5">
                                                <Grid ref="stndColGrid" :paging="false" :dataParams="unitJobInfo"></Grid>
                                            </div>
                                        </div>
                                        <div class="w-60 ib f-r p-l-10 p-rl" style="top:-2px">
                                            <h2 class="wd-100 ib p-rl" style="top:6px;">분석내용</h2>
                                            <div class="ib c-wd-100 f-r t-a-r btn-group-box p-rl" style="top:1px;">
                                                <button class="wd-77 btn-normal ib p-rl" style="top:-3px" :disabled="unitJobInfo.blckYn == 'N' || unitJobInfo.unitJobDivCd !='10'" @click="unitJobBlckAnalProc()">
                                                    <font-awesome-icon class="ib" :icon="['fas', 'gear']" />
                                                    <p class="ib">분석</p>
                                                </button> 
                                            </div>
                                            <div class="wrapper-content w-100 p-rl" style="top:-2px">
                                                <Grid ref="analCntnGrid" :paging="false" :dataParams="unitJobInfo"></Grid>
                                            </div>
                                            <h2 class="m-t-0 w-80 ib">구간별상세</h2>
                                            <div class="wrapper-content w-100 ">
                                                <Grid ref="blckBySpecGrid" :paging="false" :dataParams="unitJobInfo"></Grid>
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
        <TblSrch ref="tblSrch" :dataParams="srchParam" @selectTbl="returnTblData"></TblSrch>
    </div>
</template>
<script>
import { ref, inject, reactive } from 'vue'
import { CmonUtil }              from '@/utils/CmonUtil.js'
import { ValdUtil }              from '@/utils/ValdUtil.js'
import { DateUtil }              from '@/utils/DateUtil.js'
import Grid                      from '@/components/grid/Grid.vue'
import SetButton                 from '@/components/SetButton.vue'
import TblSrch                   from '@/views/mng/obj/TblSrch.vue'

export default {
    components: {
        Grid
        ,SetButton
        ,TblSrch
    }
    ,setup() {
        let code = reactive({
            csetList      : [] //이행셋리스트
            ,ynCdList     : [] //YN                
            ,unitJobDivCd : [] //단위작업구분코드
            ,unitJobTypeCd: [] //단위작업유형코드
        });
        
        //이행셋조회        
        const getColIdNmList = inject('getColIdNmList');
        const csetListData = {  'tblId'  :'tdm.tm_cset_base'
                                  ,'colId'  :'cset_no,conv_ver,db_conn_id_fr,db_conn_id_to'
                                  ,'colNm'  :'cset_nm'
                                  ,'where'  : [
                                  ]
                                  ,'orderby' : [
                                    {'orderCol' : 'cset_no'}
                                  ]
        };  
         getColIdNmList(csetListData, code.csetList, 'N', null);
        
        const getCmonCdList = inject('getCmonCdList');
        getCmonCdList('YN'              , code.ynCdList      , 'Y', null);   //YN    
        getCmonCdList('UNIT_JOB_DIV_CD' , code.unitJobDivCd  , 'Y', null);   //단위작업구분코드   
        getCmonCdList('UNIT_JOB_TYPE_CD', code.unitJobTypeCd , 'Y', null);   //단위작업유형코드

        //탭 구분
        let currentTabIdx = ref(0);
        let tabs = ['작업정의', '분산처리분석']

        return {
            currentTabIdx
            ,tabs
            ,code
        }
    }
    ,data() {
		return {                      
            //조회 조건
            srchParam: {
                csetNo:''         //이행셋번호
                ,convVer:''       //전환버전
                ,orgnDbConnId:''  //DB연결ID(Fr)
                ,targDbConnId:''  //DB연결ID(To)
                ,srchWord:''      //검색어
                ,unitJobTypeCd:'' //단위작업유형코드(DELT,SLCT...)
                ,unitJobDivCd:''  //단위작업구분코드(SQL,CLASS...)
                ,blckYn:''        //분산처리여부
                ,notAlocJsetYn:'' //미할당작업셋조회여부
            }
            //단위작업상세정보
            ,unitJobInfo: {
                csetNo:''          //이행셋_번호
                ,unitJobNo:''      //단위작업_번호
                ,unitJobNm:''      //단위작업_명
                ,unitJobDivCd:''   //단위작업구분코드
                ,unitJobTypeCd:''  //단위작업유형코드
                ,convVer:''        //전환버전
                ,rmrk:''           //비고
                ,chngSql:''        //변경된SQL
                ,procSql:''        //처리SQL
                ,bfProcSql:''      //이전처리SQL
                ,sqlVrfyYn:''      //SQL검증여부
                ,targDbConnId:''   //타겟DB연결ID
                ,targSchId:''      //타겟스키마ID
                ,targTblId:''      //타겟테이블ID
                ,orgnDbConnId:''   //원본DB연결ID  
                ,orgnSchId:''      //원본스키마ID
                ,orgnTblId:''      //원본테이블ID                 
                ,tblCnt:0          //테이블건수
                ,objCnt:0          //대상건수
                ,blckYn:''         //분산처리여부
                ,blckCnt:''        //분산처리건수
                ,blckVals:''       //분산처리값들
                ,blckThrds:''      //분산처리스레드수
                ,analStatCd:''     //분석상태코드
                ,tblMappNo:''      //테이블매핑번호
                ,colId:''          
                ,divVal:''
                ,procModuNm:''     //처리모듈명
                ,targTblNm:''      //타겟테이블NM
                ,analStatNm:''     //분석상태코드
            }
            ,saveDiv: 'insert'     //저장구분
            ,unitJobGridRowid:''   //setSelection용도
            ,sqlVrfyFailYn: ''     //문장검증상태
            ,isPgLink : false,     //페이지링크 여부
        }
    }
    ,methods: {
        //초기화
        init() {
            CmonUtil.setFocus(this.$refs.cset);
            this.resetData(this.srchParam);
            this.resetData(this.unitJobInfo);
            this.clearGridList('unitJobGrid');
            this.clearGridList('stndColGrid');
            this.clearGridList('analCntnGrid');
            this.clearGridList('blckBySpecGrid');
            this.initGrid();
            this.initData();
            this.$nextTick(() =>{
                this.initTabGrid();
            });
            this.saveDiv = 'insert';
            this.unitJobGridRowid = '';
            this.sqlVrfyFailYn = '';
        }
        ,initData(){ 
            let data = CmonUtil.getPageLink('O2020');
            if(!ValdUtil.isEmptyJson(data)){
                this.srchParam.csetNo       = data.csetNo;
                this.srchParam.srchWord     = data.srchWord;
                this.isPgLink               = true;
                if(data.div === 'jsetMng' || data.div === 'migSmry' || data.div === 'migJob'){
                    this.srchParam.srchWord = data.unitJobNo;
                }
            }
            this.$nextTick(() =>{
                if(ValdUtil.isNotNull(this.srchParam.csetNo)){
                    this.selectListUnitJobMng();
                }
            })
            
        }        
        //단위작업 그리드 init
        ,initGrid: function () {
            const $this = this;
            let unitJobList = {
                url: '/mng/job/unitJobMng/selectListUnitJobMng.hb'
                ,colModels : [
                    {name:'csetNo'     ,label:'이행셋번호'     ,hidden: true}
                    ,{name:'convVer'    ,label:'전환버전'      ,hidden: true}
                    ,{name:'unitJobNo'  ,label:'단위작업번호'  ,width: 50  , align: 'left'   }
                    ,{name:'unitJobNm'  ,label:'단위작업명'    ,width: 50  , align: 'left'   }
                    ,{name:'jsetAlocYn' ,label:'작업셋할당'    ,width: 15  , align: 'center' }
                    ,{name:'blckYn'     ,label:'분산처리'      ,width: 11  , align: 'center' }
                ],
                options: {
                    rownumbers: true
                    ,onSelectRow(rowid){
                        $this.resetData($this.unitJobInfo);
                        $this.clearGridList('stndColGrid');
                        $this.clearGridList('analCntnGrid');
                        $this.clearGridList('blckBySpecGrid');
                        $this.saveDiv = 'update';
                        $this.unitJobInfo.csetNo = $(this).jqGrid('getRowData', rowid).csetNo;
                        $this.unitJobInfo.unitJobNo = $(this).jqGrid('getRowData', rowid).unitJobNo;
                        $this.selectUnitJobDetl();
                        $this.unitJobGridRowid = rowid;
                        $this.sqlVrfyFailYn = '';
                    }
                    ,gridComplete(){
                        if(ValdUtil.isNotNull($this.unitJobGridRowid)){
                            $(this).jqGrid('setSelection',$this.unitJobGridRowid);
                        }
                        if($this.isPgLink === true){
                            $(this).jqGrid('setSelection',1);
                        }
                        $this.isPgLink = false;
                    }
                }
            };
            $this.$refs.unitJobGrid.init(unitJobList);
        }
        //기준컬럼,분석내용,구간별상세 그리드 init
        ,initTabGrid() {
            const $this = this;
            //기준컬럼 그리드
            let stndColList = {
                url: '/mng/job/unitJobMng/selectListUnitJobBlckTblInfo.hb'
                ,colModels : [
                    {name: 'analYn'   ,label:'분석여부'   ,width:40  , hidden: true}
                    ,{name: 'colId'    ,label:'컬럼ID'     ,width:50  ,align:'left'    ,sortable:true }
                    ,{name: 'colNm'    ,label:'컬럼명'     ,width:50  ,align:'left'    ,sortable:true }
                    ,{name: 'dataType' ,label:'데이터유형' ,width:40  ,align:'left'  ,sortable:true }
                    ,{name: 'analTxt'  ,label:'분석여부'   ,width:25  ,align:'center'  ,sortable:true }
                ]
                ,options: {
                    height: 500
                    ,loadonce: true
                    ,onSelectRow (rowid){    
                        if($this.unitJobInfo.blckYn == 'Y'){
                            $this.unitJobInfo.colId = $(this).jqGrid('getRowData', rowid).colId;        
                            $this.clearGridList('blckBySpecGrid');     
                            $this.clearGridList('analCntnGrid');     
                            $this.selectGridList('analCntnGrid');  
                        }
                    }
                    ,gridComplete() {
                        // let gridData = $(this).jqGrid('getGridParam', 'data');
                        // if($this.ValdUtil.isNotNull(gridData) && $this.ValdUtil.isNotNull($this.analParams.rowId)){
                        //     $(this).jqGrid("setSelection", $this.analParams.rowId, true);
                        // }
                    }
                }
            }
            $this.$nextTick(() =>{
                $this.$refs.stndColGrid.init(stndColList);
            });
            //분석내용 그리드
            let analCntnList = {
                url: '/mng/job/unitJobMng/selectListUnitJobBlckAnalCntn.hb'
                ,colModels : [
                    {name:'divVal'     ,label:'분석구분값'  ,width:15  ,align:'left'   ,sortable:true  ,hidden:true }
                    ,{name:'idensType'  ,label:'식별유형'    ,width:10  ,align:'center' ,sortable:true  ,hidden:true }
                    ,{name:'idensVal'   ,label:'식별목록'    ,width:10  ,align:'left'   ,sortable:true  ,hidden:true }
                    ,{name:'divNm'      ,label:'분석구분'    ,width:20  ,align:'left'   ,sortable:true  }
                    ,{name:'divsCnt'    ,label:'분할수'      ,width:10  ,align:'right'  ,sortable:true  ,formatter:$this.thousandComma }
                    ,{name:'avgCnt'     ,label:'평균'        ,width:10  ,align:'right'  ,sortable:true  ,formatter:$this.thousandComma }
                    ,{name:'maxCnt'     ,label:'최대'        ,width:10  ,align:'right'  ,sortable:true  ,formatter:$this.thousandComma }
                    ,{name:'minCnt'     ,label:'최소'        ,width:10  ,align:'right'  ,sortable:true  ,formatter:$this.thousandComma }
                    ,{name:'slctYn'     ,label:'선택'        ,width:10  ,align:'center' 
                        ,formatter: function() {         
                          return '<button style="height:20px; width: 80px;" > 선택 </button>';                        
                        }}
                ]
                ,options: {
                    height: 170
                    ,loadonce: true
                    ,onSelectRow : function(rowid, a, event){

                        let blckIdenVals = "";
                        blckIdenVals = $this.unitJobInfo.colId + "^^" + $(this).jqGrid('getRowData', rowid).divVal + "^^";

                        if($this.CmonUtil.trim($(this).jqGrid('getRowData', rowid).idensType) == 'VARCHAR') blckIdenVals += $this.CmonUtil.trim($(this).jqGrid('getRowData', rowid).idensVal);
                        else blckIdenVals += "0,0";
                        $this.unitJobInfo.blckVals = blckIdenVals;

                        if($this.ValdUtil.isNotNull(event) && event.target.tagName == 'BUTTON') {
                            $this.confirm({
                                content: "분산처리기준이 현재 내용으로 적용됩니다<br/>적용하시겠습니까?",
                                callback: {
                                    yes() {
                                        $this.updateAnalStatCd();
                                    }
                                }
                            })
                        } else if($this.CmonUtil.trim($(this).jqGrid('getRowData', rowid).divVal) != ''){
                            $this.unitJobInfo.divVal = $this.CmonUtil.trim($(this).jqGrid('getRowData', rowid).divVal);
                            $this.selectGridList('blckBySpecGrid');
                        }
                    }
                }
            }
            $this.$nextTick(() =>{
                $this.$refs.analCntnGrid.init(analCntnList);
                $this.$refs.analCntnGrid.setGroupHeaders('avgCnt', 3, '건수');
            });
                
            //구간별 상세 그리드
            $this.blckBySpecList = {
                url: '/mng/job/unitJobMng/selectListUnitJobBlckAnalSpec.hb'
                ,colModels : [
                    {name:'idenVal'   ,label:'구간값'   ,width:40  ,align:'left'  ,sortable:true  }
                    ,{name:'idenCnt'  ,label:'대상건수' ,width:60  ,align:'right' ,sortable:true  ,formatter:$this.thousandComma }
                ]
                ,options: {
                    loadonce: true
                    ,height: 250
                }
            }
            $this.$nextTick(() =>{
                $this.$refs.blckBySpecGrid.init($this.blckBySpecList);
            });
        }
        //이행셋 선택
        ,changeCset(){
            this.resetData(this.unitJobInfo);
            this.clearGridList('unitJobGrid');
            this.clearGridList('stndColGrid');
            this.clearGridList('analCntnGrid');
            this.clearGridList('blckBySpecGrid');

            this.saveDiv = 'insert';
            this.unitJobGridRowid = '';
            this.sqlVrfyFailYn = '';
            this.srchParam.convVer       = '';
            this.srchParam.orgnDbConnId  = '';
            this.srchParam.targDbConnId  = '';
            this.clearGridList('unitJobGrid')
            if(ValdUtil.isNotNull(this.srchParam.csetNo)){
                this.code.csetList.forEach(el=>{
                    if(el.colId == this.srchParam.csetNo){
                        this.srchParam.convVer       = el.convVer;
                        this.srchParam.orgnDbConnId  = el.dbConnIdFr;
                        this.srchParam.targDbConnId  = el.dbConnIdTo;
                    }
                });       
                //단위작업목록 조회
                this.selectListUnitJobMng();
            }else{
                this.resetData(this.srchParam);
            }
        }
        //검색조건 변경
        ,changeSrchParams(){
            if(ValdUtil.isNotNull(this.srchParam.csetNo)){
                //단위작업목록 조회
                this.selectListUnitJobMng();
            }
        }
        //단위작업목록 조회
        ,selectListUnitJobMng(unitJobGridRowid) {
            this.saveDiv = 'insert';          
            this.unitJobGridRowid = unitJobGridRowid;  
            this.sqlVrfyFailYn = '';  
            this.resetData(this.unitJobInfo);
            this.clearGridList('stndColGrid');
            this.clearGridList('analCntnGrid');
            this.clearGridList('blckBySpecGrid');
            // this.unitJobInfo.convVer = this.srchParam.convVer
            this.currentTabIdx = 0;
            if(ValdUtil.srchValdNull(this.srchParam.csetNo,'이행셋','slct')){     
                this.$refs.unitJobGrid.selectList(true);      
            }
        }
        //단위작업상세정보 조회
        ,async selectUnitJobDetl() {            
            const $this = this;
            if(ValdUtil.srchValdNull($this.srchParam.csetNo,'이행셋','slct')
              &&ValdUtil.srchValdNull($this.unitJobInfo.unitJobNo,'단위작업번호','slct')){  
                
                let params = { csetNo : $this.srchParam.csetNo
                               ,unitJobNo : $this.unitJobInfo.unitJobNo}
                await $this.doPost('/mng/job/unitJobMng/selectUnitJobInfo.hb', params).then((res) => {
                    if (res.data.rtnCd == '0000' && $this.ValdUtil.isNotNull(res.data.rtnData.result)) {
                        $this.unitJobInfo = res.data.rtnData.result;            
                    } else {
                        $this.alert(res.data.rtnMsg);
                    }
                });        
                if(ValdUtil.isNotNull($this.unitJobInfo.orgnTblId)){
                    $this.selectGridList('stndColGrid');           
                    $this.selectGridList('analCntnGrid');           
                    $this.selectGridList('blckBySpecGrid');     
                }                
            }
        }
        //단위작업상세정보 초기화버튼
        ,resetUnitJobInfo(){
            this.saveDiv = 'insert';
            this.unitJobGridRowid = '';
            this.sqlVrfyFailYn = '';
            this.resetData(this.unitJobInfo);
            this.resetData(this.jsetInfo);
            this.clearGridList('stndColGrid');
            this.clearGridList('analCntnGrid');
            this.clearGridList('blckBySpecGrid');
        }
        //단위작업 SQL 검증
        ,unitJobSqlChecker(){            
            let $this = this;
            
            if (!ValdUtil.srchValdNull($this.unitJobInfo.orgnTblId,'테이블','slct')) return false;
            if (!ValdUtil.srchValdNull($this.unitJobInfo.procSql,'검증','trgt')) return false;

            let params = { targDbConnId  : $this.unitJobInfo.targDbConnId
                           ,procSql       : $this.unitJobInfo.procSql
            }    
            $this.doPost('/mng/job/unitJobMng/selectUnitJobSqlChecker.hb' , params).then(function (res) {                
                if (res.data.rtnCd == '0000' && ValdUtil.isNotNull(res.data.rtnData.result)) {
                    if(res.data.rtnData.result[0] == 'Y'){                    
                        $this.unitJobInfo.sqlVrfyYn = 'Y';
                        $this.sqlVrfyFailYn = 'N';
                    }else{
                        $this.alert(res.data.rtnData.result[1]);              
                        $this.sqlVrfyFailYn = 'Y';
                        $this.unitJobInfo.sqlVrfyYn = 'N';
                    }
                } else {
                    $this.sqlVrfyFailYn = 'Y';
                    $this.alert(res.data.rtnMsg);
                }
            });
        }
        //처리문장재생성
        ,generateUnitJobProc(){
            const $this = this;
            $this.sqlVrfyFailYn = '';
            if(!ValdUtil.srchValdNull($this.srchParam.csetNo,'이행셋','slct')) return false;
            if(!ValdUtil.srchValdNull($this.unitJobInfo.unitJobDivCd  ,'단위작업구분','slct')) return false;
            if(!ValdUtil.srchValdNull($this.unitJobInfo.unitJobTypeCd ,'단위작업구분','slct')) return false;
            if(!ValdUtil.srchValdNull($this.unitJobInfo.targDbConnId  ,'DB연결ID가 존재하지 않습니다','')) return false;
            if(!ValdUtil.srchValdNull($this.unitJobInfo.targSchId ,'스키마ID가 존재하지 않습니다','')) return false;
            if(!ValdUtil.srchValdNull($this.unitJobInfo.targTblId ,'테이블','slct')) return false;
            if(!ValdUtil.srchValdNull($this.unitJobInfo.tblMappNo ,'테이블매핑번호가 존재하지 않습니다','')) return false;
            $this.unitJobInfo.convVer = ValdUtil.isNull($this.unitJobInfo.convVer) ? $this.srchParam.convVer : $this.unitJobInfo.convVer;

            let params = {};
            params.csetNo    = $this.srchParam.csetNo;
            params.convVer = $this.unitJobInfo.convVer;
            params.tblMappNo  = $this.unitJobInfo.tblMappNo;
            params.unitJobTypeCd  = $this.unitJobInfo.unitJobTypeCd;
            $this.doPost('/mng/job/unitJobMng/generateUnitJobProc.hb',params).then((res)=>{
                if (res.data.rtnCd == '0000' && $this.ValdUtil.isNotNull(res.data.rtnData.result)) {
                    $this.unitJobInfo.procSql = res.data.rtnData.result[$this.unitJobInfo.unitJobTypeCd];            
                } else {
                    $this.alert('문장 재생성중 오류가 발생하였습니다 '+res.data.rtnMsg);
                }
            });
        }
        //분산처리분석 처리 버튼 이벤트
        ,async unitJobBlckAnalProc () {
            const $this = this;
            if (!ValdUtil.srchValdNull($this.unitJobInfo.orgnTblId,'테이블','slct')) return false;
            if (!ValdUtil.srchValdNull($this.unitJobInfo.colId,'컬럼','slct')) return false;

            $this.doPost('/mng/job/unitJobMng/asyncUnitJobBlckAnalProc.hb' , $this.unitJobInfo).then(function (res) {                
                let result = res.data;                
                if (result.rtnCd == '0000') {       
                    $this.alert("분석 요청이 완료되었습니다</br> 최대 5분가량 소요될 수 있습니다").then(result=>{
                        if(result.isConfirmed){
                            $this.selectUnitJobDetl();
                            $this.clearGridList('stndColGrid');
                            $this.clearGridList('analCntnGrid');
                            $this.clearGridList('blckBySpecGrid');
                            $this.selectGridList('stndColGrid');           
                        }
                    });
                } else {                       
                    $this.alert(result.rtnMsg);
                }
            });
        }

        //팝업 테이블검색
        ,tblSrchPopup(){
            const $this = this;
            
            if(!ValdUtil.srchValdNull(this.srchParam.csetNo,'이행셋번호','slct')) return false;
            if(!ValdUtil.srchValdNull(this.unitJobInfo.unitJobDivCd,'단위작업구분','slct')) return false;
            if(!ValdUtil.srchValdNull(this.unitJobInfo.unitJobTypeCd,'단위작업유형','slct')) return false;

            let params = {
                        dbConnId : this.srchParam.targDbConnId
                        ,isDisable: true
                        ,gridOptDiv: 'unitJobMng'
                        ,convVer : this.srchParam.convVer
            };
            $this.$refs.tblSrch.show();
            $this.$refs.tblSrch.init();
            $this.$refs.tblSrch.initGrid(params);
        },

        //팝업 테이블정보 받기        
        returnTblData(selectData){
            const $this =  this;
            $this.unitJobInfo.csetNo       = this.srchParam.csetNo;
            $this.unitJobInfo.targDbConnId = selectData.rowData.dbConnId;
            $this.unitJobInfo.targSchId    = selectData.rowData.schId;
            $this.unitJobInfo.targTblId    = selectData.rowData.tblId;
            $this.unitJobInfo.targTblNm    = selectData.rowData.tblNm;
            $this.unitJobInfo.orgnDbConnId = selectData.rowData.orgnDbConnId;
            $this.unitJobInfo.orgnSchId    = selectData.rowData.orgnSchId;
            $this.unitJobInfo.orgnTblId    = selectData.rowData.orgnTblId;
            $this.unitJobInfo.tblMappNo    = selectData.rowData.tblMappNo;
            $this.unitJobInfo.analStatCd   = '10';        //분석상태코드
            $this.unitJobInfo.analStatNm   = '분석대기';   //분석상태명
            $this.unitJobInfo.procSql      = '';          //처리문장   
            $this.unitJobInfo.bfProcSql    = '';          //이전처리문장   
            $this.unitJobInfo.tblCnt       = 0;           //테이블건수
            $this.unitJobInfo.objCnt       = 0;           //대상건수
            $this.unitJobInfo.blckYn       = 'N';         //분산처리여부
            $this.unitJobInfo.blckCnt      = '10000';     //분산처리건수
            $this.unitJobInfo.blckVals     = '';          //분산처리값들
            $this.unitJobInfo.blckThrds    = '5';         //분산처리스레드수
            this.clearGridList('stndColGrid');
            this.clearGridList('analCntnGrid');
            this.clearGridList('blckBySpecGrid');
            if ( !this.ValdUtil.isNull(this.unitJobInfo.unitJobNo) ) {
                this.selectGridList('stndColGrid');
            }
        }
        //저장 시 유효성 검증
        ,saveValid(){
            if(!ValdUtil.srchValdNull(this.srchParam.csetNo          ,'이행셋','slct')) return false;
            if(this.saveDiv == 'insert' && this.unitJobInfo.unitJobNo.substring(this.unitJobInfo.unitJobNo.length-2,this.unitJobInfo.unitJobNo.length) =='01'){
                this.alert('단위작업번호가 01로 끝나는 번호는<br/>사용할 수 없습니다');
                return false;
            }
            if(!ValdUtil.valdLenNull(this.unitJobInfo.unitJobNm      , 100    , '단위작업명은')) return false;
            if(!ValdUtil.valdLenNull(this.unitJobInfo.unitJobDivCd   , 20     , '단위작업구분은')) return false;
            if(!ValdUtil.valdLenNull(this.unitJobInfo.unitJobTypeCd  , 20     , '단위작업구분은')) return false;
            if(this.unitJobInfo.unitJobDivCd != '10' && !ValdUtil.valdLenNull(this.unitJobInfo.procModuNm  , 100     , '처리모듈명은')) return false;
            return true;
        }
        //단위작업관리 저장
        ,async saveUnitJob() {
            const $this = this;
            if(this.saveValid()){
                let isDuplYn = 'N'
                if($this.saveDiv == 'insert' && ValdUtil.isNotNull($this.unitJobInfo.unitJobNo)){
                    let params = {csetNo : $this.srchParam.csetNo
                                 ,unitJobNo : $this.unitJobInfo.unitJobNo}

                    await $this.doPost('/mng/job/unitJobMng/selectUnitJobInfo.hb',params).then(function(res){
                        if(res.data.rtnCd ='0000'){
                            if(ValdUtil.isNotNull(res.data.rtnData.result)){
                                isDuplYn = 'Y';
                            }
                        }else{
                            $this.alert('중복 키 검증 시 오류가 발생하였습니다',res.data.rtnMsg);
                            return false;
                        }
                    });
                }
                if(isDuplYn == 'Y'){
                    $this.alert('동일한 단위작업번호가 존재합니다');
                    return false;
                }
                $this.execSave('저장');
            } 
        }
        //단위작업관리 삭제
        ,deleteUnitJob() {
            const $this = this;
            if (($this.saveDiv=='update' && this.ValdUtil.isNull($this.unitJobInfo.unitJobNo)) || $this.saveDiv =='insert') {
                $this.alert('삭제할 단위작업을 선택해주세요');
                return false;
            }
            $this.execSave('삭제');
        }
        ,execSave(div){
            const $this = this;
            $this.confirm({
                content: div + '하시겠습니까?'
                ,callback: {
                    yes() {
                        let url = '/mng/job/unitJobMng/saveUnitJobMng.hb';
                        if($this.unitJobInfo.unitJobDivCd == '10'){
                            $this.unitJobInfo.procModuNm = '';
                        }else{
                            $this.unitJobInfo.targDbConnId = '';
                            $this.unitJobInfo.targDbConnNm = '';
                            $this.unitJobInfo.targSchId    = '';
                            $this.unitJobInfo.targTblId    = '';
                            $this.unitJobInfo.targTblNm    = '';
                            $this.unitJobInfo.orgnDbConnId = '';
                            $this.unitJobInfo.orgnSchId    = '';
                            $this.unitJobInfo.orgnTblId    = '';
                            $this.unitJobInfo.tblMappNo    = '';
                        }
                        let params = $this.unitJobInfo;
                        params['csetNo'] = $this.srchParam.csetNo;
                        params['saveDiv'] = $this.saveDiv;
                        if(ValdUtil.isNull($this.unitJobInfo.convVer)){
                            params['convVer'] = $this.srchParam.convVer;
                        }
                        if(div == '삭제'){
                            url = '/mng/job/unitJobMng/deleteUnitJobMng.hb';
                            params = {csetNo : $this.unitJobInfo.csetNo
                                    ,unitJobNo : $this.unitJobInfo.unitJobNo}
                        }
                        $this.doPost(url,params).then(function(res){
                            if(res.data.rtnCd == '0000'){
                                $this.alert(div+'되었습니다').then((result)=>{
                                    if(result.isConfirmed){
                                        $this.selectListUnitJobMng($this.unitJobGridRowid);
                                    }
                                })
                            }else{
                                $this.alert(res.data.rtnMsg).then((result)=>{
                                    if(result.isConfirmed){
                                        $this.selectListUnitJobMng();
                                    }
                                });
                            }
                        });
                    }
                }
            })
        }
        ,saveAnchorUnitJob() {
            let $this = this;
            this.confirm({
                content: "기존에 생성된 단위작업은 삭제됩니다.<br>전처리/후처리 단위작업을 생성하시겠습니까?",
                callback: {
                    yes : function() {
                        $this.doPost('/mng/job/unitJobMng/saveAnchorUnitJob.hb', $this.srchParam).then(function (res) {    
                            if(res.data.rtnCd == '0000'){
                                $this.alert('생성되었습니다').then((result)=>{
                                    if(result.isConfirmed){
                                        $this.selectListUnitJobMng($this.unitJobGridRowid);
                                    }
                                })
                            }else{
                                $this.alert(res.data.rtnMsg)
                            }
                        });
                    }
                }
            });
        }
        //분석처리상태 확정
        ,updateAnalStatCd(){
            const $this = this;
            if (!ValdUtil.srchValdNull($this.unitJobInfo.orgnTblId,'테이블','slct')) return false;
            if (!ValdUtil.srchValdNull($this.unitJobInfo.colId,'컬럼','slct')) return false;
            
            if(ValdUtil.isNotNull($this.unitJobInfo.blckVals)){
                $this.unitJobInfo.analStatCd = '30';
            }
            $this.doPost('/mng/job/unitJobMng/updateAnalStatCd.hb' ,  $this.unitJobInfo).then(function (res) {    
                if(res.data.rtnCd == '0000'){
                    $this.alert('설정 완료 되었습니다').then((result)=>{
                        if(result.isConfirmed){
                            $this.selectUnitJobDetl();
                            $this.clearGridList('stndColGrid');
                            $this.clearGridList('analCntnGrid');
                            $this.clearGridList('blckBySpecGrid');
                            $this.selectGridList('stndColGrid');         
                        }
                    });
                }else{
                    $this.alert(res.data.rtnMsg)
                }
            });
        }
        //테이블건수,대상건수 가져오기
        ,unitJobBlckTblInfo(){
            const $this = this;
            if (!ValdUtil.srchValdNull($this.unitJobInfo.orgnTblId,'테이블','slct')) return false;

            let params = {
                 csetNo       : $this.unitJobInfo.csetNo
                ,unitJobNo    : $this.unitJobInfo.unitJobNo
                ,targDbConnId : $this.unitJobInfo.targDbConnId
                ,targSchId    : $this.unitJobInfo.targSchId
                ,targTblId    : $this.unitJobInfo.targTblId
                ,orgnDbConnId : $this.unitJobInfo.orgnDbConnId
                ,orgnSchId    : $this.unitJobInfo.orgnSchId
                ,orgnTblId    : $this.unitJobInfo.orgnTblId
                ,procSql      : $this.unitJobInfo.procSql
            }
            $this.doPost('/mng/job/unitJobMng/selecTblCntObjCnt.hb' , params).then(function (res) {    
                if(res.data.rtnCd == '0000'){
                    $this.unitJobInfo.tblCnt = res.data.rtnData.result.tblCnt;
                    $this.unitJobInfo.objCnt = res.data.rtnData.result.objCnt;
                }else{
                    $this.alert(res.data.rtnMsg)
                }
            });
        }

        //테이블값 제거
        ,clearVal(div){
            if(div =='tblInfo'){
                this.unitJobInfo.targDbConnId = '';
                this.unitJobInfo.targDbConnNm = '';
                this.unitJobInfo.targSchId    = '';
                this.unitJobInfo.targTblId    = '';
                this.unitJobInfo.targTblNm    = '';
                this.unitJobInfo.orgnDbConnId = '';
                this.unitJobInfo.orgnSchId    = '';
                this.unitJobInfo.orgnTblId    = '';
                this.unitJobInfo.tblMappNo    = '';
                this.clearGridList('stndColGrid');
                this.clearGridList('analCntnGrid');
                this.clearGridList('blckBySpecGrid');
            }else if(div == 'blckVals'){
                this.unitJobInfo.blckVals = '';
            }
        }
        ,changeTab(index) {
            if(this.ValdUtil.isNotNull(index)) {
                this.currentTabIdx = index;
                if(index > 0){
                    this.initTabGrid();
                }
            }
        }
        //그리드조회 
        ,selectGridList(div) {
            const $this = this;
            $this.$refs[div].selectList();
        }
        //그리드초기화 
        ,clearGridList(div) {
            const $this = this;
            $this.$refs[div].clearGridData();
        }
        //데이터초기화
        ,resetData(val) {
            if(ValdUtil.isNotNull(val)){
                for(let key in val){
                    val[key] = '';
                    //기본 값 세팅
                    if( val == this.unitJobInfo){
                        if(key == 'blckYn'){
                            this.unitJobInfo.blckYn = 'N'; 
                        }else if(key == 'blckCnt'){
                            this.unitJobInfo.blckCnt = 10000;
                        }else if(key == 'blckThrds'){
                            this.unitJobInfo.blckThrds = 5;
                        }else if(key == 'tblCnt'){
                            this.unitJobInfo.tblCnt = 0;
                        }else if(key == 'objCnt'){
                            this.unitJobInfo.objCnt = 0;
                        }else if(key == 'analStatCd'){
                            this.unitJobInfo.analStatCd = 10;
                        }else if(key == 'analStatNm'){
                            this.unitJobInfo.analStatNm = '분석대기';
                        }
                    }
                    if(val == this.srchParam){
                        if(key =='notAlocJsetYn'){
                            this.srchParam.notAlocJsetYn = 'N';
                        }
                    }
                    if (key.indexOf('List') > -1){
                        val[key] = [];
                    }
                }
            }else{
                
            }
        }
        //엑셀다운로드         
        ,downloadExcel(){
            let $this = this;
            if(!ValdUtil.isEmptyList(this.$refs.unitJobGrid.getGridObj().jqGrid('getRowData'))){
                let fileNm ='단위작업목록_'+DateUtil.getCurrDate('YYYYMMDD')+'.xlsx';
                $this.doDownExcel('/mng/job/unitJobMng/selectListUnitJobMngExcel.hb', $this.srchParam, fileNm)
            }else{
                $this.alert('엑셀다운로드 대상이 없습니다');
            }    
        }
        //공통버튼(초기화, 조회, 저장, 삭제) 컴포넌트 핸들러
        ,onSetButtonClick(div) {
            switch ( div ) {
                case 'init':
                    this.init();
                    break;
                case 'select':
                    this.selectListUnitJobMng();
                    break;
                case 'save':
                    this.saveUnitJob();
                    break;
                case 'delete':
                    this.deleteUnitJob();
                    break;
                default:
                    this.alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
        }
    }
    ,watch:{
        'unitJobInfo.procSql'(newVal,oldVal){
            if(newVal != oldVal){
                this.unitJobInfo.sqlVrfyYn = 'N';
                this.sqlVrfyFailYn = '';
            }
        }
    }
    ,mounted() {
        this.init();
    }   
}
</script>