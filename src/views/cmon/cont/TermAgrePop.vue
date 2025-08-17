<template>
    <Modal ref="baseModal" :width="50">       
        <div class="section-wrap">
            <h2>이용약관 상세</h2>
            
            <div class="privacy_modal_wrap">
                <div class="content-wrapper">

                    <div v-html="termInfo.termCntn" style="height:500px; overflow:scroll; border: 1px solid lightgrey"></div>

                    <div class="button-box1 m-t-20 g-10">
                            <button class="btn-normal wd-100 h-30" @click="agreeTerm">동의</button>

                        <button class="btn-normal wd-100 h-30" @click="cancel">취소</button>
                    </div>
                </div>
            </div>
        </div>  <!-- 최초로그인 팝업 완료 -->
    </Modal> <!-- Modal 종료-->
</template>

<script>

import Modal from '@/components/dialog/modal.vue';

export default {
    components: {
        Modal
    },
    data: function () {
        return { 
            params: {
                termDivCd: ''
            },
            termInfo: {
                termCntn: ''
            }
        }
    },
    methods: {
        init: function (termDivCd) {
            const $this = this;

            $this.initData(termDivCd);
            $this.selectTerm();
        },

        initData: function (termDivCd) {
            const $this = this;

            $this.params.termDivCd = termDivCd;
        },

        agreeTerm() {
            const $this = this;

            const termDivCd = $this.params.termDivCd;
            $this.emitter.emit('setAgree', termDivCd);

            $this.cancel();
        },

        selectTerm() {
            const $this = this;
            $this.doPost(`/cmon/cont/term/select.hb`, $this.params)
                .then(function (res) {
                     $this.termInfo.termCntn = res.data.rtnData.result.termCntn;
                    if (res.status === 200) {
                        if (res.data.rtnCd === '0000') {
                           
                        }
                    }
                })
                .catch(function(error) {
                    if (error.response?.data?.message) {
                        $this.alert(error.response.data.message);
                    }
                })
        },

        // 모달 표시
        show() {
            this.$refs.baseModal.open();
        },

        // 모달 닫기
        cancel() {
            this.$refs.baseModal.close();
        },
    },
    mounted: function () {
        this.init();
    }
}
</script>


<style scoped>
</style>