<template>
  <Title title="공지사항 관리" />

  <div style="display:flex;justify-content: space-between;gap:5px;margin-bottom:10px;">        
    <el-input v-model="data.search.text" placeholder="검색할 내용을 입력해 주세요" style="width:300px;" @keyup.enter.native="clickSearch" />
    
    <el-button size="small" class="filter-item" type="primary" @click="clickSearch">검색</el-button>
    
    <div style="flex:1;text-align:right;gap:5;">
      <el-button size="small" type="danger" @click="clickDeleteMulti" style="margin-right:-5px;">삭제</el-button>
      <el-button size="small" type="success" @click="clickInsert">등록</el-button>
    </div>
  </div>  

  
  <el-table :data="data.items" border :height="height(170)" @row-click="clickUpdate"  ref="listRef" @selection-change="changeList">
    <el-table-column type="selection" width="40" align="center" />        
    <el-table-column label="구분" width="60" align="center">
      <template #default="scope">
        <span v-if="scope.row.category == 1">공지</span>
        <span v-if="scope.row.category == 2">안내</span>
      </template>
    </el-table-column>
    <el-table-column prop="title" label="제목" align="left" />
    <el-table-column prop="date" label="등록일" align="center" width="150" />    
  </el-table>  

  
  <el-dialog
    v-model="data.visible"
    width="800px"
  >

      <y-table>
        <y-tr>
          <y-th style="width: 80px">구분</y-th>
          <y-td>
            <el-radio-group v-model="data.item.category">
              <el-radio-button size="small" value="1">공지</el-radio-button>
              <el-radio-button size="small" value="2">안내</el-radio-button>
            </el-radio-group>
          </y-td>
        </y-tr>
        <y-tr>
          <y-th>제목</y-th>
          <y-td>
            <el-input v-model="data.item.title" />
          </y-td>
        </y-tr>
        <y-tr>
          <y-th>내용</y-th>
          <y-td>
            <el-input :rows="10" type="textarea" v-model="data.item.content" style="font-size:12px;" />
          </y-td>
        </y-tr>        
        <y-tr>
          <y-th>이미지</y-th>
          <y-td>
            <el-upload
              class="upload"
              ref="upload"
              :action="external.upload"
              :headers="external.headers"
              :show-file-list="true"
              :on-success="handleFileSuccess"
              :auto-upload="true"
              v-model:file-list="external.files"
              :limit="1"
            >
                  <template #trigger>
                    <el-button type="success" style="margin-right: 10px" @click="submitUpload(index)"> 엑셀 등록 </el-button>
                  </template>                  
              </el-upload>
              
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
import { Webnotice } from "~/models"
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElTable } from 'element-plus'

const { width, height } = size()

const store = useStore()
const route = useRoute()

const model = Webnotice

const item = {
  id: 0,  
  title: '',
  content: '',
  image: '',
  category: 1,  
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
    text: ''
  }
})

async function clickSearch() {
  await getItems(true)
}

async function initData() {  
}

async function getItems() {
  let res = await model.find({
    title: data.search.text,
    page: data.page,
    pagesize: data.pagesize,
    orderby: 'wn_id desc'
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

  /*
  upload.value!.clearFiles()
  upload.value!.submit()
  */
  external.files = []
  
  
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
  let item = util.clone(data.item)

  if (item.title == '') {
    util.alert('제목을 입력하세요')
    return
  }

  util.loading(true)

  item.category = util.getInt(item.category)

  console.log(external.files)
  if (external.files.length > 0) {
    item.image = external.files[0].response.filename
  }

  console.log(item)
  
  if (item.id > 0) {
    await model.update(item)
  } else {
    await model.insert(item)
  }

  //util.info('등록되었습니다')
  
  await getItems()

  submitUpload()

  data.visible = false  
  util.loading(false)  
}

const external = reactive({
  headers: {
    Authorization: 'Bearer ' + store.state.token
  },
  type: 1,
  filename: '',
  originalfilename: '',
  upload: `${import.meta.env.VITE_REPORT_URL}/api/upload/index`,
  files: [],
})

const upload = ref([])

const submitUpload = () => {
  console.log('submitUpload')
  upload.value!.clearFiles()
  upload.value!.submit()
  external.files = []
}

const handleFileSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  //imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  external.filename = response.filename
  external.originalfilename = response.originalfilename
  console.log(external)  
}

</script>
