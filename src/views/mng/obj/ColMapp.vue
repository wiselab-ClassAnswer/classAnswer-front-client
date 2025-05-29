<template>
    <Modal ref="baseModal" :width="50">
        <div class="section-wrap w-100 f-l ib m-b-20">
            <h2>테이블정보</h2>
            <div class="section-part part1">
                <div class="w-100">
                    <div class="ib w-50 p-r-10">
                        <div class="wd-70 ib">
                            <span class="w-100 essn">DB연결ID</span>
                        </div>
                        <div class="c-wd-70 ib">
                            <select class="w-100" v-model="params.dbConnId" @change="searchListTbl('slct')">
                                <option value = ''></option>
                                <option v-for="el in dbConnIdList" :key="el.colId" :value="el.colId">{{el.colId + ' | ' +el.colNm}}</option>
                            </select>
                        </div>
                    </div>
                    <div class="w-50 ib">
                        <div class="w-86 ib m-0">
                            <div class="wd-60 ib">
                                <span class="w-100">검색어</span>
                            </div>
                            <div class="c-wd-50 ib m-0">
                                <input class="w-100" type="text" v-model="params.srchWord" @keyup.enter="searchListTbl()" :disabled="ValdUtil.isNull(params.dbConnId)">
                            </div>
                        </div>
                        <div class="w-14 ib t-a-r p-rl p-l-5" style="top:-1px">
                            <button class="btn-normal w-100" @click="searchListTbl()" :disabled="ValdUtil.isNull(params.dbConnId)">조회</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="b m-t-5">
                <Grid ref="TblGrid" :dataParams="params" :paging=true></Grid>
            </div>
        </div>
        <div class="button-box1 w-100 m-t-30">
            <button class="btn-normal m-r-5 p-l-20 p-r-20" @click="selectBtn()" >선택</button>
            <button class="btn-normal p-l-20 p-r-20" @click="cancel">닫기</button>
        </div>
    </Modal>
</template>
<script>
import { inject, reactive, ref }  from 'vue'
import Grid            from '@/components/grid/Grid.vue'
import Modal           from '@/components/dialog/modal.vue'
import { GridUtil }     from '@/utils/GridUtil.js'
import { ValdUtil }     from '@/utils/ValdUtil.js'

