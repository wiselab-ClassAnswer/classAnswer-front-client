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
                        <h2 class="essn wd-60 ib">등록기간</h2>
                        <div class="c-wd-60 ib">
                            <BetweenDatePicker :frDt="srchParam.strtDt" :toDt="srchParam.endDt" @onSelected="onSelectBetweenDate"></BetweenDatepicker>    
                        </div>
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-40 ib">검색어</h2>
                        <input class="c-wd-40 ib" ref="srchWord" type="text" v-model="srchParam.srchWord" v-on:keyup.enter="searchListChas()">
                    </div>
                    <div class="w-35 ib">
                        <label v-for="el in code.jobStatCdList" :key="el">
                            <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="srchParam.jobStatCd" style="top:2px; left:-3px;" @change="searchListChas()">
                            <p :class="el.cdVal === '' ?'pointer ib wd-30' : 'pointer ib wd-50'">{{ el.cdVal === '' ? '전체' : el.cdNm }}</p> 
                        </label>
                    </div>                    
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="false" :showDelete="false" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>
        <!-- 추적목록 -->
        <div class="section sectionL w-40">
            <div class="section-wrap">
                <h2 class="ib m-b-0">추적목록</h2>
                <div class="btn-group-box">
                    <button class="btn-normal ib" @click="setPageLink('O1060')">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'up-right-from-square']" />
                        <p class="ib">전환대상관리</p>
                    </button>  
                    <button class="btn-exel-download"  @click="downloadExcel('ChasList')" >
                        <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                        <p>다운로드</p>
                    </button>      
                </div>
                <!-- 그리드 -->
                <div class="wrapper-content">
                    <Grid ref="ChasList" :dataParams="srchParam" :paging='false'></Grid>
                </div>
            </div>
        </div>
        <!-- 상세정보 -->
        <div class="section sectionR w-60">
            <div class="section-wrap">
                <!-- 추적기준 -->
                <div class="section-part part1">
                    <div class="w-100">
                        <h2 class="ib m-b-0">추적기준</h2>
                        <div class="btn-group-box">
                            <button class="btn-normal w-50 m-r-5" @click="popup()" :disabled="chasStnd.chasNo ==''">
                                <font-awesome-icon class="ib m-r-10" :icon="['fas', 'expand']" />
                                <p class="ib">결과보기</p>
                            </button> 
                            <button v-if="(chasStnd.jobStatCd == '30' || chasStnd.jobStatCd == '31' || chasStnd.jobStatCd == '40') && chasStnd.chasNo != '' " class="btn-nomal m-r-5" @click="chasRstrt()">재시작</button>
                            <button class="btn-nomal" @click="chasStrt()">추적시작</button>
                            <button class="btn-nomal m-l-5" @click="chasStop()">추적중지</button>
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-100 m-b-5">
                            <!--
                            <div class="w-50 ib">
                                <span class="wd-80 t-a-r">추적번호</span>
                                <input class="c-wd-80" type="text" v-model="chasStnd.chasNo" disabled>
                            </div>
                            -->
                            <div class="w-65 ib">
                                <span class="wd-80 essn t-a-r">추적내용</span>
                                <input class="c-wd-120" type="text" v-model="chasStnd.chasDesc" :disabled="!(chasStnd.chasNo =='' || chasStrtQlfc)">
                            </div>
                            <div class="w-35 ib ">
                                <span class="wd-80 ib t-a-r">추적상태</span>
                                <select class="c-wd-80" v-model="chasStnd.jobStatCd" disabled="true" >
                                    <option value = ''></option>
                                    <option v-for="el in code.jobStatCdList" :key="el.cdVal" :value="el.cdVal">{{el.cdNm}}</option>
                                </select>   
                                <!--
                                <div class="c-wd-80 ib" style="height:30px;">
                                    <p v-if="chasStnd.jobStatCd == ''  " class="rstrCase1 p-l-5 p-t-8 ib">{{'미등록'}}</p>
                                    <p v-if="chasStnd.jobStatCd == '10'" class="rstrCase2 p-l-5 p-t-8 ib">{{'실행예정'}}</p>
                                    <p v-if="chasStnd.jobStatCd == '20'" class="rstrCase3 p-l-5 p-t-8 ib">{{'실행중'}}</p>
                                    <p v-if="chasStnd.jobStatCd == '30'" class="rstrCase5 p-l-5 p-t-8 ib">{{'오류정지'}}</p>
                                    <p v-if="chasStnd.jobStatCd == '31'" class="rstrCase5 p-l-5 p-t-8 ib">{{'강제중단'}}</p>
                                    <p v-if="chasStnd.jobStatCd == '40'" class="rstrCase4 p-l-5 p-t-8 ib">{{'정상완료'}}</p>
                                </div>
                                -->
                            </div>
                        </div>
                        <div class="w-100 m-b-5">
                            
                            <div class="w-25 ib">
                                <span class="wd-80 essn t-a-r">텍스트만추적</span>
                                <div class="c-wd-80 ib">
                                    <label>
                                        <input type="radio" class="ha p-rl wd-20" value="Y" v-model="chasStnd.textOnlyYn" style="top:2px; left:-3px;" :disabled="!(chasStnd.chasNo =='' || chasStrtQlfc)">
                                        <span class="ib c-wd-20">예</span>
                                    </label>
                                    <label>
                                        <input type="radio" class="ha p-rl wd-20" value="N" v-model="chasStnd.textOnlyYn" style="top:2px; left:-3px;" :disabled="!(chasStnd.chasNo =='' || chasStrtQlfc)">
                                        <span class="ib c-wd-20">아니오</span>
                                    </label>
                                </div>
                            </div>
                            <div class="w-40 ib">
                                <span class="wd-80 essn t-a-r">DB연결ID</span>
                                <select class="c-wd-120" ref="dbConnId" v-model="chasStnd.dbConnId" :disabled="!(chasStnd.chasNo =='' || chasStrtQlfc)">
                                    <option value = ''></option>
                                    <option v-for="el in dbConnIdList" :key="el.colId" :value="el.colId">{{el.colId + ' | ' +el.colNm}}</option>
                                </select>   
                            </div>
                            <div class="w-35 ib">
                                <span class="wd-80 essn t-a-r">동시진행수</span>
                                <div class="c-wd-80 ib">
                                    <input class="w-100 ib t-a-r" type="text" v-model="chasStnd.threadCnt" @blur="chasStnd.threadCnt = ValdUtil.onlyStayNum(chasStnd.threadCnt,1,10)" :disabled="!(chasStnd.chasNo =='' || chasStrtQlfc)">
                                </div>
                            </div>
                        </div>
                        <div class="w-100 m-b-5">
                            <div class="w-100 m-b-5">
                                <div class="w-25 ib">
                                    <span class="wd-80 essn t-a-r">샘플링추적</span>
                                    <div class="c-wd-80 ib">
                                        <label>
                                            <input type="radio" class="ha p-rl wd-20" value="Y" v-model="chasStnd.smplYn" style="top:2px; left:-3px;" :disabled="!(chasStnd.chasNo =='' || chasStrtQlfc)">
                                            <span class="ib c-wd-20">예</span>
                                        </label>
                                        <label>
                                            <input type="radio" class="ha p-rl wd-20" value="N" v-model="chasStnd.smplYn" style="top:2px; left:-3px;" :disabled="!(chasStnd.chasNo =='' || chasStrtQlfc)">
                                            <span class="ib c-wd-20">아니오</span>
                                        </label>
                                    </div>
                                </div>
                                <div class="w-40 ib">
                                    <span class="wd-80 essn t-a-r">샘플링건수</span>
                                    <div class="c-wd-120 ib">
                                        <input class="w-100 ib t-a-r" type="text" v-model="chasStnd.smplCnt" @blur="chasStnd.smplCnt = ValdUtil.onlyStayNum(chasStnd.smplCnt,1)" :disabled="!(chasStnd.chasNo =='' || chasStrtQlfc)">
                                    </div>
                                </div>
                                <div class="w-35 ib">
                                    <span class="wd-80 essn p-r-10 m-r-0 t-a-r" style="margin-left:10px">표현건수</span>
                                    <div class="c-wd-80 ib m-0">
                                        <input class="w-100 ib t-a-r" type="text" v-model="chasStnd.smplExprCnt" @blur="chasStnd.smplExprCnt = ValdUtil.onlyStayNum(chasStnd.smplExprCnt,1,50)" :disabled="!(chasStnd.chasNo =='' || chasStrtQlfc)">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="wrapper-content w-100 m-t-10 ib">
                    <h2 class="ib m-b-15">식별대상</h2>
                    <Grid ref="ChasIdenObj" :paging='false'></Grid>
                </div>
            </div>
        </div>
        <ConvObjChasRslt ref="ConvObjChasRslt" :dataParams="chasStnd"/>
    </div>
