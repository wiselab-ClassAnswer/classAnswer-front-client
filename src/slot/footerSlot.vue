<template>
    <slot name="footer">
        <div class="footer">
            ⓒ KOREA BANKING INSTITUTE. ALL RIGHTS RESERVED
        </div>
    </slot>
</template>

<script>

export default {
    components: {
    },
    data: function() {
        return {
            
        }
    },
    methods: {
        init: function() {

        },
    },
    mounted() {
        this.init();
    }
}
</script>
<style>
@import "@/assets/css/slot_footer.css";
</style>