<template>


  <y-table>
    <y-tr>
      <y-th style="width:80px;">
        점검지명
      </y-th>
      <y-td>
        {{data.report.title}}
      </y-td>
    </y-tr>
    <y-tr>
      <y-th style="width:80px;">
        점검일시
      </y-th>
      <y-td>
        {{data.report.checkdate}}
        {{data.report.checktime}}
      </y-td>
    </y-tr>    
  </y-table>

  <div style="margin-top:10px;">
    <el-button v-for="item in data.topcategorys" @click="clickTopcategory(item)">{{topcategorys[item]}}</el-button>
  </div>

  <div v-for="(item, index) in form.items" style="border:1px solid #ccc;border-radius:3px;margin-top:10px;padding:10px 10px;">
    <div v-if="item.type == single" style="font-size:16px;font-weight:bold;">{{item.title}}</div>
    <div v-if="item.type == multi" style="display:flex;justify-content:space-between;gap:10px;">  
      <el-input v-model="item.title" input-style="margin: 10px 0px;font-size:16px;font-weight:bold;" />
      <div style="margin-top:3px;">
        <el-icon v-if="item.suborder == 0" style="font-size:20px;" @click="clickAdd(item.order)"><Plus /></el-icon>
        <el-icon v-if="item.suborder != 0" style="font-size:20px;" @click="clickDelete(index)"><Minus /></el-icon>
      </div>
    </div>

    <div v-for="(subitem, subindex) in item.items">
      <div v-if="subitem.type == text && isVisible(index, subindex)" style="display:flex;margin:5px 5px;">
        <div style="width:50px;">{{subitem.title}}</div> <el-input style="width:200px;" v-mode="form.items[index].items[subindex].value" /> &nbsp;{{subitem.unit}}
      </div>
      <div v-if="subitem.type == select">
        <div style="margin:10px 0px 5px 0px;font-size:14px;" v-if="subitem.title != ''">{{subitem.title}}</div>
        <el-select size="small" v-model="form.items[index].items[subindex].value" placeholder="">
          <el-option v-for="item in form.items[index].items[subindex].items" :key="item.id" :label="item.value" :value="item.id"
          />
        </el-select>
      </div>
      <div v-if="subitem.type == status">
        <div style="margin:10px 0px 5px 0px;font-size:14px;" v-if="subitem.title != ''">{{subitem.title}}</div>
        <el-radio-group v-model="form.items[index].items[subindex].value">
          <el-radio-button size="small" value="1">적합</el-radio-button>
          <el-radio-button size="small" value="2">부적합</el-radio-button>
          <el-radio-button size="small" value="3">요주의</el-radio-button>
          <el-radio-button size="small" value="4">해당없음</el-radio-button>
        </el-radio-group>
      </div>
    </div>
  </div>
  
</template>


<script setup lang="ts">

import { ref, reactive, onMounted, onUnmounted } from "vue"
import router from '~/router'
import { util, size }  from "~/global"
import { Report, Data } from "~/models"
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const { width, height } = size()

const store = useStore()
const route = useRoute()

const data = reactive({
  id: 0,
  session: {
    level: 0,
    company: 0
  },
  topcategorys: [],
  report: {}
})

const topcategorys = [
  '',
  '저압설비',
  '고압설비',
  '변전설비',
  '부하설비',
  '발전설비',
  '기타안전설비',
  '태양광 발전설비',
  '전기차 충전기',
  'ESS',
  'UPS',
  '연료전지',
  '풍력발전',
  '수력발전',
  '적외선 열화상']

const single = 1
const multi = 2
const status = 3
const select = 4
const text = 5

const item = [
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

const form = reactive({
  items: util.clone(item)
})


async function clickSearch() {
  await getItems(true)
}

async function initData() {
  let res = await Report.get(data.id)
  data.report = res.item
  console.log(res.item)
  
  res = await Data.find({
    report: data.id,
    orderby: 'd_topcategory,d_order'
  })
  console.log(res)
  
  data.topcategorys = [...new Set(res.items.map(item => item.topcategory))].sort(function(a, b){ return a-b; })
  
  let items = util.clone(item)

  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items[i].items.length; j++) {
      if (items[i].items[j].type != 3) {
        continue
      }

      items[i].items[j].value = 4
    }
  }

  form.items = items
}

async function getItems() {
}

onMounted(async () => {
  data.session = store.getters['getUser']
  data.id = util.getInt(route.params.id)

  util.loading(true)
  
  await initData()
  await getItems()

  util.loading(false)
})

function clickTopcategory(id) {
  console.log(id)
}

function clickAdd(category) {
  var pos = -1
  var suborder = 1
  for (let i = 0; i < form.items.length; i++) {
    if (form.items[i].order > category) {
      pos = i
      break
    } else if (form.items[i].order == category) {
      suborder = form.items[i].suborder + 1
    }
  }

  let items = util.clone(form.items)
  let nitem = util.clone(item[category - 1])
  nitem.suborder = suborder
  
  if (pos == -1) {
    items.push(nitem)
  } else {    
    items.splice(pos, 0, nitem)
  }

  form.items = items
}

function clickDelete(pos) {
  let items = util.clone(form.items)
  items.splice(pos, 1)
  form.items = items
}

function isVisible(index, subindex) {
  let items = util.clone(form.items)
  
  if (index == 0) {
    if (items[index].items[0].value != items[index].items[subindex].visible) {
      return false
    }
  }
  
  return true
}
</script>
