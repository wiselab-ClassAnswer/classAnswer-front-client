 <template>
    <div>
        <!-- 검색조건 영역 -->
        <div class="section section1">
            <div class="search-box search2">
                <div class="m-b-10">
                    <h1>검색조건</h1>
                    <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="false" @on-set-button-click="onSetButtonClick"></SetButton>
                </div>
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
                        <input ref="srchBusiNm" type="text" v-model="params.srchBusiNm" v-on:keyup.enter="selectBusiList(true)">
                    </div>
                    <div class="w-5">
                        <h2>업무유형</h2>
                        <select v-model="params.busiTypeCd">
                            <option value=''></option>
                            <option v-for="el in code.busiTypeCdList" :key="el.cdVal" :value="el.cdVal">{{el.cdNm}}</option>
                        </select>
                    </div>
                    <div class="w-10">
                        <h2>담당자</h2>
                        <input type="text" v-model="params.srchChrgNm" v-on:keyup.enter="selectBusiList(true)">
                    </div>
                </div>
            </div>
        </div>
        <!-- 검색조건 영역 -->
        <!-- 업무목록 영역 -->
        <div class="section section2 w-65">
            <div class="section-wrap w-100">
                <h2 class="m-b-10 ib">업무목록</h2>
                <div class="btn-group-box">
                    <!-- <button class="btn-normal btn-normal-2" @click="movBusiToChrgBtn">추가</button> -->
                    <div class="btn-group-box">
                        <button class="btn-normal btn-normal-flex" @click="busiMngLink()">업무관리 이동</button>
                        <button class="btn-normal btn-normal-flex" @click="busiSchdMngLink()">업무일정관리 이동</button>      
                        <button class="btn-exel-download" @click="downloadExcel()">
                            <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                            <p>다운로드</p>
                        </button>
                    </div>
                </div>
                <div class="wrapper-content">
                    <Grid ref="busiList" :dataParams="params" :paging="true" :sortable="true"></Grid>
                </div>
            </div>
        </div>
        <div class="w-5 ib t-a-c">
            <div style="padding-top:33vh;">
                <div class="m-b-20">
                    <font-awesome-icon :icon="['fas', 'angle-right']" class="mv-btn" @click="movBusiToChrgBtn" />
                </div>
                <!-- 03/22 "<" 기능 그리드 내 삭제버튼으로 변경 -->
                <!-- <div>
                    <font-awesome-icon :icon="['fas', 'angle-left']" class="mv-btn" @click="movChrgToBusiBtn" />
                </div> -->
            </div>
        </div>
        <!-- 업무목록 영역 -->
        <!-- 담당자목록 영역 -->
        <div class="section section3 w-30">
            <div class="section-wrap">
                <h2 class="m-b-10">담당자목록</h2>
                <div class="section-part part1 m-b-5 ">
                    <div class="w-100">
                        <span class="wd-70 essn">담당자</span>
                        <div class="c-wd-80 ib">
                            <div class="input-btn w-50 m-r-3">
                                <input  class="w-80" type="text" v-model="params.chrgUserId" disabled>
                                <button class="post-btn" @click="openBusiChrgSrchPopup">
                                    <img src="@/assets/img/btn_search.png" alt="찾기">    
                                </button>
                            </div>
                            <input class="w-50" type="text" v-model="params.chrgUserNm" disabled>
                        </div>
                    </div>
                </div>
                <div class="wrapper-content">
                    <Grid ref="chrgList" :dataParams="params" :paging="false"></Grid>
                </div>
            </div>
        </div>
            <!-- 담당자 아이디 + onClick으로 담당자 조회 팝업 -->
            <!-- 담당자 명 -->
            <!-- 담당자목록 그리드 -->
        <!-- 담당자목록 영역 -->
        <BusiChrgChngHistPopup ref="BusiChrgChngHistPopup" :dataParams="params"></BusiChrgChngHistPopup>
        <BusiChrgSrchPopup ref="BusiChrgSrchPopup" :dataParams="params" @selectedData="getChrgInfo"></BusiChrgSrchPopup>
    </div>
</template>

<script>
import { reactive, inject } from 'vue'
// 담당자 조회 팝업
import BusiChrgSrchPopup   from '@/views/prct/mng/BusiChrgSrchPopup.vue'
// 담당자목록 그리드 업무이력 조회 팝업
import BusiChrgChngHistPopup   from '@/views/prct/mng/BusiChrgChngHistPopup.vue'//이름수정
// 그리드
import Grid            from '@/components/grid/Grid.vue'
// 공통 버튼 
import SetButton       from '@/components/SetButton.vue'
import { GridUtil }    from '@/utils/GridUtil'
import { ValdUtil }    from '@/utils/ValdUtil'
import { DateUtil }    from '@/utils/DateUtil'
import { CmonUtil }    from '@/utils/CmonUtil'
import { SessionUtil } from '@/utils/SessionUtil'


