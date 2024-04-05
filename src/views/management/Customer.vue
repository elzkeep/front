<template>
  <Title title="건물 및 계약 관리" />

  <div style="display: flex; justify-content: space-between; gap: 5px; margin-bottom: 10px">
    <el-date-picker v-model="data.search.startdate" type="date" size="small" style="width: 120px" />
    ~
    <el-date-picker v-model="data.search.enddate" type="date" size="small" style="width: 120px" />

    <el-select v-model.number="data.search.status" placeholder="상태" size="small" style="margin-left: 5px; width: 100px">
      <el-option v-for="item in data.statuss" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>

    <el-input v-model="data.search.text" placeholder="검색할 내용을 입력해 주세요" style="margin-left: 5px; width: 300px" @keypress.enter.native="clickSearch" />

    <!--
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
    -->

    <el-button size="small" class="filter-item" type="primary" @click="clickSearch">검색</el-button>

    <div style="flex:1;text-align:right;gap:5;">
      <el-button size="small" type="warning" @click="clickBill" style="margin-right:20px;">매출 실행</el-button>
      <el-button size="small" type="danger" @click="clickDeleteMulti" style="margin-right:-5px;">삭제</el-button>
      <el-button size="small" type="success" @click="clickInsert">등록</el-button>
    </div>
  </div>

  <el-table :data="data.items" border :height="height(170)" @row-click="clickUpdate" ref="listRef" @selection-change="changeList" v-infinite="getItems">
    <el-table-column type="selection" width="40" align="center" />
    <el-table-column label="건물명" align="left">
      <template #default="scope">
        {{ scope.row.extra.building.name }}
      </template>
    </el-table-column>
    <el-table-column label="사업자명" align="left">
      <template #default="scope">
        {{ scope.row.extra.company.name }}
      </template>
    </el-table-column>
    <el-table-column label="관리형태" align="center" width="70">
      <template #default="scope">
        <span v-if="scope.row.type == 1">직영</span>
        <span v-if="scope.row.type == 2">위탁관리</span>
      </template>
    </el-table-column>
    <!--<el-table-column label="점검자" align="left">
      <template #default="scope">
        {{getUser(scope.row.user)}}
      </template>
    </el-table-column>
    -->
    <el-table-column label="계약기간" align="center" width="160">
      <template #default="scope"> {{ scope.row.contractstartdate }} ~ {{ scope.row.contractenddate }} </template>
    </el-table-column>
    <el-table-column label="계약금액" align="right" width="80">
      <template #default="scope"> {{ util.money(scope.row.contractprice) }} 원 </template>
    </el-table-column>
    <el-table-column label="상태" align="center" width="50">
      <template #default="scope">
        <span v-if="scope.row.status == 1">진행</span>
        <span v-if="scope.row.status == 2">종료</span>
      </template>
    </el-table-column>

    <el-table-column label="청구일" align="center" width="70">
      <template #default="scope">
        <span v-if="scope.row.collectday > 0">
          <span v-if="scope.row.collecmonth == 1">당월</span>
          <span v-else>차월</span>
          {{ scope.row.collectday }} 일
        </span>
      </template>
    </el-table-column>

    <el-table-column label="담당자명" align="center" width="60">
      <template #default="scope">
        {{ getUser(scope.row.user).name }}
      </template>
    </el-table-column>

    <el-table-column label="담당자연락처" align="center" width="100">
      <template #default="scope">
        {{ getUser(scope.row.user).tel }}
      </template>
    </el-table-column>

    <el-table-column label="담당자이메일" align="left">
      <template #default="scope">
        {{ getUser(scope.row.user).email }}
      </template>
    </el-table-column>

    <el-table-column prop="date" label="등록일" align="center" width="130" />

    <el-table-column label="설비 관리" align="center" width="90">
      <template #default="scope">
        <el-button size="small" type="primary" @click="clickFacility(scope.row)">설비 관리</el-button>        
      </template>
    </el-table-column>
  </el-table>  

  <el-dialog v-model="data.visible" width="400px">
    <div style="margin-top: 20px" />
    <el-button size="large" type="success" @click="clickSingle">단건 등록</el-button>
    <el-button size="large" type="success" @click="clickMulti">일괄 등록</el-button>

    <template #footer>
      <el-button size="small" @click="clickCancel">취소</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="data.multi" width="800px">
    <y-table>
      <y-tr>
        <y-th>*파일등록</y-th>
        <y-td>
          <el-row>
            <el-col :span="12">
              <el-text tag="b"> 설정대상 <br /><br /></el-text>
              <el-text style="font-size: 12px">
                <br />
                <!-- A열 = 건물명<br />
                B열 = 대표자<br />
                C열 = 사업자번호<br />
                D열 = 주소<br />
                E열 = 상세주소 -->
              </el-text>
            </el-col>
            <el-col :span="12">
              <div style="flex: 1; text-align: right; gap: 5">
                <el-upload
                  class="upload"
                  :action="external.upload"
                  :headers="headers"
                  :show-file-list="true"
                  :on-success="handleFileSuccess"
                  :auto-upload="true"
                  :accept="'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"
                  v-model:file-list="external.files"
                  :limit="1"
                >
                  <template #trigger>
                    <el-button type="success" style="margin-right: 10px"> 엑셀 등록 </el-button>
                  </template>
                  <el-button type="primary" @click="clickDownloadExcelExample"> 예제파일 다운로드 </el-button>
                </el-upload>
              </div>
            </el-col>
          </el-row>
        </y-td>
      </y-tr>
    </y-table>
    <template #footer>
      <el-button size="small" @click="clickCancel">취소</el-button>
      <el-button size="small" type="primary" @click="clickDataSubmit">등록</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="data.single" width="800px">
    <y-table>
      <y-tr>
        <y-th>사업자명</y-th>
        <y-td>
          <el-select v-model.number="data.item.company" placeholder="사업자명" style="width: 250px" @change="changeCompany">
            <el-option v-for="item in data.companys" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>건물명</y-th>
        <y-td>
          <el-select v-model.number="data.item.building" placeholder="건물명" style="width: 250px">
            <el-option v-for="item in data.buildings" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </y-td>
      </y-tr>

      <y-tr>
        <y-th>관리형태</y-th>
        <y-td>
          <el-radio-group v-model.number="data.item.type">
            <el-radio-button size="small" value="1">직영</el-radio-button>
            <el-radio-button size="small" value="2">위탁관리</el-radio-button>
          </el-radio-group>
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>점검일</y-th>
        <y-td> 매월 <el-input v-model="data.item.companyno" style="width: 50px" /> 일 </y-td>
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
          <el-date-picker style="margin: 0px 0px; height: 24px; width: 150px" v-model="data.item.contractstartdate" /> ~
          <el-date-picker style="margin: 0px 0px; height: 24px; width: 150px" v-model="data.item.contractenddate" />
        </y-td>
      </y-tr>

      <y-tr>
        <y-th>계약금액</y-th>
        <y-td> <el-input v-model="data.item.contractprice" style="width: 100px" /> 원, VAT <el-input v-model="data.item.contractvat" style="width: 100px" /> 원 </y-td>
      </y-tr>

      <y-tr>
        <y-th>관리형태</y-th>
        <y-td>
          <el-radio-group v-model.number="data.item.billingtype">
            <el-radio-button size="small" value="1">지로</el-radio-button>
            <el-radio-button size="small" value="2">계산서</el-radio-button>
          </el-radio-group>
        </y-td>
      </y-tr>

      <y-tr>
        <y-th>청구일</y-th>
        <y-td>
          <el-radio-group v-model.number="data.item.collectmonth">
            <el-radio-button size="small" value="1">당월</el-radio-button>
            <el-radio-button size="small" value="2">차월</el-radio-button>
          </el-radio-group>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <el-input v-model="data.item.collectday" style="width: 50px" /> 일
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
        <y-th>상태</y-th>
        <y-td>
          <el-radio-group v-model.number="data.item.status">
            <el-radio-button size="small" value="1">진행</el-radio-button>
            <el-radio-button size="small" value="2">종료</el-radio-button>
          </el-radio-group>
        </y-td>
      </y-tr>

      <y-tr>
        <y-th>점검 담당자</y-th>
        <y-td>
          <el-select v-model.number="data.item.user" placeholder="점검 담당자" style="width: 150px">
            <el-option v-for="item in data.users" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </y-td>
      </y-tr>
    </y-table>

    <template #footer>
      <el-button size="small" @click="clickCancel">취소</el-button>
      <el-button size="small" type="primary" @click="clickSubmit">등록</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="data.visibleFacility" :width="width(100)">
    <FacilityInsert />
  </el-dialog>

  <el-dialog
    v-model="bill.visible"
    width="800px"
  >

    <y-table style="margin: 10px 0px;">
      <y-tr>
        <y-th>기간</y-th>
        <y-td>
          <el-select v-model.number="bill.month" placeholder="개월" size="small" style="width:100px;">
            <el-option
              v-for="item in bill.months"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </y-td>
      </y-tr>
    </y-table>

    <el-table :data="listSelection" border :height="400">
      <el-table-column label="건물명" align="left">
        <template #default="scope">
          {{scope.row.extra.building.name}}
        </template>
      </el-table-column>    
      <el-table-column label="사업자명" align="left">
        <template #default="scope">
          {{scope.row.extra.company.name}}
        </template>
      </el-table-column>
      <el-table-column label="관리형태" align="center" width="70">
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
      <el-table-column label="계약기간" align="center" width="160">
        <template #default="scope">
          {{scope.row.contractstartdate}} ~ {{scope.row.contractenddate}}
        </template>
      </el-table-column>
      <el-table-column label="계약금액" align="right" width="80">
        <template #default="scope">
          {{util.money(scope.row.contractprice)}} 원
        </template>
      </el-table-column>
      <el-table-column label="상태" align="center" width="50">
        <template #default="scope">
          <span v-if="scope.row.status==1">진행</span>
          <span v-if="scope.row.status==2">종료</span>
        </template>
      </el-table-column>

      <el-table-column label="청구일" align="center" width="70">
        <template #default="scope">
          <span v-if="scope.row.collectday > 0">
            <span v-if="scope.row.collecmonth==1">당월</span>
            <span v-else>차월</span>
            {{scope.row.collectday}} 일
          </span>
        </template>
      </el-table-column>

      <el-table-column label="담당자명" align="center" width="60">
        <template #default="scope">
          {{getUser(scope.row.user).name}}
        </template>
      </el-table-column>

      <el-table-column label="담당자연락처" align="center" width="100">
        <template #default="scope">
          {{getUser(scope.row.user).tel}}
        </template>
      </el-table-column>

      <el-table-column label="담당자이메일" align="left">
        <template #default="scope">
          {{getUser(scope.row.user).email}}
        </template>
      </el-table-column>
      
      <el-table-column prop="date" label="등록일" align="center" width="130" />

    </el-table>  


    <template #footer>
      <el-button size="small" @click="bill.visible = false">취소</el-button>
      <el-button size="small" type="primary" @click="clickBillSubmit">매출 실행</el-button>
    </template>
  </el-dialog>  
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import router from '~/router'
import { util, size } from '~/global'
import { User, Customer, Building, Company, Companylist } from '~/models'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElTable } from 'element-plus'
import type { UploadProps } from 'element-plus'
import Extra from '~/models/extra'

