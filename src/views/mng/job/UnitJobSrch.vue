<template>
    <Modal ref="baseModal" :width="50">
        <div class="section-wrap">
            <h2>단위작업 검색</h2>
            <div class="section-wrap">
                <div class="section-part part1">
                    <div class="c-wd-90 m-r-20 ib">
                        <div>
                            <span class="wd-70">검색어</span>
                            <input class="c-wd-70" type="text" v-model="params.srchUnitJob" v-on:keyup.enter="selectListUnitJobSrchGrid()" ref="refSrchUnitJob">
                        </div>
                    </div>
                    <div class="wd-80 ib">
                        <button class="btn-normal" @click="selectListUnitJobSrchGrid()">조회</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="b m-t-20">
            <!-- 그리드 -->
            <!-- <Grid ref="grid" :colModels="gridColModels" :url="url" :paging=false :dataParams="params" :options="options" ></Grid> -->
            <Grid ref="unitJobSrchGrid" :dataParams="params" :paging=true></Grid>
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
            type: Object,
            default: null
        },
    },
    setup() {
        
        const baseModal = ref(null);
        const unitJobSrchGrid = ref(null);

        const show = () => {
            baseModal.value.open();
        }
        const cancel = () => {
            baseModal.value.close();
        }

        return {
            baseModal,
            unitJobSrchGrid,
            show,
            cancel,
        }
    },
    data() {
        return {
            params: {
                srchUnitJob: '',
            },
            selectedRowData: null,
        }
    },
    methods: {
        init() {
            // const $this = this;
        },
        initGrid(){
            const $this = this;

            // 부모 컴포넌트마다 srchUnitJob 파라미터를 넘기는 경우와 안넘기는 경우가 있음. 넘길땐 받아줌.           
            $this.params.srchUnitJob = $this.dataParams.srchUnitJob;           
            
            let unitJobSrchGrid ={
                url : '/mng/job/unitJobSrch/selectListUnitJobSrchGrid.hb',
                colModels : [
                    { name: 'unitJobNo'         , label: '단위작업번호'         , width: 90     , align: 'center'   , hidden: false},
                    { name: 'subUnitJobNo'      , label: '단위작업번호'         , width: 90     , align: 'left'     , hidden: true},
                    { name: 'unitJobNm'         , label: '단위작업명'           , width: 220    , align: 'left'     },
                    { name: 'upprUnitJobNo'     , label: '상위단위작업번호'     , width: 90     , align: 'center'   },
                    { name: 'upprUnitJobNm'     , label: '상위단위작업명'       , width: 220    , align: 'left'     },
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
                this.callInitGrid(unitJobSrchGrid);
                this.setFocus();
            });
        },        
        sendRowData() {
            if(this.ValdUtil.isNull(this.selectedRowData)) {
                this.alert('추가 할 행을 선택하여 주세요.');
                return false;
            }
            this.$emit('getPopRowData', this.selectedRowData);
            this.selectedRowData = null;
            this.cancel();
        },
        callInitGrid(unitJobSrchGrid) {
            this.unitJobSrchGrid.init(unitJobSrchGrid);   
            this.$refs.unitJobSrchGrid.selectList(true);
        },
        selectListUnitJobSrchGrid() {
            this.$refs.unitJobSrchGrid.selectList(true);
            this.setFocus();
        },
        setFocus() { 
            this.$refs.refSrchUnitJob.focus();           
        },
    },
    mounted: function() {
    },
}
</script>