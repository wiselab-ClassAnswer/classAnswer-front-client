<template>
    <div>
        <Button @click="showLoad">로딩</Button>
    </div>
    https://www.npmjs.com/package/vue-loading-overlay
</template>

<script>

export default {
    data: function() {
		return {
            load: null
        }
    },
    methods: {
        init: function() {
            
        },
        showLoad: function() {
            this.load = this.$loading.show({
                container: null,
                // width: 100,
                // height: 100,
                loader: "bars",
                canCancel: true,
            });
        },
        hideLoad: function() {
            this.load.hide();
        }
    },
    updated: function () {
    
    },
    computed: {
    
    },
    watch: {
    
    },
    mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>
