<template>
  <div id="components-layout">
    <div class="search-container">
      <a-select
        class="rubick-select"
        v-model:value="selectFeat"
        mode="tags"
        style="width: 100%"
        placeholder="HI, Rubick 2.0"
        @select="handleChange"
        autofocus
        show-search
        :maxTagTextLength="6"
        :dropdownClassName="!options.length ? 'none-option' : 'rubick-option'"
        @dropdownVisibleChange="changeWindowHeight"
        :open="open"
      >
        <a-select-option
          v-for="(item, index) in options"
          :key="index"
          :value="item"
        >
          <div class="search-item">

          </div>
        </a-select-option>
      </a-select>
      <div @click="openMenu" class="rubick-logo">
        <img  src="./assets/logo.png" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs } from "vue";
import { ipcRenderer } from "electron";
import getWindowHeight from "../common/utils/getWindowHeight";
import createPluginManager from "./plugins-manager";

const { appList, initPlugins, getPluginInfo } = createPluginManager();

initPlugins();

const state = reactive({
  selectFeat: [],
  options: [],
  open: false,
});

const handleChange = (v: string) => {
  state.selectFeat = v;
  closeDropDown();
};

const closeDropDown = () => {
  state.open = false;
  setTimeout(() => {
    ipcRenderer.sendSync("msg-trigger", {
      type: "setExpendHeight",
      height: getWindowHeight([]),
    });
  }, 200);
};

const changeWindowHeight = (open) => {
  if (open) {
    ipcRenderer.sendSync("msg-trigger", {
      type: "setExpendHeight",
      height: getWindowHeight(state.options),
    });
    state.open = open;
  } else {
    closeDropDown();
  }
};

const openMenu = async () => {
  const pluginInfo = await getPluginInfo({
    pluginName: "feature",
    // eslint-disable-next-line no-undef
    pluginPath: `${__static}/feature/plugin.json`,
  });
  console.log(pluginInfo)
  ipcRenderer.sendSync("msg-trigger", {
    type: "openPlugin",
    plugin: pluginInfo,
  });
};

const { selectFeat, options, open } = toRefs(state);
</script>

<style lang="less">
#components-layout {
  height: 100vh;
  overflow: auto;
  overflow-x: hidden;
  -webkit-app-region: drag;
  .search-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 10px;
  }
  ::-webkit-scrollbar {
    width: 0;
  }
  .rubick-select {
    font-size: 22px;
    font-weight: normal;
    flex: 1;
    .ant-select-selector {
      box-shadow: none !important;
      height: 60px;
      border: none;
    }
  }
  .rubick-logo {
    width: 40px;
    height: 40px;
    background: #574778;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    cursor: pointer;
    img {
      width: 32px;
    }
  }
}
.none-option {
  display: none;
}
.rubick-option {
  box-shadow: none !important;
}
</style>
