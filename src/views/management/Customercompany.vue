<template>
  <Title title="고객별 현황" />

  <div style="display:flex;justify-content: space-between;gap:5px;margin-bottom:10px;">

    <el-input v-model="data.search.text" placeholder="검색할 내용을 입력해 주세요" style="width:300px;" @keyup.enter.native="clickSearch" />

    <el-button size="small" class="filter-item" type="primary" @click="clickSearch">검색</el-button>
    
    <div style="flex:1;text-align:right;gap:5;">
      
    </div>
  </div>  

  
  <el-table :data="data.items" border :height="height(170)">        
    <el-table-column prop="name" label="사업자명" align="left" width="200" />
    <el-table-column prop="companyno" label="사업자번호" align="left" width="120" />
    <el-table-column label="주소" align="left">
      <template #default="scope">
        {{scope.row.address}} {{scope.row.addressetc}}
      </template>
    </el-table-column>
    <el-table-column prop="ceo" label="대표자" align="left" width="80" />
    <el-table-column prop="buildingcount" label="보유건물수" align="right" width="80" />
    <el-table-column label="계약총액" align="right" width="120">
      <template #default="scope">
        {{util.money(scope.row.contractprice)}} 원
      </template>
    </el-table-column>
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
          <y-th>고객명</y-th>
          <y-td>
            <el-select v-model.number="data.item.building" placeholder="고객명" style="width:150px;">           
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

</template>


<script setup lang="ts">

import { ref, reactive, onMounted, onUnmounted } from "vue"
import router from '~/router'
import { util, size }  from "~/global"
import { User, Customer, Building, Company, Customercompany } from "~/models"
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElTable } from 'element-plus'

const { width, height } = size()

const store = useStore()
const route = useRoute()

const model = Customercompany

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
  search: {
    company: 0,
    building: 0,
    type: 0,
    text: ''
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
    name: data.search.text,
    orderby: 'c_name'
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

  util.loading(true)
  
  await initData()
  await getItems()

  data.visible = false
  util.loading(false)
})

function clickCancel() {
  data.visible = false
}

</script>
