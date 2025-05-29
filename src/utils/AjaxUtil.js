import { ValdUtil } from '@/utils/ValdUtil.js'
import { SessionUtil } from '@/utils/SessionUtil.js'
import * as types from '@/store/mutation-types'
import store from '@/store'
import router from '@/router'

export const AjaxUtil = {

    /**
     * 옵션 셋팅
     */
    setOptions: function(opt) {

        // 데이터 유형
        opt.dataType = ValdUtil.nvl(opt.dataType, "json");

        // 요청타압
        opt.reqType = ValdUtil.nvl(opt.reqType, "json");

        // 로딩바 여부
        opt.loadYn = ValdUtil.nvl(opt.loadYn, true);

        opt.contType = "application/x-www-form-urlencoded; charset=UTF-8";
        opt.async    = ValdUtil.nvl(opt.async, true);

        // 파라미터 json 설정
        if ( opt.reqType == "json" ) {
            opt.param    = JSON.stringify(opt.param);
            opt.contType = "application/json; charset=UTF-8";
        }
    },

    /**
     * GET 방식
     */
    get: function(opt) {

        let $this = this;

        // 옵션 기본값 셋팅
        AjaxUtil.setOptions(opt);

        // 로딩바 열기
        AjaxUtil.processLoading(opt.loadYn);

        $.ajax({
            url: opt.url,
            method: "GET",
            data: opt.param,
            dataType: opt.dataType,
            cache: false,
            traditional: true,
            beforeSend : function(jqXHR, settings){
                AjaxUtil.setBeforeSend(jqXHR, settings);
            },
            success: function(response) {
                AjaxUtil.ajaxSuccess(opt, response);
            },
            error: function(response) {
                AjaxUtil.ajaxError(opt, response);
            },
            complete: function(response) {
                AjaxUtil.ajaxComplete(opt, response);
            }
        });
    },

    /**
     * POST 방식
     */
     post: function(opt) {

        let $this = this;

        // 옵션 기본값 셋팅
        AjaxUtil.setOptions(opt);

        // 로딩바 열기
        AjaxUtil.processLoading(opt.loadYn);

        $.ajax({
            url: opt.url,
            method: "POST",
            data: opt.param,
            async: opt.async,
            dataType: opt.dataType,
            contentType: opt.contType,
            cache: false,
            beforeSend : function(jqXHR, settings){
                AjaxUtil.setBeforeSend(jqXHR, settings);
            },
            success: function(response) {
                AjaxUtil.ajaxSuccess(opt, response);
            },
            error: function(response) {
                AjaxUtil.ajaxError(opt, response);
            },
            complete: function(response) {
                AjaxUtil.ajaxComplete(opt, response);
            }
        });
    },

    /**
     * FormData 방식
     */
    form: function(opt) {

        // FormData 체크
        if ((opt.param instanceof FormData) === false) {
            alert("FormData 파라미터를 설정해주세요.");
            return false;
        }

        // 옵션 기본값 셋팅
        AjaxUtil.setOptions(opt);

        // 로딩바 열기
        AjaxUtil.processLoading(opt.loadYn);

        $.ajax({
            url: opt.url,
            method: "POST",
            data: opt.param,
            dataType: opt.dataType,
            cache: false,
            processData: false,
            contentType: false,
            beforeSend : function(jqXHR, settings){
                AjaxUtil.setBeforeSend(jqXHR, settings);
            },
            success: function(response) {
                AjaxUtil.ajaxSuccess(opt, response);
            },
            error: function(response) {
                AjaxUtil.ajaxError(opt, response);
            },
            complete: function(response) {
                AjaxUtil.ajaxComplete(opt, response);
            }
        });
    },

    setBeforeSend: function(jqXHR, settings) {
        jqXHR.setRequestHeader("cache-control", "no-cache");
        jqXHR.setRequestHeader("pragma","no-cache");

        // 로그인/홈 화면이 아니면 그냥 넘어가고
        if ( settings.url.indexOf("/signIn.ab") == -1 && 
             settings.url.indexOf("/signUp.ab") == -1 && 
             settings.url.indexOf("/accnt/searchPrntTelCert.ab") == -1 && 
             settings.url.indexOf("/accnt/searchTermList.ab") == -1 )
        {
            let tokn = SessionUtil.getToken();
            // console.log('token : ' + tokn);
            if ( ValdUtil.isNotNull(tokn) ) {
                jqXHR.setRequestHeader("Authorization", "Bearer " + tokn);
            } else {
                router.push({name: 'login'});
            }
        }
    },

    /**
     * 로딩바
     */
    processLoading: function(loadYn) {
        store.commit(types.SHOW_LOADING, loadYn);
    },

    /**
     * ajax 성공
     */
    ajaxSuccess: function(opt, response) {
        if (typeof opt.success === "function") {
            if (opt.dataType == "json") {
                if (response.rtnCd === "0000") {
                    opt.success(response);
                } else {
                    var errMsg = response.rtnMsg;

                    if (ValdUtil.isNull(errMsg)) {
                        errMsg = '처리 중 오류가 발생하였습니다.';
                    }

                    if (typeof opt.error === "function") {
                        opt.error(errMsg);
                    } else {
                        this.alert(errMsg);
                    }
                }
            } else {
                opt.success(response);
            }
        }
    },

    /**
     * ajax 에러
     */
    ajaxError: function(opt, response) {
        
		if ( response.status === 403 )
		{
            SessionUtil.clearToken();
			SessionUtil.clearUserInfo();
            SessionUtil.clearChildren();

            if ( false ) {
			// if (isApp()) {
	            window.location.href = "/";
	        }
			else {
                router.push({name: 'login'});
                setTimeout(function() {
                    this.alert('다시 로그인을 해주시기 바랍니다.');
                }, 500);
			}
		}
		else
		{
            // console.log(response.responseText);
			var res = response.responseJSON;
	        var errMsg = "서버에 일시적인 문제가 생겼습니다.\n"
	                   + "이용에 불편을 끼쳐드려 대단히 죄송합니다.\n"
	                   + "잠시후에 다시 이용해주세요.";
	
	        if (ValdUtil.isObject(res) && ValdUtil.isObject(res.rtnData) && ValdUtil.isNotNull(res.rtnData.errorMsg)) {
	            errMsg = res.rtnData.errorMsg;
	        }
	
	        errMsg = CmonUtil.replaceAll(errMsg, "\\\\n", "\n");
	
	        if (typeof opt.error === "function") {
	            opt.error(errMsg);
	        } else {
	            alert(errMsg);
	        }
		}
    },

    /**
     * ajax 완료
     */
    ajaxComplete: function(opt) {

        // 로딩바 닫기
        AjaxUtil.processLoading(false);

        if (typeof opt.complete === "function") {
            opt.complete();
        }
    },
}
