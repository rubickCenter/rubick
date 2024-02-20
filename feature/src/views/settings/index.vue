<template>
  <div class="settings">
    <div class="view-title"> {{ $t('feature.settings.title') }}</div>
    <div class="view-container">
      <a-menu v-model:selectedKeys="currentSelect" mode="horizontal">
        <a-menu-item key="userInfo">
          {{ $t('feature.settings.account.accountInfo') }}
        </a-menu-item>
        <a-menu-item key="normal">
          {{ $t('feature.settings.basic.title') }}
        </a-menu-item>
        <a-menu-item key="localstart">
          {{ $t('feature.settings.localstart.title') }}
        </a-menu-item>
        <a-menu-item key="global">
          {{ $t('feature.settings.global.title') }}
        </a-menu-item>
        <!--        <a-menu-item key="superpanel">-->
        <!--          <template #icon>-->
        <!--            <FileAddOutlined />-->
        <!--          </template>-->
        <!--          {{ $t('feature.settings.superPanel.title') }}-->
        <!--        </a-menu-item>-->
        <a-menu-item key="database">
          {{ $t('feature.settings.database.title') }}
        </a-menu-item>
        <a-menu-item key="localhost">
          {{ $t('feature.settings.intranet.title') }}
        </a-menu-item>
      </a-menu>
      <div class="settings-detail">
        <UserInfo v-if="currentSelect[0] === 'userInfo'" />
        <div v-if="currentSelect[0] === 'normal'">
          <div class="setting-item">
            <div class="title">
              {{ $t('feature.settings.basic.shortcutKey') }}
            </div>
            <div class="settings-item-li">
              <div class="label">
                {{ $t('feature.settings.basic.showOrHiddle') }}
              </div>
              <a-tooltip placement="top" trigger="click">
                <template #title>
                  <span>{{ tipText }}</span>
                  <template v-if="isWindows">
                    <br />
                    <span
                      style="cursor: pointer; text-decoration: underline"
                      @click="resetDefault('Alt')"
                    >
                    Alt+Space
                  </span>
                    <span
                      style="
                      cursor: pointer;
                      margin-left: 8px;
                      text-decoration: underline;
                    "
                      @click="resetDefault('Ctrl')"
                    >
                    Ctrl+Space
                  </span>
                  </template>
                </template>
                <div
                  class="value"
                  tabIndex="-1"
                  @keyup="(e) => changeShortCut(e, 'showAndHidden')"
                >
                  {{ shortCut.showAndHidden }}
                </div>
              </a-tooltip>
            </div>
            <div class="settings-item-li">
              <div class="label">
                {{ $t('feature.settings.basic.screenCapture') }}
              </div>
              <a-tooltip placement="top" trigger="click">
                <template #title>
                  <span>{{ tipText }}</span>
                </template>
                <div
                  class="value"
                  tabIndex="-1"
                  @keyup="(e) => changeShortCut(e, 'capture')"
                >
                  {{ shortCut.capture }}
                </div>
              </a-tooltip>
            </div>
          </div>
          <div class="setting-item">
            <div class="title">{{ $t('feature.settings.basic.common') }}</div>
            <div class="settings-item-li">
              <div class="label">
                {{ $t('feature.settings.basic.autoPaste') }}
              </div>
              <a-switch
                v-model:checked="common.autoPast"
                :checked-children="$t('feature.settings.basic.on')"
                :un-checked-children="$t('feature.settings.basic.off')"
              ></a-switch>
            </div>
            <div class="settings-item-li">
              <div class="label">{{ $t('feature.settings.basic.autoBoot') }}</div>
              <a-switch
                v-model:checked="common.start"
                :checked-children="$t('feature.settings.basic.on')"
                :un-checked-children="$t('feature.settings.basic.off')"
              ></a-switch>
            </div>
            <div class="settings-item-li">
              <div class="label">
                {{ $t('feature.settings.basic.spaceExec') }}
              </div>
              <a-switch
                v-model:checked="common.space"
                :checked-children="$t('feature.settings.basic.on')"
                :un-checked-children="$t('feature.settings.basic.off')"
              ></a-switch>
            </div>
            <div class="settings-item-li">
              <div class="label">
                {{ $t('feature.settings.basic.history') }}
              </div>
              <a-switch
                v-model:checked="common.history"
                :checked-children="$t('feature.settings.basic.on')"
                :un-checked-children="$t('feature.settings.basic.off')"
              ></a-switch>
            </div>
          </div>
          <div class="setting-item">
            <div class="title">{{ $t('feature.settings.basic.theme') }}</div>
            <div class="settings-item-li">
              <div class="label">{{ $t('feature.settings.basic.darkMode') }}</div>
              <a-switch
                v-model:checked="common.darkMode"
                :checked-children="$t('feature.settings.basic.on')"
                :un-checked-children="$t('feature.settings.basic.off')"
              ></a-switch>
            </div>
          </div>
          <div class="setting-item">
            <div class="title">{{ $t('feature.settings.basic.language') }}</div>
            <div class="settings-item-li">
              <div class="label">
                {{ $t('feature.settings.basic.changeLang') }}
              </div>
              <a-select
                v-model:value="state.common.lang"
                label-in-value
                style="width: 240px"
                :options="options"
                @change="changeLanguage"
              ></a-select>
            </div>
          </div>
        </div>
        <div v-if="currentSelect[0] === 'global'">
          <a-collapse>
            <a-collapse-panel
              key="1"
              :header="$t('feature.settings.global.instructions')"
            >
              <div>
                {{ $t('feature.settings.global.tips') }}
              </div>
              <h3 style="margin-top: 10px">
                {{ $t('feature.settings.global.example') }}
              </h3>
              <a-divider style="margin: 5px 0" />
              <a-list item-layout="horizontal" :data-source="examples">
                <template #renderItem="{ item }">
                  <a-list-item>
                    <a-list-item-meta :description="item.desc">
                      <template #title>
                        <div>{{ item.title }}</div>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
              </a-list>
            </a-collapse-panel>
          </a-collapse>
          <div class="feature-container">
            <div class="keywords item">
              <div>{{ $t('feature.settings.global.shortcutKey') }}</div>
              <template :key="index" v-for="(item, index) in global">
                <a-tooltip placement="top" trigger="click">
                  <template #title>
                    <span>{{ tipText }}</span>
                  </template>
                  <div
                    class="value"
                    tabIndex="2"
                    @keyup="(e) => changeGlobalKey(e, index)"
                  >
                    {{ item.key }}
                    <MinusCircleOutlined
                      @click.stop="deleteGlobalKey(e, index)"
                    />
                  </div>
                </a-tooltip>
              </template>
            </div>
            <div class="short-cut item">
              <div>{{ $t('feature.settings.global.funtionKey') }}</div>
              <template v-for="(item, index) in global" :key="index">
                <a-input
                  :value="item.value"
                  class="value"
                  allowClear
                  :disabled="!item.key"
                  @change="(e) => changeGlobalValue(index, e.target.value)"
                />
              </template>
            </div>
          </div>
          <div @click="addConfig" class="add-global">
            <PlusCircleOutlined />
            {{ $t('feature.settings.global.addShortcutKey') }}
          </div>
        </div>
        <Localhost v-if="currentSelect[0] === 'localhost'" />
        <LocalStart v-if="currentSelect[0] === 'localstart'" />
        <DataBase v-if="currentSelect[0] === 'database'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ToolOutlined,
  LaptopOutlined,
  DatabaseOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  UserOutlined,
  FolderOpenOutlined,
  SafetyOutlined,
} from '@ant-design/icons-vue';
import debounce from 'lodash.debounce';
import { ref, reactive, watch, toRefs, computed } from 'vue';
import keycodes from './keycode';
import Localhost from './localhost.vue';
import UserInfo from './user-info';
import LocalStart from './local-start';
import DataBase from './database';
import { useI18n } from 'vue-i18n';
import localConfig from '@/confOp';

