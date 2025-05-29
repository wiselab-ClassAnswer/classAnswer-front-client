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
                        <select ref="csetNo" class="c-wd-50 ib" v-model="srchParam.csetNo" @change="changeCset()">
                            <option value = ''></option>
                                <option v-for="el in csetList" :key="el.colId" :value="el.colId">{{el.colId + ' | ' +el.colNm}}</option>
                        </select>                    
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-40 ib">검색어</h2>
                        <input class="c-wd-40 ib" type="text" v-model="srchParam.srchWord" v-on:keyup.enter="changeCset()">
                    </div>
                    <div class="w-20 ib">
                        <h2 class="wd-65 ib">미완료 조회</h2>
                        <div class="m-r-10 ib">
                            <label>
                                <input class="p-rl" style="top:1px;" type="checkbox" true-value="N" false-value="" v-model="srchParam.tblMappYn" @change="changeCset()">
                                <p style="color:#333">테이블</p>
                            </label>
                        </div>
                        <div class="m-r-15 ib">
                            <label>
                                <input class="p-rl" style="top:1px;" type="checkbox" true-value="N" false-value="" v-model="srchParam.colMappYn" @change="changeCset()">
                                <p style="color:#333">컬럼</p>
                            </label>
                        </div>
                        <div class="m-r-15 ib">
                            <label>
                                <input class="p-rl" style="top:1px;" type="checkbox" true-value="N" false-value="" v-model="srchParam.unitJobYn" @change="changeCset()">
                                <p style="color:#333">단위작업</p>
                            </label>
                        </div>
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="false" :showDelete="false" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>
        <!-- 테이블매핑 -->
        <div class="section section4">
            <div class="section-wrap"  style="height:78.5vh !important">
                <h2 class="ib wd-80">테이블매핑</h2>
                <div class="ib">
                    <span class="w-100 guidTextBlue">*현재전환버전 :&nbsp;{{srchParam.convVer}} </span>
                </div>
                <div class="t-a-r btn-group-box p-rl" style="top:-5px;">
                    <!-- <div class="ib wd-330">
                        <p class="wd-50 ib f-12 m-r-10">전환버전</p>
                        <select ref="convVer" class="c-wd-55 f-12 h-27" v-model="convVer">
                            <option value = ''></option>
                            <option v-for="el in convVerFltList" :key="el.colId" :value="el.colId">{{el.colId +" | "+ el.colNm}}</option>
                        </select>
                    </div>
                    <button class="btn-normal ib p-r-10 p-l-10" @click="chngConvVer()">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                        <p class="ib">전환버전변경</p>
                    </button>   -->
                    <button class="btn-normal ib" @click="popUpPage('TblSrch')">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'magnifying-glass']" />
                        <p class="ib">수기지정매핑</p>
                    </button>  
                    <button class="btn-normal ib" @click="saveTblColMapp()">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                        <p class="ib">동일일괄매핑</p>
                    </button>  
                    <button class="btn-normal ib" @click="saveTblMapp()">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                        <p class="ib m-r-2">테이블매핑저장</p>
                    </button>
                    <button class="btn-exel-download" @click="downloadExcel('TblMapp')">
                        <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                        <p>다운로드</p>
                    </button>    
                </div>
                <div class="wrapper-content p-rl" style="top:-2px;">
                    <Grid ref="TblMapp" :dataParams="srchParam" :paging=true></Grid>
                </div>

                <!-- 컬럼매핑 -->
                <div class="w-65 ib m-t-10">
                    <h2 class="ib wd-100 p-rl" style="top:7px">컬럼매핑</h2>
                    <div class="ib c-wd-100 t-a-r btn-group-box">
                        <button class="btn-normal ib p-rl" style="top:2px;" @click="popUpPage('ColSrch')">
                            <font-awesome-icon class="ib m-r-5" :icon="['fas', 'magnifying-glass']" />
                            <p class="ib">수기지정매핑</p>
                        </button>  
                        <button class="btn-normal ib p-rl" style="top:2px;" @click="saveColMapp()">
                            <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                            <p class="ib m-r-2">컬럼매핑저장</p>
                        </button>
                        <button class="btn-exel-download p-rl" style="top:6px;" @click="downloadExcel('ColMapp')">
                            <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                            <p>다운로드</p>
                        </button>    
                    </div>
                    <div class="wrapper-content">
                        <Grid ref="ColMapp" :dataParams="tblGridRowData" :paging=false></Grid>
                    </div>    
                </div>
                <div class="w-35 f-r ib">
                    <div class="w-65 p-l-10 ib section-part part1 f-r m-t-10">
                        <h2 class="m-t-7 w-20 ib">매핑산식</h2>
                        <div class="w-80 ib btn-group-box t-a-r">
                            <button class="btn-normal wd-100 ib w-35 p-rl" style="top:3px" @click="generateUnitJob()">
                                <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                                <p class="ib">단위작업생성</p>
                            </button>  
                            <button class="btn-normal wd-100 ib w-35 p-rl" style="top:3px" @click="setPageLink('O2020')">
                                <font-awesome-icon class="ib m-r-5" :icon="['fas', 'up-right-from-square']" />
                                <p class="ib">단위작업관리</p>
                            </button>  
                        </div>
                        <div class="w-100 ib text-box m-b-0 m-t-10">
                            <textarea spellcheck="false" v-if="ValdUtil.isEmptyList(mappParam.colList)" class="w-100 p-rl" style="height:268px; top:-12px;" cols="30" rows="10" :disabled="ValdUtil.isNull(mappParam.colList)"></textarea>
                            <textarea spellcheck="false" v-else class="w-100 p-rl" v-model="mappParam.colList[(mappParam.colGridRowid-1)]['convStmt']" style="height:268px; top:-12px;" cols="30" rows="10" :disabled="ValdUtil.isNull(mappParam.colList)"></textarea>
                        </div>
                    </div>
                    <div class="w-35 p-l-10 ib section-part part1 f-r m-t-10">
                        <h2 class="m-t-7 w-100 ib">참조문장</h2>
                        <div class="w-100 ib text-box m-b-0 m-t-10">
                            <textarea spellcheck="false" v-if="ValdUtil.isEmptyList(mappParam.colList)" class="w-100 p-rl" style="height:80px; top:-10px;" cols="30" rows="10" :disabled="ValdUtil.isNull(mappParam.colList)"></textarea>
                            <textarea spellcheck="false" v-else class="w-100 p-rl" v-model="mappParam.colList[(mappParam.colGridRowid-1)]['refrStmt']" style="height:80px; top:-10px;" cols="30" rows="10" :disabled="ValdUtil.isNull(mappParam.colList)"></textarea>
                        </div>
                        <h2 class="m-t-0">비고</h2>
                        <div class="w-100 text-box">
                            <textarea spellcheck="false" v-if="ValdUtil.isEmptyList(mappParam.colList)" class="w-100" style="height:120px" cols="30" rows="10" :disabled="ValdUtil.isNull(mappParam.colList)"></textarea>
                            <textarea spellcheck="false" v-else class="w-100" v-model="mappParam.colList[(mappParam.colGridRowid-1)]['rmrk']" style="height:120px" cols="30" rows="10" :disabled="ValdUtil.isNull(mappParam.colList)"></textarea>
                        </div>
                        <div class="w-100">
                            <label class="w-100">
                                <input class="w-10 p-rl" v-if="ValdUtil.isEmptyList(mappParam.colList)" style="top:2px; height:14px;" type="checkbox" true-value="Y" false-value="N">
                                <input class="w-10 p-rl" v-else style="top:2px; height:14px;" type="checkbox" true-value="Y" false-value="N" v-model="mappParam.colList[(mappParam.colGridRowid-1)]['manuUpdtYn']">
                                <span class="w-90 m-r-0 p-l-3" style="color:#333">수기수정 여부 (산식,참조,비고)</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ColSrch ref="ColSrch" :dataParams="mappParam" @selectCol="returnColData"/> 
        <TblSrch ref="TblSrch" :dataParams="mappParam" @selectTbl="returnTblData"/> 
    </div>