export default {
    components: {
        // 그리드,공통버튼,담당자 팝업, 업무이력 팝업
        Grid,
        SetButton,
        BusiChrgSrchPopup,
        BusiChrgChngHistPopup
    },
    setup(){
        const getCmonCdList = inject('getCmonCdList');
        let code = reactive({
            busiTypeCdList : [],
            prctInfoList   : []
        });
        getCmonCdList('BUSI_TYPE_CD', code.busiTypeCdList, 'Y', null);
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
    data: function () {
        return {
            //필요 파라미터 선언
            params: {
                srchPrctNo : '',
                srchBusiNm : '',    // 검색조건 업무명
                busiTypeCd : '',    // 검색조건 업무유형
                srchChrgNm : '',    // 검색조건 담당자명
                chrgUserId : '',    // 담당자 ID
                chrgUserNm : '',    // 담당자명
                busiNo     : '',    // 업무번호
                // 오른쪽 담당자목록 그리드의 담당자 ID
                // 오른쪽 담당자목록 그리드의 담당자명
            },
            // busiMngList : [] // 업무목록에서 선택된 행의 정보를 가져오는 배열
            // chrgMngList : [] // 담당자목록에서 선택된 행의 정보를 가져오는 배열
            // 전역변수로 선언 할 필요 X
        }
    },
    methods: {
        init: function () {
            const $this = this;
            // 1. 업무목록/담당자목록 그리드 생성 및 초기화
            // 2. 파라미터 초기화
            // 3. 검색조건 초기화 및 오른쪽 담당자목록 위에 담당자도 초기화
            $this.reset();
            let data = CmonUtil.getPageLink('U1050');
            if(ValdUtil.isNotNull(data)){
                $this.params.srchPrctNo = data.prctNo;
                $this.params.srchBusiNm = data.busiNm;
            }
            
            $this.resetGrid();
            $this.initGrid();
            $this.selectBusiList();
            $this.CmonUtil.setFocus(this.$refs.srchBusiNm);
            
        },

        //그리드 생성
        initGrid() {
            const $this = this;
            // 1. 업무목록 그리드 선언
                // 1) 그리드 url 지정
                // 2) 그리드 colModel 지정
                // 업무명 / 업무유형 / 선행업무 / 예상소요일수 / 담당자 / 업무상태 / 예정시작일 / 예정종료일 / 실제시작일 / 실제종료일
                // 예정시작일 / 예정종료일 / 실제시작일 / 실제종료일은 날짜 포맷팅 사용
                // baseMixins에 있는 formatDate 혹은 하단에 선언한 formatDt 사용
                // 2. options 설정
                // 1) 높이 지정 (스크롤바 생길경우)
                // 2) 멀티셀렉트 활성화 (다건 이동 시 필요)
                // 3) onSelectRow()함수
                // 셀 선택할 때 마다 선택된 행의 정보를 가지고 있는 busiMngList 배열에 저장
                // 셀 선택 후 화면 중간의 ">" 버튼 클릭시 업무목록(좌측)의 값을 담당자목록(우측)에 전달하기 위함 
                // >> onSelectRow() 사용 안함
            let BusiGridObj = {
                url:'/prct/mng/busiChrgMng/selectListBusiMng.hb',
                colModels: [
                    {name:'prctNo'          ,label: '프로젝트번호'     , width: 20     , align:'left'        , hidden: true},
                    {name:'prctNm'          ,label: '프로젝트명'       , width: 80     , align:'left'        },  
                    {name:'busiNo'          ,label: '업무번호'         , width: 20     , align:'left'        , hidden: true},
                    {name:'busiNm'          ,label: '업무명'           , width: 80     , align:'left'        },
                    {name:'busiTypeCd'      ,label: '업무유형'         , width: 20     , align:'center'      , hidden: true},
                    {name:'busiTypeNm'      ,label: '업무유형'         , width: 25     , align:'center'      },
                    {name:'prevBusiNo'      ,label: '선행업무'         , width: 30     , align:'left'        , hidden: true},
                    {name:'prevBusiNm'      ,label: '선행업무'         , width: 50     , align:'left'        },
                    {name:'fcstNeedDcnt'    ,label: '예상소요일수'     , width: 30     , align:'center'      },
                    {name:'chrgUserNm'      ,label: '담당자'           , width: 30     , align:'center'      },
                    {name:'busiStatCd'      ,label: '업무상태'         , width: 20     , align:'left'        , hidden: true},
                    {name:'busiStatNm'      ,label: '업무상태'         , width: 25     , align:'center'      },
                    {name:'schdStrtDt'      ,label: '예정시작일자'     , width: 35     , align:'center'      , formatter: $this.formatDate},
                    {name:'schdEndDt'       ,label: '예정종료일자'     , width: 35     , align:'center'      , formatter: $this.formatDate},
                    {name:'realStrtDt'      ,label: '실제시작일자'     , width: 35     , align:'center'      , formatter: $this.formatDate},
                    {name:'realEndDt'       ,label: '실제종료일자'     , width: 35     , align:'center'      , formatter: $this.formatDate},
                    {name:'histBtn'         ,label: '이력'            , width: 30      , align:'center'  
                        , formatter(){
                            return '<button>이력조회</button>';
                        }
                    },
                    //그리드 안에 이력조회 추가
                ],
                options:{
                    multiselect : true,
                    beforeSelectRow(rowid, e) {
                        let  i = $.jgrid.getCellIndex($(e.target).closest('td')[0]);
                        let cm = $(this).jqGrid('getGridParam', 'colModel');
                        return (cm[i].name == 'cb');
                    },   
                    onCellSelect:function(rowId, iCol, val, e){
                        let colNm = $(this).jqGrid('getGridParam','colModel')[iCol].name;
                        let data = $(this).jqGrid('getRowData',rowId);
                        if (e && e.target.tagName == 'BUTTON') {
                            if (colNm == 'histBtn' ) {
                                $this.openBusiChrgChngHistPopup(data);
                            }
                        }
                    },

                    onSelectRow: function(rowId, is, event){
                        // if(event.target.id === 'histBtn'){
                        //     $this.params.busiNo = $(this).jqGrid('getRowData',rowId).busiNo;
                        //     $this.openBusiChrgChngHistPopup($(this).jqGrid('getRowData',rowId).busiNo);
                        // }
                    }
                }
            }  
            $this.$refs.busiList.init(BusiGridObj);
            // 3. 담당자목록 그리드 선언 
                // 1) 그리드 url 지정
                // 2) 그리드 colModel 지정
                // 업무명 / 업무유형 / 담당자 / 이력
                // 4. options 설정
                // 1) 높이 지정 (스크롤바 생길경우)
                // 2) 멀티셀렉트 활성화 (다건 이동 시 필요)
                // 3) onSelectRow()함수
                // 셀 선택할 때 마다 선택된 행의 정보를 가지고 있는 chrgMngList 배열에 저장
                // 셀 선택 후 화면 중간의 "<" 버튼 클릭 시 담당자목록에서 선택된 값을 제거하기 위함
                // 이력 버튼 클릭 시 담당자 목록 이력 팝업 호출
                // >> onSelectRow() 사용 안함
            let ChrgGridObj = {
                url:'',
                colModels: [
                    {name:'prctNo'          ,label: '프로젝트번호' , width: 40      , align:'left'    , hidden: true},                 
                    {name:'busiNo'          ,label: '업무번호'     , width: 40      , align:'left'    , hidden: true},
                    {name:'busiNm'          ,label: '업무명'       , width: 80      , align:'left'    },
                    {name:'busiTypeCd'      ,label: '업무유형'     , width: 50      , align:'center'  , hidden: true},
                    {name:'busiTypeNm'      ,label: '업무유형'     , width: 50      , align:'center'  },
                    {name:'chrgUserNm'      ,label: '담당자'       , width: 50      , align:'center'  },
                    {name:'histBtn'         ,label: '이력'         , width: 50      , align:'center'  
                        , formatter(){
                            return '<button id="histBtn">이력조회</button>';
                        }
                    },
                    {name:'deltBtn'         ,label: '삭제'         , width: 50      , align:'center'
                        , formatter(){
                            return '<button id="deltBtn">삭제</button>';
                        }
                    },
                ],
                options:{
                    height: 500,
                    // multiselect : true,
                    //onCellSelect로 되는지 확인
                    onSelectRow: function(rowId, is, event){
                        if(event.target.id === 'histBtn'){
                            // $this.params.busiNo = $(this).jqGrid('getRowData',rowId).busiNo;
                            $this.openBusiChrgChngHistPopup();
                        }
                        if(event.target.id === 'deltBtn'){
                            $this.deltRows(rowId);
                        }
                    }
                }
            } 
            $this.$refs.chrgList.init(ChrgGridObj); 
        },
        // 업무목록 그리드 조회 함수
        selectBusiList() {
            const $this = this;
            //업무목록 그리드 조회
            $this.$refs.busiList.selectList(true);
        },

        // 담당자 목록 저장 함수
        saveChrgMng() {
            // 1.전달 파라미터 선언 
            //    - 담당자목록에서 현재 그리드의 rowData를 가져옴
            // 2.전달 파라미터 Null 체크 
            // 1) Null 일시 값이 없습니다 알림창
            // 3.doPost 함수로 저장 > 서버
            // 1) 성공 시 저장 되었습니다. 알림창
            // 2) 실패시 rtnMsg 알림창
            const $this = this;
            const chrgGrid      = $this.$refs.chrgList.getGridObj();
            let chrgGridValList = chrgGrid.jqGrid("getRowData");
            let currDt          = DateUtil.getCurrDate();
            currDt              = DateUtil.dateToYYYYMMDD(currDt);
            let userId          = SessionUtil.getUserId();

            if(chrgGridValList.length == 0){
                $this.alert("저장할 값이 없습니다.");
                return false;
            }
            if(ValdUtil.isNull($this.params.chrgUserId)){
                $this.alert("업무를 추가할 담당자를 선택해주세요.");
                return false;
            }


            let params = {
                chrgUserId   : $this.params.chrgUserId,
                chngChrgList : chrgGridValList,
                alocDt       : currDt,
                alocUserId   : userId
            }
            $this.doPost('/prct/mng/busiChrgMng/saveChrgMng.hb', params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    $this.alert("저장되었습니다.").then((result) =>{
                        if(result.isConfirmed){
                            $this.reset();
                        }
                    })
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },
        // 담당자 조회 팝업 호출
        openBusiChrgSrchPopup() {
            // 팝업 호출
            this.$refs.BusiChrgSrchPopup.show();
            this.$refs.BusiChrgSrchPopup.init();
        },
        //담당자 조회 팝업에서 파라미터 전달받음
        getChrgInfo(selectedData){
            const $this = this;
            $this.params.chrgUserId = selectedData.userId;
            $this.params.chrgUserNm = selectedData.userNm;
        },
        // 담당자목록 이력 팝업 호출
        openBusiChrgChngHistPopup(data) {
            const $this = this;
            // 팝업 호출
            $this.$refs.BusiChrgChngHistPopup.show();
            $this.$refs.BusiChrgChngHistPopup.initData(data);
            $this.$refs.BusiChrgChngHistPopup.init();
        },

         //업무관리 이동
        busiMngLink(){
            const $this = this;
            
            let params = {
                prctNo : $this.params.srchPrctNo,
                busiNm : $this.params.srchBusiNm
            }
            CmonUtil.setPageLink('U1030',params);
            
        },
        //업무일정관리 이동
        busiSchdMngLink(){
            const $this = this;
            
            let params = {
                prctNo : $this.params.srchPrctNo,
                busiNm : $this.params.srchBusiNm
            };
            CmonUtil.setPageLink('U1040',params);
        },

        // 업무 목록에서 담당자 목록으로 이동 버튼
        movBusiToChrgBtn() {
            // 1. 업무목록 그리드에서 체크박스 선택된 값을 가져오는 변수 선언 / 값 가져오기
            // 2. busiMngList 배열에 값이 있는지 확인 (ValdUtil 사용) 
            // >> GridUtil.getCheckedList 사용 시 체크박스가 빈값인 경우가 존재
            //    busiMngList이 빈값이고 ValdUtil.isNotNull 조건 일때 ">" 클릭 시 빈값들어감
            //    busiMngList의 length 길이 체크로 변경  
            // 2-1. busiMngList 배열에 값이 있는경우 
            // 1) 담당자목록 그리드 초기화
            // 2) busiMngList의 배열을 담당자 목록에 setGridData
            // 2-2. busiMngList 배열에 값이 없는경우
            // "선택된 값이 없습니다" 알림창 호출
            const $this = this;
            //굳이 여기서 체크 안하고 저장 하기 전에 
            

            const busiGrid    = $this.$refs.busiList.getGridObj();
            const chrgGrid    = $this.$refs.chrgList.getGridObj();
            let busiMngList   = GridUtil.getCheckedList(busiGrid);
            let chrgMngList   = chrgGrid.jqGrid("getRowData");
            let insrtList     = [];
            // 굳이 intrVal / extVal 나눌이유없이 extVal만 가지고 있어도 되는지 확인
            let intrValList   = busiMngList.filter(busiVal => chrgMngList
                                .some(chrgVal => busiVal.busiNo === chrgVal.busiNo)); 
            let extValList    = busiMngList.filter(busiVal => !chrgMngList
                                .some(chrgVal => busiVal.busiNo === chrgVal.busiNo));
            if(chrgMngList.length === 0){
                insrtList.push(busiMngList);
            } else if(intrValList.length > 0){
                insrtList.push(extValList);
            } else if(intrValList.length <= 0){
                insrtList.push(busiMngList);
            }
            if(busiMngList.length > 0){
                $this.$nextTick(() =>{
                    $this.$refs.chrgList.setGridData(insrtList ,true);
                })
            } else {
                $this.alert("추가할 업무 목록을 선택해주세요.");
            }
            
        },
        // 담당자 목록에서 업무 목록으로 이동 버튼
        movChrgToBusiBtn() {
            // 1. 담당자목록 그리드에서 체크박스 선택된 값을 가져오는 변수 선언 / 값 가져오기  
            // 2. chrgMngList 배열에 값이 있는지 확인 (ValdUtil 사용)
            // 2-1. chrgMngList 배열에 값이 있는경우
            // chrgMngList 배열에 있는 (체크박스 선택된) 값을 담당자목록 그리드에서 삭제
            // 2-2. chrgMngList 배열에 값이 없는경우
            // "선택된 값이 없습니다" 알림창 호출

            // const $this = this;
            // const chrgGrid = $this.$refs.chrgList.getGridObj();
            // const gridId   = $this.$refs.chrgList.getGridId();
            // let  checkIds =  chrgGrid.jqGrid("getGridParam","selarrrow") + ""; 

            // if ( checkIds == "" || checkIds == "null" )
            // {
            //     $this.alert("삭제할 값을 선택해주세요.");
            //     return false;
            // }
            // let checkId = checkIds.split(",");

            // for ( var i in checkId )
            // {
            //     if ( chrgGrid.getRowData(checkId[i]).crud == "C" )
            //     {
            //         chrgGrid.jqGrid('delRowData', checkId[i]);
            //     }
            //     else
            //     {
            //         chrgGrid.setRowData(checkId[i], {crud: "D"});
            //         $("#"+checkId[i],"#"+gridId).css({display: "none"});
            //     }
                
            // }
            // >> 그리드에 삭제버튼으로 변경됨
        },
        //담당자목록 삭제버튼
        deltRows(rowId){
            const $this = this;
            const chrgGrid = $this.$refs.chrgList.getGridObj();
            chrgGrid.jqGrid('delRowData',rowId);
        },
        //엑셀 다운로드
        downloadExcel() {
            // 1.엑셀명(업무목록_현재일자.xlsx) 선언
            // 2.다운로드 (doDownExcel 사용)
            const $this = this;
            let params = $this.params;
            let currDt = DateUtil.getCurrDate();
            $this.doDownExcel('/prct/mng/busiChrgMng/selectChrgMngExcelDownload.hb',params,'업무담당자관리_업무목록_'+currDt+'.xlsx');
        },

        // 파라미터 초기화 
        reset() {
            const $this = this;
            //params
            $this.params.srchBusiNm = '';    // 검색조건 업무명
            $this.params.busiTypeCd = '';    // 검색조건 업무유형
            $this.params.srchChrgNm = '';    // 검색조건 담당자명
            $this.params.chrgUserId = '';    // 담당자 ID
            $this.params.chrgUserNm = '';    // 담당자명

            //reset에서는 reset만 하고 그리드 초기화는 따로 함수를 만들어서 하기

            $this.CmonUtil.setFocus(this.$refs.srchBusiNm);
            // 파라미터 초기화
            // 배열 초기화
            // 그리드 초기화 
        },
        resetGrid(){
            const $this = this;
            $this.$refs.busiList.clearGridData();
            $this.$refs.chrgList.clearGridData();
        },
        // 날짜 포매팅 
        // > baseMixins 에 있는 formatDate 사용
        // formatDt() {
        //     //예정시작일, 예정종료일, 실제시작일, 실제종료일 날짜 포맷팅
        //     //혹은 baseMixins 에 있는 formatDate 사용
        // },

        // 공통버튼(초기화, 조회, 저장, 삭제) 컴포넌트 핸들러
        onSetButtonClick(div) {
            const $this = this;
            switch (div) {
                case 'init':
                    $this.reset();
                    break;
                case 'select':
                    $this.selectBusiList();
                    break;
                case 'save':
                    $this.saveChrgMng();
                default:
                    break;
            }
        }
    },
    mounted: function () {
        let $this = this;
        $this.init();
    }
}
</script>
<style>
.mv-btn {
    cursor: pointer;
    height: 50px;
}

.mv-btn:hover {
    color: #a5abae;
}

.mv-btn:active {
    color: #767b7e;
}
</style>