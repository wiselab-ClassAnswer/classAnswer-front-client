<template>
    <Modal ref="baseModal" :width="33">       
            <div class="section-wrap">
                <h2>회원가입 신청</h2>
                
                <div class="privacy_modal_wrap">
                    <div class="content-wrapper">

                        <!-- 구성원 정보 파트 -->
                        <div class="">
                            <div class="">
                                <div class="content-container">
                                    <div class="title vw-1"><span class="essn-b">아이디</span></div>

                                    <div class="content vw-3">
                                        <input type="text" v-model="params.userId">
                                    </div>
                                </div>

                                <div class="content-container">
                                    <div class="title vw-1"><span class="essn-b">성명</span></div>
                                    <div class="content vw-1">
                                        <input type="text" v-model="params.userNm">
                                    </div>
                                </div>
                                <div class="content-container">
                                     <div class="title vw-1"><span class="essn-b">이메일주소</span></div>
                                    <div class="content vw-1">
                                        <input type="text" v-model="params.emalAddr">
                                    </div>
                                </div>

                                <!-- 수정 필요 -->
                                <div class="content-container">
                                    <div class="title vw-1"><span class="essn-b">계약번호</span></div>

                                    <div class="content vw-3">
                                        <input type="text" v-model="params.contNo">
                                    </div>
                                </div>
                                
                                <div class="content-container">
                                    <div class="title vw-1"><span class="essn-b">인증번호</span></div>

                                    <div class="content vw-1">
                                        <input type="text" maxLength="4" v-model="params.authNo">
                                    </div>

                                    <div class="content vw-1">
                                        <button @click="requestAuthNum()">인증번호 요청</button>
                                    </div>
                                </div>
                                
                                <div class="content-container">
                                    <div class="title vw-1"><span>비밀번호</span></div>

                                    <div class="content vw-3">
                                        <input type="text" v-model="params.userPswdChk">
                                    </div>
                                </div>    

                                <div class="content-container">
                                    <div class="title vw-1"><span>비밀번호 확인</span></div>

                                    <div class="content vw-3">
                                        <input type="text" v-model="params.userPswdChk">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 오류 메시지 영역 -->
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
                                <button class="btn-normal wd-100 h-30" @click="joinAprv">가입신청</button>
                            </div>
                            <div class="privacy_wrap_btn">
                                <button class="btn-normal wd-100 h-30" @click="cancel">취소</button>
                            </div>
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
            params : {
                userId      : '', //아아디     
                userNm      : '', //이름
                emalAddr    : '', //이메일
                contNo      : '', //계약번호 
                authNo      : '', //인증번호
                userPwsd    : '', //비밀번호
                userPswdChk : '', //비밀번호 확인

                //화면 정의서에는 없는 항목 (수정 필요)
                mphnNo      : '', //휴대폰 번호
                psno        : '', //우편번호
                baseAddr    : '', //기본주소
                specAddr    : '', //상세주소

                //학교 (수정 필요)
                //학교코드
                //학년
                //반
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

            $this.params.userId           = ''; // 아이디
            $this.params.userNm           = ''; // 이름
            $this.params.emalAddr         = ''; // 이메일
            $this.params.contNo           = ''; // 계약번호
            $this.params.authNo           = ''; // 인증번호
            $this.params.userPwsd         = ''; // 비밀번호
            $this.params.userPswdChk      = ''; // 비밀번호 확인

            // 화면 정의서에는 없는 항목 (수정 필요)
            $this.params.mphnNo           = ''; // 휴대폰 번호
            $this.params.psno             = ''; // 우편번호
            $this.params.baseAddr         = ''; // 기본주소
            $this.params.specAddr         = ''; // 상세주소

            $this.isAuthConfirmed         = '';
            $this.showPswdDiffMsg         = '';
            $this.showPswdValidPatternMsg = '';
        },

        //유효성 검사
        validCheck(type) {
            const $this = this;

            //인증번호 요청 버튼, 가입신청 버튼 클릭에 대한 공통 유효성 검사
            if (ValdUtil.isNull($this.params.userId)) {
                $this.alert("아이디(은)는 반드시 입력해야 합니다.");
                return false;
            }

            if (ValdUtil.isNull($this.params.userNm)) {
                $this.alert("이름(은)는 반드시 입력해야 합니다.");
                return false;
            }

            if (ValdUtil.isNull($this.params.emalAddr)) {
                $this.alert("이메일(은)는 반드시 입력해야 합니다.");
                return false;
            }

            if (!ValdUtil.checkEmail($this.params.emalAddr)) {
                $this.alert("올바른 이메일 형식이 아닙니다.");
                return false;
            }

            //가입신청 버튼에 대한 유효성 검사
            if (type) {
                if (!$this.isAuthConfirmed) {
                    $this.alert("인증번호 요청을 하시기 바랍니다.");
                    return false;
                }

                if (ValdUtil.isNull($this.params.authNo)) {
                    $this.alert("인증번호(은)는 반드시 입력해야 합니다.");
                    return false;
                }

                if (ValdUtil.isNull($this.params.userPwsd)) {
                    $this.alert("비밀번호(은)는 반드시 입력해야 합니다.");
                    return false;
                }

                if (ValdUtil.isNull($this.params.pwsdCheck)) {
                    $this.alert("비밀번호 확인(은)는 반드시 입력해야 합니다.");
                    return false;
                }

                if ($this.params.userPwsd.length < 8 || $this.params.userPwsd.length > 15) {
                    $this.alert("비밀번호는 8자리이상 15자이하입니다.");
                    return false;
                }

                if ($this.params.userPwsd !== $this.params.pwsdCheck) {
                    $this.alert("비밀번호가 일치하지 않습니다.");

                    $this.showPswdDiffMsg = true;
                    return false;
                }

                if (!ValdUtil.isValidPassword($this.params.userPwsd)) {
                    $this.alert("특수문자, 알파벳, 숫자를 넣으세요.");

                    $this.showPswdValidPatternMsg = true;
                    return false;
                }

                //개인정보 동의 여부 유효성 검사 필요

                /*
                    소속 정보 유효성 검사 필요
                     - 학교
                     - 학년
                     - 반
                */
            }

            return true;
        },

        //계약건이 있는 아이디 존재하는지 체크
        chckContUserId() {
            const $this = this;

            return new Promise((resolve, reject) => {
                if (!$this.validCheck()) {
                    resolve(false);
                    return;
                }

                $this.CmonUtil.processLoading(true);

                const params = {
                    userId : $this.params.userId,
                    userNm : $this.params.userNm,
                    emalAddr : $this.params.emalAddr
                }

                $this.doPost(`/cmon/sys/join/selectContChckUsrId.hb`, params)
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
                    })
            })

        },

        //인증번호 전송
        requestAuthNum() {
            const $this = this;
            
            $this.chckContUserId().then(function(isValid) {
                if (!isValid) {
                    return ;
                }

                const params = {
                    userId : $this.params.userId
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
                    })
            })
        },

        //가입 신청
        joinAprv() {
            const $this = this;

            if (!$this.validCheck('join')) {
                return false;                
            }

            /*
                가입 신청 서버 작업
                    - 입력한 인증번호와 서버와 다를 경우 처리
                    - 회원가입 신청 접수 (서비스 관리자가 승인)
                    - 이미 동일한 계정으로 신청한 경우, 현재 신청한 정보로 갱신
            */

            //유저 아이디 체크
            //인증번호 입력할 때 하지만 사용자가 아무 아이디, 인증번호를 넣고 누를수도 있으니 한번 더 체크
            $this.chckContUserId().then(function(isValid) {
                if (!isValid) {
                    return ;
                }

                //가입 신청
                $this.doPost(`/cmon/sys/join/join.hb`, $this.params)
                    .then(function (res) {
                        
                    })
                    .catch(function(error) {
                        $this.CmonUtil.processLoading(false);
                        if (error.response?.data?.message) {
                            $this.alert(error.response.data.message);
                        }
                    })
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