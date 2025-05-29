<template>
    <div>
        <!-- 검색조건 -->
        <div class="section section1">    
            <div class="search-box">
                <div class="input-box">
                    <div class="w-5 ib">
                        <h1>검색조건</h1>
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-40 ib">검색어</h2>
                        <input class="c-wd-40 ib" type="text" ref="srchWord" v-model="srchParams.srchWord" v-on:keyup.enter="searchListCitmBase()">
                    </div>
                    <div class="input-check ib">
                        <label>
                            <input type="checkbox" v-model="srchParams.fltrVal" true-value="REPR" false-value="" @change="searchListCitmBase()">
                            <p>대표항목만 조회</p>
                        </label>
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="true" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>
        <!-- 전환항목 목록 -->
        <div class="section sectionL">
            <div class="section-wrap">
                <h2 class="ib wd-100">전환항목 목록</h2>
                <div class="t-a-r btn-group-box">
                    <button class="btn-normal ib" @click="uuidRfrsh('all')" :disabled=" !params.isSysAdmin">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                        <p class="ib">UUID일괄갱신</p>
                    </button>  
                    <button class="btn-exel-download" @click="downloadExcel()">
                        <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                        <p>다운로드</p>
                    </button>    
                </div>
                <div class="wrapper-content">
                    <Grid ref="CitmBase" :dataParams="srchParams" :paging='false'></Grid>
                </div>
            </div>
        </div>
        
        <!-- 상세정보 -->
        <div class="section sectionR">
            <div class="section-wrap">
                <h2 class="wd-100 ib p-rl" style="top:-2px">전환항목 정보</h2>
                <div class="wd-250 ib">
                    <span v-if="detlParams.fixItemYn =='Y'"      class="guidTextBlue" style="float:none !important;">※ 솔루션 고정항목으로 수정할 수 없습니다</span>
                    <span v-else-if="detlParams.fixItemYn =='N'" class="guidTextGray" style="float:none !important;">※ 사용자 정의항목입니다</span>
                    <span v-else></span>
                </div>
                <div class="ib t-a-r btn-group-box">
                    <button class="btn-normal wd-80 ib p-rl p-l-10 p-r-10" @click="btnReset()">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                        <p class="ib">초기화</p>
                    </button>  
                    <button class="btn-normal ib" @click="setPageLink('O1060')" >
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'up-right-from-square']" />
                        <p class="ib">전환대상관리</p>
                    </button>
                    <button class="btn-normal ib" @click="setPageLink('O1065')" >
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'up-right-from-square']" />
                        <p class="ib">전환대상추적현황</p>
                    </button>  
                </div>
                <div class="section-part part1 p-rl" style="top:-2px">
                    <div v-if="params.isSysAdmin" class="w-100 m-t-5 m-b-7">
                        <span class="wd-80">고정항목 여부</span>
                        <div class="c-wd-80 ib">
                            <input style="position:relative; right:3px; top:3px; width:20px; height:auto;" type="checkbox" true-value="Y" false-value="N" v-model="detlParams.fixItemYn" />
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-50 ib">
                            <span class="wd-80 essn">전환항목코드</span>
                            <input class="c-wd-80" type="text" v-model="detlParams.citmCd" :disabled="params.saveDiv =='update'">
                        </div>
                        <div class="w-50 ib">
                            <span class="wd-80 p-l-10 essn">전환항목명</span>
                            <input class="c-wd-80" type="text" v-model="detlParams.citmNm" :disabled="params.isDisabledInfo">
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-50 ib">
                            <span class="wd-80">최종UUID</span>
                            <div class="c-wd-80 ib">
                                <input class="w-65 ib" type="text" v-model="detlParams.lastUuid" disabled>
                                <div class="w-35 ib p-l-5">
                                    <button class="btn-normal ib w-100 p-rl" style="top:-1px"  @click="uuidRfrsh('one')" :disabled="!params.isSysAdmin">
                                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                                        <p class="ib">UUID갱신</p>
                                    </button>  
                                </div>
                            </div>
                        </div>
                        <div class="w-50 ib">
                            <span class="wd-80 p-l-10 essn">정렬순서</span>
                            <input class="c-wd-80" type="text" v-model="detlParams.sortOrd" @blur="detlParams.sortOrd = ValdUtil.onlyStayNum(detlParams.sortOrd,0)" :disabled="params.isDisabledInfo">
                        </div>
                    </div>
                    <div class="w-100 text-box">
                        <span class="essn wd-80">참고사항</span>
                        <textarea class="c-wd-80 ta-r-n" spellcheck="false" style="max-height:230px; height:230px" name="" id="" cols="30" rows="10" v-model="detlParams.rmrk" :disabled="params.isDisabledInfo"></textarea>
                    </div>
                </div>
                <div class="m-t-15">
                    <div class="w-50 ib">
                        <h2 class="wd-100 ib m-b-10 ib">포함어</h2>
                        <div class="ib t-a-r btn-group-box">
                            <button class="btn-normal ib" @click="rowAdd('GridAdd')">추가</button>
                            <button class="btn-normal ib" @click="rowDel('GridAdd')">제거</button>
                        </div>
                        <div class="wrapper-content">
                            <Grid ref="GridAdd" :dataParams="detlParams" :paging='false'></Grid>
                        </div>
                    </div>
                    <div class="w-49 f-r ib">
                        <h2 class="wd-100 ib m-b-10 ib">제외어</h2>
                        <div class="ib t-a-r btn-group-box">
                            <button class="btn-normal ib" @click="rowAdd('GridDel')" >추가</button>
                            <button class="btn-normal ib" @click="rowDel('GridDel')" >제거</button>
                        </div>
                        <div class="wrapper-content">
                            <Grid ref="GridDel" :dataParams="detlParams" :paging='false'></Grid>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { ValdUtil }         from '@/utils/ValdUtil.js'
