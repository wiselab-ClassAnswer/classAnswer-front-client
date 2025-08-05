<template>
    <Modal ref="baseModal" :width="50">
        <div class="content-section">
            <div class="section-wrap p-0">
                <h2>회원가입 신청</h2>
                <!-- 검색조건 영역 -->
                <div class="w-100">
                    <!-- 검색조건 -->
                    <div class="vw-5 ib">
                        <div class="line1 ib">
                            <div class="content-container">
                                <div class="title vw-1">
                                    <span>아이디</span>
                                </div>
                                <div class="content vw-2">
                                    <input type="text" v-model="params.userId" >
                                </div>
                            </div>
                            <div class="content-container">
                                <div class="title vw-1">
                                    <span>이름</span>
                                </div>
                                <div class="content vw-2">
                                    <input type="text" v-model="params.userName" >
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 버튼영역 -->
                    <div class="ib" style="width: calc(7.06vw *1.635)">
                        <div class="content-container w-100">
                            <div class="content w-100 t-a-r">
                                <button class="btn-normal wd-80" @click="submitJoin()">신청</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>        
        <div class="button-box1 m-t-20">
            <button class="btn-normal m-r-5" @click="submit">확인</button>
            <button class="btn-normal"  @click="cancel">닫기</button>
        </div>
    </Modal>

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
                userId: '',
                userName: ''
            }
        }
    },
    methods: {
        init() {
            this.initData();
        },

        initData() {
            this.params.userId = '';
            this.params.userName = '';
        },

        // 모달 표시
        show() {
            this.$refs.baseModal.open();
        },

        // 모달 닫기
        cancel() {
            this.$refs.baseModal.close();
        },

        // 확인
        submit() {
            // 확인 로직 구현
            this.cancel();
        },

        // 회원가입 신청
        submitJoin() {
            // 회원가입 신청 로직 구현
        }
    },
    mounted: function () {
        this.init();
    }
}

</script>