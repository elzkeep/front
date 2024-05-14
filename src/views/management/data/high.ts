import {single, multi, status, select, text, none} from './base'

const high = [  
  {
    type: single,
    title: '전압 및 전류 계측값',            
    items: [
      {
        type: text,
        title: '전압',
        unit: 'kV',
        end: true
      },
      {
          type: text,
          title: 'A상',
          unit: 'V',
        },
      {
          type: text,
          title: 'B상',
          unit: 'V',
        },
      {
          type: text,
          title: 'C상',
          unit: 'V',
        },
      {
          type: text,
          title: 'N상',
          unit: 'V',
          end: true
        }
    ]
  },
  {
    type: single,
    title: '개폐기',            
    items: [
      {
        type: select,
        title: '개폐기 종류',
        items: [
          {id: 0, value: '없음'},
          {id: 1, value: 'LBS'},
          {id: 2, value: 'ASS'},
          {id: 3, value: 'DS'},
          {id: 4, value: 'ALTS'},
          {id: 5, value: 'LS'},
          {id: 6, value: 'PF'},
          {id: 7, value: 'COS'}
        ]
      },
      {type: status, title: '외관 관리상태'},
      {type: status, title: '간선(한전 책임분계점 이후} 상태'},
      {type: status, title: '자동/수동 조작시 작동여부'},
    ]
  },
  {
    type: single,
    title: '변성기(MOF, PT, C} 관리상태',            
    items: [
      {type: status},
    ]
  },
  {
    type: multi,
    title: '고압차단기',            
    items: [
      {type: status, title: '외관 및 간선 연결상태'},
      {type: status, title: '자동/수동 조작시 작동여부'},
      {type: status, title: '장비 내 발열여부'},
    ]
  },
  {
    type: multi,
    title: '계전기',            
    items: [
      {type: status, title: '외관 및 파손상태'},
      {type: status, title: '통신 연결상태'},
    ]
  },
  {
    type: multi,
    title: '피뢰기 관리상태',            
    items: [
      {type: status},
    ]
  }
]