const { locale, t } = useI18n();

const { ipcRenderer } = window.require('electron');

const examples = [
  {
    title: t('feature.settings.global.example1'),
    desc: t('feature.settings.global.tips1'),
  },
  {
    title: t('feature.settings.global.example2'),
    desc: t('feature.settings.global.tips2'),
  },
];

const state = reactive({
  shortCut: {},
  common: {},
  local: {},
  global: [],
  custom: {},
});

const isWindows = window?.rubick?.isWindows();
const tipText = computed(() => {
  const optionKeyName = isWindows ? 'Alt' : 'Option、Command';
  return t('feature.settings.global.addShortcutKeyTips', {
    optionKeyName: optionKeyName,
  });
});

const currentSelect = ref(['userInfo']);

const { perf, global: defaultGlobal } = localConfig.getConfig();

state.shortCut = perf.shortCut;
state.custom = perf.custom;
state.common = perf.common;
state.local = perf.local;
state.global = defaultGlobal;

const setConfig = debounce(() => {
  const { perf } = localConfig.getConfig();
  localConfig.setConfig(
    JSON.parse(
      JSON.stringify({
        perf: {
          ...perf,
          shortCut: state.shortCut,
          common: state.common,
          local: state.local,
        },
        global: state.global,
      })
    )
  );
  ipcRenderer.send('re-register');
}, 500);

