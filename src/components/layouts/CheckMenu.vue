<template>


  <el-menu  @select="clickMenu"
  >

    <el-menu-item index="5" style="width:160px;overflow:hidden; padding: 0px 10px 0px 14px !important;font-size:14px;">
      <el-icon><Menu /></el-icon>
      <span>대시보드</span>
    </el-menu-item>

    <el-sub-menu index="1" style="width:160px;overflow:hidden; padding: 0px 0px !important;padding :0px 0px;">
      <template #title>
        <el-icon><Document /></el-icon>
            <div>사업자정보</div>
          </template>

          <el-menu-item index="1-1">기본정보 관리</el-menu-item>
          <el-menu-item index="1-2">보유먼허 관리</el-menu-item>
          <el-menu-item index="1-3">소속회원 관리</el-menu-item>
          <el-menu-item index="1-4">팀 관리</el-menu-item>

        </el-sub-menu>

        <el-sub-menu index="2" style="width:160px;overflow:hidden; padding: 0px 0px !important;padding :0px 0px;">
          <template #title>
            <el-icon><Files /></el-icon>
            <div>점검기록</div>
          </template>

          <el-menu-item index="2-1">점검현황</el-menu-item>
          <el-menu-item index="2-2">점검기록</el-menu-item>
          <el-menu-item index="2-3">점검 보고서</el-menu-item>
          <el-menu-item index="2-4">적합/부적합 결과</el-menu-item>

        </el-sub-menu>


        <el-sub-menu index="3" style="width:160px;overflow:hidden; padding: 0px 0px !important;padding :0px 0px;">
          <template #title>
            <el-icon><User /></el-icon>
            <div>고객</div>
          </template>

          <el-menu-item index="3-1">고객별 현황</el-menu-item>
          <el-menu-item index="3-2">건물별 현황</el-menu-item>
          <el-menu-item index="3-3">계약관리</el-menu-item>


        </el-sub-menu>

        <el-sub-menu index="4" style="width:160px;overflow:hidden; padding: 0px 0px !important;padding :0px 0px;">
          <template #title>
            <el-icon><Money /></el-icon>
            <div>매출</div>
          </template>

          <el-menu-item index="4-1">매출 보고서</el-menu-item>
          <el-menu-item index="4-2">청구서 관리</el-menu-item>
          <el-menu-item index="4-3">결제 기록</el-menu-item>


        </el-sub-menu>

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
  console.log(key)
  if (key == '5') {
    router.push('/management/dashboard')
  } else if (key == '1-4') {
    router.push('/management/department')
  } else if (key == '1-3') {
    router.push('/management/user')
  } else if (key == '1-2') {
    router.push('/management/companylicense')
  } else if (key == '5') {
    router.push('/management/license')
  } else if (key == '3-2') {
    router.push('/management/customer')
  } else if (key == '3-3') {
    router.push('/management/contract')    
  } else if (key == '3-1') {
    router.push('/management/customercompany')
  } else if (key == '4-1') {
    router.push('/management/statistics')
  } else if (key == '4-2') {
    router.push('/management/billing')
  } else if (key == '4-3') {
      router.push('/management/payment')    
  } else if (key == '1-1') {
    router.push('/management/companyinfo')
  } else if (key == '10') {
    router.push('/management/report')
  } else if (key == '2-2') {
    router.push('/management/report')
  }
}

</script>
<style>
.el-sub-menu {
  margin: 0px 0px !important;
  papdding: 0px 0px !important;
}

.el-menu-item {
  margin: 0px 0px 0px 8px !important;
}
</style>
