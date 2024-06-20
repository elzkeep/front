<template>
  <div :class="{ shrink: store.getters['getNav'] }">
    <nav>
      <div class="img-border">
        <h1 v-if="store.getters['getNav']"><img alt="zkeep" src="../../assets/image.svg" /></h1>
        <div :class="{ profile: !store.getters['getNav'] }" class="hiden">
          <div class="profile-top">
            <div class="profile-logo">
              <img src="../../assets/logo.svg" />
            </div>
            <div class="profile-icon" @click="store.commit('setNav')"><img class="side-icon" alt="menu" src="../../assets/icon/menu.svg" /></div>
          </div>
          <div class="profile-box">
            <div class="group"><img :src="data.user.profile" /></div>
            <div style="margin-top: 13px">
              <span style="font-size: 14px; font-weight: 500" v-if="data.session.level == 3">관리자</span>
              <span style="font-size: 14px; font-weight: 500" v-if="data.session.level != 3">{{ data.session.name }}</span>
            </div>
            <div style="margin-top: 5px">
              <span style="font-size: 12px; font-weight: 500">{{ data.companyName }}</span>
            </div>
            <div style="margin-top: 5px">
              <span style="font-size: 12px; font-weight: 400">{{ data.departmentName }}</span>
            </div>
          </div>
        </div>
      </div>
      <ul class="menu">
        <li :class="{ on: isMenuActive('ManagementDashboard') }">
          <router-link :to="{ name: 'ManagementDashboard' }">
            <img v-if="!store.getters['getNav'] && !isMenuActive('ManagementDashboard')" class="side-icon" alt="approval" src="../../assets/icon/fill/fill_piechart.svg" />
            <img v-if="store.getters['getNav'] || isMenuActive('ManagementDashboard')" class="side-icon" alt="piechart" src="../../assets/icon/piechart.svg" />
            <h3 class="check-tit hiden">대쉬보드</h3>
          </router-link>
        </li>
        <li style="display: block" :class="{ on: isMenuActive('ManagementCustomercompany') || isMenuActive('ManagementCustomer') }">
          <router-link :to="{ name: 'ManagementCustomer' }">
            <div class="icon">
              <img
                v-if="!store.getters['getNav'] && !isMenuActive('ManagementCustomercompany') && !isMenuActive('ManagementCustomer')"
                class="side-icon"
                alt="approval"
                src="../../assets/icon/fill/fill_team.svg"
              />
              <img v-if="store.getters['getNav'] || isMenuActive('ManagementCustomercompany') || isMenuActive('ManagementCustomer')" class="side-icon" alt="team" src="../../assets/icon/team.svg" />
            </div>
            <span class="check-tit hiden">고객관리</span>
          </router-link>
          <ul v-if="!store.getters['getNav'] && (isMenuActive('ManagementCustomercompany') || isMenuActive('ManagementCustomer'))" class="subtit-ul">
            <li class="subtit-li">
              <router-link :to="{ name: 'ManagementCustomercompany' }">
                <span class="check-tit hiden" :class="{ subtit: isMenuActive('ManagementCustomercompany') }">고객현황</span>
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'ManagementCustomer' }">
                <span class="check-tit hiden" :class="{ subtit: isMenuActive('ManagementCustomer') }">건물 및 계약관리</span>
              </router-link>
            </li>
          </ul>
        </li>
        <li style="display: block" :class="{ on: isMenuActive('ManagementStatistics') || isMenuActive('ManagementBilling') || isMenuActive('ManagementTax') }">
          <router-link :to="{ name: 'ManagementBilling' }">
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
            <h3 class="check-tit hiden">매출관리</h3>
          </router-link>
          <ul v-if="!store.getters['getNav'] && (isMenuActive('ManagementStatistics') || isMenuActive('ManagementBilling') || isMenuActive('ManagementTax'))" class="subtit-ul">
            <li class="subtit-li">
              <router-link :to="{ name: 'ManagementStatistics' }">
                <span class="check-tit hiden" :class="{ subtit: isMenuActive('ManagementStatistics') }">매출 현황</span>
              </router-link>
            </li>
            <li class="subtit-mi">
              <router-link :to="{ name: 'ManagementBilling' }">
                <span class="check-tit hiden" :class="{ subtit: isMenuActive('ManagementBilling') }">지로 청구 및 관리</span>
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'ManagementTax' }">
                <span class="check-tit hiden" :class="{ subtit: isMenuActive('ManagementTax') }">세금계산서 발행</span>
              </router-link>
            </li>
          </ul>
        </li>
        <li style="display: block" :class="{ on: isMenuActive('ManagementReport') }">
          <router-link :to="{ name: 'ManagementReport' }">
            <img v-if="!store.getters['getNav'] && !isMenuActive('ManagementReport')" class="side-icon" alt="approval" src="../../assets/icon/fill/fill_setting.svg" />
            <img v-if="store.getters['getNav'] || isMenuActive('ManagementReport')" class="side-icon" alt="setting" src="../../assets/icon/setting.svg" />
            <h3 class="check-tit hiden">점검관리</h3>
          </router-link>
          <ul v-if="!store.getters['getNav'] && isMenuActive('ManagementReport')" class="subtit-ul">
            <li class="subtit-li" style="padding-bottom: 15px">
              <router-link :to="{ name: 'ManagementReport' }">
                <span class="check-tit hiden" :class="{ subtit: isMenuActive('ManagementReport') }">점검관리</span>
              </router-link>
            </li>
          </ul>
        </li>
        <li
          style="display: block"
          :class="{ on: isMenuActive('ManagementCompanyinfo') || isMenuActive('ManagementCompanylicene') || isMenuActive('ManagementUser') || isMenuActive('ManagementDepartment') }"
        >
          <router-link :to="{ name: 'ManagementCompanyinfo' }">
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
            <h3 class="check-tit hiden">사업자 관리</h3>
          </router-link>
          <ul
            v-if="
              !store.getters['getNav'] && (isMenuActive('ManagementCompanyinfo') || isMenuActive('ManagementCompanylicene') || isMenuActive('ManagementUser') || isMenuActive('ManagementDepartment'))
            "
            class="subtit-ul"
          >
            <li class="subtit-li">
              <router-link :to="{ name: 'ManagementCompanyinfo' }">
                <span class="check-tit hiden" :class="{ subtit: isMenuActive('ManagementCompanyinfo') }">기본정보 관리</span>
              </router-link>
            </li>
            <li class="subtit-mi">
              <router-link :to="{ name: 'ManagementCompanylicene' }">
                <span class="check-tit hiden" :class="{ subtit: isMenuActive('ManagementCompanylicene') }">보유면허 관리</span>
              </router-link>
            </li>
            <li class="subtit-mi">
              <router-link :to="{ name: 'ManagementUser' }">
                <span class="check-tit hiden" :class="{ subtit: isMenuActive('ManagementUser') }">소속회원 관리</span>
              </router-link>
            </li>
            <li>
              <router-link :to="{ name: 'ManagementDepartment' }">
                <span class="check-tit hiden" :class="{ subtit: isMenuActive('ManagementDepartment') }">팀 관리</span>
              </router-link>
            </li>
          </ul>
        </li>
        <!-- 커뮤니케이션
        <li style="display: block" :class="{ on: isMenuActive('ManagementDashboard') }">
          <router-link :to="{ name: 'ManagementDashboard' }" >
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
import { Company, Department } from '~/models'
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
  user: {
    name: '홍길동',
  },
  companyName: '',
  departmentName: '',
})

onMounted(async () => {
  data.session = store.getters['getUser']
  let res = await Company.get(store.getters['getUser'].company)
  data.companyName = res.item.name
  let res2 = await Department.get(store.getters['getUser'].department)
  if (res2.item != null) {
    data.departmentName = res2.item.name
  }
  data.company = store.getters['getCompany']
})

const isWork = () => data.company.type == Company.type.work
const isBuilding = () => data.company.type == Company.type.building
const isAdmin = () => data.session.level == 4

const isMenuActive = routeName => routeName === route.name
</script>
