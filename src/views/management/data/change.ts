import {single, multi, status, select, text} from './base'

const changes = [
  {    
    type: multi,
    title: '변압기 (TR 1)',
    items: [
      {
        type: select,
        title: '형식',
        items: [
          {id: 0, value: '없음'},
          {id: 1, value: '몰드형'},
          {id: 2, value: '유입형'},
        ]
      },
      {type: none, title: '전압 및 전류 계측 정보'},
      {type: text, title: 'TR용량', unit: 'KVA'},
      {type: text, title: '전압', unit: 'V'},
      {type: text, title: 'A상', unit: 'V'},
      {type: text, title: 'B상', unit: 'V'},
      {type: text, title: 'C상', unit: 'V'},
      {type: text, title: 'N상', unit: 'V'},
      {
        type: text,
        title: '온도',
        unit: '°C',
        end: true
      },
      {type: status},
      {type: status, title: '외관 관리상태'},
      {
        type: status,
        title: '관리 온도 이상 여부',
        visible: 1
      }
    ]
  }
]
