<template>
  <Title title="업체 관리" />

  <div style="display:flex;justify-content: space-between;gap:5px;margin-bottom:10px;">
        
    <el-select v-model.number="data.search.type" placeholder="분류" style="width:150px;">           
      <el-option
        v-for="item in data.types"
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
    <el-table-column label="구분" align="center" width="100">
      <template #default="scope">
        <span v-if="scope.row.type==1">점검회사</span>
        <span v-if="scope.row.type==2">건물</span>
      </template>
    </el-table-column>    
    <el-table-column prop="name" label="명칭" align="left" />
    <el-table-column prop="remark" label="대표" align="left" width="100" />
    <el-table-column prop="remark" label="주소" align="left">
      <template #default="scope">
        {{scope.row.address}} {{scope.row.addressetc}}
      </template>      
    </el-table-column>
    <el-table-column prop="date" label="등록일" align="center" width="150" />
  </el-table>  

  
  <el-dialog
    v-model="data.visible"
    width="800px"
  >

      <y-table>
        <y-tr>
          <y-th>구분</y-th>
          <y-td>
            <el-radio-group v-model.number="data.item.type">
              <el-radio-button size="small" label="1">점검회사</el-radio-button>
              <el-radio-button size="small" label="2">건물</el-radio-button>
            </el-radio-group>
          </y-td>
        </y-tr>
        <y-tr>
          <y-th>명칭</y-th>
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
        <el-button size="small" type="primary" @click="clickSubmit">등록</el-button>
      </template>
  </el-dialog>

</template>


<script setup lang="ts">

import { ref, reactive, onMounted, onUnmounted } from "vue"
import router from '~/router'
import { util, size }  from "~/global"
import { Company } from "~/models"
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElTable } from 'element-plus'

const { width, height } = size()

const store = useStore()
const route = useRoute()

const model = Company

const item = {
  id: 0,
  name: '',
  companyno: '',
  ceo: '',
  address: '',
  addressetc: '',
  type: 1,
  date: ''
}

const data = reactive({
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
    type: 0
  },
  types: [
    {id: 0, name: ' '},
    {id: 1, name: '점검회사'},
    {id: 2, name: '건물'}        
  ]
})

async function clickSearch() {
  await getItems(true)
}

async function initData() {  
}

async function getItems() {
  let res = await model.find({
    name: data.search.text,
    page: data.page,
    pagesize: data.pagesize,
    type: data.search.type,
    orderby: 'c_id desc'
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
  if (index.no == 0) {
    return
  }

  data.item = util.clone(item)
  data.visible = true  
}

onMounted(async () => {
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
  util.loading(true)

  let item = util.clone(data.item)
  
  item.type = util.getInt(item.type)
  
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

</script>
