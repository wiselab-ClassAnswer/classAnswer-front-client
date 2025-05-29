<template>
    <Modal ref="baseModal" :width="35">
        <div class="section-wrap">
            <h2>프로젝트 검색</h2>
            <div class="section-wrap">
                <div class="section-part part1">
                    <div class="c-wd-90 m-r-20 ib">
                        <div class="m-b-5">
                            <span class="wd-70">프로젝트명</span>
                            <input type="text" v-model="params.prctNm" v-on:keyup.enter="searchList()">
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
   components: {
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
                prctNm: ''
            },
            selectedData: ''
        }
    },
    methods: {
        init() {
            this.reset();
        }
        //그리드 생성
       ,initGrid(){
            const $this = this;
            let gridOptions = {
                url:'/prct/mng/busiMng/selectPrctSrchPop.hb',
                colModels:[
                    {name:'prctNo'      ,label: '프로젝트번호'      , width: 30     , align:'center'  },
                    {name:'prctNm'      ,label: '프로젝트명'        , width: 50    , align:'left'     },
                    {name:'prctEngNm'   ,label: '프로젝트영문명'    , width: 50    , align:'left'     },
                    {name:'prctStrtDt'  ,label: '프로젝트시작일자'  , width: 40     , align:'center'  , formatter: $this.formatDate},
                    {name:'prctEndDt'   ,label: '프로젝트종료일자'  , width: 40     , align:'center'  , formatter: $this.formatDate}
                ]
               ,options:{
                    onSelectRow(rowid) {
                        $this.selectedData = $(this).jqGrid('getRowData',rowid);
                    }
                    ,ondblClickRow(rowid){
                        $this.selectedData = $(this).jqGrid('getRowData',rowid);
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
            this.$nextTick(function(){
                $this.$refs.gridObj.selectList(true);
                $this.selectedData = '';
            });
       }
       //버튼 선택
       ,selectData(){
            const $this = this;     
            $this.$emit('onSelect',$this.selectedData);
            $this.cancel();
       }
       ,reset(){
            const $this = this;
            $this.params.prctNm  = '';
            $this.selectedData = '';
       }
    }
   ,mounted(){
        const $this = this;
        $this.init();
   }
}
</script>