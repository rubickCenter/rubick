<template>
  <div :class="[platform, 'detach']">
    <div class="info">
      <img :src="plugInfo.logo" />
      <input
        autofocus
        @input="changeValue"
        v-if="showInput"
        :value="plugInfo.subInput?.value"
        :placeholder="plugInfo.subInput?.placeholder"
      />
      <span v-else>{{ plugInfo.pluginName }}</span>
    </div>
    <div class="handle">
      <div class="devtool" @click="openDevTool" title="开发者工具"></div>
    </div>
  </div>
</template>

<script setup>
import throttle from "lodash.throttle";
import { ref } from "vue";

const { ipcRenderer } = window.require("electron");
const platform = ref(window.process.platform);
const plugInfo = ref({});
const showInput = ref(false);
window.initDetach = (pluginInfo) => {
  plugInfo.value = pluginInfo;
  showInput.value =
    pluginInfo.subInput &&
    (!!pluginInfo.subInput.value || !!pluginInfo.subInput.placeholder);
  console.log(showInput.value);
};

const changeValue = throttle((e) => {
  ipcRenderer.send("msg-trigger", {
    type: "detachInputChange",
    data: {
      text: e.target.value,
    },
  });
}, 500);

const openDevTool = () => {
  ipcRenderer.send("msg-trigger", { type: "openPluginDevTools" });
};

Object.assign(window, {
  setSubInputValue: ({ value }) => {
    plugInfo.value.subInput.value = value;
  },
  setSubInput: (placeholder) => {
    plugInfo.value.subInput.placeholder = placeholder;
  },
  removeSubInput: () => {
    plugInfo.value.subInput = null;
  },
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  font-family: system-ui, "PingFang SC", "Helvetica Neue", "Microsoft Yahei", sans-serif;
  user-select: none;
  overflow: hidden;
}

.detach {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  background: #eee;
}

.detach {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 18px;
  padding-left: 10px;
  font-weight: 500;
  box-sizing: border-box;
  justify-content: space-between;
}

.detach.darwin {
  padding-left: 80px;
  -webkit-app-region: drag;
}

.detach.win32 {
  -webkit-app-region: drag;
}

.detach img {
  width: 36px;
  height: 36px;
  margin-right: 10px;
}

.detach input {
  background-color: #FFFFFF;
  color: #333333;
  width: 360px;
  height: 36px;
  line-height: 36px;
  border-radius: 4px;
  font-size: 14px;
  border: none;
  padding: 0 10px;
  outline: none;
  -webkit-app-region: no-drag;
}

.detach input::-webkit-input-placeholder {
  color: #aaa;
  user-select: none;
}

.detach .info {
  display: flex;
  align-items: center;
}

.handle {
  display: flex;
  -webkit-app-region: no-drag;
}

.handle > div {
  width: 36px;
  height: 36px;
  border-radius: 18px;
  cursor: pointer;
  margin-right: 6px;
}

.handle > div:hover {
  background-color: #dee2e6;
}

.detach .devtool {
  background: center / 18px no-repeat url("./assets/devtool.svg");
}

</style>
