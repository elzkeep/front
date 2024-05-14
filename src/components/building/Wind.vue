<template>

  
  <y-table style="margin-top:10px;">
    <y-tr>
      <y-th>설비명</y-th>      
      <y-th>풍차설비</y-th>
      <y-th>발전설비</y-th>      
      <y-th style="width:30px;"></y-th>
    </y-tr>
    <y-tr v-for="(item, index) in data.items">
      <y-td>
        <y-table>
          <y-tr>
            <y-td>
              <el-input v-model="data.items[index].name" />
            </y-td>
          </y-tr>
        </y-table>
      </y-td>
      <y-td>
        <y-table>
          <y-tr>
            <y-th style="width:100px;">형식</y-th>
            <y-td>
              <el-input v-model="data.items[index].value1" />
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>정격용량</y-th>
            <y-td>
              <el-input v-model="data.items[index].value2" style="width:50px;" /> kW
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>제조사</y-th>
            <y-td>
              <el-input v-model="data.items[index].value3" />
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>제조번호</y-th>
            <y-td>
              <el-input v-model="data.items[index].value4" />
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>제작년월</y-th>
            <y-td>
              <el-input v-model="data.items[index].value5" style="width:50px;" /> 년 <el-input v-model="data.items[index].value6" style="width:30px;" /> 월
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>풍차날개</y-th>
            <y-td>
              개수 <el-input v-model="data.items[index].value7" style="width:50px;" /> 개 &nbsp;&nbsp;&nbsp; 직경 <el-input v-model="data.items[index].value8" style="width:50px;" /> m
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>풍향조건</y-th>
            <y-td>
              시동 <el-input v-model="data.items[index].value9" style="width:50px;" /> m/s &nbsp;&nbsp;&nbsp; 정격 <el-input v-model="data.items[index].value10" style="width:50px;" /> m/s &nbsp;&nbsp;&nbsp; 정지 <el-input v-model="data.items[index].value11" style="width:50px;" /> m/s
            </y-td>
          </y-tr>
        </y-table>        
      </y-td>
      <y-td>
        <y-table>
          <y-tr>
            <y-th style="width:100px;">형식</y-th>
            <y-td colspan="3">
              <el-input v-model="data.items[index].value12" />
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>정격용량</y-th>
            <y-td colspan="3">
              <el-input v-model="data.items[index].value13" style="width:50px;" /> kW
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>제조사</y-th>
            <y-td colspan="3">
              <el-input v-model="data.items[index].value14" />
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>제조번호</y-th>
            <y-td colspan="3">
              <el-input v-model="data.items[index].value15" />
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>제작년월</y-th>
            <y-td colspan="3">
              <el-input v-model="data.items[index].value16" style="width:50px;" /> 년 <el-input v-model="data.items[index].value17" style="width:30px;" /> 월
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>극수</y-th>
            <y-td>
              <el-input v-model="data.items[index].value18" style="width:50px;" /> 극
            </y-td>
            <y-th style="width:100px;">역률</y-th>
            <y-td>
              <el-input v-model="data.items[index].value19" style="width:50px;" /> %
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>정격전압</y-th>
            <y-td>
              <el-input v-model="data.items[index].value20" style="width:50px;" /> V
            </y-td>
            <y-th>정격전류</y-th>
            <y-td>
              <el-input v-model="data.items[index].value21" style="width:50px;" /> A
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>절연저항</y-th>
            <y-td>
              <el-input v-model="data.items[index].value22" style="width:50px;" /> MΩ
            </y-td>
            <y-th>접지저항</y-th>
            <y-td>
              <el-input v-model="data.items[index].value23" style="width:50px;" /> Ω
            </y-td>
          </y-tr>
          
        </y-table>
      </y-td>
      <y-td style="text-align:center;">
        <el-button v-if="index == 0" size="small" class="filter-item" type="primary" @click="clickAdd"><el-icon><Plus /></el-icon></el-button>
        <el-button v-if="index != 0" size="small" class="filter-item" type="danger" @click="clickDelete(index)"><el-icon><Close /></el-icon></el-button>
      </y-td>            
    </y-tr>
</y-table>



  <div style="margin-top:10px;text-align:left;">
    <el-button class="filter-item" type="success" @click="clickSubmit">저장</el-button>
  </div>
</template>


<script setup lang="ts">

import { ref, reactive, onMounted, onUnmounted } from "vue"
import router from '~/router'
import { util, size }  from "~/global"
import { Company, Facility, Building } from "~/models"
import Extra from '~/models/extra'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElTable } from 'element-plus'
import type { UploadProps } from 'element-plus'

const props = defineProps({
  id: Number
})

const { width, height } = size()

const store = useStore()
const route = useRoute()

const model = Facility

const category = 80

const item = {
  id: 0,
  value1: '',
  value2: '',
  value3: '',
  value4: '',
  value5: '',
  value6: '',
  value7: '',
  value8: '',
  value9: '',
  value10: '',
  value11: '',
  value12: '',
  value13: '',
  value14: '',
  value15: '',
  value16: '',
  value17: '',
  value18: '',
  value19: '',
  value20: '',
  value21: '',
  value22: '',
  value23: '',
  value24: '',
  value25: '',
  building: 0
}

const data = reactive({
  id: 0,
  name: '',
  item: util.clone(item),  
  items: []  
})

async function initData() {
}

async function getItems() {
  let res = await model.find({
    building: data.id,
    category: category,
    orderby: 'f_id'
  })
  
  if (res.items.length > 0) {    
    data.item = res.items[0]    
  } else {
    res = await Building.get(data.id)    
    
    data.name = res.item.name
  }

  res = await model.find({
    building: data.id,
    category: category + 1,
    orderby: 'f_id'
  })
  
  data.items = res.items
  
  if (data.items.length == 0) {
    clickAdd()
  }
}

onMounted(async () => {
  data.id = util.getInt(route.params.id) 
  
  util.loading(true)

  await initData()
  await getItems()

  util.loading(false)
})

function makeData(item) {
  for (let i = 1; i <= 20; i++) {
    const name = `value${i}`
    item[name] = '' + item[name]
  }

  return item
}

async function clickSubmit() {
  util.loading(true)
  
  let item = makeData(util.clone(data.item))
  item.building = data.id
  item.category = category
  
  if (item.id > 0) {
    await model.update(item)
  } else {
    await model.insert(item)
  }

  await model.deleteByBuildingCategory(data.id, category + 1)

  for (let i = 0; i < data.items.length; i++) {
    let item = makeData(util.clone(data.items[i]))
    item.building = data.id
    item.category = category + 1
    
    await model.insert(item)
  }

  await Extra.score(data.id);
  
  util.alert('저장되었습니다')
  
  util.loading(false)  
}

function clickAdd() {
  let item2 = util.clone(item)
  item2.name = data.name + ' 풍력발전소' 
  data.items.push(
    item2
  )
}

function clickDelete(pos) {
  let items = util.clone(data.items)

  items.splice(pos, 1)
  data.items = items
}

</script>

