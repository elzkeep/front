<template>

  <el-row style="border-bottom: 1px solid #ccc;height:">
    <el-col :span="12" style="text-align:left;">
      <div style="display:flex;margin: 10px 10px 10px 10px;gap:10px;">
      <img src="../../assets/logo.png" width="25" height="25" />      
      <span style="font-size:20px;font-weight:bold;">지킴</span>
      </div>
      <!--
      <el-menu mode="horizontal" style="border:none;" v-if="data.apt.id == 0 && store.getters['getLevel'] == 'admin'">
        <el-menu-item index="7" @click="clickBase('/management/sales')" style="font-size:14px;font-weight:bold;">주소 관리</el-menu-item>
        <el-menu-item index="1" @click="clickBase('/management/apt')" style="font-size:14px;font-weight:bold;">작업 관리</el-menu-item>
        <el-menu-item index="3" @click="clickBase('/management/repair/repair')" style="font-size:14px;font-weight:bold;">장기수선</el-menu-item>
        <el-menu-item index="4" @click="clickBase('/management/detail/detail')" style="font-size:14px;font-weight:bold;">정밀점검</el-menu-item>
        <el-menu-item index="5" @click="clickBase('/management/periodic/periodic')" style="font-size:14px;font-weight:bold;">정기점검</el-menu-item>
        <el-menu-item index="6" @click="clickBase('/management/patrol/patrol')" style="font-size:14px;font-weight:bold;">순찰</el-menu-item>
        <el-menu-item index="2" @click="clickBase('/management/setting/user')" style="font-size:14px;font-weight:bold;">설정</el-menu-item>
      </el-menu>
      -->
      
      <div style="height:43px;font-size:20px;font-weight:bold;margin: 5px 0px 0px 5px;display:flex;padding-top:10px;" v-if="data.apt.id != 0">
        <div @click="clickHome" style="margin-left:10px;">
          <el-icon :size="25"><HomeFilled /></el-icon>
        </div>
        <div style="font-size:14px;color:#409eff;font-weight:bold;margin: 5px 0px 0px 10px;">
          <div v-if="data.menu == 'repair'">            
            장기수선계획
            <span v-if="data.repair.type == 1">재수립</span>
            <span v-else>검토조정</span>
            ({{data.repair.reportdate}})
          </div>
          <div v-if="data.menu == 'apt'">
            기본관리
          </div>
          <div v-if="data.menu == 'patrol'">
            순찰
          </div>
          <div v-if="data.menu == 'detail'">
            정밀점검
          </div>
          <div v-if="data.menu == 'periodic'">
            정기점검
          </div>
        </div>


      </div>
    </el-col>

    <el-col :span="12">
      <div style="float:right;margin-top:20px;text-align:right;font-size:12px;margin-right:20px;">
        <el-dropdown>
          <span style="font-size:12px;">            
            {{store.getters['getUser'].name}}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item style="font-size:12px;">회원정보 수정</el-dropdown-item>
              <el-dropdown-item style="font-size:12px;" divided @click="clickLogout" >로그아웃</el-dropdown-item>
            </el-dropdown-menu>
          </template>
      </el-dropdown>
      </div>

      <div style="width:500px;float:right;">
        <el-menu mode="horizontal" style="width:100%;" v-if="data.apt.id > 0">
          <el-menu-item index="1" @click="clickAptApt" style="font-size:14px;font-weight:bold;">기본관리</el-menu-item>
          <el-menu-item index="2" @click="clickAptRepair" v-if="data.apt.contracttype & 1" style="font-size:14px;font-weight:bold;">장기수선</el-menu-item>
          <el-menu-item index="3" @click="clickAptDetail" v-if="data.apt.contracttype & 2" style="font-size:14px;font-weight:bold;">정밀점검</el-menu-item>
          <el-menu-item index="4" @click="clickAptPeriodic" v-if="data.apt.contracttype & 4" style="font-size:14px;font-weight:bold;">정기점검</el-menu-item>
          <el-menu-item index="5" @click="clickAptPatrol" v-if="data.apt.contracttype & 256" style="font-size:14px;font-weight:bold;">순찰</el-menu-item>
        </el-menu>
      </div>      
      <div style="clear:both;"></div>
    </el-col>
  </el-row>

</template>

<script setup lang="ts">

import { ref, reactive, onMounted, computed, watch, watchEffect } from "vue"
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import router from '~/router'
import { util }  from "~/global"

const store = useStore()
const route = useRoute()

const repairInsert = ref({});
const detailInsert = ref({});
const periodicInsert = ref({});

const data = reactive({
  id: 0,
  apt: {
    id: 0,
    tel: ''
  },
  repair: {
    reportdate: ''
  },
  menu: ''
})

const apt = ref({})


watch(() => route.params.id, async () => {
  data.id = util.getInt(route.params.id)
})

watch(() => route.path, async () => {
  var s = route.path.split('/')

  let menu = ''
  if (s[1] == 'management') {
    if (s.length == 3) {
      menu = s[1]
    } else {
      menu = `${s[1]}/${s[2]}`
    }
  } else {
    menu = s[2]
  }

  if (data.menu != menu) {
    data.menu = menu
  }

  if (menu == 'repair') {
    if (data.id == 0) {
      data.repair = { reportdate: '' }
      return
    } else {
      const res = await Repair.get(data.id)
      data.repair = res.item
    }
  }
})


const handleCloseRepair = (done: () => void) => {
  repairInsert.value.reset()
  done()
}

const handleCloseDetail = (done: () => void) => {
  detailInsert.value.reset()
  done()
}

const handleClosePeriodic = (done: () => void) => {
  periodicInsert.value.reset()
  done()
}

onMounted(async () => {    
})

function clickLogout() {
  store.commit('setLogout')
  router.push('/')
}

function clickHome() {
  if (store.getters['getLevel'] == 'admin') {
    router.push('/management/sales')
  } else {
    router.push('/')
  }
}

function clickBase(url) {
  router.push(url)
}

function clickAptView() {
  apt.value?.readData(data.apt.id)
}

function clickDetail() {
}

function clickPatrol() {
}

function clickAptApt() {
  router.push(`/${data.apt.id}/apt/apt`)
}

function clickAptRepair() {
  data.visibleRepair = true
}

function clickAptDetail() {
  data.visibleDetail = true
}

function clickAptPeriodic() {
  data.visiblePeriodic = true
}

function clickAptPatrol() {
  router.push(`/${data.apt.id}/patrol/patrol`)
}

function closeRepair() {
  data.visibleRepair = false
}

function closeDetail() {
  data.visibleDetail = false
}

function closePeriodic() {
  data.visiblePeriodic = false
}

</script>
