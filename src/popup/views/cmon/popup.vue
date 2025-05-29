<template>

    <div id="wrapper">
        팝업메인
        
    </div>
    <BodySlot>
        <template v-slot:body>

        </template>
    </BodySlot>
    
    <div id="spinner">
        
    </div>
	<!-- Common Script -->

</template>

<script>

export default {
    props: ['pageId'],
    data: function() {
        return {

        }
    },
    methods: {
        init: function() {
            // console.log('init:' + this.pageId);
            // console.log('para:' + this.$route);
            // defineAsyncComponent(() => import('@/views' + menu.menuUrl + '.vue'))
        },
    },
    computed: {

    },
    mounted() {
        // console.log('popup mounted');
        this.init();
    }
}
</script>