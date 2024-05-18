<template>
  <Title title="팀 관리" />
  <div style="display: flex; width: 100%; height: 100%">
    <div style="flex-grow: 0; margin-right: 10px; border: 1px solid #ddd; width: 300px">
      <el-tree
        ref="treeRef"
        style="max-width: 600px"
        class="filter-tree"
        :data="data.items"
        :props="defaultProps"
        default-expand-all
        :filter-node-method="filterNode"
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
      />
    </div>

    <div style="flex-grow: 1">
      <el-descriptions class="margin-top" :column="3" border>
        <el-descriptions-item>
          <template #label>
            <div style="text-align: center">팀/그룹 명</div>
          </template>
          <div style="display: flex; justify-content: space-between">
            <el-input v-model="name" style="width: 300px" placeholder="검색할 팀/그룹 명을 입력해 주세요" />
            <div style="flex: 1; display: flex; align-items: center; justify-content: right">
              <el-button size="small" type="info" @click="clickShareUrl">가입 URL 공유</el-button>
              <el-button size="small" type="success" @click="clickInsert">등록</el-button>
              <el-button size="small" type="success" @click="clickUpdate">수정</el-button>
            </div>
          </div>
        </el-descriptions-item>
      </el-descriptions>

      <el-table :data="data.users" border style="width: 1150px" :height="height(235)" ref="listRef">
        <el-table-column prop="index" label="번호" width="100" align="center" />
        <el-table-column prop="name" label="이름" align="left" />
        <el-table-column label="직책/직급" align="left">
          <template #default="scope">
            {{ User.levels[scope.row.level] }}
          </template>
        </el-table-column>
        <el-table-column label="팀" align="left" width="100">
          <template #default="scope">
            {{ getDepartment(scope.row.department) }}
          </template>
        </el-table-column>
        <el-table-column prop="email" label="이메일" align="center" width="150" />
        <el-table-column prop="tel" label="연락처" align="center" width="150" />
      </el-table>
    </div>
  </div>

  <el-dialog v-model="data.visible" width="800px">
    <y-table>
      <y-tr>
        <y-th>상태</y-th>
        <y-td>
          <el-radio-group v-model="data.item.status">
            <el-radio :label="1">사용</el-radio>
            <el-radio :label="2">미사용</el-radio>
          </el-radio-group>
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>팀/그룹 명</y-th>
        <y-td>
          <el-input v-model="data.item.name" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>팀/그룹 장</y-th>
        <y-td>
          <el-input v-model="data.master.name" readonly @click="clickMaster" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>상위 팀/그룹</y-th>
        <y-td>
          <el-select v-model.number="data.item.parent" placeholder="팀" style="width: 150px">
            <el-option v-for="item in data.departments" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>순번</y-th>
        <y-td>
          <el-input v-model="data.item.order" />
        </y-td>
      </y-tr>
    </y-table>

    <template #footer>
      <el-button size="small" type="danger" @click="clickRemove">삭제</el-button>
      <el-button size="small" @click="clickCancel">취소</el-button>
      <el-button size="small" type="primary" @click="clickSubmit">등록</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="data.visibleMaster" width="800px">
    <div style="display: flex; justify-content: space-between; gap: 5px; margin-bottom: 10px">
      <el-input v-model="data.searchMaster.text" placeholder="검색할 내용을 입력해 주세요" style="width: 300px" @keyup.enter.native="clickSearch" />
      <el-button size="small" class="filter-item" type="primary" @click="clickSearch">검색</el-button>
    </div>
    <el-table :data="data.masters" highlight-current-row border :height="height(170)" ref="listRef" @current-change="changeMasterList" style="height: 600px" v-infinite="getMasters">
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

  <el-dialog v-model="data.visibleView" width="600px">
    <el-card shadow="never">
      <p class="text item">URL: {{ data.sns.url }}</p>
    </el-card>
    <div style="margin: 10px">
      <el-button @click="clickCopyUrl"> URL 복사 </el-button>
    </div>
    <y-table>
      <y-tr>
        <y-th>휴대폰번호</y-th>
        <y-td>
          <el-input type="tel" v-model="data.sns.to" maxlength="11" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>발송내용</y-th>
        <y-td>
          <el-input v-model="data.sns.message" :rows="4" type="textarea" />
        </y-td>
      </y-tr>
    </y-table>
    <template #footer>
      <el-button size="small" @click="clickCancel">취소</el-button>
      <el-button size="small" type="primary" @click="clickSNS">등록</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import router from '~/router'
