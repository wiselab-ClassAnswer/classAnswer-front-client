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
                            <!--
                            <div class="gpt-btn btn-border-none" @click="alertLimitBtn()">
                                <img src="@/assets/img/btn_search_black.png" width="24" height="24" />
                            </div>
                        -->
                            <div class="gpt-btn btn-border-none" @click="delList()">
                                <img src="@/assets/img/gptIcon/gpt-new-chat.png" width="24" height="24" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chat-hist-wrapper">
                    <div class="chat-title-list">
                        <div v-for="(item, index) in userSideBarList" :key="item.seq" class="chat-title" 
                          
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
                    style="height: 80%; overflow-y: auto;" ref="chatContainer">
                    <template v-if="grpChatList.length > 0">
                        <div v-for="(group, groupIndex) in grpChatList" :key="groupIndex" class="chat-group">
                            <div v-for="msg in group.messages" :key="msg.seq" :class="['chat-msg', msg.role]" :id="'msg-' + msg.seq" :data-seq="msg.seq">
                                <!-- 파일 미리보기 먼저 표시 (있을 경우) -->
                                <div v-if="msg.image === 'normal'" style="vertical-align: center;">
                                    <img src="@/assets/img/fileExtIcon/draft_icon.png" class="chat-preview-nonImage" style="width: 60px;" />
                                    <span class="file-name">{{ msg.fileNm }}</span>
                                </div>
                                <div v-else class="msg-image-wrapper" @click="handleImg(msg)">
                                    <img :src="msg.image" class="msg-image-preview" />
                                </div>
                                <!-- 텍스트 메시지 -->
                                <div v-if="msg.content"  :class="[
                                        'msg-content',
                                        'markdown-body',
                                        { 'msg-content-with-context': msg.isContxtKeep === 'Y' }
                                    ]"
                                    v-html="msg.content">
                                </div>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <p class="center-message">무엇이든 물어보세요</p>
                    </template>
                </div>
                <div class="main-footer">
                    <div class="horizon-mid w-100 ht-97">
                        <div class="w-60 inpt-srch">
                            <!-- 이미지 미리보기 -->
                             <div  v-if="params.fileupload === true">
                                 <div v-if="params.imageBase64 === 'normal'">
                                    <div class="chat-preview-nonImage-container">
                                        <img src="@/assets/img/fileExtIcon/draft_icon.png" class="chat-preview-nonImage" style="width: 60px;" />
                                        <span class="file-name">{{ fileInfo.name }}</span>
                                        <button class="preview-close-btn" @click="clearPreview">×</button>
                                     </div>
                                 </div>
                                 <div v-else class="chat-preview-image-wrapper">
                                     <div class="chat-preview-image-container">
                                         <img :src="params.imageBase64" class="chat-preview-image" />
                                         <button class="preview-close-btn" @click="clearPreview">×</button>
                                     </div>
                                 </div>
                             </div>
                            <textarea  class="chat-textarea" spellcheck="false" rows="1"
                                placeholder='무엇이든 물어보세요'
                                v-model="params.prmtMsg" 
                                @keydown.enter.exact.prevent="isFinChat === 'submit' && btnChat()">
                            </textarea>
                            <div class="btn-wrapper ht-50">
                                <div class="horizon-left" style="gap:8px;">
                                    <div class="gpt-btn" id="attachFile" @click.stop="toggleFileMenu()" style="position: relative;">
                                        <img src="@/assets/img/plus_icon.png" alt="plus아이콘">
                                    </div>
                                    <!-- 파일 첨부 팝업 메뉴 -->
                                    <div v-if="showFileMenu" class="file-menu" ref="fileMenu">
                                          <!-- 20250425 김범수 돋보기 버튼 주석처리 
                                        <div class="file-menu-item" @click="alertLimitBtn()">
                                            <img src="@/assets/img/google_drive_icon.png" width="20" height="20" />Google Drive 연결
                                        </div>
                                        <div class="file-menu-item" @click="alertLimitBtn()">
                                            <img src="@/assets/img/one_drive_icon.png" width="20" height="20" />OneDrive 연결
                                        </div>
                                    -->
                                        <div class="file-menu-item" @click="triggerFileUpload">
                                            <img src="@/assets/img/file_plus_icon.png" width="23" height="23" />컴퓨터에서 업로드
                                        </div>
                                    </div>
                                    <input type="file" accept="*" ref="fileInput" style="display: none;" @change="handleFileChange" />
                                    <div class="p-l-10">
                                        <label :id="autoRnwlId" class="check-box-wrapper">
                                            <input type="checkbox" class="m-t-0" v-model="isContxtKeep"
                                                true-value="Y" false-value="N"
                                                @change="handleContextKeep">
                                            <span>맥락유지</span>
                                        </label>
                                    </div>
                                    <!-- 20250425 김범수 미사용 주석처리 
                                    <div class="gpt-btn wd-100" @click="alertLimitBtn()">
                                        <img src="@/assets/img/global_icon.png" alt="global아이콘">
                                        <span>검색</span>
                                    </div>
                                    <div class="gpt-btn wd-100" id="reason" @click="alertLimitBtn()">
                                        <img src="@/assets/img/lighting_icon.png" alt="lighting아이콘">
                                        <span>이성</span>
                                    </div>
                                -->
                                </div>
                                <div class="horizon-right">

                                    <div v-if="isFinChat === 'submit'" class="gpt-btn" id="submit" @click="btnChat" style="background-color: #5d5d5d;">
                                        <img src="@/assets/img/btn_move_grid_t.png" alt="전송">
                                    </div>
                                    <div v-else-if="isFinChat === 'proc'" class="gpt-btn"  style="background-color: #5d5d5d;">
                                        <img src="@/assets/img/gptIcon/btn_stop_w.png" alt="전송">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="horizon-mid">
                        <div class="w-100 t-a-c">
                            <p class="info-text">
                                * 맥락 유지 기능은 이전 대화의 연속성을 유지하여 자연스러운 상호작용을 가능하게 합니다.
                            </p>
                            <p class="info-text">
                                단, 사용되는 토큰량이 증가하므로 지속 사용 시 토큰 한도 도달이 빨라질 수 있습니다.
                            </p>
                        </div>
                    </div>
                    <!-- 이미지 모달 팝업 -->
                    <div v-if="showImage" class="modal-backdrop">
                        <div class="modal-btn-container">
                            <!-- 닫기 버튼 -->
                            <button class="modal-close-btn btn-normal" @click="showImage = false">×</button>
                        </div>
                        <div class="modal-img-container">
                            <!-- 이미지 표시 -->
                            <img :src="selectedImage" class="modal-image" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { reactive, inject } from 'vue'
