<template>
    <v-select 
        v-model="selectedItem"
        :options="options" 
        :label="params.label"
        :placeholder="params.placeholder"   
        @search="resetData"
        @keydown.enter="resetData"
        ></v-select>
        <!-- @input="resetData" -->
        <!-- @keydown.enter="resetData" -->
</template>

<script>

export default {
    props: {
        // value: {
        //     type: [String, Number, Array, Object],
        //     default: null
        // },
        options: {
            type: [String, Number, Array, Object],
            default: null
        },
        label: {
            type: String,
            default: 'name'
        },
        placeholer: {
            type: String,
            default: 'holder'
        },
    },
    watch:{
        // options(o,n) {
        //     console.log(o, n);
        // },
        label(o,n) {
            console.log(o, n);
        },
        selectedItem(n,o) {

            this.$emit('onSelect', n);
            n = null;


        }
    },
    data() {
        return {
            selectedItem: null,
            params: {
                label: '',
                placeholer: '',
            }
        }
    },
    methods: {
        getParam: function() {
            this.params.label      = this.$props.label;
            this.params.placeholer = this.$props.placeholer;
        },
        resetData: function(){
            let $this = this;
            
            $this.selectedItem = null;
        }
    },
    mounted() {
        this.getParam();
    }
}
</script>

<style scoped>
@import 'vue-select/dist/vue-select.css';
</style>
