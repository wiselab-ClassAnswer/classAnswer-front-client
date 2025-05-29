<template>
    <Modal ref="baseModal" :width="80">
        <div class="section-wrap w-100">
            <h2>게시물 등록</h2>
            <div class="section part1">
                <div class="w-100 b m-b-5">
                    <div class="w-35 ib m-r-30">
                        <span class="wd-80">제목</span>
                        <input class="c-wd-80" type="text" v-model="postInfo.titl" :disabled="!isMinePost">
                    </div>

                    <div class="w-5 ib m-r-30">
                        <span class="wd-30">공지</span>
                        <div class="c-wd-30 radio-container ib">
                            <input class="ib" style="height:auto;" type="checkbox" v-model="postInfo.bullYn" true-value="Y" false-value="N"/>
                        </div>
                    </div>

                    <div class="w-5 ib m-r-30">
                        <span class="wd-50">업무여부</span>
                        <div class="c-wd-50 radio-container ib">
                            <input class="ib" style="height:auto;" type="checkbox" v-model="postInfo.busiYn" true-value="Y" false-value="N" @change="onChangeBusiYn"/>
                        </div>
                    </div>

                    <div class="w-20 ib m-r-30">
                        <span class="wd-40 ib">업무명</span>
                        <div class="c-wd-40 ib">
                            <VSelect class="w-100" v-model="selectedBusiObj" :options="busiList" :label="'busiNm'" :placeholder="'업무선택'" :disabled="isNotBusi" @onSelect="onSelectBusi"></VSelect>
                        </div>
                    </div>

                    <div class="w-10 ib m-r-30">
                        <span class="wd-60">게시물유형</span>
                        <div class="c-wd-60 ib">
                            <select class="w-100" v-model="postInfo.postTypeCd" :disabled="isNotBusi">
                                <option v-for="item in code.postTypeCdList" :key="item.cdVal" :value="item.cdVal">{{item.cdNm}}</option>
                            </select>                        
                        </div>
                    </div>

                    <div class="w-10 ib">
                        <span class="wd-50 ib">처리상태</span>
                        <div class="c-wd-50 ib">
                            <select class="w-100" v-model="postInfo.procStatCd" :disabled="isCreate">
                                <option v-for="item in code.busiProcDivCdList" :key="item.cdVal" :value="item.cdVal">{{item.cdNm}}</option>
                            </select>                        
                        </div>
                    </div>
                </div>

                <div class="w-100 b m-b-10">
                    <div class="w-20 ib m-r-20">
                        <span class="wd-80">처리예정일자</span>
                        <div class="c-wd-100 datePicker">
                            <DatePicker :stndDt="postInfo.procSchdDt" @on-selected="onSelectedDatepickerProcSchdDt"></DatePicker>
                        </div>
                    </div>
                    <div class="w-20 ib m-r-10">
                        <span class="wd-80">처리완료일자</span>
                        <div class="c-wd-100 datePicker">
                            <DatePicker :stndDt="postInfo.procCmplDt" @on-selected="onSelectedDatepickerProcCmplDt"></DatePicker>
                        </div>
                    </div>
                                    
                    <div class="w-27 ib m-r-30">
                        <span class="wd-50">담당자</span>
                        <div class="c-wd-50 ib">
                            <div class="input-btn w-50">
                                <input class="w-100" type="text" v-model="postInfo.chrgUserId">
                                <button class="post-btn" @click="popupChrgUserSrch">
                                    <img src="@/assets/img/btn_search.png" alt="찾기">    
                                </button>
                            </div>
                            <input class="w-50" type="text" v-model="postInfo.chrgUserNm" disabled>
                        </div>
                    </div>
                    <div class="w-25 ib">
                        <button class="btn-normal m-r-5" @click="toggleContent">내용창 토글</button>
                        <!--
                        <span class="wd-60">배정자</span>
                        <div class="c-wd-60 ib">
                            <div class="input-btn w-50">
                                <input class="w-100" type="text" v-model="postInfo.alocUserId">
                                <button class="post-btn" @click="popupAlocUserSrch">
                                    <img src="@/assets/img/btn_search.png" alt="찾기">    
                                </button>
                            </div>
                            <input class="w-50" type="text" v-model="postInfo.alocUserNm" disabled>
                        </div>
                        -->
                    </div>
                </div>

                <!--
                <h2>댓글</h2>
                <div class="w-100" v-for="(cmnt, idx) in cmntList" :key="idx">
                    <hr class="m-t-0 m-b-5">
                    <div class="w-50 ib">
                        <div class="ib" style="font-weight:500; font-size:11px;">{{cmnt.regiUserNm}}</div>
                        <div class="m-l-10 ib" style="font-size:10px;">{{DateUtil.getFormatDateTime(cmnt.regiDt + cmnt.regiTm)}}</div>
                    </div>
                    
                    <div class="w-50 ib" style="text-align:right;">
                        <button class="btn-normal btn-cmnt" @click="saveCmnt(idx)">저장</button>
                        <button class="btn-normal btn-cmnt m-l-2" @click="deleteCmnt(idx)">삭제</button>
                    </div>
                    
                    <div class="w-100 b" style="font-size: 14px;">
                        <textarea class="w-100 h-40" rows="2" v-model="cmnt.cntn"></textarea>
                    </div>
                    <div class="f-r" style="font-size:10px;">
                        <div class="ib"><div class="ib" @click="updateLikeCnt(idx)"><i class="fa far fa-thumbs-up"></i></div> {{cmnt.likeCnt}}</div>
                        <div class="m-l-10 ib"><div class="ib" @click="updateHateCnt(idx)"><i class="fa far fa-thumbs-down"></i></div> {{cmnt.hateCnt}}</div>
                    </div>
                </div>
                -->

                <div class="w-100" v-show="isContent">
                    <div v-if="hasContent" class="w-100 m-b-10" style="border: 1px solid #999; overflow-y:auto; max-height:400px; ">
                        <div style="margin-top: 10px; border-bottom: 1px solid #999; padding-bottom:5px" v-for="cntn in cntnList" :key="cntn">
                            <div v-html="cntn.cntn"></div>
                            <div style="text-align:right; font-size:10px; margin-bottom: 5px;">
                                {{DateUtil.getFormatDateTime(cntn.regiDt + cntn.regiTm)}} {{cntn.regiUserNm}}
                            </div>
                        </div>
                    </div>
                </div>

