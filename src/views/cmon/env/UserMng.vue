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
                        <h2>사용자ID</h2>
                        <input  ref="userId" v-model="srchParams.userId" type="text" v-on:keyup.enter="onSetButtonClick('select')">
                    </div>
                    <div class="w-15 ib">
                        <h2>사용자명</h2>
                        <input  ref="userNm" v-model="srchParams.userNm" type="text" v-on:keyup.enter="onSetButtonClick('select')">
                    </div>
                    <div class="w-15 ib">
                        <h2>역할코드</h2>
                        <select v-model="srchParams.roleCd" @change="onSetButtonClick('select')">
                            <option v-for="el in code.roleCdList" :key="el.colId" :value="el.colId">{{el.colNm}}</option>
                        </select>
                    </div>
                </div>
        </div>
    </div>    

        <!-- 사용자 목록 -->
        <div class="section section2">
            <div class="section-wrap">
                <h2 class="ib">사용자 목록</h2>
                <button class="btn-exel-download only" v-on:click="downloadExcel()">
                    <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                    <p>다운로드</p>
                </button>
                <!-- 그리드 -->
                <Grid ref="grid" :dataParams="srchParams" :paging="true"></Grid>
            </div>
        </div>

        <!-- 상세정보 -->
        <div class="section section3">
            <div class="section-wrap p-t-22">
                <h2 class="ib">사용자 정보</h2>
                <div class="section-part part1">
                    <div class="w-100">
                        <div class="w-50 p-r-10 ib">
                            <span class="wd-90 essn">사용자ID</span>
                            <input class="c-wd-90" type="text" v-model="userMngSpec.userId" :disabled="params.crud ==='U'">
                        </div>
                        <div class="w-50 p-l-10 ib">
                            <span class="wd-90 essn">사용자명</span>
                            <input class="c-wd-90" type="text" v-model="userMngSpec.userNm">
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-50 p-r-10 ib">
                            <span :class="{'wd-90 essn':params.crud === 'C', 'wd-90' :params.crud === 'U'}">비밀번호</span>
                            <input class="c-wd-90" type="password" autocomplete="off" v-model="userMngSpec.userPswd" maxlength="20">
                        </div>
                        <div class="w-50 p-l-10 ib">
                            <span :class="{'wd-90 essn':params.crud === 'C', 'wd-90' :params.crud === 'U'}">비밀번호확인</span>
                            <input class="c-wd-90" type="password" autocomplete="off" v-model="userMngSpec.userPswdCnfm" maxlength="20">
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-50 p-r-10 ib">
                            <span class="wd-90">사원번호</span>
                            <input class="c-wd-90" type="text" v-model="userMngSpec.empNo">
                        </div>
                        <div class="w-50 p-l-10 ib">
                            <span class="wd-90">부서명</span>
                            <input class="c-wd-90" type="text" v-model="userMngSpec.deptNm">
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-50 p-r-10 ib">
                            <span class="wd-90">직책</span>
                            <input class="c-wd-90" type="text" v-model="userMngSpec.jtitNm">
                        </div>
                        <div class="w-50 p-l-10 ib">
                            <span class="wd-90">직위</span>
                            <input class="c-wd-90" type="text" v-model="userMngSpec.posiNm">
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-50 p-r-10 ib">
                            <span class="wd-90">휴대전화</span>
                            <input class="c-wd-90" type="text" v-model="userMngSpec.mphnNo" placeholder="예시)01012345678">
                        </div>
                        <div class="w-50 p-l-10 ib">
                            <span class="wd-90">이메일</span>
                            <input class="c-wd-90" type="text" v-model="userMngSpec.emalAddr">
                        </div>
                    </div>
                    <div class="w-50">
                        <span class="wd-90">가입일자</span>
                        <div class="c-wd-90 ib">
                            <div class="w-100 p-r-10 input-btn">
                                <Datepicker :isFullWidth=100 :stndDt="userMngSpec.entrDt" @on-selected="onSelectedDatepickerEntrDt"></Datepicker>
                            </div>
                        </div>
                    </div>
                    <div class="w-50">
                        <span class="wd-90 p-l-10">탈퇴일자</span>
                        <div class="c-wd-90 ib">
                            <div class="w-100 p-l-10 input-btn">
                                <Datepicker :isFullWidth=100 :stndDt="userMngSpec.resgDt" @on-selected="onSelectedDatepickerResgDt"></Datepicker>
                            </div>
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-50 p-r-10 ib">
                            <span class="wd-90">교육과정번호</span>
                            <input class="c-wd-90" type="text" v-model="userMngSpec.ecousNo" disabled>
                        </div>
                        <div class="w-50 p-l-10 ib">
                            <span class="wd-90">허용토큰수</span>
                            <input class="c-wd-90 t-a-r" type="text" v-model="userMngSpec.lmitToknCnt" disabled>
                        </div>
                    </div>
                    <div class="text-box">
                        <span class="wd-90">참고사항</span>
                        <textarea class="c-wd-90" style="height: 210px;  resize:none;" cols="30" rows="10" v-model="userMngSpec.rmrk"></textarea>
                    </div>
                </div>
                <h2 class="essn">사용자 역할</h2>
                <div class="section-part part2 c-wd-80 f-r">
                    <div class="w-100">
                        <select class="w-33-m m-b-3" v-model="slctRoleList[idx]" v-for="(combo, idx) in roleComboList" :key="idx">
                            <option v-for="el in code.roleCdList" :key="el.colId" :value="el.colId">{{el.colNm}}</option>
                        </select>
                    </div>
                    <div class="w-100" v-if="userMngSpec.gmdlLmitYn==='Y'">
                        <div class="w-100 m-b-10">
                            <p class="guidTextRed ib">ChatGPT 모델사용 제한됨  </p>
                            <p class="guidTextGray ib" style="float:none !important">  
                                {{DateUtil.getFormatDate(userMngSpec.gmdlLmitDt, "YYYY/MM/DD")}} , 
                                {{DateUtil.getFormatTime(userMngSpec.gmdlLmitTm, "HH:mm:ss")}} , 
                                {{userMngSpec.gmdlLmitUserId}} ({{userMngSpec.gmdlLmitUserNm}})
                            </p>
                        </div>
                        <div class="w-100 m-b-5">
                            <p class="guidTextRed">[ {{userMngSpec.gmdlLmitResnNm}} ]</p>
                        </div>
                        <div class="w-100">
                            <p class="guidTextOrange">{{userMngSpec.gmdlLmitObjNm}} 에서 사용량이 초과 되었습니다</p>
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
import { ValdUtil }              from '@/utils/ValdUtil'
import { CmonUtil }              from '@/utils/CmonUtil'
import moment                    from "moment";

