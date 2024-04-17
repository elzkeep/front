import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    token: '',
    user: null,
    company: null,
    nav: false,
  },
  mutations: {
    setToken(state, value) {
      state.token = value
    },
    setLogin(state, { token, user }) {
      state.token = token
      state.user = user
    },
    setCompany(state, company) {
      state.company = company
    },
    setLogout(state) {
      state.token = ''
      state.user = null
      state.company = null
    },
    setNav(state) {
      state.nav = !state.nav
    },
  },
  getters: {
    isLogin(state) {
      if (state.token == undefined || state.token == null || state.token == '') {
        return false
      }

      return true
    },
    getToken(state) {
      return state.token
    },
    getUser(state) {
      return state.user
    },
    getCompany(state) {
      return state.company
    },
    getLevel(state) {
      if (state.user == null) {
        return 'none'
      }

      if (state.user.level < 1 || state.user.level > 4) {
        return 'none'
      }

      const levels = ['none', 'normal', 'manager', 'admin', 'admin']

      return levels[state.user.level]
    },
    getNav(state) {
      return state.nav
    },
  },
  plugins: [createPersistedState()],
})
