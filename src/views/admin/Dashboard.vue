<template>

  <el-row style="margin:-10px 20px 20px 20px;">
    <el-col :span="9">
      <PageTitle title="공지사항" />

      <el-table :data="data.notices" border :height="145" @row-click="clickUpdateNotice">
        <el-table-column prop="id" label="NO" align="center" width="60" />    
        <el-table-column prop="title" label="제목" />    
        <el-table-column prop="date" label="등록일" width="130" align="center" />        
      </el-table>
    </el-col>
    <el-col :span="15">
      <div style="margin-left:20px;">

        <PageTitle title="전체 현황" />
        <y-table>
          <y-tr>
            <y-th>
              <div>계약 고객수</div>
              <div class="info"><span class="cnt">10</span> <span class="sep">/</span> 10</div>
            </y-th>
            <y-th>
              <div>계약 금액</div>
              <div class="info"><span class="cnt">10</span> <span class="sep">/</span> 10</div>
            </y-th>
            <y-th>
              <div>전체 직원수</div>
              <div class="info"><span class="cnt">10</span> <span class="sep">/</span> 10</div>
            </y-th>
            <y-th>
              <div>오늘<span style="font-size:8px;">의 점검 건수</span></div>
              <div class="info"><span class="cnt">10</span> <span class="sep">/</span> 10</div>
            </y-th>
            <y-th>
              <div>금주<span style="font-size:8px;">의 점검 건수</span></div>
              <div class="info"><span class="cnt">10</span> <span class="sep">/</span> 10</div>
            </y-th>
            <y-th>
              <div>이달<span style="font-size:8px;">의 점검 건수</span></div>
              <div class="info"><span class="cnt">10</span> <span class="sep">/</span> 10</div>
            </y-th>
          </y-tr>
        </y-table>
      </div>
    </el-col>
  </el-row>
      
  <el-calendar ref="calendar" v-model="data.date">
    <template #header="{ date }">
      <span style="font-size:16px;font-weight:bold;">{{ date }}</span>
      <el-button-group>
        <el-button size="small" @click="selectDate('prev-year')">
          지난해
        </el-button>
        <el-button size="small" @click="selectDate('prev-month')">
          지난달
        </el-button>
        <el-button size="small" @click="selectDate('today')">오늘</el-button>
        <el-button size="small" @click="selectDate('next-month')">
          다음달
        </el-button>
        <el-button size="small" @click="selectDate('next-year')">
          다음해
        </el-button>
      </el-button-group>
    </template>
    <template #date-cell="{ data }">
      <el-row>
        {{ parseInt(data.day.split('-')[2]) }}
      </el-row>
      <div v-for="(item, index) in textContent(data.day)" :key="index" style="margin-top:-15px;">
        <el-row @click="clickOrder(item)">
          <el-col :span="12" style="color:#409EFF;">신규</el-col>
          <el-col :span="12" style="color:#409EFF;text-align:right;">{{item.wait}}</el-col>
        </el-row>
        <el-row @click="clickCancel(item)">
          <el-col :span="12" style="color:#F56C6C;">점검중</el-col>
          <el-col :span="12" style="color:#F56C6C;text-align:right;">{{item.progress}}</el-col>
        </el-row>
        <el-row @click="clickChange(item)">
          <el-col :span="12" style="color:#67C23A;">점검완료</el-col>
          <el-col :span="12" style="color:#67C23A;text-align:right;">{{item.complete}}</el-col>
        </el-row>
        <el-row @click="clickReturn(item)">
          <el-col :span="12" style="color:#E6A23C;">작성완료</el-col>
          <el-col :span="12" style="color:#E6A23C;text-align:right;">{{item.end}}</el-col>
        </el-row>
        
      </div>

    </template>
  </el-calendar>

  <el-dialog v-model="data.visibleNotice" width="900px">
    
    <y-table>      
      <y-tr>
        <y-th style="width:50px;">제목</y-th>
        <y-td>{{data.item.title}}</y-td>
      </y-tr>
      <y-tr>
        <y-th>내용</y-th>
        <y-td>
          <div style="min-height:100px;" v-html="util.nl2br(data.item.content)"></div>
        </y-td>
      </y-tr>            
    </y-table>

    <template #footer>
      <el-button size="small" @click="data.visibleNotice = false">닫기</el-button>
    </template>
  </el-dialog>

</template>


<script setup lang="ts">

import { ref, reactive, onMounted } from "vue";
import { Calendarcompanylist, Notice, User, Company, Report, Customer, Dashboard } from "~/models"
import { util, size }  from "~/global"
import router from '~/router'
import { useStore } from 'vuex'
import moment from 'moment'

const store = useStore()

const data = reactive({
  session: {
    level: 0,
    company: 0
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
    score: 0
  },
  date: null,
  sales: {
    total: 0,
    totalprice: 0
  },  
  userscore: 0,
  buildingscore: 0
});

const textContent = (date) => {
  console.log(date)
  return data.calendars.filter((item) => {
    return date === item.day;
  });
};

async function initData() {
  let res = await Notice.find({
    page: 1,
    pagesize: 4,
    orderby: 'n_id desc'
  })

  data.notices = res.items

  res = await Company.get(data.session.company)
  data.company = res.item

  res = await Customer.find({company:data.session.company})
  data.buildingscore = res.items.reduce((acc, cur, index) => {
    return acc = cur.extra.building.score
  }, 0)

  res = await User.find({company:data.session.company})
  data.userscore = res.items.reduce((acc, cur, index) => {
    return acc = cur.score
  }, 0)  
}

async function readCalendar(day) {
  let res = await Calendarcompanylist.find({company: data.session.company, month: day})
  console.log(res)
  let datas = {}
  res.items.forEach(item => {
    console.log(item)
    if (!(item.day in datas)) {
      datas[item.day] = {
        day: item.day,
        total: 0,
        wait: 0,
        progress: 0,
        complete: 0,
        end: 0
      }
    }

    datas[item.day].total += item.count
    if (item.status == 1) {
      datas[item.day].wait += item.count
    } else if (item.status == 2) {
      datas[item.day].progress += item.count
    } else if (item.status == 3) {
      datas[item.day].complete += item.count
    } else if (item.status == 4) {    
      datas[item.day].end += item.count
    }
  })

  let items = []
  for (let item in datas) {
    items.push(datas[item])
  }

  console.log(items)
  data.calendars = items
}

async function getItems() {
  let d = moment()
  let today = d.format('YYYY-MM')

  data.date = new Date()
  
  await readCalendar(today)

  return
  let res = await Report.find({company: data.session.company, duration: today, orderby: 'r_checkdate'})

  let t = d.format('YYYY-MM-DD')
  for (let i = 0; i < res.items.length; i++) {
    let item = res.items[i]
    if (item.checkdate == t) {
      data.sales = item
    }
  }  
}

onMounted(async () => {
  data.session = store.getters['getUser']
  
  util.loading(true)
  
  await initData()
  await getItems()

  util.loading(false)
})

function clickOrder(item) {
  let n = { day: item.day }
  router.push({name: 'ShopOrdertrans', params: n})
}

function clickCancel(item) {
  let n = { day: item.day }
  router.push({name: 'ShopCancel', params: n})
}

function clickChange(item) {
  let n = { day: item.day }
  router.push({name: 'ShopChange', params: n})
}

function clickReturn(item) {
  let n = { day: item.day }
  router.push({name: 'ShopReturn', params: n})
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
}

.cnt {
  color:#f56c6c;
}

.sep {
  font-size: 18px;
}
</style>
