<template>
  <div class="base-tab">
    <ul v-if="isMenuActive('ManagementCustomercompany') || isMenuActive('ManagementCustomer')">
      <li class="tab">
        <router-link class="tab-title" :to="{ name: 'ManagementCustomercompany' }">
          <h2 :class="isMenuActive('ManagementCustomercompany') ? 'tab-tit' : 'tab-subtit'">고객 현황</h2>
        </router-link>
      </li>
      <li class="tab">
        <router-link class="tab-title" :to="{ name: 'ManagementCustomer' }">
          <h2 :class="isMenuActive('ManagementCustomer') ? 'tab-tit' : 'tab-subtit'">건물 및 계약 관리</h2>
        </router-link>
      </li>
    </ul>
    <ul v-if="isMenuActive('ManagementStatistics') || isMenuActive('ManagementBilling') || isMenuActive('ManagementTax')">
      <li class="tab">
        <router-link class="tab-title" :to="{ name: 'ManagementStatistics' }">
          <h2 :class="isMenuActive('ManagementStatistics') ? 'tab-tit' : 'tab-subtit'">매출 보고서</h2>
        </router-link>
      </li>
      <li class="tab">
        <router-link class="tab-title" :to="{ name: 'ManagementBilling' }">
          <h2 :class="isMenuActive('ManagementBilling') ? 'tab-tit' : 'tab-subtit'">청구 및 결제관리</h2>
        </router-link>
      </li>
      <li class="tab">
        <router-link class="tab-title" :to="{ name: 'ManagementTax' }">
          <h2 :class="isMenuActive('ManagementTax') ? 'tab-tit' : 'tab-subtit'">세금계산서 발행 조회</h2>
        </router-link>
      </li>
    </ul>
    <ul v-if="isMenuActive('ManagementReport')">
      <li class="tab">
        <router-link class="tab-title" :to="{ name: 'ManagementReport' }">
          <h2 :class="isMenuActive('ManagementReport') ? 'tab-tit' : 'tab-subtit'">점검현황</h2>
        </router-link>
      </li>
      <li class="tab">
        <router-link class="tab-title" :to="{ name: 'ManagementReport' }">
          <h2 :class="isMenuActive('ManagementReport') ? 'tab-tit' : 'tab-subtit'">점검 보고서</h2>
        </router-link>
      </li>
      <li class="tab">
        <router-link class="tab-title" :to="{ name: 'ManagementReport' }">
          <h2 :class="isMenuActive('ManagementReport') ? 'tab-tit' : 'tab-subtit'">적합/부적합 결과</h2>
        </router-link>
      </li>
    </ul>
    <ul v-if="isMenuActive('ManagementCompanyinfo') || isMenuActive('ManagementCompanylicene') || isMenuActive('ManagementUser') || isMenuActive('ManagementDepartment')">
      <li class="tab">
        <router-link class="tab-title" :to="{ name: 'ManagementCompanyinfo' }">
          <h2 :class="isMenuActive('ManagementCompanyinfo') ? 'tab-tit' : 'tab-subtit'">기본정보 관리</h2>
        </router-link>
      </li>
      <li class="tab">
        <router-link class="tab-title" :to="{ name: 'ManagementCompanylicene' }">
          <h2 :class="isMenuActive('ManagementCompanylicene') ? 'tab-tit' : 'tab-subtit'">보유면허 관리</h2>
        </router-link>
      </li>
      <li class="tab">
        <router-link class="tab-title" :to="{ name: 'ManagementUser' }">
          <h2 :class="isMenuActive('ManagementUser') ? 'tab-tit' : 'tab-subtit'">소속회원 관리</h2>
        </router-link>
      </li>
      <li class="tab">
        <router-link class="tab-title" :to="{ name: 'ManagementDepartment' }">
          <h2 :class="isMenuActive('ManagementDepartment') ? 'tab-tit' : 'tab-subtit'">팀 관리</h2>
        </router-link>
      </li>
    </ul>
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

const isMenuActive = routeName => routeName === route.name

onMounted(async () => {})
</script>
