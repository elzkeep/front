import {single, multi, status, select, text, none} from './base'

const etc = [
  {
    type: single,
    title: '한전 인입강선 상태',
    items: [{type: status}]
  },
  {
    type: multi,
    title: '접지 설비 상태',            
    items: [{type: status}]
  },
  {
    type: single,
    title: '보호울타리 및 위험표시 상태',            
    items: [{type: status}]
  },
  {
    type: multi,
    title: '시건 잠금 장치의 설치 상태',            
    items: [{type: status}]
  },
  {
    type: single,
    title: '빗물 누수 및 침수 우려',            
    items: [{type: status}]
  },
  {
    type: single,
    title: '계측장비 설치상태',            
    items: [{type: status}]
  },
  {
    type: multi,
    title: '기타 안전 설비',            
    items: [{type: status}]
  }
]
