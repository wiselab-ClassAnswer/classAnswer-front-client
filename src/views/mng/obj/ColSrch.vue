<template>
    <Modal ref="baseModal" :width="30">
        <div class="section-wrap">
            <h2>컬럼정보</h2>
            <div class="section-part part1">
                <div class="w-100">
                    <div class="ib w-100">
                        <div class="wd-100 ib">
                            <span class="w-100">DB연결ID</span>
                        </div>
                        <div class="c-wd-90 ib">
                            <input class="w-100" type="text" :value="srchParam.dbConnId" disabled>
                        </div>
                    </div>
                </div>
                <div class="w-100">
                    <div class="ib w-100">
                        <div class="wd-100 ib">
                            <span class="w-100">스키마ID</span>
                        </div>
                        <div class="c-wd-90 ib">
                            <input class="w-100" type="text" :value="srchParam.schId" disabled>
                        </div>
                    </div>
                </div>
                <div class="w-100">
                    <div class="ib w-50">
                        <div class="wd-100 ib">
                            <span class="w-100">테이블</span>
                        </div>
                        <div class="c-wd-90 ib">
                            <input class="w-100" type="text" :value="srchParam.tblId" disabled>
                        </div>
                    </div>
                    <div class="ib w-50">
                        <div class="w-100">
                            <input class="w-100" type="text" :value="srchParam.tblNm" disabled>
                        </div>
                    </div>
                </div>
            </div>
            <div class="b m-t-5">
                <Grid ref="ColSrchGrid" :dataParams="srchParam" :paging=false></Grid>
            </div>
        </div>
        <div class="button-box1 m-t-20">
            <button class="btn-normal m-r-5 p-l-20 p-r-20" @click="selectBtn()">선택</button>
            <button class="btn-normal p-l-20 p-r-20" @click="cancel">닫기</button>
        </div>
    </Modal>
</template>
<script>
import { ref }       from 'vue'
import Grid          from '@/components/grid/Grid.vue'
import Modal         from '@/components/dialog/modal.vue'
import { GridUtil }  from '@/utils/GridUtil.js'

export default {
    name: "confirm-dialog",
    components: {
        Modal
        ,Grid
    }
    ,props:{
      dataParams:{
        type: Object,
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
    }
    ,data() {
        return {
            srchParam:{
                dbConnId:''
                ,schId:''
                ,tblId:''
                ,tblNm:''
            }
            ,rowData:{}          //선택 데이터
            ,gridOptionoDiv:''   //그리드 옵션 구분 값
        }
    }
    ,methods: {
        init(){
            this.rowData = {};
            this.resetData(this.srchParam);
            this.gridOptionoDiv = ''
            this.srchParam.dbConnId = this.$props.dataParams.dbConnId;
            this.srchParam.schId    = this.$props.dataParams.schId;
            this.srchParam.tblId    = this.$props.dataParams.tblId;
            this.srchParam.tblNm    = this.$props.dataParams.tblNm;
        } 
        ,initGrid(div){
            const $this = this;
            if($this.ValdUtil.isNotNull(div)){
                if(typeof div =='string'){
                    $this.gridOptionoDiv = div;
                }else{
                    $this.srchParam.dbConnId = div.dbConnId;
                    $this.srchParam.schId    = div.schId;
                    $this.srchParam.tblId    = div.tblId;
                    $this.srchParam.tblNm    = div.tblNm;
                }
            }
            let colSrchGridData ={
                url : '/mng/obj/colSrch/selecetListColBase.hb',
                colModels : [
                    { name: 'colId'    , label: '컬럼ID'  , width: 15    , align: 'left'  ,sortable:true},
                    { name: 'colNm'    , label: '컬럼명'  , width: 15    , align: 'left'  ,sortable:true},
                    { name: 'dataType' , label: 'TYPE'    , width: 10   , align: 'center' ,sortable:true},
                    { name: 'nullYn'   , label: 'NULL'    , width: 5    , align: 'center' ,sortable:true},
                    { name: 'pkYn'     , label: 'PK'      , width: 5    , align: 'center' ,sortable:true},
                ],
                options: $this.gridOptionoDiv == 'multiselect' ? {
                    loadonce:true
                    ,height:400
                    ,multiselect:true
                    ,onSelectRow(rowid) {
                        $this.rowData = $(this).jqGrid('getRowData',rowid)
                } }
                :  {          
                    loadonce:true
                    ,height:400
                    ,onSelectRow(rowid) {
                        $this.rowData = $(this).jqGrid('getRowData',rowid)
                    }
                    ,ondblClickRow(rowid) {
                        $this.rowData = $(this).jqGrid('getRowData',rowid)
                            $this.selectBtn();
                }}
            }
            $this.$nextTick(function(){
                $this.$refs.ColSrchGrid.init(colSrchGridData);
                $this.searchListCol();
            });
        }       
        //조회  컬럼목록
       ,searchListCol(){
            this.$refs.ColSrchGrid.selectList(true);
       }
       //버튼 선택
       ,selectBtn(){
            if(this.gridOptionoDiv == 'multiselect'){
                let slctGridData = GridUtil.getCheckedList(this.$refs.ColSrchGrid.getGridObj());
                if(slctGridData.length == 0){
                    this.alert("선택된 대상이 없습니다")
                    return false;
                }else{
                    this.rowData = slctGridData;
                }
            }
            
            this.rowData['dbConnId'] = this.srchParam.dbConnId
            this.rowData['schId'] = this.srchParam.schId
            this.rowData['tblId'] = this.srchParam.tblId

            this.$emit('selectCol',this.rowData);
            this.cancel();
       }
        //데이터 리셋
        ,resetData(val){
            for(let key in val){
                val[key] = ''
            }
        }
    }
    ,mounted(){
        this.init();
   }
}
</script>