<template>
    <div>
         <!-- 검색조건 -->
         <div class="section section1">
            <div class="search-box">
                <div class="m-b-10">
                    <h1>검색조건</h1>
                    <SetButton :showInit="true" :showSelect="true" :showSave="false" :showDelete="false" @on-set-button-click="onSetButtonClick"></SetButton>
                </div>
                <div class="input-box w-100">
                    <div class="w-15 ib">
                        <h2>검색조건</h2>
                        <select v-model="srchParams.srchType">
                            <option v-for="el in code.chnlKindCdList" :key="el.cdVal" :value="el.cdVal">
                                {{ el.cdNm }}
                            </option>                            
                        </select>
                    </div>
                    <div class="w-15 ib">
                        <h2>검색어</h2>
                        <input type="text" v-on:keyup.enter="onSetButtonClick('select')" v-model="srchParams.srchVal">
                    </div>
                    <div class="w-15 ib">
                        <div class="input-check">
                            <input type="checkbox" class="ib w-10 p-rl" style="height:auto; top:1px;"  true-value="Y" false-value="N" @change="onSetButtonClick('select')" v-model="srchParams.endYn" >
                            <p>게시 종료된 공지사항을 포함합니다</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>    

        <!-- 공지사항목록 그리드 -->
        <div class="section section4" >            
            <div class="section-wrap">
                <h2 class="ib">공지사항목록</h2>
                <!-- 그리드 -->
                <div class="wrapper-content">
                    <Grid ref="notiGrid" :dataParams="srchParams" :paging="true"></Grid>
                </div>
            </div>
        </div>
        <NotiInfoPop ref="notiInfoModal"></NotiInfoPop>
    </div>
</template>

<script>
import Grid            from '@/components/grid/Grid.vue'
import SetButton       from '@/components/SetButton.vue'
import NotiInfoPop     from '../sys/NotiInfoPop.vue'

export default {
    components: {
        Grid,
        SetButton,
        NotiInfoPop,
    },
    data: function () {
        return {
            srchParams : {
                srchType   : '',         // 검색조건
                srchVal    : '',         // 검색어
                endYn      : '',         // 게시 종료된 공지사항 포함 여부
            },
            code: {
                chnlKindCdList: [
                    { cdVal: 'TITLE'   , cdNm: '제목'       },
                    { cdVal: 'CONTENT' , cdNm: '내용'       },
                    { cdVal: 'BOTH'    , cdNm: '제목+내용'  },
                ]
            },
        }
    },
    methods: {
        // mount시 초기화
        init() {
            const $this = this;            
            $this.initData();
            $this.initGrid();
            $this.selectList();
        },
        // data 초기화
        initData() {
            const $this = this;
            $this.srchParams.srchType  = 'TITLE';
            $this.srchParams.srchVal   = '';
            $this.srchParams.endYn     = 'Y';
        },
        // 그리드 초기화
        initGrid() {
            let $this = this;
            console.log("");
            let gridObj = {
                url: '/blbd/noti/selectList.hb',
                colModels: [
                    { name:'blbdNo'      ,label: '게시번호'  , width: 40  , align:'center'   , hidden: true},
                    { name:'blbdStrtDt'  ,label: '게시일자'  , width: 40  , align:'center'   , formatter: $this.formatDate},
                    { name:'blbdTitl'    ,label: '제목'      , width: 200 , align:'center' },
                    { name:'blbdEndDt'   ,label: '게시기한'  , width: 40  , align:'center'   , formatter: $this.formatDate},
                    { name:'srchCnt'     ,label: '조회수'    , width: 30  , align:'center' },
                ],
                options: {                  
                    onSelectRow : function(rowid) {
                        let params = $(this).jqGrid('getRowData', rowid);
                        console.log("params.blbdNo", params.blbdNo)
                        $this.openPopup(params.blbdNo);
                    },
                    gridComplete: function() {}
                },
            };
            $this.$refs.notiGrid.init(gridObj);
        },
        // 그리드 목록 조회
        selectList() {
            const $this = this;
            $this.$refs.notiGrid.selectList(true);
        },        
        // 팝업 호출
        openPopup(blbdNo) {
            const $this = this;
            // 팝업 호출
            $this.$refs.notiInfoModal.show();
            $this.$refs.notiInfoModal.init(blbdNo);
        },
        // 공통버튼(초기화, 조회, 저장, 삭제) 컴포넌트 핸들러
        onSetButtonClick (div) {
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.init();
                    break;
                case 'select':
                    $this.selectList();
                    break;
                case 'save':
                    $this.bfSaveStatCnfm();
                    break;
                case 'delete':
                    $this.deltCnfm();
                    break;
                default:
                    $this.alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
        },
    },
    mounted: function () {
        const $this = this;
        $this.init();
    }
}

</script>