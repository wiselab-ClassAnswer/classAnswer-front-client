<template>
    <Modal ref="baseModal" :width="35">
        <div class="section-wrap">
            <h2>테이블 검색</h2>
            <div class="section-wrap">
                <div class="section-part part1">
                    <div class="w-100">          
                        <div class="m-b-5 w-100">
                            <span class="wd-70 essn">DB연결ID</span>
                            <input v-if="params.isDisable == true" type="text" v-model="params.dbConnId" disabled>
                            <select v-else ref="dbConnId" class="c-wd-70" v-model="params.dbConnId" @change="searchListTbl(true)" :disabled="params.isDisable">
                                <option value = ''></option>
                                <option v-for="el in dbConnIdList" :key="el.colId" :value="el.colId">{{el.colId + ' | ' +el.colNm}}</option>
                            </select>
                        </div>
                        <div class="w-86 ib m-r-5">
                            <span class="wd-70">검색어</span>
                            <input class="c-wd-70" type="text" v-model="params.srchWord" v-on:keyup.enter="searchListTbl(true)">
                        </div>
                        <div class="w-10 ib t-a-r">
                            <button class="btn-normal" @click="searchListTbl(true)">조회</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="b m-t-20">
            <!-- 그리드 -->
            <Grid ref="tblSrchGrid" :dataParams="params" :paging=true></Grid>
        </div>
        <div class="button-box1 m-t-20">
            <button class="btn-normal m-r-5 p-l-20 p-r-20" @click="selectBtn()" >선택</button>
            <button class="btn-normal p-l-20 p-r-20" @click="cancel">닫기</button>
        </div>
    </Modal>
</template>
<script>
import { inject,ref,reactive } from 'vue'
import Grid                    from '@/components/grid/Grid.vue'
import Modal                   from '@/components/dialog/modal.vue'
import { ValdUtil }            from '@/utils/ValdUtil.js'

export default {
    name: "confirm-dialog"
   ,components: {
        Modal
       ,Grid
    }
   ,props:{
        dataParams:{
            type   : Object,
            default:{}
        }  
    }
   ,setup() {
        const baseModal = ref(null);

        const show = () => {
            baseModal.value.open();
        }
        const cancel = () => {
            baseModal.value.close();
        }
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

        return {
            baseModal
           ,show
           ,confirm
           ,cancel
           ,dbConnIdList
           ,colIdNmDbConnIdData
        }
    },
    data() {
        return {
            params:{
                dbConnId: '' //DB연결ID
                ,orgnDbConnId : ''
                ,targDbConnId : ''
                ,srchWord: '' //검색어
                ,rowData : ''
                ,isDisable: false
                ,gridOptDiv : ''
                ,convVer:''
            }
        }
    },
    methods: {
        init() {
            const $this = this;
            $this.reset();
            // if($this.$props.dataParams.gridOptDiv === 'convDataCmpr'){
            //     $this.params.dbConnId = $this.$props.dataParams.orgnDbConnId;
            // } else {
            $this.params.dbConnId = $this.$props.dataParams.dbConnId;
            // }
            $this.CmonUtil.setFocus(this.$refs.dbConnId);
        }
        //그리드 생성
       ,initGrid(data){
            const $this = this;
            let url = '/mng/obj/tblSrch/selectListTblList.hb';            
            if(ValdUtil.isNotNull(data)){
                $this.params.gridOptDiv = data.gridOptDiv;
                if(data.gridOptDiv === 'convDataCmpr'){
                    $this.params.dbConnId     = data.orgnDbConnId;
                    $this.params.targDbConnId = data.targDbConnId;
                    $this.params.csetNo       = data.csetNo;
                    $this.params.isDisable    = data.isDisable;
                    url = '/mng/obj/tblSrch/selectListConvDataTblList.hb';
                } else if(data.gridOptDiv === 'unitJobMng') {
                    url = '/mng/obj/tblSrch/selectListTblMapp.hb';
                    $this.params.isDisable    = data.isDisable;
                    $this.params.dbConnId     = data.dbConnId;
                    $this.params.convVer      = data.convVer;
                }else{
                    $this.params.dbConnId     = data.dbConnId;
                    $this.params.srchWord     = data.srchWord;
                    $this.params.isDisable    = data.isDisable;
                }
            }
            let tblBaseListData={
                url:url,
                colModels:[
                    {name:'schId'        ,label:'스키마'          ,width:20    ,align:'center'}
                   ,{name:'tblId'        ,label:'테이블ID'        ,width:50    ,align:'left'  }
                   ,{name:'tblNm'        ,label:'테이블명'        ,width:50    ,align:'left'  }
                   ,{name:'dbConnId'     ,label:'DB연결ID'        ,width:50    ,align:'left'  ,hidden : true}
                   ,{name:'dbConnNm'     ,label:'DB연결명'        ,width:50    ,align:'left'  ,hidden : true}
                   ,{name:'orgnDbConnId' ,hidden: true}
                   ,{name:'orgnSchId'    ,hidden: true}
                   ,{name:'orgnTblId'    ,hidden: true}
                   ,{name:'tblMappNo'    ,hidden: true}
                   ]
               ,options:{
                    onSelectRow(rowid, val, e){
                        $this.params.rowData = $(this).jqGrid('getRowData',rowid)
                    }
                    ,ondblClickRow(id,colId,val){
                        $this.params.rowData = $(this).jqGrid('getRowData',id)
                        $this.selectBtn();
                    } 
                }
                
            }   
            if(ValdUtil.isNotNull(data)){
                if(data.gridOptDiv === 'convDataCmpr'){
                    tblBaseListData.colModels.push({name:'targDbConnId' ,label:'타겟DB연결ID'    ,width:50    ,align:'left'  })
                }
            }
            this.$nextTick(function(){
                $this.$refs.tblSrchGrid.init(tblBaseListData);
                if(ValdUtil.isNotNull($this.params.dbConnId)){
                    $this.searchListTbl();
                }
            });
        }
        //조회  테이블목록
       ,searchListTbl(){
            const $this = this;
            if($this.isVald($this.params.dbConnId,'DB연결ID')){
                $this.$refs.tblSrchGrid.selectList(true);
                $this.params.rowData = '';
            }
       }
       //버튼 선택
       ,selectBtn(){
            const $this = this;     
            if($this.params.rowData.length == 0){
                this.alert("선택된 대상이 없습니다")
                return false;
            }
            $this.$emit('selectTbl',$this.params);
            $this.cancel();
       }
       ,reset(){
            const $this = this;
            $this.params.dbConnId = ''; //DB연결ID
            $this.params.srchWord = ''; //검색어
            $this.params.rowData = '';
            $this.params.isDisable = false;
            $this.CmonUtil.setFocus(this.$refs.dbConnId);
       }
       //유효성 검사
       ,isVald(chkVal,stmt){
            const $this = this;
            let returnSmtm = '';
            let stmt1 = '을 선택하세요';

            returnSmtm = stmt + stmt1;

            if(ValdUtil.isNull(chkVal) || chkVal.length == 0){
                $this.alert(returnSmtm);
                return false;
            }
            return true;
        }
    }
   ,mounted(){
        const $this = this;
        $this.init();
   }
}
</script>