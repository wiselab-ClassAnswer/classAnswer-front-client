<template>
    <div id="wrapper">

        <SideBarSlot>
            <template v-slot:sideBar>

            </template>
        </SideBarSlot>

        <div id="page-wrapper" class="gray-bg">

            <header>
                <HeaderSlot>
                    <template v-slot:header>

                    </template>
                </HeaderSlot>
            </header>

            <TopNavSlot>
                <template v-slot:topNav>

                </template>
            </TopNavSlot>

            <BodySlot>
                <template v-slot:body>

                </template>
            </BodySlot>

            <div class="footer-blank">&nbsp;</div>
            <footer>
                <FooterSlot>
                    <template v-slot:footer>
                        
                    </template>
                </FooterSlot>
            </footer>
        </div>
    </div>

    <div id="spinner">
        <Loading ref="loader"/>
    </div>
</template>

<script>

import '@/static/font-awesome/css/font-awesome.css'

// @ is an alias to /src
import SideBarSlot from '@/slot/sideBarSlot.vue'
import HeaderSlot  from '@/slot/headerSlot.vue'
import TopNavSlot  from '@/slot/topNavSlot.vue'
import BodySlot    from '@/slot/bodySlot.vue'
import FooterSlot  from '@/slot/footerSlot.vue'
import Loading     from '@/components/loading.vue'
import { ValdUtil } from '@/utils/ValdUtil.js'
import { SessionUtil } from '@/utils/SessionUtil.js'
import router from '@/router'

export default {
    components: {
        SideBarSlot,
        HeaderSlot,
        TopNavSlot,
        BodySlot,
        FooterSlot,
        Loading,
    },
    data: function() {
		return {
            interval: null
        }
    },
    methods: {
        init: function() {
            this.isLogin();
        },

        isLogin: function(){
            
            if( ValdUtil.isNotNull(SessionUtil.getUserId())){
                
            }
            else{
                router.push({name:'Login'});
            }
        },
        setTimer() {
            let $this = this;
            $this.interval = setInterval(()=>{
                if ( !$this.CmonUtil.isLoading() ) {
                    if ( this.$refs.loader != null ) {
                        $this.onDismissAlert();
                    }
                }
            }, 1000);
        },
        onDismissAlert() {

            if ( this.$refs.loader != null ) {
                this.$refs.loader.turnOff();    
                this.$refs.loader.dismiss();
                this.CmonUtil.processLoading(true);
                this.CmonUtil.processLoading(false);
                setTimeout(() => {
                    this.$refs.loader.turnOn();
                }, 100);
            }
        }
    },

    mounted: function() {
        let $this = this;
        $this.init();
        $this.setTimer();
        $this.emitter.on('onDismissAlert', () => { this.onDismissAlert() });
    },

    destroyed: function() {
        clearInterval(this.interval);
    }
}
</script>