<!--
                <h2 class="w-49 ib">첨부파일</h2>
                <div class="w-100 b m-b-10 m-t-10" v-for ="(file, idx) in atchFileList" :key="idx">
                    
                </div>
-->
            </div>

            <div>
                <button class="btn-normal m-r-5" @click="toggleRegiContent">등록창 토글</button>
                
                <div v-show="isRegiContent" class="w-100 text-box">
                    <div class="w-100">
                        <Summernote 
                            v-model="postInfo.cntn"
                            options="options"
                            @update:modelValue="summernoteChange($event)"
                            @summernoteImageLinkInsert="summernoteImageLinkInsert" />
                    </div>
                </div>
                <!--
                <div class="w-100 b" v-if="isMinePost">
                    <div class="w-60 ib">
                        <span class="wd-60 ib">게시기간</span>
                        <div class="c-wd-60 ib datePicker">
                           <BetweenDatePicker :fr-dt="postInfo.blbdStrtDt" :to-dt="postInfo.blbdEndDt" @on-selected="onSelectedBetweenDatepicker"></BetweenDatePicker>
                        </div>
                    </div>
                </div>
                -->
            </div>
        </div>
        
        <div class="button-box1 m-t-20">
            <button class="btn-normal m-r-5" @click="savePost">저장</button>
            <button class="btn-normal m-r-5" @click="deletePost" v-if="!isCreate&&isMinePost">삭제</button>
            <button class="btn-normal" @click="cancel">닫기</button>
        </div>
        <UserSrch ref="ChrgUserSrchModal" :dataParams="params" @getUserPopRowData="selectedChrgUser"></UserSrch>
        <UserSrch ref="AlocUserSrchModal" :dataParams="params" @getUserPopRowData="selectedAlocUser"></UserSrch>
        
    </Modal>
</template>

<script>
import { inject,ref,reactive} from 'vue'
import { SessionUtil }        from '@/utils/SessionUtil.js'
import Modal                  from '@/components/dialog/modal.vue'
import Grid                   from '@/components/grid/Grid.vue'
import DatePicker             from '@/components/datepicker/Datepicker.vue'
import BetweenDatePicker      from '@/components/datepicker/BetweenDatepicker.vue'
import Summernote             from '@/components/editor/Summernote.vue'
import UserSrch               from '@/views/mng/job/UserSrch.vue'
import VSelect                from '@/components/selector/VSelect.vue';

