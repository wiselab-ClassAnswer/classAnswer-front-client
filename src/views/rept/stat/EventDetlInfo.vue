<template>
    <Modal ref="baseModal" :width="50">
        <div class="section-wrap">
            <h2 class="ib">이벤트상세정보</h2>
            <!-- <button class="f-r btn-normal" @click="selectEventDetlInfo()">조회</button> -->
            <div class="section-wrap">
                <div class="section-part part1">
                    <br>

                    <!-- 원본 시작 -->

                    <div class="w-100 b">
                        <div class="w-50 ib">
                            <span class="wd-90" style="text-align: center; /*padding-left: 20px;*/">이벤트번호</span>
                            <input class="c-wd-90" type="text" v-model="eventDetlInfo.evntNo" disabled>
                        </div>
                        <div class="w-50 ib">
                            <span class="wd-90" style="text-align: center; /*padding-left: 20px;*/">발생일시</span>
                            <input class="" style="width: 76%;" type="text" v-model="eventDetlInfo.regiDttm" disabled>
                        </div>
                    </div>

                    <div class="w-100 b">
                        <span class="wd-90" style="text-align: center; /*padding-left: 20px;*/">발생요약</span>
                        <div class="c-wd-90 ib">
                            <input class="" style="width: 27%;" type="text" v-model="eventDetlInfo.evntSrcNm" disabled>
                            <input class="" style="width: 28%;margin-left: 6px;" type="text" v-model="eventDetlInfo.evntDivNm" disabled>
                            <input class="" type="text" style="width: 42.4%; margin-left: 5px; text-align: center;" :style="{'color': isFontRed(eventDetlInfo.evntRsltCd)? 'red': 'blue'}" v-model="eventDetlInfo.evntRsltNm" disabled>
                        </div>
                    </div>


                    <div class="w-100 b">
                        <span class="wd-90" style="text-align: center; /*padding-left: 20px;*/">사용자ID</span>
                        <div class="c-wd-90 ib">
                            <input class="" style="width: 44%;" type="text" v-model="eventDetlInfo.regiUserId" disabled>
                            <input class="" style="width: 54.1%; margin-left: 6px;" type="text" v-model="eventDetlInfo.regiUserNm" disabled>
                        </div>
                    </div>
                    <br>                    
                    <div class="w-100 b">
                        <div class="w-50 ib">
                            <span class="wd-90" style="text-align: center; /*padding-left: 20px;*/">연계Key1</span>
                            <input class="c-wd-90" type="text" v-model="eventDetlInfo.idenKey1" disabled>
                        </div>
                        <div class="w-50 ib">
                            <span class="wd-90" style="text-align: center;">연계Key4</span>
                            <input class="c-wd-90" type="text" v-model="eventDetlInfo.idenKey4" disabled>
                        </div>
                    </div>

                    <div class="w-100 b">
                        <div class="w-50 ib">
                            <span class="wd-90" style="text-align: center; /*padding-left: 20px;*/">연계Key2</span>
                            <input class="c-wd-90" type="text" v-model="eventDetlInfo.idenKey2" disabled>
                        </div>
                        <div class="w-50 ib">
                            <span class="wd-90" style="text-align: center;">연계Key5</span>
                            <input class="c-wd-90" type="text" v-model="eventDetlInfo.idenKey5" disabled>
                        </div>
                    </div>

                    <div class="w-100 b">
                        <div class="w-50 ib">
                            <span class="wd-90" style="text-align: center; /*padding-left: 20px;*/">연계Key3</span>
                            <input class="c-wd-90" type="text" v-model="eventDetlInfo.idenKey3" disabled>
                        </div>
                    </div>

                </div>
            </div>

            <!-- 탭 -->
            <!-- <div class="section section2"> -->
                <div class="section-wrap trans">
                    <div>
                        <div id="tabs" class="w-100">
                            <ul class="tab-menu">
                                <li style="cursor: pointer;" v-for="(tab, index) in tabs" v-bind:key="index" v-bind:class="{active:currentTab===index}" @click="changeTab(index)">
                                    <a href="#" v-on:click="currentTab = index">{{tab}}</a>
                                </li>
                            </ul>
                            <div class="">
                                <div v-show="currentTab == 0">
                                    <div class="inner-tab-content con1">
                                        <div class="" style="position: relative; height: 500px;">
                                            <template v-if="isShowTreeBtn">
                                                <button class="btn" @click="showJsonTree" style="position: absolute; top: 7px; right: 25px; z-index: 10; background-color: rgb(207 225 233);">{{ showTreeBtnNm }}</button>
                                            </template>
                                            <div class="line" v-show="isShowJsonTree">
                                                <vue-json-pretty :data=eventDetlInfo.evntRequCntnJson :height="500" :showIcon="true" :virtual="true" :showLength="true" :deep="2"/>
                                            </div>
                                            <div v-show="!isShowJsonTree">
                                                <textarea class="w-100" style="height: 500px" cols="30" rows="10" v-model="eventDetlInfo.evntRequCntn" disabled></textarea>
                                            </div>
                                        </div>
                                        <!-- <textarea class="w-100" style="height: 500px" cols="30" rows="10" v-model="eventDetlInfo.evntRequCntn" disabled></textarea> -->
                                    </div>
                                </div>
                                <div v-show="currentTab == 1">
                                    <div class="inner-tab-content con2">
                                        <!-- <textarea cols="30" rows="10" name="" v-model="eventDetlInfo.evntLog" disabled></textarea> -->
                                        <textarea class="w-100" style="height: 500px" cols="30" rows="10" v-model="eventDetlInfo.evntLog" disabled></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            <!-- </div> -->
            
        </div>
        <div class="button-box1 m-t-20">
            <button class="btn-normal" @click="cancel">닫기</button>
        </div>
    </Modal>
