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
                        <input class="c-wd-40 ib" ref="srchWord" type="text" v-model="params.srchWord" v-on:keyup.enter="searchListCdGrp()">
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-50 ib">사용여부</h2>
                        <label v-for="el in code.ynCdList" :key="el">
                            <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="params.useYn" style="top:2px; left:-3px;" @change="searchListCdGrp()">
                            <p :class="el.cdVal === '' ?'pointer ib wd-30' : 'pointer ib wd-20'">{{ el.cdVal === '' ? '전체' : el.cdNm }}</p>
                        </label>
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="false" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- 코드그룹목록 -->
        <div class="section sectionL w-45">
            <div class="section-wrap">
                <h2 class="ib">코드그룹 목록</h2>
                <div class="btn-group-box">
                    <button class="btn-normal" @click="cdGrpMngPop('add')">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'magnifying-glass']" />
                        <p class="ib">코드그룹추가</p>
                    </button>
                    <button class="btn-exel-download" v-on:click="downloadExcel()">
                        <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                        <p>다운로드</p>
                    </button>
                </div>
                <!-- 그리드 -->
                <div class="wrapper-content">
                    <Grid ref="grid" :dataParams="params" :paging="true" ></Grid>
                </div>
            </div>
        </div>

        <!-- 코드상세목록 -->
        <div class="section sectionR w-55">
            <div class="section-wrap p-t-15">
                <div class="section-part m-0 p-0">
                    <h2 class="ib">코드상세 목록</h2>
                    <div class="w-35 ib p-l-15">
                        <span class="wd-45">코드그룹</span>
                        <input class="c-wd-45 h-30" type="text" v-model="gridSpec.dispCdGrp" :disabled="true">
                    </div>
                    <div class="btn-group-box">
                        <button class="wd-30 pointer t-a-c" @click="addRowGridCdSpec()" style="border-radius:5px; border:1px solid #c4c4c4">
                            <img class="wd-25" src="@/assets/img/btn_add_grid.png">
                        </button>
                        <button class="wd-30 pointer t-a-c" @click="delRowGridCdSpec()" style="border-radius:5px; border:1px solid #c4c4c4">
                            <img class="wd-25" src="@/assets/img/btn_minus_grid.png">
                        </button>
                    </div>
                </div>
                <!-- 그리드 -->
                <div class="wrapper-content w-100 ib">
                    <Grid ref="gridCdSpec" :dataParams="gridSpec" :paging="false" :sortable=true></Grid>
                </div>
            </div>
        </div>
        <CdGrpMngModal ref="CdGrpMngModal" :dataParams="gridSpec" @onClose="getPopRowData"></CdGrpMngModal>
    </div>
</template>

<script>

import { DateUtil }         from '@/utils/DateUtil.js'
import { ValdUtil }         from '@/utils/ValdUtil.js'
import { GridUtil }         from '@/utils/GridUtil.js'
import Grid                 from '@/components/grid/Grid.vue'
import SetButton            from '@/components/SetButton.vue'
import CdGrpMngModal        from './CdGrpMng.vue'
import { reactive, inject } from 'vue'


