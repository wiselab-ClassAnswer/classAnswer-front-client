<template>
    <Modal ref="baseModal" :width="60">
        <div class="section-wrap">
            <h2 class="ib">단위작업 상세팝업</h2>
            <button class="f-r btn-normal" @click="selectUnitJobDetl('thisSrch')">조회</button>
            <div class="section-wrap">
                <div class="section-part part1">
                    <div class="w-100 bnpm">
                        <span class="wd-90">단위작업번호</span>
                        <div class="c-wd-90 ib">
                            <div class="input-btn w-50-mr">
                                <input class="w-100" type="text" v-model="unitJobDetl.unitJobNo" ref="refUnitJobNo">
                                <button class="post-btn" @click="unitJobSrchPop()">
                                    <img src="@/assets/img/btn_search.png" alt="찾기">    
                                </button>
                            </div>
                            <input class="w-50-ml" type="text" v-model="unitJobDetl.unitJobNm" disabled>
                        </div>
                    </div>
                    <div class="w-100 bnpm">
                        <span class="wd-90">상위단위작업번호</span>
                        <div class="c-wd-90 ib">
                            <input class="w-50-mr" type="text" v-model="unitJobDetl.upprUnitJobNo" disabled>
                            <input class="w-50-ml" type="text" v-model="unitJobDetl.upprUnitJobNm" disabled>
                        </div>
                    </div>
                    <div class="w-100 b">
                        <span class="wd-90">정책/키맵</span>
                        <!-- <div class="c-wd-90 ib">
                            <input class="w-25" type="text" v-model="unitJobDetl.plcyNo" disabled>
                            <input class="w-25-m" type="text" v-model="unitJobDetl.plcyNm" disabled>
                            <input class="w-25-m" type="text" v-model="unitJobDetl.kmapMetaNo" disabled>
                            <input class="w-25-m" type="text" v-model="unitJobDetl.kmapMetaNm" disabled>
                        </div> -->

                        <div class="c-wd-90 ib">
                            <div class="w-50-mr ib">
                                <input class="w-50-mr" type="text" v-model="unitJobDetl.plcyNo" disabled>
                                <input class="w-50-ml" type="text" v-model="unitJobDetl.plcyNm" disabled>
                            </div>
                            <div class="w-50-ml ib">
                                <input class="w-50-mr" type="text" v-model="unitJobDetl.kmapMetaNo" disabled>
                                <input class="w-50-ml" type="text" v-model="unitJobDetl.kmapMetaNm" disabled>
                            </div>
                        </div>
                    </div>
                    
                    <div class="w-100 b">
                        <div class="w-25 ib">
                            <span class="wd-90">작업구분</span>
                            <select class="c-wd-90" v-model="unitJobDetl.unitJobDivCd" disabled>
                                <option v-for="item in code.unitJobDivCd" v-bind:key="item.cdVal" v-bind:value="item.cdVal" v-bind:text="item.cdNm"></option>
                            </select>
                        </div>
                        <div class="w-25 ib m-l-10">
                            <span class="wd-90 text-indent">작업유형</span>
                            <select class="c-wd-90" v-model="unitJobDetl.unitJobTypeCd" disabled>
                                <option v-for="item in code.unitJobTypeCd" v-bind:key="item.cdVal" v-bind:value="item.cdVal" v-bind:text="item.cdNm"></option>
                            </select>
                        </div>
                        <div class="w-25 ib m-l-10">
                            <span class="wd-90">DB연결ID</span>
                            <select class="c-wd-90" v-model="unitJobDetl.dbConnId" disabled>
                                <option v-for="item in code.dbConnId" v-bind:key="item.dbConnId" v-bind:value="item.dbConnId" v-bind:text="item.dbConnNm"></option>
                            </select>
                        </div>
                    </div>

                    
                </div>
            </div>
            <template v-if="unitJobDetl.unitJobDivCd == '10'">
                <div class="table-wrap m-t-20">
                    <table>
                        <colgroup>
                            <col width="50%">
                            <col width="50%">
                        </colgroup>
                        <thead>
                            <tr>
                                <th>이전문장(SQL)</th>
                                <th>처리문장(SQL)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="h-470">
                                    <textarea name="bfProcSql" v-model="unitJobDetl.bfProcSql" disabled> </textarea>
                                </td>
                                <td class="h-470">
                                    <textarea name="sql" v-model="unitJobDetl.sql" > </textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
            <template v-if="unitJobDetl.unitJobDivCd == '20' || unitJobDetl.unitJobDivCd == '30' || unitJobDetl.unitJobDivCd == '40'">
                <br>
                <br>
                <div class="section-wrap">
                    <div class="section-part part1">
                        <div style="width: 100%;">
                            <h2>실행모듈정보</h2>
                            <div>
                                <span class="wd-90">처리모듈명</span>
                                <input class="c-wd-90 ib" type="text" v-model="unitJobDetl.procModuNm" placeholder="com.customer.site.private.info.process.SomeModule.class">
                                <p class="m-l-0 m-t-10" style="display: inline-block; color: #999999; font-size: 12px; margin-left: 10px;">※ 작업구분이	&#39;Class&#39;인 경우, 패키지경로를 포함한 클래스명을 &#39;Shell&#39;인 경우 서버 전체경로를 포함한 Shell파일명을 기재함</p>
                            </div>
                            <div class="m-t-20">
                                <div class="w-100" v-for="(item, index) in parmList" v-bind:key="index">
                                    <div class="w-50-mr2 ib m-b-0">
                                        <span class="wd-90">Key {{item.parmSeq}}</span>
                                        <div class="c-wd-90 ib">
                                            <input class="w-50-mr" type="text" v-model="item.parmNm" placeholder="파라미터 명">
                                            <input class="w-50-ml" type="text" v-model="item.parmKey" placeholder="파라미터 KEY">
                                        </div>
                                    </div>
                                    <div class="w-50-ml2 ib m-b-0">
                                        <span>Value {{item.parmSeq}}</span>
                                        <input type="text" v-model="item.parmVal" placeholder="파라미터 VALUE">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div class="button-box1 m-t-20">
            <button class="btn-normal m-r-5" @click="testUnitJobDetlPop" v-if="unitJobDetl.unitJobDivCd == '10'">테스트</button>
            <button class="btn-normal m-r-5" @click="updateUnitJobDetlCnfm">저장</button>
            <button class="btn-normal m-r-5" @click="deleteTjUnitJob">삭제</button>
            <button class="btn-normal" @click="cancel">닫기</button>
        </div>
        <UnitJobSrchModal ref="UnitJobSrchModal" :dataParams="params" @getPopRowData="getPopRowData"></UnitJobSrchModal>
    </Modal>
