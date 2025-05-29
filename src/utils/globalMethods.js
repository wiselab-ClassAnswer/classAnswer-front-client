const methods = {
    console_log(str) {
        console.log(str);
    }
}

export default {
    install(Vue) {
        Vue.config.globalProperties.$log = methods.console_log;
    }
}

// 등록
// import globalMethods from "./globalMethods"//생성한 파일
// app.use(globalMethods)//생성한 파일

// 사용법
// this.$log('로그인 버튼 클릭')
// this.$log($this.$cookies.keys());