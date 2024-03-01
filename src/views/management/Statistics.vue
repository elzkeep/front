<template>
  <Title title="매출" />


  <Chart
    :size="{ width: util.getInt(width(160).replace('px', '')), height: 200 }"
    :data="data.charts"
    :margin="{top: 5, bottom: 20}"
    :direction="'horizontal'">

    <template #layers>
      <Line :dataKeys="['title', 'value']" />
    </template>

  </Chart>


  <el-table :data="data.items" border style="width: 100%;"  @row-click="clickRow" :summary-method="getSummary" show-summary>
    <el-table-column label="기간" align="center">
      <template #default="scope">
        <span v-if="scope.row.duration == undefined">전체</span>
        <span v-else>{{scope.row.duration}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="total" label="점검건수" align="right">
      <template #default="scope">
        {{util.money(scope.row.total)}}
      </template>
    </el-table-column>
    <el-table-column prop="totalprice" label="금액" align="right">
      <template #default="scope">
        {{util.money(scope.row.totalprice)}}
      </template>
    </el-table-column>
  </el-table>

  <div style="margin-top:10px;display:flex;justify-content: space-between;">
    <el-button v-if="data.mode == 'month'" size="small" type="success" @click="clickBackMonth">뒤로</el-button>
    <el-button v-if="data.mode == 'day'" size="small" type="success" @click="clickBackDay">뒤로</el-button>
    <div style="flex:0;"></div>
  </div>
</template>

<script setup lang="ts">

import { reactive, onMounted } from "vue"
import router from '~/router'
import { util, size }  from "~/global"
import { Statistics, Statisticsyear, Statisticsmonth, Statisticsday } from "~/models"
import { Chart, Grid, Line } from 'vue3-charts'
import { useStore } from 'vuex'

const { width, height } = size()

const store = useStore()

const search = reactive({
  text: ''
})

const item = {
  id: 0,
  name: '',
  number: '',
  tel: '',
  email: '',
  personname: ''
}

const data = reactive({
  items: [],
  total: 0,
  page: 1,
  pagesize: 10,
  item: util.clone(item),
  visible: false,
  mode: 'year',
  duration: '',
  company: 0,
  charts: []
})

async function getItems() {
  let res;

  if (data.mode == 'year') {
    res = await Statisticsyear.find({company: store.getters.getUser.company, orderby: 'bi_duration'})
  } else if (data.mode == 'month') {
    res = await Statisticsmonth.find({company: store.getters.getUser.company, duration: data.duration, orderby: 'bi_duration'})
  } else if (data.mode == 'day') {
    res = await Statisticsday.find({company: store.getters.getUser.company, duration: data.duration, orderby: 'bi_duration'})
  }

  data.charts = res.items.map(item => {
    return {
      title: data.mode == 'company' ? '전체' : item.duration,
      value: item.totalprice
    }
  })

  data.total = res.total
  data.items = res.items
}

function clickInsert() {
  data.item = util.clone(item)
  data.visible = true
}

function clickUpdate(pos, item) {
  data.item = util.clone(item)
  data.visible = true
}

function clickDelete(pos, item) {
  util.confirm('삭제하시겠습니까', async function() {
    let res = await Company.remove(item)
    if (res.code === 'ok') {
      util.info('삭제되었습니다')
      getItems()
    }
  })
}

async function clickSubmit() {
  const item = data.item
  if (item.name === '') {
    util.error('명칭을 입력하세요')
    return
  }

  if (item.code === '') {
    util.error('코드를 입력하세요')
    return
  }

  let res;

  if (item.id === 0) {
    res = await Company.insert(item)
  } else {
    res = await Company.update(item)
  }

  if (res.code === 'ok') {
    util.info('등록되었습니다')
    getItems()
    data.visible = false
  } else {
    util.error('오류가 발생했습니다')
  }
}

const handleClose = (done: () => void) => {
  util.confirm('팝업창을 닫으시겠습니까', function() {
    done()
  })
}

onMounted(async () => {
  util.loading(true)

  await getItems()

  util.loading(false)
})

async function clickRow(item) {
  if (data.mode == 'company') {
    data.mode = 'year'
    data.company = item.id
    await getItems()
  } else if (data.mode == 'year') {
    data.mode = 'month'
    data.company = item.id
    data.duration = item.duration
    await getItems()
  } else if (data.mode == 'month') {
    /*
    data.mode = 'day'
    data.company = item.id
    data.duration = item.duration
    await getItems()
    */
  }
}

function clickBackYear() {
  data.mode = 'company'
  getItems()
}

function clickBackMonth() {
  data.mode = 'year'
  getItems()
}

function clickBackDay() {
  data.mode = 'month'
  getItems()
}

const getSummary = (param: SummaryMethodProps) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = '합계'
    } else if (index == 1) {
      let total = 0
      if (data != null) {
        data.forEach((item) => {
          total += util.getInt(item.total)
        })
      }

      sums[index] = total
    } else if (index == 2) {
      let total = 0
      if (data != null) {
        data.forEach((item) => {
          total += util.getInt(item.totalprice)
        })
      }

      sums[index] = util.money(total)
    }
  })

  return sums
}

</script>
