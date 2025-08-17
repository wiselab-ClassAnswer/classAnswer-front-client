<template>
    <Modal ref="baseModal" :width="18">       
            <div class="section-wrap">
                <h2>아이디 찾기</h2>
                
                <div class="privacy_modal_wrap">
                    <div class="content-wrapper">

                        <!-- 구성원 정보 파트 -->
                        <div class="">
                            <div class="">
                                <div class="content-container">
                                    <div class="title vw-1" ><span>성명</span></div>

                                    <div class="content vw-1">
                                        <input type="text" v-model="params.userNm">
                                    </div>
                                </div>

                                <div class="content-container">
                                    <div class="title vw-1"><span>전화번호</span></div>
                                    <div class="content vw-1">
                                        <input type="text" v-model="params.mphnNo">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="button-box1 m-t-20 g-10">
                             <button class="btn-normal" @click="findId">확인</button>

                            <button class="btn-normal"  @click="cancel">취소</button>
                        </div>
                    </div>
                </div>
        </div>  <!-- 최초로그인 팝업 완료 -->
    </Modal> <!-- Modal 종료-->

</template>

<script>
import Modal from '@/components/dialog/modal.vue';
import { ValdUtil } from '@/utils/ValdUtil.js'

export default {
    components: {
        Modal
    },
    data: function () {
        return {
            params: {
                userNm: '', //유저 이름
                mphnNo: ''  //전화번호
            }
        }
    },
    methods: {
        init() {
            const $this = this;
            $this.initData();
        },

        initData() {
            const $this = this;

            $this.params.userNm = '';
            $this.params.mphnNo = '';
        },

        validCheck() {
            const $this = this;

            if (ValdUtil.isNull($this.params.userNm)) {
                $this.alert("성명(은)는 반드시 기재해야 합니다.");
                return false;
            }

            if (ValdUtil.isNull($this.params.mphnNo)) {
                $this.alert("전화번호(은)는 반드시 기재해야 합니다.");
                return false;
            }

            return true;
        },

        findId() {
            const $this = this;

            if (!$this.validCheck()) {
                return false;
            }

            $this.CmonUtil.processLoading(true);

            $this.doPost(`/cmon/sys/auth/findUserId.hb`, $this.params)
                .then(function(res) {
                     if (res.status === 200) {
                        $this.alert(res.data.rtnMsg).then((result) => {
                            if ( result.isConfirmed ) {
                                if (res.data.rtnCd === '0000') {
                                        $this.cancel();
                                    }
                            }
                        });
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