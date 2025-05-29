<template>
    <div>
        <!-- 검색조건 -->
        <div class="section section1">
            <div class="search-box">
                <div class="m-b-10">
                    <h1>검색조건</h1>
                    <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="true" @on-set-button-click="onSetButtonClick"></SetButton>
                </div>
                <div class="input-box">
                    <div>
                        <h2>게시판명</h2>
                        <input type="text" v-model="params.blbdNm" v-on:keyup.enter="searchList()">
                    </div>
                </div>
            </div>
        </div>

        <!-- 게시판 목록 -->
        <div class="section section2">
            <div class="section-wrap">
                <h2 class="ib">게시판 목록</h2>
                <button class="btn-exel-download only" @click="downloadExcel()">
                    <img src="@/assets/img/btn_exel.png" alt="엑셀 다운로드">
                    <p>다운로드</p>
                </button>
                
                <!-- 그리드 -->
                <Grid ref="grid" :dataParams="params" :paging="true"></Grid>
            </div>
        </div>

        <!-- 상세정보 -->
        <div class="section section3">
            <div class="section-wrap">
                <h2>게시판 정보</h2>
                <div class="section-part part1">
                    <div class="w-50 p-r-10">
                        <span class="wd-80">게시판번호</span>
                        <input class="c-wd-80" type="text" v-model="blbdInfo.blbdNo" disabled>
                    </div>
                    <div class="w-50 p-l-10">
                        <span class="wd-80">게시판명</span>
                        <input class="c-wd-80" type="text" v-model="blbdInfo.blbdNm">
                    </div>

                    <div class="w-50 p-r-10">
                        <span class="wd-80">상위게시판번호</span>
                        <input class="c-wd-80" type="text" v-model="blbdInfo.upprBlbdNo">
                    </div>

                    <div class="w-50 p-l-10">
                        <span class="wd-80">게시판그룹</span>
                        <input class="c-wd-80" type="text" v-model="blbdInfo.blbdGrp">
                    </div>
                    
                    <div class="w-50 p-r-10">
                        <span class="wd-80">댓글사용여부</span>
                        <input class="c-wd-80" type="checkbox" v-model="blbdInfo.cmmtUseYn" true-value="Y" false-value="N">
                    </div>
                    <div class="w-50 p-l-10">
                        <span class="wd-80">첨부사용여부</span>
                        <input class="c-wd-80" type="checkbox" v-model="blbdInfo.atchUseYn" true-value="Y" false-value="N" >
                    </div>
                    <div class="w-100">
                        <span class="wd-80">게시판유형</span>
                        <div class="c-wd-80 ib">
                            <select class="w-100" v-model="blbdInfo.blbdTypeCd">
                                <option v-for="el in code.blbdTypeCdList" :key="el.cdVal" :value="el.cdVal" >{{el.cdNm}}</option>
                            </select>                        
                        </div>
                    </div>
                    <div class="text-box">
                        <span class="wd-80">비고</span>
                        <textarea class="c-wd-80" cols="30" rows="5" v-model="blbdInfo.rmrk"></textarea>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import { inject, reactive} from 'vue'
import Grid from '@/components/grid/Grid.vue'
import SetButton from '@/components/SetButton.vue'

export default {
    components: {
        Grid,
        SetButton,
    },
    setup() {        
        //공통코드조회
        const getCmonCdList = inject('getCmonCdList')
        let code = reactive({
            blbdTypeCdList: []
        })
        getCmonCdList('BLBD_TYPE_CD', code.blbdTypeCdList, 'N', null);

        return {
           code
        }
    },
    data: function() {
		return {
            params: {
                blbdNm: ''
            },
            blbdInfo: {
                blbdNo: '',
                blbdNm: '',
                blbdGrpCd: '',
                blbdTypeCd: '',
                upprBlbdNo: '',
                cmmtUseYn: 'N',
                atchUseYn: 'N',
                rmrk: ''
            }
        }
    },
    methods: {
        init: function() {
            const $this = this;
            $this.initData();
            $this.initGrid();
        },
        initData() {
            this.params.blbdNm = '';
            this.blbdInfo = {
                blbdNo: '',
                blbdNm: '',
                blbdGrpCd: '',
                blbdTypeCd: '',
                upprBlbdNo: '',
                cmmtUseYn: 'N',
                atchUseYn: 'N',
                rmrk: ''
            }
        },
        initGrid() {
            let $this = this;

            let gridOptions = {
                url: '/prct/mng/blbdMng/selectList.hb',
                colModels: [
                    {name:'blbdNo'      ,label: '게시판번호'    , width: 40 , align:'left', hidden: true},
                    {name:'blbdNm'      ,label: '게시판명'      , width: 100, align:'left'  },
                    {name:'blbdTypeCd'  ,label: '게시판유형코드' , width: 40 , align:'center', hidden: true},
                    {name:'blbdTypeNm'  ,label: '게시판유형'     , width: 40 , align:'center'},
                    {name:'upprBlbdNo'  ,label: '상위게시판번호' , width: 40 , align:'center', hidden: true},
                    {name:'upprBlbdNm'  ,label: '상위게시판'    , width: 40 , align:'center'},
                    {name:'cmmtUseYn'   ,label: '댓글사용여부'  , width: 40 , align:'center'},
                    {name:'atchUseYn'   ,label: '첨부사용여부'  , width: 40 , align:'center'},
                ],
                options: {
                    onCellSelect(rowid) {
                        const rowData = $(this).jqGrid('getRowData', rowid);
                        $this.selectDetl(rowData);
                    },
                }
            }
            $this.$refs.grid.init(gridOptions);
        },
        selectList() {
            this.$refs.grid.selectList(true);
        },
        selectDetl(rowData) {
            const $this = this;
            let params = {
                blbdNo: rowData.blbdNo
            }
            $this.doPost('/prct/mng/blbdMng/selectDetl.hb', params).then(function(res) {
                if ( res.data.rtnCd != '0000') {
                    $this.alert(res.data.rtnMsg);
                } else {
                    $this.blbdInfo = res.data.rtnData;
                }
            });
            
        },
        save() {
            const $this = this;
            let url = '/prct/mng/blbdMng/insert.hb';
            if ( $this.ValdUtil.isNotNull($this.blbdInfo.blbdNo) ) {
                url = '/prct/mng/blbdMng/update.hb';
            }

            let params = $this.CmonUtil.clone($this.blbdInfo);

            $this.doPost(url, params).then(function(res) {
                if ( res.data.rtnCd != '0000') {
                    $this.alert(res.data.rtnMsg);
                } else {
                    $this.initData();
                    $this.selectList();
                }
            });
        },
        delete() {
            const $this = this;
            $this.doPost('/prct/mng/blbdMng/delete.hb', $this.blbdInfo).then(function(res) {
                if ( res.data.rtnCd != '0000') {
                    $this.alert(res.data.rtnMsg);
                } else {
                    $this.initData();
                    $this.selectList();
                }
            });
        },
        downloadExcel() {
            this.doDownExcel('/prct/mng/blbdMng/selectListDownloadExcel.hb', this.params, '게시판목록.xlsx');
        },
        onSetButtonClick(div) {
            const $this = this;
            // console.log(div);
            switch ( div ) {
                case 'init':
                    $this.init();
                    break;
                case 'select':
                    $this.selectList();
                    break;
                case 'save':
                    $this.save();
                    break;
                case 'delete':
                    $this.delete();
                    break;
                default:
                    break;
            }
        }
    },
    mounted: function() {
        let $this = this;
        $this.init();
    }   
}
</script>
