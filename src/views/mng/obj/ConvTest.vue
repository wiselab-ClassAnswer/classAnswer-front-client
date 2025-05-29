<template>
    <div>
        <!-- 구성조건 -->
        <div>
            <h2 class="m-b-0 w-20 ib p-rl" style="top:-2px">구성조건</h2>
            <div v-if="tabDiv==='frno'" class="w-80 ib t-a-r f-r">
                <label class="w-80">
                    <input type="checkbox" v-model="dataParams.rrnoSameYn" true-value="Y" false-value="N" class="wd-15" style="width:13px !important; height:13px;" @change="rrnoSameYn('rrnoSameYn')"/>
                    <span class="ib p-rl" style="width:130px; top:-3px">주민등록번호 조건과 동일</span>
                </label>
            </div>
            <!-- 주민등록번호, 외국인번호 -->
            <div v-if="tabDiv==='rrno' || tabDiv==='frno'">
                <div class="w-100" style="margin-top:17px !important; min-height: 123px; max-height: 123px;">
                    <div class="w-100">
                        <span class="wd-100 essn">성별유지</span>
                        <div class="c-wd-100 ib">
                            <label v-for="el in code.ynCdList" :key="el" >
                                <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="dataParams.gndrMntnYn" style="top:2px; left:-3px;" @change="rrnoSameYn()" >
                                <span class="ib c-wd-20">{{el.cdNm}}</span>
                            </label>
                        </div>
                    </div>
                    <div class="w-100 m-t-10">
                        <span class="wd-100 essn">연령유지</span>
                        <div class="c-wd-100 ib">
                            <label v-for="el in code.ynCdList" :key="el" >
                                <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="dataParams.ageMntnYn" style="top:2px; left:-3px;" @change="rrnoSameYn()" >
                                <span class="ib c-wd-20">{{el.cdNm}}</span>
                            </label>
                        </div>
                    </div>
                    <div class="w-60 m-t-10">
                        <span class="wd-100 ib" :class="dataParams.ageMntnYn=='N'? 'essn' : ''">연령구간</span>
                        <div class="c-wd-100 ib">
                            <input class="w-45 ib" type="text" v-model="dataParams.ageFr" @change="rrnoSameYn()" @blur="changeAge('Fr')" :disabled="dataParams.ageMntnYn =='Y'? true : false"/>
                            <div class="wd-20 t-a-c ib">
                                <span class="w-100">~</span>
                            </div>
                            <input class="w-45 ib" type="text" v-model="dataParams.ageTo" @change="rrnoSameYn()" @blur="changeAge()" :disabled="dataParams.ageMntnYn =='Y'? true : false"/>
                        </div>
                    </div>
                </div>
            </div>
             <!-- CI -->
            <div v-else-if="tabDiv==='ci' ">
                <div class="w-100 " style="margin-top:17px !important; min-height: 123px; max-height: 123px;">
                    <div class="w-100">
                        <span class="wd-100 essn">생성조건</span>
                        <div class="c-wd-100 ib">
                            <label v-for="el in code.ciConvCdList" :key="el" >
                                <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="dataParams.convCd" style="top:2px; left:-3px;" />
                                <span class="ib c-wd-20">{{el.cdNm}}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 여권번호 -->
            <div v-else-if="tabDiv==='ppno' ">
                <div class="w-100 " style="margin-top:17px !important; min-height: 123px; max-height: 123px;">
                    <div class="w-100">
                        <span class="wd-100 essn">생성조건</span>
                        <div class="c-wd-100 ib">
                            <label v-for="el in code.ppnoConvCdList" :key="el" >
                                <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="dataParams.convCd" style="top:2px; left:-3px;" />
                                <span class="ib c-wd-20">{{el.cdNm}}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 운전면허번호 -->
            <div v-else-if="tabDiv==='dlic' ">
                <div class="w-100 " style="margin-top:17px !important; min-height: 123px; max-height: 123px;">
                    <div class="w-100">
                        <span class="wd-100 essn p-rl" style="top:-22px;">생성조건</span>
                        <div class="c-wd-100 ib">
                            <label v-for="el in code.dlicConvCdList" :key="el" >
                                <input type="radio" class="h-a p-rl wd-20 m-b-5"  :value="el.cdVal" v-model="dataParams.convCd" style="top:2px; left:-3px;" />
                                <span class="ib c-wd-20" style="min-width:85px">{{el.cdNm}}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 성명 -->
            <div v-else-if="tabDiv==='nm' ">
                <div class="w-100 " style="margin-top:17px !important; min-height: 123px; max-height: 123px;">
                    <div class="w-100">
                        <span class="wd-100 essn">생성조건</span>
                        <div class="c-wd-100 ib">
                            <label v-for="el in code.nmConvCdList" :key="el" >
                                <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="dataParams.convCd" style="top:2px; left:-3px;" />
                                <span class="ib c-wd-20">{{el.cdNm}}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 생년월일 -->
            <div v-if="tabDiv==='bith'">
                <div class="w-100 " style="margin-top:17px !important; min-height: 123px; max-height: 123px;">
                    <div class="w-100 m-t-10">
                        <span class="wd-100 essn">주민번호연계</span>
                        <div class="c-wd-100 ib">
                            <label v-for="el in code.ynCdList" :key="el" >
                                <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="dataParams.rrnoLinkYn" @change="RrnoLinkYn()" style="top:2px; left:-3px;" >
                                <span class="ib c-wd-20">{{el.cdNm}}</span>
                            </label>
                        </div>
                    </div>
                    <div class="w-60 m-t-10">
                        <span class="wd-100 ib" :class="dataParams.rrnoLinkYn=='N'? 'essn' : ''">연령구간</span>
                        <div class="c-wd-100 ib">
                            <input class="w-45 ib" type="text" v-model="dataParams.ageFr" @blur="changeAge('Fr')" :disabled="dataParams.rrnoLinkYn =='Y'? true : false"/>
                            <div class="wd-20 t-a-c ib">
                                <span class="w-100">~</span>
                            </div>
                            <input class="w-45 ib" type="text" v-model="dataParams.ageTo" @blur="changeAge()" :disabled="dataParams.rrnoLinkYn =='Y'? true : false"/>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 전화번호 -->
            <div v-else-if="tabDiv==='tel' ">
                <div class="w-100 " style="margin-top:17px !important; min-height: 123px; max-height: 123px;">
                    <div class="w-100">
                        <span class="wd-100 essn">일반전화 생성조건</span>
                        <div class="c-wd-100 ib">
                            <label v-for="el in code.telConvCdList" :key="el" >
                                <input type="radio" class="h-a p-rl c-wd-100" :value="el.cdVal" v-model="dataParams.convCd" style="top:2px;" />
                                <span class="ib wd-100 p-l-5">{{el.cdNm}}</span>
                            </label>
                        </div>
                    </div>
                    <div class="w-100 m-t-10">
                        <span class="wd-100 essn">휴대전화 생성조건</span>
                        <div class="c-wd-100 ib">
                            <label v-for="el in code.mphnConvCdList" :key="el" >
                                <input type="radio" class="h-a p-rl c-wd-100" :value="el.cdVal" v-model="dataParams.mphnConvCd" style="top:2px;" />
                                <span class="ib wd-100 p-l-5">{{el.cdNm}}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 주소 -->
            <div v-else-if="tabDiv==='addr' ">
                <div class="w-100 " style="margin-top:17px !important; min-height: 123px; max-height: 123px;">
                    <div class="w-100">
                        <span class="wd-100 essn">우편번호 암호화</span>
                        <div class="c-wd-100 ib">
                            <label v-for="el in code.ynCdList" :key="el" >
                                <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="dataParams.psnoEcdcYn" style="top:2px; left:-3px;" />
                                <span class="ib c-wd-20">{{el.cdNm}}</span>
                            </label>
                        </div>
                    </div>
                    <div class="w-100 m-t-10">
                        <span class="wd-100 essn">주소 암호화</span>
                        <div class="c-wd-100 ib">
                            <label v-for="el in code.ynCdList" :key="el" >
                                <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="dataParams.ecdcYn" style="top:2px; left:-3px;" />
                                <span class="ib c-wd-20">{{el.cdNm}}</span>
                            </label>
                        </div>
                    </div>
                    <div class="w-100 m-t-10">
                        <span class="wd-100 essn">생성조건</span>
                        <div class="c-wd-100 ib">
                            <label v-for="el in code.addrConvCdList" :key="el" >
                                <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="dataParams.convCd" style="top:2px; left:-3px;" />
                                <span class="ib c-wd-20">{{el.cdNm}}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 이메일주소 -->
            <div v-else-if="tabDiv==='mail' ">
                <div class="w-100 " style="margin-top:17px !important; min-height: 123px; max-height: 123px;">
                    <div class="w-100">
                        <span class="wd-100 essn">생성조건</span>
                        <div class="c-wd-100 ib">
                            <label v-for="el in code.mailConvCdList" :key="el" >
                                <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="dataParams.convCd" style="top:2px; left:-3px;" />
                                <span class="ib c-wd-20">{{el.cdNm}}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 신용카드번호 -->
            <div v-else-if="tabDiv==='ccrd' ">
                <div class="w-100 " style="margin-top:17px !important; min-height: 123px; max-height: 123px;">
                    <div class="w-100">
                        <span class="wd-100 essn">생성조건</span>
                        <div class="c-wd-100 ib">
                            <label v-for="el in code.ccrdConvCdList" :key="el" >
                                <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="dataParams.convCd" style="top:2px; left:-3px;" />
                                <span class="ib c-wd-20">{{el.cdNm}}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 계좌번호 -->
            <div v-else-if="tabDiv==='acnt' ">
                <div class="w-100 " style="margin-top:17px !important; min-height: 123px; max-height: 123px;">
                    <div class="w-100">
                        <span class="wd-100 essn">생성조건</span>
                        <div class="c-wd-100 ib">
                            <label v-for="el in code.acntConvCdList" :key="el" >
                                <input type="radio" class="h-a p-rl wd-20" :value="el.cdVal" v-model="dataParams.convCd" style="top:2px; left:-3px;" />
                                <span class="ib c-wd-20">{{el.cdNm}}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 기타 -->
            <div v-else-if="tabDiv==='etc' ">
            </div>
            <!-- 고객연계SQL -->
            <div v-else-if="tabDiv==='sql' ">
            </div>
        </div>

        <!-- 전환 테스트 -->
        <div>
            <h2 class="m-t-20">전환테스트</h2>
            <!-- 전화번호 -->
            <div v-if="tabDiv==='tel'">
                <div class="w-100">
                    <span class="wd-100 essn ib">일반전화</span>
                    <div class="c-wd-100 ib">
                        <input class="w-40 ib" type="text" v-model="params.convTestOrgnVal" />
                        <button class="btn-nomal w-15 ib m-l-3 p-rl" style="top:-1px;" @click="shapeShiftTest('tel')" >
                            <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                            <p class="ib">테스트</p>
                        </button>
                        <input class="w-40 m-l-3 ib" type="text" v-model="params.convTestRsltVal" disabled/>
                    </div>
                </div> 
                <div class="w-100 m-t-5">
                    <span class="wd-100 essn ib">휴대전화</span>
                    <div class="c-wd-100 ib">
                        <input class="w-40 ib" type="text" v-model="params.convTestOrgnVal2" />
                        <button class="btn-nomal w-15 ib m-l-3 p-rl" style="top:-1px;" @click="shapeShiftTest('mhp')">
                            <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                            <p class="ib">테스트</p>
                        </button>
                        <input class="w-40 m-l-3 ib" type="text" v-model="params.convTestRsltVal2" disabled/>
                    </div>
                </div> 
            </div>
            <!-- 주소 -->
            <div v-else-if="tabDiv==='addr'">
                <div class="w-100 m-b-5">
                    <span class="wd-100 ib">우편번호</span>
                    <div class="c-wd-100 ib">
                        <input class="w-80 ib" type="text" v-model="params.convTestOrgnVal" />
                        <button class="btn-nomal w-18 f-r ib p-rl"  @click="shapeShiftTest('addr')">
                            <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                            <p class="ib">테스트</p>
                        </button>
                    </div>
                </div> 
                <div class="w-100">
                    <span class="wd-100 ib">주소</span>
                    <div class="c-wd-100 ib">
                        <input class="w-100 ib" type="text" v-model="params.convTestOrgnVal2" />
                    </div>
                </div> 
                <div class="w-100 m-t-10">
                    <div class="w-100 m-b-5">
                        <span class="wd-100 ib"></span>
                        <div class="c-wd-100 ib">
                            <input class="w-100 ib" type="text" v-model="params.convTestRsltVal" disabled/>
                        </div>
                    </div> 
                    <div class="w-100">
                        <span class="wd-100 ib"></span>
                        <div class="c-wd-100 ib">
                            <input class="w-100 ib" type="text" v-model="params.convTestRsltVal2" disabled/>
                        </div>
                    </div>  
                </div>
            </div>
            <!-- 기타 -->
            <div v-else-if="tabDiv==='etc'">
                
            </div>
            <div v-else>
                <div class="w-100">
                    <span class="wd-100 ib">전환 값</span>
                    <div class="c-wd-100 ib">
                        <input class="w-40 ib" type="text" v-model="params.convTestOrgnVal" >
                        <button class="btn-nomal w-15 ib m-l-3 p-rl" @click="shapeShiftTest()" >
                            <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                            <p class="ib">테스트</p>
                        </button>
                        <input class="w-40 m-l-3 ib" type="text" v-model="params.convTestRsltVal" disabled/>
                    </div>
                    <!-- <div class="c-wd-100 ib">
                        <input class="w-35 ib" type="text" v-model="params.convTestOrgnVal" >
                        <button class="btn-nomal w-20  ib m-l-5 p-rl" @click="shapeShiftTest()" >
                            <font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
                            <p class="ib">테스트</p>
                        </button>
                        <input class="w-43 f-r ib" type="text" v-model="params.convTestRsltVal" disabled/>
                    </div> -->
                </div> 
            </div>
        </div>
    </div>