export default {
    name: "PostMngPopup",
    components: {
        Modal
       ,Grid
       ,DatePicker
       ,BetweenDatePicker
       ,Summernote
       ,UserSrch
       ,VSelect
    },
    setup() {        
        const baseModal = ref(null)
        const show = () => {
            baseModal.value.open()            
        }
        //취소버튼
        const cancel = () => {
            baseModal.value.close()
        }
        //공통코드조회
        const getCmonCdList  = inject('getCmonCdList');
        let code = reactive({
            postTypeCdList: [],
            procStatCdList: [],
            busiProcDivCdList: []
        })
        getCmonCdList('POST_TYPE_CD'    , code.postTypeCdList   , 'Y', '');
        getCmonCdList('PROC_STAT_CD'    , code.procStatCdList   , 'Y', '');
        getCmonCdList('BUSI_PROC_DIV_CD', code.busiProcDivCdList, 'Y', '');

        return {
            baseModal
           ,show
           ,cancel
           ,code
        }
    },
    data() {
        return {
            params:{
                prctNo: '',
                blbdNo: '',
                postNo: ''
            },
            options: {
                height: 400,
            },
            selectedBusiObj: '',
            postInfo: {
                prctNo: '',
                blbdNo: '',
                postNo: '',
                bullYn: 'N',
                blbdLevl: 1,
                blbdStrtDt: '',
                blbdEndDt: '',
                titl: '',
                cntn: '',
                
                upprBlbdNo: '',
                upprPostNo: '',

                busiYn: 'Y',
                busiNo: '',
                postTypeCd: '10',
                procSchdDt: '',
                procCmplDt: '',
                chrgUserId: '',
                chrgUserNm: '',
                alocDt: '',
                alocUserId: '',
                alocUserNm: '',
                procStatCd: '10',

                regiDt: '',
                regiTm: '',
                regiUserId: '',
                regiUserNm: '',

                updtDt: '',
                updtTm: '',
                updtUserId: '',
                updtUserNm: ''

            },
            isRegiContent: false,
            isContent: false,
            busiList: [],
            cntnList: [],
            cmntList: [],
            atchFileList: []
        }
    },
    methods: {
        init(){
            const $this = this;
            $this.selectListBusi();
        },
        openPopup(prctNo, blbdNo, postNo) {
            const $this = this;      
            $this.initData();
            if ( $this.ValdUtil.isNull(prctNo) ) {
                $this.alert("프로젝트 번호가 없습니다.")
            }
            else if ( $this.ValdUtil.isNull(blbdNo) ) {
                $this.alert("게시판 번호가 없습니다.")
            } else {
                $this.params.prctNo   = prctNo;
                $this.params.blbdNo   = blbdNo;
                $this.postInfo.prctNo = prctNo;
                $this.postInfo.blbdNo = blbdNo;
                if ( $this.ValdUtil.isNotNull(postNo) ) {
                    $this.params.postNo = postNo;
                    $this.selectPost();
                    $this.selectListCntn();
                    // $this.selectListCmnt();
                    $this.selectListAtchFile();
                }
            }
        },
        //데이터 생성
        initData(){
            const $this = this;
            $this.params = {
                prctNo: '',
                blbdNo: '',
                postNo: ''
            };

            $this.postInfo = {
                prctNo: '',
                blbdNo: '',
                postNo: '',
                bullYn: 'N',
                blbdLevl: 1,
                blbdStrtDt: '',
                blbdEndDt: '',
                titl: '',
                cntn: '',
                
                upprBlbdNo: '',
                upprPostNo: '',

                busiYn: 'Y',
                busiNo: '',
                busiObj: '',
                postTypeCd: '10',
                procSchdDt: '',
                procCmplDt: '',
                chrgUserId: '',
                chrgUserNm: '',
                alocDt: '',
                alocUserId: '',
                alocUserNm: '',
                procStatCd: '10',

                regiDt: '',
                regiTm: '',
                regiUserId: '',
                regiUserNm: '',

                updtDt: '',
                updtTm: '',
                updtUserId: '',
                updtUserNm: ''
            };

            $this.isRegiContent = true;     // 등록할 내용
            $this.isContent     = false;    // 등록된 내용

            $this.selectedBusiObj = '';
            $this.cntnList = [];
            $this.cmntList = [];
            $this.atchFileList = [];

            $this.postInfo.blbdStrtDt = this.DateUtil.getCurrDate();
            $this.postInfo.blbdEndDt  = '9999-12-31';
        },
        // 게시물조회
        selectPost() {
            const $this = this;
            let params = _.cloneDeep($this.params);
            
            $this.doPost('/prct/blbd/postMng/selectPost.hb', params).then(function(res){
                console.log('ddd');
                if ( res.data.rtnCd == '0000') {
                    $this.postInfo = res.data.rtnData.postInfo;
                    let busiObj = _.find($this.busiList, function(item) {
                        return item.busiNo == $this.postInfo.busiNo;
                    });
                    $this.selectedBusiObj = busiObj;

                    $this.isContent     = true;      // 등록된 내용
                    $this.isRegiContent = false;     // 등록할 내용

                } else {
                    $this.$swal(res.data.rtnMsg);
                }
            });
        },
        // 게시물 내용리스트 조회
        selectListCntn() {
            const $this = this;
            let params = _.cloneDeep($this.params);
            
            $this.doPost('/prct/blbd/postMng/selectListCntn.hb', params).then(function(res){
                if (res.data.rtnCd == '0000') {
                    $this.cntnList = res.data.rtnData.cntnList;
                } else {
                    $this.$swal(res.data.rtnMsg);
                }
            });
        },
        // 댓글리스트 조회
        selectListCmnt() {
            const $this = this;
            let params = _.cloneDeep($this.params);
            
            $this.doPost('/prct/blbd/postMng/selectListCmnt.hb', params).then(function(res){
                if (res.data.rtnCd == '0000') {
                    $this.cmntList = res.data.rtnData.cmntList;
                } else {
                    $this.$swal(res.data.rtnMsg);
                }
            });
        },
        // 첨부파일리스트 조회
        selectListAtchFile() {
            const $this = this;
            let params = _.cloneDeep($this.params);
            
            $this.doPost('/prct/blbd/postMng/selectListAtchFile.hb', params).then(function(res){
                if (res.data.rtnCd == '0000') {
                    $this.atchFileList = res.data.rtnData.atchFileList;
                } else {
                    $this.$swal(res.data.rtnMsg);
                }
            });
        },
        selectListBusi() {
            const $this = this;
            let params = {};
            $this.doPost('/prct/blbd/postMng/selectListBusi.hb', params).then(function(res){
                if (res.data.rtnCd == '0000') {
                    $this.busiList = res.data.rtnData.busiList;
                } else {
                    $this.$swal(res.data.rtnMsg);
                }
            });
        },
        // 게시물 저장
        savePost() {
            const $this = this;
            let postInfo = _.cloneDeep($this.postInfo);
            
            if ( $this.ValdUtil.isNull($this.postInfo.titl) ) {
                $this.alert("제목을 입력해 주세요.");
                return false;
            }

            if ( $this.isCreate && $this.ValdUtil.isNull($this.postInfo.cntn) ) {
                $this.alert("내용을 입력해 주세요.");
                return false;
            }

            if ( $this.postInfo.busiYn == 'Y') {

                if ( $this.ValdUtil.isNull($this.postInfo.postTypeCd) ) {
                    $this.alert("게시물유형을 입력해 주세요.");
                    return false;
                }

                if ( $this.ValdUtil.isNull($this.postInfo.busiNo) ) {
                    $this.alert("업무여부가 'Y'이면 엄무를 선택하셔야 합니다.");
                    return false;
                }
            }

            postInfo.blbdStrtDt = $this.CmonUtil.replaceAll(postInfo.blbdStrtDt, "-", "");
            postInfo.blbdEndDt  = $this.CmonUtil.replaceAll(postInfo.blbdEndDt , "-", "");
            postInfo.procSchdDt = $this.CmonUtil.replaceAll(postInfo.procSchdDt, "-", "");
            postInfo.procCmplDt = $this.CmonUtil.replaceAll(postInfo.procCmplDt, "-", "");

            // 첨부파일

            $this.doPost("/prct/blbd/postMng/savePost.hb", postInfo).then(function(res) {
                if (res.data.rtnCd =='0000') {
                    $this.alert('저장되었습니다.').then((result) => {
                        if ( result.isConfirmed ) {
                            $this.$emit('selectList');
                        }
                    });                    
                    $this.cancel();
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });

        },
        addCmnt() {
            const $this = this;
            $this.cmntList.unshift({
                prctNo: $this.params.prctNo,
                blbdNo: $this.params.blbdNo,
                postNo: '',
                cntn: '',
                blbdLevl: '2',
                likeCnt: 0,
                hateCnt: 0,
                delYn: 'N',
                regiDt: this.DateUtil.convertDateFormat(this.DateUtil.getCurrDate()),
                regiTm: this.DateUtil.convertTimeFormat(this.DateUtil.getCurrTime()),
                regiUserId: SessionUtil.getUserId(),
                updtUserId: SessionUtil.getUserId()
            });
        },
        // 댓글 저장
        saveCmnt(idx) {
            const $this = this;
            let cmnt = _.cloneDeep($this.cmntList[idx]);

            if ( !this.isMineCmnt ) {
                $this.alert("자기 게시물만 저장할 수 있습니다.");
                return false;
            }

            if ( $this.ValdUtil.isNull($this.postInfo.postNo) ) {
                $this.alert("게시물 등록에서는 할 수 없습니다.");
                return false;
            }

            $this.doPost("/prct/blbd/postMng/saveCmnt.hb", cmnt).then(function(res) {
                if ( res.data.rtnCd =='0000' ) {
                    $this.selectListCmnt();
                    $this.alert('저장되었습니다.');
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
        },
        // 게시물 삭제
        deletePost() {
            const $this = this;

            if ( !this.isMinePost ) {
                $this.alert("자기 게시물만 삭제할 수 있습니다.");
                return false;
            }

            if ( $this.ValdUtil.isNull($this.postInfo.postNo) ) {
                $this.alert("게시물 등록에서는 할 수 없습니다.");
                return false;
            }

            $this.confirm({
                content: '게시물을 삭제하시겠습니까?',
                callback: {
                    yes() {
                        $this.deletePostRequest()
                    } 
                }
            })
        },
        deletePostRequest() {
            const $this = this;
            $this.doPost("/prct/blbd/postMng/deletePost.hb", $this.params).then(function(res) {
                if ( res.data.rtnCd =='0000') {
                    $this.alert('삭제되었습니다.').then((result) => {
                        if ( result.isConfirmed ) {
                            $this.$emit('selectList');
                        }
                    });                    
                    $this.cancel();
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
        },
        // 댓글 삭제
        deleteCmnt(idx) {
            const $this = this;
            let cmnt = _.cloneDeep($this.cmntList[idx]);

            if ( !this.isMineCmnt ) {
                $this.alert("자기 게시물만 삭제할 수 있습니다.");
                return false;
            }

            $this.doPost("/prct/blbd/postMng/deleteCmnt.hb", cmnt).then(function(res) {
                if ( res.data.rtnCd == '0000' ) {
                    $this.selectListCmnt();
                    $this.alert('삭제되었습니다.');
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
        },
        // 좋아요수 증가
        updateLikeCnt(idx) {
            const $this = this;
            let cmnt = _.cloneDeep($this.cmntList[idx]);
            $this.doPost("/prct/blbd/postMng/updateLikeCnt.hb", cmnt).then(function(res) {
                if ( res.data.rtnCd == '0000' ) {
                    $this.cmntList[idx].likeCnt = $this.cmntList[idx].likeCnt + 1;
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
        },
        // 싫어요수 증가
        updateHateCnt(idx) {
            const $this = this;
            let cmnt = _.cloneDeep($this.cmntList[idx]);
            $this.doPost("/prct/blbd/postMng/updateHateCnt.hb", cmnt).then(function(res) {
                if ( res.data.rtnCd == '0000' ) {
                    $this.cmntList[idx].hateCnt = $this.cmntList[idx].hateCnt + 1;
                } else {
                    $this.alert(res.data.rtnMsg);
                }
            });
        },
        // 담당자 팝업
        popupChrgUserSrch() {
            this.$refs.ChrgUserSrchModal.show();
            this.$refs.ChrgUserSrchModal.initGrid();
        },
        // 담당자 팝업에서 선택시 셋팅
        selectedChrgUser: function(user) {
            this.postInfo.chrgUserId = user.userId;
            this.postInfo.chrgUserNm = user.userNm;
        },
        // 배정자 팝업
        popupAlocUserSrch() {
            this.$refs.AlocUserSrchModal.show();
            this.$refs.AlocUserSrchModal.initGrid();
        },
        // 배정자 팝업에서 선택시 셋팅
        selectedAlocUser: function(user) {
            this.postInfo.alocUserId = user.userId;
            this.postInfo.alocUserNm = user.userNm;
        },
        onSelectBusi: function() {
            let chrgUserId = '';
            let chrgUserNm = '';
            let busiNo     = '';
            if ( this.ValdUtil.isNotNull(this.selectedBusiObj) ) {
                chrgUserId = this.selectedBusiObj.chrgUserId;
                chrgUserNm = this.selectedBusiObj.chrgUserNm;
                busiNo     = this.selectedBusiObj.busiNo;
            }
            this.postInfo.chrgUserId = chrgUserId;
            this.postInfo.chrgUserNm = chrgUserNm;
            this.postInfo.busiNo     = busiNo;
        },
        // 게시기간
        onSelectedBetweenDatepicker: function(selectedDate) {
            const $this = this;
            $this.postInfo.blbdStrtDt = selectedDate.frDt;
            $this.postInfo.blbdEndDt  = selectedDate.toDt;
        },
        // 처리예정일자
        onSelectedDatepickerProcSchdDt: function(selectedDate) {
            this.postInfo.procSchdDt = selectedDate;
        },
        // 처리완료일자
        onSelectedDatepickerProcCmplDt: function(selectedDate) {
            this.postInfo.procCmplDt = selectedDate;
        },
        // 서머노트 텍스트
        summernoteChange(newValue) {
            // console.log("summernoteChange", newValue);
        },
        // 서머노트 이미지
        summernoteImageLinkInsert(...args) {
            // console.log("summernoteImageLinkInsert()", args);
        },
        // 업무여부 'N' 선택하면 게시유형코드는 삭제
        onChangeBusiYn(e) {
            if ( e.target.value == 'N' ) {
                this.postInfo.postTypeCd = "";
                this.selectedBusiObj = '';
            }
        },
        // 등록할 내용
        toggleRegiContent() {
            this.isRegiContent = !this.isRegiContent;
        },
        // 등록된 내용
        toggleContent() {
            this.isContent = !this.isContent;
        }
    },
    computed: {
        isNotBusi: function() {
            return this.postInfo.busiYn == 'N';
        },
        isMinePost: function() {
            return this.postInfo.regiUserId == SessionUtil.getUserId() || this.ValdUtil.isNull(this.postInfo.regiUserId);
        },
        isMineCmnt: function(idx) {
            return this.cmntList[idx].regiUserId == SessionUtil.getUserId();
        },
        isCreate: function() {
            return this.ValdUtil.isNull(this.postInfo.postNo);
        },
        hasContent: function() {
            return this.cntnList.length > 0;
        },
        maxHeight: function() {
            if ( this.cntnList.length > 0 ) {
                return '800px';
            } else {
                return '400px';
            }
        }
    },
    watch: {
        'postInfo.chrgUserId': function(newVal) {
            if ( this.ValdUtil.isNull(newVal) ) {
                this.postInfo.chrgUserNm = '';
            }
        },
        'postInfo.alocUserId': function(newVal) {
            if ( this.ValdUtil.isNull(newVal) ) {
                this.postInfo.alocUserNm = '';
            }
        }
    },
    mounted(){
        const $this = this;
        $this.init();
    }
}
</script>

<style scoped>

input {
    border: 1px solid #d1d1dd;
}
.btn-cmnt {
    display: inline-flex;
    width: 38px !important;
    height: 18px  !important;
    background-color: #ffffff;
    color: #333333;
    border: 1px solid #d1d1dd;
    border-radius: 5px;
    font-size: 10px !important;
    text-align: center;
    justify-content: center;
    align-items: center;    
}
.section-wrap .section > div {
    display: inline-block;
    padding-bottom: 3px;
}
.section-wrap .section span {
    display: inline-block;
    /* width: 70px; */
    margin-right: 10px;
    color: #666666;
    font-size: 12px;
}
.section-wrap .section input {
    display: inline-block;
    /* width: calc(100% - 80px); */
    height: 30px;
    border: 1px solid #d1d1dd;
    border-radius: 3px;
    padding: 0 5px;
    font-size: 12px !important;
    font-weight: 400;
}
.datePicker {
    display: inline-block;
    width: calc(100% - 80px);
    height: 30px;
    border-radius: 3px;
    font-size: 12px !important;
    font-weight: 400;
}
.section-wrap .section select {
    display: inline-block;
    width: calc(100% - 80px);
    height: 30px;
    border: 1px solid #d1d1dd;
    border-radius: 3px;
    padding: 0 5px;
    font-size: 12px;
    font-weight: 400;
}
.section-wrap .section .selection {
    width: calc(100% - 109px);
}
.section-wrap .section textarea {
    display: inline-block;
    width: calc(100% - 80px);
    height: 100px;
    border: 1px solid #d1d1dd;
    border-radius: 3px;
    padding: 5px;
    font-size: 12px;
    font-weight: 400;
}
</style>