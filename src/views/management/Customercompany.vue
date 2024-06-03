
<template>
  <Title title="고객 현황" />

  <div style="display: flex; justify-content: space-between; gap: 5px; margin-bottom: 10px">
    <el-date-picker v-model="data.search.startdate" type="date" size="small" style="width: 120px" format="YYYY.MM.DD" value-format="YYYY-MM-DD" />
    ~
    <el-date-picker v-model="data.search.enddate" type="date" size="small" style="width: 120px" format="YYYY.MM.DD" value-format="YYYY-MM-DD" />

    <el-input v-model="data.search.text" placeholder="검색할 내용을 입력해 주세요" style="margin-left: 5px; width: 300px" @keypress.enter.native="clickSearch" />

    <el-button size="small" class="filter-item" type="primary" @click="clickSearch">검색</el-button>

    <div style="flex: 1; text-align: right; gap: 5">
      <el-button size="small" type="warning" @click="clickExcel" style="margin-right: -5px">엑셀</el-button>
      <el-button size="small" type="danger" @click="clickDeleteMulti" style="margin-right: -5px">삭제</el-button>
      <el-button size="small" type="success" @click="clickInsert">등록</el-button>
    </div>
  </div>

  <el-table :data="data.items" border :height="height(170)" @row-click="clickUpdate" ref="listRef" @selection-change="changeList" v-infinite="getItems">
    <el-table-column type="selection" width="40" align="center" />
    <el-table-column prop="name" label="사업자명" align="left" width="250" />
    <el-table-column prop="ceo" label="대표자" align="left" width="120" />
    <el-table-column prop="companyno" label="사업자번호" align="left" width="120" />
    <el-table-column label="주소" align="left">
      <template #default="scope"> {{ scope.row.address }} {{ scope.row.addressetc }} </template>
    </el-table-column>
    <el-table-column label="보유건물수" align="right" width="80">
      <template #default="scope">
        {{ scope.row.buildingcount }}
      </template>
    </el-table-column>
    <el-table-column prop="date" label="등록일" align="center" width="150" :formatter="util.tableDatetime" />
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
                A열 = 건물명<br />
                B열 = 대표자<br />
                C열 = 사업자번호<br />
                D열 = 주소<br />
                E열 = 상세주소
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
    <Title title="기본 정보" />
    <y-table>
      <y-tr>
        <y-th style="width: 90px">사업자명<span style="color: red">*</span></y-th>
        <y-td>
          <el-input v-model="data.item.name" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>사업자번호<span style="color: red">*</span></y-th>
        <y-td>
          <el-input v-model="data.item.companyno" placeholder="000-00-00000" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>대표자<span style="color: red">*</span></y-th>
        <y-td>
          <el-input v-model="data.item.ceo" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>주소<span style="color: red">*</span></y-th>
        <y-td>
          <el-input v-model="data.item.address" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>상세주소</y-th>
        <y-td>
          <el-input v-model="data.item.addressetc" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>연락처<span style="color: red">*</span></y-th>
        <y-td>
          <el-input v-model="data.item.tel" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>이메일<span style="color: red">*</span></y-th>
        <y-td>
          <el-input v-model="data.item.email" />
        </y-td>
      </y-tr>
    </y-table>

    <div style="display: flex; justify-content: space-between; gap: 5px" v-if="data.item.id > 0">
      <Title title="건물 정보" />

      <div style="flex: 1; text-align: right; gap: 5; margin-top: 15px">
        <el-button size="small" type="danger" @click="clickDeleteBuildingMulti" style="margin-right: -5px">건물 삭제</el-button>
        <el-button size="small" type="success" @click="clickInsertBuilding">건물 추가</el-button>
      </div>
    </div>

    <el-table :data="building.items" border height="200" @row-click="clickUpdateBuilding" ref="buildingRef" @selection-change="changeListBuilding" v-if="data.item.id > 0">
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column prop="name" label="건물명" align="left" width="250" />
      <el-table-column prop="ceo" label="대표자" align="left" width="80" />
      <el-table-column prop="companyno" label="사업자번호" align="left" width="120" />
      <el-table-column label="주소" align="left">
        <template #default="scope"> {{ scope.row.address }} {{ scope.row.addressetc }} </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <el-button size="small" @click="clickCancel">취소</el-button>
      <el-button size="small" type="primary" @click="clickSubmitSingle">등록</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="building.visible" width="800px">
    <y-table>
      <y-tr>
        <y-th style="width: 150px">건물명(점검대상)<span style="color: red">*</span></y-th>
        <y-td>
          <el-input v-model="building.name" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>사업자번호<span style="color: red">*</span></y-th>
        <y-td>
          <el-checkbox v-model="building.check" label="고객정보와 동일" @click="clickCheck" />
          <el-input v-model="building.companyno" v-bind:disabled="building.check" placeholder="000-00-00000" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>대표자<span style="color: red">*</span></y-th>
        <y-td>
          <el-input v-model="building.ceo" v-bind:disabled="building.check" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>우편번호</y-th>
        <y-td>
          <el-input v-model="building.zip" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>주소<span style="color: red">*</span></y-th>
        <y-td>
          <el-input v-model="building.address" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>상세주소</y-th>
        <y-td>
          <el-input v-model="building.addressetc" />
        </y-td>
      </y-tr>
      
      <y-tr>
        <y-th>우편수령지 우편번호</y-th>
        <y-td>
          <el-checkbox v-model="building.checkpost" label="건물정보와 동일" @click="clickCheckPost" />
          <el-input v-model="building.postzip" v-bind:disabled="building.checkpost" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>우편수령지</y-th>
        <y-td>
          <el-input v-model="building.postaddress" v-bind:disabled="building.checkpost" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>우편 수신자</y-th>
        <y-td>
          <el-input v-model="building.postname" v-bind:disabled="building.checkpost" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>우편수령지 전화번호</y-th>
        <y-td>
          <el-input v-model="building.posttel" v-bind:disabled="building.checkpost" />
        </y-td>
      </y-tr>

    </y-table>
    
    

    <template #footer>
      <el-button size="small" @click="clickCancelBuilding">취소</el-button>
      <el-button size="small" type="primary" @click="clickSubmitBuilding">등록</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import router from '~/router'
