<template>
  <div class="rubick-select">
    <div
      :class="clipboardFile[0].name ? 'clipboard-tag' : 'clipboard-img'"
      v-if="!!clipboardFile.length"
    >
      <img style="margin-right: 8px" :src="getIcon()" />
      <div class="ellipse">{{ clipboardFile[0].name }}</div>
      <a-tag color="#aaa" v-if="clipboardFile.length > 1">
        {{ clipboardFile.length }}
      </a-tag>
    </div>
    <div v-else :class="currentPlugin.cmd ? 'rubick-tag' : ''">
      <img
        @click="() => emit('openMenu')"
        class="rubick-logo"
        :src="currentPlugin.logo || config.perf.custom.logo"
      />
      <div class="select-tag" v-show="currentPlugin.cmd">
        {{ currentPlugin.cmd }}
      </div>
    </div>
    <a-input
      id="search"
      ref="mainInput"
      class="main-input"
      @input="(e) => changeValue(e)"
      @keydown.left="(e) => keydownEvent(e, 'left')"
      @keydown.right="(e) => keydownEvent(e, 'right')"
      @keydown.down="(e) => keydownEvent(e, 'down')"
      @keydown.tab="(e) => keydownEvent(e, 'down')"
      @keydown.up="(e) => keydownEvent(e, 'up')"
      @keydown="(e) => checkNeedInit(e)"
      :value="searchValue"
      :placeholder="
        pluginLoading
          ? '更新检测中...'
          : placeholder || config.perf.custom.placeholder
      "
      @keypress.enter="(e) => keydownEvent(e, 'enter')"
      @keypress.space="(e) => keydownEvent(e, 'space')"
      @focus="emit('focus')"
    >
      <template #suffix>
        <div class="suffix-tool">
          <MoreOutlined @click="showSeparate()" class="icon-more" />
        </div>
      </template>
    </a-input>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';
import { ipcRenderer } from 'electron';
import { MoreOutlined } from '@ant-design/icons-vue';

const remote = window.require('@electron/remote');
import localConfig from '../confOp';
const { Menu } = remote;

const config: any = ref(localConfig.getConfig());

