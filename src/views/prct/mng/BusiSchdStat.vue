<template>
  <div>
      <!-- 검색조건 -->
      <div class="section section1">
          <div class="search-box">
              <div class="m-b-10">
                  <h1>검색조건</h1>
                  <SetButton :showInit="true" :showSelect="true" :showSave="false" :showDelete="false"
                      @on-set-button-click="onSetButtonClick"></SetButton>
              </div>
              <div class="input-box">
                  <!-- 04/09 css 처리하기 -->
                  <div class="w-7">
                      <h2 class="essn">기준년월</h2>
                      <MonthDatepicker :stndDt="params.busiDt" @on-selected="onSelectedDatepicker"></MonthDatepicker>
                  </div>
                  <div class="w-10">
                      <h2 class="essn">업무명</h2>
                      <input type="text" v-model="params.srchBusiNm" >
                  </div>
                  <div style="position:relative">
                      <h2>담당자</h2>
                      <input class="search" type="text" v-model="params.srchUserId" disabled>
                      <button class="btn-search" @click="popupUserSrch()">
                          <img src="@/assets/img/btn_search.png" alt="찾기">
                      </button>
                  </div>
                  <div class="w-10">
                      <input type="text" v-model="params.srchUserNm" disabled />
                  </div>
              </div>
          </div>
      </div>
      <div class="section section2 w-65">
          <div class="section-wrap">
              <h2 class="m-b-20">업무 목록</h2>
              <div class="gantt-chart-container" ref="ganttChartContainer">
                  <table>
                      <thead>
                          <tr>
                              <th rowspan="2" class="busi-name-cell">업무명</th>
                              <th v-for="(days, month) in stndCalList" :key="days" :colspan="days.length"
                                  class="busi-header-cell">
                                  {{ month + 1 }}월
                              </th>
                          </tr>
                          <!-- 월별 일자 표시 -->
                          <tr>
                              <template v-for="(days, month) in stndCalList" :key="month">
                                  <th v-for="day in days" :key="day.dt" class="day-header"
                                      :style="{ color: day.dayColor }">
                                      {{ day.dt }}
                                  </th>
                              </template>
                          </tr>
                      </thead>
                      <tbody>
                          <template v-for="busi in busiList" :key="busi.busiNo">
                              <!-- 예정된 기간 (schd) 색칠 -->
                              <tr>
                                  <td v-if="!busi.chrgUserId" :rowspan="2" class="busi-name-cell" @click="selectBusi(busi)">
                                      {{ busi.busiNm }}
                                  </td>
                                  <td v-if="busi.chrgUserId" :rowspan="2" class="busi-name-cell" @click="selectBusi(busi)">
                                      {{ busi.busiNm }}<br>{{ busi.chrgUserNm }}({{ busi.chrgUserId }})
                                  </td>
                                  <template v-for="(days, month) in stndCalList" :key="`schd-${busi.busiNo}-${month}`">
                                      <td v-for="day in days" :key="day.dt"
                                          :class="{ 'schd-busi-day': setBusiDuration(busi, month, day, 'schd') }"
                                          @click="selectBusi(busi)">
                                      </td>
                                  </template>
                              </tr>
                              <!-- 실제 기간 (real) 색칠 -->
                              <tr>
                                  <template v-for="(days, month) in stndCalList" :key="`real-${busi.busiNo}-${month}`">
                                      <td v-for="day in days" :key="day.dt"
                                          :class="{ 'real-busi-day': setBusiDuration(busi, month, day, 'real') }"
                                          @click="selectBusi(busi)">
                                      </td>
                                  </template>
                              </tr>
                          </template>
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
      <div class="section section3 w-35">
          <div class="section-wrap">
              <h2 class="m-b-10">업무 정보</h2>
              <div class="section-part part1">
                  <div class="w-50 p-r-10">
                      <span class="wd-100">프로젝트번호</span>
                      <input class="c-wd-100" type="text" v-model="busiInfo.prctNo" disabled>
                  </div>
                  <div class="w-50 p-l-10">
                      <span class="wd-100">프로젝트명</span>
                      <input class="c-wd-100" type="text" v-model="busiInfo.prctNm" disabled>
                  </div>
                  <div class="w-50 p-r-10">
                      <span class="wd-100">업무번호</span>
                      <input class="c-wd-100" type="text" v-model="busiInfo.busiNo" disabled>
                  </div>
                  <div class="w-50 p-l-10">
                      <span class="wd-100">업무명</span>
                      <input class="c-wd-100" type="text" v-model="busiInfo.busiNm" disabled>
                  </div>
                  <div class="w-50 p-r-10">
                      <span class="wd-100">업무유형</span>
                      <input class="c-wd-100" type="text" v-model="busiInfo.busiTypeNm" disabled>
                  </div>
                  <div class="w-50 p-l-10">
                      <span class="wd-100">업무상태</span>
                      <input class="c-wd-100" type="text" v-model="busiInfo.busiStatNm" disabled>
                  </div>
                  <div class="w-50 p-r-10">
                      <span class="wd-100">선행업무번호</span>
                      <input class="c-wd-100" type="text" v-model="busiInfo.prevBusiNo" disabled>
                  </div>
                  <div class="w-50 p-l-10">
                      <span class="wd-100">선행업무명</span>
                      <input class="c-wd-100" type="text" v-model="busiInfo.prevBusiNm" disabled>
                  </div>
                  <div class="w-50 p-r-10">
                      <span class="wd-100">담당자</span>
                      <input class="c-wd-100" type="text" v-model="busiInfo.chrgUserId" disabled>
                  </div>
                  <div class="w-50 p-l-10">
                      <span class="wd-100">담당자명</span>
                      <input class="c-wd-100" type="text" v-model="busiInfo.chrgUserNm" disabled>
                  </div>
                  <div class="w-50 p-r-10">
                      <span class="wd-100">예상시작일자</span>
                      <div class="input-btn c-wd-100">
                          <input type="text" class="w-100" v-model="busiInfo.schdStrtDt" disabled />
                          <button class="cal-btn cal-btn2 input-group-addon" style="float: right;">
                              <img src="@/assets/img/btn_cal.png" alt="달력">
                          </button>
                      </div>
                  </div>
                  <div class="w-50 p-l-10">
                      <span class="wd-100">예상종료일자</span>
                      <div class="input-btn c-wd-100">
                          <input type="text" class="w-100" v-model="busiInfo.schdEndDt" disabled />
                          <button class="cal-btn cal-btn2 input-group-addon" style="float: right;">
                              <img src="@/assets/img/btn_cal.png" alt="달력">
                          </button>
                      </div>
                  </div>
                  <div class="w-50 p-r-10">
                      <span class="wd-100">실제시작일자</span>
                      <div class="input-btn c-wd-100">
                          <input type="text" class="w-100" v-model="busiInfo.realStrtDt" disabled />
                          <button class="cal-btn cal-btn2 input-group-addon" style="float: right;">
                              <img src="@/assets/img/btn_cal.png" alt="달력">
                          </button>
                      </div>
                  </div>
                  <div class="w-50 p-l-10">
                      <span class="wd-100">실제종료일자</span>
                      <div class="input-btn c-wd-100">
                          <input type="text" class="w-100" v-model="busiInfo.realEndDt" disabled />
                          <button class="cal-btn cal-btn2 input-group-addon" style="float: right;">
                              <img src="@/assets/img/btn_cal.png" alt="달력">
                          </button>
                      </div>
                  </div>
                  <div class="text-box">
                      <span class="wd-100">비고</span>
                      <textarea class="c-wd-100" cols="30" rows="30" style="height:375px;" v-model="busiInfo.rmrk"></textarea>
                  </div>
              </div>
          </div>
      </div>
      <UserSrch ref="UserSrchModal" :dataParams="params" @getUserPopRowData="selectedDataUser"></UserSrch>
  </div>
