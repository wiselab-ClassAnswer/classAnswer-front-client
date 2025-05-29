<template>
	<div>
		<div class="section section1">
			<div class="search-box">
                <div class="input-box">
                    <div class="w-5 ib">
                        <h1>검색조건</h1>
                    </div>
                    <div class="w-20 ib">
                        <h2 class="wd-50 essn ib">이행셋</h2>
                        <select class="c-wd-50 ib" ref="cset" v-model="params.csetNo" @change="onChangeCset()">	
                            <option value = ''></option>
                            <option v-for="el in csetList" v-bind:key="el.colId" v-bind:value="el.colId">{{el.colId + ' | ' +el.colNm}}</option>
                        </select>                    
                    </div>
                    <div class="w-20" style="position:relative;">
                        <h2 class="essn w-25 ib">워크스페이스</h2>
						<select class="w-75 ib" v-model="params.wkspId" @change="onChangeWksp">
							<option v-for="item in wkspList" :key="item.wkspId" :value="item.wkspId">{{item.wkspNm}}</option>
						</select>
                    </div>
                    <div class="ib f-r w-20">
                        <SetButton :showInit="true" :showSelect="true" :showSave="true" :showDelete="false" @on-set-button-click="onSetButtonClick"></SetButton>
                    </div>
				</div>
			</div>
		</div>
		
		<div class="w-100 m-t-5">
			<div class="joint-paper-scroller f-l ib" :style="isShowJsetList ? 'width:1280px; overflow:scroll' :'width:1684px; overflow:scroll'">
				<div class="w-100 paper-scroller-background" style="height: 709px;">
					<div ref="jointPaper" class="joint-pager joint-theme-default"></div>
				</div>

				<!--
				<div class="toolbar-container" style="position: absolute; top: 0px; right:35px;" :style="isShowJsetList ? 'right:435px;':'right:35px;'">
				-->
				<div class="toolbar-container" style="position: fixed !important; top: 150px; right:28px;" :style="isShowJsetList ? 'right:435px;':'right:28px;'">
					<div class="joint-toolbar">
						<div class="joint-toolbar-group">
							<button v-on:click="zoomIn" >
								<font-awesome-icon :icon="['fas', 'search-plus']" class="btn-paper"/>
							</button>
							<button v-on:click="zoomOut" >
								<font-awesome-icon :icon="['fas', 'search-minus']" class="btn-paper"/>
							</button>
							<button v-on:click="clearBtn" style="padding:4px !important">
								<font-awesome-icon :icon="['fas', 'trash']" class="btn-paper"/>
							</button>
							<button v-on:click="showJsetList" style="padding:4px !important">
								<font-awesome-icon :icon="['fas', 'bars']" class="btn-paper"/>
							</button>
						</div>
					</div>
				</div>
			</div>

			<div v-show="isShowJsetList" class="section section4 wd-400 p-l-5 f-r ib" style="position:fixed; top:135px;">
				<div class="section-wrap">
					<h2 class="ib">미할당 작업셋</h2>
					<div class="radio-box m-0 f-r ib">
						<label>
							<input type="radio" name="csetStnd" id="csetStnd" v-model="params.isAlocJsetStnd" value="cset" @change="chngGrid()">
							<p class="p-l-5" style="color:#333333">이행셋기준</p>
						</label>
						<label>
							<input type="radio" name="wkspStnd" id="wkspStnd" v-model="params.isAlocJsetStnd" value="wksp" @change="chngGrid()">
							<p class="p-l-5" style="color:#333333">워크스페이스기준</p>
						</label>
					</div>
					<div class="w-100 m-b-5">
						<input class="w-75 ib t-a-l h-27 p-rl" style="bottom:-2px" type="text" v-model="params.srchNotAlocJset" @change="selectJobFlowFltrProc()">
						<button class="w-25 btn-normal ib" @click="selectJobFlowFltrProc()">
							<font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
							<p class="ib">필터</p>
						</button>  
					</div>
					<div class="wrapper-content">
						<Grid ref="jsetList" :paging='false' :dataParams="params"></Grid>
					</div>
					<div class="w-100">
						<button class="w-100 btn-normal ib" @click="selectJsetWkspAdd()">
							<font-awesome-icon class="ib m-r-5" :icon="['fas', 'gear']" />
							<p class="ib">선택한 작업셋을 워크스페이스에 추가</p>
						</button>  
					</div>
				</div>
			</div>
		</div>
		<JobFlowDetlPop ref="JobFlowDetlModal" :dataParams="params" @aplyJobFlow="aplyJobFlow"></JobFlowDetlPop>
    </div>
   
</template>

<script>

import "@/static/plugins/jointjs/workspace.css"
import "@/static/css/plugins/jointjs/joint.css"

import { inject, reactive} from 'vue'
import { ValdUtil }        from '@/utils/ValdUtil.js'
import { CmonUtil }        from '@/utils/CmonUtil.js'
import { GridUtil }        from '@/utils/GridUtil'
import Grid                from '@/components/grid/Grid.vue'
import SetButton           from '@/components/SetButton.vue'
import JobFlowDetlPop      from '@/views/mng/job/JobFlowDetlPop.vue'

