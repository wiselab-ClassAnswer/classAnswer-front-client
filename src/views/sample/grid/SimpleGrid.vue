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
                        <label class="col-xs-1 control-label">사용자ID</label>
                        <div class="col-xs-2">
                            <input type="text" class="form-control" v-model="params.userId" v-on:keyup.enter="searchList(true)" autofocus="true"/>
                        </div>
                        <label class="col-xs-1 control-label">사용자명</label>
                        <div class="col-xs-2">
                            <input type="text" class="form-control" v-model="params.userNm" v-on:keyup.enter="searchList(true)">
                        </div>
                    </div>
                    <div class="form-group mg_none">
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
                <!-- <Grid ref="grid" :url="url" :dataParams="params" :paging=false></Grid> -->
                <Grid ref="grid" :dataParams="params" :paging=false></Grid>
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
                userId: '',
                userNm: '',
            },
        }
    },
    methods: {
        init() {
            const $this = this;
            $this.initGrid();
            $this.searchList()
        },

        initGrid() {   
            let gridObj = {
                url: '/smpl/selectListSmplData.hb',
                colModels : [
                    {name:'userId'     , label: '사용자ID'    , width: 50, align:'center'},
                    {name:'userNm'     , label: '사용자명'    , width: 50, align:'center'},
                    {name:'empNo'      , label: '사원번호'    , width: 50, align:'center'},
                    {name:'regiDt'     , label: '등록일자'    , width: 50, align:'center'},
                    {name:'regiTm'     , label: '등록시각'    , width: 50, align:'center'},                
                    {name:'regiUserId' , label: '등록사용자ID', width: 50, align:'center', formatter: function() {         
                            return '<img class="imgBtn" src="/btn_confirm_enable.png"/>';                        
                        }
                    },                    
                ],
                options : {
                    onSelectRow : function(rowid , val , e){
                        const $this = this;
                    }
               },
            };
            this.$refs.grid.init(gridObj);
        },

        searchList() {
            const $this = this;
            $this.$refs.grid.selectList();
        },

        resetSearchParam(){
            const $this = this;
            $this.params = {
				userId: '',
		    	userNm: '',
            }
        }

    },
    mounted: function() {
        const $this = this;
        $this.init();
    }   
}
</script>
<style>
.imgBtn{
    width:5%;
}
</style>