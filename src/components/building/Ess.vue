<template>
  <y-table>
    <y-tr>
      <y-th style="width: 100px">설비명</y-th>
      <y-td>
        <el-input v-model="data.item.name" readonly />
      </y-td>
    </y-tr>
    <y-tr>
      <y-th>출력전압</y-th>
      <y-td>
        <el-select size="small" v-model="data.item.value2" placeholder="" style="width: 150px">
          <el-option v-for="item in data.volts" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>

        <el-input v-model="data.item.value3" style="margin-left: 5px; width: 100px" v-if="data.item.value2 == '3'" />
      </y-td>
    </y-tr>
    <y-tr>
      <y-th>정격용량</y-th>
      <y-td> <el-input v-model="data.item.value4" style="width: 50px" /> kW </y-td>
    </y-tr>
    <y-tr>
      <y-th>형태</y-th>
      <y-td>
        <el-radio-group v-model="data.item.type">
          <el-radio-button size="small" value="1">저압</el-radio-button>
          <el-radio-button size="small" value="2">특고압</el-radio-button>
        </el-radio-group>
      </y-td>
    </y-tr>
    <y-tr>
      <y-th>입력전압</y-th>
      <y-td> 최소 <el-input v-model="data.item.value5" style="width: 50px" /> V ~ 최대 <el-input v-model="data.item.value6" style="width: 50px" /> V </y-td>
    </y-tr>
    <y-tr>
      <y-th>제조사</y-th>
      <y-td>
        <el-input v-model="data.item.value7" />
      </y-td>
    </y-tr>
    <y-tr>
      <y-th>제조번호</y-th>
      <y-td>
        <el-input v-model="data.item.value8" />
      </y-td>
    </y-tr>
    <y-tr>
      <y-th>제작년월</y-th>
      <y-td> <el-input v-model="data.item.value9" style="width: 50px" /> 년 <el-input v-model="data.item.value10" style="width: 30px" /> 일 </y-td>
    </y-tr>
  </y-table>

  <Title title="배터리" />

  <y-table>
    <y-tr>
      <y-th style="width: 100px">최대전력용량</y-th>
      <y-td> <el-input v-model="data.item.value11" style="width: 50px" /> kWh </y-td>
    </y-tr>
    <y-tr>
      <y-th>종류</y-th>
      <y-td>
        <el-select size="small" v-model="data.item.value12" placeholder="" style="width: 150px">
          <el-option v-for="item in data.types" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>

        <el-input v-model="data.item.value13" style="margin-left: 5px; width: 100px" v-if="data.item.value14 == '7'" />
      </y-td>
    </y-tr>
    <y-tr>
      <y-th>구성</y-th>
      <y-td>
        셀 <el-input v-model="data.item.value14" style="width: 50px" /> X 팩 <el-input v-model="data.item.value15" style="width: 50px" /> X 렉
        <el-input v-model="data.item.value16" style="width: 50px" />
      </y-td>
    </y-tr>
    <y-tr>
      <y-th>최대동작전압</y-th>
      <y-td> <el-input v-model="data.item.value17" style="width: 50px" /> V </y-td>
    </y-tr>
    <y-tr>
      <y-th>최대동작전류</y-th>
      <y-td> <el-input v-model="data.item.value18" style="width: 50px" /> A </y-td>
    </y-tr>
    <y-tr>
      <y-th>제조사</y-th>
      <y-td>
        <el-input v-model="data.item.value19" />
      </y-td>
    </y-tr>
    <y-tr>
      <y-th>형식</y-th>
      <y-td>
        <el-input v-model="data.item.value20" />
      </y-td>
    </y-tr>
    <y-tr>
      <y-th>제작년월</y-th>
      <y-td> <el-input v-model="data.item.value21" style="width: 50px" /> 년 <el-input v-model="data.item.value22" style="width: 30px" /> 일 </y-td>
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

const category = 50

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
  building: 0,
}

const data = reactive({
  id: 0,
  item: util.clone(item),
  volts: [
    { id: '0', name: ' ' },
    { id: '1', name: '380/220V' },
    { id: '2', name: '220V' },
    { id: '3', name: '직접입력' },
  ],
  types: [
    { id: '0', name: ' ' },
    { id: '1', name: '리튬이온' },
    { id: '2', name: '니켈카드뮴' },
    { id: '3', name: '니켈염화' },
    { id: '4', name: '나트륨 황' },
    { id: '5', name: '금속공기' },
    { id: '6', name: '니켈수소' },
    { id: '7', name: '직접입력' },
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

    data.item.name = res.item.name + ' 전기저장장치'
  }
}

onMounted(async () => {
  data.id = util.getInt(route.params.id)

  util.loading(true)

  await initData()
  await getItems()

  util.loading(false)
})

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

  let item = makeData(util.clone(data.item))
  item.building = data.id
  item.category = category
  item.type = util.getInt(item.type)

  if (item.id > 0) {
    await model.update(item)
  } else {
    await model.insert(item)
  }

  await Extra.score(data.id)

  util.alert('저장되었습니다')

  util.loading(false)
}

async function clickRemove() {
  util.loading(true)
  await model.deleteByBuildingCategory(data.id, category)

  data.item = util.clone(item)

  await Extra.score(data.id)
  util.alert('삭제되었습니다')
  util.loading(false)
}
</script>
