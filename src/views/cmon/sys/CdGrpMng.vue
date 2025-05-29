<template>
    <Modal ref="baseModal" :width="30">
        <div class="section-wrap">
            <h2>코드그룹관리</h2>
            <div class="section-wrap">
                <div class="section-part part1">
                    <div class="b">
                        <span class="wd-70">코드그룹</span>
                        <input class="w-80" type="text" v-model="cdGrpInfo.cdGrp" :disabled="params.crud=='U'">
                    </div>
                    <div class="b">
                        <span class="wd-70">코드그룹명</span>
                        <input class="w-80" type="text" v-model="cdGrpInfo.cdGrpNm">
                    </div>
                    <div class="b">
                        <span class="wd-70">사용여부</span>
                        <select class="w-80" v-model="cdGrpInfo.useYn">
                            <option value = 'Y'>사용</option>
                            <option value = 'N'>미사용</option>
                        </select>
                    </div>
                    <div class="b">
                        <span class="wd-70">등록일자</span>
                        <input class="w-80" type="text" v-model="cdGrpInfo.regiDt" :disabled="true">
                    </div>
                    <div class="b">
                        <span class="wd-70">수정일자</span>
                        <input class="w-80" type="text" v-model="cdGrpInfo.updtDt" :disabled="true">
                    </div>
                </div>
            </div>
        </div>

        <div class="button-box1 m-t-20">
            <button class="btn-normal m-r-5" @click="saveCdGrp">저장</button>
            <button class="btn-normal m-r-5" @click="deleteCdGrp" :disabled="params.crud =='C'">삭제</button>
            <button class="btn-normal"       @click="close">닫기</button>
        </div>
               
    </Modal>
</template>

<script>


import { ref, reactive, inject } from 'vue'
import Modal from '@/components/dialog/modal.vue'
import Grid from '@/components/grid/Grid.vue';
import { ValdUtil } from '@/utils/ValdUtil';
import { DateUtil } from '@/utils/DateUtil';

export default {
    components: {
        Modal
       ,Grid
    },
    props:{
        dataParams:{
            type: Object,
            default: {}
        },
    },

    setup() {        
        const baseModal = ref(null);
        const show = () => {
            baseModal.value.open();
        }
        // const cancel = () => {
        //     baseModal.value.close();
        // }

        return {
            baseModal,
            show,
            // cancel,
        }
    },

    data() {
        return {
            params: {
                cdGrp   : '',
                crud    : 'C',
            },
            cdGrpInfo: {
                cdGrp   : '',
                cdGrpNm : '',
                useYn   : 'Y',
                regiDt  : '',
                updtDt  : '',
            },
        }
    },

    methods: {
        init(data) {
            const $this = this;
            $this.resetScreen();
            if(ValdUtil.isNotNull(data)){
                $this.params.cdGrp = data;
                $this.selectCdGrpInfo();
            }
        },

        // 화면 초기화
        resetScreen(){
            const $this = this;
            $this.resetParams();
            //  코드그룹 초기화
            $this.resetCdGrpInfo();
        },
        resetParams(){
            const $this = this;
            $this.params = {
                cdGrp   : '',
                crud    : 'C',
            }
        },

        // 코드그룹 초기화
        resetCdGrpInfo() {
            const $this = this;
            $this.cdGrpInfo = {
                cdGrp   : '',
                cdGrpNm : '',
                useYn   : 'Y',
                regiDt  : '',
                updtDt  : '',
            };
        },
        // 코드그룹 조회
        selectCdGrpInfo() {
            const $this = this;
            let params = {
                cdGrp : $this.params.cdGrp
            }
            $this.doPost('/cmon/sys/cdGrpMng/selectCdGrp.hb', params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    console.log("res",res);
                    $this.cdGrpInfo        = result.rtnData.cdGrpInfo;
                    $this.cdGrpInfo.regiDt = DateUtil.getFormatDate(result.rtnData.cdGrpInfo.regiDt, 'YYYY-MM-DD');
                    $this.cdGrpInfo.updtDt = DateUtil.getFormatDate(result.rtnData.cdGrpInfo.updtDt, 'YYYY-MM-DD');
                    $this.params.crud      = 'U';
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },
        // 코드그룹 저장
        saveCdGrp() {
            const $this = this;
            // null 체크 및 길이 체크 (data / 길이 / msg / null 체크 여부=디폴트 true)
            if(!$this.ValdUtil.valdLenNull($this.cdGrpInfo.cdGrp,    20,  '코드그룹은'))   return false;
            if(!$this.ValdUtil.valdLenNull($this.cdGrpInfo.cdGrpNm,  50,  '코드그룹명은')) return false;
            let params = {
                cdGrp   : $this.cdGrpInfo.cdGrp,
                cdGrpNm : $this.cdGrpInfo.cdGrpNm,
                useYn   : $this.cdGrpInfo.useYn,
                crud    : $this.params.crud
            }

            $this.doPost('/cmon/sys/cdGrpMng/saveCdGrp.hb', params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    $this.alert('저장되었습니다').then((result) => {
                        if( result.isConfirmed){
                            let params = _.cloneDeep($this.cdGrpInfo);
                            params['div'] ='save';
                            $this.cancel(params);
                        }
                    })
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },


        deleteCdGrp() {
            const $this = this;
            if ($this.params.crud =='U') {
                $this.confirm({
                    content : '삭제하시겠습니까?',
                    callback: {
                        yes: function() {
                            let params = {
                                cdGrp : $this.cdGrpInfo.cdGrp
                            } 
                            $this.doPost('/cmon/sys/cdGrpMng/deleteCdGrp.hb', params).then(function (res) {
                                let result = res.data;
                                if (result.rtnCd == '0000') {
                                    $this.alert('삭제되었습니다.').then((result) => {
                                        if( result.isConfirmed){
                                            let params = _.cloneDeep($this.cdGrpInfo);
                                            params['div'] ='delt';
                                            $this.cancel(params);
                                        }
                                    });
                                } else {
                                    $this.alert(result.rtnMsg);
                                }
                            })
                        }
                    }
                })
            } 
        },

        cancel(params) {
            const $this = this;
            $this.$emit('onClose', params);
            $this.close();
        },
        close(){
            const $this = this;
            $this.baseModal.close();
        },
    },

    mounted: function() {  
        const $this = this; 
        $this.init();
    },
}
</script>
