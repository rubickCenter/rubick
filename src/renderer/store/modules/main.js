import {clipboard, ipcRenderer} from "electron";
import {getWindowHeight, searchKeyValues, downloadFunc, sysFile} from '../../assets/common/utils';

import fs from "fs";
import path from 'path';

const state = {
  selected: null,
  options: [],
  showMain: false,
  current: ['market'],
  searchValue: '',
  devPlugins: sysFile.getUserPlugins() || [],
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
}

const actions = {
  showMainUI ({ commit, state }, paylpad) {
    commit('commonUpdate', {
      showMain: true,
      selected: {
        key: 'market',
        name: '插件中心'
      }
    });
    ipcRenderer.send('changeWindowSize', {
      height: getWindowHeight(),
    });
  },
  onSearch ({ commit }, paylpad) {
    const value = paylpad.target.value;
    const fileUrl = clipboard.read('public.file-url').replace('file://', '');
    commit('commonUpdate', {searchValue: value})
    // 复制文件
    if (fileUrl && value === 'plugin.json') {
      const config = JSON.parse(fs.readFileSync(fileUrl, 'utf-8'));

      const pluginConfig = {
        ...JSON.parse(fs.readFileSync(fileUrl, 'utf-8')),
        sourceFile: path.join(fileUrl, `../${config.main}`)
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
              ipcRenderer.send('changeWindowSize', {
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
      ipcRenderer.send('changeWindowSize', {
        height: getWindowHeight(state.options),
      });
      return
    }

    let options = [];

    // check 是否是插件
    state.devPlugins.forEach((plugin) => {
      const feature = plugin.features;
      feature.forEach(fe => {
        const cmds = searchKeyValues(fe.cmds, value);

        options = [
          ...options,
          ...cmds.map((cmd) => ({
            name: cmd,
            value: 'plugin',
            icon: 'plus-circle',
            desc: fe.explain,
            click: (router) => {
              commit('commonUpdate', {
                selected: {
                  key: cmd,
                  name: cmd
                },
                searchValue: '',
                showMain: true,
              });
              ipcRenderer.send('changeWindowSize', {
                height: getWindowHeight(),
              });
              router.push({
                path: '/plugin',
                query: plugin,
              })
            }
          }))
        ]
      })
    });

    commit('commonUpdate', {
      options
    });
    ipcRenderer.send('changeWindowSize', {
      height: getWindowHeight(state.options),
    });
  },
  async downloadPlugin({commit}, payload) {
    await downloadFunc(payload.gitUrl, payload.name);
    const fileUrl = path.join(__static, `plugins/${payload.name}`);
    // 复制文件
    const config = JSON.parse(fs.readFileSync(`${fileUrl}/plugin.json`, 'utf-8'));
    const pluginConfig = {
      ...config,
      sourceFile: `${fileUrl}/${config.main}`
    };
    commit('commonUpdate', {
      devPlugins: [pluginConfig, ...state.devPlugins],
    });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
