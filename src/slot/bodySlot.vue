<template>
   <!-- <slot name="body">
      <div class="bg-bodytab animated row" v-cloak>
         <div class="tab-scroller tab-scroller-left float-left">
            <a href="#" @click="moveScroll('left')">
               <i class="fa fa-chevron-left"></i>
            </a>
         </div>

         <div class="tab-scroller tab-scroller-right float-right">
            <div class="btn-g btn-group-sm disp_in_block mg_right_5" role="group" style="margin-right:5px !important;">
               <button type="button" class="btn btn-topnav" @mouseover="toolTip.goback = true" @mouseleave="toolTip.goback = false" @click="goBackTab()" :disabled="histPos == 0">
                  <img src="@/assets/img/topnav_icon1.png" alt="이전">
               </button>
               <div v-if="toolTip.goback" class="tooltip_wrap">
                  <span>이전 화면으로 이동합니다</span>
               </div>
               <button type="button" class="btn btn-topnav" @mouseover="toolTip.forward = true" @mouseleave="toolTip.forward = false" @click="goForwardTab()"
                  :disabled="histPos == clickHist.length - 1">
                  <img src="@/assets/img/topnav_icon2.png" alt="다음">
               </button>
               <div v-if="toolTip.forward" class="tooltip_wrap" style="right:70px !important;">
                  <span>다음 화면으로 이동합니다</span>
               </div>
               <button type="button" class="btn btn-topnav" @mouseover="toolTip.reload = true" @mouseleave="toolTip.reload = false" @click="reloadTab(currMenuNo)">
                  <img src="@/assets/img/topnav_icon3.png" alt="새로고침">
               </button>
               <div v-if="toolTip.reload" class="tooltip_wrap" style="right:50px !important;">
                  <p>현재 화면으로 리로딩합니다</p>
               </div>
               <button v-if="currMenuNo !== '1'" class="btn btn-topnav" @mouseover="toolTip.close = true" @mouseleave="toolTip.close = false" @click="closeTab(currMenuNo)">
                  <img src="@/assets/img/topnav_icon5.png" alt="닫기">
               </button>
               <div v-if="toolTip.close" class="tooltip_wrap" style="right:30px !important;">
                  <p>현재 화면을 닫습니다</p>
               </div>
               <button v-if="menuList.length > 1" id="btn-close-tab" @mouseover="toolTip.closeAll = true" @mouseleave="toolTip.closeAll = false" type="button" class="btn btn-topnav" 
                  @click="closeAllTabs">
                  <img src="@/assets/img/topnav_icon4.png" alt="전체닫기">
               </button>
               <div v-if="toolTip.closeAll" class="tooltip_wrap" style="right:10px !important;">
                  <p>전체 화면을 닫습니다</p>
               </div>
            </div>
         </div>


         <div class="tab-scroller tab-scroller-right float-right tab-margin-right">
            <a href="#" @click="moveScroll('right')">
               <i class="fa fa-chevron-right"></i>
            </a>
         </div>

         <div class="tab-elements">
            <ul id="tab-list" class="nav nav-tabs" role="tablist">
               <template v-for="(menu, index) in menuList" :key="index">
                  <template v-if="!menu.isClose">   
                     <li :class="{ 'active': currMenuNo === menu.menuNo && !menu.isClose}" :id="'tab-menu-' + menu.menuNo">
                        <a href="javascript:void(0)" @click="activeTab(menu.menuNo)">
                           
                           <button class="fav" type="button" title="즐겨찾기 메뉴에서 삭제합니다." @click="deltFavo(menu.menuNo)"
                              v-if="isFavor(menu.menuNo) && menu.menuNo !== '1'">
                              <img src="@/assets/img/topnav_fav.png" alt="즐겨찾기">
                           </button>

                           <button class="fav-non" type="button" title="즐겨찾기 메뉴에 추가합니다." @click="saveFavo(menu.menuNo)"
                              v-if="!isFavor(menu.menuNo) && menu.menuNo !== '1'">
                              <img src="@/assets/img/sidebar_menu_icon0.png" alt="즐겨찾기 해제">
                           </button>

                           <span>{{ menu.menuNm }}</span>
                           <template v-if="index > 0">
                              <button class="close" type="button" title="화면을 닫습니다." @click="closeTab(menu.menuNo)">
                                 <img src="@/assets/img/topnav_close.png" alt="탭닫기">
                              </button>
                           </template>
                        </a>
                     </li>
                  </template>
               </template>
            </ul>
         </div>

         <div id="tab-content" class="tab-content">
            <div v-for="(menu, index) in menuList" class="tab-pane" :id="'tab' + menu.menuNo" :key="index"
               :class="{ 'active': currMenuNo === menu.menuNo && !menu.isClose, 'tab-pane': !menu.isClose}">
               <component v-if="!menu.isClose" :is="menu.instance" />
            </div>
         </div>
      </div>
   </slot>  -->

   <slot name="body">
      <div id="tab-content" class="tab-content">
            <div v-for="(menu, index) in menuList" class="tab-pane" :id="'tab' + menu.menuNo" :key="index"
               :class="{ 'active': currMenuNo === menu.menuNo && !menu.isClose, 'tab-pane': !menu.isClose}">
               <component v-if="!menu.isClose" :is="menu.instance" />
            </div>
         </div>
   </slot>
