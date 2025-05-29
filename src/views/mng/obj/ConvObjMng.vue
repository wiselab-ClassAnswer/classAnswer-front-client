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
                        <h2 class="essn wd-60 ib">전환버전</h2>
                        <select class="c-wd-60" ref="convVer" v-model="srchParam.convVer" @change="chngSrchParam()">
                            <option value = ''></option>
                            <option v-for="el in code.convVerList" :key="el.colId" :value="el.colId">{{el.colId}}</option>
                        </select>
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-55 ib">DB연결ID</h2>
                        <select class="c-wd-55" ref="dbConnId" v-model="srchParam.dbConnId" @change="chngSrchParam()">
                            <option value = ''></option>
                            <option v-for="el in code.dbConnIdList" :key="el.colId" :value="el.colId">{{el.colId + ' | ' +el.colNm}}</option>
                        </select>
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-55 ib">전환항목</h2>
                        <select class="c-wd-55" ref="dbConnId" v-model="srchParam.citmCd" @change="chngSrchParam()">
                            <option value = ''></option>
                            <option v-for="el in code.citmList" :key="el.colId" :value="el.colId">{{el.colId + ' | ' +el.colNm}}</option>
                        </select>
                    </div>
                    <div class="w-30">
                        <h2 class="wd-70 ib">이행대상여부</h2>
                        <label :value="el.cdVal" v-for ="el in code.citmStatCdList" :key="el">
                            <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="srchParam.citmStatCd" style="top:2px; left:-3px;" @change="chngSrchParam()">
                            <p :class="el.cdVal === '' ?'pointer ib wd-30' : 'pointer ib wd-65'">{{ el.cdVal === '' ? '전체' : el.cdNm }}</p>
                        </label>
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="false" :showDelete="false" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>
        <!-- 이행셋 목록 -->
        <div class="section sectionL w-70">
            <div class="section-wrap">
                <h2 class="w-20 ib">전환대상추정목록</h2>
                <div class="t-a-r btn-group-box">
                    <button class="btn-normal ib" @click="getMetaData()">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                        <p class="ib">메타정보가져오기</p>
                    </button>  
                    <button class="btn-normal ib" @click="popUpPage('ChasStatSrch')">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'magnifying-glass']" />
                        <p class="ib">전환대상가져오기</p>
                    </button>  
                    <button class="btn-normal ib" @click="popUpPage('ColMapp')">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'magnifying-glass']" />
                        <p class="ib">전환대상수기지정</p>
                    </button>  
                    <button class="btn-normal ib" @click="convObjCnfm()">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                        <p class="ib">전환대상확정</p>
                    </button>  
                    <button class="btn-normal ib" @click="convObjdelete()">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                        <p class="ib">전환대상삭제</p>
                    </button>  
                    <button class="btn-normal ib" @click="CmonUtil.setPageLink('O1065')">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'up-right-from-square']" />
                        <p class="ib">전환대상추적현황</p>
                    </button>  
                    <button class="btn-exel-download" @click="downloadExcel()">
                        <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                        <p>다운로드</p>
                    </button>    
                </div>
                <div class="wrapper-content">
                    <Grid ref="ConvObj" :dataParams="srchParam" :paging='true'></Grid>
                </div>
            </div>
        </div>        
        <!-- 데이터 참조 -->
        <div class="section sectionR w-30">
            <div class="section-wrap w-100 p-t-15">
                <div class="section-part part1">
                    <h2 class="ib">데이터 참조</h2>
                    <div class="btn-group-box">
                        <div class="w-50 ib">
                            <label>
                                <input type="checkbox" class="wd-20 ha p-rl" true-value="Y" false-value="N" v-model="dataRef.decYn" style="top:2px; left: -3px;" :disabled="dataRef.rowData.ecdcYn !='Y'"> 
                                <span class="wd-60 m-r-0 ib">복호화 적용</span>
                            </label>
                        </div>
                        <div class="w-50 ib">
                            <button class="btn-normal ib" @click="searchListDataRef()">
                                <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                                <p class="ib">샘플조회</p>
                            </button>  
                        </div>
                    </div>
                    <div class="w-100 m-b-5">
                        <div class="w-60 ib">
                             <span class="wd-60 t-a-r p-r-5 m-0">컬럼ID</span>
                            <input class="c-wd-60" type="text" :value="!ValdUtil.isEmptyJson(dataRef.rowData) ? dataRef.rowData.colId : ''" disabled/>
                        </div>
                        <div class="w-40 ib">
                            <span class="wd-60 t-a-r p-r-5 m-0">조회건수</span>
                            <select class="c-wd-60 t-a-r" v-model="dataRef.dataCnt">
                                <option value=""></option>
                                <option v-for="el in cntList" :key="el" :value="el">{{el+' 건'}}</option>
                            </select>
                        </div>    
                    </div>
                </div>
                <div class="wrapper-content">
                    <Grid ref="DataRef" :dataParams = "dataRef" :paging='false'></Grid>
                </div>
            </div>
        </div>
        <ColEcdcSet ref="ColEcdcSet"     :dataParams = "dataRef"   @research   = "searchListConvMappStnd"/>
        <ColMapp ref="ColMapp"           :dataParams = "srchParam" @selectList = "setReturnData"/>
        <ChasStatSrch ref="ChasStatSrch" :dataParams = "srchParam" @selectList = "setReturnData"/>
    </div>
