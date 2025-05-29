<template>
   <Modal ref="baseModal" :width="40">        
        <div class="section-wrap">
            <h2 class="ib">비밀번호 변경</h2>
            <div class="w-70 f-r ib">
                <span class="f-r" style=" font-size:12px !important; color:red !important;">{{params.chckDivCntn}}</span>
            </div>
            <div class="section-wrap">
                <div class="section-part part1">
                    <div class="w-100 m-b-10">
                        <div class="w-50 ib">
                            <span class="wd-80">사용자ID</span>
                            <input class="c-wd-80" type="text" v-model="params.userId" disabled>
                        </div>
                        <div class="w-50 ib">
                            <span class="wd-80 t-a-r">사용자명</span>
                            <input class="c-wd-80" type="text" v-model="params.userNm" disabled>
                        </div>
                    </div>
                    <div class="w-100">
                        <div class="w-50 ib">
                            <span class="wd-80">비밀번호</span>
                            <input class="c-wd-80" type="password" autocomplete="off" maxlength="20" v-model="params.userPwsd">
                        </div>
                        <div class="w-50 ib">
                            <span class="wd-80 t-a-r">비밀번호 확인</span>
                            <input class="c-wd-80" type="password" autocomplete="off" maxlength="20" v-model="params.userPwsdCnfm">
                        </div>
                    </div>
                </div>
            </div>
       </div>
       <div class="button-box1 m-t-20">
            <button class="btn-normal m-r-5" @click="updateChngPwsd">비밀번호 변경</button>
            <button class="btn-normal"  @click="cancel">닫기</button>
        </div>
    </Modal>
</template>

<script>

import { ref }        from 'vue'; 
import Modal          from '@/components/dialog/modal.vue';
import Grid           from '@/components/grid/Grid.vue';
import { ValdUtil }   from '@/utils/ValdUtil'
import { CmonUtil }   from '@/utils/CmonUtil'

export default {
    name: "confirm-dialog",
    components: {
        Modal,
        Grid
    },
    props:{
        dataParams:{
            type: Object,
            default:{}
        }  
    },
    setup() {  
        const baseModal = ref(null);

        const show = () => {
            baseModal.value.open();
        }
        const cancel = () => {
            baseModal.value.close();
        }

        return {
            baseModal,
            show,           
            cancel
        }
    },
    data: function() {
        return {
            params : {
                userId       : '',
                userNm       : '',
                userPwsd     : '',
                userPwsdCnfm : '',
                chckDivCntn  : '',
            }
        }
    },
    methods: {
        init() {
            const $this = this;
            $this.initData(); 
        },
        initData(data){
            const $this = this;
            $this.params = {
                userId       : '',
                userNm       : '',
                userPwsd     : '',
                userPwsdCnfm : '',
                chckDivCntn  : '',
            }
            if(ValdUtil.isNotNull(data)){
                $this.params.userId = data.userId;
                $this.params.userNm = data.userNm;
            }
        },
        updateChngPwsd(){
            const $this = this;

            if((ValdUtil.isNotNull($this.params.userPwsd)) && (ValdUtil.isNotNull($this.params.userPwsdCnfm))){
                if( CmonUtil.getBytesUTF8($this.params.userPwsd) > 20 ){
                    $this.params.chckDivCntn = '※ 비밀번호는 최대 20자리 입니다.';
                    return false;
                }
                if( CmonUtil.getBytesUTF8($this.params.userPwsdCnfm) > 20 ){
                    $this.params.chckDivCntn = '※ 비밀번호는 최대 20자리 입니다.';
                    return false;
                }
                if($this.params.userPwsd === $this.params.userPwsdCnfm){
                    $this.params.chckDivCntn = '';
                    let params = _.cloneDeep($this.params);
                    $this.doPost('/cmon/env/userMng/updateChngPwsd.hb',params).then(function (res) {
                        let result = res.data;
                        if (result.rtnCd == '0000') {
                            $this.succChng();
                        } else {
                            $this.alert(result.rtnMsg);
                        }
                    })
                } else {
                    $this.params.chckDivCntn = '※ 입력한 비밀번호와 비밀번호 확인이 일치하지 않습니다.';
                    return false;
                }
            } else {
                $this.params.chckDivCntn = '※ 비밀번호 또는 비밀번호 확인이 입력되지 않았습니다.';
                return false;
            }
        },
        succChng(){
            const $this = this;
            $this.cancel();
            $this.alert("변경되었습니다.");
        },
    }
}
</script>
