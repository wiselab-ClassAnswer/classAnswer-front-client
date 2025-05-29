
<template>
    <Modal ref="baseModal" :width="60">
        <div class="section-wrap">
            <h2>{{ pageTitle }}</h2>
            <div class="section-part part1 w-100">
                <div class="w-100 b">
                    <div class="w-25 ib">
                        <div class="wd-120 ib">
                            <span class="w-100 t-a-r p-r-10">교육과정번호</span>
                        </div>
                        <div class="c-wd-120 ib">
                            <input class="w-100" type="text" v-model="params.ecousNo" disabled >
                        </div>
                    </div>
                    <div class="w-75 ib">
                        <div class="wd-120 ib">
                            <span class="w-100 t-a-r p-r-10">교육과정명</span>
                        </div>
                        <div class="c-wd-120 ib">
                            <input class="w-100" type="text" v-model="params.ecousNm" disabled >
                        </div>
                    </div>
                </div>
            </div>
            <div class="section-part part1 w-100">
                <div class="w-100 b">
                    <div class="w-25 ib">
                        <div class="wd-120 ib">
                            <span class="w-100 t-a-r p-r-10">모델번호</span>
                        </div>
                        <div class="c-wd-120 ib">
                            <input class="w-100" type="text" v-model="params.gmdlNo" disabled >
                        </div>
                    </div>
                    <div class="w-25 ib">
                        <div class="wd-120 ib">
                            <span class="w-100 t-a-r p-r-10">제한대상</span>
                        </div>
                        <div class="c-wd-120 ib">
                            <input class="w-100" type="text" v-model="params.gmdlLmitObjNm" disabled >
                        </div>
                    </div>
                    <div class="w-50 ib">
                        <div class="wd-120 ib">
                            <span class="w-100 t-a-r p-r-10">제한사유</span>
                        </div>
                        <div class="c-wd-120 ib">
                            <input class="w-100" type="text" v-model="params.gmdlLmitResnNm" disabled >
                        </div>
                    </div>
                </div>
                <div class="w-100 b">
                    <div class="w-25 ib">
                        <div class="wd-120 ib">
                            <span class="w-100 t-a-r p-r-10">수강생ID</span>
                        </div>
                        <div class="c-wd-120 ib">
                            <input class="w-100" type="text" v-model="params.stdtId" disabled >
                        </div>
                    </div>
                    <div class="w-25 ib">
                        <div class="wd-120 ib">
                            <span class="w-100 t-a-r p-r-10">현재 토큰 사용량</span>
                        </div>
                        <div class="c-wd-120 ib">
                            <input class="w-100 t-a-r" type="text" v-model="params.currToknCnt" disabled >
                        </div>
                    </div>
                    <div class="w-25 ib">
                        <div class="wd-120 ib">
                            <span class="w-100 t-a-r p-r-10">현재 토큰 허용량</span>
                        </div>
                        <div class="c-wd-120 ib">
                            <input class="w-100 t-a-r" type="text" v-model="params.currLmitToknCnt" disabled >
                        </div>
                    </div>
                    <div class="w-25 ib">
                        <div class="wd-120 ib">
                            <span class="w-100 t-a-r p-r-10">변경할 토큰 허용량</span>
                        </div>
                        <div class="c-wd-120 ib">
                            <input class="w-100 t-a-r" type="text"
                                ref="chngLmitToknCnt"
                                v-model="params.chngLmitToknCnt" :disabled="isPageDiv === 'lmit'"
                                @input="setFormatNum(params.chngLmitToknCnt)"
                                @focus="CmonUtil.focusInput($refs.chngLmitToknCnt)">
                        </div>
                    </div>
                </div>
                <div class="w-100 b">
                    <div class="text-box">
                        <div class="wd-120 ib">
                            <span class="w-100 t-a-r p-r-10">제한내용</span>
                        </div>
                        <div class="c-wd-120 ib">
                            <textarea class="w-100 ta-r-n" v-model="params.lmitResn" 
                                :disabled="isPageDiv === 'rels'">
                            </textarea>
                        </div>
                    </div>
                </div>
                <div class="w-100 t-a-c b">
                    <span class="w-100 guidTextRed" v-if     ="isErrDiv == 'lmit'">* 제한시 제한 사유를 작성해야 합니다.</span>
                    <span class="w-100 guidTextRed" v-else-if="isErrDiv == 'rels'">* 변경/해제시 "변경토큰 허용량"을 지정해야 합니다.</span>
                    <p    class="w-100"             v-else></p>
                </div>
            </div>
        </div>
        
        <div class="button-box1 m-t-20">
            <button class="btn-normal m-r-5" @click="updateUserCnfm">{{ pageTitle }}</button>
            <button class="btn-normal"       @click="cancel">닫기</button>
        </div>

    </Modal>
</template>

<script>
import { reactive, ref, inject } from 'vue'
import Modal    from '@/components/dialog/modal.vue'
import Grid     from '@/components/grid/Grid.vue'
import { ValdUtil } from '@/utils/ValdUtil';
import { CmonUtil } from '@/utils/CmonUtil';
import { noAuto } from '@fortawesome/fontawesome-svg-core';

