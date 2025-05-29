<template>
    <div>
        팝업화면
    </div>
</template>
  
<script>
export default {
    props: ['userId'],
    data: function() {
        return {

        }
    },
    methods: {
        init: function() {
            // console.log('init:' + this.userId);
            let params = {
                'path': '12345'
            }
            this.doPost('/smpl/select.ms', params).then(function(response) {
                // console.log(response);
            });
        },
    },
    computed: {

    },
    mounted() {
        // console.log('popup screen mounted');
        this.init();
    }
}
</script>
