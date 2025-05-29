<template>
    <div class="row">
        <div class="col-lg-12 mb-4">
            <div class="card shadow mb-4">

                <div class="card-header py-3">
                    <h6 class="m-0 font-weight-bold text-primary">파라미터 받는페이지</h6>
                </div>

                <div class="card-body">
                    <div class="mb-3">
                        {{$route.params.id}}
                    </div>
                    <div class="mb-3">
                        {{$route.params.name}}
                    </div>
                </div>

                <div class="card-body">
                    <div class="mb-3">
                        <input class="form-control" type="text" v-model="params.id" readonly/>
                    </div>
                    <div class="mb-3">
                        <input class="form-control" type="text" v-model="params.name" readonly/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import baseMixins from '@/views/mixins/baseMixins.vue'

export default {
    props: [
        'id', 'name'
    ],
    mixins: [baseMixins],
    data: function() {
        return {
            params: {
                id: '12351',
                name: '넌 누구냐'
            }
        }
    },
    methods: {
        init: function() {
            let $this = this;
            $this.initData();
        },
        initData: function() {
            let $this = this;
            $this.getId();
            $this.getName();
        },
        getId: function() {
            this.params.id = this.$route.params.id;
        },
        getName: function() { 
            this.params.name = this.$route.params.name;
        }
    },
    watch: {
        id: function(val) {
            console.log(val);
        },
        name: function(val) {
            console.log(val);
        }
    },
    computed: {
        
    },
    mounted: function() {
        this.init();
    }
}
</script>
