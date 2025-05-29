<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>

import '@/static/css/bootstrap.css'
import '@/static/css/style.css'
import '@/static/css/index.css'
import '@/static/css/web.css'
import "@/assets/css/common.css"
import "@/assets/css/content/common_content.css"
import "@/assets/css/content/jqGrid_mod.css"
import "@/assets/css/login.css"
import '@/static/css/plugins/jqGrid/ui.jqgrid.css'

export default {

    data: function() {
        return {

        }
    },
    methods: {
        init: function() {
//            let $this = this;
//            if ( !!SessionUtil.getUserInfo() ) {
//                $this.$store.commit(types.USER_ID, SessionUtil.getUserInfo().userId);
//                $this.$store.commit(types.USER_NM, SessionUtil.getUserInfo().empNm);
//                $this.$store.commit(types.ROLE_CD, SessionUtil.getUserInfo().roleCd);
//            }

            
        },
    },
    computed: {

    },
    mounted() {
        this.init();
    }
}
</script>
