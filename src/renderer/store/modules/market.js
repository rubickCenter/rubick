import axios from 'axios'

const state = {
  allPlugins: [],
  sysPlugins: []
}

const mutations = {
  commonUpdate (state, payload) {
    Object.keys(payload).forEach((key) => {
      state[key] = payload[key]
      console.log(state)
    })
  }
}

const actions = {
  getPlugins ({commit}) {
    axios.get('https://gitee.com/monkeyWang/rubick-plugin-center/raw/master/plugin.json').then(res => {
      commit('commonUpdate', {
        allPlugins: res.data
      })
    })
    axios.get('https://gitee.com/monkeyWang/rubick-plugin-center/raw/master/sys-plugin.json').then(res => {
      commit('commonUpdate', {
        sysPlugins: res.data
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
