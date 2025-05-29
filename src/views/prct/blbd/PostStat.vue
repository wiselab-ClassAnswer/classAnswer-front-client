<template>
    <div>
        <!-- 검색조건 -->
        <div class="section section1">
            <div class="search-box">
                <div class="m-b-10">
                    <h1>검색조건</h1>
                    <SetButton :showInit="true" :showSelect="true" :showSave="false" :showDelete="false" @on-set-button-click="onSetButtonClick"></SetButton>
                </div>
                <div class="input-box">
                    <div class="w-10">
                        <h2>프로젝트명</h2>
                        <select  v-model="params.prctNo">
                            <option value = ''></option>
                            <option v-for="item in code.prctInfoList" :key="item.colId" :value="item.colId" >{{ item.colNm }}</option>
                        </select>
                    </div>
                    <div class="w-20">
                        <h2>제목</h2>
                        <input type="text" v-model="params.titl" v-on:keyup.enter="selectList">
                    </div>
                    <div class="w-10">
                        <h2>업무</h2>
                        <input type="text" v-model="params.busiNm" v-on:keyup.enter="selectList" >
                    </div>
                    <div class="w-10" style="position:relative">
                        <h2>담당자</h2>
                        <input v-clear @change="clearVal()" class="search" type="text" v-model="params.chrgUserNm" disabled/>
                        <button class="btn-search" @click="popupSrchUser">
                            <img src="@/assets/img/btn_search.png" alt="찾기">
                        </button>
                    </div>
                    <div class="w-5">
                        <h2>게시물유형</h2>
                        <select v-model="params.postTypeCd">
                            <option key="" value="">{{' '}}</option>
                            <option v-for="item in code.postTypeCdList" :key="item.cdVal" :value="item.cdVal">{{item.cdNm}}</option>
                        </select>      
                    </div>
                    <div class="w-30 m-l-10">
                        <h2 class="m-b-5">처리상태</h2>
                        <div class="radio-container" >
                            <label v-for="el in code.busiProcDivCdList" :key="el">
                                <input type="radio" v-model="params.procStatCd" :value="el.cdVal" :id="el.cdVal" style="margin: 0;">
                                <p class="m-l-5 m-r-10">{{ el.cdVal === '' ? '전체' : el.cdNm }}</p> 
                            </label>
                        </div>                            
                    </div>
                </div>
            </div>
        </div>

        <!-- 게시판 목록 -->
        <div class="section4">
            <div class="section-wrap">
                <h2 class="ib">게시물 목록</h2>
                <div class="btn-group-box">
                    <button class="btn-normal" @click="popupPostMng">게시물등록</button>
                    <button class="btn-exel-download" @click="downloadExcel">
                        <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                        <p>다운로드</p>
                    </button>
                </div>
                <div class="wrapper-content">
                    <Grid ref="grid" :dataParams="params" :paging="true"></Grid>
                </div>
            </div>
        </div>
        <PostMng  ref="PostMngModal" @selectList="reload"></PostMng>
        <UserSrch ref="ChrgUserSrchModal" :dataParams="params" @getUserPopRowData="selectedChrgUser"></UserSrch>
    </div>
</template>

<script>

import { inject, reactive} from 'vue'
import { SessionUtil }     from '@/utils/SessionUtil.js'
import Grid       from '@/components/grid/Grid.vue'
import SetButton  from '@/components/SetButton.vue'
import Datepicker from '@/components/datepicker/Datepicker.vue'
import PostMng    from '@/views/prct/blbd/PostMng.vue'
import UserSrch   from '@/views/mng/job/UserSrch.vue'
import {DateUtil }  from '@/utils/DateUtil.js'