const { width, height } = size()

const store = useStore()
const route = useRoute()

const headers = {
  Authorization: 'Bearer ' + store.state.token,
}

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
  billingtype: 2,
  status: 1,
  company: 0,
  building: 0,
  user: 0,
  date: '',
  extra: {
    building: {
      id: null
    },
    company: {
      id: 0
    }
  }
}

const external = reactive({
  type: 1,
  filename: '',
  originalfilename: '',
  upload: `${import.meta.env.VITE_REPORT_URL}/api/upload/index`,
  files: [],
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
  pagesize: 50,
  item: util.clone(item),
  visible: false,
  single: false,
  multi: false,
  visibleFacility: false,
  search: {
    name: '',
    company: 0,
    building: 0,
    type: 0,
    startdate: '',
    status: 0,
    enddate: '',
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
    { id: 0, name: '상태' },
    { id: 1, name: '진행' },
    { id: 2, name: '종료' },
  ],
})

async function clickSearch() {
  await getItems(true)
}

async function initData() {
  let res = await Companylist.find({
    company: data.session.company,
    type: Company.type.building,
    orderby: 'c_name',
  })

  data.companys = [{ id: 0, name: ' ' }, ...res.items]

  /*
     res = await Building.find({
     orderby: 'b_name'
     })
     
     data.buildings = [{id: 0, name: ' '}, ...res.items]
   */

  let company = 0

  if (data.session.level != User.level.rootadmin) {
    company = data.session.company
  }

  res = await User.find({
    company: company,
    orderby: 'u_name',
  })

  data.users = [{ id: 0, name: ' ' }, ...res.items]
}

