<template>
    <div>
        <!-- 검색조건 -->
        <div class="section section1">
            <div class="search-box">
                <div class="m-b-10">
                    <h1>검색조건</h1>
                    <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="true" @on-set-button-click="onSetButtonClick"></SetButton>
                </div>
                <div class="input-box w-100">
                    <div class="w-15 ib">
                        <h2>교육과정번호</h2>
                        <input ref="ecousNo" type="text" v-on:keyup.enter="onSetButtonClick('select')" v-model="srchParams.ecousNo">
                    </div>
                    <div class="w-15 ib">
                        <h2>교육과정명</h2>
                        <input type="text" v-on:keyup.enter="onSetButtonClick('select')" v-model="srchParams.ecousNm">
                    </div>
                    <div class="w-15 ib">
                        <h2>강사명</h2>
                        <input type="text" v-on:keyup.enter="onSetButtonClick('select')" v-model="srchParams.lectNm">
                    </div>
                    <div class="w-15 ib">
                        <h2>사용모델</h2>
                        <select v-model="srchParams.gmdlNo" @change="onSetButtonClick('select')">
                            <option v-for="el in code.gmdlList" :key="el.colId" :value="el.colId">
                                {{ el.colNm === '' || el.colNm === "NORM" ? el.colId : el.colId + " (사용불가)" }}
                            </option>
                        </select>
                    </div>
                    <div class="w-15 ib">
                            <div class="input-check">
                                <input type="checkbox" class="ib w-10 p-rl" style="height:auto; top:1px;"  true-value="Y" false-value="N" @change="onSetButtonClick('select')" v-model="srchParams.isEndEcous" >
                                <p>종료된 교육은 제외합니다</p>
                            </div>
                        </div>
                </div>
        </div>
    </div>    

        <!-- 교육과정 목록 -->
        <div class="section section2">
            <div class="section-wrap">
                <h2 class="ib">교육과정 목록</h2>
                <button class="btn-exel-download only" v-on:click="downloadExcel()">
                    <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                    <p>다운로드</p>
                </button>
                <!-- 그리드 -->
                <div class="wrapper-content">
                    <Grid ref="grid" :dataParams="srchParams" :paging="true"></Grid>
                </div>
            </div>
        </div>

        <!-- 상세정보 -->
        <div class="section section3">
            <div class="section-wrap p-t-22">
                <h2 class="ib">교육과정 정보</h2>
                <div class="btn-group-box ib">
                    <button class="btn-normal wd-90" @click="setPgLink('M1050')">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'caret-right']" />
                        <p class="ib">수강생관리</p>
                    </button>
                </div>
                <div class="section-part part1">
                    <div class="w-100">
                        <div class="w-50 p-r-10 ib">
                            <span class="wd-90 essn">교육과정번호</span>
                            <input class="c-wd-90" type="text" ref="paramsEcousNo" v-model="params.ecousNo" :disabled="params.crud === 'U'" @blur="duplicateInfoCheck()">
                        </div>
                        <div class="w-50 p-l-10 ib">
                            <span class="wd-90 essn">사용모델</span>
                            <select class="c-wd-90 ib" v-model="params.gmdlNo" ref="paramsGmdlNo">
                                <option v-for="el in code.gmdlList" :key="el.colId" :value="el.colId">
                                    {{ el.colNm === '' || el.colNm === "NORM" ? el.colId : el.colId + " (사용불가)" }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="w-100">
                        <span class="wd-90 essn">교육과정명</span>
                        <input class="c-wd-90" type="text" v-model="params.ecousNm">
                    </div>
                    <div class="w-100">
                        <div class="w-50 p-r-10 ib">
                            <span class="wd-90 ib">교육기간</span>
                            <div class="c-wd-90 ib">
                                <BetweenDatepicker :frDt="params.ecousStrtDt" :toDt="params.ecousEndDt" @onSelected="onSelectBetweenDate"></BetweenDatepicker>
                            </div>
                        </div>
                        <div class="w-50 ib">
                            <p class="guidTextGray m-l-10" style="float:none !important;">* 해당 교육기간에만 GPT를 사용할 수 있습니다.</p>
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-50 p-r-10 ib">
                            <span class="wd-90">교육시간</span>
                            <div class="c-wd-90 ib">
                                <div class="w-50-mr ib">
                                    <select v-model="params.eduStrtTm" class="c-wd-30 ib">
                                        <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
                                    </select>
                                </div>
                                <div class="w-50-ml ib">
                                    <select v-model="params.eduEndTm" class="c-wd-30 ib">
                                        <option v-for="time in timeOptions" :key="time" :value="time">{{ time }}</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="w-50 ib">
                            <p class="guidTextGray m-l-10" style="float:none !important;">* 해당 교육시간대에만 GPT를 사용할 수 있습니다.</p>
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-50 p-r-10 ib">
                            <span class="wd-90">강사ID</span>
                            <div class="c-wd-90 ib">
                                <div class="input-btn w-50-mr">
                                    <input class="w-100" type="text" v-model="params.lectUserId" disabled >
                                    <button class="post-btn" @click="openPopup()">
                                        <img src="@/assets/img/btn_search.png" alt="찾기">    
                                    </button>
                                </div>
                                <input class="w-50-ml" type="text" v-model="params.lectNm" disabled>
                            </div>
                        </div>
                        <div class="w-50 p-l-10 ib">
                            <button class="btn-normal wd-90 ib" style="height:27px;" @click="setPgLink('M1030')">
                                <font-awesome-icon class="ib m-r-5" :icon="['fas', 'caret-right']" />
                                <p class="ib">사용자 관리</p>
                            </button>
                            <div class="c-wd-90 ib">
                                <p class="guidTextGray m-l-10" style="float:none !important;">* 신규 강사를 등록하려는 경우 클릭합니다.</p>
                            </div>
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-33 ib">
                            <span class="wd-90 ib">학생 수</span>
                            <div class="c-wd-90 ib">
                                <input class="w-90 ib" v-model="params.stdtCnt" 
                                @input="setFormatNum(params.stdtCnt, 'stdtCnt')">
                                <p class="guidTextBlack w-10 p-l-5 p-r-10 ib" style="float:none !important;">명</p>
                            </div>
                        </div>
                        <div class="w-33 ib">
                            <span class="wd-90 t-a-r  p-r-5  ib">학생비밀번호</span>
                            <div class="c-wd-90 ib">
                                <input type="password" class="w-100 ib" @input="onPasswordInput($event.target.value)" :value="displayStdtPswd">
                            </div>
                        </div>
                        <div class="w-33 ib">
                            <div class="wd-90 t-a-r m-r-10 ib">
                                <div class="text-container  p-r-10 ib">
                                    <p v-if="stdtStatus === 'notCreated'" class="guidTextRed">(생성안됨)</p>
                                    <p v-else-if="stdtStatus === 'created'" class="guidTextBlue" style="float:none !important;">(생성완료)</p>
                                    <p v-else-if="stdtStatus === 'mismatch'" class="guidTextOrange">(인원 불일치)</p>
                                </div>
                            </div>
                            <div class="c-wd-90 t-a-r ib">
                                <button class="btn-normal wd-100" @click="createStdt()" :disabled="params.crud === 'C' || stdtStatus === 'created'">
                                    <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                                    <p class="ib">수강생 생성</p>
                                </button>
                            </div>
                            
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-33 ib">
                            <span class="wd-90 ib">강사 허용 토큰</span>
                            <div class="c-wd-90 ib">
                                <input class="w-100" v-model="params.lectLmitToknCnt" 
                                @input="setFormatNum(params.lectLmitToknCnt, 'lectLmitToknCnt')">
                            </div>
                        </div>    
                        <div class="w-33 ib">
                            <span class="wd-90 t-a-r p-r-5 ib">강사 사용 토큰</span>
                            <input class="c-wd-90 ib" v-model="params.lectUseToknCnt" 
                                @input="setFormatNum(params.lectUseToknCnt, 'lectUseToknCnt')" disabled>
                        </div>
                        <div class="w-33 ib">
                            <span class="wd-90 t-a-r p-r-5 ib">학생 허용 토큰</span>
                                <input class="c-wd-90 ib" v-model="params.stdtLmitToknCnt" 
                                @input="setFormatNum(params.stdtLmitToknCnt, 'stdtLmitToknCnt')">
                        </div>
                    </div>
                    <div class="text-box">
                        <span class="wd-90">교육 내용</span>
                        <textarea class="c-wd-90" style="height: 280px;  resize:none;" cols="30" rows="10" v-model="params.ecousCntn"></textarea>
                    </div>
                </div>
            </div>
        </div>
        <LectInfoPop ref="lectInfoPop" @selectedData="getPopData" ></LectInfoPop>
    </div>
</template>

<script>

import { reactive, ref, inject } from 'vue'
import Grid                      from '@/components/grid/Grid.vue'
import SetButton                 from '@/components/SetButton.vue'
import { DateUtil }              from '@/utils/DateUtil.js'
import { CmonUtil }              from '@/utils/CmonUtil'
import BetweenDatepicker         from '@/components/datepicker/BetweenDatepicker.vue'
import { SessionUtil }           from '@/utils/SessionUtil'
import LectInfoPop               from './LectInfoPop.vue'
import { ValdUtil }              from '@/utils/ValdUtil'

export default {
    components: {
        Grid,
        SetButton,
        BetweenDatepicker,
        LectInfoPop
    },
    setup() {
        let code = reactive({
            gmdlList      : [],
        });

        const colIdNmData = { 'tblId'  :'tm_gmdl_base',
                                      'colId'       :'gmdl_no',
                                      'colNm'       :'gmdl_stat_cd',
                                      'where'       : [ 
                                     {'andCol'      :'mngr_only_yn',
                                      'andCalc'     :'!=',
                                      'andVal'      :"'Y'"}
                                  ], 
                                  'orderby' : [
                                    {'orderCol' : 'gmdl_no'}
                                   ,{'orderCol' : 'gmdl_cntn'}
                                  ]
        };  
        const getColIdNmList = inject('getColIdNmList');
        getColIdNmList(colIdNmData, code.gmdlList, 'Y', null);

        return {
            code
        }
    },
    data: function() {
      return {
            srchParams : {
                ecousNo            : '',       // 교육과정번호
                ecousNm            : '',       // 교육과정명
                lectNm             : '',       // 강사명
                gmdlNo             : '',       // GPT모델번호
                isEndEcous         : 'Y',      // 종료된 교육 제외 태그
            },
            params: {
                crud               : 'C',      // CRUD
                ecousNo            : '',       // 교육과정번호
                gmdlNo             : '',       // GPT모델번호
                ecousNm            : '',       // 교육과정명
                ecousStrtDt        : '',       // 교육기간 시작일자
                ecousEndDt         : '',       // 교육기간 종료일자
                eduStrtTm          : '',       // 교육시간 시작시간
                eduEndTm           : '',       // 교육시간 종료시간
                lectUserId         : '',       // 강사ID
                lectNm             : '',       // 강사명
                stdtCnt            : '',       // 학생수
                stdtPswd           : '',       // 학생비밀번호
                lectLmitToknCnt    : '',       // 강사 허용 토큰 수
                lectUseToknCnt     : '',       // 강사 사용 토큰 수
                stdtLmitToknCnt    : '',       // 학생 허용 토큰 수
                ecousCntn          : '',       // 교육 내용
                // 사용자 정보
                regiUserId         : '',
                updtUserId         : '',
            },
            userBaseStdtCnt        : '',       // user_base 기반 실제 학생 수
            displayStdtPswd        : '',       // 화면에 표시할 가짜 비밀번호
            timeOptions            : '',       // 교육시간 option
        }
    },

    methods: {
        init() {
            const $this = this;
            let data = this.CmonUtil.getPageLink('M1040');

            $this.initGrid();
            $this.initData(data);

            $this.$nextTick(() => {
                $this.selectList();
                if(data != '') {
                    $this.selectOne(data.ecousNo);
                }
                CmonUtil.setFocus($this.$refs.ecousNo);
            });
        },
        initData(data){
            const $this = this;
            $this.initSrchParams(data);
            $this.initParams();

            $this.userBaseStdtCnt           = '0';
            $this.displayStdtPswd           = '';
            $this.timeOptions               = this.generateTimeOptions();
        },
        initSrchParams(data){
            const $this = this;
            if(data != '') {
                $this.srchParams.ecousNo        = data.ecousNo;
                $this.srchParams.ecousNm        = '';
                $this.srchParams.lectNm         = '';
                $this.srchParams.gmdlNo         = '';
                $this.srchParams.isEndEcous     = 'N';
            } else {
                $this.srchParams.ecousNo        = '';
                $this.srchParams.ecousNm        = '';
                $this.srchParams.lectNm         = '';
                $this.srchParams.gmdlNo         = '';
                $this.srchParams.isEndEcous     = 'Y';
            }
        },
        initParams(){
            const $this = this;
            $this.params.crud               = 'C';
            $this.params.ecousNo            = '';
            $this.params.gmdlNo             = '';
            $this.params.ecousNm            = '';
            $this.params.ecousStrtDt        = DateUtil.getCurrDate(("YYYY-MM-DD"));
            $this.params.ecousEndDt         = DateUtil.getCurrDate(("YYYY-MM-DD"));
            $this.params.eduStrtTm          = DateUtil.getFormatTime("0900").slice(0, -3);
            $this.params.eduEndTm           = DateUtil.getFormatTime("1800").slice(0, -3);
            $this.params.lectUserId         = '';
            $this.params.lectNm             = '';
            $this.params.stdtCnt            = '0';
            $this.params.stdtPswd           = '';
            $this.params.lectLmitToknCnt    = '0';
            $this.params.lectUseToknCnt     = '0';
            $this.params.stdtLmitToknCnt    = '0';
            $this.params.ecousCntn          = '';
            const userId                    = SessionUtil.getUserId();
            $this.params.regiUserId         = userId;            
            $this.params.updtUserId         = userId;   
        },
        // 교육과정 목록 그리드
        initGrid() {
            let $this = this;

            let gridObj = {
                url: '/cmon/sys/eduCousMng/selectListEduCousList.hb',
                colModels: [
                    {name:'ecousNo'       ,label: '교육과정번호' , width: 40   , align:'center'  },
                    {name:'ecousNm'       ,label: '교육과정명'   , width: 110  , align:'left'    },
                    {name:'lectNm'        ,label: '강사명'       , width: 30   , align:'center' },
                    {name:'stdtCnt'       ,label: '교육생수'     , width: 30   , align:'right'  , formatter:$this.thousandComma },
                    {name:'ecousStrtDt'   ,label: '교육시작일'   , width: 40   , align:'center' , formatter: $this.formatDate},
                    {name:'ecousEndDt'    ,label: '교육종료일'   , width: 40   , align:'center' , formatter: $this.formatDate},
                ],
                options: {
                    onSelectRow : function(rowid){
                        let params = $(this).jqGrid('getRowData', rowid);
                        $this.selectOne(params.ecousNo);
                    },
                    gridComplete: function() {
                        const $grid = $(this);
                        const rowIds = $grid.jqGrid('getDataIDs');

                        // 저장 후 자동 selection
                        if($this.params.crud === 'U') {
                                rowIds.forEach(rowId => {
                                const row = $grid.jqGrid('getRowData', rowId);
                                if (row.ecousNo === $this.params.ecousNo) {
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
        // 교육과정 단건 조회
        selectOne(ecousNo) {
            const $this = this;
            let param = {
                ecousNo : ecousNo
            };
            $this.doPost('/cmon/sys/eduCousMng/selectOneEduCous.hb', param).then(function (res) {
                if(res.status === 200) {
                    // 여기서 값 세팅
                    const eduCousInfo = res.data.rtnData.eduCousInfo;
                    const userBaseStdtCnt = res.data.rtnData.userBaseStdtCnt;
                    // 교육과정 정보 
                    $this.params.crud              = 'U';
                    $this.params.ecousNo           = eduCousInfo.ecousNo;
                    $this.params.gmdlNo            = eduCousInfo.gmdlNo;
                    $this.params.ecousNm           = eduCousInfo.ecousNm;
                    $this.params.ecousStrtDt       = DateUtil.getDate(eduCousInfo.ecousStrtDt,"YYYY-MM-DD");
                    $this.params.ecousEndDt        = DateUtil.getDate(eduCousInfo.ecousEndDt,"YYYY-MM-DD");
                    $this.params.eduStrtTm         = DateUtil.getFormatTime(eduCousInfo.eduStrtTm).slice(0, -3);
                    $this.params.eduEndTm          = DateUtil.getFormatTime(eduCousInfo.eduEndTm).slice(0, -3);
                    $this.params.lectUserId        = eduCousInfo.lectUserId;
                    $this.params.lectNm            = eduCousInfo.lectNm;
                    $this.params.stdtCnt           = $this.thousandComma(eduCousInfo.stdtCnt) || '0';
                    $this.params.stdtPswd          = eduCousInfo.stdtPswd;
                    $this.params.lectLmitToknCnt   = $this.thousandComma(eduCousInfo.lectLmitToknCnt) || '0';
                    $this.params.lectUseToknCnt    = $this.thousandComma(eduCousInfo.useToknCnt) || '0';
                    $this.params.stdtLmitToknCnt   = $this.thousandComma(eduCousInfo.stdtLmitToknCnt) || '0';
                    $this.params.ecousCntn         = eduCousInfo.ecousCntn;
                    $this.userBaseStdtCnt          = $this.thousandComma(userBaseStdtCnt) || '0';
                    if(eduCousInfo.stdtPswd != null) {
                        $this.displayStdtPswd          = '**********';  // 학생비밀번호 * 표시를 위한 세팅
                    } else {
                        $this.displayStdtPswd          = '';
                    }
                }
            });
        },
        // 교육과정번호 중복 체크
        duplicateInfoCheck() {
            const $this = this;
            let param = {
                ecousNo : $this.params.ecousNo
            };
            $this.doPost('/cmon/sys/eduCousMng/selectOneEduCous.hb', param).then(function (res) {
                if(res.status === 200) {
                    const eduCousInfo = res.data.rtnData.eduCousInfo;
                    if(ValdUtil.isNotNull(eduCousInfo)) {
                        $this.params.ecousNo = '';
                        CmonUtil.setFocus($this.$refs.paramsEcousNo);
                        $this.alert("해당 교육과정번호로 이미 정보가 존재합니다.<br>교육과정번호를 다시 확인해주세요.");
                    } else {
                        CmonUtil.setFocus($this.$refs.paramsGmdlNo);
                    }
                }
            });
        },
        // 유효성 검증
        validateParam() {
            const $this = this;

            if(ValdUtil.isNull($this.params.ecousNo)) {
                $this.alert("교육과정번호를 입력해주세요.");
                return false;
            }
            if(ValdUtil.isNull($this.params.gmdlNo)) {
                $this.alert("사용모델을 선택해주세요.");
                return false;
            }
            if(ValdUtil.isNull($this.params.ecousNm)) {
                $this.alert("교육과정명을 입력해주세요.");
                return false;
            }

            return true;
        },
        saveCnfm(){
            const $this = this;

            if(!$this.validateParam()) {
                return false;
            }

            const payload = {
                ...$this.params,
                stdtCnt:         CmonUtil.filterSpecialChar($this.params.stdtCnt),
                lectLmitToknCnt: CmonUtil.filterSpecialChar($this.params.lectLmitToknCnt),
                stdtLmitToknCnt: CmonUtil.filterSpecialChar($this.params.stdtLmitToknCnt),
                ecousStrtDt:     CmonUtil.filterSpecialChar($this.params.ecousStrtDt),
                ecousEndDt:      CmonUtil.filterSpecialChar($this.params.ecousEndDt),
                eduStrtTm:       CmonUtil.filterSpecialChar($this.params.eduStrtTm) + "00",
                eduEndTm:        CmonUtil.filterSpecialChar($this.params.eduEndTm) + "00"
            };

            $this.confirm({
                content:  "저장하시겠습니까?",
                callback: {
                    yes() {
                        $this.doPost('/cmon/sys/eduCousMng/saveEduCousInfo.hb', payload).then(function (res) {
                            if(res.data.rtnCd === '0000') {
                                $this.alert("저장이 완료되었습니다.");
                                $this.params.crud = "U";
                                $this.selectList();
                            } else {
                               $this.alert(res.data.rtnMsg); 
                               return false;
                            }
                        });
                    }
                }
            });
        },
        deltCnfm(){
            const $this = this;
            const params = {
                ecousNo     : $this.params.ecousNo
            };
            $this.confirm({
                content:  "해당 교육과정과 관련된 수강생 정보가 함께 삭제됩니다.<br> 삭제하시겠습니까?",
                callback: {
                    yes() {
                        $this.doPost('/cmon/sys/eduCousMng/deleteEduCousInfo.hb', params).then(function(res) {
                            if(res.status === 200) {
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
        // 수강생 생성 버튼 이벤트
        createStdt() {
            const $this = this;
            const crud = $this.params.crud;

            if(crud === 'C') {
                $this.alert("교육과정 정보를 저장 후 진행해주시기 바랍니다.");
                return false;
            }
            
            let params = {
                ecousNo         : $this.params.ecousNo,
                ecousNm         : $this.params.ecousNm,
                stdtCnt         : $this.params.stdtCnt.replaceAll(",", ""),
                lectUserId      : $this.params.lectUserId,
                stdtPswd        : $this.params.stdtPswd,
                lectLmitToknCnt : $this.params.lectLmitToknCnt.replaceAll(",", ""),
                stdtLmitToknCnt : $this.params.stdtLmitToknCnt.replaceAll(",", ""),
                userId          : SessionUtil.getUserId(),
            };
            
            $this.doPost('/smpl/gptTokener/generateStudentByEcous.hb', params).then(function(res) {
                if(res.status === 200) {
                    const userBaseStdtCnt = res.data.rtnData.userBaseStdtCnt;
                    $this.selectList();
                    $this.userBaseStdtCnt = userBaseStdtCnt;
                    $this.params.stdtCnt = userBaseStdtCnt;
                    // 여기서 값 비교 
                    $this.alert("수강생 생성이 완료되었습니다.");
                } else {
                    $this.alert("수강생 생성중 문제가 발생했습니다.");
                }
            });
        },
        // 팝업 호출
        openPopup() {
            const $this = this;
            // 팝업 호출
            $this.$refs.lectInfoPop.show();
            $this.$refs.lectInfoPop.init();
        },
        // 팝업 데이터 리턴
        getPopData(getRowData){
            const $this = this;
            if(ValdUtil.isNotNull(getRowData)){
                let data = getRowData.selectedRowData;
                $this.params.lectUserId      = data.userId;
                $this.params.lectNm          = data.userNm;
                $this.params.lectLmitToknCnt = data.lmitToknCnt;
                $this.params.lectUseToknCnt  = data.useToknCnt;
            }
        },
        // 학생비밀번호 * 표시
        onPasswordInput(val) {
            // 사용자가 새로 입력한 경우만 실제 값 변경
            if (val !== '**********') {
            this.params.stdtPswd = val;
            this.displayStdtPswd = val;
            }
        },
        // 넘버 포멧팅
        setFormatNum(val, div) {
            const $this = this;
            let filterVal = CmonUtil.filterSpecialChar(val);
            let addComma = $this.thousandComma(CmonUtil.toInt(filterVal));
            if (div === 'stdtCnt') {
                $this.params.stdtCnt = addComma;
            }
            else if (div === 'lectLmitToknCnt') {
                $this.params.lectLmitToknCnt = addComma;
            }
            else if (div === 'stdtLmitToknCnt') {
                $this.params.stdtLmitToknCnt = addComma;
            }
            else if (div === 'lectUseToknCnt') {
                $this.params.lectUseToknCnt = addComma;
            }
        },
        //페이지 이동
        setPgLink(pageNo){
            const $this = this;
            let params = {};

            switch(pageNo) {
                // 수강생관리
                case "M1050":
                    params = {
                        ecousNo           : $this.params.ecousNo,
                        isEndCousYn       : $this.srchParams.isEndEcous
                    }
                break;
                // 사용자관리
                case "M1030":
                    params = {
                        userId            : $this.params.lectUserId,
                        userNm            : $this.params.lectNm,
                    }
                break;
            }
            
            CmonUtil.setPageLink(pageNo, params);
        },
        // 엑셀다운로드        
        downloadExcel(){
            const $this = this;
            let url    = '/cmon/sys/eduCousMng/eduCousListExcelDownload.hb';
            let param  = _.cloneDeep($this.srchParams);
            let fileNm = '교육과정목록_'+DateUtil.getCurrDate('YYYYMMDD')+'.xlsx';

            if($this.$refs.grid.getGridObj().jqGrid('getGridParam','records') < 1) {
                $this.alert('엑셀다운로드 대상이 없습니다');
                return false;
            }
            $this.doDownExcel(url, param, fileNm);
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
                    $this.saveCnfm();
                    break;
                case 'delete':
                    $this.deltCnfm();
                    break;
                default:
                    $this.alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
        },
        generateTimeOptions() {
            const times = [];
            for (let hour = 0; hour < 24; hour++) {
                for (let minute = 0; minute < 60; minute += 30) {
                const formattedTime = `${this.formatTime(hour)}:${this.formatTime(minute)}`;
                times.push(formattedTime);
                }
            }
            return times;
        },
        formatTime(unit) {
            return unit < 10 ? `0${unit}` : unit;
        },
        // BetweenDatePicker 날짜선택
        onSelectBetweenDate(selectedDate) {
            this.params.ecousStrtDt = selectedDate.frDt;
            this.params.ecousEndDt  = selectedDate.toDt;
        },
    },
    computed: {
        stdtStatus() {
            const stdtCnt = this.params.stdtCnt;
            const baseCnt = this.userBaseStdtCnt;
            if (baseCnt === '0') return 'notCreated';
            if (stdtCnt !== '0' && stdtCnt === baseCnt) return 'created';
            if (stdtCnt !== '0' && stdtCnt !== baseCnt) return 'mismatch';
            return '';
        }     
    },
    mounted: function() {
        const $this = this;
        $this.init();
    }   
}
</script>
