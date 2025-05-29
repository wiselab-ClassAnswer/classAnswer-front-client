<template>
    <Modal ref="baseModal" :width="75">
        <!-- 테이블 변경영향 검토결과 -->
        <div class="section-wrap">
            <h2 class="ib">테이블 변경영향 검토결과</h2>
            <button class="btn-exel-download f-r only" @click="downloadExcel()">
                <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                <p>다운로드</p>
            </button>
        </div>
        <div class="b">    
            <Grid ref="TblChngEfctAnal" :dataParams="params" :paging=false></Grid>
        </div>
        <div class="button-box1 m-t-20">
            <button class="btn-normal" @click="cancel">닫기</button>            
        </div>
    </Modal>
</template>
<script>

import { ref } from 'vue'
import { DateUtil }  from '@/utils/DateUtil.js'
import { ValdUtil }  from '@/utils/ValdUtil.js'
import Grid    from '@/components/grid/Grid.vue'
import Modal   from '@/components/dialog/modal.vue'

export default {
    name: "tblChngEfctAnal"
   ,components: {
        Modal
       ,Grid
    }
   ,props:{
      dataParams:{
        type   : Object
       ,default:{}
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
           ,confirm
           ,cancel
        }
    }
   ,data:{
        params:{
            tblChngEfctAnalList : null
           ,tblIdList: []
           ,dbConnId:''
        }
   }
   ,methods: {
        init() {
            const $this = this;
        }
        ,initData(){
            const $this = this;
            $this.params.tblIdList = [];
            $this.params.dbConnId = $this.dataParams.dbConnId;
            $this.params.tblIdList = $this.dataParams.tblIdList
        }
        //그리드 생성        
       ,initGrid(){
            const $this = this;
            $this.initData();

            $this.params.tblIdList.forEach(el=>{
                el.stndDt = el.stndDt.replaceAll('-','');
                el['dbConnId'] = $this.params.dbConnId;
            })
            let gridObj={
                url : '/cmon/env/tblChngEfctAnal/selectListTblChngEfctAnal.hb',
                colModels : [
                    {name:'schId'     ,label: '스키마'      , width: 5, align:'center'}
                   ,{name:'tblId'     ,label: '테이블ID'    , width: 7, align:'left'  }
                   ,{name:'tblNm'     ,label: '테이블명'    , width: 9, align:'left'  }
                   ,{name:'jsetNo'    ,label: '작업셋ID'    , width: 7, align:'center'}
                   ,{name:'jsetNm'    ,label: '작업셋명'    , width: 12, align:'left'}
                   ,{name:'unitJobNo' ,label: '단위작업ID'  , width: 7, align:'center'}
                   ,{name:'unitJobNm' ,label: '단위작업명'  , width: 13, align:'left'}]            
                ,options:{
                    gridComplete(){
                        $this.params.tblChngEfctAnalList = $(this).jqGrid('getRowData');
                    }   
                }
            }
            this.$nextTick(function(){
                $this.$refs.TblChngEfctAnal.init(gridObj);
                $this.$refs.TblChngEfctAnal.selectList();
            });
        }
        //엑셀다운로드        
       ,downloadExcel(){
            let $this = this;
            if($this.isVald($this.params.tblChngEfctAnalList,'엑셀다운로드')){
                let fileNm = '테이블변경영향검토결과_'+DateUtil.getCurrDate('YYYYMMDD')+'.xlsx';
                $this.doDownExcel('/cmon/env/tblChngEfctAnal/selectListTblChngEfctAnalDownloadExcel.hb', $this.$props.dataParams, fileNm);
            }
        }
        //유효성검사
        ,isVald(chkVal,stmt){
            const $this = this;
            let stmt1 = ' 대상이 없습니다';
            let returnSmtm = stmt + stmt1;

            if(ValdUtil.isNull(chkVal) || chkVal.length == 0){
                $this.alert(returnSmtm);
                return false;
            }
            return true;
        }    
    }
}
</script>