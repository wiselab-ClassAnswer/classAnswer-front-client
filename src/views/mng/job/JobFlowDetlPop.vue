<template>
    <Modal ref="baseModal" :width="60">
        <div class="section-wrap ib w-40 f-l">
            <h2>기본정보</h2>
            <div class="section-wrap">
                <div class="section-part part1">
                    <div class="b">
                        <span class="wd-80">작업셋번호</span>
                        <input class="c-wd-90" type="text" v-model="jsetInfo.jsetNo" disabled>
                    </div>
                    <div class="b">
                        <span class="wd-80">작업셋명</span>
                        <input class="c-wd-90" type="text" v-model="jsetInfo.jsetNm" disabled>
                    </div>
                    <div class="b">
                        <span class="wd-80">실행주기</span>
                        <select class="c-wd-90" v-model="jsetInfo.execCyclCd">
                            <option v-for="item in code.execCyclCdList" :key="item.cdVal" :value="item.cdVal">{{item.cdNm}}</option>
                        </select>
                    </div>
                    <div class="b">
                        <span class="wd-80">실행시점</span>
                        <input class="c-wd-90" type="text" v-model="jsetInfo.execTpntVal">
                    </div>
                    <div class="b">
                        <span class="wd-80 m-t-10 f-l">비고</span>
                        <textarea class="c-wd-90" cols="30" rows="5" v-model="jsetInfo.rmrk" disabled></textarea>
                    </div>
                </div>
            </div>
        </div>
        <div class="section-wrap ib w-60">
            <h2>선행작업목록</h2>
            <div class="section-wrap">
                <div class="wrapper-content" style="position: relative; z-index: 1;">
                    <Grid ref="prevJsetSpec" :dataParams="params" :paging=false></Grid>
                </div>            
            </div>
        </div>
        <div class="button-box1 m-t-20">
            <button class="btn-normal m-r-5" @click="aplyJobFlow">적용</button>
            <button class="btn-normal" @click="cancel">닫기</button>
        </div>
    </Modal>
</template>

<script>
import { ref, inject, reactive} from 'vue'
import { GridUtil }             from '@/utils/GridUtil.js'
import { ValdUtil }             from '@/utils/ValdUtil.js'
import { CmonUtil }             from '@/utils/CmonUtil.js'
import Modal                    from '@/components/dialog/modal.vue'
import Grid                     from '@/components/grid/Grid.vue';
import JsetSrchPop              from '@/views/mng/job/JsetSrchPop.vue'