</template>
<script>

import { ref, reactive, inject }    from 'vue'
import Modal                        from '@/components/dialog/modal.vue'
import VueJsonPretty                from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

export default {
    components: {
        Modal,
        VueJsonPretty,
    },
    props:{
        
    },
    setup() {        
        const baseModal = ref(null);

        let code = reactive({
            evntDiv: [],
            evntSrc: [],
            evntRslt: [],
        });

        const getCmonCdList = inject('getCmonCdList');
        getCmonCdList('EVNT_DIV_CD', code.evntDiv, 'Y', null);
        getCmonCdList('EVNT_SRC_CD', code.evntSrc, 'Y', null);
        getCmonCdList('EVNT_RSLT_CD', code.evntRslt, 'Y', null);

        const show = () => {
            baseModal.value.open();
        }
        const cancel = () => {
            baseModal.value.close();
        }

        let isShowJsonTree  = ref(false);
        let showTreeBtnNm   = ref('TREE 보기');
        let isShowTreeBtn   = ref(true);

        let currentTab = ref(0);
        let tabs = ['요청내용', '처리로그'];

        return {
            currentTab,
            tabs,
            baseModal,
            code,
            isShowJsonTree,
            showTreeBtnNm,
            isShowTreeBtn,
            show,
            cancel,
        }
    },

    data() {
        return {
            params: {
                evntNo: '',
            },
            eventDetlInfo: {
                evntNo: '',
                regiDt: '',
                regiTm: '',
                regiDttm: '',
                evntDivCd: '',
                evntDivNm: '',
                evntRsltCd: '',
                evntRsltNm: '',
                evntSrcCd: '',
                evntSrcNm: '',
                regiUserId: '',
                regiUserNm: '',
                pageLnkBtn: '',
                idenKey1: '',
                idenKey2: '',
                idenKey3: '',
                idenKey4: '',
                idenKey5: '',
                evntRequCntn: '',
                evntLog: '',
                evntRequCntnJson: '',
            },            
        }
    },
    methods: {
        init() {
            this.resetData();
        },
        // 이벤트상세정보 초기화
        resetData() {
            this.resetJsonData();
            this.CmonUtil.resetObjData(this.evntDetlInfo);
        },    
        resetJsonData() {
            this.isShowJsonTree = false;
            this.showTreeBtnNm  = 'TREE 보기';
            this.isShowTreeBtn  = true;
        },
        openPop(evntNo) {
            this.resetJsonData();
            this.CmonUtil.resetObjData(this.evntDetlInfo);
            this.params.evntNo = evntNo;
            this.selectEventDetlInfo();
        },    
        selectEventDetlInfo() {
            const $this = this;
            if($this.ValdUtil.isNull($this.params.evntNo)) {
                $this.alert('이벤트번호 입력 후 조회해주세요.');
                return false;
            }
            // $this.resetData();
            $this.doPost('/rept/stat/eventDetlInfo/selectEventDetlInfo.hb', $this.params.evntNo).then((res) => {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    if ($this.ValdUtil.isNotNull(result.rtnData.result)) {
                        $this.eventDetlInfo = result.rtnData.result;
                        
                        try {
                            $this.eventDetlInfo.evntRequCntnJson = (JSON.parse($this.eventDetlInfo.evntRequCntn));
                            this.isShowTreeBtn  = true;
                        } catch (error) {
                            $this.eventDetlInfo.evntRequCntnJson = '';
                            this.isShowTreeBtn  = false;
                            this.isShowJsonTree = false;
                        }

                        $this.initTab();
                    } else {
                        alert('이벤트상세정보 조회 결과가 없습니다.');
                    }
                } else {
                    alert(result.rtnMsg);
                }
            });
        },
        changeTab(index) {
            if(this.ValdUtil.isNotNull(index)) {
                this.currentTab = index;
            }
        },
        initTab() {
            if (this.eventDetlInfo.evntRsltCd == 'SUCC') {
                this.currentTab = 0;
            } else {                
                this.currentTab = 1;
            }
            if (this.ValdUtil.isNotNull(this.eventDetlInfo.evntLog)) {
                // this.currentTab = 1;
            } else {
                this.eventDetlInfo.evntLog = '정상처리 되었습니다.'
                // this.currentTab = 0;
            }
        },        
        showJsonTree() {
            this.isShowJsonTree = this.isShowJsonTree ? false : true;
            this.showTreeBtnNm = this.isShowJsonTree ? 'TREE 닫기' : 'TREE 보기';
        },
        isFontRed(value) {
            if (value == 'SUCC') {
                return false;
            } else {
                return true;
            }
        },
    },
    mounted: function() {  
        const $this = this; 
        $this.init();
    },
}
</script>
<style scoped>
.line {
    border-color: #d1d1dd;
    border-style: solid;
    border-width: 1px;
}
</style>