<template>
  <Title title="건물 및 계약 관리" />

  <div style="display:flex;justify-content: space-between;gap:5px;margin-bottom:10px;">

    <el-select v-model.number="data.search.company" placeholder="업체" style="width:150px;" v-if="data.session.level == User.level.rootadmin">
      <el-option
        v-for="item in data.companys"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>

    <el-select v-model.number="data.search.building" placeholder="건물" style="width:150px;">           
      <el-option
        v-for="item in data.buildings"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>

    <el-button size="small" class="filter-item" type="primary" @click="clickSearch">검색</el-button>
    
    <div style="flex:1;text-align:right;gap:5;">
      <el-button size="small" type="danger" @click="clickDeleteMulti" style="margin-right:-5px;">삭제</el-button>
      <el-button size="small" type="success" @click="clickInsert">등록</el-button>
    </div>
  </div>  

  
  <el-table :data="data.items" border :height="height(170)" @row-click="clickUpdate"  ref="listRef" @selection-change="changeList">
    <el-table-column type="selection" width="40" align="center" />    
    <el-table-column label="건물명" align="left">
      <template #default="scope">
        {{getBuilding(scope.row.building)}}
      </template>
    </el-table-column>    
    <el-table-column label="사업자명" align="left" width="200">
      <template #default="scope">
        {{getCompany(scope.row.extra.building.company)}}
      </template>
    </el-table-column>
    <el-table-column label="관리형태" align="center" width="80">
      <template #default="scope">
        <span v-if="scope.row.type==1">직영</span>
        <span v-if="scope.row.type==2">위탁관리</span>
      </template>
    </el-table-column>
    <!--<el-table-column label="점검자" align="left">
      <template #default="scope">
        {{getUser(scope.row.user)}}
      </template>
    </el-table-column>
    -->
    <el-table-column label="계약기간" align="right" width="250">
      <template #default="scope">
        {{scope.row.contractstartdate}} ~ {{scope.row.contractenddate}}
      </template>
    </el-table-column>
    <el-table-column label="계약금액" align="right" width="120">
      <template #default="scope">
        {{util.money(scope.row.contractprice)}} 원
      </template>
    </el-table-column>
    <el-table-column prop="date" label="등록일" align="center" width="150" />
    <!--
    <el-table-column label="설비 관리" align="center" width="90">
      <template #default="scope">
        <el-button size="small" type="primary" @click="clickFacility(scope.row)">설비 관리</el-button>        
      </template>
    </el-table-column>
    -->
  </el-table>  

  
  <el-dialog
    v-model="data.visible"
    width="800px"
  >

      <y-table>
        <y-tr v-if="data.session.level == User.level.rootadmin">
          <y-th>업체</y-th>
          <y-td>
            <el-select v-model.number="data.item.company" placeholder="업체" style="width:150px;">           
              <el-option
                v-for="item in data.companys"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>                      
          </y-td>
        </y-tr>
        <y-tr>
          <y-th>건물명</y-th>
          <y-td>
            <el-select v-model.number="data.item.building" placeholder="건물명" style="width:150px;">           
              <el-option
                v-for="item in data.buildings"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>            
          </y-td>
        </y-tr>

        <y-tr>
          <y-th>관리형태</y-th>
          <y-td>
            <el-radio-group v-model.number="data.item.type">
              <el-radio-button size="small" label="1">직영</el-radio-button>
              <el-radio-button size="small" label="2">위탁관리</el-radio-button>
            </el-radio-group>
          </y-td>
        </y-tr>
        <y-tr>
          <y-th>점검일</y-th>
          <y-td>
            매월 <el-input v-model="data.item.companyno" style="width:50px;" /> 일
          </y-td>
        </y-tr>
        <y-tr>
          <y-th>담당자</y-th>
          <y-td>
            <el-input v-model="data.item.managername" />
          </y-td>
        </y-tr>
        <y-tr>
          <y-th>담당자 연락처</y-th>
          <y-td>
            <el-input v-model="data.item.managertel" />
          </y-td>
        </y-tr>
        <y-tr>
          <y-th>담당자 이메일</y-th>
          <y-td>
            <el-input v-model="data.item.manageremail" />
          </y-td>
        </y-tr>

        <y-tr>
          <y-th>계악일</y-th>
          <y-td>            
            <el-date-picker style="margin: 0px 0px;height: 24px;width:150px;" v-model="data.item.contractstartdate" /> ~ <el-date-picker style="margin: 0px 0px;height: 24px;width:150px;" v-model="data.item.contractenddate" /> 
          </y-td>
        </y-tr>

        <y-tr>
          <y-th>계약금액</y-th>
          <y-td>
            <el-input v-model="data.item.contractprice" />
          </y-td>
        </y-tr>

        <y-tr>
          <y-th>청구일</y-th>
          <y-td>
            매월 <el-input v-model="data.item.contractday" style="width:50px;" /> 일
          </y-td>
        </y-tr>

        <y-tr>
          <y-th>계약담당자</y-th>
          <y-td>
            <el-input v-model="data.item.billingname" />
          </y-td>
        </y-tr>
        <y-tr>
          <y-th>계약담당자 연락처</y-th>
          <y-td>
            <el-input v-model="data.item.billingtel" />
          </y-td>
        </y-tr>
        <y-tr>
          <y-th>계약담당자 이메일</y-th>
          <y-td>
            <el-input v-model="data.item.billingemail" />
          </y-td>
        </y-tr>
        <y-tr>
          <y-th>점검 담당자</y-th>
          <y-td>
            <el-select v-model.number="data.item.user" placeholder="점검 담당자" style="width:150px;">
              <el-option
                v-for="item in data.users"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </y-td>
        </y-tr>
      </y-table>

      <template #footer>
        <el-button size="small" @click="clickCancel">취소</el-button>
        <el-button size="small" type="primary" @click="clickSubmit">등록</el-button>
      </template>
  </el-dialog>

  <el-dialog
    v-model="data.visibleFacility"
    :width="width(100)"
  >
    <FacilityInsert />
  </el-dialog>
