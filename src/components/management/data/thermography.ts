import {single, multi, status, select, text, none} from './base'

export const thermography = [
  {
    type: multi,
    title: '열화상 카메라',            
    items: [
      {type: text, title: '사용전압', unit: 'V'},
      {type: text, title: '측정조건', end: true},
      {
        type: select,
        title: '판정기준', 
        items: [
          {id: 0, value: '판정기준'},
          {id: 1, value: '3성 비교법'},
          {id: 2, value: '온도패턴법'},
        ],
        value: 1
      },
      {type: none, title: '부위별 측정온도'},
      {type: text, title: '측정부위', end: true},
      {type: text, title: 'point1', unit: '°C'},
      {type: text, title: 'point2', unit: '°C'},
      {type: text, title: 'point3', unit: '°C'},
      {
        type: text,
        title: '온도차',
        unit: '°C',
        end: true
      },
      {type: status},
    ]
  }
]
