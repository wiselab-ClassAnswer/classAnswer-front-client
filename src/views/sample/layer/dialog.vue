<template>
    <div id="dialogPage">
        <div id="sample">
            <button @click="showPopup(1)">팝업창 1번 열기</button>
            <br>
            <br>
            <button @click="showPopup(2)">팝업창 2번 열기</button>
            <br>
            <br>
            <button @click="showAlert1">알림창 옵션 열기</button>
            <br>
            <br>
            <button @click="showAlert2">알림창 내용 열기</button>
            <br>
            <br>
            <button @click="showConfirm">컨펌창 열기</button>
        </div>
    </div>
    <PopModal :is-open="showModal1" :source-params="params.title1" @aplyItem="apply" @close="hidePopup(1)"></PopModal>
    <PopModal :is-open="showModal2" :source-params="params.title2" @aplyItem="apply" @close="hidePopup(2)"></PopModal>
</template>

<script>
import PopModal from '@/views/sample/layer/popupModal.vue'
import baseMixins from '@/views/mixins/baseMixins.vue'

export default {
    mixins: [baseMixins],
    components: {
        PopModal,
    },
    data: function() {
        return {
            showModal1: false,
            showModal2: false,
            params: {
                title1: '1번 팝업 타이틀',
                title2: '2번 팝업 타이틀'
            }
        }
    },
    methods: {
        showPopup: function(div) {
            if ( div === 1 ) {
                this.showModal1 = true;
            } else {
                this.showModal2 = true;
            }
            
        },
        hidePopup: function(div) {
            // console.log('parent hide');
            if ( div === 1 ) {
                this.showModal1 = false;
            } else {
                this.showModal2 = false;
            }
        },
        showAlert1: function() {
            this.alert({
                title: '알림 옵션창',
                content: '알림창 옵션 내용',
            })
        },
        showAlert2: function() {
            this.alert('알림창 내용만 입력');
        },
        showConfirm: function() {
            /*
            this.confirm({
                title : '확인창 옵션 타이틀', 
                content: '확인창 옵션 내용입니다.',
                btn: {
                    yes: '확인',
                    no: '취소'
                },
                callback: function() {
                    console.log('여기는 호출하는 창의 콜백메서드에서 찍은 것입니다.')
                }
            });
            */

            this.confirm({
                content: '확인창 옵션 내용입니다.',
                callback: {
                    yes: function() {
                        console.log('여기는 호출하는 창의 콜백메서드에서 찍은 것입니다.')
                    },
                    no: function() {
                        console.log('이것은 넣어도 되고 안넣어도 되고.')
                    }
                }
            });
        },
        apply: function(res) {
            console.log(res);
        },
    }
}
</script>

<style>
</style>