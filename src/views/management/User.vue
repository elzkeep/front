<template>
  <Title title="직원 관리" />

  <div style="display:flex;justify-content: space-between;gap:5px;margin-bottom:10px;">    
    <el-select v-model.number="data.search.company" placeholder="업체" style="width:150px;" v-if="data.session.level >= User.level.rootadmin">           
      <el-option
        v-for="item in data.companys"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>

    <el-input v-model="data.search.text" placeholder="검색할 내용을 입력해 주세요" style="width:300px;" @keyup.enter.native="clickSearch" />
    
    <el-button size="small" class="filter-item" type="primary" @click="clickSearch">검색</el-button>
    
    <div style="flex:1;text-align:right;gap:5;">
      <el-button size="small" type="danger" @click="clickDeleteMulti" style="margin-right:-5px;">삭제</el-button>
      <el-button size="small" type="success" @click="clickInsert">등록</el-button>
    </div>
  </div>  

  
  <el-table :data="data.items" border :height="height(170)" @row-click="clickUpdate"  ref="listRef" @selection-change="changeList">
    <el-table-column type="selection" width="40" align="center" />
    <el-table-column label="업체" align="left" width="200" v-if="data.session.level >= User.level.rootadmin">
      <template #default="scope">
        {{getCompany(scope.row.company)}}
      </template>
    </el-table-column>
    <el-table-column prop="loginid" label="로그인아이디" align="left" />
    <el-table-column prop="name" label="이름" align="left" />
    <el-table-column prop="email" label="이메일" align="left" />
    <el-table-column prop="tel" label="연락처" align="left" />
    <el-table-column label="주소" align="left">
      <template #default="scope">
        {{scope.row.address}} {{scope.row.addressetc}}
      </template>      
    </el-table-column>
    <el-table-column label="권한" align="center" width="80">
      <template #default="scope">
        {{getLevel(scope.row.level)}}
      </template>
    </el-table-column>
    <el-table-column prop="date" label="등록일" align="center" width="150" />    
  </el-table>  

  
  <el-dialog
    v-model="data.visible"
    width="800px"
  >

      <y-table>
        <y-tr v-show="data.session.level >= User.level.rootadmin">
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
          <y-th>로그인아이디</y-th>
          <y-td>
            <el-input v-model="data.item.loginid" />
          </y-td>
        </y-tr>
        <y-tr>
          <y-th>비밀번호</y-th>
          <y-td>
            <el-input v-model="data.item.passwd" show-password />
          </y-td>
        </y-tr>
        <y-tr>
          <y-th>비밀번호 확인</y-th>
          <y-td>
            <el-input v-model="data.item.passwd2" show-password />
          </y-td>
        </y-tr>
        <y-tr>
          <y-th>이름</y-th>
          <y-td>
            <el-input v-model="data.item.name" />
          </y-td>
        </y-tr>
        <y-tr>
          <y-th>이메일</y-th>
          <y-td>
            <el-input v-model="data.item.email" />
          </y-td>
        </y-tr>
        <y-tr>
          <y-th>연락처</y-th>
          <y-td>
            <el-input v-model="data.item.tel" />
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
        <y-tr>
          <y-th>입사일</y-th>
          <y-td>            
            <el-date-picker style="margin: 0px 0px;height: 24px;width:150px;" v-model="data.item.joindate" />
          </y-td>
        </y-tr>
        <y-tr>
          <y-th>경력</y-th>
          <y-td>
            <el-input v-model="data.item.careeryear" style="width:50px;" /> 년
            <el-input v-model="data.item.careermonth" style="width:50px;" /> 월
          </y-td>
        </y-tr>
        <y-tr>
          <y-th>권한</y-th>
          <y-td>
            <el-select v-model.number="data.item.level" placeholder="권한" style="width:150px;">           
              <el-option
                v-for="item in data.levels"
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
import { User, Company } from "~/models"
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElTable } from 'element-plus'

const { width, height } = size()

const store = useStore()
const route = useRoute()

const model = User

const item = {
  id: 0,
  loginid: '',
  passwd: '',
  name: '',
  email: '',
  tel: '',
  address: '',
  addressetc: '',
  careeryear: 0,
  careermonth: 0,
  level: 1,
  status: 1,
  company: 0,
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
    text: '',
    company: 0
  },
  companys: [],
  levels: [
    {id: 0, name: ' '},
    {id: 1, name: '일반'},
    {id: 2, name: '팀장'},
    {id: 3, name: '관리자'},
    {id: 4, name: '전체관리자'}
  ]
})

async function clickSearch() {
  await getItems(true)
}

async function initData() {
  let res = await Company.find({
    page: data.page,
    pagesize: data.pagesize,
    orderby: 'c_name'
  })
  
  data.companys = [{id: 0, name: ' '}, ...res.items]

  if (data.session.level < User.level.rootadmin) {
    data.levels =  [
      {id: 0, name: ' '},
      {id: 1, name: '일반'},
      {id: 2, name: '팀장'},
      {id: 3, name: '관리자'}
    ]
  }
}

async function getItems() {
  console.log('getItems')

  if (data.session.company > 0) {
    data.search.company = data.session.company
  }
  
  let res = await model.find({
    name: data.search.text,
    page: data.page,
    pagesize: data.pagesize,
    company: data.search.company,
    orderby: 'u_id desc'
  })

  console.log(res)
  
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
  data.item.company = data.session.company
  data.item.passwd2 = data.item.passwd
  data.visible = true  
}

function clickUpdate(item, index) {
  if (index.no == 0) {
    return
  }
  
  data.item = util.clone(item)
  data.item.company = data.session.company
  data.item.passwd2 = data.item.passwd
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

  if (item.company == 0) {
    util.alert('업체를 선택하세요')
    return
  }

  if (item.loginid == '') {
    util.alert('로그인아이디를 입력하세요')
    return
  }
  
  if (item.passwd == '') {
    util.alert('비밀번호를 입력하세요')
    return
  }

  if (item.passwd2 == '') {
    util.alert('비밀번호를 입력하세요')
    return
  }

  if (item.name == '') {
    util.alert('이름을 입력하세요')
    return
  }

  if (item.email == '') {
    util.alert('이메일을 입력하세요')
    return
  }

  if (item.passwd != item.passwd) {
    util.alert('비밀번호가 정확하지 않습니다')
    return
  }

  util.loading(true)
  
  item.company = util.getInt(item.company)
  item.careeryear = util.getInt(item.careeryear)
  item.careermonth = util.getInt(item.careermonth)
  item.joindate = util.convertDBDate(item.joindate)
  
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

function getLevel(id) {
  let items = data.levels.filter(item => item.id == id)

  if (items.length == 0) {
    return ''
  }

  return items[0].name
}
</script>
