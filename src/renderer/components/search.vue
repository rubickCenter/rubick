<template>
  <div class="rubick-select">
    <div class="select-tag" v-show="currentPlugin.cmd">{{ currentPlugin.cmd }}</div>
    <div
      :class="clipboardFile[0].name ? 'clipboard-tag' : 'clipboard-img'"
      v-if="!!clipboardFile.length"
    >
      <img :src="getIcon()" />
      <div class="ellipse">{{ clipboardFile[0].name }}</div>
      <a-tag color="#aaa" v-if="clipboardFile.length > 1">{{ clipboardFile.length }}</a-tag>
    </div>
    <a-input
      id="search"
      class="main-input"
      @input="(e) => changeValue(e)"
      @keydown.down="(e) => keydownEvent(e, 'down')"
      @keydown.up="(e) => keydownEvent(e, 'up')"
      @keydown="e => checkNeedInit(e)"
      :value="searchValue"
      :placeholder="placeholder || 'Hi, Rubick2'"
      @keypress.enter="(e) => keydownEvent(e, 'enter')"
      @keypress.space="(e) => keydownEvent(e, 'space')"
      @focus="emit('focus')"
    >
      <template #suffix>
        <div class="suffix-tool">
          <MoreOutlined @click="showSeparate()" class="icon-more" />
          <div v-if="currentPlugin && currentPlugin.logo" style="position: relative">
            <a-spin v-show="pluginLoading" class="loading">
              <template #indicator>
                <LoadingOutlined style="font-size: 42px" />
              </template>
            </a-spin>
            <img class="icon-tool" :src="currentPlugin.logo" />
          </div>
          <div @click="() => emit('openMenu')" v-else class="rubick-logo">
            <img src="../assets/logo.png" />
          </div>
        </div>
      </template>
    </a-input>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from "vue";
import { ipcRenderer, remote } from "electron";
import { LoadingOutlined, MoreOutlined } from "@ant-design/icons-vue";

const opConfig = remote.getGlobal("OP_CONFIG");
const { Menu } = remote;

const config = ref(opConfig.get());

const props: any = defineProps({
  searchValue: {
    type: [String, Number],
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  currentPlugin: {},
  pluginLoading: Boolean,
  clipboardFile: (() => [])(),
});

const changeValue = (e) => {
  if (props.currentPlugin.name === "rubick-system-feature") return;
  targetSearch({ value: e.target.value });
  emit("onSearch", e);
};

const emit = defineEmits([
  "onSearch",
  "changeCurrent",
  "openMenu",
  "changeSelect",
  "choosePlugin",
  "focus",
  "readClipboardContent",
]);

const keydownEvent = (e, key: string) => {
  const { ctrlKey, shiftKey, altKey, metaKey } = e;
  const modifiers: Array<string> = [];
  ctrlKey && modifiers.push("control");
  shiftKey && modifiers.push("shift");
  altKey && modifiers.push("alt");
  metaKey && modifiers.push("meta");
  ipcRenderer.send("msg-trigger", {
    type: "sendPluginSomeKeyDownEvent",
    data: {
      keyCode: e.code,
      modifiers,
    },
  });
  const runPluginDisable = e.target.value === "" || props.currentPlugin.name
  switch (key) {
    case "up":
      emit("changeCurrent", -1);
      break;
    case "down":
      emit("changeCurrent", 1);
      break;
    case "enter":
      if (runPluginDisable) return;
      emit("choosePlugin");
      break;
    case "space":
      if (runPluginDisable || !opConfig.get().perf.common.space) return;
      emit("choosePlugin");
      break;
    default:
      break;
  }
};

const checkNeedInit = (e) => {
  const { ctrlKey, metaKey } = e;

  if (e.target.value === "" && e.keyCode === 8) {
    closeTag();
  }
  // 手动粘贴
  if ((ctrlKey || metaKey) && e.key === "v") {
    emit("readClipboardContent");
  }
};

const targetSearch = ({ value }) => {
  if (props.currentPlugin.name) {
    return ipcRenderer.sendSync("msg-trigger", {
      type: "sendSubInputChangeEvent",
      data: { text: value },
    });
  }
};

const closeTag = () => {
  emit("changeSelect", {});
  emit("clearClipbord");
  ipcRenderer.send("msg-trigger", {
    type: "removePlugin",
  });
};

const showSeparate = () => {
  let pluginMenu: any = [
    {
      label: config.value.perf.common.hideOnBlur ? "钉住" : "自动隐藏",
      click: changeHideOnBlur,
    },
  ];
  if (props.currentPlugin && props.currentPlugin.logo) {
    pluginMenu = pluginMenu.concat([
      {
        label: "开发者工具",
        click: () => {
          ipcRenderer.send("msg-trigger", { type: "openPluginDevTools" });
          // todo
        },
      },
      {
        label: "当前插件信息",
        submenu: [
          {
            label: "简介",
          },
          {
            label: "功能",
          },
        ],
      },
      {
        label: "分离窗口",
        click: newWindow,
      },
    ]);
  }
  let menu = Menu.buildFromTemplate(pluginMenu);
  menu.popup();
};

const changeHideOnBlur = () => {
  let cfg = { ...config.value };
  cfg.perf.common.hideOnBlur = !cfg.perf.common.hideOnBlur;
  opConfig.set(cfg);
  config.value = cfg;
};

const getIcon = () => {
  if (props.clipboardFile[0].dataUrl) return props.clipboardFile[0].dataUrl;
  return props.clipboardFile[0].isFile ? require("../assets/file.png") : require("../assets/folder.png")
};

const newWindow = () => {
  ipcRenderer.send("msg-trigger", {
    type: "detachPlugin",
  });
  // todo
};
</script>

<style lang="less">
.rubick-select {
  display: flex;
  padding-left: 10px;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  align-items: center;
  .ellipse {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
  }
  .select-tag {
    white-space: pre;
    user-select: none;
    font-size: 18px;
    border-radius: 16px;
    height: 32px;
    position: relative;
    color: #fff;
    background-color: rgba(255, 78, 164, 0.8);
    display: inline-flex;
    align-items: center;
    margin-right: 1px;
    padding: 0 10px;
  }
  .main-input {
    height: 60px !important;
    box-sizing: border-box;
    flex: 1;
    border: none;
    outline: none;
    box-shadow: none !important;
    .ant-select-selection,
    .ant-input,
    .ant-select-selection__rendered {
      height: 100% !important;
      font-size: 22px;
      border: none !important;
    }
  }
  .rubick-logo,
  .icon-tool {
    width: 40px;
    height: 40px;
    background: #574778;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    img {
      width: 32px;
    }
  }
  .icon-tool {
    background: #fff;
  }
  .ant-input:focus {
    border: none;
    box-shadow: none;
  }
  .suffix-tool {
    display: flex;
    align-items: center;
    .icon-more {
      font-size: 26px;
      font-weight: bold;
      cursor: pointer;
    }
    .loading {
      color: #ff4ea4;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .clipboard-tag {
    white-space: pre;
    user-select: none;
    font-size: 16px;
    height: 32px;
    position: relative;
    align-items: center;
    display: flex;
    border: 1px solid #e6e6e6;
    padding: 0 8px;
    margin-right: 12px;
    img {
      width: 24px;
      height: 24px;
      margin-right: 6px;
    }
  }
  .clipboard-img {
    white-space: pre;
    user-select: none;
    font-size: 16px;
    height: 32px;
    position: relative;
    align-items: center;
    display: flex;
    img {
      width: 32px;
      height: 32px;
    }
  }
}
</style>
