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
                        <h2 class="essn wd-65 ib">DB연결ID</h2>
                        <select class="c-wd-65" ref="dbConnId" v-model="params.dbConnId" @change="selectDbConnId()">
                            <option value = ''></option>
                            <option v-for="el in dbConnIdList" :key="el.colId" :value="el.colId">{{el.colId + ' | ' +el.colNm}}</option>
                        </select>
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-75 ib">테이블검색어</h2>
                        <input class="c-wd-75 ib" type="text" v-model="params.srchWord" v-on:keyup.enter="searcListTblBase(true)">
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-70 ib">이행대상여부</h2>

                           <label v-for="el in isMigObjList" :key="el">
                            <input type="radio" class="h-a p-rl wd-20 m-l-5" :value="el.cdVal" v-model="params.isMigObj" style="top:2px; left:-3px;" @change="searcListTblBase(true)">
                            <p class="pointer ib wd-35'">{{el.cdNm}}</p> 
                        </label>
                    </div>
                    <div class="w-10 input-check ib">
                        <input type="checkbox" v-model="params.chngIdenYn" @change="searcListTblBase(true)" :disabled="params.dbConnId == ''">
                        <p>변경 내용 조회</p>
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="false" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>
        <!-- 테이블 목록 -->
        <div class="section sectionL">
            <div class="section-wrap">
                <h2 class="wd-100 ib">테이블 목록</h2>
                <div class="c-wd-600 t-a-r f-r btn-group-box">
                    <button class="btn-normal ib" @click="rnwlTblSpec()" :disabled="params.isRunning">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                        <p class="ib">현행화</p>
                    </button>  
                    <button class="btn-normal ib" @click="TblChngEfctAnalPopup()">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'magnifying-glass']" />
                        <p class="ib">변경영향대상</p>
                    </button>  
                    <button class="btn-exel-download" @click="downloadExcel('base')">
                        <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                        <p>다운로드</p>
                    </button>    
                </div>
                <span class="wd-500 p-r-10 ib guidTextBlack">*최종현행화 일시 :&nbsp;{{this.maxRefrDt!='' ? this.formatDate(this.maxRefrDt)+' '+this.formatTime(this.maxRefrTm) : ''}} </span>
                <div class="wrapper-content">
                    <Grid ref="tblList" :dataParams="params" :paging=true></Grid>
                </div>
            </div>
        </div>
        <!-- 테이블 명세 -->
        <div class="section sectionR">
            <div class="section-wrap">
                <h2 class="ib">테이블 명세</h2>
                <div class="btn-group-box">
                    <button class="btn-normal" @click="smplDataSrchOpen()">
                        <font-awesome-icon  class="ib m-r-5" :icon="['fas', 'up-right-from-square']"/>
                        <p class="ib">샘플DATA</p>
                    </button>
                    <button class="btn-exel-download"  @click="downloadExcel('spec')">
                        <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                        <p>다운로드</p>
                    </button>      
                </div>
                <div class="wrapper-content">
                    <Grid ref="tblSpecList" :dataParams="params" :paging=false :sortable="true"></Grid>
                </div>
            </div>
        </div>
        <TblChngEfctAnalPopup ref="modal" :dataParams="params"></TblChngEfctAnalPopup>
    </div>
</template>

<script>
import { inject,reactive }  from 'vue'
import { ValdUtil }         from '@/utils/ValdUtil.js'
import { DateUtil }         from '@/utils/DateUtil.js'
import { CmonUtil }         from '@/utils/CmonUtil'
import Grid                 from '@/components/grid/Grid.vue'
import TblChngEfctAnalPopup from '@/views/cmon/env/TblChngEfctAnal.vue'
import BodySlot             from '@/slot/bodySlot.vue'
import SetButton            from '@/components/SetButton.vue'

