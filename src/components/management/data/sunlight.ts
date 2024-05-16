import {single, multi, status, select, text, none} from './base'

export const sunlight = [
  {        
    parent: '전압 및 전류 계측정보',
    type: single,
    title: '태양광 모듈',
    items: [
      {type: text, title: '형식', unit: ''},
      {type: text, title: '최대전력용량', unit: 'kW'},
      {type: text, title: '최대동작전압', unit: 'V'},
      {
        type: text,
        title: '최대동작전류',
        unit: 'A',
        end: true
      }
    ]
  },
  {
    parent: '전압 및 전류 계측정보',
    type: single,
    title: '인버터',            
    items: [
      {type: text, title: '형식', unit: ''},
      {type: text, title: '정격용량', unit: 'kW'},
      {type: text, title: '최소 입력전압', unit: 'V'},
      {type: text, title: '최대 입력전압', unit: 'V'},
      {
        type: text,
        title: '출력전압',
        unit: 'V',
        end: true
      }
    ]
  },
  {    
    parent: '전압 및 전류 계측정보',    
    type: multi,
    title: '절연저항',            
    items: [{type: status}]
  },
  {    
    parent: '태양광 모듈 점검사항',    
    type: multi,
    title: '외형적 관리상태',            
    items: [
      {type: status},
    ]
  },
  {    
    parent: '인버터(전략변환장치} 점검사항',    
    type: multi,
    title: '외형적 관리상태',
    items: [
      {type: status},
    ]
  },
  {    
    parent: '인버터(전략변환장치} 점검사항',    
    type: single,
    title: '작동(소음, 진동, 발열 등} 상태',            
    items: [
      {type: status},
    ]
  },
  {    
    parent: '인버터(전략변환장치} 점검사항',    
    type: single,
    title: '배선 및 접속 단자 상태',
    items: [
      {type: status},
    ]
  },
  {    
    parent: '인버터(전략변환장치} 점검사항',    
    type: single,
    title: '설치환경(온습도, 청결 등}의 상태',
    items: [
      {type: status},
    ]
  },
  {    
    parent: '인버터(전략변환장치} 점검사항',    
    type: single,
    title: '설정값(저주파, 계전기, 보호장치 등}의 적정성 여부',
    items: [
      {type: status},
    ]
  },
  {    
    parent: '인버터(전략변환장치} 점검사항',    
    type: single,
    title: '표시부 동작 확인',
    items: [
      {type: status},
    ]
  }
]

