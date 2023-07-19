<template>
  <div class="settings">
    <div class="left-menu">
      <a-menu v-model:selectedKeys="currentSelect" mode="inline">
        <a-menu-item key="userInfo">
          <template #icon>
            <UserOutlined/>
          </template>
          账户信息
        </a-menu-item>
        <a-menu-item key="normal">
          <template #icon>
            <ToolOutlined/>
          </template>
          基本设置
        </a-menu-item>
        <a-menu-item key="global">
          <template #icon>
            <LaptopOutlined/>
          </template>
          全局快捷键
        </a-menu-item>
        <a-menu-item key="superpanel">
          <template #icon>
            <FileAddOutlined/>
          </template>
          超级面板设置
        </a-menu-item>
        <a-menu-item key="localhost">
          <template #icon>
            <DatabaseOutlined/>
          </template>
          内网部署配置
        </a-menu-item>
      </a-menu>
    </div>
    <div class="settings-detail">
      <div v-if="currentSelect[0] === 'normal'">
        <div class="setting-item">
          <div class="title">快捷键</div>
          <div class="settings-item-li">
            <div class="label">显示/隐藏快捷键</div>
            <a-tooltip placement="top" trigger="click">
              <template #title>
                <span>{{ tipText }}</span>
                <template v-if="isWindows">
                  <br/>
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
            <div class="label">截屏</div>
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
          <div class="title">通用</div>
          <div class="settings-item-li">
            <div class="label">输入框自动粘贴</div>
            <a-switch
              v-model:checked="common.autoPast"
              checked-children="开"
              un-checked-children="关"
            ></a-switch>
          </div>
          <div class="settings-item-li">
            <div class="label">开机启动</div>
            <a-switch
              v-model:checked="common.start"
              checked-children="开"
              un-checked-children="关"
            ></a-switch>
          </div>
          <div class="settings-item-li">
            <div class="label">空格执行</div>
            <a-switch
              v-model:checked="common.space"
              checked-children="开"
              un-checked-children="关"
            ></a-switch>
          </div>
        </div>
        <div class="setting-item">
          <div class="title">主题</div>
          <div class="settings-item-li">
            <div class="label">暗黑模式</div>
            <a-switch
              v-model:checked="common.darkMode"
              checked-children="开"
              un-checked-children="关"
            ></a-switch>
          </div>
        </div>
      </div>
      <div v-if="currentSelect[0] === 'global'">
        <a-collapse>
          <a-collapse-panel key="1" header="说明及示例">
            <div>
              按下快捷键，自动搜索对应关键字，当关键字结果完全匹配，且结果唯一时，会直接指向该功能。
            </div>
            <h3 style="margin-top: 10px">示例</h3>
            <a-divider style="margin: 5px 0"/>
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
            <div>快捷键</div>
            <template :key="index" v-for="(item, index) in global">
              <a-tooltip placement="top" trigger="click">
                <template #title>
                  <span>{{ tipText }}或按 F1-F12 单键</span>
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
            <div>功能关键字</div>
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
          <PlusCircleOutlined/>
          新增全局快捷功能
        </div>
      </div>
      <Localhost v-if="currentSelect[0] === 'localhost'"/>
      <SuperPanel v-if="currentSelect[0] === 'superpanel'"/>
      <UserInfo v-if="currentSelect[0] === 'userInfo'"/>
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
  FileAddOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import debounce from 'lodash.debounce';
import {ref, reactive, watch, toRefs, computed, toRaw} from 'vue';
import keycodes from './keycode';
import Localhost from './localhost.vue';
import SuperPanel from './super-panel.vue';
import UserInfo from './user-info';

const {remote, ipcRenderer} = window.require('electron');

const examples = [
  {
    title: '快捷键 「 Alt + W」 关键字 「 微信」',
    desc: '按下Alt + W 直接打开本地微信应用',
  },
  {
    title: '快捷键 「 Alt + Q」 关键字 「 取色」',
    desc: '按下Alt + Q 直接打开屏幕取色功能',
  },
  {
    title: '快捷键 「 Ctrl + Alt + Q」 关键字 「 截屏」',
    desc: '按下 Ctrl + Alt + Q 进行截屏',
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
  return `先按功能键（Ctrl、Shift、${optionKeyName}），再按其他普通键。`;
});

const currentSelect = ref(['userInfo']);

const {perf, global: defaultGlobal} = remote.getGlobal('OP_CONFIG').get();

state.shortCut = perf.shortCut;
state.custom = perf.custom;
state.common = perf.common;
state.local = perf.local;
state.global = defaultGlobal;

const setConfig = debounce(() => {
  remote.getGlobal('OP_CONFIG').set(
    JSON.parse(
      JSON.stringify({
        perf: {
          shortCut: state.shortCut,
          common: state.common,
          local: state.local,
          custom: state.custom,
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
  compose = compose.substring(1)
  if (incluFuncKeys && e.keyCode !== 16 && e.keyCode !== 17 && e.keyCode !== 18 && e.keyCode !== 93) {
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
  compose = compose.substring(1)
  if (incluFuncKeys && e.keyCode !== 16 && e.keyCode !== 17 && e.keyCode !== 18 && e.keyCode !== 93) {
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

const {shortCut, common, local, global} = toRefs(state);
</script>

<style lang="less">
@import '~@/assets/common.less';

.settings {
  box-sizing: border-box;
  width: 100%;
  overflow-x: hidden;
  background: var(--color-body-bg);
  height: calc(~'100vh - 46px');
  display: flex;
  
  .ant-menu {
    background: var(--color-body-bg) !important;
    color: var(--color-text-content) !important;
  }
  
  .settings-detail {
    padding: 20px;
    box-sizing: border-box;
    flex: 1;
    overflow: auto;
    height: 100%;
    background: var(--color-body-bg);
    
    .setting-item {
      margin-bottom: 20px;
      
      .ant-form-item {
        margin-bottom: 0;
      }
      
      .title {
        color: var(--ant-primary-color);
        font-size: 15px;
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
          
          .ant-input {
            text-align: center;
            color: var(--ant-primary-color);
            font-size: 14px;
            font-weight: lighter;
          }
        }
        
        .ant-switch {
          &:not(.ant-switch-checked) {
            background: var(--color-list-hover);
          }
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
