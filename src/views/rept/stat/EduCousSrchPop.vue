<template>
    <Modal ref="baseModal" :width="47">
        <div class="section-wrap">
            <h2>교육과정검색</h2>
            <div class="section-wrap">
                <div class="section-part part1">
                    <div class="c-wd-90 m-r-20 ib">
                        <div>
                            <span class="wd-70">검색어</span>
                            <input class="c-wd-70" type="text" v-model="params.srchTerm" v-on:keyup.enter="selectListEduCous()" ref="srchEduCousPop">
                        </div>
                    </div>
                    <div class="wd-80 ib">
                        <button class="btn-normal" @click="selectListEduCous()">조회</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="b m-t-20">
            <Grid ref="userSrchGrid" :dataParams="params" :paging=true></Grid>
        </div>
        <div class="button-box1 m-t-20">
            <button class="btn-normal m-r-5" @click="sendRowData">선택</button>
            <button class="btn-normal" @click="cancel">닫기</button>
        </div>
    </Modal>
</template>

<script>
/* global $ */
import { ref } from 'vue'
import Modal from '@/components/dialog/modal.vue'
import Grid from '@/components/grid/Grid.vue';

export default {
    components: {
        Modal
       ,Grid
    },
    props:{
        dataParams:{
            type: Object
           ,default: null
        },
    },
    setup() {
        
        const baseModal = ref(null);
        const userSrchGrid = ref(null);

        const show = () => {
            baseModal.value.open();
        }
        const cancel = () => {
            baseModal.value.close();
        }

        return {
            baseModal,
            userSrchGrid,
            show,
            cancel,
        }
    },
    data() {
        return {
            params: {
                srchTerm : '',
            },
            selectedRowData: null,
        }
    },
    methods: {
        init() {
            this.params.srchTerm = '';
            this.initGrid();
        },
        initGrid(){
            const $this = this;
            let userSrchGrid ={
                url : '/rept/stat/eduCousSrchPop/selectListEcousBase.hb',
                colModels : [
                    { name : 'ecousNo'     , index : 'ecousNo'     , label : '교육과정번호' , width: 100    , align: 'center' },
                    { name : 'ecousNm'     , index : 'ecousNm'     , label : '교육과정명'   , width: 300    , align: 'left'   },
                    { name : 'lectNm'      , index : 'lectNm'      , label : '강사명'       , width: 100    , align: 'center' },
                    { name : 'stdtCnt'     , index : 'stdtCnt'     , label : '교육생수'     , width: 100    , align: 'right'  },
                    { name : 'ecousStrtDt' , index : 'ecousStrtDt' , label : '교육시작일'   , width: 100    , align: 'center' },
                    { name : 'ecousEndDt'  , index : 'ecousEndDt'  , label : '교육종료일'   , width: 100    , align: 'center' },
                ],
                options: {                    
                    rownumbers: true,
                    onSelectRow(rowid) {
                        $this.selectedRowData = $(this).jqGrid('getRowData', rowid);
                    },
                    ondblClickRow(rowid) {
                        $this.selectedRowData = $(this).jqGrid('getRowData', rowid);
                        $this.sendRowData();
                    }
                }
            }
            this.$nextTick(function(){
                this.callInitGrid(userSrchGrid);
                this.$refs.srchEduCousPop.focus();
            });
        },        
        sendRowData() {
            if(this.ValdUtil.isNull(this.selectedRowData)) {
                this.alert('추가 할 행을 선택하여 주세요.');
                return false;
            }
            // this.selectedRowData.userDiv = this.dataParams.userDiv;
            this.$emit('getEduCousPopRowData', this.selectedRowData);
            this.selectedRowData = null;
            this.cancel();
        },
        callInitGrid(userSrchGrid) {            
            this.userSrchGrid.init(userSrchGrid);   
            this.$refs.userSrchGrid.selectList(true, false);
        },
        selectListEduCous() {
            this.$refs.userSrchGrid.selectList(true, false);
        },
        setFocus() {
            this.$nextTick(()=>{
                this.$refs.srchEduCousPop.focus();
            })
        },
    },
    mounted: function() {  
    },
}
</script>