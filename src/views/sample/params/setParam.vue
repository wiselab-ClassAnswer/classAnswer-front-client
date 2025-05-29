<template>
    <div class="row">
        <div class="col-lg-12 mb-4">
            <div class="card shadow mb-4">

                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">파라미터 전달페이지</h6>
                </div>

                <div class="card-body">
                    <button class="btn btn-primary" @click="gotoPage">페이지 이동</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import router from '@/router'
import baseMixins from '@/views/mixins/baseMixins.vue'

export default {
    mixins: [baseMixins],
    data: function() {
        return {
            params: {
                id: '111111',
                name: '김재현'
            }
        }
    },
    methods: {
        gotoPage: function() {
            // let url = 'http://127.0.0.1/sample/getParam/' + this.params.id + '/' + this.params.name;
            let url = 'http://10.0.2.2/sample/getParam/' + this.params.id + '/' + this.params.name;
            this.openWindowPopup(url);
        },
    },
    
}
</script>

<style>
</style>