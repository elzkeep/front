import {single, multi, status, select, text, none} from './base'

export const generator = [
  {
    type: multi,
    title: '발전기',
    items: [
      {type: none, title: '발전기 운전'},
      {type: text, title: '출력전압', unit: 'V'},
      {type: text, title: '부하전류', unit: 'A'},
      {
        type: text,
        title: '운전시간',
        unit: 'h/m',
        end: true},
    ]
  }
]