</template>
<script>
import { inject,reactive } from 'vue'
import { DateUtil        } from '@/utils/DateUtil.js'
import { ValdUtil        } from '@/utils/ValdUtil.js'
import { CmonUtil        } from '@/utils/CmonUtil.js'
import { GridUtil        } from '@/utils/GridUtil.js'
import SetButton           from '@/components/SetButton.vue'
import BetweenDatePicker   from '@/components/datepicker/BetweenDatepicker.vue'
import Grid                from '@/components/grid/Grid.vue'
import moment              from 'moment'
import ConvObjChasRslt     from '@/views/mng/obj/ConvObjChasRslt.vue'
export default {
    components:{
        SetButton
       ,BetweenDatePicker
       ,Grid
       ,moment
       ,ConvObjChasRslt
    }
   ,setup(){
        const getCmonCdList = inject('getCmonCdList');
        let code = reactive({
            jobStatCdList: []
        });
        getCmonCdList('JOB_STAT_CD', code.jobStatCdList, 'N', null,{'fltrVal1':'CHAS','fltrVal2':'','fltrVal3':''});

        const colIdNmDbConnIdData = { 'tblId'  :'te_db_conn_info'
                            ,'colId'  :'db_conn_id'
                            ,'colNm'  :'db_conn_nm'
                            ,'where'  : [
                                {'andCol' :'db_type_cd'
                                ,'andCalc':'='
                                ,'andVal' :"'ORG'"}
                            ]
                            ,'orderby' : [
                                {'orderCol' : 'db_conn_id'}
                                ,{'orderCol' : 'db_conn_nm'}
                            ]
        };  
        const dbConnIdList = reactive([]);
        const getDbConnList = inject('getDbConnList');
        getDbConnList(colIdNmDbConnIdData, dbConnIdList, 'N', null);

        return {
            dbConnIdList
           ,colIdNmDbConnIdData    
           ,code
        }
    }
    ,data: function() {
		return {
            srchParam:{
                strtDt:''    //시작일자
               ,endDt:''     //종료일자
               ,jobStatCd:'' //작업상태코드
               ,srchWord:''  //검색어(추적번호 or 추적내용)
            }
            ,chasStnd:{
                chasNo:''       //추적번호
               ,chasDesc:''     //추적설명
               ,dbConnId:''     //DB연결ID
               ,smplYn:''       //샘플링여부
               ,smplCnt:0       //샘플링건수
               ,smplExprCnt:0   //샘플링표현건수
               ,textOnlyYn:''   //텍스트전용여부
               ,threadCnt:0     //동시진행수
               ,objTblCnt:''    //대상테이블수
               ,cmplTblCnt:''   //완료테이블수
               ,jobStatCd:''    //작업현황코드
               ,jobStatNm:''    //작업현황명
            }
            ,idenItemList: [
                {'cd': 'rrno'    , 'nm': '주민번호'},
                {'cd': 'nm'      , 'nm': '성명'},
                {'cd': 'tel'     , 'nm': '전화번호'},
                {'cd': 'emal'    , 'nm': '이메일'},
                {'cd': 'addr'    , 'nm': '주소'},
                {'cd': 'bith'    , 'nm': '생일'},
                {'cd': 'ccrd'    , 'nm': '신용카드'},
                {'cd': 'dlic'    , 'nm': '운전면허'},
                {'cd': 'ppno'    , 'nm': '여권번호'},
                {'cd': 'ci'      , 'nm': 'CI'},
                {'cd': 'acnt'    , 'nm': '계좌'},
                {'cd': 'acntStck', 'nm': '주식계좌포함'},
                {'cd': 'acntItem', 'nm': '과목코드분석'}
            ]
            ,idenObjList: [] //식별대상리스트
            ,chasStrtQlfc : false //추적시작자격
            ,chasStopQlfc : false //추적중지자격
            ,selectGridRowId:''   //setSelectiong 용도
        }
    }
    ,methods: {
        init(){
            this.resetData(this.srchParam);
            this.resetData(this.chasStnd);
            this.$refs.ChasList.clearGridData();
            this.selectGridRowId = '';

            this.$nextTick(() => {
                this.initData();
                this.initGrid();
            });
        }
        ,initData(){ 
            this.setDate(); //날짜
            this.setData(); //기준 값
            this.setIdenList();
        }
        ,setDate(){
            this.srchParam.strtDt  = moment().add(-7, 'days').format('YYYY-MM-DD');
            this.srchParam.endDt   = this.formatDate(DateUtil.getCurrDate());
        }
        ,setData(){
            this.chasStnd = {
                chasNo:''       //추적번호
               ,chasDesc:''     //추적설명
               ,dbConnId:''     //DB연결ID
               ,smplYn:'Y'      //샘플링여부
               ,smplCnt:100     //샘플링건수
               ,smplExprCnt:5   //샘플링표현건수
               ,textOnlyYn:'Y'  //텍스트전용여부
               ,threadCnt:1     //동시진행수
               ,objTblCnt:''    //대상테이블수
               ,cmplTblCnt:''   //완료테이블수
               ,jobStatCd:''    //작업현황코드
               ,jobStatNm:''    //작업현황명
            }
        }
        ,setIdenList() {
            const $this = this;
            this.idenObjList = [] //식별대상리스트
            _.forEach(this.idenItemList, function(iden) {
                let idenYn = 'Y';
                let mtchStndRate = '75';
                let decForm = '';
                if ( iden.cd === 'acntStck' || iden.cd === 'acntItem' ) {
                    if ( iden.cd === 'acntStck' ) {
                        idenYn = 'N';
                    }
                    mtchStndRate = '0';
                    decForm      = '';
                }
                let idenObj = {
                    chasNo      : '',
                    citmDivCd   : iden.cd,
                    citmNm      : iden.nm,
                    idenYn      : idenYn,
                    mtchStndRate: mtchStndRate,
                    decForm     : decForm,
                    disabled    : "N"
                }
                $this.idenObjList.push(idenObj);
            });
        }
        ,initGrid(){
            let $this = this;
            let chasListData = {
                url:'/mng/obj/convObjChasStat/selectListChas.hb'
                ,colModels:[
                     {name:'objTblCnt'   ,label:'대상건수'         ,hidden:true}
                    ,{name:'cmplTblCnt' ,label:'완료건수'         ,hidden:true}
                    ,{name:'jobStatCd'  ,label:'추적상태'         ,hidden:true}
                    ,{name:'dbConnId'   ,label:'DB연결ID'         ,hidden:true}
                    ,{name:'chasNo'     ,label:'추적번호'         ,width:6   ,align:'center' ,sortable:true}
                    ,{name:'jobStatNm'  ,label:'추적상태'         ,width:5   ,align:'center' ,sortable:true}
                    ,{name:'procCnt'    ,label:'진행건수(Table)'  ,width:8   ,align:'center' ,sortable:true ,formatter:$this.procCnt}
                    ,{name:'prgrs'      ,label:'진행률(%)'        ,width:5   ,align:'center' ,sortable:true }
                    ,{name:'idenCnt'    ,label:'식별건수'         ,width:5   ,align:'right'  ,sortable:true ,formatter:$this.thousandComma}
                    ,{name:'chasDesc'   ,label:'추적내용'         ,width:14  ,align:'left'   ,sortable:true }
                 ]
                ,options:{
                     onSelectRow(rowid, val, e){
                        $this.chasStnd.chasNo   = $(this).jqGrid('getRowData',rowid).chasNo;
                        $this.selectGridRowId = rowid;

                        //추적기준 조회
                        $this.selectInfoChasStnd();

                        //추적항목 조회
                        $this.selectListChasSpec();
                    }
                    ,gridComplete(){
                        if($this.ValdUtil.isNotNull($this.selectGridRowId)){
                            $(this).jqGrid('setSelection',$this.selectGridRowId);
                        }
                    }
                }
            }
            $this.$refs.ChasList.init(chasListData);

            let chasIdenData = {
                url:'/mng/obj/convObjChasStat/selectListChasSpec.hb'
                ,colModels:[
                     {name:'chasNo'      ,label:'추적번호'    ,width:10 ,align: 'center' ,hidden:true}
                    ,{name:'citmDivCd'   ,label:'전환항목코드',width:10 ,align: 'center' ,hidden:true}
                    ,{name:'citmNm'      ,label:'전환항목명'  ,width:10 ,align: 'center' }
                    ,{name:'idenYn'      ,label:'식별여부'    ,width:10 ,align: 'center' 
                        ,formatter: 'checkbox' 
                        ,formatoptions: { disabled: false, value: 'Y:N' }
                        ,edittype: 'checkbox', editoptions: { value: "Y:N", defaultValue: "Y" }
                    }
                    ,{name:'mtchStndRate',label:'매치기준비율',width:10 ,align: 'right'  
                        ,formatoptions: { defaultValue: '75' }
                        ,formatter: function(cellValue, options, rowObject) {
                            if ( rowObject.citmDivCd == 'acntStck' || rowObject.citmDivCd == 'acntItem' ) {
                                return '';
                            } else {
                                return cellValue;
                            }
                        }
                        ,editable: true
                        ,edittype: 'text'
                        ,cellattr:function(rowid, value, rowObject, cm, rdata){
                            if ( rowObject.citmDivCd == 'acntStck' || rowObject.citmDivCd == 'acntItem' ) {
                                return 'class=not-editable-cell';
                            }
                        }
                    }
                    ,{name:'decForm'     ,label:'복호화형식'  ,width:40 ,align: 'left'
                        ,editable: true, edittype: 'text'
                        ,cellattr:function(rowid, value, rowObject, cm, rdata){
                            if ( rowObject.citmDivCd == 'acntStck' || rowObject.citmDivCd == 'acntItem' ) {
                                return 'class=not-editable-cell';
                            }
                        }
                    }
                ]
                ,options:{
                    height      : 420,
                    cellEdit    : true,
                    cellsubmit  : "clientArray",
                    beforeSelectRow: function(changeRowId, event) {
                        const grid = $(this);
                        let rowObject = $(this).jqGrid('getRowData', changeRowId);
                        if ( rowObject.citmDivCd === 'acnt' ) {
                            $(this).find('tr').each(function() {
                                let rowId = $(this).attr('id'); // 각 행의 ID를 가져옴
                                if ( !!rowId ) {
                                    let rowData = grid.jqGrid('getRowData', rowId); // 해당 행의 데이터를 가져옴
                                    if ( rowData.citmDivCd == 'acntStck' || rowData.citmDivCd == 'acntItem' ) {
                                        if ( rowObject.idenYn === 'N' ) {
                                            grid.jqGrid('setCell', rowId, 'idenYn', 'N');
                                        }
                                    }
                                }
                            });

                            $(this).find('tr').each(function() {
                                let rowId = $(this).attr('id'); // 각 행의 ID를 가져옴
                                if ( !!rowId ) {
                                    let rowData = grid.jqGrid('getRowData', rowId); // 해당 행의 데이터를 가져옴
                                    if ( rowData.citmDivCd == 'acntStck' || rowData.citmDivCd == 'acntItem' ) {
                                        if ( rowObject.idenYn === 'Y' ) {
                                            $(this).find('input[type="checkbox"]').prop('disabled', false); // 체크박스를 비활성화
                                        } else {
                                            $(this).find('input[type="checkbox"]').prop('disabled', true); // 체크박스를 비활성화
                                        }
                                    }
                                }
                            });
                        }
                    },
                    gridComplete: function() {
                        let grid = $(this);
                        let ids  = grid.getDataIDs();

                        for ( let i = 0 ; i < ids.length ; i++ ) {
                            grid.setRowData(ids[i], false, { height : 32 });
                        }
                    }
                }
            }
            $this.$refs.ChasIdenObj.init(chasIdenData);

            $this.searchListChas();
            // $this.$refs.ChasIdenObj.setGridData($this.idenObjList, true);
        }
        //추적목록 조회
        ,searchListChas(div){          
            if(div != 'save'){
                this.selectGridRowId = '';
            }  
            this.resetData(this.chasStnd);
            this.setData(); //기준 값
            this.setIdenList();
            this.$refs.ChasIdenObj.clearGridData();
            this.$refs.ChasIdenObj.setGridData(this.idenObjList, true);
            this.clearListChas();
            this.$refs.ChasList.selectList();
        }
        //추적기준 조회
        ,selectInfoChasStnd(chasNo){
            let $this = this;
            let params = {'chasNo':$this.chasStnd.chasNo};
            if(ValdUtil.isNotNull(chasNo)){
                params['chasNo'] = chasNo;
            }
            $this.resetData($this.chasStnd);
            $this.chasStrtQlfc = false;
            $this.chasStopQlfc = false;

            if(ValdUtil.isNotNull(params)){
                $this.doPost('/mng/obj/convObjChasStat/selectInfoChasStnd.hb',params).then(function(res){
                    if (res.data.rtnCd == '0000') {
                        let data = res.data.rtnData.result;
                        if(ValdUtil.isNotNull(data)){
                            for(let key in $this.chasStnd){
                                for(let dataKey in data){    
                                    if(key == dataKey){
                                        $this.chasStnd[key] = data[key];
                                    }
                                }
                            }
                            //'':미등록,10:실행예정, 30:오류정지,31:강제중단,40:정상완료
                            if($this.chasStnd.jobStatCd == '' || $this.chasStnd.jobStatCd == '10' || $this.chasStnd.jobStatCd == '30' || $this.chasStnd.jobStatCd == '31' || $this.chasStnd.jobStatCd == '40' ){
                                $this.chasStrtQlfc = true;
                            }
                            
                            //10:실행예정,20:실행중,
                            if($this.chasStnd.jobStatCd == '10' || $this.chasStnd.jobStatCd == '15' || $this.chasStnd.jobStatCd == '20'){
                                $this.chasStopQlfc = true;
                            }
                        }
                    }else{
                        $this.alert(res.data.rtnMsg);
                    }
                });
            }else{
                $this.alert("추적번호가 존재하지 않습니다")
            }       
        }
        // 추적상세 조회
        ,selectListChasSpec() {
            const $this = this;

            let params = {
                'chasNo': this.chasStnd.chasNo
            };
            
            this.doPost('/mng/obj/convObjChasStat/selectListChasSpec.hb', params).then(function(res){
                if (res.data.rtnCd == '0000') {
                    $this.idenObjList = [];
                    _.forEach($this.idenItemList, function(item) {
                        const data = _.find(res.data.rtnData.result, function(row) {
                            return item.cd === row.citmDivCd;
                        });

                        let disabled = "N";
                        if ( data.citmCd == 'acntStck' || data.citmCd == 'acntItem' ) {
                            if ( _.some(idenObjList, function(iden) { return iden.citmCd === 'acnt' && iden.idenYn === 'N'; }) ) {
                                disabled = "Y"
                            }
                        }

                        let idenObj = {
                            chasNo      : data.chasNo,
                            citmDivCd   : data.citmDivCd,
                            citmNm      : item.nm,
                            idenYn      : data.idenYn,
                            mtchStndRate: data.mtchStndRate,
                            decForm     : data.decForm,
                            disabled    : disabled
                        }
                        $this.idenObjList.push(idenObj);
                        $this.$refs.ChasIdenObj.clearGridData();
                        $this.$refs.ChasIdenObj.setGridData($this.idenObjList, true);
                    });
                }else{
                    $this.alert(res.data.rtnMsg);
                }
            });
        }
        //추적목록 초기화
        ,clearListChas(){
            this.$refs.ChasList.clearGridData();
        }
        //추적시작(저장)
        ,chasStrt(){
            let $this = this;
            
            //'':미등록,30:오류정지,31:강제중단,40:정상완료
            if ( $this.chasStnd.jobStatCd == '' ||  $this.chasStnd.jobStatCd == '10' || $this.chasStnd.jobStatCd == '30' || $this.chasStnd.jobStatCd == '31' || $this.chasStnd.jobStatCd == '40' ){
                $this.chasStrtQlfc = true;
            }
            
            if ( !$this.chasStrtQlfc ) {
                $this.alert("추적시작은 추적상태가 [ 미등록, 실행예정, 강제중단, 정상완료 ] 중</br>하나에 해당되는 경우 가능합니다");
                return false;
            }
            let contentStmt = '추적작업을 시작하시겠습니까?';
            if ( $this.chasStnd.jobStatCd != '' && $this.chasStnd.jobStatCd != '10' ){
                contentStmt = '추적작업을 시작하시겠습니까? <br/>새로운 추적번호로 작업이 생성됩니다'
            }
            
            if ( $this.saveValid() ) {
                $this.confirm({
                     content: contentStmt
                    ,callback: {
                        yes: function () {
                            GridUtil.gridCancelEdit($this.$refs.ChasIdenObj.getGridObj());
                            const idenList = $this.$refs.ChasIdenObj.getGridData();

                            const params = {
                                chasBase: $this.chasStnd,
                                chasSpec: idenList
                            }

                            $this.doPost("/mng/obj/convObjChasStat/saveChasBase.hb", params).then(function(res){                        
                                if(res.data.rtnCd =='0000'){
                                    $this.alert('시작되었습니다.').then((result) =>{
                                        if( result.isConfirmed){
                                            $this.searchListChas('save');
                                        }
                                    });
                                }else{
                                    $this.alert(res.data.rtnMsg);                        
                                }
                            });
                        }
                        ,no: function(){
                            $this.chasStrtQlfc = false;
                        }
                    }
                });
            }
        }
        //추적재시작
        ,chasRstrt(){
            let $this = this;
            
            //chasNo가 널이 아니고 30:오류정지,31:강제중단,40:정상완료 인 경우
            if(ValdUtil.isNotNull($this.chasStnd.chasNo) && ($this.chasStnd.jobStatCd == '30' || $this.chasStnd.jobStatCd == '31' || $this.chasStnd.jobStatCd == '40' )){
                if($this.saveValid()){
                    $this.confirm({
                        content: '재시작하시겠습니까?<br/>재시작 시 기존 추적결과 데이터가 사라집니다'
                        ,callback: {
                            yes: function () {
                                
                                GridUtil.gridCancelEdit($this.$refs.ChasIdenObj.getGridObj());
                                const idenList = $this.$refs.ChasIdenObj.getGridData();

                                const params = {
                                    chasBase: $this.chasStnd,
                                    chasSpec: idenList
                                }
                                $this.doPost("/mng/obj/convObjChasStat/saveRstrtChasBase.hb", params).then(function(res){                        
                                    if(res.data.rtnCd =='0000'){
                                        $this.alert('재시작되었습니다.').then((result) =>{
                                            if( result.isConfirmed){
                                                $this.searchListChas('save');
                                            }
                                        });
                                    }else{
                                        $this.alert(res.data.rtnMsg);                        
                                    }
                                });
                            }
                        }
                    });
                }
            }else{
                $this.alert("재시작은 추적상태가 [ 오류정지, 강제중단, 정상완료 ] 중</br>하나에 해당되는 경우 가능합니다");
            }
        }
        //추적중지
        ,chasStop(){
            let $this = this;
            let params = this.chasStnd;
            if($this.chasStnd.chasNo == ''){
                $this.alert("추적중지 대상이 없습니다");
                return false;
            }
            if(!$this.chasStopQlfc){
                $this.alert("추적중지는 추적상태가 [ 실행예정, 실행중 ] 중</br>하나에 해당되는 경우 가능합니다");
                return false;
            }
            $this.confirm({
                content: '추적을 중지하시겠습니까?'
                ,callback: {
                    yes: function () {
                        $this.doPost("/mng/obj/convObjChasStat/updateChasStop.hb", params).then(function(res){                        
                            if(res.data.rtnCd =='0000'){
                                $this.alert('중지되었습니다.').then((result) =>{
                                    if( result.isConfirmed){
                                        $this.searchListChas();
                                    }
                                });
                            }else{
                                $this.alert(res.data.rtnMsg);                        
                            }
                        });
                    }
                }
            });
        }
        //Grid Formatter
        ,procCnt(cellValue, options, rowObject){
            let cmplTblCnt = 0;
            let objTblCnt = 0;
            if(ValdUtil.isNotNull(rowObject.cmplTblCnt)){
                cmplTblCnt = CmonUtil.addThousandComma(rowObject.cmplTblCnt)
            }
            if(ValdUtil.isNotNull(rowObject.objTblCnt)){
                objTblCnt = CmonUtil.addThousandComma(rowObject.objTblCnt);
            }
            return cmplTblCnt + "/" + objTblCnt;
        }      
        //페이지 이동
        ,setPageLink(pageNo){
            CmonUtil.setPageLink(pageNo);
        }
        //크게보기
        ,popup(){
            this.$refs.ConvObjChasRslt.show();
            this.$refs.ConvObjChasRslt.init();
            this.$refs.ConvObjChasRslt.initGrid(this.chasStnd);
        }
        //등록기간 선택
        ,onSelectBetweenDate(date) {
            this.srchParam.strtDt = date.frDt;
            this.srchParam.endDt  = date.toDt;
        }
        //데이터 리셋
        ,resetData(val){
            for(let key in val){
                val[key] = '';
            }
        }
        //유효성 검증
        ,saveValid(){
            if(!ValdUtil.valdLenNull(this.chasStnd.chasDesc, 500    , '추적내용은')) return false;
            if(!ValdUtil.valdLenNull(this.chasStnd.dbConnId, 100    , 'DB연결ID는')) return false;
            return true;
        }
        //추적목록 엑셀다운로드 div : ChasList,
        ,downloadExcel(div){
            let $this = this;
            let params = div =='ChasList' ? $this.srchParam : $this.chasStnd;
            params['excelTrgtDiv'] = div;

            let gridObj = $this.$refs[div].getGridObj();;
            let data    = gridObj.jqGrid('getRowData');;

            if(!ValdUtil.isEmptyList(data)){
                let fileNm = div =='ChasList' ? '추적목록_' : '추적결과_' ;
                $this.doDownExcel('/mng/obj/convObjChasStat/downloadExcel.hb', params, fileNm +DateUtil.getCurrDate('YYYYMMDD')+'.xlsx')
            }else{
                $this.alert('엑셀다운로드 대상이 없습니다')
            }    
        }
        //셋버튼(초기화, 조회)
        ,onSetButtonClick (div) {            
            switch ( div ) {
                case 'init':
                    this.init();
                    break;
                case 'select':
                    this.searchListChas();
                    break;
                default:
                    this.alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
        }
    }
    ,mounted(){
        this.init()
    }
}
</script>

<style scoped>
.section-wrap .section-part .ui-jqgrid-btable input[type="checkbox"] {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 1px solid #d1d1dd;
    border-radius: 3px;
    padding: 0 5px;
    font-size: 12px;
    font-weight: 400;
}
.section-wrap .section-part .ui-jqgrid-btable input[type="text"] {
    display: inline-block;
    width: 20px;
    height: 30px;
    border: 1px solid #d1d1dd;
    border-radius: 3px;
    padding: 0 5px;
    font-size: 12px;
    font-weight: 400;
}
</style>