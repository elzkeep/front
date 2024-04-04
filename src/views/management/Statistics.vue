<template>
  <Title title="매출 보고서" />

  <el-descriptions class="margin-top" :column="3" border style="margin-bottom: 10px">
    <el-descriptions-item>
      <template #label>
        <div style="display: flex; justify-content: space-between">
          <p>담당자</p>
          <div style="flex: 1; display: flex; align-items: center; justify-content: right">
            <el-icon :size="20" @click="clickVisible"><UserFilled /></el-icon>
          </div>
        </div>
      </template>
      <div style="width: 300px">
        <span v-for="item in data.manager" :key="item.id" style="margin-right: 5px">{{ item.name }}</span>
      </div>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div style="text-align: center">기간</div>
      </template>
      <div style="display: flex; justify-content: space-between">
        <div>
          <el-date-picker style="margin: 0px 0px; height: 24px; width: 150px" v-model="data.search.startdate" />
          <el-date-picker style="margin: 0px 0px; height: 24px; width: 150px" v-model="data.search.enddate" />
        </div>
        <el-button size="small" class="filter-item" type="primary" @click="clickSearch">검색</el-button>
      </div>
    </el-descriptions-item>
  </el-descriptions>

  <div style="margin-top: 10px; margin-bottom: 20px; display: flex; justify-content: space-evenly">
    <el-card style="float: left; width: 480px; padding-top: 0px" shadow="never">
      <p style="float: left; font-weight: 700; font-size: 16px">점검 수</p>
      <p style="float: center; font-weight: 700; font-size: 25px">{{ data.total }}</p>
    </el-card>
    <el-card style="float: left; width: 480px" shadow="never">
      <p style="float: left; font-weight: 700; font-size: 16px">계약 금액</p>
      <p style="float: center; font-weight: 700; font-size: 25px">{{ util.money(data.totalprice) }}</p>
    </el-card>
  </div>

  <Chart :size="{ width: util.getInt(width(300).replace('px', '')), height: 200 }" :data="data.charts" :margin="{ top: 5, bottom: 20 }" :direction="'horizontal'">
    <template #layers>
      <Line :dataKeys="['title', 'value']" />
      <bar :dataKeys="['title', 'total']" />
    </template>
  </Chart>

  <div style="display: flex; justify-content: end; gap: 5px; margin-bottom: 10px">
    <div style="flex: 1; text-align: right; gap: 5">
      <el-button size="small" type="success" @click="clickDownload">엑셀 다운로드</el-button>
    </div>
  </div>
  <!-- <el-table :data="data.items" border style="width: 100%" @row-click="clickRow"  :summary-method="getSummary" show-summary> -->
  <el-table :data="data.items" border style="width: 100%">
    <!-- <el-table-column label="기간" align="center">
      <template #default="scope">
        <span v-if="scope.row.duration == undefined">전체</span>
        <span v-else>{{ scope.row.duration }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="total" label="점검건수" align="right">
      <template #default="scope">
        {{ util.money(scope.row.total) }}
      </template>
    </el-table-column> 
    <el-table-column prop="totalprice" label="금액" align="right">
      <template #default="scope">
        {{ util.money(scope.row.totalprice) }}
      </template>
    </el-table-column> -->
    <el-table-column prop="index" label="번호" width="100" align="center" />
    <el-table-column prop="billdate" label="기간" align="center" />
    <el-table-column label="건물명" align="right">
      <template #default="scope">
        {{ scope.row.extra.building.name }}
      </template>
    </el-table-column>
    <el-table-column prop="price" label="금액" align="right">
      <template #default="scope">
        {{ util.money(scope.row.price) }}
      </template>
    </el-table-column>
    <el-table-column label="담당자" align="right">
      <template #default="scope">
        {{ scope.row.extra.company.billingname }}
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="data.visible" width="800px">
    <div style="display: flex; justify-content: space-between; gap: 5px; margin-bottom: 10px">
      <el-input v-model="data.searchMaster" placeholder="검색할 내용을 입력해 주세요" style="width: 300px" @keyup.enter.native="getMasters" />
      <el-button size="small" class="filter-item" type="primary" @click="getMasters">검색</el-button>
    </div>
    <el-table :data="data.masters" border :height="height(170)" ref="listRef" @selection-change="changeList" style="height: 600px">
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column prop="loginid" label="로그인아이디" align="left" />
      <el-table-column prop="name" label="이름" align="left" width="80" />
      <el-table-column label="팀" align="left" width="100">
        <template #default="scope">
          {{ getDepartment(scope.row.department) }}
        </template>
      </el-table-column>
      <el-table-column prop="email" label="이메일" align="left" />
      <el-table-column prop="tel" label="연락처" align="left" width="100" />
      <el-table-column label="주소" align="left">
        <template #default="scope"> {{ scope.row.address }} {{ scope.row.addressetc }} </template>
      </el-table-column>
      <el-table-column label="권한" align="center" width="70">
        <template #default="scope">
          {{ getLevel(scope.row.level) }}
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button size="small" @click="clickCancelMaster">취소</el-button>
      <el-button size="small" type="primary" @click="clickSubmitMaster">등록</el-button>
    </template>
  </el-dialog>

  <div style="margin-top: 10px; display: flex; justify-content: space-between">
    <el-button v-if="data.mode == 'month'" size="small" type="success" @click="clickBackMonth">뒤로</el-button>
    <el-button v-if="data.mode == 'day'" size="small" type="success" @click="clickBackDay">뒤로</el-button>
    <div style="flex: 0"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import router from '~/router'
import { util, size } from '~/global'
import { Statistics, Statisticsyear, Statisticsmonth, Statisticsday, Billing, User, Department } from '~/models'
import { Chart, Grid, Line, Bar } from 'vue3-charts'
import { useStore } from 'vuex'

const { width, height } = size()

const store = useStore()

const item = {
  id: 0,
  name: '',
  number: '',
  tel: '',
  email: '',
  personname: '',
}

const data = reactive({
  items: [],
  total: 0,
  totalprice: 0,
  page: 1,
  pagesize: 10,
  item: util.clone(item),
  visible: false,
  mode: 'month',
  duration: '',
  company: 0,
  search: {
    text: '',
    startdate: '2023-03-01',
    enddate: '2024-04-04',
  },
  charts: [],
  departments: [],
  searchMaster: '',
  masters: [],
  manager: [],
})

async function getItems() {
  let res

  if (data.mode == 'year') {
    res = await Statisticsyear.find({ company: store.getters.getUser.company, orderby: 'bi_duration' })
  } else if (data.mode == 'month') {
    // res = await Statisticsmonth.find({
    //   company: store.getters.getUser.company,
    //   startbilldate: data.search.startdate,
    //   endbilldate: data.search.enddate,
    //   duration: data.duration,
    //   orderby: 'bi_duration',
    // })
    res = await Statisticsmonth.find({
      company: store.getters.getUser.company,
      duration: data.duration,
      orderby: 'bi_duration',
    })
  } else if (data.mode == 'day') {
    res = await Statisticsday.find({ company: store.getters.getUser.company, duration: data.duration, orderby: 'bi_duration' })
  }

  await getBills()
  data.totalprice = 0
  data.charts = res.items.map(item => {
    data.totalprice += item.totalprice
    return {
      title: data.mode == 'company' ? '전체' : item.duration,
      value: item.totalprice,
      total: item.total,
    }
  })

  console.log(data.totalprice)

  // data.total = res.total
  // data.items = res.items
}

async function getBills() {
  // if (data.session.level != User.level.rootadmin) {
  //   data.search.company = data.session.company
  // }

  let res = await Billing.find({
    // page: data.page,
    // pagesize: data.pagesize,
    company: store.getters.getUser.company,
    startbilldate: data.search.startdate,
    endbilldate: data.search.enddate,
    // orderby: 'u_id',
  })

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

async function getDepartments() {
  let res = await Department.find({
    name: data.search.text,
    page: data.page,
    pagesize: data.pagesize,
    company: store.getters.getUser.company,
    orderby: 'de_parent desc, de_order, de_name',
  })

  if (res.items == null) {
    res.items = []
  }

  let items = []

  for (let i = 0; i < res.items.length; i++) {
    let item = res.items[i]

    item.index = i + 1
    items.push(item)
  }

  data.departments = items
}

async function getMasters() {
  let res = await User.find({
    name: data.searchMaster,
    page: 0,
    // pagesize: data.masterpagesize,
    company: store.getters.getUser.company,
    approval: 3,
    status: 1,
    orderby: 'u_id desc',
  })

  if (res.items == null) {
    res.items = []
  }

  let items = []

  for (let i = 0; i < res.items.length; i++) {
    let item = res.items[i]
    item.index = i + 1
    items.push(item)
  }

  data.masters = items
}

function clickSearch() {
  getItems()
}

function clickInsert() {
  data.item = util.clone(item)
  data.visible = true
}

function clickUpdate(pos, item) {
  data.item = util.clone(item)
  data.visible = true
}

function clickDelete(pos, item) {
  util.confirm('삭제하시겠습니까', async function () {
    let res = await Company.remove(item)
    if (res.code === 'ok') {
      util.info('삭제되었습니다')
      getItems()
    }
  })
}

async function clickSubmit() {
  const item = data.item
  if (item.name === '') {
    util.error('명칭을 입력하세요')
    return
  }

  if (item.code === '') {
    util.error('코드를 입력하세요')
    return
  }

  let res

  if (item.id === 0) {
    res = await Company.insert(item)
  } else {
    res = await Company.update(item)
  }

  if (res.code === 'ok') {
    util.info('등록되었습니다')
    getItems()
    data.visible = false
  } else {
    util.error('오류가 발생했습니다')
  }
}

const handleClose = (done: () => void) => {
  util.confirm('팝업창을 닫으시겠습니까', function () {
    done()
  })
}

onMounted(async () => {
  util.loading(true)

  await getDepartments()
  await getItems()

  util.loading(false)
})

async function clickRow(item) {
  if (data.mode == 'company') {
    data.mode = 'year'
    data.company = item.id
    await getItems()
  } else if (data.mode == 'year') {
    data.mode = 'month'
    data.company = item.id
    data.duration = item.duration
    await getItems()
  } else if (data.mode == 'month') {
    /*
    data.mode = 'day'
    data.company = item.id
    data.duration = item.duration
    await getItems()
    */
  }
}

function clickBackYear() {
  data.mode = 'company'
  getItems()
}

function clickBackMonth() {
  data.mode = 'year'
  getItems()
}

function clickBackDay() {
  data.mode = 'month'
  getItems()
}

function clickDownload() {}

const getSummary = (param: SummaryMethodProps) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '합계'
    } else if (index == 1) {
      let total = 0
      if (data != null) {
        data.forEach(item => {
          total += util.getInt(item.total)
        })
      }

      sums[index] = total
    } else if (index == 2) {
      let total = 0
      if (data != null) {
        data.forEach(item => {
          total += util.getInt(item.totalprice)
        })
      }

      sums[index] = util.money(total)
    }
  })

  return sums
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

function clickVisible() {
  util.loading(true)
  getMasters()
  util.loading(false)
  data.visible = true
}

function clickSubmitMaster() {
  data.manager = []
  for (let i = 0; i < listSelection.value.length; i++) {
    let value = listSelection.value[i]

    data.manager.push(value)
  }

  clickCancelMaster()
}

function clickCancelMaster() {
  data.searchMaster = ''
  data.visible = false
}

function getLevel(id) {
  if (id > 5) {
    return ''
  }

  return User.levels[id]
}

function getDepartment(id) {
  let items = data.departments.filter(item => item.id == id)

  if (items.length == 0) {
    return ''
  }

  return items[0].name
}
</script>
