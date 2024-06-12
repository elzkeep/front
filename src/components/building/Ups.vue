<template>
  <y-table style="margin-top: 10px">
    <y-tr>
      <y-th></y-th>
      <y-th>전력변환장치</y-th>
      <y-th>이차전지(배터리)</y-th>
      <y-th style="width: 30px"></y-th>
    </y-tr>
    <y-tr v-for="(item, index) in data.items">
      <y-td>
        <y-table>
          <y-tr>
            <y-th style="width: 100px">설비명</y-th>
            <y-td>
              <el-input v-model="data.items[index].name" />
            </y-td>
          </y-tr>
          <y-tr>
            <y-th style="width: 100px">설치장소</y-th>
            <y-td>
              <el-select size="small" v-model="data.items[index].value1" placeholder="" style="width: 150px">
                <el-option v-for="item in data.positions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>

              <el-input v-model="data.items[index].value2" v-if="data.items[index].value1 == '4'" style="margin-left: 5px; width: 100px" />
            </y-td>
          </y-tr>
          <y-tr>
            <y-th style="width: 100px">CCTV</y-th>
            <y-td>
              <el-select size="small" v-model="data.items[index].value3" placeholder="" style="width: 150px">
                <el-option v-for="item in data.cctvs" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </y-td>
          </y-tr>
          <y-tr>
            <y-th style="width: 100px">상시운영정보 보관기간</y-th>
            <y-td>
              <el-select size="small" v-model="data.items[index].value4" placeholder="" style="width: 150px">
                <el-option v-for="item in data.keeps" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>

              <el-input v-model="data.items[index].value5" v-if="data.items[index].value4 == '4'" style="margin-left: 5px; width: 100px" />
            </y-td>
          </y-tr>
          <y-tr>
            <y-th style="width: 100px">용도</y-th>
            <y-td>
              <el-select size="small" v-model="data.items[index].value6" placeholder="" style="width: 150px">
                <el-option v-for="item in data.usages" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>

              <el-input v-model="data.items[index].value7" v-if="data.items[index].value6 == '5'" style="margin-left: 5px; width: 100px" />
            </y-td>
          </y-tr>
          <y-tr>
            <y-th style="width: 100px">방식</y-th>
            <y-td>
              <el-select size="small" v-model="data.items[index].value8" placeholder="" style="width: 150px">
                <el-option v-for="item in data.types" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </y-td>
          </y-tr>
          <y-tr>
            <y-th style="width: 100px">비상전원공급 공급시간</y-th>
            <y-td>
              <el-select size="small" v-model="data.items[index].value9" placeholder="" style="width: 150px">
                <el-option v-for="item in data.times" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>

              <el-input v-model="data.items[index].value10" v-if="data.items[index].value9 == '6'" style="margin-left: 5px; width: 100px" />
            </y-td>
          </y-tr>
        </y-table>
      </y-td>
      <y-td>
        <y-table>
          <y-tr>
            <y-th style="width: 100px">출력전압</y-th>
            <y-td colspan="3"> <el-input v-model="data.items[index].value11" style="width: 50px" /> V </y-td>
          </y-tr>
          <y-tr>
            <y-th>정격용량</y-th>
            <y-td colspan="3"> <el-input v-model="data.items[index].value12" style="width: 50px" /> kW </y-td>
          </y-tr>
          <y-tr>
            <y-th>형태</y-th>
            <y-td>
              <el-radio-group v-model="data.items[index].type">
                <el-radio-button size="small" value="1">저압</el-radio-button>
                <el-radio-button size="small" value="2">특고압</el-radio-button>
              </el-radio-group>
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>제조사</y-th>
            <y-td colspan="3">
              <el-input v-model="data.items[index].value13" />
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>제조번호</y-th>
            <y-td colspan="3">
              <el-input v-model="data.items[index].value14" />
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>제작년월</y-th>
            <y-td colspan="3"> <el-input v-model="data.items[index].value15" style="width: 50px" /> 년 <el-input v-model="data.items[index].value16" style="width: 30px" /> 월 </y-td>
          </y-tr>
        </y-table>
      </y-td>
      <y-td>
        <y-table>
          <y-tr>
            <y-th style="width: 100px">용량</y-th>
            <y-td colspan="3"> <el-input v-model="data.items[index].value17" style="width: 50px" /> kW </y-td>
          </y-tr>
          <y-tr>
            <y-th>종류</y-th>
            <y-td colspan="3">
              <el-input v-model="data.items[index].value18" style="width: 50px" />
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>제조사</y-th>
            <y-td colspan="3">
              <el-input v-model="data.items[index].value19" />
            </y-td>
          </y-tr>
          <y-tr>
            <y-th>제작년도</y-th>
            <y-td colspan="3">
              <el-input v-model="data.items[index].value20" />
            </y-td>
          </y-tr>
        </y-table>
      </y-td>
      <y-td style="text-align: center">
        <el-button v-if="index == 0" size="small" class="filter-item" type="primary" @click="clickAdd"
          ><el-icon><Plus /></el-icon
        ></el-button>
        <el-button v-if="index != 0" size="small" class="filter-item" type="danger" @click="clickDelete(index)"
          ><el-icon><Close /></el-icon
        ></el-button>
      </y-td>
    </y-tr>
  </y-table>

  <div style="margin-top: 10px; text-align: left">
    <el-button class="filter-item" type="success" @click="clickSubmit">저장</el-button>
    <el-button class="filter-item" type="danger" @click="clickRemove">삭제</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import router from '~/router'
