<template>
    <div v-cloak>
        <div>
            <h3>샘플메인</h3>
        </div>
        <div>
            <ul class="navi_list">
                <li><router-link to="/sample/datepicker" class="navi_home">달력</router-link></li>
                <li><router-link to="/sample/popLayer" class="navi_home">레이어팝업</router-link></li>
                <li><router-link to="/sample/progress" class="navi_home">Progress</router-link></li>
                <li><router-link to="/sample/chart" class="navi_home">차트</router-link></li>
                <li><router-link to="/sample/paging" class="navi_home">페이징</router-link></li>
                <li><router-link to="/sample/excel" class="navi_home">엑셀다운로드</router-link></li>
                <li><router-link to="/sample/pdf" class="navi_home">PDF다운로드</router-link></li>
                <li><router-link to="/sample/tree" class="navi_home">트리</router-link></li>
                <li><router-link to="/sample/upload" class="navi_home">파일업로드</router-link></li>
                <li><router-link to="/sample/parentWindPop" class="navi_home">윈도우팝업</router-link></li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    data: function() {
		return {
            
        }
    },
    methods: {
        init: function() {

        }
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
li {
   margin-left: 20px;
   margin-bottom: 10px; 
}
</style>