export default {
    components: {
        Grid,
        SetButton,
        Datepicker,
        PostMng,
        UserSrch,
    },
    setup() {        
        //공통코드조회
        const getCmonCdList = inject('getCmonCdList')
        let code = reactive({
            prctInfoList : [],
            busiProcDivCdList: [],
            postTypeCdList: []
        })
        getCmonCdList('BUSI_PROC_DIV_CD', code.busiProcDivCdList, 'Y', '');
        getCmonCdList('POST_TYPE_CD'    , code.postTypeCdList   , 'N', '');

        const getColIdNmList = inject('getColIdNmList');

        const prctInfoListData = {
              'tblId': 'tc_prct_base'
            , 'colId': 'prct_no'
            , 'colNm': 'prct_nm'
            , 'where': []
            , 'orderby': [
                { 'orderCol': 'prct_no' }
            ]
        }
        getColIdNmList(prctInfoListData, code.prctInfoList, 'N', null);

        return {
           code
        }
    },
    data: function() {
		return {
            params: {
                prctNo: '',
                titl: '',
                procStatCd: '',
                postTypeCd: '',
                chrgUserId: '',
                chrgUserNm: '',
                busiNm: ''
            }
        }
    },
    methods: {
        init: function() {
            const $this = this;
            $this.initData();
            $this.initGrid();
            $this.selectList();
        },
        initData() {
            this.params = {
                prctNo: '',
                titl: '',
                procStatCd: '10',
                chrgUserId: SessionUtil.getUserInfo().userId,
                chrgUserNm: SessionUtil.getUserInfo().userNm
            }
        },
        initGrid() {
            let $this = this;

            let gridOptions = {
                url: '/prct/blbd/postStat/selectList.hb',
                colModels: [
                    {name:'prctNo'    ,label: '프로젝트번호' , width: 40 , align:'center', hidden: true},
                    {name:'blbdNo'    ,label: '게시판번호'   , width: 40 , align:'center', hidden: true},
                    {name:'postNo'    ,label: '게시번호'    , width: 20 , align:'center' },
                    {name:'titl'      ,label: '제목'        , width: 200, align:'left'   , formatter: function(val, opt, rowObj) {
                        if ( rowObj.bullYn == 'Y' ) {
                            return '<div class="bold">[공지] ' + val + '</div>';
                        } else {
                            return val;
                        }
                    }},
                    {name:'busiNm'    ,label: '업무명'     , width: 50 , align:'center' },
                    {name:'busiNo'    ,label: '업무번호'   , width: 50 , align:'center', hidden: true},
                    {name:'postTypeCd',label: '게시물유형' , width: 50 , align:'center', hidden: true},
                    {name:'postTypeNm',label: '게시물유형' , width: 25 , align:'center' },
                    {name:'procStatCd',label: '처리상태코드', width: 50 , align:'center', hidden: true},
                    {name:'procStatNm',label: '처리상태'   , width: 20 , align:'center' },
                    {name:'srchCnt'   ,label: '조회수'     , width: 20 , align:'center', formatter: 'integer'  },
                    {name:'chrgUserNm',label: '담당자'     , width: 40 , align:'center' },
                    // {name:'likeCnt'   ,label: '좋아요수'   , width: 80 , align:'center', formatter: 'integer'  },
                    // {name:'hateCnt'   ,label: '싫어요수'   , width: 80 , align:'center', formatter: 'integer'  },
                    // {name:'atchYn'    ,label: '첨부파일'   , width: 50 , align:'center' },
                    {name:'regiUserNm',label: '등록자'     , width: 40 , align:'center' },
                    {name:'regiDt'    ,label: '등록일시'   , width: 50 , align:'center', formatter: $this.formatDttm1},
                    {name:'updtUserNm',label: '수정자'     , width: 40 , align:'center' },
                    {name:'updtDt'    ,label: '수정일시'   , width: 50 , align:'center', formatter: $this.formatDttm2},
                ],
                options: {
                    onCellSelect(rowid) {
                        const rowData = $(this).jqGrid('getRowData', rowid);
                        $this.selectDetl(rowData);
                    },
                }
            }
            $this.$refs.grid.init(gridOptions);
        },
        selectList() {
            this.$refs.grid.selectList(true);
        },
        selectDetl(rowData) {
            this.$refs.PostMngModal.show();
            this.$refs.PostMngModal.openPopup(rowData.prctNo, rowData.blbdNo, rowData.postNo);
        },
        // 게시물 등록 팝업
        popupPostMng() {
            if ( this.ValdUtil.isNull(this.params.prctNo) ) {
                this.alert("프로젝트를 선택하시기 바랍니다.");
                return false;
            }
            this.$refs.PostMngModal.show();
            this.$refs.PostMngModal.openPopup(this.params.prctNo, '1');
        },
        reload() {
            this.selectList();
        },
        // 담당자조회 팝업
        popupSrchUser() {
            this.$refs.ChrgUserSrchModal.show();
            this.$refs.ChrgUserSrchModal.initGrid();
        },
        selectedChrgUser(user) {
            this.params.chrgUserId = user.userId;
            this.params.chrgUserNm = user.userNm;
        },
        downloadExcel() {
            this.doDownExcel('/prct/blbd/postStat/selectListDownloadExcel.hb', this.params, '게시물목록.xlsx');
        },
        formatDttm1(cellValue, options, rowObject){
            let procCmplDttm = '';
            procCmplDttm = DateUtil.dateToDash(rowObject.regiDt)+', '+DateUtil.dateToDash(rowObject.regiTm);
            return procCmplDttm;
        },
        formatDttm2(cellValue, options, rowObject){
            let procCmplDttm = '';
            procCmplDttm = DateUtil.dateToDash(rowObject.updtDt)+', '+DateUtil.dateToDash(rowObject.updtTm);
            return procCmplDttm;
        },
        clearVal(){
            this.params.chrgUserId = '';
            this.params.chrgUserNm = '';
        },
        onSetButtonClick(div) {
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.init();
                    break;
                case 'select':
                    $this.selectList();
                    break;
                case 'save':
                    break;
                case 'delete':
                    break;
                default:
                    break;
            }
        }
    },
    mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>
