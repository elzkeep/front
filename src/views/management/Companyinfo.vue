<template>
  <el-tabs v-model="data.menu" @tab-click="clickTab">
    <el-tab-pane label="기본 정보" name="basic">
      <div :style="{'height': data.height, 'overflow': 'auto'}">


        <y-table style="width: 100%">
    <y-tr>
      <y-th style="width:120px;">구분</y-th>
      <y-td>
        <span v-if="data.item.type == 1">점검회사</span>
        <span v-if="data.item.type == 2">건물</span>
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
        <el-input v-model="data.item.companyno" placeholder="000-00-00000" />
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

  <div style="margin-top: 10px; display: flex; justify-content: space-between">
    <el-button size="small" type="primary" @click="clickSubmit">저장</el-button>    
  </div>

  
      </div>
    </el-tab-pane>
    <el-tab-pane label="계좌/지로 정보" name="giro">
      <div :style="{'height': data.height, 'overflow': 'auto'}">

        <y-table style="width: 100%">
    <y-tr>
      <y-th style="width:120px;">은행명</y-th>
      <y-td>
        <el-input v-model="data.item.bankname" />
      </y-td>
    </y-tr>
    <y-tr>
      <y-th>계좌번호</y-th>
      <y-td>
        <el-input v-model="data.item.bankno" />
      </y-td>
    </y-tr>
    <y-tr>
      <y-th>지로번호</y-th>
      <y-td>
        <el-input v-model="data.item.giro" />
      </y-td>
    </y-tr>
    <y-tr>
      <y-th>e지로 아이디</y-th>
      <y-td>
        <el-input v-model="data.item.egirologinid" />
      </y-td>
    </y-tr>
    <y-tr>
      <y-th>e지로 비밀번호</y-th>
      <y-td>
        <el-input v-model="data.item.egiropasswd" />
      </y-td>
    </y-tr>
        </y-table>

  <div style="margin-top: 10px; display: flex; justify-content: space-between">
    <el-button size="small" type="primary" @click="clickSubmit">저장</el-button>    
  </div>

  
      </div>
    </el-tab-pane>
    <el-tab-pane label="일괄 데이터 등록" name="external">
      <div :style="{'height': data.height, 'overflow': 'auto'}">


        <div style="margin-top: 10px; display: flex; justify-content: space-between">
          <div style="display: flex; gap: 5px">
            <el-button size="small" type="primary" @click="clickMultiView">지킴e 일괄 데이터 등록</el-button>
            
            
            <el-button size="small" type="success" @click="clickData">외부 데이터 연동</el-button>
            <el-upload
              :action="external.upload"
              :headers="headers"
              :show-file-list="false"
              :on-success="handleFileSuccessUser"
              :auto-upload="true"
              :accept="'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"
            >
              <!--<el-button size="small" type="success">외부 데이터 회원 연동</el-button>-->
            </el-upload>
          </div>
        </div>

        
      </div>
    </el-tab-pane>
  </el-tabs>
  

  <el-dialog v-model="data.visible" width="800px">
    <y-table>
      <y-tr v-if="data.session.level == User.level.rootadmin">
        <y-th>업체</y-th>
        <y-td>
          <el-select v-model.number="data.item.company" placeholder="업체" style="width: 150px" @change="changeCompany">
            <el-option v-for="item in data.companys" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>팀</y-th>
        <y-td>
          <el-select v-model.number="data.item.department" placeholder="팀" style="width: 150px">
            <el-option v-for="item in data.departments" :key="item.id" :label="item.name" :value="item.id" />
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
          <el-date-picker style="margin: 0px 0px; height: 24px; width: 150px" v-model="data.item.joindate" />
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>경력</y-th>
        <y-td> <el-input v-model="data.item.careeryear" style="width: 50px" /> 년 <el-input v-model="data.item.careermonth" style="width: 50px" /> 월 </y-td>
      </y-tr>
      <y-tr>
        <y-th>권한</y-th>
        <y-td>
          <el-select v-model.number="data.item.level" placeholder="권한" style="width: 150px">
            <el-option v-for="item in data.levels" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>상태</y-th>
        <y-td>
          <el-radio-group v-model.number="data.item.status">
            <el-radio-button size="small" value="1">사용</el-radio-button>
            <el-radio-button size="small" value="2">사용중지</el-radio-button>
          </el-radio-group>
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>점수</y-th>
        <y-td>
          <el-input v-model="data.item.score" />
        </y-td>
      </y-tr>
    </y-table>

    <template #footer>
      <el-button size="small" @click="clickCancel">취소</el-button>
      <el-button size="small" type="primary" @click="clickSubmit">등록</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="external.visible" width="800px">
    <y-table>
      <y-tr>
        <y-th>구분</y-th>
        <y-td>
          <el-radio-group v-model.number="external.type">
            <el-radio-button size="small" value="1">계약업체</el-radio-button>
            <el-radio-button size="small" value="2">해지업체</el-radio-button>
          </el-radio-group>
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>파일</y-th>
        <y-td>
          <el-upload
            class="file-uploader"
            :action="external.upload"
            :headers="headers"
            :show-file-list="true"
            :on-success="handleFileSuccess"
            :auto-upload="true"
            :accept="'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"
            v-model:file-list="external.files"
          >
            <el-icon v-if="external.filename" class="file-uploader-icon"><Document /></el-icon>
            <el-icon v-else class="file-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </y-td>
      </y-tr>
    </y-table>

    <template #footer>
      <el-button size="small" @click="clickDataCancel">취소</el-button>
      <el-button size="small" type="primary" @click="clickDataSubmit">등록</el-button>
    </template>
  </el-dialog>

