<template>
    <div style="height: 100%;">
        <!-- 상단 -->
        <div class="wrap" style="height: 48vh;">
            <!-- 좌 -->
            <div class="innerWrap w-70">
                <!-- DB현황-->        
                <div class="ht-12 p-r-5">
                    <div class="box">
                        <div class="dbStatBox pointer" v-for="el in dbConnList" :key="el" @click="movePageLink('DB_STAT', item)">
                            <div class="ib w-25 ib f-l">
                                <img src="@/assets/img/tot_db.png" art="db" class="w-80" style="object-fit: cover">
                            </div>
                            <div class="t-a-l ib w-70 p-rl">
                                <p style="bottom:20px" class="f-9 m-0 p-ab">{{el.dbConnId+'('+el.dbConnNm+')'}}</p>
                                <span style="bottom:7px" class="f-7 p-ab">{{el.dbKindCd}}</span>
                                <div style="bottom:2px" :class="{'db_bar bg_green':el.dbConnStat=='SUCC','db_bar bg_magenta':el.dbConnStat=='FAIL','box bg_gray':el.dbConnStat !='SUCC' && el.dbConnStat !='FAIL'}">
                                </div>
                            </div>
                        </div>
                        <div class="w-13 ib t-a-r f-r">
                            <div class="ib w-25 ib f-l f-r stop t-a-c m-r-5 ht-75" style="margin-top:4%; padding-top:5%" @click="clickExecStop">
                                <img v-if='toggleExecStop == "중지"' class="w-60 pointer" src="@/assets/img/btn_stop.png" art="stop" style="object-fit: cover;">
                                <img v-else class="w-60 pointer" src="@/assets/img/btn_play.png" art="stop" style="object-fit: cover; cursor:pointer;">
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 작업현황 -->
                <div class="ht-88 p-r-5 p-t-5">
                    <!-- 총 합계 건수 -->
                    <div class="w-20 ib f-l">
                        <div class="box pointer" style="padding:0px 10px;" @click="movePageLink('JOB_TOT')">
                            <div class="totContBox">
                                <div class="ht-50">
                                    <span class="f-13">{{VIEW_VAL.QRNT_KR}}</span>
                                    <span class="f-10">{{VIEW_VAL.QRNT_EN}}</span>
                                </div>
                                <div class="ht-50" style="text-align:center;">
                                    <span class="totCnt">{{formatComma(jsetTypeCntTot.qrntCnt)}}</span>
                                    <span class="f-13">{{'건'}}</span>
                                </div>
                            </div>
                            <div class="totContBox">
                                <div class="ht-50">
                                    <span class="f-13">{{VIEW_VAL.RSTR_KR}}</span>
                                    <span class="f-10">{{VIEW_VAL.RSTR_EN}}</span>
                                </div>
                                <div class="ht-50" style="text-align:center;">
                                    <span class="totCnt">{{formatComma(jsetTypeCntTot.rstrCnt)}}</span>
                                    <span class="f-13">{{'건'}}</span>
                                </div>
                            </div>
                            <div class="totContBox">
                                <div class="ht-50">
                                    <span class="f-13">{{VIEW_VAL.PDST_KR}}</span>
                                    <span class="f-10">{{VIEW_VAL.PDST_EN}}</span>
                                </div>
                                <div class="ht-50" style="text-align:center;">
                                    <span class="totCnt">{{formatComma(jsetTypeCntTot.pdstCnt)}}</span>
                                    <span class="f-13">{{'건'}}</span>
                                </div>
                            </div>
                            <div class="totContBox">
                                <div class="ht-50">
                                    <span class="f-13 c_yellow">{{VIEW_VAL.CURR_TOT_EN}}</span>
                                    <span class="f-10">{{ '' }}</span>
                                </div>
                                <div class="ht-50" style="text-align:center;">
                                    <span class="totCnt c_light_yellow">{{formatComma(jsetTypeCntTot.currTotCnt)}}</span>
                                    <span class="f-13 c_yellow">{{'건'}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 작업상태 그래프 -->
                    <div v-for="(el, index) in currJobStatTypeList" :key="index" class="w-20 ib p-l-5"> 
                        <div class="ht-83">
                            <div class="box pointer" @click="movePageLink('JOB_STAT', el)">
                                <div class="w-25 ib f-l p-10 p-l-15">
                                    <div class="graphBg">
                                        <div class="graph" :style="{ transform: 'translateY(' + (100 - el.jobStatRto) + '%)' }">                                            
                                        </div>
                                    </div>
                                </div>
                                <div class="w-70 ib f-r p-r-10">
                                    <div>
                                        <div class="graphStatbox">
                                            <div class="t-a-l w-40 ib">
                                                <p class="f-11">{{VIEW_VAL.QRNT_KR}}</p>
                                                <span class="f-8">{{VIEW_VAL.QRNT_EN}}</span>
                                            </div>
                                            <div class="t-a-r w-60 ib">
                                                <span class="f-11">{{formatComma(el.qrntCnt)}}</span>
                                            </div>
                                        </div>
                                        <div class="graphStatbox">
                                            <div class="t-a-l w-40 ib">
                                                <p class="f-11">{{VIEW_VAL.RSTR_KR}}</p>
                                                <span class="f-8">{{VIEW_VAL.RSTR_EN}}</span>
                                            </div>
                                            <div class="t-a-r w-60 ib">
                                                <span class="f-11">{{formatComma(el.rstrCnt)}}</span>
                                            </div>
                                        </div>
                                        <div class="graphStatbox">
                                            <div class="t-a-l w-40 ib">
                                                <p class="f-11">{{VIEW_VAL.PDST_KR}}</p>
                                                <span class="f-8">{{VIEW_VAL.PDST_EN}}</span>
                                            </div>
                                            <div class="t-a-r w-60 ib">
                                                <span class="f-11">{{formatComma(el.pdstCnt)}}</span>
                                            </div>
                                        </div>
                                        <div class="graphStatbox">
                                            <div class="t-a-l w-40 ib">
                                                <p class="f-11">{{VIEW_VAL.ETCP_KR}}</p>
                                                <span class="f-8">{{VIEW_VAL.ETCP_EN}}</span>
                                            </div>
                                            <div class="t-a-r w-60 ib">
                                                <span class="f-11">{{formatComma(el.etcpCnt)}}</span>
                                            </div>
                                        </div>
                                        <div class="ib ht-20 p-t-20">
                                            <div class="t-a-c">
                                                <span class="totCnt">{{el.jobStatRto}}</span>
                                                <span class="f-13">{{'%'}}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ht-17 p-t-5 pointer" @click="movePageLink('JOB_STAT', el)">
                            <div :class="{'box bg_gray':el.jobStatCd=='10','box bg_yellow':el.jobStatCd=='20','box bg_green':el.jobStatCd=='40','box bg_red':el.jobStatCd=='30'}">
                                <div class="p-t-15 p-l-15 p-r-10">
                                    <div class="t-a-l w-40 ib f-l ">
                                        <p class="f-11">{{el.jobStatNm}}</p>
                                        <span class="f-9">{{el.jobStatEn}}</span>
                                    </div>
                                    <div class="t-a-r w-60 ib f-r p-t-5">
                                        <span class="f-18 p-r-5">{{formatComma(el.totCnt)}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 우 -->
            <div class="innerWrap w-30">
                <!-- 작업현황그래프 -->
                <div class="box pointer" @click="movePageLink('JOB_STAT_CHRT')">
                    <div ref="currJobStatChartRef" style="height: 100%;"></div>
                </div>
            </div>
        </div>
        <!-- 중간 -->
        <div  class="wrap" style="height: 46vh;">
            <!-- 좌 -->
            <div class="innerWrap w-70">
                <!-- 테이블/KEYMAP현황 -->
                <div class="w-40 ib p-r-3">
                    <div class="box f-l">
                        <div class="p-5">
                            <div class="header">
                                <span>테이블 / KEYMAP현황</span>
                            </div>
                            <div class="contentBox">
                                <div class="ht-50 p-t-5 pointer" @click="movePageLink('TBL_STAT')">
                                    <div class="ht-20 p-rl m-b-5">
                                        <span class="p-ab" style="bottom:1px;">Total {{formatComma(tblKeyMapInfo.tblTotCnt)}} Tables(s)</span>
                                        <span class="p-ab f-10" style="bottom:1px; right:0px;">최종확인 : {{tblKeyMapInfo.tblFinCnfmDt}}</span>
                                    </div>
                                    <div class="w-64 ht-70 f-l borderBox">
                                        <ul>
                                            <li>
                                                <span class="dot"></span><span>테이블변경 : {{formatComma(tblKeyMapInfo.tblChngCnt)}}</span>
                                            </li>
                                            <li>
                                                <span class="dot"></span><span>컬 럼 변 경 : {{formatComma(tblKeyMapInfo.colChngCnt)}}</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="w-35 ht-70 f-r borderBox t-a-c">
                                        <div class="w-100 ht-70 m-b-5">
                                            <img style="object-fit:corver; height:40px" src="@/assets/img/tot_exclamation_mark.png">
                                        </div>
                                        <span class="f-c-b">{{tblKeyMapInfo.tblChngCnt > 0  || tblKeyMapInfo.colChngCnt > 0 ? '정보 현행화 필요' : '현행화 완료'}}</span>
                                    </div>
                                </div>
                                <div class="w-100 h-10" style="border-bottom:1px dashed rgb(150, 150, 150);"></div>
                                
                                <div class="ht-50 p-t-5 pointer" @click="movePageLink('KMAP_STAT', item)"> 
                                    <div class="ht-20 p-rl m-b-5">
                                        <span class="p-ab" style="bottom:1px;">Total {{formatComma(tblKeyMapInfo.keyMapTotCnt)}} KeyMap(s)</span>
                                        <span class="p-ab f-10" style="bottom:1px; right:0px;">최종확인 : {{tblKeyMapInfo.keyMapFinCnfmDt}}</span>
                                    </div>
                                    <div class="w-64 ht-80 f-l borderBox">
                                        <ul>
                                            <li>
                                                <span class="dot"></span><span>생성예정 : {{formatComma(tblKeyMapInfo.crtSchdCnt)}}</span>
                                            </li>
                                            <li>
                                                <span class="dot"></span><span>생성완료 : {{formatComma(tblKeyMapInfo.crtCmplCnt)}}</span>
                                            </li>
                                            <li>
                                                <span class="dot"></span><span>생성실패 : {{formatComma(tblKeyMapInfo.crtFailCnt)}}</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="w-35 ht-80 f-r borderBox t-a-c">
                                        <div class="w-100 ht-70 p-t-10 m-b-5">
                                            <img style="object-fit:corver; height:40px" src="@/assets/img/tot_exclamation_mark.png">
                                        </div>
                                        <span class="f-c-b">{{tblKeyMapInfo.crtSchdCnt > 0 || tblKeyMapInfo.crtFailCnt > 0 ? '생성 처리 필요' : '생성 처리 완료'}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 분리보관건수 -->
                <div class="w-60 ib p-l-2 p-r-5">
                    <div class="box f-r">
                        <div class="p-5">
                            <div class="header">
                                <span>분리보관 건수</span>
                            </div>
                            <div class="contentBox">
                                <div class="w-70 ib f-l">
                                    <!-- <div class="bg"> -->
                                        <div ref="qrntCntChartRef" style="width: 95%;"></div>
                                    <!-- </div> -->
                                </div>
                                <div class="w-25 p-t-5 ib">
                                    <div class="h-20 p-rl m-b-5">
                                        <span class="p-ab f-10" style="bottom:1px; right:0px;">최종일자 : {{qrntCntList[0].maxStndDt}}</span>
                                    </div>
                                    <div class="borderBox ht-60 m-b-5 pointer" @click="movePageLink('QRNT_CNT')">
                                        <div>
                                            <div class="ht-40 t-a-c p-5 dashedBox">
                                                <span class="f-12">{{'전일대비'}}</span>
                                                <p class="f-18 m-t-5">{{formatCommaSign(qrntDiff.prevDiffTot)}}</p>
                                            </div>
                                            <div class="ht-60 p-t-10 p-l-20 p-r-10">
                                                <div class="ht-30">
                                                    <span class="dot"></span><span class="f-10">Q : {{formatCommaSign(qrntDiff.prevDiffQrnt)}}</span>
                                                </div>
                                                <div class="ht-30">
                                                    <span class="dot"></span><span class="f-10">R : {{formatCommaSign(qrntDiff.prevDiffRstr)}}</span>
                                                </div>
                                                <div class="ht-30">
                                                    <span class="dot"></span><span class="f-10">D : {{formatCommaSign(qrntDiff.prevDiffPdst)}}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="borderBox ht-30 pointer" @click="movePageLink('QRNT_CNT')">
                                        <div class="ht-40 t-a-c p-10">
                                            <span class="f-12">{{'TOTAL'}}</span>
                                            <p class="f-18 m-t-5">{{formatCommaSign(jsetTypeCntTot.currTotCnt)}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 우 -->
            <div class="innerWrap w-30">
                <!-- 최근오류발생내역 -->
                <div class="box f-r">
                    <div class="p-5">
                        <div class="header">
                            <span>최근 오류발생 내역</span>
                        </div>
                        <div class="contentBox" style="overflow-y: scroll;">
                            <div class="p-t-10">
                                <div class="box">
                                    <table>
                                        <tbody>
                                            <template v-if="rcntErrOccrList.length > 0">
                                                <tr class="pointer" v-for="item in rcntErrOccrList" :key="item" @click="movePageLink('RCNT_ERR', item)" style="border-bottom:1px dashed rgb(150, 150, 150);">
                                                    <td class="h-20" style="padding: 5px; font-size:0.9em; text-align: left;"> {{ item.evntSrcNm }}</td>
                                                    <td class="h-20" style="padding: 5px; font-size:0.9em; text-align: left;"> {{ item.evntDivNm }}</td>
                                                    <td class="h-20" style="padding: 5px; font-size:0.9em; text-align: center;"> {{ item.regiDtFm }}</td>
                                                    <td class="h-20" style="padding: 5px; font-size:0.9em; text-align: center;"> {{ item.regiTmFm }}</td>
                                                </tr>
                                            </template>
                                            <template v-else>
                                                <tr>
                                                    <td class="h-20" style="text-align: center;">오류 발생 내역이 없습니다.</td>
                                                </tr>
                                            </template>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>                    
                </div>
            </div>
        </div>
        <!-- 하단 -->
        <div  class="wrap" style="height: 4.9vh;">
            <div class="innerWrap w-100">
                <div class="box">
                    <!-- 등록법령 -->
                    <div class="b_wrapBox f-l pointer" style="padding-left: 20px;" @click="movePageLink('TOT_REGI')">
                        <div class="b_imgWrap">
                            <img class="b_img" src="@/assets/img/tot_regi.png">
                        </div>
                        <div class="b_textWrap">
                            <p class="b_text_ko">{{VIEW_VAL.REGI_LAWS_KR}}</p>
                            <span class="f-9">{{VIEW_VAL.REGI_LAWS_EN}}</span>
                        </div>
                        <div class="b_cntWrap">
                            <p class="f-18" style="text-align: center;">{{formatComma(bttmTotInfo.blawCnt)}}</p>
                        </div>
                    </div>
                    <!-- 개인정보항목 -->
                    <div class="b_wrapBox f-l pointer" style="padding-left: 20px;" @click="movePageLink('TOT_PRSN')">
                        <div class="b_imgWrap">
                            <img class="b_img" src="@/assets/img/tot_person.png">
                        </div>
                        <div class="b_textWrap">
                            <p class="b_text_ko">{{VIEW_VAL.PRSN_INFO_KR}}</p>
                            <span class="f-9">{{VIEW_VAL.PRSN_INFO_EN}}</span>
                        </div>
                        <div class="b_cntWrap">
                            <p class="f-18" style="text-align: center;">{{formatComma(bttmTotInfo.pitmCnt)}}</p>
                        </div>
                    </div>
                    <!-- 관련정책 -->
                    <div class="b_wrapBox f-l pointer" style="padding-left: 20px;" @click="movePageLink('TOT_PLCY')">
                        <div class="b_imgWrap">
                            <img class="b_img" src="@/assets/img/tot_rel_plcy.png">
                        </div>
                        <div class="b_textWrap">
                            <p class="b_text_ko">{{VIEW_VAL.RLTD_PLCY_KR}}</p>
                            <span class="f-9">{{VIEW_VAL.RLTD_PLCY_EN}}</span>
                        </div>
                        <div class="b_cntWrap">
                            <p class="f-18" style="text-align: center;">{{formatComma(bttmTotInfo.plcyCnt)}}</p>
                        </div>
                    </div>
                    <!-- 작업셋 -->
                    <div class="b_wrapBox f-l pointer" style="padding-left: 20px;" @click="movePageLink('TOT_JSET')">
                        <div class="b_imgWrap">
                            <img class="b_img" src="@/assets/img/tot_jset.png">
                        </div>
                        <div class="b_textWrap">
                            <p class="b_text_ko">{{VIEW_VAL.JOB_SET_KR}}</p>
                            <span class="f-9">{{VIEW_VAL.JOB_SET_EN}}</span>
                        </div>
                        <div class="b_cntWrap">
                            <p class="f-18" style="text-align: center;">{{formatComma(bttmTotInfo.jsetCnt)}}</p>
                        </div>
                    </div>
                    <!-- 단위작업 -->
                    <div class="b_wrapBox f-l pointer" style="padding-left: 20px;" @click="movePageLink('TOT_UNIT')">
                        <div class="b_imgWrap">
                            <img class="b_img" src="@/assets/img/tot_unit_job.png">
                        </div>
                        <div class="b_textWrap" style="padding-left: 20px;">
                            <p class="b_text_ko">{{VIEW_VAL.UNIT_JOB_KR}}</p>
                            <span class="f-9">{{VIEW_VAL.UNIT_JOB_EN}}</span>
                        </div>
                        <div class="b_cntWrap">
                            <p class="f-18" style="text-align: center;">{{formatComma(bttmTotInfo.unitJobCnt)}}</p>
                        </div>
                    </div>
                    <!-- 대상테이블 -->
                    <div class="b_wrapBox f-l pointer" style="padding-left: 20px;" @click="movePageLink('TOT_TBL')">
                        <div class="b_imgWrap">
                            <img class="b_img" src="@/assets/img/tot_trgt_tbl.png">
                        </div>
                        <div class="b_textWrap">
                            <p class="b_text_ko">{{VIEW_VAL.TRGT_TBL_KR}}</p>
                            <span class="f-9">{{VIEW_VAL.TRGT_TBL_EN}}</span>
                        </div>
                        <div class="b_cntWrap">
                            <p class="f-18" style="text-align: center;">{{formatComma(bttmTotInfo.trgtCnt)}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { createApp, h, reactive, ref }      from 'vue';
import App                                  from '@/App.vue';

import * as echarts                         from 'echarts/core';
import {
    TitleComponent,
    // ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    DataZoomComponent
}                                           from 'echarts/components';
import { BarChart, LineChart, GaugeChart }  from 'echarts/charts';
import { UniversalTransition }              from 'echarts/features';
import { CanvasRenderer }                   from 'echarts/renderers';

echarts.use([
  TitleComponent,
//   ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  BarChart,
  LineChart,
  GaugeChart,
  CanvasRenderer,
  UniversalTransition
]);

export default {
    setup() {
        // 화면에 표현할 상수 정의
        const VIEW_VAL = reactive({
            QRNT_KR:'격리',
            QRNT_EN:'QURANTINE',
            RSTR_KR:'복원',
            RSTR_EN:'RESTORATION',
            PDST_KR:'파기',
            PDST_EN:'DESTRUCTION',
            ETCP_KR:'기타',
            ETCP_EN:'ETC.JOB',

            CURR_TOT_EN: 'CURRENT TOTAL',

            REGI_LAWS_KR: '등록법령',
            REGI_LAWS_EN: 'REGISTERED LAWS',
            PRSN_INFO_KR: '개인정보항목',
            PRSN_INFO_EN: 'PERSIONAL INFORMATION',
            RLTD_PLCY_KR: '관련정책',
            RLTD_PLCY_EN: 'RELATED POLYCIES',
            JOB_SET_KR: '작업셋',
            JOB_SET_EN: 'JOB SETS',
            UNIT_JOB_KR: '단위작업',
            UNIT_JOB_EN: 'UNIT JOBS',
            TRGT_TBL_KR: '대상테이블',
            TRGT_TBL_EN: 'TARGET TABLES',

            // SCHD_KR:'실행예정',
            // SCHD_EN:'SCHEDULED',
            // RUNN_KR:'실행중',
            // RUNN_EN:'RUNNING',
            // CMPL_KR:'정상완료',
            // CMPL_EN:'COMPLETE',
            // HAFA_KR:'중지·오류',
            // HAFA_EN:'HALT & FAULT',
        });
        const qrntCntChartRef = ref(null);
        const currJobStatChartRef = ref(null);
        return {
            VIEW_VAL,
            qrntCntChartRef,
            currJobStatChartRef,
        }
    },
    data() {
		return {
                    
            // DB 연결 리스트
            dbConnList: [{
                dbConnId: 'M1',
                dbConnNm: '솔루션DB',
                dbKindCd: 'POSTGR',
                dbConnStat: 'SUCC',
            }],
            
            // 작업셋유형별 건수 통계
            jsetTypeCntTot: {
                maxStndDt: '',
                qrntCnt: 0,
                rstrCnt: 0,
                pdstCnt: 0,
                currTotCnt: 0,
            },

            // 현재 작업상태,유형별 리스트
            currJobStatTypeList: [{
                jobStatCd: '',
                jobStatNm: '',
                jobStatEn: '',
                qrntCnt: 0,
                rstrCnt: 0,
                pdstCnt: 0,
                etcpCnt: 0,
                totCnt: 0,
                jobStatRto: 0,
            },{
                jobStatCd: '',
                jobStatNm: '',
                jobStatEn: '',
                qrntCnt: 0,
                rstrCnt: 0,
                pdstCnt: 0,
                etcpCnt: 0,
                totCnt: 0,
                jobStatRto: 0,
            },{
                jobStatCd: '',
                jobStatNm: '',
                jobStatEn: '',
                qrntCnt: 0,
                rstrCnt: 0,
                pdstCnt: 0,
                etcpCnt: 0,
                totCnt: 0,
                jobStatRto: 0,
            },{
                jobStatCd: '',
                jobStatNm: '',
                jobStatEn: '',
                qrntCnt: 0,
                rstrCnt: 0,
                pdstCnt: 0,
                etcpCnt: 0,
                totCnt: 0,
                jobStatRto: 0,
            }],

            // 테이블/키맵 현황
            tblKeyMapInfo: {
                tblTotCnt: 0,
                tblChngCnt: 0,
                colChngCnt: 0,
                tblFinCnfmDt: '',
                keyMapTotCnt: 0,
                crtSchdCnt: 0,
                crtCmplCnt: 0,
                crtFailCnt: 0,
                keyMapFinCnfmDt: '',
            },

            // 분리보관 건수 리스트
            qrntCntList: [{
                maxStndDt: '',
                stndDt: '',
                totQrntCnt: 0,
                qrntCnt: 0,
                rstrCnt: 0,
                pdstCnt: 0,
            }],

            // 최근 오류발생 리스트
            rcntErrOccrList: [{
                evntSrcNm: '',
                evntDivNm: '',
                regiDtFm: '',
                regiTmFm: '',
            }],

            // 하단 종합 정보
            bttmTotInfo: {
                blawCnt: 0,
                pitmCnt: 0,
                plcyCnt: 0,
                jsetCnt: 0,
                unitJobCnt: 0,
                trgtCnt: 0,
            },

            // // DB 연결 리스트
            // dbConnList: [{
            //     dbConnId: 'M1',
            //     dbConnNm: '솔루션DB',
            //     dbKindCd: 'POSTGR',
            //     dbConnStat: 'SUCC',
            // },
            // {
            //     dbConnId: 'Q1',
            //     dbConnNm: '격리보관',
            //     dbKindCd: 'ORACLE',
            //     dbConnStat: 'SUCC',
            // },
            // {
            //     dbConnId: 'O1',
            //     dbConnNm: '업무원장01',
            //     dbKindCd: 'MYSQL',
            //     dbConnStat: 'SUCC',
            // },
            // {
            //     dbConnId: 'O2',
            //     dbConnNm: '업무원장02',
            //     dbKindCd: 'ORACLE',
            //     dbConnStat: 'FAIL',
            // }],
            
            // // 작업셋유형별 건수 통계
            // jsetTypeCntTot: {
            //     maxStndDt: '9999-12-31',
            //     qrntCnt: 12345678,
            //     rstrCnt: 6789,
            //     pdstCnt: 56789,
            //     currTotCnt: 13345678,
            // },

            // // 현재 작업상태,유형별 리스트
            // currJobStatTypeList: [{
            //     jobStatCd: '10',
            //     jobStatNm: '실행예정',
            //     jobStatEn: 'SCHEDULED',
            //     qrntCnt: 111111,
            //     rstrCnt: 111222,
            //     pdstCnt: 111333,
            //     etcpCnt: 111444,
            //     totCnt: 111555,
            //     jobStatRto: 25,
            // },
            // {
            //     jobStatCd: '20',
            //     jobStatNm: '실행중',
            //     jobStatEn: 'RUNNING',
            //     qrntCnt: 222111,
            //     rstrCnt: 222222,
            //     pdstCnt: 222333,
            //     etcpCnt: 222444,
            //     totCnt: 222555,
            //     jobStatRto: 14,
            // },
            // {
            //     jobStatCd: '40',
            //     jobStatNm: '정상완료',
            //     jobStatEn: 'COMPLETE',
            //     qrntCnt: 333111,
            //     rstrCnt: 333222,
            //     pdstCnt: 33333,
            //     etcpCnt: 333444,
            //     totCnt: 333555,
            //     jobStatRto: 55,
            // },
            // {
            //     jobStatCd: '30',
            //     jobStatNm: '중지·오류',
            //     jobStatEn: 'HALT & FAULT',
            //     qrntCnt: 444111,
            //     rstrCnt: 444222,
            //     pdstCnt: 444333,
            //     etcpCnt: 444444,
            //     totCnt: 444555,
            //     jobStatRto: 6,
            // }],
            // 
            // // 테이블/키맵 현황
            // tblKeyMapInfo: {
            //     tblTotCnt: 127,
            //     tblChngCnt: 12,
            //     colChngCnt: 333,
            //     tblFinCnfmDt: '2023-11-22',
            //     keyMapTotCnt: 150,
            //     crtSchdCnt: 99,
            //     crtCmplCnt: 20,
            //     crtFailCnt: 5,
            //     keyMapFinCnfmDt: '2023-11-22',
            // },
            // 
            // // 분리보관 건수 리스트
            // qrntCntList: [{
            //     maxStndDt: '9999-12-31',
            //     stndDt: '2023-11-17',
            //     qrntCnt: 99999,
            // },
            // {
            //     maxStndDt: '9999-12-31',
            //     stndDt: '2023-11-18',
            //     qrntCnt: 111111,
            // },
            // {
            //     maxStndDt: '9999-12-31',
            //     stndDt: '2023-11-19',
            //     qrntCnt: 123123,
            // },
            // {
            //     maxStndDt: '9999-12-31',
            //     stndDt: '2023-11-20',
            //     qrntCnt: 122222,
            // },
            // {
            //     maxStndDt: '9999-12-31',
            //     stndDt: '2023-11-21',
            //     qrntCnt: 213213,
            // },
            // {
            //     maxStndDt: '9999-12-31',
            //     stndDt: '2023-11-22',
            //     qrntCnt: 111111,
            // },
            // {
            //     maxStndDt: '9999-12-31',
            //     stndDt: '2023-11-23',
            //     qrntCnt: 122222,
            // },
            // {
            //     maxStndDt: '9999-12-31',
            //     stndDt: '2023-11-24',
            //     qrntCnt: 133333,
            // },
            // {
            //     maxStndDt: '9999-12-31',
            //     stndDt: '2023-11-25',
            //     qrntCnt: 112222,
            // },
            // {
            //     maxStndDt: '9999-12-31',
            //     stndDt: '2023-11-26',
            //     qrntCnt: 144444,
            // }],

            // // 최근 오류발생 리스트
            // rcntErrOccrList: [{
            //     jsetNo: 'JS-P001-Q001',
            //     jsetNm: '휴면고객-격리-ST고객원장',
            //     jobStrtDt: '2023-11-22',
            //     jobStrtTm: '13:04:24',
            // },
            // {
            //     jsetNo: 'JS-P001-Q001',
            //     jsetNm: '휴면고객-격리-ST고객원장',
            //     jobStrtDt: '2023-11-22',
            //     jobStrtTm: '13:04:24',
            // },
            // {
            //     jsetNo: 'JS-P001-Q001',
            //     jsetNm: '휴면고객-격리-ST고객원장',
            //     jobStrtDt: '2023-11-22',
            //     jobStrtTm: '13:04:24',
            // },
            // {
            //     jsetNo: 'JS-P001-Q001',
            //     jsetNm: '휴면고객-격리-ST고객원장',
            //     jobStrtDt: '2023-11-22',
            //     jobStrtTm: '13:04:24',
            // },
            // {
            //     jsetNo: 'JS-P001-Q001',
            //     jsetNm: '휴면고객-격리-ST고객원장',
            //     jobStrtDt: '2023-11-22',
            //     jobStrtTm: '13:04:24',
            // }],

            qrntCntChart: null,
            qrntCntChartOption: null,
            qrntCntChartData: {
                maxCntValue: 0,
                minCntValue: 0,
                MAX_CNT: 7,
                SET_TIME: 2000,
                orgQrntCntList: [],
                orgQrntDtList: [],
                showQrntCntList: [],
                showQrntDtList: [],
            },

            currJobStatChart: null,
            currJobStatChartOption: null,
            currJobStatChartData: {
                MAX_CNT: 7,
                SET_TIME: 5000,
                orgQrntCntList: [],
                orgQrntDtList: [],
                showQrntCntList: [],
                showQrntDtList: [],
            },
            currJobStatChartGaugeData: null,

            qrntDiff: {
                prevDiffTot: 0,
                prevDiffQrnt: 0,
                prevDiffRstr: 0,
                prevDiffPdst: 0,
            },

            interval: {
                qrntCntIntervalId: null,
                qrntCntSetTimeoutId: null,
                group1: null,
                group2: null,
                group3: null,
            },

            intervalIds: [],

            isInitSelect: true,

            toggleExecStop: '중지',

            currDate: '0000-00-00'
        }
    },
    methods: {
        init() {            
            this.currJobStatChart   = echarts.init(this.currJobStatChartRef);
            this.qrntCntChart       = echarts.init(this.qrntCntChartRef);
            this.initCurrJobStatChart();
            this.selectTotMonGroup1();
            this.selectTotMonGroup2();
            this.selectTotMonGroup3();
            this.selectTotMonGroup4();
            this.startInterval();

            this.currDate = this.DateUtil.getCurrDate('YYYY-MM-DD');
        },
        startInterval() {
            this.setIntervalGroup1();
            this.setIntervalGroup2();
            this.setIntervalGroup3();
        },
        // 최근 오류발생 내역 행 클릭시 페이지 이동
        clickRcntErrOccrList(row) {
            const params = {
                lnkDiv      : 'TOT_MON',
                jsetNo      : row.jsetNo,
                jobStrtDt   : row.jobStrtDt,
                jobEndDt    : row.jobStrtDt,
            }
            this.CmonUtil.setPageLink('R1090', params);
        },        
        // 영역별 페이지 이동
        movePageLink(div, data) {
            if (div === 'RCNT_ERR') {
                const params = {
                    lnkDiv      : 'TOT_MON',
                    evntNo      : data.evntNo,
                    evntSrcCd   : data.evntSrcCd,
                    evntDivCd   : data.evntDivCd,
                    evntDtFr    : data.regiDtFm,
                    evntDtTo    : data.regiDtFm,
                }
                this.CmonUtil.setPageLink('R1090', params);
            } else if (div === 'DB_STAT') {
                this.CmonUtil.setPageLink('E1020', data);
            } else if (div === 'JOB_TOT') {
                this.CmonUtil.setPageLink('R2130')
            } else if (div === 'JOB_STAT') {
                this.CmonUtil.setPageLink('R1012');
            } else if (div === 'JOB_STAT_CHRT') {
                this.CmonUtil.setPageLink('R1020');
            } else if (div === 'TBL_STAT') {
                this.CmonUtil.setPageLink('E1090'); //테이블명세
            } else if (div === 'KMAP_STAT') {
                //this.alert('각 업무 화면 페이지링크 걸어주세요. 키맵 현행화?');
                this.CmonUtil.setPageLink('P1033');
            } else if (div === 'QRNT_CNT') {
                this.CmonUtil.setPageLink('R2010');
            } else if (div === 'TOT_REGI') {
                //this.alert('각 업무 화면 페이지링크 걸어주세요. 등록법령?');
                this.CmonUtil.setPageLink('P1010');
            } else if (div === 'TOT_PRSN') {
                //this.alert('각 업무 화면 페이지링크 걸어주세요. 개인정보항목?');
                this.CmonUtil.setPageLink('P1020');
            } else if (div === 'TOT_PLCY') {
                //this.alert('각 업무 화면 페이지링크 걸어주세요. 관련정책?');
                this.CmonUtil.setPageLink('P1030');
            } else if (div === 'TOT_JSET') {
                this.CmonUtil.setPageLink('P2010');
            } else if (div === 'TOT_UNIT') {
                this.CmonUtil.setPageLink('P2020');
            } else if (div === 'TOT_TBL') {
                // this.alert('각 업무 화면 페이지링크 걸어주세요. 대상테이블?');
                this.CmonUtil.setPageLink('P1033');
            } else {
                // this.alert('각 업무 화면 페이지링크 걸어주세요. 이 알럿이 떴으면 장치원한테 알려주세요.');
            }
        },
        selectTotMonGroup1() {
            let params = null;
            this.doPost('/rept/stat/totMon/selectTotMonGroup1.hb', params, false).then((res)=> {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    this.setDataGroup1(result.rtnData);
                } else {
                    this.alert(result.rtnMsg);
                }
            });
        },
        selectTotMonGroup2() {
            let params = null;
            this.doPost('/rept/stat/totMon/selectTotMonGroup2.hb', params, false).then((res)=> {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    this.setDataGroup2(result.rtnData);
                } else {
                    this.alert(result.rtnMsg);
                }
            });
        },
        selectTotMonGroup3() {
            let params = null;
            this.doPost('/rept/stat/totMon/selectTotMonGroup3.hb', params, false).then((res)=> {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    this.setDataGroup3(result.rtnData);
                } else {
                    this.alert(result.rtnMsg);
                }
            });
        },
        // 분리보관 건수 조회
        selectTotMonGroup4() {
            let params = null;
            this.doPost('/rept/stat/totMon/selectTotMonGroup4.hb', params, false).then((res)=> {
                let result = res.data;
                if (result.rtnCd == '0000') {
                    this.setDataGroup4(result.rtnData);
                } else {
                    this.alert(result.rtnMsg);
                }
            });
        },
        // 5초 마다 조회
        setIntervalGroup1() {
            clearInterval(this.interval.group1);
            this.interval.group1 = setInterval(()=>{
                this.selectTotMonGroup1();
            }, 5000);
        },
        // 30초 마다 조회
        setIntervalGroup2() {
            clearInterval(this.interval.group2);
            this.interval.group2 = setInterval(()=>{
                this.selectTotMonGroup2();
            }, 30000);
        },
        // 300초 마다 조회
        setIntervalGroup3() {
            clearInterval(this.interval.group3);
            this.interval.group3 = setInterval(()=>{
                this.selectTotMonGroup3();
            }, 60000); // jcw 300초를 임시로 60초로 변경하여 테스트 중
        },
        setDataGroup1(res) {
            this.currJobStatTypeList    = res.currJobStatTypeList;
            this.rcntErrOccrList        = res.rcntErrOccrList;
            this.updateCurrJobStatChart();
        },
        setDataGroup2(res) {
            this.dbConnList = res.dbConnList;
        },
        setDataGroup3(res) {
            this.jsetTypeCntTot = res.jsetTypeCntTot;
            this.tblKeyMapInfo  = res.tblKeyMapInfo;
            this.bttmTotInfo    = res.bttmTotInfo;
        },
        setDataGroup4(res) {
            let qrntCntList = [];
            qrntCntList = res.qrntCntList;

            let maxStndDt = this.currDate;
            if (qrntCntList.length > 0) {
                maxStndDt = qrntCntList[0].maxStndDt;
            }
            
            const initZero = {
                maxStndDt   : maxStndDt,
                totQrntCnt  : 0,
                qrntCnt     : 0,
                rstrCnt     : 0,
                pdstCnt     : 0,
                stndDt      : '0000-00-00'
            }
            const orgLen = res.qrntCntList.length;
            if (orgLen < 9) {
                for (let i = 2; (i - orgLen) > 0; i--) {
                    qrntCntList.unshift(initZero);
                }
            }
            this.qrntCntList = qrntCntList;

            this.updateQrntCntChartData();
        },
        updateQrntCntChartData() {
            const orgQrntData   = this.qrntCntList;
            const showQrntData  = orgQrntData.slice(0, this.qrntCntChartData.MAX_CNT);

            const idx  = orgQrntData.length-1;
            const pIdx = orgQrntData.length-2;
            this.qrntDiff.prevDiffTot  = orgQrntData[idx].totQrntCnt - orgQrntData[pIdx].totQrntCnt;
            this.qrntDiff.prevDiffQrnt = orgQrntData[idx].qrntCnt    - orgQrntData[pIdx].qrntCnt;
            this.qrntDiff.prevDiffRstr = orgQrntData[idx].rstrCnt    - orgQrntData[pIdx].rstrCnt;
            this.qrntDiff.prevDiffPdst = orgQrntData[idx].pdstCnt    - orgQrntData[pIdx].pdstCnt;

            this.qrntCntChartData.orgQrntCntList  = [];
            this.qrntCntChartData.orgQrntDtList   = [];
            this.qrntCntChartData.showQrntCntList = [];
            this.qrntCntChartData.showQrntDtList  = [];
            
            orgQrntData.forEach(item => {
                this.qrntCntChartData.orgQrntCntList.push(item.totQrntCnt);
                this.qrntCntChartData.orgQrntDtList.push(item.stndDt);
            });
            showQrntData.forEach(item => {
                this.qrntCntChartData.showQrntCntList.push(item.totQrntCnt);
                this.qrntCntChartData.showQrntDtList.push(item.stndDt);
            });
            this.qrntCntChartData.maxCntValue = this.floorMinMaxCntValue(Math.max(...this.qrntCntChartData.orgQrntCntList) * 1.1);
            this.qrntCntChartData.minCntValue = this.floorMinMaxCntValue(Math.min(...this.qrntCntChartData.orgQrntCntList) * 1.1);
            if (this.qrntCntChartData.minCntValue > 0) {
                this.qrntCntChartData.minCntValue = 0;
            }
            if (this.isInitSelect) {
                this.initQrntCntChart();
                this.isInitSelect = false;
            }
        },
        initCurrJobStatChart() {
            this.currJobStatChartGaugeData = [
            {
                value: 0,
                name: '실행예정\r\nScheduled\r\n',
                title: {
                    offsetCenter: ['0%', '-48%'],
                    color: 'white',
                    fontFamily : 'San Serif',
                    fontSize : '14px'
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: ['0%', '-35%'],
                    color: 'white',
                    fontSize: '15px',
                    fontWeight:'light',
                    borderColor: 'white',
                    borderRadius:5.5,
                    borderWidth:0.9,
                    backgroundColor: '#595959'
                },
                itemStyle: {
                    color: 'white',
                    borderWidth : 1.0,
                    borderColor:'white'
                }
            },
            {
                value: 0,
                name: '정상완료\r\nComplete\r\n',
                title: {
                    offsetCenter: ['0%', '-8%'],
                    color: 'white',
                    fontFamily : 'San Serif',
                    fontSize : '14px'
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: ['0%', '5.5%'],
                    color: '#92D050',
                    fontSize: '15px',
                    fontWeight:'light',
                    borderColor: '#92D050',
                    borderRadius:5.5,
                    borderWidth:0.9,
                    backgroundColor: '#595959'
                },
                itemStyle: {
                    color: '#ffffff',
                    borderWidth : 1.0,
                    borderColor:'#92D050'
                }
            },
            {
                value: 0,
                name: '중지·오류\r\nHalt&Fault\r\n',
                title: {
                    offsetCenter: ['0%', '32%'],
                    color: 'white',
                    fontFamily : 'San Serif',
                    fontSize : '14px'
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: ['0%', '46%'],
                    color: '#FF9F9F',
                    fontSize: '15px',
                    fontWeight:'light',
                    borderColor: '#FF9F9F',
                    borderRadius:5.5,
                    borderWidth:0.9,
                    backgroundColor: '#595959'
                },
                itemStyle: {
                    color: '#ffffff',
                    borderWidth : 1.0,
                    borderColor:'#FF9F9F'
                }
            }
            ];
            
            this.currJobStatChartOption = {
            backgroundColor: '#595959',
            series: [
                {
                type: 'gauge',
                startAngle: 90,
                endAngle: -270,
                pointer: {
                    show: false
                },
                progress: {
                    show: true,
                    overlap: false,
                    roundCap: true,
                    clip: false
                },
                axisLine: {
                    lineStyle: {
                        width: 42,
                        color: [
                            [1, '#BFBFBF']
                        ]
                    }
                },
                splitLine: {
                    show: false,
                    distance: 0,
                    length: 10
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false,
                    distance: 50
                },
                data: this.currJobStatChartGaugeData,
                title: {
                    fontSize: 20
                },
                radius: '93%',
                detail: {
                    width: 120,
                    height: 25,
                    fontSize: 22,
                    color: 'aqua',
                    backgroundColor: 'pink',
                    borderRadius: 20,
                    borderWidth: 0.5,
                    formatter: '{value}%'
                }
                }
            ]
            };

            if (this.currJobStatChartOption && typeof this.currJobStatChartOption === 'object' && this.currJobStatChart) {
                this.currJobStatChart.setOption(this.currJobStatChartOption);
            } else {
                return false;
            }
            if (this.currJobStatChart) {
                window.addEventListener('resize', this.currJobStatChart.resize);
            }
            
        },        
        updateCurrJobStatChart() {
            let sumTotCnt = 0;

            this.currJobStatTypeList.forEach((val)=> {
                sumTotCnt += val.totCnt;
            });

            if (sumTotCnt != 0) {
                this.currJobStatTypeList.forEach((val, idx)=> {
                    this.currJobStatTypeList[idx].jobStatRto = parseFloat((val.totCnt / sumTotCnt * 100).toFixed(1));
                });
            } 
            // this.testFunction();
            this.currJobStatChartGaugeData[0].value = this.currJobStatTypeList[0].jobStatRto;
            this.currJobStatChartGaugeData[1].value = this.currJobStatTypeList[2].jobStatRto;
            this.currJobStatChartGaugeData[2].value = this.currJobStatTypeList[3].jobStatRto;
            if (this.currJobStatChartOption && typeof this.currJobStatChartOption === 'object' && this.currJobStatChart) {
                this.currJobStatChart.setOption({
                    series: [
                    {
                        data: this.currJobStatChartGaugeData,
                        pointer: {
                            show: false
                        }
                    }
                    ]
                });
            } else {
                return false;
            }
            
        },        
        testFunction() {
            this.currJobStatTypeList[0].jobStatRto = +(Math.random() * 100).toFixed(0);
            this.currJobStatTypeList[1].jobStatRto = +(Math.random() * 100).toFixed(0);
            this.currJobStatTypeList[2].jobStatRto = +(Math.random() * 100).toFixed(0);
            this.currJobStatTypeList[3].jobStatRto = +(Math.random() * 100).toFixed(0);
        },
        initQrntCntChart() {
            const maxCntValue = this.qrntCntChartData.maxCntValue;
            const minCntValue = this.qrntCntChartData.minCntValue;

            this.qrntCntChartOption = {
                color : '#ffffff',
                backgroundColor:'#595959',
                title: {
                    show : false,
                    text: 'QRNT CNT DATA'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#283b56'
                        }
                    }
                },
                legend: {show:false},
                dataZoom: {
                    show: true,
                    start: 0,
                    end: 100
                },
                xAxis: [
                    {
                    type: 'category',
                    boundaryGap: true,
                    data: this.qrntCntChartData.showQrntDtList
                    },
                    {
                    type: 'category',
                    boundaryGap: true,
                    data: this.qrntCntChartData.showQrntDtList
                    }
                ],
                yAxis: [
                    {
                    type: 'value',
                    scale: true,
                    // name: 'Count1',
                    max: maxCntValue,
                    min: minCntValue,
                    boundaryGap: [0.2, 0.2]
                    },
                    {
                    type: 'value',
                    scale: true,
                    // name: 'Count2',
                    max: maxCntValue,
                    min: minCntValue,
                    boundaryGap: [0.2, 0.2]
                    }
                ],
                series: [
                    {
                    name: 'qrntCnt Bar',
                    type: 'bar',
                    barWidth:20,
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    data: this.qrntCntChartData.showQrntCntList
                    },
                    {
                    name: 'qrntCnt Line',
                    type: 'line',
                    data: this.qrntCntChartData.showQrntCntList
                    }
                ]
            };
            
            if (this.qrntCntChartOption && typeof this.qrntCntChartOption === 'object' && this.qrntCntChart) {
                this.qrntCntChart.setOption(this.qrntCntChartOption);                
                this.qrntSetInterval(false);
            } else {
                return false;
            }
            if (this.qrntCntChart) {
                window.addEventListener('resize', this.qrntCntChart.resize);
            }            
            
        },        
        qrntSetInterval(isRecursive) {
            let currIdx = this.qrntCntChartData.MAX_CNT;
            const setTime = this.qrntCntChartData.SET_TIME;
            const orgQrntLength = this.qrntCntList.length;

            clearInterval(this.interval.qrntCntIntervalId);
            this.interval.qrntCntIntervalId = setInterval(() => {
                
                if (!this.qrntCntChart) {
                    clearInterval(this.interval.qrntCntIntervalId);
                    return false;
                }
                if (orgQrntLength > currIdx) {
                    if (!isRecursive) {
                        this.qrntCntChartData.showQrntCntList.shift();
                        this.qrntCntChartData.showQrntCntList.push(this.getCurrQrntCnt(currIdx));
                        this.qrntCntChartData.showQrntDtList.shift();
                        this.qrntCntChartData.showQrntDtList.push(this.getCurrQrntDt(currIdx));
                    }
                }
                if (this.qrntCntChartOption && typeof this.qrntCntChartOption === 'object' && this.qrntCntChart) {
                    this.qrntCntChart.setOption({
                        xAxis:  [{data: this.qrntCntChartData.showQrntDtList}   ,{data: this.qrntCntChartData.showQrntDtList}],
                        yAxis:  [{max: this.qrntCntChartData.maxCntValue, min: this.qrntCntChartData.minCntValue}
                                ,{max: this.qrntCntChartData.maxCntValue, min: this.qrntCntChartData.minCntValue}],
                        series: [{data: this.qrntCntChartData.showQrntCntList}  ,{data: this.qrntCntChartData.showQrntCntList}]
                    });
                } else {
                    return false;
                }
                if (orgQrntLength > 8) {
                    if ((orgQrntLength -1) == currIdx) {
                        this.selectTotMonGroup4();
                        clearInterval(this.interval.qrntCntIntervalId);
                        this.interval.qrntCntSetTimeoutId = setTimeout(()=> {
                            this.qrntSetInterval(true);
                        }, 5000);
                    }
                } else if (orgQrntLength == 8) {
                    if (orgQrntLength == currIdx) {
                        this.selectTotMonGroup4();
                        clearInterval(this.interval.qrntCntIntervalId);
                        this.interval.qrntCntSetTimeoutId = setTimeout(()=> {
                            this.qrntSetInterval(true);
                        }, 5000);
                    }
                } else {
                    this.selectTotMonGroup4();
                    clearInterval(this.interval.qrntCntIntervalId);
                    this.interval.qrntCntSetTimeoutId = setTimeout(()=> {
                        this.qrntSetInterval(true);
                    }, 10000);
                }
                if (!isRecursive) {
                    currIdx++;
                }
                isRecursive = false;

            }, setTime);
        },
        getCurrQrntCnt(currIdx) {
            return this.qrntCntChartData.orgQrntCntList[currIdx];
        },
        getCurrQrntDt(currIdx) {
            return this.qrntCntChartData.orgQrntDtList[currIdx];
        },
        floorMinMaxCntValue(num) {
            let rtnNum = num;
            if (num > 0 && num < 100) {
                rtnNum = Math.floor(num / 1) * 1;
            } else if (num >= 100 && num < 1000) {
                rtnNum = Math.floor(num / 10) * 10;
            } else if (num >= 1000 && num < 10000) {
                rtnNum = Math.floor(num / 100) * 100;
            } else if (num >= 10000 && num < 100000) {
                rtnNum = Math.floor(num / 1000) * 1000;
            } else if (num >= 100000 && num < 1000000) {
                rtnNum = Math.floor(num / 10000) * 10000;
            } else if (num >= 1000000) {
                rtnNum = Math.floor(num / 100000) * 100000;
            } else if (num < 0 && num >= -100) {
                rtnNum = Math.floor(num / 1) * 1;
            } else if (num < 100 && num >= -1000) {
                rtnNum = Math.floor(num / 10) * 10;
            } else if (num < 1000 && num >= -10000) {
                rtnNum = Math.floor(num / 100) * 100;
            } else if (num < -10000 && num > -100000) {
                rtnNum = Math.floor(num / 1000) * 1000;
            } else if (num < -100000) {
                rtnNum = Math.floor(num / 10000) * 10000;
            }
            return rtnNum;
        },
        formatComma(num) {
            let rtnVal = null;
            if (this.ValdUtil.isNotNull(num)) {
                rtnVal = num.toLocaleString();
                
            } else {
                rtnVal = num;
            }
            return rtnVal;
        },        
        formatCommaSign(num) {
            if (this.ValdUtil.isNotNull(num)) {
                const sign = num >= 0 ? '+' : '-';
                return `${sign}${Math.abs(num).toLocaleString()}`;
            }
            return num;
        },
        openWindow() {
            const windowPopup = window.open('/popup/totMon', '종합현황', 'fullscreen=yes');
            const mountElement = document.createElement('div');
            const appInstance = createApp({
                render: () => h(App),
            });
            appInstance.mount(mountElement);
            windowPopup.document.body.appendChild(mountElement);
        },
        openWindowPop() {
            const popOpt = `top=0, left=0, width=${window.screen.width}, height=${window.screen.height}, fullscreen=yes`;
            window.open('/popup/totMonPop', '종합현황', popOpt);
        },
        clickExecStop() {
            if (this.toggleExecStop == '실행') {
                this.selectTotMonGroup4();
                this.startInterval();
                this.qrntSetInterval(true);
            } else {
                this.clearIntervalAll();
            }      
            this.toggleExecStop = this.toggleExecStop === '실행' ? '중지' : '실행';      
        },
        clearIntervalAll() {
            clearTimeout(this.interval.qrntCntSetTimeoutId);
            clearInterval(this.interval.qrntCntIntervalId);
            clearInterval(this.interval.group1);
            clearInterval(this.interval.group2);
            clearInterval(this.interval.group3);
            // this.intervalIds.forEach(id => clearInterval(id));     
        },
    },
    computed: {

    },
    beforeUnmount() {
        this.clearIntervalAll();
        window.removeEventListener('resize', this.currJobStatChart.resize);
        window.removeEventListener('resize', this.qrntCntChart.resize);
        this.currJobStatChartOption = null;
        this.currJobStatChart       = null;
        this.qrntCntChartOption     = null;
        this.qrntCntChart           = null;
    },
    mounted() {
        this.init();

        // 1. db 연결 테스트 속도 이슈
        // 2. 종합현황 화면 여러개를 무자비하게 열고 닫았을때 removeEventListener 'resize' 에러 이슈
        // [어느정도 해결] 3. 종합현황 화면 여러개를 무자비하게 열고 닫았을때 setInterval, chart 객체 등의 참조 및 제거 이슈는 어느정도 해결된듯
        // 4. 12월10일 새벽 2시쯤 갑자기 한건도 없던 최근 오류발생 내역에 12월8일자 데이터 한 건이 생김.
        // 5. 테이블/키맵의 현행화/생성처리 구분 조건 명확히 하고, 메시지 및 이미지도 마무리 할 것.
        // 6. 분리보관 건수의 그래프 데이터는 sql 문에 '20231128' 날짜를 임시로 박아 놓았음.
        // 7. 분리보관 건수의 그래프 데이터를 마이너스 값도 표현 할 수 있게 구현 함.
        // 8. 윈도우팝업으로 띄우는 기능 구현 필요.
    }   
}
</script>
<style scoped>
span,p,td{
    margin-bottom:2px;
    vertical-align: center;
    font-family: 'KoPubDotumLight';
    color:rgb(238, 238, 238);
    margin-right: 5px;
}
div{
    height:100%;
    width:100%;
    border-radius:3px;
    font-size:12px;
}
.wrap{
    margin-bottom:5px;
}
.innerWrap{
    display: inline-block;
}
.box{
    background-color:#595959;
    display: inline-block;
    
}
 /*************** DB현황 ************/

