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
                                        <input type="text" v-model="pwsdChngParams.userId">
                                    </div>
                                </div>

                                <div class="content-container">
                                    <div class="title vw-1"><span>인증번호</span></div>
                                    <div class="content vw-1">
                                        <input type="text" maxlength="4" v-model="pwsdChngParams.authNo">
                                    </div>
                                </div>
                                <div class="content-container">
                                    <div class="content vw-1">
                                        <button @click="requestAuthNo()">인증번호 요청</button>
                                    </div>
                                </div>

                                <div class="content-container">
                                    <div class="title vw-1"><span>새 비밀번호</span></div>

                                    <div class="content vw-3">
                                        <input type="password" v-model="pwsdChngParams.userPwsd">
                                    </div>
                                </div>

                                <div class="content-container">
                                    <div class="title vw-1"><span>새 비밀번호 확인</span></div>

                                    <div class="content vw-3">
                                        <input type="password" v-model="pwsdChngParams.pwsdCheck">
                                    </div>
                                </div>
                            </div>
                        </div>

                         <div>
                            <p v-if="showPswdDiffMsg" class="guidTextRed m-0 p-0">
                                * 입력한 비밀번호가 서로 다릅니다
                            </p>
                             <p v-if="showPswdValidPatternMsg" class="guidTextRed m-0 p-0">
                                 * 비밀번호는 반드시 영문대소문자, 숫자, 특수문자의 조합으로 작성해야 합니다.
                             </p>   
                         </div>


                        <div class="button-box1 m-t-20 g-10">
                            <button class="btn-normal wd-100 h-30" @click="chngNewPswd">확인</button>

                            <button class="btn-normal wd-100 h-30"  @click="cancel">닫기</button>
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
            pwsdChngParams : {
                userId              : '',     //아이디
                authNo             : '',     //인증번호
                userPwsd            : '',     //비밀번호
                pwsdCheck           : ''      //비밀번호 확인
            },
            isAuthConfirmed         : false,
            showPswdDiffMsg         : false,  //패스워드 불일치 메시지 표시여부
            showPswdValidPatternMsg : false   //패스워드 패턴 메시지 표시여부
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

            $this.pwsdChngParams.userId    = '';
            $this.pwsdChngParams.authNo   = '';
            $this.pwsdChngParams.userPwsd  = '';
            $this.pwsdChngParams.pwsdCheck = '';

            $this.isAuthConfirmed          = false;
            $this.showPswdDiffMsg          = false;
            $this.showPswdValidPatternMsg  = false;
        },

        //유효성 검사
        validCheck(type) {
            const $this = this;

            //인증번호 요청 버튼, 비밀번호 변경 버튼에 대한 공통 유효성 검사
            if (ValdUtil.isNull($this.pwsdChngParams.userId)) {
                $this.alert("아이디(은)는 반드시 입력해야 합니다.");
                return false;
            }

            //비밀번호 변경 버튼에 대한 공통 유효성 검사
            if (type) {
                if (!$this.isAuthConfirmed) {
                    $this.alert("인증번호 요청을 하시기 바랍니다.");
                    return false;
                }

                if (ValdUtil.isNull($this.pwsdChngParams.authNo)) {
                    $this.alert("인증번호(은)는 반드시 입력해야 합니다.");
                    return false;
                }

                if (ValdUtil.isNull($this.pwsdChngParams.userPwsd)) {
                    $this.alert("비밀번호(은)는 반드시 입력해야 합니다.");
                    return false;
                }

                if (ValdUtil.isNull($this.pwsdChngParams.pwsdCheck)) {
                    $this.alert("비밀번호 확인(은)는 반드시 입력해야 합니다.");
                    return false;
                }
                
                if ($this.pwsdChngParams.userPwsd.length < 8 || $this.pwsdChngParams.userPwsd.length > 15) {
                    $this.alert("비밀번호는 8자리이상 15자이하입니다.");
                    return false;
                }

                if ($this.pwsdChngParams.userPwsd !== $this.pwsdChngParams.pwsdCheck) {
                    $this.alert("비밀번호가 일치하지 않습니다.");

                    $this.showPswdDiffMsg = true;
                    return false;
                }

                if (!ValdUtil.isValidPassword($this.pwsdChngParams.userPwsd)) {
                    $this.alert("특수문자, 알파벳, 숫자를 넣으세요.");

                    $this.showPswdValidPatternMsg = true;
                    return false;
                }
            }

            $this.showPswdDiffMsg = false;
            $this.showPswdValidPatternMsg = false;

            return true;
        },

        //비밀번호 변경
        chngNewPswd() {
            const $this = this;

            //유효성 검사
            if (!$this.validCheck('pwChng')) {
                return false;
            }

            //유저 아이디 체크
            //인증번호 입력할 때 하지만 사용자가 아무 아이디, 인증번호를 넣고 누를수도 있으니 한번 더 체크
            $this.checkUserId().then(function(isValid) {
                if (!isValid) {
                    return false;
                }

                $this.doPost(`/cmon/sys/auth/updateUserPswd.hb`, $this.pwsdChngParams)
                    .then(function(res) {
                        if (res.data.rtnCd == '9999') {
                            $this.alert(res.data.rtnMsg);
                        } else {
                            $this.alert("비밀번호가 변경되었습니다.");
                            $this.cancel();
                        }
                    })
                    .catch(function(error) {
                        $this.CmonUtil.processLoading(false);
                        if (error.response?.data?.message) {
                            $this.alert(error.response.data.message);
                        }
                    });
            })
        },

        //인증번호 요청
        requestAuthNo() {
            const $this = this;

            $this.checkUserId().then(function(isValid) {
                if (!isValid) {
                    return;
                }

                const params = {
                    userId : $this.pwsdChngParams.userId
                }
                
                $this.doPost(`/cmon/sys/auth/sendEmail.hb`, params)
                    .then(function(res) {
                        if (res.status === 200) {
                            const rtnMsg = res.data.rtnMsg;

                            //정상 처리
                            if (res.data.rtnCd === '0000') {
                                $this.isAuthConfirmed = true;
                            }

                            $this.alert(rtnMsg);

                        }
                    })
                    .catch(function(error) {
                        $this.CmonUtil.processLoading(false);
                        if (error.response?.data?.message) {
                            $this.alert(error.response.data.message);
                        }
                    });
            });
        },

        //유저 아이디 체크
        checkUserId() {
            const $this = this;

            return new Promise((resolve, reject) => {
                if (!$this.validCheck()) {
                    resolve(false);
                    return;
                }

                $this.CmonUtil.processLoading(true);

                const params = {
                    userId : $this.pwsdChngParams.userId
                }

                $this.doPost(`/cmon/sys/auth/selectChckUserId.hb`, params)
                    .then(function(res) {
                        $this.CmonUtil.processLoading(false);

                        if (res.data.rtnCd === '9999') {
                            $this.alert(res.data.rtnMsg);
                            resolve(false);
                            return;
                        }
                        resolve(true);
                    })
                    .catch(function(error) {
                        $this.CmonUtil.processLoading(false);
                        if (error.response?.data?.message) {
                            $this.alert(error.response.data.message);
                        }
                        resolve(false);
                    });
            });
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
    },
    mounted: function () {
        this.init();
    }
}
</script>