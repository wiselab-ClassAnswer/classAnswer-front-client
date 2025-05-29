<template>
    <slot name="sidebar">
        <nav class="navbar-default navbar-static-side" role="navigation">
            <div id="navigation" class="sidebar-collapse">
                <ul class="nav metismenu" id="side-menu">
                    <li class="nav-header" onclick="window.location.reload()">
                        <div class="dropdown profile-element t-a-c p-t-15">
                            <a href="#" aria-expanded="false">
                                <!-- <span class="block m-t-xs font-bold">BACK OFFICE</span>
                                <span class="text-muted text-xs block">wiselab GPT Service</span> -->
                                <img class="w-80" src="@/assets/img/logo.png" alt="Wise-GPT">
                            </a>
                        </div>
                        <div class="logo-element">
                            <!-- <span>TDM</span> -->
                            <img src="@/assets/img/logo_folded.png" alt="Wise-GPTM">
                        </div>
                    </li>

                    <li v-for="(menu) in menuTree" :key="menu.menuNo" :id="menu.menuNo" :menuTree="'0_0_' + menu.menuNo" :class="{'active': menu.active}">
                        <a class="sidemenu" href="#" @click="handlerMenu(menu)" >
                            <i :class="(!menu.iconInfo ? 'fa fa-dot-circle-o' : menu.iconInfo)"></i>
                            <span class="nav-label">{{menu.menuNm}}</span><span class="fa arrow"></span>
                        </a>
                        <template v-if="menu.child.length > 0">
                            <transition name="collapse-menu">
                                <ul v-if="menu.active" :id="'submenu_' + menu.menuNo" class="nav nav-second-level" :aria-expanded="menu.active">
                                    <li v-for="(child) in menu.child" :key="child.menuNo" :id="child.menuNo" :class="{'active': child.active}">
                                        <a href="#" @click="handlerMenu(child);">{{child.menuNm}}<span v-if="child.child.length > 0" class="fa arrow"></span></a>
                                        <template v-if="child.child.length > 0">
                                            <transition name="collapse-menu">
                                                <ul v-if="child.active" class="nav nav-third-level" :id="'submenu_' + child.menuNo" :aria-expanded="child.active">
                                                    <li v-for="(child2) in child.child" :key="child2.menuNo" :id="child2.menuNo" :class="{'active': child2.active}">
                                                        <a href="#" @click="handlerMenu(child2);">{{child2.menuNm}}</a>
                                                    </li>
                                                </ul>
                                            </transition>
                                        </template>
                                    </li>
                                </ul>
                            </transition>
                        </template>
                    </li>
                </ul>
            </div>
        </nav>
    </slot>
</template>
  
<script>
import { SessionUtil } from '@/utils/SessionUtil.js';
import { ValdUtil } from '@/utils/ValdUtil';
  
