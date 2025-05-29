<template>
    <Modal ref="baseModal" :width="70">
        <div class="section-wrap">
            <h2>작업셋 검색</h2>
            <div class="section-wrap">
                <div class="section-part part1">
                    <div class="c-wd-90 m-r-20 ib">
                        <div>
                            <span class="wd-70">검색어</span>
                            <input class="c-wd-70" type="text" v-model="params.srchWord" v-on:keyup.enter="selectList">
                        </div>
                    </div>
                    <!--
                    <div class="w-30 ib">
                        <div class="input-check">
                            <input type="checkbox" class="ib w-10" style="height:auto" v-model="params.notAlocJset" true-value="Y" false-value="N" @change="selectList">
                            <span class="ib w-60">미할당 작업셋포함</span>
                        </div>
                    </div>
                    -->
                    <div class="wd-80 ib">
                        <button class="btn-normal" @click="selectList">조회</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="b m-t-20">
            <Grid ref="gridObj" :dataParams="params" :paging=true></Grid>
        </div>
        <div class="button-box1 m-t-20">
            <button class="btn-normal m-r-5" @click="selectedItem()" :disabled="selectedData==''">선택</button>
            <button class="btn-normal" @click="cancel">닫기</button>
        </div>
    </Modal>
</template>
<script>
import { ref } from 'vue'
import Grid    from '@/components/grid/Grid.vue'
import Modal   from '@/components/dialog/modal.vue'
import { GridUtil } from '@/utils/GridUtil';

export default {
    name: "JsetSrchPop"
   ,components: {
        Modal
       ,Grid
    }
   ,props:{
        dataParams:{
            type   : Object,
            default:{}
        }  
    }
   ,setup() {
        const baseModal = ref(null);

        const show = () => {
            baseModal.value.open();
        }
        const cancel = () => {
            baseModal.value.close();
        }
        
        return {
            baseModal
           ,show
           ,cancel
        }
    },
    data() {
        return {
            params:{
                srchWord: '',
                notAlocJset: 'N',
                wkspTypeCd:''
            },
            selectedData: ''
        }
    },
    methods: {
        init() {
            this.initData();
            this.initGrid();
        },
        initData: function() {
            this.params.srchWord = '';
            this.params.notAlocJset = 'N';
            this.selectedData  = '';
            this.params.wkspTypeCd = this.dataParams.wkspTypeCd;
        },
        //그리드 생성
        initGrid(){
            const $this = this;
            let gridOptions = {
                url:'/mng/job/jsetSrch/selectList.hb',
                colModels:[
                    {name:'jsetNo'      ,label: '작업셋번호'     , width: 40 , align:'center',},
                    {name:'jsetStrtDt'  ,label: '작업셋시작일자' , width: 40 , align:'center', formatter: $this.formatDate},
                    {name:'jsetEndDt'   ,label: '작업셋종료일자' , width: 40 , align:'center', formatter: $this.formatDate},
                    {name:'jsetNm'      ,label: '작업셋명'       , width:120 , align:'left'   },
                    {name:'jsetTypeCd'  ,label: '작업셋유형'     , width: 40 , align:'center', hidden: true},
                    {name:'jsetTypeNm'  ,label: '작업셋유형'     , width: 40 , align:'center' },
                    {name:'execCyclCd'  ,label: '실행주기코드'   , width: 40 , align:'center', hidden: true},
                    {name:'execCyclNm'  ,label: '실행주기명'     , width: 40 , align:'center', hidden: true},
                    {name:'execTpntVal' ,label: '실행시점값'     , width: 40 , align:'center', hidden: true},
                    {name:'rmrk'        ,label: '비고'          , width: 40 , align:'center', hidden: true},
                    {name:'state'       ,label: '상태'          , width: 40 , align:'center', hidden: true},
                    {name:'jobStatCd'   ,label: '최종작업상태'   , width: 40 , align:'center', hidden: true},
                    {name:'jobStatNm'   ,label: '최종작업상태'   , width: 40 , align:'center' },
                    {name:'jobStrtDt'   ,label: '최종작업시작일자', width: 40 , align:'center', formatter: $this.formatDate},
                    {name:'jobStrtTm'   ,label: '최종작업시작시각', width: 40 , align:'center', formatter: $this.formatTime},
                    {name:'aplyWkspNm'  ,label: '적용워크스페이스', width: 80 , align:'left' },
                ]
               ,options:{
                     multiselect: true
                    ,onSelectRow(rowid, val, e){
                        $this.selectedData = $(this).jqGrid('getRowData',rowid);
                    }
                    ,ondblClickRow(rowid,colId,val){
                        let selectedData = $(this).jqGrid('getRowData',rowid);
                        $this.selectedItem(selectedData);
                    }
                    ,onSelectAll(rowids, status){
                        $this.selectedData = GridUtil.getCheckedList($(this));
                    }   
                }
            }   
            this.$nextTick(function(){
                $this.$refs.gridObj.init(gridOptions);
                $this.selectList();
            });
        }
        //조회 테이블목록
       ,selectList(){
            const $this = this;
            $this.$refs.gridObj.selectList(true);
            $this.selectedData = '';
       }
       //버튼 선택
       ,selectedItem(selectedData) {
            const $this = this;     
            let gridObj = $this.$refs.gridObj.getGridObj();
            let checkedList = GridUtil.getCheckedList(gridObj);
            
            if ( $this.ValdUtil.isNotNull(selectedData) && checkedList.length == 0 ) {
                checkedList.push(selectedData);
            }
            $this.$emit('onSelect', checkedList);
            $this.cancel();
       }
    }
   ,mounted(){

   }
}
</script>