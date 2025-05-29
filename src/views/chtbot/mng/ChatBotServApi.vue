<template>
    <div>
        <div class="chat-container" @click="handleOutsideClick()">
            <!-- 사이드바 -->
            <div :class="['chat-side-bar', { closed: params.isSidebarClose }]">
                <div class="side-bar-top ht-10">
                    <div class="btn-wrapper">
                        <div class="horizon-left">
                            <div class="gpt-btn btn-border-none">
                                <img src="@/assets/img/gptIcon/gpt-close.png" @click="toggleSidebar" width="24" height="24" />
                            </div>
                        </div>
                        <div class="horizon-right">
                            <div class="gpt-btn btn-border-none" @click="alertLimitBtn()">
                                <img src="@/assets/img/btn_search_black.png" width="24" height="24" />
                            </div>
                            <div class="gpt-btn btn-border-none" @click="delList()">
                                <img src="@/assets/img/gptIcon/gpt-new-chat.png" width="24" height="24" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chat-hist-wrapper">
                    <div class="chat-title-list">
                        <div v-for="(item, index) in userSideBarList" :key="item.seq" class="chat-title" 
                            :class="{active: currentVisibleSeq === item.seq,selected: params.selectedSeq === item.seq}"
                            @click="scrollToMsg(item.seq)">
                            {{ item.title }}
                        </div>
                    </div>
                </div>
                <div class="side-bar-bot">
                    <p></p>
                </div>
            </div>
            <div :class="['main', { full: params.isSidebarClose }]">
                <div v-if="this.params.isSidebarClose" class="btn-wrapper p-10">
                    <div class="horizon-left">
                        <div class="gpt-btn btn-border-none">
                            <img src="@/assets/img/gptIcon/gpt-close.png" @click="toggleSidebar" width="24" height="24" />
                        </div>
                    </div>
                </div>

                <div class="main-wrapper" :class="{ centered: grpChatList.length === 0 }"
                    style="height: 80%; overflow-y: auto;">
                    <template v-if="grpChatList.length > 0">
                        <div v-for="(group, groupIndex) in grpChatList" :key="groupIndex" class="chat-group">
                            <div v-for="msg in group.messages" :key="msg.seq" :class="['chat-msg', msg.role]" :id="'msg-' + msg.seq" :data-seq="msg.seq">
                                <!-- 이미지 먼저 표시 (있을 경우) -->
                                <div v-if="msg.image" class="msg-image-wrapper">
                                    <img :src="msg.image" class="msg-image-preview" />
                                </div>
                                <!-- 텍스트 메시지 -->
                                <div v-if="msg.content" class="msg-content markdown-body" v-html="msg.content"></div>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <p v-if="!params.isLmitGpt" class="center-message">무엇이든 물어보세요</p>
                        <p v-else class="center-message">제한된 사용자입니다</p>
                    </template>
                </div>
                <div class="main-footer" style="height: 20%;">
                    <div class="horizon-mid w-100 ht-97">
                        <div class="w-60 inpt-srch">
                            <!-- 이미지 미리보기 -->
                             <div  v-if="params.vision">
                                 <div v-if="params.imageBase64" class="chat-preview-image-wrapper">
                                     <div class="chat-preview-image-container">
                                         <img :src="params.imageBase64" class="chat-preview-image" />
                                         <button class="preview-close-btn" @click="clearPreview">×</button>
                                     </div>
                                 </div>
                                 <div v-else class="chat-preview-image-wrapper">
                                     <div class="chat-preview-nonImage-container">
                                        <img src="@/assets/img/fileExtIcon/draft_icon.png" class="chat-preview-nonImage" style="width: 60px;" />
                                        <span class="file-name">{{ fileInfo.name }}</span>
                                        <button class="preview-close-btn" @click="clearPreview">×</button>
                                     </div>
                                 </div>
                             </div>
                            <textarea class="chat-textarea" spellcheck="false" rows="1"
                                :placeholder="params.isLmitGpt ? '제한된 사용자입니다.' : '무엇이든 물어보세요'"
                                v-model="params.prmtMsg" 
                                @keydown.enter.exact.prevent="chatSubmit"
                                :disabled="params.isLmitGpt">
                            </textarea>
                            <div class="btn-wrapper ht-50">
                                <div class="horizon-left" style="gap:8px;">
                                    <div class="gpt-btn" id="attachFile" @click.stop="toggleFileMenu()" style="position: relative;">
                                        <img src="@/assets/img/plus_icon.png" alt="plus아이콘">
                                    </div>
                                    <!-- 파일 첨부 팝업 메뉴 -->
                                    <div v-if="showFileMenu" class="file-menu" ref="fileMenu">
                                        <div class="file-menu-item" @click="alertLimitBtn()">
                                            <img src="@/assets/img/google_drive_icon.png" width="20" height="20" />Google Drive 연결
                                        </div>
                                        <div class="file-menu-item" @click="alertLimitBtn()">
                                            <img src="@/assets/img/one_drive_icon.png" width="20" height="20" />OneDrive 연결
                                        </div>
                                        <div class="file-menu-item" @click="triggerFileUpload">
                                            <img src="@/assets/img/file_plus_icon.png" width="23" height="23" />컴퓨터에서 업로드
                                        </div>
                                    </div>
                                    <input type="file" accept="image/*" ref="fileInput" style="display: none;" @change="handleFileChange" />
                                    <div class="gpt-btn wd-100" @click="alertLimitBtn()">
                                        <img src="@/assets/img/global_icon.png" alt="global아이콘">
                                        <span>검색</span>
                                    </div>
                                    <div class="gpt-btn wd-100" id="reason" @click="alertLimitBtn()">
                                        <img src="@/assets/img/lighting_icon.png" alt="lighting아이콘">
                                        <span>이성</span>
                                    </div>
                                    <!-- <div class="close-btn wd-100" @click="alertLimitBtn()"></div> -->
                                    <!-- <div class="close-btn" @click="alertLimitBtn()"></div> -->
                                </div>
                                <div class="horizon-right">
                                    <div class="gpt-btn" id="submit" @click="chatSubmit" style="background-color: #5d5d5d;" :disabled="params.isLmitGpt">
                                        <img src="@/assets/img/btn_move_grid_t.png" alt="전송">
                                    </div>                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="horizon-mid" style="height: 3%;">
                        <p class="info-text">ChatGPT는 실수를 할 수 있습니다. 중요한 정보는 재차 확인하세요.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { reactive, inject } from 'vue'