import { ValdUtil }         from '@/utils/ValdUtil';
import { CmonUtil }         from '@/utils/CmonUtil';
import { SessionUtil }      from '@/utils/SessionUtil';
import { marked }           from 'marked';
import DOMPurify            from 'dompurify'
import OpenAI               from "openai";
import { DateUtil }         from '@/utils/DateUtil';
import { TokenUtil }        from '@/utils/TokenUtil'
import { cloneDeep }        from 'lodash';

export default {
    setup() {
        let autoRnwlId = reactive({});
        let objId      = Math.random().toString(36);
        autoRnwlId     = 'label_' + objId;
        return {
            autoRnwlId
        }
    },
    data: function () {
        return {
            contextTimer : null,
            params : {
                selectedSeq    : null,     // 사이드바에서 선택된 행
                isSidebarClose : false,    // 사이드바 접기 여부
                prmtMsg        : '',       // 채팅 내역
                vision         : false,    // vision(이미지) 기능 사용여부
                fileupload     : false,    // 첨부파일 업로드 여부
                imageBase64    : '',       // 이미지 base64 문자열
                imageUrl       : '',       // 이미지 URL 
                fileCntn       : '',       // 문서파일 파일내용
            },
            userInfo : {
                ecousNo       : '',
                gmdlNo        : '',
                clientIp      : ''
            },
            apiInfoVo     : [],
            chatList      : [],
            showFileMenu  : false,
            fileInfo      : {},
            totReqMsg     :[],
            totResMsg     :[],
            totReqToknCnt : null,
            totResToknCnt : null,
            isImgRes      : false,
            isFinPostProc : false,
            isChatProc    : false,
            selectedImage : null,
            showImage     : false, 
            isContxtKeep  : 'N',   // 맥락유지 여부
            maxTurnsCnt   : 1      // 맥락유지 할 개수 / 기본값 1 / 이전 대화 한 쌍 = 2
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
            $this.doPreValidation();
        },
        handleContextKeep() {
            
            if (this.isContxtKeep === 'Y') {
                if (this.contextTimer) clearTimeout(this.contextTimer);

                this.contextTimer = setTimeout(() => {
                    this.isContxtKeep = 'N';
                    this.contextTimer = null;
                }, 15 * 60 * 1000); // 15분  15 * 60 * 1000
            } 
            else {
                clearTimeout(this.contextTimer);
                this.contextTimer = null;
                this.isContxtKeep = 'N';
            }  
        },
        // 채팅 전 Vald 체크
        isVald(){
            const $this         = this;
            const fileupload    = $this.params.fileupload;
            const fileCntn      = $this.params.fileCntn;
            const vision        = $this.params.vision;

            if(ValdUtil.isNull($this.params.prmtMsg)){
                $this.alert("메시지를 입력해주세요.");
                return false;
            }

            if(fileupload === true && vision === false && fileCntn === '') {
                $this.alert("현재 첨부된 파일은 분석할 수 없습니다. <br> 다른 파일로 시도해주세요.");
                return false;
            }

            return true;
        },
        // 채팅 버튼
        btnChat(){ 
            const $this = this;
            if($this.isVald()){
                this.callBackDoPreValidation(async () => {
                    await this.chatSubmit(); // 비동기 콜백 실행
                });
            }
        },
        // 비동기 전 전처리 호출
        callBackDoPreValidation(callback) {
            const $this = this;
            let params = {
                ecousNo  : $this.userInfo.ecousNo,
                gmdlNo   : $this.userInfo.gmdlNo,
                clientIp : $this.userInfo.clientIp
            };

            $this.doPost('/cmon/chtbot/mng/doPreValidation.hb', params).then(function (res) {
                let result = res.data;

                if (result.rtnCd == '0000') {
                    if (result.rtnData.chatGpt.rsltCd == '00') {
                        $this.apiInfoVo = result.rtnData.chatGpt;
                        if (result.rtnData.chatGpt.rsltCd == '00') {
                            $this.apiInfoVo = result.rtnData.chatGpt;
                            if (callback) callback();
                        } else { 
                            $this.alert(result.rtnData.chatGpt.rsltCntn);
                        }
                        
                    } else {
                        $this.alert(result.rtnData.chatGpt.rsltCntn);
                    }
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },

        // 채팅 통신 메소드
        async chatSubmit(){
            const $this = this;
                $this.isImgRes      = false;
                $this.isChatProc    = true;
                $this.isFinPostProc = false;
                const openai = new OpenAI({
                    apiKey                  : $this.apiInfoVo['gmdlApiKey'],
                    dangerouslyAllowBrowser : true
                });

                const tempId  = 'user-' + DateUtil.getCurrDateTime("YYYYMMDDHHmmss");
                const userSeq = $this.nextSeq();
                let userInput = '';
                const fileCntn = $this.params.fileCntn;

                // 질의 내용 설정
                if(ValdUtil.isNotNull($this.params.vision) && $this.params.vision === false) {
                    if(ValdUtil.isNull(fileCntn)) {
                        // text and prompting 질의
                        userInput = $this.params.prmtMsg;
                        $this.apiInfoVo['qustCntn'] = userInput;
                        $this.chatList.push({
                            id           : tempId,
                            seq          : userSeq,
                            role         : 'user',
                            content      : $this.params.prmtMsg,        // 화면에 보여질 내용
                            image        : '',
                            sendCntn     : $this.params.prmtMsg,        // 실제 질의 내용
                            isContxtKeep : $this.isContxtKeep
                        });
                    } else {
                        // 문서파일 첨부질의
                        userInput = "다음은 첨부파일 " + $this.fileInfo.name + "의 내용입니다." + $this.params.fileCntn + "위 내용을 바탕으로 " + $this.params.prmtMsg;
                        $this.apiInfoVo['qustCntn'] = userInput;

                        $this.chatList.push({
                            id      : tempId,
                            seq     : userSeq,
                            role    : 'user',
                            content : '',
                            image   : $this.params.imageBase64,
                            fileNm  : $this.fileInfo.name
                        });

                        $this.chatList.push({
                            id           : tempId,
                            seq          : userSeq,
                            role         : 'user',
                            content      : $this.params.prmtMsg,
                            image        : '',
                            sendCntn     : userInput,
                            isContxtKeep : $this.isContxtKeep
                        });
                    }
                    
                } else {
                    // 이미지파일 첨부질의
                    userInput = [
                        { type : "text"      , text      : $this.params.prmtMsg },
                        { type : "image_url" ,  image_url : { url : process.env.VUE_APP_IP_ADDRESS + $this.params.imageUrl } }
                    ];
                    // 이미지 요청 시 텍스트
                    let inptTxt = userInput.find(el => el.type === 'text');
                    let txtVal  = inptTxt.text;
                    // 이미지 요청 시 이미지 url
                    let inptUrl = userInput.find(el => el.type === 'image_url');
                    let urlVal  = inptUrl.image_url.url; 

                    $this.apiInfoVo['qustCntn'] = txtVal;
                    $this.apiInfoVo['imageUrl'] = urlVal;
                    $this.isImgRes = true;

                    $this.chatList.push({
                        id      : tempId,
                        seq     : userSeq,
                        role    : 'user',
                        content : '',
                        image   : $this.params.imageBase64,
                        fileNm  : $this.fileInfo.name
                    });

                    $this.chatList.push({
                        id           : tempId,
                        seq          : userSeq,
                        role         : 'user',
                        content      : $this.params.prmtMsg,
                        image        : '',
                        sendCntn     : userInput,
                        isContxtKeep : $this.isContxtKeep
                    });
                }
                // 입력값 초기화
                $this.params.prmtMsg     = '';
                $this.params.imageBase64 = '';
                $this.params.imageUrl    = '';
                $this.params.vision      = false;
                $this.params.fileupload  = false;
                $this.params.fileCntn    = '';
                setTimeout(() => $this.scrollToMsg(userSeq), 100);
                const streamChat = await openai.chat.completions.create({
                    // 기존 질의 요청 코드
                    // model: $this.apiInfoVo['gmdlKindCd'],
                    // messages: [
                    //     { role: "user", content: userInput }
                    // ],
                    // stream: true
                    
                    // 이전 질의 메모리에 저장하여 질의함
                    model: $this.apiInfoVo['gmdlKindCd'],
                    messages: (() => {
                        const msgs = [];
                        if(ValdUtil.isNotNull($this.apiInfoVo.roleMsg)) {
                            msgs.push({ role : 'system', content : $this.apiInfoVo.roleMsg });
                        }
                        $this.chatList.forEach(chat => {
                            if(chat.role === 'user' && chat.content) {
                                msgs.push({ role : 'user', content : chat.sendCntn });
                            }
                            if(chat.role === 'assistant' && chat.content) {
                                msgs.push({ role : 'assistant', content : chat.raw || chat.content });
                            }
                        });
                        msgs.push({ role : 'user', content : userInput });
                        // 맥락 유지 Y 인 경우 이전대화 포함
                        // 직전 대화 2쌍 = maxtrns =2 
                        if($this.isContxtKeep === 'Y'){
                            $this.maxTurnsCnt = 2;
                        }
                        if(msgs.length > $this.maxTurnsCnt * 2 + 1) {
                            msgs.splice(1, msgs.length - ($this.maxTurnsCnt * 2 + 1));
                        }
                        return msgs;
                    })(),
                    stream: true
                });

                let nextSeq     = $this.nextSeq();
                let chatId      = null;

                for await (const chatData of streamChat) {
                    chatId             = chatData.id;
                    const rtnCntn      = chatData.choices?.[0]?.delta?.content;
                    const finishReason = chatData.choices?.[0]?.finish_reason;

                    if (rtnCntn) {
                        const isExist = $this.chatList.findIndex(item => item.id === chatId);

                        if (isExist === -1) {
                            // 아직 해당 chatId 없으면 새로 push
                            $this.chatList.push({
                                id      : chatId,
                                seq     : nextSeq,
                                role    : 'assistant',
                                content : DOMPurify.sanitize(marked(rtnCntn)),
                                raw     : rtnCntn
                            });
                        } else {
                            // 누적 처리
                            $this.chatList[isExist].raw    += rtnCntn;
                            const rendered                  = DOMPurify.sanitize(marked($this.chatList[isExist].raw));
                            $this.chatList[isExist].content = rendered;
                        }
                    }
                    $this.scrollToBottom();
                    if (finishReason === "stop") {
                        //현재 요청 / 응답 데이터만 가져와 후처리 로직으로 전송
                        let currReqMsg = $this.chatList.find(el => el.id === tempId);
                        let currResMsg = $this.chatList.find(el => el.id === chatId);
                        if (currReqMsg && currResMsg ) {
                            let sendReqMsg = [];
                            let sendResMsg = [];

                            if(currReqMsg.role === 'user' && currReqMsg.sendCntn){
                                // 맥락 유지 체크, 처음 대화가 아닌경우
                                if(currReqMsg.isContxtKeep === 'Y'){
                                    if(currReqMsg.seq > 1){
                                        //이전 대화 포함 메시지
                                        let sliceMsg = $this.chatList.slice(-4);
                                       
                                        sliceMsg.forEach(el =>{
                                            sendReqMsg.push({role:el.role, content : el.content});
                                        })
                                    } 
                                    
                                } else {
                                    sendReqMsg.push({
                                        role    : 'user',
                                        content : currReqMsg.content,
                                    })
                                }
                                // system 메시지가 포함되어 있는지 확인
                                const hasSysMsg = sendReqMsg.some(msg => msg.role === 'system');

                                // system 메시지가 없고, 지정된 system 메시지가 존재하면 맨 앞에 추가
                                if (!hasSysMsg && ValdUtil.isNotNull($this.apiInfoVo.roleMsg)) {
                                    sendReqMsg.unshift({
                                        role: 'system',
                                        content: $this.apiInfoVo.roleMsg
                                    });
                                }
                            }

                            if(currResMsg.role === 'assistant'&& currResMsg.content){
                                sendResMsg = {role : currResMsg.role, content: currResMsg.content};
                            }


                            $this.setProcessToken(sendReqMsg,sendResMsg); 
                        }
                    }
                }
        },
        // 토큰 계산 전 메시지 세팅 
        setProcessToken(getReqMsg, getResMsg){
            const $this = this;
            const vo    = $this.apiInfoVo;
            
            // 요청 메시지 세팅
            let calcReqMsg = [];

            getReqMsg.forEach(el => {
                calcReqMsg.push(el.role);     // role의 값
                calcReqMsg.push(el.content);  // content의 값
            });
            
            // 모델, 역할메시지, 온도 세팅
            calcReqMsg.push(String(vo.fregVal));
            calcReqMsg.push(vo.gmdlKindCd);
            // 이미지 요청인 경우
            if($this.isImgRes){
                calcReqMsg.push(vo.imageUrl);
            } 
            
            
            // 응답 메시지 세팅
            let calcResMsg  = [];
            let res     = getResMsg.content;
            vo.answCntn = res;
            calcResMsg.push(res);


            // 비동기 토큰 계산 호출
            $this.callCalcProcessToken(calcReqMsg, calcResMsg);
        },

        async callCalcProcessToken(reqMsg, resMsg){
            const $this = this;

            let totReqToknCnt = await $this.calcProcessToken(reqMsg);
            let totResToknCnt = await $this.calcProcessToken(resMsg);

            if(ValdUtil.isNotNull(totReqToknCnt) && ValdUtil.isNotNull(totResToknCnt)){
                // 데이터 세팅
                $this.setData(totReqToknCnt, totResToknCnt);
            }
        },
        // 비동기 토큰 계산
        async calcProcessToken(msg) {
            const $this = this;

            const result = await TokenUtil.getToknCnt(msg, "gpt-4o");

            return result.total; 
        },
        // 후처리 전 VO에 데이터 세팅
        setData(reqCnt, resCnt){
            const $this = this;
            if(ValdUtil.isNotNull(reqCnt) && ValdUtil.isNotNull(resCnt)){
                $this.apiInfoVo.qustToknCnt = reqCnt;
                $this.apiInfoVo.answToknCnt = resCnt + 1;
            }
            $this.$nextTick(() =>{
                $this.doPostProcess();
            })
        },

        // 후처리 호출
        doPostProcess(){
            const $this = this;
            
            let params = cloneDeep($this.apiInfoVo);

            $this.doPost('/cmon/chtbot/mng/doPostProcess.hb', params).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    if (result.rtnData.chatGpt.rsltCd == '00') { 
                        $this.apiInfoVo = result.rtnData.chatGpt;
                    } else {
                        $this.alert(result.rtnData.chatGpt.rsltCntn);
                    }
                    $this.isFinPostProc = true;
                    $this.isChatProc    = false;
                } else {
                    $this.alert(result.rtnMsg);
                }
            })
        },
        // 대화내용클리어
        delList(){
            const $this = this;
            $this.confirm({
                content:'지금까지의 대화내용이 초기화 됩니다 <br> 초기화 하시겠습니까?',
                callback: {
                    yes() {
                        $this.chatList = [];
                    }
                }
            });
        },
        initData() {
            const $this = this;
            $this.initParams();
        },
        initParams(){
            const $this = this;
            $this.params.selectedSeq    = null;   // 사이드바에서 선택된 행
            $this.params.isSidebarClose = false;  // 사이드바 접기 여부
            $this.params.prmtMsg        = '';
            $this.isImgRes      = false;
            $this.isFinPostProc = false;
            $this.isChatProc    = false;
            $this.selectedImage = null;
            $this.showImage     = false; 
            $this.isContxtKeep  = 'N';
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
                let result = res.data;
                if (result.rtnCd == '0000') {
                    if (result.rtnData.chatGpt.rsltCd == '00') {
                        $this.apiInfoVo = result.rtnData.chatGpt;
                    } else { 
                        $this.alert(result.rtnData.chatGpt.rsltCntn);
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

        // 간단 요약 로직 / 앞 글자만 자르기
        doSmryChatList(content) {
            return content.length > 15 ? content.slice(0, 15) + '...' : content
        },
        // 사이드바에서 선택시 스크롤
        scrollToMsg(seq) {
            this.params.selectedSeq = seq // 클릭한 title에 selected 클래스 적용됨

            const el = this.$el.querySelector(`[data-seq="${seq}"]`);
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
        async handleFileChange(event) {
            const $this = this;
            const gmdlNo = $this.userInfo.gmdlNo;
            const file = event.target.files[0];
            $this.fileInfo = file;
            const formData = new FormData();
            formData.append('files', file);

            if(!file) return;

            const MAX_FILE_SIZE = 1 * 1024 * 1024;  // 1,048,576 bytes = 1 MB

            if(file.size >= MAX_FILE_SIZE) {
                const actualSizeMB = (file.size / (1024 * 1024)).toFixed(2);
                $this.alert("첨부 가능한 파일 크기는 1MB 미만입니다.<br>선택하신 파일은 " + actualSizeMB + "MB 입니다.");
                return false;   
            }

            if(file.type.startsWith('image/')) {
                if(gmdlNo === 'gpt-4') {
                    $this.alert("사용자의 GPT모델에서는 이미지 분석 기능을 지원하지 않습니다.");
                    return false;
                }
                const reader = new FileReader();
                reader.onload = (e) => {
                    $this.params.imageBase64 = e.target.result; // base64 저장
                };
                reader.readAsDataURL(file);
                this.params.vision = true;
            } else {
                this.params.imageBase64 = 'normal';
            }

            // 파일 업로드 및 DB 저장
            $this.doPost('/cmon/env/file/upload.hb', formData).then(function (res) {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    const localFilePath   = res.data.rtnData.fileInfo.replaceAll(/\\/g, "/");
                    const imageUrl        = localFilePath.substring(localFilePath.indexOf("/images") + "/images".length);
                    $this.params.imageUrl = imageUrl;
                    const fileCntn = res.data.rtnData.saveFileInfo.fileCntn;
                    if(ValdUtil.isNotNull(fileCntn)) {
                        $this.params.fileCntn = fileCntn;
                    }   
                    $this.params.fileupload = true;
                } else {
                    $this.alert(result.rtnMsg);
                }
            });
        },
        clearPreview() {
            const $this = this;
            $this.params.imageBase64 = '';
            $this.params.imageUrl    = '';
            $this.params.vision      = false; // vision(이미지 첨부) 기능 off
            $this.params.fileupload  = false; // 파일업로드 여부
            $this.params.fileCntn    = ''; // 파일업로드 여부
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
        },
        // 응답 시 스크롤
        scrollToBottom() {
            const container = this.$refs.chatContainer;
            if (container) {
            container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
            }
        },
        // 이미지 모달
        handleImg(item) {
            if (ValdUtil.isNotNull(item.image)) {
                this.selectedImage = item.image;
                this.showImage = true; 
            }
        },
        // 모달 창 내 닫기버튼
        btnModlClose(){
            const $this = this;
            $this.selectedImage = null;
            $this.showImage     = false; 
        },
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
        isFinChat(){
            const $this = this;
            if($this.isChatProc){
                if($this.isFinPostProc){
                    return "submit";
                } else {
                    return "proc";
                }
            } else {
                return "submit";
            }
        }
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
        clearTimeout(this.contextTimer);
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
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 10px;
    box-sizing: border-box;
    height: 20%;
    margin-top:20px;
}

.main-footer .horizon-mid {
  height: auto !important;
  padding: 0 10px;
}

.main-footer > .horizon-mid:first-of-type {
  height: auto !important;
}

.main-footer > .horizon-mid:last-of-type {
  flex: 0 0 auto;
  margin-top: 20px;
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
    margin-bottom: 5px;
}

.chat-msg {
    display: flex;
    margin: 8px 0;
    padding: 0px 230px 0px 230px;
}

.chat-msg.user {
    justify-content: flex-end;
}

.chat-msg.assistant {
    justify-content: center;
}

.msg-content {
    max-width: 70%;
    padding: 5px 10px;
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

.chat-msg.user .msg-content-with-context {
    /* background-color: #007bff; */
    /* color: white; */
    background-color: #EFF7FF;
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
  width: 20px !important;
  height: 20px !important;
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
    font-size: 13px;
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
  cursor:pointer;
}

/* 텍스트 콘텐츠 */
.msg-content {
  max-width: 100%;
  word-wrap: break-word;
  margin-top: 0px;
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
  padding: 1px 4px;
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
  margin: -1.5em;
}

.markdown-body ol li {
  margin-bottom: -1.5em;
}
/* 마크다운 CSS (E) */

/* 이미지 모달 */
.modal-backdrop {
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); 
}



.modal-img-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center; 
  max-width: 100%;
  height:calc(100vh - 90px);
}
.modal-image {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  background-color:white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.modal-btn-container {
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  max-width: 100%;
  height: 90px;
  padding:30px;
}

.modal-close-btn{
    width:40px;
    height:40px;
    font-size:18px;
    font-weight:bold;
}



/* 체크박스 */
.check-box-wrapper{
    display: flex;
    align-items: center;
    gap:4px;
}


</style>