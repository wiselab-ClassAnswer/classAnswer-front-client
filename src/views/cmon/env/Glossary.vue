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
                        <label class="col-xs-1 control-label">검색어</label>
                        <div class="col-xs-2">
                            <input type="text" class="form-control" v-model="params.srchWord" v-on:keyup.enter="searchList(true)" ref="cursor">
                        </div>
                    </div>
                    <div class="form-group mg_none">
                        <div class="text-center">
                            <button class="btn btn-secondary">
                                <span class="glyphicon glyphicon-refresh"> 초기화</span>
                            </button>&nbsp;
                            <button type="button" class="btn btn-w-m btn-primary" v-on:click="searchList(true)"><span>조회</span></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 검색조건 영역 -->

        <!-- 결과 리스트 영역 -->
        <div class="ibox">
            <div class="ibox-content">
                <div class="form-group">
                    <div class="float_left">
                        <div class="ibox-title pd_none mg_top_10" style="min-height: 0px;">
                            <i class="fa fa-title-bar"></i>
                            <h5>단어 목록</h5>
                        </div>
                    </div>
                    <div class="clear_both"></div>
                </div>
                <div class="form-group">
                    <Grid ref="grid" :dataParams="params" :paging=false ></Grid>
                </div>
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
                srchWord: ''
            }
        }
    },
    methods: {
        init: function() {
            this.resetSearchParam();
            this.$refs.cursor.focus();
            this.initGrid();
        },
        searchList() {
            const $this = this;
            this.$refs.grid.selectList(true);
        },
        resetSearchParam(){
            const $this = this;
            $this.params = {
				srchWord: ''
            }
        },
         initGrid(){
            const $this = this;
            let GlossaryData={
                url : '/cmon/env/glossary/selectList.hb',
                colModels : [
                    {name:'krWord', label: '한글단어', width: 40 , align:'center'},
                    {name:'enAbbr', label: '영문약어', width: 20 , align:'center'},
                    {name:'enDesc', label: '영문설명', width: 150, align:'left'},
                ]       
            }
            $this.$refs.grid.init(GlossaryData);
        }
    },
    mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>
