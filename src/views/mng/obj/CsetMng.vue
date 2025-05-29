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
                        <input class="c-wd-40 ib" type="text" ref="srchWord" v-model="srchParam.srchWord" v-on:keyup.enter="searchListCset()">
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="true" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>
        <!-- 이행셋 목록 -->
        <div class="section sectionL">
            <div class="section-wrap">
                <h2 class="ib wd-100">이행셋 목록</h2>
                <div class="t-a-r btn-group-box">
                    <button class="btn-normal ib" @click="setPageLink('O2010')">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'up-right-from-square']" />
                        <p class="ib">작업셋관리</p>
                    </button>  
                    <button class="btn-normal ib" @click="setPageLink('O2030')">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'up-right-from-square']" />
                        <p class="ib">워크스페이스정의</p>
                    </button>  
                    <button class="btn-exel-download" @click="downloadExcel()">
                        <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                        <p>다운로드</p>
                    </button>    
                </div>
                <div class="wrapper-content">
                    <Grid ref="CsetList" :dataParams="srchParam" :paging='false'></Grid>
                </div>
            </div>
        </div>
        <!-- 상세정보 -->
        <div class="section sectionR">
            <div class="section-wrap p-t-22">
                <h2>이행셋 정보</h2>
                <div class="section-part part1">
                    <div class="w-100">
                        <div class="w-50 ib">
                            <span class="wd-100 essn">이행셋번호</span>
                            <input class="c-wd-100" type="text" v-model="detlParams.csetNo" :disabled="isInit">
                        </div>
                        <div class="w-50 ib">
                            <label class="w-100 p-rl" style="top:-1px; left:8px" @change="changeDfltYn()">
                                <input class="w-5 ib m-r-5 f-l h-a" type="checkbox" true-value="Y"  false-value="N" v-model="detlParams.dfltYn" >
                                <span class="w-80" style="font-size:12px">기본이행셋 여부</span>
                            </label>
                        </div>
                    </div>
                    <div class="w-100 p-b-1">
                        <div class="w-50 ib">
                            <span class="wd-100 essn">이행셋명</span>
                            <input class="c-wd-100" type="text" v-model="detlParams.csetNm">
                        </div>
                        <div class="w-50 ib">
                            <div class="w-100 ib">
                                <label class="w-100 p-rl" style="top:-1px; left:8px" >
                                    <input class="w-5 ib m-r-5 f-l h-a" style="left:-2px;" type="checkbox" true-value="Y" false-value="N" v-model="detlParams.sameStctYn" >
                                    <span class="w-80" style="font-size:12px">동일 구조 DB간 복제이행 </span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="m-t-2 p-b-1">
                        <div class="w-40 ib">
                            <div class="w-100 ib">
                                <span class="wd-100 essn">DB연결ID(FROM)</span>
                                <select class="c-wd-100" v-model="detlParams.dbConnIdFr" @change="this.selectInfoDBConnId(detlParams.dbConnIdFr,'Fr')" :disabled="saveDiv =='update'">
                                    <option value = ''></option>
                                    <option v-for="el in orgDbConnIdList" :key="el.colId" :value="el.colId">{{el.colNm}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="w-60 ib">
                            <div class="w-100 ib">
                                <input class="w-15-5 m-l-5 ib t-a-c" type="text" v-model="dbInfo.Fr['dbKindCd']" style="border-radius:2px 0px 0px 2px;" disabled>
                                <input class="w-20 ib t-a-c"   type="text" v-model="dbInfo.Fr['dbNm']" style="border-radius:0px;" disabled>
                                <input class="w-30 ib t-a-c"   type="text" v-model="dbInfo.Fr['dbIp']" style="border-radius:0px;" disabled>
                                <input class="w-13 ib t-a-c"   type="text" v-model="dbInfo.Fr['dbPort']" style="border-radius:0px 2px 2px 0px;" disabled>
                                <div class="ib btn-group-box">
                                    <button class="btn-normal w-100 ib p-rl" style="top:5px; left:-5px;" @click="setPageLink('O1040','fr')">
                                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'up-right-from-square']" />
                                        <p class="ib">테이블관리</p>
                                    </button>  
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="m-t-2">
                        <div class="w-40 ib">
                            <div class="w-100 ib">
                                <span class="wd-100 essn">DB연결ID(TO)</span>
                                <select class="c-wd-100" v-model="detlParams.dbConnIdTo" @change="this.selectInfoDBConnId(detlParams.dbConnIdTo,'To')" :disabled="saveDiv =='update'">
                                    <option value = ''></option>
                                    <option v-for="el in tdtDbConnIdList" :key="el.colId" :value="el.colId">{{el.colNm}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="w-60 ib">
                            <div class="w-100 ib">
                                <input class="w-15-5 m-l-5 ib t-a-c" type="text" v-model="dbInfo.To['dbKindCd']" style="border-radius:2px 0px 0px 2px;" disabled>
                                <input class="w-20 ib t-a-c"   type="text" v-model="dbInfo.To['dbNm']" style="border-radius:0px;" disabled>
                                <input class="w-30 ib t-a-c"   type="text" v-model="dbInfo.To['dbIp']" style="border-radius:0px;" disabled>
                                <input class="w-13 ib t-a-c"   type="text" v-model="dbInfo.To['dbPort']" style="border-radius:0px 2px 2px 0px;" disabled>
                                <div class="ib btn-group-box">
                                    <button class="btn-normal w-100 ib p-rl" style="top:5px; left:-5px;" @click="setPageLink('O1040','to')">
                                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'up-right-from-square']" />
                                        <p class="ib">테이블관리</p>
                                    </button>  
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-50 ib">
                            <span class="wd-100 essn"> 전환버전</span>
                            <select class="c-wd-100" v-model="detlParams.convVer">
                                <option value = ''></option>
                                <option v-for="item in convVerList" :key="item.colId" :value="item.colId">{{item.colId}}</option>
                            </select>
                        </div>
                        <div class="w-15 ib">
                            <div class="m-l-5">
                                <button class="btn-normal wd-100 ib p-rl" style="top:-1px;" @click="setPageLink('O1010')">
                                    <font-awesome-icon class="ib m-r-5" :icon="['fas', 'up-right-from-square']" />
                                    <p class="ib">전환규칙정의</p>
                                </button>  
                            </div>
                        </div>
                        <div class="w-35 ib">
                            <div class="m-l-5">
                                <span class="w-100 guidTextBlue">※전환버전 변경 시 사용중인 단위작업이 변경됩니다 </span>
                            </div>
                        </div>
                    </div>
                    <div class="w-100 text-box">
                        <span class="wd-100">참고사항</span>
                        <textarea spellcheck="false" class="c-wd-100" style="max-height:490px; height:490px" name="" id="" cols="30" rows="10" v-model="detlParams.rmrk"></textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { inject,reactive }  from 'vue'