</template>

<script>

import { defineAsyncComponent, shallowRef } from 'vue'
import { SessionUtil } from '@/utils/SessionUtil.js';
// import Main from  '@/views/rept/stat/TotMon.vue'

import ChatBotServ from '@/views/chtbot/mng/ChatBotServ.vue'
// import TotMon      from '@/views/rept/stat/TotMon.vue'
import { ValdUtil } from '@/utils/ValdUtil';

export default {
   data: function () {
      return {
         params: {
            userId: '',
            clickMenuNo: '', // 별 눌렀을 때 메뉴 번호
         },
         MAX_TAB_CNT: 500,
         frameResizeObserver: null,
         currMenuNo: '1',
         menuList : [],
         // menuList: [
         //    { menuNm: 'Main', menuUrl: '/rept/stat/TotMon', menuNo: '1', active: true, instance: shallowRef(Main), isClose: false }
         // ],
         // clickHist: [
         //    { menuNm: 'Main', menuUrl: '/rept/stat/TotMon', menuNo: '1', active: true, instance: shallowRef(Main), isClose: false }
         // ],
         clickHist: [],
         histPos: 0,
         getMenuList: [],         // sideBarSlot에서 메뉴 리스트 가져올때 사용
         filteredMenuList: [],      // 메뉴레벨 필터링
         favoMenuList: [],         // 즐겨찾기
         favList: [],            // 즐겨찾기
         isFavorite: false,
         toolTip:{
            goback  : false, //이전
            forward : false, //다음
            reload  : false, //새로고침
            close   : false, //닫기
            closeAll: false, //전체닫기
         },
         isAdmin : false,
      }
   },
   methods: {
      // Role에 따른 메인 메뉴 세팅
      setMainMenu(){
         const $this = this;
         // if($this.isAdmin){
         //    $this.menuList  = [{ menuNm: 'Main', menuUrl: '/rept/stat/TotMon', menuNo: '1', active: true, instance: shallowRef(TotMon), isClose: false }];
         //    $this.clickHist = [{ menuNm: 'Main', menuUrl: '/rept/stat/TotMon', menuNo: '1', active: true, instance: shallowRef(TotMon), isClose: false }];
         // } else {
         //    $this.menuList  = [{ menuNm: 'Main', menuUrl: '/chtbot/mng/ChatBotServ' , menuNo: '1', active: true, instance: shallowRef(ChatBotServ), isClose: false }];
         //    $this.clickHist = [{ menuNm: 'Main', menuUrl: '/chtbot/mng/ChatBotServ', menuNo: '1', active: true, instance: shallowRef(ChatBotServ), isClose: false }];
         // }
      },


      loadFrame: function (id) {
         const $target = document.querySelector("#tabFrame_" + id);

         const $content = $target.contentWindow.document.querySelector("#wrapper");
         $content.setAttribute("data-frame", $target.getAttribute("data-frame"));
      },
      resetFrameContentHeight: function ($frame) {
         const $content = $frame.contentWindow.document.querySelector("#wrapper");
         let clientHeight = $content.scrollHeight + 40;
         if (document.querySelector("#tab-content").getClientRects().length !== 0) {
            let appHeight = window.innerHeight
               - (document.querySelector("#tab-content").getClientRects()[0].top
                  + document.querySelector(".footer").clientHeight);
            if (appHeight > clientHeight) {
               clientHeight = appHeight;
            }
         }
         $frame.style.height = clientHeight + "px";
      },
      reloadTab: function (menuNo) {
         const menuIndex = this.menuList.findIndex(m => m.menuNo === menuNo);
         if (menuIndex != 0) {
            this.menuList[menuIndex].instance = shallowRef(defineAsyncComponent(() => import('@/views' + this.menuList[menuIndex].menuUrl + '.vue')));
         }
      },
      // 기 추가된 Tab 인지 체크
      checkTab: function (menuNo) {
         /*
         중복해서 화면을 열수 있어
         if (this.menuList.find(menu => menu.menuNo === menuNo)) {
            this.currMenuNo = menuNo;
            return false;
         } else {
         */
         if (this.menuList.length > this.MAX_TAB_CNT) {
            // this.$swal.fire({
            //    icon: 'info',
            //    text: '탭은 ' + this.MAX_TAB_CNT + '개까지 열수 있습니다.'
            // });
            return false;
         } else {
            return true;
         }C1200-1755145653305
      },
      newTab: function (menu, isInit) {
         let timestamp = Date.now();
         if (this.checkTab(menu.menuNo)) {
            this.currMenuNo = menu.menuNo + '-' + timestamp;
            this.menuList.push({
               menuNm: menu.menuNm,
               menuUrl: menu.menuUrl,
               menuNo: this.currMenuNo,
               active: true,
               instance: shallowRef(defineAsyncComponent(() => import('@/views' + menu.menuUrl + '.vue'))),
               isClose: false,
            });
            // this.addActTbp(this.currMenuNo);

            this.$nextTick(() => {
               // this.onFocusTab(this.currMenuNo);
               this.activeTab(this.currMenuNo, isInit);
            });
         }
      },
      onFocusTab: function (menuNo) {
         // this.$nextTick(() => {
         const tabContainer = document.getElementById("tab-list");
         const tab = document.getElementById("tab-menu-" + menuNo);
         if ( tab != null ) {
            const ctxRect = tabContainer.getBoundingClientRect();
            const tabRect = tab.getBoundingClientRect();
            if (ctxRect.x > tabRect.x) {
               tabContainer.scrollBy(tabRect.x - ctxRect.x, 0);
            } else if (ctxRect.right < tabRect.right) {
               tabContainer.scrollBy(tabRect.right - ctxRect.right, 0);
            }
         }
         // });
      },
      activeTab(menuNo, div) {
         if (div == undefined) {
            this.addActTbp(menuNo);
         }
         this.currMenuNo = menuNo;
         if (div !== 'init') {
            this.emitter.emit('onSelectMenu', menuNo);
         }
         this.onFocusTab(menuNo);
      },
      moveScroll: function (direction, offset = 150) {
         const tabContainer = document.querySelector("ul#tab-list");
         if (direction === "left" && tabContainer.scrollLeft > 0) {
            tabContainer.scrollBy(-offset, 0);
         } else if (direction === "right" && (tabContainer.clientWidth + tabContainer.scrollLeft) < tabContainer.scrollWidth) {
            tabContainer.scrollBy(offset, 0);
         }
      },
      goBackTab() {
         if (this.histPos > 0) {
            this.histPos--;
            const page = this.clickHist[this.histPos].menuNo;
            this.activeTab(page, '1');
         }
      },
      goForwardTab() {
         if (this.histPos < this.clickHist.length - 1) {
            this.histPos++;
            const page = this.clickHist[this.histPos].menuNo;
            this.activeTab(page, '1');
         }
      },
      addActTbp(menuNo) {
         this.clickHist.splice(this.histPos + 1);
         this.clickHist.push({ 'menuNo': menuNo });
         this.histPos++;
      },
      closeTab: function (menuNo) {
         const menuIndex = this.menuList.findIndex(m => m.menuNo === menuNo);

         this.$swal.fire({
            icon: 'warning',
            text: "열려진 Tab이 삭제됩니다. 해당 메뉴에 저장하지 않으신 정보가 있으시면 저장해 주세요.\nTab을 삭제하시겠습니까?",
            showCancelButton: true,
            confirmButtonColor: '#0099d8',
            confirmButtonText: '확인',
            cancelButtonColor: '#5a5b5b',
            cancelButtonText: '취소',
         }).then((value) => {
            if (value.isConfirmed) {
               // this.menuList.splice(menuIndex, 1);
               this.menuList[menuIndex].isClose = true;
               for (let i = 0; i < this.clickHist.length; i++) {
                  if (this.clickHist[i].menuNo === menuNo) {
                     this.clickHist.splice(i, 1);
                     this.histPos--;
                     i--;
                  }
               }

               let validIdx = 0;
               this.menuList.filter((val, idx)=> {
                  if (!val.isClose) {
                     validIdx = idx;
                  }
               });
               this.activeTab(this.menuList[validIdx].menuNo, '1');
               this.$nextTick(() => {
                  this.moveScroll('right', 0);
               });
            }

         });

      },
      closeAllTabs: function () {
         let $this = this;
         const tabs = $("#tab-list li:not(:first)");

         if (tabs.length > 0) {
            this.$swal.fire({
               icon: 'warning',
               text: "열려진 Tab이 삭제됩니다. 해당 메뉴에 저장하지 않으신 정보가 있으시면 저장해 주세요.\nTab을 삭제하시겠습니까?",
               showCancelButton: true,
               confirmButtonColor: '#0099d8',
               confirmButtonText: '확인',
               cancelButtonColor: '#5a5b5b',
               cancelButtonText: '취소'
            }).then(function (value) {
               if (value.isConfirmed) {
                  $this.menuList.splice(1);
                  // if($this.isAdmin){
                  //    $this.clickHist = [{ menuNm: 'Main', menuUrl: '/rept/stat/TotMon', menuNo: '1', active: true, instance: shallowRef(Main), isClose: false }];
                  // } else {
                  //    $this.clickHist = [{ menuNm: 'Main', menuUrl: '/chtbot/mng/ChatBotServ', menuNo: '1', active: true, instance: shallowRef(ChatBotServ), isClose: false }];
                  // }
                  
                  $this.histPos   = 0;
                  $this.activeTab('1');

                  $this.$swal.fire({
                     icon: 'success',
                     text: '탭이 모두 삭제되었습니다.'
                  });
               }
            });
         }
      },

      //즐겨찾기 저장
      saveFavo: function (menuNo) {
         let $this = this;

         let clickMenuNo = menuNo.substr(0, 5);
         

         let param = {
            userId: $this.params.userId,
            menuNo: clickMenuNo
         }
         if (clickMenuNo != 1) {
            $this.doPost('/cmon/sys/sideBarMenuMng/saveUserFavo.hb', param,false).then(function (response) {
               $this.favoMenuList = [];
               if (response.data.rtnCd == '0000') {
                  for (let i = 0; i < response.data.rtnData.result.length; i++) {
                     $this.favoMenuList.push(response.data.rtnData.result[i]);
                     
                  }

               } else {
                  $this.alert(response.data.rtnData.rtnMsg);
               }
            });

            //sidebarSlot으로 전달할 이벤트
            $this.emitter.emit('addFavoList',clickMenuNo);

         } else {
         }


      },

      //즐겨찾기 삭제
      deltFavo: function (menuNo) {
         let $this = this;

         let clickMenuNo = menuNo.substr(0, 5);
         let param = {
            userId: $this.params.userId,
            menuNo: clickMenuNo
         }

         if (clickMenuNo != 1) {
            $this.doPost('/cmon/sys/sideBarMenuMng/deltUserFavo.hb', param,false).then(function (response) {
               $this.favoMenuList = [];
               if (response.data.rtnCd == '0000') {
                  for (let i = 0; i < response.data.rtnData.result.length; i++) {
                     $this.favoMenuList.push(response.data.rtnData.result[i]);
                  } 
               } else {
                  $this.alert(response.data.rtnData.rtnMsg);
               }
            });
            //sidebarSlot으로 전달할 이벤트
            $this.emitter.emit('deltFavoList',clickMenuNo);

         } else {

         }

      },

      // 현재 메뉴의 즐겨찾기 상태 여부를 반환
      isFavor: function (menuNo) {
         
         let $this = this;
         let getMenuNo = "";
         let clickMenuNo = "";
         getMenuNo = menuNo;
         $this.favList = [];
         clickMenuNo = menuNo.substr(0, 5);

         $this.favList = $this.favoMenuList.map(item => item.menuNo);

         return this.favoMenuList.some(item => item.menuNo === clickMenuNo);
      },

      

      chckMenuNo: function () {
         let $this = this;

         let menuNo = '';
         let param = {
            userId: $this.params.userId,
            menuNo: $this.params.clickMenuNo
         };

         $this.doPost('/cmon/sys/sideBarMenuMng/selectListUserFavo.hb', param).then(function (response) {

            for (let i = 0; i < response.data.rtnData.result.length; i++) {
               $this.favoMenuList.push(response.data.rtnData.result[i]);

            }
         });

         $this.favList = $this.favoMenuList.map(item => item.menuNo);
      },

      //sidebarSlot에서 메뉴리스트를 가져옴
      setMenuList: function (getMenuList) {
         let $this = this;

         // 메뉴 레벨이 3인 메뉴만 필터링
         getMenuList.filter(menu => menu.menuLevl > 2).forEach(menu => {

            if (menu.menuUrl) {
               menu.menuUrl = menu.menuUrl;
            }
            const sub = { ...menu, child: [], active: false, idPath: [menu.menuNo] };
            $this.filteredMenuList.push(sub);
            const parentMenu = $this.filteredMenuList.find(m => m.menuNo === sub.upprMenuNo);
         });
         // this.menuList = $this.filteredMenuList;
         let menuList = getMenuList;

         //교사가 접근할 수 있는 메뉴 세션에 저장 (탭 페이지 전환하기 위해서)
         SessionUtil.setCtchMenuList(menuList);
         
         $this.$nextTick(() => {
            $this.setDefaultPage(menuList);
         });
      },

      //화면 진입 시 디폴트 페이지 세팅 (클래스맵 소개)
      setDefaultPage(menuList) {
         const $this = this;
         const defaultPage = menuList.find(menu => menu.menuNo === 'C1200');
         $this.newTab(defaultPage, 'init');
      },


   },
   created: function () {
      let $this = this;
      $this.frameResizeObserver = new ResizeObserver(entries => {
         for (let entry of entries) {
            const $content = entry.target;
            const $frame = document.querySelector(".tab-content iframe[data-frame='" + $content.getAttribute("data-frame") + "']");
            //this.resetFrameContentHeight($frame);
         }
      });

      // $this.$on('SET_PARAM', function(param) {
      //    $this.$emit('GET_PARAM', param);
      // });
   },
   beforeMount(){
      
      let userId = SessionUtil.getUserId();
      
      if(ValdUtil.isNotNull(userId)){
         let userRoleList = SessionUtil.getUserRoleList();
         this.isAdmin     = userRoleList.some(
            item => item.roleCd === 'GNRL_ADMIN' || item.roleCd === 'SYS_ADMIN'
         );
         this.setMainMenu();
      }
      
   },

   mounted: function () {
      this.params.userId = SessionUtil.getUserId();
      this.emitter.on('onSetMenu', (getMenuList) => { this.setMenuList(getMenuList) });

      this.emitter.on('onNewTab', (menu) => { this.newTab(menu) });

      this.chckMenuNo();
   },
   unmounted: function () {
      if (this.frameResizeObserver !== null) {
         this.frameResizeObserver.disconnect();
      }
   },
   computed: {
      currentMenu() {
         return this.menuList.find(menu => menu.menuNo === this.currMenuNo);
      }
   },

}
</script>
<style>
@import "@/assets/css/slot_body.css";
</style>