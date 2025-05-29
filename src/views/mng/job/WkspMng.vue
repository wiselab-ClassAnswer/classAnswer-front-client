<template>
    <div>
         <!-- 검색조건 -->
        <div class="section section1">    
            <div class="search-box">
                <div class="input-box">
                    <div class="w-5 ib">
                        <h1>검색조건</h1>
                    </div>
                    <div class="w-20 ib">
                        <h2 class="wd-50 essn ib">이행셋</h2>
                        <select ref="srchWord" class="c-wd-50 ib" v-model="srchParams.csetNo" @change="selectWkSpMngList()">
                            <option value = ''></option>
                            <option v-for="el in csetList" :key="el.colId" :value="el.colId" >{{el.colId + ' | ' +el.colNm}}</option>
                        </select>                    
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-40 ib">검색어</h2>
                        <input class="c-wd-40 ib" type="text" v-model="srchParams.srchWord">
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="true" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>
        <!-- 워크스페이스 목록 -->
        <div class="section sectionL">
            <div class="section-wrap">
                <h2 class="ib">워크스페이스 목록</h2>
                <div class="btn-group-box">                
                    <button class="btn-exel-download" @click="downloadExcel()">
                        <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                        <p>다운로드</p>
                    </button>    
                </div>
                <div class="wrapper-content">
                    <Grid ref="wkspList" :dataParams="srchParams" :paging=false></Grid>
                </div>
            </div>
        </div>
        <!-- 상세정보 -->
        <div class="section sectionR">
            <div class="section-wrap" style="height:720px !important;">
                <h2 class="w-35 ib">상세정보</h2>
                <div class="btn-group-box">         
                    <button class="btn-normal" @click="setPgLink('O2040')">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'up-right-from-square']" />
                        <p class="ib">워크플로우</p>
                    </button>  
                </div>
                <div class="section-part part1">
                    <div class="w-100">
                        <div class="w-45 p-r-10 ib">
                            <span class="wd-100 essn">워크스페이스ID</span>
                            <input class="c-wd-100" style="background-color: #EFEFEF4D;" type="text" v-model="detlInfo.wkspId" :disabled="detlInfo.crud==='U'">
                        </div>
                        <div class="w-45 p-r-10 ib">
                            <span class="wd-100 essn">워크스페이스명</span>
                            <input class="c-wd-100" type="text" v-model="detlInfo.wkspNm">
                        </div>
                        <div class="w-10 ib">
                           <button class="w-100 btn-normal" @click="wkspReset()" :disabled="isDisabledResetBtn">
                                <p class="ib">초기화</p>
                            </button>  
                        </div>
                    </div>
                    <div class="text-box">
                        <span class="wd-100">설명</span>
                        <textarea class="c-wd-100 ta-r-n" style="height:100px;" cols="30" rows="10" v-model="detlInfo.rmrk"></textarea>
                    </div>
                </div>
                <div>
                    <div class="ta-span text-box" style="position: relative;">
                        <span class="ta-label wd-100">컨텐츠</span>
                        <button class="btn" @click="clickShowTreeBtn" style="position: absolute; top: 5px; right: 17px; z-index: 10; background-color: rgb(207 225 233);">{{ showTreeBtnNm }}</button>
                        <textarea v-show="!isShowTreeView" class="ta-textarea c-wd-100 ta-r-n" style="height:520px;" cols="30" rows="20" v-model="detlInfo.wkspCnts" disabled="disabled"></textarea>
                        <div v-show="isShowTreeView" class="c-wd-100 h-520 line">
                            <vue-json-pretty :data=detlInfo.wkspCntsJson :height="518" :showIcon="true" :virtual="true" :showLength="true" :deep="2" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, inject,reactive  }  from 'vue'
