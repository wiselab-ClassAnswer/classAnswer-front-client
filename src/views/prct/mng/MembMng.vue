<template>
    <div>
        <!-- 검색조건 -->
        <div class="section section1">
            <div class="search-box">
                <div class="m-b-10">
                    <h1>검색조건</h1>
                    <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="false" @on-set-button-click="onSetButtonClick"></SetButton>
                </div>
                <div class="input-box">
                    <div>
                        <h2>프로젝트명</h2>
                        <input type="text" v-model="params.prctNm" v-on:keyup.enter="selectListPrct()">
                    </div>
                </div>
            </div>
        </div>

        <!-- 프로젝트 목록 -->
        <div class="section section2">
            <div class="section-wrap">
                <h2 class="ib">프로젝트 목록</h2>
                <button class="btn-exel-download only" @click="downloadExcelPrct()">
                    <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                    <p>다운로드</p>
                </button>
                <div class="wrapper-content">
                    <Grid ref="gridPrct" :dataParams="params" :paging="true"></Grid>
                </div>
            </div>
        </div>

        <!-- 구성원 -->
        <div class="section section3">
            <div class="section-wrap">
                <h2 class="ib">구성원 목록</h2>
                <div class="btn-group-box">
                    <button class="btn-normal" @click="popupUserSrch()">사용자추가</button>
                    <button class="btn-normal m-l-5" @click="delRow()">사용자삭제</button> 
                    <button class="btn-exel-download" @click="downloadExcelMemb()">
                        <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                        <p>다운로드</p>
                    </button>
                </div>
                <div class="wrapper-content">
                    <Grid ref="gridMemb" :dataParams="params" :paging="true"></Grid>
                </div>
            </div>
        </div>
        <UserSrch ref="UserSrchModal" :dataParams="params" @getUserPopRowData="selectedDataUser"></UserSrch>
    </div>
</template>

<script>

import Grid from '@/components/grid/Grid.vue'
import SetButton from '@/components/SetButton.vue'
import UserSrch from '@/views/mng/job/UserSrch.vue'
import { DateUtil } from '@/utils/DateUtil.js'