async function getItems(reset) {
  if (reset == true) {
    data.page = 1
    data.items = []
  }

  if (data.session.level != User.level.rootadmin) {
    data.search.company = data.session.company
  }

  let res = await model.find({
    name: data.search.text,
    page: data.page,
    pagesize: data.pagesize,
    company: data.search.company,
    building: data.search.building,
    status: data.search.status,
    startdate: data.search.startdate,
    enddate: data.search.enddate,
    orderby: 'cu_id desc',
  })

  let items = []

  for (let i = 0; i < res.items.length; i++) {
    let item = res.items[i]

    item.index = (data.page - 1) * data.pagesize + i
    items.push(item)
  }

  data.total = res.total
  data.items = data.items.concat(items)

  data.page++
}

function clickSingle() {
  data.item = util.clone(item)
  data.buildings = []
  data.single = true
  data.visible = false
}

function clickMulti() {
  data.multi = true
  data.visible = false
}

function clickInsert() {
  data.visible = true
}

async function clickUpdate(item, index) {
  if (index == null) {
    return
  }

  if (index.no == 0) {
    return
  }

  if (index.no == 9) {
    return
  }

  let res = await Building.find({
    company: item.company.id,
    orderby: 'b_name',
  })

  console.log(item)
  console.log(res.items)

  data.buildings = [{ id: 0, name: ' ' }, ...res.items]

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
  data.single = false
  data.multi = false
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
  item.billingtype = util.getInt(item.billingtype)
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

  clickCancle()
  util.loading(false)
}

const handleFileSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  //imageUrl.value = URL.createObjectURL(uploadFile.raw!)

  console.log(response)
  console.log(response.filename)
  console.log(response.originalfilename)
  external.filename = response.filename
  external.originalfilename = response.originalfilename
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
    return {
      name: '',
      tel: '',
      email: ''
    }
  }

  return items[0]
}

function clickFacility(item) {  
  router.push(`/management/facility/${item.extra.building.id}`)
  //data.visibleFacility = true
}

async function changeCompany(item) {
  console.log(item)
  console.log('changeCompany')

  let res = await Building.find({
    company: item,
    orderby: 'b_name',
  })

  data.buildings = [{ id: 0, name: ' ' }, ...res.items]
}

function clickDownloadExcelExample() {
  util.alert('여기 추가해주세요')
  // let url = '/api/download/companyexample'
  // let filename = `고객.xlsx`
  // util.download(store, url, filename)
}

async function clickDataSubmit() {
  util.alert('여기 추가해주세요')
  // util.loading(true)
  // let filename = external.files[0].response.filename
  // console.log(filename)
  // await Extra.company(filename)
  // clickCancel()
  // util.alert('저장되었습니다')
  // util.loading(false)
}

const bill = reactive({
  visible: false,
  month: 1,
  months: [
    {id: 1, name: '1개월'},
    {id: 2, name: '2개월'},
    {id: 3, name: '3개월'},
    {id: 4, name: '4개월'},
    {id: 5, name: '5개월'},
    {id: 6, name: '6개월'},
    {id: 7, name: '7개월'},
    {id: 8, name: '8개월'},
    {id: 9, name: '9개월'},
    {id: 10, name: '10개월'},
    {id: 11, name: '11개월'},
    {id: 12, name: '12개월'}
  ]
})

function clickBill() {
  bill.visible = true

  console.log(listSelection.value)
}

async function clickBillSubmit() {
  if (listSelection.value.length == 0) {
    return
  }
  util.confirm('매출 실행 하시겠습니까', async function() {
    util.loading(true)

    let ids = []
    for (let i = 0; i < listSelection.value.length; i++) {
      let value = listSelection.value[i]
      
      ids.push(value.extra.building.id)
      
    }

    await Extra.makebill(bill.month, ids)

    util.alert('매출 실행되었습니다')
    
    util.loading(false)
    bill.visible = false
  })

}
</script>