</template>
<script>
import { inject,reactive } from 'vue'
import { ValdUtil }        from '@/utils/ValdUtil.js'
import { DateUtil }        from '@/utils/DateUtil.js'
import { CmonUtil }        from '@/utils/CmonUtil'
import Grid                from '@/components/grid/Grid.vue'
import SetButton           from '@/components/SetButton.vue'
import TblSrch             from '@/views/mng/obj/TblSrch.vue'
import ColSrch             from '@/views/mng/obj/ColSrch.vue'

export default {
    components: {
        Grid
       ,SetButton
       ,TblSrch
       ,ColSrch
    }
    ,setup(){        
        const getColIdNmList = inject('getColIdNmList');
        //이행셋조회        
        const csetListData = {  'tblId'  :'tdm.tm_cset_base'
                                  ,'colId'  :'cset_no,conv_ver,db_conn_id_fr,db_conn_id_to'
                                  ,'colNm'  :'cset_nm'
                                  ,'where'  : [
                                  ]
                                  ,'orderby' : [
                                    {'orderCol' : 'cset_no'}
                                  ]
        };  
        const csetList = reactive([]);
        getColIdNmList(csetListData, csetList, 'N', null);
        
        //전환버전조회
        const convVerList = reactive([]);        
        const convVerData = {  'tblId'  :'tdm.tm_info_conv_stnd'
                                ,'colId'  :'conv_ver,db_conn_id'
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
        getColIdNmList(convVerData, convVerList, 'N', null);

        return {
            csetList
            ,convVerList
        }
    },
    data() {
        return {
            //검색조건
            srchParam:{
                csetNo:''     //이행셋_번호
               ,convVer:''    //전환버전
               ,orgnDbConnId:'' //DB연결ID(Fr)
               ,targDbConnId:'' //DB연결ID(To)
               ,srchWord:''   //검색어
               ,tblMappYn:''  //테이블매핑미완료여부
               ,colMappYn:''  //컬럼매핑미완료여부
               ,unitJobYn:''  //단위작업매핑미완료여부
            }
            //매핑
            ,mappParam:{
                colList:[]     //컬럼매핑저장 리스트
                ,tblGridRowid:''
                ,colGridRowid:''
            }
            ,tblGridRowData:{} //테이블rowData(컬럼매핑그리드 조회, 팝업호출용)
            ,convVerFltList:[]
            ,convVer:''        //복제 전환버전 
            ,selectGridRowId:''   //setSelectiong 용도
        }
    },
    methods: {
        init() {
            CmonUtil.setFocus(this.$refs.csetNo);
            this.resetData(this.srchParam);
            this.resetData(this.mappParam);
            this.clearListTblMapp();
            this.clearListColMapp();
            this.initGrid();
            this.tblGridRowData = {};
            this.convVer = '';
            this.convListFlt();
            this.selectGridRowId = '';
        }
        //그리드 생성
        ,initGrid(){
            const $this = this;
            //테이블매핑
            let gridDataTblMapp = {
                url : '/mng/obj/migObjMapp/selectListTblMappBase.hb',
                colModels : [
                    {name:'tblMappNo'    ,label:'테이블매핑번호'   ,hidden:true                }
                    ,{name:'targDbConnId' ,label:'DB연결ID(TO-BE)' ,hidden:true               }
                    ,{name:'orgnDbConnId' ,label:'DB연결ID(AS-IS)' ,hidden:true               }
                    ,{name:'targSchId'    ,label:'스키마ID(TO-BE)' ,width:6   ,align:'center' }
                    ,{name:'targTblId'    ,label:'테이블ID(TO-BE)' ,width:14  ,align:'left'   }
                    ,{name:'targTblNm'    ,label:'테이블명(TO-BE)' ,width:14  ,align:'left'   }
                    ,{name:'orgnSchId'    ,label:'스키마ID(AS-IS)' ,width:6   ,align:'center' }
                    ,{name:'orgnTblId'    ,label:'테이블ID(AS-IS)' ,width:14  ,align:'left'   }
                    ,{name:'orgnTblNm'    ,label:'테이블명(AS-IS)' ,width:14  ,align:'left'   }
                    ,{name:'tblMappYn'    ,label:'테이블매핑'      ,width:4   ,align:'center' }
                    ,{name:'colMappYn'    ,label:'컬럼매핑'        ,width:4   ,align:'center' }
                    ,{name:'unitJobYn'    ,label:'단위작업'        ,width:4   ,align:'center' }
                    ,{name:'rmrk'         ,label:'비고'            ,width:17  ,align:'left' ,editable : true, edittype: 'text'}

                ]
               ,options: {
                    height:270
                    ,rownumbers:true
                    ,cellEdit: true
                    ,cellsubmit : "clientArray"
                    ,beforeSelectRow(rowid){
                        $(this).jqGrid('resetSelection');
                    }
                    ,onCellSelect(rowid,icol,val,e){
                        $this.mappParam.tblGridRowid = rowid;
                        $this.mappParam.colGridRowid = 1;
                        $this.selectGridRowId = rowid;

                        let params = $(this).jqGrid('getRowData',rowid);
                        $this.tblGridRowData['tblMappNo']  = params.tblMappNo;
                        $this.tblGridRowData['targDbConnId'] = params.targDbConnId;
                        $this.tblGridRowData['targSchId']  = params.targSchId;
                        $this.tblGridRowData['targTblId']  = params.targTblId;
                        $this.tblGridRowData['orgnDbConnId'] = $this.srchParam.orgnDbConnId;
                        $this.tblGridRowData['orgnSchId']  = params.orgnSchId;
                        $this.tblGridRowData['orgnTblId']  = params.orgnTblId;

                        $this.clearListColMapp();
                        $this.selectListColMapp();
                    }
                    ,afterEditCell : function (rowid , colname , val, iRow, iCol){
                        $('#'+ rowid + '_' + colname).blur(function(e){
                            $('#'+$this.$refs.TblMapp.getGridId()).jqGrid('saveCell',iRow, iCol);
                        });
                    }
                    ,gridComplete(){
                        if($this.ValdUtil.isNotNull($this.selectGridRowId)){
                            $(this).jqGrid('setSelection',$this.selectGridRowId);
                        }else{
                            $(this).jqGrid("resetSelection");
                        }
                    }
                }                
            }
            $this.$nextTick(function(){
                $this.$refs.TblMapp.init(gridDataTblMapp);
                $this.$refs.TblMapp.getGridObj().jqGrid('destroyGroupHeader');
                $this.$refs.TblMapp.getGridObj().jqGrid('setGroupHeaders', {
                    useColSpanStyle: true,
                    groupHeaders:[
                        { startColumnName: 'targSchId', numberOfColumns: 3, titleText: '<center>' + 'TO-BE' + '</center>' }
                        ,{ startColumnName: 'orgnSchId', numberOfColumns: 3, titleText: '<center>' + 'AS-IS' + '</center>' }
                    ]
                });
            });
            
            let header = null;
            //컬럼매핑
            let gridDataColMapp = {
                url : '/mng/obj/migObjMapp/selectListColMappBase.hb',
                colModels : [
                    {name:'convVer'      ,label:'전환버전'        ,hidden:true }
                   ,{name:'tblMappNo'    ,label:'테이블매핑번호'  ,hidden:true }
                   ,{name:'colMappSeq'   ,label:'컬럼매핑순번'    ,hidden:true }
                   ,{name:'convStmt'     ,label:'전환문장'       ,hidden:true  }
                   ,{name:'refrStmt'     ,label:'참조문장'       ,hidden:true  }
                   ,{name:'rmrk'         ,label:'비고'           ,hidden:true  }
                   ,{name:'citmCd'       ,label:'전환방법코드'    ,hidden:true }
                   ,{name:'orgnDbConnId' ,label:'DB연결ID(AS-IS)',hidden:true }
                   ,{name:'orgnSchId'    ,label:'스키마ID(AS-IS)',hidden:true }
                   ,{name:'orgnTblId'    ,label:'테이블ID(AS-IS)',hidden:true }
                   ,{name:'targDbConnId' ,label:'DB연결ID(TO-BE)',hidden:true }
                   ,{name:'targSchId'    ,label:'스키마ID(TO-BE)',hidden:true }
                   ,{name:'targTblId'    ,label:'테이블ID(TO-BE)',hidden:true }
                   ,{name:'targColId'    ,label:'컬럼ID'         ,width:10  ,align:'left'    ,sortable:false }
                   ,{name:'targColNm'    ,label:'컬럼명'         ,width:10  ,align:'left'    ,sortable:false }
                   ,{name:'targDataType' ,label:'TYPE'          ,width:7    ,align:'center'  ,sortable:false }
                   ,{name:'targNullYn'   ,label:'NULL'          ,width:3    ,align:'center'  ,sortable:false }
                   ,{name:'targPkYn'     ,label:'PK'            ,width:3    ,align:'center'  ,sortable:false }
                   ,{name:'orgnColId'    ,label:'컬럼ID'        ,width:10   ,align:'left'     ,sortable:false }
                   ,{name:'orgnColNm'    ,label:'컬럼명'        ,width:10   ,align:'left'     ,sortable:false }
                   ,{name:'orgnDataType' ,label:'TYPE'          ,width:7    ,align:'center'  ,sortable:false }
                   ,{name:'orgnNullYn'   ,label:'NULL'          ,width:3    ,align:'center'  ,sortable:false }
                   ,{name:'orgnPkYn'     ,label:'PK'            ,width:3    ,align:'center'  ,sortable:false }
                   ,{name:'citmNm'       ,label:'전환방법'       ,width:7    ,align:'left'    ,sortable:false }
                   ,{name:'manuUpdtYn'   ,label:'수기<br/>수정'  ,width:3    ,align:'center'  ,sortable:false }
                ]
               ,options: {
                    height:220
                    ,loadonce: true
                    ,rownumbers:true
                    ,onSelectRow(rowid, val, e){
                        $this.mappParam.colGridRowid = rowid;
                        // $this.selectRowInfo($(this).jqGrid('getRowData', rowid).colMappSeq);
                    }
                    ,gridComplete(){
                        if($(this).jqGrid('getRowData').length > 0){
                            $this.mappParam.colList = $(this).jqGrid('getRowData');
                            console.log($this.mappParam.colList);
                            $(this).jqGrid('setSelection',$this.mappParam.colGridRowid);
                        }

                        header = $(this).parent().parent().parent().find('.ui-jqgrid-hdiv');
                    }
                }                
            }
            $this.$nextTick(function(){
                $this.$refs.ColMapp.init(gridDataColMapp);
                $this.$refs.ColMapp.getGridObj().jqGrid('destroyGroupHeader');
                $this.$refs.ColMapp.getGridObj().jqGrid('setGroupHeaders', {
                    useColSpanStyle: true,
                    groupHeaders:[
                        { startColumnName: 'targColId', numberOfColumns: 5, titleText: '<center>' + 'TO-BE' + '</center>' }
                        ,{ startColumnName: 'orgnColId', numberOfColumns: 5, titleText: '<center>' + 'AS-IS' + '</center>' }
                    ]
                });
                
                let row = header.find('.ui-jqgrid-labels.jqg-second-row-header');
                let col = row.find('[id*="manuUpdtYn"] > div')
                col.css('height', '40px');
                col.css('top'   , '1px');
            });
        },
        selectRowInfo(colMappSeq) {
            // const selRow = this.mappParam.colList.find(item => item.colMappSeq == colMappSeq);
        },
        //이행셋 변경
        async changeCset(){
            const $this = this;
            $this.convVer = '';

            if(ValdUtil.isNotNull($this.srchParam.csetNo)){
                this.csetList.forEach(el=>{
                    if(el.colId == $this.srchParam.csetNo){
                        $this.srchParam.convVer       = el.convVer;
                        $this.srchParam.orgnDbConnId  = el.dbConnIdFr;
                        $this.srchParam.targDbConnId  = el.dbConnIdTo;
                    }
                });
                $this.convListFlt();
                $this.searchListTblMappBase();
            }
        }
        //전환버전목록 필터링
        ,convListFlt(){
            this.convVer = '';
            this.convVerFltList = [];
            if(ValdUtil.isNotNull(this.srchParam.convVer)){
                this.convVerList.forEach(el=>{
                    if(el.colId != this.srchParam.convVer && ( el.dbConnId == this.srchParam.orgnDbConnId || ValdUtil.isNull(el.dbConnId) ) ){
                        this.convVerFltList.push(el);
                    }
                });
            }else{
                this.convVerFltList = this.convVerList;
            }
        },
        //전환버전변경
        chngConvVer(){
            const $this = this;
            if(!ValdUtil.srchValdNull($this.srchParam.csetNo,'이행셋','slct')) return false;
            if(!ValdUtil.srchValdNull($this.convVer,'전환버전','slct')) return false;

            $this.confirm({
                content:'매핑산식 및 관련 단위작업이 변경됩니다<br/>규칙을 변경하시겠습니까?'
                ,callback:{
                    yes(){
                        let params = _.cloneDeep($this.srchParam);
                        params['orgnConvVer'] = $this.srchParam.convVer;
                        params['convVer'] = $this.convVer;
                        $this.doPost('/mng/obj/migObjMapp/saveChngConvVer.hb', params).then(function(res){
                            if(res.data.rtnCd == '0000'){
                                $this.alert('변경되었습니다').then((result)=>{
                                    if(result.isConfirmed){
                                        $this.init();
                                    }
                                });
                            }else{
                                $this.alert(res.data.rtnMsg);
                            }
                        });
                    }
                }
            });
        },
        //조회 테이블매핑목록 
        searchListTblMappBase(div) {
            if(div!='save'){
                this.selectGridRowId = '';
            }
            this.convVer = '';
            this.convListFlt();
            this.resetData(this.mappParam);
            this.tblGridRowData = {};
            this.clearListTblMapp();
            this.clearListColMapp();

            if(ValdUtil.srchValdNull(this.srchParam.csetNo,'이행셋','slct')){
                this.selectListTblMapp();
            }
        },
        //팝업
        popUpPage(div){
            let params = {};
            let data = {};
            if(div == 'TblSrch' ){
                params['dbConnId'] = this.srchParam.orgnDbConnId;
                params['isDisable'] = true;
            }else{
                data = this.$refs.TblMapp.getGridObj().jqGrid('getRowData',this.mappParam.tblGridRowid);
                params['dbConnId'] = data.orgnDbConnId;
                params['schId'] = data.orgnSchId;
                params['tblId'] = data.orgnTblId;
                params['tblNm'] = data.orgnTblNm;
            }

            if(ValdUtil.srchValdNull(this.srchParam.csetNo,'이행셋','slct') 
            &&ValdUtil.srchValdNull(this.mappParam.tblGridRowid,'테이블','slct')){     
                if(div=='ColSrch' && ValdUtil.isNull(data.tblMappNo)){
                    this.alert("테이블 매핑 후 지정 가능합니다");
                    return false;
                }
                if(div!='ColSrch' || (div=='ColSrch' && ValdUtil.srchValdNull(this.mappParam.colGridRowid,'컬럼','slct'))){
                    this.$refs[div].show();
                    this.$refs[div].initGrid(params);
                }
            }
        },
        returnTblData(selectData) {

            const confirmOpt = {
                title: '수기지정매핑(테이블)',
                html: `${selectData.rowData.tblId} 테이블을 (재)매핑합니다.<br>수기수정된 컬럼 정보(매핑산식, 참조문장, 비고)<br>존재 시 유지하시겠습니까?`,
                showCancelButton: true,
                showDenyButton: true,
                confirmButtonColor: '#3085d6',
                denyButtonColor: '#c6313a',
                cancelButtonColor: '#5a5b5b',
                confirmButtonText: "유지",
                denyButtonText: "아니오",
                cancelButtonText: "취소",
            };

            this.$swal.fire(confirmOpt).then((result) => {
                if (result.isConfirmed) {
                    selectData.rowData.manuUpdtKeep = 'Y';
                    this.returnTblDataProc(selectData);
                } else if (result.isDenied) {
                    selectData.rowData.manuUpdtKeep = 'N';
                    this.returnTblDataProc(selectData);                    
                }
            });
        },
        //수기지정매핑(테이블팝업 정보 받기)
        async returnTblDataProc(selectData){
            const $this =  this;
            let params = $this.$refs.TblMapp.getGridObj().jqGrid('getRowData',$this.mappParam.tblGridRowid);
            
            if(!ValdUtil.isEmptyJson(selectData) && !ValdUtil.isEmptyJson(params)){
                params['orgnDbConnId'] = selectData.rowData.dbConnId;
                params['orgnSchId']    = selectData.rowData.schId;
                params['orgnTblId']    = selectData.rowData.tblId;
                params['manuUpdtKeep'] = selectData.rowData.manuUpdtKeep;
                params['csetNo']       = $this.srchParam.csetNo;
                params['convVer']      = $this.srchParam.convVer;

                await $this.doPost('/mng/obj/migObjMapp/saveDrtSlctTblMapp.hb',params).then(function(res){
                    if(res.data.rtnCd == '0000'){
                        $this.searchListTblMappBase('save');
                    }else{
                        $this.alert(res.data.rtnMsg);
                    }
                });
            }
        },
        //수기지정매핑(컬럼검색팝업 정보 받기)
        returnColData(selectData){
            const $this =  this;
            let colMappGridData = $this.$refs.ColMapp.getGridObj().jqGrid('getRowData',$this.mappParam.colGridRowid);
             
            if(ValdUtil.isNotNull(colMappGridData.targColId) 
               && ValdUtil.isNotNull(selectData.colId) 
               && ValdUtil.isNotNull($this.tblGridRowData.tblMappNo)){

                let params = colMappGridData;
                params['csetNo']       = $this.srchParam.csetNo;
                params['orgnDbConnId'] = selectData.dbConnId;
                params['orgnSchId']    = selectData.schId;
                params['orgnTblId']    = selectData.tblId;
                params['orgnColId']    = selectData.colId;
                params['convStmt']     = '';
                params['refrStmt']     = '';
                params['rmrk']         = '';

                $this.doPost('/mng/obj/migObjMapp/saveDrtSlctColMapp.hb',params).then(function(res){
                    if(res.data.rtnCd == '0000'){
                        $this.searchListTblMappBase('save');
                    }else{
                        $this.alert(res.data.rtnMsg);
                    }
                });
            }
        },
        //테이블매핑저장
        saveTblMapp()  {
            const $this = this;
            if(!ValdUtil.srchValdNull($this.srchParam.csetNo,'이행셋','slct')) return false;
            let gridDataList = $this.$refs.TblMapp.getGridObj().jqGrid('getRowData');
            let saveDataList = [];
            if(gridDataList.length == 0){
                $this.alert("저장 대상이 존재하지 않습니다");
                return false;
            }
            gridDataList.forEach(el=>{
                let data = {}
                data['tblMappNo'] = el.tblMappNo;
                data['rmrk'] = el.rmrk;
                saveDataList.push(data);
            });
            $this.confirm({
                content: '테이블매핑을 저장하시겠습니까?'
                ,callback:{
                    yes(){
                        let params = {'saveDataList':saveDataList};
                        $this.doPost('/mng/obj/migObjMapp/saveTblMapp.hb',params).then(function(res){
                            if(res.data.rtnCd == '0000'){
                                $this.alert('저장되었습니다').then((result)=>{
                                    if(result.isConfirmed){
                                        $this.searchListTblMappBase('save');
                                    }
                                })
                            }else{
                                $this.alert(res.data.rtnMsg);
                            }
                        });
                    }
                }
            });
        },
        //컬럼매핑저장
        saveColMapp()  {

            // TODO jcw 그리드 소팅하면 다 엉키게되어 있음. 실제 소팅된 그리드 내역과 우측의 참조,비고,산식의 쌍이 다름. (vue.js 에서 키값으로 반환하는 식으로 쌍을 맞춰즈는 함수를 만들어야 할듯)
            const $this = this;
            if(!ValdUtil.srchValdNull($this.srchParam.csetNo,'이행셋','slct')) return false;
            if(!ValdUtil.srchValdNull($this.mappParam.tblGridRowid,'테이블','slct')) return false;

            if($this.mappParam.colList.length == 0){
                $this.alert("저장 대상이 존재하지 않습니다");
                return false;
            }
            let saveDataList = [];
            let tblMappNo = '';
            $this.mappParam.colList.forEach((el)=>{
                let data = {}
                data['csetNo']     = $this.srchParam.csetNo;
                data['convVer']    = $this.srchParam.convVer;
                data['tblMappNo']  = el.tblMappNo;
                data['colMappSeq'] = el.colMappSeq;
                data['convStmt']   = el.convStmt;
                data['refrStmt']   = el.refrStmt;
                data['rmrk']       = el.rmrk;
                data['manuUpdtYn'] = el.manuUpdtYn;
                tblMappNo          = el.tblMappNo;
                saveDataList.push(data);
            });
            $this.confirm({
                content: '컬럼매핑을 저장하시겠습니까?'
                ,callback:{
                    yes(){
                        let params = {'saveDataList': saveDataList
                                     ,'csetNo'      : $this.srchParam.csetNo
                                     ,'convVer'     : $this.srchParam.convVer
                                     ,'tblMappNo'   : tblMappNo};
                        $this.doPost('/mng/obj/migObjMapp/saveColMapp.hb',params).then(function(res){
                            if(res.data.rtnCd == '0000'){
                                $this.alert('저장되었습니다').then((result)=>{
                                    if(result.isConfirmed){
                                        $this.searchListTblMappBase('save');
                                    }
                                })
                            }else{
                                $this.alert(res.data.rtnMsg);
                            }
                        });
                    }
                }
            });
        },
        // 동일일괄매핑
        saveTblColMapp() {            
            const $this = this;
            if(ValdUtil.srchValdNull($this.srchParam.csetNo,'이행셋','slct')){
                const confirmOpt = {
                    title: '동일일괄매핑',
                    html: `대상 테이블, 컬럼을 (재)매핑합니다.<br>수기수정된 컬럼 정보(매핑산식, 참조문장, 비고)<br>존재 시 유지하시겠습니까?`,
                    showCancelButton: true,
                    showDenyButton: true,
                    confirmButtonColor: '#3085d6',
                    denyButtonColor: '#c6313a',
                    cancelButtonColor: '#5a5b5b',
                    confirmButtonText: "유지",
                    denyButtonText: "아니오",
                    cancelButtonText: "취소",
                };
                
                this.$swal.fire(confirmOpt).then((result) => {
                    if (result.isConfirmed) {
                        this.saveTblColMappProc('Y');
                    } else if (result.isDenied) {
                        this.saveTblColMappProc('N');                    
                    }
                });
            }
        },
        saveTblColMappProc(manuUpdtKeep){
            this.srchParam.manuUpdtKeep = manuUpdtKeep;
            this.doPost('/mng/obj/migObjMapp/saveTblColMapp.hb', this.srchParam).then((res) => {
                if(res.data.rtnCd == '0000') {
                    this.alert('매핑완료되었습니다').then((result)=>{
                        if(result.isConfirmed){
                            this.searchListTblMappBase();
                        }
                    });
                } else {
                    this.alert(res.data.rtnMsg);
                }
            });
        },
        //동일일괄매핑
        // saveTblColMapp(){
        //     const $this = this;
        //     if(ValdUtil.srchValdNull($this.srchParam.csetNo,'이행셋','slct')){
        //         $this.confirm({
        //             content:'기존 데이터가 삭제됩니다<br/>진행하시겠습니까?<br/>',
        //             callback:{
        //                 yes() {
        //                     $this.doPost('/mng/obj/migObjMapp/saveTblColMapp.hb',$this.srchParam).then((res) => {
        //                         if(res.data.rtnCd == '0000') {
        //                             $this.alert('매핑완료되었습니다').then((result)=>{
        //                                 if(result.isConfirmed) {
        //                                     $this.searchListTblMappBase();
        //                                 }
        //                             });
        //                         } else {
        //                             $this.alert(res.data.rtnMsg);
        //                         }
        //                     });
        //                 }
        //             }
        //         });
        //     }
        // },
        generateUnitJob() {
            const $this = this;   

            if (!ValdUtil.srchValdNull(this.srchParam.csetNo,'이행셋','slct') ||
                !ValdUtil.srchValdNull(this.srchParam.convVer,'전환버전','slct') ||
                !ValdUtil.srchValdNull(this.mappParam.tblGridRowid,'테이블','slct')) {
                return false;
            }

            let data = this.$refs.TblMapp.getGridObj().jqGrid('getRowData',this.mappParam.tblGridRowid);  
            if (ValdUtil.isNull(data.tblMappNo)) {
                this.alert("단위작업생성은 컬럼 매핑 완료 후 가능합니다");
                return false;
            }

            let params = {};
            params['targDbConnId'] = data.targDbConnId;
            params['targSchId']    = data.targSchId;
            params['targTblId']    = data.targTblId;
            params['tblMappNo']    = data.tblMappNo;
            params['csetNo']       = this.srchParam.csetNo;
            params['convVer']      = this.srchParam.convVer;
            params['tblMappNo']    = data.tblMappNo;

            this.confirm({
                title: '단위작업생성',
                content: `${data.targTblId} 테이블의<br>기본 단위작업을 (재)생성하시겠습니까?`,
                callback: {
                    yes() {
                        $this.generateUnitJobProc(params);
                    }
                }
            });
        },
        generateUnitJobProc(params) {
            this.doPost('/mng/obj/migObjMapp/generateUnitJob.hb', params).then((res)=>{
                if (res.data.rtnCd == '0000') {
                    this.alert('단위작업생성 완료되었습니다').then((result)=>{
                        if(result.isConfirmed) {
                            this.searchListTblMappBase('save');
                        }
                    });
                } else {
                    this.alert(res.data.rtnMsg);
                }
            });
        }
        //데이터 리셋
        ,resetData(val){
            for(let key in val){
                val[key] = ''
                if(key.indexOf('List')>-1){
                    val[key] = [];
                }
            }
        }
        //조회 테이블매핑그리드
        ,selectListTblMapp() {
            this.$refs.TblMapp.selectList(true);
        }
        //조회 컬럼매핑그리드
        ,selectListColMapp() {
            this.$refs.ColMapp.selectList();
        }
        //초기화 테이블매핑
        ,clearListTblMapp() {
            this.$refs.TblMapp.clearGridData();
        }
        //초기화 컬럼매핑 
        ,clearListColMapp() {
            this.mappParam.colList = [];
            this.$refs.ColMapp.clearGridData();
        }
        //페이지 이동
        ,async setPageLink(pageNo){
            let params = {};
            params = {
                'csetNo' : this.srchParam.csetNo
                ,'srchWord' : this.$refs.TblMapp.getGridObj().jqGrid('getRowData',this.mappParam.tblGridRowid).targTblId
            }
            this.CmonUtil.setPageLink(pageNo,params);
        }
        //전환항목 추정목록  엑셀다운로드
        ,downloadExcel(div){
            let $this = this;
            let params = div =='TblMapp' ? $this.srchParam : $this.tblGridRowData;
            params['excelTrgtDiv'] = div;

            let gridObj = $this.$refs[div].getGridObj();;
            let data    = gridObj.jqGrid('getRowData');;

            if(!ValdUtil.isEmptyList(data)){
                let fileNm = div =='TblMapp' ? '테이블매핑('+$this.srchParam.csetNo+')_' : '컬럼매핑('+$this.srchParam.csetNo+')_' ;
                $this.doDownExcel('/mng/obj/migObjMapp/downloadExcel.hb', params, fileNm +DateUtil.getCurrDate('YYYYMMDD')+'.xlsx')
            }else{
                $this.alert('엑셀다운로드 대상이 없습니다')
            }    
        }
        //유효성 검증
        ,saveValid(){
            if(!ValdUtil.valdLenNull(this.detlParam.orgnDbConnId  , 100    , 'DB연결ID(FROM)은')) return false;
            if(!ValdUtil.valdLenNull(this.detlParam.targDbConnId  , 100    , 'DB연결ID(TO)은')) return false;
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
                    $this.searchListTblMappBase();
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
   ,mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>