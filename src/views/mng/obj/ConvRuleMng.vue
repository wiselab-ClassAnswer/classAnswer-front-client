<template>
    <div>
        <!-- 검색조건 -->
        <div class="section section1">    
            <div class="search-box">
                <div class="input-box">
                    <div class="w-5 ib">
                        <h1>검색조건</h1>
                    </div>
                    <div class="w-15 ib">
                        <h2 class="wd-40 ib">검색어</h2>
                        <input class="c-wd-40 ib" type="text" ref="srchWord" v-model="srchParam.srchWord" @keyup.enter="searchListConvVer()">
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="true" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
                </div>
            </div>
        </div>
        <!-- 전환규칙 목록 -->
        <div class="section sectionL w-25">
            <div class="section-wrap w-100 p-t-22">
                <h2 class="m-b-11">전환규칙 목록</h2>
                <Grid ref="ConvVerGrid" :dataParams="srchParam" :paging='false'></Grid>
            </div>
        </div>
        <!-- 전환규칙 상세 -->
        <div class="section sectionR w-75 p-l-10 m-r-0">
            <div class="section-wrap w-100  m-r-0 p-t-22">
                <h2 class="ib">전환규칙상세</h2>
                <div class="t-a-r btn-group-box ib">
                    <button class="btn-normal ib" @click="setPgLink('O1060')">
                        <font-awesome-icon class="ib m-r-5" :icon="['fas', 'up-right-from-square']" />
                        <p class="ib">전환대상관리</p>
                    </button>  
                </div>
                <div class="section-part part1 m-t-5">
                    <div class="w-100">
                        <div class="w-50 ib">
                            <span class="wd-55 ib essn">전환버전</span>
                            <input class="c-wd-55 ib" type="text" v-model="convRule.convVer" @blur="changeConvVer()">
                        </div>
                        <div class="w-50 ib">
                            <span class="essn wd-90 ib p-l-10">메인인코딩 값</span>
                            <div class="c-wd-90 ib">
                                <div class="c-wd-80 ib p-r-5" >
                                    <input class="w-100" v-model="convRule.mainEncVal" disabled>
                                </div>
                                <button class="wd-90 btn-normal f-r" @click="getMainEncVal()">
                                    <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                                    <p class="ib">KeyGen</p>
                                </button>  
                            </div>
                        </div>
                    </div>
                    <div class="section-part part1 w-100">
                        <div class="text-box w-100">
                            <span class="essn wd-55 ib">설명</span>
                            <textarea spellcheck="false" class="c-wd-55" style="height:149px; max-height:149px" cols="30" rows="5" v-model="convRule.convVerDesc"></textarea>
                        </div>
                    </div>
                </div>
                <!-- 탭영역 -->
                <div class="w-100 m-t-10">
                    <div id="tabs" class="w-100">
                        <ul class="tab-menu">
                            <li class="p-r-17 p-l-17" v-for="el in tabMenu" :key="el" :val="el" @click="tabClick(el.cdVal)" :style="convRule.tabDiv === el.cdVal? 'background-color:#fff;' : ''">
                                <a :style="convRule.tabDiv === el.cdVal? 'color:#444; ' : 'color:#999'">{{ el.cdNm }}</a>
                            </li>
                        </ul>
                        <div class="tab-contents" style="height: 420px !important;">
                            <div v-for="el in tabMenu" :key="el" :val="el" v-show="convRule.tabDiv===el.cdVal">
                                <div v-if="el.cdVal!=='etc' && el.cdVal!=='sql'" class="section-part part1">
                                    <div class="w-50 m-t-20">
                                        <EcdcRuleSet ref="rrnoEcdcRuleSet" @getEcdcRule="setEcdcRule" :dataParams="convRule[el.cdVal]"/>
                                    </div>
                                    <div class="w-48 f-r m-t-20">
                                        <ConvTest ref="ConvTest" 
                                        @rrnoSameYn="setEcdcRule" 
                                        :dataParams="convRule[el.cdVal]" 
                                        :tabDiv="el.cdVal" 
                                        :mainEncVal="convRule.mainEncVal"
                                        />
                                    </div>
                                </div>
                                <div v-if="el.cdVal == 'etc'" class="section-part part1" >
                                    <div class="w-100 ib">
                                        <span class="w-100 ib">※ 본 영역은 고객의 요청시 별도로 추가 개발되는 커스토마이징 개발영역입니다.</span>
                                    </div>
                                </div>
                                <div v-if="el.cdVal == 'sql'" class="section-part part1" >
                                    <div class="w-100">
                                        <span class="w-100">※ 원본DB에서 고객번호, 주민등록번호, 성명을 가져오는 SQL문을 작성합니다. (Alias는 CUST_NO, RRNO, NAME_FULL로 지정해야 합니다)</span>
                                        <div class="w-100">
                                            <div class="w-100 ib m-t-20">
                                                <textarea spellcheck="false" class="w-100" style="max-height:350px; height:350px;" cols="30" rows="5" v-model="convRule.orgnRrnoSql"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>        
    </div>
