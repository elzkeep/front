<template>
  <Title title="팀 관리" />
  <div style="display: flex">
    <div style="flex-grow: 0; margin-right: 10px; border: 1px solid #ddd">
      <el-input v-model="name" style="width: 240px" placeholder="Filter keyword" />
      <el-tree ref="treeRef" style="max-width: 600px" class="filter-tree" :data="data.items" :props="defaultProps" default-expand-all :filter-node-method="filterNode" @node-click="handleNodeClick" />
    </div>

    <div style="flex-grow: 1">
      <div style="display: flex; justify-content: space-between; gap: 5px; margin-bottom: 10px">
        <!-- <el-input v-model="data.search.text" placeholder="검색할 내용을 입력해 주세요" style="width: 300px" @keyup.enter.native="clickSearch" /> -->
        <!-- <el-button size="small" class="filter-item" type="primary" @click="clickSearch">검색</el-button> -->
        <div style="flex: 1; text-align: right; gap: 5">
          <!-- <el-button size="small" type="info" @click="clickShareUrl" style="margin-right: -5px">가입 URL 공유</el-button> -->
          <el-button size="small" type="success" @click="clickInsert">등록</el-button>
        </div>
      </div>

      <el-table :data="data.users" border :height="height(170)" ref="listRef">
        <el-table-column prop="index" label="번호" align="left" />
        <el-table-column prop="name" label="이름" align="left" />
        <el-table-column label="직책/직급" align="left">
          <template #default="scope">
            {{ User.levels[scope.row.level] }}
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
        <y-th>팀/그룹 명</y-th>
        <y-td>
          <el-input v-model="data.item.name" />
        </y-td>
      </y-tr>
      <!-- <y-tr>
        <y-th>팀/그룹 장</y-th>
        <y-td @click="clickTeamLeader">
          <el-input v-model="data.item.name"/>
        </y-td>
      </y-tr> -->
      <!-- <y-tr>
        <y-th>상위 팀/그룹</y-th>
        <y-td>
          <el-input v-model="data.item.parent" />
        </y-td>
      </y-tr> -->
      <y-tr>
        <y-th>순번</y-th>
        <y-td>
          <el-input v-model="data.item.order" />
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
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import router from '~/router'
import { util, size } from '~/global'
import { User, DepartmentManager, Department, Company } from '~/models'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElTable, ElTree } from 'element-plus'

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
  order: 0,
  parent: 0,
  company: 0,
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
  users: [],
  userTotal: 0,
  userpage: 1,
  userpagesize: 20,
  department: 0,
  status: 0,
  item: util.clone(item),
  visible: false,
  search: {
    text: '',
    company: 0,
  },
  companys: [],
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
  data.department = tree.id
  getUsers()
}

async function initData() {
  let res = await Company.find({
    page: data.page,
    pagesize: data.pagesize,
    orderby: 'c_name',
  })

  data.companys = [{ id: 0, name: ' ' }, ...res.items]
}

async function getItems() {
  const itemMap: { [id: number]: any } = {}

  let res = await model.find({
    name: data.search.text,
    page: data.page,
    pagesize: data.pagesize,
    company: data.search.company,
    orderby: 'de_parent desc',
  })

  if (res.items == null) {
    res.items = []
  }

  let items = []

  for (let i = 0; i < res.items.length; i++) {
    let item = res.items[i]
    item.label = item.name
    item.children = []
    itemMap[item.id] = { item: item }
  }

  for (let i = 0; i < res.items.length; i++) {
    let item = res.items[i]
    if (item.parent == 0) {
      items.push(itemMap[item.id].item)
    } else {
      if (!itemMap[item.parent]) {
        console.error('aaaa')
      } else {
        itemMap[item.parent].item.children.push(itemMap[item.id].item)
      }
    }
  }

  data.total = res.total
  data.items = items

  data.department = 0
}

async function getUsers() {
  let res = await User.find({
    page: data.userpage,
    pagesize: data.userpagesize,
    company: data.search.company,
    department: data.department,
    status: data.status,
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

function clickInsert() {
  data.item = util.clone(item)

  data.visible = true
}

function clickUpdate(item, index) {
  if (index.no == 0) {
    return
  }

  data.item = util.clone(item)

  data.visible = true
}

function clickShareUrl() {}

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

async function clickSubmit() {
  let item = util.clone(data.item)

  // if (data.session.level == User.level.rootadmin) {
  //   if (item.company == 0) {
  //     util.alert('업체를 선택하세요')
  //     return
  //   }
  // } else {
  //   item.company = data.session.company
  // }

  if (item.name == '') {
    util.alert('명칭을 입력하세요')
    return
  }

  if (item.order == '') {
    util.alert('순번을 입력하세요')
    return
  }

  util.loading(true)

  item.company = data.session.company
  item.order = util.getInt(item.order)
  item.parent = data.department

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

function getLevel(id) {
  if (id > 5) {
    return ''
  }

  return User.levels[id]
}
</script>