<el-dialog v-model="data.visibleMulti" width="500px">
    <y-table>
      <y-tr>
        <y-th style="width:140px;">고객현황 + 소속회원</y-th>
        <y-td>
          
              <div style="margin-top:10px;flex: 1; justify-content:center; gap: 5; text-align:center;">
                <el-upload
                  class="upload"
                  :action="external.upload"
                  :headers="headers"
                  :show-file-list="false"
                  :on-success="handleFileSuccessTotal0"
                  :auto-upload="true"
                  :accept="'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"
                  v-model:file-list="external.files"
                  :limit="1"
                >
                  <template #trigger>
                    <el-button type="success" style="margin-right: 10px">엑셀 등록</el-button>
                  </template>
                  <el-button type="primary" @click="clickDownloadExcel(0)">데이터 다운로드</el-button>

                  <el-button type="warning" @click="clickDownloadExcel(3)">빈양식 다운로드</el-button>
                </el-upload>
              </div>
          
        </y-td>
      </y-tr>
      <y-tr>
        <y-th style="width:140px;">고객현황</y-th>
        <y-td>
          
              <div style="margin-top:10px;flex: 1; justify-content:center; gap: 5; text-align:center;">
                <el-upload
                  class="upload"
                  :action="external.upload"
                  :headers="headers"
                  :show-file-list="false"
                  :on-success="handleFileSuccessTotal1"
                  :auto-upload="true"
                  :accept="'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"
                  v-model:file-list="external.files"
                  :limit="1"
                >
                  <template #trigger>
                    <el-button type="success" style="margin-right: 10px">엑셀 등록</el-button>
                  </template>
                  <el-button type="primary" @click="clickDownloadExcel(1)">데이터 다운로드</el-button>

                  <el-button type="warning" @click="clickDownloadExcel(4)">빈양식 다운로드</el-button>
                </el-upload>
              </div>
              
        </y-td>
      </y-tr>
      <y-tr>
        <y-th style="width:140px;">소속회원</y-th>
        <y-td>
          
              <div style="margin-top:10px;flex: 1; justify-content:center; gap: 5; text-align:center;">
                <el-upload
                  class="upload"
                  :action="external.upload"
                  :headers="headers"
                  :show-file-list="false"
                  :on-success="handleFileSuccessTotal2"
                  :auto-upload="true"
                  :accept="'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"
                  v-model:file-list="external.files"
                  :limit="1"
                >
                  <template #trigger>
                    <el-button type="success" style="margin-right: 10px">엑셀 등록</el-button>
                  </template>
                  <el-button type="primary" @click="clickDownloadExcel(2)">데이터 다운로드</el-button>

                  <el-button type="warning" @click="clickDownloadExcel(5)">빈양식 다운로드</el-button>
                </el-upload>
              </div>
              
        </y-td>
      </y-tr>
    </y-table>
    <template #footer>
      <el-button size="small" @click="data.visibleMulti = false">닫기</el-button>
      <!--<el-button size="small" type="primary" @click="clickMultiSubmit">등록</el-button>-->
    </template>
