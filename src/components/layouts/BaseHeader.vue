<template>
  <div class="base-header">
    <div class="base-title">
      <h1><img alt="zkeep" src="../../assets/image.svg" /></h1>
      <div class="header">
        <div class="header-icon"><img class="side-icon" alt="menu" src="../../assets/icon/menu.svg" /></div>
        <div class="header-title">
          <h2 class="page-tit">{{ data.title }}</h2>
        </div>
      </div>
    </div>
    <div class="header">
      <div>
        <el-dropdown>
          <span style="font-size: 12px">
            {{ store.getters['getUser'].name }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item style="font-size: 12px">회원정보 수정</el-dropdown-item>
              <el-dropdown-item style="font-size: 12px" divided @click="clickLogout">로그아웃</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div style="clear: both"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import router from '~/router'
import { util } from '~/global'

const store = useStore()
const route = useRoute()

const repairInsert = ref({})
const detailInsert = ref({})
const periodicInsert = ref({})

const data = reactive({
  id: 0,
  apt: {
    id: 0,
    tel: '',
  },
  repair: {
    reportdate: '',
  },
  menu: '',
  title: '',
})

const apt = ref({})

watch(
  () => route.params.id,
  async () => {
    data.id = util.getInt(route.params.id)
  }
)

watch(
  () => route.path,
  async () => {
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
  }
)

watch(
  () => route.name,
  async () => {
    switch (route.name) {
      case 'ManagementDashboard':
        data.title = '대쉬보드'
        break
      case 'ManagementCustomercompany':
      case 'ManagementCustomer':
        data.title = '고객 관리'
        break
      case 'ManagementStatistics':
      case 'ManagementBilling':
      case 'ManagementTax':
        data.title = '매출 및 청구 관리'
        break
      case 'ManagementReport':
        data.title = '점검 관리'
        break
      case 'ManagementCompanyinfo':
      case 'ManagementCompanylicene':
      case 'ManagementUser':
      case 'ManagementDepartment':
        data.title = '사업자 정보 및 관리'
        break
      default:
        ''
    }
  }
)

onMounted(async () => {})

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
</script>
