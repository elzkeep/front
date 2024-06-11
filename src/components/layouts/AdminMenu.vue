<template>
  <el-menu @select="clickMenu" :collapse="false" style="padding-top: 10px">
    <el-menu-item index="1">
      <template #title>
        <el-icon><Document /></el-icon>업체 관리
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

    <el-menu-item index="4">
      <template #title>
        <el-icon><Cpu /></el-icon>면허 관리
      </template>
    </el-menu-item>

    <el-menu-item index="5">
      <template #title>
        <el-icon><Medal /></el-icon>직원면허 관리
      </template>
    </el-menu-item>

    <el-menu-item index="6">
      <template #title>
        <el-icon><OfficeBuilding /></el-icon>건물 관리
      </template>
    </el-menu-item>

    <el-menu-item index="7">
      <template #title>
        <el-icon><School /></el-icon>고객 관리
      </template>
    </el-menu-item>

    <el-menu-item index="8">
      <template #title>
        <el-icon><Money /></el-icon>매출 보고서
      </template>
    </el-menu-item>

    <el-menu-item index="11">
      <template #title>
        <el-icon><PieChart /></el-icon>매출 통계
      </template>
    </el-menu-item>

    <el-menu-item index="10">
      <template #title>
        <el-icon><Files /></el-icon>점검 관리
      </template>
    </el-menu-item>

    <el-menu-item index="40">
      <template #title>
        <el-icon><Document /></el-icon>웹 공지사항 관리
      </template>
    </el-menu-item>

    <el-menu-item index="41">
      <template #title>
        <el-icon><Document /></el-icon>FAQ 관리
      </template>
    </el-menu-item>

    <el-menu-item index="42">
      <template #title>
        <el-icon><User /></el-icon>사전등록 관리
      </template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import router from '~/router'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const store = useStore()
const route = useRoute()

const data = reactive({
  session: {
    level: 0,
    company: 0,
  },
  company: {
    type: 0,
  },
})

onMounted(async () => {
  data.session = store.getters['getUser']
})

const clickMenu = async (key: string, keyPath: string[]) => {
  if (key == '1') {
    router.push('/admin/company')
  } else if (key == '2') {
    router.push('/admin/department')
  } else if (key == '3') {
    router.push('/admin/user')
  } else if (key == '4') {
    router.push('/admin/companylicense')
  } else if (key == '5') {
    router.push('/admin/license')
  } else if (key == '6') {
    router.push('/admin/building')
  } else if (key == '7') {
    router.push('/admin/customer')
  } else if (key == '8') {
    router.push('/admin/billing')
  } else if (key == '9') {
    router.push('/admin/companyinfo')
  } else if (key == '10') {
    router.push('/admin/report')
  } else if (key == '11') {
    router.push('/admin/statistics')
  } else if (key == '40') {
    router.push('/admin/notice')
  } else if (key == '41') {
    router.push('/admin/faq')
  } else if (key == '42') {
    router.push('/admin/join')
  }
}
</script>