export default {
    data: function() {
        return {
            params : {
                componentKey: 0,
                userId: '',
                menuNo: null,
            },
            currentMenu: null,
            menuTree: [],
            filteredMenuList: [],
            menuList: [],
            roleList: [],
            menuData: [],
        }
    },
    methods: {
        init: function() {
            let $this = this;
  
        },
        getMenuList: function() {
            let $this = this;

            let sendParam = {
                userId : $this.params.userId
            }
            $this.menuData = [];
            if (ValdUtil.isNotNull($this.params.userId)) {
                $this.doPost('/cmon/sys/sideBarMenuMng/selectListSideBarMenuMng.hb', sendParam).then(function (response) {
                    $this.menuData = response.data.rtnData.result;
                    $this.menuData.unshift({menuNo: 'F0000', upprMenuNo: '00000', menuUrl: '', menuNm: '즐겨찾기', menuDesc: '즐겨찾기 분류',iconInfo:'fa fa-regular fa-star',useYn:'Y',menuLevl:1 ,sortSeq:0})
                    
                    $this.initializeMenuData($this.menuData);
                    $this.filteredMenuList = $this.menuList.filter(menu => !!menu.menuUrl);
    
                    $this.params.componentKey += 1;
    
                    // $this.$nextTick(() => {
                    //     document.querySelectorAll(".sidebar-collapse .nav").forEach(el => {
                    //         el.style.setProperty("--max-height", el.scrollHeight + "px");
                    //     });
                    // });
    
                    $this.emitter.emit('onSetMenu', $this.menuData);
                    
                    // emitter 
                    $this.emitter.on('onSetFilterMenu', function () {
                        // emitter 이벤트 발생시 'onSetFilterMenu-event' 이벤트를 발생시켜야 값이 전달 됨
                        $this.emitter.emit('onSetFilterMenu-event', $this.filteredMenuList);
                    });

                });
            }
        },

        getUserRoleList: function(){
            let $this = this;
          
            let userRoleList = SessionUtil.getUserRoleList();
            let usersId = SessionUtil.getUserId();
  
            this.params.userId = usersId;
      
            for(var i = 0; i < userRoleList.length ; i ++ ) {
                this.roleList.push(userRoleList[i].roleCd);
            }
        },
  
        initializeMenuData: function(menuData) {
            let $this = this;
            
            // // Root Menu
            // menuData.filter(menu => menu.menuLevl === 0).forEach(menu => {
            //     // console.log("levl0.menu.menuNo:"+menu.menuNo);
            //     const pos = $this.menuList.push({...menu, child:[], active: false, idPath: [menu.menuNo]});
            // });
            // 1뎁스
            menuData.filter(menu => menu.menuLevl === 1).forEach(menu => {
                const pos = $this.menuList.push({...menu, child:[], active: false, idPath: [menu.menuNo]});
                $this.menuTree.push($this.menuList[pos - 1]);
            });
  
            // 나머지뎁스
            menuData.filter(menu => menu.menuLevl !== 1 ).forEach(menu => {
                // console.log("levl2.menu.menuNo:"+menu.menuNo);
                if ( !!menu.menuUrl ) {
                    menu.menuUrl = menu.menuUrl;
                }
                const sub = {...menu, child:[], active: false, idPath: [menu.menuNo]};
                $this.menuList.push(sub);
                const parentMenu = $this.menuList.find(m => m.menuNo === sub.upprMenuNo);
                
                sub.idPath.push(...parentMenu.idPath);
                parentMenu.child.push(sub);
           
                
            });
       
        },
        // 탭에 의한 메뉴 선택
        selectMenu: function(menuNo) {
            this.menuList.filter(menu => menu.active).forEach(menu => menu.active = false);
  
            if (menuNo === '1') {
                this.currentMenu = null;
                return;
            }
            this.currentMenu = this.menuList.find(menu => menuNo.indexOf(menu.menuNo) > -1 && menu.upprMenuNo !== 'F0000');
            this.activeMenu(this.currentMenu);
        },
  
        // 선택된 메뉴 활성화
        activeMenu: function(menu) {
            let $this = this;
            if ( !!menu ) {
                menu.active = true;
                const paths = menu.idPath;
                if (paths.length > 1) {
                    for (const path of paths) {
                        const selMenu = $this.menuList.find(m => m.menuNo === path);
                        if (selMenu) {
                            selMenu.active = true;
                        }
                    }
                }
                
            }
        },
  
        // 탭 추가 또는 하위메뉴 열기
        handlerMenu: function(menu) {
            if ( !!menu.menuUrl ) {
                this.currentMenu = menu;
                menu.active = true;
                this.selectMenu(menu.menuNo);
                this.emitter.emit('onNewTab', menu);
            } else {
                if ( menu.active ) {
                    menu.active = false;
                } else {
                    this.menuList.filter(menu => menu.active).forEach(menu => menu.active = false);
                    this.activeMenu(menu);
                }
            }
        },
        openMenuByMenuNo(menuNo, key, params) {
            const menu = this.getMenuByMenuNo(menuNo);
            this.openWithParams(menu, key, params);
        },
        getMenuByMenuNo: function(menuNo) {
            const flatMenus = _.flatMapDeep(this.menuList);
            const menu = flatMenus.find(m => m.menuNo === menuNo);
            if (!!menu) {
                return menu;
            }
            return null;
        },
        openWithParams(menu, key, params) {
            let rtnVal;
            if ( !!menu ) {
                if (params) {
                    SessionUtil.setStorageData("window:" + key + ":params", params);
                }
                if (!index.checkTab(menu.menuNo)) {
                    this.selectMenu(menu.menuNo)
                    rtnVal = 'N';
                }
                else {
                    // new menu
                    this.handlerMenu(menu);
                    rtnVal = 'Y';
                }
            }
  
            return rtnVal;
        },

        // 즐겨찾기 메뉴에 즐겨찾기 추가한 메뉴 추가
        addFavoMenu: function (menuNo) {
            let $this = this;
            let menu = $this.menuList.find(item => item.menuNo === menuNo);
            let upprMenu = $this.menuTree.find(item => item.menuNo === 'F0000');

            upprMenu.child.push(menu);
        
        },
        // 즐겨찾기 메뉴에 즐겨찾기 추가한 메뉴 삭제
        deltFavoMenu: function (menuNo) {
            let $this = this;
            let menu = $this.menuList.find(item => item.menuNo === menuNo);
            let upprMenu = $this.menuTree.find(item => item.menuNo === 'F0000');

            for(let i = 0 ; i < upprMenu.child.length; i++){
                if(upprMenu.child[i].menuNo === menu.menuNo){
                    upprMenu.child.splice(i,1);
                    i--;
                }
            }
        }
    },
    watch: {
        'params.menuNo': function(menuNo) {
            let menu = this.menuList.find(item => item.menuNo === menuNo);
            this.handlerMenu(menu);
        }
    },
    created() {
        //bodySlot에서 보낸 emitter   
        this.emitter.on('addFavoList', this.addFavoMenu);
        this.emitter.on('deltFavoList', this.deltFavoMenu);
    },
    mounted: function () {
        this.init();
        this.getUserRoleList();
        this.getMenuList();
        this.emitter.on('onHandlerMenu', (menu) => {this.handlerMenu(menu)});
        this.emitter.on('onSelectMenu' , (menuNo) => {this.selectMenu(menuNo)});
    }
}
</script>

<style>
@import "@/assets/css/slot_sidebar.css";
</style>
