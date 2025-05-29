<template>
    <Modal ref="baseModal" :width="35">
        <div class="section-wrap">
            <h2>워크스페이스 검색</h2>
            <div class="section-wrap">
                <div class="section-part part1">
                    <!-- <div class="w-100">   -->
                        <div class="c-wd-80 ib">
                            <span class="wd-80">워크스페이스</span>
                            <input ref="wkspNm" class="c-wd-80" type="text" v-model="params.wkspNm" v-on:keyup.enter="searchListWksp()">
                        </div>
                        <div class="wd-80 ib p-l-5" style="text-align:left">
                            <button class="btn-normal" @click="searchListWksp()">조회</button>
                        </div>
                    <!-- </div> -->
                </div>
            </div>
        </div>
        <div class="b m-t-20">
        <!-- 그리드 -->
        <Grid ref="wkspGrid" :dataParams="params" :paging=false></Grid>
        </div>
        <div class="button-box1 m-t-20">
            <button class="btn-normal m-r-5" @click="selectBtn()" :disabled="!params.rowData!=''">선택</button>
            <button class="btn-normal" @click="cancel">닫기</button>
        </div>
    </Modal>
</template>
<script>
import { ref }      from 'vue'
import Grid         from '@/components/grid/Grid.vue'
import Modal        from '@/components/dialog/modal.vue'
import { ValdUtil } from '@/utils/ValdUtil.js'

export default {
    name: "wkspSrch"
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
   ,setup(){    
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
            params:{
                wkspNm: ''          //워크스페이스 명
               ,wkspTypeCd: ''      //워크스페이스 유형 코드
               ,rowData:''          //선택 행 데이터
            }
        }
    },
    methods: {
        init() {
            const $this = this;
            $this.params.wkspNm = '';
            $this.CmonUtil.setFocus(this.$refs.wkspNm);
            $this.initGrid();
        }
        //그리드 생성
       ,initGrid(){
            const $this = this;
            let gridData={
                url : '/mng/job/wkspSrch/selectListWksp.hb'
               ,colModels:[
                    {name:'wkspId'        ,label:'워크스페이스ID'   ,width:25    ,align:'center'  }
                   ,{name:'wkspNm'        ,label:'워크스페이스명'   ,width:50    ,align:'left'    }
                   ,{name:'wkspTypeNm'    ,label:'유형명'          ,width:20    ,align:'center'  }
                   ,{name:'wkspStrtDt'    ,label:'적용시작일자'     ,width:25    ,align:'center'  ,formatter:$this.formatDate}
                   ,{name:'wkspEndDt'     ,label:'적용종료일자'     ,width:25    ,align:'center'  ,formatter:$this.formatDate}
                   ,{name:'wkspCnts'      ,label:'워크스페이스내용' ,hidden:true                  }
                   ,{name:'wkspTypeCd'    ,label:'유형코드'        ,hidden:true                  }]
               ,options:{
                    onSelectRow(rowid, val, e){
                        $this.params.rowData = $(this).jqGrid('getRowData',rowid);
                    }
                   ,ondblClickRow(rowid, iRow, iCol){
                        $this.params.rowData = $(this).jqGrid('getRowData',rowid);
                        $this.selectBtn();
                   }
                }
            }   
            this.$nextTick(function(){
                $this.$refs.wkspGrid.init(gridData);
                $this.searchListWksp();
            });
        }
        //조회  워크스페이스목록
       ,searchListWksp(){
            if (this.ValdUtil.isNotNull(this.dataParams.wkspTypeCd)) {
                this.params.wkspTypeCd = this.dataParams.wkspTypeCd;
            }
            this.$refs.wkspGrid.selectList();
       }
       //버튼 선택
       ,selectBtn(){
            const $this = this;  
            if(ValdUtil.isNotNull(this.dataParams.wkspId)){
                $this.confirm({
                    content:'기존에 입력한 데이터가 삭제됩니다. <br/>선택하시겠습니까?'
                   ,callback:{
                        yes: function(){
                            $this.$emit('selectWksp',$this.params.rowData);
                            $this.cancel();
                        }    
                    }
                });
            }else{
                $this.$emit('selectWksp',$this.params.rowData);
                $this.cancel();
            }
       }
    }
}
</script>