import { DateUtil }         from '@/utils/DateUtil.js'
import { CmonUtil }         from '@/utils/CmonUtil.js'
import { SessionUtil }      from '@/utils/SessionUtil.js'
import Grid                 from '@/components/grid/Grid.vue'
import SetButton            from '@/components/SetButton.vue'

export default {
    components: {
        Grid
       ,SetButton
    },
    data: function() {
		return {
            //검색조건
            srchParams:{
                srchWord        : ''    // 검색어
                ,fltrVal        : ''    // 대표항목조회
            }
            //상세정보
            ,detlParams:{
                citmCd          : ''    // 전환항목코드
                ,citmNm         : ''    // 전환항목명
                ,lastUuid       : ''    // 최종UUID
                ,sortOrd        : ''    // 정렬순서
                ,rmrk           : ''    // 비고    
                ,fixItemYn      : ''    // 고정여부
                ,infrDivCd      : ''    // 추정구분코드(10:)
                ,fltrVal        : ''
            }
            ,params:{
                isSysAdmin      : false, // 사용자의 ADMIN 역할 여부
                isDisabledInfo  : false, // 전환항목 정보 Disabled 여부
                selectGridRowId : '',    // setSelection 용도
                saveDiv         : '',

            }
            
        }
    },
    methods: {
        init() {
            CmonUtil.setFocus(this.$refs.srchWord);
            this.resetData(this.srchParams);
            this.clearListCitmSpecIcld();
            this.clearListCitmSpecExcp();

            this.initData();
            this.getUserRole();
            this.$nextTick(() =>{
                this.initGrid();
            })
        }
        ,initData(){
            const $this = this;
            $this.detlParams.sortOrd   = 0;
            $this.detlParams.fixItemYn = 'N';
            $this.params.saveDiv       = 'insert';
            $this.srchParams.fltrVal   = 'REPR';
        }
        ,getUserRole(){
            let role = SessionUtil.getUserRoleList();
            if(!ValdUtil.isEmptyList(role)){
                this.params.isSysAdmin = role.some(el => el.roleCd ==='SYS_ADMIN');
            }
        }
        //그리드 생성
        ,initGrid(){
            const $this = this;
            //전환항목 목록
            let gridDataCitm = {
                url : 'mng/obj/convItemSet/selectListCitmBase.hb',
                colModels : [
                    {name:'sortOrd'   ,label:'정렬순서'     ,hidden:true}
                   ,{name:'fltrVal'   ,label:'필터값'       ,hidden:true}
                   ,{name:'rmrk'      ,label:'비고'         ,hidden:true}
                   ,{name:'citmCd'    ,label:'전환항목코드'  ,width:20  ,align:'center'  ,sortable:true}
                   ,{name:'citmNm'    ,label:'전환항목명'    ,width:20  ,align:'left'    ,sortable:true}
                   ,{name:'lastUuid'  ,label:'최종UUID'     ,width:20  ,align:'center'  ,sortable:true}
                   ,{name:'fixItemYn' ,label:'고정항목여부'  ,width:10  ,align:'center'  ,sortable:true}
                ]
               ,options: {
                     loadonce: true
                    ,onSelectRow(rowid, val, e){ 
                        $this.resetDetlParams();
                        let rowData = $(this).jqGrid('getRowData',rowid);
                        $this.detlParams = rowData;
                        if(rowData.fixItemYn == 'O'){
                            $this.detlParams.fixItemYn = 'Y'; 
                        } else if ( rowData.fixItemYn == 'X'){
                            $this.detlParams.fixItemYn = 'N';
                        }
                        $this.params.saveDiv           = 'update';
                        $this.params.selectGridRowId   = rowid;
                        $this.$nextTick(() =>{
                            $this.selectListCitmSpecIcld();
                            $this.selectListCitmSpecExcp();
                            $this.setDisableConvItemInfo();
                        });
                        
                    }
                    ,gridComplete(){
                        if(ValdUtil.isNotNull($this.params.selectGridRowId)){
                            $(this).jqGrid('setSelection',$this.params.selectGridRowId);
                        }
                    }
                }                
            }
            $this.$refs.CitmBase.init(gridDataCitm);
            //조회 전환항목 목록
            this.searchListCitmBase();
            
            //전환항목 상세정보(포함어)
            let gridDataIcld = {
                url : '/mng/obj/convItemSet/selectListCitmSpecIcld.hb'
                ,colModels : [
                    {name:'crud'            , label: 'crud'             , width: 50, align:'center', hidden:true},
                    {name:'citmCd'          , label: '개인정보항목코드'  , width: 50, align:'center', hidden:true},
                    {name:'infrSeq'         , label: '순번'             , width: 50, align:'center', hidden:true},
                    {name:'infrDivCd'       , label: '추정단어구분'      , width: 50, align:'center', hidden:true},
                    {name:'infrWord'        , label: '단어명'           , width: 50, align:'left'   , editable : true ,sortable:true
                        , cellattr:function(rowid, value, rawObject, cm, rdata){
                            let classNm = "";
                            if(rawObject.crud != "C") {classNm = "class='not-editable-cell'"} ;
                            return classNm;}
                    }
                ],
                options : {
                    loadonce: true
                    ,height:247
                    ,cellEdit :true
                    ,cellsubmit : "clientArray"
                    ,multiselect : true
                    ,afterEditCell : function (rowid , colname , val, iRow, iCol){
                        $('#'+ rowid + '_' + colname).blur(function(e){
                            $('#'+$this.$refs.GridAdd.getGridId()).jqGrid('saveCell',iRow, iCol);
                        });
                    }
                   ,afterSaveCell : function (rowid , colId , val){
                        let dupYn = $this.checkInfrWord(rowid, val, "10");                        
                        if(dupYn !='N'){
                            $(this).jqGrid('setCell', rowid, 'infrWord');
                            let msg = "중복된 단어입니다.";
                            if(dupYn == 'DEL_Y') msg = "제외어에 포함된 단어입니다."
                            $this.alert(msg);
                        }
                    }
                }
            }
            $this.$refs.GridAdd.init(gridDataIcld);

            //전환항목 상세정보(제외어)
            let gridDataExcp = {
                url : '/mng/obj/convItemSet/selectListCitmSpecIcld.hb'
                ,colModels : [
                    {name:'crud'            , label: 'crud'            , width: 50, align:'center', hidden:true},
                    {name:'citmCd'          , label: '개인정보항목코드' , width: 50, align:'center', hidden:true},
                    {name:'infrSeq'         , label: '순번'            , width: 50, align:'center', hidden:true},
                    {name:'infrDivCd'       , label: '추정단어구분'      , width: 50, align:'center', hidden:true},
                    {name:'infrWord'        , label: '단어명'          , width: 50, align:'left' , editable : true,sortable:true
                        , cellattr:function(rowid, value, rawObject, cm, rdata){
                            let classNm = "";
                            if(rawObject.crud != "C") {classNm = "class='not-editable-cell'"} ;
                            return classNm;}
                    }
                ],
                options : {
                    loadonce: true
                    ,height:247
                    ,cellEdit :true
                    ,cellsubmit : "clientArray"
                    ,multiselect : true
                    ,afterEditCell : function (rowid , colname , val, iRow, iCol){
                        $('#'+ rowid + '_' + colname).blur(function(e){
                            $('#'+$this.$refs.GridDel.getGridId()).jqGrid('saveCell',iRow, iCol);
                        });
                    }
                    ,afterSaveCell : function (rowid , colId , val){
                        let dupYn = $this.checkInfrWord(rowid, val, "20");                        
                        if(dupYn !='N'){
                            $(this).jqGrid('setCell', rowid, 'infrWord');
                            let msg = "중복된 단어입니다.";
                            if(dupYn == 'ADD_Y') msg = "포함어에 포함된 단어입니다."
                            $this.alert(msg);
                        }
                    }
                }
            }
            $this.$refs.GridDel.init(gridDataExcp);
        }
        // 저장 컨펌
        ,saveConvItemCnfm(){
            const $this = this;
            let saveDiv = $this.params.saveDiv;
            let isAdmin = $this.params.isSysAdmin;
            if(saveDiv == 'insert'){
                $this.saveConvItemSet(isAdmin, saveDiv);
            } else if(saveDiv == 'update'){
                if(isAdmin == true) {
                    // 고정항목여부 변경 확인
                    let gridData       = $this.$refs.CitmBase.getGridObj().jqGrid('getRowData');
                    let savedGridData  = gridData.find(el => el.citmCd == $this.detlParams.citmCd);
                    let savedFixItemYn = '';
                    if(!ValdUtil.isEmptyJson(savedGridData)){
                        if(savedGridData.fixItemYn == 'O'){
                            savedFixItemYn = 'Y';
                        } else if (savedGridData.fixItemYn == 'X'){
                            savedFixItemYn = 'N';
                        }
                    }
                    if(savedFixItemYn != $this.detlParams.fixItemYn){
                        $this.confirm({
                            content  : '고정항목여부 값이 변경되었습니다. <br> 변경된 값으로 저장하시겠습니까?',
                            callback : {
                                yes(){
                                    $this.saveConvItemSet(isAdmin, saveDiv);
                                }
                            }
                        })
                    } else {
                        $this.saveConvItemSet(isAdmin, saveDiv);
                    }
                } else if(isAdmin== false){
                    // 고정항목인 경우
                    if(ValdUtil.isNotNull($this.detlParams.fixItemYn) && $this.detlParams.fixItemYn == 'Y'){
                        $this.confirm({
                            content  : '고정항목인 경우, 포함어 및 제외어만 저장이 가능합니다. <br> 저장하시겠습니까?',
                            callback : {
                                yes(){
                                    $this.saveConvItemSet(isAdmin, saveDiv);
                                }
                            }
                        })
                    } 
                    // 고정항목이 아닌경우
                    else if(ValdUtil.isNotNull($this.detlParams.fixItemYn) && $this.detlParams.fixItemYn == 'N'){
                        $this.saveConvItemSet(isAdmin, saveDiv);
                    } 
                }
            }
        }
        // 저장
        ,saveConvItemSet(roleDiv, saveDiv){
            const $this = this;
            if(!$this.saveValid()) return false;

            let gridAddData  = $this.$refs.GridAdd.getGridObj().jqGrid('getRowData');
            let gridDelData  = $this.$refs.GridDel.getGridObj().jqGrid('getRowData');
           
            let citmSpecList = gridAddData;
            citmSpecList     = citmSpecList.concat(gridDelData);
            
            let sendParams   = _.cloneDeep($this.detlParams);
            if(saveDiv == 'insert'){
                sendParams['citmSpecList']  = citmSpecList.filter(el=>ValdUtil.isNotNull(el.infrWord));
                sendParams['saveDiv']       = 'insert';
                if(roleDiv == true){
                    sendParams['roleDiv']   = 'admin';
                } else if(roleDiv == false){
                    sendParams['fixItemYn'] = 'N';
                    sendParams['roleDiv']   = 'noAdmin';
                }
            } else if(saveDiv == 'update'){
                sendParams['citmSpecList'] = citmSpecList.filter(el=>ValdUtil.isNotNull(el.infrWord));
                sendParams['saveDiv']      = 'update';
                if(roleDiv == true){
                    sendParams['roleDiv']  = 'admin';
                } else if(roleDiv == false) {
                    sendParams['roleDiv']  = 'noAdmin';
                }
            }
            $this.doPost('/mng/obj/convItemSet/saveCitm.hb', sendParams).then(function(res){
                if(res.data.rtnCd == '0000'){
                    $this.alert('저장되었습니다').then((result)=>{
                        if(result.isConfirmed){
                            $this.searchListCitmBase('save');
                        }
                    })
                }else{
                    $this.alert(res.data.rtnMsg);
                }
            });   
        }
        // 삭제 컨펌
        ,deleteConvItemCnfm(){
            const $this = this;
            if(ValdUtil.isNull($this.detlParams.citmCd)) {
                $this.alert("삭제할 전환항목을 선택해주세요")
                return false;
            }
            if($this.detlParams.fixItemYn == 'Y'){
                if($this.params.isSysAdmin == false){
                    $this.alert("해당 전환항목은 솔루션 고정항목입니다 <br> 삭제할 수 없습니다");
                    return false;
                } else if($this.params.isSysAdmin == true){
                    $this.confirm({
                        content  : '해당 전환항목은 솔루션 고정항목입니다. <br> 삭제하시겠습니까?',
                        callback : {
                            yes(){
                                $this.chckBfDeleteConvItem();
                            }
                        } 
                    })
                }
            } else if($this.detlParams.fixItemYn == 'N'){
                $this.chckBfDeleteConvItem();
            }
        }
        // 삭제 처리 전 사용중인 전환항목인지 체크
        ,chckBfDeleteConvItem(){
           const $this = this;
           $this.doPost('/mng/obj/convItemSet/selectInfoConvVer.hb', $this.detlParams).then(function(res){
                    if(res.data.rtnCd == '0000'){
                        if(res.data.rtnData.rsltCnt > 0 ){
                            $this.confirm({
                                content   : '해당 전환항목은 사용중인 전환항목입니다. <br> 삭제하시겠습니까?'
                                ,callback :{
                                    yes(){
                                        $this.deleteConvItemSet();
                                    }
                                }
                            });
                        } else {
                            $this.deleteConvItemSet();
                        }
                        
                    }else{
                        $this.alert(res.data.rtnMsg);
                    }
                });
        }
        //삭제 처리 
        ,deleteConvItemSet(){
            const $this = this;
            $this.confirm({
                content   : '현재 조회된 전환항목 정보를 삭제하시겠습니까?'
                ,callback : {
                    yes(){
                        $this.params.selectGridRowId = '';
                        let params = {
                            citmCd : $this.detlParams.citmCd
                        };
                        $this.doPost('/mng/obj/convItemSet/deleteCitm.hb', params).then(function(res){
                            if(res.data.rtnCd == '0000'){
                                $this.alert('삭제되었습니다').then((result)=>{
                                    if(result.isConfirmed){
                                        $this.searchListCitmBase('save');
                                    }
                                })
                            }else{
                                $this.alert(res.data.rtnMsg).then((result)=>{
                                    if(result.isConfirmed){
                                        $this.searchListCitmBase('save');
                                    }
                                });
                            }
                        });
                    }
                }
            })
        }
        // 전환항목정보 Disabled 처리
        ,setDisableConvItemInfo(){
            const $this = this;
            if($this.params.isSysAdmin == false){
                if($this.detlParams.fixItemYn == 'Y'){
                    $this.params.isDisabledInfo = true;
                } else if($this.detlParams.fixItemYn == 'N'){
                    $this.params.isDisabledInfo = false;
                }
            }
        }
        //TO_DO uuid갱신 분기
        ,uuidRfrsh(div){
            let $this = this;
            if(div == 'all'){
                // 일괄갱신
                let gridObj = $this.$refs.CitmBase.getGridObj();
                let data = gridObj.jqGrid('getRowData');
                if(ValdUtil.isEmptyList(data)){
                    $this.alert('일괄 갱신 대상이 없습니다');
                    return false;
                }
                $this.confirm({
                    content: '전체 전환항목의 UUID를 <br/> 갱신하시겠습니까?'
                    ,callback:{
                        yes(){
                            $this.alert('갱신 완료되었습니다')
                        }
                    }
                });

            }else if(div == 'one'){
                if(!ValdUtil.srchValdNull($this.detlParams.citmCd,'전환항목','slct')) return false;
                if($this.detlParams.fixItemYn == 'N') {
                    $this.alert("사용자 정의항목은 UUID 갱신을 지원하지 않습니다")
                    return false;
                }
                $this.confirm({
                    content   : '해당 전환항목의 UUID를 갱신하시겠습니까?'
                    ,callback : {
                        yes(){
                            $this.alert('갱신 완료되었습니다')
                        }
                    }
                });
            }
        }
        //페이지 이동
        ,async setPageLink(pageNo){
            let params = {}
            ValdUtil.isNotNull(this.detlParams.citmCd) ?  params = { 'citmCd' : this.detlParams.citmCd } : params = null;
            CmonUtil.setPageLink(pageNo,params);
        }
        //행추가
        ,rowAdd(div){
            let gridObj = this.$refs[div].getGridObj();
            
            // 10 : 포함, 20: 제외
            var addRowData = {
                crud       : "C"
                ,citmCd     : this.detlParams.citmCd
                ,infrSeq    : ''
                ,infrDivCd  : div =='GridAdd'? '10' :'20'
                ,infrWord   : ''
                                    
            }
            gridObj.addRowData(gridObj.jqGrid("getGridParam", "records")+1, addRowData);
        }
        //행삭제
        ,rowDel(div){
            let rowIds = this.$refs[div].getGridObj().getGridParam("selarrrow");
            if(rowIds.length > 0){
				for(var i = rowIds.length-1 ; i >= 0 ; i--) {
					this.$refs[div].getGridObj().delRowData(rowIds[i])
				}
            }else{
                this.alert("제거 대상을 선택하세요");
            }
        }
        //조회 전환항목 목록 
        ,searchListCitmBase(div) {
            if(div!='save'){
                this.params.selectGridRowId = '';
            }
            this.resetDetlParams();
            this.$refs.GridAdd.clearGridData();
            this.$refs.GridDel.clearGridData();
            this.$refs.CitmBase.selectList();
        }
        
        //조회 전환항목 상세정보(포함어)
        ,selectListCitmSpecIcld() {
            this.detlParams['infrDivCd'] = '10';
            this.$refs.GridAdd.selectList(true,true,true);
        }

        //조회 전환항목 상세정보(제외어)
        ,selectListCitmSpecExcp() {
            this.detlParams['infrDivCd'] = '20';
            this.$refs.GridDel.selectList(true,true,true);
        }
        //데이터 리셋
        ,resetData(){
           const $this = this;
           $this.resetsrchParams();
           $this.resetDetlParams();
           $this.resetParams();
        }
        ,resetsrchParams(){
            const $this  = this;
            $this.srchParams = {
                srchWord        : ''
                ,fltrVal        : ''
            }
        }
        ,resetDetlParams(){
            const $this = this;
            $this.detlParams = {
                citmCd          : ''    
                ,citmNm         : ''    
                ,lastUuid       : ''    
                ,sortOrd        : ''    
                ,rmrk           : ''    
                ,fixItemYn      : ''    
                ,infrDivCd      : ''    
                ,fltrVal        : ''
            }
        }
        ,resetParams(){
            const $this = this;
            $this.params = {
                isSysAdmin      : false, 
                isDisabledInfo  : false, 
                selectGridRowId : '',    
                saveDiv         : '',
            }
        }
        //전환항목 목록 엑셀다운로드
        ,downloadExcel(){
            if(ValdUtil.isEmptyList(this.$refs.CitmBase.getGridObj().jqGrid('getRowData'))){
                this.alert('엑셀다운로드 대상이 없습니다');
                return false;
            };
            this.doDownExcel('/mng/obj/convItemSet/downloadExcel.hb', this.srchParams, '전환항목목록_'+DateUtil.getCurrDate('YYYYMMDD')+'.xlsx');
        }
        //저장 시 유효성 검증
        ,saveValid(){
            let $this = this;
            //길이 및 빈 값 검사 
            if(!ValdUtil.valdLenNull($this.detlParams.citmCd  , 20  , '전환항목코드는')) return false;
            if(!ValdUtil.valdLenNull($this.detlParams.citmNm  , 100 , '전환항목명은')) return false;
            if(!ValdUtil.valdLenNull($this.detlParams.sortOrd , ''  , '정렬순서')) return false;
            if(!ValdUtil.valdLenNull($this.detlParams.rmrk    , ''  , '참고사항')) return false;
            
            return true;
        }
        // 포함어제외어 중복체크
        ,checkInfrWord(rowIdx , infrWord, infrDivCd){            
            const $this =  this;

            var addCnt = $this.$refs.GridAdd.getGridObj().jqGrid("getGridParam", "records")+1;
            var addRowList = $this.$refs.GridAdd.getGridObj().jqGrid("getDataIDs");            
            let addGridObj = $this.$refs.GridAdd.getGridObj();

            let dupYn = 'N';

            // 포함어 체크
            if(addCnt > 0 ){
                addRowList.forEach((rowId)  => {                                 
                    if(infrWord == addGridObj.getRowData(rowId).infrWord && (infrDivCd == '20' || (infrDivCd =='10' && rowId != rowIdx))){
                        if(addGridObj.getRowData(rowId).crud != 'D'){
                            dupYn = 'ADD_Y';
                        }
                    }
                });
            }

            var delCnt = $this.$refs.GridDel.getGridObj().jqGrid("getGridParam", "records")+1;
            var delRowList = $this.$refs.GridDel.getGridObj().jqGrid("getDataIDs");            
            let delGridObj = $this.$refs.GridDel.getGridObj();

             // 제외어 체크
             if(delCnt > 0 ){
                delRowList.forEach((rowId)  => {                                 
                    if(infrWord == delGridObj.getRowData(rowId).infrWord && (infrDivCd == '10' || (infrDivCd =='20' && rowId != rowIdx) ) ){                                
                        if(delGridObj.getRowData(rowId).crud != 'D'){
                            dupYn = 'DEL_Y';
                        }
                    }
                });
            }
            return dupYn;            
        }
        //전환항목정보 초기화 버튼
        ,btnReset(){
            if(ValdUtil.isNull(this.detlParams.fixItemYn)){
                this.alert("전환항목을 선택해주세요")
                return false;                
            }
            if(this.params.isSysAdmin == true){
                this.resetConvItemSet();
            } else if(this.params.isSysAdmin == false){
                if(this.detlParams.fixItemYn == 'Y'){
                    this.alert("고정항목은 초기화 할 수 없습니다")
                    return false;
                } else if(this.detlParams.fixItemYn == 'N'){
                    this.resetConvItemSet();
                }
            }
            
        }
        //전환항목정보 초기화
        ,resetConvItemSet(){
            this.resetDetlParams();
            this.detlParams.sortOrd   = 0;
            this.detlParams.fixItemYn = 'N';
            this.params.saveDiv       = 'insert';
            this.clearListCitmSpecIcld();
            this.clearListCitmSpecExcp();
        }
        //초기화 전환항목 목록 
        ,clearListCitmBase() {
            this.$refs.CitmBase.clearGridData();
        }
        //초기화 전환항목 상세정보(포함어)
        ,clearListCitmSpecIcld() {
            this.$refs.GridAdd.clearGridData();
        }
        //초기화 전환항목 상세정보(제외어)
        ,clearListCitmSpecExcp() {
            this.$refs.GridDel.clearGridData();
        }
       //공통버튼(초기화,조회,저장,삭제)
       ,onSetButtonClick(div){
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.init();
                    break;
                case 'select':
                    $this.searchListCitmBase();
                    break;
                case 'save':
                    $this.saveConvItemCnfm();
                    break;
                case 'delete':
                    $this.deleteConvItemCnfm();
                    break;
                default:
                    break;
            }
        } 
    }
   ,mounted() {
        let $this = this;
        $this.init();
    }   
}
</script>