</template>

<script>
import SetButton from '@/components/SetButton.vue'
import UserSrch from '@/views/mng/job/UserSrch.vue'
import MonthDatepicker from '@/components/datepicker/MonthDatePicker.vue'
import Datepicker from '@/components/datepicker/Datepicker.vue'
import { DateUtil } from '@/utils/DateUtil'

export default {
  components: {
      SetButton,
      UserSrch,
      MonthDatepicker,
      Datepicker,
  },
  data() {
      return {
          params: {
              busiDt       : '',
              busiYear     : '',
              busiMnth     : '',
              srchUserId   : '',
              srchUserNm   : '',
              srchBusiNm   : '',
          },
          busiInfo: {
              prctNo       : '',
              prctNm       : '',
              busiNo       : '',
              busiNm       : '',
              busiTypeCd   : '',
              busiTypeNm   : '',
              prevBusiNo   : '',
              prevBusiNm   : '',
              fcstNeedDcnt : '',
              chrgUserId   : '',
              chrgUserNm   : '',
              busiStatCd   : '',
              busiStatNm   : '',
              schdStrtDt   : '',
              schdEndDt    : '',
              realStrtDt   : '',
              realEndDt    : '',
          },
          busiList   : [],    // 업무일정 리스트
          stndCalList: [],    // 표준달력 리스트
      };
  },
  methods: {
      init() {
          const $this = this;
          $this.reset();
          $this.searchStndCal();
          $this.selectListBusiSchdMng();
      },
      //업무조회
      selectListBusiSchdMng() {
          const $this = this;
          const url = '/prct/mng/busiSchdStat/selectListBusiSchdMng.hb';
          let params = {
              stndDt     : $this.params.busiYear,
              srchBusiNm : $this.params.srchBusiNm,
              srchUserId : $this.params.srchUserId,
          };
          $this.doPost(url, params).then(function (res) {
              let result = res.data;
              if (result.rtnCd === '0000') {
                  if (result.rtnData.result.length != 0) {
                      $this.busiList = result.rtnData.result;
                  } else {
                      $this.resetBusiList();
                  }
              } else {
                  $this.alert("업무조회 도중 오류가 발생하였습니다.");
              }
          });
          //조회 후 스크롤바 이동 실행
          $this.scrollToMonth(this.params.busiMnth);
      },
      // 막대바 선택 시 상세조회  
      selectBusi(busi) {
          const $this = this;
          const url = '/prct/mng/busiSchdStat/selectBusiSchdSpec.hb';
          let params = {
              busiNo: busi.busiNo
          };
          $this.doPost(url, params).then(function (res) {
              let result = res.data;
              if (result.rtnCd === '0000') {
                  $this.busiInfo            = result.rtnData;
                  $this.busiInfo.schdStrtDt = DateUtil.dateToDash(result.rtnData.schdStrtDt);
                  $this.busiInfo.schdEndDt  = DateUtil.dateToDash(result.rtnData.schdEndDt);
                  $this.busiInfo.realStrtDt = DateUtil.dateToDash(result.rtnData.realStrtDt);
                  $this.busiInfo.realEndDt  = DateUtil.dateToDash(result.rtnData.realEndDt);
              } else {
                  $this.alert("상세정보 조회 도중 오류가 발생하였습니다.");
              }
          });
      },
      // 현재 시점으로 기준년월 설정
      setStndDt() {
          const $this = this;
          this.params.busiDt   = DateUtil.getCurrDate();
          this.params.busiYear = this.params.busiDt.slice(0, 4);
          this.params.busiMnth = this.params.busiDt.slice(5, 7);
      },
      //TC_CAL에서 년/월/일 조회
      searchStndCal() {
          const $this = this;
          let params = {
              busiYear : $this.params.busiYear,
              busiMnth : $this.params.busiMnth
          }
          $this.doPost('/prct/mng/busiSchdStat/selectStndCalList.hb', params).then(function (res) {
              
              if (res.data.rtnCd == '0000') {
                  $this.setStndCalList(res.data.rtnData.result);
              } else {
                  $this.alert("일정 조회 중 오류가 발생하였습니다.");
              }


          });
      },
      //달력 설정 함수
      //주말, 공휴일(hdayYn ==='Y')인경우 붉은색, 아닌경우 검정색
      setStndCalList: function (result) {
          const $this = this;

          let dayColor      = 'black';
          $this.stndCalList = [];

          result.forEach(item => {
              const month = parseInt(item.stndMnth, 10);
              if (!$this.stndCalList[month]) {
                  $this.stndCalList[month] = [];
              }
              if (month != null) {
                  if (item.hdayYn == 'Y') {
                      dayColor = 'red';
                  } else {
                      dayColor = 'black';
                  }
                  $this.stndCalList[month].push({ mnth: month, dt: item.stndDay, dayColor: dayColor });
              }
          })
          $this.stndCalList = $this.stndCalList.filter(item => item !== null);
          // 1. dayColor 변수 선언 기본값 검정색
          // 2.result의 holydayYn 값이 Y인 날짜만 구분 
          // 2-1.Y인 경우 dayColor의 값을 빨간색으로
          // 3.result에 월 / 일 / dayColor 변수 푸시
          // 4. result 리턴
          // html 쪽에서 dayColor의 값을 비교해서 red인 경우만 일자의 색상 변경 
      },

      //담당자검색팝업
      popupUserSrch() {
          this.$refs.UserSrchModal.show();
          this.$refs.UserSrchModal.initGrid();
      },
      //담당자검색 팝업에서 전달 받은 값 매핑
      selectedDataUser(data) {
          this.params.srchUserId = data.userId;
          this.params.srchUserNm = data.userNm;
      },
      //초기화
      reset() {
          const $this = this;
          $this.resetParam();
          $this.resetBusiInfo();
          $this.resetBusiList();
          $this.setStndDt();
      },
      //파라미터 초기화
      resetParam(){
          const $this = this;
          $this.params.busiDt         = '';
          $this.params.busiYear       = '';
          $this.params.busiMnth       = '';
          $this.params.srchUserId     = '';
          $this.params.srchUserNm     = '';
          $this.params.srchBusiNm     = '';
      },
      //busiInfo 초기화
      resetBusiInfo() {
          const $this = this;

          $this.busiInfo.prctNo       = '';
          $this.busiInfo.prctNm       = '';
          $this.busiInfo.busiNo       = '';
          $this.busiInfo.busiNm       = '';
          $this.busiInfo.busiTypeCd   = '';
          $this.busiInfo.busiTypeNm   = '';
          $this.busiInfo.prevBusiNo   = '';
          $this.busiInfo.prevBusiNm   = '';
          $this.busiInfo.fcstNeedDcnt = '';
          $this.busiInfo.chrgUserId   = '';
          $this.busiInfo.chrgUserNm   = '';
          $this.busiInfo.busiStatCd   = '';
          $this.busiInfo.busiStatNm   = '';
          $this.busiInfo.schdStrtDt   = '';
          $this.busiInfo.schdEndDt    = '';
          $this.busiInfo.realStrtDt   = '';
          $this.busiInfo.realEndDt    = '';
      },
      //BusiList 초기화 
      resetBusiList() {
          const $this = this;
          $this.busiList = [
              { prctNo: '', prctNm: '', busiNo: '', busiNm: '' },
          ];
      },

      // 검색조건 기준년월 조회
      onSelectedDatepicker(selectedDate) {
          this.params.busiDt   = selectedDate;
          this.params.busiYear = selectedDate.slice(0, 4);
          this.params.busiMnth = selectedDate.slice(5, 7);
              
          this.selectListBusiSchdMng();
      },
      // 예상일자 / 실제일자 설정
      setBusiDuration(busi, month, day, dtDiv) {
          // this.params.busiYear을 기준으로 한 년도의 전체 일
          const checkDate = new Date(this.params.busiYear, day.mnth - 1, day.dt)
          let startDate   = '';
          let endDate     = '';

          // 예상일자인 경우
          if (dtDiv === 'schd') {
              startDate = DateUtil.getFormatDate(busi.schdStrtDt, 'YYYY-MM-DD');
              endDate   = DateUtil.getFormatDate(busi.schdEndDt, 'YYYY-MM-DD');
          // 실제일자인 경우
          } else if (dtDiv == 'real' && busi.realStrtDt && busi.realEndDt) { 
              startDate = DateUtil.getFormatDate(busi.realStrtDt, 'YYYY-MM-DD');
              endDate   = DateUtil.getFormatDate(busi.realEndDt, 'YYYY-MM-DD');
          }
          return this.isBetween(startDate, endDate, checkDate);
      },
      // setBusiDuration 에서 전달받은 startDate, endDate, chckDt 으로 날짜 비교
      isBetween(startDate, endDate, checkDate) {
      // 04/09 new Date(startDate) > convertDateFormat으로 변경해보았으나 일자 간 빼기는 시간이 있어야함 
      // DateUtil.isBetween을 사용 해보았지만 DateUtil.isBetween에서는 CurrDate(현재일자)를 가져오므로 비교 불가능
      // 날짜 간 계산 시 Date로 선언한 날짜형식만 해야되는것 같음
      const strtDt  = new Date(startDate);
      const endDt   = new Date(endDate);
      const chckDt  = new Date(checkDate);
      // new Date로 값을 날짜를 가져올 경우 시간도 포함되며 09:00:00으로 지정되있기 때문에
      // 시작일자가 포함되야하므로 setHours(0, 0, 0, 0)
      // 종료일자가 포함되야하므로 setHours(23, 59, 59, 999)
      strtDt.setHours(0, 0, 0, 0);
      endDt.setHours(23, 59, 59, 999); // endDate의 경우 하루의 마지막 순간을 포함하도록 조정
      chckDt.setHours(0, 0, 0, 0);
      // 시작일자와 종료일자 사이의 날짜만 True 나머지 False
      return chckDt >= strtDt && chckDt <= endDt;
      },

      // 기준년월 선택시 선택된 월으로 가로축 스크롤바 스크롤하는 함수
      scrollToMonth(month) {
          //ref="ganttChartContainer" 으로 지정한 class
          const ganttChartContainer = this.$refs.ganttChartContainer;
          // 입력받은 검색조건 기준년월의 params.busiMnth 문자열을 숫자로 변환 및 배열 인덱스에 맞게 조정
          const monthIndex = parseInt(month, 10) - 1;
          // class=busi-header-cell 으로 지정한 셀을 모두 찾음 
          const allBusiHeaderCell = ganttChartContainer.querySelectorAll('.busi-header-cell');

          if (allBusiHeaderCell.length > 0 && monthIndex >= 0) {
              // allBusiHeaderCell에서 입력받은 month을 정수로 변환한 monthIndex의 인덱스 값
              const monthCell = allBusiHeaderCell[monthIndex];
              if (monthCell) {
                  // 첫 번째 호출: 가로축 스크롤을 맨 왼쪽으로 이동
                  // ganttChartContainer.scrollTo({ left: 0, behavior: 'smooth' });
                  // setTimeout(() => {

                  // 가로축 스크롤을 좌측으로
                  // ganttChartContainer.scrollLeft = 0;
                  // 세로축 스크롤을 상단으로
                  ganttChartContainer.scrollTop = 0;
                  // }, 800)
                  // 두 번째 호출: 원하는 위치로 스크롤 이동
                  // setTimeout(() => {

                  // 컨테이너 내에서 monthCell까지의 상대적 위치를 계산합니다.
                  // 검색조건의 기준년월에서 선택한 값인 params.busiMnth 값의 위치 계산
                  const cellRect = monthCell.getBoundingClientRect();
                  // ganttChartContainer으로 지정한 class의 너비 크기 
                  let containerRect = ganttChartContainer.getBoundingClientRect();
                  // busi-name-cell으로 지정한 class의 너비 크기
                  // 업무명이 좌측에 틀고정으로 되어있기 때문에 업무명 <td> width 만큼을 빼기 위함
                  let busiNameCellWidth = ganttChartContainer.querySelector('.busi-name-cell').getBoundingClientRect().width;

                  // 컨테이너의 스크롤 위치를 계산합니다. busi-name-cell의 너비를 고려하여 스크롤 위치를 조정합니다.
                  // cellRect.left : 선택한 월의 맨 왼쪽 값
                  // containerRect.left : 현재 ganttChartContainer으로 지정한 class의 위치
                  // ganttChartContainer.scrollLeft : 왼쪽 기준 가로축 스크롤의 위치
                  // busiNameCellWidth : 업무명 너비
                  let scrollX = cellRect.left - containerRect.left + ganttChartContainer.scrollLeft - busiNameCellWidth;
                  // 컨테이너를 새로운 위치로 스크롤합니다.
                  ganttChartContainer.scrollTo({ left: scrollX, behavior: 'smooth' });

                  // }, 800); // 첫 번째 스크롤 후 0.5초 후에 두 번째 스크롤 실행            
              }
          }
      },
      onSetButtonClick(div) {
          switch (div) {
              case 'init':
                  this.init();
                  break;
              case 'select':
                  this.selectListBusiSchdMng();
                  break;
              default:
                  alert('처리할 수 없는 버튼 이벤트입니다.');
                  break;
          }
      },
  },
  computed: {
  },
  beforeMount(){
      const getDt   =  DateUtil.getCurrDate();
      const getYear = getDt.slice(0,4);

      for (let month = 0; month < 12; month++) {
          const days = new Date(getYear, month, 0).getDate();
          this.stndCalList[month] = []; // 해당 월을 위한 배열 초기화

          for(let day = 1; day <= days; day++){
              // 각 날짜에 대한 정보를 배열에 추가
              const getMonth = parseInt(month, 10);
              this.stndCalList[getMonth].push({ mnth: getMonth, day: day, dayColor: 'black' });
          }
      }
  },
  mounted: function () {
      const $this = this;
      $this.init();
  },
};
</script>

