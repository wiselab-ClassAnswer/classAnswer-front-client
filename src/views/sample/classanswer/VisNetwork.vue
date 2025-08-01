<template>
    <div ref="networkContainer" style="width: 100%; height: 1500px; border:1px solid black"></div>
</template>

<script>
import { Network } from 'vis-network';
import 'vis-network/styles/vis-network.css';

export default {
    name: 'VisNetwork',
    data () {
        return {
            people: [
                { id: 1, label: '이지은', gender: 'female' },
                { id: 2, label: '김남준', gender: 'male' },
                { id: 3, label: '김지수', gender: 'female' },
                { id: 4, label: '변백현', gender: 'male' },
                { id: 5, label: '배수지', gender: 'female' },
                { id: 6, label: '우지호', gender: 'male' },
                { id: 7, label: '김태연', gender: 'female' },
                { id: 8, label: '박재범', gender: 'male' },
                { id: 9, label: '김예림', gender: 'female' },
                { id: 10, label: '왕잭슨', gender: 'male' },
                { id: 11, label: '이채린', gender: 'female' },
                { id: 12, label: '권지용', gender: 'male' },
                { id: 13, label: '이선미', gender: 'female' },
                { id: 14, label: '이태민', gender: 'male' },
                { id: 15, label: '김현아', gender: 'female' },
                { id: 16, label: '정호석', gender: 'male' },
                { id: 17, label: '장원영', gender: 'female' },
                { id: 18, label: '전정국', gender: 'male' },
                { id: 19, label: '김채원', gender: 'female' },
                { id: 20, label: '박형식', gender: 'male' },
            ]
        }
    },

    methods: {
        generateEdges(count = 30) {
            const $this = this;

            const edges = [];
            const edgeSet = new Set();

            while (edges.length < count) {
                const from = $this.people[Math.floor(Math.random() * $this.people.length)].id;
                let to = from;
                while (to === from) {
                to = $this.people[Math.floor(Math.random() * $this.people.length)].id;
                }

                const key = `${from}-${to}`;
                const reverseKey = `${to}-${from}`;
                if (!edgeSet.has(key)) {
                    edgeSet.add(key);
                    edges.push({ from, to });
                }
            }
        return edges;
    },

    styleEdges(edges) {
        return edges.map(edge => {
            const reverseExists = edges.some(e => e.from === edge.to && e.to === edge.from);
            return {
                smooth: false,
                from: edge.from,
                to: edge.to,
                arrows: reverseExists
                    ? { to: true, from: true }
                    : { to: true },
                color: reverseExists ? '#00AA00' : '#FF5555',
                width: reverseExists ? 3 : 2,
                length: 400
            };
        });
    },

    calculateDegrees(edges) {
        const map = {};
        edges.forEach(e => {
            // 들어오는 간선과 나가는 간선 모두 계산
            map[e.to] = (map[e.to] || 0) + 1;
            map[e.from] = (map[e.from] || 0) + 1;
        });
        return map;
    },

    createNodes(degreeMap) {
        const $this = this;
        return $this.people.map((p, index)=> {
            //노드에 들어온 간선 수수
            const degree = degreeMap[p.id] || 0;
            //성별
            const genderIcon = p.gender === 'female' ? '👩‍🦰' : '👨‍🦰';
            //성별에 따른 배경색 설정
            const genderColor = p.gender === 'female' ? '#FFA500' : '#3399FF';
            //노트 라벨 ID + 이름
            const label = `${p.id}: ${p.label}\n${genderIcon} | ${degree}`;
            //degree에 따라 노드 크기 증가 (더 큰 증가폭)
            const size = Math.max(40, 30 + degree * 10);
            //degree에 따라 폰트 크기도 조정
            const fontSize = Math.max(12, 14 + degree * 2);

            return {
                id: p.id,           //노드 고유 아이디
                label,              //노트 라벨
                shape: 'ellipse',   // 노트 모양 (box, ellipse..)                
                color: {
                    background: genderColor,     //노드 배경색 (성별에 따라 다르게)
                    border: '#333333',           //외곽선 색
                    highlight: {            
                        background: genderColor, //하이라이트 시 배경 유지
                        border: '#000000'        //하이라이트 시 외곽선 강조
                    }
                },
                font: {
                    size: fontSize,         // 라벨 글씨 크기 (degree에 따라 조정)
                    face: 'Arial',          // 폰트 종류
                    align: 'center',        // 정렬 (왼, 오, 중)
                    color: '#000000',       // 글자 색
                    multi: 'html',          // 줄바꿈 허영 (\n)
                    weight: 800             // 폰트 굵기
                },
                margin: 10,                 //노드 내부 여백
                borderRadius: 100,          //둥글게 처리
                size: size,                 //사이즈 설정
            };
        });
    },


    getNetworkOptions() {
        return {
            //노드 물리엔진 설정
            physics: {
                enabled: true,
                barnesHut: {
                    gravitationalConstant: -80000,  // 음수일수록 노드 간 밀어내는 힘이 강해짐
                    springLength: 300,              // 간선 길이 기본값 (길면 노드 간 거리 벌어짐)
                    springConstant: 0.04,           // 스프링 탄성, 작게 하면 덜 흔들림
                    damping: 0.15,                  // 운동 감쇠, 너무 작으면 노드 계속 움직임
                    avoidOverlap: 1,                // 노드 겹침 방지 (1은 활성화)
                    centralGravity: 0.2
                },
                stabilization: {
                    iterations: 300,
                    updateInterval: 25
                }
            },
            interaction: {
                dragNodes: true,
                dragView: true
            },
        };
    }
    },

    mounted() {
        //엣지 생성
        const rawEdges = this.generateEdges(40);
        //엣지 스타일 설정
        const styledEdges = this.styleEdges(rawEdges);
        //노드 들어온 간선 계산
        const degreeMap = this.calculateDegrees(styledEdges);
        //노드 생성 (스타일)
        const nodes = this.createNodes(degreeMap);
        
        const data = { nodes, edges: styledEdges };
        const options = this.getNetworkOptions();

        this.network = new Network(this.$refs.networkContainer, data, options);
    },
};
</script>
