<template>
    <div>
        <!-- 제품정보 -->
        <div class="section section1">
            <div class="search-box">
                <div class="input-box m-t-5 w-100">
                    <div class="w-5 ib">
                        <h1>제품정보</h1>
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="false" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
                <div class="setting-box" style="height: 735px">
                    <div>
                        <span class="wd-65">사용환경번호</span>
                        <input type="text" v-model="useEnvBaseInfo.useEnvNo" :disabled="true">
                        <p>설치된 제품의 고유값으로 수정할 수 없습니다.</p>
                    </div>
                    <div>
                        <span class="wd-65">제품명</span>
                        <input type="text" v-model="useEnvBaseInfo.prdtNm" :disabled="true">
                        <p>납품된 솔루션의 명칭과 도입버전으로 수정할 수 없습니다.</p>
                    </div>
                    <div>
                        <span class="wd-65">시리얼번호</span>
                        <input type="text" v-model="useEnvBaseInfo.serlNo" :disabled="true">
                        <p>납품된 솔루션의 고유번호로 수정할 수 없으며, 해당번호를 통하여 계약관계 및 기술지원을 수행합니다.</p>
                    </div>
                    <div>
                        <span class="wd-65">설치일자</span>
                            <input type="text" v-model="useEnvBaseInfo.instDt" :disabled="true">
                        <p>고객사에 제품납품이 확인된 날짜입니다.</p>
                    </div>
                    <div>
                        <span class="wd-65">담당자명</span>
                        <input type="text" v-model="useEnvBaseInfo.chrgManNm">
                        <p>고객사의 설치/유지 관련담당자 또는 담당조직명을 기재합니다.</p>
                    </div>
                    <div>
                        <span class="wd-65">연락처</span>
                        <input type="text" v-model="useEnvBaseInfo.chrgMailAddr">
                        <p>담당자에 대한 연락처를 기재합니다.</p>
                    </div>
                    <div class="text-box">
                        <textarea spellcheck="false" ref="prdtDesc" class="w-100" style="height: 519px" name="" id="" cols="30" rows="10" v-model="useEnvBaseInfo.prdtDesc"></textarea>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

import { reactive, ref, inject } from 'vue'
import Grid from '@/components/grid/Grid.vue'
import SetButton from '@/components/SetButton.vue'
import { SessionUtil } from '@/utils/SessionUtil'

let userId = '';
const adminUserId = 'admin';
let specSearchFlag = '';

export default {
    components: {
        Grid,
        SetButton,
    },

    data: function() {
		return {
            useEnvBaseInfo: {
                useEnvNo: '',
                prdtNm: '',
                serlNo: '',
                instDt: '',
                chrgManNm: '',
                chrgMailAddr: '',
                prdtDesc: '',
                userId: '',
            },
            screenDate: {
                instDt: '',
            },
        }
    },
    methods: {
        init() {
            const $this = this;
            $this.resetUseEnvBaseInfo();
            $this.resetScreenDate();
            $this.searchPrdtInfo();

            userId = SessionUtil.getUserId();
            $this.CmonUtil.setFocus($this.$refs.prdtDesc);
        },

        //  환경설정정보 초기화
        resetUseEnvBaseInfo(){
            const $this = this;
            $this.useEnvBaseInfo = {
                useEnvNo: '',
                prdtNm: '',
                serlNo: '',
                instDt: '',
                chrgManNm: '',
                chrgMailAddr: '',
                prdtDesc: '',
                userId: '',
            };
            specSearchFlag = '';
        },

        resetScreenDate(){
            const $this = this;
            $this.screenDate = {
                instDt: '',
            };
        },

        //  환경설정정보 조회
        searchPrdtInfo () {
            const $this = this;
            let url = '/cmon/sys/selectUseEnvBase.hb';
            let params = $this.useEnvBaseInfo;

            $this.doPost(url, params).then(function (res) {
                //  환경설정정보 초기화
                $this.resetUseEnvBaseInfo();
                $this.resetScreenDate();

                let result = res.data;
                // console.log(res);
                if (result.rtnCd == '0000') {
                    specSearchFlag = 'Y';
                    //  환경설정정보 표시
                    $this.useEnvBaseInfo = result.rtnData.useEnvBaseInfo;
                    let instDt = result.rtnData.useEnvBaseInfo.instDt;
                    $this.useEnvBaseInfo.instDt = instDt.substr(0, 4) + '-' + instDt.substr(4, 2) + '-' + instDt.substr(6, 2);
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },

        // 환경설정정보 저장
        savePrdtInfo () {
            const $this = this;
            // console.log(' ########### specSearchFlag : ', specSearchFlag);
            // console.log(' ########### userId : ', userId);

            // if (userId != adminUserId) {
            //     $this.alert('관리자만 수정할 수 있습니다.')
            //     return false;
            // } 

            if ($this.ValdUtil.isNull(specSearchFlag)) {
                $this.alert('조회 후 수정 하시기 바랍니다.');
                return false;
            }

            if ($this.validationUseEnvBaseModify()){
                $this.updateUseEnvBase();
            }
        }, 

        //  환경설정정보 update
        updateUseEnvBase() {
            const $this = this;
            
            let url = '/cmon/sys/updateUseEnvBase.hb';
            let params = $this.useEnvBaseInfo;
            params.userId = userId;
            // console.log(' ########### UseEnvBase for UPDATE params : ', params);
            
            $this.doPost(url, params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    // $this.alert('수정되었습니다.');
                    // $this.searchPrdtInfo();

                    $this.alert("저장되었습니다").then((result) => {
                        if ( result.isConfirmed ) {
                            $this.searchPrdtInfo();
                        }
                    });
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },

        //  환경설정정보 저장(modify) VALIDATION
        validationUseEnvBaseModify(){
            const $this = this;

            // null 체크 및 길이 체크 (data / 길이 / msg / null 체크 여부=디폴트 true)
            if(!$this.ValdUtil.valdLenNull($this.useEnvBaseInfo.chrgManNm,    256, '담당자명은')) return false;
            if(!$this.ValdUtil.valdLenNull($this.useEnvBaseInfo.chrgMailAddr, 256, '연락처는')) return false;

            return true;
        },

        onSelectedDatepickerInstDt(selectedDate) {
            const $this = this;
            $this.screenDate.instDt = selectedDate;
            $this.useEnvBaseInfo.instDt = $this.DateUtil.dateToYYYYMMDD(selectedDate)
        },

        // 공통버튼(초기화, 조회, 저장, 삭제) 컴포넌트 핸들러
        onSetButtonClick (div) {
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.init();
                    break;
                case 'select':
                    $this.searchPrdtInfo();
                    break;
                case 'save':
                    $this.savePrdtInfo();
                    break;
                case 'delete':
                    // $this.savePrdtInfo();
                    break;
                default:
                    $this.alert('처리할 수 없는 버튼 이벤트입니다.');
                    break;
            }
        }
    },
    mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>