import { ValdUtil } from '@/utils/ValdUtil';
import { CmonUtil } from '@/utils/CmonUtil';
import { SessionUtil } from '@/utils/SessionUtil';
import { marked } from 'marked';
import DOMPurify from 'dompurify'

export default {
    setup() {

    },
    data: function () {
        return {
            params : {
                selectedSeq    : null,     // 사이드바에서 선택된 행
                isLmitGpt      : false,    // GPT 제한 여부
                isSidebarClose : false,    // 사이드바 접기 여부
                prmtMsg        : '',       // 채팅 내역
                vision         : false,    // vision(이미지) 기능 사용여부
                imageBase64    : '',       // 이미지 base64 문자열
                imageUrl       : '',       // 이미지 URL 
            },
            userInfo : {
                ecousNo       : '',
                gmdlNo        : '',
                clientIp      : ''
            },
            chatList : [],
            showFileMenu: false,
            fileInfo : {},
        }
    },
    methods: {
        init: function () {
            const $this = this;
            $this.initData();
            let getUserInfo = SessionUtil.getUserInfo();
            if (ValdUtil.isNotNull(getUserInfo)) {
                $this.userInfo.ecousNo  = getUserInfo.ecousNo;
                $this.userInfo.gmdlNo   = getUserInfo.gmdlNo;
                $this.userInfo.clientIp = getUserInfo.clientIp;
            } else {
                $this.initUserInfo();
            }
            // $this.doPreValidation();
        },
        // 테스트용 더미 데이터 생성
        addList(){
            const $this = this;
            $this.chatList = [
                { id: '1', seq: 1, role: 'user', content: '안녕하세요!' },
                { id: '1', seq: 2, role: 'assistant', content: '무엇을 도와드릴까요?' },
                { id: '1', seq: 3, role: 'user', content: 'Vue 질문 있어요!' },
                { id: '1', seq: 4, role: 'assistant', content: '어떤 부분이 궁금하신가요?' },
                { id: '1', seq: 5, role: 'user', content: 'v-for로 리스트를 출력했는데 key 관련 에러가 나요.' },
                { id: '1', seq: 6, role: 'assistant', content: 'key 속성은 고유해야 합니다. 중복되지 않는 값을 사용하세요.' },
                { id: '1', seq: 7, role: 'user', content: 'JAVA 질문 있어요!' },
                { id: '1', seq: 8, role: 'assistant', content: '자바 관련 어떤 내용을 궁금해 하시나요?' },
                { id: '1', seq: 9, role: 'user', content: 'static 키워드가 뭔가요?' },
                { id: '1', seq: 10, role: 'assistant', content: 'static은 클래스 레벨에서 공유되는 변수나 메서드에 사용돼요.' },
                { id: '1', seq: 11, role: 'user', content: '내일은 무슨요일이에요?!' },
                { id: '1', seq: 12, role: 'assistant', content: '주말이에요!' },
                { id: '1', seq: 13, role: 'user', content: 'CSS로 가운데 정렬은 어떻게 하나요?' },
                { id: '1', seq: 14, role: 'assistant', content: 'flex를 사용하고 justify-content, align-items를 center로 설정하세요.' },
                { id: '1', seq: 15, role: 'user', content: 'textarea 높이를 자동으로 늘릴 수 있나요?' },
                { id: '1', seq: 16, role: 'assistant', content: 'input 이벤트로 scrollHeight 값을 이용하면 가능합니다.' },
                { id: '1', seq: 17, role: 'user', content: 'JavaScript로 오늘 날짜 구하는 법은요?' },
                { id: '1', seq: 18, role: 'assistant', content: 'new Date()를 사용하면 현재 날짜를 가져올 수 있어요.' },
                { id: '1', seq: 19, role: 'user', content: 'GPT 마크다운 포맷의 텍스트 구현 테스트!!!' },
                { id: '1', seq: 20, role: 'assistant', content: '<li><strong>유지보수</strong>: 소프트웨어 사용 중 발견된 문제를 수정하고, 필요에 따라 기능을 개선합니다.</li>' }
            ]

        },
        delList(){
            const $this = this;
            $this.chatList = [];
        },
        initData() {
            const $this = this;
            $this.initParams();
        },
        initParams(){
            const $this = this;
            $this.params.selectedSeq    = null;   // 사이드바에서 선택된 행
            $this.params.isLmitGpt      = false;   // GPT 제한 여부
            $this.params.isSidebarClose = false;  // 사이드바 접기 여부
            $this.params.prmtMsg        = '';
        },
        initUserInfo(){
            const $this = this;
            $this.userInfo.ecousNo  = '';
            $this.userInfo.gmdlNo   = '';
            $this.userInfo.clientIp = '';
        },
        //사이드바 토글
        toggleSidebar() {
            this.params.isSidebarClose = !this.params.isSidebarClose;
        },
        // 전처리
        doPreValidation() {
            const $this = this;
            let params = {
                ecousNo  : $this.userInfo.ecousNo,
                gmdlNo   : $this.userInfo.gmdlNo,
                clientIp : $this.userInfo.clientIp
            };
            $this.doPost('/cmon/chtbot/mng/doPreValidation.hb', params).then(function (res) {
                console.log("res", res);
                let result = res.data;
                if (result.rtnCd == '0000') {
                    if (result.rtnData.rsltCd != '00') {
                        $this.params.isLmitGpt = true;
                        $this.alert(result.rtnData.rsltCntn);
                    }
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },
        //max+1
        nextSeq() {
            const $this = this;
            if ($this.chatList.length === 0) return 1
            const maxSeq = Math.max(...this.chatList.map(item => item.seq))
            return maxSeq + 1
        },
        // 채팅 전송
        chatSubmit(){
            const $this = this;

            const nextSeq = $this.nextSeq();

            if (ValdUtil.isNotNull($this.params.vision) && $this.params.vision === false) {
                $this.chatList.push({
                    id: '1',
                    seq: nextSeq,
                    role: 'user',
                    content: $this.params.prmtMsg,
                    image: $this.params.imageBase64
                });
            } else {
                $this.chatList.push({
                    id: '1',
                    seq: nextSeq,
                    role: 'user',
                    content: '',
                    image: $this.params.imageBase64
                });

                $this.chatList.push({
                    id: '1',
                    seq: nextSeq,
                    role: 'user',
                    content: $this.params.prmtMsg,
                    image: ''
                });
            }

            setTimeout(() => $this.scrollToMsg(nextSeq), 100);
            
            let params = {
                gmdlNo     : $this.userInfo.gmdlNo,
                ecousNo    : $this.userInfo.ecousNo,
                userId     : $this.userInfo.userId,
                prmtMsg    : $this.params.prmtMsg,
                vision     : $this.params.vision,
                imageUrl   : $this.params.imageUrl
            }
            $this.doPost('/cmon/chtbot/mng/chatGpt.hb', params).then(function (res) {
                let result = res.data;
                if (result.rtnCd === '0000') {
                    let gptData = result.rtnData.chatGpt;

                    if(gptData.rsltCd == '00'){
                        let answCntn = gptData.answCntn;
                        let renderedHTML = DOMPurify.sanitize(marked(answCntn));

                        let nextSeq = $this.nextSeq();
                        $this.chatList.push( { id: '1', seq: nextSeq, role: 'assistant', content: renderedHTML });
                        setTimeout(() => $this.scrollToMsg(nextSeq), 100);
                    } else {
                        $this.params.isLmitGpt = true;
                        $this.alert(gptData.rsltCntn);
                    }
                } else {
                    $this.alert(result.rtnMsg);
                }                
            });

            // vision(이미지 첨부) 기능 off 및 이미지 첨부 미리보기 초기화
            $this.params.imageBase64 = '';
            $this.params.imageUrl = '';
            $this.params.vision = false;
            $this.params.prmtMsg = '';
        },
        handlerBtn(div){
            const $this = this; 
        },

        // 간단 요약 로직 / 앞 글자만 자르기
        doSmryChatList(content) {
            return content.length > 15 ? content.slice(0, 15) + '...' : content
        },
        // 사이드바에서 선택시 스크롤
        scrollToMsg(seq) {
            this.params.selectedSeq = seq // 클릭한 title에 selected 클래스 적용됨

            const el = document.getElementById('msg-' + seq)
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                el.classList.add('highlight')
                setTimeout(() => el.classList.remove('highlight'), 1000)
            }
        },
        // 지원하지 않는 기능 알림
        alertLimitBtn() {
            const $this = this;
            $this.alert("chat.openai.com에서만 지원하는 기능입니다.");
        },
        // 파일 업로드 토글
        toggleFileMenu (event) {
            const $this = this;
            $this.showFileMenu = !$this.showFileMenu;
            event.stopPropagation();  // 메뉴 클릭 시 외부 클릭 이벤트 방지
        },
        // 파일 업로드 클릭 트리거
        triggerFileUpload () {
            const $this = this;
            $this.$refs.fileInput.value = '';
            $this.$refs.fileInput.click();
            $this.showFileMenu = false;
        },
        handleFileChange(event) {
            const $this = this;
            this.params.vision = true;
            const file = event.target.files[0];
            $this.fileInfo = file;
            const formData = new FormData();
            formData.append('files', file);

            if(!file) return;

            if(file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    $this.params.imageBase64 = e.target.result; // base64 저장
                };
                reader.readAsDataURL(file);
            } else {
                this.params.imageBase64 = '';
            }

            // 파일 업로드 및 DB 저장
            $this.doPost('/cmon/env/file/upload.hb', formData).then(function (res) {
                const localFilePath = res.data.rtnData.fileInfo.replaceAll(/\\/g, "/");
                const imageUrl = localFilePath.substring(localFilePath.indexOf("/images") + "/images".length);
                $this.params.imageUrl = imageUrl;
            });
        },
        clearPreview() {
            const $this = this;
            $this.params.imageBase64 = '';
            $this.params.imageUrl = '';
            $this.params.vision = false; // vision(이미지 첨부) 기능 off
        },
        // 외부 클릭 시 메뉴 닫기
        handleOutsideClick(event) {
            if (this.showFileMenu && !this.$refs.fileMenu.contains(event.target)) {
                this.showFileMenu = false;
            }
        },
        // 첨부된 파일 확장자에 따라 아이콘 매핑
        getFileIcon(fileName) {
            const ext = fileName.split('.').pop().toLowerCase();
            if (['xls', 'xlsx'].includes(ext)) return require('@/assets/img/fileExtIcon/excel_icon.png');
            if (['pdf'].includes(ext)) return require('@/assets/img/fileExtIcon/pdf_icon.png');
            if (['doc', 'docx'].includes(ext)) return require('@/assets/img/fileExtIcon/doc_icon.png');
            if (['ppt', 'pptx'].includes(ext)) return require('@/assets/img/fileExtIcon/ppt_icon.png');
            return require('@/assets/img/fileExtIcon/ppt_icon.png'); // 기본 파일 아이콘
        }
    },
    computed: {
        // 메인 채팅 리스트
        grpChatList() {
            const $this = this;
            let groups = {}
            for (let msg of $this.chatList) {
                if (!groups[msg.id]) {
                    groups[msg.id] = []
                }
                groups[msg.id].push(msg)
            }

            return Object.keys(groups).map(id => ({
                id,
                messages: groups[id].sort((a, b) => a.seq - b.seq)
            }))
        },
        // 사이드 바 리스트
        userSideBarList() {
            const $this = this;
            return $this.chatList
                .filter(msg => msg.role === 'user' && msg.content !== '')
                .map(msg => ({
                    id: msg.id,
                    seq: msg.seq,
                    title: this.doSmryChatList(msg.content)
                }))
        },
    },
    watch: {
    },
    mounted: function () {
        let $this = this;

        // 외부 클릭을 감지하여 메뉴를 닫기
        document.addEventListener("click", $this.handleOutsideClick);

        $this.init();
    },
    beforeUnmount() {
        // 컴포넌트가 파괴되기 전에 이벤트 리스너 제거
        document.removeEventListener("click", this.handleOutsideClick);
    }
}
</script>

<style>
/* 전체 컨테이너 */
.chat-container {
    display: flex;
    height: calc(100vh - 130px);
    max-height: calc(100vh - 130px);
    width: 100%;
}

/* 사이드바  */
.chat-side-bar {
    width: 20%;
    min-width: 200px;
    max-width: 300px;
    background-color: #f5f5f5;
    border-right: 1px solid #ddd;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease-in-out;
    overflow: hidden;
}

.chat-side-bar.closed {
    width: 0 !important;
    min-width: 0;
    max-width: 0;
    padding: 0;
    border: none;
    flex: none;
    opacity: 0;
}

/* 상단 영역 */
.side-bar-top {
    height: 20%;
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;
}

/* 상단 영역 */
.side-bar-bot {
    height: 5%;
    display: flex;
    flex-direction: column;
    padding: 10px;
    box-sizing: border-box;
}

.chat-msg.highlight {
    background-color: rgba(104, 104, 104, 0.2);
    transition: background 0.5s ease;
    border-radius: 5px;
}


.chat-title-list {
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.chat-title {
    height: 30px;
    padding: 8px 12px;
    background-color: #eee;
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.2s;
}

.chat-title.active {
    background-color: #007bff;
    color: white;
}

.chat-title.selected {
    background-color: #6f6f6f;
    color: white;
}

.chat-title.active.selected {
    background-color: #0056b3;
    /* 둘 다 겹칠 경우 */
}

.chat-title:hover {
    background-color: #ddd;
}

/* 버튼 모음 */
.btn-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.horizon-left,
.horizon-mid,
.horizon-right {
    display: flex;
    align-items: center;
}

.horizon-left {
    justify-content: flex-start;
}

.horizon-mid {
    justify-content: center;
}

.horizon-right {
    justify-content: flex-end;
    gap: 8px;
}

/* 버튼 스타일 */
.close-btn,
.new-btn {
    width: 24px;
    height: 24px;
    background-color: #ccc;
    border-radius: 4px;
    cursor: pointer;
}

/* 채팅 히스토리 영역 */
.chat-hist-wrapper {
    flex: 1;
    overflow-y: auto;
}

/* 메인 */
.main {
    width: 100%;
    transition: width 0.3s ease;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}

/* 사이드바 닫힌 경우 전체 너비 차지 */
.main.full {
    width: 100%;
}

/* 내부 레이아웃 */
.main-wrapper {
    width: 100%;
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    /* 중요: 대화 메시지를 세로 방향으로 쌓음 */
}

/* 가운데 정렬은 대화 없을 때만 적용 */
.main-wrapper.centered {
    justify-content: center;
    align-items: center;
}

.center-message {
    font-size: 30px;
    color: #666;
    font-weight: 500;
    text-align: center;
    opacity: 0.8;
}

/* 검색창 영역 */
.main-footer {
    padding: 10px;
    box-sizing: border-box;
}

.inpt-srch {
    max-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: none;
    font-size: 13px;
    background-color: rgba(255, 255, 255, 0.05);
    padding: 12px 15px 5px 15px;
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.05) 0 54px 55px,
        rgba(0, 0, 0, 0.05) 0 -12px 30px,
        rgba(0, 0, 0, 0.05) 0 4px 6px,
        rgba(0, 0, 0, 0.05) 0 5px 3px,
        rgba(0, 0, 0, 0.05) 0 -3px 5px;
    overflow: hidden;
}

.chat-textarea {
    resize: none;
    width: 100%;
    height: auto;
    min-height: 50px;
    max-height: 150px;
    border: none;
    background: transparent;
    font-size: 13px;
    line-height: 1.5;
    padding: 0;
    margin-bottom: 5px;
}

.chat-textarea::placeholder {
    color: #999999;
    opacity: 1;
}

.chat-textarea:focus {
    outline: none;
}

.chat-group {
    margin-bottom: 20px;
}

.chat-msg {
    display: flex;
    margin: 8px 0;
    padding: 10px 230px 15px 230px;
}

.chat-msg.user {
    justify-content: flex-end;
}

.chat-msg.assistant {
    justify-content: center;
}

.msg-content {
    max-width: 70%;
    padding: 10px 15px;
    border-radius: 12px;
    background-color: #eee;
    color: #333;
    word-break: break-word;
    white-space: pre-wrap;
}

.chat-msg.user .msg-content {
    /* background-color: #007bff; */
    /* color: white; */
    background-color: #f1f1f1;
    color: black;
    border-bottom-right-radius: 0;
}

.chat-msg.assistant .msg-content {
    background-color: white;
    color: black;
    border-bottom-left-radius: 0;
}
.gpt-btn {
  display: inline-flex;          
  align-items: center;           
  justify-content: center;       
  gap: 6px;                      
  border: 1px solid #ccc;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 12px;
  color: #333;
  height: 30px;
  width:30px;
}
.gpt-btn img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  display: block;
}
.gpt-btn:hover {
  background-color: #eeeeee;
}
.btn-border-none{
    border-radius: 0px;
    border:none;
}
.info-text {
    color: #5d5d5d;
    font-size: 11px;
    margin-bottom: 5px;
}

