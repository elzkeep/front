<template>
  <Title title="고객별 현황" />

  <div style="display: flex; justify-content: space-between; gap: 5px; margin-bottom: 10px">
    <el-input v-model="data.search.text" placeholder="검색할 내용을 입력해 주세요" style="width: 300px" @keyup.enter.native="clickSearch" />

    <el-button size="small" class="filter-item" type="primary" @click="clickSearch">검색</el-button>

    <div style="flex: 1; text-align: right; gap: 5">
      <el-button size="small" type="danger" @click="clickDeleteMulti" style="margin-right: -5px">삭제</el-button>
      <el-button size="small" type="success" @click="clickInsert">등록</el-button>
    </div>
  </div>

  <el-table :data="data.items" border :height="height(170)" @row-click="clickUpdate" ref="listRef" @selection-change="changeList">
    <el-table-column type="selection" width="40" align="center" />
    <el-table-column prop="name" label="사업자명" align="left" width="200" />
    <el-table-column prop="companyno" label="사업자번호" align="left" width="120" />
    <el-table-column label="주소" align="left">
      <template #default="scope"> {{ scope.row.address }} {{ scope.row.addressetc }} </template>
    </el-table-column>
    <el-table-column prop="ceo" label="대표자" align="left" width="80" />
    <el-table-column label="보유건물수" align="right" width="80">
      <template #default="scope">
        {{ scope.row.buildingcount }}
      </template>
    </el-table-column>
    <el-table-column label="계약총액" align="right" width="120">
      <template #default="scope"> {{ util.money(scope.row.price) }} 원 </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="data.visible" width="800px">
    <div style="gap: 5px; margin-bottom: 10px">
      <el-button size="large" @click="clickSingle">단건 등록</el-button>
    </div>
    <div>
      <el-button size="large" @click="clickMulti">일괄 등록</el-button>
    </div>
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
              <el-text>
                A열 = 사업자명<br />
                B열 = 대표자<br />
                C열 = 사업자번호<br />
                D열 = 주소<br />
                E열 = 연락처<br />
                F열 = 이메일<br />
                <br />
                *CSV 파일 형태로 업로드 해주세요.<br />
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
                    <el-button type="success" style="margin-right: 10px">
                      Upload<el-icon class="el-icon--right"><Upload /></el-icon>
                    </el-button>
                  </template>
                  <el-button type="primary">
                    Download<el-icon class="el-icon--right"><Download /></el-icon>
                  </el-button>
                </el-upload>
              </div>
            </el-col>
          </el-row>
        </y-td>
      </y-tr>
    </y-table>
    <template #footer>
      <el-button size="small" @click="clickCancel">취소</el-button>
      <el-button size="small" @click="clickDataSubmit">등록</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="data.single" width="800px">
    <y-table>
      <y-tr>
        <y-th>고객명</y-th>
        <y-td>
          <el-input v-model="data.item.name" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>사업자번호</y-th>
        <y-td>
          <el-input v-model="data.item.companyno" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>대표자</y-th>
        <y-td>
          <el-input v-model="data.item.ceo" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>주소</y-th>
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
    </y-table>

    <template #footer>
      <el-button size="small" @click="clickCancel">취소</el-button>
      <el-button size="small" type="primary" @click="clickSubmitSingle">등록</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import router from '~/router'
import { util, size } from '~/global'
import { User, Customer, Building, Company, Customercompany, Uploadfile } from '~/models'
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

const model = Customercompany

const item = {
  id: 0,
  name: '',
  companyno: '',
  ceo: '',
  address: '',
  addressetc: '',
  type: 2,
  date: '',
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
  pagesize: 20,
  item: util.clone(item),
  visible: false,
  single: false,
  multi: false,
  search: {
    company: 0,
    building: 0,
    type: 0,
    text: '',
  },
  companys: [],
  users: [],
  buildings: [],
  types: [
    { id: 0, name: ' ' },
    { id: 1, name: '직영' },
    { id: 2, name: '위탁관리' },
  ],
  filelist: [],
})

// const handleExceed: UploadProps["onExceed"] = files => {
//   data.filelist = []
//   data.filelist = files
// }

async function clickSearch() {
  await getItems(true)
}

async function initData() {}

async function getItems() {
  if (data.session.level != User.level.rootadmin) {
    //data.search.company = data.session.company
  }

  let res = await Company.find({
    name: data.search.text,
    page: data.page,
    pagesize: data.pagesize,
    company: data.search.company,
    orderby: 'c_name',
  })

  if (res.items == null) {
    res.items = []
  }

  let items = []

  for (let i = 0; i < res.items.length; i++) {
    let item = res.items[i]

    let res2 = await Building.find({ company: item.id })
    item.price = 0

    for (let j = 0; j < res2.items.length; j++) {
      let res3 = await Customer.find({ company: data.session.company, building: res2.items[j].id })

      for (let k = 0; k < res3.items.length; k++) {
        item.price += res3.items[k].contractprice
      }
    }

    item.buildingcount = res2.items.length

    item.index = i + 1
    items.push(item)
  }

  data.total = res.total
  data.items = res.items
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
  // data.visible = true
  data.single = true
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
    await getItems()

    util.loading(false)
  })
}

async function clickSubmitSingle() {
  console.log('clickSubmit')
  let item = util.clone(data.item)

  console.log(item)

  if (item.name == '') {
    util.alert('고객명을 입력하세요')
    return
  }

  util.loading(true)

  if (item.id > 0) {
    await Company.update(item)
  } else {
    await Company.insert(item)
  }

  //util.info('등록되었습니다')

  await getItems()

  data.visible = false
  data.single = false
  util.loading(false)
}

async function clickDataSubmit() {
  util.loading(true)

  // let filenames = external.files.map(item => item.response.filename)
  // await Extra.external(external.type, filenames)
  clickCancel()

  util.alert('저장되었습니다')

  util.loading(false)
}
</script>
