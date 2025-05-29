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
                        <input class="c-wd-40 ib" ref="srchWord" type="text" v-model="params.srchWord" v-on:keyup.enter="searchListMenuBase(true)">
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-50 ib">사용여부</h2>
                        <label v-for="el in code.ynCdList" :key="el">
                            <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="params.useYn" style="top:2px; left:-3px;" @change="searchListMenuBase(true)">
                            <p :class="el.cdVal === '' ?'pointer ib wd-30' : 'pointer ib wd-20'">{{ el.cdVal === '' ? '전체' : el.cdNm }}</p>
                        </label>
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="true" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- 메뉴 목록 -->
        <div class="section sectionL w-45">
            <div class="section-wrap">
                <h2 class="ib">메뉴 목록</h2>
                <button class="btn-exel-download only" v-on:click="downloadExcel()">
                    <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                    <p>다운로드</p>
                </button>
                <!-- 그리드 -->
                <Grid ref="grid" :dataParams="params" :paging="false" :sortable=true v-on:click="searchMenuBase()"></Grid>
            </div>
        </div>
        
        <!-- 상세정보 -->
        <!-- <div class="section section4 w-40-ml f-r m-t-30"> -->
        <div class="section sectionR w-55">
            <div class="section-wrap p-t-22">
                <h2 class="m-b-8">메뉴 정보</h2>
                <div class="section-part part1">
                    <div class="w-50 ib">
                        <span class="wd-80 essn">메뉴번호</span>
                        <input class="c-wd-80" type="text" v-model="menuBaseInfo.menuNo" :disabled="disabledMenuNo()" maxlength="5">
                    </div>
                    <div class="w-50 ib">
                        <span class="p-l-10 wd-65 essn">메뉴명</span>
                        <input class="c-wd-65" type="text" v-model="menuBaseInfo.menuNm" :disabled="disabledIsRoot()">
                    </div>
                    <div class="w-50 ib">
                        <span class="wd-80 essn">상위메뉴번호</span>
                        <div class="c-wd-80 ib">
                            <div class="input-btn w-100">
                                <input class="w-100" type="text" v-model="menuBaseInfo.upprMenuNo" disabled>
                                <button class="post-btn" @click="menuSrchPop()">
                                    <img src="@/assets/img/btn_search.png" alt="찾기">    
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="w-50 ib">
                        <span class="p-l-10 wd-65">상위메뉴명</span>
                        <input class="c-wd-65" type="text" v-model="menuBaseInfo.upprMenuNm" :disabled="true">
                    </div>
                    <div class="w-50 ib">
                        <span class="wd-80">메뉴URL</span>
                        <input class="c-wd-80" type="text" v-model="menuBaseInfo.menuUrl" :disabled="disabledIsRoot()">
                    </div>
                    <div class="w-50 ib">
                        <span class="p-l-10 wd-65">아이콘정보</span>
                        <input class="c-wd-65" type="text" v-model="menuBaseInfo.iconInfo" :disabled="disabledIsRoot()">
                    </div>
                    <div class="w-50 ib radio-box m-0">                        
                        <span class="wd-80">사용여부</span>
                        <label v-for="el in fltrYnCdList" :key="el" class="m-0 p-0">
                            <input type="radio" class="h-a wd-20" :value="el.cdVal" v-model="menuBaseInfo.useYn" :disabled="disabledIsRoot()">
                            <span class="ib wd-15 m-0">{{ el.cdVal === '' ? '' : el.cdNm }}</span>
                        </label>
                    </div>
                    <div class="w-50 ib">
                        <span class="p-l-10 wd-65">정렬순번</span>
                        <input class="c-wd-65" type="text" @input="inputOnlyNum()" v-model="menuBaseInfo.sortSeq" :disabled="disabledIsRoot()">
                    </div>
                    <div class="w-100 text-box">
                        <span class="wd-80">메뉴설명</span>
                        <textarea spellcheck="false" class="c-wd-80" style="height: 391px; max-height: 391px" name="" id="" cols="30" rows="10" v-model="menuBaseInfo.menuDesc" :disabled="disabledIsRoot()" ></textarea>
                    </div>
                </div>
                <div>
                    <h2 class="essn ib wd-80 f-l">메뉴 역할</h2>
                    <div class="section-part part2 c-wd-70 f-r ib">
                        <select class="w-33-m m-b-3" v-model="selectValList[idx]" v-for="(combo, idx) in roleComboList" :key="idx"  :disabled="disabledIsRoot()">
                            <option value = ''></option>
                            <option v-for="el in code.userRoleList" :key="el.colId" :value="el.colId">{{el.colNm}}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <UpprMenuSrchPopModal ref="UpprMenuSrchPopModal" :dataParams="params" @select="getMenuPopRowData"></UpprMenuSrchPopModal>
    </div>