import { util, size } from '~/global'
import { User, Customer, Building, Company, Customercompany, Customercompanylist, Uploadfile } from '~/models'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElTable } from 'element-plus'
import type { UploadProps } from 'element-plus'
import moment from 'moment'
import Extra from '~/models/extra'

const { width, height } = size()

const store = useStore()
const route = useRoute()

const headers = {
  Authorization: 'Bearer ' + store.state.token,
}

const model = Customercompany

const item = {
  id: 0,
  name: '',
  companyno: '',
  ceo: '',
  tel: '',
  email: '',
  zip: '',
  address: '',
  addressetc: '',
  type: 2,
  date: '',
}

const building = reactive({
  visible: false,
  check: false,
  checkpost: false,
  id: 0,
  name: '',
  companyno: '',
  ceo: '',
  address: '',
  addressetc: '',
  postzip: '',
  postaddress: '',
  postname: '',
  posttel: '',
  items: [],
})

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
  search: {
    company: 0,
    building: 0,
    type: 0,
    text: '',
    startdate: '',
    enddate: '',
  },
  companys: [],
  users: [],
  types: [
    { id: 0, name: ' ' },
    { id: 1, name: '직영' },
    { id: 2, name: '위탁관리' },
  ],
  filelist: [],
  visibleBuilding: false,
})

// const handleExceed: UploadProps["onExceed"] = files => {
//   data.filelist = []
//   data.filelist = files
// }

async function clickSearch() {
  await getItems(true)
}

async function initData() {}

