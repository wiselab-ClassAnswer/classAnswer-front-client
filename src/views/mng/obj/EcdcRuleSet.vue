<template>
    <div>
        <h2 class="m-b-0">암호화 방식</h2>
        <div class="w-100 h-20">
            <div class="w-100 ib">
                <span class="wd-100 essn">원본데이터암호화</span>
                <div class="c-wd-100 ib">
                    <label>
                        <input type="radio" class="h-a p-rl wd-20" value="Y" v-model="dataParams.ecdcYn" @change="changeTotEcdcSameYn()" style="top:2px; left:-3px;">
                        <span class="ib c-wd-20">예</span>
                    </label>
                    <label>
                        <input type="radio" class="h-a p-rl wd-20" value="N" v-model="dataParams.ecdcYn" @change="changeTotEcdcSameYn()" style="top:2px; left:-3px;">
                        <span class="ib c-wd-20">아니오</span>
                    </label>
                    <div class="f-r ib">
                        <label>
                            <input class="wd-15 h-a ib p-rl" true-value="Y" false-value="N" type="checkbox" v-model="dataParams.totEcdcSameYn" @change="changeTotEcdcSameYn('tot')"/>
                            <span class="c-wd-10 ib m-l-5 m-r-0">암복호화 방식 전체 동일</span>
                        </label>
                    </div>
                </div>
            </div> 
        </div>
        <div class="w-100 m-t-5">
            <div class="w-50 ib">
                <span class="wd-100" :class="dataParams.ecdcYn=='Y'? 'essn' : ''">암호화방식</span>
                <select class="c-wd-100" v-model="dataParams.ecdcMethCd" :disabled="dataParams.ecdcYn =='Y'? false : true" @change="changeEcdcMethCd()" @blur="changeTotEcdcSameYn()" >
                    <option value = ''></option>
                    <option v-for="item in code.ecdcMethCdList" :key="item.cdVal" :value="item.cdVal">{{item.cdNm}}</option>
                </select>
            </div>
            <div class="w-50 ib">
                <span class="wd-100 p-l-5 t-a-r" :class="dataParams.ecdcYn=='Y' && dataParams.ecdcMethCd=='SQL'? 'essn' : ''">DB연결ID</span>
                <select class="c-wd-100" v-model="dataParams.dbConnId" :disabled="dataParams.ecdcYn =='N' || dataParams.ecdcMethCd !='SQL'? true : false" @change="changeTotEcdcSameYn('dbConnId')" >
                    <option value = ''></option>
                    <option v-for="el in code.dbConnIdList" :key="el.colId" :value="el.colId">
                        {{ el.colId }} | {{ el.colNm }}
                    </option>
                </select>
            </div>
        </div>
        <div class="w-100 m-t-3">
            <div class="w-100">
                <span class="wd-100" :class="dataParams.ecdcYn=='Y'? 'essn' : ''">암호화형식</span>
                <input class="c-wd-100" type="text" v-model="dataParams.encForm" :disabled="dataParams.ecdcYn =='Y'? false : true" @change="changeTotEcdcSameYn()" >
            </div>
        </div>
        <div class="w-100 m-t-3">
            <div class="w-100">
                <span class="wd-100" :class="dataParams.ecdcYn=='Y'? 'essn' : ''">복호화형식</span>
                <input class="c-wd-100" type="text" v-model="dataParams.decForm" :disabled="dataParams.ecdcYn =='Y'? false : true" @change="changeTotEcdcSameYn()" >
            </div>
        </div>

        <h2 class="m-t-20">암복호화테스트</h2>
        <div class="w-100">
            <span class="wd-100 ib">암호화 값 </span>
            <div class="c-wd-100 ib">
                <input class="w-40 ib" type="text" v-model="params.encTestVal" :disabled="dataParams.ecdcYn =='Y'? false : true">
                <button class="btn-nomal w-15 m-l-5 ib p-rl" style="top:-1px;" @click="selectEcdcTest('ENC')" :disabled="dataParams.ecdcYn =='Y'? false : true">
                    <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                    <p class="ib">테스트</p>
                </button>
                <input class="w-43 f-r ib" type="text" v-model="params.encRsltVal" disabled>
            </div>
        </div>         
        <div class="w-100 m-t-3">
            <span class="wd-100 ib">복호화 값</span>
            <div class="c-wd-100 ib">
                <input class="w-40 ib" type="text" v-model="params.decTestVal" :disabled="dataParams.ecdcYn =='Y'? false : true">
                <button class="btn-nomal w-15 m-l-5 ib p-rl" style="top:-1px;" @click="selectEcdcTest('DEC')" :disabled="dataParams.ecdcYn =='Y'? false : true">
                    <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                    <p class="ib">테스트</p>
                </button>
                <input class="w-43 f-r ib" type="text" v-model="params.decRsltVal" disabled>
            </div>
        </div>
    </div>
