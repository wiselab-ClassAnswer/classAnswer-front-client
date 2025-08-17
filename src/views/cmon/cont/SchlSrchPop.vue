<template>
    <Modal ref="baseModal" :width="50">
        <div class="content-section">
            <div class="section-wrap p-0">
                <div class="w-100">
                <!-- 검색조건 -->
                <div class="vw-4 ib">
                    <div class="line1 w-100">
                        <div class="content-container">
                            <div class="title vw-1">
                                <span>학교명</span>
                            </div>
                            <div class="content vw-2">
                                <input type="text" ref="srchWord" model="params.schlNm" />
                            </div>
                            <div class="content vw-1">
                                <button class="btn-normal w-100 ht-100 p-5" @click="selectList()">검색</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="wrapper-content m-t-10">
                    <Grid ref="grid" :paging="true" :dataParams="params" :sortable=true ></Grid> 
                </div>
            </div>
            </div>
        </div>        
        <div class="button-box1 m-t-20">
            <button class="btn-normal m-r-5" @click="submit">선택</button>
            <button class="btn-normal"  @click="cancel">닫기</button>
        </div>
    </Modal>

</template>

<script>
import Modal from '@/components/dialog/modal.vue';
import Grid from '@/components/grid/Grid.vue'

export default {
    components: {
        Modal,
        Grid
    },
    data: function () {
        return {
            params: {
                schlNm: ''
            }
        }
    },
    methods: {
        init: function () {
            const $this = this;
            $this.resetData();
            $this.initGrid();
        },

        //  화면 초기화
        resetData() {
            const $this = this;
            //  검색조건 초기화
            $this.resetParams();
            $this.CmonUtil.setFocus($this.$refs.srchWord);
        },

        resetParams() {
             const $this = this;

             $this.params.schlNm = '';
        },

        initGrid() {
            let $this = this;

            // $this.gridObj = {
            //     url: '/cmon/sys/menuMng/selectListMenuBase.hb',
            //     colModels: [
            //         {name:'menuNo'      ,label: '메뉴번호'      , width: 15  , align:'center' },
            //         {name:'menuNm'      ,label: '메뉴명'        , width: 30  , align:'left'   },
            //         {name:'upprMenuNo'  ,label: '상위메뉴번호'  , width: 15  , align:'center' },
            //         {name:'upprMenuNm'  ,label: '상위메뉴명  '  , width: 20  , align:'left'   },
            //         {name:'useYn'       ,label: '사용여부'      , width: 10  , align:'center' },
            //         {name:'depth'       ,label: 'DEPTH'        , width: 15  , align:'right' , hidden: true},
            //     ],
            //     options: {
            //         rownumbers: true,
            //         height: 627,
            //         onSelectRow : function(rowid){
            //             $this.grdSpec.menuNo = $(this).jqGrid('getRowData', rowid).menuNo;
            //             if($this.grdSpec.menuNo === '00000'){
            //                 $this.isRootChk = true;
            //                 $this.alert("Root Menu는 수정/삭제할 수 없습니다.");
            //             } else {
            //                 $this.isRootChk = false;
            //             }

            //             $this.params.crud = 'U';
            //         },
            //     },
            // };
            // $this.$refs.grid.init($this.gridObj);
        },

        // 모달 표시
        show() {
            this.$refs.baseModal.open();
        },

        // 모달 닫기
        cancel() {
            this.$refs.baseModal.close();
        },
    },
    mounted: function () {
        this.init();
    }
}
</script>


<style scoped>
</style>