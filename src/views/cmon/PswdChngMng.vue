<template>
    <Modal ref="baseModal" :width="33">       
            <div class="section-wrap">
                <h2>비밀번호 변경</h2>
                
                <div class="privacy_modal_wrap">
                    <div class="content-wrapper">

                        <!-- 구성원 정보 파트 -->
                        <div class="">
                            <div class="">
                                <div class="content-container">
                                    <div class="title vw-1"><span>아이디</span></div>

                                    <div class="content vw-3">
                                        <input type="text" v-model="authParams.userId">
                                    </div>
                                </div>

                                <div class="content-container">
                                    <div class="title vw-1"><span>인증번호</span></div>
                                    <div class="content vw-1"><input type="password" v-model="authParams.authNum"></div>
                                </div>
                                <div class="content-container">
                                    <div class="content vw-1">
                                        <button>인증번호 요청</button>
                                    </div>
                                </div>

                                <div class="content-container">
                                    <div class="title vw-1"><span>새 비밀번호</span></div>

                                    <div class="content vw-3">
                                        <input type="text" v-model="pwsdChngParams.userPwsd">
                                    </div>
                                </div>

                                <div class="content-container">
                                    <div class="title vw-1"><span>새 비밀번호 확인</span></div>

                                    <div class="content vw-3">
                                        <input type="text" v-model="pwsdChngParams.pwsdCheck">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 오류 메시지 영역-->
                        <div v-if="!pswdValdCheck">
                            <p class="guidTextRed m-0 p-0">* 입력한 비밀번호가 서로 다릅니다</p>
                            <p class="guidTextRed m-0 p-0">* 비밀번호는 반드시 영문대소문자, 숫자, 특수문자의 조합으로 작성해야 합니다.</p>   
                        </div>

                        <!-- 확인 버튼 (비밀번호 변경) -->
                        <div class="section-info-part">
                            <div class="privacy_wrap_btn">
                                <button class="btn-normal wd-100 h-30" @click="chngNewPswd">확인</button>
                            </div>
                        </div>

                        <!-- 닫기 버튼-->
                        <div class="button-box1 m-t-20">
                            <button class="btn-normal"  @click="cancel">닫기</button>
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
            authParams: {
                userId : '',    //유저 아이디
                authNum: '',    //인증번호
            },
            pwsdChngParams: {
                userId    : '', //유저 아이디
                userPwsd  : '', //비밀번호
                pwsdCheck : ''  //비밀번호 확인
            },
            pswdValdCheck : true
        }
    },
    methods: {
        init () {
            const $this = this;
            $this.initData();
        },

        //데이터 초기화
        initData () {
            const $this = this;

            $this.authParams.userId        = '';
            $this.authParams.authNum       = '';
            $this.pwsdChngParams.userId    = '';
            $this.pwsdChngParams.pwsd      = '';
            $this.pwsdChngParams.pwsdCheck = '';
        },

        //인증번호 요청
        requestAuthNum() {

        },

        // 모달 표시
        show() {
            this.$refs.baseModal.open();
        },

        // 모달 닫기
        cancel() {
            this.$refs.baseModal.close();
        },

        // 선택
        select() {
            // 선택 로직 구현
            this.cancel();
        },

        // 리스트 조회
        selectList() {
            // 리스트 조회 로직 구현
        }
    },
    mounted: function () {
        this.init();
    }
}
</script>