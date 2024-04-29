<template>
  <Title title="건물 및 계약 관리" />

  <div style="display: flex; justify-content: space-between; gap: 5px; margin-bottom: 10px">
    <el-date-picker v-model="data.search.startdate" type="date" size="small" style="width: 120px" />
    ~
    <el-date-picker v-model="data.search.enddate" type="date" size="small" style="width: 120px" />

    <el-select v-model.number="data.search.status" placeholder="상태" size="small" style="margin-left: 5px; width: 100px">
      <el-option v-for="item in data.statuss" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
    <el-select v-model.number="data.search.billingtype" placeholder="청구방법" size="small" style="margin-left: 5px; width: 100px">
      <el-option v-for="item in data.billingtypes" :key="item.id" :label="item.name" :value="item.id" />
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

    <div style="flex: 1; text-align: right; gap: 5">
      <el-button size="small" type="warning" @click="clickBill" style="margin-right: 20px">매출 실행</el-button>
      <el-button size="small" type="danger" @click="clickDeleteMulti" style="margin-right: -5px">삭제</el-button>
      <el-button size="small" type="success" @click="clickInsert">등록</el-button>
    </div>
  </div>

  <div style="margin-top: 10px; margin-bottom: 20px; display: flex; justify-content: space-evenly">
    <div style="float: left; width: 280px; padding-top: 0px; border: 1px solid">
      <p style="float: center; font-weight: 700; font-size: 16px">계약유지 고객수</p>
      <p style="float: center; font-weight: 700; font-size: 25px">{{ data.status.currentuser }}</p>
    </div>
    <div style="float: left; width: 280px; padding-top: 0px; border: 1px solid">
      <p style="float: center; font-weight: 700; font-size: 16px">계약해지 고객수</p>
      <p style="float: center; font-weight: 700; font-size: 25px">{{ data.status.user }}</p>
    </div>
    <div style="float: left; width: 280px; padding-top: 0px; border: 1px solid">
      <p style="float: center; font-weight: 700; font-size: 16px">매출액</p>
      <p style="float: center; font-weight: 700; font-size: 25px">{{ util.money(data.status.money) }}</p>
    </div>
    <div style="float: left; width: 280px; padding-top: 0px; border: 1px solid">
      <p style="float: center; font-weight: 700; font-size: 16px">관리점수 현황</p>
      <p style="float: center; font-weight: 700; font-size: 25px">{{ data.status.score }}</p>
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
    <el-table-column label="계약기간" align="center" width="160">
      <template #default="scope"> {{ scope.row.contractstartdate }} ~ {{ scope.row.contractenddate }} </template>
    </el-table-column>
    <el-table-column label="계약용량" align="right" width="70">
      <template #default="scope">
        {{ scope.row.extra.building.totalweight }}
      </template>
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

    <el-table-column label="청구방법" align="center" width="60">
      <template #default="scope">
        <span v-if="scope.row.billingtype == 1">지로</span>
        <span v-if="scope.row.billingtype == 2">계산서</span>
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

    <el-table-column label="영업자명" align="center" width="60">
      <template #default="scope">
        {{ getUser(scope.row.salesuser).name }}
      </template>
    </el-table-column>

    <el-table-column label="점검자명" align="center" width="60">
      <template #default="scope">
        {{ getUser(scope.row.user).name }}
      </template>
    </el-table-column>

    <el-table-column label="점검자연락처" align="center" width="100">
      <template #default="scope">
        {{ getUser(scope.row.user).tel }}
      </template>
    </el-table-column>

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
        <y-th style="width:100px;">사업자명</y-th>
        <y-td>
          <el-select v-model.number="data.item.company" size="small" placeholder="사업자명" style="width: 250px" @change="changeCompany">
            <el-option v-for="item in data.companys" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>건물명</y-th>
        <y-td>
          <el-select v-model.number="data.item.building" size="small" placeholder="건물명" style="width: 250px" @change="changeBuilding">
            <el-option v-for="item in data.buildings" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>          
          &nbsp;&nbsp;&nbsp;<span v-if="data.building.companyno != ''">사업자번호 : {{data.building.companyno}}</span>
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
			<!--
          <el-select v-model.number="data.item.user" size="small" placeholder="점검 담당자" style="width: 150px">
            <el-option v-for="item in data.users" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
		  -->
          <el-input v-model="data.inspect.name" readonly @click="clickInspector" />
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

  <el-dialog v-model="bill.visible" width="900px">
    <y-table style="margin: 10px 0px">
      <y-tr>
        <y-th style="width:90px;">
          <el-select v-model.number="bill.durationtype" size="small" style="margin-left: 5px; width: 80px">
            <el-option v-for="item in bill.durationtypes" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </y-th>
        <y-td v-if="bill.durationtype == 1">
          <el-select v-model.number="bill.month" placeholder="개월" size="small" style="width: 100px">
            <el-option v-for="item in bill.months" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </y-td>
        <y-th v-if="bill.durationtype == 1">기준월</y-th>
        <y-td v-if="bill.durationtype == 1">
          <el-radio-group v-model.number="bill.base" size="small">
            <el-radio-button value="1">이번달</el-radio-button>
            <el-radio-button value="2">다음달</el-radio-button>
          </el-radio-group>
        </y-td>
        <y-td v-if="bill.durationtype == 2">
          <div style="display: flex; justify-content: space-between; gap: 5px; margin-bottom: 0px">
            <el-select v-model.number="bill.year" placeholder="년도" size="small" style="width: 80px">
              <el-option v-for="item in bill.years" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>

            <el-checkbox-group v-model="bill.durationmonth" size="small">
              <el-checkbox-button v-for="item in bill.durationmonths" :key="item.id" :value="item.id">
              {{item.name}}
              </el-checkbox-button>
            </el-checkbox-group>
            
          </div>
        </y-td>
      </y-tr>
    </y-table>

    <el-table :data="listSelection" border :height="400">
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

    </el-table>

    <template #footer>
      <el-button size="small" @click="bill.visible = false">취소</el-button>
      <el-button size="small" type="primary" @click="clickBillSubmit">매출 실행</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="data.visibleBusiness" width="800px">
    <el-table :data="data.business.items" border @row-click="clickUpdate" ref="listRef" v-infinite="getItems" height="500">
      <el-table-column label="건물명" align="left">
        <template #default="scope">
          {{ scope.row.extra.building.name }}
        </template>
      </el-table-column>
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
    </el-table>

    <template #footer>
      <el-button size="small" @click="data.visibleBusiness = false">취소</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="data.visibleInspector" width="800px">
    <y-table style="margin: 10px 0px">
      <y-tr>
        <y-th>이름</y-th>
        <y-td>
          {{ getUser(data.inspector).name }}
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>소속</y-th>
        <y-td>
          {{ getDepartment(getUser(data.inspector).company) }}
        </y-td>
      </y-tr>
      <y-tr>
        <y-th>연락처</y-th>
        <y-td>
          {{ getUser(data.inspector).tel }}
        </y-td>
      </y-tr>
    </y-table>
    <template #footer>
      <el-button size="small" @click="data.visibleInspector = false">취소</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="data.visibleInspectors" width="800px">
    <div style="display: flex; justify-content: space-between; gap: 5px; margin-bottom: 10px">
      <el-input v-model="data.searchInspector.text" placeholder="검색할 내용을 입력해 주세요" style="width: 300px" @keyup.enter.native="clickInspectorSearch" />
      <el-button size="small" class="filter-item" type="primary" @click="clickSearch">검색</el-button>
    </div>
    <el-table :data="data.inspectors" highlight-current-row border :height="height(170)" ref="listRef" @current-change="changeInspectorList" style="height: 600px" v-infinite="getInspectors">
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
      <el-button size="small" @click="data.visibleInspectors = false">취소</el-button>
      <el-button size="small" type="primary" @click="clickSubmitInspector">등록</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import router from '~/router'
