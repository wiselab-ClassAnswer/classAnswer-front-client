<template>
    <slot name="topNav">
        <div class="row">
            <nav class="navbar navbar-static-top white-bg p-w-sm" role="navigation" style="margin-bottom: 0">
                <div class="navbar-header">
                    <a class="navbar-minimalize minimalize-styl-2 btn btn-hbg" href="#" @click="minimalize">
                        <i class="fa fa-bars"></i></a>
                </div>
                <div class="topnav-qm">
                    <VSelect class="wd-200" :options="menuList" :label="'menuNm'" :placeholder="placeholder" @onSelect="onSelectMenu"></VSelect>
                </div>
                <div class="topnav-box-wrap"></div>

                <div class="topnav-user">
                    <ul>
                        <span v-if="!userInfo.userId">
                            <li><button class="btn-normal wd-100" @click="open('lgin')">로그인</button></li>
                            <li><button class="btn-normal wd-100" @click="open('sign')">회원가입</button></li>
                        </span>
                        <span v-else>
                            <li class="m-r-10">{{ currDt }}</li>
                            <li class="user_name">{{ userInfo.userNm }} ({{ userInfo.userId }})&nbsp;&nbsp;</li>
                            <li>
                                <a class="logout_btn" href="#" @click="logout">|&nbsp;&nbsp;로그아웃</a>
                            </li>
                        </span>
                    </ul>
                </div>
            </nav>
        </div>
    </slot>

    <!-- 회원가입 팝업 -->
    <JoinAprvMng ref="JoinAprvMngRefModal"></JoinAprvMng>
</template>

<script>
import { SessionUtil } from '@/utils/SessionUtil';
import { CmonUtil } from '@/utils/CmonUtil.js'
import { ValdUtil } from '@/utils/ValdUtil.js';
import { DATE_FORMAT, TIME_FORMAT } from '@/utils/DateUtil.js';
import VSelect from '@/components/selector/VSelect.vue';
import { mapState } from 'vuex';
import JoinAprvMng from '@/views/cmon/cont/JoinAprvMng.vue'

export default {
    components: {
        VSelect,
        JoinAprvMng
    },
    data() {
        return {
            menuList: [],             // 필터링 전 메뉴 리스트
            filteredMenuList: [],     // 필터링 후 메뉴 리스트
            currDt: '',
            placeholder: '빠른 메뉴 검색',
        };
    },
    computed: {
        // Vuex store에서 userInfo 가져오기
        ...mapState({
            userInfo: state => state.account,  // Vuex의 account 모듈에서 사용자 정보 가져오기
        }),
    },
    created() {
        this.currentDateTime();
    },
    methods: {
        init() {
            this.getUserNm(); // 사용자 이름 설정
        },
        minimalize() {
            $("body").toggleClass("mini-navbar");
            this.smoothlyMenu();
        },
        smoothlyMenu() {
            if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                $('#side-menu').hide();
                setTimeout(() => {
                    $('#side-menu').fadeIn(400);
                }, 200);
            } else {
                $('#side-menu').removeAttr('style');
            }
        },
        getUserNm() {
            let userData = SessionUtil.getUserInfo();
            if (ValdUtil.isNotNull(userData)) {
                this.userInfo.userId = SessionUtil.getUserInfo().userId;
                this.userInfo.userNm = SessionUtil.getUserInfo().userNm;
            }
        },
        logout() {
            CmonUtil.logout();
        },
        currentDateTime() {
            setInterval(() => {
                this.currDt = this.DateUtil.getCurrDateTime(DATE_FORMAT + ' ' + TIME_FORMAT);
            }, 1000);
        },
        setMenuList(menuList) {
            let $this = this;
            menuList.filter(menu => menu.menuLevl > 1).forEach(menu => {
                if (menu.menuUrl) {
                    menu.menuUrl = menu.menuUrl;
                }
                const sub = {...menu, child:[], active: false, idPath: [menu.menuNo]};
                $this.filteredMenuList.push(sub);
            });
            let afFilterMenuList = $this.filteredMenuList.filter(mm => mm.upprMenuNo !== 'F0000');
            this.menuList = afFilterMenuList;
        },
        onSelectMenu(selectedMenu) {
            let $this = this;
            let select = selectedMenu;
            if (ValdUtil.isNotNull(select)) {
                $this.emitter.emit('onNewTab', { menu: select, div: true });
            }
        },
        open(type) {
            const $this = this;
            if (type === 'lgin') {
                $this.changePage('C1100', false);
            } else if (type === 'sign') {
                $this.$refs.JoinAprvMngRefModal.show();
                $this.$refs.JoinAprvMngRefModal.init(div);
            }
        }
    },
    mounted() {
        this.init();
        this.emitter.on('onSetMenu', (menuList) => {
            this.setMenuList(menuList);
        });
    }
};
</script>

<style scoped>
@import "@/assets/css/slot_topnav.css";
</style>