</template>
<script>

import { ref, reactive, inject } from 'vue'
import Modal from '@/components/dialog/modal.vue'
import UnitJobSrchModal from './UnitJobSrch.vue'

export default {
    components: {
        Modal,
        UnitJobSrchModal
    },
    props:{
        dataParams:{
            type: Object,
            default: null
        },
    },
    setup() {        
        const baseModal = ref(null);
        const unitJobSrchGrid = ref(null);
        let code = reactive({
            unitJobDivCd: [],
            unitJobTypeCd: [],
            dbConnId: [],
        });
        // 전역 mixin의 메소드를 inject를 통해 가져옴
        const getCmonCdList = inject('getCmonCdList');

        // inject를 통해 가져온 공통코드 호출 함수를 이용하여 공통코드 get
        getCmonCdList('UNIT_JOB_DIV_CD', code.unitJobDivCd, 'N', null);
        getCmonCdList('UNIT_JOB_TYPE_CD', null, 'Y', (dataList) => {
            const dataCnt = dataList.length;
            let m = 0;
            for (m = 0; m < dataCnt; m++) {
                code.unitJobTypeCd.push({
                    cdVal   : dataList[m].cdVal, 
                    cdNm    : dataList[m].cdVal + ' | ' + dataList[m].cdNm,
                });
            }
        });

        const show = () => {
            baseModal.value.open();
        }
        const cancel = () => {
            baseModal.value.close();
        }

        return {
            baseModal,
            unitJobSrchGrid,
            code,
            show,
            cancel,
        }
    },
    data() {
        return {
            params: {
                srchUnitJob     : '',
                unitJobNo       : '',
            },
            unitJobDetl: {
                unitJobNo       : '',
                unitJobNm       : '',
                upprUnitJobNo   : '',
                upprUnitJobNm   : '',
                unitJobDivCd    : '',
                unitJobTypeCd   : '',
                dbConnId        : '',
                plcyNo          : '',
                plcyNm          : '',
                kmapMetaNo      : '',
                kmapMetaNm      : '',
                fcstProcTcnt    : '',  
                rmrk            : '',              
                procSql         : '',
                bfProcSql       : '',
                sql             : '',
                procModuNm      : '',
                jsetNoList      : '',
                upprUnitExistsCnt: 0,
            },
            chkData : {
                copyUnitJobNo   : '',
                isTestSql       : false,
            },
            selectedRowData     : null,
            parmList            : [],
            procModuParmList    : [],
        }
    },
    methods: {
        init() {
            this.resetParmList();
            this.selectDbConnInfo();
            this.resetUnitJobInfo();
        },
        // 단위작업 상세 초기화
        resetUnitJobInfo() {
            this.resetObjData(this.unitJobDetl);
            this.resetObjData(this.chkData);
        },        
        // 반응성 데이터셋의 반응성 잃지 않고 유지 시키며 초기화
        resetObjData(data) {
            for(let key in data) {
                if(typeof data[key] === "string") {
                    data[key] = '';
                } else if(typeof data[key] === "number") {
                    data[key] = 0;               
                } else if(typeof data[key] === "boolean") {
                    data[key] = false;               
                } else {
                    data[key] = null;
                }
            }
        },
        resetParmList() {
            
            this.procModuParmList   = [];
            this.parmList           = [];
            for (let i=0; i < 10; i++) {
                const parmMap = {
                    parmSeq : i+1,
                    parmNm  : '',
                    parmKey : '',
                    parmVal : '',
                };
                this.parmList.push(parmMap);
            }
        },
        setParmList(procModuParmList) {
            for (let i=0; i < procModuParmList.length; i++) {
                this.parmList[i].parmNm     = procModuParmList[i].parmNm;
                this.parmList[i].parmKey    = procModuParmList[i].parmKey;
                this.parmList[i].parmVal    = procModuParmList[i].parmVal;
            }
        },
        selectDbConnInfo() {
            let $this = this;
            const url = '/mng/job/unitJobMng/selectListDbConnInfo.hb';

            $this.doGet(url).then((res) => {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    if ($this.ValdUtil.isNotNull(result.rtnData.dbConnInfo)) {       
                        $this.code.dbConnId = result.rtnData.dbConnInfo;
                    } else {
                        $this.alert('DB연결ID 정보가 존재하지 않습니다.');
                    }
                } else {
                    $this.alert(result.rtnMsg);
                }
            });
        },
        selectUnitJobDetl(srchDiv) {
            let $this = this;
            
            if(srchDiv != 'thisSrch' && $this.ValdUtil.isNotNull($this.dataParams.unitJobNo)) {
                $this.unitJobDetl.unitJobNo = $this.dataParams.unitJobNo;
            }
            if($this.ValdUtil.isNull($this.unitJobDetl.unitJobNo)) {
                $this.alert('단위작업번호 입력 후 조회해주세요.');
                return false;
            }
            
            const url = '/mng/job/unitJobDetlPop/selectUnitJobDetlPop.hb';
            $this.doPost(url, $this.unitJobDetl.unitJobNo).then((res) => {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    $this.resetParmList();
                    $this.resetUnitJobInfo();
                    if ($this.ValdUtil.isNotNull(result.rtnData.procModuParmList)) {
                        $this.setParmList(result.rtnData.procModuParmList);
                    }
                    if ($this.ValdUtil.isNotNull(result.rtnData.result)) {       
                        $this.unitJobDetl = result.rtnData.result;
                        $this.chkData.copyUnitJobNo = $this.unitJobDetl.unitJobNo;
                        $this.chkData.isTestSql = false;
                    } else {
                        $this.alert('단위작업 상세 조회 결과가 없습니다.');
                    }
                } else {
                    $this.alert(result.rtnMsg);
                }
            });
            $this.setFocus();
        },
        // 단위작업상세 저장 컨펌
        updateUnitJobDetlCnfm() {
            const $this = this;   
            
            if($this.chkData.copyUnitJobNo != $this.unitJobDetl.unitJobNo) {
                $this.alert('단위작업번호를 수정할 수 없습니다.<br>단위작업 신규 생성은 단위작업관리 화면을 이용해 주세요.');
                return false;
            }

            this.procModuParmList = [];
            if (this.unitJobDetl.unitJobDivCd != '10') {                
                let seq = 0;
                for (let i=0; i < this.parmList.length; i++) {
                    if (this.ValdUtil.isNull(this.parmList[i].parmNm) || this.ValdUtil.isNull(this.parmList[i].parmKey) || this.ValdUtil.isNull(this.parmList[i].parmVal)) {
                        if (this.ValdUtil.isNotNull(this.parmList[i].parmNm) || this.ValdUtil.isNotNull(this.parmList[i].parmKey) || this.ValdUtil.isNotNull(this.parmList[i].parmVal)) {
                            this.alert('모듈 탭의 파라미터 행 중 일부만 입력된 행이 존재합니다.');
                            return false;
                        }
                    } else {
                        this.parmList[i].seq = ++seq;
                        this.procModuParmList.push(this.parmList[i]);
                    }
                }
            }

            if(this.unitJobDetl.unitJobDivCd == '10' && !$this.chkData.isTestSql) {
                $this.confirm({
                    title: '단위작업 저장',
                    content: '해당 처리문장(SQL)을 테스트 없이 저장하시겠습니까?',
                    callback: {
                        yes() {
                            $this.updateUnitJobDetl();
                        }
                    }
                })
            } else {
                $this.updateUnitJobDetl();
            }
        },
        // 단위작업상세 저장
        updateUnitJobDetl() {
            const $this = this;   

            let params = {};
            params.unitJobDetl = $this.unitJobDetl;
            params.procModuParmList = this.procModuParmList;
            if (params.unitJobDetl.sql == params.unitJobDetl.procSql) {
                params.unitJobDetl.sql = null;
                params.unitJobDetl.procSql = null;
            }

            $this.doPost('/mng/job/unitJobDetlPop/updateUnitJobDetl.hb', params).then((res)=> {
                let result = res.data;
                if(result.rtnCd == '0000') {
                    $this.alert('저장되었습니다').then((result) =>{
                        if ( result.isConfirmed){
                            $this.selectUnitJobDetl();
                        }
                    })
                    
                } else {
                    $this.alert(result.rtnMsg);
                }
            });
        },
        // 단위작업상세 삭제 컨펌
        deleteTjUnitJob() {
            const $this = this;
            let unitJobNo = $this.unitJobDetl.unitJobNo;

            if (this.ValdUtil.isNull(unitJobNo)) {
                $this.alert('삭제 처리할 단위작업 기본 정보가 없습니다.');
                return false;
            }        

            if ($this.chkData.copyUnitJobNo != unitJobNo) {
                $this.alert('단위작업번호가 변경되었습니다.<br>다시 조회 후 처리바랍니다.');
                return false;
            }    

            let jsetNoList = $this.unitJobDetl.jsetNoList;
            let upprUnitExistsCnt = $this.unitJobDetl.upprUnitExistsCnt;
            if (this.ValdUtil.isNotNull(jsetNoList) && upprUnitExistsCnt < 1) {
                $this.confirm({
                    title: '단위작업 삭제',
                    content: `해당 단위작업은 작업셋에 할당된 단위작업입니다.<br>${jsetNoList} <br>해당 단위작업 삭제시 위 작업셋 대상에서도 제외됩니다.<br>정말 삭제하시겠습니까?`,
                    callback: {
                        yes() {
                            $this.deleteTjUnitJobProc();
                        }
                    }
                })
            } else if (this.ValdUtil.isNull(jsetNoList) && upprUnitExistsCnt > 0) {
                $this.confirm({
                    title: '단위작업 삭제',
                    content: `해당 단위작업에 속한 하위 단위작업이 존재합니다.<br>삭제할 경우 다른 모든 하위작업의 연결이 끊깁니다.<br>정말 삭제하시겠습니까?`,
                    callback: {
                        yes() {
                            $this.deleteTjUnitJobProc();
                        }
                    }
                })
            } else if (this.ValdUtil.isNotNull(jsetNoList) && upprUnitExistsCnt > 0) {
                $this.confirm({
                    title: '단위작업 삭제',
                    content: `해당 단위작업은 작업셋에 할당된 단위작업입니다.<br>${jsetNoList} <br>해당 단위작업 삭제시 위 작업셋 대상에서도 제외되며<br>해당 단위작업에 속한 하위 단위작업도 존재하여.<br>삭제할 경우 다른 모든 하위작업의 연결이 끊깁니다.<br>정말 삭제하시겠습니까?`,
                    callback: {
                        yes() {
                            $this.deleteTjUnitJobProc();
                        }
                    }
                })
            } else {                
                $this.confirm({
                    title: '단위작업 삭제',
                    content: '단위작업 기본 정보를 삭제하시겠습니까?',
                    callback: {
                        yes() {
                            $this.deleteTjUnitJobProc();
                        }
                    }
                })
            }
        },
        // 단위작업 관리 삭제
        deleteTjUnitJobProc() {
            const $this = this;
            let params = null;
            params = $this.unitJobDetl;

            $this.doPost('/mng/job/unitJobMng/deleteTjUnitJob.hb', params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    $this.alert('삭제 처리 되었습니다.').then((result) =>{
                        if( result.isConfirmed){
                            $this.resetUnitJobInfo();
                        }
                    });
                    
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },
        testUnitJobDetlPop() {
            let $this = this;
            let sql = $this.unitJobDetl.sql;

            const url = '/mng/job/unitJobDetlPop/testUnitJobDetlPop.hb';            
            let params = {};
            params.dbConnId = $this.unitJobDetl.dbConnId;
            params.sql = sql;

            if(this.ValdUtil.isNull(params.dbConnId) || this.ValdUtil.isNull(params.sql)) {
                $this.alert('DB연결ID 혹은 처리문장(SQL)이 없습니다.');
                return false;
            }

            $this.doPost(url, params).then((res) => {
                if (res.data.rtnData.result.length > 1) {
                    $this.alert(res.data.rtnData.result[1]);
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
            $this.chkData.isTestSql = true;
        },
        // 단위작업 검색 팝업
        unitJobSrchPop() {
            this.params.srchUnitJob = this.unitJobDetl.unitJobNo;
            this.$refs.UnitJobSrchModal.show();
            this.$refs.UnitJobSrchModal.initGrid();
        },   
        // 단위작업 검색 팝업 리턴 데이터
        getPopRowData(popRowData) {
            this.unitJobDetl.unitJobNo = popRowData.unitJobNo;
        },
        setFocus() {
            this.$nextTick(()=>{
                this.$refs.refUnitJobNo.focus();
            })
        },
    },
    mounted: function() {  
        const $this = this; 
        $this.init();

        /**
         * [완료] 저장(SQL문만), 삭제 기능 추가
         * 
         * [완료] ② 삭제시 해당 단위작업이 작업셋에 할당되어 있는 경우 “해당 단위작업은 작업셋:000에 배정되어 있습니다. 정말로 삭제하시겠습니까? 삭제시 작업셋에서 단위작업을 삭제처리해야 합니다.” confirm 후 처리함
         * [완료] ③ 해당 단위작업이 작업셋에 할당되지 않은 경우에는 “정말로 해당 단위작업을 삭제하시겠습니까?” confim 후 처리함
         * [완료] 그러면 작업대상테이블에 해당 단위작업들 모두 삭제해야 하는데.. 작업순서가 연속적이지 않게 될 수도 있네?
         * 그리고.. 상위단위작업과 하위단위작업 개념이 추가 됐다는데.. 삭제 시 제약 조건은?
         */
        /**
         * 상위단위작업, 할당된 작업셋들 화면에 추가하기
         */
    },
}
</script>