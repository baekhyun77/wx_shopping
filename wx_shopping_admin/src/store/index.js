import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user
  },
  mutations: {
    login (userInfo, user) {
      userInfo.user = user
      window.localStorage.setItem('user', JSON.stringify(user))
    },
    exitSystem(userInfo) {
      window.localStorage.removeItem('user')
      userInfo.user = '';
    }
  },
  getters
})

export default store
