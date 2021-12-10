<template>
  <div class="rubick-select">
    <div class="select-tag" v-show="currentPlugin.cmd">{{ currentPlugin.cmd }}</div>
    <a-input
      id="search"
      class="main-input"
      @input="(e) => changeValue(e)"
      @keydown.down="() => emit('changeCurrent', 1)"
      @keydown.up="() => emit('changeCurrent', -1)"
      @keydown="e => checkNeedInit(e)"
      :value="searchValue"
      :placeholder="placeholder || 'Hi, Rubick2'"
      @keypress.enter="
        (e) => targetSearch({ value: e.target.value, type: 'enter' })
      "
      @keypress.space="
        (e) => targetSearch({ value: e.target.value, type: 'space' })
      "
    >
      <template #suffix>
        <div class="suffix-tool" >
          <MoreOutlined
            @click="showSeparate()"
            class="icon-more"
          />
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
import { defineProps, defineEmits, ref } from "vue";
import { ipcRenderer, remote } from "electron";
import { LoadingOutlined, MoreOutlined } from "@ant-design/icons-vue";
const opConfig = remote.getGlobal("OP_CONFIG");
const { Menu } = remote;

const config = ref(opConfig.get());

const props = defineProps({
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
});

const changeValue = (e) => {
  if (props.currentPlugin.name === "rubick-system-feature") return;
  emit("onSearch", e);
};

const emit = defineEmits([
  "onSearch",
  "changeCurrent",
  "openMenu",
  "changeSelect",
  "choosePlugin",
]);

const checkNeedInit = (e) => {
  if (e.target.value === "" && e.keyCode === 8) {
    closeTag();
  }
};

const targetSearch = ({ value, type }) => {
  if (props.currentPlugin.name) {
    return ipcRenderer.sendSync("msg-trigger", {
      type: "sendSubInputChangeEvent",
      data: { text: value },
    });
  } else {
    emit("choosePlugin");
  }
};

const closeTag = () => {
  emit("changeSelect", {});
  ipcRenderer.send("msg-trigger", {
    type: "removePlugin",
  });
};

const showSeparate = () => {
  let pluginMenu = [
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
  opConfig.set("perf", cfg.perf);
  config.value = cfg;
};

const newWindow = () => {
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
    .ant-select-selection, .ant-input, .ant-select-selection__rendered {
      height: 100% !important;
      font-size: 22px;
      border: none !important;
    }
  }
  .rubick-logo, .icon-tool {
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
}
</style>
