import Vue from 'vue'
import Vuex from 'vuex'
import AuthService from '@/services/AuthService'
// import createPersistedState from 'core-js/core/object'

Vue.use(Vuex)
// 프로젝트 전반적으로 사용될 변수, 기능등을 담아두고 가져다 쓸 수 있게 함

export default new Vuex.Store({
  state: {
    url: process.env.VUE_APP_UR || null,
    token: localStorage.getItem('token') || null,
    user: localStorage.getItem('USER') || null,
    isLoggedIn: localStorage.getItem('token') || null
  },
  getters: {
    GE_URL(state) {
      return state.url
    },
    GE_TOKEN(state) {
      return state.token
    },
    GE_USER(state) {
      return state.user
    },
    GE_LOGGED_IN(state) {
      return state.isLoggedIn
    }
  },
  mutations: {
    // status 값을 직접적으로 바꿔줌

    MU_SET_TOKEN(state, token) {
      state.token = token
      if (token) {
        state.isLoggedIn = true
      } else {
        state.isLoggedIn = false
      }
    },
    MU_SET_USER(state, data) {
      state.user = data
    },
    MU_CLEAR_AUTH(state) {
      state.token = null
      state.user = null
      state.isLoggedIn = false
    }
  },
  actions: {
    AC_SIGN_IN({ commit }, token) {
      return new Promise((resolve, reject) => {
        AuthService.signIn(token)
          .then(response => {
            console.log(`AC_SIGN_IN -- response : `, response)
            commit(`MU_SET_TOKEN : `, response.data.token)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  },
  modules: {}
  // plugins: [createPersistedState()]
})
