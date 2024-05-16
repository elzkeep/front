import {single, multi, status, select, text, none} from './base'

export const load = [
  {
    type: multi,
    title: '전열기구 운용상태',            
    items: [{type: status}]
  },
  {
    parent: '조명설비',
    type: multi,
    title: '조명설비 및 관리상태',            
    items: [{type: status}]
  },
  {
    parent: '조명설비',
    type: multi,
    title: '용도에 맞는 조도상태',            
    items: [{type: status}]
  },
  {
    parent: '구내전선',
    type: multi,
    title: '구내전선 외관 및 관리상태',
    items: [{type: status}]
  },
  {
    parent: '구내전선',
    type: multi,
    title: '시공방법의 적합성',
    items: [{type: status}]
  },
  {
    type: multi,
    title: '기타 부하설비',
    items: [{type: status}]
  }
]

