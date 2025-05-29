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
                        <input class="c-wd-40 ib" ref="srchWord" type="text" v-model="params.srchWord" v-on:keyup.enter="searchRoleList(true)">
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-50 ib">사용구분</h2>
                        <label v-for="el in fixRoleYnList" :key="el">
                            <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="params.fixRoleYn" style="top:2px; left:-3px;" @change="searchRoleList(true)">
                            <p :class="el.cdVal === '' ?'pointer ib wd-30' : 'pointer ib wd-40'">{{el.cdNm}}</p> 
                        </label>
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="true" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- 역할목록 -->
        <div class="section sectionL w-45">
            <div class="section-wrap">
                <h2 class="ib">역할 목록</h2>
                <button class="btn-exel-download only" v-on:click="downloadExcel()">
                    <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                    <p>다운로드</p>
                </button>
                <!-- 그리드 -->
                <div class="wrapper-content">
                    <Grid ref="roleList" :dataParams="params" :paging="true"></Grid>
                </div>
            </div>
        </div>

        <!-- 상세정보 -->
        <div class="section sectionR w-55">
            <div class="section-wrap p-b-0">
                <h2 class="w-35 ib">역할 정보</h2>
                <div class="btn-group-box">        
                    <button class="btn-normal m-0 btn-normal-flex" @click="userMngOpen()">
                        <font-awesome-icon  class="ib m-r-5" :icon="['fas', 'up-right-from-square']"/>
                        <p class="ib">사용자관리</p>
                    </button>
                    <button class="btn-normal m-0 btn-normal-flex m-l-5" @click="menuMngOpen()">
                        <font-awesome-icon  class="ib m-r-5" :icon="['fas', 'up-right-from-square']"/>
                        <p class="ib">메뉴관리</p>
                    </button>      
                </div>
                <div class="section-part part1 w-100 " style="position:relative; top:-3px !important;">
                    <div class="w-100">
                        <div class="w-37 ib">
                            <div class="wd-65 ib m-0">
                                <span class="essn">역할코드</span>
                            </div>
                            <div class="c-wd-65 ib m-0">
                                <input class="w-100" type="text" v-model="roleBaseInfo.roleCd" :disabled="isSelectedRoleRow">
                            </div>
                        </div>
                        <div class="w-37 ib">
                            <div class="wd-50 ib m-0">
                                <span class="essn">역할명</span>
                            </div>
                            <div class="c-wd-50 ib m-0">
                                <input class="w-100" type="text" v-model="roleBaseInfo.roleNm">
                            </div>
                        </div>
                        <div class="w-26 ib">
                            <!-- SYS_ADMIN -->
                            <div class="wd-65 ib m-0">
                                <span class="essn">사용구분</span>
                            </div>
                            <div class="radio-box m-0 ib c-wd-65">
                                <label class="m-0">
                                    <input type="radio" name="fixRoleYn" id="fixRoleYnN" v-model="roleBaseInfo.fixRoleYn"
                                        value="N" checked :disabled="isUserDisabled"> 사용자정의
                                </label>
                                <label class="m-0 m-l-5">
                                <input type="radio" name="fixRoleYn" id="fixRoleYnY" v-model="roleBaseInfo.fixRoleYn"
                                    value="Y" :disabled="isSysDisabled"> 시스템고정
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-100 ib">
                            <div class="wd-65 ib m-0 f-l">
                                <span>설명</span>
                            </div>
                            <div class="c-wd-55 ib m-0">
                                <textarea spellcheck="false" style="height:623px; max-height:623px;" class="w-100" cols="30" rows="10" v-model="roleBaseInfo.rmrk"></textarea>
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
import { DateUtil } from '@/utils/DateUtil.js'
import Grid from '@/components/grid/Grid.vue'
import SetButton from '@/components/SetButton.vue'
import { SessionUtil } from '@/utils/SessionUtil'
import { CmonUtil } from '@/utils/CmonUtil'
import { ValdUtil } from '@/utils/ValdUtil'

