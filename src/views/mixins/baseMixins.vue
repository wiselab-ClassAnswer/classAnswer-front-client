<script>

// import * as types from '@/store/mutation-types'
import { SessionUtil } from '@/utils/SessionUtil.js'
import { ValdUtil } from '@/utils/ValdUtil.js'
import { CmonUtil } from '@/utils/CmonUtil.js'
import { DateUtil, YEAR_FORMAT } from '@/utils/DateUtil.js'
// import { AjaxUtil } from '@/utils/ajaxUtil.js'
import AxiosUtil from '@/utils/AxiosUtil.js'
import moment from 'moment'
import { faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons'

// mixin 객체 생성
const baseMixins = {
    data () {
        return {
            
        }
    },

    methods: {

        /* 년수 리스트 구하기
        *  curYr : 구하는 년도 수
        */ 
        getCurYrList: function(curYr, arrayObject){

            if (curYr>0 && curYr != '' && arrayObject !=null && Array.isArray(arrayObject)) 
            {
                arrayObject.push({cdVal:'', cdNm:'최근 5년'})
                curYr = curYr*-1;
                for(let i = 0; i>curYr; i--){
                    arrayObject.push({  cdVal:(moment().add(i, "years").format(YEAR_FORMAT))
                                      , cdNm :(moment().add(i, "years").format(YEAR_FORMAT))+'년'})
                }    
            }else return arrayObject;
        },
        /**
         * 권한적용한 디비 가져오기
         **/
        getDbConnList: function(sqlData, arrayObject, allAddYn, callback) {
            let params = sqlData;

            if ( arrayObject.length > 0 ){
                arrayObject.splice(0);
            }

            AxiosUtil.post('/cmon/sys/selectListDbConnAplyRole.hb', params).then(function(response) {
                if ( response.data.rtnCd === '0000' && response.data.rtnData.result.length > 0 ) {
                    const dataList = response.data.rtnData.result;
                    dataList.forEach(item => {
                        arrayObject.push(item);
                    });                     
                            
                    if (allAddYn === 'Y') {
                        arrayObject.unshift({colId:'', colNm:''});
                    }
                }

                if (typeof callback === "function") {
                    callback(arrayObject);
                }
            });
        },
        /* ID,NM 구하기
        *  sqlData = { 'tblId'  :'te_db_conn_info',
                            'colId'  :'db_conn_id',
                            'colNm'  :'db_conn_nm',
                            'andKey' :'db_type_cd',
                            'andCalc':'!=',
                            'andVal' :'MET',
                            'orderby':'db_conn_id'}                            
        *  arrayObject : 코드 리스트 넣을 리스트
        *  callback    : callback함수
        */ 
        getColIdNmList: function(sqlData, arrayObject, allAddYn, callback) {
            let params = sqlData;
            if(arrayObject.length != 0){
                arrayObject.splice(0);
            }
            AxiosUtil.post('/cmon/sys/selectListIdNm.hb', params).then(function(response) {
                if( response.data.rtnCd === '0000' && response.data.rtnData.result.length != 0){
                    let dataList = response.data.rtnData.result;
                    if ( sqlData.colId.indexOf(',') == -1 ) {
                        const colId = sqlData.colId.trim();
                        const colNm = sqlData.colNm.trim();
                        dataList.forEach(el => {
                            arrayObject.push({
                                'colId' : el[CmonUtil.snakeToCamel(colId)], 
                                'colNm' : el[CmonUtil.snakeToCamel(colNm)]
                            });
                        });                     
                        if (allAddYn === 'Y') {
                            arrayObject.unshift({colId:'', colNm:''});
                        }
                    } else {

                        const cols = sqlData.colId.split(',');
                        const colId = cols[0];
                        const colNm = sqlData.colNm;

                        dataList.forEach(el => {
                            let item = {
                                'colId' : el[CmonUtil.snakeToCamel(colId)], 
                                'colNm' : el[CmonUtil.snakeToCamel(colNm)]
                            };

                            if ( cols.length > 1 ) {
                                cols.forEach(function(col, id) {
                                    if ( id > 0 ) {
                                        item[CmonUtil.snakeToCamel(col.trim())] = el[CmonUtil.snakeToCamel(col.trim())];
                                    }
                                });
                            }
                            arrayObject.push(item);
                        });                     
                            
                        if (allAddYn === 'Y') {
                            arrayObject.unshift({colId:'', colNm:''});
                        }
                    }
                }else{
                    return arrayObject;
                }
                if (typeof callback === "function") {
                    callback(arrayObject);
                }
            });
        },

        /* 공통 코드 리스트 구하기
        *  cdGrp        : 코드 그룹
        *  arrayObject  : 코드 리스트 넣을 리스트
        *  allAddYn     : 빈 값인 전체라는 항목 추가 여부
        *  callback     : 콜백 함수
        *  fltrVal      : 조회 조건
        *  isWithName   : 리턴되는 코드 명을 코드와 명을 '|' 로 합침
        *  useYn        : 코드의 사용 여부 조회 조건
        */ 
        getCmonCdList: function(cdGrp, arrayObject, allAddYn, callback, fltrVal, isWithName, useYn) {
            let cmonCdList = SessionUtil.getCmonCdList();
            var dataList = cmonCdList['cmonCdList'].filter(el => el.cdGrp === cdGrp);
            if (Array.isArray(arrayObject)) {
                if(ValdUtil.isNotNull(useYn)){
                    dataList = dataList.filter(el => el.useYn === useYn);
                }
                if(ValdUtil.isNotNull(fltrVal)){
                    var fltrVal1 = fltrVal.fltrVal1;
                    var fltrVal2 = fltrVal.fltrVal2;
                    var fltrVal3 = fltrVal.fltrVal3;
                    if(ValdUtil.isNotNull(fltrVal1)){
                        dataList = dataList.filter(el => el.fltrVal1 === fltrVal1);
                    }
                    if(ValdUtil.isNotNull(fltrVal2)){
                        dataList = dataList.filter(el => el.fltrVal2 === fltrVal2);
                    }

                    if(ValdUtil.isNotNull(fltrVal3)){
                        dataList = dataList.filter(el => el.fltrVal3 === fltrVal3);
                    }
                }

                let m = 0;
                const dataCnt = dataList.length;
                if (isWithName) {
                    for (m = 0; m < dataCnt; m++) {
                        arrayObject.push({
                            cdVal   : dataList[m].cdVal, 
                            cdNm    : dataList[m].cdVal + ' | ' + dataList[m].cdNm,
                            sortOrd : dataList[m].sortOrd
                        });
                    }
                } else {
                    for (m = 0; m < dataCnt; m++) {
                        arrayObject.push({
                            cdVal   : dataList[m].cdVal, 
                            cdNm    : dataList[m].cdNm,
                            sortOrd : dataList[m].sortOrd
                        });
                    }
                }

                if (allAddYn === 'Y') {
                    arrayObject.unshift({cdVal:'', cdNm:''});
                }
            }
            if (typeof callback === "function") {
                callback(dataList);
            }
            return arrayObject;
        },

        // 변경 전 getCmonCdList 
        // getCmonCdList: function(cdGrp, arrayObject, allAddYn, callback, fltrVal, isWithName, useYn) {
        //     let params = {
        //         'cdGrp' : cdGrp
        //     }
        //     if (ValdUtil.isNull(useYn)) {
        //         useYn = 'Y'
        //     }
        //     params.useYn = useYn;

        //     if(ValdUtil.isNotNull(fltrVal)){
        //         params.fltrVal1 = fltrVal.fltrVal1;
        //         params.fltrVal2 = fltrVal.fltrVal2;
        //         params.fltrVal3 = fltrVal.fltrVal3;
        //     }
        //     //      cdList = SessionUtil.getLocalStorageData("CD");
        //     // arrayObject = cdList.filter("");
        //     AxiosUtil.post("/cmon/sys/sys/searchListCmonCd.hb", params).then(function(response) {
        //         if ( response.data.rtnCd === '0000' ) {   
        //             var dataList = response.data.rtnData.result;
        //             if (Array.isArray(arrayObject)) {
        //                 const dataCnt = dataList.length;
        //                 let m = 0;
        //                 if (isWithName) {
        //                     for (m = 0; m < dataCnt; m++) {
        //                         arrayObject.push({
        //                             cdVal   : dataList[m].cdVal, 
        //                             cdNm    : dataList[m].cdVal + ' | ' + dataList[m].cdNm,
        //                             sortOrd : dataList[m].sortOrd
        //                         });
        //                     }
        //                 } else {
        //                     for (m = 0; m < dataCnt; m++) {
        //                         arrayObject.push({
        //                             cdVal   : dataList[m].cdVal, 
        //                             cdNm    : dataList[m].cdNm,
        //                             sortOrd : dataList[m].sortOrd
        //                         });
        //                     }
        //                 }
                        
        //                 if (allAddYn === 'Y') {
        //                     arrayObject.unshift({cdVal:'', cdNm:''});
        //                 }
        //             }
        //             if (typeof callback === "function") {
        //                 callback(dataList);
        //             }
        //         } else {
        //             return arrayObject;
        //         }
        //     });
        // },
        
        /* 공통 코드 리스트 구하기
        *  cdGrp        : 코드 그룹
        *  arrayObject  : 코드 리스트 넣을 리스트
        *  allAddYn     : 빈 값인 전체라는 항목 추가 여부
        *  callback     : 콜백 함수
        *  fltrVal      : 조회 조건
        *  isWithName   : 리턴되는 코드 명을 코드와 명을 '|' 로 합침
        *  useYn        : 코드의 사용 여부 조회 조건
        */ 

        async getCmonCdListSync(cdGrp, arrayObject, allAddYn, callback, fltrVal, isWithName, useYn)
        {
            let cmonCdList = SessionUtil.getCmonCdList();
            var dataList = cmonCdList['cmonCdList'].filter(el => el.cdGrp === cdGrp);
            if (Array.isArray(arrayObject)) {
                if(ValdUtil.isNotNull(useYn)){
                    dataList = dataList.filter(el => el.useYn === useYn);
                }
                if(ValdUtil.isNotNull(fltrVal)){
                    var fltrVal1 = fltrVal.fltrVal1;
                    var fltrVal2 = fltrVal.fltrVal2;
                    var fltrVal3 = fltrVal.fltrVal3;
                    if(ValdUtil.isNotNull(fltrVal1)){
                        dataList = dataList.filter(el => el.fltrVal1 === fltrVal1);
                    }
                    if(ValdUtil.isNotNull(fltrVal2)){
                        dataList = dataList.filter(el => el.fltrVal2 === fltrVal2);
                    }

                    if(ValdUtil.isNotNull(fltrVal3)){
                        dataList = dataList.filter(el => el.fltrVal3 === fltrVal3);
                    }
                }

                let m = 0;
                const dataCnt = dataList.length;
                if (isWithName) {
                    for (m = 0; m < dataCnt; m++) {
                        arrayObject.push({
                            cdVal   : dataList[m].cdVal, 
                            cdNm    : dataList[m].cdVal + ' | ' + dataList[m].cdNm,
                            sortOrd : dataList[m].sortOrd
                        });
                    }
                } else {
                    for (m = 0; m < dataCnt; m++) {
                        arrayObject.push({
                            cdVal   : dataList[m].cdVal, 
                            cdNm    : dataList[m].cdNm,
                            sortOrd : dataList[m].sortOrd
                        });
                    }
                }

                if (allAddYn === 'Y') {
                    arrayObject.unshift({cdVal:'', cdNm:''});
                }
            }
            if (typeof callback === "function") {
                callback(dataList);
            }
            return arrayObject;
        },

        // 변경전 getCmonCdListSync
        // async getCmonCdListSync(cdGrp, arrayObject, allAddYn, callback, fltrVal, isWithName, useYn)
        // {
        //     let params = {
        //         'cdGrp' : cdGrp
        //     }
        //     if (ValdUtil.isNull(useYn)) {
        //         useYn = 'Y'
        //     }
        //     params.useYn = useYn;

        //     if(ValdUtil.isNotNull(fltrVal)){
        //         params.fltrVal1 = fltrVal.fltrVal1;
        //         params.fltrVal2 = fltrVal.fltrVal2;
        //         params.fltrVal3 = fltrVal.fltrVal3;
        //     }
        //     await AxiosUtil.post("/cmon/sys/sys/searchListCmonCd.hb", params).then(function(response) {
        //         if ( response.data.rtnCd === '0000' ) {   
        //             var dataList = response.data.rtnData.result;
        //             if (Array.isArray(arrayObject)) {
        //                 const dataCnt = dataList.length;
        //                 let m = 0;
                        
        //                 if (isWithName) {
        //                     for (m = 0; m < dataCnt; m++) {
        //                         arrayObject.push({
        //                             cdVal   : dataList[m].cdVal, 
        //                             cdNm    : dataList[m].cdVal + ' | ' + dataList[m].cdNm,
        //                             sortOrd : dataList[m].sortOrd
        //                         });
        //                     }
        //                 } else {
        //                     for (m = 0; m < dataCnt; m++) {
        //                         arrayObject.push({
        //                             cdVal   : dataList[m].cdVal, 
        //                             cdNm    : dataList[m].cdNm,
        //                             sortOrd : dataList[m].sortOrd
        //                         });
        //                     }
        //                 }
                        
        //                 if (allAddYn === 'Y') {
        //                     arrayObject.unshift({cdVal:'', cdNm:''});
        //                 }
        //             }
        //             if (typeof callback === "function") {
        //                 callback(dataList);
        //             }
        //         } else {
        //             return arrayObject;
        //         }
        //     });
        // },

        doPost: function(url, data, isLoading) {
            if ( isLoading == undefined ) {
                isLoading = true;
            }

            if ( ValdUtil.isNull(data) ) {
                data = {
                    '__isLoading__': isLoading
                }
            } else {
                if (  ValdUtil.isObject(data) ) {
                    data['__isLoading__'] = isLoading;
                }
            }

            return AxiosUtil.post(url, data);
        },
        doGet: function(url, data) {
            return AxiosUtil.get(url, data);
        },

        async doPostSync (url, data) {
            // url = '127.0.0.1:18081'+url
            return await AxiosUtil.post(url, data);
        },

        async doGetSync (url, data) {
            // url = '127.0.0.1:18081'+url
            return await AxiosUtil.get(url, data);
        },

        doPostForm: function(url, data) {
            return AxiosUtil.postForm(url, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }});
        },
        doDownExcel: function(url, data, fileNm) {
            
            if ( ValdUtil.isNull(fileNm) ) {
                alert("파일명이 없습니다.");
                return;
            } else {
                if ( !fileNm.endsWith("xlsx") ) {
                    const temp = fileNm.split(".");
                    fileNm = temp[0] + "." + "xlsx";
                }
            }

            AxiosUtil.post(url, data, {
                responseType: 'blob'
            }).then(response => {
                let blob;
                window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
                if ( window.BlobBuilder )
                {
                    let bb = new BlobBuilder();
                    bb.append(response.data);
                    blob = bb.getBlob("application/octet-stream");
                    window.navigator.msSaveBlob(blob, fileNm);
                }
                else
                {
                    blob = new Blob([response.data], {type: "application/octet-stream"});
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileNm;
                    link.click();
                }
            });
        },
        alert: function(opt) {

            this.emitter.emit('onDismissAlert');

            let icon ='';
            let title   = '알림';
            let content = '';
            if ( ValdUtil.isNotNull(opt) ) {                
                if ( typeof opt === 'object' ) {
                    if ( ValdUtil.isNotNull(opt.title) ) {
                        title = opt.title;
                    }

                    if ( ValdUtil.isNotNull(opt.content) ) {
                        content = opt.content;
                    }
                } else {
                    content = opt;
                }
            }
            if ( ValdUtil.isNotNull(content) ) {

                let option = {
                    title: title,
                    confirmButtonText: '확인',
                    confirmButtonColor: '#0099d8',
                    cancelButtonColor:  '#5a5b5b',
                    cancelButtonText: '취소',
                    html: content
                }
                return this.$swal(option);
            } else {                
                console.log('내용을 넣어주세요.');
            }
        },
        confirm: function(opt) {

            let $this = this;
            
            let title       = '확인창';
            let content     = '';
            let yesText     = '확인';
            let noText      = '취소';
            let yesVisible  = true;
            let noVisible   = true;
            let yesCallback = null;
            let noCallback  = null;

            if ( ValdUtil.isNotNull(opt) ) {

                if ( typeof opt === 'object' ) {
                    if ( ValdUtil.isNotNull(opt.title) ) {
                        title = opt.title;
                    }

                    if ( ValdUtil.isNotNull(opt.content) ) {
                        content = opt.content;
                    }
                }
                else
                {
                    content = opt;
                }

                if ( opt.btn )
                {
                    if ( ValdUtil.isNotNull(opt.btn.yes) ) {
                        yesText = ValdUtil.nvl(opt.btn.yes, yesText);
                    }
                    if ( ValdUtil.isNotNull(opt.btn.no) ) {
                        noText = ValdUtil.nvl(opt.btn.no, noText);
                    }
                }

                if ( opt.visible )
                {
                    if ( ValdUtil.isNotNull(opt.visible.yes) ) {
                        yesVisible = ValdUtil.nvl(opt.visible.yes, yesVisible);
                    }
                    if ( ValdUtil.isNotNull(opt.visible.no) ) {
                        noVisible = ValdUtil.nvl(opt.visible.no, noVisible);
                    }
                }

                if ( opt.callback )
                {
                    if ( ValdUtil.isNotNull(opt.callback.yes) ) {
                        yesCallback = opt.callback.yes;
                    }

                    if ( ValdUtil.isNotNull(opt.callback.no) ) {
                        noCallback = opt.callback.no;
                    }
                }
            }
            
            /*
            if ( confirm(content) ) {
                if ( !!yesCallback ) {
                    yesCallback();
                }
                return true;
            } else {
                if ( !!noCallback ) {
                    noCallback();
                }
                return false;
            }
            */

            // let res;
            // if ( ValdUtil.isNotNull(content) ) {
            //     $this.$store.commit(types.CONFIRM_TITLE        , title);
            //     $this.$store.commit(types.CONFIRM_CONTENT      , content);
            //     $this.$store.commit(types.CONFIRM_YES_TEXT     , yesText);
            //     $this.$store.commit(types.CONFIRM_NO_TEXT      , noText);
            //     $this.$store.commit(types.CONFIRM_YES_VISIBLE  , yesVisible);
            //     $this.$store.commit(types.CONFIRM_NO_VISIBLE   , noVisible);
            //     $this.$store.commit(types.CONFIRM_YES_CALLBACK , yesCallback);
            //     $this.$store.commit(types.CONFIRM_NO_CALLBACK  , noCallback);
            //     $this.$store.commit(types.CONFIRM_DIALOG       , true);
                
            // } else {
            //     console.log('내용을 넣어주세요.');
            // }
            
            var confirmOpt = {
                title: title,
                html: content,
                icon: '',
                showCancelButton: true,
                confirmButtonColor: '#0099d8',
                cancelButtonColor: '#5a5b5b',
                confirmButtonText: yesText,
                cancelButtonText: noText,
            };
            
            return $this.$swal(confirmOpt).then((result) => {
                                                                if ( result.isConfirmed ) {
                                                                    if ( !!yesCallback ) {
                                                                        yesCallback();
                                                                    }
                                                                    return true;
                                                                } else {
                                                                    if ( !!noCallback ) {
                                                                        noCallback();
                                                                    }
                                                                    return false;
                                                                }
                                                            });
                                                               
        },
        openWindowPopup: function(url) {
            if ( ValdUtil.isNull(url) ) {
                this.alert('경로가 없습니다.');
            } else {
                window.open(url);
            }
        },
        formatDate: function(val) {
            let str = ''
            if(ValdUtil.isNotNull(val)){
                str = DateUtil.getFormatDate(val);
            }
            return str;
        },
        formatTime: function(val) {
            let str = ''
            if(ValdUtil.isNotNull(val)){
                str = DateUtil.getFormatTime(val);
            }
            return str;
        },
        formatDateTime: function(val) {
            let str = ''
            if(ValdUtil.isNotNull(val)){
                str = DateUtil.getFormatDateTime(val);
            }
            return str;
        },
        getSessionOrgId: function() {
            return SessionUtil.getUserInfo().orgId;
        },
        thousandComma: function(val) {
            let str = ''
            if(ValdUtil.isNotNull(val)){
                str = CmonUtil.addThousandComma(val);
            }
            return str;
        },
        nullToBlank(val){
            let str = '';
            if(ValdUtil.isNotNull(val)){
                str = val
            }
            return str;
        },
        isValidPhoneNumber : function(number) {
            var re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            re = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
        return re.test(number);
        },
        changePage(menuNo, isSelect) {
            if (menuNo) {
                const menuList = SessionUtil.getLocalStorageData('MENU_LIST', false);
                const targetMenu = menuList.find(menu => menu.menuNo === menuNo);
                
                this.emitter.emit('onNewTab', { menu: targetMenu, div: isSelect });
            }
        }
    },
    computed: {
        // isOpen() {
        //     if ( this.$store.getters.alertDialog ) {
        //         this.$refs.baseModal.open();
        //     }       
        // },
        
    },
    beforeCreate: function() {
        // console.log(":::::::: mixin beforeCreate ::::::::");
        // 로그인 사용자 정보 쿠키로부터 얻기
    },
    created: function(){
        //console.log(":::::::: mixin created ::::::::");
    },
    beforeMount: function(){
        // console.log(":::::::: mixin beforeMount ::::::::");
        // this.setMainMenu();
        // this.hideChildren();
    },
    mounted: function(){
        //console.log(":::::::: mixin mounted ::::::::");
    },
    beforeUpdate: function(){
        //console.log(":::::::: mixin beforeUpdate ::::::::");
    },
    updated: function(){
        //console.log(":::::::: mixin updated ::::::::");
    },
    beforeDestroy: function(){
        // console.log(":::::::: mixin beforeDestroy ::::::::");
        // this.setMainMenu();
        // this.hideChildren();
    },
    destroyed: function(){
        //console.log(":::::::: mixin destroyed ::::::::");
    },
}

export default baseMixins
</script>