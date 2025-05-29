<template>
    <div>
        <!-- 검색조건 -->
        <div class="section section1">
            <div class="search-box">
                <div class="m-b-10">
                    <h1>검색조건</h1>
                    <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="true" @on-set-button-click="onSetButtonClick"></SetButton>
                </div>
                <div class="input-box">
                    <div>
                        <h2>프로젝트명</h2>
                        <input type="text" v-model="params.prctNm" v-on:keyup.enter="selectList()">
                    </div>
                </div>
            </div>
        </div>

        <!-- 프로젝트 목록 -->
        <div class="section section2">
            <div class="section-wrap">
                <h2 class="ib">프로젝트 목록</h2>
                <button class="btn-exel-download only" @click="downloadExcel()">
                    <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                    <p>다운로드</p>
                </button>
                <div class="wrapper-content">
                    <Grid ref="grid" :dataParams="params" :paging="true"></Grid>
                </div>
            </div>
        </div>

        <!-- 상세정보 -->
        <div class="section section3">
            <div class="section-wrap">
                <h2>프로젝트 정보</h2>
                <div class="section-part part1">
                    <div class="w-50 p-r-10">
                        <!--
                        <span class="wd-100">프로젝트번호</span>
                        <input class="c-wd-100" type="text" v-model="prctInfo.prctNo" disabled>
                        -->
                        <span class="wd-100 essn">프로젝트명</span>
                        <input class="c-wd-100" type="text" v-model="prctInfo.prctNm">
                    </div>
                    <div class="w-50 p-l-10">
                        <span class="wd-100 essn">프로젝트 영문명</span>
                        <input class="c-wd-100" type="text" v-model="prctInfo.prctEngNm">
                    </div>
                    <div class="w-50 p-r-10">
                        <span class="wd-100">프로젝트 시작일자</span>
                        <div class="c-wd-100 ib">
                            <div class="input-btn w-100">
                                <Datepicker :stndDt="prctInfo.prctStrtDt" style="width:100%;" @on-selected="onSelectedDatepickerStrtDt"></Datepicker>
                            </div>
                        </div>
                    </div>
                    <div class="w-50 p-l-10">
                        <span class="wd-100">프로젝트 종료일자</span>
                        <div class="c-wd-100 ib">
                            <div class="input-btn w-100">
                                <Datepicker :stndDt="prctInfo.prctEndDt" style="width:100%;" @on-selected="onSelectedDatepickerEndDt"></Datepicker>
                            </div>
                        </div>
                    </div>
                    <div class="text-box">
                        <span class="wd-100">비고</span>
                        <textarea class="c-wd-100" cols="30" rows="5" v-model="prctInfo.rmrk"></textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import Grid from '@/components/grid/Grid.vue'
import SetButton from '@/components/SetButton.vue'
import Datepicker from '@/components/datepicker/Datepicker.vue'
import { DateUtil }  from '@/utils/DateUtil'