import { util, size } from '~/global'
import { Company, Facility, Building } from '~/models'
import Extra from '~/models/extra'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElTable } from 'element-plus'
import type { UploadProps } from 'element-plus'

const props = defineProps({
  id: Number,
})

const { width, height } = size()

const store = useStore()
const route = useRoute()

const model = Facility

const category = 60

const item = {
  id: 0,
  type: 1,
  name: '',
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
  building: 0,
}

const data = reactive({
  id: 0,
  name: '',
  item: util.clone(item),
  positions: [
    { id: '0', name: ' ' },
    { id: '1', name: '옥내' },
    { id: '2', name: '옥외(컨테이너)' },
    { id: '3', name: '옥외(전용건물)' },
    { id: '4', name: '직접입력' },
  ],
  cctvs: [
    { id: '0', name: ' ' },
    { id: '1', name: '미설치' },
    { id: '2', name: '설치' },
  ],
  usages: [
    { id: '0', name: ' ' },
    { id: '1', name: '통신부하' },
    { id: '2', name: '전산부하' },
    { id: '3', name: '비상부하' },
    { id: '4', name: '소방/EL등' },
    { id: '5', name: '직접입력' },
  ],
  keeps: [
    { id: '0', name: ' ' },
    { id: '1', name: '보관안함' },
    { id: '2', name: '보관(6개월)' },
    { id: '3', name: '보관(1년)' },
    { id: '4', name: '직접입력' },
  ],
  types: [
    { id: '0', name: ' ' },
    { id: '1', name: '온라인' },
    { id: '2', name: '오프라인' },
  ],
  times: [
    { id: '0', name: ' ' },
    { id: '1', name: '30분' },
    { id: '2', name: '1시간' },
    { id: '3', name: '2시간' },
    { id: '4', name: '3시간' },
    { id: '5', name: '4시간' },
    { id: '6', name: '직접입력' },
  ],
  items: [],
})

async function initData() {}

async function getItems() {
  let res = await model.find({
    building: data.id,
    category: category,
    orderby: 'f_id',
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
    orderby: 'f_id',
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

  await Extra.score(data.id)

  util.alert('저장되었습니다')

  util.loading(false)
}

async function clickRemove() {
  util.loading(true)
  await model.deleteByBuildingCategory(data.id, category)
  await model.deleteByBuildingCategory(data.id, category + 1)

  data.item = util.clone(item)
  let res = await Building.get(data.id)
  data.name = res.item.name

  data.items = []
  clickAdd()

  await Extra.score(data.id)
  util.alert('삭제되었습니다')
  util.loading(false)
}

function clickAdd() {
  let item2 = util.clone(item)
  item2.name = data.name + ' UPS'

  data.items.push(item2)
}

function clickDelete(pos) {
  let items = util.clone(data.items)

  items.splice(pos, 1)
  data.items = items
}
</script>
