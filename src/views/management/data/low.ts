import {single, multi, status, select, text} from './base'

export const low = [
  {
    type: single,
    order: 1,
    suborder: 0,
    title: '전압 및 전류 계측값',
    items: [
      {
        type: select,
        title: 'Main 전압/전류',
        items: [
          {id: 0, value: '전압'},
          {id: 1, value: '380v/220v'},
          {id: 2, value: '220v'},
        ],
        value: 1
      },
      {
        type: text,
        title: 'A상',
        unit: 'V',
        visible: 1,
      },
      {
        type: text,
        title: 'B상',
        unit: 'V',
        visible: 1,
      },
      {
        type: text,
        title: 'C상',
        unit: 'V',
        visible: 1,
      },
      {
        type: text,
        title: 'N상',
        unit: 'V',
        visible: 1,
        end: true,
      },
      {
        type: text,
        title: '',
        unit: 'V',
        visible: 2,
      },
      {
        type: text,
        title: 'N상',
        unit: 'V',
        visible: 2,
        end: true,
      }
    ]
  },
  {
    type: multi,
    order: 2,
    suborder: 0,
    title: '배선용 차단기 적정성',
    items: [
      {type: status, value: 4},
    ],
  },
  {
    type: multi,
    order: 3,
    suborder: 0,
    title: '저압차단기',
    items: [
      {
        type: select,
        title: '차단기 종류', 
        items: [
          {id: 0, value: '없음'},
          {id: 1, value: 'ABC'},
          {id: 2, value: 'MCCB'},
          {id: 3, value: 'ELB'},
        ]
      },
      {type: status, title: '외관 및 간선 연결상태'},
      {type: status, title: '자동/수동 조작시 작동여부'},
      {type: status, title: '장비내 발열여부'},
    ]
  },
  {
    type: multi,
    order: 4,
    suborder: 0,
    title: '계전기',
    items: [
      {type: status, title: '외관 및 파손 상태'},
      {type: status, title: '통신 연결상태'},
    ]
  },
  {
    type: multi,
    order: 5,
    suborder: 0,
    title: '콘덴서 관리상태',
    items: [
      {type: status},
    ]
  },
  {
    type: multi,
    order: 6,
    suborder: 0,
    title: '분배전반',
    items: [
      {type: status, title: '외관 및 간선 연결상태'},
      {type: status, title: '규격에 맞는 기기(차단기, 전선 등) 사용 여부'},
      {type: status, title: '누전차단기 작동여부'},
      {type: status, title: '부하장비명 표기 상태'},
    ]
  },
  {
    type: multi,
    order: 7,
    suborder: 0,
    title: 'MCC반 운용상태',
    items: [
      {type: status},
    ]
  }
] 