const props: any = defineProps({
  searchValue: {
    type: [String, Number],
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  pluginHistory: (() => [])(),
  currentPlugin: {},
  pluginLoading: Boolean,
  clipboardFile: (() => [])(),
});

const changeValue = (e) => {
  // if (props.currentPlugin.name === 'rubick-system-feature') return;
  targetSearch({ value: e.target.value });
  emit('onSearch', e);
};

const emit = defineEmits([
  'onSearch',
  'changeCurrent',
  'openMenu',
  'changeSelect',
  'choosePlugin',
  'focus',
  'clearSearchValue',
  'readClipboardContent',
  'clearClipbord',
]);

const keydownEvent = (e, key: string) => {
  key !== 'space' && e.preventDefault();
  const { ctrlKey, shiftKey, altKey, metaKey } = e;
  const modifiers: Array<string> = [];
  ctrlKey && modifiers.push('control');
  shiftKey && modifiers.push('shift');
  altKey && modifiers.push('alt');
  metaKey && modifiers.push('meta');
  ipcRenderer.send('msg-trigger', {
    type: 'sendPluginSomeKeyDownEvent',
    data: {
      keyCode: e.code,
      modifiers,
    },
  });
  const runPluginDisable =
    (e.target.value === '' && !props.pluginHistory.length) ||
    props.currentPlugin.name;
  switch (key) {
    case 'up':
      emit('changeCurrent', -1);
      break;
    case 'down':
      emit('changeCurrent', 1);
      break;
    case 'left':
      emit('changeCurrent', -1);
      break;
    case 'right':
      emit('changeCurrent', 1);
      break;
    case 'enter':
      if (runPluginDisable) return;
      emit('choosePlugin');
      break;
    case 'space':
      if (runPluginDisable || !config.value.perf.common.space) return;
      e.preventDefault();
      emit('choosePlugin');
      break;
    default:
      break;
  }
};

const checkNeedInit = (e) => {
  const { ctrlKey, metaKey } = e;

  if (e.target.value === '' && e.keyCode === 8) {
    closeTag();
  }
  // 手动粘贴
  if ((ctrlKey || metaKey) && e.key === 'v') {
    emit('readClipboardContent');
  }
};

const targetSearch = ({ value }) => {
  if (props.currentPlugin.name) {
    return ipcRenderer.sendSync('msg-trigger', {
      type: 'sendSubInputChangeEvent',
      data: { text: value },
    });
  }
};

const closeTag = () => {
  emit('changeSelect', {});
  emit('clearClipbord');
  ipcRenderer.send('msg-trigger', {
    type: 'removePlugin',
  });
};

const showSeparate = () => {
  let pluginMenu: any = [
    {
      label: config.value.perf.common.hideOnBlur ? '钉住' : '自动隐藏',
      click: changeHideOnBlur,
    },
    {
      label:
        config.value.perf.common.lang === 'zh-CN'
          ? '切换语言'
          : 'Change Language',
      submenu: [
        {
          label: '简体中文',
          click: () => {
            changeLang('zh-CN');
          },
        },
        {
          label: 'English',
          click: () => {
            changeLang('en-US');
          },
        },
      ],
    },
  ];
  if (props.currentPlugin && props.currentPlugin.logo) {
    pluginMenu = pluginMenu.concat([
      {
        label: '开发者工具',
        click: () => {
          ipcRenderer.send('msg-trigger', { type: 'openPluginDevTools' });
          // todo
        },
      },
      {
        label: '当前插件信息',
        submenu: [
          {
            label: '简介',
          },
          {
            label: '功能',
          },
        ],
      },
      {
        label: '分离窗口',
        click: newWindow,
      },
    ]);
  }
  let menu = Menu.buildFromTemplate(pluginMenu);
  menu.popup();
};

const changeLang = (lang) => {
  let cfg = { ...config.value };
  cfg.perf.common.lang = lang;
  localConfig.setConfig(JSON.parse(JSON.stringify(cfg)));
  config.value = cfg;
};

const changeHideOnBlur = () => {
  let cfg = { ...config.value };
  cfg.perf.common.hideOnBlur = !cfg.perf.common.hideOnBlur;
  localConfig.setConfig(JSON.parse(JSON.stringify(cfg)));
  config.value = cfg;
};

const getIcon = () => {
  if (props.clipboardFile[0].dataUrl) return props.clipboardFile[0].dataUrl;
  try {
    return ipcRenderer.sendSync('msg-trigger', {
      type: 'getFileIcon',
      data: { path: props.clipboardFile[0].path },
    });
  } catch (e) {
    return require('../assets/file.png');
  }
};

const newWindow = () => {
  ipcRenderer.send('msg-trigger', {
    type: 'detachPlugin',
  });
  // todo
};

const mainInput = ref(null);
window.rubick.hooks.onShow = () => {
  (mainInput.value as unknown as HTMLDivElement).focus();
};

window.rubick.hooks.onHide = () => {
  emit('clearSearchValue');
};
</script>

<style lang="less">
.rubick-select {
  display: flex;
  padding-left: 16px;
  background: var(--color-body-bg);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  align-items: center;
  height: 60px;
  display: flex;
  align-items: center;
  .ellipse {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
  }
  .rubick-tag {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 8px;
    height: 40px;
    border-radius: 9px;
    background: var(--color-list-hover);
  }
  .select-tag {
    white-space: pre;
    user-select: none;
    font-size: 16px;
    color: var(--color-text-primary);
    margin-left: 8px;
  }

  .main-input {
    height: 40px !important;
    box-sizing: border-box;
    flex: 1;
    border: none;
    outline: none;
    box-shadow: none !important;
    background: var(--color-body-bg);
    padding-left: 8px;
    .ant-select-selection,
    .ant-input,
    .ant-select-selection__rendered {
      caret-color: var(--ant-primary-color);
      height: 100% !important;
      font-size: 16px;
      border: none !important;
      background: var(--color-body-bg);
      color: var(--color-text-primary);
    }
  }

  .rubick-logo {
    width: 32px;
    border-radius: 100%;
  }
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
    background: var(--color-input-hover);
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
      color: var(--color-text-content);
    }
    .loading {
      color: var(--ant-primary-color);
      position: absolute;
      top: 0;
      left: 0;
    }
    .update-tips {
      position: absolute;
      right: 46px;
      top: 50%;
      font-size: 14px;
      transform: translateY(-50%);
      color: #aaa;
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
    border: 1px solid var(--color-border-light);
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
