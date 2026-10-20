<template>
  <Title title="지로 청구 및 관리" />

  <el-descriptions class="margin-top" :column="3" border style="margin-bottom: 10px">
    <el-descriptions-item>
      <template #label>
        <div style="text-align: center">대상</div>
      </template>

      <el-select size="small" v-model.number="data.search.company" placeholder="사업자" style="width: 150px; margin-right: 5px" @change="changeCompany">
        <el-option v-for="item in data.companys" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>

      <el-select size="small" v-model.number="data.search.building" placeholder="건물" style="width: 150px">
        <el-option v-for="item in data.buildings" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div style="text-align: center">납부기한</div>
      </template>
      <el-date-picker style="margin: 0px 10px 0px 0px; height: 24px; width: 150px" v-model="data.search.startbilldate" format="YYYY.MM.DD" value-format="YYYY-MM-DD" />
      <el-date-picker style="margin: 0px 0px; height: 24px; width: 150px" v-model="data.search.endbilldate" format="YYYY.MM.DD" value-format="YYYY-MM-DD" />
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div style="text-align: center">상태</div>
      </template>
      <div style="display: flex; justify-content: space-between">
        <el-radio-group v-model="data.search.status">
          <el-radio value="0">전체</el-radio>
          <el-radio value="1">미수금</el-radio>
          <el-radio value="2">부분수금</el-radio>          
          <el-radio value="3">수금</el-radio>
        </el-radio-group>
        <div style="flex: 1; display: flex; align-items: center; justify-content: right">
          <el-button size="small" class="filter-item" type="primary" @click="clickSearch">검색</el-button>
        </div>
      </div>
    </el-descriptions-item>
  </el-descriptions>

  <div style="display: flex; justify-content: space-between; gap: 5px; margin-bottom: 10px">
    <div style="flex: 1; text-align: right; gap: 5">
      <el-button size="small" type="danger" @click="clickDeleteMulti" style="margin-right: 20px">삭제</el-button>          
    </div>
  </div>

  <el-table :data="data.items" border :height="height(300)" @row-click="clickUpdate" ref="listRef" @selection-change="changeList">
    <el-table-column type="selection" width="40" align="center" />
    <el-table-column label="청구대상 월" align="center" width="120">
      <template #default="scope"> {{ scope.row.month.replaceAll('-', '.') }} ~ {{ scope.row.endmonth.replaceAll('-', '.') }} </template>
    </el-table-column>
    <el-table-column label="기간" align="center" width="60">
      <template #default="scope"> {{ scope.row.period }}개월분 </template>
    </el-table-column>
    <el-table-column prop="title" label="적요" align="left" />      
    <el-table-column label="사업자명" align="left">
      <template #default="scope">
        {{ scope.row.companyname }}
      </template>
    </el-table-column>
    <el-table-column label="건물" align="left">
      <template #default="scope">
        {{ scope.row.buildingname }}
      </template>
    </el-table-column>
    <el-table-column prop="billdate" label="납부기한" align="center" width="80" :formatter="util.tableDate" />
    <el-table-column label="금액" align="right" width="80">
      <template #default="scope"> {{ util.money(scope.row.price) }} 원 </template>
    </el-table-column>
    <el-table-column label="부가세" align="right" width="80">
      <template #default="scope"> {{ util.money(scope.row.vat) }} 원 </template>
    </el-table-column>
    <el-table-column label="미수금액" align="right" width="80">
      <template #default="scope"> {{ util.money(scope.row.vat + scope.row.price - scope.row.depositprice) }} 원</template>
    </el-table-column>    
    <el-table-column label="상태" align="center" width="70">
      <template #default="scope">
        <span v-if="scope.row.status == 1">미수금</span>
        <span v-if="scope.row.status == 2">부분수금</span>
        <span v-if="scope.row.status == 3">수금</span>
      </template>
    </el-table-column>
    <el-table-column prop="billingname" label="담당자" align="left" width="80" />
    <el-table-column prop="billingtel" label="연락처" align="left" />
    <el-table-column prop="billingemail" label="이메일" align="left" />
    
  </el-table>

  <el-dialog v-model="deposit.visible" width="800px">
    <div style="display: flex; justify-content: space-between; gap: 5px">
      <Title title="매출 정보" />

      <div style="flex: 1; text-align: right; gap: 5; margin-top: 15px">
        <el-button size="small" type="primary" @click="clickSave">저장</el-button>
      </div>
    </div>
    
    <y-table>
      <y-tr>
        <y-th style="width: 90px">사업자명</y-th>
        <y-td>
          {{deposit.item.companyname}}
        </y-td>
      </y-tr>
      <y-tr>
        <y-th style="width: 90px">건물</y-th>
        <y-td>
          {{deposit.item.buildingname}}
        </y-td>
      </y-tr>
      <y-tr>
        <y-th style="width: 90px">금액</y-th>
        <y-td>          
          {{util.money(deposit.item.price)}} 원
        </y-td>
      </y-tr>
      <y-tr>
        <y-th style="width: 90px">부가세</y-th>
        <y-td>
          {{util.money(deposit.item.vat)}} 원
        </y-td>
      </y-tr>
      <y-tr>
        <y-th style="width: 90px">미수금액</y-th>
        <y-td>          
          {{ util.money(deposit.item.vat + deposit.item.price - deposit.item.depositprice) }} 원
        </y-td>
      </y-tr>
      <y-tr>
        <y-th style="width: 90px">적요</y-th>
        <y-td>
          <el-input v-model="deposit.item.title" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th style="width: 90px">비고</y-th>
        <y-td>
          <el-input v-model="deposit.item.remark" />
        </y-td>
      </y-tr>
    </y-table>

    <div style="display: flex; justify-content: space-between; gap: 5px">
      <Title title="건물 정보" />

      <div style="flex: 1; text-align: right; gap: 5; margin-top: 15px">
        <el-button size="small" type="danger" @click="clickDeleteDepositMulti" style="margin-right: -5px">수금 삭제</el-button>
        <el-button size="small" type="success" @click="clickInsertDeposit">수금 추가</el-button>
      </div>
    </div>

    <el-table :data="deposit.items" border height="200" ref="depositRef" @selection-change="changeListDeposit">
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column prop="price" label="구분" align="center" width="80">
        <template #default="scope">
          <span v-if="scope.row.type == 1">이체</span>
          <span v-if="scope.row.type == 2">지로</span>
          <span v-if="scope.row.type == 3">현금</span>
          <span v-if="scope.row.type == 4">카드</span>
          <span v-if="scope.row.type == 5">CMS</span>
          <span v-if="scope.row.type == 6">기타</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="금액" align="right" width="120">
        <template #default="scope">
          {{util.money(scope.row.price)}}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="비고" align="left" />
      <el-table-column prop="date" label="등록일" align="center" width="130" />
    </el-table>

    <template #footer>
      <el-button size="small" @click="deposit.visible = false">취소</el-button>      
    </template>
  </el-dialog>

  <el-dialog v-model="deposit.visibleInsert" width="800px">
    <Title title="수금 등록" />
    
    <y-table>
      <y-tr>
        <y-th style="width: 150px">구분</y-th>
        <y-td>
          <el-radio-group v-model="deposit.deposit.type">
            <el-radio-button size="small" value="1">이체</el-radio-button>
            <el-radio-button size="small" value="2">지로</el-radio-button>
            <el-radio-button size="small" value="3">현금</el-radio-button>
            <el-radio-button size="small" value="4">카드</el-radio-button>
            <el-radio-button size="small" value="5">CMS</el-radio-button>
            <el-radio-button size="small" value="6">기타</el-radio-button>
          </el-radio-group>
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>금액</y-th>
        <y-td>
          <el-input v-model="deposit.deposit.price" style="width:100px;" /> 원
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>비고</y-th>
        <y-td>
          <el-input v-model="deposit.deposit.remark" />
        </y-td>
      </y-tr>
    </y-table>
    
    

    <template #footer>
      <el-button size="small" @click="clickCancelDeposit">취소</el-button>
      <el-button size="small" type="primary" @click="clickSubmitDeposit">등록</el-button>
    </template>
  </el-dialog>
  
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import router from '~/router'
import { util, size } from '~/global'
import { User, Customer, Building, Billinglist, Company, Billing, Billinghistory } from '~/models'
import Extra from '~/models/extra'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElTable } from 'element-plus'
import axios from 'axios'
import moment from 'moment'