import { ValdUtil }         from '@/utils/ValdUtil.js'
import { DateUtil }         from '@/utils/DateUtil.js'
import { CmonUtil }         from '@/utils/CmonUtil'
import Grid                 from '@/components/grid/Grid.vue'
import SetButton            from '@/components/SetButton.vue'
export default {
    components: {
        Grid
       ,SetButton
    },
    setup(){
        //DB연결ID_FR
        const getColIdNmList = inject('getColIdNmList');
        const colIdNmOrgDbConnIdData = {  'tblId'  :'te_db_conn_info'
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
        const orgDbConnIdList = reactive([]);
        getColIdNmList(colIdNmOrgDbConnIdData, orgDbConnIdList, 'N', null);
        
        //DB연결ID_TO
        const colIdNmTdtDbConnIdData = {  'tblId'  :'te_db_conn_info'
                                  ,'colId'  :'db_conn_id'
                                  ,'colNm'  :'db_conn_nm'
                                  ,'where'  : [
                                      { 'andCol' :'db_type_cd'
                                     ,'andCalc':'='
                                     ,'andVal' :"'TDT'"}
                                  ]
                                  ,'orderby' : [
                                      {'orderCol' : 'db_conn_id'}
                                   ,{'orderCol' : 'db_conn_nm'}
                                  ]
        };  
        const tdtDbConnIdList = reactive([]);
        getColIdNmList(colIdNmTdtDbConnIdData, tdtDbConnIdList, 'N', null);
        
        //전환버전조회
        const convVerData = {  'tblId'  :'tdm.tm_info_conv_stnd'
                                  ,'colId'  :'conv_ver,db_conn_id'
                                  ,'colNm'  :'conv_ver_desc'
                                  ,'where'  : [
                                  ]
                                  ,'orderby' : [
                                    {'orderCol' : 'conv_ver'}
                                  ]
        };  
        const convVerList = reactive([]);
        getColIdNmList(convVerData, convVerList, 'N', null);
        return {
            orgDbConnIdList
            ,tdtDbConnIdList
            ,convVerList
        }
    }
    ,data() {
      return {
            //검색조건
            srchParam:{
                srchWord: ''    //검색어
            }
            //상세정보
            ,detlParams:{
                 csetNo:''      //이행셋번호
                ,csetNm:''      //이행셋명
                ,dbConnIdFr:''  //DB연결ID_FR
                ,dbConnIdTo:''  //DB연결ID_TO
                ,sameStctYn:''  //동일구조여부
                ,dfltYn:''      //디폴트여부
                ,rmrk : ''      //비고    
                ,convVer:''     //전환버전
            }
            //상세정보(db정보)
            ,dbInfo:{
                'Fr':{'dbKindCd':''
                     ,'dbNm':''
                     ,'dbIp':''
                     ,'dbPort':''}    
                ,'To':{'dbKindCd':''
                     ,'dbNm':''
                     ,'dbIp':''
                     ,'dbPort':''}
            }
            ,initYn: true
            ,saveDiv:''
            ,orgData:''
            ,selectGridRowId:''   //setSelectiong 용도
        }
    }
    ,methods: {
        init() {
            CmonUtil.setFocus(this.$refs.srchWord);
            this.initYn = true;
            this.resetData('Fr');
            this.resetData('To');
            this.resetData(this.srchParam);
            this.resetData(this.detlParams);
            this.resetData(this.orgData);
            this.clearListCset();
            this.initGrid();
            this.saveDiv = 'insert';
            this.orgData = {};
            this.selectGridRowId = '';
        }
        //그리드 생성
       ,initGrid(){
            const $this = this;
            let gridData = {
                url : '/mng/obj/csetMng/selectListCsetBase.hb',
                colModels : [
                    {name:'dfltYn'      ,label:'고정항목여부' ,hidden: true}
                   ,{name:'csetNo'      ,label:'이행셋번호'   ,width:17  ,align:'left' ,sortable:true}
                   ,{name:'csetNm'      ,label:'이행셋명'     ,width:15  ,align:'left' ,sortable:true}
                   ,{name:'dbConnIdFr'  ,label:'DB연결ID(FR)' ,width:10  ,align:'left' ,sortable:true }
                   ,{name:'dbConnIdTo'  ,label:'DB연결ID(TO)' ,width:10  ,align:'left' ,sortable:true }
                   ,{name:'convVer'     ,label:'전환버전'     ,width:8  ,align:'left' ,sortable:true ,cellattr: function () { return 'style="color:blue;cursor:pointer;"';}}
                   ,{name:'dfltYn'      ,label:'기본여부'     ,width:5  ,align:'center' ,sortable:true , formatter: function(cellvalue) {return cellvalue =='Y' ? '○' : 'X'}}
                ]
               ,options: {
                     loadonce:true
                    ,onSelectRow(rowid, val, e){
                        $this.resetData($this.detlParams);
                        let gridData = $(this).jqGrid('getRowData',rowid);

                        $this.searchDetlInfo(gridData.csetNo,gridData.dbConnIdFr,gridData.dbConnIdTo);
                        $this.saveDiv = 'update';
                        $this.selectGridRowId = rowid;
                        $this.orgData = $(this).jqGrid('getRowData',rowid);
                    } 
                    ,onCellSelect(rowid, icol, val, e){
                        //화면이동(전환버전 선택 시 전환규칙관리
                        if(icol == 5){
                            $this.detlParams.convVer = $(this).jqGrid('getRowData',rowid).convVer;
                            $this.setPageLink('O1010');
                        }
                    }
                    ,gridComplete(){
                        console.log($this.selectGridRowId)
                        if($this.ValdUtil.isNotNull($this.selectGridRowId)){
                            $(this).jqGrid('setSelection',$this.selectGridRowId);
                        }else{
                            $(this).jqGrid("resetSelection");
                        }
                    }
                }                
            }
            $this.$refs.CsetList.init(gridData);
            //조회 이행셋목록
            $this.searchListCset();
        }
        
        //조회 이행셋목록 
        ,searchListCset(div) {
            if(div!='save'){
                this.selectGridRowId = '';
            }
            this.resetData(this.detlParams);
            this.resetData(this.orgData);
            this.resetData('Fr');
            this.resetData('To');
            this.saveDiv = 'insert';
            this.$refs.CsetList.selectList();
            this.orgData = {};
        }

        //조회 상세정보
        ,searchDetlInfo(csetNo,dbConnIdFr,dbConnIdTo) {
            const $this = this;
            let params = {'csetNo': csetNo
                         ,'dbConnIdFr': dbConnIdFr
                         ,'dbConnIdTo': dbConnIdTo
            };
            $this.doPost('/mng/obj/csetMng/selectInfoCsetSpec.hb',params).then(function(res){
                if(res.data.rtnCd == '0000'){
                    $this.detlParams = res.data.rtnData.result.csetSpec;
                    $this.dbInfo = res.data.rtnData.result.dbInfo;
                    $this.initYn = false;
                }else{  
                    $this.alert(res.data.rtnMsg);
                    $this.saveDiv = 'insert';
                }
            })
        }
        //DB연결ID 선택 시 
        ,selectInfoDBConnId(dbConnId,div) {
            const $this = this;
            $this.resetData(div);

            if(ValdUtil.isNotNull(dbConnId)){
                let dupl = $this.$refs.CsetList.getGridObj().jqGrid('getRowData').filter(el=> el.csetNo == $this.detlParams.dbConnIdFr+'_'+$this.detlParams.dbConnIdTo);
                if(!ValdUtil.isEmptyList(dupl) && $this.orgData.csetNo != $this.detlParams.dbConnIdFr+'_'+$this.detlParams.dbConnIdTo){
                    $this.detlParams['dbConnId'+div] = '';
                    $this.alert("동일한 이행셋이 존재합니다")
                    return false;
                }else{
                    //DB정보 조회
                    let params = {'dbConnId':dbConnId}
                    $this.doPost('/mng/obj/csetMng/selectInfoDBConnId.hb',params).then(function(res){
                        if(res.data.rtnCd == '0000'){
                            $this.dbInfo[div] =  res.data.rtnData.result;
                        }
                    });
                    $this.saveDiv = 'insert'
                    $this.convListFlt();
                }
            }
            
            //csetNo 생성
            let divRvs = div =='Fr' ? 'To' : 'Fr';
            let newCsetNo = '';
            if(ValdUtil.isNotNull($this.detlParams['dbConnId'+divRvs])){
                let saperator =  ValdUtil.isNotNull(dbConnId) == true ? '_' : ''
                newCsetNo = div =='Fr' ? dbConnId + saperator + $this.detlParams.dbConnIdTo : $this.detlParams.dbConnIdFr + saperator + dbConnId;
            }else{
                newCsetNo = dbConnId;
            }

            $this.detlParams.csetNo = newCsetNo;
        }
        //저장
        ,saveCset(){
            if(this.saveValid()){
                this.execSave('save');
            }
        }
        //삭제
        ,deleteCset(){
            if(ValdUtil.srchValdNull(this.detlParams.csetNo,'이행셋','slct')){     
                this.execSave('delete');
            }
        }

        //삭제,저장 실행 (div : delete,save)
        ,async execSave(div){   
            const $this = this;
            let saveDiv = '삭제';
            let url = '/mng/obj/csetMng/deleteCset.hb';

            if(div =='save'){
                saveDiv = '저장';
                url = '/mng/obj/csetMng/saveCset.hb';
            }

            //단위작업 존재 여부 확인
            let stnt = '';
            if(this.saveDiv == 'update'){
                let params = {};
                params.convVer = $this.orgData.convVer;
                params.csetNo  = $this.detlParams.csetNo;

                await $this.doPost('/mng/obj/csetMng/selectJobExecBase.hb', params).then(function(res){
                    if(res.data.rtnCd == '0000'){
                        if(res.data.rtnData.result != null){
                            if(div == 'delete'){
                                stnt = '사용중인 이행셋은 삭제할 수 없습니다';
                            }else if(div =='save' && $this.orgData.convVer != $this.detlParams.convVer){
                              stnt = '사용중인 이행셋의 전환버전을 변경할 수 없습니다';
                            }
                        }
                    }
                });
            }
            if(this.saveDiv == 'update' && ValdUtil.isNotNull(stnt)){
                $this.alert(stnt);
                return false;
            }
            $this.confirm({
                content: stnt + saveDiv + '하시겠습니까?'
                ,callback:{
                    yes(){
                        $this.detlParams['convVerChngYn'] = 'N';
                        $this.detlParams['orgnConvVer'] = $this.orgData.convVer;
                        $this.detlParams['saveDiv'] = $this.saveDiv;
                        if(div =='save' && $this.saveDiv == 'update' && $this.orgData.convVer != $this.detlParams.convVer){
                            $this.detlParams['convVerChngYn'] = 'Y';
                        }
                        $this.doPost(url, $this.detlParams).then(function(res){
                            if(res.data.rtnCd == '0000'){
                                $this.alert(saveDiv+'되었습니다').then((result)=>{
                                    if(result.isConfirmed){
                                        $this.searchListCset('save');
                                    }
                                })
                            }else{
                                $this.alert(res.data.rtnMsg).then((result)=>{
                                    if(result.isConfirmed){
                                        $this.searchListCset('save');
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
        //기본 이행셋 여부 변경
        ,changeDfltYn(){            
            let dfltCset = this.$refs.CsetList.getGridObj().jqGrid('getRowData').filter(el=> el.dfltYn =='○');
            if(dfltCset[0].csetNo == this.detlParams.csetNo && this.detlParams.dfltYn =='N'){
                this.detlParams.dfltYn ='Y'
                this.alert('기본 이행셋을 해지할 수 없습니다');
                return false;
            }
            if((this.saveDiv == 'insert' && this.detlParams.dfltYn =='Y' ) || (this.saveDiv == 'update' &&( this.orgData['dfltYn'] != this.detlParams.dfltYn))){
                this.alert('기본 이행셋이 변경됩니다')
            }
        }
        //데이터 리셋
        ,resetData(val){
            if(val == 'Fr' || val == 'To' ){
                this.dbInfo[val] = {'dbKindCd':''
                                ,'dbNm':''
                                ,'dbIp':''
                                ,'dbPort':''}    
            }else{
                for(let key in val){
                    val[key] = ''
                    if(key == 'sameStctYn' || key =='dfltYn'){
                        val[key] = 'N'
                    }
                }
            }
        }
        //페이지 이동
        ,setPageLink(pageNo,frToDiv){
            let params = null;

            //작업셋관리,워크스페이스정의
            if(pageNo =='O2010' || pageNo =='O2030'){
                params = ValdUtil.isNotNull(this.detlParams.csetNo) ? {'csetNo' : this.detlParams.csetNo} : null;
            }            
            //테이블관리
            if(pageNo == 'O1040'){
                let dbConnId = '';
                frToDiv =='fr' ? dbConnId = this.detlParams.dbConnIdFr : this.detlParams.dbConnIdTo;
                params = ValdUtil.isNotNull(dbConnId) ? {'dbConnId' : dbConnId} : null;
            }
            //전환규칙
            if(pageNo == 'O1010'){
                this.ValdUtil.isNotNull(this.detlParams.convVer) ? params = {'convVer': this.detlParams.convVer} : '';
            }
            CmonUtil.setPageLink(pageNo,params);            
        }
        //초기화 이행셋목록 
        ,clearListCset() {
            const $this = this;
            $this.$refs.CsetList.clearGridData();
        }
        //이행셋목록 엑셀다운로드
        ,downloadExcel(){
            let $this = this;
            let gridObj = this.$refs.CsetList.getGridObj();
            let data = gridObj.jqGrid('getRowData');
            if(!ValdUtil.isEmptyList(data)){
                let fileNm ='이행셋목록_'+DateUtil.getCurrDate('YYYYMMDD')+'.xlsx';
                $this.doDownExcel('/mng/obj/csetMng/downloadExcel.hb', $this.srchParam, fileNm)
            }else{
                $this.alert('엑셀다운로드 대상이 없습니다')
            }    
        }
        //유효성 검증
        ,saveValid(){
            if(!ValdUtil.valdLenNull(this.detlParams.csetNo      , 100    , '이행셋번호는')) return false;
            if(!ValdUtil.valdLenNull(this.detlParams.csetNm      , 100    , '이행셋명은')) return false;
            if(!ValdUtil.valdLenNull(this.detlParams.dbConnIdFr  , 100    , 'DB연결ID(FROM)은')) return false;
            if(!ValdUtil.valdLenNull(this.detlParams.dbConnIdTo  , 100    , 'DB연결ID(TO)은')) return false;
            if(!ValdUtil.valdLenNull(this.detlParams.convVer     , 10     , '전환버전은')) return false;
            return true;
        }
       //공통버튼(초기화,조회,저장,삭제)
       ,onSetButtonClick(div){
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.init();
                    break;
                case 'select':
                    $this.searchListCset();
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
   ,computed: {
        isInit: function() {
            return !this.initYn;
        }
    }
   ,mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>