export default {
    components: {
        Modal,
        Grid,
        JsetSrchPop
    },
    props:{
        dataParams:{
            type: Object,
            default: null
        },
    },
    setup() {
        
        const baseModal = ref(null);

        const show = () => {
            baseModal.value.open();
        }
        const cancel = () => {
            baseModal.value.close();
        }

        // 공통코드조회
        const getCmonCdList = inject('getCmonCdList')
        let code = reactive({
            execCyclCdList: [],
            execCondCdList: []
        })
        getCmonCdList('EXEC_CYCL_CD', code.execCyclCdList, 'Y', '');
        getCmonCdList('EXEC_COND_CD', code.execCondCdList, 'Y', '');

        return {
            baseModal,
            show,
            cancel,
            code
        }
    },
    data() {
        return {
            params: {
                csetNo: '',
                wkspId: '',
                wkspNm: '',
                jsetNo: '',
                jsetNm: '',
                rmrk: ''
            },
            jsetInfo: {
                csetNo: '',
                wkspId: '',
                wkspNm: '',
                jsetNo: '',
                jsetNm: '',
                rmrk  : '',
                execCyclCd: '',
                execCyclNm: '',
                execTpntVal: ''
            },
            prevJsetList: [],
            selRowid: '',
            beSelRowid: '',
        }
    },
    methods: {
        init(jsetInfo, prevJsetList) {
            const $this = this;
            $this.initData(jsetInfo, prevJsetList);
            $this.initGrid();
            // $this.selectListOthersWkspPrevJsetSpec();
        },
        initData(jsetInfo, prevJsetList) {

            const $this = this;
            
            // 작업셋 정보 초기화
            _.forEach($this.jsetInfo, function(val, key) {
                $this.jsetInfo[key] = '';
            });
            $this.params.csetNo     = jsetInfo.csetNo;
            $this.params.wkspId     = jsetInfo.wkspId;
            $this.params.wkspNm     = jsetInfo.wkspNm;
            $this.params.jsetNo     = jsetInfo.jsetNo;

            // 작업셋 정보 셋팅
            if ( ValdUtil.isNotNull(jsetInfo) ) {
                _.forEach(jsetInfo, function(val, key) {
                    $this.jsetInfo[key] = val;
                });
            }

            // 선행작업셋 정보 셋팅
            if ( ValdUtil.isNotNull(prevJsetList) ) {
                $this.prevJsetList = prevJsetList;
            }
        },
        initGrid(){
            const $this = this;
            let gridObj ={
                url : '/mng/job/jobFlowMng/selectListPrevJsetSpec.hb',
                colModels : [
                    { name: 'wkspId'        ,label: '워크스페이스ID'     ,width:  40   ,align: 'left'  ,hidden: true   },
                    { name: 'wkspNm'        ,label: '워크스페이스명'     ,width:  80   ,align: 'left'  ,hidden: false   },
                    { name: 'jsetNo'        ,label: '작업셋번호'         ,width:  40   ,align: 'center',hidden: true   },
                    { name: 'jsetNm'        ,label: '작업셋명'           ,width: 100   ,align: 'left'  ,hidden: true  },
                    { name: 'prevJsetNo'    ,label: '선행작업셋번호'     ,width:  40    ,align: 'center',hidden: false  },
                    { name: 'prevJsetNm'    ,label: '선행작업셋명'       ,width: 100   ,align: 'left'   ,hidden: false  },
                    { name: 'execCondCd'    ,label: '실행상태'          ,width:  50    ,align: 'center',hidden: false, 
                        editable : true, edittype: 'select', editoptions: { value: $this.getGridSelectList(), defaultValue :"SUCC"}, formatter:'select',
                        dataEvents:[{
                            type:'change',
                            fn : function(e, a, b){   
                                var rowid = $(this).getGridParam("selrow");
                                var rowData =  getJsonRow(rowid); 
                                var value= rowData['execCond'];
                                var evalue = $(e.target).val();
                                // console.log(value, evalue);
                                // $("#select_box > option[value='"+$(e.target).val()+"']").attr("selected", "true");
                                // detailChanged(grid, "DR_CR_DTIL",$(e.target).val());     
                            }
                        }]
                    }
                ],
                options: {
                    height: 200,
                    cellEdit: true,
                    cellsubmit: "clientArray"
                }
            }
            this.setGridData(gridObj);
            
        },
        // 그리드 데이터 셋팅
        setGridData: function(gridObj) {
            const $this = this;
            this.$nextTick(function() {
                this.$refs.prevJsetSpec.init(gridObj);

                if ( ValdUtil.isNotNull($this.prevJsetList) ) {
                    _.forEach($this.prevJsetList, function(jset) {
                        let cnt = $this.$refs.prevJsetSpec.getGridObj().jqGrid("getGridParam", "records") + 1;
                        $this.$refs.prevJsetSpec.getGridObj().addRowData(cnt, jset);
                    });
                }
            });
        },
        // 조회
        selectJsetInfo: function() {
            const $this = this;
            $this.confirm({
                content: '변경된 내용은 사라지게 됩니다. 계속 조회하시겠습니까?',
                callback: {
                	yes() {
                    	$this.selectJsetDetl();
                        $this.selectListPrevJsetSpec();
					}
				}
			});
        },
        // 작업셋조회
        selectJsetDetl: function() {
            const $this = this;
            let params = _.cloneDeep($this.params);
            $this.doPost("/mng/job/jobFlowMng/selectJsetDetl.hb", params).then(function(response) {
                _.forEach(response.data.rtnData, function(val, key) {
                    $this.jsetInfo[key] = val;
                });

            });
        },
        // 선행 작업셋 조회
        selectListPrevJsetSpec: function() {
            this.$refs.prevJsetSpec.selectList(true);
        },
        // 다른 워크스페이스 작업셋 조회
        // selectListOthersWkspPrevJsetSpec: function() {
        //     const $this = this;
        //     let params = _.cloneDeep($this.params);
        //     $this.doPost("/mng/job/jobFlowMng/selectListOthersWkspPrevJsetSpec.hb", params).then(function(response) {
        //         _.forEach(response.data.rtnData, function(jset) {
        //             let cnt = $this.$refs.prevJsetSpec.getGridObj().jqGrid("getGridParam", "records") + 1;
        //             $this.$refs.prevJsetSpec.getGridObj().addRowData(cnt, jset);
        //         });
        //     });
        // },
        // 선행작업셋 팝업 조회
        openPrevJsetSrch: function() {
            this.$refs.PrevJsetSrchModal.show();
			this.$refs.PrevJsetSrchModal.init();
        },
        // 선행작업셋 선택시 셋팅
        selectedPrevJset: function() {
            
        },
        // 적용버튼
        aplyJobFlow() {

            const $this = this;

            if ( ValdUtil.isNull($this.jsetInfo.jsetNm) ) {
				$this.alert('작업셋명은 필수입력값입니다.');
				return false;
			} 
			// else if ( ValdUtil.isNull($this.jsetInfo.execTpntVal) ) {
            //     if ( $this.jsetInfo.execCyclCd != 'MA' ) {
            //         $this.alert('실행주기는 필수입력값입니다.');
    		// 		return false;
            //     }
			// }

            // 실행주기 체크
            if ( ValdUtil.isNotNull($this.jsetInfo.execTpntVal) ) {
                if ( !this.valdExecTpntVal() ) {
                    return false;
                }
            }
			this.jsetInfo.execCyclNm =  CmonUtil.getCodeNm($this.code.execCyclCdList, this.jsetInfo.execCyclCd);
            GridUtil.gridCancelEdit($this.$refs.prevJsetSpec.getGridObj());

            let gridData = $this.$refs.prevJsetSpec.getGridObj().getRowData();
            let params = {
                jsetInfo     : this.jsetInfo,
                prevJsetList : gridData
            }               

            this.$emit('aplyJobFlow', params);
            this.cancel();
        },
        // 추가버튼
        add: function() {
            // console.log("추가 : ");
            const $this = this;
            var addRow = {
                crud          : 'C',
                wkspId        : $this.params.wkspId,
                jsetNo        : $this.params.jsetNo,
                jsetNm        : $this.params.jsetNm,
                prevJsetNo    : '',
                prevJsetNm    : '',
                execCondCd    : 'SUCC'
            }
            let cnt = $this.$refs.prevJsetSpec.getGridObj().jqGrid("getGridParam", "records") + 1;
            $this.$refs.prevJsetSpec.getGridObj().addRowData(cnt, addRow);
        },
        // 삭제버튼
        del: function() {
            const $this = this;
            let gridObj = $this.$refs.prevJsetSpec.getGridObj();
            let gridId  = $this.$refs.prevJsetSpec.getGridId();

            let checkIds = gridObj.jqGrid("getGridParam","selarrrow") + "";  // 다건
            if ( ValdUtil.isNull(checkIds) ) {
                $this.alert("삭제할 행을 선택해주십시요.");
                return false;
            }

            let checkId = checkIds.split(",");

            for ( var i in checkId ) {
                if ( gridObj.getRowData(checkId[i]).crud == "C" ) {
                    gridObj.jqGrid('delRowData', checkId[i]);
                } else {
                    gridObj.setRowData(checkId[i], {crud: "D"});
                    $("#"+checkId[i],"#"+gridId).css({display: "none"});
                }
            }
        },
        valdExecTpntVal() {
            const $this = this;
            let isVald = true;
            let execTpntVal = $this.jsetInfo.execTpntVal;
            
            if(!execTpntVal) {
                return true;
            }
            let execCyclCd = $this.jsetInfo.execCyclCd;            
            let splitVal = execTpntVal.split(',');
            splitVal.forEach((item)=>{
                if(!this.chkExecTpntVal(item, execCyclCd)) {
                    isVald = false;
                }
            })
            
            return isVald;
        },
        chkExecTpntVal(date, execCyclCd) {
            // 정규 표현식 패턴
            const ddPattern = /^(0[0-9]|1[0-9]|2[0-3])([0-5][0-9]){2}$/;
            const wwPattern = /^[월화수목금토일]\/(0[0-9]|1[0-9]|2[0-3])([0-5][0-9]){2}$/;
            const mmPattern = /^(0[1-9]|1\d|2[0-8])\/(0[0-9]|1[0-9]|2[0-3])([0-5][0-9]){2}$/;
            const yyPattern = /^(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])\/(0[0-9]|1[0-9]|2[0-3])([0-5][0-9]){2}$/;
            const maPattern = /^(20\d\d|2[0-9][0-9][0-9])(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])(0[0-9]|1[0-9]|2[0-3])([0-5][0-9]){2}$/; 
            
            // DD  -매일
            // BDD -매영업일
            // WW  -매주
            // MM  -매월
            // YY  -매년
            // MA  -비정기
            if ( !(ValdUtil.isNull(date) && execCyclCd === 'MA') ) {
                switch (execCyclCd) {
                    case 'DD':
                    case 'BDD':
                        if (!ddPattern.test(date)) {
                            this.alert('[매일 형식 오류 HH24MISS]<br>000000,235959 형식을 벗어났습니다.');
                            return false;
                        }
                        break;

                    case 'WW':
                        if (!wwPattern.test(date)) {
                            this.alert('[매주 형식 오류 월~금/HH24MISS]<br>금/000000,토/235959 형식을 벗어났습니다.');
                            return false;
                        }
                        break;

                    case 'MM':
                        if (!mmPattern.test(date)) {
                            this.alert('[매월 형식 오류 DD/HH24MISS]<br>01/000000,28/235959 형식을 벗어났습니다.');
                            return false;
                        }
                        break;

                    case 'YY':
                        if (!yyPattern.test(date)) {
                            this.alert('[매년 형식 오류 MMDD/HH24MISS]<br>0101/000000,1231/235959 형식을 벗어났습니다.');
                            return false;
                        }
                        if (!this.valdLastDay(date, 'YY')) {
                            this.alert('[매년 형식 오류 MMDD/HH24MISS]<br>각 월 말일을 초과했습니다.');
                            return false;
                        }
                        break;

                    case 'MA':
                        if (!maPattern.test(date)) {
                            this.alert('[비정기 형식 오류 YYYYMMDDHH24MISS]<br>20000101000000,999912315959 형식을 벗어났습니다.');
                            return false;
                        }
                        if (!this.valdLastDay(date, 'MA')) {
                            this.alert('[비정기 형식 오류 YYYYMMDDHH24MISS]<br>각 월 말일을 초과했습니다.');
                            return false;
                        }
                        break;

                    default:
                        // console.log('유효하지 않은 실행주기');                    
                        return false;
                }
            }
            return true;
        },
        valdLastDay(date, cyclCd) {      
            let year = '';
            let month = '';
            let day = '';
            let lastDay = '';
            if(cyclCd == 'YY') {
                year = new Date().getFullYear();
                month = date.slice(0, 2);
                day = date.slice(2, 4);
                lastDay = new Date(year, month, 0).getDate();
            } else if(cyclCd == 'MA') {
                year = date.slice(0, 4);
                month = date.slice(4, 6);
                day = date.slice(6, 8);
                lastDay = new Date(year, month, 0).getDate();
            } else {
                return false;
            }
            
            if (day > lastDay) {
                return false;
            } else {
                return true;
            }
        },
        getGridSelectList() {
            let str = "";
            _.forEach(this.code.execCondCdList, function(code) {
                if ( ValdUtil.isNotNull(str) ) {
                    str = str + ";";
                }
                str = str + code.cdVal + ":" + code.cdNm;
            });
            // str = ":;SUCC:SUCC;FAIL:FAIL;NONE:NONE";
            return str;
        }
    },
    mounted: function() {  
        
    },
}
</script>