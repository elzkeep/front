<template>
  <el-row style="margin: -10px 20px 20px 20px">
    <el-col :span="9">
      <PageTitle title="공지사항" />

      <el-table :data="data.notices" border :height="145" @row-click="clickUpdateNotice">
        <el-table-column prop="id" label="NO" align="center" width="60" />
        <el-table-column prop="title" label="제목" />
        <el-table-column prop="date" label="등록일" width="130" align="center" />
      </el-table>
    </el-col>
    <el-col :span="15">
      <div style="margin-left: 20px">
        <PageTitle title="전체 현황" />
        <y-table>
          <y-tr>
            <y-th>
              <div>계약 고객수</div>
              <div class="info">
                <span class="cnt">{{ info.newcustomers }}</span> <span class="sep">/</span> {{ info.customers }}
              </div>
            </y-th>
            <y-th>
              <div>계약 금액</div>
              <div class="info">
                <span class="cnt">{{ util.money(info.avgprice) }}</span> <span class="sep">/</span> {{ util.money(info.totalprice) }}
              </div>
            </y-th>
            <y-th>
              <div>전체 직원수</div>
              <div class="info">{{ info.users }}</div>
            </y-th>
          </y-tr>
          <y-tr>
            <y-th>
              <div>오늘<span style="font-size: 8px">의 점검 건수</span></div>
              <div class="info">
                <span class="cnt">{{ info.today }}</span> <span class="sep">/</span> {{ info.todaytotal }}
              </div>
            </y-th>
            <y-th>
              <div>금주<span style="font-size: 8px">의 점검 건수</span></div>
              <div class="info">
                <span class="cnt">{{ info.week }}</span> <span class="sep">/</span> {{ info.weektotal }}
              </div>
            </y-th>
            <y-th>
              <div>이달<span style="font-size: 8px">의 점검 건수</span></div>
              <div class="info">
                <span class="cnt">{{ info.month }}</span> <span class="sep">/</span> {{ info.monthtotal }}
              </div>
            </y-th>
          </y-tr>
        </y-table>
      </div>
    </el-col>
  </el-row>

  <el-calendar ref="calendar" v-model="data.date">
    <template #header="{ date }">
      <span style="font-size: 16px; font-weight: bold">{{ date }}</span>
      <el-button-group>
        <el-button size="small" @click="selectDate('prev-year')"> 지난해 </el-button>
        <el-button size="small" @click="selectDate('prev-month')"> 지난달 </el-button>
        <el-button size="small" @click="selectDate('today')">오늘</el-button>
        <el-button size="small" @click="selectDate('next-month')"> 다음달 </el-button>
        <el-button size="small" @click="selectDate('next-year')"> 다음해 </el-button>
      </el-button-group>
    </template>
    <template #date-cell="{ data }">
      <el-row>
        {{ parseInt(data.day.split('-')[2]) }}
      </el-row>
      <div v-for="(item, index) in textContent(data.day)" :key="index" style="margin-top: -15px">
        <el-row @click="clickOrder(item)">
          <el-col :span="12" style="color: #409eff">신규</el-col>
          <el-col :span="12" style="color: #409eff; text-align: right">{{ item.wait }}</el-col>
        </el-row>
        <el-row @click="clickCancel(item)">
          <el-col :span="12" style="color: #f56c6c">점검중</el-col>
          <el-col :span="12" style="color: #f56c6c; text-align: right">{{ item.progress }}</el-col>
        </el-row>
        <el-row @click="clickChange(item)">
          <el-col :span="12" style="color: #67c23a">점검완료</el-col>
          <el-col :span="12" style="color: #67c23a; text-align: right">{{ item.complete }}</el-col>
        </el-row>
        <el-row @click="clickReturn(item)">
          <el-col :span="12" style="color: #e6a23c">작성완료</el-col>
          <el-col :span="12" style="color: #e6a23c; text-align: right">{{ item.end }}</el-col>
        </el-row>
      </div>
    </template>
  </el-calendar>

  <el-dialog v-model="data.visibleNotice" width="900px">
    <y-table>
      <y-tr>
        <y-th style="width: 50px">제목</y-th>
        <y-td>{{ data.item.title }}</y-td>
      </y-tr>
      <y-tr>
        <y-th>내용</y-th>
        <y-td>
          <div style="min-height: 100px" v-html="util.nl2br(data.item.content)"></div>
        </y-td>
      </y-tr>
    </y-table>

    <template #footer>
      <el-button size="small" @click="data.visibleNotice = false">닫기</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Calendarcompanylist, Notice, User, Company, Report, Customer } from '~/models'