async function getItems(reset) {
  if (reset == true) {
    data.page = 1
    data.items = []
  }

  if (data.session.level != User.level.rootadmin) {
    //data.search.company = data.session.company
  }

  let res = await Customercompanylist.find({
    name: data.search.text,
    page: data.page,
    pagesize: data.pagesize,
    company: data.session.company,
    startdate: data.search.startdate,
    enddate: data.search.enddate,
    orderby: 'c_name',
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

// function clickInsert() {
//   data.item = util.clone(item)
//   data.visible = true
// }

function clickdowunload() {}

async function clickSubmit() {
  util.loading(true)

  let item = util.clone(data.item)

  if (/^[0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9][0-9]$/.test(item.companyno) == false) {
    alert('사업자번호 양식이 맞지 않습니다')
    return    
  }

  if (item.id > 0) {
    await modelCustomer.update(item)
  } else {
    await modelCustomer.insert(item)
  }

  util.alert('저장되었습니다')

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

async function readBuilding() {
  let res = await Building.find({
    company: data.item.id,
    orderby: 'b_name',
  })

  building.items = res.items
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

  data.item = util.clone(item)
  // data.visible = true

  await readBuilding()
  data.single = true
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
  data.single = false
  data.multi = false
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

      await Company.remove(item)
    }

    //util.info('삭제되었습니다')
    await getItems(true)

    util.loading(false)
  })
}

async function clickSubmitSingle() {
  let item = util.clone(data.item)

  if (item.name == '') {
    util.alert('사업자명을 입력하세요')
    return
  }

  if (item.ceo == '') {
    util.alert('대표자명을 입력하세요')
    return
  }

  if (item.companyno == '') {
    util.alert('사업자번호를 입력하세요')
    return
  }

  if (/^[0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9][0-9]$/.test(item.companyno) == false) {
    alert('사업자번호 양식이 맞지 않습니다')
    return    
  }

  if (item.address == '') {
    util.alert('주소를 입력하세요')
    return
  }

  if (item.tel == '') {
    util.alert('연락처를 입력하세요')
    return
  }

  if (item.email == '') {
    util.alert('이메일을 입력하세요')
    return
  }

  util.loading(true)

  if (item.id > 0) {
    await Company.update(item)
  } else {
    item.company = data.session.company
    await Company.insert(item)
  }

  //util.info('등록되었습니다')

  await getItems(true)

  data.visible = false
  data.single = false
  util.loading(false)
}

function clickExcel() {
  let url = '/api/download/company'
  let filename = `고객현황-${moment().format('YYYY-MM-DD')}.xlsx`
  util.download(store, url, filename)
}

function clickUpdateBuilding(item, index) {
  console.log(item)
  if (item.check == 1) {
    building.check = true
  } else {
    building.check = false
  }

  if (item.checkpost == 1) {
    building.checkpost = true
  } else {
    building.checkpost = false
  }

  building.id = item.id
  building.address = item.address
  building.addressetc = item.addressetc
  building.businesscondition = item.businesscondition
  building.businessitem = item.businessitem

  building.ceo = item.ceo
  building.checkount = item.checkount
  building.company = item.company
  building.companyno = item.companyno
  building.contractvolumn = item.contractvolumn
  building.district = item.district
  building.name = item.name
  building.periodic = item.periodic
  building.postzip = item.postzip
  building.postaddress = item.postaddress
  building.postname = item.postname
  building.posttel = item.posttel
  building.score = item.score
  building.totalweight = item.totalweight
  building.usage = item.usage
  building.volttype = item.volttype
  building.weight = item.weight
  
  building.visible = true
}

const bulidingRef = ref<InstanceType<typeof ElTable>>()
const buildingSelection = ref([])
const toggleBuildingSelection = rows => {
  if (rows) {
    rows.forEach(row => {
      bulidingRef.value!.toggleRowSelection(row, undefined)
    })
  } else {
    bulidingRef.value!.clearSelection()
  }
}
const changeListBuilding = val => {
  buildingSelection.value = val
}

function clickDeleteBuildingMulti() {
  util.confirm('삭제하시겠습니까', async function () {
    util.loading(true)

    for (let i = 0; i < buildingSelection.value.length; i++) {
      let value = buildingSelection.value[i]

      let item = {
        id: value.id,
      }

      await Building.remove(item)
    }

    //util.info('삭제되었습니다')
    await getItems(true)
    await readBuilding()

    util.loading(false)
  })
}

function clickCheck() {
  if (building.check == false) {
    building.companyno = data.item.companyno
    building.ceo = data.item.ceo
  } else {
    building.companyno = ''
    building.ceo = ''
  }
}

function clickCheckPost() {}

async function clickInsertBuilding() {
  building.check = false
  building.checkpost = false
  building.id = 0
  building.name = ''
  building.companyno = ''
  building.ceo = ''
  building.address = ''
  building.addressetc = ''
  building.postzip = ''
  building.postaddress = ''
  building.postname = ''
  building.posttel = ''
  building.visible = true
}

function clickCancelBuilding() {
  building.visible = false
}

async function clickSubmitBuilding() {
  let item = util.clone(building)

  if (item.name == '') {
    util.alert('건물명을 입력하세요')
    return
  }

  if (/^[0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9][0-9]$/.test(item.companyno) == false) {
    alert('사업자번호 양식이 맞지 않습니다')
    return    
  }
  
  item.status = 1
  item.company = data.item.id

  if (item.check == true) {
    item.check = 1
  } else {
    item.check = 0
  }
  
  if (item.checkpost == true) {
    item.checkpost = 1
  } else {
    item.checkpost = 0
  }

  util.loading(true)
  
  if (item.id > 0) {
    await Building.update(item)
  } else {
    await Building.insert(item)
  }

  util.alert('저장되었습니다')

  util.loading(false)
  await readBuilding()

  building.visible = false
}

function clickDownloadExcelExample() {
  let url = '/api/download/companyexample'
  let filename = `고객.xlsx`
  util.download(store, url, filename)
}

async function clickDataSubmit() {
  util.loading(true)

  let filename = external.files[0].response.filename
  await Extra.company(filename)

  clickCancel()

  util.alert('저장되었습니다')

  await getItems(true)

  util.loading(false)
}
</script>