.dbStatBox{
    padding:10px;
    width:15%;
    display: inline-block;
}
.db_bar{
    position:absolute;
    width:100%;
    height:5px;
}

 /*************** 작업현황 ************/

 /* 총 합계 건수 */
.totContBox{
    border-top:1px dashed rgb(150, 150, 150);
    border-radius:0px;
    height: 25%;
    padding:20px 30px;
}
.totCnt{
    text-align:center;
    font-size:24px;
    margin-top:13px;
}
 /* 작업상태 그래프 */
.graphBg{
    background-color:#A6A6A6;
    border-radius:0px;
    position: relative;
    overflow: hidden;
}
.graph{
    background-color:#fff;
    border-radius:0px;
    position: absolute;
    bottom: 0;
    transform-origin: bottom;
    transition: transform 0.5s ease, height 0.5s ease;
}
.graphStatbox{
    border-bottom:1px solid rgb(150, 150, 150);
    border-radius:0px;
    height: 20%;
    padding-top:28px;
}


/*************** 중간 ************/

/* 테이블/KEYMAP현황 */
 .header{
    background-color:#404040;
    height:30px;
    text-align: center;
    line-height: 23px;
    border: 1px solid rgb(150, 150, 150);
 }
 .contentBox{
    height:85%;
    padding:0px 10px
 }
