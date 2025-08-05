<template>
    <div class="login-content">

        <!-- 로그인 영역 -->
        <div class="login-wrapper zindex">
            <!-- <div class="login-left">
                
                <p class="login-copyright p-t-5">CopyRight (c) 2025 WiseLab CO.,LTD.<br>All Rights Reserved.</p>
            </div> -->

            <div class="login-only">
                <div class="login-form">
                    <div class="img-wrapper">
                        <img class="login-logo p-0" src="@/assets/img/login_logo.png" alt="">
                    </div>
                    <div class="form-group">
                        <label class="control-label no-pointer">아이디</label>
                        <div>
                            <input v-focus type="text" class="form-control" v-model="params.userId" v-on:keyup.enter="login()">
                        </div>
                        <label class="control-label no-pointer">비밀번호</label>
                        <div>
                            <input type="password" class="form-control" v-model="params.userPswd" autocomplete="off" v-on:keyup.enter="login()">
                        </div>
                        <div>
                            <p class="login-lostpw p-0 p-l-25" @click="openPop('join', null)">가입 신청</p>
                        </div>

                        <div>
                            <p class="login-lostpw p-0 p-l-25" @click="openPop('pwsd', null)">비밀번호 변경</p>
                        </div>


                    </div>
                    <div class="form-group mg_none">
                        <div class="text-center">
                            <button type="button" class="login-btn"
                                v-on:click="login()"><span>login</span></button>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- <div class="login-only"  v-else>
                <div class="login-form">
                    <p class="control-label no-pointer" style="font-size:26px;">비밀번호 변경</p>
                    <div class="form-group">
                        
                        <label class="control-label no-pointer">아이디</label>
                        <div>
                            <input v-focus type="text" class="form-control" v-model="params.pwsdFindUserId" v-on:keyup.enter="chngUserPw()">
                        </div>
                        <label class="control-label no-pointer">현재 비밀번호</label>
                        <div>
                            <input type="password" class="form-control" v-model="params.currUserPswd" autocomplete="off" v-on:keyup.enter="chngUserPw()">
                        </div>
                        <label class="control-label no-pointer">변경 비밀번호</label>
                        <div>
                            <input type="password" class="form-control" v-model="params.newUserPswd" autocomplete="off" v-on:keyup.enter="chngUserPw()">
                        </div>
                        <label class="control-label no-pointer">비밀번호 확인</label>
                        <div>
                            <input type="password" class="form-control" v-model="params.newUserPswdChck" autocomplete="off" v-on:keyup.enter="chngUserPw()">
                        </div>
                        <div>
                            <p class="login-lostpw p-0 p-l-25" @click="changeDiv">로그인 화면으로</p>
                        </div>
                    </div>
                    <div class="form-group mg_none">
                        <div class="text-center">
                            <button type="button" class="login-btn" v-on:click="chngUserPw()">
                                <span style="font-size:17px;">비밀번호 변경</span>
                            </button>
                        </div>
                    </div>
                    
                </div>
            </div> -->
            


            <!-- 로그인 화면 
            <div class="login-right" v-if="showLogin">
                <div class="form-horizontal">
                    <div class="form-group">
                        <div class="login-p1">로그인</div>
                        <div class="login-p2">Wise-GPT Ver.1.0 입니다.<br>계정이 없는 경우 관리자에게 문의바랍니다.</div> 
                        <label class="control-label">아이디</label>
                        <div>
                            <input v-focus type="text" class="form-control" v-model="params.userId" v-on:keyup.enter="login()">
                        </div>
                        <label class="control-label">비밀번호</label>
                        <div>
                            <input type="password" class="form-control" v-model="params.userPswd" autocomplete="off" v-on:keyup.enter="login()">
                        </div>
                    </div>
                    <div class="form-group mg_none">
                        <div class="text-center">
                            <button type="button" class="login-btn"
                                v-on:click="login()"><span>login</span></button>
                        </div>
                    </div>
                    <button class="login-lostpw" @click="changeDiv">비밀번호 찾기</button>
                </div>
            </div>-->
            <!-- 로그인 화면 -->

            <!-- 비밀번호 찾기 화면 
            <div class="login-right" v-else>
                <div class="form-horizontal">
                    <div class="form-group">
                        <div class="login-p1">비밀번호 찾기</div>
                        <label class="control-label">아이디</label>
                        <div>
                            <input type="text" class="form-control" v-model="params.pwsdFindUserId">
                        </div>
                        <label class="control-label">인증번호</label>
                        <div>
                            <input type="text" class="form-control2" v-model="params.authNum">
                            <button type="button" class="login-rqnum" v-on:click="reqAuthNum"><span>인증번호 요청</span></button>
                        </div>
                        <label class="control-label">새 비밀번호</label>
                        <div>
                            <input type="password" class="form-control" v-model="params.newUserPswd" autocomplete="off">
                        </div>
                        <label class="control-label">새 비밀번호 확인</label>
                        <div>
                            <input type="password" class="form-control" v-model="params.newUserPswdChck" autocomplete="off">
                        </div>
                    </div>
                    <div class="form-group mg_none">
                        <div class="text-center">
                            <button type="button" class="login-btn2 btn btn-w-m btn-primary"
                                v-on:click="chngUserPw"><span>비밀번호 변경</span></button>
                        </div>
                    </div>
                    <button class="login-lostpw" @click="changeDiv">로그인</button>
                </div>
            </div>
            비밀번호 찾기 화면 -->
        </div>

        <div class="wave">
            <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                <defs>
                    <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="rgb(200,200,200)" stop-opacity="0.2" />
                        <stop offset="15%" stop-color="rgb(210,210,210)" stop-opacity="0.8" />
                        <stop offset="19%" stop-color="rgb(220,220,220)" stop-opacity="1" />
                        <stop offset="50%" stop-color="rgb(230,230,230)" stop-opacity="1" />
                        <stop offset="81%" stop-color="rgb(240,240,240)" stop-opacity="1" />
                        <stop offset="85%" stop-color="rgb(250,250,250)" stop-opacity="0.8" />
                        <stop offset="100%" stop-color="rgb(255,255,254)" stop-opacity="0.2" />
                    </linearGradient>
                </defs>
                <g class="parallax">
                    <use xlink:href="#gentle-wave" x="48" y="0" />
                    <use xlink:href="#gentle-wave" x="48" y="3" />
                    <use xlink:href="#gentle-wave" x="48" y="5" />
                    <use xlink:href="#gentle-wave" x="48" y="7" />
                </g>
            </svg>
        </div>

        <!-- 거래처 조회 팝업 -->
        <PwsdChngMng ref="PwsdChngMngRefModal"></PwsdChngMng>
        <!-- 견적서 조회 팝업 -->
        <JoinAprvMng ref="JoinAprvMngRefModal"></JoinAprvMng>

    </div>