import { util, size } from '~/global'
import { User, DepartmentManager, Department, Company } from '~/models'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElTable, ElTree } from 'element-plus'
import Sns from '~/models/sns'
import Extra from '~/models/extra'

interface Tree {
  [key: string]: any
}

const { width, height } = size()

const store = useStore()
const route = useRoute()

const model = Department

const item = {
  id: 0,
  name: '',
  master: 0,
  status: 1,
  order: 0,
  parent: 0,
  company: 0,
  date: '',
}

const user = {
  id: 0,
  loginid: '',
  passwd: '',
  name: '',
  email: '',
  tel: '',
  address: '',
  addressetc: '',
  joindate: '',
  careeryear: 0,
  careermonth: 0,
  level: 1,
  approval: 1,
  rejectreason: '',
  status: 1,
  company: 0,
  department: 0,
  date: '',
}

const sns = {
  to: '',
  message: `지킴E 가입 URL\n팀명: \nURL: https://app.zkeep.space/#/join/user`,
  url: 'https://app.zkeep.space/#/join/user',
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
  users: [],
  userTotal: 0,
  userpage: 1,
  userpagesize: 20,
  master: util.clone(user),
  dummyMaster: util.clone(user),
  masters: [],
  masterTotal: 0,
  masterpage: 1,
  masterpagesize: 20,
  departmentItem: util.clone(item),
  departments: [],
  item: util.clone(item),
  visible: false,
  visibleMaster: false,
  visibleView: false,
  search: {
    text: '',
    company: 0,
  },
  searchMaster: {
    text: '',
  },
  sns: util.clone(sns),
  companys: [],
  company: {},
})

const name = ref('')

const treeRef = ref<InstanceType<typeof ElTree>>()

const defaultProps = {
  children: 'children',
  label: 'label',
}

watch(name, val => {
  treeRef.value!.filter(val)
})

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.label.includes(value)
}

const handleNodeClick = (tree: Tree) => {
  data.departmentItem = tree
  data.sns.url = `https://app.zkeep.space/#/join/user?company=${data.departmentItem.company}&department=${data.departmentItem.id}`
  data.sns.message = `지킴E 가입 URL\n팀명: ${data.departmentItem.name}\nURL: ${data.sns.url}`
  if (data.departmentItem.id == 0) {
    return
  }
  getUsers()
}

async function initData() {
  let res = await Company.get(data.session.company)
  data.company = res.item
}

async function getItems() {
  const itemMap: { [id: number]: any } = {}

  let res = await model.find({
    name: data.search.text,
    page: data.page,
    pagesize: data.pagesize,
    company: data.session.company,
    orderby: 'de_parent desc, de_order, de_name',
  })

  if (res.items == null) {
    res.items = []
  }

  let items = []
  let notApprovedItems = []

  for (let i = 0; i < res.items.length; i++) {
    let item = res.items[i]
    item.label = item.name
    item.children = []
    itemMap[item.id] = { item: item }
  }

  for (let i = 0; i < res.items.length; i++) {
    let item = res.items[i]
    if (item.status == 1) {
      if (item.parent == 0) {
        items.push(itemMap[item.id].item)
      } else {
        if (!itemMap[item.parent]) {
          console.error('aaaa')
        } else {
          itemMap[item.parent].item.children.push(itemMap[item.id].item)
        }
      }
    } else {
      notApprovedItems.push(itemMap[item.id].item)
    }
  }

  let item = { label: '', children: [] }
  item.id = 0
  item.company = data.company.id
  item.name = data.company.name
  item.label = data.company.name
  item.children = items

  let notApprovedItem = { label: '미승인', children: [] }
  notApprovedItem.id = 1
  notApprovedItem.children = notApprovedItems

  data.total = res.total
  data.items = [item, notApprovedItem]

  let reverseItem = res.items.reverse()
  data.departments = [{ id: 0, name: data.company.name }, ...reverseItem]

  data.departmentItem = util.clone(item)
}

