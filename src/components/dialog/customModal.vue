<template>
    <div v-if="isVisible" class="popup_wrap">
        <div class="popup_box center" style="overflow: auto;">
            <a class="popup_close" @click="invisible">
                <i class="pi pi-times" style="font-size:24px;"></i>
            </a>
            <slot>
            </slot>
        </div>
    </div>
    
</template>

<script>

import { ref } from 'vue'

export default {
    name: 'CustomModal',
    props: {
        isOpen: {
            type: Boolean,
            default: false,
            require: false
        }
    },
    setup() {
        const isVisible = ref(false);

        // 부모 컴포넌트에서 접근하기 위한 함수를 선언합니다.
        const open = () => {
            isVisible.value = true;
        };

        const close = () => {
            isVisible.value = false;
        }

        // setup 함수에서 리턴해 주어야, 부모 컴포넌트에서 접근이 가능합니다.
        return {
            isVisible,
            open,
            close
        }
    },
    watch: {
        isOpen: function(val) {
            if ( val ) { 
                this.open();
            } else {
                this.close();
            }
        }
    },
    methods: {
        invisible: function() {
            this.$emit('close');
        }
    }
}
</script>