</template>
<script>
import { inject, reactive } from 'vue'
import { ValdUtil } from '@/utils/ValdUtil';
export default {

    props:{
        tabDiv: {
            type: String,
            default: 'rrno'
        }
        ,dataParams:{
            type: Object,
            default:{}
        }
        ,mainEncVal: {
            type: String,
            default: ''
        },
    }
    ,emits: ['update:dataParams','rrnoSameYn','shapeShiftTest']
    ,setup() {
        const getCmonCdList = inject('getCmonCdList');
        let code = reactive({
            ynCdList: []
            ,ppnoConvCdList: []
            ,dlicConvCdList: []
            ,nmConvCdList  : []
            ,telConvCdList : []
            ,mphnConvCdList: []
            ,addrConvCdList: []
            ,mailConvCdList: []
            ,ccrdConvCdList: []
            ,acntConvCdList: []
            ,ciConvCdList  : []
        });

        getCmonCdList('YN'          , code.ynCdList      , 'N', null);  // YN / YN
        getCmonCdList('PPNO_CONV_CD', code.ppnoConvCdList, 'N', null);  // PPNO_CONV_CD / 여권_전환_코드
        getCmonCdList('DLIC_CONV_CD', code.dlicConvCdList, 'N', null);  // DLIC_CONV_CD / 운전면허_전환_코드
        getCmonCdList('NM_CONV_CD'  , code.nmConvCdList  , 'N', null);  // NM_CONV_CD   / 성명_전환_코드
        getCmonCdList('TEL_CONV_CD' , code.telConvCdList , 'N', null);  // TEL_CONV_CD  / 일반전화_전환_코드
        getCmonCdList('MPHN_CONV_CD', code.mphnConvCdList, 'N', null);  // MPHN_CONV_CD / 휴대전화_전환_코드
        getCmonCdList('ADDR_CONV_CD', code.addrConvCdList, 'N', null);  // ADDR_CONV_CD / 주소_전환_코드
        getCmonCdList('MAIL_CONV_CD', code.mailConvCdList, 'N', null);  // MAIL_CONV_CD / 메일_전환_코드
        getCmonCdList('CCRD_CONV_CD', code.ccrdConvCdList, 'N', null);  // CCRD_CONV_CD / 신용카드_전환_코드
        getCmonCdList('ACNT_CONV_CD', code.acntConvCdList, 'N', null);  // ACNT_CONV_CD / 계좌_전환_코드
        getCmonCdList('CI_CONV_CD'  , code.ciConvCdList  , 'N', null);  // CI_CONV_CD   / CI_전환_코드
    
        return {
            code
        }

    }
    ,data: function() {
		return {
            params:{

                // ecdcYn:''        //암복호화_여부
                // ,ecdcMethCd:''    //암복호화_방식_코드
                // ,dbConnId:''      //DB연결ID
                // ,encForm:''       //암호화_형식
                // ,decForm:''       //복호화_형식

                convTestOrgnVal   :''         //전환테스트_원본_값
                ,convTestOrgnVal2 :''         //전환테스트_원본_값2
                ,convTestRsltVal  :''         //전환테스트_결과_값
                ,convTestRsltVal2 :''         //전환테스트_결과_값
            }

        }
    },
    methods: {
        init() {
            this.resetData(this.params);
        }
        //전환테스트
        ,shapeShiftTest(div) {
            const $this = this;
            
            if($this.$props.tabDiv == 'bith' && $this.$props.dataParams.rrnoLinkYn=='Y'){
                $this.alert('주민등록번호탭에서 테스트 가능합니다');
                return false;
            }
            if(!this.ValdUtil.valdLenNull($this.$props.mainEncVal , 1000  , '메인인코딩 값은')) return false;

            if(div == 'addr'){
                $this.params.convTestRsltVal = '';
                $this.params.convTestRsltVal2 = '';
            }
            if(div == 'tel'){
                $this.params.convTestRsltVal = '';
            }
            if(div == 'mhp'){
                $this.params.convTestRsltVal2 = '';
                if(!this.ValdUtil.valdLenNull($this.params.convTestOrgnVal2 , 1000  , '전환 값은')) return false;        
            }else{
                if(!this.ValdUtil.valdLenNull($this.params.convTestOrgnVal , 1000  , '전환 값은')) return false;     
            }

            let params                 = $this.$props.dataParams;
            params['convTestOrgnVal']  = $this.params.convTestOrgnVal;
            params['convTestOrgnVal2'] = $this.params.convTestOrgnVal2;
            params['tabDiv']           = $this.$props.tabDiv;
            params['mainEncVal']       = $this.$props.mainEncVal;
            if(this.ValdUtil.isNotNull(div)){
                params['divCd'] = div;
            }
            $this.doPost('/mng/obj/convRuleMng/shapeShiftCall.hb', params).then(function(res){
                if(res.data.rtnCd == '0000'){
                    if($this.ValdUtil.isNull(res.data.rtnData)){
                        $this.alert('올바른 형식의 값을 입력해주세요');
                        $this.params.convTestRsltVal = '';
                    }else{
                        if(ValdUtil.isNotNull(div)){
                            if(div == 'tel'){
                                $this.params.convTestRsltVal  = res.data.rtnData;
                            }
                            else if(div =='mhp'){
                                $this.params.convTestRsltVal2 = res.data.rtnData;
                            }
                            else if(div =='addr'){
                                if(res.data.rtnData.indexOf('@') > -1){
                                    let list = res.data.rtnData.split('@');
                                    $this.params.convTestRsltVal  = list[0];
                                    $this.params.convTestRsltVal2 = list[1] + " " + list[2];
                                }                                
                            }
                        } else {
                            $this.params.convTestRsltVal = res.data.rtnData;
                        }
                    }
                }else{
                    $this.alert(res.data.rtnMsg);
                }
            });
        }
        ,changeAge(div){
            if(div == 'Fr'){
                this.dataParams.ageFr = this.ValdUtil.onlyStayNum(this.dataParams.ageFr,20,99);
            }else{
                this.dataParams.ageTo = this.ValdUtil.onlyStayNum(this.dataParams.ageTo,this.dataParams.ageFr,99);
            }
            if(this.dataParams.ageFr > this.dataParams.ageTo){
                this.dataParams.ageTo = this.dataParams.ageFr;
            }
        }
        ,RrnoLinkYn(){
            if(this.$props.dataParams.rrnoLinkYn == 'N'){
                this.$props.dataParams.ageFr = 20;
                this.$props.dataParams.ageTo = 99;
            }
            if(this.$props.dataParams.rrnoLinkYn == 'Y'){
                this.$props.dataParams.ageFr = 0;
                this.$props.dataParams.ageTo = 0;
            }
        }
        ,rrnoSameYn(div){
            this.$emit('rrnoSameYn',this.$props.dataParams,div);
        }
        //데이터 리셋
        ,resetData(val){
            for(let key in val){
                val[key] = ''
            }
        }
        ,setConvTestVal(div,testVal){
            if(this.ValdUtil.isNull(this.params[div])){
                this.params[div] = testVal;
            }
        }
    }
    ,watch:{
        '$props.dataParams.ageMntnYn'(oldVal, newVal){
            if(newVal == 'Y'){
                this.$props.dataParams.ageFr = 20;
                this.$props.dataParams.ageTo = 99;
            }
            if(newVal == 'N'){
                this.$props.dataParams.ageFr = 0;
                this.$props.dataParams.ageTo = 0;
            }
            this.$emit('rrnoSameYn',this.$props.dataParams);
        }
    }
    ,mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>