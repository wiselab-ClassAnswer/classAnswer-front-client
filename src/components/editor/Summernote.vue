<template>
    <div class="c-wd-90" ref="summernoteRefElement"></div>
</template>

<script>

import '@/static/plugins/summernote-0.8.18-dist/summernote-lite.js'
import '@/static/plugins/summernote-0.8.18-dist/summernote-lite.css'
import events from "./events";

if ( !window.SUMMERNOTE_DEFAULT_CONFIGS ) {
    window.SUMMERNOTE_DEFAULT_CONFIGS = {
        height: 200,
        minHeight: null,
        maxHeight: null,
        focus: true,
        toolbar: [
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul','ol','paragraph']],
            ['height', ['height']],
            ['table', ['table']],
            ['Insert', ['picture']],
            ['Mics',['codeview']]
        ]
    };
}

export default {
    props: {
        modelValue: {
            default: null,
            required: true,
            event: "change",
            validator(value) {
                return (
                    value === null || typeof value === "string" || value instanceof String
                );
            },
        },
        // https://summernote.org/deep-dive/
        config: {
            type: Object,
            default: () => window.SUMMERNOTE_DEFAULT_CONFIGS,
        },
    },
    data() {
        return {
            elem: null,
        };
    },
    methods: {init() {
            this.elem = $(this.$refs.summernoteRefElement);
            this.elem.summernote(this.config);
            $(this.elem).on("summernote.change", this.onChange);
            if (this.modelValue) {
                $(this.elem).summernote("code", this.modelValue);
            }
            this.registerEvents();
        },
        onChange(event) {
            const value = $(this.elem).summernote("code");
            this.$emit("update:modelValue", value);
        },
        registerEvents() {
            for (var realName in events) {
                this.elem.on(`${realName}`, (...args) => {
                    this.$emit(`${events[realName]}`, ...args);
                });
            }
        },
    },
    watch: {
        modelValue(newValue) {
            const currValue = $(this.elem).summernote("code");
            if (newValue != currValue) {
                $(this.elem).summernote("code", newValue);
            }
        },
    },
    /**
     * Free up memory
     */
    beforeUnmount() {
        if (this.elem) {
            this.elem.summernote("destroy");
            this.elem = null;
        }
    },
    mounted() {
        this.init();
    },
}
</script>

<style scoped>
button {
    width: auto !important;
}
.note-btn {
    display: inline-block;
    font-weight: 400;
    margin-bottom: 0;
    text-align: center;
    vertical-align: middle;
    touch-action: manipulation;
    cursor: pointer;
    background-image: none;
    border: 1px solid #dae0e5;
    white-space: nowrap;
    outline: 0;
    color: #333;
    background-color: #fff;
    border-color: #dae0e5;
    padding: 5px 10px;
    font-size: 14px;
    line-height: 1.4;
    border-radius: 3px;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
}

</style>