</template>

<script>
import UpprMenuSrchPopModal  from '@/views/cmon/sys/UpprMenuSrchPop.vue'
import { reactive, ref, inject } from 'vue'
import { DateUtil         } from '@/utils/DateUtil.js'
import Grid from '@/components/grid/Grid.vue'
import SetButton from '@/components/SetButton.vue'

let specSearchFlag = ''; 
let menuRoleCds = [];       //  상세조회 후 메뉴역할 저장
// let roleCdCombo = [{}];     //  역할명 콤보생성을 위한

export default {
    components: {
        UpprMenuSrchPopModal,
        Grid,
        SetButton,
    },

    setup() {
        let code = reactive({
            userRoleList : [],
            ynCdList     : []

        });
        const colIdNmListData = { 'tblId'   :'tc_role_base',
                                  'colId'   :'role_cd',
                                  'colNm'   :'role_nm',
                                  'where'   : [
                                    {'andCol' :'1',
                                     'andCalc':'=',
                                     'andVal' :"'1'"}
                                  ],
                                  'orderby' : [
                                    {'orderCol' : 'role_cd'}
                                   ,{'orderCol' : 'role_nm'}
                                  ]
        };  
        const getColIdNmList = inject('getColIdNmList');
        getColIdNmList(colIdNmListData, code.userRoleList, 'N', null);

        const getCmonCdList = inject('getCmonCdList');
        getCmonCdList('YN', code.ynCdList, 'Y', null);  // YN / YN
        
        return {
            code,
            colIdNmListData,
        }
    },

    data: function() {
		return {
            params: {
                srchWord      : '',
                useYn         : '',
                crud          : 'C',
            },
            grdSpec: {
                menuNo        : '',
            },
            menuBaseInfo: {
                menuNo        : '',
                upprMenuNo    : '',
                upprMenuNm    : '',
                menuLevl      : '',
                menuUrl       : '',
                menuNm        : '',
                menuDesc      : '',
                iconInfo      : '',
                sortSeq       : '',
                useYn         : 'Y',
            },
            isRootChk         : false,
            roleComboList     : [],     // 메뉴역할 for문 위한 배열 
            selectValList     : [],     // 메뉴역할 선택된 값 저장하는 배열
            setMenuRoleList   : []      // 사용자역할 저장 리스트
        }
    },
    methods: {
        init() {
            const $this = this;
            $this.resetScreen();
            $this.initGrid();
            $this.initData();
            $this.searchListMenuBase();
            $this.CmonUtil.setFocus($this.$refs.srchWord);
        },
        initData(){
            const $this = this;
            $this.roleComboList = Array(12).fill({colId : '', colNm : ''});
        },

        inputOnlyNum(){
            const $this = this;
            
            $this.menuBaseInfo.sortSeq = $this.menuBaseInfo.sortSeq.replace(/[^0-9]/g, '');
        },

        //상위메뉴 팝업
        menuSrchPop() {
          this.$refs.UpprMenuSrchPopModal.show();
          this.$refs.UpprMenuSrchPopModal.init();
        },
        //상위메뉴 리턴
        getMenuPopRowData(popRowData) {
          const $this = this;
          $this.menuBaseInfo.upprMenuNo = popRowData.menuNo;
          $this.menuBaseInfo.upprMenuNm = popRowData.menuNm;
          $this.menuBaseInfo.useYn      = popRowData.useYn;
       },
        //화면 초기화
        resetScreen(){
            const $this = this;

            $this.params.srchWord = '';
            $this.params.useYn = '';
            specSearchFlag = '';
            //  검색조건 초기화
            $this.resetParams();
            //  그리드선택행 초기화
            $this.resetGrdSpec();
            //  메뉴정보 초기화
            $this.resetMenuBaseInfo();
            
            //  Grid 데이터 초기화
            $this.$refs.grid.clearGridData();
            $this.CmonUtil.setFocus($this.$refs.srchWord);
        },

        //  검색조건 초기화
        resetParams(){
            const $this = this;
            $this.params = {
                srchWord  : '',
                useYn     : '',
                roleCd    : '',
                crud      : 'C'
            };
        },

        //  그리드선택행 초기화
        resetGrdSpec(){
            const $this = this;
            $this.grdSpec = {
                menuNo: '',
            };
        },

        //  메뉴정보 초기화
        resetMenuBaseInfo(){
            const $this = this;
            $this.menuBaseInfo = {
                menuNo        : '',
                upprMenuNo    : '',
                upprMenuNm    : '',
                menuLevl      : '',
                menuUrl       : '',
                menuNm        : '',
                menuDesc      : '',
                iconInfo      : '',
                sortSeq       : '',
                useYn         : 'Y',
            };
            specSearchFlag      = '';
            $this.selectValList = [];
        },

        initBtn (){
            const $this = this;
            $this.resetScreen();
            $this.searchListMenuBase();

        },
        initGrid() {
            let $this = this;

            $this.gridObj = {
                url: '/cmon/sys/menuMng/selectListMenuBase.hb',
                colModels: [
                    {name:'menuNo'      ,label: '메뉴번호'      , width: 15  , align:'center' },
                    {name:'menuNm'      ,label: '메뉴명'        , width: 30  , align:'left'   },
                    {name:'upprMenuNo'  ,label: '상위메뉴번호'  , width: 15  , align:'center' },
                    {name:'upprMenuNm'  ,label: '상위메뉴명  '  , width: 20  , align:'left'   },
                    {name:'useYn'       ,label: '사용여부'      , width: 10  , align:'center' },
                    {name:'depth'       ,label: 'DEPTH'        , width: 15  , align:'right' , hidden: true},
                ],
                options: {
                    rownumbers: true,
                    height: 627,
                    onSelectRow : function(rowid){
                        $this.grdSpec.menuNo = $(this).jqGrid('getRowData', rowid).menuNo;
                        if($this.grdSpec.menuNo === '00000'){
                            $this.isRootChk = true;
                            $this.alert("Root Menu는 수정/삭제할 수 없습니다.");
                        } else {
                            $this.isRootChk = false;
                        }

                        $this.params.crud = 'U';
                    },
                },
            };
            $this.$refs.grid.init($this.gridObj);
        },

        searchListMenuBase() {
            const $this = this;
            specSearchFlag = '';
            //  그리드 선택행 초기화
            $this.resetGrdSpec();
            //  메뉴정보 초기화
            $this.resetMenuBaseInfo();
            //  Grid 데이터 초기화
            $this.$refs.grid.clearGridData();
            //  Grid 데이터 조회
            $this.$refs.grid.selectList(true);
        },

        // 메뉴 목록 Grid 행 클릭 시 해당 메뉴 상세 조회
        searchMenuBase () {
            const $this = this;
            const menuNo = $this.grdSpec.menuNo;
            menuRoleCds.length = 0;
                  
            if ($this.ValdUtil.isNotNull(menuNo)) {
                // 메뉴정보 조회
                $this.selectMenuBaseInfo();
            }
            // 클릭했던 행 정보 사용 후 비우기
            $this.grdSpec.menuNo = '';
        },

        // 메뉴정보 조회
        selectMenuBaseInfo(inMenuNo) {
            const $this = this;
            let url = '/cmon/sys/menuMng/selectMenuBase.hb';
            $this.selectValList = [];
            if ($this.ValdUtil.isNotNull(inMenuNo)) {
                //그리드 선택행 초기화
                $this.resetGrdSpec();
                $this.grdSpec.menuNo = inMenuNo;
            }
            // console.log(' ########### inMenuNo : ', inMenuNo)
            // console.log(' ########### $this.grdSpec.menuNo : ', $this.grdSpec.menuNo)
            let params = $this.grdSpec;

            $this.doPost(url, params).then(function (res) {
                //메뉴정보 초기화
                $this.resetMenuBaseInfo();
                let result = res.data;
                // console.log(' ########### result data selectMenuBaseInfo : ', res);
                if (result.rtnCd == '0000') {
                    specSearchFlag = 'Y';
                    //  상세정보 표시
                    // console.log(' ########### result data selectMenuBaseInfo : ', result.rtnData.menuBaseInfo);
                    $this.menuBaseInfo = result.rtnData.menuBaseInfo;
                    let roleCdCnt = result.rtnData.menuRoleInfo.length;
                    if(roleCdCnt >= 1){
                        for(let i = 0; i< roleCdCnt; i ++ ){
                            $this.selectValList.push(result.rtnData.menuRoleInfo[i].colId);
                        }
                    }
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },

        //메뉴정보 저장(add) VALIDATION
        validationMenuBaseAdd(){
            const $this = this;

            if(!$this.ValdUtil.valdLenNull($this.menuBaseInfo.menuNo      , 5   , '메뉴번호는')) return false;
            if(!$this.ValdUtil.valdLenNull($this.menuBaseInfo.menuNm      , 100 , '메뉴명은')) return false;
            if(!$this.ValdUtil.valdLenNull($this.menuBaseInfo.upprMenuNo  , 5   , '상위메뉴번호는')) return false;

           
            return true;
        },

        saveMenuBase() {
            const $this = this;
            let isDuplicate = false;
            $this.setMenuRoleList = [];

            if($this.isRootChk == true){
                $this.alert("Root Menu는 수정할 수 없습니다.");
                return false;
            }

            if(!$this.ValdUtil.valdLenNull($this.menuBaseInfo.menuNo      , 5   , '메뉴번호는')) return false;
            if(!$this.ValdUtil.valdLenNull($this.menuBaseInfo.menuNm      , 100 , '메뉴명은')) return false;
            if(!$this.ValdUtil.valdLenNull($this.menuBaseInfo.upprMenuNo  , 5   , '상위메뉴번호는')) return false;
            

            for(let i = 0; i < $this.selectValList.length ; i ++){
                $this.setMenuRoleList.push({'idenSeq': (i+1), 'roleCd':$this.selectValList[i]});
            }
            //빈값 체크
            const isAllEmpty     = $this.selectValList.every(value => value === "");
            if(isAllEmpty){
                $this.alert("메뉴역할은 필수 입력입니다.");
                return false;
            }
            //중복체크
            $this.setMenuRoleList.forEach((value, index, self) => {
                isDuplicate = self.findIndex((item) => item.roleCd === value.roleCd) !== index;
            });
            if(isDuplicate){
                $this.alert("중복된 메뉴역할이 있습니다.");
                return false;
            } 
  
            let url = '/cmon/sys/menuMng/saveMenuBase.hb';
            let sendParam = {
                crud         : $this.params.crud,
                menuNo       : $this.menuBaseInfo.menuNo,
                upprMenuNo   : $this.menuBaseInfo.upprMenuNo,
                upprMenuNm   : $this.menuBaseInfo.upprMenuNm,
                menuLevl     : $this.menuBaseInfo.menuLevl,
                menuUrl      : $this.menuBaseInfo.menuUrl,
                menuNm       : $this.menuBaseInfo.menuNm,
                menuDesc     : $this.menuBaseInfo.menuDesc,
                iconInfo     : $this.menuBaseInfo.iconInfo,
                sortSeq      : $this.menuBaseInfo.sortSeq,
                useYn        : $this.menuBaseInfo.useYn,
                menuRoleList : $this.setMenuRoleList
            };
            let inMenuNo = $this.menuBaseInfo.menuNo;

            // params.menuBaseList = $this.menuBaseInfo;
            // params.menuRoleList = $this.setMenuRoleList;

            $this.doPost(url, sendParam).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    // $this.alert('저장되었습니다');
                    // $this.searchListMenuBase();
                    // $this.selectMenuBaseInfo(inMenuNo);

                    $this.alert("저장되었습니다").then((result) => {
                        if ( result.isConfirmed ) {
                            $this.searchListMenuBase();
                            $this.selectMenuBaseInfo(inMenuNo);
                        }
                    });
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },
        removeMenuBase () {
            const $this = this;
            
            if($this.isRootChk == true){
                $this.alert("Root Menu는 삭제할 수 없습니다.");
                return false;
            }
            
            if (specSearchFlag =='Y') {
                $this.confirm({
                    title: '메뉴 삭제',
                    content: '메뉴 ' + $this.menuBaseInfo.menuNo + ' / ' + $this.menuBaseInfo.menuNm + ' 삭제하시겠습니까?',
                    callback: {
                        yes() {
                            $this.deleteMenuBase();
                        }
                    }
                })
            } else {
                $this.alert('삭제할 행을 선택하세요');
            }
        },

        // DB연결정보 delete
        deleteMenuBase() {
            const $this = this;
            
            let url = '/cmon/sys/menuMng/deleteMenuBase.hb';
            let params = $this.menuBaseInfo;

            // console.log(' ########### $this.menuBaseInfo.menuNo FOR DELETE : ', $this.menuBaseInfo.menuNo);
            
            $this.doPost(url, params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    // $this.alert('삭제되었습니다.');
                    // $this.searchListMenuBase();

                    $this.alert("삭제되었습니다.").then((result) => {
                        if ( result.isConfirmed ) {
                            $this.searchListMenuBase();
                        }
                    });
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },
        // 공통버튼(초기화, 조회, 저장, 삭제) 컴포넌트 핸들러
        onSetButtonClick (div) {
            const $this = this;
            switch ( div ) {
                case 'init':
                    // $this.resetScreen();
                    $this.initBtn();
                    break;
                case 'select':
                    $this.searchListMenuBase();
                    break;
                case 'save':
                    $this.saveMenuBase();
                    break;
                case 'delete':
                    $this.removeMenuBase();
                    break;
                default:
                    $this.alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
        },
        // 메뉴번호 활성화/비활성화 여부
        disabledMenuNo() {
            // console.log(' ########### disabledMenuNo specSearchFlag : ', specSearchFlag)
            if (specSearchFlag == 'Y') {
                return true;
            }

            return false;
        },
        disabledIsRoot() {
            let $this = this;
            // console.log(' ########### disabledMenuNo specSearchFlag : ', specSearchFlag)
            if ($this.isRootChk === true) {
                return true;
            }

            return false;
        },
        // 엑셀다운로드
        downloadExcel(){
            const $this = this;
            let url = '';
            let param = {};
            let fileNm = '';

            if($this.$refs.grid.getGridObj().jqGrid('getGridParam','records') < 1) {
                $this.alert('검색된 메뉴목록이 없습니다.');
                return false;
            }
            let labelsArray = $this.gridObj.colModels.map((obj) => {
                return obj.label;
            });
            url = '/cmon/sys/menuMng/selectListMenuBaseExcelDownload.hb';
            param = $this.params;
            param.excelHeader = labelsArray;
            fileNm = '메뉴목록_'+DateUtil.getCurrDate('YYYYMMDD')+'.xlsx';
            $this.doDownExcel(url, param, fileNm);
        },
    },
    computed: {
        fltrYnCdList(){
            return this.code.ynCdList.filter(el => el.cdVal != '');
        }
    },
    mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>