export default {
    components: {
        Grid,
        SetButton,
        Datepicker,
    },
    data: function() {
		return {
            params: {
                prctNm     : '',
                crud       : 'C'
            },
            prctInfo: {
                prctNo     : '',
                prctNm     : '',
                prctEngNm  : '',
                prctStrtDt : '',
                prctEndDt  : '',
                rmrk       : '',
                crud       : 'C'
            }
        }
    },
    methods: {
        init: function() {
            const $this = this;
            $this.initData();
            $this.initGrid();
            $this.selectList();
        },
        initData() {
            this.params.prctNm = '';
            this.prctInfo = {
                prctNo       : '',
                prctNm       : '',
                prctStrtDt   : DateUtil.getCurrDate('YYYY-MM-DD'),
                prctEndDt    : '9999-12-31',
                rmrk         : '',
               
            }
        },
        initGrid() {
            let $this = this;

            let gridOptions = {
                url: '/prct/mng/prctMng/selectList.hb',
                colModels: [
                    {name:'prctNo'      ,label: '프로젝트번호'      , width: 40     , align:'left'    , hidden: true},
                    {name:'prctNm'      ,label: '프로젝트명'        , width: 100    , align:'left'    },
                    {name:'prctStrtDt'  ,label: '프로젝트시작일자'  , width: 40     , align:'center'  , formatter: $this.formatDate},
                    {name:'prctEndDt'   ,label: '프로젝트종료일자'  , width: 40     , align:'center'  , formatter: $this.formatDate}
                ],
                options: {
                    onCellSelect(rowid) {
                        const rowData = $(this).jqGrid('getRowData', rowid);
                        $this.params.crud = 'U';
                        $this.selectDetl(rowData);
                    },
                }
            }
            $this.$refs.grid.init(gridOptions);
        },
        selectList() {
            this.$refs.grid.selectList(true);
        },
        selectDetl(rowData) {
            const $this = this;
            let params = {
                prctNo: rowData.prctNo
            }
            $this.doPost('/prct/mng/prctMng/selectDetl.hb', params).then(function(res) {
                if ( res.data.rtnCd == '0000') {
                    $this.prctInfo = res.data.rtnData;
                    $this.prctInfo.prctStrtDt = DateUtil.dateToDash(res.data.rtnData.prctStrtDt);
                    $this.prctInfo.prctEndDt  = DateUtil.dateToDash(res.data.rtnData.prctEndDt);
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
            
        },

        save() {
            const $this = this;
            if (!this.ValdUtil.valdLenNull(this.prctInfo.prctNm       , 200   , '프로젝트명은')) return false;
            let url = '';
            if($this.params.crud === 'C'){
                url = '/prct/mng/prctMng/insert.hb';
            } else if ($this.params.crud === 'U'){
                url = '/prct/mng/prctMng/update.hb';
            }

            let params        = $this.CmonUtil.clone($this.prctInfo);
            params.prctStrtDt = params.prctStrtDt.replaceAll("-", "");
            params.prctEndDt  = params.prctEndDt.replaceAll("-", "");

            $this.doPost(url, params).then(function(res) {
                if (res.data.rtnCd =='0000') {
                    $this.alert('저장되었습니다.').then((result) => {
                        if ( result.isConfirmed ) {
                            $this.initData();
                            $this.selectList();
                        }
                    });                    
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
        },
        deletePrct(){
            const $this = this;
            if($this.params.crud ==='C'){
                $this.alert("삭제할 프로젝트를 선택해주세요.");
                return false;
            } else if($this.params.crud =='U'){
                $this.confirm({
                    content  : $this.prctInfo.prctNm + ' 프로젝트를 삭제하시겠습니까?',
                    callback :{
                        yes(){
                            $this.delete();
                        }
                    }
                })
            }
        },
        delete() {
            const $this = this;
           
            $this.doPost('/prct/mng/prctMng/delete.hb', $this.prctInfo).then(function(res) {
                if ( res.data.rtnCd == '0000') {
                    $this.alert("삭제되었습니다.").then((result) =>{
                        if(result.isConfirmed){
                            $this.initData();
                            $this.selectList();
                        }
                    })
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
        },
        downloadExcel() {
            let fileNm = '프로젝트목록_'+ DateUtil.getCurrDate() +'.xlsx';
            this.doDownExcel('/prct/mng/prctMng/selectListDownloadExcel.hb', this.params, fileNm);
        },
        onSelectedDatepickerStrtDt(selectedDate) {
            this.prctInfo.prctStrtDt = selectedDate;
        },
        onSelectedDatepickerEndDt(selectedDate) {
            this.prctInfo.prctEndDt = selectedDate;
        },
        onSetButtonClick(div) {
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.init();
                    break;
                case 'select':
                    $this.selectList();
                    break;
                case 'save':
                    $this.save();
                    break;
                case 'delete':
                    $this.deletePrct();
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
