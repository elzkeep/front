<template>
  <Title title="점검 관리" />

  <y-table style="margin-bottom: 20px">
    <y-tr>
      <y-th>
        <div>전체</div>
        <div class="info">
          <span class="cnt">{{ info.status }}</span>
        </div>
      </y-th>
      <y-th>
        <div>대기</div>
        <div class="info">
          <span class="cnt">{{ info.status1 }}</span>
        </div>
      </y-th>
      <y-th>
        <div>진행</div>
        <div class="info">
          <span class="cnt">{{ info.status2 }}</span>
        </div>
      </y-th>
      <y-th>
        <div>완료</div>
        <div class="info">
          <span class="cnt">{{ info.status3 }}</span>
        </div>
      </y-th>
    </y-tr>
  </y-table>

  <div style="display: flex; justify-content: space-between; gap: 5px; margin-bottom: 10px">
    <el-select size="small" v-model.number="data.search.company" placeholder="업체" style="width: 150px" v-if="data.session.level == User.level.rootadmin">
      <el-option v-for="item in data.companys" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>

    <el-select size="small" v-model.number="data.search.building" placeholder="건물" style="width: 150px">
      <el-option v-for="item in data.buildings" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>

    <el-select size="small" v-model.number="data.search.user" placeholder="점검자" style="width: 150px">
      <el-option v-for="item in data.users" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>

    <el-select size="small" v-model.number="data.search.status" placeholder="상태" style="width: 100px">
      <el-option v-for="item in data.statuss" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>

    <el-button size="small" class="filter-item" type="primary" @click="clickSearch">검색</el-button>

    <div style="flex: 1; text-align: right; gap: 5"></div>
  </div>

  <KakaoMap :positions="[[33.450701, 126.570667]]" :positionName="data.positionName" v-if="data.positionName.length > 0" style="margin-bottom: 30px" />

  <el-table :data="data.items" border :height="height(858)" @row-click="clickUpdate" ref="listRef" @selection-change="changeList">
    <el-table-column prop="id" label="ID" align="center" width="80" />
    <el-table-column label="업체" align="left" width="200" v-if="data.session.level == User.level.rootadmin">
      <template #default="scope">
        {{ getCompany(scope.row.company) }}
      </template>
    </el-table-column>
    <el-table-column label="고객명" align="left" width="200">
      <template #default="scope">
        {{ getBuilding(scope.row.building) }}
      </template>
    </el-table-column>
    <el-table-column prop="title" label="점검지명" align="left" />
    <el-table-column label="상태" align="center" width="70">
      <template #default="scope">
        {{ Report.getStatus(scope.row.status) }}
      </template>
    </el-table-column>
    <el-table-column label="점검 주기" align="left" width="80">
      <template #default="scope">
        {{ getPeriod(scope.row) }}
      </template>
    </el-table-column>
    <el-table-column label="점검 담당자" align="left" width="70">
      <template #default="scope">
        {{ getUser(scope.row.user) }}
      </template>
    </el-table-column>
    <el-table-column label="점검일" align="center" width="140">
      <template #default="scope"> {{ scope.row.checkdate.replaceAll('-', '.') }} {{ scope.row.checktime }} </template>
    </el-table-column>
    <el-table-column label="등록일" align="center" width="140">
      <template #default="scope">
        {{ util.viewDatetime(scope.row.date) }}
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="data.visible" width="800px">
    <ReportInsert ref="reportInsert" />
    <template #footer>
      <el-button size="small" @click="clickCancel">닫기</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, popScopeId } from 'vue'
import router from '~/router'
import { util, size } from '~/global'
import { User, Customer, Building, Company, Report } from '~/models'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElTable } from 'element-plus'

const { width, height } = size()

const store = useStore()
const route = useRoute()

const model = Report

const item = {
  id: 0,
  type: Customer.type.outsourcing,
  checkdate: 1,
  managername: '',
  managertel: '',
  manageremail: '',
  contractstartdate: null,
  contractendate: null,
  contractprice: 0,
  billingdate: 1,
  billingname: '',
  billingtel: '',
  billingemail: '',
  status: 1,
  company: 0,
  building: 0,
  user: 0,
  date: '',
}

const info = reactive({
  status: 0,
  status1: 0,
  status2: 0,
  status3: 0,
})

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
  visible: true,
  search: {
    company: 0,
    building: 0,
    user: 0,
    status: 0,
    type: 0,
  },
  companys: [],
  users: [],
  buildings: [],
  types: [
    { id: 0, name: ' ' },
    { id: 1, name: '직영' },
    { id: 2, name: '위탁관리' },
  ],
  statuss: [
    { id: 0, name: ' ' },
    { id: 1, name: '신규' },
    { id: 2, name: '점검중' },
    { id: 3, name: '점검완료' },
    { id: 4, name: '작성완료' },
  ],
  target: 0,
  positionName: [],
})

const reportInsert = ref({})

async function clickSearch() {
  await getItems(true)
}

async function initData() {
  let res = await Company.find({
    type: Company.type.work,
    orderby: 'c_name',
  })

  data.companys = [{ id: 0, name: ' ' }, ...res.items]

  res = await Building.find({
    orderby: 'b_name',
  })

  data.buildings = [{ id: 0, name: ' ' }, ...res.items]

  let company = 0

  res = await User.find({
    company: data.session.company,
    orderby: 'u_name',
  })

  data.users = [{ id: 0, name: ' ' }, ...res.items]

  res = await model.find({
    company: data.search.company,
  })

  let status = 0
  let status1 = 0
  let status2 = 0
  let status3 = 0

  for (let i = 0; i < res.items.length; i++) {
    let item = res.items[i]
    if (item.status == 1) {
      status1++
    } else if (item.status == 3) {
      status2++
    } else if (item.status == 3 || item.status == 4) {
      status3++
    }

    status++
  }

  info.status = status
  info.status1 = status1
  info.status2 = status2
  info.status3 = status3
}

async function getItems() {
  let res = await model.find({
    name: data.search.text,
    page: data.page,
    pagesize: data.pagesize,
    company: data.search.company,
    building: data.search.building,
    user: data.session.user,
    status: data.search.status,
    orderby: 'r_id desc',
  })

  if (res.items == null) {
    res.items = []
  }

  let items = []
  data.positionName = []

  for (let i = 0; i < res.items.length; i++) {
    let item = res.items[i]

    item.index = i + 1
    data.positionName.push(item.extra.building.address)
    items.push(item)
  }

  data.total = res.total
  data.items = items
  console.log(data.positionName)
}

function clickInsert() {
  data.item = util.clone(item)
  data.visible = true
}

function clickUpdate(item, index) {
  //router.push(`/management/report/${item.id}`)
  data.visible = true
  console.log(reportInsert.value)
  reportInsert.value?.readData(item.id)
}

onMounted(async () => {
  data.visible = false
  data.session = store.getters['getUser']

  util.loading(true)

  await initData()
  await getItems(true)

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
    util.alert('고객명을 선택하세요')
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

function getPeriod(item) {
  const titles = ['월차', '분기', '반기', '연차']

  return titles[item.period] + ' ' + item.number + '차'
}
</script>
<style>
.info {
  text-align: center;
  font-size: 24px;
  padding: 6px 0px;
}

.cnt {
  color: #f56c6c;
}

.sep {
  font-size: 18px;
}
</style>
