// import Common from 'modules/service/CommonServices'
import Sign from 'modules/service/SignServices'
import Index from 'pages/index/router/index.js'
const login = {
  namespaced: true,
  state: {
    waitSecond: {},
    intervalId: null
  },
  mutations: {
    handleWaitSecondMutation (state, second) {
      if (state.isWaiting) {
        return
      }
      state.waitSecond = second
      state.intervalId = setInterval(_ => {
        state.waitSecond--
        if (state.waitSecond === 0) {
          clearInterval(state.intervalId)
          state.intervalId = null
        }
      }, 1000)
    }
  },
  actions: {
    handleMallsLoginAccount ({ commit, state }, instance) {
      commit('handleLoading', null, { root: true })
      // PhoneLoginAccount -> MallsLoginAccount
      Sign.MallsLoginAccount(instance).then(res => {
        commit('handleLoading', null, { root: true })
        if (res.data.ret === 1001) {
          let key = 'userInfo'
          sessionStorage.setItem('sessionKey', key)
          sessionStorage.setItem(key, JSON.stringify(res.data))
          Index.push('/')
        }
        if (res.data.ret === 1002) {
          window.confirm(res.data.code)
        }
      })
    },
    handlePhoneRegisterAction ({ commit, state }, instance) {
      commit('handleLoading', null, { root: true })
      Sign.PhoneRegisterAccount(instance).then(res => {
        commit('handleLoading', null, { root: true })
        if (res.data.ret === 1001) {
          if (window.confirm(res.data.code)) {
            Index.push({ name: 'login' })
          }
        }
        if (res.data.ret === 1002) {
          window.confirm(res.data.code)
        }
      })
    },
    handlePhoneForgotAction ({ commit, state }, instance) {
      commit('handleLoading', null, { root: true })
      Sign.PhonePasswordGet(instance).then(res => {
        commit('handleLoading', null, { root: true })
        if (res.data.ret === 1001) {
          if (window.confirm(res.data.code)) {
            Index.push({ name: 'login' })
          }
        }
        if (res.data.ret === 1002) {
          window.confirm(res.data.code)
        }
      })
    },
    handlePhoneSendSmsAction  ({ commit, state }, instance) {
      // style 1 登录 2 注册 3 找回密码
      let { phone, style } = instance
      if (!phone) {
        return window.confirm('手机号码不能为空')
      }
      commit('handleLoading', null, { root: true })
      commit('handleWaitSecondMutation', 60)
      Sign.SendSms({phone, style}).then(res => {
        commit('handleLoading', null, { root: true })
        if (res.data.ret === 1001) {
          window.confirm(res.data.code)
        }
        if (res.data.ret === 1002) {
          window.confirm(res.data.code)
        }
      })
    }
  }
}
export default login
