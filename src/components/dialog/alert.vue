<template>
    <Modal ref="baseModal" :is-open="isOpen">

        <div class="head">
            {{alertTitle}}
        </div>

        <div class="mainText">
            <pre class="contentFont">{{alertContent}}</pre>
        </div>

        <div class="buttonContainer marginTop35">
            <ul>
                <li>
                    <div class="buttonType1" @click="close">확인</div>
                </li>
            </ul>
        </div>
        
    </Modal>
</template>

<script>

import * as types from '@/store/mutation-types'
import { ref } from 'vue'
import Modal from '@/components/dialog/modal.vue'

export default {
    name: "alert-dialog",
    components: {
        Modal
    },
    setup() {
        
        // 자식 컴포넌트를 핸들링하기 위한 ref
        const baseModal = ref(null);

        const show = () => {
            // baseModal을 컨트롤 합니다.
            baseModal.value.open();
        };

        // const close = () => {
        //     baseModal.value.close();
        // };

        return {
            baseModal,
            show,
            // close
        }
    },
    computed: {
        isOpen() {
            if ( this.$store.getters.alertDialog ) {
                // this.$refs.baseModal.open();
                return true;
            } else {
                return false;
            }
        },
        alertTitle() {
            if ( this.$store.getters.alertTitle ) {
                return this.$store.getters.alertTitle;
            } else {
                return '알림';
            }
        },
        alertContent() {
            return this.$store.getters.alertContent;
        }
    },
    methods: {
        close: function() {
            this.$store.commit(types.ALERT_DIALOG, false);
            // this.$refs.baseModal.close();
        }
    }
}
</script>

<style scoped>
.contentFont {
    font-family: "Noto Sans KR", sans-serif;
}
</style>