/* 첨부파일 업로드 토글 css (S) */
.file-menu {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 100;
  border-radius: 6px;
  overflow: hidden;
  width: 180px;
  bottom: 13%;
}

.file-menu-item {
  align-items: center;
  display: flex;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.file-menu-item:hover {
  background-color: #f0f0f0;
}

.file-menu-item img {
  margin-right: 8px;
}
/* 첨부파일 업로드 토글 css (E) */

/* 첨부파일 미리보기 스타일 css (S) */
.chat-preview-image-wrapper {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

/* 일반파일 포함하는 박스 */
.chat-preview-nonImage-container {
  position: relative;
  display: flex;
  width: 250px;
  height: 60px;
  border-radius: 20px;
  border: 1px solid #ddd;
  align-items: center;
}

/* 일반파일 */
.chat-preview-nonImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
}

/* 이미지 + 버튼 포함하는 박스 */
.chat-preview-image-container {
  position: relative;
  width: 60px;
  height: 60px;
}

/* 이미지 */
.chat-preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
  border: 1px solid #ddd;
  background-color: #fff;
}

/* 닫기 버튼 - 우측 상단 */
.preview-close-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  background-color: rgba(0, 0, 0, 0.75);
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 14px;
  font-weight: bold;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.preview-close-btn:hover {
  background-color: rgba(0, 0, 0, 1);
}
/* 첨부파일 미리보기 스타일 css (E) */