</template>


<script setup lang="ts">

import { ref, reactive, onMounted, onUnmounted } from "vue"
import router from '~/router'
import { util, size }  from "~/global"
import { User, Customer, Building, Company } from "~/models"
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElTable } from 'element-plus'

const { width, height } = size()

const store = useStore()
const route = useRoute()

const model = Customer

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
  date: ''
}

const data = reactive({
  session: {
    level: 0,
    company: 0
  },
  id: 0,
  mode: 'normal',
  items: [],
  total: 0,
  page: 1,
  pagesize: 0,
  item: util.clone(item),
  visible: false,
  visibleFacility: false,
  search: {
    company: 0,
    building: 0,
    type: 0
  },
  companys: [],
  users: [],
  buildings: [],
  types: [
    {id: 0, name: ' '},
    {id: 1, name: '직영'},
    {id: 2, name: '위탁관리'}        
  ]
})

async function clickSearch() {
  await getItems(true)
}

async function initData() {
  let res = await Company.find({
    type: Company.type.building,
    orderby: 'c_name'
  })
  
  data.companys = [{id: 0, name: ' '}, ...res.items]

  res = await Building.find({
    orderby: 'b_name'
  })
  
  data.buildings = [{id: 0, name: ' '}, ...res.items]

  let company = 0

  if (data.session.level != User.level.rootadmin) {
    company = data.session.company
  }

  res = await User.find({
    company: company,
    orderby: 'u_name'
  })

  data.users = [{id: 0, name: ' '}, ...res.items]
}

async function getItems() {
  if (data.session.level != User.level.rootadmin) {
    data.search.company = data.session.company
  }

  let res = await model.find({
    name: data.search.text,
    page: data.page,
    pagesize: data.pagesize,
    company: data.search.company,
    building: data.search.building,
    orderby: 'cu_id desc'
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

function clickInsert() {  
  data.item = util.clone(item)
  data.visible = true  
}

function clickUpdate(item, index) {
  if (index == null) {
    return
  }
  
  if (index.no == 0) {
    return
  }

  if (index.no == 9) {
    return
  }

  data.item = util.clone(item)
  data.visible = true  
}

onMounted(async () => {
  data.session = store.getters['getUser']

  util.loading(true)
  
  await initData()
  await getItems()

  data.visible = false
  util.loading(false)
})

function clickCancel() {
  data.visible = false
}

const listRef = ref<InstanceType<typeof ElTable>>()
const listSelection = ref([])
const toggleListSelection = (rows) => {
  if (rows) {
    rows.forEach((row) => {
      listRef.value!.toggleRowSelection(row, undefined)
    })
  } else {
    listRef.value!.clearSelection()
  }
}
const changeList = (val) => {
  listSelection.value = val
}

function clickDeleteMulti() {
  util.confirm('삭제하시겠습니까', async function() {
    util.loading(true)
    
    for (let i = 0; i < listSelection.value.length; i++) {
      let value = listSelection.value[i]

      let item = {
        id: value.id
      }

      await model.remove(item)
    }

    //util.info('삭제되었습니다')
    await getItems()

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
    util.alert('건물명을 선택하세요')
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
  
  await getItems()

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

function clickFacility(item) {
  router.push(`/management/facility/${item.id}`)
  //data.visibleFacility = true
}

</script>
