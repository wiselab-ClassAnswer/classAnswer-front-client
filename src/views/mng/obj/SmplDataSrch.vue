<template>
    <div>
        <!-- 검색조건 -->
        <div class="section section1">
            <div class="search-box ">
                <div class="input-box">
                    <div class="w-5 ib">
                        <h1>검색조건</h1>
                    </div>
                    <div class="w-15 ib">
                        <h2 class="essn wd-65 ib">DB연결ID</h2>
                        <select class="c-wd-65" ref="dbConnId" v-model="params.dbConnId" @change="changeDbConnId()">
                            <option value = ''></option>
                            <option v-for="el in dbConnIdList" :key="el.colId" :value="el.colId">{{el.colId + ' | ' +el.colNm}}</option>
                        </select>
                    </div>
                    <div class="w-22 ib" style="position:relative">
                        <h2 class="essn wd-60 ib">테이블ID</h2>
                        <input class="c-wd-60 search" type="text" :value="params.schId!='' && params.tblId != ''? params.schId+' | '+params.tblId:params.schId+params.tblId" @change="sdfchange()" disabled>
                        <button class="btn-search"  @click="TblSrchPopup()">
                            <img src="@/assets/img/btn_search.png" alt="찾기">
                        </button>
                    </div>
                    <div class="w-15 ib m-l-15">
                        <input type="text" v-model="params.tblNm" disabled> 
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="false" :showDelete="false" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- 테이블 명세 -->
        <div class="section sectionL w-40">
            <div class="section-wrap p-t-20">
                <!-- 그리드 -->
                <h2 class="ib m-b-11">테이블 명세</h2>
                <div class="wrapper-content">
                    <Grid ref="tblSpecList" :dataParams="params" :paging=false :sortable="true"></Grid>
                </div>
            </div>
        </div>

        <!-- 데이터 검색 -->
        <div class="section sectionR w-60">
            <div class="section-wrap w-100 p-t-15">
                <div class="section-part m-0 p-0 w-65 ib">
                    <h2 class="ib wd-90">데이터 검색</h2>
                    <div class="wd-150 m-0 ib ">
                        <span class="wd-50 m-0">조회건수</span>
                        <select class ="c-wd-50 t-a-r selection p-rl" v-model="params.maxRowCnt">
                            <option value=""></option>
                            <option v-for="el in params.rowCountList" :key="el" :value="el">{{el+' 건'}}</option>
                        </select>
                    </div>
                    <div class="c-wd-300 m-0 ib m-l-5">
                        <span class="wd-50 m-0">조회조건</span>
                        <input class="c-wd-50"  type="text" v-model="params.condStmt" v-on:keyup.enter="searchListSrchData(true)" @input="textUpper()">
                        <!-- <input class="c-wd-60" type="text" :value="params.condStmt"  @input="params.condStmt = CmonUtil.korTypeToEng($event)" style="ime-mode:disable"> -->
                        <!-- <input class="c-wd-60" type="text" v-on:keyup.enter="searchListSrchData(true)" v-model="params.condStmt" @keydown="korTypeToEng()"> -->
                    </div>
                    <div class="wd-150 m-0 ib p-rl">
                        <span class="wd-20 m-0">총</span>
                        <input class="c-wd-20 t-a-r p-r-15" type="text" v-model="params.dataCnt" disabled>
                        <span style="width:15px; position:absolute; top:9px; right:0px;">건</span>
                    </div>
                </div>
                <div class=" f-r ib p-l-10 p-rl" style="top:-3px">
                    <button class="btn-normal m-r-5" @click="selectBtnSearchData('C')">조건조회</button>
                    <button class="btn-normal m-r-5" @click="selectBtnSearchData('D')" >DISTINCT</button>
                    <button class="btn-normal" @click="selectBtnSearchData('M')" >MIN/MAX</button>
                    <button class="btn-exel-download p-rl" style="top:3px" @click="downloadExcel()" >
                        <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                        <p>다운로드</p>
                    </button>    
                </div>
                <!-- 그리드 -->
                <div :id=etcWrapperId class="p-t-0">
                    <table :id=etcGridId></table>
                    <div :id=etcPagerId></div>
                </div>
            </div>
        </div>
        <TblSrch ref="TblSrch" :dataParams="params" @selectTbl="returnTblData"></TblSrch>
    </div>
</template>