watch(state, setConfig);

const changeShortCut = (e, key) => {
  let compose = '';
  // 添加是否包含功能键的判断
  let incluFuncKeys = false;
  if (e.ctrlKey && e.keyCode !== 17) {
    compose += '+Ctrl';
    incluFuncKeys = true;
  }
  if (e.shiftKey && e.keyCode !== 16) {
    compose += '+Shift';
    incluFuncKeys = true;
  }
  if (e.altKey && e.keyCode !== 18) {
    compose += '+Option';
    incluFuncKeys = true;
  }
  if (e.metaKey && e.keyCode !== 93) {
    compose += '+Command';
    incluFuncKeys = true;
  }
  compose += '+' + keycodes[e.keyCode].toUpperCase();
  compose = compose.substring(1);
  if (
    incluFuncKeys &&
    e.keyCode !== 16 &&
    e.keyCode !== 17 &&
    e.keyCode !== 18 &&
    e.keyCode !== 93
  ) {
    state.shortCut[key] = compose;
  } else {
    // 不做处理
  }
};

const changeGlobalKey = (e, index) => {
  let compose = '';
  // 添加是否包含功能键的判断
  let incluFuncKeys = false;
  if (e.ctrlKey && e.keyCode !== 17) {
    compose += '+Ctrl';
    incluFuncKeys = true;
  }
  if (e.shiftKey && e.keyCode !== 16) {
    compose += '+Shift';
    incluFuncKeys = true;
  }
  if (e.altKey && e.keyCode !== 18) {
    compose += '+Option';
    incluFuncKeys = true;
  }
  if (e.metaKey && e.keyCode !== 93) {
    compose += '+Command';
    incluFuncKeys = true;
  }
  compose += '+' + keycodes[e.keyCode].toUpperCase();
  compose = compose.substring(1);
  if (
    incluFuncKeys &&
    e.keyCode !== 16 &&
    e.keyCode !== 17 &&
    e.keyCode !== 18 &&
    e.keyCode !== 93
  ) {
    state.global[index].key = compose;
  } else {
    // 不做处理
  }
  // f1 - f12
  if (!incluFuncKeys && e.keyCode >= 112 && e.keyCode <= 123) {
    compose = keycodes[e.keyCode].toUpperCase();
    state.global[index].key = compose;
  }
};

const resetDefault = (key) => {
  switch (key) {
    case 'Alt':
      state.shortCut['showAndHidden'] = 'Option+SPACE';
      // copyValue.value = "Option+SPACE";
      break;
    case 'Ctrl':
      state.shortCut['showAndHidden'] = 'Ctrl+SPACE';
      // copyValue.value = "Ctrl+SPACE";
      break;
    default:
      break;
  }
  setConfig();
};