export default {
	components: {
		SetButton,
		JobFlowDetlPop,
		Grid
	},
	setup() {        

        // 공통코드조회
        const getCmonCdList = inject('getCmonCdList')
        let code = reactive({
			wkspCntsList  : [],
            execCyclCdList: []
        })
		
        getCmonCdList('EXEC_CYCL_CD', code.execCyclCdList, 'Y', '');
		return {
           code
        }
    },
    data: function() {
		return {
			isShowJsetList      : false,  // 미할당 작업셋 탭 오픈
            graph               : null,	  // 페이지 그래프
            paper               : null,	  // 페이지 페이퍼
			eventEnable         : true,	  // 페이지 그래프 관련
            params: {
			    csetNo          : '',     // 이행셋번호
				wkspId          : '',	  // 워크스페이스 ID
				wkspNm          : '',	  // 워크스페이스 명
				jsetNo          : '',	  // 작업셋번호
				jsetNm          : '',	  // 작업셋명
				srchNotAlocJset : '',	  // 미할당 작업셋 조회 검색값
				isAlocJsetStnd  : 'cset'  // 미할당 작업셋 기준 
			},
            selectedElement     : null,	  // 선택된 작업셋
            deletedJset         : [],
			updatedPrevJset     : [],
			deletedPrevJset     : [],
            resizePos           : {},
            zoomLevel           : 0.6,
			jsetSrchActive      : false,
            selectedData        : '',
			selectedChkList     : [],
			csetStndNotAlocList : [],     // 이행셋 기준 미할당 작업셋
			csetStndAlocList    : [],     // 이행셋 기준 할당된 작업셋
			wkspStndAlocList    : [],     // 워크스페이스 기준 미할당작업셋
			wkspList            : [],     // 조회 된 워크스페이스 리스트
			csetList			: [],     // 이행셋리스트 조회
        }        
    },
    methods: {
		// 미할당 작업셋 탭
		showJsetList(){
			const $this = this;
			this.isShowJsetList = !this.isShowJsetList;
			$this.chngGrid();
		},
        //그리드 생성
        initGrid(){
            const $this = this;
            let gridData = {
                url : '',
                colModels : [
                    {name:'csetNo'      	,label:'이행셋번호'   	,width:20  		,align:'left' 		,sortable:true , hidden : true},
                    {name:'jsetNo'      	,label:'작업셋번호'   	,width:20  		,align:'left' 		,sortable:true },
                    {name:'jsetNm'      	,label:'작업셋명'     	,width:20  		,align:'left' 		,sortable:true },
                    {name:'execCyclCd'  	,label:'실행주기코드'   ,width:20  		,align:'left' 		,sortable:true , hidden : true},
                    {name:'execTpntVal' 	,label:'실행주기값'   	,width:20  		,align:'left' 		,sortable:true , hidden : true},
                    {name:'rmrk'        	,label:'설명'   		,width:20  		,align:'left' 		,sortable:true , hidden : true}
                ]
               ,options: {
					height: 571,
					multiselect:true,
					onSelectRow(rowid){
                        $this.selectedData = $(this).jqGrid('getRowData',rowid);
                    },
                    onSelectAll(){
                        $this.selectedData = GridUtil.getCheckedList($(this));
                    } 
                }                
            }
			this.$nextTick(() => {
            	$this.$refs.jsetList.init(gridData);
            });
        },
        init: function() {
            const $this = this;

            $this.initSheet();
			$this.reset();
			$this.initGrid();
			$this.$refs.jsetList.clearGridData();
			$this.CmonUtil.setFocus($this.$refs.cset);
        },
		// 값 초기화
		reset(){
			const $this = this;
			$this.resetParams();
			$this.selectedData    = '';
			$this.isShowJsetList  = false;
			$this.selectedChkList = [];
			$this.$nextTick(()=>{
				$this.initCsetData();
			})
		},
		// 이행셋 조회
		initCsetData(){
			const $this = this;
            const colIdNmListData = {
                'tblId'      :'tm_cset_base',
                'colId'      :'cset_no,dflt_yn,conv_ver',
                'colNm'      :'cset_nm',
                'where'      : [{
                    'andCol' : '1',
                    'andCalc': '=',
                    'andVal' : '1'
                }],
                'orderby': [
                    {'orderCol' : 'cset_no'}
                ]
            };
            // 조회 후 콜백
            $this.getColIdNmList(colIdNmListData, $this.csetList, 'N', $this.initData);
		},
		// 데이터 Init
		initData(data){
			const $this = this;
			let pgLinkData = CmonUtil.getPageLink('O2040');
			if(ValdUtil.isNotNull(pgLinkData)){
				data = pgLinkData;
			}
			if(!ValdUtil.isEmptyJson(data)){
               	$this.params.csetNo = data.csetNo;
				$this.params.wkspId = data.wkspId;
				$this.params.wkspNm = data.wkspNm;
			} else {
				$this.setDfltCset();
			}
			$this.$nextTick(()=>{
				$this.selectListWkFlow();
			})
		},
		// 기본 이행셋 설정
		setDfltCset(){
            const $this = this;
            let dfltCsetList = $this.csetList.find(el => el.dfltYn == 'Y');
            if(ValdUtil.isNotNull(dfltCsetList)){
                $this.params.csetNo = dfltCsetList.colId;
            }
		},
		// 조회
		selectListWkFlow(){
			const $this = this;
			$this.initWkspList();
			$this.$nextTick(() =>{
				if(ValdUtil.isNotNull($this.params.csetNo) && ValdUtil.isNotNull($this.params.wkspId)){
					$this.selectCnts();
				}
				$this.selectListNotAlocJsetBoth();
			})
		},
		// 파라미터 초기화
		resetParams(){
			const $this = this;
			$this.params = {
				csetNo : '',
				wkspId : '',
				wkspNm : '',
				jsetNo : '',
				jsetNm : '',
				srchNotAlocJset : '',
				isAlocJsetStnd : 'cset'
			};
		},


		// 이행셋 기준 / 워크스페이스 미할당 작업셋 조회   
		selectListNotAlocJsetBoth(){
			const $this = this;
			$this.doPost('/mng/job/jobFlowMng/selectListNotAlocJsetBoth.hb', $this.params).then(function(res){
				if (res.data.rtnCd == '0000') {
					let result = res.data.rtnData;
					$this.csetStndNotAlocList = result.csetJset.csetStndNotAlocJsetList;
					$this.csetStndAlocList    = result.csetJset.csetStndAlocJsetList;
					$this.wkspStndAlocList    = result.wkspJset;
					$this.chngGrid();
				}else{
					$this.alert(res.data.rtnMsg);
				}
			});	
		},
		// 미할당 작업셋 그리드 변경 
		chngGrid(){
			const $this = this;
			let grid = $this.$refs.jsetList;
			grid.clearGridData();
			if(ValdUtil.isNotNull($this.params.csetNo)){
				if(ValdUtil.isNotNull($this.params.wkspId)){
					if(this.params.isAlocJsetStnd === 'cset'){
						grid.setGridData($this.csetStndNotAlocList, true);
					} else if(this.params.isAlocJsetStnd === 'wksp'){
						grid.setGridData($this.wkspStndAlocList, true);
					}
				}
			}
		},
		// 검색조건 워크스페이스 조회
		initWkspList: function(data) {
			const $this = this;
			$this.doPost('/mng/job/jobFlowMng/selectListWkspList.hb', $this.params).then(function(res){
				if (res.data.rtnCd == '0000') {
					$this.wkspList = res.data.rtnData.result;
				}else{
					$this.alert(res.data.rtnMsg);
				}
			});	
		},
		// 페이지 초기화
        initSheet() {
            let $this = this;
        	
			const paperContainer = $this.$refs.jointPaper;

			$this.graph = new joint.dia.Graph();
			$this.paper = new joint.dia.Paper({
				el: paperContainer,
				model: $this.graph,

				// defaultLink: new joint.dia.Link({
				defaultLink: new joint.shapes.standard.Link({
					attrs: {'.marker-target': {d: 'M 10 0 L 0 5 L 10 10 z'}}
				}),
				validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end) {

					// don't allow loop links
					if (cellViewS == cellViewT) return false;

					var view = (end === 'target' ? cellViewT : cellViewS);

					// don't allow link to link connection
					return !view.model.isLink();
				}
			});

			
			// Container for all HTML views inside paper
			var htmlContainer = document.createElement('div');
			htmlContainer.style.pointerEvents = 'none';
			htmlContainer.style.position = 'absolute';
			htmlContainer.style.inset = '0';
			$this.paper.el.appendChild(htmlContainer);
			$this.paper.htmlContainer = htmlContainer;

			$this.paper.on('scale translate', function() {
				// Update the transformation of all JointJS HTML Elements
				var htmlContainer = this.htmlContainer;
				htmlContainer.style.transformOrigin = '0 0';
				htmlContainer.style.transform = joint.V.matrixToTransformString(this.matrix());
			});
			
			// 배경드래그
			$this.paper.on({
				'blank:pointerdown': function(evt, x, y) {
					evt.data = {dragPos: {x: x, y: y}};
				},
				'blank:pointerup': function(evt, x, y) {
					evt.data.dragPos = {};
					$this.resizePos = {};
				},
				'blank:pointermove': function(evt, x, y) {
					if ( !!evt.data.dragPos ) {
						var left = $('.joint-paper-scroller').scrollLeft() + (evt.data.dragPos.x - x);
						var top  = $('.joint-paper-scroller').scrollTop()  + (evt.data.dragPos.y - y);
						
						if ( left < 0 ) left = 0;
						if ( top  < 0 ) top  = 0;
						$('.joint-paper-scroller').scrollLeft(left);
						$('.joint-paper-scroller').scrollTop (top);
					}
				}
			});
			
			// 줌인아웃
			$this.paper.on({
				'cell:mousewheel link:mousewheel element:mousewheel': function(cellView, evt, x, y, delta) {
					if ( evt.altKey ) {
						evt.preventDefault();
						if ( delta == 1 ) {
							$this.zoomIn();
						} else if ( delta == -1 ) {
							$this.zoomOut();
						}
					}
				},
				'blank:mousewheel': function(evt, x, y, delta) {
					if ( evt.altKey ) {
						evt.preventDefault();
						if ( delta == 1 ) {
							$this.zoomIn();
						} else if ( delta == -1 ) {
							$this.zoomOut();
						}
					}
				}
			});
			
			// 작업셋 클릭시 경계선과 도구를 보여준다.
			$this.paper.on('element:pointerclick', function(cellview) {

				$this.removeTools();

				cellview.addTools(new joint.dia.ToolsView({
					name: 'boundary',
					tools: [
					// 도구 경계선
					new joint.elementTools.Boundary({
						focusOpacity: 0.5,
						padding: 10,
						useModelGeometry: false
					})
					// 해당 작업셋 제거 버튼
					, new joint.elementTools.Remove({						
						focusOpacity: 0.5,
						rotate: true,
						x: '0%',
						y: '0%',
						offset: { x: -20, y: -20 },
						onPointerDown: function(evt) {
							let cids = this.cid; 
							$this.confirm({
								content  : '선택된 작업셋을 삭제하시겠습니까?',
								callback :{
									yes(){
										$this.removeElement(cellview);
										const selectJset = $this.selectedElement;
										$this.initSelectedData();
										$this.removeTools();
										cellview.model.remove({ ui: true, tool: cids });
										//미할당 작업셋에 추가
										$this.removeJsetElement(selectJset);
									}
								}
							})
    					}
					}),
					// 작업셋 화면열기
					new joint.elementTools.Button({
						x: '100%',
						y: '0%',
						offset: { x: 20, y: -20 },
						onPointerDown: function(evt, x, y, z) {
							const selectJset = $this.selectedElement;
					    	$this.openJsetMng(selectJset);
					    },
					    markup: [{
					    	tagName: 'circle',
					    	attributes: {
					    		'cx': 0,
					    		'cy': 0,
					    		'r': 11,
					    		'stroke-width': 2,
					    		'stroke': '#0888F0',
					    		'fill': '#0095ff',
					    		'cursor': 'pointer'
					    	}
					    }, {
					    	tagName: 'text',
					    	attributes: {
					    		'x': -9.5,
					    		'y': 3.5,
					    		'fill': '#ffffff',
					    		'cursor': 'pointer'
					    	},
					    	style: {
					    		'font-size': '10px',
					    		'font-weight': 'bold',
					    	},
					    	textContent: 'Job'
					    }]
					})
					// 작업흐름 링크
					, new joint.elementTools.Link({
    					x: '100%',
						y: '50%',
						offset: { x: 20 },
    					onPointerDown: function(evt, view, tools) {
							// console.log('View id: ' + this.id + '\n' + 'Model id: ' + this.model.id, evt);
							$this.addLink(this.model.id, '', view.getBBox());
						}
					})
					]
				}));

				$this.selectedElement = cellview.model;
			});

			// 빈공간 클릭
			$this.paper.on('blank:pointerclick', function(cellview, evt, x, y) {
				$this.initSelectedData();
				$this.removeTools();
			});

			// 작업셋 상세팝업
			$this.paper.on('element:pointerdblclick', function(cellview, evt, x, y) {
				$this.selectedElement = cellview.model;
				$this.popupJsetDetl();
			});

			var verticesTool = new joint.linkTools.Vertices();
			var segmentsTool = new joint.linkTools.Segments();
			var sourceArrowheadTool = new joint.linkTools.SourceArrowhead();
			var targetArrowheadTool = new joint.linkTools.TargetArrowhead();
			var sourceAnchorTool = new joint.linkTools.SourceAnchor();
			var targetAnchorTool = new joint.linkTools.TargetAnchor();
			var boundaryTool = new joint.linkTools.Boundary();
			var removeButton = new joint.linkTools.Remove({
				distance: 60
			});

			// 링크 마우스오버
			$this.paper.on('link:mouseenter', function(linkView) {
				linkView.addTools(new joint.dia.ToolsView({
					tools: [
						verticesTool, segmentsTool, /*sourceArrowheadTool, */targetArrowheadTool, sourceAnchorTool, targetAnchorTool, boundaryTool, removeButton
					]
				}));
				linkView.showTools();
			});

			// 링크 마우스가 떠날때
			$this.paper.on('link:mouseleave', function(linkView) {
				linkView.hideTools();
			});

			// 링크 타겟과 연결할 때
			$this.paper.on('link:connect', function(linkView, evt, target) {
				// console.log(linkView, evt, target);
				let sourceId = linkView.model.attributes.source.id;
				let targetId = linkView.model.attributes.target.id;

				const sourceKey = $this.getElementKey(sourceId);
				linkView.model.attributes.source['jsetNo'    ] = sourceKey.jsetNo;

				const targetKey = $this.getElementKey(targetId);
				linkView.model.attributes.target['jsetNo'    ] = targetKey.jsetNo;
			});

			// 링크 타겟과 연결할 때
			$this.graph.on('add', function(linkView, evt, target) {
				// console.log(linkView, evt, target);
			});

			// 삭제될때
			$this.graph.on('remove', function(linkView) {
				if ( linkView.isLink() ) {
					if ( linkView.attributes['crud'] !== 'C') {
						$this.removeLink(linkView);
					}
				}
			});

			// 링크 타겟과 연결이 해제될 때(사용하지 못함)
			// $this.paper.on('link:disconnect', function(linkView, evt) {
				
			// });

			$this.paper.unfreeze();

			$this.resizePage();
        },
		// 작업셋관리화면 열기
        openJsetMng: function(selectJset) {
			const $this = this;
			if ( ValdUtil.isNotNull(selectJset) ) {
				
				if ( ValdUtil.isNull(selectJset.attributes.fields.jsetNo) ) {
					$this.alert("작업셋 저장 후 시도하시기 바랍니다.");
					return false;
				}			
                let params = {
					csetNo    : selectJset.attributes.fields.csetNo,
					jsetNo    : selectJset.attributes.fields.jsetNo
				}
				CmonUtil.setPageLink('O2010', params);
	            
			} else {
				$this.alert("작업셋을 선택하시기 바랍니다.");
			}
		},
		// 작업셋 상세팝업 선택
		popupJsetDetl: function() {
			let $this = this;
			$this.params.jsetNo     = $this.selectedElement.attributes.fields.jsetNo;
			$this.params.jsetNm     = $this.selectedElement.attributes.fields.jsetNm;

			// 선행작업셋ID 셋팅
			const elements = $this.graph.getCells();
			let sourceIds = [];
			_.forEach(elements, function(element) {
				if ( element.isLink() ) {
					if ( $this.params.jsetNo     === element.attributes.target.jsetNo ) {
						sourceIds.push({
							id: element.attributes.source.id,
							execCondCd: CmonUtil.nvl(element.attributes['execCondCd'], '')
						});
					}
				}
			});

			// 선행작업셋 리스트 셋팅
			let prevJsetList = [];
			for ( let i = 0 ; i < sourceIds.length ; i++ ) {

				const prevJset = _.find(elements, function(element) {
					return element.isElement() && sourceIds[i].id === element.id;
				});

				prevJsetList.push({
					csetNo: $this.params.csetNo,
					wkspId: $this.params.wkspId,
					wkspNm: $this.params.wkspNm,
					jsetNo: $this.selectedElement.attributes.fields.jsetNo,
					jsetNm: $this.selectedElement.attributes.fields.jsetNm,
					prevJsetNo: prevJset.attributes.fields.jsetNo,
					prevJsetNm: prevJset.attributes.fields.jsetNm,
					execCondCd: sourceIds[i].execCondCd
				});
			}

			let params = _.cloneDeep($this.selectedElement.attributes.fields);
			
			params['csetNo']     = $this.params.csetNo;
			params['jsetNo']     = $this.params.jsetNo;
			params['jsetNm']     = $this.params.jsetNm;
			params['wkspId']     = $this.params.wkspId;
			params['wkspNm']     = $this.params.wkspNm;

			$this.$refs.JobFlowDetlModal.show();
			$this.$refs.JobFlowDetlModal.init(params, prevJsetList);
		},
		// 작업셋 상세 팝업에서 적용버튼 클릭시 발생
		aplyJobFlow: function(params) {
			let $this = this;
			
			const elements = $this.graph.getCells();
			_.forEach(elements, function(element) {
				// 작업셋정보 셋팅
				if ( element.isElement() ) {
					if ( element.id === $this.selectedElement.id ) {
						_.forEach(params.jsetInfo, function(val, key) {
							if ( key === 'execCyclCd' || key === 'execCyclNm' || key === 'execTpntVal' ) {
								if ( element.attributes.fields[key] !== val ) {
									element.attributes.fields['crud'] = 'U';
									element.attributes.fields[key] = val;
								}
							}
						});
					}
				}
				// 링크정보 셋팅
				else if ( element.isLink() ) {
					if ( ValdUtil.isNotNull(params.prevJsetList) && params.prevJsetList.length > 0 ) {
						for ( let i = 0 ; i < params.prevJsetList.length ; i++ ) {
							// 타 워크스페이스 내용이 수정인 경우
							if ( params.prevJsetList[i].wkspId !== $this.params.wkspId) {
								let existPrevJsetIndex = _.findIndex($this.updatedPrevJset, function(exists) {
									return exists.wkspId === params.prevJsetList[i].wkspId && exists.jsetNo === params.prevJsetList[i].jsetNo;
								});

								if ( existPrevJsetIndex > -1 ) {
									_.forEach(params.prevJsetList[i], function(val, key) {
										$this.updatedPrevJset[existPrevJsetIndex][key] = val;
									});
								} else {
									params.prevJsetList[i]['crud'] = 'U';
									$this.updatedPrevJset.push(params.prevJsetList[i]);
								}
							}
							else {
								if ( params.prevJsetList[i].csetNo      === element.attributes.target.csetNo && 
									 params.prevJsetList[i].jsetNo     	=== element.attributes.target.jsetNo &&
									 params.prevJsetList[i].execCondCd  !== element.attributes['execCondCd'] )
								{
									if ( ValdUtil.isNull(element.attributes['crud']) ) {
										element.attributes['crud'] = 'U';
									}
									element.attributes['execCondCd'] = params.prevJsetList[i].execCondCd;
									break;
								}
							}
						}
					}
				}
			});

			const eles = $this.graph.getCells();
			this.clearPaper();
			$this.graph.addCell(eles);
		},

		
        // 단위작업 목록 필터링
        selectJobFlowFltrProc() {
			const $this = this;   
            // this.$refs.jsetList.selectList(true);
			$this.selectListNotAlocJsetBoth();
        },

		// 미할당 작업셋 워크스페이스 추가 
		selectJsetWkspAdd() {
			const $this = this;   

			if ( ValdUtil.isNull(this.params.csetNo) ) {
			 	this.alert("이행셋을 선택하시기 바랍니다.");
			 	return false;
			}else if ( ValdUtil.isNull(this.params.wkspId) ) {
			 	this.alert("워크스페이스를 선택하시기 바랍니다.");
			 	return false;
			}else {
  
				let gridObj               = $this.$refs.jsetList.getGridObj();
				let checkedList           = GridUtil.getCheckedList(gridObj);
				$this.csetStndNotAlocList = $this.csetStndNotAlocList.filter(csetEl => !checkedList.some(chkEl => chkEl.jsetNo === csetEl.jsetNo));
				$this.wkspStndAlocList    = $this.wkspStndAlocList.filter(csetEl => !checkedList.some(chkEl => chkEl.jsetNo === csetEl.jsetNo));

				if ( $this.ValdUtil.isNotNull($this.selectedData) && checkedList.length == 0 ) {
					checkedList.push($this.selectedData);
				}

				// 체크 된 내용 삭제
				var rowIds = $(gridObj).getGridParam("selarrrow");
				for(var i = rowIds.length-1 ; i >= 0 ; i--) {
					$(gridObj).delRowData(rowIds[i])
				}

				$(gridObj).jqGrid("resetSelection");

				this.createJset(checkedList);

			}
		},

		// 작업셋 팝업에서 선택하였을 때 작업셋을 생성한다.
		createJset : function(jsetList) {

			let $this = this;
			
			if ( ValdUtil.isNull($this.params.wkspId) ) {
			 	$this.alert("워크스페이스를 선택하시기 바랍니다.");
			 	return false;
			}
			
			let maxX = 0;
			let maxY = 0;

			// 기존에 존재하는 하는 작업셋인지 체크함
			let elements = this.graph.getCells();
			if ( elements.length > 0 ) {

				_.forEach(elements, function(element) {
					if ( element.isElement() ) {
						if ( maxX < element.attributes.position.x ) {
							// maxX = element.attributes.position.x;
						}

						if ( maxY < element.attributes.position.y ) {
							maxY = element.attributes.position.y + 400;
						}
					}
				});

				for ( let i = 0 ; i < jsetList.length ; i++ ) {
					let fElement = _.find(elements, function(element) {
						if ( element.isElement() ) {
							if ( jsetList[i].jsetNo === element.attributes.fields.jsetNo && jsetList[i].csetNo === element.attributes.fields.csetNo) {
									return true
							} else {
								return false;
							}
						} else {
							return false;
						}
					});

					if ( ValdUtil.isNotNull(fElement) ) {
						$this.alert("작업셋:[" + fElement.attributes.fields.jsetNo + "]" + fElement.attributes.fields.jsetNm + " 는 이미 추가된 작업입니다.");
						return false;
					}
				}
			}
			
			_.forEach(jsetList, function(jsetInfo, i) {
				
				let jset = new joint.shapes.task.Jobset({
					position: {
						x: (i * 350) + 50,
						y: maxY + 100
					},
					fields: {
						csetNo      : $this.params.csetNo,
						wkspId      : $this.params.wkspId,
						jsetNo      : jsetInfo.jsetNo,
						jsetNm      : jsetInfo.jsetNm,
						rmrk        : jsetInfo.rmrk,
						execCyclCd  : jsetInfo.execCyclCd,
						execCyclNm  : CmonUtil.getCodeNm($this.code.execCyclCdList, jsetInfo.execCyclCd),
						execTpntVal : jsetInfo.execTpntVal
					},
					id: jsetInfo.jsetNo
				});
				$this.graph.addCell(jset);
			});
		},
		// JsonData를 그래프로 변환
		convertFlow(data) {
			
			let $this = this;
			if ( ValdUtil.isNotNull(data) ) {
				let elements = JSON.parse(data);
				
				_.forEach(elements, function(element) {
					if ( element.type === "task.Jobset" ) {
						if ( element.fields.hasOwnProperty('crud') ) {
							delete element.fields.crud; 
						}
					} else if ( element.type === "standard.Link" ) {
						if ( element.hasOwnProperty('crud') ) {
							element['crud'] = 'R'; 
						}
					}
					$this.graph.addCell(element);
				});

				// let cells = $this.graph.getCells();
				// console.log(cells);
			}
		},
		selectListJset: function() {
			
			let $this = this;
			let params = {};
			
			this.clearPaper();
			
			$this.doPost("/mng/job/jobFlowMng/selectListJset.hb", params).then(function(response) {
				$this.convertFlow(response.rtnData);
                $this.deletedJset = [];
				$this.deletedPrevJset = [];
			}, function() {
				$this.alert(response.data.rtnMsg);
			});
		},
		// 컨텐츠 조회
		selectCnts: function() {
			const $this = this;
			if ( ValdUtil.isNull(this.params.csetNo) ) {
				$this.alert("이행셋을 선택하시기 바랍니다.");
				return false;
			}
			if ( ValdUtil.isNull(this.params.wkspId) ) {
				$this.alert("워크스페이스를 선택하시기 바랍니다.");
				return false;
			}
			let params = _.cloneDeep($this.params);
			$this.clearPaper();
			$this.$refs.jsetList.clearGridData();
			$this.doPost("/mng/job/jobFlowMng/selectCnts.hb", params).then(function(response) {
				if ( ValdUtil.isNull(response.data.rtnData) || ValdUtil.isNull(response.data.rtnData.jsetCnts) ) {
					$this.alert("워크스페이스 컨텐츠가 없습니다.");
				} else {
					if ( response.data.rtnData.jsetCnts !== '[]' ) {
						$this.convertFlow(response.data.rtnData.jsetCnts);

						let elements = $this.graph.getElements();
						if ( ValdUtil.isNull(elements) || elements.length == 0 ) {
							elements = JSON.parse(response.data.rtnData);
						}

						_.forEach(elements, function(element) {
							let csetNo 	   = element.prop(['fields', 'csetNo']);
							let wkspId     = element.prop(['fields', 'wkspId']);
							let jsetNo     = element.prop(['fields', 'jsetNo']);
							let elementId  = element.id;
							// console.log("csetNo/wkspId/jsetNo/elementId=", csetNo, wkspId, jsetNo, elementId);
						});
					}
				}
				
				$this.deletedJset = [];
				$this.deletedPrevJset = [];
			});
			$this.$nextTick(()=>{
				$this.selectListNotAlocJsetBoth();
			})
		},
		// 저장
		save: function() {
			const $this = this;			
			if ( ValdUtil.isNull(this.params.csetNo) ) {
				$this.alert("이행셋을 선택하시기 바랍니다.");
				return false;
			}

			if ( ValdUtil.isNull(this.params.wkspId) ) {
				$this.alert("워크스페이스를 선택하시기 바랍니다.");
				return false;
			}
			
			let elements = $this.graph.getCells();
			
			// 선행작업 체크
			for ( let i = 0 ; i < elements.length ; i++ ) {
				let element = elements[i];
				if ( element.isLink() ) {
					// 링크인 경우 유효성체크
					if ( ValdUtil.isNull(element.getSourceCell()) ) {
						$this.alert("연결 시작점은 있어야 합니다");
						return false;
					} else if ( ValdUtil.isNull(element.getTargetCell()) ) {
						$this.alert("연결 목표점은 있어야 합니다");
						return false;
					} else {
						if ( ValdUtil.isNull(element.attributes['execCondCd']) ) {
							$this.alert("선행작업의 조건을 선택하셔야 합니다.");
							return false;
						}
					}
				}
			}
			// 수정되거나 삭제된 Jset과 선행작업이 C,U,D를 추려야 하는데..
			let jsets = [];
			let prevJsets = [];
			for ( let i = 0 ; i < elements.length ; i++ ) {
				let element = elements[i];
				if ( element.isElement() ) {
					if ( element.attributes.fields['crud'] === 'U' ) {
						let jset = {};
						_.forEach(element.attributes.fields, function(val, key) {
							jset[key] = val;
						});

						jsets.push(jset);
					}
				}
				else
				{
					if ( ValdUtil.isNotNull(element.attributes.source.jsetNo) && ValdUtil.isNotNull(element.attributes.target.jsetNo) ) {
						let prevJset = {
							crud          : element.attributes['crud'],
							csetNo         : $this.params.csetNo,
							wkspId        : $this.params.wkspId,
							wkspNm        : $this.params.wkspNm,
							jsetNo        : element.attributes.target.jsetNo,
							prevJsetNo    : element.attributes.source.jsetNo,
							execCondCd    : CmonUtil.nvl(element.attributes['execCondCd'], '')
						}
						prevJsets.push(prevJset);
					}
				}
			}
			
			let params = {
				'csetNo'     : $this.params.csetNo,
				'wkspId'     : $this.params.wkspId,
				'wkspNm'	 : $this.params.wkspNm,
				'jsets'      : jsets,
				'prevJsets'  : prevJsets,
				'wkspCnts'   : JSON.stringify(elements),
			};
			$this.confirm({
                content: '작업셋 내용을 삭제하면, 실제 작업셋이 변경됩니다. 진행하시겠습니까?',
                callback: {
                	yes() {
                    	$this.saveWksp(params);
					}
				}
			});			
		},
		// 저장처리
		saveWksp: function(params) {
			const $this = this;
			$this.doPost("/mng/job/jobFlowMng/save.hb", params).then(function(response) {
				if ( response.data.rtnCd === '0000' ) {
					$this.alert("저장이 완료되었습니다.").then((result) => {
						
						if( result.isConfirmed ){
							let data = {
								csetNo    : params.csetNo,
								wkspId    : params.wkspId,
								wkspNm    : params.wkspNm
							}
							$this.initData(data);
						}
					});
				} else {
					$this.alert(response.data.rtnMsg);
				}
			});

		},
		// 이행셋 콤보 변경
		onChangeCset(){
			const $this = this;
			$this.wkspList      = [];
			$this.params.wkspId = '';
			$this.params.wkspNm = '';
			$this.clearPaper();
			$this.$refs.jsetList.clearGridData();
			if(ValdUtil.isNotNull($this.params.csetNo)){
				$this.initWkspList();
			}
		},

		// 워크스페이스 콤보 변경
		onChangeWksp: function(event) {
			const $this = this;
			$this.clearPaper();
			$this.$refs.jsetList.clearGridData();
			$this.csetStndNotAlocList = [];
			$this.csetStndAlocList    = [];
			$this.wkspStndAlocList    = [];
			if(event != null){
				const selectedId = event.target.value;
				let findList     = this.wkspList.find(el => el.wkspId === selectedId);
				if(findList != null){
					this.params.wkspId = findList.wkspId;
					this.params.wkspNm = findList.wkspNm;
				}
				if (ValdUtil.isNotNull(this.params.wkspId)) {
					$this.selectCnts();
					$this.$nextTick(()=>{
						$this.selectListNotAlocJsetBoth();
					});
				} else {
					this.clearPaper();
				}
			}
		},
		// 링크추가
		addLink: function(sourceId, targetId, bbox) {
			const $this = this;
			let target = {}
			if ( ValdUtil.isNull(targetId) ) {
				target = {
					x: Math.floor((bbox.x + bbox.width + 50) / $this.zoomLevel),
					y: Math.floor(bbox.y  / $this.zoomLevel) + Math.floor(bbox.height / $this.zoomLevel / 2)
				}
			} else {
				target = {
					id : targetId
				}
			}
			let link = new joint.shapes.standard.Link({
				crud: 'C',
				source: { id: sourceId },
				target: target,
				// router: { name: 'manhattan' },
				// connector: { name: 'rounded' },
				attrs: {
					line: {
						stroke: '#464554'
					}
				}
			});
			link.addTo($this.graph);
		},
		// ID에 해당하는 jsetNo 리턴
		getElementKey: function(id) {
			const $this = this;
			const elements = $this.graph.getCells();
			let keys = {};
			for ( let i = 0 ; i < elements.length ; i++ ) {
				const element = elements[i];
				if ( element.isElement() ) {
					// console.log(element);
					if ( element.id === id ) {
						keys = {
							jsetNo: element.attributes.fields.jsetNo,
						}
						
					}
				}
			}

			return keys;
		},
		// 툴제거
		removeTools : function() {
			this.paper.removeTools();
		},
		// 그래프 초기화
		clearGraph: function() {
			this.eventEnable = false;
			this.graph.clear();
			this.eventEnable = true;
		},
		//삭제 버튼 
		clearBtn(){
			const $this = this;
			const elements = $this.graph.getCells();
			if(elements.length > 0){
				$this.confirm({
					content  : '현재 워크스페이스 내의 워크플로우를 모두 삭제하시겠습니까?',
					callback : {
						yes(){
							// 현재 페이퍼의 정보의 작업셋 정보를 미할당 작업셋에 PUSH
							_.forEach(elements, function(element) {
								// 작업셋정보 셋팅
								if ( element.isElement() ) {
									$this.removeJsetElement(element);
								}
							})
							$this.clearPaper();
							$this.$refs.jsetList.clearGridData();
						}
					}
				})
			} else {
				$this.alert("조회된 워크플로우가 없습니다.");
			}
		},
		// 페이퍼 초기화
		clearPaper: function() {
			this.removeTools();
			this.clearGraph();
			this.initSelectedData();
		},
		// 선택된 작업셋 데이터 초기화
		initSelectedData: function() {
			this.selectedElement = null;
		},
		// 엘레먼트 제거
		removeElement: function(element) {
			const $this = this;
			if ( $this.eventEnable ) {
				if ( element.model.isElement() ) {
					if ( ValdUtil.isNotNull(element.model.attributes.fields.wkspId) && ValdUtil.isNotNull(element.model.attributes.fields.jsetNo)) {
						this.deletedJset.push({
							'crud'       : 'D',
							'csetNo'      : element.model.attributes.fields.csetNo,
							'wkspId'     : element.model.attributes.fields.wkspId,
							'jsetNo'     : element.model.attributes.fields.jsetNo
						});
					}
				}
			}
		},
		// 미할당 작업셋 PUSH 전 작업셋번호 기준 정렬
		sortArray(data) {
			data.sort((a, b) => {
				const numA = a.jsetNo ? parseInt(a.jsetNo.split('-')[1], 10) : NaN;
				const numB = b.jsetNo ? parseInt(b.jsetNo.split('-')[1], 10) : NaN;

				if (isNaN(numA) || isNaN(numB)) {
					if (isNaN(numA) && isNaN(numB)) {
						return 0;
					} else if (isNaN(numA)) {
						return 1;
					} else {
						return -1;
					}
				}
				return numA - numB;
			});
		},
		// Element 삭제 및 미할당 작업셋에 추가  
		removeJsetElement(selectJset){
			const $this = this;
			let selectedEl = selectJset.attributes.fields; 
			let csets = $this.csetStndAlocList.some(el => el.jsetNo === selectedEl.jsetNo);
			let notAlocCsetStnd = '';	// 이행셋 기준 미할당 작업셋 구분 위함
			if(!csets){
				notAlocCsetStnd = selectedEl;
			}
			// 이행셋 기준 미할당 작업셋 PUSH
			if(ValdUtil.isNotNull(notAlocCsetStnd)){
				$this.csetStndNotAlocList.push(notAlocCsetStnd);
				$this.$nextTick(() =>{
					this.sortArray($this.csetStndNotAlocList);
				})	
			}
			// 워크스페이스 기준 미할당 작업셋 PUSH
			$this.wkspStndAlocList.push(selectedEl);
			$this.$nextTick(()=>{
				this.sortArray($this.wkspStndAlocList);
			})
			
			$this.$nextTick(() =>{
				$this.chngGrid();		
			})
		},
		setAlocJsetGridData(){
			const $this = this;
			let grid = $this.$refs.jsetList;
			grid.clearGridData();
			if($this.params.isAlocJsetStnd === 'cset'){
				grid.setGridData($this.csetStndNotAlocList, true);
			} else if($this.params.isAlocJsetStnd ==='wksp'){
				grid.setGridData($this.wkspStndAlocList, true);
			}
		},
		// 엘레먼트 제거
		removeLink: function(element) {
			const $this = this;
			if ( $this.eventEnable ) {
				if ( element.isLink() ) {
					this.deletedPrevJset.push({
						'crud'           : 'D',
						'wkspId'         : this.params.csetNo,
						'wkspId'         : this.params.wkspId,
						'jsetNo'         : element.attributes.target['jsetNo']
					});
				}
			}
		},
		// 줌인
		zoomIn: function() {
			this.zoomLevel = Math.min(3, this.zoomLevel + 0.2);
			this.resizePage();
		},
		// 줌아웃
		zoomOut: function() {
			this.zoomLevel = Math.max(0.2, this.zoomLevel - 0.2);
			this.resizePage();
		},
		// 페이지 재조정
		resizePage: function() {
			
			this.paper.translate(0, 0);
			this.paper.scale(this.zoomLevel, this.zoomLevel);
			
			this.paper.setDimensions(Math.round(this.width * this.zoomLevel), Math.round(this.height * this.zoomLevel));
		
			var left = $('.paper-scroller-background').width()  - Math.round(this.width  * this.zoomLevel);
			var top  = $('.paper-scroller-background').height() - Math.round(this.height * this.zoomLevel);
			if ( left < 0 ) {	left = 0;	} else {	left = left / 2;	}
			if ( top  < 0 ) {	top  = 0;	} else {	top  = top  / 2;	}
			$('.joint-pager').css('left', left);
			$('.joint-pager').css('top' , top);
		},
		onSetButtonClick(div) {
            const $this = this;
            switch ( div ) {
                case 'init':
                    $this.init();
                    break;
                case 'select':
                    $this.selectCnts();
                    break;
                case 'save':
					$this.save();
                    break;
                case 'delete':
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