/* 이미지 래퍼 */
.msg-image-wrapper {
  width: 100px;
  max-width: 100px;
  margin-bottom: 8px;
}

/* 이미지 크기 조절, 비율 유지 */
.msg-image-preview {
  width: 100%; /* 이미지가 최대한 넓게 확장되도록 */
  height: auto; /* 비율 유지 */
  object-fit: cover; /* 이미지를 잘라서 꽉 차게 표시 */
  border-radius: 10px;
  border: 1px solid #ddd;
}

/* 텍스트 콘텐츠 */
.msg-content {
  max-width: 100%;
  word-wrap: break-word;
  margin-top: 8px;
}

/* 마크다운 CSS (S) */
.markdown-body {
  line-height: 1.6;
  font-size: 0.95rem;
  color: #333;
}

.markdown-body strong {
  font-weight: bold;
}

.markdown-body ul, .markdown-body ol {
  padding-left: 1.2rem;
}

.markdown-body code {
  background: #f5f5f5;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: monospace;
}

.markdown-body pre code {
  display: block;
  padding: 12px;
  background-color: #f0f0f0;
  overflow-x: auto;
}

.markdown-body ol {
  list-style-type: decimal;    /* 숫자 목록 */
  padding-left: 1.5rem;        /* 들여쓰기 */
  margin: 1em 0;
}

.markdown-body ol li {
  margin-bottom: 0.5em;
}
/* 마크다운 CSS (E) */

</style>