<template>
    <div class="vld-parent" v-if="isVisible">
        <Loading 
            ref="loaderObj"
            :active="isLoad"
            :can-cancel="false"
            :on-cancel="onCancel"
            :is-full-page="fullPage" 
            :loader="loader">
        </Loading>
    </div>
</template>

<script>

// Import component
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

export default {
    components: {
        Loading
    },
    data() {
        return {
            isLoading: true,
            fullPage: true,
            container: null,
            loader: "bars",
            isVisible: true
        }
    },
    methods: {
        onCancel() {
            console.log('User cancelled the loader.')
        },
        dismiss() {
            if ( this.$refs.loaderObj != null ) {
                this.$refs.loaderObj.hide();
            }
        },
        turnOff() {
            this.isVisible = false;
        },
        turnOn() {
            this.isVisible = true;
        }
    },
    computed: {
        isLoad() {
            return this.$store.getters.showLoading;
        }
    }
}
</script>