import { ValdUtil }         from '@/utils/ValdUtil.js'
import { DateUtil }         from '@/utils/DateUtil.js'
import { CmonUtil }         from '@/utils/CmonUtil'
import Grid                 from '@/components/grid/Grid.vue'
import BodySlot             from '@/slot/bodySlot.vue'
import SetButton            from '@/components/SetButton.vue'
import VueJsonPretty        from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

export default {
    components: {
        Grid
       ,BodySlot
       ,SetButton
       ,VueJsonPretty
    },
    data: function() {
		return {
            srchParams:{
                 csetNo   : ''       // 검색조건 #이행셋
               , srchWord : ''       // 검색조건 #검색어
            }
           ,detlInfo:{
                 csetNo   : ''       // 상세정보 #이행셋번호
               , wkspId   : ''       // 상세정보 #워크스페이스ID
               , wkspNm   : ''       // 상세정보 #워크스페이스명
               , wkspCnts : ''       // 상세정보 #내용
               , rmrk     : ''       // 상세정보 #비고
               , crud     : "C"      // 구분값
               , wkspCntsJson : ''   // 상세정보 #내용 JSON 객체
           }
           ,wkspList: [{}]           // 워크스페이스목록
           ,csetList: [],
           isShowTreeView: false,
           showTreeBtnNm: 'TREE 보기',

        }
    }
   ,methods: {
        init() {
            const $this = this;
            $this.initCsetData();
            $this.initGrid();
            $this.CmonUtil.setFocus(this.$refs.srchWord);
        
        },
        //기본 이행셋 조회
        initCsetData(){
            const $this = this;
            const colIdNmListData = {
                'tblId'      :'tm_cset_base',
                'colId'      :'cset_no,dflt_yn,conv_ver',
                'colNm'      :'cset_nm',
                'where'      : [{
                    'andCol' : '1',
                    'andCalc': '=',
                    'andVal' : '1'
                }],
                'orderby': [
                    {'orderCol' : 'cset_no'}
                ]
            };
            // 조회 후 콜백
            $this.getColIdNmList(colIdNmListData, $this.csetList, 'N', $this.setCsetData);

        },
        // 이행셋 조회 후 콜백
        setCsetData(){
            const $this = this;
            let data = CmonUtil.getPageLink('O2030');
            if(!ValdUtil.isEmptyJson(data)){
                $this.srchParams.csetNo = data['csetNo'];
            } else {
                $this.setDfltCset();
            }  
            $this.$nextTick(()=>{
                if(ValdUtil.isNotNull($this.srchParams.csetNo)){
                    $this.selectWkSpMngList();
                }
            })    
        },
        // 디폴트 이행셋 설정
        setDfltCset(){            
            const $this = this;
            let dfltCsetList = $this.csetList.find(el => el.dfltYn == 'Y');
            if(ValdUtil.isNotNull(dfltCsetList)){
                $this.srchParams.csetNo = dfltCsetList.colId;
            }
        },

        //그리드 생성
        initGrid(){
            const $this = this;
            let wkspListData = {
                url : '/mng/job/wkspMng/selectWkspMngList.hb',
                colModels : [
                     {name:'csetNo'         , label:'이행셋'            , width:20      , align:'center'    , sortable:true    }
                   , {name:'csetNm'         , label:'이행셋명'          , width:20      , align:'center'    , sortable:true  , hidden:true }
                   , {name:'wkspId'         , label:'워크스페이스ID'    , width:20      , align:'center'    , sortable:true }
                   , {name:'wkspNm'         , label:'워크스페이스명'    , width:50      , align:'left'      , sortable:true } 
                    ]
               ,options: {
                    height:620,
                    gridComplete(){
                        $this.wkspList = $(this).jqGrid('getRowData');
                    }
                    ,onSelectRow(rowid, val, e){
                        $this.resetDetlInfo();
                        $this.detlInfo.csetNo = $(this).jqGrid('getRowData', rowid).csetNo;
                        $this.detlInfo.wkspId = $(this).jqGrid('getRowData', rowid).wkspId;
                        $this.selectWkspDetlInfo();
                        $this.detlInfo.crud = 'U';
                    }
                    ,loadonce:true
                }                
            }
            $this.$refs.wkspList.init(wkspListData);
        },
        
        //조회 워크스페이스목록 
        selectWkSpMngList() {
            const $this = this;
            $this.resetDetlInfo();
            $this.$refs.wkspList.clearGridData();
            if(this.ValdUtil.isNotNull($this.srchParams.csetNo)){
                $this.$refs.wkspList.selectList(true);
            }
        },

        //조회 상세 정보 
        selectWkspDetlInfo(){
            const $this = this;
            let params = {
                wkspId : $this.detlInfo.wkspId,
                csetNo : $this.detlInfo.csetNo
            }
            $this.doPost('/mng/job/wkspMng/selectWkspDetlInfo.hb', params).then ((res) => {
                    if(res.data.rtnCd == '0000'){
                        $this.detlInfo.csetNo   = res.data.rtnData.result.csetNo;
                        $this.detlInfo.wkspId   = res.data.rtnData.result.wkspId;
                        $this.detlInfo.wkspNm   = res.data.rtnData.result.wkspNm;
                        $this.detlInfo.wkspCnts = res.data.rtnData.result.wkspCnts;
                        $this.detlInfo.rmrk     = res.data.rtnData.result.rmrk;
                        if (ValdUtil.isNotNull(res.data.rtnData.result.wkspCnts)) {
                            $this.detlInfo.wkspCntsJson = JSON.parse(res.data.rtnData.result.wkspCnts);
                        } else {
                            $this.detlInfo.wkspCntsJson = '';
                        }

                    }else{
                        $this.alert(res.data.rtnMsg);
                    }
            });
        },

        //저장 전 선행작업셋명세 조회
        searchPrevJsetSpec(){
            const $this = this;
            if ($this.detlInfo.wkspId ==="WKSP-000"){
                $this.alert("이행 전처리작업은 삭제할 수 없습니다.");
                return false;
            }
            if ($this.detlInfo.wkspId ==="WKSP-999"){
                $this.alert("이행 후처리작업은 삭제할 수 없습니다.");
                return false;
            }
            if($this.isVald($this.detlInfo.wkspId, '워크스페이스를 ') && $this.isVald($this.detlInfo.wkspId, '삭제')){
                let params = { 'csetNo'    : $this.detlInfo.csetNo,
                               'wkspId'    : $this.detlInfo.wkspId,
                               'wkspNm'    : $this.detlInfo.wkspNm}
                $this.doPost('/mng/job/wkspMng/searchPrevJsetSpec.hb',params).then(function(res){
                    // CmonUtil.processLoading(false);
                    if(res.data.rtnCd == '0000' && res.data.rtnData.result.length == 0){
                        $this.delWkspData(params);
                    }else if(res.data.rtnCd == '0000' && res.data.rtnData.result.length > 0){
                        $this.confirm({
                            content: '워크플로우 화면에서</br>'
                                    +'워크스페이스 삭제 후 삭제가능합니다</br>'
                                    +'해당 화면으로 이동하시겠습니까?' 
                        ,callback: {
                                yes() {
                                    //워크플로우 관리 이동
                                    $this.setPgLink('O2040');
                                }
                            }
                        });
                    }else{
                        $this.alert(res.data.rtnMsg);
                    }
                });
            }
        },
        //저장
        saveWkspData(){
            const $this = this;

            if ( ValdUtil.isNull(this.srchParams.csetNo) ) {
			 	this.alert("이행셋을 선택하시기 바랍니다.");
			 	return false;
            }

            if ($this.detlInfo.wkspId ==="WKSP-000" && !ValdUtil.isNull($this.detlInfo.wkspCnts)){
                $this.alert("이행 전처리작업은 수정할 수 없습니다.");
                return false;
            }
            if ($this.detlInfo.wkspId ==="WKSP-999" && !ValdUtil.isNull($this.detlInfo.wkspCnts)){
                $this.alert("이행 후처리작업은 수정할 수 없습니다.");
                return false;
            }

            if(ValdUtil.isNull($this.detlInfo.wkspNm)){
                $this.alert("워크스페이스명은 필수입력입니다.");
                return false;
            }
            if(this.ValdUtil.valdLenNull($this.detlInfo.wkspNm ,100 ,'워크스페이스명은')){
                $this.confirm({
                    content: '저장하시겠습니까?' ,
                    callback: {
                        yes: function () {                
                            let params = {
                                csetNo   : $this.srchParams.csetNo,
                                wkspId   : $this.detlInfo.wkspId,
                                wkspNm   : $this.detlInfo.wkspNm,
                                wkspCnts : $this.detlInfo.wkspCnts,
                                rmrk     : $this.detlInfo.rmrk,
                                crud     : $this.detlInfo.crud
                            }
                            $this.doPost('/mng/job/wkspMng/saveWkspData.hb', params).then(function(res){
                                if (res.data.rtnCd == '0000') {
                                    $this.alert('저장되었습니다').then((result) => {
                                        if(result.isConfirmed){
                                            $this.resetDetlInfo();
                                            $this.selectWkSpMngList();
                                        }
                                        
                                    });            
                                } else {
                                    $this.alert(res.data.rtnMsg).then((result) =>{
                                        if( result.isConfirmed){
                                            $this.resetDetlInfo();
                                            $this.selectWkSpMngList($this.detlInfo.wkspId);
                                        }
                                    })
                                    
                                };
                            });
                        }
                    }
                });
            }
        },
        //삭제
        delWkspData(params){
            const $this = this;
            $this.confirm({
                content: '현재 조회된 상세정보를 삭제처리합니까?' ,
                callback: {
                    yes: function () {
                        $this.doPost('/mng/job/wkspMng/detlInfo.hb', params).then(function(res){
                            if (res.data.rtnCd == '0000') {
                                $this.alert('삭제되었습니다.').then((result)=>{
                                    if(result.isConfirmed){
                                        $this.resetDetlInfo();
                                        $this.selectWkSpMngList();
                                    }
                                });
                            }else{
                                $this.alert(res.data.rtnMsg).then((result) =>{
                                    if( result.isConfirmed ){
                                        $this.resetDetlInfo();
                                        $this.selectWkSpMngList();
                                    }
                                })
                            }
                        });
                    }
                }
            });
        }
        //워크스페이스 초기화
       ,wkspReset(){ 
            const $this = this; 
             $this.confirm({
                content: '워크스페이스 ('+$this.detlInfo.wkspNm +')을(를) <br/>초기화 하시겠습니까?' ,
                callback: {
                    yes: function () {
                        $this.doPost('/mng/job/wkspMng/saveWkspReset.hb', $this.detlInfo).then(function(res){
                            if (res.data.rtnCd == '0000') {
                                $this.alert('초기화되었습니다.').then((result)=>{
                                    if(result.isConfirmed){
                                        $this.resetDetlInfo();
                                        $this.selectWkSpMngList();
                                    }
                                });
                            }else{
                                $this.alert(res.data.rtnMsg).then((result) =>{
                                        if(result.isConfirmed){
                                            $this.resetDetlInfo();
                                            $this.selectWkSpMngList();
                                        }
                                });
                            }
                        });
                    }
                }
            });
       },

       //초기화
       reset() {
            this.resetSrchParams();
            this.resetDetlInfo();
            this.wkspList = [{}];                   // 워크스페이스목록
            this.$refs.wkspList.clearGridData();    // 워크스페이스그리드 초기화            
            this.isShowTreeView = false;
            this.showTreeBtnNm = 'TREE 보기';
            this.CmonUtil.setFocus(this.$refs.srchWord);
        }
        // 검색조건 초기화
        ,resetSrchParams(){
            this.srchParams.csetNo   = '';      // 검색조건 #이행셋
            this.srchParams.srchWord = '';      // 검색조건 #검색어
        }
        // 상세정보 초기화
        ,resetDetlInfo(){
            this.detlInfo.csetNo   = '';       // 상세정보 #이행셋번호
            this.detlInfo.wkspId   = '';       // 상세정보 #워크스페이스ID
            this.detlInfo.wkspNm   = '';       // 상세정보 #워크스페이스명
            this.detlInfo.wkspCnts = '';       // 상세정보 #내용
            this.detlInfo.rmrk     = '';       // 상세정보 #비고
            this.detlInfo.crud     = "C";
            this.detlInfo.wkspCntsJson = '';
        }
        
        //페이지 이동
        ,setPgLink(pageNo){
            const $this = this;
            if($this.detlInfo.crud === 'U' && ValdUtil.isNotNull($this.detlInfo.csetNo) && ValdUtil.isNotNull($this.detlInfo.wkspId)){
                let params = {
                    csetNo : $this.detlInfo.csetNo,
                    wkspId : $this.detlInfo.wkspId,
                    wkspNm : $this.detlInfo.wkspNm,
                }
                CmonUtil.setPageLink(pageNo, params);
            } else {
                $this.alert("워크스페이스를 선택해주세요.");
            }
        }

        //엑셀다운로드        
        ,downloadExcel(){
            let $this = this;
            let fileNm = '워크스페이스목록_' + DateUtil.getCurrDate('YYYYMMDD') + '.xlsx';
            let url    = '/mng/job/wkspMng/selectWkspMngDownloadExcel.hb';
            let trgt   = $this.wkspList;

            if($this.isVald(trgt,'엑셀다운로드 ')){
                $this.doDownExcel(url, $this.srchParams, fileNm);
            }
        }

        //유효성검사
        ,isVald ( chkVal, stmt ) {
            let $this = this;
            let returnSmtm = '';
            let stmt1 = '선택하세요';
            let stmt2 = '대상이 없습니다';

            if(typeof chkVal == 'string'){
                returnSmtm = stmt + stmt1;
            }else {
                returnSmtm = stmt + stmt2; 
            }
        
            if(ValdUtil.isNull(chkVal) || chkVal.length == 0){
                $this.alert(returnSmtm);
                return false;
            }

            return true;
        },

        clickShowTreeBtn() {
            this.isShowTreeView = this.isShowTreeView ? false : true;
            this.showTreeBtnNm = this.isShowTreeView ? 'TREE 닫기' : 'TREE 보기';
        },

        //공통버튼(초기화,조회,저장)
        onSetButtonClick(div){
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.reset();
                    break;
                case 'select':
                    $this.selectWkSpMngList();
                    break;
                case 'save':
                    $this.saveWkspData();
                    break;
                case 'delete':
                    $this.searchPrevJsetSpec();
                    break;
                default:
                    break;
            }
        } 
    },
    computed:{
        //초기화 버튼 활성화 여부
        isDisabledResetBtn(){
            const $this = this;
            if(ValdUtil.isNotNull($this.detlInfo.wkspId)){
                if($this.detlInfo.wkspId === 'WKSP-000' || $this.detlInfo.wkspId === 'WKSP-999'){
                    return true;
                } else {
                    return false;
                }
            } else if (ValdUtil.isNull($this.detlInfo.wkspId)){
                return true;
            }
        },
    },
    mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>
<style scoped>
.ta-span {
    display: flex;
    align-items: center
}
.ta-label {
    display: inline-block;
    color: #666666;
    font-size: 12px;
    /* margin-bottom: 5px; */
    margin-right: 10px;
}
.ta-textarea {
    display: inline-block;
    width: calc(100% - 80px);
    height: 100px;
    border: 1px solid #d1d1dd;
    border-radius: 3px;
    padding: 5px;
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
}
.line {
    border-color: #d1d1dd;
    border-style: solid;
    border-width: 1px;
}
</style>