const changeGlobalValue = (index, value) => {
  state.global[index].value = value;
};

const deleteGlobalKey = (e, index) => {
  state.global.splice(index, 1);
  // delete state.global[index];
};

const addConfig = () => {
  state.global.push({
    key: '',
    value: '',
  });
};

const { shortCut, common, local, global } = toRefs(state);

const options = ref([
  {
    value: 'zh-CN',
    label: t('feature.settings.basic.cn'),
  },
  {
    value: 'en-US',
    label: t('feature.settings.basic.en'),
  },
]);

const changeLanguage = (value) => {
  state.common.lang = value.key;
  locale.value = value.key;
};
</script>

<style lang="less">
@import '~@/assets/common.less';

.settings {
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;
  background: var(--color-body-bg2);
  height: calc(~'100vh - 34px');
  .ant-menu-horizontal {
    border-bottom: 1px solid var(--color-border-light);
  }
  .view-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    color: var(--color-text-primary);
  }
  .view-container {
    border-radius: 8px;
    background: var(--color-body-bg);
    overflow: auto;
    height: calc(~'100vh - 84px');
  }
  .ant-menu {
    background: var(--color-body-bg) !important;
    color: var(--color-text-content) !important;
  }

  .settings-detail {
    padding: 20px;
    box-sizing: border-box;
    flex: 1;
    overflow: auto;
    background: var(--color-body-bg);

    .setting-item {
      margin-bottom: 20px;

      .ant-form-item {
        margin-bottom: 0;
      }

      .title {
        color: var(--ant-primary-color);
        font-size: 14px;
        margin-bottom: 10px;
      }

      .settings-item-li {
        padding-left: 20px;
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;

        .label {
          color: var(--color-text-content);
        }

        .value {
          width: 300px;
          cursor: pointer;
          text-align: center;
          border: 1px solid var(--color-border-light);
          color: var(--ant-primary-color);
          font-size: 14px;
          height: 24px;
          font-weight: lighter;
          background: var(--color-input-hover);
          .ant-input {
            text-align: center;
            color: var(--ant-primary-color);
            font-size: 14px;
            font-weight: lighter;
            background: var(--color-input-hover);
          }
        }

        .ant-switch {
          &:not(.ant-switch-checked) {
            background: var(--color-list-hover);
          }
        }
        .ant-select-selector {
          background: var(--color-input-hover) !important;
          color: var(--color-text-content);
        }
        .ant-input-password-icon, .ant-select-arrow {
          color: var(--color-action-color);
        }
      }
    }
  }

  .feature-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 10px;
    font-size: 14px;

    .item {
      flex: 1;
      color: var(--color-text-content);
    }

    .short-cut {
      margin-left: 20px;
    }

    .value {
      cursor: pointer;
      text-align: center;
      border: 1px solid var(--color-border-light);
      color: var(--ant-primary-color);
      font-size: 14px;
      height: 24px;
      font-weight: lighter;
      margin-top: 10px;
      position: relative;
      background: var(--color-input-hover);

      .ant-input {
        color: var(--ant-primary-color);
        font-weight: lighter;
        background: none;
      }

      .anticon {
        color: var(--color-text-desc);
      }

      &.ant-input-affix-wrapper {
        display: flex;
      }

      &:hover {
        .anticon {
          display: block;
          color: var(--color-text-content);
        }
      }

      .anticon {
        position: absolute;
        display: none;
        right: 4px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  .add-global {
    color: var(--ant-primary-color);
    margin-top: 20px;
    width: 100%;
    text-align: center;
    cursor: pointer;
  }

  .ant-collapse {
    background: var(--color-input-hover);
    .ant-collapse-content {
      background: var(--color-input-hover);
      color: var(--color-text-content);
    }

    h3,
    .ant-collapse-header,
    .ant-list-item-meta-title {
      color: var(--color-text-primary);
    }

    .ant-list-item-meta-description {
      color: var(--color-text-desc);
    }
  }
}
</style>
