import { reactive, toRefs, ref } from 'vue';
import { nativeImage, ipcRenderer } from 'electron';
import { getGlobal } from '@electron/remote';
import appSearch from '@/core/app-search';
import { PluginHandler } from '@/core';
import path from 'path';
import commonConst from '@/common/utils/commonConst';
import { execSync } from 'child_process';
import searchManager from './search';
import optionsManager from './options';
import { PLUGIN_INSTALL_DIR as baseDir } from '@/common/constans/renderer';
import { message } from 'ant-design-vue';

const createPluginManager = (): any => {
  const pluginInstance = new PluginHandler({
    baseDir,
  });

  const state: any = reactive({
    appList: [],
    plugins: [],
    localPlugins: [],
    currentPlugin: {},
    pluginLoading: false,
    pluginHistory: [],
  });

  const appList: any = ref([]);

  const initPlugins = async () => {
    appList.value = await appSearch(nativeImage);
    initLocalStartPlugin();
  };

  const initLocalStartPlugin = () => {
    const result = ipcRenderer.sendSync('msg-trigger', {
      type: 'dbGet',
      data: {
        id: 'rubick-local-start-app',
      },
    });
    if (result && result.value) {
      appList.value.push(...result.value);
    }
  };

  window.removeLocalStartPlugin = ({ plugin }) => {
    appList.value = appList.value.filter((app) => app.desc !== plugin.desc);
  };

  window.addLocalStartPlugin = ({ plugin }) => {
    window.removeLocalStartPlugin({ plugin });
    appList.value.push(plugin);
  };

  const loadPlugin = async (plugin) => {
    setSearchValue('');
    ipcRenderer.send('msg-trigger', {
      type: 'setExpendHeight',
      data: 60,
    });
    state.pluginLoading = true;
    state.currentPlugin = plugin;
    // 自带的插件不需要检测更新
    if (plugin.name === 'rubick-system-feature') return;
    await pluginInstance.upgrade(plugin.name);
    state.pluginLoading = false;
  };

  const openPlugin = async (plugin, option) => {
    if (plugin.pluginType === 'ui' || plugin.pluginType === 'system') {
      if (state.currentPlugin && state.currentPlugin.name === plugin.name) {
        return;
      }
      await loadPlugin(plugin);
      ipcRenderer.sendSync('msg-trigger', {
        type: 'openPlugin',
        data: JSON.parse(
          JSON.stringify({
            ...plugin,
            ext: plugin.ext || {
              code: plugin.feature.code,
              type: plugin.cmd.type || 'text',
              payload: null,
            },
          })
        ),
      });
    }
    if (plugin.pluginType === 'app') {
      try {
        execSync(plugin.action);
      } catch (e) {
        message.error('启动应用出错，请确保启动应用存在！');
      }
    }
    window.initRubick();
    changePluginHistory({
      ...plugin,
      ...option,
    });
  };

  const changePluginHistory = (plugin) => {
    if (state.pluginHistory.length >= 8) {
      state.pluginHistory.pop();
    }
    state.pluginHistory.forEach((p, index) => {
      if (p.name === plugin.name) {
        state.pluginHistory.splice(index, 1);
      }
    });
    state.pluginHistory.unshift(plugin);
  };

  const { searchValue, onSearch, setSearchValue, placeholder } =
    searchManager();
  const {
    options,
    searchFocus,
    clipboardFile,
    clearClipboardFile,
    readClipboardContent,
  } = optionsManager({
    searchValue,
    appList,
    openPlugin,
    currentPlugin: toRefs(state).currentPlugin,
  });
  // plugin operation
  const getPluginInfo = async ({ pluginName, pluginPath }) => {
    const pluginInfo = await pluginInstance.getAdapterInfo(
      pluginName,
      pluginPath
    );
    return {
      ...pluginInfo,
      icon: pluginInfo.logo,
      indexPath: commonConst.dev()
        ? 'http://localhost:8081/#/'
        : `file://${path.join(pluginPath, '../', pluginInfo.main)}`,
    };
  };

  const changeSelect = (select) => {
    state.currentPlugin = select;
  };

  const addPlugin = (plugin: any) => {
    state.plugins.unshift(plugin);
  };

  const removePlugin = (plugin: any) => {
    // todo
  };

  window.loadPlugin = (plugin) => loadPlugin(plugin);

  window.updatePlugin = ({ currentPlugin }: any) => {
    state.currentPlugin = currentPlugin;
    getGlobal('LOCAL_PLUGINS').updatePlugin(currentPlugin);
  };

  window.setCurrentPlugin = ({ currentPlugin }) => {
    state.currentPlugin = currentPlugin;
    setSearchValue('');
  };

  window.initRubick = () => {
    state.currentPlugin = {};
    setSearchValue('');
    window.setSubInput({ placeholder: '' });
  };

  window.pluginLoaded = () => {
    state.pluginLoading = false;
  };

  window.searchFocus = (args, strict) => {
    ipcRenderer.send('msg-trigger', {
      type: 'removePlugin',
    });
    window.initRubick();
    searchFocus(args, strict);
  };

  return {
    ...toRefs(state),
    initPlugins,
    addPlugin,
    removePlugin,
    onSearch,
    getPluginInfo,
    openPlugin,
    changeSelect,
    options,
    searchValue,
    placeholder,
    searchFocus,
    setSearchValue,
    clipboardFile,
    clearClipboardFile,
    readClipboardContent,
  };
};

export default createPluginManager;
