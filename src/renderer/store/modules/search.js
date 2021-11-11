import { execSync } from 'child_process'
import path from 'path'
import {mergePlugins} from '../../../common/utils'
import PluginsLoader from '../../../common/utils/pluginsLoader'

function searchKeyValues (lists, value) {
  return lists.filter((item) => {
    if (typeof item === 'string') {
      return item.toLowerCase().indexOf(value.toLowerCase()) >= 0
    }
    return item.type.toLowerCase().indexOf(value.toLowerCase()) >= 0
  })
}

const dbItemName = 'main'
let db = {}

const state = {
  searchList: [],
  totalPlugins: [],
  searchValue: '',
  uiPlugins: []
}

const _rev = {
  total: '',
  cache: ''
}

const pluginsLoader = new PluginsLoader()

const mutations = {
  async updateSearchList (state, payload) {
    state.searchList = payload
    const result = await db.put(dbItemName, {
      _id: 'cachePlugins',
      data: JSON.parse(JSON.stringify(payload)),
      _rev: _rev.cache
    })
    _rev.cache = result.rev
  },
  async updateTotalPlugins (state, payload) {
    state.totalPlugins = payload
    const result = await db.put(dbItemName, {
      _id: 'totalPlugins',
      data: JSON.parse(JSON.stringify(payload)),
      _rev: _rev.total
    })
    _rev.total = result.rev
  },
  commonUpdate (state, payload) {
    Object.keys(payload).forEach((key) => {
      state[key] = payload[key]
    })
  },
  updateUIPlugins (state, payload) {
    console.log(payload)
    state.uiPlugins = payload
  }
}

const actions = {
  async init ({commit, dispatch, rootState}) {
    await pluginsLoader.init()

    db = pluginsLoader.db

    const totalPlugins = (await db.get(dbItemName, 'totalPlugins')) || {data: []}
    const cachePlugins = (await db.get(dbItemName, 'cachePlugins')) || {data: []}
    _rev.total = totalPlugins._rev
    _rev.cache = cachePlugins._rev

    let distPlugins = mergePlugins(cachePlugins.data, totalPlugins.data)

    commit('updateSearchList', distPlugins)
    commit('updateTotalPlugins', distPlugins)
    const uiPlugins = await pluginsLoader.getUIPlugin()

    commit('updateUIPlugins', uiPlugins)

    const apps = await pluginsLoader.getAppList()
    distPlugins = mergePlugins(state.searchList, apps)
    commit('updateSearchList', distPlugins)
    commit('updateTotalPlugins', distPlugins)
    // 更新完成后需要重新filter
    actions.onSearch({commit, state}, state.searchValue)
  },
  onSearch ({commit, state}, value) {
    let options = []
    const plugins = JSON.parse(JSON.stringify(state.totalPlugins))
    const uiPlugins = JSON.parse(JSON.stringify(state.uiPlugins))
    if (!value) {
      commit('updateSearchList', plugins)
      return
    }
    // check 是否是插件
    if (value) {
      commit('commonUpdate', {
        searchValue: value
      })
      uiPlugins.forEach((plugin) => {
        // dev 插件未开启
        if (plugin.type === 'dev' && !plugin.status) return
        const feature = plugin.features
        feature.forEach((fe) => {
          const cmds = searchKeyValues(fe.cmds, value)
          options = [
            ...options,
            ...cmds.map((cmd) => ({
              name: cmd,
              value: 'plugin',
              icon: plugin.sourceFile
                ? 'image://' + path.join(plugin.sourceFile, `../${plugin.logo}`)
                : plugin.logo,
              desc: fe.explain,
              type: plugin.type,
              click: (router) => {
                actions.openPlugin(
                  { commit },
                  { cmd, plugin, feature: fe, router }
                )
              }
            }))
          ]
        })
      })

      let descMap = new Map()
      options = [
        ...options,
        ...plugins
          .filter((plugin) => {
            if (!descMap.get(plugin)) {
              descMap.set(plugin, true)
              let has = false
              plugin.keyWords && plugin.keyWords.some((keyWord) => {
                if (
                  keyWord
                    .toLocaleUpperCase()
                    .indexOf(value.toLocaleUpperCase()) >= 0
                ) {
                  has = keyWord
                  plugin.name = keyWord
                  return true
                }
                return false
              })
              return has
            } else {
              return false
            }
          })
          .map((plugin) => {
            plugin.click = () => {
              actions.openPlugin({ commit }, { plugin })
            }
            return plugin
          })
      ]

      descMap = null
    }

    commit('updateSearchList', options)
  },
  openPlugin ({commit}, plugin) {
    if (plugin.type === 'app') {
      execSync(plugin.action)
      commit('commonUpdate', {
        selected: null,
        showMain: false,
        options: [],
        searchValue: ''
      })
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
