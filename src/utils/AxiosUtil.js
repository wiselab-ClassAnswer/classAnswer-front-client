import axios from 'axios'
import { SessionUtil } from '@/utils/SessionUtil.js'
import router from '@/router'
import { CmonUtil } from '@/utils/CmonUtil.js';

const instance = axios.create({
    // baseURL: "http://localhost:8080/api",
    // baseURL: "http://127.0.0.1:18081",
    method : 'post',
    responseType: 'json'
});

instance.interceptors.request.use(
    function (config) {
        if ( !!!config.headers["Content-Type"] ) {
            config.headers["Content-Type"] = "application/json; charset=utf-8";
        }
        // 로그인시 토큰 조회, 비밀번호 찾기에서 사용자ID 체크
        if ( config.url !== "/cmon/sys/login/selectTokn.hb" && config.url !== "/cmon/sys/auth/selectChckUserId.hb" && config.url !== "/cmon/sys/login/deleteTokn.hb" && config.url !== "/cmon/sys/auth/updateUserPswd.hb" &&
            config.url !== "/cmon/sys/sideBarMenuMng/selectListSideBarMenuMng.hb" && config.url !== "/cmon/sys/sideBarMenuMng/selectListUserFavo.hb" && config.url !== "/cmon/sys/auth/findUserId.hb" &&
            config.url !== "/cmon/sys/auth/sendEmail.hb" &&  config.url !== "/oper/cont/term/select.hb")
        {   
            if ( !SessionUtil.getToken() ) {
                // 토큰 없을 시 Login 화면으로 이동
                CmonUtil.clearSession();
                router.push({ name: 'Login' });
            } else {
                config.headers["Authorization"] = 'Bearer ' + SessionUtil.getToken();
            }            
        }

        if ( !!config.data && !config.data.__isLoading__ ) {
            // 안띄우기
        } else {
            CmonUtil.processLoading(true);
        }
        
        // delete config.data.__isLoadind__;

        return config;
    },
    function (error) {
        CmonUtil.processLoading(false);
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    function (response) {
        CmonUtil.processLoading(false);
        return response;
    },
    function (error) {
        CmonUtil.processLoading(false);
        const originalConfig = error.config;
        // Access Token was expired 재발급
        if ( error.response.status === 401 )
        {
            originalConfig._retry = true;
            try {
                // const rs = await axiosInstance.post("/auth/refreshtoken", {
                //     refreshToken: TokenService.getLocalRefreshToken(),
                // });
                // const { accessToken } = rs.data;
                // store.dispatch('auth/refreshToken', accessToken);
                // TokenService.updateLocalAccessToken(accessToken);

                // return axiosInstance(originalConfig);
            } catch (_error) {
                return Promise.reject(_error);
            }
        }
        else if ( error.response.status === 403 )
        {
            // 토큰 없을 시 Login 화면으로 이동
            CmonUtil.clearSession();
            console.log("토근 없으니 로그인 화면으로 ")
            router.push({name: 'Login'});
            // CmonUtil.alert('세션이 종료되었습니다.<br>다시 로그인 해주세요.');
        }
        else
        {
            if ( originalConfig.url !== "/cmon/sys/login/deleteTokn.hb" ) {
                CmonUtil.alert('서버와 통신중 오류가 발생되었습니다.<br>다시 시도해 주시기 바랍니다.');
            }
        }
        

        return Promise.reject(error);
    }
)

export default instance;