.borderBox{
    border: 1px solid rgb(185, 185, 185);
    padding:10px;
    display: inline-block;
}
.dot{
    width:3px;
    height:3px;
    background-color: rgb(231, 231, 231);
    border-radius: 5px;
    display: inline-block;
    margin-right:7px;
}

.f-c-b{
    color:#1AD0FF;
}

ul > li{
    padding-top:10px;
}


/* 분리보관건수 */

.dashedBox{
    border-bottom: 1px dashed rgb(150, 150, 150);
}

/*************** 하단 ************/

.b_wrapBox{
    width:16.6%;
    height:80%;
    display: inline-block;
    padding-top:10px;
    padding-left:10px;
}
.b_imgWrap{
    width:10%;
    height:100%;
    display: inline-block;
    margin-right: 5px;
    /* float:left; */
}
.b_img{
    width:25px;
}
.b_textWrap{
    width:45%;
    height:auto;
    display: inline-block;
    /* float:left; */
    padding-top:2px;
}
.b_cntWrap{
    height:100%;
    width:40%;
    text-align:right;
    padding-right:5px;
    display: inline-block;
    border-right:1px dashed rgb(150, 150, 150);
    /* float:right; */
    line-height:27px;
}
.b_text_ko{
    font-size:9px;
    margin-bottom:0px;
}


/*************** color ************/

.bg_gray{
    background-color:#7F7F7F;
}
.bg_yellow{
    background-color:#e9900b;
}
.bg_green{
    background-color:#71b727;
}
.bg_red{
    background-color:rgb(227, 49, 49);
}
.bg_magenta{
    background-color:rgb(238, 108, 108);
}
.c_yellow{
    color:#f8c631;
}

.c_light_yellow{
    color:#eede66;
}
/* 임시 */
.bg{
    background-color:#888;
}
</style>