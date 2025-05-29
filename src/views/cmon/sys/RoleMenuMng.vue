<template>
    <div>
        <!-- 검색 조건 -->
        <div class="section section1">
            <div class="search-box search2">
                <div class="input-box w-100">
                    <div class="w-5 ib">
                        <h1>검색조건</h1>
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-40 ib">검색어</h2>
                        <input class="c-wd-40 ib" ref="srchWord" type="text" v-model="params.srchWord" v-on:keyup.enter="selectGridList(true)">
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-50 ib">사용여부</h2>
                         <label v-for="el in code.ynCdList" :key="el">
                            <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="params.useYn" style="top:2px; left:-3px;" @change="selectGridList(true)">
                            <p :class="el.cdVal === '' ?'pointer ib wd-30' : 'pointer ib wd-20'">{{ el.cdVal === '' ? '전체' : el.cdNm }}</p>
                        </label>
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="false" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>
        <!--메뉴목록 -->
        <div class="section sectionL w-46">
            <div class="section-wrap p-t-22">
                <h2 class="m-b-10">메뉴목록</h2>
                <div class="wrapper-content">
                    <Grid ref="menuMngList" :dataParams="params"></Grid>
                </div>
            </div>
        </div>
        <div class="w-2 ib t-a-c">
            <div class="btn-box w-100 p-rl" style="top:300px; left:-5px;">
                <button class="btn-normal h-35 m-b-5">
                    <font-awesome-icon :icon="['fas', 'angle-right']" style="height:30px;" @click="clckRightBtn" />
                </button>
                <button class="btn-normal h-35">
                    <font-awesome-icon :icon="['fas', 'angle-left']" style="height:30px;" @click="clckLeftBtn" />
                </button>
            </div>
        </div>
        <!-- 권한목록 -->
        <div class="section sectionR w-52">
            <div class="section-wrap p-t-15">
                <div class="section-part m-0 p-0">
                    <h2 class="ib">역할목록</h2>
                    <div class="w-35 ib p-l-15">
                        <span class="essn wd-30">역할</span>
                        <select @change="selectRoleMenuInfo()" v-model="params.roleCd">
                            <option value=''></option>
                            <option v-for="el in code.roleCdList" :key="el.colId" :value="el.colId">{{ el.colNm }}</option>
                        </select>
                    </div>
                </div>
                <div class="wrapper-content ">
                    <Grid ref="roleMenuList" :dataParams="params" :paging="false" :sortable="true"></Grid>
                </div>
            </div>
        </div>
    </div>
</template>
    
<script>
import { inject, reactive } from 'vue'
import Grid from '@/components/grid/Grid.vue'
import SetButton from '@/components/SetButton.vue'
import { ValdUtil } from '@/utils/ValdUtil'
import { GridUtil } from '@/utils/GridUtil'

