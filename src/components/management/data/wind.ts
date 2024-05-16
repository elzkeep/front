import {single, multi, status, select, text, none} from './base'

export const wind = [  
  {
    type: single,
    title: '풍차 설비',            
    items: [
      {type: status, title: '터빈 자동정지장치 동작상태'},
      {type: status, title: '터빈 운전상태 및 계측장치 확인'},
      {type: status, title: '풍력설비 비상정지 및 안전장치 상태'},
      {type: status, title: '기어박스 윤활유 및 유압장치 작동유 누유여부 확인'},
    ]
  },
  {
    type: single,
    title: '발전기',            
    items: [
      {type: status, title: '비상정지 및 안전장치 상태'},
      {type: status, title: '부하운전상태 및 계측장치 확인(전압, 전류}'},
      {type: status, title: '운전 시 이상소음 발생여부'},
    ]
  },
  {
    type: multi,
    title: '전력변환장치',            
    items: [
      {type: status, title: '외형적(손상 및 변형 등} 관리상태'},
      {type: status, title: '배선 및 접속단자 상태'},
      {type: status, title: '설치환경(온습도, 청결 등}의 상태'},
      {type: status, title: '인버터 입/출력 운전상태'},
    ]
  },
  {
    parent: '보호장치 및 경보장치',
    type: multi,
    title: '보호계전기 설정값 및 계전기 연동상태',            
    items: [
      {type: status},
    ]
  },
  {
    parent: '보호장치 및 경보장치',
    type: multi,
    title: '경보장치 작동상태',            
    items: [
      {type: status},
    ]
  },
  {
    parent: '보호장치 및 경보장치',
    type: multi,
    title: '기타 보호장치의 설계 동작상태 여부 확인',            
    items: [
      {type: status},
    ]
  },
  {
    type: single,
    title: '지지물',
    items: [
      {type: status, title: '지지물 결속 상태 및 기초부지 배수 처리 상태'},
      {type: status, title: '지지물의 볼트체결 상태 및 이상여부'},
    ]
  },
  {
    type: single,
    title: '기타 사항',
    items: [
      {type: status, title: '운전/유지보수 기록 및 서류보존 상태'},
      {type: none, title: '절연/접지저항 측정'},
      {type: text, title: '접지저항', unit: 'Ω'},
      {
        type: text,
        title: '절연저항',
        unit: 'MΩ',
        end: true
      },
      {type: status},
      {type: status, title: '소방설비 상태'},
    ]
  }
]