</template>

<script>

import { CmonUtil } from '@/utils/CmonUtil.js'
import { ValdUtil } from '@/utils/ValdUtil.js';
//비밀번호 찾기
import PwsdChngMng from '@/views/cmon/PswdChngMng.vue'
//회원가입 신청
import JoinAprvMng from '@/views/cmon/cont/JoinAprvMng.vue'

export default {
    components: {
        PwsdChngMng,
        JoinAprvMng,
    },
    data: function () {
        return {
            params: {
                userId      : '',  //아아디 
                userPswd    : '',  //패스워드   
            },
        }
    },
    methods: {
        init: function () {
            let $this = this;
            $this.initData();
        },
        initData: function () {
            CmonUtil.clearSession();
            this.resetParam();
        },

        //로그인
        login: function () {
            let $this = this;
            const params = _.cloneDeep($this.params);
            CmonUtil.login(params);
        },

        //Div 변경
        changeDiv: function () {
            let $this = this;

            this.showLogin = !this.showLogin
            this.initData();
            this.resetParam();
        },

        // 인증번호 요청 함수
        reqAuthNum: function () {
            let $this = this;
            let param = 
            {
                userId : $this.params.pwsdFindUserId
            }

            if (ValdUtil.isNotNull(this.params.pwsdFindUserId)) {

                //아이디가 DB에 존재하는지 확인
                $this.doPost("/cmon/sys/login/selectChckUserId.hb", param).then(function (response) {
                    // console.log("res",response);
                    if (response.data.rtnCd === '0000') {
                        $this.params.getAuthNum = response.data.rtnData.result.authnum;
                        $this.alert("사용자 정보에 등록된 메일로 인증번호가 전송되었습니다.");
                    } else {
                        $this.alert(response.data.rtnMsg);
                    }

                });

            } else {
                $this.alert("아이디를 입력해주세요.");
            }
        },

        // 팝업
        openPop(div, inptId){
            const $this = this;
            //비밀번호 변경 팝업
            if( div === "pwsd"){
                $this.$refs.PwsdChngMngRefModal.show();
                $this.$refs.PwsdChngMngRefModal.init(div);
            }
            // 가입 신청 팝업
            else if(div === "join"){
                $this.$refs.JoinAprvMngRefModal.show();
                $this.$refs.JoinAprvMngRefModal.init(div);
            }
        },

        // 비밀번호 변경
        chngUserPw: function () {
            let $this = this;

            let param = {
                userPswd : $this.params.newUserPswdChck,
                userId   : $this.params.pwsdFindUserId,
                currUserPswd : $this.params.currUserPswd

            }

            // 메일으로 보낸 인증번호와 입력된 인증번호가 동일한지 확인
            // if ($this.params.authNum === $this.params.getAuthNum) {


                if (ValdUtil.isNull(this.params.pwsdFindUserId)) {
                    $this.alert("변경하실 아이디를 입력해주세요.");
                    return false;

                }
                // 새 비밀번호 입력란에 입력이 됬는지 확인
                if (ValdUtil.isNull(this.params.newUserPswd)) {
                    $this.alert("변경하실 비밀번호를 입력해주세요.");
                    return false;

                // 새 비밀번호 확인 입력란에 입력이 됬는지 확인
                } else if (ValdUtil.isNull(this.params.newUserPswdChck)) {
                    $this.alert("새 비밀번호 확인란에 변경하실 비밀번호를 재입력 해주세요.");
                    return false;

                // 새 비밀번호랑 새 비밀번호 확인이 동일한지 확인  
                } else if ($this.params.newUserPswd !== $this.params.newUserPswdChck){
                    $this.alert("입력하신 새 비밀번호와 <br> 새 비밀번호 확인이 일치하지 않습니다.");
                    return false;
                }

                if (ValdUtil.isNotNull(this.params.newUserPswd) && ValdUtil.isNotNull(this.params.newUserPswdChck)) {

                    // 비밀번호 업데이트 하기
                    $this.doPost("/cmon/sys/login/updateUserPswd.hb", param).then(function (response) {
                        console.log("res",response);
                        if (response.data.rtnCd === '0000') {
                            $this.alert("비밀번호 변경이 완료되었습니다.");
                            //로그인 화면으로 이동
                            $this.resetParam();
                            $this.showLogin = true;
                        } else {
                            $this.alert(response.data.rtnMsg);
                        }
                    });

                }
            // } else {
            //     $this.alert("인증번호가 일치하지 않습니다.");
            //   }


        },

        //뒤로가기 방지
        preventBack: function () {
            history.pushState(null, null, location.href);
            window.onbeforeunload = null;

            window.onpopstate = function () {
                history.go(1);
            };
        },

        // 초기화
        resetParam: function(){
            let $this = this;

            $this.params.userId             = '';
            $this.params.userPswd           = '';

        },



    },
    mounted: function () {
        this.init();
        // this.preventBack();
    }
}
</script>


