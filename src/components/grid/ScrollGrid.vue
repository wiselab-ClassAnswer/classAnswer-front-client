<template>
    
    <div :id="wrapperId">
        <table ref="gridObj" :id="gridId"></table>
        <div v-if="paging"  :id="pagerId"></div>
    </div>
    
</template>

<script>

import { ref, reactive } from 'vue'
import { GridUtil } from '@/utils/GridUtil'; 
import { ValdUtil } from '@/utils/ValdUtil'; 
import { CmonUtil } from '@/utils/CmonUtil';

export default {
    props: {
        paging: {
            type: Boolean,
            default: false
        },
        dataParams: {
            type: Object,
            default: {}
        },
        sortable: {
            type: Boolean,
            default: false
        },
    },
    setup(props, context) {

        let gridId    = reactive({});
        let pagerId   = reactive({});
        let wrapperId = reactive({});
        const gridObj = ref(null);
        
        let objectId = Math.random().toString(36);
        objectId = objectId.replaceAll('.','');
        gridId    = 'grid_list_' + objectId;
        pagerId   = 'pager_list_' + objectId;
        wrapperId = 'list_wrapper_' + objectId;

        return {
            gridObj,
            gridId,
            pagerId,
            wrapperId
        }
    },
    data: function() {
      return {
            url: '',
            params: {
                rowCount: 30,
                currentPage: 1,
                currentIndex: 0,
                totalCount:0,
                pagingYn: 'Y'
            },
            resTotalCount: 0,
        }
    },
    methods: {
        init: function(gridObj) {
            const $this = this;
            $this.url = gridObj.url;

            if(!this.$props.paging && this.$props.sortable){
                gridObj.colModels.forEach(col =>{Object.assign( col , {sortable:true});});
                gridObj.options.loadonce = true;
            }

            let options = $.extend(true, {}, GridUtil.gridScrollOptions(), {
                datatype: 'local',
                mtype: 'post',
                url: gridObj.url,
                colModel: gridObj.colModels,
                // height: 200,
            });
            //기타 옵션 추가
            $.extend(true, options, gridObj.options);

            options['pager'] = '#' + this.pagerId;
            options['onPaging'] = function(data) {
                GridUtil.onPagingCommon(data, this, function(response) {
                    $this.params.rowCount     = response.rowCount;
                    $this.params.currentPage  = response.currentPage;
                    $this.params.currentIndex = response.currentIndex;
                    $this.params.totalCount   = response.totalCount;
                    $this.selectList(false);
                })
            }
            options['height'] = gridObj.options.height ? gridObj.options.height : options['height'] - 30;
            
            $(this.$refs.gridObj).jqGrid(options);
            
            if (gridObj["options"] && gridObj["options"]["sortableRows"] == true) {
                $(this.$refs.gridObj).jqGrid('sortableRows', options);
            }
            GridUtil.resizeJqGridWidth(this.gridId, this.wrapperId);
        },

        getGridObj(){
            return  $(this.$refs.gridObj) ;
        },
        getGridId(){
            return  this.gridId ;
        },
        gridUnload: function() {            
            $.jgrid.gridUnload(this.gridId);
        },
        gridReload: function() {            
            $(this.$refs.gridObj).reload();
        },
        gridDestroy : function(){
            $.jgrid.gridDestroy(this.gridId);
        },
    
        clearGridData: function() {          
            $(this.$refs.gridObj).jqGrid('clearGridData');
        },

        remove: function() { 
            $(this.$refs.gridObj).remove();
        },

        reload: function(colModel) { 
            $(this.$refs.gridObj).jqGrid('setGridParam', colModel)
            $(this.$refs.gridObj).trigger("reloadGrid");
        },
        getTotalCount() {
            return this.resTotalCount;
        },
        selectList:function(isSearch, isAlert, isIgnoreLoading) {
            const $this = this;
            
            if(ValdUtil.isNull(isAlert)){
                isAlert = true;
            }
            if(ValdUtil.isNull(isIgnoreLoading)) {
                isIgnoreLoading = false;
            }
            let params = $this.$props.dataParams;

            if($this.url == null || $this.url == ''){
                $this.alert('url을 지정하지 않았습니다.');
                return false;
            }

            if(isSearch){
                $this.params.currentPage = 1;
                $this.params.currentIndex = 0;
            }

            $.extend(true, params, $this.params);
                
            if( CmonUtil.isLoading() && !isIgnoreLoading) {
                return false;
            }
            CmonUtil.processLoading(true);

            $($this.$refs.gridObj).setGridParam({
                datatype: "json",
                postData: $this.getData(),
                page: 1,
                serializeGridData: function(postData) {
                    let params = JSON.parse(postData);
                    params.currentPage = $this.params.currentPage;
                    params.currentIndex = $this.params.currentIndex;
                    return JSON.stringify(params);
                },
                loadComplete: function (response) {
                    
                    let rowCount     = response.rowCount;
                    let currentPage  = response.currentPage;
                    let currentIndex = response.currentIndex;
                    let totalCount   = response.totalCount;
                    let totalPage     = 0;
                    if ( totalCount > 0 ) {
                        totalPage = Math.floor(totalCount / rowCount) + 1;
                    }

                    if ( currentPage < totalPage ) {
                        currentPage = currentPage + 1;
                    }

                    currentIndex = (currentPage - 1) * rowCount;

                    $this.params.currentPage  = currentPage;
                    $this.params.currentIndex = currentIndex;

                    CmonUtil.processLoading(false);
                    $this.emitter.emit('onDismissAlert');
                    if (response.rtnCd == '0000') {
                        if ( response.rtnData.result == 0 && isAlert) {
                            // $this.alert('조회할 내용이 없습니다.');
                        }   
                    } else {
                        $this.alert(response.rtnMsg);
                    }
                },
                
            }).trigger("reloadGrid");
        },
        getData() {
            let params = this.$props.dataParams;
            $.extend(true, params, this.params);
            return JSON.stringify(params);
        },
        getSelectData(){
            const $this = this;
            var rowIdList = [];
            var rowValList = [];
            var i = 0;

            rowIdList = $($this.$refs.gridObj).jqGrid("getGridParam","selarrrow");
            
            if(rowIdList.length == 0){
                $this.alert('데이터를 선택 해주세요');
                return false;
            }  
            rowIdList.forEach(id => {
                rowValList[i] = $($this.$refs.gridObj).getRowData(id);
                rowValList[i]['rowMark'] = id;
                i = i+1;
            });
            this.$emit('getSelectData',rowValList);
        },
    
        /*
          rowValList : 리스트에 넣을 값
          isNotDupl  : 중복여부(null,true(불허), false(허용) )
        */
        
        setGridData(rowValList, isNotDupl){
            const $this = this;
            var rowIdList = [];
            var rowValList = rowValList;
            rowIdList = $($this.$refs.gridObj).jqGrid("getDataIDs");
            isNotDupl = isNotDupl.toString();
            
            if(ValdUtil.isNull(isNotDupl) || (ValdUtil.isNotNull(isNotDupl) && isNotDupl.indexOf('true') != -1)){
                if(!rowIdList.length == 0 ){
                    rowIdList.forEach(data => {    
                        rowValList = rowValList.filter(item => item.rowMark != data);
                    });
                }
            }
            
            rowValList.forEach(val => { 
                $($this.$refs.gridObj).jqGrid("addRowData", val.rowMark, val, 'last'); // 마지막 행에 Row 추가
            });      
        }
    },
    // watch: {
    //     'params.currentPage': function(nv, ov) {
    //         console.log(nv, ov);
    //     },
    //     'params.currentIndex': function(nv, ov) {
    //         console.log(nv, ov);
    //     }
    // },
    mounted: function() {
        let $this = this;
    }   
}
</script>