<template>
  <Title title="세금계산서 발행 조회" />

  <el-descriptions class="margin-top" :column="3" border style="margin-bottom: 10px">
    <el-descriptions-item>
      <template #label>
        <div style="text-align: center">기간</div>
      </template>
      <div style="display:flex;justify-content:space-between;">
        <div>
          <el-date-picker style="margin: 0px 10px 0px 0px; height: 24px; width: 150px" v-model="data.search.startbilldate" />
          <el-date-picker style="margin: 0px 0px; height: 24px; width: 150px" v-model="data.search.endbilldate" />
        </div>
        <el-button size="small" class="filter-item" type="primary" @click="clickSearch">검색</el-button>

      </div>
    </el-descriptions-item>
    
  </el-descriptions>

  <el-table :data="data.items" border :height="height(255)" @row-click="clickUpdate" ref="listRef" @selection-change="changeList">
    <el-table-column prop="month" label="발행일자" align="center"  />
    <el-table-column prop="month" label="공급자" align="center"  />
    <el-table-column prop="month" label="품목" align="center"  />
    <el-table-column prop="month" label="공급받는자" align="center"  />
    <el-table-column prop="month" label="공급가액" align="center"  />
    <el-table-column prop="month" label="세액" align="center"  />
    <el-table-column prop="month" label="발행금액" align="center"  />
    <el-table-column prop="month" label="상태" align="center"  />
    
  </el-table>

  <el-dialog v-model="data.visibleSetting" width="800px">
    <y-table>
      <y-tr>
        <y-th style="width: 80px">소식란</y-th>
        <y-td>
          <el-input :rows="5" type="textarea" v-model="setting.content" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>주소위치</y-th>
        <y-td> X : <el-input v-model="setting.x1" style="width: 50px" /> Y : <el-input v-model="setting.y1" style="width: 50px" /> </y-td>
      </y-tr>
      <y-tr>
        <y-th>금액</y-th>
        <y-td> X : <el-input v-model="setting.x2" style="width: 50px" /> Y : <el-input v-model="setting.y2" style="width: 50px" /> </y-td>
      </y-tr>
      <y-tr>
        <y-th>공급가액</y-th>
        <y-td> X : <el-input v-model="setting.x3" style="width: 50px" /> Y : <el-input v-model="setting.y3" style="width: 50px" /> </y-td>
      </y-tr>
      <y-tr>
        <y-th>세액</y-th>
        <y-td> X : <el-input v-model="setting.x4" style="width: 50px" /> Y : <el-input v-model="setting.y4" style="width: 50px" /> </y-td>
      </y-tr>
      <y-tr>
        <y-th>등록번호</y-th>
        <y-td> X : <el-input v-model="setting.x5" style="width: 50px" /> Y : <el-input v-model="setting.y5" style="width: 50px" /> </y-td>
      </y-tr>
      <y-tr>
        <y-th>수용가명</y-th>
        <y-td> X : <el-input v-model="setting.x6" style="width: 50px" /> Y : <el-input v-model="setting.y6" style="width: 50px" /> </y-td>
      </y-tr>
      <y-tr>
        <y-th>작성년월일</y-th>
        <y-td> X : <el-input v-model="setting.x7" style="width: 50px" /> Y : <el-input v-model="setting.y7" style="width: 50px" /> </y-td>
      </y-tr>

      <y-tr>
        <y-th>소식란</y-th>
        <y-td> X : <el-input v-model="setting.x8" style="width: 50px" /> Y : <el-input v-model="setting.y8" style="width: 50px" /> </y-td>
      </y-tr>
      <y-tr>
        <y-th>금액</y-th>
        <y-td> X : <el-input v-model="setting.x9" style="width: 50px" /> Y : <el-input v-model="setting.y9" style="width: 50px" /> </y-td>
      </y-tr>
      <y-tr>
        <y-th>고객코드</y-th>
        <y-td> X : <el-input v-model="setting.x10" style="width: 50px" /> Y : <el-input v-model="setting.y10" style="width: 50px" /> </y-td>
      </y-tr>
      <y-tr>
        <y-th>상호</y-th>
        <y-td> X : <el-input v-model="setting.x11" style="width: 50px" /> Y : <el-input v-model="setting.y11" style="width: 50px" /> </y-td>
      </y-tr>
      <y-tr>
        <y-th>성명</y-th>
        <y-td> X : <el-input v-model="setting.x12" style="width: 50px" /> Y : <el-input v-model="setting.y12" style="width: 50px" /> </y-td>
      </y-tr>
      <y-tr>
        <y-th>항목</y-th>
        <y-td> X : <el-input v-model="setting.x13" style="width: 50px" /> Y : <el-input v-model="setting.y13" style="width: 50px" /> </y-td>
      </y-tr>
    </y-table>

    <template #footer>
      <el-button size="small" @click="clickCancelSetting">취소</el-button>
      <el-button size="small" type="primary" @click="clickSubmitSetting">등록</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import router from '~/router'