</template>
<script>
import { inject,reactive }  from 'vue'
import { ValdUtil }         from '@/utils/ValdUtil.js'
import { DateUtil }         from '@/utils/DateUtil.js'
import { CmonUtil }         from '@/utils/CmonUtil.js'
import { GridUtil }         from '@/utils/GridUtil.js'
import Grid                 from '@/components/grid/Grid.vue'
import SetButton            from '@/components/SetButton.vue'
import ColEcdcSet           from '@/views/mng/obj/ColEcdcSet.vue'
import ColMapp              from '@/views/mng/obj/ColMapp.vue'
import ChasStatSrch         from '@/views/mng/obj/ChasStatSrch.vue'

export default {
    components: {
        Grid
       ,SetButton
       ,ColEcdcSet
       ,ColMapp
       ,ChasStatSrch
    }
    ,setup(){
        const getCmonCdList = inject('getCmonCdList');

        let code = reactive({
            citmStatCdList: [],
            convVerList   : [],
            citmList      : [],
            dbConnIdList  : []

        });
        
        //전환상태조회
        getCmonCdList('CITM_STAT_CD', code.citmStatCdList, 'Y', null);
        
        //전환버전조회
        const getColIdNmList = inject('getColIdNmList');
        const convVerData = {  'tblId'  :'tdm.tm_info_conv_stnd'
                                ,'colId'  :'conv_ver'
                                ,'colNm'  :'conv_ver_desc'
                                ,'where' : [{
                                    'andCol' : '1'
                                    ,'andCalc': '='
                                    ,'andVal' : '1'
                                }]
                                ,'orderby' : [
                                {'orderCol' : 'conv_ver'}
                                  ]
        };  
        getColIdNmList(convVerData, code.convVerList, 'N', null);

        //전환항목조회
        const citmData = {  'tblId'  :'tdm.tm_citm_base'
                            ,'colId'  :'citm_cd'
                            ,'colNm'  :'citm_nm'
                            ,'where' : [{
                                'andCol' : 'fltr_val'
                                ,'andCalc': '='
                                ,'andVal' : "'REPR'"
                            }]
                            ,'orderby' : [
                                {'orderCol' : 'sort_ord'}
                            ]
        };  
        getColIdNmList(citmData, code.citmList, 'N', null);
        
        //DB연결ID조회
        const colIdNmDbConnIdData = {  'tblId'  :'te_db_conn_info'
                                        ,'colId'  :'db_conn_id'
                                        ,'colNm'  :'db_conn_nm'
                                        ,'where'  : [
                                            { 'andCol' :'db_type_cd'
                                            ,'andCalc':'='
                                            ,'andVal' :"'ORG'"}
                                        ]
                                        ,'orderby' : [
                                            {'orderCol' : 'db_conn_id'}
                                            ,{'orderCol' : 'db_conn_nm'}
                                        ]
        };  
        getColIdNmList(colIdNmDbConnIdData, code.dbConnIdList, 'N', null);

        return {
            code
        }
    }
    ,data: function() {
		return {
            //검색조건
            srchParam:{
                convVer:''    //전환버전
               ,dbConnId:''   //DB연결ID
               ,citmCd:''     //전환항목코드                
               ,citmStatCd:'' //전환상태코드
            }
            //데이터참조
            ,dataRef:{
                rowData:''
               ,dataCnt:30
               ,decYn:'N'
            }
            ,cntList:[30,50,100,300,500]
            ,selectGridRowId:''   //setSelectiong 용도
        }
    }
    ,methods: {
        init() {
            this.resetData(this.srchParam);
            this.resetData(this.dataRef);

            this.clearListCitmMapp();
            this.clearListDataRef();

            this.initGrid();
            this.initData();
            this.dataRef.dataCnt = 30;
            this.selectGridRowId = '';
            CmonUtil.setFocus(this.$refs.convVer);
        }
        ,initData(){
            let $this = this;
            let data = CmonUtil.getPageLink('O1060');
            if(!$this.ValdUtil.isEmptyJson(data)){
                $this.srchParam.citmCd   = data['citmCd'];
                $this.srchParam.convVer  = data['convVer'];
                $this.srchParam.dbConnId = data['dbConnId'];
            }
            if(ValdUtil.isNotNull($this.srchParam.convVer)){
                $this.searchListConvMappStnd();
            }
        }
        //그리드 생성
        ,initGrid(){
            const $this = this;
            let gridDataCitmMapp = {
                url : '/mng/obj/convObjMng/selectListConvMappStnd.hb',
                colModels : [
                    {name:'convVer'    ,label:'전환버전'       ,hidden:true}
                   ,{name:'citmCd'     ,label:'전환항목코드'   ,hidden:true}
                   ,{name:'encForm'    ,label:'암호화형식'     ,hidden:true}
                   ,{name:'decForm'    ,label:'복호화형식'     ,hidden:true}
                   ,{name:'ecdcMethCd' ,label:'암복호화방식코드',hidden:true}
                   ,{name:'citmStatCd' ,label:'확인상태'       ,hidden:true}
                   ,{name:'dbConnId'   ,label:'DB연결ID'      ,width:15  ,align:'center'}
                   ,{name:'schId'      ,label:'스키마ID'      ,width:13  ,align:'center'}
                   ,{name:'tblId'      ,label:'테이블ID'      ,width:25  ,align:'left'}
                   ,{name:'tblNm'      ,label:'테이블명'      ,width:25  ,align:'left'}
                   ,{name:'colId'      ,label:'컬럼ID'        ,width:20  ,align:'left'}
                   ,{name:'colNm'      ,label:'컬럼명'        ,width:20  ,align:'left'}
                   ,{name:'citmNm'     ,label:'전환항목'      ,width:15  ,align:'left'}
                   ,{name:'citmStatNm' ,label:'확인상태'      ,width:13  ,align:'center'}
                   ,{name:'ecdcYn'     ,label:'암복호화여부'  ,width:13  ,align:'center'}
                   ,{name:'specInfo'   ,label:'암복호화내용'  ,width:13  ,align:'center', formatter(){return'<button>상세보기</button>'}}
                ]
               ,options: {
                     multiselect : true
                    ,onCellSelect(rowid, icol, val ,e){
                        $this.dataRef.rowData = $(this).jqGrid('getRowData',rowid);
                        let colNm             = $(this).jqGrid('getGridParam', 'colModel')[icol].name;
                        // 상세조회 버튼 클릭
                        if (e && e.target.tagName == 'BUTTON') {
                            if(colNm == 'specInfo'){
                                $this.popUpPage('ColEcdcSet');
                            }
                        }else{
                            $this.clearListDataRef();
                            $this.dataRef.decYn = $this.dataRef.rowData.ecdcYn;
                        }
                        $this.selectGridRowId = rowid;
                    }
                    ,beforeSelectRow(rowid, e) {
                        //체크박스 외 행 클릭 시 체크 방지
                        let iCol = $.jgrid.getCellIndex($(e.target).closest('td')[0]);
                        let cm   = $(this).jqGrid('getGridParam', 'colModel');
                        return (cm[iCol].name == 'cb');
                    } 
                    ,gridComplete(){
                        if(ValdUtil.isNotNull($this.selectGridRowId)){
                            $(this).jqGrid('setSelection',$this.selectGridRowId);
                        }
                    }
                }                
            }
            $this.$refs.ConvObj.init(gridDataCitmMapp);

            let gridDataDataRef = {
                url : '/mng/obj/convObjMng/searchListDataRef.hb',
                colModels : [
                    {name:'smplVal'     ,label:'샘플 값'     ,width:15  ,align:'left' ,sortable: true}
                ]
               ,options: {
                    height:580
                    ,loadonce:true
                    ,gridComplete(){
                    }
                }                
            }
            $this.$refs.DataRef.init(gridDataDataRef);
        }
        //조회 전환항목 추정목록 
        ,searchListConvMappStnd(div) {
            if(div!='save'){
                this.selectGridRowId = '';
            }
            this.clearListDataRef();
            this.resetData(this.dataRef);
            this.dataRef.dataCnt = 30;
            if(ValdUtil.srchValdNull(this.srchParam.convVer,'전환버전','slct')){
                this.$refs.ConvObj.selectList(true);
            }
        }
        //조회 데이터참조
        ,searchListDataRef() {
            if(!ValdUtil.srchValdNull(this.srchParam.convVer,'전환버전','slct')) return false;
            if(ValdUtil.isEmptyJson(this.dataRef.rowData)){
                this.alert("전환대상추정목록중 조회 대상을 선택하세요");
                return false;
            }
            this.dataRef.dataCnt = ValdUtil.isNull(this.dataRef.dataCnt) ?  30 : this.dataRef.dataCnt;
            this.$refs.DataRef.selectList();
        }
        //전환버전선택
        ,chngSrchParam(){
            this.clearListCitmMapp();
            if(!ValdUtil.isNull(this.srchParam.convVer)){
                this.searchListConvMappStnd();
            }
        }

        //전환대상 확정
        ,convObjCnfm(){
            const $this = this;
            if($this.dataValid('cnfm')){
                $this.confirm({
                    content: '확정하시겠습니까?'
                    ,callback:{
                        yes(){
                            let params = {}
                            params['convVer'] = $this.srchParam.convVer;
                            params['convObjList'] = GridUtil.getCheckedList($this.$refs.ConvObj.getGridObj());;
                            params['citmStatCd'] = 'CNFM';

                            $this.doPost('/mng/obj/convObjMng/updateConvObjCnfm.hb',params).then(function(res){
                                if(res.data.rtnCd == '0000'){
                                    $this.alert('확정되었습니다').then((result)=>{
                                        if(result.isConfirmed){
                                            $this.searchListConvMappStnd('save');
                                        }
                                    })
                                }else{
                                    $this.alert(res.data.rtnMsg);
                                }
                            });          
                        }
                    }
                }); 
            }   
        }

        //전환대상 삭제
        ,convObjdelete(){
            const $this = this;
            if($this.dataValid('delete')){
                $this.confirm({
                    content: '삭제하시겠습니까?'
                    ,callback:{
                        yes(){
                            let params = {}
                            params['convVer'] = $this.srchParam.convVer;
                            params['convObjList'] = GridUtil.getCheckedList($this.$refs.ConvObj.getGridObj());;

                            $this.doPost('/mng/obj/convObjMng/deleteConvObj.hb',params).then(function(res){
                                if(res.data.rtnCd == '0000'){
                                    $this.alert('삭제되었습니다').then((result)=>{
                                        if(result.isConfirmed){
                                            $this.searchListConvMappStnd();
                                        }
                                    })
                                }else{
                                    $this.alert(res.data.rtnMsg);
                                }
                            });
                        }
                    }
                });
            }
        }
        //메타정보가져오기
        ,getMetaData(){
            const $this = this;
            if(ValdUtil.srchValdNull(this.srchParam.convVer, '전환버전', 'slct')){
                $this.confirm({
                    content: '메타 정보를 가져오기를 요청하시겠습니까?</br>최대 5분가량 소요될 수 있습니다'
                    ,callback:{
                        yes(){
                            $this.doPost('/mng/obj/convObjMng/getMetaData.hb',$this.srchParam).then(function(res){
                                if(res.data.rtnCd == '0000'){
                                    $this.alert('요청되었습니다').then((result)=>{
                                        if(result.isConfirmed){
                                            $this.searchListConvMappStnd();
                                        }
                                    });
                                }else{
                                    $this.alert(res.data.rtnMsg).then((result)=>{
                                        if(result.isConfirmed){
                                            $this.searchListConvMappStnd();
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        }
        //팝업
        ,popUpPage(div){
            if(div=='ColMapp' || div=='ChasStatSrch' ){
                if(!ValdUtil.srchValdNull(this.srchParam.convVer, '전환버전', 'slct')) return false;
            }
            this.$refs[div].show();
            this.$refs[div].initData();
        }

        //팝업데이터 리턴
        ,setReturnData(returnList){
            const $this = this;
            $this.saveConvObjMng(returnList,'INFD');
        }
        //리턴데이터 저장
        ,saveConvObjMng(returnList,citmStatCd){
            const $this = this;
            let params = {}
            params['convVer'] = $this.srchParam.convVer;
            params['convObjList'] = returnList;
            params['citmStatCd'] = citmStatCd;
        
            $this.doPost('/mng/obj/convObjMng/saveConvObjMng.hb',params).then(function(res){
                if(res.data.rtnCd == '0000'){
                    $this.searchListConvMappStnd();
                }else{
                    $this.alert(res.data.rtnMsg);
                }
            });
        }
        //저장,삭제 시 유효성 검증
        ,dataValid(div){
            
            if(!ValdUtil.srchValdNull(this.srchParam.convVer, '전환버전', 'slct')) return false;

            let stmt = div =='cnfm' ? '확정' : '삭제'
            let tblRowData = GridUtil.getCheckedList(this.$refs.ConvObj.getGridObj());
            if(ValdUtil.isEmptyList(tblRowData)) {
                this.alert( stmt + "대상을 선택해주세요");
                return false;
            }
            return true;
        }

        //초기화 전환항목 추정목록 
        ,clearListCitmMapp() {
            const $this = this;
            $this.$refs.ConvObj.clearGridData();
        }

        //초기화 데이터참조 
        ,clearListDataRef() {
            const $this = this;
            $this.$refs.DataRef.clearGridData();
        }

        //데이터 리셋
        ,resetData(val){
            for(let key in val){
                val[key] = ''
            }
        }

        //전환대상추정목록  엑셀다운로드
        ,downloadExcel(){
            let $this = this;
            let gridObj = this.$refs.ConvObj.getGridObj();
            let data = gridObj.jqGrid('getRowData');
            if(!ValdUtil.isEmptyList(data)){
                let fileNm ='전환대상추정목록_'+DateUtil.getCurrDate('YYYYMMDD')+'.xlsx';
                $this.doDownExcel('/mng/obj/convObjMng/downloadExcel.hb', $this.srchParam, fileNm)
            }else{
                $this.alert('엑셀다운로드 대상이 없습니다')
            }    
        }
        //공통버튼(초기화,조회,저장,삭제)
        ,onSetButtonClick(div){
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.init();
                    break;
                case 'select':
                    $this.searchListConvMappStnd();
                    break;
                case 'save':
                    $this.saveCset();
                    break;
                case 'delete':
                    $this.deleteCset();
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