<script>
import { inject,reactive } from 'vue'
import { GridUtil        } from '@/utils/GridUtil'
import { CmonUtil        } from '@/utils/CmonUtil.js'
import { ValdUtil        } from '@/utils/ValdUtil.js'
import { DateUtil        } from '@/utils/DateUtil.js'
import Grid                from '@/components/grid/Grid.vue'
import TblSrch             from '@/views/mng/obj/TblSrch.vue'
import SetButton           from '@/components/SetButton.vue'
export default {
    components: {
        Grid
       ,TblSrch 
       ,SetButton
    }
   ,setup(){
        const colIdNmDbConnIdData = { 'tblId'  :'te_db_conn_info'
                                 ,'colId'  :'db_conn_id'
                                 ,'colNm'  :'db_conn_nm'
                                 ,'where'  : [
                                    {'andCol' :'db_type_cd'
                                    ,'andCalc':'!='
                                    ,'andVal' :"'MET'"}
                                  ]
                                 ,'orderby' : [
                                    {'orderCol' : 'db_conn_id'}
                                   ,{'orderCol' : 'db_conn_nm'}
                                  ]
        };  
        const dbConnIdList = reactive([]);
        const getDbConnList = inject('getDbConnList');
        getDbConnList(colIdNmDbConnIdData, dbConnIdList, 'N', null);

        let etcGridId    = reactive({});
        let etcPagerId   = reactive({});
        let etcWrapperId = reactive({});
        
        let objectId = Math.random().toString(36);
        objectId     = objectId.replaceAll('.','');
        etcGridId    = 'grid_list_' + objectId;
        etcPagerId   = 'pager_list_' + objectId;
        etcWrapperId = 'list_wrapper_' + objectId;
        
        return {
            dbConnIdList
           ,colIdNmDbConnIdData           
           ,etcGridId
           ,etcPagerId
           ,etcWrapperId
        }
    }
   ,data: function() {
		return {
            params:{
                dbConnId: ''            //DB연결ID
               ,schId: ''               //스키마ID
               ,tblId: ''               //테이블ID
               ,tblNm: ''               //테이블Nm
               ,colId: ''               //컬럼ID
               ,maxRowCnt: ''          //최대조회건수
               ,rowCountList:[
                '100','300','500','1000'
               ]
               ,srchDiv: ''             //조회구분
               ,dataCnt: ''             //적재건수
               ,condStmt: ''            //조회조건
               ,dataSrchColModel : [{}] //데이터검색ColModel
               ,gridData : []
               ,smplDataList: []
               ,isFixed: true 
            },
        }
    },
    methods: {
        init() {
            const $this = this;
            CmonUtil.setFocus(this.$refs.dbConnId);

            $this.initGrid();

            let data = CmonUtil.getPageLink('O1050');
            if(!ValdUtil.isEmptyJson(data)){
                $this.initData(data);
            }
        }
        //데이터 생성
       ,initData(data){
            const $this = this;
            $this.params.dbConnId  = data.dbConnId;       
            $this.params.schId     = data.schId;       
            $this.params.tblId     = data.tblId;       
            $this.params.tblNm     = data.tblNm;       
            $this.params.colId     = data.colId;  
        
            $this.searchListTblSpec();
        }
        //그리드 생성
       ,initGrid(){
            const $this = this;
            let tblSpecListData={
                url:'/mng/obj/smplDataSrch/selectListTblSpec.hb'
               ,colModels:[
                    {name:'colId'    ,label:'컬럼ID'  ,width:15  ,align:'left'   ,sortable:true}
                   ,{name:'colNm'    ,label:'컬럼명'  ,width:15  ,align:'left'   ,sortable:true}
                   ,{name:'dataType' ,label:'TYPE'   ,width:10  ,align:'center' ,sortable:true}
                   ,{name:'nullYn'   ,label:'널'     ,width:5   ,align:'center' ,sortable:true}
                   ,{name:'pkYn'     ,label:'PK'     ,width:5   ,align:'center' ,sortable:true}
                   ]
               ,options:{
                    rownumbers: true
                   ,onSelectRow(rowid, val, e){
                        $this.params.colId   = $(this).jqGrid('getRowData',rowid).colId;
                    }
                   ,loadonce: true
                }
            }
            $this.$refs.tblSpecList.init(tblSpecListData);   
        }
       ,changeDbConnId(){
            const $this = this;
            $this.params.schId = '';
            $this.params.tblId = '';
            $this.params.tblNm = '';
            $this.params.colId = '';
            $this.params.smplDataList = [];
            $this.$refs.tblSpecList.clearGridData();
            $.jgrid.gridUnload($this.etcGridId);
       }
        //조회 테이블명세
       ,searchListTblSpec(){
            const $this = this;
            $this.params.smplDataList = [];
            $.jgrid.gridUnload($this.etcGridId);
            if($this.isVald($this.params.dbConnId,'DB연결ID') && $this.isVald($this.params.tblId,'테이블')){
                $this.params.colId = '';
                $this.params.srchDiv = "C";
                $this.$refs.tblSpecList.clearGridData();
                $this.$refs.tblSpecList.selectList(true);                
                $this.searchDataCnt()       
            }           
        }
        //그리드 데이터 세팅
       ,searchDataSrch(){
            const $this = this;
            $("#"+$this.etcGridId).setGridParam({
                datatype: "local",
                data : $this.params.gridData,
                loadComplete: function (response) {
                    CmonUtil.processLoading(false);
                    if(response != undefined){
                        if ( response.rows.length > 0 ) {
                            $this.params.smplDataList = response.rows;
                        }
                    }
                }
            }).trigger("reloadGrid");
        }
        //그리드생성 데이터검색
       ,initGridDataSrch(){
            const $this = this;        
            $.jgrid.gridUnload($this.etcGridId);
            if($this.params.srchDiv =='C' || $this.params.srchDiv =='D'){
                $("#"+$this.etcGridId).jqGrid($.extend(true, {}, GridUtil.gridOptions(), {
                    datatype: 'local',
                    mtype: 'post',
                    data : $this.params.gridData,
                    colModel: $this.params.dataSrchColModel,
                    rowNum : $this.params.maxRowCnt,
                    rownumbers: true,
                    loadonce :true
                }));
            } else {
                $("#"+$this.etcGridId).jqGrid($.extend(true, {}, GridUtil.gridOptions(), {
                    datatype: 'local',
                    mtype: 'post',
                    data : $this.params.gridData,
                    colModel: $this.params.dataSrchColModel,
                    rowNum : $this.params.maxRowCnt,
                    loadonce :true
                }));
            }
            GridUtil.resizeJqGridWidth($this.etcGridId, $this.etcWrapperId);
            $this.searchDataSrch();
        }
        //조회 데이터검색적재건수
       ,searchDataCnt(){
            const $this = this;
             $this.doPost('/mng/obj/smplDataSrch/searchListDataCnt.hb', $this.params).then(function(res){
                // CmonUtil.processLoading(false);
                if (res.data.rtnCd == '0000') {
                    $this.params.dataCnt = CmonUtil.addThousandComma(res.data.rtnData.result);
                    $this.params.maxRowCnt = '100';
                }else{
                    $this.alert(res.data.rtnMsg);
                }
            });            
        }
        //조회 데이터검색colModel,gridData
       ,searchListSrchData(){
            const $this = this;   
            $this.params['div'] = 'colModel';
            $this.params.dataSrchColModel = [];  
            $this.params.gridData = [];
            $this.doPost('/mng/obj/smplDataSrch/selectListSrchData.hb', $this.params).then(function(res){
                // CmonUtil.processLoading(false);
                if (res.data.rtnCd == '0000') {
                    if($this.params.srchDiv=='M'){
                            res.data.rtnData.result.colModel.forEach(el => {
                            let name  =el[0]=='MIN_VAL' ? 'minVal' : 'maxVal'
                            let label =el[1].replace('_','');
                            let str = {'name': name , 'label':label, sortable:true };
                            $this.params.dataSrchColModel.push(str);
                        });    
                    }else if($this.params.srchDiv=='D'){
                        res.data.rtnData.result.colModel.forEach(el => {
                            let name  =CmonUtil.snakeToCamel2(el[0]);
                            let label =el[1].replace('_','');
                            let width =el[1].length+100
                            let str = {'name': name , 'label':label ,'width':width, sortable:true};
                            if(name != 'piqdUuid' && name != 'piqdRegiDttm'){
                                $this.params.dataSrchColModel.push(str);
                            }
                        });
                    }else{
                        if(res.data.rtnData.result.colModel.length < 8){
                            $this.params.isFixed = false;
                        }
                        res.data.rtnData.result.colModel.forEach(el => {
                            let name  =el[0];
                            let label =el[1].replace('_','');

                            if(ValdUtil.isNotNull(name)){
                                $this.pushColModel(name,label);
                            }
                        });
                    }
                    $this.params.gridData = res.data.rtnData.result.gridData;
                    $this.initGridDataSrch();                    
                }else{
                    $this.alert(res.data.rtnMsg);
                    $this.params.gridData = '';
                    let str   ={'name': 'name' , 'label':'null'};            
                    $this.params.dataSrchColModel.push(str);
                    $this.initGridDataSrch();        
                }
            });            
        } 
        //그리드 초기화
       ,gridReset(){
            const $this = this;   
        }
       ,gridReInit(){
            const $this = this;
            $this.initGridDataSrch();    
            $this.$refs.dataSrch.clearGridData(true);
            $this.$refs.dataSrch.gridReload($this.params.dataSrchColModel);
        }
       ,gridUnload(){
            const $this = this;
            $this.$refs.dataSrch.gridUnload()
        }
        //버튼 (랜덤조회, DISTINCT, MIN/MAX, 조건조회)
       ,selectBtnSearchData(srchDiv){
            const $this = this;
            $this.params.srchDiv = srchDiv;
            if( $this.isVald($this.params.dbConnId,'DB연결ID') && $this.isVald($this.params.tblId,'테이블') && $this.isVald($this.params.maxRowCnt,'조회건수')){
             
                if( (srchDiv == 'D' || srchDiv == 'M' ) ){
                    if($this.isVald($this.params.colId,'컬럼')){
                        $this.searchListSrchData();    
                    }
                }else{
                    $this.searchListSrchData();
                }   
            }
        }
        //팝업 테이블검색
       ,TblSrchPopup(){
            const $this = this;
            $this.$refs.TblSrch.show();
            $this.$refs.TblSrch.init();
            $this.$refs.TblSrch.initGrid();
        }
        //팝업 테이블정보 받기        
       ,returnTblData(selectData){
            const $this =  this;
            $this.params.dbConnId = selectData.dbConnId;
            $this.params.schId    = selectData.rowData.schId;
            $this.params.tblId    = selectData.rowData.tblId;
            $this.params.tblNm    = selectData.rowData.tblNm;
            $this.searchListTblSpec();
            $.jgrid.gridUnload($this.etcGridId);
            $this.params.condStmt = '';
        }
       ,textUpper(){
            this.params.condStmt = this.params.condStmt.toUpperCase();
        }
        //엑셀다운로드        
        ,downloadExcel(){
            let $this = this;
            if($this.isVald($this.params.smplDataList, '엑셀다운로드')){
                let fileNm = '샘플데이터_'+DateUtil.getCurrDate('YYYYMMDD')+'.xlsx';
                let url    = '/mng/obj/smplDataSrch/searchListSmpmDataStatDownloadExcel.hb'
                $this.doDownExcel(url, $this.params, fileNm)
            }
        }
        //유효성검사
       ,isVald(chkVal,stmt){
            const $this = this;
            let returnSmtm = '';
            let stmt1 = '을(를) 선택하세요';
            let stmt2 = '을(를) 입력하세요';
            let stmt3 = '대상이 없습니다';

            if(ValdUtil.isNotNull(stmt) && stmt =='조회조건'){
                returnSmtm = stmt + stmt2
            }else if(ValdUtil.isNotNull(stmt) && stmt =='엑셀다운로드'){
                returnSmtm = stmt + stmt3;
            }else{
                returnSmtm = stmt + stmt1;
            }
            if(ValdUtil.isNull(chkVal) || chkVal.length == 0){
                $this.alert(returnSmtm);
                return false;
            }
            return true;
        }
        //ColModel생성
        ,pushColModel(name, label){
            const $this = this;
            let colModelStan = CmonUtil.getColModelStan();

            let width     = name.length+100;
            let align     = 'left';
            let formatter = $this.nullToBlank;
            
            // let _nameVal = CmonUtil.getSplitStr(name,'_','last');
            let _nameVal = CmonUtil.getSplitStr(name,'_');

            colModelStan.forEach(el => {
                let key = Object.keys(el)
                if(Array.isArray(_nameVal)){
                    _nameVal.forEach(nameValEl =>{
                        if(nameValEl == key[0]){
                            align = el[key[0]];
                            formatter = el[key[1]];
                        }
                    });
                }else{
                    if(_nameVal == key[0]){
                        align = el[key[0]];
                        formatter = el[key[1]];
                    }
                }
            });
            name = CmonUtil.snakeToCamel2(name);
        
            let str   ={'name': name.trim() , 'label':label.trim() ,'width':width, 'align': align, 'formatter':formatter,'fixed':$this.params.isFixed ,sortable:true};            

            if(name != 'piqdUuid' && name != 'piqdRegiDttm'){
                $this.params.dataSrchColModel.push(str);
            }
        }
        //공통버튼(초기화,조회)
       ,onSetButtonClick(div){
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.reset();
                    break;
                case 'select':
                    $this.searchListTblSpec();
                    break;
                default:
                    break;
            }
        }
        //초기화
        ,reset(){
            const $this = this;
            $this.params.dbConnId   = '';
            $this.params.schId      = '';
            $this.params.tblId      = '';
            $this.params.tblNm      = '';
            $this.params.colId      = '';     
            $this.params.maxRowCnt  = '';   
            $this.params.srchDiv    = '';
            $this.params.dataCnt    = '';
            $this.params.condStmt   = '';
            $this.params.dataSrchColModel = [{}];
            $this.params.gridData   = [];
            $this.params.smplDataList = [];
            $this.params.isFixed    = true;

            $this.$refs.tblSpecList.clearGridData();
            $.jgrid.gridUnload($this.etcGridId);
            CmonUtil.setFocus(this.$refs.dbConnId);
        }
        ,change(){
            this.params.schId = '';
            this.params.tblId = '';
            this.params.tblNm = '';
        }
    }
   ,mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>