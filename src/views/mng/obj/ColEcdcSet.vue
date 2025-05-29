<template>
    <Modal ref="baseModal" :width="30">
        <div class="section-wrap">
            <h2>컬럼정보</h2>
            <div class="section-part part1">
                <div class="w-100">
                    <div class="ib w-100">
                        <div class="wd-100 ib">
                            <span class="w-100">DB연결ID</span>
                        </div>
                        <div class="c-wd-90 ib">
                            <input class="w-100" type="text" :value="dataParams.rowData.dbConnId" disabled>
                        </div>
                    </div>
                </div>
                <div class="w-100">
                    <div class="ib w-100">
                        <div class="wd-100 ib">
                            <span class="w-100">스키마ID</span>
                        </div>
                        <div class="c-wd-90 ib">
                            <input class="w-100" type="text" :value="dataParams.rowData.schId" disabled>
                        </div>
                    </div>
                </div>
                <div class="w-100">
                    <div class="ib w-50">
                        <div class="wd-100 ib">
                            <span class="w-100">테이블</span>
                        </div>
                        <div class="c-wd-90 ib">
                            <input class="w-100" type="text" :value="dataParams.rowData.tblId" disabled>
                        </div>
                    </div>
                    <div class="ib w-50">
                        <div class="w-100">
                            <input class="w-100" type="text" :value="dataParams.rowData.tblNm" disabled>
                        </div>
                    </div>
                </div>
                <div class="w-100">
                    <div class="ib w-50">
                        <div class="wd-100 ib">
                            <span class="w-100">컬럼</span>
                        </div>
                        <div class="c-wd-90 ib">
                            <input class="w-100" type="text" :value="dataParams.rowData.colId" disabled>
                        </div>
                    </div>
                    <div class="ib w-50">
                        <div class="w-100">
                            <input class="w-100" type="text" :value="dataParams.rowData.colNm" disabled>
                        </div>
                    </div>
                </div>
            </div>
            <h2 class="m-t-20">암복호화 설정</h2>
            <div class="section-part part1">
                <div class="w-100">
                    <div class="ib w-100">
                        <div class="wd-100 ib">
                            <span class="w-100">암복호화 여부</span>
                        </div>
                        <div class="c-wd-90 radio-container ib">
                            <label value="Y" class="w-10 m-r-0">
                                <input class="ib c-wd-10 p-rl" style="top:3px; height:auto;" type="radio" v-model="params.ecdcYn" value="Y"/>
                                <span class="wd-10">예</span>
                            </label>
                            <label value="N" class="w-20">
                                <input class="ib c-wd-40 p-rl" style="top:3px; left:4px; height:auto;" type="radio" v-model="params.ecdcYn" value="N" />
                                <span class="wd-40 m-r-0">아니오</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="w-100 m-t-10">
                    <div class="wd-100 ib">
                        <span class="w-100">암복호화 방식</span>
                    </div>
                    <div class="c-wd-90 radio-container ib">
                        <label v-for="el in code.ecdcMethCdList" :value="el.cdVal" :key="el" class="w-10 m-r-10">
                            <input class="ib c-wd-10 p-rl" style="top:3px; height:auto;" type="radio" v-model="params.ecdcMethCd" :value="el.cdVal" :disabled="params.ecdcYn=='N'"/>
                            <span class="wd-10">{{el.cdVal}}</span>
                        </label>
                    </div>
                </div>
                <div class="w-100 m-t-8">
                    <div class="wd-100 ib">
                        <span :class="params.ecdcYn=='N'? 'w-100' :'essn w-100'">암호화 형식</span>
                    </div>
                    <div class="c-wd-90 ib">
                        <input class="w-100" type="text" v-model="params.encForm" :disabled="params.ecdcYn=='N'">
                    </div>
                </div>
                <div class="w-100">
                    <div class="wd-100 ib">
                        <span :class="params.ecdcYn=='N'? 'w-100' :'essn w-100'">복호화 형식</span>
                    </div>
                    <div class="c-wd-90 ib">
                        <input class="w-100" type="text" v-model="params.decForm" :disabled="params.ecdcYn=='N'">
                    </div>
                </div>
            </div>
        </div>
        <div class="button-box1 m-t-20">
            <button class="btn-normal m-r-5" @click="saveColEcdcSet()">저장</button>
            <button class="btn-normal" @click="cancel">닫기</button>
        </div>
    </Modal>
</template>
<script>
import { ref,inject,reactive } from 'vue'
import {ValdUtil             } from '@/utils/ValdUtil.js'
import Modal from '@/components/dialog/modal.vue'

export default {
    name: "confirm-dialog",
    components: {
        Modal
    }
    ,props:{
      dataParams:{
        type: Object,
        default:{}
      }  
    }
   ,setup() {
        const getCmonCdList = inject('getCmonCdList');

        //전환상태조회
        let code = reactive({
            ecdcMethCdList: []
        });
        getCmonCdList('ECDC_METH_CD', code.ecdcMethCdList, 'N', null);
        
        const baseModal = ref(null);

        const show = () => {
            baseModal.value.open();
        }
        const cancel = () => {
            baseModal.value.close();
        }
        return {
            baseModal
           ,show
           ,cancel
           ,code
        }
    }
    ,data() {
        return {
            params:{
                ecdcYn:''      //암복호화여부
                ,ecdcMethCd:'' //암복호화방식
                ,encForm:''    //암호화형식
                ,decForm:''    //복호화형식
            }
            ,orgnData :{}
        }
    }
    ,methods: {
        init(){
            this.initData();
        }
        ,initData(){
            this.orgnData = this.$props.dataParams.rowData;
            this.params.ecdcYn     = this.$props.dataParams.rowData.ecdcYn;
            this.params.ecdcMethCd = this.$props.dataParams.rowData.ecdcMethCd;
            this.params.encForm    = this.$props.dataParams.rowData.encForm;   
            this.params.decForm    = this.$props.dataParams.rowData.decForm;   
            if(ValdUtil.isNull(this.params.ecdcYn)){
                this.params.ecdcYn = 'Y'
            }
            if(ValdUtil.isNull(this.params.ecdcMethCd)){
                this.params.ecdcMethCd = 'SQL'
            }
            
        }
        ,async saveColEcdcSet(){
            const $this = this;
            if(this.params.ecdcYn =='Y'){

                if(!ValdUtil.valdLenNull(this.params.encForm,256,'암호화형식은')){
                    return false;
                }
                if(!ValdUtil.valdLenNull(this.params.decForm,256,'복호화형식은')){
                    return false;
                }
            }
           
            $this.confirm({
                content: '저장 하시겠습니까?'
                ,callback: {
                    yes: function () {
                        let params = _.extend({}, $this.$props.dataParams.rowData, $this.params);
                        $this.doPost("/mng/obj/colEcdcSet/updateConvMappObj.hb", params).then(function(res){                        
                            if(res.data.rtnCd =='0000'){
                                $this.alert('저장되었습니다').then((result) =>{
                                    if( result.isConfirmed){
                                        $this.$emit('research','save');
                                        $this.cancel();
                                    }
                                });
                            }else{
                                $this.alert(res.data.rtnMsg);                        
                            }
                        });
                    }
                }
            });
        }
        ,saveValid(){
            if(this.params.ecdcYn =='Y'){
                ValdUtil.valdLenNull(this.params.encForm,100,'암호화형식은');
            }
        }
    }
    ,mounted(){
        const $this = this;
        $this.init();
   }
}
</script>