import { util, size } from '~/global'
import router from '~/router'
import { useStore } from 'vuex'
import moment from 'moment'
import Extra from '~/models/extra'

const store = useStore()

const data = reactive({
  session: {
    level: 0,
    company: 0,
  },
  calendars: [],
  notices: [],
  visibleNotice: false,
  company: {
    name: '',
    tel: '',
    email: '',
    number: '',
    address: '',
    score: 0,
  },
  date: null,
  sales: {
    total: 0,
    totalprice: 0,
  },
  userscore: 0,
  buildingscore: 0,
})

const info = reactive({
  newcustomers: 0,
  customers: 0,
  avgprice: 0,
  totalprice: 0,
  users: 0,
  today: 0,
  todaytotal: 0,
  week: 0,
  weektotal: 0,
  month: 0,
  monthtotal: 0,
})

const textContent = date => {
  return data.calendars.filter(item => {
    return date === item.day
  })
}

async function readCalendar(day) {
  return
}

async function initData() {}

async function getItems() {
  let d = moment()
  let day = d.format('YYYY-MM')

  data.date = new Date()

  await readCalendar(day)

  let today = moment().format('YYYY-MM-DD 00:00:00')
  let week = moment().subtract(7, 'day').format('YYYY-MM-DD 00:00:00')
  let month = moment().subtract(1, 'month').format('YYYY-MM-DD 00:00:00')

  let res = await Extra.dashboard()

  if (res.users == null) {
    res.users = []
  }

  if (res.customers == null) {
    res.customers = []
  }
  
  info.users = res.users
  let customer = res.customers ?? []

  info.customers = customer.length
  info.newcustomers = customer.filter(item => item.date > week).length

  let totalscore = customer.reduce((acc, item, idx) => acc + item.extra.building.score, 0)
  info.totalprice = customer.reduce((acc, item, idx) => acc + item.contractprice, 0)
  if (totalscore > 0) {
    info.avgprice = util.getInt(info.totalprice / totalscore)
  }

  let report = res.reports
  if (report == null || report.length == 0) {
    return
  }

  info.todaytotal = report.filter(item => item.date > today).length
  info.weektotal = report.filter(item => item.date > week).length
  info.monthtotal = report.filter(item => item.date > month).length

  info.today = report.filter(item => item.date > today && item.status == Report.status.complete).length
  info.week = report.filter(item => item.date > week && item.status == Report.status.complete).length
  info.month = report.filter(item => item.date > month && item.status == Report.status.complete).length
}

onMounted(async () => {
  data.session = store.getters['getUser']

  util.loading(true)

  await initData()
  await getItems(true)

  util.loading(false)
})

function clickOrder(item) {
  let n = { day: item.day }
  router.push({ name: 'ShopOrdertrans', params: n })
}

function clickCancel(item) {
  let n = { day: item.day }
  router.push({ name: 'ShopCancel', params: n })
}

function clickChange(item) {
  let n = { day: item.day }
  router.push({ name: 'ShopChange', params: n })
}

function clickReturn(item) {
  let n = { day: item.day }
  router.push({ name: 'ShopReturn', params: n })
}

function clickUpdateNotice(item, index) {
  data.item = util.clone(item)
  data.visibleNotice = true
}

const calendar = ref()
const selectDate = async (val: string) => {
  calendar.value.selectDate(val)

  let now = util.convertDate(data.date)
  let d = moment(now)
  await readCalendar(d.format('YYYY-MM'))
}

function checkLimitdate(d) {
  let now = moment().format('YYYY-MM-DD')
  let date = moment(util.convertDate(d)).subtract(10, 'days').format('YYYY-MM-DD')
  if (date <= now) {
    return false
  }

  return true
}
</script>
<style>
.info {
  text-align: center;
  font-size: 24px;
  padding: 6px 0px;
}

.cnt {
  color: #f56c6c;
}

.sep {
  font-size: 18px;
}
</style>
