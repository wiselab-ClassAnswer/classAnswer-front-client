
<template>
    <Modal ref="baseModal" :width="40">
        <div class="section-wrap">
            <h2>담당자 조회</h2>
            <div class="section-wrap">
                <div class="section-part part1 w-100">
                    <div class="w-100 b">
                        <div class="w-40 ib">
                            <div class="wd-100 ib">
                                <span class="w-100">담당자명</span>
                            </div>
                            <div class="c-wd-100 ib">
                                <input class="w-100" type="text" v-model="params.srchChrg" v-on:keyup.enter="searchList(true)">
                            </div>
                        </div>
                        <div class="w-40 ib">
                            <div class="wd-100 ib">
                                <span class="w-100">프로젝트명</span>
                            </div>
                            <div class="c-wd-100 ib">
                                <input class="w-100" type="text" v-model="params.srchPrct" v-on:keyup.enter="searchList(true)">
                            </div>
                        </div>
                        <div class="button-box1 w-20 ib t-a-r">
                            <button class="btn-normal" @click="searchList()">조회</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="b m-t-20">
            <!-- 그리드 -->
            <Grid ref="srchChrg" :paging="true" :dataParams="params" :sortable=true></Grid>
        </div>
        <div class="button-box1 m-t-20">
            <button class="btn-normal m-r-5" @click="select">선택</button>
            <button class="btn-normal" @click="cancel">닫기</button>
        </div>

    </Modal>
</template>

<script>
import { ref }  from 'vue'
//Modal 
import Modal from '@/components/dialog/modal.vue'
//Grid
import Grid from '@/components/grid/Grid.vue'

export default {
    components: {
        Modal,
        Grid
    },
    setup() {
        // baseModal 선언
        const baseModal = ref(null);
        // baseModal 오픈
        const show = () => {
            baseModal.value.open();
        }
        // baseModal 닫기
        const cancel = () => {
            baseModal.value.close();
        }

        return {
            baseModal,
            show,
            cancel
        }
    },
    data: function () {
        return {
            // 업무담당자관리로 전달할 파라미터
            params: {
                srchChrg : '', // 검색조건 담당자명
                srchPrct : ''  // 프로젝트명
            },
            selectedData : ''
        }
    },
    methods: {
        // 초기화
        init() {
            const $this = this;
            // 1. 그리드 초기화
            $this.initGrid();
            // 2. 파라미터 초기화
            $this.searchList();
        },
        //그리드 생성 
        initGrid() {
            const $this = this;
            let gridObj = {
                url:'/prct/mng/busiChrgMng/selectListChrgMng.hb',
                colModels:[
                    {name:'seq'     ,label: '순번'           , width: 10     , align:'center' ,hidden : true},
                    {name:'prctNo'  ,label: '프로젝트번호'   , width: 10     , align:'center' ,hidden : true},
                    {name:'prctNm'  ,label: '프로젝트명'     , width: 30     , align:'center' },
                    {name:'userId'  ,label: '담당자ID'       , width: 10    , align:'center' },
                    {name:'userNm'  ,label: '담당자명'       , width: 10     , align:'center' },
                    {name:'roleCd'  ,label: '담당자역할코드' , width: 10     , align:'center' ,hidden : true},
                    {name:'roleNm'  ,label: '담당자역할명'   , width: 10     , align:'center' },
                ], 
                options:{
                    height:300,
                    onSelcetRow(rowId){
                        $this.selectedData = $(this).jqGrid('getRowData',rowId);
                    },
                    ondblClickRow(rowId ,colId ,val){
                        $this.selectedData = $(this).jqGrid('getRowData',rowId);
                        $this.select($this.selectedData);
                    }
                }
            }
            this.$nextTick(() =>{
                $this.$refs.srchChrg.init(gridObj);
            }); 
            // 1. 담당자 그리드 선언 
            // 1) 그리드 url 지정
            // 2) 그리드 colModel 지정
            // user_base에서 조회
            // 담당자 id / 담당자명 
        },
        // 그리드에서 값 선택 시 
        select() {
            const $this = this;
            // 선택된 값인 담당자ID와 담당자명을 업무담당자관리 화면으로 전달
            $this.$emit('selectedData',$this.selectedData);
            $this.cancel();
        },
        // 그리드 조회 함수
        searchList() {
            //그리드 조회
            const $this = this;
            this.$nextTick(() =>{
                $this.$refs.srchChrg.selectList(true);
            });
        },
    }
}
</script>