import { util, size } from '~/global'
import { User, Customer, Building, Billinglist, Company, Billing } from '~/models'
import Extra from '~/models/extra'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElTable } from 'element-plus'
import axios from 'axios'
import moment from 'moment'

const { width, height } = size()

const store = useStore()
const route = useRoute()

const model = Billinglist

const item = {
  id: 0,
  price: 0,
  status: 1,
  billdate: '',
  company: 0,
  building: 0,
  date: '',
}

const data = reactive({
  session: {
    level: 0,
    company: 0,
  },
  id: 0,
  mode: 'normal',
  items: [],
  total: 0,
  page: 1,
  pagesize: 0,
  item: util.clone(item),
  visible: false,
  visibleSetting: false,
  search: {
    company: 0,
    building: 0,
    status: '0',
    type: 0,
    startbilldate: '',
    endbilldate: '',
  },
  buildings: [],
  statuss: [
    { id: 0, name: ' ' },
    { id: 1, name: '입금대기' },
    { id: 2, name: '입금완료' },
  ],
})

const setting = reactive({
  contennt: '',
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  x3: 0,
  y3: 0,
  x4: 0,
  y4: 0,
  x5: 0,
  y5: 0,
  x6: 0,
  y6: 0,
  x7: 0,
  y7: 0,
  x8: 0,
  y8: 0,
  x9: 0,
  y9: 0,
  x10: 0,
  y10: 0,
  x11: 0,
  y11: 0,
  x12: 0,
  y12: 0,
  x13: 0,
  y13: 0,
})

async function clickSearch() {
  await getItems(true)
}

async function initData() {
  let res = await Customer.find({
    company: data.session.company,
    orderby: 'b_name',
  })

  let items = res.items.map(item => item.extra.building)
  data.buildings = [{ id: 0, name: ' ' }, ...items]

  res = await Company.find({    
  })

  data.companys = res.items

  let company = 0

  if (data.session.level != User.level.rootadmin) {
    company = data.session.company
  }

  res = await Company.get(data.session.company)
  let item = res.item
  setting.content = item.content
  for (let i = 1; i <= 13; i++) {
    setting[`x${i}`] = item[`x${i}`]
    setting[`y${i}`] = item[`y${i}`]
  }
}

async function getItems() {
  return
  if (data.session.level != User.level.rootadmin) {
    data.search.company = data.session.company
  }

  let res = await model.find({
    name: data.search.text,
    page: data.page,
    pagesize: data.pagesize,
    company: data.search.company,
    building: data.search.building,
    status: util.getInt(data.search.status),
    startbilldate: data.search.startbilldate,
    endbilldate: data.search.endbilldate,
    orderby: 'bi_id desc',
  })

  console.log(res.items)

  if (res.items == null) {
    res.items = []
  }

  let items = []

  for (let i = 0; i < res.items.length; i++) {
    let item = res.items[i]

    item.index = i + 1
    items.push(item)
  }

  data.total = res.total
  data.items = items
}

function clickInsert() {
  data.item = util.clone(item)
  data.visible = true
}

function clickUpdate(item, index) {
  return
}

