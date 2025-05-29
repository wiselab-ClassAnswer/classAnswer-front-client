import { SessionUtil } from '@/utils/SessionUtil.js'
import { ValdUtil } from '@/utils/ValdUtil.js'
// import { DateUtil, DATE_FORMAT_WITHOUT_DELIMETER } from '@/utils/DateUtil.js'
import moment from "moment";
// import { AjaxUtil } from '@/utils/AjaxUtil.js'
import AxiosUtil from '@/utils/AxiosUtil.js'
import store from '@/store'
import * as types from '@/store/mutation-types'
import router from '@/router'
import { _ } from 'core-js'
import { DateUtil } from './DateUtil';
// PDF 다운로드
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {margunFonts} from '/src/assets/fonts/fonts.js'

export const CmonUtil = {

    appendFormdata : function(pFormData, data, name){
        name = name || '';
        if (typeof data === 'object'){
            $.each(data, function(index, value){
                if (name == ''){
                    //console.log("index : "+index);
                    appendFormdata(pFormData, value, index);
                } else {
                    appendFormdata(pFormData, value, name + '['+index+']');
                }
            })
        } else {
            pFormData.append(name, data);
        }
    },

    removeEmoji : function(val) {
        if(!val || val == '') return val;
        return val.replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])/g, '');
    },

    checkStock : function(_this)  {
        var temp = _this.value; // .toLowerCase();
        temp = temp.replace(/[^0-9]/gi, '');
        _this.value = temp;
        if(_this.value.length>20){
            _this.value =_this.value.substring(0, 20);
        }
    },

    clone : function(obj) {
        if (obj === null || typeof (obj) !== 'object')
            return obj;
        var copy = obj.constructor();
        for ( var attr in obj) {
            if (obj.hasOwnProperty(attr)) {
                copy[attr] = obj[attr];
            }
        }
        return copy;
    },

    // HTML <> 안의 내용을 지운다.
    removeHTML : function(repStr) {
        repStr = repStr.replaceAll("<BR>", "=BR=").replaceAll("<br>", "=BR=").replaceAll("<p>", "=BR=").replaceAll("<P>", "=BR=");
        var objStrip = /[<][^>]*[>]/gi;
        var objStrip2 =  /<title>(.*?)<\/title>/gi;
        repStr = repStr.replace(objStrip2, "");
        return repStr.replace(objStrip, "").replaceAll("=BR=", "<br>");
    },

    // HTML <> 안의 내용을 지운다.
    removeHTMLAll : function(repStr) {
        var objStrip = /[<][^>]*[>]/gi;
        return repStr.replace(objStrip, "");
    },

    // HTML <> 안의 내용을 지운다.
    isTagHTML : function(repStr) {
        // console.log("repStr : " + repStr);
        var objStrip = /[<][^>]*[>]/gi;
        var repStr2 = repStr.replace(objStrip, "");
        // console.log("repStr2 : " + repStr2);
        if (repStr != repStr2) return true;
        else return false;
    },

    // String.prototype.replaceAll = replaceAll;
    replaceAll : function(strValue1, strValue2) {
        var strTemp = this;
        strTemp = strTemp.replace(new RegExp(strValue1, "g"), strValue2);
        return strTemp;
    },

    // 이미지 확장자 체크
    checkImgFileName : function(fileName) {
        var isErr = false,
            ext = [];
        var sarry = fileName.split("\\");   // 선택된 이미지 화일의 풀 경로

        // 파일 존재 여부 검사
        if (sarry.length <= 0) {
            return false;
        }

        // 확장자 추출
        ext = sarry[sarry.length - 1].split(".");
        // 확장자 존재 여부 검사
        if (ext.length <= 0) {
            return false;
        }
        if (ext[ext.length - 1].toLowerCase() != "jpg" &&
            ext[ext.length - 1].toLowerCase() != "jpeg" &&
            ext[ext.length - 1].toLowerCase() != "png") {

            this.alert("확장자명이 .jpeg, .jpg, .png만 사용 가능합니다.");
            return false;
        }

        return true;
    },

    delSpecialChar : function(valueStr){
        // console.log(valueStr);
        var re =/[\~!@#$%<>^&*\\()\=+_|'"]/gi;
        if (re.test(valueStr)) {
            this.alert("Do not use space or special character.");
            valueStr = valueStr.replace(re,"");
        }
        // console.log(valueStr);
        return valueStr;
    },

    delSpecialCharNoAlert : function(valueStr){
        // console.log(valueStr);
        var re =/[\~!@#$%<>^&*\\()\=+_|'"]/gi;
        if (re.test(valueStr)) {
            valueStr = valueStr.replace(re,"");
        }
        // console.log(valueStr);
        return valueStr;
    },
    numberLock : function(valueStr, $event) {
        var key = ($event.which) ? $event.which : $event.keyCode;
        var re = /[^0-9\r\n]+/gm;
        if(!((key == 8) || (key == 9) || (key == 13) || (key == 16) || (key == 37) || (key == 39) || (key == 116))
            || ($event.type == "keyup" && $event.ctrlKey && key == 86)){
            if(re.test(valueStr)) {
                this.alert('숫자형식이 잘못되었습니다.');
                valueStr = valueStr.replace(/[^0-9\r\n]+/gm,"");
                return valueStr;
            }
        }
        return valueStr;
    },

    getParameters : function (paramName) {
        // 리턴값을 위한 변수 선언
        var returnValue;

        // 현재 URL 가져오기
        var url = location.href;

        // get 파라미터 값을 가져올 수 있는 ? 를 기점으로 slice 한 후 split 으로 나눔
        var parameters = (url.slice(url.indexOf('?') + 1, url.length)).split('&');

        // 나누어진 값의 비교를 통해 paramName 으로 요청된 데이터의 값만 return
        for (var i = 0; i < parameters.length; i++) {
            var varName = parameters[i].split('=')[0];
            if (varName.toUpperCase() == paramName.toUpperCase()) {
                returnValue = parameters[i].split('=')[1];
                return decodeURIComponent(returnValue);
            }
        }
    },

    // 자릿수만큼 0 채우기
    pad : function(n, width) {
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
    }, 
    //전환규칙포맷팅
    //rrno,frno
    formatRrno(data){
        let returnVal = '';
        if(data != undefined && data != ''){
            returnVal = data.replaceAll('-','').replaceAll(' ','');
            returnVal = returnVal.substring(0,6)+"-"+returnVal.substring(6,returnVal.length);
        }
        return returnVal;
    },
    formatTel(data){
        let returnVal = '';
        if(data != undefined && data != ''){
            returnVal = data.replaceAll('-','').replaceAll(' ','');
            //서울,지역 구분
            let lcDiv = returnVal.substring(0,2) == '02' ? returnVal.substring(0,2) : returnVal.substring(0,3);
            
            let i = (returnVal.length - lcDiv.length) < 8 ? 3 : 4;

            let mid = returnVal.substring(lcDiv.length, (lcDiv.length + i))
            let last = returnVal.substring((lcDiv.length + mid.length), returnVal.length)

            returnVal = lcDiv+"-"+mid+"-"+last;
        }
        return returnVal;
    },
    /**
     * oldVal 포맷을 newVal에 적용
     * @param {*} oldVal 
     * @param {*} newVal 
     * @returns String returnVal
     */
    formatConv(oldVal,newVal){
        let returnVal = '';
        if(newVal != undefined && newVal != '' && oldVal != undefined && oldVal != ''){
            returnVal = newVal;
            let re = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g;
            let oldValSplit = oldVal.split(re);
            
            oldValSplit.forEach((el,i)=>{
                let sliceIdx = 0;
                oldValSplit.forEach((strEl,strLenIdx)=>{
                    if(i >= strLenIdx){
                        sliceIdx = sliceIdx + strEl.length;
                    }
                });
                sliceIdx = sliceIdx + i;
                let insertStr = oldVal.substr(sliceIdx,1);                
                returnVal = returnVal.slice(0,sliceIdx) + insertStr + returnVal.slice(sliceIdx)
            });
        }
        return returnVal;
    },
    // 윈도우 팝업 열기
    openWinPop : function(opt) {
        if (ValdUtil.isNull(opt.name)) {
            alert("팝업 이름은 필수 항목입니다.");
            return false;
        }

        if (ValdUtil.isNull(opt.url)) {
            alert("팝업 주소는 필수 항목입니다.");
            return false;
        }

        // 팝업 넓이
        var popWidth = this.toInt(opt.width);

        if (popWidth == 0) {
            alert("팝업 넓이는 필수 항목입니다.");
            return false;
        }

        // 팝업 높이
        var popHeight = this.toInt(opt.height);

        if (popHeight == 0) {
            alert("팝업 높이는 필수 항목입니다.");
            return false;
        }

        // 위치 정보
        var curTop    = window.screenY;
        var curLeft   = window.screenX;
        var curWidth  = document.body.clientWidth;
        var curHeight = window.outerHeight;

        // 부모 넓이
        if (window.parent != window.self) {
            curWidth = window.parent.document.body.clientWidth;
        }

        // 브라우저 정보
        var ua = navigator.userAgent.toLowerCase();

        // 팝업 추가 높이
        var etcHeight = 60;

        // 브라우저 체크
        if (ua.indexOf("msie") != -1 || ua.indexOf("trident") != -1) {
            etcHeight = 36;
        } else if (ua.indexOf("edge") != -1) {
            etcHeight = 90;
        } else if (ua.indexOf("firefox") != -1) {
            etcHeight = 69;
        }

        // 팝업 좌표
        var popTop  = Math.ceil(curTop + ((curHeight - popHeight - etcHeight) / 2));
        var popLeft = Math.ceil(curLeft + ((curWidth - popWidth) / 2));

        // 팝업 옵션
        var popOpt = "top=" + popTop + ", left=" + popLeft + ", width=" + popWidth + ", height=" + popHeight + ", scrollbars=yes, resizable=yes, status=no";

        // 팝업 열기
        window.open(opt.url, opt.name, popOpt);
    },

    // 숫자만 추리기
    extractNumbers(input) {
        let numbersOnly = '';
        if ( ValdUtil.isNotNull(input) ) {
            numbersOnly = input.replace(/\D/g, '');
        }
        return numbersOnly;
    },

    // 기간 날짜 구하기
    getPeriodDate : function(type) {
        let dateFormatPattern = 'YYYY-MM-DD';
        let nowDate = moment();
        let dateFormat = dateFormatPattern.toUpperCase();
        let strDt = "";
        let endDt = "";

        if (type == "TODAY") {
            strDt = nowDate.format(dateFormat);
            endDt = nowDate.format(dateFormat);
        } else if (type == "YESTERDAY") {
            strDt = nowDate.clone().subtract(1, "days").format(dateFormat);
            endDt = nowDate.clone().subtract(1, "days").format(dateFormat);
        } else if (type == "RECENT_WEEK") {
            strDt = nowDate.clone().subtract(7, "days").format(dateFormat);
            endDt = nowDate.format(dateFormat);
        } else if (type == "THIS_WEEK") {
            strDt = nowDate.startOf("week").format(dateFormat);
            endDt = nowDate.endOf("week").format(dateFormat);
        } else if (type == "LAST_WEEK") {
            strDt = nowDate.clone().subtract(1, "weeks").startOf("week").format(dateFormat);
            endDt = nowDate.clone().subtract(1, "weeks").endOf("week").format(dateFormat);
        } else if (type == "RECENT_MONTH") {
            strDt = nowDate.clone().subtract(30, "days").format(dateFormat);
            endDt = nowDate.format(dateFormat);
        } else if (type == "THIS_MONTH") {
            strDt = nowDate.startOf("month").format(dateFormat);
            endDt = nowDate.endOf("month").format(dateFormat);
        } else if (type == "LAST_MONTH") {
            strDt = nowDate.clone().subtract(1, "months").startOf("month").format(dateFormat);
            endDt = nowDate.clone().subtract(1, "months").endOf("month").format(dateFormat);
        } else if (type == "PRE_THREE_MONTH") {
            strDt = nowDate.clone().subtract(3, "months").format(dateFormat);
            endDt = nowDate.format(dateFormat);
        } else if (type == "PRE_SIX_MONTH") {
            strDt = nowDate.clone().subtract(6, "months").format(dateFormat);
            endDt = nowDate.format(dateFormat);
        } else if (type == "PRE_ONE_YEAR") {
            strDt = nowDate.clone().subtract(1, "years").format(dateFormat);
            endDt = nowDate.format(dateFormat);
        }

        return { strDt: strDt, endDt: endDt};
    },

    copyToClipBoard : function(cpValue){
        var t = document.createElement("textarea");
        document.body.appendChild(t);
        t.value = cpValue;
        t.select();
        document.execCommand('copy');
        document.body.removeChild(t);

        // var aux = document.createElement("div");
        // aux.setAttribute("contentEditable", true);
        // //aux.innerHTML = document.getElementById(element_id).innerHTML;
        // aux.innerHTML = cpValue;
        // aux.setAttribute("onfocus", "document.execCommand('selectAll',false,null)");
        // document.body.appendChild(aux);
        // aux.focus();
        // document.execCommand("copy");
        // document.body.removeChild(aux);
    },

    // 비밀번호 형식 체크
    isMemScrtNoError : function(memScrtNo) {

        var num = memScrtNo.search(/[0-9]/g);
        var eng = memScrtNo.search(/[a-z]/ig);
        var spe = memScrtNo.search(/[~!@#$%^&*()_+|<>?:{}\-]/);

        //비밀번호 미입력
        if(memScrtNo.length === 0){
            return true;
        }

        //비밀번호 자리수 8자리 ~ 16자리
        if(memScrtNo.length < 8 || memScrtNo.length > 16){
            return true;
        }

        //비밀번호 공백 미허용
        if(memScrtNo.search(/\s/) != -1){
            return true;
        }

        // 영문,숫자, 특수문자를 혼합
        if(num < 0 || eng < 0 || spe < 0 ){
            return true;
        }

        return false;
    },

    // setAutoLoginYn: function(autoLoginYn) {
    //     const userAgent = navigator.userAgent.toLowerCase();
    //     if ( this.isAndroidApp(userAgent) ) {
    //         return android.setAutoLoginYn(autoLoginYn);
    //     } else if ( this.isIosApp() ) {
    //         return window.webkitURL.messageHandlers.webViewMessageHandler.postMessage();
    //         // webViewMessageHandler 가 앱개발자와 맞춰야 할것
    //     } else {
    //         return '';
    //         // return window.opener.postMEssage(message);
    //     }
    // },

    // getAutoLoginYn: function() {
    //     const userAgent = navigator.userAgent.toLowerCase();
    //     if ( this.isAndroidApp(userAgent) ) {
    //         return android.getAutoLoginYn();
    //     } else if ( this.isIosApp() ) {
    //         return window.webkitURL.messageHandlers.webViewMessageHandler.postMessage();
    //         // webViewMessageHandler 가 앱개발자와 맞춰야 할것
    //     } else {
    //         return '';
    //         // return window.opener.postMEssage(message);
    //     }
    // },

    getFcmToknVal: function() {
        const userAgent = navigator.userAgent.toLowerCase();
        if ( this.isAndroidApp(userAgent) ) {
            return android.getFcmToknVal();
        } else if ( this.isIosApp() ) {
            return window.webkitURL.messageHandlers.webViewMessageHandler.postMessage();
            // webViewMessageHandler 가 앱개발자와 맞춰야 할것
        } else {
            return '';
            // return window.opener.postMEssage(message);
        }
    },

    getTelNo: function() {
        const userAgent = navigator.userAgent.toLowerCase();
        let telNo = '';
        if ( this.isAndroidApp(userAgent) ) {
            telNo = android.getTelNo();
        } else if ( this.isIosApp() ) {
            telNo = window.webkitURL.messageHandlers.webViewMessageHandler.postMessage();
            // webViewMessageHandler 가 앱개발자와 맞춰야 할것
        } else {
            telNo = '';
            // return window.opener.postMEssage(message);
        }
        // console.log(telNo);
        if ( !!telNo && telNo.length > 10 )
        {
            telNo = telNo.slice(-11, telNo.length);
            // console.log(telNo);
        }
        else
        {
            this.alert("앱에서 실행해 주시기 바랍니다.");
        }

        return telNo;
    },

    sendMessage : function(message) {
        const userAgent = navigator.userAgent.toLowerCase();
        
        if ( this.isAndroidApp(userAgent) ) {
            return android.sendMessage(message);
        } else if ( this.isIosApp() ) {
            return window.webkitURL.messageHandlers.webViewMessageHandler.postMessage(message);
            // webViewMessageHandler 가 앱개발자와 맞춰야 할것
        } else {
            return '';
            // return window.opener.postMEssage(message);
        }
    },

    isApp : function(agent) {
        if ( !!!agent ) {
            agent = navigator.userAgent.toLowerCase()
        }
        if(agent.indexOf('aiband') > -1){
            // console.log('isApp');
            return true;
        }else{
            return false;
        }
    },

    isAndroidApp : function(agent) {
        if ( !!!agent ) {
            agent = navigator.userAgent.toLowerCase()
        }
        if (agent.indexOf('android') > -1) {
            // console.log('isAndroid');
            if ( this.isApp(agent) ) {
                return true;
            } else {
                return false;
            }
        }else{
            return false;
        }
    },

    isIosApp : function(agent) {
        if ( !!!agent ) {
            agent = navigator.userAgent.toLowerCase()
        }
        if ( agent.indexOf("iphone") > -1 || agent.indexOf("ipad") > -1 || agent.indexOf("ipod") > -1 ) {
            // console.log('iphone');
            if ( this.isApp(agent) ) {
                return true;
            } else {
                return false;
            }
        }else{
            return false;
        }
    },

    //로그인여부 체크
    // isLogin : function() {
    //     return ValdUtil.isNotNull(SessionUtil.getUserId());
    // },

    /**
     * AjaxUtil 사용 로그아웃
     **/
    // logout : function() {
    //     let $this = this;
    //     AjaxUtil.post({
    //         url: '/shem/logout.sm',
    //         loadYn : false,
    //         reqType: "json",
    //         success: function(response) {
    //             if ( response.rtnCd === '0000' ) {
    //                 $this.clearSession();
    //             }
    //         },
    //         error: function(errMsg, response) {

    //         },
    //         complete : function() {

    //         }
    //     });
    // },
    alert: function(params) {
        window.vueInstance.alert(params);
    },
    login(params) {
        let $this = this;

        if (ValdUtil.isNull(params.userId)) {
            $this.alert('아이디를 입력해주시기 바랍니다.');
            return false;
        }

        
        if (ValdUtil.isNull(params.userPswd)) {
            $this.alert('비밀번호를 입력해주시기 바랍니다.');
            return false;
        }
        

        AxiosUtil.post('/cmon/sys/login/selectTokn.hb', params).then(function (response) {
            if (response.data.rtnCd == '0000') {
                let data = response.data.rtnData;
                SessionUtil.setUserInfo(data.userInfo);
                SessionUtil.setToken(data.jwtToken);
                SessionUtil.setUserRoleList(data.roleList);
                SessionUtil.setCmonCdList(data.cmonCdList);

                // store.commit(types.ROLE_CD, response.data.rtnData.userInfo.roleCd);
                // store.commit(types.USER_ID, response.data.rtnData.userInfo.userId);
                //store.commit(types.USER_NM, response.data.rtnData.userInfo.empNm);
                router.push({ name: 'Home' });
            } else {
                $this.alert(response.data.rtnMsg);
            }
        }, function (error) {
            if (!!error.response.data.rtnMsg) {
                $this.alert(error.response.data.rtnMsg);
            }

        });
    },

    logout: function () {
        let $this = this;
        AxiosUtil.post('/cmon/sys/login/deleteTokn.hb', {userId: SessionUtil.getUserId()});
        $this.clearSession();
        router.push({ name: 'Login' });
    },

    clearSession: function() {
        store.commit(types.USER_ID, '');
        store.commit(types.USER_NM, '');
        store.commit(types.ROLE_CD, '');
        SessionUtil.clearToken();
        SessionUtil.clearUserInfo();
        SessionUtil.clearUserRoleList();
        SessionUtil.clearMenuAuthList();
        SessionUtil.clearCmonCdList();
    },
    /**
     * 사용환경설정 정보 가져오기
     **/
    async getUseEnvInfo(resultObject, callback) {
        let params = {

        }

        resultObject = {}

        await AxiosUtil.post('/cmon/sys/selectUseEnvInfo.hb', params).then(function(response) {
            if ( response.data.rtnCd === '0000' ) {
                const result = response.data.rtnData;
                _.forEach(result, function(val, key) {
                    resultObject[key] = val;
                });
            }

            if (typeof callback === "function") {
                callback(resultObject);
            }
        });
    },
    /**
     * URL Param 파싱
     */
    getUrlParamsToString: function() {
        var params = "";

        window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) {
            params += key + "=" + value + "&";
        });

        if(params.length > 0){
            params.substr(0, params.length - 2);
        }

        return params;
    },

    /**
     * URL Param 파싱
     */
    getUrlParams: function() {
        var params = {};

    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) {
            params[key] = value;
        });

        return params;
    },

    /**
     * 좌우 공백제거
     * str : 문자열
     */
    trim: function(str) {
        if (typeof str === "string") {
            return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
        }

        return str;
    },

    /**
     * null 값 바꾸기
     * str : 문자열
     * val : null 대체값
     */
    nvl: function(str, val) {
        if (ValdUtil.isNull(str)) {
            return val;
        }

        return this.trim(str);
    },

    /**
     * 전체 치환
     * str     : 문자열
     * pattern : 패턴
     * re      : 치환될 문자
     */
    replaceAll: function(str, pattern, re) {
        var type = typeof str;

        if (type === "string" || type === "number") {
            var temp = this.trim(str) + "";

            if (temp != "") {
                return temp.replace(new RegExp(pattern, "g"), re);
            }
        }

        return str;
    },

    /**
     * 전화번호 - 추가
     * 9자리
     */
    getFormatTelNo: function(tel){
        if ( tel !== null && tel.length === 9) {
            let telNo = tel.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3" )
            return telNo;
        } else {
            return tel;
        }
    },

    /**
     * 천단위 콤마 추가
     * str : 숫자, 문자열
     */
    addThousandComma: function(str) {
        var type = typeof str;

        if (type === "string" || type === "number") {
            var temp = this.trim(str) + "";

            if (temp != "") {
                return temp.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        }

        return str;
    },

    /**
     * 문자를 integer로 변환
     * str : 숫자, 문자열
     */
    toInt: function(str) {
        var type = typeof str;

        if (type === "string" || type === "number") {
            var temp = this.trim(str) + "";

            if (temp != "" && !isNaN(temp)) {
                return parseInt(temp, 10);
            }
        }

        return 0;
    },

    /**
     * 엔터 BR 변환
     * str : 문자열
     */
    enterToBr: function(str) {
        if (typeof str === "string") {
            return str.replace(/(?:\r\n|\r|\n)/g, "<br />");
        }

        return str;
    },
    /**
     * URL Param 파싱
     */
    getObjectToParamString: function(obj) {
        var params = "";

        Object.keys(obj).map(function (key) {

            // 검색키워드
            if(key == 'searchKeyword') {
                params += key + "=" + encodeURIComponent(obj[key]) + "&";
            }else{
                params += key + "=" + obj[key] + "&";
            }
        });

        if(params.length > 0){
            params = params.substr(0, params.length - 1);
        }

        return params;
    },

    /**
     * 천단위 콤마
     * @param {*} num 
     * @returns 
     */
    formatComma(num) {
        let rtnVal = null;
        if (ValdUtil.isNotNull(num)) {
            rtnVal = num.toLocaleString();
            
        } else {
            rtnVal = num;
        }
        return rtnVal;
    },
    
    /**
     * 부호(+,-) 천단위 콤마
     * @param {*} num 
     * @returns 
     */
    formatCommaSign(num) {
        if (ValdUtil.isNotNull(num)) {
            const sign = num >= 0 ? '+' : '-';
            return `${sign}${Math.abs(num).toLocaleString()}`;
        }
        return num;
    },

    /**
     * 문자를 integer로 변환
     * str : 숫자, 문자열
     */
    toInt: function(str) {
        var type = typeof str;

        if (type === "string" || type === "number") {
            var temp = this.trim(str) + "";

            if (temp != "" && !isNaN(temp)) {
                return parseInt(temp, 10);
            }
        }

        return 0;
    },

    /**
     * 숫자 구하기
     * str : 문자열
     */
    toNumber: function(str) {
        if (typeof str === "string") {
            var symbol = "";

            // 음수 기호 구하기
            if (str.indexOf("-") == 0) {
                symbol = "-";
            }

            return symbol + str.replace(/[^0-9]+/g, "");
        }

        return str;
    },

    /**
     * User Agent
     */
    getUA: function(){
        return navigator.userAgent;
    },    

    /**
     * 문자 byte 구하기 (UTF-8)     * 
     */
    getBytesUTF8(str) {
        let byteCount = 0;
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            if (charCode <= 0x7F) {
                byteCount += 1; // 1바이트 문자
            } else if (charCode <= 0x7FF) {
                byteCount += 2; // 2바이트 문자
            } else if (charCode <= 0xFFFF) {
                byteCount += 3; // 3바이트 문자
            } else if (charCode <= 0x10FFFF) {
                byteCount += 4; // 4바이트 문자 (UTF-8에서의 최대 크기)
            }
        }
        return byteCount;
    },

    /**
     * 문자 byte 구하기
     */
    getTextLength: function(str) {
        var len = 0;

        for (var i = 0; i < str.length; i++) {
            if (escape(str.charAt(i)).length == 6) {
                len++;
            }

            len++;
        }

        return len;
    },

    /**
     * 특수문자 제거 함수.
     * @param str
     * @returns {string}
     */
    filterSpecialChar: function(str) {
        const regex = /[-{}\[\]\/?.,;:|)*~`!^_+<>@\#$%&\\=('"]/gi;
    
        if (str.length > 0) {
            return str.replace(regex, ''); // 특수문자만 제거
        }
        return str;
    },

    /**
     * 문자열을 최대 길이에 맟춰 자른다.
     * @param str
     * @param maxBytes
     * @returns {string}
     */
    cutByte: function(str, maxBytes) {
        var c,i;
        for (var b = i = 0; c = str.charCodeAt(i);) {
            b += c >> 7 ? 2 : 1;
            if (b > maxBytes) {
                break;
            }
            i++;
        }
        return str.substring(0,i);
    },

    /**
     * 이미지 방향 구하기
     * 1:0도, 3:180도, 6:270도, 8:90도
     */
    getImgOrient: function(file, callback) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var view = new DataView(e.target.result);

            if (view.getUint16(0, false) != 0xFFD8) {
                return callback(-2);
            }

            var length = view.byteLength, offset = 2;

            while (offset < length) {
                if (view.getUint16(offset + 2, false) <= 8) {
                    return callback(-1);
                }

                var marker = view.getUint16(offset, false);
                offset += 2;

                if (marker == 0xFFE1) {
                    if (view.getUint32(offset += 2, false) != 0x45786966) {
                        return callback(-1);
                    }

                    var little = view.getUint16(offset += 6, false) == 0x4949;
                    offset += view.getUint32(offset + 4, little);
                    var tags = view.getUint16(offset, little);
                    offset += 2;

                    for (var i = 0; i < tags; i++) {
                        if (view.getUint16(offset + (i * 12), little) == 0x0112) {
                            return callback(view.getUint16(offset + (i * 12) + 8, little));
                        }
                    }
                } else if ((marker & 0xFF00) != 0xFF00) {
                    break;
                } else {
                    offset += view.getUint16(offset, false);
                }
            }

            return callback(-1);
        };
        reader.readAsArrayBuffer(file);
    },

    /**
     * 이미지 회전 구하기
     * orient : 회전정보
     */
    getImgRotate: function(orient) {
        var rotate = 0;

        // 180도 회전
        if (orient == 3) {
            rotate = 180;

        // 90도 회전
        } else if (orient == 6) {
            rotate = 90;

        // 270도 회전
        } else if (orient == 8) {
            rotate = 270;
        }

        return rotate;
    },
    
    snakeToCamel: function(str) {
        if ( ValdUtil.isNotNull(str) ) {
            return str.replace(/_([a-z])/g, function(match, letter) {
                return letter.toUpperCase();
            });
        } else {
            return str;
        }
    },
    
    snakeToCamel2(str){
        if ( ValdUtil.isNotNull(str) ) {
            return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        } else {
            return str;
        }
    },
    camelToSnake(str) {
        let val = '';
        if(ValdUtil.isNotNull(str)){
            let i = 1;
            for(let x of str){
                i = i+1;
                let asc = x.charCodeAt();
                if(asc >= 65 && asc <= 90 && i <= str.length){
                    val = val+'_'+x;
                }else{
                    val = val+x
                }
            }
            val = val.toUpperCase();
        }
        return val;
    },

    // 로딩바 활성화 함수
    processLoading: function(loadYn) {
        store.commit(types.SHOW_LOADING, loadYn);
    },

    // 로딩바 활성화 중 중복 요청 방지 함수
    isLoading: function() {
        return store.getters.showLoading;
    },

    getColModelStan(){
        const $this = this;
        let colModelStan = [{'CD':'center'    , 'formatter':$this.nullToBlank}
                            ,{'NO':'center'   , 'formatter':$this.nullToBlank}
                            ,{'NM':'center'   , 'formatter':$this.nullToBlank}
                            ,{'DT':'center'   , 'formatter':$this.formatDate}
                            ,{'TM':'center'   , 'formatter':$this.formatTime}
                            ,{'DATE':'center' , 'formatter':$this.formatDate}
                            ,{'TIME':'center' , 'formatter':$this.formatTime}
                            ,{'DIV':'center'  , 'formatter':$this.nullToBlank}
                            ,{'CODE':'center' , 'formatter':$this.nullToBlank}
                            ,{'DV':'center'   , 'formatter':$this.nullToBlank}
                            ,{'GB':'center'   , 'formatter':$this.nullToBlank}
                            ,{'GUBUN':'center', 'formatter':$this.nullToBlank}
                            ,{'ID':'center'   , 'formatter':$this.nullToBlank}
                            ,{'SEQ':'center'  , 'formatter':$this.nullToBlank}
                            ,{'CNT':'right'   , 'formatter':$this.thousandComma}
                            ,{'PRCE':'right'  , 'formatter':$this.thousandComma}
                            ,{'AMT':'right'   , 'formatter':$this.thousandComma}]
        return colModelStan;
    },
    
    /**
     * getSplitLastStr: split 값 리턴
     * splitStr : split문자
     * val      : split대상
     * index    : split array 인덱스 / 없을 시 배열 전체 리턴 (last : 마지막)
     */
    getSplitStr(val,splitStr,index){
        let str = '';
        if(val != undefined || ValdUtil.isNotNull(val)){
            str = val;
            if(val.indexOf(splitStr) != -1){
                str = val.split(splitStr);
                if(index != undefined || ValdUtil.isNotNull(index)){
                    if(index == 'last'){   
                        str = str[str.length-1];
                    }else{
                        str = str[index];    
                    }
                }
            }
        }        
        return str;
    },

    /**
     * 리스트에서 코드에 대한 명칭을 가져오는 함수
     */
    getCodeNm: function(codeList, code) {
        var cdNm = '';
        if ( !!codeList && codeList.length > 0 ) {
	        var codeInfo = _.filter(codeList, function(item) {
			    return item.cdVal === code;
            });
    	
            if ( !!codeInfo && codeInfo.length > 0 ) {
                cdNm = codeInfo[0].cdNm;
            }
        }
        return cdNm;
    },

    /**
     * 페이지링크 설정 함수
     * 전달 값 menuNo, param
     * Key 값 pageLnk-메뉴번호
     * @param {*} menuNo 
     * @param {*} param 
     */
    setPageLink: function (menuNo, param) {

        var getMenuNo  = menuNo;
        var getParam   = param;
        var key        = 'pageLink-'+getMenuNo;
        var getObj     = [];
        var targetObj  = null;
        var getMenuNm  = null;
        var getMenuUrl = null;
        let isMenuRole = false;
        let getUserId  = SessionUtil.getUserId();

        window.emitter.on('onSetFilterMenu-event', function (data) {
            getObj = data;
        });
        window.emitter.emit('onSetFilterMenu');

        for(const objVal of getObj) {
            if(objVal.menuNo === getMenuNo) {
                targetObj = objVal;
                break;
            } 
        }

        if (targetObj) {
            getMenuNm  = targetObj.menuNm;
            getMenuUrl = targetObj.menuUrl;
        }

        let menu = {
            'menuNo'  : getMenuNo,
            'menuNm'  : getMenuNm,
            'menuUrl' : getMenuUrl
        };

        let sendParam = {
            userId : getUserId,
            menuNo : getMenuNo
        }
        
        //메뉴, 사용자 Role 조회
        AxiosUtil.post('/cmon/sys/sys/selectListMenuInfo.hb',sendParam).then(function(response){
            if( response.data.rtnCd === '0000'){
               
                if(response.data.rtnData.result > 0){
                    if(ValdUtil.isNotNull(getMenuNo)){
            
                        if(ValdUtil.isNotNull(getParam)){
                            SessionUtil.setLocalStorageData(key, getParam, false);
                        }
            
                        window.emitter.emit('onNewTab',menu);
                        isMenuRole = false;
            
                    } else {
                        CmonUtil.alert("페이지 이동 도중 오류가 발생하였습니다.");
                    }
                } else {
                    CmonUtil.alert("페이지 접근 권한이 없습니다.");
                }
                
            }
        });
    },

    /**
     * 페이지링크로 전달 된 값 가져오는 함수
     * key 값 : pageLnk-메뉴번호
     * @param {*} val 
     * @returns 
     */
    getPageLink: function (val) {
        var getKey   = '';
        var getParam = '';
        let params   = '';
        getKey = 'pageLink-' + val;
        
        if(ValdUtil.isNotNull(getKey)){
            getParam = SessionUtil.getLocalStorageData(getKey,false);
            
            if(ValdUtil.isNotNull(getParam)){
                params = _.cloneDeep(getParam);
            } else {
                params = '';
            }
            
            this.removePageLink(getKey);
            
        } else {
            CmonUtil.alert("페이지 이동 도중 오류가 발생하였습니다.");
        }

        return params;
    },

    /**
     * 페이지링크 전부 삭제
     */
    clearPageLink: function(){
        window.localStorage.clear();
    },

    /**
     * key 값에 해당하는 페이지 링크만 삭제
     * @param {*} key 
     */
    removePageLink: function(key){
        window.localStorage.removeItem(key);
    }
    ,setFocus(el){
        let val = el;
        if(el != null && el != '' && el != undefined){
            val = el.focus();
        }
        return val;
    },

    /**
     * PDF저장
     * title    : PDF 제목
     * gridObj  : 그리드
     * inputTxt : 기타 입력정보
     */
    exportToPDF(title, gridObj ,inputTxt) {
        const $this  = this;
        const doc    = new jsPDF();
        const currDt = DateUtil.getCurrDate();
        const font   = margunFonts;
        const fontNm = "margun";
        const pdfNm  = title + '_' + currDt + '.pdf';

        if (ValdUtil.isNull(font)) {
            $this.alert("폰트를 불러오는 도중 오류가 발생하였습니다.");
            return false;
        }
        
        // 한글 폰트 추가
        doc.addFileToVFS("margun.ttf", font);
        doc.addFont("margun.ttf", fontNm, "normal");
        doc.setFont(fontNm, "normal");

        // 그리드 데이터 조회
        if (ValdUtil.isNull(gridObj)) {
            $this.alert("그리드 정보를 불러오는 도중 오류가 발생하였습니다.");
            return false;
        }
        
        // 그리드 데이터 가져오기
        const colModel = gridObj.jqGrid('getGridParam', 'colModel');
        const data     = gridObj.jqGrid('getRowData');

        if (!colModel || !data || colModel.length === 0 || data.length === 0) {
            return false;
        }

        // 제목 설정
        doc.setFontSize(18);
        const pageWidth  = doc.internal.pageSize.getWidth();
        const titleWidth = doc.getTextWidth(title);
        const xOffset    = (pageWidth - titleWidth) / 2;                    // 중앙 정렬
        doc.text(title, xOffset, 22);

        // PDF 다운로드 일자 설정 
        doc.setFontSize(12);
        const dtNmText    = `일자 : ${currDt}`;
        const dtNmWidth   = doc.getTextWidth(dtNmText);
        const dtNmXOffset = pageWidth - doc.getTextWidth(dtNmText) - 15;    // 우측 정렬
        doc.text(dtNmText, dtNmXOffset, 30);


        // 기타 입력정보 설정
        if(ValdUtil.isNotNull(inputTxt)){
            doc.setFontSize(12);
            doc.text(inputTxt, 15, 40);                                     // 좌측 정렬    
        }

        // 테이블 헤더 설정
        const headerData = [colModel.map(col => col.label)];

        // 테이블 데이터 설정
        const bodyData = data.map(row => colModel.map(col => row[col.name]));

        // 열 스타일 설정
        const columnStyles = {};
        colModel.forEach((col, index) => {
            columnStyles[index] = { halign: col.align || 'left' };
        });

        // 테이블 그리기
        doc.autoTable({
            head           : headerData,                      // 테이블의 헤더
            body           : bodyData,                        // 테이블의 데이터
            startY         : 55,                              // 테이블의 Y축 시작 위치
            styles         : { font      : fontNm,            // 테이블의 fontStyle(맑은고딕) 설정
                               fontSize  : 10,                // 테이블의 fontSize 설정
                               lineColor : '#DDDDDD',         // 테이블의 borderColor 설정
                               lineWidth : 0.1                // 테이블의 borderSize 설정  
                             },  
            headStyles     : { fillColor : '#989898',         // 헤더의 backGroundColor 설정
                               textColor : '#FFFFFF',         // 헤더의 textColor 설정 
                               halign    : 'center' ,         // 헤더의 textAlign 설정
                               fontStyle : 'bold'   ,         // 헤더의 text fontStyle(bold) 설정
                               lineColor : '#FFFFFF',         // 헤더의 borderColor 설정
                               lineWidth : 0.1                // 헤더의 borderSize 설정
                             },
            columnStyles   : columnStyles,                    // 테이블 데이터의 (정렬)스타일 지정
            tableLineColor : '#FFFFFF',                       // 전체 테이블의 테두리 색상
            tableLineWidth : 0.1                              // 전체 테이블의 테두리 두께
      });

      doc.save(pdfNm);                                        // PDF 저장
    },


    /** 
    * 시간 포맷
    * 전달 받은 파라미터 값을 정수로 변환 후 계산하여 00 H 00 M 00 S 으로 리턴
    */
    formatTcnt(tcnt) {
        let rtnVal = null;
        if(ValdUtil.isNotNull(tcnt)) {
            const totalSeconds = CmonUtil.toInt(tcnt);
            const hours        = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
            const minutes      = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
            const seconds      = String(totalSeconds % 60).padStart(2, '0');
            if(hours == '00' && minutes == '00') {
                rtnVal = `00h 00m ${seconds}s`;
            } else if(hours == '00') {
                rtnVal = `00h ${minutes}m ${seconds}s`;
            } else {
                rtnVal = `${hours}h ${minutes}m ${seconds}s`;
            }
        } else {
            rtnVal = '00h 00m 00s';
        }
        return rtnVal;
    },

    // 반응성 데이터 객체 유지하며 초기화
    resetObjData(data) {
        if(ValdUtil.isNotNull(data)) {
            for (let key in data) {
                if (typeof data[key] === "string") {
                    data[key] = '';
                } else if (typeof data[key] === "number") {
                    data[key] = 0;               
                } else if (typeof data[key] === "boolean") {
                    data[key] = false;               
                } else if (Array.isArray(data[key])) {
                    data[key] = [];
                } else if (typeof data[key] === "object" && data[key] !== null) {
                    this.resetObjData(data[key]);
                } else {
                    data[key] = null;
                }
            }
        }
    },
    // 인풋 박스 포커스
    focusInput: function(ref) {
        if (ref) {
            ref.select();
        }
    },
}