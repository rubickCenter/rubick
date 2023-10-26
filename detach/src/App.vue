<template>
  <div :class="[process.platform, 'detach']">
    <div class="info">
      <img :src="plugInfo.logo"/>
      <input
        autofocus
        @input="changeValue"
        v-if="showInput"
        :value="plugInfo.subInput?.value"
        :placeholder="plugInfo.subInput?.placeholder"
      />
      <span v-else>{{ plugInfo.pluginName }}</span>
    </div>
    <div class="handle-container">
      <div class="handle">
        <div class="devtool" @click="openDevTool" title="开发者工具"></div>
      </div>
      <div class="window-handle" v-if="process.platform !== 'darwin'">
        <div class="minimize" @click="minimize"></div>
        <div class="maximize" @click="maximize"></div>
        <div class="close" @click="close"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import throttle from 'lodash.throttle';
import { ref } from 'vue';

const { ipcRenderer } = window.require('electron');

const process = window.require('process');
const showInput = ref(false);

const storeInfo = localStorage.getItem('rubick-system-detach') || '{}';
const plugInfo = ref({});

window.initDetach = (pluginInfo) => {
  plugInfo.value = pluginInfo;
  showInput.value =
    pluginInfo.subInput &&
    (!!pluginInfo.subInput.value || !!pluginInfo.subInput.placeholder);
  localStorage.setItem('rubick-system-detach', JSON.stringify(pluginInfo));
};

try {
  window.initDetach(JSON.parse(storeInfo));
} catch (e) {
  // ...
}

const changeValue = throttle((e) => {
  ipcRenderer.send('msg-trigger', {
    type: 'detachInputChange',
    data: {
      text: e.target.value,
    },
  });
}, 500);

const openDevTool = () => {
  ipcRenderer.send('msg-trigger', { type: 'openPluginDevTools' });
};

const minimize = () => {
  ipcRenderer.send('detach:service', { type: 'minimize' });
};

const maximize = () => {
  ipcRenderer.send('detach:service', { type: 'maximize' });
};

const close = () => {
  ipcRenderer.send('detach:service', { type: 'close' });
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

window.enterFullScreenTrigger = () => {
  document.querySelector('.detach').classList.remove('darwin');
};
window.leaveFullScreenTrigger = () => {
  const titleDom = document.querySelector('.detach');
  if (!titleDom.classList.contains('darwin')) {
    titleDom.classList.add('darwin');
  }
};

window.maximizeTrigger = () => {
  const btnMaximize = document.querySelector('.maximize')
  if (!btnMaximize || btnMaximize.classList.contains('unmaximize')) return;
  btnMaximize.classList.add('unmaximize');
};

window.unmaximizeTrigger = () => {
  const btnMaximize = document.querySelector('.maximize');
  if (!btnMaximize) return;
  btnMaximize.classList.remove('unmaximize');
};

if (process.platform === 'darwin') {
  window.onkeydown = (e) => {
    if (e.code === 'Escape') {
      ipcRenderer.send('detach:service', { type: 'endFullScreen' });
      return;
    }
    if (e.metaKey && (e.code === 'KeyW' || e.code === 'KeyQ')) {
      window.handle.close()
    }
  }
} else {
  window.onkeydown = (e) => {
    if (e.ctrlKey && e.code === 'KeyW') {
      window.handle.close()
      return
    }
  }
}
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
  height: 60px;
  display: flex;
  align-items: center;
  color: var(--color-text-primary);
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
  background-color: var(--color-body-bg);
  color: var(--color-text-primary);
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

.handle .devtool {
  background: center no-repeat url("./assets/tool.svg")
}

.handle-container {
  display: flex;
  align-items: center;
}

.window-handle {
  display: flex;
  align-items: center;
  -webkit-app-region: no-drag;
}

.window-handle > div {
  width: 48px;
  height: 56px;
  cursor: pointer;
}

.window-handle > div:hover {
  background-color: #dee2e6;
}

.window-handle .minimize {
  background: center / 20px no-repeat url("./assets/minimize.svg");
}

.window-handle .maximize {
  background: center / 20px no-repeat url("./assets/maximize.svg");
}

.window-handle .unmaximize {
  background: center / 20px no-repeat url("./assets/unmaximize.svg");
}

.window-handle .close {
  background: center / 20px no-repeat url("./assets/close.svg");
}

.window-handle .close:hover {
  background-color: #e53935 !important;
  background-image: url("./assets/close-hover.svg") !important;
}

</style>