async function getUsers() {
  let res = await User.find({
    page: data.userpage,
    pagesize: data.userpagesize,
    company: data.session.company,
    department: data.departmentItem.id,
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

  data.userTotal = res.total
  data.users = items
}

async function getMasters(reset) {
  if (reset == true) {
    data.masterpage = 1
    data.masters = []
  }

  let res = await Extra.usersearch({
    name: data.searchMaster.text,
    page: data.masterpage,
    pagesize: data.masterpagesize,
    company: data.session.company,
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

  data.masterTotal = res.total
  data.masters = data.masters.concat(items)

  data.masterpage++
}

function clickInsert() {
  data.item = util.clone(item)
  data.master = util.clone(user)
  data.item.parent = data.departmentItem.id
  data.visible = true
}

async function clickUpdate() {
  if (data.departmentItem.id == 0) {
    return
  }
  data.item = data.departmentItem
  if (data.item.master == 0) {
    data.master = util.clone(user)
  } else {
    util.loading(true)
    let res = await User.get(data.item.master)
    data.master = res.item
    util.loading(false)
  }
  data.visible = true
}

function clickMaster() {
  getMasters(true)
  data.visibleMaster = true
}

function clickShareUrl() {
  data.visibleView = true
}

onMounted(async () => {
  data.session = store.getters['getUser']

  util.loading(true)

  await initData()
  await getItems()

  data.visible = false
  util.loading(false)
})

function clickSearch() {
  getMasters(true)
}

function clickCancel() {
  data.visible = false
  data.visibleView = false
  data.master = util.clone(user)
}

function clickCancelMaster() {
  data.visibleMaster = false
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

const changeMasterList = val => {
  data.dummyMaster = val
  clickSubmitMaster()
}

async function clickSubmit() {
  let item = util.clone(data.item)
  let tree = data.departmentItem

  if (item.name == '') {
    util.alert('명칭을 입력하세요')
    return
  }

  if (data.master.id == 0) {
    //util.alert('팀/그룹 장을 선택하세요')
    //return
  }

  if (item.order == '') {
    util.alert('순번을 입력하세요')
    return
  }

  util.loading(true)

  item.company = data.session.company
  item.master = data.master.id
  item.order = util.getInt(item.order)

  if (item.id > 0) {
    await model.update(item)
    if (item.master != 0) {
      data.master.department = item.id
      await User.update(data.master)
    }
  } else {
    let res = await model.insert(item)
    if (item.master != 0) {
      data.master.department = res.id
      await User.update(data.master)
    }
  }

  //util.info('등록되었습니다')

  await getItems()

  data.visible = false
  data.departmentItem = tree
  getUsers()
  util.loading(false)
  data.master = util.clone(user)
}

async function clickRemove() {
  util.loading(true)
  let res = await User.find({ department: data.item.id })
  util.loading(false)
  if (res.total > 0) {
    util.alert('팀원을 이동시킨후 삭제해 주세요.')
  } else {
    util.loading(true)
    await model.remove(data.item.id)
    await getItems()
    data.visible = false
    util.loading(false)
  }
}

function clickSubmitMaster() {
  if (data.dummyMaster == null) {
    return
  }
  data.master = data.dummyMaster
  data.visibleMaster = false
  data.dummyMaster = util.clone(user)
}

function clickCopyUrl() {
  var textarea = document.createElement('textarea')

  document.body.appendChild(textarea)
  textarea.value = data.sns.url
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)

  util.alert('URL이 복사되었습니다.')
}

async function clickSNS() {
  let result = /^(01[016789]{1})-[0-9]{3,4}-[0-9]{4}$/
  let phoneNum = data.sns.to.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
  if (!result.test(phoneNum)) {
    util.alert('휴대폰 번호를 정확하게 입력하세요.')
    return
  }
  util.loading(true)
  await Sns.sms(data.sns)
  data.visibleView = false
  data.sns = util.clone(sns)
  util.loading(false)
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