<style scoped>
.gantt-chart-container {
  overflow-x: auto;
  max-height: 598px;
}

table {
  border-collapse: collapse;
}

/* 차트 격자 */
td {
  border: 1px solid black;
  padding: 5px;
  width: 25px;
  height: 25px;
  min-width: 25px;
  min-height: 25px;
  text-align: center
}

/* 예상일자 */
.schd-busi-day {
  background-color: #4caf50;
  cursor: pointer;
}

/* 실제일자 */
.real-busi-day {
  background-color: #ffcc00;
  cursor: pointer;
}

/* 월 표시 */
.busi-header-cell {
  font-weight: bold;
  font-size: 12px;
  text-align: center;
  width: 200px;
  height: 25px;
  max-width: 500px;
  padding-bottom: 5px;
  /* position: sticky; */
  left: 0;
  z-index: 2;
  /* background-color: white; */
  border: 1px solid black;
}

/* 월별 일자 표시 */
.day-header {
  border: 1px solid black;
  padding: 5px;
  text-align: center;
  font-weight: bold;
  font-size: 12px;
  width: 10%;
  min-width: 25px;
  height: 25px;
  min-height: 25px;
}

/* 업무명 표시 */
.busi-name-cell {
  font-weight: bold;
  text-align: center;
  font-size: 12px;
  width: 150px;
  min-width: 150px;
  max-width: 150px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  position: sticky;
  left: 0;
  z-index: 2;
  background-color: white;
  border: 1px solid black;
  cursor: pointer;
}

/* 업무목록 body */
tbody {
  max-height: 500px;
  overflow-y: auto;
}</style>