</template>
<script>
import { CmonUtil }         from '@/utils/CmonUtil'
import Grid                 from '@/components/grid/Grid.vue'
import SetButton            from '@/components/SetButton.vue'
import EcdcRuleSet          from '@/views/mng/obj/EcdcRuleSet.vue'
import ConvTest             from '@/views/mng/obj/ConvTest.vue'
import { ValdUtil } from '@/utils/ValdUtil'

export default {
    components: {
        SetButton
        ,Grid
        ,EcdcRuleSet
        ,ConvTest
    },
    data() {
      return {
            //검색조건
            srchParam:{
                srchWord:''    //전환버전                
            }
            ,saveDiv:'' //업데이트여부
            ,rowData:{}
            ,convRule:{
                tabDiv       : 'rrno'
                ,convVer      : ''    //전환_버전
                ,convVerDesc  : ''    //전환_버전_설명
                ,mainEncVal   : ''    //메인_인코딩_값
                ,totEcdcSameYn: ''    //전체_암복호화_동일_여부
                ,dbConnId     : ''    //디비_연결ID
                ,orgnRrnoSql  : ''    //원본_주민번호SQL
                ,rrno         : {}    //주민등록번호_탭_값
                ,frno         : {}    //외국인등록번호_탭_값
                ,ci           : {}    //CI_탭_값
                ,ppno         : {}    //여권번호_탭_값
                ,dlic         : {}    //운전면허_탭_값
                ,nm           : {}    //성명_탭_값
                ,bith         : {}    //생년월일_탭_값
                ,tel          : {}    //전화_탭_값
                ,addr         : {}    //주소_탭_값                
                ,mail         : {}    //메일_탭_값                
                ,ccrd         : {}    //신용카드_탭_값                
                ,acnt         : {}    //계좌_탭_값
            }
            ,tabMenu:[
                 {'cdVal':'rrno','cdNm':'주민등록번호'}
                ,{'cdVal':'frno','cdNm':'외국인등록번호'}
                ,{'cdVal':'ci'  ,'cdNm':'CI'}
                ,{'cdVal':'ppno','cdNm':'여권번호'}
                ,{'cdVal':'dlic','cdNm':'운전면허번호'}
                ,{'cdVal':'nm'  ,'cdNm':'성명'}
                ,{'cdVal':'bith','cdNm':'생년월일'}
                ,{'cdVal':'tel' ,'cdNm':'전화번호'}
                ,{'cdVal':'addr','cdNm':'주소'}
                ,{'cdVal':'mail','cdNm':'이메일주소'}
                ,{'cdVal':'ccrd','cdNm':'신용카드'}
                ,{'cdVal':'acnt','cdNm':'계좌번호'}
                ,{'cdVal':'etc' ,'cdNm':'기타'}
                ,{'cdVal':'sql' ,'cdNm':'고객연계SQL'}
            ]
            ,convTestVal:''  //전환테스트 기본 값
            ,convTestVal2:'' //전환테스트 기본 값
            ,selectGridRowId:''   //setSelectiong 용도
            ,saveConvVer:''     // 저장 데이터 select
        }
    },
    methods: {
        init() {
            CmonUtil.setFocus(this.$refs.srchWord);
            this.resetData(this.srchParam);
            this.initTabData()
            this.clearListConvVerGrid();
            let data = CmonUtil.getPageLink('O1010');
            if(!this.ValdUtil.isEmptyJson(data)){
                this.initData(data);
            }

            this.initGrid();
            this.saveDiv = 'insert';
            this.rowData = {};
            this.convRule.totEcdcSameYn = 'N';

            this.tabMenu.forEach((el,i)=>{
                if(i < 11){
                    this.$refs.rrnoEcdcRuleSet[i].init();
                    this.$refs.ConvTest[i].init();
                }
            });
            this.tabClick('rrno')
            this.selectGridRowId = '';
        }
        ,initData(data){
            this.srchParam.srchWord = data.convVer;
        }
        //탭 이벤트
        ,setEcdcRule(data,div){
            let $this = this;

            //주민번호와 외국인 번호를 동일하게 적용
            if(div == 'frnoChange'){
                let rrnoSameYn = $this.convRule.frno.rrnoSameYn;
                for(let key in $this.convRule.rrno){
                    $this.convRule.frno[key] = $this.convRule.rrno[key];
                    $this.convRule.frno['rrnoSameYn'] = rrnoSameYn
                }
            }else if((this.convRule.tabDiv == 'frno' || this.convRule.tabDiv == 'rrno') && $this.convRule.frno['rrnoSameYn'] == 'Y'){
                let trgtTab = this.convRule.tabDiv == 'frno' ? 'rrno' : 'frno';

                for(let key in $this.convRule[this.convRule.tabDiv]){
                    $this.convRule[trgtTab][key] = $this.convRule[this.convRule.tabDiv][key];
                }
            }

            //dbConnId변경 시 해당 값이 있는 탭의 값 변경
            if(div == 'dbConnId'){
                $this.tabMenu.forEach(el=>{
                    if(el.cdVal != 'etc' && el.cdVal != 'sql'){
                        if($this.convRule[el.cdVal]['ecdcMethCd'] == 'SQL'){
                            $this.convRule[el.cdVal]['dbConnId']  = data.dbConnId;
                            
                        }
                    }
                });
                $this.convRule.dbConnId  = data.dbConnId;
            }

            //암복호화 방식 전체 동일
            if(data.totEcdcSameYn == 'Y'){
                $this.tabMenu.forEach(el=>{
                    if(el.cdVal != 'etc' && el.cdVal != 'sql'){
                        $this.convRule[el.cdVal]['totEcdcSameYn'] = data.totEcdcSameYn;
                        $this.convRule[el.cdVal]['ecdcYn']        = data.ecdcYn;
                        $this.convRule[el.cdVal]['ecdcMethCd']    = data.ecdcMethCd;
                        $this.convRule[el.cdVal]['dbConnId']      = data.dbConnId;
                        $this.convRule[el.cdVal]['encForm']       = data.encForm;
                        $this.convRule[el.cdVal]['decForm']       = data.decForm;
                    }
                });
            }else{
                $this.tabMenu.forEach(el=>{
                    if(el.cdVal != 'etc' && el.cdVal != 'sql'){
                        $this.convRule[el.cdVal]['totEcdcSameYn'] = data.totEcdcSameYn;
                    }
                })
            }
        }
        //그리드 생성
        ,initGrid(){
            const $this = this;
            let gridData = {
                url : '/mng/obj/convRuleMng/selectListConvRule.hb',
                colModels : [
                    {name:'convVer'      ,label:'전환버전'      ,width:10  ,align:'left' ,sortable:true}
                   ,{name:'convVerDesc'  ,label:'전환버전설명'  ,width:20  ,align:'left' ,sortable:true}
                ]
               ,options: {
                     onSelectRow(rowid, val, e){
                        $this.saveDiv = 'update';
                        $this.convRule.convVer = $(this).jqGrid('getRowData',rowid).convVer;
                        $this.searchInfoConvVer();

                        $this.tabMenu.forEach((el,i)=>{
                            if(i < 11){
                                $this.$refs.rrnoEcdcRuleSet[i].init();
                                $this.$refs.ConvTest[i].init();
                            }
                        });
                        $this.selectGridRowId = rowid;
                        $this.tabClick($this.convRule.tabDiv);
                    }
                    ,loadonce:true
                    ,rownumbers:true
                    ,gridComplete(){
                        if($this.ValdUtil.isNotNull($this.selectGridRowId)){
                            $(this).jqGrid('setSelection',$this.selectGridRowId);
                        } else {
                            if($this.ValdUtil.isNotNull($this.saveConvVer)){
                                let arrRowId = $(this).jqGrid("getDataIDs");
                                for (let i = 0; i < arrRowId.length; i++){
                                    let gridConvVer = $(this).jqGrid('getRowData', arrRowId[i]).convVer;
                                    if(gridConvVer == $this.saveConvVer){
                                        $(this).jqGrid('setSelection', arrRowId[i]);
                                        $this.saveConvVer = '';

                                    }
                                }
                            }
                        }
                    }
                }                
            }
            $this.$refs.ConvVerGrid.init(gridData);
            //조회 전환규칙목록
            $this.searchListConvVer();
        }
        //전환규칙목록 조회
        ,searchListConvVer(div) {
            if(div!='save'){
                this.selectGridRowId = '';
                this.saveConvVer = '';
            }
            this.saveDiv = 'insert';
            this.resetData(this.convRule);
            this.initTabData();
            this.tabClick('rrno')
            this.$refs.ConvVerGrid.selectList();
        }
        //전환규칙상세 조회
        ,searchInfoConvVer(){
            const $this = this;
            this.initTabData();
            let params = {convVer :  $this.convRule.convVer}
            $this.doPost('/mng/obj/convRuleMng/selectInfoConvRule.hb',params).then(function(res){
                if(res.data.rtnCd == '0000'){
                    let data = res.data.rtnData.result;
                    $this.convRule.convVer       = data.convVer;      
                    $this.convRule.convVerDesc   = data.convVerDesc;
                    $this.convRule.mainEncVal    = data.mainEncVal;   
                    $this.convRule.totEcdcSameYn = data.totEcdcSameYn;
                    $this.convRule.dbConnId      = data.dbConnId;
                    $this.convRule.orgnRrnoSql   = data.orgnRrnoSql;  
                    $this.tabMenu.forEach(el => {
                        for(let key in data){    
                            if ( key.indexOf(el.cdVal) > -1 ) {
                                let tempKey = key.replace(el.cdVal, "");
                                let postKey = tempKey.substring(0, 1).toLowerCase() + tempKey.substring(1);
                                $this.convRule[el.cdVal][postKey] = data[key];
                                $this.convRule[el.cdVal]['totEcdcSameYn'] = data.totEcdcSameYn;
                                $this.convRule[el.cdVal]['dbConnId'] = data.dbConnId;
                            }
                            if(key =='mphnConvCd'){
                                $this.convRule['tel']['mphnConvCd'] = data.mphnConvCd;
                            }

                            if(key =='psnoEcdcYn'){
                                $this.convRule['addr']['psnoEcdcYn'] = data.psnoEcdcYn;
                            }
                            
                            if(key =='addrEcdcYn'){
                                $this.convRule['addr']['ecdcYn'] = data.addrEcdcYn;
                            }

                            if(key =='bithRrnoLinkYn'){
                                $this.convRule['bith']['rrnoLinkYn'] = data.bithRrnoLinkYn;
                            }
                        }
                    });
                    
                    let getData = $this.getData()
                    $this.rowData = _.cloneDeep(getData);
                }else{
                    $this.alert(res.data.rtnMsg);
                }
            });
        }
        //전환규칙 저장
        ,saveConvRuleMng(){
            this.saveValid(this.save);
        }
        ,async save() {
            const $this = this;
            let content = '저장하시겠습니까?';
            let params = {
                convVer : $this.convRule.convVer
            }
            let stmt = '';
            if($this.saveDiv == 'update'){
                await $this.doPost('/mng/obj/convRuleMng/selectConvRuleUseYn.hb', params).then(function(res){
                    if(res.data.rtnCd == '0000'){
                        res.data.rtnData.totCnt > 0 ? stmt = '물리적 컬럼에 대한 암복호화 설정이 변경됩니다<br/>' : '';
                    }else{
                        stmt = res.data.rtnMsg;
                    }
                });
            }
            if(stmt != ''){
                $this.alert(stmt);
                return false;
            }
            $this.confirm({
                content: stmt+content
                ,callback:{
                    yes(){
                        let saveParams = {}
                        let citmList = [];
                        let updateData = {};
                        saveParams['saveData'] = $this.getData();
                        saveParams['saveDiv'] = $this.saveDiv;

                        for(let saveKey in saveParams.saveData){
                            for(let orgnKey in $this.rowData){
                                if(saveKey == orgnKey && saveParams.saveData[saveKey] != $this.rowData[orgnKey]){
                                    if(saveKey.indexOf('DbConnId') > -1){
                                        updateData['dbConnId'] = saveParams.saveData[saveKey];
                                    }
                                    if(saveKey != 'orgnRrnoSql' 
                                        && saveKey.indexOf('ConvCd') == -1 
                                        && saveKey.indexOf('Age') == -1
                                        && saveKey.indexOf('LinkYn') == -1
                                        && saveKey.indexOf('MntnYn') == -1
                                        && saveKey.indexOf('SameYn') == -1){
                                        if(saveKey.indexOf('rrno') > -1 ){
                                            citmList.push({citmDivCd : 'rrno'});

                                        }else if(saveKey.indexOf('frno') > -1 ){
                                            citmList.push({citmDivCd : 'frno'});

                                        }else if(saveKey.indexOf('ppno') > -1 ){
                                            citmList.push({citmDivCd : 'ppno'});

                                        }else if(saveKey.indexOf('ci') > -1 ){
                                            citmList.push({citmDivCd : 'ci'});
                                        }
                                        else if(saveKey.indexOf('dlic') > -1 ){
                                            citmList.push({citmDivCd : 'dlic'});

                                        }else if(saveKey.indexOf('nm') > -1 ){
                                            citmList.push({citmDivCd : 'nm'});

                                        }else if(saveKey.indexOf('bith') > -1 ){
                                            citmList.push({citmDivCd : 'bith'});

                                        }else if(saveKey.indexOf('tel') > -1 ){
                                            citmList.push({citmDivCd : 'tel'});
                                            
                                        }else if(saveKey.indexOf('addr') > -1 ){
                                            citmList.push({citmDivCd : 'addr'});

                                        }else if(saveKey.indexOf('mail') > -1 ){
                                            citmList.push({citmDivCd : 'mail'});

                                        }else if(saveKey.indexOf('ccrd') > -1 ){
                                            citmList.push({citmDivCd : 'ccrd'});

                                        }else if(saveKey.indexOf('acnt') > -1 ){
                                            citmList.push({citmDivCd : 'acnt'});
                                        }
                                        else if(saveKey.indexOf('psno') > -1 ){
                                            citmList.push({citmDivCd : 'psno'});
                                        }
                                    }
                                }
                            }
                        }
                        citmList = citmList.filter(function(item1, idx1){
                            return citmList.findIndex(function(item2, idx){
                                return item1.citmDivCd == item2.citmDivCd
                            }) == idx1;
                        });

                        if(citmList.length > 0){
                            updateData['convVer'] = $this.rowData.convVer;
                            updateData['orgnDbConnId'] =  $this.rowData.dbConnId;
                            saveParams['citmList'] = citmList;
                            saveParams['updateData'] = updateData;
                        }
                        $this.doPost('/mng/obj/convRuleMng/saveConvRuleMng.hb', saveParams).then(function(res){
                            if(res.data.rtnCd == '0000'){
                                $this.alert('저장되었습니다').then((result)=>{
                                    if(result.isConfirmed){
                                        $this.saveConvVer = $this.convRule.convVer;
                                        $this.searchListConvVer('save');
                                    }
                                })
                            }else{
                                $this.alert(res.data.rtnMsg).then((result)=>{
                                    if(result.isConfirmed){
                                        // $this.searchListConvVer('save');
                                    }
                                });
                            }
                        });
                    }
                }
            });
        }
        //삭제
        ,async deleteConvRuleMng(){
            const $this = this;
            if($this.ValdUtil.srchValdNull($this.convRule.convVer,'삭제할 전환규칙','slct')){
                
                let stmt = '';
                let params = {
                    convVer : $this.convRule.convVer
                }
                await $this.doPost('/mng/obj/convRuleMng/selectConvRuleUseYn.hb', params).then(function(res){
                    if(res.data.rtnCd == '0000'){
                        res.data.rtnData.totCnt > 0 ? stmt = '사용중인 전환규칙은 삭제할 수 없습니다' : '';
                    }else{
                        stmt = res.data.rtnMsg;
                    }
                });
                    
                if(stmt != ''){
                    $this.alert(stmt);
                    return false;
                }

                $this.confirm({
                    content: '삭제하시겠습니까?'
                    ,callback:{
                        yes(){
                            params['dbConnId'] = $this.rowData.dbConnId;
                            $this.doPost('/mng/obj/convRuleMng/deleteConvRuleMng.hb', params).then(function(res){
                                if(res.data.rtnCd == '0000'){
                                    $this.alert('삭제되었습니다').then((result)=>{
                                        if(result.isConfirmed){
                                            $this.searchListConvVer();
                                        }
                                    })
                                }else{
                                    $this.alert(res.data.rtnMsg).then((result)=>{
                                        if(result.isConfirmed){
                                            $this.searchListConvVer();
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            }
        }
        ,getData(){
            const $this = this;
            let params = {
                convVer : $this.convRule.convVer
                ,convVerDesc  : $this.convRule.convVerDesc
                ,mainEncVal   : $this.convRule.mainEncVal
                ,orgnRrnoSql  : $this.convRule.orgnRrnoSql
                ,totEcdcSameYn: $this.convRule.rrno.totEcdcSameYn
                ,dbConnId     : $this.convRule.dbConnId
                ,saveDiv      : $this.saveDiv
            }
            $this.tabMenu.forEach(el => {
                for(let key in $this.convRule) {
                    if ( key === el.cdVal ) {
                        let tabData = $this.convRule[key];
                        for ( let tabDataKey in tabData ) {
                            let postKey = key + tabDataKey.substring(0, 1).toUpperCase() + tabDataKey.substring(1);
                            params[postKey] = tabData[tabDataKey];
                            if(el.cdVal == 'tel'){
                                let mphnKey = 'mphn' + tabDataKey.substring(0, 1).toUpperCase() + tabDataKey.substring(1);
                                params[mphnKey] = tabData[tabDataKey];
                            }
                            if(el.cdVal == 'addr'){
                                params['psnoEcdcYn'] = $this.convRule.addr.psnoEcdcYn;
                                if($this.convRule.addr.psnoEcdcYn =='Y'){
                                    let psnoKey = 'psno' + tabDataKey.substring(0, 1).toUpperCase() + tabDataKey.substring(1);
                                    params[psnoKey] = tabData[tabDataKey];
                                }
                            }
                        }
                    }
                }
            });            
            let gridObj = $this.$refs.ConvVerGrid.getGridObj();
            let data = gridObj.jqGrid('getRowData');
            let cnt = 0;
            data.forEach(el=>{
                if(el.convVer == $this.convRule.convVer){
                    cnt = cnt +1;
                }
            });
            if(cnt == 0){
                params.saveDiv = 'insert';
            }
            return params;
        }
        //메인인코딩 값 KeyGen
        ,getMainEncVal(){
            const $this = this;
            let params = $this.getData();
            $this.doPost('/mng/obj/convRuleMng/generateEncodingValue.hb', params).then(function(res){
                if(res.data.rtnCd == '0000'){
                    $this.convRule.mainEncVal = res.data.rtnData;
                }else{
                    $this.alert(res.data.rtnMsg);
                }
            });
        }
        //페이지 이동
        ,setPgLink(pageNo){
            const $this = this;

            let params = {
                convVer  : $this.convRule.convVer,
                dbConnId : $this.convRule.dbConnId
            }
            if(!ValdUtil.isEmptyJson(params)){
                CmonUtil.setPageLink(pageNo, params);
            } else {
                $this.alert("전환규칙을 선택해주세요");
            }
            
        }
        //전환버전입력
        ,async changeConvVer(){
            let $this = this;
            let cnt = 0;
            await $this.doPost('/mng/obj/convRuleMng/selectListConvRule.hb', $this.detlParams).then(function(res){
                if(res.data.rtnCd == '0000'){
                    if(res.data.rtnData.result != null){
                        res.data.rtnData.result.forEach(el=>{
                            if(el.convVer == $this.convRule.convVer){
                                cnt = cnt +1;
                            }
                        });
                    }
                }
            });

            if(cnt == 0){
                this.saveDiv = 'insert';
            }else{
                this.saveDiv = 'update';
            }
        }
        //탭선택
        ,tabClick(cdVal){
            this.convRule.tabDiv = cdVal;
            switch(cdVal){
                case 'rrno':
                    this.$refs.ConvTest[0].setConvTestVal('convTestOrgnVal','970513-1183721');
                    break;
                case 'frno':
                    this.$refs.ConvTest[1].setConvTestVal('convTestOrgnVal','970513-5146890');
                    break;
                case 'ci':
                    this.$refs.ConvTest[2].setConvTestVal('convTestOrgnVal','9705131185317');
                    break;
                case 'ppno':
                    this.$refs.ConvTest[3].setConvTestVal('convTestOrgnVal','M01234567');
                    break;
                case 'dlic':
                    this.$refs.ConvTest[4].setConvTestVal('convTestOrgnVal','13-11-123456-78');
                    break;
                case 'nm':
                    this.$refs.ConvTest[5].setConvTestVal('convTestOrgnVal','김허블');
                    break;
                case 'bith':
                    this.$refs.ConvTest[6].setConvTestVal('convTestOrgnVal','1997-05-13');
                    break;
                case 'tel':
                    this.$refs.ConvTest[7].setConvTestVal('convTestOrgnVal','02-865-0606');
                    this.$refs.ConvTest[7].setConvTestVal('convTestOrgnVal2','010-8650-0606');
                    break;
                case 'addr':
                    this.$refs.ConvTest[8].setConvTestVal('convTestOrgnVal','04175');
                    this.$refs.ConvTest[8].setConvTestVal('convTestOrgnVal2','서울특별시 마포구 마포대로12 한신빌딩 911호');
                    break;
                case 'mail':
                    this.$refs.ConvTest[9].setConvTestVal('convTestOrgnVal','hubble.contactus@gmail.com');
                    break;
                case 'ccrd':
                    this.$refs.ConvTest[10].setConvTestVal('convTestOrgnVal','5317-6400-0559-1300');
                    break;
                case 'acnt':
                    this.$refs.ConvTest[11].setConvTestVal('convTestOrgnVal','289-037076-05-038');
                    break;
            }
        }
        //초기화 전환규칙 목록 
        ,clearListConvVerGrid() {
            this.$refs.ConvVerGrid.clearGridData();
        }
        //데이터 리셋
        ,resetData(val){
            if(val == this.convRule){
                this.convRule.tabDiv       = 'rrno'
                this.convRule.convVer      = ''    //전환_버전
                this.convRule.convVerDesc  = ''    //전환_버전_설명
                this.convRule.mainEncVal   = ''    //메인_인코딩_값
                this.convRule.totEcdcSameYn= ''    //전체_암복호화_동일_여부
                this.convRule.dbConnId     = ''    //디비_연결ID
                this.convRule.orgnRrnoSql  = ''    //원본_주민번호SQL
                this.convRule.rrno         = {}    //주민등록번호_탭_값
                this.convRule.frno         = {}    //외국인등록번호_탭_값
                this.convRule.ci           = {}    //CI_탭_값
                this.convRule.ppno         = {}    //여권번호_탭_값
                this.convRule.dlic         = {}    //운전면허_탭_값
                this.convRule.nm           = {}    //성명_탭_값
                this.convRule.tel          = {}    //전화_탭_값
                this.convRule.addr         = {}    //주소_탭_값                
                this.convRule.mail         = {}    //메일_탭_값                
                this.convRule.ccrd         = {}    //신용카드_탭_값                
                this.convRule.acnt         = {}    //계좌_탭_값
            }else{
                for(let key in val){
                    val[key] = ''
                }
            }
        }
        //탭 기본 데이터 init
        ,initTabData(){
            let $this = this;
            $this.tabMenu.forEach(el=>{
                if(el.cdVal != 'etc' && el.cdVal != 'sql'){
                    $this.convRule[el.cdVal]['ecdcYn'] = 'N';
                    $this.convRule[el.cdVal]['totEcdcSameYn'] = 'N';
                    $this.convRule[el.cdVal]['dbConnId'] = '';

                    if(el.cdVal == 'rrno' || el.cdVal == 'frno'){
                        $this.convRule[el.cdVal]['gndrMntnYn'] = 'Y';
                        $this.convRule[el.cdVal]['ageMntnYn'] = 'Y';
                        $this.convRule[el.cdVal]['ageFr'] = 0;
                        $this.convRule[el.cdVal]['ageTo'] = 0;
                    }

                    if(el.cdVal == 'acnt' || el.cdVal == 'addr' || el.cdVal == 'dlic' || el.cdVal == 'ppno' || el.cdVal == 'ci' 
                       || el.cdVal == 'mail' || el.cdVal == 'ccrd' || el.cdVal == 'tel' || el.cdVal == 'nm'){
                        $this.convRule[el.cdVal]['convCd'] = '99';
                        if(el.cdVal =='tel'){
                            $this.convRule[el.cdVal]['mphnConvCd'] = '99'
                        }
                        if(el.cdVal ==='ci'){
                            $this.convRule[el.cdVal]['ciConvCd'] = '90'
                        }
                    }

                    if(el.cdVal =='bith'){
                        $this.convRule[el.cdVal]['rrnoLinkYn'] = 'Y';
                        $this.convRule[el.cdVal]['ageFr'] = 0;
                        $this.convRule[el.cdVal]['ageTo'] = 0;
                    }

                    if(el.cdVal =='addr'){
                        $this.convRule[el.cdVal]['psnoEcdcYn'] = 'N';
                        $this.convRule[el.cdVal]['ecdcYn'] = 'N';
                    }

                    $this.tabMenu.forEach((el,i)=>{
                        if(i < 11){
                            $this.$refs.rrnoEcdcRuleSet[i].init();
                            $this.$refs.ConvTest[i].init();
                        }
                    });
                }
            });
        }
        //저장 유효성 검증
        ,async saveValid(callback){
            let $this = this;
            let ccnt = 0;
            await $this.doPost('/mng/obj/convRuleMng/selectListConvRule.hb', $this.detlParams).then(function(res){
                if(res.data.rtnCd == '0000'){
                    if(res.data.rtnData.result != null){
                        res.data.rtnData.result.forEach(el=>{
                            if(el.convVer == $this.convRule.convVer){
                                ccnt = ccnt +1;
                            }
                        });
                    }
                }
            });

            if($this.saveDiv =='insert' && ccnt > 0){
                $this.alert('이미 존재하는 전환버전입니다');
                return false;
            }
            if($this.saveDiv =='update' && ccnt > 0 && $this.rowData.convVer != $this.convRule.convVer){
                $this.alert('이미 존재하는 전환버전입니다');
                return false;
            }

            if(!$this.ValdUtil.valdLenNull($this.convRule.convVer     , 10  , '전환버전은'))      return false;
            if(!$this.ValdUtil.valdLenNull($this.convRule.mainEncVal  , 100 , '메인인코딩 값은')) return false;
            if(!$this.ValdUtil.valdLenNull($this.convRule.convVerDesc , ''  , '설명은'))         return false;

            //원본데이터암호화가 예인경우
            let cnt = 0;
            $this.tabMenu.forEach(el=>{
                if(el.cdVal != 'etc' && el.cdVal != 'sql'){
                    if($this.convRule[el.cdVal].ecdcYn == 'Y'){
                        if(!$this.ValdUtil.valdLenNull($this.convRule[el.cdVal]['ecdcMethCd']  , 20   , '['+el.cdNm+'탭]<br/>암호화방식은')){ cnt = cnt+1; return false;}
                        if(!$this.ValdUtil.valdLenNull($this.convRule[el.cdVal]['encForm']     , 256  , '['+el.cdNm+'탭]<br/>암호화형식은')){ cnt = cnt+1; return false;}
                        if(!$this.ValdUtil.valdLenNull($this.convRule[el.cdVal]['decForm']     , 256  , '['+el.cdNm+'탭]<br/>복호화형식은')){ cnt = cnt+1; return false;}
                        if($this.convRule[el.cdVal].ecdcMethCd == 'SQL'){
                            if(!this.ValdUtil.valdLenNull($this.convRule[el.cdVal]['dbConnId']     , 100  , '['+el.cdNm+'탭]<br/>DB연결ID는')){ cnt = cnt+1; return false;}
                        }
                        if(el.cdVal == 'rrno' || el.cdVal =='frno'){
                            if($this.convRule[el.cdVal].ageMntnYn =='N'){
                                if(!$this.ValdUtil.valdLenNull($this.convRule[el.cdVal]['ageFr']  , ''  , '['+el.cdNm+'탭]<br/>연령구간은')){ cnt = cnt+1; return false;}
                                if(!$this.ValdUtil.valdLenNull($this.convRule[el.cdVal]['ageTo']  , ''  , '['+el.cdNm+'탭]<br/>연령구간은')){ cnt = cnt+1; return false;}
                            }
                        }
                        if(el.cdVal == 'bith'){
                            if($this.convRule[el.cdVal].bithRrnoLinkYn =='N'){
                                if(!$this.ValdUtil.valdLenNull($this.convRule[el.cdVal]['ageFr']  , ''  , '['+el.cdNm+'탭]<br/>연령구간은')){ cnt = cnt+1; return false;}
                                if(!$this.ValdUtil.valdLenNull($this.convRule[el.cdVal]['ageTo']  , ''  , '['+el.cdNm+'탭]<br/>연령구간은')){ cnt = cnt+1; return false;}
                            }
                        }
                    }
                }
            });
            if(cnt > 0){
                return false;
            }
            callback();
        }
       //공통버튼(초기화,조회,저장,삭제)
       ,onSetButtonClick(div){
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.init();
                    break;
                case 'select':
                    $this.searchListConvVer();
                    break;
                case 'save':
                    $this.saveConvRuleMng();
                    break;
                case 'delete':
                    $this.deleteConvRuleMng();
                    break;
                default:
                    break;
            }
        } 
    }
   ,mounted() {
        let $this = this;
        $this.init();
    }   
}
</script>

<style scoped>
/* 탭 */
#tabs .tab-menu li {
    display: inline-flex;
    align-items: center;
    position: relative;
    width: max-content;
    height: 30px;
    padding-right: 24px;
    padding-left: 24px;
    background-color: #dddddd;
    border: 1px solid #d1d1dd;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    color: #999999;
    top: 1px;
}

#tabs .tab-contents {
    display: block;
    border: 1px solid #d1d1dd;
    border-radius: 3px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    background-color: #ffffff;
    color: #333333;
    padding: 15px 10px;
    min-height: calc(100vh - 535px);
}
.section-wrap .section-part .inner-tab-content  > div span {
    display: inline-block;
    width: 0px !important;
    margin-right: 10px;
    color: red;
    font-size: 12px;
}
</style>
