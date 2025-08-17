<template>
    <Modal ref="baseModal" :width="28">       
        <div class="section-wrap" style="height:800px; overflow:scroll">
            <h2>무료 회원가입 신청</h2>
            
            <div class="privacy_modal_wrap">
                <div class="content-wrapper">
                    
                    <p class="guidTextRed m-0 p-0 m-t-10">
                        * 회원가입은 교사만 가능합니다
                    </p>

                    <h2 class="m-t-30">인증 정보</h2> 

                    <div class="content-container">
                        <div class="title vw-1">
                            <span class="essn">아이디(메일주소)</span>
                        </div>

                        <div class="content vw-2">
                            <input type="text" v-model="params.userId">
                        </div>
                    </div>
                    
                    <div class="content-container">
                        <div class="title vw-1">
                            <span class="essn">성명</span>
                        </div>
                        <div class="content vw-2">
                            <input type="text" v-model="params.userNm">
                        </div>
                    </div>

                    <div class="content-container m-t-30">
                        <div class="title vw-1">
                            <span class="essn">인증번호</span>
                        </div>

                        <div class="content vw-1">
                            <input type="text" maxLength="4" v-model="params.authNo">
                        </div>

                        <div class="content vw-1">
                            <button @click="requestAuthNum()">인증번호 요청</button>
                        </div>
                    </div>

                    <div class="content-container">
                        <div class="title vw-1">
                            <span class="essn">비밀번호</span>
                        </div>

                        <div class="content vw-2">
                            <input type="text" v-model="params.userPswdChk">
                        </div>
                    </div>  

                    <div class="content-container">
                        <div class="title vw-1">
                            <span class="essn">비밀번호 확인</span>
                        </div>

                        <div class="content vw-2">
                            <input type="text" v-model="params.userPswdChk">
                        </div>
                    </div>

                    <h2 class="m-t-30">약관 동의</h2> 

                    <div class="box_container">
                        <div class="box_header">
                            <input type="checkbox" true-value="Y" false-value="N" v-model="totAgreeChk" @change="handleCheckbox()">
                            <span>전체 이용약관에 동의합니다.</span>
                        </div>

                        <div class="box_content_wrap">
                            <div class="box_content">
                                <input type="checkbox" v-model="params.agree01" true-value="Y" false-value="N" @change="updateTotalAgreeCheck">
                                <div class="terms-container">
                                    <label for="agree">
                                        <span class="bold">(필수)</span> 서비스 이용약관 동의
                                    </label>
                                    <button type="button" class="term-button" @click="openPop('term', 'SVCA')">상세 보기</button>
                                </div>
                            </div>
                            <div class="box_content">
                                <input type="checkbox" v-model="params.agree02" true-value="Y" false-value="N" @change="updateTotalAgreeCheck">
                                <div class="terms-container">
                                    <label for="agree">
                                        <span class="bold">(필수)</span> 개인정보 이용·수집 동의
                                    </label>
                                    <button type="button" class="term-button" @click="openPop('term', 'THRA')">상세 보기</button>
                                </div>
                            </div>
                            <div class="box_content">
                                <input type="checkbox" v-model="params.agree03" true-value="Y" false-value="N" @change="updateTotalAgreeCheck">
                                <div class="terms-container">
                                    <label for="agree">
                                        <span class="bold">(필수)</span> 제3자 개인정보제공 동의
                                    </label>
                                    <button type="button" class="term-button" @click="openPop('term', 'PRVA')">상세 보기</button>
                                </div>
                            </div>
                            <div class="box_content">
                                <input type="checkbox" v-model="params.agree04" true-value="Y" false-value="N" @change="updateTotalAgreeCheck">
                                <div class="terms-container">
                                    <label for="agree">
                                        <span class="bold">(필수)</span> 고유식별정보 처리 동의
                                    </label>
                                    <button type="button" class="term-button" @click="openPop('term', 'OIDA')">상세 보기</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="box_container">
                        <div class="box_header">
                            <span>다음을 선택한 알림을 수신하는데 동의합니다</span>
                        </div>

                        <div class="box_content_wrap">
                            <div class="box_content2">
                                <div class="box_content_type2">
                                    <input type="checkbox" v-model="params.agree01" true-value="Y" false-value="N" @change="updateTotalAgreeCheck">
                                    <div class="terms-container">
                                        <label for="agree">
                                            <span>E-Mail</span> 
                                        </label>
                                    </div>
                                </div>
                                <div class="box_content_type2">
                                    <input type="checkbox" v-model="params.agree01" true-value="Y" false-value="N" @change="updateTotalAgreeCheck">
                                    <div class="terms-container">
                                        <label for="agree">
                                            <span>SMS</span> 
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 
                    <div>
                        <p v-if="showPswdDiffMsg" class="guidTextRed m-0 p-0">
                            * 입력한 비밀번호가 서로 다릅니다
                        </p>
                            <p v-if="showPswdValidPatternMsg" class="guidTextRed m-0 p-0">
                                * 비밀번호는 반드시 영문대소문자, 숫자, 특수문자의 조합으로 작성해야 합니다.
                            </p>   
                        </div>-->

                    <h2 class="m-t-30">소속 정보</h2> 

                    <div class="content-container">
                        <div class="title vw-1">
                            <span class="essn">학교</span>
                        </div>
                        <div class="content vw-2 input-btn">
                            <input class="w-85" type="text"  disabled>
                            <button @click="openPop('schl')" style="position: absolute; border: none; cursor:pointer; right: 35px;">
                                <img src="@/assets/img/btn_remove.png" alt="초기화">    
                            </button>
                            <button class="post-btn" @click="openPop('schl',null)">
                                <img src="@/assets/img/btn_search.png" alt="찾기">    
                            </button>
                        </div>
                        <!-- <div class="content vw-2">
                            <input class="w-100" type="text" disabled>
                            <button @click="openPop('schl')" style="position: absolute; border: none; cursor:pointer; right: 35px;">
                                <img src="@/assets/img/btn_remove.png" alt="초기화">    
                            </button>
                            <button class="post-btn" @click="openPop('schl',null)">
                                <img src="@/assets/img/btn_search.png" alt="찾기">    
                            </button>
                        </div> -->
                    </div>

                    <div class="content-container">
                        <div class="title vw-1">
                            <span class="essn">학년</span>
                        </div>

                        <div class="content vw-2">
                            <input type="text" v-model="params.userId">
                        </div>
                    </div>

                    <div class="content-container">
                        <div class="title vw-1">
                            <span class="essn">반</span>
                        </div>

                        <div class="content vw-2">
                            <input type="text" v-model="params.userId">
                        </div>
                    </div>

                    <div class="button-box1 m-t-20 g-10">
                            <button class="btn-normal wd-100 h-30" @click="joinAprv">가입신청</button>

                        <button class="btn-normal wd-100 h-30" @click="cancel">취소</button>
                    </div>

                </div>
            </div>
        </div>  
    </Modal> <!-- Modal 종료-->

    <TermAgrePop ref="TermAgreRefModal"></TermAgrePop>

    <SchlSrchPop ref="SchlSrchRefModal"></SchlSrchPop>
