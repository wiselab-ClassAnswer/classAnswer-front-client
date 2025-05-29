<template>
    <div>
        <!-- 환경설정정보 -->
        <div class="section section1">
            <div class="search-box">
                <h1>환경설정 정보</h1>
                <SetButton :showInit="true" :showSelect="true" :showSave="isAdmin" :showDelete="false" @on-set-button-click="onSetButtonClick"></SetButton>
                <div class="setting-box" style="height: 735px">
                    <div>
                        <span>사용환경번호</span>
                        <input type="text" class="w-33" v-model="useEnvBaseInfo.envNo" :disabled="true">
                        <p>설치된 제품의 고유값으로 수정할 수 없습니다</p>
                    </div>
                    <div>
                        <span>가용 IP 대역</span>
                        <input type="text" class="w-33" v-model="useEnvBaseInfo.avalIpAddr">
                        <p>'0.0.0.0'인 경우 IP대역 제한이 없으며, 하나이상의 IP대역을 콤마(,)로 구분하여 허용할 IP대역을 지정하면 됩니다.</p>
                    </div>
                    <div>
                        <span>보존일수</span>
                        <input type="text" class="w-33" v-model="useEnvBaseInfo.histPsrvDcnt">
                        <p>교육이 종료일 이후 기록을 보존할 일수를 지정합니다.</p>
                    </div>
                    <div>
                        <span>이미지 생성 방식</span>
                        <select class="w-33" style="font-size: 12px" v-model="useEnvBaseInfo.imgGenLevlCd">
                            <option v-for="item in code.imgGenLevlCd" :key="item.cdVal" :value="item.cdVal">{{item.cdNm}}</option>
                        </select>
                        <p>이미지를 생성하는 방식을 설정합니다.</p> 
                    </div>
                    <div>
                        <div class="text-box">
                            <span class="txt-box-label">비고</span>
                            <textarea class="w-33 ta-r-n" v-model="useEnvBaseInfo.rmrk"></textarea>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { reactive, ref, inject } from 'vue'
import SetButton from '@/components/SetButton.vue'
import { ValdUtil } from '@/utils/ValdUtil';
import { SessionUtil } from '@/utils/SessionUtil';

