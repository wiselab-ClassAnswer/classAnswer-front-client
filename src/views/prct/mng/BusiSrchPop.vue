<template>
    <Modal ref="baseModal" :width="60">
        <div class="section-wrap">
            <h2>업무 검색</h2>
            <div class="section-wrap">
                <div class="section-part part1">
                    <div class="c-wd-90 m-r-20 ib">
                        <div class="m-b-5">
                            <span class="wd-70 essn">업무명</span>
                            <input type="text" v-model="params.busiNm" v-on:keyup.enter="searchList()">
                        </div>
                    </div>
                    <div class="wd-80 ib">
                        <button class="btn-normal" @click="searchList(true)">조회</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="b m-t-20">
            <Grid ref="gridObj" :dataParams="params" :paging=true></Grid>
        </div>
        <div class="button-box1 m-t-20">
            <button class="btn-normal m-r-5" @click="selectData()" :disabled="!params.rowData!=''">선택</button>
            <button class="btn-normal" @click="cancel">닫기</button>
        </div>
    </Modal>
</template>
<script>
import { ref } from 'vue'
import Grid    from '@/components/grid/Grid.vue'
import Modal   from '@/components/dialog/modal.vue'

export default {
    name: "BusiSrchPop"
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
                busiNm: '',
                rowData: ''
            }
        }
    },
    methods: {
        init(data) {

        }
        //그리드 생성
       ,initGrid(){
            const $this = this;
            let gridOptions = {
                url:'/prct/mng/busiMng/selectList.hb',
                colModels:[
                    {name:'busiNo'      ,label: '업무번호'     , width: 40 , align:'left', hidden: true},
                    {name:'busiNm'      ,label: '업무명'       , width: 80 , align:'left'  },
                    {name:'busiTypeCd'  ,label: '업무유형'     , width: 50 , align:'center', hidden: true},
                    {name:'busiTypeNm'  ,label: '업무유형'     , width: 50 , align:'center'  },
                    {name:'prevBusiNo'  ,label: '선행업무'     , width: 80 , align:'left', hidden: true},
                    {name:'prevBusiNm'  ,label: '선행업무'     , width: 80 , align:'left'  },
                    {name:'fcstNeedDcnt',label: '예상소요일수' , width: 50 , align:'center'  },
                    {name:'chrtUserNm'  ,label: '담당자'       , width: 50 , align:'center'  },
                    {name:'busiStatCd'  ,label: '업무상태'     , width: 50 , align:'left', hidden: true},
                    {name:'busiStatNm'  ,label: '업무상태'     , width: 50 , align:'center'  },
                    {name:'schdStrtDt'  ,label: '예정시작일자' , width: 40 , align:'center', formatter: $this.formatDate},
                    {name:'schdEndDt'   ,label: '예정종료일자' , width: 40 , align:'center', formatter: $this.formatDate},
                    {name:'realStrtDt'  ,label: '실제시작일자' , width: 40 , align:'center', formatter: $this.formatDate},
                    {name:'realEndDt'   ,label: '실제종료일자' , width: 40 , align:'center', formatter: $this.formatDate}
                ]
               ,options:{
                    onSelectRow(rowid) {
                        $this.params.rowData = $(this).jqGrid('getRowData',rowid);
                    }
                    ,ondblClickRow(rowid){
                        $this.params.rowData = $(this).jqGrid('getRowData',rowid);
                        $this.selectData();
                    } 
                }
            }   
            this.$nextTick(function(){
                $this.$refs.gridObj.init(gridOptions);
            });
        }
        //조회  테이블목록
       ,searchList(){
            const $this = this;
            $this.$refs.gridObj.selectList(true);
            $this.params.rowData = '';
       }
       //버튼 선택
       ,selectData(){
            const $this = this;     
            $this.$emit('onSelect',$this.params.rowData);
            $this.cancel();
       }
       ,reset(){
            const $this = this;
            $this.params.busiNm = '';
            $this.params.rowData = '';
       }
    }
   ,mounted(){
        const $this = this;
        $this.init();
   }
}
</script>