</template>
<script>
import { inject, reactive } from 'vue'
export default {
    props:{
        dataParams:{
            type: Object,
            default: {}
        },
        totEcdcSameYn: {
            type: String,
            default: ''
        },
        dbConnId: {
            type: String,
            default: ''
        }
    }
    ,emits: ['update:dataParams', 'getEcdcRule']
    ,setup() {
        const getCmonCdList  = inject('getCmonCdList');
        const getColIdNmList = inject('getColIdNmList');

        let code = reactive({
            ecdcMethCdList: [],
            dbConnIdList  : []  
        });

        const dbConnIdData = {
            'tblId' : 'te_db_conn_info',
            'colId' : 'db_conn_id,db_kind_cd',
            'colNm' : 'db_conn_nm',
            'where' : [{
                'andCol'  : 'db_type_cd',
                'andCalc' : '=',
                'andVal'  : "'ORG'"
            }],
            'orderby' : [{
                'orderCol' : 'db_conn_id'
            }]
        }

        getCmonCdList('ECDC_METH_CD', code.ecdcMethCdList, 'N', null);
        getColIdNmList(dbConnIdData , code.dbConnIdList  , 'N', null);

        return {
            code
        };
    }
    ,data: function() {
		return {
            params:{
                //  ecdcYn:''        //암복호화_여부
                // ,ecdcMethCd:''    //암복호화_방식_코드
                // ,dbConnId:''      //DB연결ID
                // ,encForm:''       //암호화_형식
                // ,decForm:''       //복호화_형식

                // ,totEcdcSameYn:'' //전체_암복호화_동일_여부
            
                decTestVal:''    //복호화_테스트_값
                ,decRsltVal:''    //복호화_테스트_결과_값
                ,encTestVal:''    //암호화_테스트_값
                ,encRsltVal:''    //암호화_테스트_결과_값
            }
        }
    },
    methods: {
        init() {
            this.resetData(this.params);
            this.resetData(this.dataParams);
            
            this.params.encTestVal = '테스트'
        }
        ,initData(data){
            this.convRule.totEcdcSameYn = data.totEcdcSameYn;
            this.convRule.tabDiv = data.tabDiv;
            let tabDivLength = this.convRule.tabDiv.length;

            for(let key in data[this.convRule.tabDiv]){
                let keyVal = key.toLocaleLowerCase().substring(tabDivLength, key.length);
                
                for(let convRuleKey in this.convRule){
                    if(convRuleKey.toLocaleLowerCase().indexOf(keyVal) > -1){
                        this.convRule[convRuleKey] = data.rrno[key];
                    }
                }
            }
        }
        ,selectEcdcTest(ecdcDivCd) {
            let $this = this;
            
            if($this.ecdcValid(ecdcDivCd)){
                let params = $this.$props.dataParams;
                $this.code.dbConnIdList.forEach((el,i)=>{
                    if(el.colId == $this.$props.dataParams.dbConnId){
                        params['dbKindCd'] = $this.code.dbConnIdList[i].dbKindCd;
                    }
                })
                params['ecdcDivCd'] = ecdcDivCd;
                ecdcDivCd === 'ENC' ? params['testVal'] = this.params.encTestVal :params['testVal'] = this.params.decTestVal;
                
                $this.params.decRsltVal = '';
                $this.doPost('/mng/obj/convRuleMng/selectEcdcTest.hb',params).then(function(res){
                    if(res.data.rtnCd == '0000'){
                        if ( ecdcDivCd === 'ENC' ) {
                            $this.params.encRsltVal = res.data.rtnData;
                            $this.params.decTestVal = res.data.rtnData;
                        } else {
                            $this.params.decRsltVal = res.data.rtnData;
                        }
                    }else{
                        $this.alert(res.data.rtnMsg);
                    }
                });
            }
        }
        ,changeTotEcdcSameYn(div){
            let $this = this;
            if(div=='tot' && $this.$props.dataParams.totEcdcSameYn =='Y'){
                $this.confirm({
                    content: '일괄 변경하시겠습니까?'
                    ,callback:{
                        yes(){
                            $this.$emit('getEcdcRule',$this.$props.dataParams);
                        }
                        ,no(){
                            $this.$props.dataParams.totEcdcSameYn = 'N';
                        }
                    }         
                });
            }else{
                $this.$emit('getEcdcRule',$this.$props.dataParams,(div == 'dbConnId' && $this.$props.dataParams.dbConnId != '') ? div : '');
            }
        }
        ,changeEcdcMethCd(){
            // if(this.$props.dataParams.ecdcMethCd != 'SQL'){
                this.$props.dataParams.dbConnId = '';
            // };
        }
        ,ecdcValid(ecdcDivCd){
            if (!this.ValdUtil.valdLenNull(this.$props.dataParams.ecdcMethCd, 20,  '암호화방식은'))          return false;
            if (this.$props.dataParams.ecdcMethCd == 'SQL' && !this.ValdUtil.valdLenNull(this.$props.dataParams.dbConnId, 100,  'DB연결ID는'))          return false;
            if (!this.ValdUtil.valdLenNull(this.$props.dataParams.encForm, 256,  '암호화형식은'))          return false;
            if (!this.ValdUtil.valdLenNull(this.$props.dataParams.decForm, 256,  '복호화형식은'))          return false;
            if (!this.ValdUtil.valdLenNull(this.params[ecdcDivCd.toLocaleLowerCase()+'TestVal'], null,  ecdcDivCd =='ENC' ? '암호화 값은' : '복호화 값은'))          return false;
            return true;
        }
        //데이터 리셋
        ,resetData(val){
            for(let key in val){
                val[key] = ''
            }
        }
    }
    ,mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>