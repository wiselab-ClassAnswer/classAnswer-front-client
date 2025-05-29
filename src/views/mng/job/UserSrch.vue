<template>
    <Modal ref="baseModal" :width="35">
        <div class="section-wrap">
            <h2>사용자 검색</h2>
            <div class="section-wrap">
                <div class="section-part part1">
                    <div class="c-wd-90 m-r-20 ib">
                        <div>
                            <span class="wd-70">검색어</span>
                            <input class="c-wd-70" type="text" v-model="params.srchUserId" v-on:keyup.enter="selectListUserSrchGrid()" ref="srchUserIdPop">
                        </div>
                    </div>
                    <div class="wd-80 ib">
                        <button class="btn-normal" @click="selectListUserSrchGrid()">조회</button>
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
            type: Object,
            default: null
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
                srchUserId: '',
            },
            selectedRowData: null,
        }
    },
    methods: {
        init() {
            this.params.srchUserId = '';
            this.initGrid();
        },
        initGrid(){
            const $this = this;
            let userSrchGrid ={
                url : '/mng/job/userSrch/selectListUserSrchGrid.hb',
                colModels : [
                    { name: 'userId'        , index: 'userId'       , label: '사용자ID'         , width: 100    , align: 'left'    },
                    { name: 'userNm'        , index: 'userNm'       , label: '사용자명'         , width: 120    , align: 'left'    },
                    { name: 'useYn'         , index: 'useYn'        , label: '사용여부'         , width: 50     , align: 'center'    },
                    { name: 'roleCdList'    , index: 'roleCdList'   , label: '역할(ROLE)'       , width: 250    , align: 'left'    },
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
                this.$refs.srchUserIdPop.focus();
            });
        },        
        sendRowData() {
            if(this.ValdUtil.isNull(this.selectedRowData)) {
                this.alert('추가 할 행을 선택하여 주세요.');
                return false;
            }
            this.selectedRowData.userDiv = this.dataParams.userDiv;
            this.$emit('getUserPopRowData', this.selectedRowData);
            this.selectedRowData = null;
            this.cancel();
        },
        callInitGrid(userSrchGrid) {            
            this.userSrchGrid.init(userSrchGrid);   
            this.$refs.userSrchGrid.selectList(true, false);
        },
        selectListUserSrchGrid() {
            this.$refs.userSrchGrid.selectList(true, false);
        },
        setFocus() {
            this.$nextTick(()=>{
                this.$refs.srchUserIdPop.focus();
            })
        },
    },
    mounted: function() {  
    },
}
</script>