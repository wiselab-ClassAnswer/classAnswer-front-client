<template>
    <Modal ref="baseModal" :width="59">
        <div class="section-wrap">
            <h2>질의 - 응답 상세</h2>
            <div class="section-wrap">
                <div class="section-part part1">
                    <div class="c-wd-10 m-r-20 ib">
                        <div class="text-box m-b-5">
                            <span class="wd-50">질의</span>
                            <textarea class="c-wd-20" style="height: 110px;  resize:none;" v-model="params.qustCntn" disabled></textarea>
                        </div>

                        <div class="text-box">
                            <span class="wd-50">응답</span>
                            <textarea class="c-wd-20" style="height: 430px;  resize:none;" v-model="params.answCntn" disabled></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="button-box1 m-t-20">
            <button class="btn-normal" @click="cancel">확인</button>
        </div>
    </Modal>
</template>

<script>
/* global $ */
import { ref } from 'vue'
import Modal from '@/components/dialog/modal.vue'
import { ValdUtil } from '@/utils/ValdUtil';

export default {
    components: {
        Modal
    },
    
    props:{
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
            baseModal
           ,show
           ,cancel
        }
    },
    data() {
    },
    methods: {
        init(data) {
            const $this = this;
            if(ValdUtil.isNotNull(data)){
                $this.params = data;
            }
        },
    },
    mounted: function() {  
    },
}
</script>