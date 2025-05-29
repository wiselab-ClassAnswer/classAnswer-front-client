<template>
    <div v-if="isVisible" class="popup-mask">
        <div  class="popup-wrap">
            <div class="popup-container" :style="style">
                <slot>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>

import { ref } from 'vue'

export default {
    name: 'Modal',
    props: {
        width:{
            type: Number,
        }
    },
    setup() {
        const isVisible = ref(false);

        const open = () => {
            isVisible.value = true;
            document.body.classList.add("modal-open");
        };
        const close = () => {
            isVisible.value = false;
            document.body.classList.remove("modal-open");
        }
        return {
            isVisible,
            open,
            close
        }
    },computed:{
        style(){
            return {'--width' : this.width+'%'}
        }
    }
}
</script>
<style scoped>
.popup-container{
    width: var(--width);
}

</style>