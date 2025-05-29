<template>
    <Modal ref="baseModal" :width="85">
        <div class="section-wrap">
            <div class="section-wrap">
               <div class="section-part part1">
                    <div class="w-100">
                        <h2 class="wd-100 ib">추적기준</h2>
                        <div class="c-wd-100 ib t-a-r p-r-15">
                            <div class="w-100 ib">
                                <p v-if="chasStnd.jobStatCd == ''"   class="rstrCase1 ib">{{'미등록'}}</p>
                                <p v-if="chasStnd.jobStatCd == '10'" class="rstrCase2 ib">{{'실행예정'}}</p>
                                <p v-if="chasStnd.jobStatCd == '20'" class="rstrCase3 ib">{{'실행중'}}</p>
                                <p v-if="chasStnd.jobStatCd == '30'" class="rstrCase5 ib">{{'오류정지'}}</p>
                                <p v-if="chasStnd.jobStatCd == '31'" class="rstrCase5 ib">{{'강제중단'}}</p>
                                <p v-if="chasStnd.jobStatCd == '40'" class="rstrCase4 ib">{{'정상완료'}}</p>
                            </div>
                        </div>
                    </div>
                    <div class="w-50 ib">
                        <div class="w-100">
                            <div class="w-28 ib">
                                <span class="wd-70 m-r-0 t-a-r p-r-5 ib">추적번호</span>
                                <input class="c-wd-70 t-a-c" type="text" v-model="chasStnd.chasNo" disabled>
                            </div>
                            <div class="w-70 ib">
                                <span class="wd-70 m-r-0 t-a-r p-r-10 ib">추적내용</span>
                                <input class="c-wd-70 ib" type="text" v-model="chasStnd.chasDesc" disabled>
                            </div>
                        </div>
                        <div class="w-100 m-t-10">
                            <div class="w-28 ib">
                                <span class="wd-70 m-r-0 t-a-r p-r-5 ib">텍스트만추적</span>
                                <div class="c-wd-80 ib">
                                    <label>
                                        <input type="radio" class="ha p-rl wd-20" value="Y" v-model="chasStnd.textOnlyYn" style="top:2px; left:-3px;" disabled>
                                        <span class="ib c-wd-20">예</span>
                                    </label>
                                    <label>
                                        <input type="radio" class="ha p-rl wd-20" value="N" v-model="chasStnd.textOnlyYn" style="top:2px; left:-3px;" disabled>
                                        <span class="ib c-wd-20">아니오</span>
                                    </label>
                                </div>
                            </div>
                            <div class="w-26 ib">
                                <span class="wd-70 m-r-0 t-a-r p-r-5 ib">샘플링추적</span>
                                <div class="c-wd-70 ib">
                                    <label>
                                        <input type="radio" class="ha p-rl wd-20" value="Y" v-model="chasStnd.smplYn" style="top:2px; left:-3px;" disabled>
                                        <span class="ib c-wd-20">예</span>
                                    </label>
                                    <label>
                                        <input type="radio" class="ha p-rl wd-20" value="N" v-model="chasStnd.smplYn" style="top:2px; left:-3px;" disabled>
                                        <span class="ib c-wd-20">아니오</span>
                                    </label>
                                </div>
                            </div>
                            <div class="w-22 ib">
                                <span class="wd-70 m-r-0 t-a-r p-r-5 ib">샘플링건수</span>
                                <input class="c-wd-70 t-a-r" type="text" v-model="chasStnd.smplCnt" disabled>
                            </div> 
                            <div class="w-22 ib">
                                <span class="wd-70 m-r-0 t-a-r p-r-5 ib">DB연결ID</span>
                                <input class="c-wd-70 t-a-c" type="text" v-model="chasStnd.dbConnId" disabled>
                            </div> 
                            
                        </div>
                    </div>
                     <div class="w-50 ib f-r">
                        <div class="w-100 ib p-l-15 p-rl" style="top:-5px">
                            <div class="w-100 p-0 m-b-0">
                                <div class="w-100 ib">   
                                    <div class="w-20 ib">
                                        <label>
                                            <input type="checkbox" class="ha p-rl wd-20" true-value="Y" false-value="N" v-model="chasStnd.rrnoIdenYn" style="top:2px; left:-3px;" disabled>
                                            <span class="ib c-wd-20">주민번호{{getMtchStndRate(chasStnd.rrnoMtchStndRate)}}</span>
                                        </label>
                                    </div>
                                    <div class="w-20 ib">
                                        <label>
                                            <input type="checkbox" class="ha p-rl wd-20" true-value="Y" false-value="N" v-model="chasStnd.nmIdenYn" style="top:2px; left:-3px;" disabled>
                                            <span class="ib c-wd-20">성명{{getMtchStndRate(chasStnd.nmMtchStndRate)}}</span>
                                        </label>
                                    </div>
                                    <div class="w-20 ib">
                                        <label>
                                            <input type="checkbox" class="ha p-rl wd-20" true-value="Y" false-value="N" v-model="chasStnd.dlicIdenYn" style="top:2px; left:-3px;" disabled>
                                            <span class="ib c-wd-20">운전면허번호{{getMtchStndRate(chasStnd.dlicMtchStndRate)}}</span>
                                        </label>
                                    </div>
                                    <div class="w-20 ib">
                                        <label>
                                            <input type="checkbox" class="ha p-rl wd-20" true-value="Y" false-value="N" v-model="chasStnd.ppnoIdenYn" style="top:2px; left:-3px;" disabled>
                                            <span class="ib c-wd-20">여권번호{{getMtchStndRate(chasStnd.ppnoMtchStndRate)}}</span>
                                        </label>
                                    </div>
                                    <div class="w-20 ib">
                                        <label>
                                            <input type="checkbox" class="ha p-rl wd-20" true-value="Y" false-value="N" v-model="chasStnd.ccrdIdenYn" style="top:2px; left:-3px;" disabled>
                                            <span class="ib c-wd-20">신용카드번호{{getMtchStndRate(chasStnd.ccrdMtchStndRate)}}</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="m-t-7">
                                <div class="w-100 ib">
                                    <div class="w-20 ib">
                                        <label>
                                            <input type="checkbox" class="ha p-rl wd-20" true-value="Y" false-value="N" v-model="chasStnd.telIdenYn" style="top:2px; left: -3px;" disabled>
                                            <span class="ib c-wd-20">전화번호{{getMtchStndRate(chasStnd.telMtchStndRate)}}</span>
                                        </label>
                                    </div>
                                    <div class="w-20 ib">
                                        <label>
                                            <input type="checkbox" class="ha p-rl wd-20" true-value="Y" false-value="N" v-model="chasStnd.emalIdenYn" style="top:2px; left: -3px;" disabled>
                                            <span class="ib c-wd-20">이메일주소{{getMtchStndRate(chasStnd.emalMtchStndRate)}}</span>
                                        </label>
                                    </div>
                                    <div class="w-20 ib">
                                        <label>
                                            <input type="checkbox" class="ha p-rl wd-20" true-value="Y" false-value="N" v-model="chasStnd.addrIdenYn" style="top:2px; left: -3px;" disabled>
                                            <span class="ib c-wd-20">주소{{getMtchStndRate(chasStnd.addrMtchStndRate)}}</span>
                                        </label>
                                    </div>
                                    <div class="w-20 ib">
                                        <label>
                                            <input type="checkbox" class="ha p-rl wd-20" true-value="Y" false-value="N" v-model="chasStnd.bithIdenYn" style="top:2px; left: -3px;" disabled>
                                            <span class="ib c-wd-20">생년월일{{getMtchStndRate(chasStnd.bithMtchStndRate)}}</span>
                                        </label>
                                    </div>
                                    <div class="w-20 ib">
                                        <label>
                                            <input type="checkbox" class="ha p-rl wd-20" true-value="Y" false-value="N" v-model="chasStnd.ciIdenYn" style="top:2px; left: -3px;" disabled>
                                            <span class="ib c-wd-20">CI{{getMtchStndRate(chasStnd.ciMtchStndRate)}}</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="m-t-7">
                                <div class="w-100 ib">
                                    <div class="w-20 ib">
                                        <label>
                                            <input type="checkbox" class="ha p-rl wd-20" true-value="Y" false-value="N" v-model="chasStnd.acntIdenYn" style="top:2px; left: -3px;" disabled>
                                            <span class="ib c-wd-20">계좌번호{{getMtchStndRate(chasStnd.acntMtchStndRate)}}</span>
                                        </label>
                                    </div>
                                    <div class="w-20 ib">
                                        <label>
                                            <input type="checkbox" class="ha p-rl wd-20" true-value="Y" false-value="N" v-model="chasStnd.acntStckIdenYn" style="top:2px; left: -3px;" disabled>
                                            <span class="ib c-wd-20">주식계좌포함</span>
                                        </label>
                                    </div>
                                    <div class="w-20 ib">
                                        <label>
                                            <input type="checkbox" class="ha p-rl wd-20" true-value="Y" false-value="N" v-model="chasStnd.acntItemIdenYn" style="top:2px; left: -3px;" disabled>
                                            <span class="ib c-wd-20">과목코드분석</span>
                                        </label>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="section-wrap">
            <!-- 그리드 -->
            <div class="section-part part1">
                <div class="w-100">
                    <h2 class="wd-70 ib m-b-0 ib">추적결과</h2>
                    <div class="c-wd-70 ib">
                        <div class="w-40 ib">
                            <div class="w-70 ib">
                                <span class="wd-40">검색어</span>
                                <select class="w-30 m-r-5 ib" v-model="chasRslt.srchColId" :disabled="chasStnd.chasNo ==''" @change="chngSrchColId()" style="position:relative; top:2px">
                                    <option v-for="el in srchColList" :value="el.colId" :key="el" v-text="el.colNm"></option>
                                </select>
                                <input class="w-40 ib" type="text" @keyup.enter="searchListChasRslt()" v-model="chasRslt.srchVal" :disabled="chasStnd.chasNo =='' || chasRslt.srchColId==''" style="position:relative; top:2px">
                                <div class="w-10 ib">
                                    <button class="btn-nomal m-l-5 p-rl" style="top:2px;" :disabled="chasStnd.chasNo =='' || chasRslt.srchColId ==''" @click="searchListChasRslt()">조회</button>
                                </div>
                            </div>
                        </div>
                        <div class="t-a-r w-60 ib p-rl " style="right:-5px; top:2px">    
                            <div class="c-wd-100 ib" style="top:2px">
                                <span class="wd-30">정렬</span>
                                <select class="wd-150" v-model="chasRslt.orderByCd" @change="searchListChasRslt()" :disabled="chasStnd.chasNo ==''">
                                    <option v-for="el in orderByList" :value="el.colId" :key="el" v-text="el.colNm"></option>
                                </select>
                            </div>
                            <div class="wd-100 ib btn-group-box3 p-rl" style="top:9px;">
                                <button class="btn-exel-download"  @click="downloadExcel()" >
                                    <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                                    <p>다운로드</p>
                                </button>      
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 그리드 -->
            <div class="wrapper-content w-100 m-t-5">
                <Grid ref="ChasRsltListPop" :dataParams="chasRslt" :paging=true></Grid>
            </div>
        </div>
        <div class="button-box1 m-t-20">
            <button class="btn-normal w-10" @click="cancel">닫기</button>
        </div>
    </Modal>
