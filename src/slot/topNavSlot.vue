<template>
    <slot name="topNav">
        <div class="row">
            <nav class="navbar navbar-static-top white-bg" role="navigation" style="margin-bottom: 0">

                <div class="navbar-header">
                    <a class="navbar-minimalize minimalize-styl-2 btn btn-hbg" href="#" @click="minimalize">
                        <i class="fa fa-bars"></i></a>
                </div>
                <div class="topnav-qm">
                    <VSelect class="wd-200" :options="menuList" :label="'menuNm'" :placeholder="placeholder" @onSelect="onSelectMenu"></VSelect>
                </div>
                
                <div class="topnav-box-wrap">
                    <!--
                    <div class="topnav-box box1">
                        <p class="topnav-box-head">Current</p>
                        <p class="topnav-box-body">{{ this.currDt }}</p>
                    </div>
                    
                    <div class="topnav-box box2">
                        <p class="topnav-box-head">Today</p>
                        <ul class="topnav-box-body">
                            <li>Total : 123</li>
                            <li>Active : 100</li>
                            <li>issue : 23</li>
                        </ul>
                    </div>
                    -->
                </div>

                <div class="topnav-user">
                    <ul>
                        <span v-if="userInfo.userId === ''">
                            <li>
                                <button class="btn-normal wd-100" @click="open">로그인</button>
                            </li>

                            <li>
                                <button class="btn-normal wd-100" @click="open">회원가입</button>
                            </li>
                        </span>

                        <span v-else>
                            <li class="m-r-10">{{currDt}}</li>
                            <li class="user_name">{{ userInfo.userNm }} ({{ userInfo.userId }})&nbsp;&nbsp;</li>
                            <li>
                                <a class="logout_btn" href="#" @click="logout">
                                    <!-- <i class="fa fa-sign-out"></i> 로그아웃 -->
                                    |&nbsp;&nbsp;로그아웃
                                </a>
                            </li>
                        </span>
                        
                    </ul>
                </div>

            </nav>
        </div>
    </slot>
</template>

<script>
import { SessionUtil } from '@/utils/SessionUtil';
import { CmonUtil } from '@/utils/CmonUtil.js'
import { ValdUtil } from '@/utils/ValdUtil.js';
import { DATE_FORMAT, TIME_FORMAT } from '@/utils/DateUtil.js';
import VSelect from '@/components/selector/VSelect.vue';


export default {
    components: {
        VSelect
    },
    data: function () {
        return {
            menuList: [],             // 필터링 전 메뉴 리스트
            filteredMenuList: [],     // 필터링 후 메뉴 리스트
            userInfo: {
                userId: '',
                userNm: '',
                roleList: []
            },
            currDt: '',
            placeholder: '빠른 메뉴 검색'            
        }
    },
    created() {
        this.currentDateTime();
    },
    methods: {
        init: function () {
            let $this = this;
            this.getUserNm();
        },
        minimalize: function () {

            let $this = this;
            $("body").toggleClass("mini-navbar");
            this.smoothlyMenu();
        },
        smoothlyMenu: function () {
            if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                // Hide menu in order to smoothly turn on when maximize menu
                $('#side-menu').hide();
                // For smoothly turn on menu
                setTimeout(
                    function () {
                        $('#side-menu').fadeIn(400);
                    }, 200);
            } else if ($('body').hasClass('fixed-sidebar')) {
                $('#side-menu').hide();
                setTimeout(
                    function () {
                        $('#side-menu').fadeIn(400);
                    }, 100);
            } else {
                // Remove all inline style from jquery fadeIn function to reset menu state
                $('#side-menu').removeAttr('style');
            }
        },
        getUserNm: function () {
            let userData = SessionUtil.getUserInfo();
            if (ValdUtil.isNotNull(userData)) {
                this.userInfo.userId = SessionUtil.getUserInfo().userId;
                this.userInfo.userNm = SessionUtil.getUserInfo().userNm;
            }
        },

        logout: function () {
            CmonUtil.logout();
        },
        // 실시간 날짜 / 시간
        currentDateTime: function () {
            setInterval(() => {
                this.currDt = this.DateUtil.getCurrDateTime(DATE_FORMAT + ' ' + TIME_FORMAT);
            }, 1000);
        },
        filteredMenu: function(e) {
            let val = e.target.value;
            // console.log(val);
        },
        setMenuList: function(menuList) {
            let $this = this;
        
            // 메뉴 레벨이 3인 메뉴만 필터링
            menuList.filter(menu => menu.menuLevl > 1 ).forEach(menu => {

                if ( !!menu.menuUrl ) {
                    menu.menuUrl = menu.menuUrl;
                }
                const sub = {...menu, child:[], active: false, idPath: [menu.menuNo]};
                $this.filteredMenuList.push(sub);
            });
            let afFilterMenuList = $this.filteredMenuList.filter(mm => mm.upprMenuNo !== 'F0000');
            this.menuList = afFilterMenuList;

        },
        onSelectMenu: function(selectedMenu) {
            let $this = this;

            let select = null;
            select = selectedMenu;
            // X 버튼을 누를경우 selectMenu값이 null이 되기 때문에 null이 아닐때만 emit
            if(ValdUtil.isNotNull(select)){
                $this.emitter.emit('onNewTab', select);
            }
        },

        open() {

    }   ,     
        
    },
    mounted() {
        this.init();
        this.emitter.on('onSetMenu', (menuList) => {this.setMenuList(menuList);});
    }
}
</script>

<style scoped>
@import "@/assets/css/slot_topnav.css";
</style>