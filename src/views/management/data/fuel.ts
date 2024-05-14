import {single, multi, status, select, text, none} from './base'

const fuel = [
  {
    type: single,
    title: '일반 사항',
    items: [
      {type: status, title: '외형적(손상 및 변형 등} 관리상태'},
      {type: status, title: '설비별 누수 여부 확인'},
      {type: status, title: '각 기기별 접지상태 확인'},
      {type: status, title: '기계설비 및 배관 등 누설상태 확인'},
      {type: status, title: '고온 노출부 단열상태 확인'},
    ]
  },
  {
    type: multi,
    title: '연료전지',
    items: [
      {type: status, title: '자동정지장치 동작상태'},
      {type: status, title: '운전 계측장치 상태 확인'},
      {type: status, title: '비상정지 및 안전장치 동작상태 확인'},
    ]
  },
  {
    parent: '인버터 및 제어, 보호장치',
    type: multi,
    title: '인버터 입/출력 운전상태',
    items: [
      {type: status},
    ]
  },
  {
    parent: '인버터 및 제어, 보호장치',
    type: single,
    title: '경보장치 작동상태',
    items: [
      {type: status},
    ]
  },
  {
    parent: '인버터 및 제어, 보호장치',
    type: single,
    title: '배선 손상, 접속단자 체결 등 마감처리 상태',
    items: [
      {type: status},
    ]
  },
  {
    parent: '인버터 및 제어, 보호장치',
    type: single,
    title: '보호계전기 설정값 및 계전기 연동상태',
    items: [
      {type: status},
    ]
  },
  {
    type: single,
    title: '부하운전 상태',                
    items: [
      {type: status},
    ]
  },
  {
    parent: '기타 사항',
    type: multi,
    title: '절연/접지저항 측정',
    items: [
      // {type: none},
      {type: text, title: '접지저항', unit: 'Ω'},
      {
        type: text,
        title: '절연저항',
        unit: 'MΩ',
        end: true
      },
      {type: status},
    ]
  },
  {
    parent: '기타 사항',
    type: multi,
    title: '경보장치 작동상태',    
    items: [
      {type: status},
    ]
  },
  {
    parent: '기타 사항',
    type: multi,
    title: '기타 보호장치의 설계 동작상태 여부 확인',  
    items: [
      {type: status},
    ]
  },
  {
    parent: '기타 사항',
    type: single,
    title: '기타 기술기준 등 관련규정 적합',
    items: [
      {type: status},
    ]
  }
]
