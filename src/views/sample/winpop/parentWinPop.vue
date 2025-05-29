<template>
    <div id="dialogPage">
        <div id="sample">
            <button type="button" @click="openWinPop">윈도우 팝업 띄우기</button>
            <button type="button" @click="sendToChild">윈도우 팝업으로 전송</button>
  
            <WinPopup ref="winPopup" @onClose="val=>evtCloseWinPopup(val)" @onRecvEvtFromWinPop="val=>onRecvWinPop(val)">
            </WinPopup>
        </div>
    </div>
</template>
  
<script>
  
import WinPopup from '@/components/winPop.vue'
  
  export default {
    name: "ParentVue",
    components : {
       'WinPopup' : WinPopup  
    }, 
    methods : {
      evtCloseWinPopup( ){
        console.log( "evtCloseWinPopup () ========  ");
      },
      
      openWinPop(){
        // vue의 라우터에 등록한 팝업창 주소를 uri로 설정하도록 한다 
        let uri = '/popup/childWindPop/12345';
        // this.$refs.winPopup.openWinPop( uri , 1560, 700 );
        // window.open(uri, '_black', 'width=800,height=500' );
        // window.open('http://127.0.0.1:8080/popup/sample/test', '_black', 'width=800,height=1000' )
        // window.open(process.env.BASE_URL + '/pop/childWindPop/102928', '_black', 'width=800,height=1000');
        let attr = 'top=' + 0 + ', left =' + 0 + ', width=650, height =500, resizable=no, status=no';
        window.open(uri + "?param=123455", '', attr);
      }, 
      
      onRecvWinPop( recvObj ){
  
        console.log( "onRecvWinPop  ---------" );
  
        if( recvObj.evt != null ){    // 저장이 정상적으로 완료된 경우
  
          switch( recvObj.evt ){
            case "message" :
              console.log( "윈 팝업으로 부터 수신 메세지 : " + recvObj.message );
              break;
          }
        }
  
      },
  
      sendToChild(){
        this.$refs.winPopup.sendEvtToChild( { msg : 'abcde' } );
      }, 
  
    }
}
</script>
  
  