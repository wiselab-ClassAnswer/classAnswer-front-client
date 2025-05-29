<template>
    <div class="wrapper-content">
        <!-- 검색조건 영역 -->
        <div class="ibox m-b-sm">
            <div class="ibox-title">
                <i class="fa fa-title-bar"></i>
                <h5>검색조건</h5>
                <div class="ibox-tools">
                    <a class="collapse-link">
                        <i class="fa fa-chevron-up"></i>
                    </a>
                </div>
            </div>
            <div class="ibox-content">
                <div class="form-horizontal">
                    <div class="form-group">
                        <div class="clear_both"></div>
                        <label class="col-xs-1 control-label">메뉴번호</label>
                        <div class="col-xs-2">
                            <input type="text" class="form-control" v-model="params.menuNo" v-on:keyup.enter="searchList(true)">
                        </div>
                        <label class="col-xs-1 control-label">메뉴명</label>
                        <div class="col-xs-2">
                            <input type="text" class="form-control" v-model="params.menuNm" v-on:keyup.enter="searchList(true)">
                        </div>
                        <label class="col-xs-1 control-label">상위메뉴번호</label>
                        <div class="col-xs-2">
                            <input type="text" class="form-control" v-model="params.upperMenuNo" v-on:keyup.enter="searchList(true)">
                        </div>
                    </div>
                    <div class="form-group mgNone">
                        <div class="text-center">
                            <button class="btn btn-secondary" @click="resetSearchParam()" type="button">
                                <span class="glyphicon glyphicon-refresh"> 초기화</span>
                            </button>&nbsp;
                            <button type="button" class="btn btn-w-m btn-primary" @click="searchList()"><span>조회</span></button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <Grid ref="grid" :dataParams="params" :paging=true></Grid>
            </div>
        </div>
    </div>
</template>

<script>

import Grid from '@/components/grid/Grid.vue'

export default {
    components: {
        Grid
    },
    data: function() {
      return {
            params: {
                menuNo: '',
                menuNm: '',
                upperMenuNo:'',
            },
        }
    },
    methods: {
        init() {
            const $this = this;
            $this.initGrid();
            $this.searchList();
        },

        initGrid() {            
            let gridObj = {
                url: '/smpl/selectListPagingGridData.hb',
                colModels: [
                    {name:'menuNo'      ,label: '메뉴번호'     , width: 50, align:'center'},
                    {name:'upprMenuNo'  ,label: '상위메뉴번호'  , width: 50, align:'center'},
                    {name:'menuUrl'     ,label: '메뉴url'      , width: 50, align:'left'},
                    {name:'menuNm'      ,label: '메뉴명'       , width: 50, align:'center'},
                    {name:'menuDesc'    ,label: '메뉴설명'     , width: 50, align:'left'},
                    {name:'iconInfo'    ,label: '아이콘정보'   , width: 50, align:'center'},
                    {name:'useYn'       ,label: '사용여부'     , width: 50, align:'center'},
                    {name:'sortSeq'     ,label: '정렬순번'     , width: 50, align:'center'},
                    {name:'regiDt'      ,label: '등록일자'     , width: 50, align:'center'},
                    {name:'regiTm'      ,label: '등록시각'     , width: 50, align:'center'},
                    {name:'regiUserId'  ,label: '등록사용자ID' , width: 50, align:'center'},
                    {name:'updtDt'      ,label: '수정일자'     , width: 50, align:'center'},
                    {name:'updtTm'      ,label: '수정시각'     , width: 50, align:'center'},
                    {name:'updtUserId'  ,label: '수정사용자ID' , width: 50, align:'center'},
                ],
                options: {
                },
            };
            this.$refs.grid.init(gridObj);
        },

        searchList() {
            const $this = this;
            this.$refs.grid.selectList(true);
        },
        resetSearchParam(){
            const $this = this;
            $this.params = {
				userId: '',
		    	userNm: '',
            }
        }

    },
    updated: function () {
    
    },
    computed: {
    
    },
    watch: {
    
    },
    mounted: function() {
        const $this = this;
        $this.init();
    }   
}
</script>