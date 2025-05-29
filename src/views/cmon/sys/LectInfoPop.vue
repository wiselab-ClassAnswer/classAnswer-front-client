<template>
    <Modal ref="baseModal" :width="50">
        <div class="section-wrap">
            <h2>강사 조회</h2>
            <!-- 검색조건 영역 -->
            <div class="w-100">
                <!-- 검색조건 -->
                <div class="section-part part1 w-100">
                    
                        <div class="w-100 b">
                            <div class="w-45 ib">
                                <div class="wd-100 ib">
                                    <span class="w-100 t-a-c p-r-10">사용자ID</span>
                                </div>
                                <div class="c-wd-100 ib">
                                    <input class="w-100" type="text" v-model="srchParams.userId" v-on:keyup.enter="selectList()">
                                </div>
                            </div>
                            <div class="w-45 ib">
                                <div class="wd-100 ib">
                                    <span class="w-100 t-a-c p-r-10">강사명</span>
                                </div>
                                <div class="c-wd-100 ib">
                                    <input class="w-100" type="text" v-model="srchParams.userNm" v-on:keyup.enter="selectList()">
                                </div>
                            </div>
                            <div class="w-10  t-a-c p-r-30 ib">
                                <div class="wd-100 ib">
                                    <button class="btn-normal wd-80" @click="selectList()">조회</button>
                                </div>
                            </div>
                        </div>
                    
                </div>
                <div class="wrapper-content m-t-10">
                    <Grid ref="lectGrid" :paging="true" :dataParams="srchParams" :sortable=true ></Grid> 
                </div>
            </div>
        </div>
        <div class="button-box1 m-t-20">
            <button class="btn-normal m-r-5" @click="select">선택</button>
            <button class="btn-normal"  @click="cancel">닫기</button>
        </div>
    </Modal>
</template>

<script>

import { ref }      from 'vue'; 
import Modal        from '@/components/dialog/modal.vue';
import Grid         from '@/components/grid/Grid.vue';
import { ValdUtil } from '@/utils/ValdUtil';
import { CmonUtil } from '@/utils/CmonUtil';

export default {
    name: "confirm-dialog",
    components: {
        Modal,
        Grid
    },
    props:{
        
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
    data: function() {
        return {
            srchParams:{
                userId : '',
                userNm : '',
            },
            params:{
                selectedRowData : '',
            },
        }
    },
    methods: {
        init() {
            const $this = this;
            $this.initData();
            $this.initGrid();
            $this.$nextTick(() =>{
                $this.selectList();
            })
        },
        // 데이터 초기화
        initData(){
            const $this = this;
            
                $this.srchParams.userId = '',
                $this.srchParams.userNm = '',
                $this.params.selectedRowData = '';

        }, 
        // 그리드 초기화
        initGrid () {
            const $this = this;
            
            let lectGridObj = {
                url : "/cmon/sys/eduCousMng/selectListLectList.hb",
                colModels : [
                    {name:'userId'          , label: '사용자ID'       , width: 30    , align:'center'   },
                    {name:'userNm'          , label: '강사명'         , width: 30    , align:'center'     },
                    {name:'procEcousCnt'    , label: '진행중 교육수'   , width: 30    , align:'right', formatter:$this.thousandComma  },
                    {name:'lmitToknCnt'     , label: '할당 토큰수'     , width: 40    , align:'right', formatter:$this.thousandComma  },
                    {name:'useToknCnt'      , label: '사용 토큰수'     , width: 40    , align:'right', formatter:$this.thousandComma  }
                ],
                options : {
                    rownumbers:true, 
                    onSelectRow(rowid, val, e){
                        let gridData = $(this).jqGrid('getRowData',rowid);
                        $this.params.selectedRowData = gridData;
                    },
                    ondblClickRow(rowid, iRow, iCol) {
                        let gridData = $(this).jqGrid('getRowData',rowid);
                        $this.params.selectedRowData = gridData;
                        $this.$emit('selectedData',$this.params);
                        $this.cancel();
                    } 
                }
            }
            this.$nextTick(function(){
                $this.$refs.lectGrid.init(lectGridObj);              
            });
        },
        selectList(){
            const $this =this;
            $this.$refs.lectGrid.selectList(true);
        },
        select(){
            const $this = this;
            $this.$emit('selectedData',$this.params);
            $this.cancel();
        },
    }
}
</script>