onMounted(async () => {
  data.session = store.getters['getUser']

  util.loading(true)

  await initData()
  await getItems(true)

  data.visible = false
  util.loading(false)
})

function clickCancel() {
  data.visible = false
}

const listRef = ref<InstanceType<typeof ElTable>>()
const listSelection = ref([])
const toggleListSelection = rows => {
  if (rows) {
    rows.forEach(row => {
      listRef.value!.toggleRowSelection(row, undefined)
    })
  } else {
    listRef.value!.clearSelection()
  }
}
const changeList = val => {
  listSelection.value = val
}

function clickDeleteMulti() {
  util.confirm('삭제하시겠습니까', async function () {
    util.loading(true)

    for (let i = 0; i < listSelection.value.length; i++) {
      let value = listSelection.value[i]

      let item = {
        id: value.id,
      }

      await model.remove(item)
    }

    //util.info('삭제되었습니다')
    await getItems(true)

    util.loading(false)
  })
}

async function clickSubmit() {
  let item = util.clone(data.item)

  if (data.session.level == User.level.rootadmin) {
    if (item.company == 0) {
      util.alert('업체를 선택하세요')
      return
    }
  } else {
    item.company = data.session.company
  }

  if (item.building == 0) {
    util.alert('빌딩을 선택하세요')
    return
  }

  util.loading(true)

  item.user = util.getInt(item.user)
  item.company = util.getInt(item.company)
  item.building = util.getInt(item.building)
  item.type = util.getInt(item.type)
  item.checkdate = util.getInt(item.checkdate)

  item.contractstartdate = util.convertDBDate(item.contractstartdate)
  item.contractenddate = util.convertDBDate(item.contractenddate)

  item.contractprice = util.getInt(item.contractprice)
  item.contractday = util.getInt(item.contractday)

  item.status = util.getInt(item.status)

  if (item.id > 0) {
    await model.update(item)
  } else {
    await model.insert(item)
  }

  //util.info('등록되었습니다')

  await getItems(true)

  data.visible = false
  util.loading(false)
}

function getCompany(id) {
  let items = data.companys.filter(item => item.id == id)

  if (items.length == 0) {
    return ''
  }

  return items[0].name
}

function getBuilding(id) {
  let items = data.buildings.filter(item => item.id == id)

  if (items.length == 0) {
    return ''
  }

  return items[0].name
}

function getUser(id) {
  let items = data.users.filter(item => item.id == id)

  if (items.length == 0) {
    return ''
  }

  return items[0].name
}

function clickStatusMulti(status) {
  let title = ''
  if (status == 1) {
    title = '입금완료 처리하시겠습니까'
  } else {
    title = '입금대기 처리하시겠습니까'
  }

  util.confirm(title, async function () {
    util.loading(true)

    for (let i = 0; i < listSelection.value.length; i++) {
      let value = listSelection.value[i]

      let res = await Billing.get(value.id)
      res.item.status = status
      await Billing.update(res.item)
    }

    //util.info('삭제되었습니다')
    await getItems(true)

    util.loading(false)
  })
}

function clickGiroMulti() {
  util.confirm('지로 출력하시겠습니까', async function () {
    util.loading(true)

    let ids = listSelection.value.map(item => item.id)

    await getItems(true)

    util.loading(false)

    const url = '/api/download/giro/' + ids.join(',')
    const date = moment().format('YYYYMMDDhhmmss')
    const filename = `지로출력-${date}.pdf`

    util.download(store, url, filename)
  })
}

function clickSetting() {
  data.visibleSetting = true
}

function clickCancelSetting() {
  data.visibleSetting = false
}

async function clickSubmitSetting() {
  util.loading(true)

  let res = await Company.get(data.session.company)
  let item = util.clone(res.item)

  for (let i = 1; i <= 13; i++) {
    item[`x${i}`] = util.getFloat(setting[`x${i}`])
    item[`y${i}`] = util.getFloat(setting[`y${i}`])
  }

  await Company.update(item)

  //util.info('등록되었습니다')

  await getItems(true)

  data.visibleSetting = false
  util.loading(false)
}
</script>