</template>

<script>

import Modal from '@/components/dialog/modal.vue';
import { ValdUtil } from '@/utils/ValdUtil.js'
import TermAgrePop from '@/views/cmon/cont/TermAgrePop.vue';
import SchlSrchPop from '@/views/cmon/cont/SchlSrchPop.vue';
export default {
    components: {
        Modal,
        TermAgrePop,
        SchlSrchPop
    },
    data: function () {
        return {
            params : {
                userId      : '', //아아디     
                userNm      : '', //이름
                authNo      : '', //인증번호
                userPwsd    : '', //비밀번호
                userPswdChk : '', //비밀번호 확인

                //동의 정보
                agree01: 'N',
                agree02: 'N',
                agree03: 'N',
                agree04: 'N'
                //학교 (수정 필요)
                //학교코드
                //학년
                //반
            },
            isAuthConfirmed         : false,
            showPswdDiffMsg         : false,  //패스워드 불일치 메시지 표시여부
            showPswdValidPatternMsg : false,   //패스워드 패턴 메시지 표시여부
            totAgreeChk: 'N'
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
            $this.params.authNo           = ''; // 인증번호
            $this.params.userPwsd         = ''; // 비밀번호
            $this.params.userPswdChk      = ''; // 비밀번호 확인


            $this.isAuthConfirmed         = '';
            $this.showPswdDiffMsg         = '';
            $this.showPswdValidPatternMsg = '';
            $this.totAgreeChk = 'N';
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
        
        // 팝업
        openPop(div, termDivCd){
            const $this = this;

            if ( div === "term"){
                $this.$refs.TermAgreRefModal.show();
                $this.$refs.TermAgreRefModal.init(termDivCd);
            } else if (div === 'schl') {
                $this.$refs.SchlSrchRefModal.show();
                $this.$refs.SchlSrchRefModal.init();
            }
        },

        //개별 체크
        setAgree(termDivCd) {
            const $this = this;
            if (termDivCd === 'SVCA') {
                $this.params.agree01 = 'Y';
            } else if (termDivCd === 'THRA') {
                $this.params.agree02 = 'Y';
            } else if (termDivCd === 'PRVA') {
                $this.params.agree03 = 'Y';
            } else if (termDivCd === 'OIDA') {
                $this.params.agree04 = 'Y';
            }

            $this.updateTotalAgreeCheck();
        },

        //전체 체크 확인 개별 (개별로 체크하고 다 체크했을 경우 전체 체크 하기 위해)
        updateTotalAgreeCheck() {
            const $this = this;
            if (this.isAllAgreeChecked) {
                $this.totAgreeChk = 'Y';
            } else {
                $this.totAgreeChk = 'N';
            }
        },

        //체크박스 전체 체크
        handleCheckbox() {
            const $this = this;
            if ($this.totAgreeChk === 'Y') {
                $this.params.agree01 = 'Y';
                $this.params.agree02 = 'Y';
                $this.params.agree03 = 'Y';
                $this.params.agree04 = 'Y';
            } else {
                $this.params.agree01 = 'N';
                $this.params.agree02 = 'N';
                $this.params.agree03 = 'N';
                $this.params.agree04 = 'N';
            }
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

    //전체 체크 여부 계산 후 리턴
    computed: {
        isAllAgreeChecked() {
            const $this = this;
            return (
                $this.params.agree01 === 'Y' &&
                $this.params.agree02 === 'Y' &&
                $this.params.agree03 === 'Y' &&
                $this.params.agree04 === 'Y'
            );
        },
    },

    mounted: function () {
        this.init();
        this.emitter.on('setAgree', (termDivCd) => { this.setAgree(termDivCd) });
    }
}
</script>