<template>
  <div id="components-layout">
    <div class="rubick-select">
      <Search @changeCurrent="changeIndex" :menuPluginInfo="menuPluginInfo" @onSearch="onSearch" />
    </div>
    <Result :searchValue="searchValue" :currentSelect="currentSelect" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { watch, ref, nextTick } from "vue";
import { ipcRenderer } from "electron";
import Result from "./components/result.vue";
import Search from "./components/search.vue";
import getWindowHeight from "../common/utils/getWindowHeight";
import createPluginManager from "./plugins-manager";

const { initPlugins, getPluginInfo, options, onSearch, searchValue } = createPluginManager();

initPlugins();

const currentSelect = ref(0);
const menuPluginInfo = ref({});

getPluginInfo({
  pluginName: "feature",
  // eslint-disable-next-line no-undef
  pluginPath: `${__static}/feature/plugin.json`,
}).then((res) => {
  menuPluginInfo.value = res;
});

watch([searchValue], () => {
  currentSelect.value = 0;
  nextTick(() => {
    ipcRenderer.sendSync("msg-trigger", {
      type: "setExpendHeight",
      height: getWindowHeight(searchValue.value ? options.value : []),
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
</script>

<style lang="less">
#components-layout {
  height: 100vh;
  overflow: hidden;
  -webkit-app-region: drag;
  ::-webkit-scrollbar {
    width: 0;
  }
}

</style>
