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
    <span v-for="(item, index) in topcategorys"><el-button @click="clickTopcategory(index)" v-if="index != 0 && index != 13" style="margin-right:5px;margin-bottom:5px;">{{topcategorys[index]}}</el-button></span>
  </div>


  <el-dialog v-model="form.visible" width="800px">
    <div style="font-size:16px;font-weight:bold;">{{topcategorys[form.topcategory]}}</div>

    <div style="margin:20px 0px;overflow:auto;" :style="{height: height(400)}">
      <div v-for="(item, index) in form.items" style="border:1px solid #ccc;border-radius:3px;margin-top:10px;padding:10px 10px;background:#f0f0f0;">
        <div v-if="item.type == single" style="font-size:16px;font-weight:bold;">{{form.items[index].title}}</div>
        <div v-if="item.type == multi" style="display:flex;justify-content:space-between;gap:10px;">  
          <el-input v-model="form.items[index].title" input-style="margin: 10px 0px;font-size:16px;font-weight:bold;" />
          <div style="margin-top:3px;">
            <el-icon v-if="item.suborder == 0" style="font-size:20px;" @click="clickAdd(item.category)"><Plus /></el-icon>
            <el-icon v-if="item.suborder != 0" style="font-size:20px;" @click="clickDelete(index)"><Minus /></el-icon>
          </div>
        </div>

        <div v-for="(subitem, subindex) in item.items">
          <div v-if="subitem.type == text && isVisible(index, subindex)" style="display:flex;margin:5px 5px;font-size:12px;">
            <div style="width:80px;font-size:12px;">{{subitem.title}}</div> <el-input style="width:200px;" v-model="form.items[index].items[subindex].value" /> &nbsp;{{subitem.unit}}
          </div>
          <div v-if="subitem.type == select">
            <div style="margin:10px 0px 5px 0px;font-size:14px;" v-if="subitem.title != ''">{{subitem.title}}</div>
            <el-select size="small" v-model="form.items[index].items[subindex].value" placeholder="">
              <el-option v-for="item in form.items[index].items[subindex].items" :key="item.id" :label="item.value" :value="item.id"/>
            </el-select>
          </div>
          <div v-if="subitem.type == status" style="border:1px solid #ccc;border-radius:3px;margin-top:10px;padding:10px 10px;background:#ddd;">
            <div style="margin:0px 0px 5px 0px;font-size:14px;" v-if="subitem.title != ''">{{subitem.title}}</div>
            <el-radio-group v-model="form.items[index].items[subindex].value">
              <el-radio-button size="small" value="1">적합</el-radio-button>
              <el-radio-button size="small" value="2">부적합</el-radio-button>
              <el-radio-button size="small" value="3">요주의</el-radio-button>
              <el-radio-button size="small" value="4">해당없음</el-radio-button>
            </el-radio-group>
            <div v-if="form.items[index].items[subindex].value == 2 || form.items[index].items[subindex].value == 3">

              <div style="margin:10px 0px 5px 0px;font-size:14px;">사유</div>
              
              <el-select size="small" v-model="form.items[index].items[subindex].reason" placeholder="">
                <el-option v-for="(item, index) in statusReasons" :key="index" :label="item" :value="index"/>
              </el-select>

              <el-input style="margin-top:5px;" v-if="form.items[index].items[subindex].reason == 1" v-model="form.items[index].items[subindex].reasontext" />

              <div style="margin:10px 0px 5px 0px;font-size:14px;">조치사항</div>

              <el-select size="small" v-model="form.items[index].items[subindex].action" placeholder="">
                <el-option v-for="(item, index) in statusActions" :key="index" :label="item" :value="index"/>
              </el-select>

              <el-input style="margin-top:5px;" v-if="form.items[index].items[subindex].action == 1" v-model="form.items[index].items[subindex].actiontext" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button size="small" @click="clickCancel">취소</el-button>
      <el-button size="small" type="primary" @click="clickSubmit">등록</el-button>
    </template>
  </el-dialog>
  
  
</template>


<script setup lang="ts">

import { ref, reactive, onMounted, onUnmounted, watch } from "vue"
import router from '~/router'
import { util, size }  from "~/global"
import { Report, Data, Item } from "~/models"
import Extra from '~/models/extra'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { single, multi, status, select, text } from './data/base'
import { change } from './data/change'
import { charger } from './data/charger'
import { ess } from './data/ess'
import { etc } from './data/etc'
import { fuel } from './data/fuel'
import { generator } from './data/generator'
import { high } from './data/high'
import { load } from './data/load'
import { low } from './data/low'
import { sunlight } from './data/sunlight'
import { thermography } from './data/thermography'
import { ups } from './data/ups'
import { wind } from './data/wind'

defineExpose({
  readData
})

const { width, height } = size()

const store = useStore()
const route = useRoute()