export default {
    components: {
        Grid,
        SetButton
    },
    setup() {
        let code = reactive({
            roleCdList : [],
            ynCdList   : []
        });
        const getColIdNmList = inject('getColIdNmList');
        const roleCdListData = {
              'tblId': 'tc_role_base'
            , 'colId': 'role_cd'
            , 'colNm': 'role_nm'
            , 'where': []
            , 'orderby': [
                { 'orderCol': 'ROLE_CD' }
            ]
        }
        getColIdNmList(roleCdListData, code.roleCdList, 'N', null);

        const getCmonCdList = inject('getCmonCdList');
        getCmonCdList('YN', code.ynCdList, 'Y', null);  // YN / YN
        
        return {
            code,
        }
    },
    data() {
        return {
            params: {
                roleCd               : '',      // 권한목록 권한 코드
                srchWord             : '',      // 검색어
                useYn                : '',      // 사용여부
                isUpprMenuChk        : false,   // 권한목록 상위메뉴 체크여부
            }
            , menuMngList            : []      // 메뉴목록 
            , roleMenuList           : []      // 권한목록
            , selectLeftObjRowData   : []      // 메뉴목록 체크박스 선택값
            , selectRightObjRowData  : []      // 권한목록 체크박스 선택값
            , allMenuInfoList        : []      // 메뉴목록 전체 리스트
            , moveMenuInfoList       : []      // 메뉴목록 -> 권한목록 이동 데이터 체크박스 체크여부리스트
            , selectLeftAllData      : []      // 상위메뉴포함 메뉴목록 체크박스 선택값
        }
    }
    , methods: {
        init() {
            const $this = this;
            $this.initGrid();
            $this.selectGridList();
            $this.CmonUtil.setFocus(this.$refs.srchWord);
        }
        //그리드 생성
        , initGrid() {
            const $this = this;
            //메뉴목록Grid
            let gridObjMenuList = {
                url: '/cmon/sys/roleMenuMng/selectListRoleMenuMng.hb'
                , colModels: [
                    { name: 'menuNo'        , label: '메뉴번호'      , width: 10        , align: 'center'  }
                    , { name: 'treeMenuNm'  , label: '메뉴명'        , width: 30        , align: 'left'    } 
                    , { name: 'menuNm'      , label: '메뉴명'        , width: 30        , align: 'left'    , hidden: true  }
                    , { name: 'upprMenuNo'  , label: '상위메뉴번호'  , width: 10        , align: 'center'  }
                    , { name: 'upprMenuNm'  , label: '상위메뉴명'    , width: 20        , align: 'left'    }
                    , { name: 'useYn'       , label: '사용여부'      , width: 10        , align: 'center'  }
                    , { name: 'menuPath'    , label: 'path'          , width: 10        , align: 'center'  , hidden: true }
                    , { name: 'sortSeq'     , label: '정렬순번'       , width: 10       , align: 'center'  , hidden: true  }
                    , { name: 'menuLevl'    , label: '메뉴레벨'      , width: 10        , align: 'center'  , hidden: true  }
                ]
                , options: {
                    multiselect: true,
                    loadonce: true,
                    onSelectRow(rowid, val, e) {
                        //선택된 리스트
                        $this.selectLeftObjRowData = GridUtil.getCheckedList($(this));
                        //선택된 행의 데이터
                        let selectRowVal = $(this).jqGrid('getRowData', rowid);
                        // 전체 데이터 id
                        const allRowIds  = $(this).jqGrid('getDataIDs');
                        let allData      = $(this).jqGrid('getGridParam', 'data');
                        let selectPath   = selectRowVal.menuPath.split(',');
                        let menuInfo     = null;
                        let menuInfoList = [];

                        if (selectRowVal.menuLevl === '3') {
                            $this.allMenuInfoList = [];

                            _.forEach(selectPath, function (data, idx) {
                                menuInfo = _.find(allData, function (item) {
                                    return item.sortSeq === parseInt(data);
                                });

                                if (menuInfo != null) {
                                    $this.allMenuInfoList.push(menuInfo);
                                    if (menuInfo.menuNo !== selectRowVal.menuNo) {
                                        menuInfoList.push(menuInfo._id_);
                                    }
                                }
                            });
                            $this.$nextTick(() => {
                                $this.enableChkBox(menuInfoList);
                            })
                        }
                    },
                    onSelectAll(rowids, status) {
                        $this.selectLeftObjRowData = GridUtil.getCheckedList($(this));
                    },
                    gridComplete() {
                        if ($this.menuMngList.length == 0) {
                            $this.menuMngList = $(this).jqGrid('getRowData');
                        }
                    }

                }
            }
            $this.$refs.menuMngList.init(gridObjMenuList);

            //권한목록Grid
            let gridObjRoleList = {
                url: '/cmon/sys/roleMenuMng/selectListRoleMng.hb'
                ,colModels: [
                    { name: 'menuNo'        , label: '메뉴번호'      , width: 10    , align: 'center' }
                    ,{ name: 'treeMenuNm'   , label: '메뉴명'        , width: 30    , align: 'left'   }
                    , { name: 'menuNm'      , label: '메뉴명'        , width: 30    , align: 'left'    , hidden: true }
                    , { name: 'upprMenuNo'  , label: '상위메뉴번호'  , width: 10    , align: 'center' }
                    , { name: 'upprMenuNm'  , label: '상위메뉴명'    , width: 20    , align: 'left'   }
                    , { name: 'useYn'       , label: '사용여부'      , width: 10    , align: 'center' , hidden: true  }
                    , { name: 'menuPath'    , label: 'path'         , width: 10     , align: 'center' , hidden: true  }
                    , { name: 'sortSeq'     , label: '정렬순번'     , width: 10     , align: 'center' , hidden: true  }
                    , { name: 'menuLevl'    , label: '메뉴레벨'     , width: 10     , align: 'center' , hidden: true }
                ]
                , options: {
                    multiselect: true,
                    onSelectRow(rowid, val, e) {
                        $this.selectRightObjRowData = GridUtil.getCheckedList($(this));
                    },
                    onSelectAll(rowids, status) {
                        $this.selectRightObjRowData = GridUtil.getCheckedList($(this));
                    },
                }
            }
            $this.$refs.roleMenuList.init(gridObjRoleList);
        }
        //그리드 조회
        ,selectGridList() {
            const $this = this;
            $this.$refs.menuMngList.selectList(true);
            // $this.$refs.roleMenuList.clearGridData(); //roleMenuList 초기화
            // $this.reset();
            $this.CmonUtil.setFocus(this.$refs.srchWord);
        },
        //메뉴목록 그리드 체크박스 체크
        enableChkBox(menuInfoList) {
            let $this = this;
            const grid = $this.$refs.menuMngList.getGridObj();
            
            menuInfoList.forEach(el => {
                grid.jqGrid('resetSelection', el);
                grid.jqGrid('setSelection', el, false);
            })
            $this.selectLeftAllData = GridUtil.getCheckedList(grid);
        },
        // 메뉴목록 -> 권한목록 ">" 버튼
        clckRightBtn() {
            const $this = this;

            let menuGrid        = $this.$refs.menuMngList.getGridObj();         // 메뉴목록 그리드
            let menuGridValList = GridUtil.getCheckedList(menuGrid);            // 메뉴목록 그리드 체크박스 체크된 데이터
            let roleGrid        = $this.$refs.roleMenuList.getGridObj();        // 권한목록
            let roleGridParam   = roleGrid.jqGrid('getGridParam', 'data');      // 권한목록 전체 데이터
            if (menuGridValList.length <= 0) {
                $this.alert("추가할 행을 선택해주세요.");
                return false;
            }
            if (ValdUtil.isNull($this.params.roleCd)) {
                $this.alert("권한목록을 선택해주세요.");
                return false;
            }
           
            let intrSctVal = menuGridValList.filter(valA => roleGridParam.some(valB => valA.menuNo === valB.menuNo));  //menuGridValList 와 roleGridParam 공통된 메뉴 번호 
            
            let extVal     = menuGridValList.filter(valA => !roleGridParam.some(valB => valA.menuNo === valB.menuNo));     //menuGridValList의 여집합
            
            let insrtList  = []; // 권한목록에 전달할 데이터 넣는 리스트
            
            // 권한목록에 값이 없을 때 >> menuGridValList 인서트
            if(roleGridParam.length === 0){
                insrtList.push(menuGridValList);
            }
            //공통된 메뉴번호가 있을 때 >> 여집합만 인서트 
            else if (intrSctVal.length > 0) {
                insrtList.push(extVal);

            // 공통된 메뉴번호가 없고 권한목록 값이 있을 때 >> menuGridValList  인서트
            } else if (!intrSctVal.length > 0) {
                insrtList.push(menuGridValList);
            } 

            // 메뉴목록에 선택된 데이터들의 메뉴번호만 가져옴 / setSelection을 할때 필요한 id 찾기 위함
            let selectedMenuNoList = [];
            for(let menuInfo of menuGridValList){
                selectedMenuNoList.push(menuInfo.menuNo);
            }

            $this.$refs.roleMenuList.setGridData(insrtList, true);
            roleGrid.jqGrid('sortGrid', 'sortSeq', true);                  // 그리드 정렬

            // 권한목록의 데이터 길이만큼 selectedMenuNoList안에 있는 데이터의 id를 찾고 체크박스          
            for (let param of roleGridParam) {
                if (selectedMenuNoList.find(bItem => bItem === param.menuNo)) {
                    roleGrid.jqGrid('setSelection', param.id);
                }
            }
            $this.roleMenuList = roleGrid.jqGrid('getRowData');

        },
        clckLeftBtn() {
            const $this = this;
            let gridObj             = $this.$refs.roleMenuList.getGridObj();       // 권한목록
            let getGridParamData    = gridObj.jqGrid('getGridParam', 'data');      // 권한목록 gridData
            let selectedRowIds      = gridObj.jqGrid('getGridParam', 'selarrrow'); //선택된 행을 가져옴
            let selectedDataList    = [];                                          // 체크박스 선택된 데이터
            let unSelectedDataList  = [];                                          // 체크박스 선택되지 않은 데이터
            let upprMenuSortSeqList = [];                                          // 상위 메뉴의 sortSeq 저장 리스트
            let lowrMenuPathList    = [];                                          // 메뉴레벨이 3인 메뉴의 menuPath 저장 리스트
            let lowrmenuPath        = null;                                        // 메뉴레벨이 3인 메뉴의 menuPath 

            // 체크박스가 선택된 데이터 리스트
            getGridParamData.forEach(function(rowData) {
                var rowId = rowData.id;
                if (selectedRowIds.includes(rowId)) {
                    selectedDataList.push(rowData);
                }
            });

            // 체크박스가 선택되지 않은 데이터 리스트
            getGridParamData.forEach(function(rowData) {
                var rowId = rowData.id;
                if (!selectedRowIds.includes(rowId)) {
                    unSelectedDataList.push(rowData);
                }
            });
          
            // 체크박스가 선택된 리스트에서 메뉴레벨이 1 또는 2가 있는지 확인 
            selectedDataList.forEach( item =>{
                if (parseInt(item.menuLevl) === 1 || parseInt(item.menuLevl) === 2) {
                    let itemToStr = item.sortSeq.toString();
                    upprMenuSortSeqList.push(itemToStr);        //있으면 해당 메뉴의 sortSeq를 sortSeqList에 푸시
                }
            })
           
            // 체크박스가 선택되지 않은 리스트에서 menuPath를 가져옴
            unSelectedDataList.forEach( item =>{
                lowrmenuPath = item.menuPath.split(",");
                for(let menuPath of lowrmenuPath){
                    lowrMenuPathList.push(menuPath);
                }
            })

            // lowrmenuPathList 중복 제거
            let noDuplMenuPathList = [...new Set(lowrMenuPathList)];

            // noDuplMenuPathList 리스트의 길이만큼 반복
            noDuplMenuPathList.forEach(item => {
                // sortSeqList안의 메뉴레벨이 1 또는 2의 SortSeq가 noDuplMenuPathList 안에 있는지 체크
                if (upprMenuSortSeqList.length != 0) {
                    if (noDuplMenuPathList.some(value => upprMenuSortSeqList.includes(value))) {
                        $this.alert("하위 메뉴가 존재할 경우, 상위 메뉴를 삭제할 수 없습니다.");
                        $this.params.isUpprMenuChk = true;
                    } else {
                        $this.params.isUpprMenuChk = false;
                    }
                } else {
                    $this.params.isUpprMenuChk = false;
                }
            });
            
            if (!$this.params.isUpprMenuChk) {
                let menuGrid           = $this.$refs.menuMngList.getGridObj();              // 메뉴목록 그리드
                let menuGridParam      = menuGrid.jqGrid('getGridParam', 'data');           // 메뉴목록 전체 데이터
                let roleGrid           = $this.$refs.roleMenuList.getGridObj();             // 권한목록 그리드
                let roleGridValList    = GridUtil.getCheckedList(roleGrid);                 // 권한목록 체크 데이터
                let selectedMenuNoList = [];                                                // 권한목록에서 체크박스가 체크된 데이터 리스트
                let checkIds           = gridObj.jqGrid("getGridParam", "selarrrow") + "";  // 다건
                //let checkIds = gridObj.jqGrid("getGridParam","selrow") + "";              // 단건

                for(let menuInfo of roleGridValList){
                    selectedMenuNoList.push(menuInfo.menuNo);
                }
                
                for(let param of menuGridParam){
                    if (selectedMenuNoList.find(bItem => bItem === param.menuNo)) {
                        menuGrid.jqGrid('resetSelection', param._id_);
                        menuGrid.jqGrid('setSelection', param._id_);
                    }
                }
                if (ValdUtil.isNotNull($this.params.roleCd)) {
                    if (checkIds == "" || checkIds == "null") {
                        $this.alert("삭제할 행을 선택해주십시요.");
                        return false;
                    }
                    let checkId = checkIds.split(",");
                    _.forEach(checkId, function (val, idx) {
                        $this.$refs.roleMenuList.getGridObj().jqGrid('delRowData', val);
                    });

                } else {
                    $this.alert("권한 목록을 선택해주세요.");
                }
            }
        },
        // 권한목록 저장
        saveRoleMenuList() {
            const $this = this;
            GridUtil.gridCancelEdit($this.$refs.roleMenuList.getGridObj());
            let getRowData = $this.$refs.roleMenuList.getGridObj().jqGrid("getRowData");
            let param = {
                roleCd       : $this.params.roleCd,
                roleMenuList : getRowData
            }
            $this.doPost('/cmon/sys/roleMenuMng/saveRoleMenuMng.hb', param).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    $this.alert("저장되었습니다");
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
            $this.reset();
        },
        // 권한목록 조회
        selectRoleMenuInfo() {
            const $this = this;
            let params = {
                roleCd: $this.params.roleCd
            }
            $this.doPost('/cmon/sys/roleMenuMng/selectListRoleMng.hb', params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {

                    $this.roleMenuList = result.rtnData.roleMenuList;
                    $this.$refs.roleMenuList.clearGridData();
                    $this.$refs.roleMenuList.setGridData($this.roleMenuList, true);
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
            $this.$refs.menuMngList.selectList(true);
        }, 
        // 초기화
        reset() {
            const $this = this;
            $this.params.roleCd         = '';
            $this.params.srchWord       = '';
            $this.params.useYn          = '';
            $this.params.isUpprMenuChk  = false;
            $this.$refs.roleMenuList.clearGridData();
            $this.$refs.menuMngList.clearGridData();
            $this.$refs.menuMngList.selectList(true);

            $this.menuMngList           = [];
            $this.roleMenuList          = [];
            $this.selectLeftObjRowData  = [];
            $this.selectRightObjRowData = [];
            $this.allMenuInfoList       = [];
            $this.moveMenuInfoList      = [];

            $this.CmonUtil.setFocus(this.$refs.srchWord);
        }
        //공통버튼(초기화,조회)
        , onSetButtonClick(div) {
            const $this = this;
            switch (div) {
                case 'init':
                    $this.reset();
                    break;
                case 'select':
                    $this.selectGridList();
                    break;
                case 'save':
                    $this.saveRoleMenuList();
                default:
                    break;
            }
        }
    }
    , mounted() {
        let $this = this;
        $this.init();
    }
}
</script>
<style>
.mv-btn {
    cursor: pointer;
    height: 50px;
}

.mv-btn:hover {
    color: #a5abae;
}

.mv-btn:active {
    color: #767b7e;
}
</style>