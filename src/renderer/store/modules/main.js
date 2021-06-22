import {clipboard, ipcRenderer, remote} from "electron";
import { v4 as uuidv4 } from 'uuid';
import {
  getWindowHeight,
  searchKeyValues,
  downloadFunc,
  sysFile,
  mergePlugins,
  find,
  downloadZip,
} from '../../assets/common/utils';
import systemMethod from '../../assets/common/system';
import fs from "fs";
import path from 'path';

const state = {
  selected: null,
  options: [],
  showMain: false,
  current: ['market'],
  searchValue: '',
  devPlugins: mergePlugins(sysFile.getUserPlugins() || []),
  subPlaceHolder: '',
}

const mutations = {
  commonUpdate (state, payload) {
    Object.keys(payload).forEach((key) => {
      state[key] = payload[key];
      if (key === 'devPlugins') {
        sysFile.savePlugins(payload)
      }
    });
  },
  setSubPlaceHolder(state, payload) {
    state.subPlaceHolder = payload;
  },
  deleteDevPlugin(state, payload) {
    state.devPlugins = state.devPlugins.filter(plugin => plugin.name !== payload.name);
    sysFile.savePlugins(state.devPlugins);
  },
  deleteProdPlugin(state, payload) {
    state.devPlugins = state.devPlugins.filter(plugin => plugin.id !== payload.id);
    sysFile.savePlugins(state.devPlugins);
    // todo 删除 static 目录下的对应插件
  },
  devPluginStatusChange(state, payload) {
    state.devPlugins.forEach(plugin => {
      if (plugin.name === payload.name) {
        plugin.status = !plugin.status;
      }
    });
    state.devPlugins = [...state.devPlugins];
    sysFile.savePlugins(state.devPlugins);
  }
}

const actions = {
  showMainUI ({ commit, state }, paylpad) {
    ipcRenderer.send('changeWindowSize-rubick', {
      height: getWindowHeight(),
    });
    setTimeout(() => {
      commit('commonUpdate', {
        showMain: true,
        selected: {
          key: 'market',
          name: '插件中心'
        }
      });
    }, 50);
  },
  reloadDevPlugin({ commit }, payload) {
    const config = JSON.parse(fs.readFileSync(path.join(payload.sourceFile, '../plugin.json'), 'utf-8'));
    const pluginConfig = {
      ...config,
      sourceFile: path.join(payload.sourceFile, `../${config.main}`),
    };
    const devPlugins = [...state.devPlugins];
    commit('commonUpdate', {
      devPlugins: devPlugins.map(plugin => {
        if (plugin.name === payload.name) {
          return {
            ...plugin,
            ...pluginConfig,
          }
        }
        return plugin;
      })
    })
  },
  onSearch ({ commit }, paylpad) {
    if (state.selected && state.selected.key !== 'plugin-container') {
      commit('commonUpdate', {searchValue: ''});
      return;
    }
    const value = paylpad.value;
    // 在插件界面
    if((state.selected && state.selected.key === 'plugin-container') || paylpad.searchType === 'subWindow') {
      commit('commonUpdate', {searchValue: value})
      return;
    }
    const fileUrl = clipboard.read('public.file-url').replace('file://', '');
    commit('commonUpdate', {searchValue: value})
    // 复制文件
    if (fileUrl && value === 'plugin.json') {
      const config = JSON.parse(fs.readFileSync(fileUrl, 'utf-8'));

      const pluginConfig = {
        ...config,
        sourceFile: path.join(fileUrl, `../${config.main || 'index.html'}`),
        id: uuidv4(),
        type: 'dev',
        icon: 'image://' + path.join(fileUrl, `../${config.logo}`),
        subType: (() => {
          if (config.main) {
            return ''
          }
          return 'template';
        })()
      };
      commit('commonUpdate', {
        selected: {
          key: 'plugin',
          name: 'plugin.json'
        },
        searchValue: '',
        devPlugins: [pluginConfig, ...state.devPlugins],
        options: [
          {
            name: '新建rubick开发插件',
            value: 'new-plugin',
            icon: 'plus-circle',
            desc: '新建rubick开发插件',
            click: (router) => {
              commit('commonUpdate', {
                showMain: true,
                selected: {
                  key: 'plugin',
                  name: '新建rubick开发插件'
                },
                current: ['dev'],
              });
              ipcRenderer.send('changeWindowSize-rubick', {
                height: getWindowHeight(),
              });
              router.push('/home/dev')
            }
          },
          {
            name: '复制路径',
            desc: '复制路径',
            value: 'copy-path',
            icon: 'plus-circle',
            click: () => {
              clipboard.writeText(fileUrl)
            }
          }
        ]
      });
      // 调整窗口大小
      ipcRenderer.send('changeWindowSize-rubick', {
        height: getWindowHeight(state.options),
      });
      return
    }

    let options = [];

    // check 是否是插件
    if (value) {
      state.devPlugins.forEach((plugin) => {
        // dev 插件未开启
        if (plugin.type === 'dev' && !plugin.status) return;
        const feature = plugin.features;
        feature.forEach(fe => {
          const cmds = searchKeyValues(fe.cmds, value);
          options = [
            ...options,
            ...cmds.map((cmd) => ({
              name: cmd,
              value: 'plugin',
              icon: plugin.sourceFile ? 'image://' + path.join(plugin.sourceFile, `../${plugin.logo}`) : plugin.logo,
              desc: fe.explain,
              type: plugin.type,
              click: (router) => {
                actions.openPlugin({commit}, {cmd, plugin, feature: fe, router});
              }
            }))
          ]
        })
      });
    }

    commit('commonUpdate', {
      options
    });
    ipcRenderer.send('changeWindowSize-rubick', {
      height: getWindowHeight(state.options),
    });
  },
  async downloadPlugin({commit}, payload) {
    await downloadZip(payload.gitUrl, payload.name);
    const fileUrl = find(path.join(__static, `plugins/${payload.name}-master`));
    // 复制文件
    const config = JSON.parse(fs.readFileSync(`${fileUrl}/plugin.json`, 'utf-8'));
    const pluginConfig = {
      ...config,
      id: uuidv4(),
      sourceFile: `${fileUrl}/${config.main}`,
      type: 'prod'
    };
    commit('commonUpdate', {
      devPlugins: [pluginConfig, ...state.devPlugins],
    });
  },
  openPlugin({commit}, {cmd, plugin, feature, router}) {
    commit('commonUpdate', {
      selected: {
        key: 'plugin-container',
        name: cmd,
        icon: 'image://' + path.join(plugin.sourceFile, `../${plugin.logo}`),
      },
      searchValue: '',
      showMain: true
    });
    ipcRenderer.send('changeWindowSize-rubick', {
      height: getWindowHeight(),
    });
    if (plugin.type === 'system') {
      systemMethod[plugin.tag][feature.code]()
      commit('commonUpdate', {
        selected: null,
        showMain: false,
        options: [],
      });
      ipcRenderer.send('changeWindowSize-rubick', {
        height: getWindowHeight([]),
      });
      router.push({
        path: '/home',
      });
      return;
    }
    router.push({
      path: '/plugin',
      query: {
        ...plugin,
        detail: JSON.stringify(feature)
      },
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