</template>
<script>
import { ref }      from 'vue'
import { ValdUtil } from '@/utils/ValdUtil.js'
import { DateUtil } from '@/utils/DateUtil.js'
import Grid         from '@/components/grid/Grid.vue'
import Modal        from '@/components/dialog/modal.vue'

export default {
    components: {
        Modal
       ,Grid
    }
    ,props:{
        dataParams:{
            type   : Object,
            default:{}
        }  
    }
   ,data(){
        return {
            chasStnd:{
                chasNo          : ''    //추적번호
                ,chasDesc       : ''    //추적설명
                ,dbConnId       : ''    //DB연결ID
                ,convVer        : ''    //전환버전
                ,smplYn         : ''    //샘플링여부
                ,smplCnt        : 0     //샘플링건수
                ,smplExprCnt    : 0     //샘플링표현건수
                ,textOnlyYn     : ''    //텍스트전용여부
                
                ,rrnoIdenYn     : ''    //주민번호식별여부
                ,nmIdenYn       : ''    //성명식별여부
                ,telIdenYn      : ''    //전화번호식별여부
                ,emalIdenYn     : ''    //이메일식별여부
                ,addrIdenYn     : ''    //주소식별여부
                ,bithIdenYn     : ''    //생일식별여부
                ,ccrdIdenYn     : ''    //신용카드식별여부
                ,dlicIdenYn     : ''    //운전면허식별여부
                ,ppnoIdenYn     : ''    //여권번호식별여부
                ,acntIdenYn     : ''    //계좌식별여부
                ,acntStckIdenYn : ''    //계좌주식식별여부
                ,acntItemIdenYn : ''    //계좌과목식별여부
                ,ciIdenYn       : ''    //CI식별여부

                ,rrnoMtchStndRate : ''    //주민번호식별여부
                ,nmMtchStndRate   : ''    //성명식별여부
                ,telMtchStndRate  : ''    //전화번호식별여부
                ,emalMtchStndRate : ''    //이메일식별여부
                ,addrMtchStndRate : ''    //주소식별여부
                ,bithMtchStndRate : ''    //생일식별여부
                ,ccrdMtchStndRate : ''    //신용카드식별여부
                ,dlicMtchStndRate : ''    //운전면허식별여부
                ,ppnoMtchStndRate : ''    //여권번호식별여부
                ,acntMtchStndRate : ''    //계좌식별여부
                ,ciMtchStndRate   : ''    //CI식별여부

                ,objTblCnt      : ''    //대상테이블수
                ,cmplTblCnt     : ''    //완료테이블수
                ,jobStatCd      : ''    //작업현황코드
                ,jobStatNm      : ''    //작업현황명
            }
            ,chasRslt:{
                 chasNo      : ''      //추적번호
                ,dbConnId    : ''      //DB연결ID
                ,orderByCd   : ''
                ,srchColId   : ''
                ,srchVal     : ''
            }
            ,srchColList : [
                 {colId : ''     ,colNm : ''        }
                ,{colId : 'SCH'  ,colNm : '스키마ID' }
                ,{colId : 'TBL'  ,colNm : '테이블'   }
                ,{colId : 'COL'  ,colNm : '컬럼'     }
                ,{colId : 'PITM' ,colNm : '식별항목' }
                ,{colId : 'RMRK' ,colNm : '식별근거' }
                ]
            ,orderByList : [
                 {colId : ''            ,colNm : ''         }
                ,{colId : 'TPCD.SCH_ID' ,colNm : '스키마ID'  }
                ,{colId : 'TTI.TBL_ID'  ,colNm : '테이블ID'  }
                ,{colId : 'TTI.TBL_NM'  ,colNm : '테이블명'  }
                ,{colId : 'TCI.COL_NM'  ,colNm : '컬럼명'    }
                ,{colId : 'TPB.CITM_NM' ,colNm : '전환항목명'}
            ]
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
        return {
            baseModal
            ,show
            ,cancel
        }
    },
    methods: {
        init() {
        }
        //그리드 생성
       ,initGrid(data){                        
            const $this = this; 
            $this.chasStnd = data;
            $this.chasRslt = $this.$props.dataParams;

            $this.selectListChasSpec();

            let chasRsltListData = {
                url:'/mng/obj/convObjChasStat/selectListChasRslt.hb'
                ,colModels:[
                     {name:'citmCd'      ,label:'식별항목'     ,hidden:true                 }
                    ,{name:'pkYn'        ,label:'pkYn'        ,hidden:true                 }
                    ,{name:'chasNo'      ,label:'추적번호'     ,hidden:true                 }
                    ,{name:'dbConnId'    ,label:'DB연결ID'     ,hidden:true                 }
                    ,{name:'schId'       ,label:'스키마ID'     ,width:60   ,align:'center'  }
                    ,{name:'tblId'       ,label:'테이블ID'     ,width:150  ,align:'left'    }
                    ,{name:'tblNm'       ,label:'테이블명'     ,width:150  ,align:'left'    }
                    ,{name:'colId'       ,label:'컬럼ID'       ,width:100   ,align:'left'   }
                    ,{name:'colNm'       ,label:'컬럼명'       ,width:100   ,align:'left'   }
                    ,{name:'citmNm'      ,label:'식별항목명'   ,width:100   ,align:'center' }
                    ,{name:'rmrk'        ,label:'식별근거'     ,width:400   ,align:'left'   }
                    ]
                ,options:{
                }
            }
            $this.$nextTick(function(){
                $this.$refs.ChasRsltListPop.init(chasRsltListData);
                $this.$refs.ChasRsltListPop.selectList(true);
            });
        }
        // 추적상세 조회
        ,selectListChasSpec() {
            const $this = this;

            let params = {
                'chasNo': this.chasStnd.chasNo
            };
            
            this.doPost('/mng/obj/convObjChasStat/selectListChasSpec.hb', params).then(function(res){
                if (res.data.rtnCd == '0000') {
                    _.forEach(res.data.rtnData.result, function(item) {
                        $this.chasStnd[item.citmDivCd + 'MtchStndRate'] = item.mtchStndRate;
                        $this.chasStnd[item.citmDivCd + 'IdenYn'      ] = item.idenYn;
                    });
                    console.log($this.chasStnd);
                }else{
                    $this.alert(res.data.rtnMsg);
                }
            });
        }
        //추적결과 조회
        ,searchListChasRslt(){
            if(this.chasRslt.orderByCd == '') {
                this.chasRslt.orderByCd = 'TPCD.SCH_ID';
            }
            this.$refs.ChasRsltListPop.selectList(true);
        }
        // 추적결과 검색컬럼변경 시
        ,chngSrchColId(){
            if(this.chasRslt.srchColId ==''){
                this.chasRslt.srchVal = '';
                this.searchListChasRslt(true);
            }
        }
        //데이터 리셋
        ,resetData(val){
            for(let key in val){
                val[key] = ''
            }
        }
        //추적결과 엑셀다운로드
        ,downloadExcel(){
            let $this = this;
            let params             = $this.chasStnd;
            params['excelTrgtDiv'] = 'ChasRsltList';
            let data               = $this.$refs.ChasRsltListPop.getGridObj().jqGrid('getRowData');;
            if(!ValdUtil.isEmptyList(data)){
                $this.doDownExcel('/mng/obj/convObjChasStat/downloadExcel.hb', params, '추적결과_'+DateUtil.getCurrDate('YYYYMMDD')+'.xlsx')
            }else{
                $this.alert('엑셀다운로드 대상이 없습니다')
            }    
        }
        ,getMtchStndRate(val) { 
            if ( !!val ) {
                return '(' + val + '%)'
            } else {
                return '';
            }
        }
    }
   ,mounted(){
        const $this = this;
        $this.init();
   }
}
</script>