const { width, height } = size()

const store = useStore()
const route = useRoute()

const headers = {
  Authorization: 'Bearer ' + store.state.token,
}

const model = Billinglist

const item = {
  id: 0,
  price: 0,
  status: 1,
  billdate: '',
  company: 0,
  building: 0,
  date: ''
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
  search: {
    company: 0,
    building: 0,
    status: '0',
    type: 0,
    startbilldate: '',
    endbilldate: '',
    duration: 1,
  },
  buildings: [],
  allbuildings: [],
  statuss: [
    { id: 0, name: ' ' },
    { id: 1, name: '미수금' },
    { id: 2, name: '부분수금' },
    { id: 3, name: '수금' },
  ],
  durations: [
    { id: 1, name: '기간별' },
    { id: 2, name: '연도별' },
    { id: 3, name: '월별' },
  ],
  index: -1
})

async function clickSearch() {
  await getItems(true)
}

async function initData() {
  let res = await model.init()
  data.buildings = [{ id: 0, name: ' ' }]

  data.companys = [{ id: 0, name: ' ' }, ...res.companys]
}

async function getItems() {  
  let res = await model.find({
    name: data.search.text,
    page: data.page,
    pagesize: data.pagesize,
    company: data.session.company,
    building: data.search.building,
    status: util.getInt(data.search.status),
    startbilldate: data.search.startbilldate,
    endbilldate: data.search.endbilldate,
    orderby: 'bi_id desc',
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

onMounted(async () => {
  data.session = store.getters['getUser']
  data

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

      await Billing.remove(item)
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

function clickStatusMulti(status) {
  let title = ''
  if (status == Billing.status.complete) {
    title = '수금 처리하시겠습니까'
  } else {
    title = '미수금 처리하시겠습니까'
  }

  util.confirm(title, async function () {
    util.loading(true)

    for (let i = 0; i < listSelection.value.length; i++) {
      let value = listSelection.value[i]

      let res = await Billing.get(value.id)
      res.item.status = status
      await Extra.updateBilling(res.item)
    }

    //util.info('삭제되었습니다')
    await getItems(true)

    util.loading(false)
  })
}

async function changeCompany(item) {
  console.log(item)
  let res = await Building.find({
    company: item,
    orderby: 'b_name',
  })

  data.buildings = [{ id: 0, name: ' ' }, ...res.items]

  data.search.building = 0
}

const billinghistory = {
  
}

const deposit = reactive({
  visible: false,
  visibleInsert: false,
  item: util.clone(billinghistory)
})


const bulidingRef = ref<InstanceType<typeof ElTable>>()
const depositSelection = ref([])
const toggleDepositSelection = rows => {
  if (rows) {
    rows.forEach(row => {
      bulidingRef.value!.toggleRowSelection(row, undefined)
    })
  } else {
    bulidingRef.value!.clearSelection()
  }
}
const changeListDeposit = val => {
  depositSelection.value = val
}

async function readBillinghistory(id) {
  let res = await Billinghistory.find({
    billing: id,
    orderby: 'bh_id'
  })

  deposit.items = res.items
}

async function clickUpdate(item, index) {
  data.index = index  
  deposit.item = util.clone(item)  

  await readBillinghistory(item.id)
  
  deposit.visible = true
}

async function clickSave() {
  await Billing.update(deposit.item)

  let items = util.clone(data.items)
  items[deposit.item.index - 1] = util.clone(deposit.item)
  data.items = items
  
  util.alert('저장되었습니다')
}

async function clickDeleteDepositMulti() {
  util.confirm('삭제하시겠습니까', async function () {
    util.loading(true)

    let ids = []
    for (let i = 0; i < depositSelection.value.length; i++) {
      let value = depositSelection.value[i]

      let item = {
        id: value.id,
      }

      ids.push(item)      
    }

    await Extra.depositdelete({id: deposit.item.id, item: ids})

    await readBillinghistory(deposit.item.id)

    let index = deposit.item.index
    let res = await Billing.get(deposit.item.id)
    let billing = util.clone(deposit.item)
    billing.price = res.item.price
    billing.vat = res.item.vat
    billing.depositprice = res.item.depositprice
    deposit.item = billing    

    let items = util.clone(data.items)
    items[index - 1] = util.clone(deposit.item)
    data.items = items

    util.loading(false)
  })  
}

async function clickInsertDeposit() {
  deposit.deposit = util.clone(deposit)
  deposit.deposit.type = 1
  
  deposit.visibleInsert = true
}

async function clickCancelDeposit() {
  deposit.visibleInsert = false
}

async function clickSubmitDeposit() {
  let item = util.clone(deposit.deposit)

  item.type = util.getInt(item.type)
  item.price = util.getInt(item.price)
  
  item.company = deposit.item.company
  item.building = deposit.item.building
  item.billing = deposit.item.id

  await Extra.deposit(item)

  await readBillinghistory(deposit.item.id)

  let index = deposit.item.index
  let res = await Billing.get(deposit.item.id)
  let billing = util.clone(deposit.item)
  billing.price = res.item.price
  billing.vat = res.item.vat
  billing.depositprice = res.item.depositprice
  deposit.item = billing  

  let items = util.clone(data.items)
  items[index - 1] = util.clone(deposit.item)
  data.items = items
  
  deposit.visibleInsert = false
}
</script>
