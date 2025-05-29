<template>
    <div>
      <div class="chat-container">
        <!-- 사이드바 -->
        <section class="side-bar">
          <button class="newChatBtn" @click="createNewChat">
            <img src="@/assets/img/chatgpt_icon.png" alt="gpt아이콘" style="height:20px; width:20px;">ChatGPT
          </button>
          <ul class="history">
            <li v-for="(title, index) in uniqueTitles" :key="index" @click="handleClick(title)">
              {{ title }}
            </li>
          </ul>
          <div class="navi">
            <p style="color:gray">Produced by Wiselab</p>
          </div>
        </section>

        <!-- 채팅창 -->
        <section class="main">
          <!-- 대화 내용 -->
          <span v-if="!currentTitle" class="welcome-message">무엇을 도와드릴까요?</span>
          <ul class="feed">
            <li v-for="(chat, index) in currentChat" 
                :key="index" 
                :class="{'user': chat.role === 'user', 'assistant': chat.role === 'assistant'}">
              <p v-if="chat.role === 'user'" class="role">{{ chat.role }}</p>
              <p>{{ chat.content }}</p>
            </li>
          </ul>

          <!-- 입력창 -->
          <div class="bottom-section">
            <div class="extra-buttons">
              <div class="extra-button" id="attachFile" style="width: 30px;">
                <img src="@/assets/img/plus_icon.png" alt="plus아이콘" style="margin-left: 5px;">
              </div>
              <div class="extra-button" id="search">
                <img src="@/assets/img/global_icon.png" alt="global아이콘">검색
              </div>
              <div class="extra-button" id="reason">
                <img src="@/assets/img/lighting_icon.png" alt="lighting아이콘">이성
              </div>
            </div>

            <div class="chat-input">
              <input v-model="prompt" @keyup.enter="getMessages" placeholder="무엇이든 물어보세요" />
              <div id="submit" @click="getMessages">➤</div>
            </div>
            <p class="info">ChatGPT는 실수를 할 수 있습니다. 중요한 정보는 재차 확인하세요.</p>
          </div>
        </section>
      </div>
    </div>
</template>

<script>
import { reactive, inject }       from 'vue'
import { ValdUtil }               from '@/utils/ValdUtil';
import { CmonUtil }               from '@/utils/CmonUtil';

export default {
    setup(){

    },
    data: function() {
		return {
            id: 0,
            currentTitle: "",
            prompt: "",
            message: "",
            previousChats: [],
        }
    },
    methods: {
        init: function() {
            const $this = this; 
            $this.initData();
        },
        initData(){
            const $this = this;

            $this.id = 0;
            $this.currentTitle = "";
            $this.prompt = "";
            $this.message = "";
            $this.previousChats = [
              { id: '1', title: "테스트 대화1", role: "user", content: "안녕! 너 뭐 하는 AI야?" },
              { id: '1', title: "테스트 대화1", role: "assistant", content: "안녕하세요! 저는 AI 챗봇입니다." },
              { id: '1', title: "테스트 대화1", role: "user", content: "Vue 관련해서 질문할 게 있어." },
              { id: '1', title: "테스트 대화1", role: "assistant", content: "네! 어떤 내용이 궁금하신가요?" },
              { id: '2', title: "테스트 대화2", role: "user", content: "네! ?" },
              { id: '2', title: "테스트 대화2", role: "assistant", content: "네! 어떤 내용이 궁금하신가요?" },
            ];
        },
        sendMsg(){
            const $this = this;
            
            let seq =  Math.max(...$this.msgList.map(msg => Number(msg.id))) + 1;
            if(ValdUtil.isNotNull($this.params.inptMsg)){
                $this.msgList.push({id : seq, text:$this.params.inptMsg, sender:'user'});
            } else {
                return false;
            }
            
            $this.$nextTick(()=>{
                $this.inptMsg = '';
            });
        },
        createNewChat() {
          this.id
          this.currentTitle = "";
          this.message = "";
          this.prompt = "";
        },
        // 히스토리 클릭 이벤트
        handleClick(uniqueTitle) {
          this.currentTitle = uniqueTitle;
          this.message = "";
          this.prompt = "";
        },
    },
    computed:{
      currentChat() {
        return this.previousChats.filter(chat => chat.title === this.currentTitle);
      },
      uniqueTitles() {
        return Array.from(new Set(this.previousChats.map(chat => chat.title)));
      }
    },
    watch: {
      message(newMessage) {
        if (!this.currentTitle && this.prompt && newMessage) {
          this.currentTitle = this.prompt;
        }
        if (this.currentTitle && this.prompt && newMessage) {
          this.previousChats.push(
            { title: this.currentTitle, role: "user", content: this.prompt },
            { title: this.currentTitle, role: newMessage.role, content: newMessage.content }
          );
        }
      }
    },
    mounted: function() {
        let $this = this;
        $this.init();
    },
}
</script>