<style scoped>

.no-pointer{
    cursor: default !important;
}

.login-content {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(to right, #ffffff, rgb(123, 123, 123));
    /* background: rgb(123, 123, 123); */
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 700px;
}

.zindex {
    z-index: 999;
}

body {
    background-color: #272727 !important;
    height: 100%;
    overflow: hidden;
}

.loginwrap {
    width: 920px;
    height: 540px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -270px;
    margin-left: -460px;
    padding: 0 15px;
}

.loginleft {
    background-color: #121212;
    display: table;
    height: 540px;
}

.loginleft .logo {
    display: table-cell;
    vertical-align: middle;
}

.loginleft .appName {
    color: #fff;
}

.loginright {
    background: #fff;
    display: table;
}

.loginright .ibox-content {
    border-bottom: none;
    display: table-cell;
    vertical-align: middle;
}

.loginright .input-group-addon .left-icon {
    width: 14px;
}

.loginright p {
    text-align: left;
    margin-bottom: 60px;
    line-height: 200%;
}

.loginright .mt40 {
    margin-top: 40px;
}

.loginright .descript li {
    text-align: left;
}

.row {
    display: flex;
    flex-wrap: wrap;
}

.wave {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    margin-top: -125px;
}

.waves {
    position: relative;
    width: 100%;
    height: 250px;
}

.parallax {
    fill-opacity: 0;
}

.parallax>use {
    animation: move-forever 25s cubic-bezier(.55, .5, .45, .5) infinite;
    stop-opacity: 0.5
}

.parallax>use:nth-child(1) {
    animation-delay: -2s;
    animation-duration: 7s;
    stroke: url(#gradient);
    stroke-width: 2;
}

.parallax>use:nth-child(2) {
    animation-delay: -3s;
    animation-duration: 10s;
    stroke: url(#gradient);
    stroke-width: 3;
}

.parallax>use:nth-child(3) {
    animation-delay: -4s;
    animation-duration: 13s;
    stroke: url(#gradient);
    stroke-width: 4;
}

.parallax>use:nth-child(4) {
    animation-delay: -5s;
    animation-duration: 20s;
    stroke: url(#gradient);
    stroke-width: 5;
}

@keyframes move-forever {
    0% {
        transform: translate3d(-90px, 0, 0);
    }

    100% {
        transform: translate3d(85px, 0, 0);
    }
}
</style>