const item = {
  id: 0,
  action: 0,
  actiontext: '',
  content: '',
  data: 0,
  image: '',
  order: 0,
  reason: 0,
  reasontext: '',
  report: 0,
  status: 0,
  title: '',
  topcategory: 0,
  type: 0,
  unit: '',
  value: 0,
  value1: 0,
  value2: 0,
  value3: 0,
  value4: 0,
  value5: 0,
  value6: 0,
  value7: 0,
  value8: 0,
  date: ''
}

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

const statusReasons = [
  '없음',
  '직접입력',
  '누전',
  '단락',
  '단선',
  '작동불량',
  '파손',
  '오염',
  '노후',
  '누유',
  '누수',
  '균열',
  '발열',
  '이상음'
]

const statusActions = [
  '없음',
  '직접입력',
  '점검중',
  '조치완료',
  '수리 및 정비요함',
  '교체요함',
  '설치요함'
]

const form = reactive({
  items: [],
  visible: false,
  topcategory: 0
})

async function clickSearch() {
  await getItems(true)
}

async function initData() {
  let res = await Report.get(data.id)
  data.report = res.item
  
  //data.topcategorys = [...new Set(util.clone(datas).map(item => item.topcategory))].sort(function(a, b){ return a-b; })
}

async function getItems() {  

}

onMounted(async () => {
  data.session = store.getters['getUser']
  /*
     data.id = util.getInt(route.params.id)

     util.loading(true)
     
     await initData()
     await getItems()

     util.loading(false)
   */
})

async function clickTopcategory(id) {
  const dataitems = [null, low, high, change, load, generator, etc, sunlight, charger, ess, ups, fuel, wind, null, thermography]

  let dataitem = util.clone(dataitems[id])

  for (let i = 0; i < dataitem.length; i++) {
    if (dataitem[i].type == multi) {
      dataitem[i].suborder = 0
    }
    
    for (let j = 0; j < dataitem[i].items.length; j++) {
      if (dataitem[i].items[j].type != 3) {
        continue
      }

      dataitem[i].items[j].value = 4
    }

    dataitem[i].category = i + 1
  }

  let res = await Data.find({
    report: data.id,
    topcategory: id,
    orderby: 'd_order'
  })
  
  let datas = res.items

  res = await Item.find({
    report: data.id,
    topcategory: id,
    orderby: 'i_order,i_id'
  })
  
  if (datas.length == 0 || res.items.length == 0) {
    form.topcategory = id
    form.items = dataitem
    form.dataitem = util.clone(dataitems[id])
    form.visible = true
    return
  }
  
  let items = []
  let suborder = 0
  let oldcategory = 0
  let pos = 0

  for (let i = 0; i < datas.length; i++) {
    let item = datas[i]

    if (item.category == oldcategory) {
      suborder++
    } else {
      suborder = 0
    }

    let ditem = util.clone(dataitem[item.category - 1])
    ditem.suborder = suborder    
    ditem.title = item.title

    for (let j = 0; j < ditem.items.length; j++) {
      let t = ditem.items[j]

      if (t.type == select) {
        ditem.items[j].value = res.items[pos].value
      } else if (t.type == text) {
        ditem.items[j].value = res.items[pos].content
      } else if (t.type == status) {
        ditem.items[j].value = res.items[pos].status
        ditem.items[j].reason = res.items[pos].reason
        ditem.items[j].reasontext = res.items[pos].reasontext
        ditem.items[j].action = res.items[pos].action
        ditem.items[j].actiontext = res.items[pos].actiontext
      }      
      
      pos++
    }

    items.push(ditem)
    
    oldcategory = item.category
  }

  form.topcategory = id
  form.items = items
  form.dataitem = util.clone(dataitems[id])
  form.visible = true
}

function clickAdd(category) {
  var pos = -1
  var suborder = 1
  for (let i = 0; i < form.items.length; i++) {
    if (form.items[i].category > category) {
      pos = i
      break
    } else if (form.items[i].category == category) {
      suborder = form.items[i].suborder + 1
    }
  }

  let items = util.clone(form.items)
  let nitem = util.clone(form.dataitem[category - 1])
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

async function clickSubmit() {
  util.loading(true)
  
  let datas = []
  
  for (let i = 0; i < form.items.length; i++) {
    let items = []
    
    let d = form.items[i]

    let report = {
      id: 0,
      category: d.category,
      company: data.session.company,
      order: i,
      report: data.id,
      title: d.title,
      topcategory: form.topcategory,
      type: d.type
    }

    for (let j = 0; j < d.items.length; j++) {
      let item = util.clone(d.items[j])

      item.report = data.id
      item.topcategory = form.topcategory
      
      if (item.type == select) {
        item.value = util.getInt(item.value)
      } else if (item.type == text) {
        item.content = item.value
      } else if (item.type == status) {
        item.status = util.getInt(item.value)
      }

      items.push(item)
    }

    let dataitem = {
      report: data.id,
      data: report,
      items: items
    }

    datas.push(dataitem)
  }

  await Extra.dataitemProcess(datas)
  form.visible = false

  util.loading(false)
}

function clickCancel() {
  form.visible = false
}

async function readData(id) {
  data.id = id

  util.loading(true)
  
  await initData()
  await getItems()

  util.loading(false)    
}
</script>