export default {
    components: {
        Grid,
        SetButton,
    },
    setup() {
        let etcGridId    = reactive({});
        let etcPagerId   = reactive({});
        let etcWrapperId = reactive({});

        let objectId     = Math.random().toString(36);
        objectId         = objectId.replaceAll('.', '');
        etcGridId        = 'grid_list_' + objectId;
        etcPagerId       = 'pager_list_' + objectId;
        etcWrapperId     = 'list_wrapper_' + objectId;

        // 사용구분 여부YN 리스트
        let fixRoleYnList =[
                {cdVal : ""     , cdNm : "전체"  },
                {cdVal : "Y"    , cdNm : "시스템"},
                {cdVal : "N"    , cdNm : "사용자"},
        ];
        return {
            etcGridId,
            etcPagerId,
            etcWrapperId,
            fixRoleYnList
        }
    },

    data: function () {
        return {
            params: {
                srchWord          : '',     // 검색조건 
                fixRoleYn         : '',     // 검색조건 구분
                crud              : 'C',    // crud
            },
            roleBaseInfo: {
                roleCd            : '',     // 상세정보 roleCd
                roleNm            : '',     // 상세정보 roleNm
                fixRoleYn         : 'N',    // 상세정보 fixRoleYn
                rmrk              : '',     // 상세정보 rmrk
            },
            isFixRoleChck         : false,  // 사용자/시스템 구분 여부 // Y: 시스템고정 / N:사용자정의
            isSelectedRoleRow     : false,  // 역할목록 그리드 셀 선택여부
            isRoleChck            : '00',   // 사용자 역할 체크여부 00: 일반 / 10: (SYS_ADMIN)관리자 / 20: (SYS_OPER)운영자
        }
    },

    methods: {
        init() {
            const $this = this;

            let userRoleList = SessionUtil.getUserRoleList();
            if (userRoleList.some(item => item.roleCd == 'SYS_ADMIN')) {
                $this.isRoleChck = '10';
            } else if (userRoleList.some(item => item.roleCd == 'SYS_OPER')) {
                $this.isRoleChck = '20';
            } else {
                $this.isRoleChck = '00';
            }
            $this.CmonUtil.setFocus($this.$refs.srchWord);
            $this.resetParams();
            $this.initGrid();
        },

        initGrid() {
            let $this = this;

            //역할 목록 그리드
            let gridObj = {
                url: '/cmon/sys/roldCdMng/selectListRoleBase.hb',
                colModels: [
                    { name: 'roleCd'        , label: '역할코드'  , width: 35    , align: 'left' },
                    { name: 'roleNm'        , label: '역할명'    , width: 35    , align: 'left' },
                    { name: 'fixRoleYnNm'   , label: '구분'      , width: 20    , align: 'center' },
                    { name: 'fixRoleYn'     , label: '구분코드'  , hidden: true }
                ],
                options: {
                    rownumbers: true,
                    height: 599,
                    onSelectRow: function (rowid) {
                        $this.roleBaseInfo.roleCd    = $(this).jqGrid('getRowData', rowid).roleCd;
                        $this.roleBaseInfo.fixRoleYn = $(this).jqGrid('getRowData', rowid).fixRoleYn;
                        if($(this).jqGrid('getRowData', rowid).fixRoleYn == 'Y'){
                            $this.isFixRoleChck = true;
                        } else {
                            $this.isFixRoleChck = false;
                        }
                        
                        $this.params.crud = 'U';
                        
                        $this.searchRoleBaseInfo();
                    },
                },

            };
            $this.$refs.roleList.init(gridObj);
            $this.searchRoleList();
        },
        //역할목록 조회
        searchRoleList(){
            const $this = this;
            $this.$refs.roleList.selectList(true);
        },
        //  역할목록 그리드 행 선택
        searchRoleBaseInfo() {
            const $this = this;
            if ($this.ValdUtil.isNotNull($this.roleBaseInfo.roleCd)) {
                if($this.ValdUtil.isNotNull($this.roleBaseInfo.fixRoleYn)){
                    //  역할정보상세 조회
                    $this.selectRoleBaseInfo();
                }
            }
        },

        //  역할정보상세 조회
        selectRoleBaseInfo() {
            const $this = this;
            let params  = {
                roleCd    : $this.roleBaseInfo.roleCd,
                fixRoleYn : $this.roleBaseInfo.fixRoleYn
            }; 
            $this.doPost('/cmon/sys/roldCdMng/selectRoleBase.hb', params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    $this.roleBaseInfo   = result.rtnData.roleBaseInfo;
                    $this.isSelectedRoleRow = true;
                } else {
                    $this.alert(result.rtnMsg);
                }
            }) ;
        },


        isValid(){
            const $this = this;
            
            // null 체크 및 길이 체크 (data / 길이 / msg / null 체크 여부=디폴트 true)
            if (!$this.ValdUtil.valdLenNull($this.roleBaseInfo.roleCd, 20, '역할코드는')) return false;
            if (!$this.ValdUtil.valdLenNull($this.roleBaseInfo.roleNm, 40, '역할명은')) return false;

            return true;
        },

        // 저장
        saveRoleBaseInfo(){
            let  $this = this;
            if($this.isValid()){
               

                let params = {
                    roleCd      : $this.roleBaseInfo.roleCd,
                    roleNm      : $this.roleBaseInfo.roleNm,
                    fixRoleYn   : $this.roleBaseInfo.fixRoleYn,
                    rmrk        : $this.roleBaseInfo.rmrk,
                    crud        : $this.params.crud,
                }
            
                $this.doPost('/cmon/sys/roldCdMng/saveRoleBaseInfo.hb', params).then(function (res) {
                    let result = res.data;
                    if (result.rtnCd == '0000') {
                        $this.alert("저장되었습니다").then((result) => {
                            if (result.isConfirmed) {
                                $this.resetScreen();
                                $this.searchRoleList();
                            }
                        });
                    } else {
                        $this.alert(result.rtnMsg);
                    }
                })
            }
        },  

        removeRoleBase() {
            const $this = this;

            // if($this.isRoleChck != '10'){
            //     $this.alert('관리자만 시스템고정 역할을 삭제할 수 있습니다.');
            //     return false;
            // }
            if($this.isFixRoleChck === true){
                $this.alert("시스템고정 역할은 삭제할 수 없습니다.");
                return false;
            }

            if ($this.isSelectedRoleRow == true) {
                $this.confirm({
                    title: '역할코드 삭제',
                    content: '역할코드 ' + $this.roleBaseInfo.roleCd + ' / ' + $this.roleBaseInfo.roleNm + ' 삭제하시겠습니까?',
                    callback: {
                        yes() {
                            $this.deleteRoleBase();
                        }
                    }
                })
            } else {
                $this.alert('삭제할 역할 목록의 행을 선택하세요.');
            }
        },

        // 역할정보 delete
        deleteRoleBase() {
            const $this = this;

            let url = '/cmon/sys/roldCdMng/deleteRoleBase.hb';
            let params = $this.roleBaseInfo;

            // console.log(' ########### $this.roleBaseInfo.roleCd FOR DELETE : ', $this.roleBaseInfo.roleCd);
            $this.doPost(url, params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    $this.alert("삭제되었습니다.").then((result) => {
                        if (result.isConfirmed) {
                            $this.resetScreen();
                            $this.searchRoleList();
                        }
                    });
                } else {
                    $this.alert(result.rtnMsg);
                }
            })

        },

        //  화면 초기화
        resetScreen() {
            const $this = this;

            $this.params.srchWord = '';
            $this.params.fixRoleYn = '';
            //  검색조건 초기화
            $this.resetParams();
            // $this.initGrid();
            $this.$refs.roleList.clearGridData();
            $this.searchRoleList();

            $this.CmonUtil.setFocus($this.$refs.roleCd);
        },

        //  검색조건 초기화
        resetParams() {
            const $this = this;
            $this.params = {
                srchWord       : '',
                fixRoleYn      : '',
                crud           : 'C'

            }
            $this.roleBaseInfo = {
                roleCd         : '',
                roleNm         : '',
                fixRoleYn      : 'N',
                rmrk           : '',
            }
            $this.isFixRoleChck     = false;
            $this.isSelectedRoleRow = false;

            
        },

        // 공통버튼(초기화, 조회, 저장, 삭제) 컴포넌트 핸들러
        onSetButtonClick(div) {
            const $this = this;
            switch (div) {
                case 'init':
                    $this.resetScreen();
                    break;
                case 'select':
                    $this.searchRoleList();
                    break;
                case 'save':
                    $this.saveRoleBaseInfo();
                    break;
                case 'delete':
                    $this.removeRoleBase();
                    break;
                default:
                    $this.alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
    },

        // 엑셀다운로드
        downloadExcel() {
            const $this = this;
            let param = $this.params;

            if ($this.$refs.roleList.getGridObj().jqGrid('getGridParam', 'records') < 1) {
                $this.alert('검색된 역할목록이 없습니다.');
                return false;
            }
            $this.doDownExcel('/cmon/sys/roldCdMng/selectListRoleCdMngExcel.hb', param, '역할목록_' + DateUtil.getCurrDate('YYYYMMDD') + '.xlsx');
        },

        // 사용자관리 이동
        userMngOpen() {
            const $this = this;
            let params ={}
            if(ValdUtil.isNotNull(this.roleBaseInfo.roleCd)){
                params['roleCd'] =$this.roleBaseInfo.roleCd;
            }
            CmonUtil.setPageLink('E1010',params);
        },

        // 메뉴관리 이동
        menuMngOpen() {
            const $this = this;
            CmonUtil.setPageLink('E2030');
        },
    },
    computed:{
        //사용자지정 disabled 여부
        isUserDisabled(){
            return this.isRoleChck === '00'
        },
        //시스템고정 disabled 여부
        isSysDisabled(){
            return this.isRoleChck === '00' || this.isRoleChck === '20'
        }        
    },
    watch: {
    },
    mounted: function () {
        let $this = this;
        $this.init();
    }
}
</script>
