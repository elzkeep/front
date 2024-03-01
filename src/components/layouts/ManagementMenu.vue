<template>  
  <el-menu @select="clickMenu" :collapse="false" style="padding-top:10px;">
    <el-menu-item index="1" v-if="isAdmin()">
      <template #title>
        <el-icon><Document /></el-icon>업체 관리
      </template>
    </el-menu-item>

    <el-menu-item index="9" v-if="!isAdmin()">
      <template #title>
        <el-icon><Document /></el-icon>기본 정보 관리
      </template>
    </el-menu-item>

    <el-menu-item index="2">
      <template #title>
        <el-icon><Coin /></el-icon>팀 관리
      </template>
    </el-menu-item>

    <el-menu-item index="3">
      <template #title>
        <el-icon><User /></el-icon>직원 관리
      </template>
    </el-menu-item>    
    
    <el-menu-item index="4" v-if="isWork()">
      <template #title>
        <el-icon><Cpu /></el-icon>면허 관리
      </template>
    </el-menu-item>

    <el-menu-item index="5" v-if="isWork()">
      <template #title>
        <el-icon><Medal /></el-icon>직원면허 관리
      </template>
    </el-menu-item>

    <el-menu-item index="6" v-if="isBuilding()">
      <template #title>
        <el-icon><OfficeBuilding /></el-icon>건물 관리
      </template>
    </el-menu-item>

    <el-menu-item index="7" v-if="isWork()">
      <template #title>
        <el-icon><School /></el-icon>고객 관리
      </template>
    </el-menu-item>

    <el-menu-item index="8" v-if="isWork()">
      <template #title>
        <el-icon><Money /></el-icon>매출 관리
      </template>
    </el-menu-item>

    <el-menu-item index="11" v-if="isWork()">
      <template #title>
        <el-icon><PieChart /></el-icon>매출 통계
      </template>
    </el-menu-item>

    <el-menu-item index="10" v-if="isWork()">
      <template #title>
        <el-icon><Files /></el-icon>점검 관리
      </template>
    </el-menu-item>

  </el-menu>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted } from "vue"
import router from '~/router'
import { Company } from "~/models"
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const store = useStore()
const route = useRoute()

const data = reactive({
  session: {
    level: 0,
    company: 0
  },
  company: {
    type: 0
  }
})

onMounted(async () => {
  data.session = store.getters['getUser']
  data.company = store.getters['getCompany']
})

const isWork = () => data.company.type == Company.type.work
const isBuilding = () => data.company.type == Company.type.building
const isAdmin = () => data.session.level == 4

const clickMenu = async (key: string, keyPath: string[]) => {
  if (key == '1') {
    router.push('/management/company')
  } else if (key == '2') {
    router.push('/management/department')
  } else if (key == '3') {
    router.push('/management/user')    
  } else if (key == '4') {
    router.push('/management/companylicense')
  } else if (key == '5') {
    router.push('/management/license')
  } else if (key == '6') {
    router.push('/management/building')
  } else if (key == '7') {
    router.push('/management/customer')
  } else if (key == '8') {
    router.push('/management/billing')
  } else if (key == '9') {
    router.push('/management/companyinfo')
  } else if (key == '10') {
    router.push('/management/report')
  } else if (key == '11') {
    router.push('/management/statistics')
  }
}

</script>
