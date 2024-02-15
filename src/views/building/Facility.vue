<template>
  <Title title="설비 관리" />

  <el-tabs v-model="data.menu" @tab-click="clickTab">
    <el-tab-pane label="수배전설비" name="basic">
      <div :style="{'height': data.height, 'overflow': 'auto'}">
        <Basic :id="data.id" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="발전설비" name="totalplan">
      <div :style="{'height': data.height, 'overflow': 'auto'}">
        <Generator :id="data.id" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="태양광 발전" name="plan">
      <div :style="{'height': data.height, 'overflow': 'auto'}">

      </div>
    </el-tab-pane>
    <el-tab-pane label="전기차 충전기" name="year">
      <div :style="{'height': data.height, 'overflow': 'auto'}">

      </div>
    </el-tab-pane>
    <el-tab-pane label="ESS" name="combine">
      <div :style="{'height': data.height, 'overflow': 'auto'}">

      </div>
    </el-tab-pane>
    <el-tab-pane label="UPS" name="summary">
      <div :style="{'height': data.height, 'overflow': 'auto'}">

      </div>
    </el-tab-pane>
    <el-tab-pane label="연료전지" name="summary">
      <div :style="{'height': data.height, 'overflow': 'auto'}">

      </div>
    </el-tab-pane>
    <el-tab-pane label="풍력발전" name="summary">
      <div :style="{'height': data.height, 'overflow': 'auto'}">

      </div>
    </el-tab-pane>
    <el-tab-pane label="수력발전" name="summary">
      <div :style="{'height': data.height, 'overflow': 'auto'}">

      </div>
    </el-tab-pane>
    <el-tab-pane label="소방펌프 발전기" name="summary">
      <div :style="{'height': data.height, 'overflow': 'auto'}">

      </div>
    </el-tab-pane>
    <el-tab-pane label="공동주택 세대점검" name="summary">
      <div :style="{'height': data.height, 'overflow': 'auto'}">

      </div>
    </el-tab-pane>
  </el-tabs>

</template>


<script setup lang="ts">

import { ref, reactive, onMounted, onUnmounted } from "vue"
import router from '~/router'
import { util, size }  from "~/global"
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const { width, height } = size()

const store = useStore()
const route = useRoute()

const data = reactive({
  id: 0,
  session: {
    level: 0,
    company: 0
  },
  menu: 'basic'
})

async function clickSearch() {
  await getItems(true)
}

async function initData() {
}

async function getItems() {
}

onMounted(async () => {
  data.session = store.getters['getUser']
  data.id = util.getInt(route.params.id)

  util.loading(true)
  
  await initData()
  await getItems()

  util.loading(false)
})

function clickTab() {
}

</script>
