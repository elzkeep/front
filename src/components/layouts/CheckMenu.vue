<template>
  <div class="navbody" :class="{ shrink: store.getters['getNav'] }">
    <nav>
      <div class="img-border">
        <h1 :class="{ hide: !store.getters['getNav'] }"><img alt="zkeep" src="../../assets/image.svg" /></h1>
        <div :class="{ profile: !store.getters['getNav'], hide: store.getters['getNav'] }">
          <div class="profile-top">
            <div class="profile-logo">
              <img src="../../assets/logo.png" width="19" height="19" />
              <span :class="{ hide: store.getters['getNav'] }" class="menu-tit">지킴</span>
            </div>
            <div class="profile-icon" @click="store.commit('setNav')"><img class="side-icon" alt="menu" src="../../assets/icon/menu.svg" /></div>
          </div>
        </div>
      </div>
      <ul class="menu">
        <li>
          <router-link :to="{ name: 'ManagementDashboard' }" :class="{ on: isMenuActive('ManagementDashboard') }">
            <img v-if="!store.getters['getNav'] && !isMenuActive('ManagementDashboard')" class="side-icon" alt="approval" src="../../assets/icon/fill/fill_piechart.svg" />
            <img v-if="store.getters['getNav'] || isMenuActive('ManagementDashboard')" class="side-icon" alt="piechart" src="../../assets/icon/piechart.svg" />
            <h3 :class="{ hide: store.getters['getNav'] }" class="check-tit">대쉬보드</h3>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'ManagementCustomercompany' }" :class="{ on: isMenuActive('ManagementCustomercompany') || isMenuActive('ManagementCustomer') }">
            <img
              v-if="!store.getters['getNav'] && !isMenuActive('ManagementCustomercompany') && !isMenuActive('ManagementCustomer')"
              class="side-icon"
              alt="approval"
              src="../../assets/icon/fill/fill_team.svg"
            />
            <img v-if="store.getters['getNav'] || isMenuActive('ManagementCustomercompany') || isMenuActive('ManagementCustomer')" class="side-icon" alt="team" src="../../assets/icon/team.svg" />
            <h3 :class="{ hide: store.getters['getNav'] }" class="check-tit">고객관리</h3>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'ManagementStatistics' }" :class="{ on: isMenuActive('ManagementStatistics') || isMenuActive('ManagementBilling') || isMenuActive('ManagementTax') }">
            <img
              v-if="!store.getters['getNav'] && !isMenuActive('ManagementStatistics') && !isMenuActive('ManagementBilling') && !isMenuActive('ManagementTax')"
              class="side-icon"
              alt="approval"
              src="../../assets/icon/fill/fill_document.svg"
            />
            <img
              v-if="store.getters['getNav'] || isMenuActive('ManagementStatistics') || isMenuActive('ManagementBilling') || isMenuActive('ManagementTax')"
              class="side-icon"
              alt="document"
              src="../../assets/icon/document.svg"
            />
            <h3 :class="{ hide: store.getters['getNav'] }" class="check-tit">매출 보고서</h3>
          </router-link>
        </li>
        <li>
          <router-link :to="{ name: 'ManagementReport' }" :class="{ on: isMenuActive('ManagementReport') }">
            <img v-if="!store.getters['getNav'] && !isMenuActive('ManagementReport')" class="side-icon" alt="approval" src="../../assets/icon/fill/fill_setting.svg" />
            <img v-if="store.getters['getNav'] || isMenuActive('ManagementReport')" class="side-icon" alt="setting" src="../../assets/icon/setting.svg" />
            <h3 :class="{ hide: store.getters['getNav'] }" class="check-tit">점검관리</h3>
          </router-link>
        </li>
        <li>
          <router-link
            :to="{ name: 'ManagementCompanyinfo' }"
            :class="{ on: isMenuActive('ManagementCompanyinfo') || isMenuActive('ManagementCompanylicene') || isMenuActive('ManagementUser') || isMenuActive('ManagementDepartment') }"
          >
            <img
              v-if="
                !store.getters['getNav'] &&
                !isMenuActive('ManagementCompanyinfo') &&
                !isMenuActive('ManagementCompanylicene') &&
                !isMenuActive('ManagementUser') &&
                !isMenuActive('ManagementDepartment')
              "
              class="side-icon"
              alt="approval"
              src="../../assets/icon/fill/fill_approval.svg"
            />
            <img
              v-if="
                store.getters['getNav'] || isMenuActive('ManagementCompanyinfo') || isMenuActive('ManagementCompanylicene') || isMenuActive('ManagementUser') || isMenuActive('ManagementDepartment')
              "
              class="side-icon"
              alt="approval"
              src="../../assets/icon/approval.svg"
            />
            <h3 :class="{ hide: store.getters['getNav'] }" class="check-tit">사업자 관리</h3>
          </router-link>
        </li>
        <!-- 커뮤니케이션
        <li>
          <router-link :to="{ name: 'ManagementDashboard' }" :class="{ on: isMenuActive('ManagementDashboard') }">
            <img class="side-icon" alt="conversation" src="../../assets/icon/conversation.svg" />
          </router-link>
        </li> -->
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import router from '~/router'
import { Company } from '~/models'
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
  data.company = store.getters['getCompany']
})

const isWork = () => data.company.type == Company.type.work
const isBuilding = () => data.company.type == Company.type.building
const isAdmin = () => data.session.level == 4

const isMenuActive = routeName => routeName === route.name
</script>
