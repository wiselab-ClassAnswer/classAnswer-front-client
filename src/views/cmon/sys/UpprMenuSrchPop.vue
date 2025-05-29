<template>
  <Modal ref="baseModal" :width="40">        
      <div class="section-wrap">
          <h2>메뉴검색</h2>
          <div class="section-wrap">
              <div class="section-part part1">
                  <div class="c-wd-90 m-r-20 ib">
                      <div>
                          <span class="wd-70">검색어</span>
                          <input class="c-wd-70" type="text" v-model="params.srchNm" v-on:keyup.enter="searchList(true)">
                      </div>
                  </div>
                  <div class="wd-80 ib">
                      <button class="btn-normal"  @click="searchList()">조회</button>
                  </div>
              </div>
          </div>
      </div>
      <div class="b m-t-20">
          <!-- 그리드 -->
          <Grid ref="menuSrch" :paging="false" :dataParams="params" :sortable=true ></Grid> 
      </div>
      <div class="button-box1 m-t-20">
          <button class="btn-normal m-r-5" @click="select">선택</button>
          <button class="btn-normal"  @click="cancel">닫기</button>
      </div>
  </Modal>
</template>

<script>

import { ref } from 'vue'; 
import Modal from '@/components/dialog/modal.vue';
import Grid from '@/components/grid/Grid.vue';

export default {
  name: "confirm-dialog",
  components: {
      Modal,
      Grid
  },
  props:{
    dataParams:{
      type: Object,
      default:{}
    }  
  },
  setup() {
      
      const baseModal = ref(null);

      const show = () => {
          baseModal.value.open();
      }
      const cancel = () => {
          baseModal.value.close();
      }

      return {
          baseModal,
          show,           
          cancel
      }
  },
  data: function() {
      return {
          params:{
              menuNo : '',
              menuNm : '',
              srchNm : ''
          },
      }
  },
  methods: {

      init() {
          const $this = this;
          $this.initParam();
          $this.initGrid();
          $this.searchList();            
      },

      initGrid () {
          const $this = this;
          
          let gridObj = {
              url : '/cmon/sys/menuMng/selectListUpprMenuPop.hb',
              colModels : [
                  {name:'menuNo'          , label: '메뉴번호'      , width: 50   , align:'center'},
                  {name:'menuNm'          , label: '메뉴명'        , width: 50  , align:'left'},
                  {name:'useYn'           , label: '사용여부'      , width: 50   , align:'center'},
              ],
              options : {
                  onSelectRow(rowid, val, e){
                      $this.params =  $(this).jqGrid('getRowData',rowid);
                  } ,
                  ondblClickRow(rowid, iRow, iCol) {
                      $this.params =  $(this).jqGrid('getRowData',rowid);
                      $this.$emit('select',$this.params);
                      $this.cancel();
                  } 
              }
          }

          this.$nextTick(function(){
              $this.$refs.menuSrch.init(gridObj);              
          });

      },

      select(){
          const $this = this;
          $this.$emit('select',$this.params);
          $this.cancel();
      },

      searchList() {
          const $this = this;
          this.$nextTick(function(){
              $this.$refs.menuSrch.selectList(true);
          });
      },

      initParam(){
          this.params = {
            menuNo : '',
            menuNm : '',
            srchNm : ''
          };
      }
  }
}
</script>
