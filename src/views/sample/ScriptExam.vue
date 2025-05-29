<template>
    <div>
        <div class= "btn">
            <button type="button" class="btn btn-w-m btn-primary" @click="searchData()"><span>조회</span></button>
        </div>
        <div class= "btn">
            <button type="button" class="btn btn-w-m btn-primary" @click="updateData()"><span>수정</span></button>
        </div>
        <div class= "btn">
            <button type="button" class="btn btn-w-m btn-primary" @click="insertData()"><span>등록</span></button>
        </div>
        <div class= "btn">
            <button type="button" class="btn btn-w-m btn-primary" @click="deleteData()"><span>삭제</span></button>
        </div>
        <div class= "btn">
            <button type="button" class="btn btn-w-m btn-primary" @click="downloadExcel()"><span>엑셀</span></button>
        </div>
    </div>
</template>

<script>

export default {
    data: function() {
		return {
            params:{
                userPwsd:'5678',
                userId:'test',               
            }
        }
    },
    methods: {
        init: function() {
         let $this = this;
        //  $this.search();
        },
        searchData(){
            let $this = this;
            let params = $this.params;
            $this.doPost('/smpl/selectListSmplData.hb', params).then(function(response) {
            });
        },
        updateData(){
            let $this = this;
            let params = $this.params;
            $this.doPost('/smpl/update.hb', params).then(function(response) {
            });
        },
        insertData(){
            let $this = this;
            let params = $this.params;
            $this.doPost('/smpl/insert.hb', params).then(function(response) {
            });
        },
        deleteData(){
            let $this = this;
            let params = $this.params;
            $this.doPost('/smpl/delete.hb', params).then(function(response) {
            });
        },
        downloadExcel(){
            let $this = this;
            let params = $this.params;
            $this.doDownExcel('/smpl/selectListSmplDataDownloadExcel.hb', params, '엑셀 다운로드.xlsx');
        },
    },
    updated: function () {
    
    },
    computed: {
    
    },
    watch: {
    
    },
    mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>

<style scoped>
.btn{display:inline-block}
</style>