<template>
  <div
    id="components-layout"
    @mousedown="onMouseDown"
  >
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
    />
  </div>
</template>

<script setup lang="ts">
import { watch, ref, nextTick, toRaw } from 'vue';
import { ipcRenderer } from 'electron';
import Result from './components/result.vue';
import Search from './components/search.vue';
import getWindowHeight from '../common/utils/getWindowHeight';
import createPluginManager from './plugins-manager';
import useDrag from '../common/utils/dragWindow';

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
} = createPluginManager();

initPlugins();

const currentSelect = ref(0);
const menuPluginInfo: any = ref({});

getPluginInfo({
  pluginName: 'feature',
  // eslint-disable-next-line no-undef
  pluginPath: `${__static}/feature/package.json`,
}).then((res) => {
  menuPluginInfo.value = res;
  remote.getGlobal('LOCAL_PLUGINS').addPlugin(res);
});

watch([options, pluginHistory, currentPlugin], () => {
  currentSelect.value = 0;
  if (currentPlugin.value.name) return;
  nextTick(() => {
    ipcRenderer.sendSync('msg-trigger', {
      type: 'setExpendHeight',
      data: getWindowHeight(
        options.value,
        pluginLoading.value ? [] : pluginHistory.value
      ),
    });
  });
});

const changeIndex = (index) => {
  if (!options.value.length) {
    if (!pluginHistory.value.length) return;
    if (
      currentSelect.value + index > pluginHistory.value.length - 1 ||
      currentSelect.value + index < 0
    ) {
      currentSelect.value = 0;
      return;
    }
    currentSelect.value = currentSelect.value + index;
    return;
  }
  if (
    currentSelect.value + index > options.value.length - 1 ||
    currentSelect.value + index < 0
  ) {
    currentSelect.value = 0;
    return;
  }
  currentSelect.value = currentSelect.value + index;
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

const choosePlugin = () => {
  if (options.value.length) {
    const currentChoose = options.value[currentSelect.value];
    currentChoose.click();
  } else {
    const currentChoose = pluginHistory.value[currentSelect.value];
    currentChoose.click();
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
