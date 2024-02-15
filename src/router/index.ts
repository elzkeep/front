import { createWebHistory, createRouter } from 'vue-router'
import { useStore } from "vuex"

import SignIn from '~/views/SignIn.vue'
import SignUp from '~/views/SignUp.vue'

import ManagementCompany from '~/views/management/Company.vue'
import ManagementDepartment from '~/views/management/Department.vue'
import ManagementUser from '~/views/management/User.vue'
import ManagementLicense from '~/views/management/License.vue'
import ManagementBuilding from '~/views/management/Building.vue'
import ManagementCustomer from '~/views/management/Customer.vue'

import BuildingFacility from '~/views/building/Facility.vue'

import store from '~/store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: SignIn
  },  
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/management/company',
    name: 'ManagementCompany',
    meta: { authorization: ['admin'] },
    component: ManagementCompany
  },
  {
    path: '/management/department',
    name: 'ManagementDepartment',
    meta: { authorization: ['admin'] },
    component: ManagementDepartment
  },
  {
    path: '/management/user',
    name: 'ManagementUser',
    meta: { authorization: ['admin'] },
    component: ManagementUser
  },
  {
    path: '/management/license',
    name: 'ManagementLicene',
    meta: { authorization: ['admin'] },
    component: ManagementLicense
  },
  {
    path: '/management/building',
    name: 'ManagementBuilding',
    meta: { authorization: ['admin'] },
    component: ManagementBuilding
  },
  {
    path: '/management/customer',
    name: 'ManagementCustomer',
    meta: { authorization: ['admin'] },
    component: ManagementCustomer
  },
  {
    path: '/building/:id/facility',
    name: 'BuildingFacility',
    meta: { authorization: ['admin'] },
    component: BuildingFacility
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach(function (to, from, next) {
  const { authorization } = to.meta
  
  if (store.state.token == '') {
    if (to.path === '/signin') {
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
    if (level == 'normal' || level == 'manager') {  
      const user = store.getters['getUser']
      if (user == undefined) {
        next('/signin')
      } else {
        next(`/management/user`)
      }
    } else {
      next('/management/company')
    }
  } else {
    next()
  }
})

export default router
