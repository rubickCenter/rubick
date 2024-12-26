<template>
  <div v-show="!currentPlugin.name" class="options">
    <div
      class="history-plugins"
      v-if="
        !options.length &&
        !searchValue &&
        !clipboardFile.length &&
        config.perf.common.history
      "
    >
      <a-row>
        <a-col
          @click="() => openPlugin(item)"
          @contextmenu.prevent="openMenu($event,item)"
          :class="
            currentSelect === index ? 'active history-item' : 'history-item'
          "
          :span="3"
          v-for="(item, index) in pluginHistory"
          :key="index"
        >
          <a-avatar style="width: 28px; height: 28px" :src="item.icon" />
          <div class="name ellpise">
            {{ item.cmd || item.pluginName || item._name || item.name }}
          </div>
          <div class="badge" v-if="item.pin"></div>
        </a-col>
      </a-row>
    </div>
    <a-list v-else item-layout="horizontal" :dataSource="sort(options)">
      <template #renderItem="{ item, index }">
        <a-list-item
          @click="() => item.click()"
          :class="currentSelect === index ? 'active op-item' : 'op-item'"
        >
          <a-list-item-meta :description="renderDesc(item.desc)">
            <template #title>
              <span v-html="renderTitle(item.name, item.match)"></span>
            </template>
            <template #avatar>
              <a-avatar style="border-radius: 0" :src="item.icon" />
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
  </div>
</template>

<script lang="ts" setup>
import { defineEmits, defineProps, reactive, ref, toRaw, watch } from 'vue';
import localConfig from '../confOp';

const path = window.require('path');
const remote = window.require('@electron/remote');

declare const __static: string;

const config: any = ref(localConfig.getConfig());

const props: any = defineProps({
  searchValue: {
    type: [String, Number],
    default: '',
  },
  options: {
    type: Array,
    default: (() => [])(),
  },
  currentSelect: {
    type: Number,
    default: 0,
  },
  currentPlugin: {},
  pluginHistory: (() => [])(),
  clipboardFile: (() => [])(),
});

const emit = defineEmits(['choosePlugin', 'setPluginHistory']);

const renderTitle = (title, match) => {
  if (typeof title !== 'string') return;
  if (!props.searchValue || !match) return title;
  const result = title.substring(match[0], match[1] + 1);
  return `<div>${title.substring(
    0,
    match[0]
  )}<span style='color: var(--ant-error-color)'>${result}</span>${title.substring(
    match[1] + 1,
    title.length
  )}</div>`;
};

const renderDesc = (desc = '') => {
  if (desc.length > 80) {
    return `${desc.substr(0, 63)}...${desc.substr(
      desc.length - 14,
      desc.length
    )}`;
  }
  return desc;
};

const sort = (options) => {
  for (let i = 0; i < options.length; i++) {
    for (let j = i + 1; j < options.length; j++) {
      if (options[j].zIndex > options[i].zIndex) {
        let temp = options[i];
        options[i] = options[j];
        options[j] = temp;
      }
    }
  }
  return options.slice(0, 20);
};

const openPlugin = (item) => {
  emit('choosePlugin', item);
};

const menuState: any = reactive({
  plugin: null,
});
let mainMenus;

const openMenu = (e, item) => {
  const pinToMain = mainMenus.getMenuItemById('pinToMain');
  const unpinFromMain = mainMenus.getMenuItemById('unpinFromMain');
  pinToMain.visible = !item.pin;
  unpinFromMain.visible = item.pin;
  mainMenus.popup({
    x: e.pageX,
    y: e.pageY,
  });
  menuState.plugin = item;
};

const initMainCmdMenus = () => {
  const menu = [
    {
      id: 'removeRecentCmd',
      label: '从"使用记录"中删除',
      icon: path.join(__static, 'icons', 'delete@2x.png'),
      click: () => {
        const history = props.pluginHistory.filter((item) => item.name !== menuState.plugin.name);
        emit('setPluginHistory', toRaw(history));
      },
    },
    {
      id: 'pinToMain',
      label: '固定到"搜索面板"',
      icon: path.join(__static, 'icons', 'pin@2x.png'),
      click: () => {
        const history = props.pluginHistory.map((item) => {
          if (item.name === menuState.plugin.name) {
            item.pin = true;
          }
          return item;
        });
        emit('setPluginHistory', toRaw(history));
      },
    },
    {
      id: 'unpinFromMain',
      label: '从"搜索面板"取消固定',
      icon: path.join(__static, 'icons', 'unpin@2x.png'),
      click: () => {
        const history = props.pluginHistory.map((item) => {
          if (item.name === menuState.plugin.name) {
            item.pin = false;
          }
          return item;
        });
        emit('setPluginHistory', toRaw(history));
      },
    },
  ];
  mainMenus = remote.Menu.buildFromTemplate(menu);
};

initMainCmdMenus();
</script>

<style lang="less">
.ellpise {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}

.options {
  position: absolute;
  top: 60px;
  left: 0;
  width: 100%;
  z-index: 99;
  max-height: calc(~'100vh - 60px');
  overflow: auto;
  background: var(--color-body-bg);
  .history-plugins {
    width: 100%;
    border-top: 1px dashed var(--color-border-light);
    box-sizing: border-box;
    .history-item {
      cursor: pointer;
      box-sizing: border-box;
      height: 69px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: var(--color-text-content);
      border-right: 1px dashed var(--color-border-light);
      position: relative;
      .badge {
        position: absolute;
        top: 2px;
        right: 2px;
        width: 0;
        height: 0;
        border-radius: 4px;
        border-top: 6px solid var(--ant-primary-4);
        border-right: 6px solid var(--ant-primary-4);
        border-left: 6px solid transparent;
        border-bottom: 6px solid transparent;
      }
      &.active {
        background: var(--color-list-hover);
      }
    }
    .name {
      font-size: 12px;
      margin-top: 4px;
      width: 100%;
      text-align: center;
    }
  }
  .op-item {
    padding: 0 10px;
    height: 70px;
    line-height: 50px;
    max-height: 500px;
    overflow: auto;
    background: var(--color-body-bg);
    color: var(--color-text-content);
    border-color: var(--color-border-light);
    border-bottom: 1px solid var(--color-border-light) !important;
    &.active {
      background: var(--color-list-hover);
    }
    .ant-list-item-meta-title {
      color: var(--color-text-content);
    }
    .ant-list-item-meta-description {
      color: var(--color-text-desc);
    }
  }
}
</style>
