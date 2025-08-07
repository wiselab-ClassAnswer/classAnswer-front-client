<template>
    <Modal ref="baseModal" :width="50">
        <div class="non-search-section">
            <div class="section-wrap">

                <div class="content-container">
                    <div class="title vw-1">
                        <span>제목</span>
                    </div>
                    <div class="content vw-5">
                        <span>{{ notiData.blbdTitl }}</span>
                    </div>
                </div>

                <div class="content-container">
                    <div class="title vw-1">
                        <span>게시기간</span>
                    </div>
                    <div class="content vw-2">
                        <span>{{ formatDate(notiData.blbdStrtDt) }} ~ {{ formatDate(notiData.blbdEndDt) }}</span>
                    </div>
                </div>

                <div class="content-container">
                    <div class="title vw-1">
                        <span>조회수</span>
                    </div>
                    <div class="content vw-2">
                        <span>{{ thousandComma(notiData.srchCnt) }}</span>
                    </div>
                </div>
                
                <div class="textarea-content-container h-540">
                    <div class="title vw-1">
                        <span>내용</span>
                    </div>
                    <div class="content vw-5 h-540 area-container">
                        <span class="area-container-content" v-html="notiData.blbdCntn"></span>
                    </div>
                </div>
                
                <div class="textarea-content-container h-100">
                    <div class="title vw-1">
                        <span>첨부파일</span>
                    </div>

                    <div class="content vw-5 h-100">
                        <div class="scroll-content-section h-80">
                            <div class="scroll-content-wrap">
                                <div class="scroll-content" v-for="file in fileList" :key="file">
                                    <div class="content h-20" style="border: 0px;">
                                        <a :href="file.filePath" :download="file.fileNm" target="_black">
                                            <span>{{ file.fileNm }}</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="button-box1 m-t-20">
            <button class="btn-normal"  @click="cancel">확인</button>
        </div>
    </Modal>
</template>

<script>

import { ref }      from 'vue'; 
import Modal        from '@/components/dialog/modal.vue';

export default {
    name: "confirm-dialog",
    components: {
        Modal,
    },    
    setup() {
        const baseModal = ref(null);
        const show = () => {
            baseModal.value.open();
        }
        const cancel = () => {
            baseModal.value.close();
        }
        return {
            baseModal,
            show,           
            cancel
        }
    },
    data: function() {
        return {
            notiData: {
                blbdNo      : '',
                blbdTitl    : '',
                blbdCntn    : '',
                blbdStrtDt  : '',
                blbdEndDt   : '',
                prioBlbdYn  : '',
                srchCnt     : ''
            },
            fileList: []
        }
    },
    methods: {
        init(blbdNo) {
            const $this = this;
            $this.initData();
            $this.selectNotiInfo(blbdNo);
        },
        // 데이터 초기화
        initData(){
            const $this = this;
            
            $this.notiData = {
                blbdNo      : '',
                blbdTitl    : '',
                blbdCntn    : '',
                blbdStrtDt  : '',
                blbdEndDt   : '',
                prioBlbdYn  : '',
                srchCnt     : '',
                regiDt      : '',
                regiTm      : '',
                regiUserId  : '',
                updtDt      : '',
                updtTm      : '',
                updtUserId  : '',
            };
            $this.fileList = [];
        },        
        // 공지사항 정보 조회
        selectNotiInfo(blbdNo) {
            const $this = this;

            if (!blbdNo) {
                return;
            }
            
            let params = {
                    blbdNo: blbdNo
            };

            $this.doPost('/blbd/noti/selectOne.hb', params).then(function (res) {
                if(res.status === 200) {
                    const result = res.data.rtnData.result;
                    console.log("blbdInfo",result.blbdInfo);
                    if (result && result.blbdInfo) {
                        $this.notiData = result.blbdInfo;
                    }
                    if (result && result.blbdFileList) {
                        $this.fileList = result.blbdFileList;
                    }
                }
            }).catch(function (error) {
                console.error('공지사항 조회 실패:', error);
            });
        },        
        // 천단위 콤마 포맷팅
        thousandComma(num) {
            if (!num) return '0';
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
    }
}
</script>