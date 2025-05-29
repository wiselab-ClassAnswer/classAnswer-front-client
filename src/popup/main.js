import { createApp } from 'vue'
import App from '@/popup/App.vue'
import axios from 'axios'
import store from '@/store'
import router from '@/popup/router'
import mitt from 'mitt'

import $ from 'jquery'
import _ from 'lodash'

import VueSweetAlert from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

import 'jqGrid/js/i18n/grid.locale-kr.js'

import 'jqGrid/js/jquery.jqGrid.min.js'
import 'jqGrid/js/i18n/grid.locale-kr.js'

import { LoadingPlugin } from 'vue-loading-overlay';
import { CmonUtil } from '@/utils/CmonUtil.js'
import { ValdUtil } from '@/utils/ValdUtil'
import { DateUtil } from '@/utils/DateUtil.js'
import baseMixins from '@/views/mixins/baseMixins'

// fontawesom import
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(fas);

/*
import globalMethods from '@/utils/globalMethods.js'
*/
const emitter = mitt();

window.$ = $;
window.jQuery = $;
window.emitter = emitter;

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$store = store;
app.config.globalProperties.emitter = emitter;
app.config.globalProperties._ = _;
app.config.globalProperties.CmonUtil = CmonUtil;
app.config.globalProperties.ValdUtil = ValdUtil;
app.config.globalProperties.DateUtil = DateUtil;

app.component('font-awesome-icon', FontAwesomeIcon);

app.mixin(baseMixins);

// provide를 사용하여 mixin의 메소드를 전달합니다.
app.provide('getCmonCdList', baseMixins.methods.getCmonCdList);
app.provide('getCmonCdListSync', baseMixins.methods.getCmonCdListSync);
app.provide('getColIdNmList', baseMixins.methods.getColIdNmList);

app.use(router);
app.use(store);
app.use(VueSweetAlert);
app.use(LoadingPlugin);

app.mount('body');