export default {
    components: {
        SetButton
    },
    setup() {
        // 전역 mixin의 메소드를 inject를 통해 가져옴
        const getCmonCdList = inject('getCmonCdList');

        let code = reactive({
            // 이미지_생성_레벨_코드,
            imgGenLevlCd: []
        });

        // inject를 통해 가져온 공통코드 호출 함수를 이용하여 공통코드 get
        // getCmonCdList('YN', code.YN, 'N', null);
        getCmonCdList('IMG_GEN_LEVL_CD', code.imgGenLevlCd, 'N', null);
        
        return {
            code
        };

    },

    data: function() {
		return {
            params: {
                useAvalIpAddr      : '',        // 가용_IP_주소
                useImgGenLevlCd    : '',        // 이미지_생성_레벨_코드
                useRmrk            : '',        // 비고
                
                chckChngLinkSetDiv : false,     // 설정_변경_여부
                chckChngServDiv    : false,     // 변경_구분값
                chckRoleDiv        : false      // 역할_변경_구분값
            },
            useEnvBaseInfo: {
                envNo              : '',        // 환경_번호
                avalIpAddr         : '',        // 가용_IP_주소
                imgGenLevlCd       : '',        // 이미지_생성_레벨_코드
                rmrk               : '',        // 비고
                histPsrvDcnt       : '',

            },
            
        }
    },
    methods: {
        init() {
            const $this = this;
            $this.resetUseEnvBase();
            $this.searchUseEnvSet();
            // $this.CmonUtil.setFocus($this.$refs.kmapDbConnId);
        },
        //  환경설정정보 초기화
        resetUseEnvBase(){
            const $this = this;
            $this.useEnvBaseInfo = {
                
                envNo              : '',        // 환경_번호
                avalIpAddr         : '',        // 가용_IP_주소
                imgGenLevlCd       : '',        // 이미지_생성_레벨_코드
                rmrk               : '',        // 비고
            };
            $this.params = {
                useAvalIpAddr      : '',        // 가용_IP_주소
                useImgGenLevlCd    : '',        // 이미지_생성_레벨_코드
                useRmrk            : '',        // 비고

                chckChngLinkSetDiv : false,     // 설정_변경_여부
                chckChngServDiv    : false,     // 변경_구분값
                chckRoleDiv        : false      // 역할_변경_구분값
            };
        },
    

        //  환경설정정보 조회
        searchUseEnvSet () {
            const $this = this;
            let url = '/cmon/env/prdtInfo/selectUseEnvSet.hb';
            $this.resetUseEnvBase();
            let params = $this.useEnvBaseInfo;

            $this.doPost(url, params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    //  환경설정정보 표시
                    $this.useEnvBaseInfo            = result.rtnData.useEnvBaseInfo;
                    $this.params.useAvalIpAddr      = result.rtnData.useEnvBaseInfo.avalIpAddr;
                    $this.params.useImgGenLevlCd    = result.rtnData.useEnvBaseInfo.imgGenLevlCd;
                    $this.params.useRmrk            = result.rtnData.useEnvBaseInfo.rmrk;
                    $this.params.histPsrvDcnt       = result.rtnData.useEnvBaseInfo.histPsrvDcnt;
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },

        // 환경설정정보 구분 / 저장
        saveUseEnvSet () {
            const $this = this;
            let sendParam = {
                useEnvNo        : $this.useEnvBaseInfo.envNo
            }
            if ($this.validationUseEnvBaseModify()){
                if($this.isAdmin){
                    // 가용 IP 주소  변경 체크
                    if($this.params.useAvalIpAddr !== $this.useEnvBaseInfo.avalIpAddr){
                        $this.params.chckChngLinkSetDiv      = true;
                    }
                    // 이미지 생성 레벨코드 변경체크
                    else if($this.params.useImgGenLevlCd !== $this.useEnvBaseInfo.imgGenLevlCd){
                        $this.params.chckChngLinkSetDiv      = true;
                    }
                    // 비고영역  변경 체크
                    else if($this.params.useRmrk !== $this.useEnvBaseInfo.rmrk){
                        $this.params.chckChngLinkSetDiv       = true;
                    }
                    else {
                        $this.params.chckChngLinkSetDiv = false;
                    }
                    
                    if($this.params.chckChngLinkSetDiv){
                        $this.saveConfirm(sendParam);
                    } else if($this.params.chckChngServDiv){
                        $this.saveConfirm();
                    } else {
                        $this.updateUseEnvBase();
                    }               
                }
            }
        },

        //저장 컨펌창
        saveConfirm(sendParam){
            const $this = this;
            $this.confirm({
                content: '환경설정 정보 값이 변경되었습니다. 저장 시 기존 환경 설정값이 사라집니다. 변경하시겠습니까?',
                callback: {
                    yes:function(){
                        $this.updateUseEnvBase(sendParam);
                        $this.params.chckChngLinkSetDiv = false;

                    },
                    no:function(){

                    }
                }
            })
        },


        //  환경설정정보 update
        updateUseEnvBase(sendParam) {
            const $this = this;
            
            let url     = '/cmon/env/prdtInfo/updateUseEnvSet.hb';
            if(ValdUtil.isNull(sendParam)){
                sendParam = {
                    linkKindCd : ''
                }
            }
            let params          = {
                envNo               : $this.useEnvBaseInfo.envNo,
                avalIpAddr          : $this.useEnvBaseInfo.avalIpAddr,
                imgGenLevlCd        : $this.useEnvBaseInfo.imgGenLevlCd,
                rmrk                : $this.useEnvBaseInfo.rmrk,
                histPsrvDcnt        : $this.useEnvBaseInfo.histPsrvDcnt,
            };
            
            $this.doPost(url, params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    $this.alert("저장되었습니다").then((result) => {
                        if ( result.isConfirmed ) {
                            $this.searchUseEnvSet();
                        }
                    });
                } else {
                    $this.alert(result.rtnMsg);
                }
            });

        },

        //  환경설정정보 저장(modify) VALIDATION
        validationUseEnvBaseModify(){
            const $this = this;

            if ($this.ValdUtil.isNull($this.useEnvBaseInfo.envNo)) {
                $this.alert('사용환경번호를 입력하세요');
                return false;
            }

            // 가용 IP 대역 입력 형식 체크 
            // if (!$this.ValdUtil.isValidIpAddress($this.useEnvBaseInfo.avalIpAddr)) {
            //     $this.alert('가용 IP 대역의 입력정보가 IP 형식에 맞지 않습니다.');
            //     return false;
            // }


            return true;
        },

        // 공통버튼(초기화, 조회, 저장, 삭제) 컴포넌트 핸들러
        onSetButtonClick (div) {
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.init();
                    break;
                case 'select':
                    $this.searchUseEnvSet();
                    break;
                case 'save':
                    $this.saveUseEnvSet();
                    break;
                default:
                    $this.alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
        }
    },

    updated: function () {
    
    },

    computed: {
        isAdmin() {
            let userRoleInfo = SessionUtil.getUserRoleList();
            if(userRoleInfo.some(item => item.roleCd === 'SYS_ADMIN')){
                return true;
            } else {
                return false;
            }
        },
    },

    watch: {
    },

    mounted: function() {
        const $this = this;
        $this.init();
    }   
}
</script>
