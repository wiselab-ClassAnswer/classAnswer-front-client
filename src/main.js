import { createApp } from 'vue'
import App from '@/App.vue'
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import mitt from 'mitt'
import vSelect from 'vue-select'

const joint = require('@/static/plugins/jointjs/joint.js')

import $ from 'jquery'
import _ from 'lodash'

import VueSweetAlert from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

import 'jqGrid/js/i18n/grid.locale-kr.js'

// 그리드 핸들링 관련 모듈 2개 필수 (드래그 및 에디트 등...)
import 'jquery-ui/dist/jquery-ui.js'
import 'jqGrid/js/jquery.jqGrid.min.js'

import { LoadingPlugin } from 'vue-loading-overlay';
import { CmonUtil } from '@/utils/CmonUtil.js'
import { ValdUtil } from '@/utils/ValdUtil.js'
import { DateUtil } from '@/utils/DateUtil.js'
import baseMixins from '@/views/mixins/baseMixins.vue'

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
window.joint = joint;
window.emitter = emitter;

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$store = store;
app.config.globalProperties.emitter = emitter;
app.config.globalProperties._ = _;
app.config.globalProperties.CmonUtil = CmonUtil;
app.config.globalProperties.ValdUtil = ValdUtil;
app.config.globalProperties.DateUtil = DateUtil;

app.component('v-select', vSelect)
app.component('font-awesome-icon', FontAwesomeIcon);

app.mixin(baseMixins);

// provide를 사용하여 mixin의 메소드를 전달합니다.
app.provide('getDbConnList', baseMixins.methods.getDbConnList);
app.provide('getCmonCdList', baseMixins.methods.getCmonCdList);
app.provide('getCmonCdListSync', baseMixins.methods.getCmonCdListSync);
app.provide('getColIdNmList', baseMixins.methods.getColIdNmList);

app.use(router);
app.use(store);
app.use(VueSweetAlert);
app.use(LoadingPlugin);
//app.use(globalMethods);

import { ClearDirective } from '@/directive/ClearDirective.js'
import { FocusDirective } from '@/directive/FocusDirective.js'

app.directive("clear", ClearDirective);
app.directive("focus", FocusDirective);


const vm = app.mount('#app');
window.vueInstance = vm;

// window.appInstance = app;
// export default app;