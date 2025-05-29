<template>
    <slot name="header">
        <!--
        <div>HEADER</div>
        -->
    </slot>
</template>

<script>

export default {
    data: function() {
        return {

        }
    },
    methods: {
        init: function() {
//            let $this = this;
        }
    },
    mounted: function() {
        let $this = this;
        $this.init();
    },
}
</script>