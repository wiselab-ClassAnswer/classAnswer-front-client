<template>

    <div id="wrapper">
    </div>
    <BodySlot>
        <template v-slot:body>

        </template>
    </BodySlot>
    
	<!-- Common Script -->

</template>

<script>
import '@/static/font-awesome/css/font-awesome.css'

import BodySlot from '@/popup/slot/BodySlot.vue'

export default {
    components: {
        BodySlot,
    },
    data: function() {
        return {

        }
    },
    methods: {
        init: function() {

        },
    },
    computed: {

    },
    mounted() {
        // console.log('popup app mounted');
        this.init();
    }
}
</script>