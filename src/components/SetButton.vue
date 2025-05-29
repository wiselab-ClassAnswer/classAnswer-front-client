<template>
    <div class="btn-box" style="top:2px">
        <button v-show="showInit"   @click="onClick('init')">초기화</button>
        <button v-show="showSelect" @click="onClick('select')">조회</button>
        <button v-show="showSave"   @click="onClick('save')">저장</button>
        <button v-show="showDelete" @click="onClick('delete')">삭제</button>
        <button v-show="showTest"   @click="onClick('test')">테스트</button>
    </div>
</template>

<script>

export default {
    props: {
        showInit: {
            type: Boolean,
            default: true,
            require: false
        },
        showSelect: {
            type: Boolean,
            default: true,
            require: false
        },
        showSave: {
            type: Boolean,
            default: true,
            require: false
        },
        showDelete: {
            type: Boolean,
            default: true,
            require: false
        },
        showTest: {
            type: Boolean,
            default: false,
            require: false
        }

    },

    data() {

    },
    methods: {
        onInit() {
            this.$emit('onInit');
        },
        onClick(div) {
            this.$emit('onSetButtonClick', div);
        },
    },
    computed: {

    },
    
}
</script>
