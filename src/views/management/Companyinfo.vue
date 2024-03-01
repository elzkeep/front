<template>
  <Title title="기본 정보 관리" />


      <y-table>
        <y-tr>
          <y-th style="width:100px;">구분</y-th>
          <y-td>
            <span v-if="data.item.type==1">점검회사</span>
            <span v-if="data.item.type==2">건물</span>
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

      <div style="margin-top:10px;text-align:left;">
        <el-button size="small" type="primary" @click="clickSubmit">저장</el-button>
      </div>


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
  let res = await model.get(data.session.company)
  data.item = res.item
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
  util.loading(true)

  let item = util.clone(data.item)

  item.type = util.getInt(item.type)

  await model.update(item)

  util.alert('저장되었습니다')

  await getItems()

  util.loading(false)
}

</script>
