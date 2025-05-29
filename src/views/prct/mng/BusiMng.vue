<template>
    <div>
        <!-- 검색조건 -->
        <div class="section section1">
            <div class="search-box">
                <div class="m-b-10">
                    <h1>검색조건</h1>
                    <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="true" @on-set-button-click="onSetButtonClick"></SetButton>
                    <div class="input-box">
                        <div class="w-10">
                            <h2>프로젝트명</h2>
                            <select  v-model="params.srchPrctNo">
                                <option value = ''></option>
                                <option v-for="item in code.prctInfoList" :key="item.colId" :value="item.colId" >{{ item.colNm }}</option>
                            </select>
                        </div>
                        <div class="w-10">
                            <h2>업무명</h2>
                            <input type="text" v-model="params.srchBusiNm" v-on:keyup.enter="selectList">
                        </div>
                        <div class="w-5">
                            <h2>업무유형</h2>
                            <select v-model="params.srchBusiTypeCd">
                                <option value = ''></option>
                                <option v-for="item in code.busiTypeCdList" :key="item.cdVal" :value="item.cdVal">{{item.cdNm}}</option>
                            </select>
                        </div>
                        <div class="w-10">
                            <h2>업무상태</h2>
                            <select v-model="params.srchBusiStatCd">
                                <option value = ''></option>
                                <option v-for="item in code.busiStatCdList" :key="item.cdVal" :value="item.cdVal">{{item.cdNm}}</option>
                            </select>
                        </div>
                        <div style="position:relative">
                            <h2>담당자</h2>
                            <input class="search" type="text" v-model="params.srchUserId" disabled>
                            <button class="btn-search"  @click="popupUserSrch()"  >
                                <img src="@/assets/img/btn_search.png" alt="찾기">
                            </button>
                        </div>
                        <div class="w-10">
                            <input type="text"  v-model="params.srchUserNm" disabled/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 업무 목록 -->
        <div class="section section2 w-60">
            <div class="section-wrap">
                <h2 class="ib">업무 목록</h2>
                <button class="btn-exel-download only" @click="downloadExcel">
                    <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                    <p>다운로드</p>
                </button>
                <div class="wrapper-content">
                    <Grid ref="grid" :dataParams="params" :paging="true"></Grid>
                </div>
            </div>
        </div>

        <!-- 상세정보 -->
        <div class="section section3 w-40">
            <div class="section-wrap">
                <h2 class="ib">업무 정보</h2>
                <div class="btn-group-box">
                    <button class="btn-normal btn-normal-flex" @click="menuMngLink()">메뉴관리 이동</button>
                    <button class="btn-normal btn-normal-flex" @click="busiSchdMngLink()">업무일정관리 이동</button>
                    <button class="btn-normal btn-normal-flex" @click="busiChrgMngLink()">업무담당자관리 이동</button>      
                </div>
                <div class="section-part part1">
                    <div class="w-100">
                        <div class="w-50 ib p-r-10">
                            <span class="wd-90 essn">프로젝트명</span>
                            <div class="c-wd-90 ib">
                                <div class="input-btn w-100">
                                    <input class="w-100" type="text" v-model="busiInfo.prctNm" disabled>
                                    <button class="post-btn" @click="popupPrctSrch()">
                                        <img src="@/assets/img/btn_search.png" alt="찾기">    
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="w-50 ib p-l-10">
                            <span class="wd-90 essn">업무번호</span>
                            <input class="c-wd-90" type="text" v-model="busiInfo.busiNo" disabled>
                        </div>
                    </div>
                    <div class="w-100">
                         <div class="w-50 ib p-r-10">
                            <span class="wd-90 essn">업무영문명</span>
                            <input class="c-wd-90" type="text" v-model="busiInfo.busiEngNm">
                        </div>
                        <div class="w-50 ib p-l-10">
                            <span class="wd-90 essn">업무명</span>
                            <input class="c-wd-90" type="text" v-model="busiInfo.busiNm">
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-50 ib p-r-10">
                            <span class="wd-90 essn">업무유형</span>
                            <select class="c-wd-90" v-model="busiInfo.busiTypeCd">
                                <option value = ''></option>
                                <option v-for="item in code.busiTypeCdList" :key="item.cdVal" :value="item.cdVal">{{item.cdNm}}</option>
                            </select>
                        </div>
                        <div class="w-50 ib p-l-10">
                            <span class="wd-90 essn">업무상태</span>
                            <select class="c-wd-90" v-model="busiInfo.busiStatCd">
                                <option value = ''></option>
                                <option v-for="item in code.busiStatCdList" :key="item.cdVal" :value="item.cdVal">{{item.cdNm}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-50 ib p-r-10">
                            <span class="wd-90 essn">업무경로</span>
                            <input class="c-wd-90" type="text" v-model="busiInfo.busiUrl" placeholder="[예시]/cmon/sys/">
                        </div>
                        <div class="w-50 ib p-l-10">
                            <span class="wd-90">선행업무명</span>
                            <div class="input-btn c-wd-90">
                                <input class="w-100" type="text" v-model="busiInfo.prevBusiNm" disabled>
                                <button class="post-btn" @click="popupBusiSrch">
                                    <img src="@/assets/img/btn_search.png" alt="찾기">    
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="text-box">
                        <span class="wd-90">비고</span>
                        <textarea class="c-wd-90" cols="30" rows="5" v-model="busiInfo.rmrk" style="height: 300px;"></textarea>
                    </div>
                    <h2 class="ib m-b-5">소스 제너레이터</h2>
                    <div class="w-100">
                        <div class="w-100 ib p-r-10">
                            <span class="wd-80">소스생성</span>
                            <button class="btn-normal btn-normal-flex m-l-10" @click="genCtrlBtn()">Controller 생성</button>
                            <button class="btn-normal btn-normal-flex m-l-10" @click="genServBtn()">Service 생성</button>
                            <button class="btn-normal btn-normal-flex m-l-10" @click="genVueBtn()">Vue 생성</button>
                            <button class="btn-normal btn-normal-flex m-l-10" @click="insertMenuBaseBtn()">메뉴등록</button>
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-100 ib p-r-10">
                            <span class="wd-90">기본쿼리 생성</span>
                            <input type="text" v-model="busiInfo.tblNm" placeholder="테이블명" style="width: 187px; important">
                            <button class="btn-normal btn-normal-flex m-l-10" @click="genXmlBtn()">XML 생성</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <UserSrch ref="UserSrchModal" :dataParams="params" @getUserPopRowData="selectedDataUser"></UserSrch>
        <BusiSrch ref="BusiSrchModal" :dataParams="params" @onSelect="selectedDataBusi"></BusiSrch>
        <PrctSrch ref="PrctSrchModal" :dataParams="params" @onSelect="selectedDataPrct"></PrctSrch>
    </div>
</template>

<script>

import { inject, reactive}  from 'vue'
import Grid                 from '@/components/grid/Grid.vue'
import SetButton            from '@/components/SetButton.vue'
import Datepicker           from '@/components/datepicker/Datepicker.vue'
import UserSrch             from '@/views/mng/job/UserSrch.vue'
import BusiSrch             from '@/views/prct/mng/BusiSrchPop.vue'
import PrctSrch             from '@/views/prct/mng/PrctSrchPopup.vue'
import { DateUtil }         from '@/utils/DateUtil'
import { ValdUtil }         from '@/utils/ValdUtil'
import { CmonUtil }         from '@/utils/CmonUtil'

export default {
    components: {
        Grid,
        SetButton,
        Datepicker,
        UserSrch,
        BusiSrch,
        PrctSrch
    },
    setup() {        
        //공통코드조회
        const getCmonCdList = inject('getCmonCdList')
        let code = reactive({
            busiTypeCdList: [],
            busiStatCdList: [],
            prctInfoList : []
        })
        getCmonCdList('BUSI_TYPE_CD', code.busiTypeCdList, 'N', null);
        getCmonCdList('BUSI_STAT_CD', code.busiStatCdList, 'N', null);

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
                srchPrctNo        : '',
                srchBusiNm        : '',
                srchBusiTypeCd    : '',
                srchBusiStatCd    : '',
                srchUserId        : '',
                srchUserNm        : '',
                crud              : 'C',
                fcstRealDcnt      : 0,
                tblNm             : ''
            },
            busiInfo: {
                prctNo            : '',
                prctNm            : '',
                prctEngNm         : '',
                busiNo            : '',
                busiNm            : '',
                busiEngNm         : '',
                busiUrl           : '',
                busiTypeCd        : '',
                prevBusiNo        : '',
                prevBusiNm        : '',
                fcstNeedDcnt      : 0,
                schdStrtDt        : '',
                schdEndDt         : '',
                realStrtDt        : '',
                realEndDt         : '',
                chrgUserId        : '',
                chrgUserNm        : '',
                busiStatCd        : '',
                rmrk              : ''
            },
            prctInfoList : []
        }
    },
    methods: {
        init: function() {
            const $this = this;
            let data = CmonUtil.getPageLink('U1030');
            $this.initData(data);
            $this.initGrid();
            $this.$refs.grid.clearGridData();
            $this.selectList();
            
        },
        initData(data) {
            const $this = this;
            if(ValdUtil.isNotNull(data)){
                $this.params.srchPrctNo     = data.prctNo;
                $this.params.srchBusiNm     = data.busiNm;
                $this.params.srchBusiTypeCd = data.busiTypeCd;
                $this.params.srchUserNm     = data.chrgUserNm;
                $this.busiInfo              = data;
            } else {
                    this.params ={
                        srchPrctNo        : '',
                        srchBusiNm        : '',
                        srchBusiTypeCd    : '',
                        srchBusiStatCd    : '',
                        srchUserId        : '',
                        srchUserNm        : '',
                        crud              : 'C',
                        fcstRealDcnt      : 0,
                    }

                    this.busiInfo = {
                        prctNo            : '',
                        prctNm            : '',
                        prctEngNm         : '',
                        busiNo            : '',
                        busiNm            : '',
                        busiEngNm         : '',
                        busiUrl           : '',
                        busiTypeCd        : '',
                        prevBusiNo        : '',
                        prevBusiNm        : '',
                        fcstNeedDcnt      : 0,
                        chrgUserId        : '',
                        chrgUserNm        : '',
                        busiStatCd        : '',
                        rmrk              : ''
                    }
            }
        },
        initGrid() {
            let $this = this;

            let gridOptions = {
                url: '/prct/mng/busiMng/selectList.hb',
                colModels: [
                    {name:'prctNo'      ,label: '프로젝트번호'     , width: 40     , align:'center'  , hidden: true},
                    {name:'prctNm'      ,label: '프로젝트명'       , width: 40     , align:'left'    },
                    {name:'busiNo'      ,label: '업무번호'         , width: 30     , align:'center'  , hidden: true},
                    {name:'busiNm'      ,label: '업무명'           , width: 40     , align:'left'    },
                    {name:'busiTypeCd'  ,label: '업무유형'         , width: 30     , align:'center'  , hidden: true},
                    {name:'busiTypeNm'  ,label: '업무유형'         , width: 30     , align:'center'  },
                    {name:'busiUrl'     ,label: '업무경로'         , width: 40     , align:'left'    },
                    {name:'prevBusiNo'  ,label: '선행업무번호'     , width: 40     , align:'center'  , hidden: true},
                    {name:'prevBusiNm'  ,label: '선행업무'         , width: 80     , align:'left'    , hidden: true},
                    {name:'chrgUserNm'  ,label: '담당자'           , width: 30     , align:'center'  },
                    {name:'busiStatCd'  ,label: '업무상태'         , width: 30     , align:'left'    , hidden: true},
                    {name:'busiStatNm'  ,label: '업무상태'         , width: 30     , align:'center'  },
                ],
                options: {
                    onCellSelect(rowid) {
                        const rowData = $(this).jqGrid('getRowData', rowid);
                        
                        // const schdStrtDt          = new Date(rowData.schdStrtDt);
                        // const schdEndDt           = new Date(rowData.schdEndDt);

                        // const diffSec             = schdEndDt.getTime() - schdStrtDt.getTime();
                        // if(isNaN(diffSec)){
                        //     $this.params.fcstRealDcnt = 0;
                        // } else {
                        //     $this.params.fcstRealDcnt = diffSec /(1000 * 3600 * 24);
                        // }
                        

                        $this.params.crud = 'U';
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
            const $this = this;
            let params = {
                busiNo: rowData.busiNo
            }
            $this.doPost('/prct/mng/busiMng/selectDetl.hb', params).then(function(res) {
                if ( res.data.rtnCd != '0000') {
                    $this.alert(res.data.rtnMsg);
                } else {
                    $this.busiInfo = res.data.rtnData;
                }
            });
        },

        save() {
            const $this = this;
            if($this.isValid()){
                let url = '';
                if($this.params.crud == 'C'){
                    url = '/prct/mng/busiMng/insert.hb';
                } else if ($this.params.crud ==='U'){
                    url = '/prct/mng/busiMng/update.hb';
                }

                let params = _.cloneDeep($this.busiInfo);

                const schdStrtDt = new Date(params.schdStrtDt);
                const schdEndDt  = new Date(params.schdEndDt);

                const diffSec    = schdEndDt.getTime() - schdStrtDt.getTime();
                if(isNaN(diffSec)){
                    $this.params.fcstNeedDcnt = 0;
                } else {
                    $this.params.fcstNeedDcnt = diffSec /(1000 * 3600 * 24);
                }
                        
                params.fcstNeedDcnt = diffSec /(1000 * 3600 * 24); 
                
                $this.doPost(url, params).then(function(res) {
                    if ( res.data.rtnCd == '0000') {
                        $this.alert("저장되었습니다.").then((result) =>{
                            if(result.isConfirmed){
                                $this.initData();
                                $this.selectList();
                            }
                        })
                    } else {
                        $this.alert(res.data.rtnMsg);
                    }
                });
            }
        },
        delete() {
            const $this = this;
            $this.doPost('/prct/mng/busiMng/delete.hb', $this.busiInfo).then(function(res) {
                if ( res.data.rtnCd == '0000') {
                    $this.alert("삭제되었습니다.").then((result) =>{
                        if(result.isConfirmed){
                            $this.initData();
                            $this.selectList();
                        }
                    })
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
        },
        downloadExcel() {
            const $this = this;
            let grid     = $this.$refs.grid.getGridObj();
            let gridData = grid.getRowData();

            if(gridData.length > 0){
                let fileNm = '업무목록_'+DateUtil.getCurrDate()+'.xlsx';
                this.doDownExcel('/prct/mng/busiMng/selectListDownloadExcel.hb', this.params, fileNm); 
            } else {
                $this.alert("조회된 값이 없습니다.");
            }
        },
        isValid(){
            const $this = this;

            if(!$this.ValdUtil.valdLenNull($this.busiInfo.prctNo        , 10     , '프로젝트번호는')) return false;
            if(!$this.ValdUtil.valdLenNull($this.busiInfo.busiNm        , 200    , '업무명은'      )) return false;
            if(!$this.ValdUtil.valdLenNull($this.busiInfo.busiTypeCd    , 20     , '업무유형은'    )) return false;
            if(!$this.ValdUtil.valdLenNull($this.busiInfo.busiStatCd    , 20     , '업무상태는'    )) return false;

            return true;
        },
        // 메뉴관리 이동
        menuMngLink() {
            CmonUtil.setPageLink('E2030');
        },
        //업무일정관리 이동
        busiSchdMngLink(){
            const $this = this;
            if($this.params.crud ==='C'){
                let params = {
                    prctNo : $this.params.srchPrctNo,
                    busiNm : $this.params.srchBusiNm
                };
                CmonUtil.setPageLink('U1040',params);
            } else if ($this.params.crud ==='U'){
                let params = $this.busiInfo;
                CmonUtil.setPageLink('U1040',params);
            }
        },
        //업무담당자관리 이동
        busiChrgMngLink(){
            const $this = this;
            if($this.params.crud ==='C'){
                let params = {
                    prctNo : $this.params.srchPrctNo,
                    busiNm : $this.params.srchBusiNm
                };
                CmonUtil.setPageLink('U1050',params);
            } else if ($this.params.crud ==='U'){
                let params = $this.busiInfo;
                CmonUtil.setPageLink('U1050',params);
            }
        },

        onSelectedDatepickerFcstStrtDt(selectedDate) {
            this.busiInfo.schdStrtDt = selectedDate;
        },
        onSelectedDatepickerFcstEndDt(selectedDate) {
            this.busiInfo.schdEndDt = selectedDate;
        },
        onSelectedDatepickerRealStrtDt(selectedDate) {
            this.busiInfo.realStrtDt = selectedDate;
        },
        onSelectedDatepickerRealEndDt(selectedDate) {
            this.busiInfo.realEndDt = selectedDate;
        },
        popupBusiSrch() {
            this.$refs.BusiSrchModal.show();
            this.$refs.BusiSrchModal.initGrid();
            this.$refs.BusiSrchModal.searchList();
        },
        popupUserSrch() {
            this.$refs.UserSrchModal.show();
            this.$refs.UserSrchModal.initGrid();
            this.$refs.UserSrchModal.selectListUserSrchGrid();
        },
        popupPrctSrch() {
            this.$refs.PrctSrchModal.show();
            this.$refs.PrctSrchModal.init();
            this.$refs.PrctSrchModal.initGrid();
            this.$refs.PrctSrchModal.searchList();
        },
        selectedDataBusi(data) {
            this.busiInfo.prevBusiNo = data.busiNo;
            this.busiInfo.prevBusiNm = data.busiNm;
        },
        selectedDataUser(data) {
            this.params.srchUserId  = data.userId;
            this.params.srchUserNm  = data.userNm;
        },
        selectedDataPrct(data) {
            this.busiInfo.prctNo    =  data.prctNo;
            this.busiInfo.prctNm    = data.prctNm;
            this.busiInfo.prctEngNm = data.prctEngNm;
        },
        // 소스 제너레이터 생성 시 유효성 검증 
        isGenVald(){
            const $this = this;
            if(!ValdUtil.valdLenNull($this.busiInfo.prctNm    ,200 ,'프로젝트명은'))      return false;
            if(!ValdUtil.valdLenNull($this.busiInfo.busiNm    ,200 ,'업무명은'))          return false;
            if(!ValdUtil.valdLenNull($this.busiInfo.prctEngNm ,200 ,'프로젝트영문명은'))   return false;
            if(!ValdUtil.valdLenNull($this.busiInfo.busiEngNm ,200 ,'업무영문명은'))       return false;
            if(!ValdUtil.valdLenNull($this.busiInfo.prctEngNm ,200 ,'프로젝트영문명은'))   return false;
            if(!ValdUtil.valdLenNull($this.busiInfo.busiEngNm ,200 ,'업무영문명은'))       return false;
            if(!ValdUtil.valdLenNull($this.busiInfo.busiUrl   ,200 ,'업무경로는'))         return false;

            return true;
        },
        //Controller 생성 
        genCtrlBtn(){
            const $this = this;
            if($this.isGenVald()){
                $this.confirm({
                    content : $this.busiInfo.busiNm + " Controller 파일을 생성하시겠습니까?<br>확인버튼 클릭 시 기존 Controller는 삭제됩니다.",
                    callback : {
                        yes(){
                            //Controller 생성함수
                            $this.genCtrlFile(); 
                        }
                    }
                })
            } 
        },
        genCtrlFile(){
            const $this = this;
            let params = { busiNo : $this.busiInfo.busiNo};
            $this.doPost('/prct/mng/busiMng/genCtrlFile.hb', params).then(function(res) {
                if ( res.data.rtnCd == '0000') {
                    $this.alert("파일이 생성되었습니다.");
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
        },
        //Service 생성 
        genServBtn(){
            const $this = this;
            if($this.isGenVald()){
                $this.confirm({
                    content : $this.busiInfo.busiNm +' Service 파일을 생성하시겠습니까?<br>확인버튼 클릭 시 기존 Service는 삭제됩니다.',
                    callback : {
                        yes(){
                            //Service 생성함수 
                            $this.genServFile();
                        }
                    }
                })
            }
        },
        genServFile(){
            const $this = this;
            let params = {
                busiNo : $this.busiInfo.busiNo,
                tblNm  : $this.busiInfo.tblNm
            };
            $this.doPost('/prct/mng/busiMng/genServFile.hb', params).then(function(res) {
                if ( res.data.rtnCd == '0000') {
                    $this.alert("파일이 생성되었습니다.");
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
        },

        //Xml 생성 
        genXmlBtn(){
            const $this = this;

            if ( $this.ValdUtil.isNull($this.busiInfo.tblNm) ) {
                $thia.alert("테이블명은 입력하셔야 합니다.");
                return false;
            }

            $this.confirm({
                content : $this.busiInfo.busiNm +' xml 파일을 생성하시겠습니까?<br>확인버튼 클릭 시 기존 xml은 삭제됩니다.',
                callback : {
                    yes(){
                        //xml 생성함수 
                        $this.genXmlFile();
                    }
                }
            });
        },
        genXmlFile(){
            const $this = this;
            let params = { tblNm : $this.busiInfo.tblNm };
            $this.doPost('/prct/mng/busiMng/genXmlFile.hb', params).then(function(res) {
                if ( res.data.rtnCd == '0000') {
                    $this.alert("파일이 생성되었습니다.");
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
        },

        //Vue 생성 
        genVueBtn(){
            const $this = this;
            if($this.isGenVald()){
                $this.confirm({
                    content : $this.busiInfo.busiNm +' vue 파일을 생성하시겠습니까?<br>확인버튼 클릭 시 기존 vue는 삭제됩니다.',
                    callback : {
                        yes(){
                            //vue 생성함수 
                            $this.genVueFile();
                        }
                    }
                })
            }
        },

        genVueFile(){
            const $this = this;
            let params = { busiNo : $this.busiInfo.busiNo};
            $this.doPost('/prct/mng/busiMng/genVueFile.hb', params).then(function(res) {
                if ( res.data.rtnCd == '0000') {
                    $this.alert("파일이 생성되었습니다.");
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
        },

        insertMenuBaseBtn() {
            const $this = this;
            let params = {
                prctNo : $this.busiInfo.prctNo,
                busiNo : $this.busiInfo.busiNo
            }
            $this.doPost('prct/mng/busiMng/insertMenuBase.hb', params).then(function(res) {
                if ( res.data.rtnCd == '0000') {
                    $this.alert("파일이 생성되었습니다.");
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
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
                    $this.save();
                    break;
                case 'delete':
                    $this.delete();
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