export default {
    name: "confirm-dialog",
    components: {
        Modal
        ,Grid
        ,GridUtil
        ,ValdUtil
    }
    ,props:{
      dataParams:{
        type: Object,
        default:{}
      }  
    }
   ,setup() {
        const getColIdNmList = inject('getColIdNmList');

        //전환항목조회
        const citmData = {  'tblId'  :'tdm.tm_citm_base'
                            ,'colId' :'citm_cd'
                            ,'colNm' :'citm_nm'
                            ,'where' : [{
                                'andCol' : 'fltr_val',
                                'andCalc': '=',
                                'andVal' : "'REPR'"
                            }]
                            ,'orderby' : [
                            {'orderCol' : 'sort_ord'}
                            ]
        };  
        const citmList = reactive([]);
        getColIdNmList(citmData, citmList, 'Y', null);

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
        const dbConnIdList = reactive([]);
        getColIdNmList(colIdNmDbConnIdData, dbConnIdList, 'N', null);


        const baseModal = ref(null);

        const show = () => {
            baseModal.value.open();
        }
        const cancel = () => {
            baseModal.value.close();
        }
        return {
            baseModal
           ,show
           ,cancel
           ,citmList
           ,dbConnIdList
        }
    }
    ,data() {
        return {
            params:{
                srchWord:''
                ,dbConnId:''
            }
        }
    }
    ,methods: {
        init(){
        } 
        ,initData(){
            this.resetData(this.params);
            this.initGrid();

            this.$nextTick(function(){
                this.params.dbConnId = this.$props.dataParams.dbConnId;
                if(ValdUtil.isNotNull(this.$props.dataParams.dbConnId)){
                    this.searchListTbl();
                }
            });
        }
        ,initGrid(){
            const $this = this;
            let tblGridData ={
                url : '/mng/obj/colMapp/selecetListTblBase.hb',
                colModels : [
                    { name: 'dbConnId' ,label: 'DB연결ID'  ,hidden:true}
                    ,{ name: 'schId'   ,label: '스키마ID'  ,width: 6    ,align: 'left'   ,sortable:true}
                    ,{ name: 'tblId'   ,label: '테이블ID'  ,width: 15   ,align: 'left'   ,sortable:true}
                    ,{ name: 'tblNm'   ,label: '테이블명'  ,width: 15   ,align: 'left'   ,sortable:true}
                    ,{ name: 'colId'   ,label: '컬럼ID'    ,width: 12   ,align: 'left'   ,sortable:true}
                    ,{ name: 'colNm'   ,label: '컬럼명'    ,width: 12   ,align: 'left'   ,sortable:true}
                    ,{ name: 'pkYn'    ,label: 'PK'       ,width: 3    ,align: 'center'  ,sortable:true}
                    ,{ name: 'nullYn'  ,label: 'NULL'     ,width: 3    ,align: 'center'  ,sortable:true}
                    ,{ name: 'citmCd'  ,label: '전환항목'  ,width:9     ,align: 'center',
                        editable : true, edittype: 'select', editoptions: { value: $this.getGridSelectList()
                                                                            ,defaultValue :""
                                                                            ,dataInit:function(el){
                                                                                $(el).addClass('h-18 p-0');
                                                                            }
                                                                          },formatter:'select'
                        ,dataEvents:[{
                            type:'change',
                            fn : function(e){     
                                var rowid = $(this).getGridParam("selrow");
                                var rowData =  getJsonRow(rowid); 
                                var value= rowData['citmCd'];
                                var evalue = $(e.target).val();
                            }
                        }]
                    }
                ],
                options: {                    
                    height:450
                    ,multiselect:true
                    ,cellEdit: true
                    ,cellsubmit: "clientArray"
                }
            }
            $this.$nextTick(function(){
                $this.$refs.TblGrid.init(tblGridData);
            });
        }       
        //조회  테이블목록
        ,searchListTbl(div){
            if(div == 'slct' && this.params.dbConnId == ''){
                this.$refs.TblGrid.clearGridData();
            }else if(ValdUtil.srchValdNull(this.params.dbConnId, 'DB연결ID', 'slct')){
                this.$refs.TblGrid.selectList(true);
            }
        }

        //초기화  테이블목록
        ,clearListTbl(){
            this.$refs.TblGrid.clearGridData();
        }
        ,isValid(){
            GridUtil.gridCancelEdit(this.$refs.TblGrid.getGridObj());
            let tblRowData = GridUtil.getCheckedList(this.$refs.TblGrid.getGridObj());
            
            if(tblRowData.length == 0){
                this.alert("선택된 대상이 없습니다")
                return false;
            }

            let cnt = 0;
            tblRowData.forEach(el=>{
                this.citmList.forEach(citmEl=>{
                    if(citmEl.colId == el.citmCd){
                        el['citmNm'] = citmEl.colNm
                        el['citmCd'] = citmEl.colId
                    }
                })
                if(ValdUtil.isNull(el.citmCd)){
                    cnt = cnt+1;
                }
            })
            if(cnt > 0){
                this.alert("전환항목을 선택하지 않았습니다")
                return false;
            }
            return true
        }
        //버튼 선택
        ,selectBtn(){
            if(this.isValid()){
                let slctGridData = GridUtil.getCheckedList(this.$refs.TblGrid.getGridObj());
                this.$emit('selectList',slctGridData);
                this.cancel();
            }
        }
        ,getGridSelectList() {
            let str = "";
            _.forEach(this.citmList, function(code) {
                if ( ValdUtil.isNotNull(str) ) {
                    str = str + ";";
                }
                str = str + code.colId + ":" + code.colNm;
            });
            return str;
        }
        //데이터 리셋
        ,resetData(val){
            for(let key in val){
                val[key] = ''
            }
        }
    }
    ,mounted(){
        const $this = this;
        $this.init();
   }
}
</script>