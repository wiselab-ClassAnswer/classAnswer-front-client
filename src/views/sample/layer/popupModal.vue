<template>
    <CustomModal ref="baseModal" :is-open="isOpen">
        <div class="modal-header">
            팝업 타이틀
        </div>

        <div class="modal-body">
            <!-- <slot name="dialog-body"> default body </slot> -->
            여기에는 뭔 내용을 넣을껍니다.
            {{sourceParams}}
        </div>

        <div class="modal-footer">
            <button class="modal-default-button" @click="close">닫기</button>
        </div>
    </CustomModal>
</template>

<script>

import CustomModal from '@/components/dialog/customModal.vue'

export default {
    components: {
        CustomModal
    },
    props: [
        'isOpen', 'sourceParams'
    ],
    data: function() {
        return {
        }
    },
    methods: {
        close: function() {
            // 부모 페이지의 @close에 매핑된 함수를 호출
            this.$emit('close');
        }
    }
}
</script>
