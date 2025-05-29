<template>
    <div>
        <!-- 검색조건 -->
        <div class="section section1">
            <div class="search-box">
                <div class="input-box w-100">
                    <div class="w-5 ib">
                        <h1>검색조건</h1>
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-40 ib">검색어</h2>
                        <input class="c-wd-40 ib" ref="srchWord" type="text" v-model="params.srchWord" v-on:keyup.enter="searchListSchdJob(true)">
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="false" :showDelete="false" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>


        <!-- 스케줄러 작업큐 목록 -->
        <div class="section sectionL w-45">
            <div class="section-wrap">
                <h2 class="ib">스케줄러 작업큐 목록</h2>
                <!-- 그리드 -->
                <div class="wrapper-content">
                    <Grid ref="schdGrid" :dataParams="params" :paging="false" ></Grid>
                </div>
            </div>
        </div>

        <!-- 에이전트 작업목록 -->
        <div class="section sectionR w-55">
            <div class="section-wrap p-t-15">
                <div class="section-part m-0 p-0">
                    <h2 class="ib">에이전트 작업목록</h2>
                </div>
                <!-- 그리드 -->
                <div class="wrapper-content w-100 ib">
                    <Grid ref="agentGrid" :dataParams="agentParams" :paging="false" ></Grid>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { DateUtil }         from '@/utils/DateUtil.js'
import { ValdUtil }         from '@/utils/ValdUtil.js'
import { GridUtil }         from '@/utils/GridUtil.js'
import Grid                 from '@/components/grid/Grid.vue'
import SetButton            from '@/components/SetButton.vue'
import { reactive, inject } from 'vue'

export default {
    components: {
        Grid,
        SetButton,
    },

    setup() {
        // let code = reactive({
        //     ynCdList : []
        // })
        // const getCmonCdList = inject('getCmonCdList');
        // getCmonCdList('YN', code.ynCdList, 'Y', null);  // YN / YN
        // return {
        //     code
        // }
    },

    data: function() {
		return {
            params: {
                srchWord: ''
            },
            agentParams: {

            }
        }
    },
    methods: {
        init() {
            this.initData();
            this.initGrid();
        },
        initData() {
            this.params.srchWord = '';
        },
        initGrid() {
            let $this = this;

            let schdGridObj = {
                url: '/cmon/sys/jobStatMntr/selectWkspJobQueue.hb',
                colModels: [
                    {name:'jobNm'     ,label: '작업명'      ,width: 10    , align:'center' },
                    {name:'jobExecNo' ,label: '실행번호'    ,width: 10    , align:'center' },
                    {name:'csetNo'    ,label: '이행셋'      ,width: 10    , align:'center' },
                    {name:'wkspId'    ,label: '워크스페이스',width: 10    , align:'center' },
                    {name:'jobStatNm' ,label: '작업상태'    ,width: 10    , align:'center' },
                    {name:'agentPort' ,label: '포트'        ,width: 5    , align:'center' },
                    {name:'agentPid'  ,label: 'PID'         ,width: 5    , align:'center' },
                ],
                options: {
                    onSelectRow : function(rowid, a, event){
                        
                        let gridData = $(this).jqGrid('getRowData', rowid);
                        if ( gridData.jobNm == 'EMPLOY_WORKER' ) {
                            $this.agentParams.jobExecNo = gridData.jobExecNo;
                            $this.agentParams.csetNo    = gridData.csetNo;
                            $this.agentParams.wkspId    = gridData.wkspId;
                            
                            $this.searchListAgentJob();
                        }
                    }
                },
            };
            this.$refs.schdGrid.init(schdGridObj);
            this.searchListSchdJob();

            let agentGridObj = {
                url: '/cmon/sys/jobStatMntr/selectJsetList.hb',
                colModels: [
                    {name:'jobExecNo'      ,label: '실행번호'       ,width: 10, align:'center', hidden: true },
                    {name:'csetNo'         ,label: '이행셋'         ,width: 10, align:'center', hidden: true },
                    {name:'wkspId'         ,label: '워크스페이스'    ,width: 10, align:'center', hidden: true },
                    {name:'jsetNo'         ,label: '작업셋'          ,width: 10, align:'center' },
                    {name:'jsetStatNm'     ,label: '작업상태'        ,width: 10, align:'center' },
                    {name:'unitJobNo'      ,label: '단위작업번호'    ,width: 10, align:'center' },
                    {name:'unitJobStatCd'  ,label: '단위작업상태'    ,width: 10, align:'center' },
                    {name:'unitJobStrtDttm',label: '단위작업시작일시',width: 20, align:'center' },
                    {name:'unitJobEndDttm' ,label: '단위작업종료일시',width: 20, align:'center' },
                ]
            };
            this.$refs.agentGrid.init(agentGridObj);
        },
        searchListSchdJob() {
            
            //  그리드 선택행 초기화
            // $this.resetGridSpec();
            //  Grid 데이터 초기화
            this.$refs.schdGrid.clearGridData();
            this.$refs.agentGrid.clearGridData();

            this.$refs.schdGrid.selectList(true);
        },
        searchListAgentJob() {
            this.$refs.agentGrid.clearGridData();
            this.$refs.agentGrid.selectList(true);
        },
        // 공통버튼(초기화, 조회, 저장) 컴포넌트 핸들러
        onSetButtonClick (div) {
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.init();
                    break;
                case 'select':
                    $this.searchListSchdJob();
                    break;
                case 'save':
                    $this.alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
                default:
                    $this.alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
        }
    },

    mounted: function() {
        this.init();
    }   
}
</script>