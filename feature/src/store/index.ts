import { createStore } from 'vuex';
import request from '@/assets/request';

const isDownload = (item: Market.Plugin, targets: any[]) => {
  let isDownload = false;
  targets.some((plugin) => {
    if (plugin.name === item.name) {
      isDownload = true;
    }
    return isDownload;
  });
  return isDownload;
};

export default createStore({
  state: {
    totalPlugins: [],
    localPlugins: [],
    searchValue: '',
    active: ['finder'],
  },
  mutations: {
    commonUpdate(state: any, payload) {
      Object.keys(payload).forEach((key) => {
        state[key] = payload[key];
      });
    },
    setSearchValue(state: any, payload) {
      state.searchValue = payload;
    },
  },
  actions: {
    async init({ commit }) {
      const totalPlugins = await request.getTotalPlugins();
      const localPlugins = window.market.getLocalPlugins();

      totalPlugins.forEach((origin: Market.Plugin) => {
        origin.isdownload = isDownload(origin, localPlugins);
        origin.isloading = false;
      });
      // 修复卸载失败，一直转圈的问题。
      localPlugins.forEach((origin: Market.Plugin) => {
        origin.isloading = false;
      });

      commit('commonUpdate', {
        localPlugins,
        totalPlugins,
      });
    },
    startDownload({ commit, state }, name) {
      const totalPlugins = JSON.parse(JSON.stringify(state.totalPlugins));
      totalPlugins.forEach((origin: Market.Plugin) => {
        if (origin.name === name) {
          origin.isloading = true;
        }
      });
      commit('commonUpdate', {
        totalPlugins,
      });
    },

    startUnDownload({ commit, state }, name) {
      const localPlugins = window.market.getLocalPlugins();
      localPlugins.forEach((origin: Market.Plugin) => {
        if (origin.name === name) {
          origin.isloading = true;
        }
      });
      commit('commonUpdate', {
        localPlugins,
      });
    },

    errorUnDownload({ commit, state }, name) {
      const localPlugins = window.market.getLocalPlugins();
      // 修复卸载失败，一直转圈的问题。
      localPlugins.forEach((origin: Market.Plugin) => {
        if (origin.name === name) {
          origin.isloading = false;
        }
      });

      commit('commonUpdate', {
        localPlugins,
      });
    },

    successDownload({ commit, state }, name) {
      const totalPlugins = JSON.parse(JSON.stringify(state.totalPlugins));
      totalPlugins.forEach((origin: Market.Plugin) => {
        if (origin.name === name) {
          origin.isloading = false;
          origin.isdownload = true;
        }
      });
      const localPlugins = window.market.getLocalPlugins();

      commit('commonUpdate', {
        totalPlugins,
        localPlugins,
      });
    },

    async updateLocalPlugin({ commit }) {
      const localPlugins = window.market.getLocalPlugins();
      const totalPlugins = await request.getTotalPlugins();

      totalPlugins.forEach((origin: Market.Plugin) => {
        origin.isdownload = isDownload(origin, localPlugins);
        origin.isloading = false;
      });

      commit('commonUpdate', {
        localPlugins,
        totalPlugins,
      });
    },
  },
  modules: {},
});
