<template>
    <div>메인페이지</div>
</template>

<script>
import { SessionUtil } from '@/utils/SessionUtil';

export default {

    data: function() {
		return {

        }
    },
    methods: {
        init: function() {
            let $this = this;
            // console.log('main');
        },
      
    },

    mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>
