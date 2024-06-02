<template>

  <y-table style="margin-top:10px;">
    <y-tr v-for="(item, index) in data.items">
      <y-td>
        <y-table>
          <y-tr>
            <y-th style="width:100px;">설비명</y-th>
            <y-td colspan="3">
              <el-input v-model="data.items[index].name" />
            </y-td>
          </y-tr>
          <y-tr>
            <y-th style="width:100px;">형식</y-th>
            <y-td>
              <el-input v-model="data.items[index].value1" />
            </y-td>
            <y-th style="width:100px;">사용가스</y-th>
            <y-td>
              <el-select size="small" v-model="data.items[index].value2" placeholder="" style="width:150px;">
                <el-option
                  v-for="item in data.gass"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>

              <el-input v-model="data.items[index].value3" v-if="data.items[index].value2 == '4'" style="margin-left:5px;width:100px;" />
            </y-td>
          </y-tr>          
          <y-tr>
            <y-th>정격출력</y-th>
            <y-td>
              <el-input v-model="data.items[index].value4" style="width:50px;" /> kW
            </y-td>
            <y-th>가스소비량</y-th>
            <y-td>
              <el-input v-model="data.items[index].value5" style="width:50px;" /> kW
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>형태</y-th>
            <y-td>
              <el-radio-group v-model="data.items[index].type">
                <el-radio-button size="small" value="1">저압</el-radio-button>
                <el-radio-button size="small" value="2">특고압</el-radio-button>
              </el-radio-group>
            </y-td>
            <y-th>가스입력범위</y-th>
            <y-td>
              최소 <el-input v-model="data.items[index].value6" style="width:50px;" /> pPa ~ 최대 <el-input v-model="data.items[index].value7" style="width:50px;" /> kPa
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>정격전압</y-th>
            <y-td>
              <el-input v-model="data.items[index].value8" style="width:50px;" /> V              
            </y-td>
            <y-th>주파수</y-th>
            <y-td>
              <el-input v-model="data.items[index].value9" style="width:50px;" /> Hz              
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>발전효율</y-th>
            <y-td>
              <el-input v-model="data.items[index].value10" style="width:50px;" /> %              
            </y-td>
            <y-th>열효율</y-th>
            <y-td>
              <el-input v-model="data.items[index].value11" style="width:50px;" /> %              
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>계통연계</y-th>
            <y-td>
              <el-select size="small" v-model="data.items[index].value12" placeholder="" style="width:150px;">
                <el-option
                  v-for="item in data.types"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
              
            </y-td>
            <y-th>설치위치</y-th>
            <y-td>
              <el-select size="small" v-model="data.items[index].value13" placeholder="" style="width:150px;">
                <el-option
                  v-for="item in data.positions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>급배기방식</y-th>
            <y-td>
              <el-input v-model="data.items[index].value14" />
            </y-td>
            <y-th>배기통길이</y-th>
            <y-td>
              <el-input v-model="data.items[index].value15" style="width:50px;" /> m              
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>제조사</y-th>
            <y-td>
              <el-input v-model="data.items[index].value16" />
            </y-td>          
            <y-th>제조번호</y-th>
            <y-td>
              <el-input v-model="data.items[index].value17" />
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>제작년월</y-th>
            <y-td colspan="3">
              <el-input v-model="data.items[index].value18" style="width:50px;" /> 년 <el-input v-model="data.items[index].value19" style="width:30px;" /> 월
            </y-td>
          </y-tr>                    
        </y-table>        
      </y-td>
      <y-td style="text-align:center;width:30px;">
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

const category = 70

const item = {
  id: 0,
  type: 1,
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
  gass: [
    {id: '0', name: ' '},
    {id: '1', name: '도시가스'},
    {id: '2', name: 'LPG'},
    {id: '3', name: '바이오가스'},
    {id: '4', name: '직접입력'}
  ],
  types: [
    {id: '0', name: ' '},
    {id: '1', name: '옥내형'},
    {id: '2', name: '옥외형'}    
  ],
  positions: [
    {id: '0', name: ' '},
    {id: '1', name: '독립형'},
    {id: '2', name: '계통연계형'}    
  ],
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
  item.type = util.getInt(item.type)
  
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
    item.type = util.getInt(item.type)
    
    await model.insert(item)
  }

  await Extra.score(data.id);
  
  util.alert('저장되었습니다')
  
  util.loading(false)  
}

function clickAdd() {
  let item2 = util.clone(item)
  item2.name = data.name + ' 연료전지 발전설비'
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