export default {
    components: {
        Grid
       ,TblChngEfctAnalPopup
       ,BodySlot
       ,SetButton
    },
    setup(){
        const colIdNmDbConnIdData = {  'tblId'  :'te_db_conn_info'
                                  ,'colId'  :'db_conn_id'
                                  ,'colNm'  :'db_conn_nm'
                                  ,'where'  : [
                                    { 'andCol' :'db_type_cd'
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
        // 이행대상여부 리스트
        let isMigObjList = [
            {cdVal : ""    , cdNm : "전체"  },
            {cdVal : "Y"   , cdNm : "대상"  },
            {cdVal : "N"   , cdNm : "비대상"},
        ]
        return {
            dbConnIdList,
            colIdNmDbConnIdData,
            isMigObjList
        }
    },
    data: function() {
		return {
            params:{
                dbConnId: ''      //DB연결ID
               ,srchWord: ''      //검색어
               ,schId: ''         //스키마ID
               ,tblId: ''         //테이블ID
               ,tblNm: ''         //테이블NM
               ,stndDt: ''        //변경일자
               ,chngSeq: ''       //변경SEQ
               ,tblBaseList: []   //테이블기본목록
               ,tblSpecList: []   //테이블명세목록
               ,tblIdList:[]      //테이블ID목록
               ,chngIdenYn : false
               ,isMigObj: ''
            },
            isRunning: false //현행화버튼 활성여부
           ,maxRefrDt:'' //최종 현행화 일자
           ,maxRefrTm:'' //최종 현행화 시각
        }
    },
    methods: {
        init() {
            const $this = this;
            CmonUtil.setFocus(this.$refs.dbConnId);
            $this.initGrid();
            let data = CmonUtil.getPageLink('O1040');
            if(!$this.ValdUtil.isEmptyJson(data)){
                $this.initData(data);
            }
        }
       ,initData(data){
            const $this = this;
            $this.params.dbConnId = data.dbConnId;
            $this.params.srchWord = data.srchWord;
            if($this.params.dbConnId != undefined && $this.params.dbConnId != '' && $this.params.dbConnId != null){
                $this.searcListTblBase();   
            }
        }
        //그리드 생성
       ,initGrid(){
            const $this = this;
            let tblBaseListData = {
                url : '/mng/obj/tblMng/selectListTblBase.hb',
                colModels : [
                    {name:'schId'      ,label:'스키마ID'  ,width:10 ,align:'center'}
                   ,{name:'dbConnId'   ,label:'DB연결ID'  ,width:30 ,align:'left'  , hidden : true}
                   ,{name:'tblId'      ,label:'테이블ID'  ,width:30 ,align:'left'  }
                   ,{name:'tblNm'      ,label:'테이블명'  ,width:30 ,align:'left'  }
                   ,{name:'migObjYn'   ,label:'이행대상'  ,width:10 ,align:'center'    
                        , formatter: 'checkbox'
                        , formatoptions: {
                            disabled: false,
                            value: 'Y:N',
                        }
                        , edittype: 'checkbox'
                        , editoptions: { value: 'Y:N' }
                    }
                   ,{name:'chngTypeNm' ,label:'변경식별'  ,width:10 ,align:'center'}
                   ,{name:'stndDt'     ,label:'변경일자'  ,width:15 ,align:'center', formatter: $this.formatDate}
                   ,{name:'chngSeq'    ,label:'변경SEQ'   ,hidden : true}
                   ,{name:'chngTypeCd' ,label:'변경식별'  ,hidden : true}]
               ,options: {
                    beforeSelectRow: function (rowid, event) {
                        // 체크박스 찾기
                        const checkbox = $(event.target).closest('td').find('input[type="checkbox"]');
                        if (checkbox.length) {
                            // 클릭된 경우 이행대상 업데이트
                            const rowData = $(this).jqGrid('getRowData', rowid);
                            $this.updateMigObj(rowData);                            
                        }
                    },
                    gridComplete(){
                        $this.params.tblBaseList = [];
                        $this.params.tblBaseList = $(this).jqGrid('getRowData');
                    }
                   ,onSelectRow(rowid, val, e){
                        $this.params.schId   = $(this).jqGrid('getRowData',rowid).schId;
                        $this.params.tblId   = $(this).jqGrid('getRowData',rowid).tblId;
                        $this.params.tblNm   = $(this).jqGrid('getRowData',rowid).tblNm;
                        $this.params.stndDt  = $(this).jqGrid('getRowData',rowid).stndDt;
                        $this.params.chngSeq = $(this).jqGrid('getRowData',rowid).chngSeq;
                        
                        $this.searchListTblStat();
                    }
                   ,height : 599
                }                
            }
            $this.$refs.tblList.init(tblBaseListData);

            let tblSpecListData = {
                url : '/mng/obj/tblMng/selectListTblSpec.hb'
               ,colModels:[
                    {name:'colId'      ,label:'컬럼ID'   ,width:15 ,align:'left'   ,sortable:true}
                   ,{name:'colNm'      ,label:'컬럼명'   ,width:15 ,align:'left'   ,sortable:true}
                   ,{name:'dataType'   ,label:'TYPE'     ,width:15 ,align:'left'   ,sortable:true}  
                   ,{name:'nullYn'     ,label:'널'       ,width:5  ,align:'center' ,sortable:true}
                   ,{name:'pkYn'       ,label:'PK'       ,width:5  ,align:'center' ,sortable:true}
                   ,{name:'chngTypeNm' ,label:'변경식별'  ,width:7  ,align:'center'}
                   ,{name:'stndDt'     ,label:'변경일자' ,width:13 ,align:'center', formatter: $this.formatDate}
                   ]
               ,options:{
                    gridComplete(){
                        $this.params.tblSpecList = $(this).jqGrid('getRowData');
                    }
                   ,rownumbers: true
                   ,loadonce: true
                   ,height : 600
                }
            }
            $this.$refs.tblSpecList.init(tblSpecListData);
        }
       ,selectDbConnId(){
            const $this = this;
            if($this.params.dbConnId != ''){
                $this.searcListTblBase();
            }else{
                $this.params.chngIdenYn = false
                $this.maxRefrDt  = '';
                $this.maxRefrTm  = '';
                $this.params.tblBaseList = [];           //테이블명세목록
                $this.params.tblSpecList = [];           //테이블명세목록
                $this.$refs.tblList.clearGridData();     //그리드초기화 테이블목록
                $this.$refs.tblSpecList.clearGridData(); //그리드초기화 테이블명세
                $this.params.tblId = '';                 //테이블ID    
                $this.params.srchWord = '';              //검색어
            }
       }
        //조회 테이블목록 
       ,searcListTblBase() {
            const $this = this;
            $this.maxRefrDt  = '';
            $this.maxRefrTm  = '';
            $this.params.tblBaseList = [];           //테이블명세목록
            $this.params.tblSpecList = [];           //테이블명세목록
            $this.$refs.tblList.clearGridData();     //그리드초기화 테이블목록
            $this.$refs.tblSpecList.clearGridData(); //그리드초기화 테이블명세
            $this.params.tblId = '';                 //테이블ID
            
            if($this.isVald($this.params.dbConnId,'DB연결ID')){
                $this.$refs.tblList.selectList(true);
                $this.searchMaxRefrDttm();
            }
        }
        //조회 테이블명세 
       ,searchListTblStat(){
            const $this = this;
            $this.$refs.tblSpecList.selectList(true);
        }
        //조회 최종 현행화 일시
       ,searchMaxRefrDttm(){
            const $this = this;
            $this.doPost('/mng/obj/tblMng/selectMaxRefrDttm.hb',$this.params).then(function(res){
                if(res.data.rtnCd == '0000'){
                    if(ValdUtil.isNotNull(res.data.rtnData.result)){
                        $this.maxRefrDt = res.data.rtnData.result['maxRefrDt'];
                        $this.maxRefrTm = res.data.rtnData.result['maxRefrTm'];
                    }
                }else{  
                    $this.alert(res.data.rtnMsg);
                }
            });
       }
       //이행대상 업데이트
       ,updateMigObj(data){
            const $this = this;
            if(ValdUtil.isNotNull(data)){
                $this.doPost('/mng/obj/tblMng/updateMigObj.hb', data).then(function(res){
                    if(res.data.rtnCd == '0000'){
                        
                    } else {
                        $this.alert(res.data.rtnMsg);
                    }
                });
            }
       }
        //저장
       ,saveTblSpec(){
            const $this = this;
            if($this.isVald($this.params.dbConnId, 'DB연결ID')){
                $this.confirm({
                    content: '저장(갱신) 후에는 변경된 사항을 확인할 수 없습니다.<br/>선택한 DB('+$this.params.dbConnId+')의 테이블명세를 갱신하시겠습니까?' ,
                    callback: {
                        yes: function () {
                            let params = {'dbConnId':$this.params.dbConnId};
                            $this.doPost('/mng/obj/tblMng/saveTblSpec.hb', params).then(function(res){
                                // CmonUtil.processLoading(false);
                                if (res.data.rtnCd == '0000') {
                                    $this.alert('저장되었습니다').then((result)=>{
                                        if( result.isConfirmed){
                                            $this.searcListTblBase(true);
                                        }
                                    });
                                }else{
                                    $this.alert(res.data.rtnMsg).then((result) =>{
                                        if( result.isConfirmed){
                                            $this.searcListTblBase(true);
                                        }
                                    })
                                    
                                }
                            });
                        }
                    }
                });
            }
        }
        //초기화
       ,reset(){
            const $this = this;
            CmonUtil.setFocus(this.$refs.dbConnId);
            $this.params.dbConnId = '';              //DB연결ID
            $this.params.srchWord = '';              //검색어
            $this.params.schId = '';                 //스키마ID
            $this.params.tblId = '';                 //테이블ID
            $this.params.tblNm = '';                 //테이블NM
            $this.params.stndDt = '';                 //테이블NM
            $this.params.chngSeq = '';                 //테이블NM
            $this.params.tblBaseList = [];        //테이블명세목록
            $this.params.tblSpecList = [];        //테이블명세목록
            $this.params.tblIdList   = [];          //테이블ID목록
            $this.params.chngIdenYn  = false;
            $this.params.isMigObj    = '';
            $this.isRunning  = false;
            $this.maxRefrDt  = '';
            $this.maxRefrTm  = '';
            $this.$refs.tblList.clearGridData();     //그리드초기화 테이블목록
            $this.$refs.tblSpecList.clearGridData(); //그리드초기화 테이블명세
        }
        //갱신
       ,rnwlTblSpec(){
            const $this = this;
            if($this.isVald($this.params.dbConnId,'DB연결ID')){
                $this.confirm({
                    content: '테이블 정보를 현행화하시겠습니까?',
                    callback: {
                        yes: function () {
                            $this.isRunning = true; //현행화버튼 활성여부
                            $this.doPost('/mng/obj/tblMng/generateTempTblAndColInfo.hb',$this.params).then(function(res){
                                // CmonUtil.processLoading(false);
                                let cnt = 0;
                                if (res.data.rtnCd == '0000') {
                                    cnt = cnt+1;
                                    $this.alert('현행화가 요청되었습니다</br> 1분~5분 후 재조회하여 사용바랍니다').then(()=>{
                                        $this.searcListTblBase(true);
                                        $this.isRunning = false; //현행화버튼 활성여부
                                    });
                                }else{
                                    $this.alert(res.data.rtnMsg).then(()=>{
                                        $this.searcListTblBase(true);
                                        $this.isRunning = false; //현행화버튼 활성여부
                                    });;
                                }
                            });
                        }
                    }
                });
            }
        }
        //팝업 변경영향분석 
       ,TblChngEfctAnalPopup(){
            const $this = this;
            $this.params.tblIdList = [];
            $this.params.tblIdList =  $this.params.tblBaseList.filter(el=> el.chngTypeNm != '');
            if($this.isVald($this.params.dbConnId,'DB연결ID') && $this.isVald($this.params.tblIdList,'변경영향분석')) {    
                $this.$refs.modal.show();
                $this.$refs.modal.initGrid();
            }
        }
        //팝업 샘플데이터조회
       ,smplDataSrchOpen(){
            const $this = this;
            if($this.isVald($this.params.dbConnId,'DB연결ID') && $this.isVald($this.params.tblId,'tblId')) {
                let params = {
                    'dbConnId': $this.params.dbConnId 
                   ,'schId'   : $this.params.schId   
                   ,'tblId'   : $this.params.tblId   
                   ,'tblNm'   : $this.params.tblNm   
                   ,'colId'   : $this.params.colId
                }
                CmonUtil.setPageLink('O1050',params);
            }
        }     
        //엑셀다운로드        
        ,downloadExcel(div){
            let $this = this;
            let fileNm = '테이블목록_'+DateUtil.getCurrDate('YYYYMMDD')+'.xlsx';
            let url    = '/mng/obj/tblMng/selectListTblBaseDownloadExcel.hb';
            let trgt   = $this.params.tblBaseList;
            
            if(div=='spec'){
                fileNm = '테이블명세_'+DateUtil.getCurrDate('YYYYMMDD')+'.xlsx';
                url    = '/mng/obj/tblMng/selectListTblSpecDownloadExcel.hb';
                trgt   = $this.params.tblSpecList;
            }
            if($this.isVald(trgt,'엑셀다운로드')){
                $this.doDownExcel(url, $this.params, fileNm);
            }
        }
        //유효성검사
        ,isVald(chkVal,stmt){
            const $this = this;
            let stmt1 = 'DB연결ID를 선택하세요';
            let stmt2 = ' 대상이 없습니다';
            let smtm3 = '테이블을 선택하세요'

            let returnSmtm = stmt1;

            if(typeof chkVal != 'string'){
                returnSmtm = stmt + stmt2 
            }else if(ValdUtil.isNotNull(stmt) && stmt == 'tblId'){
                returnSmtm = smtm3;
            }else if(stmt=='DB연결ID'){

            }else{
                returnSmtm = stmt + stmt2;
            }

            if(ValdUtil.isNull(chkVal) || chkVal.length == 0){
                $this.alert(returnSmtm);
                return false;
            }
            return true;
        }
       //공통버튼(초기화,조회,저장)
       ,onSetButtonClick(div){
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.reset();
                    break;
                case 'select':
                    $this.searcListTblBase(true);
                    break;
                case 'save':
                    $this.saveTblSpec();
                    break;
                default:
                    break;
            }
        } 
    }
   ,mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>