<style>
.chat-container {
  background-color: #fff;
  display: flex;
  border: 1px solid rgb(170, 170, 170);
  border-radius: 10px;
}

.side-bar {
  width: 260px;
  height: 85vh;
  padding: 20px;
  background-color: #f5f5f5;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
}

.newChatBtn {
  border: solid 0.5px #cccccc;
  background-color: transparent;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
}

.navi {
  border-top: solid 0.5px rgb(216, 216, 216);
  padding: 20px 10px 10px 10px;
}

.history {
  padding: 10px;  
  height: 100%;
}

.history li {
  list-style-type: none;
  padding: 13px 13px 13px 13px;
  cursor: pointer;
  color: #000;
}

.history li:hover {
  border: 0.5px;
  border-radius: 15px;
  background-color: rgb(220, 220, 220);
  cursor: pointer; /* 마우스 포인터 효과 추가 */
}

.main {
  flex-grow: 1;
  padding: 20px;
  height: 85vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}

.info {
  color: black;
  font-size: 11px;
  padding: 10px;
  margin-top: 10px;
}

.feed {
  list-style-type: none;
  width: 70%;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.feed li {
  max-width: 60%;
  padding: 18px;
  margin: 8px 0;
  border-radius: 15px;
  word-wrap: break-word;
  display: flex;
  background-color: #444654;
  width: 100%;
}

.feed p {
  color: rgba(0, 0, 0, 0.8);
  font-size: 14px;
  text-align: left;
}

.feed p.role {
  min-width: 100px;
}

/* user 메시지 스타일*/
.feed li.user {
  align-self: flex-end;
  background-color: #f0f0f0;
  color: white;
  border-radius: 15px;
  text-align: right;
  width: 45%;
}

/* assistant 메시지 스타일*/
.feed li.assistant {
  align-self: center;
  border-radius: 15px;
  background-color: #f0f0f000;
}

.bottom-section {
  margin-top: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.chat-input {
  display: flex;
  align-items: center;
  color:black;
  position: relative;
  width: 100%;
  max-width: 650px;
}

.chat-input input {
  flex-grow: 1;
  padding: 10px;
  width: 100%;
  border: none;
  font-size: 13px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 12px 15px;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.05) 0 54px 55px,
  rgba(0, 0, 0, 0.05) 0 -12px 30px,
  rgba(0, 0, 0, 0.05) 0 4px 6px,
  rgba(0, 0, 0, 0.05) 0 5px 3px,
  rgba(0, 0, 0, 0.05) 0 -3px 5px;
}

input:focus {
  outline: none;
}

#submit {
  cursor: pointer;
  padding: 10px;
  background-color: #000000;
  color: white;
  border-radius: 100%;
  margin-left: 10px;
}

.welcome-message {
  display: block;
  width: 100%;
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  color: #555;
  margin-top: 250px;
}

.extra-buttons {
  display: flex;
  justify-content: flex-start; /* 왼쪽 정렬 */
  width: 100%;
  max-width: 650px; /* 입력창과 동일한 너비 */
  margin-bottom: 10px; /* 입력창과의 간격 */
}

.extra-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(197, 195, 195);
  border-radius: 20px;
  width: 70px;
  height: 30px;
  font-size: 13px;
  color: #555;
  text-align: center;
  margin-right: 10px; /* 버튼 간 간격 */
  cursor: pointer;
}

/* 마지막 버튼 오른쪽 마진 제거 */
.extra-button:last-child {
  margin-right: 0;
}

/* 아이콘 크기 조정 */
.extra-button img {
  height: 15px;
  width: 15px;
  margin-right: 5px;
}
</style>