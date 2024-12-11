<template>
  <div id="components-layout" @mousedown="onMouseDown">
    <Search
      :currentPlugin="currentPlugin"
      @changeCurrent="changeIndex"
      @onSearch="onSearch"
      @openMenu="openMenu"
      @changeSelect="changeSelect"
      :searchValue="searchValue"
      :placeholder="placeholder"
      :pluginLoading="pluginLoading"
      :pluginHistory="pluginHistory"
      :clipboardFile="clipboardFile || []"
      @choosePlugin="choosePlugin"
      @focus="searchFocus"
      @clear-search-value="clearSearchValue"
      @clearClipbord="clearClipboardFile"
      @readClipboardContent="readClipboardContent"
    />
    <Result
      :pluginHistory="pluginHistory"
      :currentPlugin="currentPlugin"
      :searchValue="searchValue"
      :currentSelect="currentSelect"
      :options="options"
      :clipboardFile="clipboardFile || []"
      @setPluginHistory="setPluginHistory"
      @choosePlugin="choosePlugin"
    />
  </div>
</template>

<script setup lang="ts">
import { watch, ref, toRaw } from 'vue';
import { exec } from 'child_process';
import Result from './components/result.vue';
import Search from './components/search.vue';
import getWindowHeight from '../common/utils/getWindowHeight';
import createPluginManager from './plugins-manager';
import useDrag from '../common/utils/dragWindow';
import { getGlobal } from '@electron/remote';
import { PLUGIN_HISTORY } from '@/common/constans/renderer';
import { message } from 'ant-design-vue';
import localConfig from './confOp';

const { onMouseDown } = useDrag();
const remote = window.require('@electron/remote');

const {
  initPlugins,
  getPluginInfo,
  options,
  onSearch,
  searchValue,
  changeSelect,
  openPlugin,
  currentPlugin,
  placeholder,
  pluginLoading,
  searchFocus,
  clipboardFile,
  setSearchValue,
  clearClipboardFile,
  readClipboardContent,
  pluginHistory,
  setPluginHistory,
  changePluginHistory,
} = createPluginManager();

initPlugins();

const currentSelect = ref(0);
const menuPluginInfo: any = ref({});

const config: any = ref(localConfig.getConfig());

getPluginInfo({
  pluginName: 'feature',
  // eslint-disable-next-line no-undef
  pluginPath: `${__static}/feature/package.json`,
}).then((res) => {
  menuPluginInfo.value = res;
  remote.getGlobal('LOCAL_PLUGINS').addPlugin(res);
});

watch(
  [options, pluginHistory, currentPlugin],
  () => {
    currentSelect.value = 0;
    if (currentPlugin.value.name) return;
    window.rubick.setExpendHeight(
      getWindowHeight(
        options.value,
        pluginLoading.value || !config.value.perf.common.history
          ? []
          : pluginHistory.value
      )
    );
  },
  {
    immediate: true,
  }
);

const changeIndex = (index) => {
  const len = options.value.length || pluginHistory.value.length;
  if (!len) return;
  if (currentSelect.value + index > len - 1) {
    currentSelect.value = 0;
  } else if (currentSelect.value + index < 0) {
    currentSelect.value = len - 1;
  } else {
    currentSelect.value = currentSelect.value + index;
  }
};

const openMenu = (ext) => {
  openPlugin({
    ...toRaw(menuPluginInfo.value),
    feature: menuPluginInfo.value.features[0],
    cmd: '插件市场',
    ext,
    click: () => openMenu(ext),
  });
};

window.rubick.openMenu = openMenu;

const choosePlugin = (plugin) => {
  if (options.value.length) {
    const currentChoose = options.value[currentSelect.value];
    currentChoose.click();
  } else {
    const localPlugins = getGlobal('LOCAL_PLUGINS').getLocalPlugins();
    const currentChoose = plugin || pluginHistory.value[currentSelect.value];
    let hasRemove = true;
    if (currentChoose.pluginType === 'app') {
      hasRemove = false;
      changePluginHistory(currentChoose);
      exec(currentChoose.action);
      return;
    }
    localPlugins.find((plugin) => {
      if (plugin.name === currentChoose.originName) {
        hasRemove = false;
        return true;
      }
      return false;
    });
    if (hasRemove) {
      const result = window.rubick.db.get(PLUGIN_HISTORY) || {};
      const history = result.data.filter(
        (item) => item.originName !== currentChoose.originName
      );
      setPluginHistory(history);
      return message.warning('插件已被卸载！');
    }
    changePluginHistory(currentChoose);
    window.rubick.openPlugin(
      JSON.parse(
        JSON.stringify({
          ...currentChoose,
          ext: {
            code: currentChoose.feature.code,
            type: currentChoose.cmd.type || 'text',
            payload: null,
          },
        })
      )
    );
  }
};

const clearSearchValue = () => {
  setSearchValue('');
};
</script>

<style lang="less">
@import './assets/var.less';
#components-layout {
  height: 100vh;
  overflow: hidden;
  background: var(--color-body-bg);
  ::-webkit-scrollbar {
    width: 0;
  }
  &.drag {
    -webkit-app-region: drag;
  }
}
</style>
