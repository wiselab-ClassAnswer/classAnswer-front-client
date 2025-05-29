<template>
      <Modal ref="baseModal" :width="50" > 
        <div class="section-wrap">
            <h2>변경이력조회</h2>
            <!-- 변경이력 조회 시 프로젝트명 / 업무명은 화면에서 값을 가져오고 disabled 처리 
            담당자명만 조회 되게끔 
            그리드에 추가할거 있으면 하고  -->
            <div class="section-wrap">
                <div class="section-part part1 w-100">
                    <div class="w-100 b">
                        <div class="w-33 ib">
                            <div class="wd-100 ib">
                                <span class="w-100">프로젝트명</span>
                            </div>
                            <div class="c-wd-100 ib">
                                <input class="w-100" type="text" v-model="params.prctNm" disabled>
                            </div>
                        </div>
                        <div class="w-33 ib">
                            <div class="wd-100 ib">
                                <span class="w-100">업무명</span>
                            </div>
                            <div class="c-wd-100 ib">
                                <input class="w-100" type="text" v-model="params.busiNm" disabled>
                            </div>
                        </div>
                        <div class="w-33 ib">
                            <div class="wd-100 ib">
                                <span class="w-100">담당자명</span>
                            </div>
                            <div class="c-wd-100 ib">
                                <input class="w-100" type="text" v-model="params.chrgUserNm" disabled>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        <div class="b m-t-10">
            <!-- 그리드 -->
            <Grid ref="busiHistGrid" :paging="true" :dataParams="params" :sortable=true ></Grid> 
        </div>
        <div class="button-box1 m-t-20">
            <button class="btn-normal"  @click="cancel">닫기</button>
        </div>
    </Modal>
</template>

<script>
//Modal / Grid
import { ref }  from 'vue'
import Modal    from '@/components/dialog/modal.vue'
import Grid     from '@/components/grid/Grid.vue'
import {ValdUtil} from '@/utils/ValdUtil.js';

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
            params: {
                chrgUserNm : '',  
                prctNm : '',  
                busiNm : '',  
                busiNo   : '',
            },
        }
    },
    methods: {
        // 초기화
        init() {
            const $this = this;
            // 1. 그리드 초기화
            // 2. 파라미터 초기화
            $this.reset();
            $this.initData();
            $this.initGrid();
            $this.searchList();
        },
        initData(data){
            const $this = this;
            if(ValdUtil.isNotNull(data)){
                $this.params = data;
            }
        },
        //그리드 생성 
        initGrid() {
             // 1. 담당자 그리드 선언 
                // 1) 그리드 url 지정
                // 2) 그리드 colModel 지정
                      // 날짜 / 담당자 / 배정자  + @
                      // tc_chrg_hist
            const $this = this;
            let gridObj = {
                url:'/prct/mng/busiChrgMng/selectListChrgHist.hb',
                colModels:[
                    {name:'alocDt'      ,label: '배정일자'     , width: 20     , align:'center' ,formatter:$this.formatDate},
                    {name:'prctNo'      ,label: '프로젝트번호' , width: 10     , align:'center' ,hidden : true},
                    {name:'prctNm'      ,label: '프로젝트명'   , width: 30     , align:'center' },
                    {name:'busiNo'      ,label: '업무번호'     , width: 10     , align:'center' ,hidden : true},
                    {name:'busiNm'      ,label: '업무명'       , width: 30     , align:'center'},
                    {name:'chrgHistNo'  ,label: '변경이력번호' , width: 10     , align:'center' ,hidden : true},
                    {name:'chrgUserId'  ,label: '담당자ID'     , width: 10     , align:'center' ,hidden : true},
                    {name:'chrgUserNm'  ,label: '담당자명'     , width: 10     , align:'center'},
                    {name:'alocUserId'  ,label: '배정자ID'     , width: 10     , align:'center', hidden : true},
                    {name:'alocUserNm'  ,label: '배정자명'     , width: 10     , align:'center'},
                ], 
                options:{
                    height:300
                }
            }
            this.$nextTick(() =>{
                $this.$refs.busiHistGrid.init(gridObj);
            })
            
        },
         
        // 그리드 조회 함수
        searchList() {
            //그리드 조회
            const $this = this;
            this.$nextTick(() =>{
                $this.$refs.busiHistGrid.selectList(true);
            });
        },

        //초기화
        reset(){
            const $this = this;
            this.params.srchChrg    = '';
            this.params.srchPrct    = '';
            this.params.srchBusi    = '';
        },
        // 이력은 조회만 하므로 행 선택시 값 전달 로직 X
    }
}
</script>
