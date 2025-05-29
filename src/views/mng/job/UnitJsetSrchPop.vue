<template>
    <Modal ref="baseModal" :width="50">
        <div class="section-wrap">
            <h2>작업셋 검색</h2>
            <div class="section-wrap">
                <div class="section-part part1">
                    <div class="c-wd-90 m-r-20 ib">
                        <div>
                            <span class="wd-70">검색어</span>
                            <input class="c-wd-70" type="text" v-model="params.srchWord" v-on:keyup.enter="selectList" ref="refSrchWord">
                        </div>
                    </div>
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
            <button class="btn-normal m-r-5" @click="sendRowData()" :disabled="selectedRowData == ''">선택</button>
            <button class="btn-normal" @click="cancel">닫기</button>
        </div>
    </Modal>
</template>
<script>
import { ref } from 'vue'
import Grid    from '@/components/grid/Grid.vue'
import Modal   from '@/components/dialog/modal.vue'

export default {
    name: "JsetSrchPop",
    components: {
        Modal,
        Grid
    },
    props:{
        dataParams:{
            type   : Object,
            default:{}
        }  
    },
    setup() {
        const baseModal = ref(null);

        const show = () => {
            baseModal.value.open();
        }
        const cancel = () => {
            baseModal.value.close();
        }
        
        return {
            baseModal,
            show,
            cancel
        }
    },
    data() {
        return {
            params:{
                srchWord    : '',
            },
            selectedRowData : ''
        }
    },
    methods: {
        init() {
            this.initData();
            this.initGrid();
        },
        initData() {
            this.params.srchWord    = '';
            this.selectedData       = '';
        },
        //그리드 생성
        initGrid() {
            const $this = this;
            let gridOptions = {
                url: '/mng/job/unitJobMng/selectListJsetInfo.hb',
                colModels: [
                    {name:'jsetNo'      ,label: '작업셋번호'     , width: 40 , align:'center',},
                    {name:'jsetStrtDt'  ,label: '작업셋시작일자' , width: 40 , align:'center', formatter: $this.formatDate},
                    {name:'jsetEndDt'   ,label: '작업셋종료일자' , width: 40 , align:'center', formatter: $this.formatDate},
                    {name:'jsetNm'      ,label: '작업셋명'       , width:120 , align:'left'   },
                ],
                options: {
                    onSelectRow(rowid) {
                        $this.selectedRowData = $(this).jqGrid('getRowData', rowid);
                    },
                    ondblClickRow(rowid) {
                        $this.selectedRowData = $(this).jqGrid('getRowData', rowid);
                        $this.sendRowData();
                    }
                },
            }   
            this.$nextTick(() => {
                $this.$refs.gridObj.init(gridOptions);
                $this.selectList();
            });
        },
        // 그리드 조회
        selectList() {
            this.$refs.gridObj.selectList(true);
            this.selectedRowData = '';
        },
        // 선택 버튼 클릭
        sendRowData() {
            if(this.ValdUtil.isNull(this.selectedRowData)) {
                this.alert('추가 할 행을 선택하여 주세요.');
                return false;
            }
            this.$emit('getUnitJsetSrchPopRowData', this.selectedRowData);
            this.selectedRowData = null;
            this.cancel();
        },
        setFocus () {
            this.$refs.refSrchWord.focus();
        },
    },
    mounted() {

   }
}
</script>