export default {
    components: {
        Grid,
        SetButton,
        UserSrch
    },
    data: function() {
		return {
            params: {
                prctNo : '',
                prctNm : ''
            },
        }
    },
    methods: {
        init: function() {
            const $this = this;
            $this.initData();
            $this.initGrid();
            $this.selectListPrct();
        },
        initData() {
            this.prctNo = '';
            this.prctNm = '';
        },
        initGrid() {
            let $this = this;

            let gridPrctOptions = {
                url: '/prct/mng/membMng/selectListPrct.hb',
                colModels: [
                    {name:'prctNo'      ,label: '프로젝트번호'      , width: 10     , align:'left'      , hidden: true},
                    {name:'prctNm'      ,label: '프로젝트명'        , width: 100    , align:'left'      },
                    {name:'prctStrtDt'  ,label: '프로젝트시작일자'  , width: 40     , align:'center'    , formatter: $this.formatDate},
                    {name:'prctEndDt'   ,label: '프로젝트종료일자'  , width: 40     , align:'center'    , formatter: $this.formatDate}
                ],
                options: {
                    onCellSelect(rowid) {
                        const rowData = $(this).jqGrid('getRowData', rowid);
                        $this.selectListMemb(rowData.prctNo);
                    },
                }
            }
            $this.$refs.gridPrct.init(gridPrctOptions);

            let gridMembOptions = {
                url: '/prct/mng/membMng/selectListMemb.hb',
                colModels: [
                    {name:'crud'      ,label: 'crud'        , width: 40 , align:'left', hidden: true},
                    {name:'prctNo'    ,label: '프로젝트번호' , width: 40 , align:'left', hidden: true},
                    {name:'seq'       ,label: '순번'        , width: 10 , align:'center' },
                    {name:'userId'    ,label: '사용자ID'    , width: 50 , align:'center' },
                    {name:'userNm'    ,label: '사용자명'    , width: 50 , align:'center' },
                    // {name:'roleCd',    label: '업무역할'    , width: 50 , align:'center'},
                    // {name:'busiRoleNm',label: '업무역할'    , width: 50 , align:'center', editable: true }
                ],
                options: {
                    multiselect: true,
                    cellEdit: true,
                    onCellSelect(rowid) {
                        const rowData = $(this).jqGrid('getRowData', rowid);
                    },
                }
            }
            $this.$refs.gridMemb.init(gridMembOptions);
        },
        selectListPrct() {
            this.$refs.gridMemb.clearGridData();
            this.$refs.gridPrct.selectList(true);
        },
        selectListMemb(prctNo) {
            this.params.prctNo = prctNo;
            this.$refs.gridMemb.selectList(true);
        },
        save() {
            const $this = this;

            let membList = $this.$refs.gridMemb.getGridObj().jqGrid("getRowData");

            let params = {
                prctNo  : $this.params.prctNo,
                membList: membList
            };

            $this.doPost('/prct/mng/membMng/save.hb', params).then(function(res) {
                if (res.data.rtnCd =='0000') {
                    $this.alert('저장되었습니다.').then((result) => {
                        if ( result.isConfirmed ) {
                            $this.initData();
                            $this.selectListMemb($this.params.prctNo);
                        }
                    });                    
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
        },
        downloadExcelPrct() {
            const $this = this;
            let grid       = $this.$refs.gridPrct.getGridObj();
            let gridData   = grid.getRowData();
            if(gridData.length > 0){
                let fileNm = '프로젝트_목록_'+DateUtil.getCurrDate()+'.xlsx';
                this.doDownExcel('/prct/mng/membMng/selectListPrctDownloadExcel.hb', this.params, fileNm);
            } else {
                $this.alert("조회된 값이 없습니다.");
            }
            
        },
        downloadExcelMemb() {
            const $this = this;
            let grid     = $this.$refs.gridMemb.getGridObj();
            let gridData = grid.getRowData();
            if(gridData.length > 0){
                let fileNm = '프로젝트_구성원_목록'+ DateUtil.getCurrDate()+ '.xlsx';
                this.doDownExcel('/prct/mng/membMng/selectListMembDownloadExcel.hb', this.params, fileNm);
            } else {
                $this.alert("조회된 값이 없습니다.");
            }
            
        },
        delRow() {
            const $this = this;
            let checkIds = $this.$refs.gridMemb.getGridObj().jqGrid("getGridParam","selarrrow") + "";  // 다건
            if ( $this.ValdUtil.isNull(checkIds) ) {
                $this.alert("삭제할 행을 선택해주십시요.");
                return false;
            }

            _.forEach(checkIds, function(i) {
                if ( $this.$refs.gridMemb.getGridObj().getRowData(i).crud == "C" ) {
                    $this.$refs.gridMemb.getGridObj().jqGrid('delRowData', i);
                } else {
                    $this.$refs.gridMemb.getGridObj().setRowData(i, {crud: "D"});
                    $("#" + $this.$refs.gridMemb.getGridId() + " #" + i).css({display: "none"});
                    // console.log($this.$refs.gridMemb.getGridObj().getRowData(i));
                }
            });
        },
        popupUserSrch() {
            if ( this.ValdUtil.isNull(this.params.prctNo) ) {
                this.alert("프로젝트를 선택해주시기 바랍니다.");
                return false;
            }
            this.$refs.UserSrchModal.show();
            this.$refs.UserSrchModal.initGrid();
        },
        selectedDataUser(data) {
            const $this = this;
            
            let membList = $this.$refs.gridMemb.getGridObj().jqGrid("getRowData");
            let fMemb = _.find(membList, function(memb) {
                return memb.userId === data.userId;
            });

            if ( !!fMemb ) {
                this.alert("선택된 사용자입니다.");
                return false;
            }

            const emptyRow = {
                crud: 'C',
                prctNo: $this.params.prctNo,
                seq: '',
                userId: data.userId,
                userNm: data.userNm,
                roleCd: '',
                roleNm: ''
            };
            let cnt = $this.$refs.gridMemb.getGridObj().jqGrid("getGridParam", "records") + 1;
            $this.$refs.gridMemb.getGridObj().addRowData(cnt, emptyRow);
        },
        reset(){
            const $this = this;
            $this.initData();
            $this.initGrid();
            $this.selectListPrct();
            $this.$refs.gridMemb.clearGridData();
        },
        onSetButtonClick(div) {
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.reset();
                    break;
                case 'select':
                    $this.selectListPrct();
                    break;
                case 'save':
                    $this.save();
                    break;
                case 'delete':
                    break;
                default:
                    break;
            }
        }
    },
    mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>