</el-dialog>  
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import router from '~/router'
import { util, size } from '~/global'
import { Company } from '~/models'
import Extra from '~/models/extra'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { ElTable } from 'element-plus'
import type { UploadProps } from 'element-plus'
import moment from 'moment'

const { width, height } = size()

const store = useStore()
const route = useRoute()

const headers = {
  Authorization: 'Bearer ' + store.state.token,
}

const model = Company

const item = {
  id: 0,
  name: '',
  companyno: '',
  ceo: '',
  address: '',
  addressetc: '',
  type: 1,
  egirologinid: '',
  erigopasswd: '',
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
  pagesize: 0,
  item: util.clone(item),
  visible: false,
  visibleMulti: false,
  search: {
    text: '',
    type: 0,
  },
  types: [
    { id: 0, name: ' ' },
    { id: 1, name: '점검회사' },
    { id: 2, name: '건물' },
  ],
  menu: 'basic'
})

async function clickSearch() {
  await getItems(true)
}

async function initData() {}

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
  
  if (/^[0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9][0-9][0-9][0-9]$/.test(item.companyno) == false) {
    alert('사업자번호 양식이 맞지 않습니다')
    return    
  }

  util.loading(true)
  
  item.type = util.getInt(item.type)

  await model.update(item)

  util.alert('저장되었습니다')

  await getItems()

  util.loading(false)
}

function clickData() {
  external.filename = ''
  external.originalfilename = ''
  external.visible = true
}

const handleFileSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  //imageUrl.value = URL.createObjectURL(uploadFile.raw!)

  console.log(response)
  console.log(response.filename)
  console.log(response.originalfilename)
  external.filename = response.filename
  external.originalfilename = response.originalfilename
}

const beforeFileUpload: UploadProps['beforeUpload'] = rawFile => {
  return true
  /*
     if (rawFile.type !== "image/jpeg") {
     return false;
     } else if (rawFile.size / 1024 / 1024 > 2) {
     return false;
     }
     return true;
   */
}

function clickDataCancel() {
  external.visible = false
}

async function clickDataSubmit() {
  util.loading(true)

  let filenames = external.files.map(item => item.response.filename)
  await Extra.external(external.type, filenames)
  external.visible = false

  util.alert('저장되었습니다')

  external.files = []

  util.loading(false)
}

const handleFileSuccessUser: UploadProps['onSuccess'] = async (response, uploadFile) => {
  //imageUrl.value = URL.createObjectURL(uploadFile.raw!)

  util.loading(true)
  await Extra.externaluser(response.filename)
  util.alert('저장되었습니다')

  util.loading(false)
}

const handleFileSuccessTotal0: UploadProps['onSuccess'] = async (response, uploadFile) => {
  uploadProcess(0, response)
}

const handleFileSuccessTotal1: UploadProps['onSuccess'] = async (response, uploadFile) => {
  uploadProcess(1, response)
}

const handleFileSuccessTotal2: UploadProps['onSuccess'] = async (response, uploadFile) => {
  uploadProcess(2, response)
}

async function uploadProcess(category, response) {
  external.filename = response.filename
  external.originalfilename = response.originalfilename
    
  if (response.filename == '') {
    external.filename = ''
    external.originalfilename = ''
    external.files = []
    return
  }
  
  util.loading(true)
  await Extra.externalall(category, external.filename)
  //util.alert('저장되었습니다')

  util.loading(false)
  data.visibleMulti = false

  setTimeout(function() {
    util.alert('저장되었습니다')
  }, 100)
  
  external.filename = ''
  external.originalfilename = ''
  external.files = []
}

async function clickDownloadExcel(type) {  
  let url = `/api/download/all/${type}`
  let types = ['일괄데이터', '고객현황', '소속회원', '일괄데이터', '고객현황', '소속회원']
  let filename = `${types[type]}-${moment().format('YYYY-MM-DD')}.xlsx`
  util.download(store, url, filename)
}

async function clickMultiSubmit() {
  util.loading(true)
  await Extra.externalall(external.filename)
  util.alert('저장되었습니다')

  util.loading(false)
}

function clickMultiView() {
  external.filename = ''
  external.originalfilename = ''
  external.files = []
  
  data.visibleMulti = true
}

function clickTab(pos) {
  console.log(pos.props.name)
}
</script>
