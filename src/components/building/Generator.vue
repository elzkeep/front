<template>

  <y-table>
    <y-tr>
      <y-th style="width:33%;">설비명</y-th>
      <y-th style="width:33%;">원동기</y-th>
      <y-th style="width:33%;">발전기</y-th>
      <y-th style="width:30px;"></y-th>
    </y-tr>
    <y-tr v-for="(item, index) in data.items">
      <y-td>
        <el-input v-model="data.items[index].name" />
      </y-td>
      <y-td>
        <y-table>
          <y-tr>
            <y-th style="width:100px;">형식(모델명)</y-th>
            <y-td><el-input v-model="data.items[index].value2" /></y-td>
          </y-tr>
          <y-tr>
            <y-th>정격용량</y-th>
            <y-td><el-input v-model="data.items[index].value3" style="width:100px;" /> kVA</y-td>
          </y-tr>
          <y-tr>
            <y-th>회전수</y-th>
            <y-td><el-input v-model="data.items[index].value4" style="width:100px;" /> rpm</y-td>
          </y-tr>
          <y-tr>
            <y-th>제조사</y-th>
            <y-td><el-input v-model="data.items[index].value5" /></y-td>
          </y-tr>
          <y-tr>
            <y-th>제작번호</y-th>
            <y-td><el-input v-model="data.items[index].value6" /></y-td>
          </y-tr>
          <y-tr>
            <y-th>제작년월</y-th>
            <y-td><el-input v-model="data.items[index].value7" /></y-td>
          </y-tr>
          <y-tr>
            <y-th>냉각방식</y-th>
            <y-td>
              <el-select v-model="data.items[index].value8" placeholder="" style="width:150px;">
                <el-option
                  v-for="item in data.coolings"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </y-td>              
          </y-tr>
          <y-tr>
            <y-th>기동방식</y-th>
            <y-td>
              <el-select v-model="data.items[index].value9" placeholder="" style="width:150px;">
                <el-option
                  v-for="item in data.activations"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>차단기종류</y-th>
            <y-td>
              <el-select v-model="data.items[index].value10" placeholder="" style="width:150px;">
                <el-option
                  v-for="item in data.types"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </y-td>
          </y-tr>
          
        </y-table>
        
      </y-td>
      <y-td>

        <y-table>
          <y-tr>
            <y-th style="width:100px;">형식(모델명)</y-th>
            <y-td><el-input v-model="data.items[index].value11" /></y-td>
          </y-tr>
          <y-tr>
            <y-th>정격용량</y-th>
            <y-td><el-input v-model="data.items[index].value12" style="width:100px;" /> kVA</y-td>
          </y-tr>
          <y-tr>
            <y-th>회전수</y-th>
            <y-td><el-input v-model="data.items[index].value13" style="width:100px;" /> rpm</y-td>
          </y-tr>
          <y-tr>
            <y-th>제조사</y-th>
            <y-td><el-input v-model="data.items[index].value14" /></y-td>
          </y-tr>
          <y-tr>
            <y-th>제작번호</y-th>
            <y-td><el-input v-model="data.items[index].value15" /></y-td>
          </y-tr>
          <y-tr>
            <y-th>제작년월</y-th>
            <y-td><el-input v-model="data.items[index].value16" /></y-td>
          </y-tr>
          <y-tr>
            <y-th>정격전압</y-th>
            <y-td>
              <el-input v-model="data.items[index].value17" style="width:100px;" /> V
            </y-td>              
          </y-tr>
          <y-tr>
            <y-th>정격전류</y-th>
            <y-td>
              <el-input v-model="data.items[index].value18" style="width:100px;" /> A
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>역률</y-th>
            <y-td>
              <el-input v-model="data.items[index].value19" style="width:100px;" /> %
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
import { Company, Facility } from "~/models"
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

const category = 20

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
  building: 0
}

const data = reactive({
  id: 0,
  item: util.clone(item),
  coolings: [
    {id: '0', name: ' '},
    {id: '1', name: '고정자(수냉각)'},
    {id: '2', name: '고정자(수소냉각)'},
    {id: '3', name: '고정자(공기냉각)'},
    {id: '4', name: '고정자(권선냉각)'},
    {id: '5', name: '회전자(간접냉각)'},
    {id: '6', name: '회전자(직접냉각)'}    
  ],
  activations: [
    {id: '0', name: ' '},
    {id: '1', name: '전기식'},
    {id: '2', name: '공기식'}    
  ],
  types: [
    {id: '0', name: ' '},
    {id: '1', name: 'ACB(기중차단기)'},
    {id: '2', name: 'MCCB(배선용차단기)'},
    {id: '3', name: 'ELB(누전차단기)'}    
  ],  
  items: [],
  highs: [],
  transs: [],
  upload: `${import.meta.env.VITE_REPORT_URL}/api/upload/index`  
})

async function initData() {
}

async function getItems() {
  let res = await model.find({
    building: data.id,
    category: category,
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

function clickAdd() {
  let item2 = util.clone(item)
  item2.name = '발전설비'
  data.items.push(
    item2
  )
}

function clickDelete(pos) {
  let items = util.clone(data.items)

  items.splice(pos, 1)
  data.items = items
}

function makeData(item) {
  for (let i = 1; i <= 20; i++) {
    const name = `value${i}`
    item[name] = '' + item[name]
  }

  return item
}

async function clickSubmit() {
  util.loading(true)

  await model.deleteByBuildingCategory(data.id, category)

  for (let i = 0; i < data.items.length; i++) {
    let item = makeData(util.clone(data.items[i]))
    item.building = data.id
    item.category = category

    await model.insert(item)
  }

  await Extra.score(data.id);
  
  util.alert('저장되었습니다')
  
  util.loading(false)  
}

</script>