export default {
    components: {
        Modal,
        Grid,
    },
    setup() {
        // baseModal 선언
        const baseModal = ref(null);
        // baseModal 오픈
        const show = () => {
            baseModal.value.open();
        }
        // baseModal 닫기
        const cancel = () => {
            baseModal.value.close();
        }

        let code = reactive({
            gmdlLmitResnCdList : [],
        })

        const getCmonCdList = inject('getCmonCdList');
        getCmonCdList('GMDL_LMIT_RESN_CD', code.gmdlLmitResnCdList, 'N', null);

        return {
            baseModal,
            show,
            cancel,
            code
        }
    },
    data: function () {
        return {
            params: {
                ecousNo         : '',   // 교육과정 번호
                ecousNm         : '',   // 교육과정 명
                stdtId          : '',   // 수강생 ID
                currToknCnt     : '',   // 현재 토큰 사용량
                currLmitToknCnt : '',   // 현재 토근 허용량
                gmdlNo          : '',   // 모델 번호
                lmitNo          : '',   // 제한 번호
                gmdlLmitObjCd   : '',   // 제한 대상 코드
                gmdlLmitObjNm   : '',   // 제한 대상 명
                gmdlLmitResnCd  : '',   // 제한 상태 코드
                gmdlLmitResnNm  : '',   // 제한 상태 명
                lmitResn        : '',   // 제한 사유
                chngLmitToknCnt : '',   // 변경 토큰 허용량
            },
            selectedData : '',
            pageTitle     : '',          // 팝업 타이틀
            isPageDiv    : '',          // 제한, 변경 / 해제 여부
            isErrDiv     : '',          // 에러 구분
        }
    },
    methods: {
        // 초기화
        init(data) {
            const $this = this;
            $this.initData(data);
        },
        initData(data){
            const $this = this;            
            if(ValdUtil.isNotNull(data)){
                $this.params.ecousNo         = data.ecousNo;        // 교육과정 번호
                $this.params.ecousNm         = data.ecousNm;        // 교육과정 명
                $this.params.stdtId          = data.userId;         // 수강생 ID
                $this.params.currToknCnt     = CmonUtil.formatComma(data.totTokn);        // 현재 토큰 사용량
                $this.params.currLmitToknCnt = CmonUtil.formatComma(data.lmitTokn);       // 현재 토큰 허용량
                $this.params.gmdlNo          = data.gmdlNo;         // 모델 번호
                $this.params.lmitNo          = data.gmdlLmitNo;     // 제한 번호
                $this.params.gmdlLmitObjCd   = data.gmdlLmitObjCd   // 제한 대상 코드
                $this.params.gmdlLmitObjNm   = data.gmdlLmitObjNm   // 제한 대상 명
                $this.params.gmdlLmitResnCd  = data.gmdlLmitResnCd  // 제한 상태 코드
                $this.params.gmdlLmitResnNm  = data.gmdlLmitResnNm  // 제한 상태 명
                $this.params.lmitResn        = data.lmitResn        // 제한 사유
                
                $this.isPageDiv              = data.isPageDiv;
                $this.isErrDiv               = '';          // 에러 구분
                if ($this.isPageDiv === 'lmit') {
                    $this.pageTitle = '제한설정';
                } else if ($this.isPageDiv === 'rels') {
                    $this.pageTitle = '변경/해제';
                }
            }
            $this.params.chngLmitToknCnt  = '';
        },
        // 저장 전 유효성 체크
        updateUserCnfm(){
            const $this = this;
            if($this.isPageDiv === 'lmit'){
                if(ValdUtil.isNull($this.params.lmitResn)){
                    $this.isErrDiv = $this.isPageDiv;
                    return false;
                } else {
                    $this.updateUserLmit();
                }
            } else if($this.isPageDiv === 'rels'){
                if(ValdUtil.isNull($this.params.chngLmitToknCnt)){
                    $this.isErrDiv = $this.isPageDiv;
                    return false;
                } else {
                    if(CmonUtil.extractNumbers($this.params.currLmitToknCnt) > CmonUtil.extractNumbers($this.params.chngLmitToknCnt)){
                        $this.confirm({
                            content  :  "입력한 토큰 허용량이 현재 설정된 값보다 적습니다. <br> 변경하시겠습니까?",
                            callback : {
                                yes() {
                                    $this.updateUserLmit();
                                } 
                            }
                        })
                    } else{
                        $this.updateUserLmit();
                    }
                }
            }
        },

        // 제한 / 변경 처리
        updateUserLmit(){
            const $this = this;

            let msg = this.isPageDiv === 'lmit'? '제한 처리 되었습니다.': this.isPageDiv === 'rels'? '변경/해제 처리 되었습니다.' : '';
            let params = {
                ecousNo     : $this.params.ecousNo,
                userId      : $this.params.stdtId,
                gmdlNo      : $this.params.gmdlNo,
                lmitNo      : $this.params.lmitNo,
                lmitResn    : $this.params.lmitResn,
                lmitToknCnt : CmonUtil.filterSpecialChar($this.params.chngLmitToknCnt),
                lmitDiv     : $this.isPageDiv,
            };
            $this.doPost('/cmon/sys/stdtMng/updateUserLmit.hb', params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {

                    $this.alert(msg).then((result) => {
                        if ( result.isConfirmed ) {
                           $this.save(params);
                        }
                    });
                } else {
                    $this.alert(result.rtnMsg);
                }
            });

        }, 
        save(params){
            const $this = this;
            $this.$emit('userLmitData', params);
            $this.cancel();
        },
        cancel(){
            const $this = this;
            $this.cancel();
        },
         // 넘버 포멧팅
         setFormatNum(val) {
            const $this = this;
            let filterVal = CmonUtil.filterSpecialChar(val);
            let addComma = $this.thousandComma(CmonUtil.toInt(filterVal));
            
            $this.params.chngLmitToknCnt = addComma;
        },
    },
    computed:{
    },
}
</script>
