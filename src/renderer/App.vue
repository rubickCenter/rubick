<template>
  <div v-if="commonConst.windows() || commonConst.linux()" class="drag-bar"></div>
  <div :class="!commonConst.windows() && !commonConst.linux() && 'drag'" id="components-layout">
    <div class="rubick-select">
      <Search
        :currentPlugin="currentPlugin"
        @changeCurrent="changeIndex"
        @onSearch="onSearch"
        @openMenu="openMenu"
        @changeSelect="changeSelect"
        :searchValue="searchValue"
        :placeholder="placeholder"
        :pluginLoading="pluginLoading"
        :clipboardFile="clipboardFile || []"
        @choosePlugin="choosePlugin"
        @focus="searchFocus"
        @clearClipbord="clearClipboardFile"
        @readClipboardContent="readClipboardContent"
      />
    </div>
    <Result
      :currentPlugin="currentPlugin"
      :searchValue="searchValue"
      :currentSelect="currentSelect"
      :options="options"
      :clipboardFile="clipboardFile || []"
    />
  </div>
</template>

<script setup lang="ts">
import { watch, ref, nextTick, toRaw } from "vue";
import { ipcRenderer, remote } from "electron";
import Result from "./components/result.vue";
import Search from "./components/search.vue";
import getWindowHeight from "../common/utils/getWindowHeight";
import createPluginManager from "./plugins-manager";
import commonConst from "@/common/utils/commonConst";

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
  clearClipboardFile,
  readClipboardContent,
} = createPluginManager();

initPlugins();

const currentSelect = ref(0);
const menuPluginInfo = ref({});

getPluginInfo({
  pluginName: "feature",
  // eslint-disable-next-line no-undef
  pluginPath: `${__static}/feature/package.json`,
}).then((res) => {
  menuPluginInfo.value = res;
  remote.getGlobal("LOCAL_PLUGINS").addPlugin(res);
});

watch([options], () => {
  currentSelect.value = 0;
  if (currentPlugin.value.name) return;
  nextTick(() => {
    ipcRenderer.sendSync("msg-trigger", {
      type: "setExpendHeight",
      data: getWindowHeight(options.value),
    });
  });
});

const changeIndex = (index) => {
  if (!options.value.length) return;
  if (
    currentSelect.value + index > options.value.length - 1 ||
    currentSelect.value + index < 0
  )
    return;
  currentSelect.value = currentSelect.value + index;
};

const openMenu = () => {
  openPlugin({
    ...toRaw(menuPluginInfo.value),
    feature: menuPluginInfo.value.features[0],
    cmd: "插件市场",
  });
};

const choosePlugin = () => {
  const currentChoose = options.value[currentSelect.value];
  currentChoose.click();
};
</script>

<style lang="less">
.drag-bar {
  -webkit-app-region: drag;
  width: 100%;
  height: 20px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
}
#components-layout {
  height: 100vh;
  overflow: hidden;
  ::-webkit-scrollbar {
    width: 0;
  }
}
.drag {
  -webkit-app-region: drag;
}
</style>
