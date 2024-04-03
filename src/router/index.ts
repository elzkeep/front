import { createWebHistory, createRouter } from 'vue-router'
import { useStore } from 'vuex'

import SignIn from '~/views/SignIn.vue'
import SignUp from '~/views/SignUp.vue'
import FindId from '~/views/FindId.vue'

import AdminDashboard from '~/views/admin/Dashboard.vue'
import AdminCompany from '~/views/admin/Company.vue'
import AdminCompanyinfo from '~/views/admin/Companyinfo.vue'
import AdminDepartment from '~/views/admin/Department.vue'
import AdminUser from '~/views/admin/User.vue'
import AdminLicense from '~/views/admin/License.vue'
import AdminCompanylicense from '~/views/admin/Companylicense.vue'
import AdminBuilding from '~/views/admin/Building.vue'
import AdminCustomer from '~/views/admin/Customer.vue'
import AdminBilling from '~/views/admin/Billing.vue'
import AdminReport from '~/views/admin/Report.vue'
import AdminStatistics from '~/views/admin/Statistics.vue'

import ManagementDashboard from '~/views/management/Dashboard.vue'
import ManagementCompany from '~/views/management/Company.vue'
import ManagementCompanyinfo from '~/views/management/Companyinfo.vue'
import ManagementDepartment from '~/views/management/Department.vue'
import ManagementUser from '~/views/management/User.vue'
import ManagementLicense from '~/views/management/License.vue'
import ManagementCompanylicense from '~/views/management/Companylicense.vue'
import ManagementBuilding from '~/views/management/Building.vue'
import ManagementCustomer from '~/views/management/Customer.vue'
import ManagementBilling from '~/views/management/Billing.vue'
import ManagementReport from '~/views/management/Report.vue'
import ManagementStatistics from '~/views/management/Statistics.vue'
import ManagementCustomercompany from '~/views/management/Customercompany.vue'
import ManagementContract from '~/views/management/Contract.vue'
import ManagementPayment from '~/views/management/Payment.vue'
import ManagementFacility from '~/views/management/Facility.vue'

import BuildingFacility from '~/views/building/Facility.vue'

import store from '~/store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: SignIn,
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn,
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
  },
  {
    path: '/findid',
    name: 'FindId',
    component: FindId,
  },

  {
    path: '/management/statistics',
    name: 'ManagementStatistics',
    meta: { authorization: ['admin'] },
    component: ManagementStatistics,
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    meta: { authorization: ['admin'] },
    component: AdminDashboard,
  },
  {
    path: '/admin/company',
    name: 'AdminCompany',
    meta: { authorization: ['admin'] },
    component: AdminCompany,
  },
  {
    path: '/admin/companyinfo',
    name: 'AdminCompanyinfo',
    meta: { authorization: ['admin'] },
    component: AdminCompanyinfo,
  },
  {
    path: '/admin/department',
    name: 'AdminDepartment',
    meta: { authorization: ['admin'] },
    component: AdminDepartment,
  },
  {
    path: '/admin/user',
    name: 'AdminUser',
    meta: { authorization: ['admin'] },
    component: AdminUser,
  },
  {
    path: '/admin/license',
    name: 'AdminLicene',
    meta: { authorization: ['admin'] },
    component: AdminLicense,
  },
  {
    path: '/admin/companylicense',
    name: 'AdminCompanylicene',
    meta: { authorization: ['admin'] },
    component: AdminCompanylicense,
  },
  {
    path: '/admin/building',
    name: 'AdminBuilding',
    meta: { authorization: ['admin'] },
    component: AdminBuilding,
  },
  {
    path: '/admin/customer',
    name: 'AdminCustomer',
    meta: { authorization: ['admin'] },
    component: AdminCustomer,
  },
  {
    path: '/admin/billing',
    name: 'AdminBilling',
    meta: { authorization: ['admin'] },
    component: AdminBilling,
  },
  {
    path: '/admin/report',
    name: 'AdminReport',
    meta: { authorization: ['admin'] },
    component: AdminReport,
  },
  {
    path: '/admin/statistics',
    name: 'AdminStatistics',
    meta: { authorization: ['admin'] },
    component: AdminStatistics,
  },
  {
    path: '/building/:id/facility',
    name: 'BuildingFacility',
    meta: { authorization: ['admin'] },
    component: BuildingFacility,
  },

  {
    path: '/management/dashboard',
    name: 'ManagementDashboard',
    meta: { authorization: ['admin'] },
    component: ManagementDashboard,
  },
  {
    path: '/management/company',
    name: 'ManagementCompany',
    meta: { authorization: ['admin'] },
    component: ManagementCompany,
  },
  {
    path: '/management/companyinfo',
    name: 'ManagementCompanyinfo',
    meta: { authorization: ['admin'] },
    component: ManagementCompanyinfo,
  },
  {
    path: '/management/department',
    name: 'ManagementDepartment',
    meta: { authorization: ['admin'] },
    component: ManagementDepartment,
  },
  {
    path: '/management/user',
    name: 'ManagementUser',
    meta: { authorization: ['admin'] },
    component: ManagementUser,
  },
  {
    path: '/management/license',
    name: 'ManagementLicene',
    meta: { authorization: ['admin'] },
    component: ManagementLicense,
  },
  {
    path: '/management/companylicense',
    name: 'ManagementCompanylicene',
    meta: { authorization: ['admin'] },
    component: ManagementCompanylicense,
  },
  {
    path: '/management/building',
    name: 'ManagementBuilding',
    meta: { authorization: ['admin'] },
    component: ManagementBuilding,
  },
  {
    path: '/management/customer',
    name: 'ManagementCustomer',
    meta: { authorization: ['admin'] },
    component: ManagementCustomer,
  },
  {
    path: '/management/customercompany',
    name: 'ManagementCustomercompany',
    meta: { authorization: ['admin'] },
    component: ManagementCustomercompany,
  },
  {
    path: '/management/billing',
    name: 'ManagementBilling',
    meta: { authorization: ['admin'] },
    component: ManagementBilling,
  },
  {
    path: '/management/report',
    name: 'ManagementReport',
    meta: { authorization: ['admin'] },
    component: ManagementReport,
  },
  {
    path: '/management/contract',
    name: 'ManagementContract',
    meta: { authorization: ['admin'] },
    component: ManagementContract,
  },
  {
    path: '/management/payment',
    name: 'ManagementPayment',
    meta: { authorization: ['admin'] },
    component: ManagementPayment,
  },
  {
    path: '/management/facility/:id',
    name: 'ManagementFacility',
    meta: { authorization: ['admin'] },
    component: ManagementFacility,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(function (to, from, next) {
  const { authorization } = to.meta

  if (store.state.token == '') {
    if (to.path === '/signin' || to.path == '/signup' || to.path == '/findid' || to.path == '/findpasswd') {
      next()
    } else {
      next('/signin')
    }

    return
  }

  const level = store.getters['getLevel']

  if (authorization != undefined && !authorization.includes(level)) {
    next('/not-found')

    return
  }

  if (to.path === '/signin' || to.path == '/') {
    const user = store.getters['getUser']
    if (user == undefined) {
      next('/signin')
    } else if (user.level != 4) {
      next(`/management/dashboard`)
    } else {
      next('/admin/company')
    }
  } else {
    next()
  }
})

export default router
