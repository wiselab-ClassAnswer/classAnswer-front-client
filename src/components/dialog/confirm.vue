<template>
    <Modal ref="baseModal" :is-open="isOpen">

        <div class="head">
            {{confirmTitle}}
        </div>

        <div class="mainText">
            <pre class="contentFont">{{confirmContent}}</pre>
        </div>

        <div class="buttonContainer marginTop35">
            <ul>
                <li v-if="confirmNoVisible">
                    <div class="buttonType2" @click="cancel">{{confirmNoText}}</div>
                </li>
                <li v-if="confirmYesVisible">
                    <div class="buttonType1" @click="confirm">{{confirmYesText}}</div>
                </li>
            </ul>
        </div>
        
    </Modal>
</template>
<script>

import { ref } from 'vue'
import * as types from '@/store/mutation-types'
import Modal from '@/components/dialog/modal.vue'

export default {
    name: "confirm-dialog",
    components: {
        Modal
    },
    
    setup() {
        
        // 자식 컴포넌트를 핸들링하기 위한 ref
        const baseModal = ref(null);

        // Promise 객체를 핸들링하기 위한 ref
        const resolvePromise = ref(null);

        const show = () => {
            // baseModal을 컨트롤 합니다.
            baseModal.value.open();

            // Promise 객체를 사용하여, 현재 모달에서 확인 / 취소의 응답이 돌아가기 전까지 작업을 기다리게 할 수 있습니다.
            return new Promise((resolve) => {
                // resolve 함수를 담아 외부에서 사용합니다.
                resolvePromise.value = resolve;
            });
        };

        const confirm = () => {
            baseModal.value.close();
            resolvePromise.value(true);
        };

        const cancel = () => {
            baseModal.value.close();
            resolvePromise.value(false);
        };

        return {
            baseModal,
            show,
            confirm,
            cancel
        }
    },
    data() {
        return {
            isVisible : this.$store.getters.confirmDialog
        }
    },
    methods: {

    },
    computed: {
        isOpen() {
            let $this = this;
            const flag        = $this.$store.getters.confirmDialog;
            const yesCallback = $this.$store.getters.confirmYesCallback;
            const noCallback  = $this.$store.getters.confirmNoCallback;
            
            if ( flag ) {
                this.show()
                .then(function(res) {
                    if ( res ) {
                        if ( yesCallback != undefined && yesCallback != null && typeof yesCallback === 'function' ) {
                            yesCallback();
                        }
                    } else {
                        if ( noCallback != undefined && noCallback != null && typeof noCallback === 'function' ) {
                            noCallback();
                        }
                    }

                    $this.$store.commit(types.CONFIRM_DIALOG, false);
                });

            }
            
            return flag;
        },
        confirmTitle() {
            return this.$store.getters.confirmTitle;
        },
        confirmContent() {
            return this.$store.getters.confirmContent;
        },
        confirmYesText() {
            return this.$store.getters.confirmYesText;
        },
        confirmNoText() {
            return this.$store.getters.confirmNoText;
        },
        confirmYesVisible() {
            return this.$store.getters.confirmYesVisible;
        },
        confirmNoVisible() {
            return this.$store.getters.confirmNoVisible;
        }
    },
    watch : {
        visible() {
            // console.log('confirm : ' + this.visible);
            // this.show();
            // if ( val ) {
            //     this.$refs.baseModal.show();
            // } else {
            //     this.$refs.baseModal.close();
            // }
        },
        isVisible : function(val) {
            // console.log(val);
        }
    },
    beforeUnmount: function() {
        // this.$refs.baseModal.close();
    },
    mounted: function() {
        
    }
}
</script>
<style scoped>
.contentFont {
    font-family: "Noto Sans KR", sans-serif;
}
</style>