export default {
    components: {
        Grid,
        SetButton,
        CdGrpMngModal,
    },

    setup() {
        let code = reactive({
            ynCdList : []
        })
        const getCmonCdList = inject('getCmonCdList');
        getCmonCdList('YN', code.ynCdList, 'Y', null);  // YN / YN
        return {
            code
        }
    },

    data: function() {
		return {
            params: {
                srchWord     : '',
                useYn        : '',
            },
            gridSpec: {
                cdGrp        : '',
                cdGrpNm      : '',
                useYn        : '',
                dispCdGrp    : '',
            },
            cdSpec: {
                cdSpecList: []
            }
            ,selectGridRowId: '',
        }
    },
    methods: {
        init() {
            const $this = this;
            $this.resetData();
            $this.initGrid();
            $this.CmonUtil.setFocus($this.$refs.srchWord);
        },
        initGrid() {
            let $this = this;

            $this.gridObj = {
                url: '/cmon/sys/cmonCdMng/selectListCdGrp.hb',
                colModels: [
                    {name:'cdGrp'       ,label: '코드그룹'      ,width: 50    , align:'left'   },
                    {name:'cdGrpNm'     ,label: '코드그룹명'    ,width: 50    , align:'left'   },
                    {name:'useYn'       ,label: '사용여부'      ,width: 22    , align:'center' },
                    {name:'specSrch'    ,label: '상세보기'      ,width: 22    , align:'center'
                        ,formatter: function() {return '<button style="height:19px; width:65px;">상세보기</button>';}
                    },
                ],
                options: {
                    height: 599,
                    rownumbers: true,
                    onSelectRow : function(rowid, a, event){
                        let gridData = $(this).jqGrid('getRowData', rowid);
                        $this.gridSpec.cdGrp     = gridData.cdGrp;
                        $this.gridSpec.cdGrpNm   = gridData.cdGrpNm;
                        $this.gridSpec.dispCdGrp = gridData.cdGrp + " / " + gridData.cdGrpNm;
                        $this.searchListCdSpec();
                        $this.selectGridRowId   = rowid;
                    },
                    onCellSelect(rowid, icol, val ,event){
                        let gridData         = $(this).jqGrid('getRowData', rowid);
                        let colNm            = $(this).jqGrid('getGridParam', 'colModel')[icol].name;
                        $this.gridSpec.cdGrp = gridData.cdGrp;
                        // 상세보기 버튼
                        if(colNm =='specSrch'){
                            $this.cdGrpMngPop('upt');
                        }
                    },
                    gridComplete(){
                        if(ValdUtil.isNotNull($this.selectGridRowId)){
                            let slctId = $this.selectGridRowId;
                            $(this).jqGrid('setSelection', slctId);
                        }
                    }
                },
            };
            $this.$refs.grid.init($this.gridObj);
            $this.searchListCdGrp();

            let gridCdSpecObj = {
                url: '/cmon/sys/cmonCdMng/selectListCdSpec.hb',
                colModels: [
                    {name: 'crud'       ,label: 'crud'      ,width: 30, align: 'left'   ,hidden : true},
                    {name: 'cdVal'      ,label: '코드값'    ,width: 55, align: 'left'   ,editable : true, edittype: 'text'
                        , cellattr:function(rowid, value, rawObject, cm, rdata){
                            let classNm = "";
                            if(rawObject.crud != "C") {
                                classNm = "class='not-editable-cell'"
                            };
                            return classNm;}
                    },
                    {name: 'cdNm'       ,label: '코드명'    ,width: 55, align: 'left'   ,editable : true, edittype: 'text'},
                    {name: 'useYn'      ,label: '사용여부'  ,width: 20, align: 'center' ,editable : true, edittype: 'select'
                        , editoptions: { value: "Y:Y;N:N", defaultValue :"Y"}
                    },
                    {name: 'sortOrd'    ,label: '정렬순서'  ,width: 20, align: 'center'  ,editable : true, edittype: 'text'
                        , formatter:'integer',formatoptions: { defaultValue: '0', thousandsSeparator: ',' }
                        },
                    {name: 'fltrVal1'   ,label: '필터1'     ,width: 30, align: 'left'   ,editable : true, edittype: 'text'},
                    {name: 'fltrVal2'   ,label: '필터2'     ,width: 30, align: 'left'   ,editable : true, edittype: 'text'},
                    {name: 'fltrVal3'   ,label: '필터3'     ,width: 30, align: 'left'   ,editable : true, edittype: 'text'},
                    {name: 'cdDesc'     ,label: '설명'      ,width: 50, align: 'left'   ,editable : true, edittype: 'text'},
                ],
                options: {
                    height      : 585,
                    rownumbers  : true,
                    multiselect : true,
                    cellEdit    : true,
                    cellsubmit  : "clientArray",
                    afterSaveCell : function (rowid , colId , val){
                        if($(this).getRowData(rowid).crud != "C" && $(this).getRowData(rowid).crud != "D" )
                        {
                            $(this).setRowData(rowid, {crud:"U"});
                        }
                    },
                },
            };
            $this.$refs.gridCdSpec.init(gridCdSpecObj);
        },
        // 그리드 조회
        searchListCdGrp(div) {
            const $this = this;
            if(div!='save'){
                $this.selectGridRowId = '';
            }
            //  그리드 선택행 초기화
            $this.resetGridSpec();
            //  Grid 데이터 초기화
            $this.$refs.grid.clearGridData();
            $this.$refs.gridCdSpec.clearGridData();
            //  코드그룹 그리드 데이터 조회
            $this.$refs.grid.selectList(true);
        },
        // 컬럼추가
        addRowGridCdSpec() {
            const $this = this;
            // null 체크 및 길이 체크 (data / 길이 / msg / null 체크 여부=디폴트 true)
            if(ValdUtil.isNull($this.gridSpec.cdGrp)) {
                $this.alert('코드그룹을 선택하세요');
                return false;
            }
            
            const emptyRow = {crud:'C', cdVal: '', cdNm: '', useYn: 'Y', sortOrd: '', fltrVal1: '', fltrVal1: '', fltrVal2: '',  fltrVal3: '',  cdDesc: ''};
            $this.$refs.gridCdSpec.getGridObj().jqGrid('addRowData', undefined, emptyRow);    
        },

        // 컬럼삭제
        delRowGridCdSpec() {
            const $this = this;
            let gridObj = $this.$refs.gridCdSpec.getGridObj();
            let gridId = $this.$refs.gridCdSpec.getGridId();

            let checkIds = gridObj.jqGrid("getGridParam","selarrrow") + "";  // 다건
            //let checkIds = gridObj.jqGrid("getGridParam","selrow") + "";  // 단건
            
            if ( checkIds == "" || checkIds == "null" )
            {
                $this.alert("삭제할 행을 선택해주십시요.");
                return false;
            }
            let checkId = checkIds.split(",");

            for ( var i in checkId )
            {
                if ( gridObj.getRowData(checkId[i]).crud == "C" )
                {
                    gridObj.jqGrid('delRowData', checkId[i]);
                }
                else
                {
                    gridObj.setRowData(checkId[i], {crud: "D"});
                    $("#"+checkId[i],"#"+gridId).css({display: "none"});
                }   
            }
        },

        searchListCdSpec(cdGrp, cdGrpNm) {
            const $this = this;
            //  그리드 선택행 초기화
            //  Grid 데이터 초기화
            $this.$refs.gridCdSpec.clearGridData();
            if (ValdUtil.isNotNull(cdGrp)) {
                $this.gridSpec.cdGrp = cdGrp;
                if(ValdUtil.isNotNull(cdGrpNm)){
                    $this.gridSpec.dispCdGrp = cdGrp + " / " + cdGrpNm;
                }
            }
            //  Grid 데이터 조회
            $this.$refs.gridCdSpec.selectList(true, false, true);
        },

        // 코드그룹 추가 팝업
        cdGrpMngPop(div) {
            const $this = this;
            let cdGrp = '';
            if(div == 'upt'){
                cdGrp = $this.gridSpec.cdGrp;
            }
            $this.$refs.CdGrpMngModal.show();
            $this.$refs.CdGrpMngModal.init(cdGrp);
        },
        getPopRowData: function(data) {
            const $this = this;
            if(data.div == 'delt'){
                $this.resetData();
            }
            $this.searchListCdGrp();
        },
        //vald 체크
        isValid() {
            const $this = this;
            // null 체크 및 길이 체크 (data / 길이 / msg / null 체크 여부=디폴트 true)
            if(ValdUtil.isNull($this.gridSpec.cdGrp)) {
                $this.alert('코드그룹을 선택하세요');
                return false;
            }

            if($this.cdSpec.cdSpecList.length < 1) {
                $this.alert('저장할 내역이 없습니다');
                return false;
            }

            let cdVal = '';
            let cdNm  = '';

            // 코드값 validation
            for (var i = 0; i < $this.cdSpec.cdSpecList.length; i++) {
                cdVal = $this.cdSpec.cdSpecList[i].cdVal;
                cdNm  = $this.cdSpec.cdSpecList[i].cdNm;

                if (ValdUtil.isNull(cdVal) && ValdUtil.isNotNull(cdNm)) {
                    $this.alert( (i + 1) + ' 행 코드값과 코드명을 모두 입력하세요');
                    return false;
                }

                if (ValdUtil.isNotNull(cdVal) && ValdUtil.isNull(cdNm)) {
                    $this.alert( (i + 1) + ' 행 코드값과 코드명을 모두 입력하세요');
                    return false;
                }

                for (var j = 0; j < $this.cdSpec.cdSpecList.length; j++) {
                    if (i != j) {
                        if (cdVal == $this.cdSpec.cdSpecList[j].cdVal && ValdUtil.isNotNull($this.cdSpec.cdSpecList[j].cdVal)) {
                            $this.alert( (j + 1) + ' 행 코드값 ' + cdVal + ' 중복입력입니다.');
                            return false;
                        }
                    }
                }
            }
            return true;
        },
        //저장 컨펌
        saveConfirm(){
            let $this = this;

            GridUtil.gridCancelEdit($this.$refs.gridCdSpec.getGridObj());
            // 상세 컬럼 리스트 정보
            $this.cdSpec.cdSpecList = $this.$refs.gridCdSpec.getGridObj().jqGrid("getRowData");

            if($this.cdSpec.cdSpecList.find(item => item.crud ==='C' && (item.cdVal === '' || item.cdNm === ''))){

                this.confirm({
                    content  : '코드값과 코드명이 입력되지 않은 행이 있습니다. 저장 시 해당 행은 저장이 되지 않습니다. 저장하시겠습니까?',
                    callback : {
                        yes: function() {
                            $this.saveCdSpec();
                        },
                        no: function(){ }
                    }
                })
            } else {
                $this.saveCdSpec();
            }
        },
        //저장
        saveCdSpec() {
            const $this = this;
            if(!$this.isValid ()){
                return false;
            };
            let screenCdSpecList = [];
            let k       = 0;
            let crud    = '';
            let cdVal   = '';
            let cdNm    = '';
            let cdGrp   = $this.gridSpec.cdGrp;
            let cdGrpNm = $this.gridSpec.cdGrpNm;
            for (var i = 0; i < $this.cdSpec.cdSpecList.length; i++) {
                // console.log(' ########## $this.cdSpec.cdSpecList[i].crud : ', $this.cdSpec.cdSpecList[i].crud);
                if (ValdUtil.isNull($this.cdSpec.cdSpecList[i].crud)) {
                    crud = 'U';
                } else {
                    crud = $this.cdSpec.cdSpecList[i].crud;
                }
                cdVal = $this.cdSpec.cdSpecList[i].cdVal;
                cdNm  = $this.cdSpec.cdSpecList[i].cdNm;
                if (($this.cdSpec.cdSpecList[i].crud == 'C') && ValdUtil.isNull(cdVal) && ValdUtil.isNull(cdNm)) {
                } else {
                    // console.log(' ########## crud : ', crud);
                    screenCdSpecList.push({
                        crud     : '',
                        cdVal    : '',
                        cdNm     : '',
                        useYn    : '',
                        sortOrd  : '',
                        fltrVal1 : '',
                        fltrVal2 : '',
                        fltrVal3 : '',
                        cdDesc   : '',
                        cdGrp    : '',
                    });
                    screenCdSpecList[k].crud     = crud;
                    screenCdSpecList[k].cdVal    = cdVal;
                    screenCdSpecList[k].cdNm     = cdNm;
                    screenCdSpecList[k].useYn    = $this.cdSpec.cdSpecList[i].useYn;
                    screenCdSpecList[k].sortOrd  = $this.cdSpec.cdSpecList[i].sortOrd;
                    screenCdSpecList[k].fltrVal1 = $this.cdSpec.cdSpecList[i].fltrVal1;
                    screenCdSpecList[k].fltrVal2 = $this.cdSpec.cdSpecList[i].fltrVal2;
                    screenCdSpecList[k].fltrVal3 = $this.cdSpec.cdSpecList[i].fltrVal3;
                    screenCdSpecList[k].cdDesc   = $this.cdSpec.cdSpecList[i].cdDesc;
                    screenCdSpecList[k].cdGrp    = cdGrp;
                }

                k++;
            }
            if (screenCdSpecList.length == 0) {
                $this.alert('저장할 내용이 없습니다');
            }

            let url = '/cmon/sys/cmonCdMng/saveListCdSpec.hb';
            let params = {};
            params.cdSpecList = screenCdSpecList;

            $this.doPost(url, params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    $this.alert("저장되었습니다").then((result) => {
                        if ( result.isConfirmed ) {
                            $this.resetData();
                            $this.searchListCdGrp('save');
                        }
                    });
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },
        //  화면 초기화
        resetData() {
            const $this = this;
            //  검색조건 초기화
            $this.resetParams();
            //  그리드선택행 초기화
            $this.resetGridSpec();
            //  그리드리스트
            $this.resetCdSpec();
            //  Grid 데이터 초기화
            $this.$refs.grid.clearGridData();
            $this.$refs.gridCdSpec.clearGridData();
            $this.CmonUtil.setFocus($this.$refs.srchWord);
        },

        //  검색조건 초기화
        resetParams() {
            const $this = this;
            $this.params = {
                srchWord  : '',
                useYn     : '',
            };
        },

        // 상세초기화
        resetCdSpec() {
            const $this = this;
            $this.cdSpec = {
                cdSpecList : []
            }
        },

        //  그리드선택행 초기화
        resetGridSpec() {
            const $this = this;

            // $this.resetObjData($this.gridSpec);
             $this.gridSpec = {
                cdGrp     : '',
                cdGrpNm   : '',
                useYn     : '',
                dispCdGrp : ''
            };
        },
        // 반응성 데이터셋의 반응성 잃지 않고 유지 시키며 초기화
        resetObjData(data) {
            for(let key in data) {
                if(typeof data[key] === "string") {
                    data[key] = '';
                } else if(typeof data[key] === "boolean") {
                    data[key] = false;               
                } else {
                    data[key] = null;
                }
            }
        },

        // 공통버튼(초기화, 조회, 저장) 컴포넌트 핸들러
        onSetButtonClick (div) {
            const $this = this;
            switch ( div ) {
                case 'init':
                    // $this.resetData();
                    $this.init();
                    break;
                case 'select':
                    $this.searchListCdGrp();
                    break;
                case 'save':
                    // $this.saveCdSpec();
                    $this.saveConfirm();
                    break;
                default:
                    $this.alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
        },

        // 엑셀다운로드        
        downloadExcel(){
            const $this = this;
            let url    = '';
            let param  = {};
            let fileNm = '';

            if($this.$refs.grid.getGridObj().jqGrid('getGridParam','records') < 1) {
                $this.alert('검색된 코드그룹목록이 없습니다.');
                return false;
            }
            let labelsArray = $this.gridObj.colModels.map((obj) => {
                return obj.label;
            });
            url               = '/cmon/sys/cmonCdMng/selectListCdGrpExcel.hb';
            param             = $this.params;
            param.excelHeader = labelsArray;
            fileNm = '코드그룹목록_'+DateUtil.getCurrDate('YYYYMMDD')+'.xlsx';
            $this.doDownExcel(url, param, fileNm);
        },
    },

    mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>