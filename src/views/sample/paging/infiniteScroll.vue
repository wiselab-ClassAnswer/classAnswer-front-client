<template>
    <div class='scrolling-component'>
        <div class="card shadow mb-4">
            <div class="card-header py-3">
                <input class="form-control" type="text" v-model="params.locNm" @keyup="searchEorgList" />
            </div>
            <div class="card-body">
                <div class="row mb-4 no-gutters align-items-center" v-for="eorgInfo in eorgList" :key="eorgInfo.locNo">
                    <div class="col mr-2">
                        <div class="h5 font-weight-bold text-primary text-uppercase mb-1">{{eorgInfo.locNm}}</div>
                        <div class="text-xs mb-0 font-weight-bold text-gray-800">{{eorgInfo.addrBase}} {{eorgInfo.addrSpec}}</div>
                    </div>
                </div>
                <InfiniteLoad :identifier="paging.infiniteId" @infinite="searchEorgList">
                    <template #complete>
                    <div>
                        <p>더 이상 안보여 줍니다.</p>
                    </div>
                </template>
                </InfiniteLoad>
            </div>
        </div>
    </div>
</template>

<script>

import InfiniteLoad from '@/components/infiniteLoad.vue'

import baseMixins from '@/views/mixins/baseMixins.vue'

export default {
    mixins: [baseMixins],
    components: {
        InfiniteLoad
    },
    data() {
        return {
            params: {
                plcCd: '',
                locNm: ''
            },
            eorgList: []
        }
    },
    methods: {
        searchEorgList: function(state) {

            let $this = this;

            $this.paging.currentPageNo = $this.paging.currentPageNo + 1;

            const params = _.extend({}, $this.params, $this.paging);

            $this.doPost({
                url: '/stdt/searchEorgList.ab',
                param: params,
                success: function(response) {
                    const list = response.rtnData;
                    if ( !!list && list.length > 0 ) {
                        _.forEach(list, function(data) {
                            $this.eorgList.push(data);
                        });
                    }

                    if ( !!list && list.length === $this.paging.rowCount ) {
                        state.loaded();
                    } else {
                        state.complete();
                    }
                },
                error: function(msg) {
                    $this.alert(msg);
                }
            });
        },

    },
    mounted: function() {
        
    }
}
</script>
