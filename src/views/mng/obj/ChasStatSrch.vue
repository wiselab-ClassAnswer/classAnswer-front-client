<template>
    <Modal ref="baseModal" :width="60">
        <div class="section-wrap w-100 f-l ib m-b-20">
            <h2>추적목록</h2>
            <div class="section-part part1">
                <div class="w-100">
                    <div class="w-37 ib">
                        <div class="c-wd-80 ib m-0">
                            <div class="wd-60 ib">
                                <span class="w-100">검색어</span>
                            </div>
                            <div class="c-wd-50 ib p-r-5">
                                <input class="w-100" type="text" v-model="params.srchWord" @keyup.enter="searchListChas(true)">
                            </div>
                        </div>
                        <div class="wd-80 ib">
                            <button class="btn-normal w-100" @click="searchListChas(true)">조회</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="b m-t-5">
                <Grid ref="ChasGrid" :dataParams="params" :paging=false></Grid>
            </div>
        </div>
        <div class="section-wrap w-100 f-l ib m-b-20">
            <h2>추적결과</h2>
            <div class="section-part part1">
                <div class="w-100">
                    <div class="w-40 ib">
                        <div class="w-100 ib">
                            <div class="w-100 ib">
                                <select class="w-30 m-r-5 ib" v-model="params.srchColId" :disabled="params.chasNo ==''" @change="chngSrchColId()" style="position:relative; top:2px">
                                    <option v-for="el in params.srchColList" :value="el.colId" :key="el" v-text="el.colNm"></option>
                                </select>
                                <input class="w-40 ib" type="text" @keyup.enter="searchListChasRslt()" v-model="params.srchVal" :disabled="params.chasNo =='' || params.srchColId==''" style="position:relative; top:2px">
                                <div class="wd-80 ib">
                                    <button class="w-100 btn-nomal m-l-5 p-rl" style="top:1px;" :disabled="params.chasNo =='' || params.srchColId ==''" @click="searchListChasRslt()">조회</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="b m-t-5">
                <Grid ref="ChasRsltList" :dataParams="params" :paging=false></Grid>
            </div>
        </div>
        <div class="button-box1 w-100 m-t-30">
            <button class="btn-normal m-r-5 p-l-20 p-r-20" @click="selectBtn()">선택</button>
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
                            ,'colId'  :'citm_cd'
                            ,'colNm'  :'citm_nm'
                            ,'where'  : [
                            ]
                            ,'orderby' : [
                            {'orderCol' : 'sort_ord'}
                            ]
        };  
        const citmList = reactive([]);
        getColIdNmList(citmData, citmList, 'Y', null);

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
        }
    }
    ,data() {
        return {
            params:{
                srchWord:''
                ,chasNo:''
                ,dbConnId:''
                ,srchColList: [
                     {colId:''     ,colNm:''}
                    ,{colId:'SCH'  ,colNm:'스키마ID'}
                    ,{colId:'TBL'  ,colNm:'테이블'  }
                    ,{colId:'COL'  ,colNm:'컬럼'   }
                    ,{colId:'PITM' ,colNm:'식별항목'}
                    ,{colId:'RMRK' ,colNm:'식별근거' }
                ]
                ,srchColId:''
                ,srchVal:''
            }
        }
    }
    ,methods: {
        init(){
        } 
        ,initData(){
            this.resetData(this.params);
            this.params.srchWord = this.$props.dataParams.dbConnId;
            this.initGrid();
        }
        ,initGrid(){
            const $this = this;
            let chasGridData ={
                url:'/mng/obj/convObjChasStat/selectListChas.hb'
                ,colModels : [
                     {name:'jobStatCd'  ,label:'추적상태'  ,hidden:true}
                    ,{name:'chasNo'     ,label:'추적번호'  ,width:6   ,align:'center' ,sortable:true}
                    ,{name:'dbConnId'   ,label:'DB연결ID'  ,width:6   ,align:'center' ,sortable:true}
                    ,{name:'prgrs'      ,label:'진행률(%)' ,width:5   ,align:'center' ,sortable:true}
                    ,{name:'jobStatNm'  ,label:'추적상태'  ,width:5   ,align:'center' ,sortable:true}
                    ,{name:'chasDesc'   ,label:'추적내용'  ,width:14  ,align:'left'   ,sortable:true}
                ]
                ,options: {                    
                    height:150
                    ,loadonce:true
                    ,onSelectRow(rowid, val, e){
                        $this.params.chasNo   = $(this).jqGrid('getRowData',rowid).chasNo;
                        $this.params.dbConnId = $(this).jqGrid('getRowData',rowid).dbConnId;

                        //추적결과 조회
                        $this.searchListChasRslt();
                    }
                }
            }

            let chasRsltListData = {
                url:'/mng/obj/convObjChasStat/selectListChasRslt.hb'
                ,colModels:[
                    {name:'pitmCd'   ,label:'식별항목'     ,hidden:true}
                    ,{name:'pkYn'    ,label:'pkYn'        ,hidden:true}
                    ,{name:'dbConnId',label:'DB연결ID'     ,hidden:true}
                    ,{name:'schId'   ,label:'스키마ID'     ,width:80   ,align:'center' ,fixed:true ,sortable:true}
                    ,{name:'tblId'   ,label:'테이블ID'     ,width:150  ,align:'left'   ,fixed:true ,sortable:true}
                    ,{name:'tblNm'   ,label:'테이블명'     ,width:200  ,align:'left'   ,fixed:true ,sortable:true}
                    ,{name:'colId'   ,label:'컬럼ID'       ,width:100  ,align:'left'   ,fixed:true ,sortable:true}
                    ,{name:'colNm'   ,label:'컬럼명'       ,width:100  ,align:'left'   ,fixed:true ,sortable:true}
                    ,{name:'citmNm'  ,label:'식별항목명'   ,width:80  ,align:'left'    ,fixed:true ,sortable:true}
                    ,{name:'rmrk'    ,label:'식별근거'     ,width:450  ,align:'left'   ,fixed:true ,sortable:true}
                    ]
                ,options:{
                    height:350   
                    ,loadonce: true
                    ,multiselect:true
               }
            }
            $this.$nextTick(function(){
                $this.$refs.ChasGrid.init(chasGridData);
                $this.$refs.ChasRsltList.init(chasRsltListData);
                $this.searchListChas();
            });
        }       
        //조회  추적목록
        ,searchListChas(){
            this.$refs.ChasGrid.selectList(true);
        }
        //조회 추적결과
        ,searchListChasRslt(){
            this.$refs.ChasRsltList.selectList(true);
        }
        //추적결과 검색컬럼변경 시
        ,chngSrchColId(){
            if(this.params.srchColId ==''){
                this.params.srchVal = '';
                this.searchListChasRslt();
            }
        }
        //버튼 선택
        ,selectBtn(){
            let slctGridData = GridUtil.getCheckedList(this.$refs.ChasRsltList.getGridObj());
            if(slctGridData.length == 0){
                this.alert("선택된 대상이 없습니다")
                return false;
            }
            slctGridData.forEach(el=>{
                el['citmCd'] = el.pitmCd;
            })

            this.$emit('selectList',slctGridData);
            this.cancel();
        }
        //데이터 리셋
        ,resetData(val){
            for(let key in val){
                if(key != 'srchColList'){
                    val[key] = ''
                }
            }
        }
    }
    ,mounted(){
        const $this = this;
        $this.init();
   }
}
</script>