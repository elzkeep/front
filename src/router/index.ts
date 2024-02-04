import { createWebHistory, createRouter } from 'vue-router'
import { useStore } from "vuex"

import SignIn from '~/views/SignIn.vue'
import SignUp from '~/views/SignUp.vue'

import ManagementSettingUser from '~/views/management/setting/User.vue'

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
    path: '/management/setting/user',
    name: 'ManagementSettingUser',
    meta: { authorization: ['admin'] },
    component: ManagementSettingUser
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
      const apt = store.getters['getUser'].apt
      if (apt == undefined) {
        next('/signin')
      } else {
        next(`/${apt}/apt/apt`)
      }
    } else {
      next('/management/setting/user')
    }
  } else {
    next()
  }
})

export default router