import { util, size } from '~/global'
import { User, Customer, Building, Company, Companylist, Department } from '~/models'
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
      id: null,
    },
    company: {
      id: 0,
    },
  },
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
  visibleBusiness: false,
  visibleInspector: false,
  visibleInspectors: false,
  search: {
    name: '',
    company: 0,
    building: 0,
    billingtype: 0,
    type: 0,
    startdate: '',
    status: 0,
    enddate: '',
  },
  status: {
    currentuser: 0,
    user: 0,
    money: 0,
    score: 0,
  },
  companys: [],
  users: [],
  buildings: [],
  business: {
    items: [],
    total: 0,
  },
  departments: [],
  inspector: 0,
  dummyInspector: util.clone(user),
  inspect: util.clone(user),
  inspectors: [],
  inspectorTotal: 0,
  inspectorpage: 1,
  inspectorpagesize: 20,
  searchInspector: {
    text: '',
  },
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
  billingtypes: [
    { id: 0, name: '청구방법' },
    { id: 1, name: '지로' },
    { id: 2, name: '계산서' },
  ],
  building: {
    companyno: ''
  }
})

async function clickSearch() {
  await getItems(true)
}

function clickInspectorSearch() {
  getInspectors(true)
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

  res = await Extra.customerstatus(company)

  data.status = res

  res = await Department.find({
    company: data.session.company,
  })

  data.departments = [{ id: 0, name: ' ' }, ...res.items]
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
    billingtype: data.search.billingtype,
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

async function getBusiness(salesuser) {
  let res = await model.find({
    company: data.search.company,
    // building: data.search.building,
    salesuser: salesuser,
    orderby: 'cu_id desc',
  })

  data.business.total = res.total
  data.business.items = res.items
}

async function getInspectors(reset) {
  if (reset == true) {
    data.inspectorpage = 1
    data.inspectors = []
  }

  let res = await Extra.usersearch({
    name: data.searchInspector.text,
    page: data.inspectorpage,
    pagesize: data.inspectorpagesize,
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

  data.inspectorTotal = res.total
  data.inspectors = data.inspectors.concat(items)

  data.inspectorpage++
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
    util.loading(true)
    getBusiness(item.salesuser)
    util.loading(false)
    data.visibleBusiness = true
    return
  }

  if (index.no == 10) {
    data.inspector = item.user
    data.visibleInspector = true
    return
  }

  if (index.no == 12) {
    return
  }

  let res = await Building.find({
    company: item.company.id,
    orderby: 'b_name',
  })

  data.buildings = [{ id: 0, name: ' ' }, ...res.items]

  item.company = item.extra.company.id
  item.building = item.extra.building.id

  changeBuilding(item.building)
  
  data.item = util.clone(item)
  
  res = await User.get(item.user)
  data.inspect = res.item

  data.single = true
}

function clickInspector() {
  getInspectors(true)
  data.visibleInspectors = true
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

const changeInspectorList = val => {
  data.dummyInspector = val
  clickSubmitInspector()
}

function clickSubmitInspector() {
  if (data.dummyInspector == null) {
    return
  }
  data.inspect = data.dummyInspector
  data.visibleInspectors = false
  data.dummyInspector = util.clone(user)
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
    await getItems(true)

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

  // item.user = util.getInt(item.user)
  item.user = data.inspect.id
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

  //clickCancle()
  data.single = false
  data.visible = false
  util.loading(false)
}

const handleFileSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  //imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  external.filename = response.filename
  external.originalfilename = response.originalfilename
}

function getCompany(id) {
  let items = data.companys.filter(item => item.id == id)

  if (items.length == 0) {
    return {
      id: 0,
      name: '',
      companyno: ''
    }
  }

  return items[0]
}

function getDepartment(id) {
  let items = data.departments.filter(item => item.id == id)

  if (items.length == 0) {
    return ''
  }

  return items[0].name
}

function getBuilding(id) {
  let items = data.buildings.filter(item => item.id == id)

  if (items.length == 0) {
    return {
      id: 0,
      name: '',
      companyno: ''
    }
  }

  return items[0]
}

function getUser(id) {
  let items = data.users.filter(item => item.id == id)

  if (items.length == 0) {
    return {
      name: '',
      tel: '',
      email: '',
      company: 0,
      department: 0,
    }
  }

  return items[0]
}

function getLevel(id) {
  if (id > 5) {
    return ''
  }

  return User.levels[id]
}

function clickFacility(item) {
  router.push(`/management/facility/${item.extra.building.id}`)
  //data.visibleFacility = true
}

async function changeCompany(item) {
  let res = await Building.find({
    company: item,
    orderby: 'b_name',
  })

  data.buildings = [{ id: 0, name: ' ' }, ...res.items]
  data.building = {companyno: ''}
}

function changeBuilding(id) {  
  let building = getBuilding(id)
  if (building.companyno == '') {
    let company = getCompany(building.company)

    building.companyno = company.companyno
  }
  
  data.building = building
}

async function clickDataSubmit() {
  util.loading(true)
  let filename = external.files[0].response.filename
  await Extra.customer(filename)
  clickCancel()
  util.alert('저장되었습니다')
  util.loading(false)
}

const bill = reactive({
  visible: false,
  month: 1,
  durationmonth: [],
  months: [
    { id: 1, name: '1개월' },
    { id: 2, name: '2개월' },
    { id: 3, name: '3개월' },
    { id: 4, name: '4개월' },
    { id: 5, name: '5개월' },
    { id: 6, name: '6개월' },
    { id: 7, name: '7개월' },
    { id: 8, name: '8개월' },
    { id: 9, name: '9개월' },
    { id: 10, name: '10개월' },
    { id: 11, name: '11개월' },
    { id: 12, name: '12개월' },
  ],
  durationmonths: [
    { id: 1, name: '1월' },
    { id: 2, name: '2월' },
    { id: 3, name: '3월' },
    { id: 4, name: '4월' },
    { id: 5, name: '5월' },
    { id: 6, name: '6월' },
    { id: 7, name: '7월' },
    { id: 8, name: '8월' },
    { id: 9, name: '9월' },
    { id: 10, name: '10월' },
    { id: 11, name: '11월' },
    { id: 12, name: '12월' },
  ],
  base: 1,
  year: 2024,
  years: [    
    { id: 2024, name: '2024' },
  ],
  durationtypes: [
    { id: 1, name: '기간별' },
    { id: 2, name: '지정월' },
  ],
  durationtype: 1  
})

function clickBill() {
  if (listSelection.value.length == 0) {
    util.alert('매출 실행 대상을 선택하세요')
    return
  }
  
  bill.durationtype = 1
  bill.base = 1
  bill.month = 1
  bill.year = 2024
  bill.durationmonth = []
  
  bill.visible = true
}

async function clickBillSubmit() {
  if (listSelection.value.length == 0) {
    return
  }
  util.confirm('매출 실행 하시겠습니까', async function () {
    util.loading(true)

    let ids = []
    for (let i = 0; i < listSelection.value.length; i++) {
      let value = listSelection.value[i]

      ids.push(value.extra.building.id)
    }

    await Extra.makebill(bill.durationtype, bill.base, bill.year, bill.month, util.makeArray(bill.durationmonth), ids)

    util.alert('매출 실행되었습니다')

    util.loading(false)
    bill.visible = false
  })
}

function clickDownloadExcelExample() {
  let url = '/api/download/customerexample'
  let filename = `건물 및 계약.xlsx`
  util.download(store, url, filename)
}

function getCompanyInfo(item) {
  if (item.id == 0) {
    return ''
  }
  
  return `${item.name} (${item.companyno})`
}
</script>
