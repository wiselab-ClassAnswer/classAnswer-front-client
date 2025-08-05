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
                                    <div class="content vw-1"><input type="text" v-model="pwsdChngParams.authNum"></div>
                                </div>
                                <div class="content-container">
                                    <div class="content vw-1">
                                        <button @click="requestAuthNum()">인증번호 요청</button>
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

export default {
    data: function () {
        return {
            authParams: {
                userId          : '', //유저 아이디
            },
            pwsdChngParams      : {
                authNum         : '', //인증번호
                userPwsd        : '', //비밀번호
                pwsdCheck       : ''  //비밀번호 확인
            },
            isAuthConfirmed     : false,
            showPswdDiffMsg     : false, //패스워드 불일치 메시지 표시여부
            showPswdValidPatternMsg : false  //패스워드 패턴 메시지 표시여부
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
            $this.pwsdChngParams.authNum   = '';
            $this.pwsdChngParams.userPwsd      = '';
            $this.pwsdChngParams.pwsdCheck = '';
            $this.showPswdDiffMsg          = false;
            $this.showPswdValidPatternMsg  = false;
        },

        //유효성 검사
        validCheck(type) {
            const $this = this;

            if ($this.authParams.userId === '') {
                $this.alert("아이디를 입력하세요.");
                return false;
            }

            if (type) {
                if (!$this.isAuthConfirmed) {
                    $this.alert("인증번호 요청을 하시기 바랍니다.");
                    return false;
                }

                if ($this.pwsdChngParams.authNum === '') {
                    $this.alert("인증번호를 입력하세요.");
                    return false;
                }

                if (!ValdUtil.valdLenNull($this.pwsdChngParams.userPwsd         , 15    , '비밀번호는'            ,true)) return false;
                if (!ValdUtil.valdLenNull($this.pwsdChngParams.pwsdCheck        , 15    , '비밀번호 확인은'        ,true)) return false;
                
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
            //인증번호 입력할 대 하지만 사용자가 아무 아이디, 인증번호를 넣고 누를수도 있으니 한번 더 체크
            $this.checkUserId().then(function(isValid) {
                if (!isValid) {
                    return false;
                }

                const params = {
                    ...$this.pwsdChngParams,
                    userId: $this.authParams.userId
                };


                $this.doPost(`/cmon/sys/auth/updateUserPswd.hb`, params)
                    .then(function(res) {
                        if (res.data.rtnCd == '9999') {
                            $this.alert(res.data.rtnMsg);
                        } else {
                            console.log(res);
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
        requestAuthNum() {
            const $this = this;

            $this.checkUserId().then(function(isValid) {
                if (!isValid) {
                    return;
                }
                $this.doPost(`/cmon/sys/auth/sendEmail.hb`, $this.authParams)
                    .then(function(res) {
                        if (res.data.rtnCd === '0000') {
                            const userId = res.data.rtnData.userId;

                            $this.alert(userId + "에 대한 메일계정으로 인증번호가 발송되었습니다. 메일 확인 후 인증번호를 기재해 주시기 바랍니다");
                            $this.isAuthConfirmed = true;
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

                $this.doPost(`/cmon/sys/auth/selectChckUserId.hb`, $this.authParams)
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

        // 리스트 조회
        selectList() {
            // 리스트 조회 로직 구현
        }
    },
    mounted: function () {
        
    }
}

</script>