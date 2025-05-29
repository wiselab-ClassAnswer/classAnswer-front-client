<template>
    <div class="inner" id="naviBarConts">
        <ul class="navi_list">
            <li><router-link to="/home" class="navi_home">홈</li>
            <li><router-link to="/sample/main" class="navi_home">샘플</li>
            <li><router-link to="/map/hist" class="navi_home">지도클릭</li>
            <li><router-link to="/login" class="navi_home">로그인</li>
            <li><router-link to="/accnt/signUpMember" class="navi_home">회원가입</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'naviBar',
    methods: {
        init: function() {
            console.log($('.hello h1').text());
        }
    },
    mounted: function() {
        this.init();
    }
}
</script>