export const pswdStr = '************';
export default {
    components: {
        Grid,
        SetButton,
        Datepicker,
    },

    setup() {
        let code = reactive({
            roleCdList : [],
            ynCdList   : []
        })

        const getColIdNmList = inject('getColIdNmList');
        const colIdNmListData = { 'tblId'  :'tc_role_base',
                                  'colId'  :'role_cd',
                                  'colNm'  :'role_nm',
                                  'where'  : [
                                    {'andCol' :'ROLE_CD',           // 역할코드의 수강생 제외(검색조건)
                                     'andCalc':'!=',
                                     'andVal' :"'STUDENT'"}
                                  ],
                                  'orderby' : [
                                    {'orderCol' : 'role_cd'}
                                   ,{'orderCol' : 'role_nm'}
                                  ]
        };  
        getColIdNmList(colIdNmListData, code.roleCdList, 'Y', null);
        
        const getCmonCdList = inject('getCmonCdList');
        getCmonCdList('YN', code.ynCdList, 'Y', null);  // YN / YN
        
        return {
            code,
        }
    },

    data: function() {
      return {
            srchParams : {
                userId : '',
                userNm : '',
                roleCd : '',
            },
            params: {
                crud         : 'C',
                selUserId    : '',
            },
            userMngSpec: {
                userId          : '',
                userNm          : '',
                userPswd        : '',
                pswdChk         : 'N',      // 비밀번호 변경 체크 여부
                userPswdCnfm    : '',
                empNo           : '',
                deptNm          : '',
                jtitNm          : '',
                posiNm          : '',
                emalAddr        : '',
                mphnNo          : '',
                entrDt          : '',
                resgDt          : '',
                rmrk            : '',
                useYn           : 'Y',
                gmdlLmitYn      : 'N',      // GPT모델_제한여부
                gmdlLmitNo      : '',       // GPT모델_제한_번호
                gmdlLmitObjCd   : '',		// GPT모델_제한_대상코드
                gmdlLmitObjNm   : '',		// GPT모델_제한_대상코드명
                gmdlLmitDt 		: '',		// GPT모델_제한_일자
                gmdlLmitTm 		: '',		// GPT모델_제한_시각
                gmdlLmitResnCd  : '',	    // GPT모델_제한_사유 코드
                gmdlLmitResnNM  : '',	    // GPT모델_제한_사유 코드명
                gmdlLmitCntn 	: '',	    // GPT모델_제한_내용
                gmdlLmitUserId 	: '',	    // GPT모델_제한_사용자 ID
                gmdlLmitUserNm  : '', 
                ecousNo         : '',
                lmitToknCnt     : '',
                // lginLockYn   : 'N',
                // lginLockDttm : ''
            },
            roleComboList    : [],   // 상세정보 역할 콤보박스 
            bchgRoleCntn     : [],   // 변경 전 사용자역할
            bchgRoleCdList   : [],   // 변경 전 사용자역할코드
            slctRoleList     : [],
        }
    },

    methods: {
        init() {
            const $this = this;
            $this.reset();
            $this.initData();
            $this.initGrid();
            $this.$nextTick(()=>{
                $this.searchList();         // 사용자 목록
            });
            
            $this.CmonUtil.setFocus($this.$refs.userId);
        },
        initData(){
            const $this = this;
            $this.roleComboList  = Array(3).fill({colId : '', colNm : ''});
            let data = this.CmonUtil.getPageLink('M1030');
            if(ValdUtil.isNotNull(data)){  
                $this.srchParams.userId  = data.userId;
                $this.params.selUserId   = data.userId;
                $this.srchParams.userNm  = data.userNm;
                // $this.srchParams.roleCd  = data.roleCd;
                // $this.searchList();
            }
        },

        initGrid() {
            let $this = this;
            let gridObj = {
                url: '/cmon/env/userMng/selectListUserMngGrid.hb',
                colModels: [
                    {name:'userId'         ,label: '사용자ID'         , width: 30    , align:'center' },
                    {name:'userNm'         ,label: '사용자명'         , width: 40    , align:'center' },
                    {name:'roleCd'         ,label: '사용자역할코드'   , width: 100   , align:'left'  , hidden : true },
                    {name:'roleNm'         ,label: '사용자역할'       , width: 100   , align:'left'  , hidden : true },
                    {name:'roleCdNm'       ,label: '역할명'           , width: 100   , align:'left'  },
                    // {name:'useYn'          ,label: '사용여부'         , width: 30    , align:'center' },
                ],
                options: {
                    rownumbers  : true,
                    onSelectRow : function(rowid){
                        let gridData = $(this).jqGrid('getRowData', rowid);
                        $this.params.selUserId = gridData.userId;
                        $this.bchgRoleCntn     = gridData.roleCdNm;
                        $this.bchgRoleCdList   = gridData.roleCd;
                        $this.slctRoleList     = gridData.roleCd.split(',');
                        $this.params.crud      = 'U';
                        $this.selectUserSpec();
                    },
                    gridComplete(){
                        const $grid = $(this);
                        const rowIds = $grid.jqGrid('getDataIDs');

                        // 그리드 결과 1개 일경우  사용자 정보 자동 세팅  ( 첫번째 row setSelection, 이력등 파라미터 받을시 자동 세팅 )
                        if($grid.jqGrid('getRowData').length == 1){
                            $grid.jqGrid('setSelection', rowIds);
                        }                        

                        // 저장 후 자동 selection
                        if($this.params.crud === 'U') {
                                rowIds.forEach(rowId => {
                                const row = $grid.jqGrid('getRowData', rowId);
                                if (row.userId === $this.userMngSpec.userId) {
                                    $grid.jqGrid('setSelection', rowId, true);
                                }
                            });
                        }
                    },
                },


            };
            $this.$refs.grid.init(gridObj);
        },
        // 그리드 조회
        selectListGrid(){
            const $this = this;
            $this.$refs.grid.selectList(true);
        },
        // 조회
        searchList(){
            const $this = this;
            $this.selectListGrid();
        },
        //사용자 상세정보 조회
        selectUserSpec() {
            const $this = this;
            let params = {
                userId : $this.params.selUserId
            }
            $this.doPost('/cmon/env/userMng/selectUserMngSpec.hb', params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    $this.userMngSpec              = result.rtnData.result;
                    $this.userMngSpec.entrDt       = DateUtil.dateToDash(result.rtnData.result.entrDt);
                    $this.userMngSpec.resgDt       = DateUtil.dateToDash(result.rtnData.result.resgDt);
                    $this.userMngSpec.userPswd     = pswdStr;
                    $this.userMngSpec.userPswdCnfm = pswdStr;
                    $this.userMngSpec.lmitToknCnt  = CmonUtil.addThousandComma(result.rtnData.result.lmitToknCnt);
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },

        //사용자정보 저장(add) VALIDATION
        validationUserBaseAdd(){
            const $this = this;

            // null 체크 및 길이 체크 (data / 길이 / msg / null 체크 여부=디폴트 true)
            if(!$this.ValdUtil.valdLenNull($this.userMngSpec.userId    , 30    , '사용자ID는'           )) return false;
            if(!$this.ValdUtil.valdLenNull($this.userMngSpec.userNm    , 40    , '사용자명은'           )) return false;
            if(!$this.ValdUtil.valdLenNull($this.userMngSpec.empNo     , 20    , '사원번호는'    , false)) return false;
            if(!$this.ValdUtil.valdLenNull($this.userMngSpec.deptNm    , 40    , '부서명은'      , false)) return false;
            if(!$this.ValdUtil.valdLenNull($this.userMngSpec.jtitNm    , 30    , '직책은'        , false)) return false;
            if(!$this.ValdUtil.valdLenNull($this.userMngSpec.posiNm    , 30    , '직위는'        , false)) return false;
            if(!$this.ValdUtil.valdLenNull($this.userMngSpec.mphnNo    , 20    , '휴대전화는'    , false)) return false;
            if(!$this.ValdUtil.valdLenNull($this.userMngSpec.emalAddr  , 50    , '이메일은'      , false)) return false;

            //가입일자 탈퇴일자 비교
            let entrDt = CmonUtil.toInt(DateUtil.dateToYYYYMMDD($this.userMngSpec.entrDt));
            let resgDt = CmonUtil.toInt(DateUtil.dateToYYYYMMDD($this.userMngSpec.resgDt));
            if( entrDt > resgDt){
                $this.alert('탈퇴 일자는 가입 일자보다 과거일 수 없습니다.')
                return false;
            }
        
            // 신규 입력인 경우 비밀번호확인 check
            if($this.params.crud === 'C'){
                // if(!$this.ValdUtil.valdLenNull($this.userMngSpec.userPswd  , 12  , '비밀번호는')) return false;

                if(ValdUtil.isNotNull($this.userMngSpec.userPswd)){
                    if(ValdUtil.isNull($this.userMngSpec.userPswdCnfm)){
                        $this.alert("비밀번호확인을 입력바랍니다.");
                        return false;
                    }
                    if($this.userMngSpec.userPswd != $this.userMngSpec.userPswdCnfm){
                        $this.alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
                        return false;
                    }
                } else {
                    $this.alert("비밀번호를 입력바랍니다.");
                    return false;
                }
            // 비밀번호 변경인 경우 비밀번호확인 check
            } else if($this.params.crud === 'U') {                
                if($this.userMngSpec.userPswd != pswdStr )
                {
                    if (ValdUtil.isNull($this.userMngSpec.userPswd)) {
                    $this.alert("비밀번호를 입력바랍니다.");
                    return false;
                    }
                    if(ValdUtil.isNotNull($this.userMngSpec.userPswdCnfm) && $this.userMngSpec.userPswd != $this.userMngSpec.userPswdCnfm){
                        $this.alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
                        return false;
                    }
                    // 비밀번호 변경 필요시 체크 -> "Y"
                    $this.userMngSpec.pswdChk = 'Y';
                }else{
                    $this.userMngSpec.pswdChk = 'N';
                }

                // if ($this.userMngSpec.userPswd != $this.chkData.userPswd) {
                //     if(ValdUtil.isNull($this.userMngSpec.userPswdCnfm)) {
                //         $this.alert("비밀번호가 변경되었습니다. 비밀번호확인을 입력해주세요.");
                //         return false;
                //     }
                //     if($this.userMngSpec.userPswd != $this.userMngSpec.userPswdCnfm){
                //         $this.alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
                //         return false;
                //     }
                //     $this.chkData.isPwsdChng = true;
                // } else {
                //     $this.chkData.isPwsdChng = false;
                // }                
            }
            //빈값 체크
            const isEmpty = $this.slctRoleList.every(val => val === "");
            if(isEmpty){
                $this.alert("사용자 역할은 필수 입력입니다.");
                return false;
            }

            //빈값 ('') 제거
            $this.slctRoleList = $this.slctRoleList.filter(el => el !== '');

            //중복체크
            let isDupl = false;

            $this.slctRoleList.forEach((val, index, self) => {
                if(val != ''){
                    isDupl = self.findIndex((item) => item === val) !== index;
                }
            });
            if(isDupl){
                $this.alert("중복된 사용자역할이 있습니다.");
                return false;
            } 
            return true;
        },

        
        // 저장
        saveUserMng(){
            const $this = this;
            if($this.validationUserBaseAdd()){
                let params = {
                    userId         : $this.userMngSpec.userId,
                    userPswd       : $this.userMngSpec.userPswd,
                    pswdChk        : $this.userMngSpec.pswdChk,
                    userNm         : $this.userMngSpec.userNm,
                    empNo          : $this.userMngSpec.empNo,
                    deptNm         : $this.userMngSpec.deptNm,
                    jtitNm         : $this.userMngSpec.jtitNm,
                    posiNm         : $this.userMngSpec.posiNm,
                    emalAddr       : $this.userMngSpec.emalAddr,
                    mphnNo         : $this.userMngSpec.mphnNo,
                    entrDt         : DateUtil.dateToYYYYMMDD($this.userMngSpec.entrDt),
                    resgDt         : DateUtil.dateToYYYYMMDD($this.userMngSpec.resgDt),
                    rmrk           : $this.userMngSpec.rmrk,
                    useYn          : $this.userMngSpec.useYn,
                    roleList       : $this.slctRoleList,
                    crud           : $this.params.crud,
                    bchgRoleCntn   : $this.bchgRoleCntn,
                    bchgRoleCdList : $this.bchgRoleCdList,
                }

                $this.doPost('/cmon/env/userMng/saveUserMng.hb', params).then((res) => {
                    let result = res.data;
                    if (result.rtnCd == '0000') {
                        $this.alert("저장되었습니다.").then((result) => {
                            if ( result.isConfirmed ) {
                                $this.params.crud = 'U'
                                $this.searchList();
                            }
                        });
                    } else {
                        $this.alert(result.rtnMsg);
                    }
                })
            }
        },
        // // 삭제 컨펌
        deltCnfm () {
            const $this = this;
            
            if ($this.params.crud =='U') {
                $this.confirm({
                    content:  "사용자ID : " + $this.userMngSpec.userId + '<br> 사용자명 : ' + $this.userMngSpec.userNm + '<br> 사용자 정보를 삭제하시겠습니까?',
                    callback: {
                        yes() {
                            $this.deltUserBase();
                        }
                    }
                })
            } else {
                $this.alert('삭제할 사용자를 선택하세요.');
            }
        },
        // 사용자 정보 삭제
        deltUserBase() {
            const $this = this;
            
            let url = '/cmon/env/userMng/deleteUserMng.hb';
            let params = $this.userMngSpec;
            
            $this.doPost(url, params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {

                    $this.alert("삭제되었습니다.").then((result) => {
                        if ( result.isConfirmed ) {
                            $this.init();
                        }
                    });
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },
        // // 비밀번호 변경 팝업
        // popUpPage(){
        //     const $this = this;
        //     let params = {
        //         userId : $this.userMngSpec.userId,
        //         userNm : $this.userMngSpec.userNm
        //     };
        //     if(ValdUtil.isNull(params.userId) && ValdUtil.isNull(params.userNm)){
        //         $this.alert("비밀번호를 변경 할 사용자를 선택해주세요");
        //     } else {
        //         this.$refs.ChngPwsdModal.show();
        //         this.$refs.ChngPwsdModal.initData(params);
        //     }
        // },
        // 가입일자 날짜 선택
        onSelectedDatepickerEntrDt(selectedDate) {
            const $this = this;
            $this.userMngSpec.entrDt = selectedDate;
        },
        // 탈퇴일자 날짜 선택
        onSelectedDatepickerResgDt(selectedDate) {
            const $this = this;
            $this.userMngSpec.resgDt = selectedDate;
        },

        // 엑셀다운로드        
        downloadExcel(){
            const $this = this;
            let url    = '/cmon/env/userMng/selectListUserMngExcel.hb';
            let param  = _.cloneDeep($this.srchParams);
            let fileNm = '사용자목록_'+DateUtil.getCurrDate('YYYYMMDD')+'.xlsx';

            if($this.$refs.grid.getGridObj().jqGrid('getGridParam','records') < 1) {
                $this.alert('엑셀다운로드 대상이 없습니다');
                return false;
            }else{
                $this.confirm({
                    content:  "사용자 목록을 엑셀다운로드 하시겠습니까?",
                    callback: {
                        yes() {
                            $this.doDownExcel(url, param, fileNm);
                        }
                    }
                })
            }
        },
        // DateUtil에 export const DATETIME_FORMAT = DATE_FORMAT + '. ' + 'HH:mm';에 ss 가 없어서
        // 일자 포맷
        formatDttm: function(val) {
            let str = ''
            if(ValdUtil.isNotNull(val)){
                str = moment(val, 'YYYYMMDDHHmmss').format("YYYY-MM-DD. HH:mm:ss");
            }
            return str;
        },

         
        // //초기화
        reset(){
            const $this = this;
            $this.resetSrchParams();
            $this.resetParams();
            $this.resetList();
            $this.resetUserMngSpec();
        },
        // 검색조건 초기화
        resetSrchParams(){
            const $this = this;
            $this.srchParams = {
                userId : '',
                userNm : '',
                roleCd : '',
            }
        },
        // 파라미터 초기화
        resetParams(){
            const $this = this;
            $this.params = {
                crud         : 'C',
                selUserId    : '',
            };
        },
        // 리스트 초기화
        resetList(){
            const $this = this;
            $this.roleComboList  = Array(3).fill({colId : '', colNm : ''});
            $this.slctRoleList   = [];   // 선택된 역할 저장 
            $this.userRoleList   = [];   // 사용자 역할 리스트 저장용
            $this.bchgRoleCntn   = [];   // 변경 전 사용자역할
            $this.bchgRoleCdList = [];   // 변경 전 사용자역할코드
        },

        // //사용자정보 초기화
        resetUserMngSpec(){
            const $this = this;
            
            $this.userMngSpec = {
                userId          : '',
                userNm          : '',
                userPswd        : '',
                userPswdCnfm    : '',
                empNo           : '',
                deptNm          : '',
                jtitNm          : '',
                posiNm          : '',
                emalAddr        : '',
                mphnNo          : '',
                entrDt          : DateUtil.getCurrDate('YYYY-MM-DD'),
                resgDt          : '9999-12-31',
                rmrk            : '',
                useYn           : 'Y',
                gmdlLmitYn      : 'N',      // GPT모델_제한여부
                gmdlLmitNo      : '',       // GPT모델_제한_번호
                gmdlLmitObjCd   : '',		// GPT모델_제한_대상코드
                gmdlLmitObjNm   : '',		// GPT모델_제한_대상코드명
                gmdlLmitDt 		: '',		// GPT모델_제한_일자
                gmdlLmitTm 		: '',		// GPT모델_제한_시각
                gmdlLmitResnCd  : '',	    // GPT모델_제한_사유 코드
                gmdlLmitResnNM  : '',	    // GPT모델_제한_사유 코드명
                gmdlLmitCntn 	: '',	    // GPT모델_제한_내용
                gmdlLmitUserId 	: '',	    // GPT모델_제한_사용자 ID
                gmdlLmitUserNm  : '',
                // lginLockYn   : 'N',
                // lginLockDttm : '',
                ecousNo         : '',
                lmitToknCnt     : '',
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
                    $this.searchList();
                    $this.resetParams();
                    $this.resetList();
                    $this.resetUserMngSpec();
                    break;
                case 'save':
                    $this.saveUserMng();
                    break;
                case 'delete':
                    $this.deltCnfm();
                    break;
                default:
                    $this.alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
        },

        // 로그인 잠금 해제 버튼
        // btnLginUnlock(){
        //     const $this = this;
        //     if(ValdUtil.isNotNull($this.userMngSpec.userId)){
        //         if($this.userMngSpec.lginLockYn === 'Y'){
        //             $this.confirm({
        //                 content: $this.userMngSpec.userId + ' / ' + $this.userMngSpec.userNm + " 사용자의 로그인 잠금을 해제하시겠습니까?",
        //                 callback: {
        //                     yes(){
        //                         $this.updateLginUnLock();
        //                     }
        //                 }
        //             })
        //         } else if ($this.userMngSpec.lginLockYn === 'N'){
        //             $this.alert("로그인 잠금이 되어있지 않은 사용자입니다.");
        //         }
        //     } else{
        //         $this.alert("로그인 잠금을 해제할 사용자를 선택하세요.");
        //     }
        // },
        // // 로그인 잠금 해제
        // updateLginUnLock(){
        //     const $this = this;
        //     let params = {
        //         userId : $this.userMngSpec.userId
        //     }
        //     let users = $this.userMngSpec.userId +' / ' + $this.userMngSpec.userNm;
        //     $this.doPost('/cmon/env/userMng/updateLginUnLock.hb', params).then(function(res) {
        //         if(res.data.rtnCd ==='0000'){
        //             if(res.data.rtnData.result === 1){
        //                 $this.alert(users+ " 사용자의 로그인 잠금이 해제되었습니다.").then((res) =>{
        //                     if(res.isConfirmed) {
        //                         $this.init();
        //                     }
        //                 })
        //             }
        //         } else {
        //             $this.alert(res.data.rtnMsg);
        //         }
        //     })
        // },
    },
    computed: {
        //사용자 로그인 잠금여부
        formatLginLockYn(){
            const $this = this;
            let lginLockStat = "";
            if($this.userMngSpec.lginLockYn ==='Y'){
                lginLockStat = "예";
            } else if($this.userMngSpec.lginLockYn ==='N'){
                lginLockStat = "아니오";
            }
            return lginLockStat;
        },        
    },
    mounted: function() {
        const $this = this;
        $this.init();
    }   
}
</script>
