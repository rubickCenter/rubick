<template>
  <div class="pg-settings">
    <div class="dev-detail">
      <a-menu
        v-model="currentSelect"
        style="width: 256px; height: 100%"
        mode="vertical"
      >
        <a-menu-item :key="0">
          偏好设置
        </a-menu-item>
        <a-menu-item :key="1">
          超级面板
        </a-menu-item>
        <a-menu-item :key="2">
          全局快捷键
        </a-menu-item>
      </a-menu>
      <div class="settings-detail">
        <div v-if="currentSelect[0] === 0">
          <div class="setting-item">
            <div class="title">
              快捷键(需要使用 option/ctrl/shift/command 键修饰)
            </div>
            <div class="settings-item-li">
              <div class="label">显示/隐藏快捷键</div>
              <div
                class="value"
                tabIndex="-1"
                @keyup="(e) => changeShortCut(e, 'showAndHidden')"
              >
                {{ config.perf.shortCut.showAndHidden }}
              </div>
            </div>
            <div class="settings-item-li">
              <div class="label">插件分离快捷键</div>
              <div
                class="value"
                tabIndex="-1"
                @keyup="(e) => changeShortCut(e, 'separate')"
              >
                {{ config.perf.shortCut.separate }}
              </div>
            </div>
            <div class="settings-item-li">
              <div class="label">返回主界面</div>
              <div
                class="value"
                tabIndex="-1"
                @keyup="(e) => changeShortCut(e, 'quit')"
              >
                {{ config.perf.shortCut.quit }}
              </div>
            </div>
          </div>
          <div class="setting-item">
            <div class="title">通用</div>
            <div class="settings-item-li">
              <div class="label">开机启动</div>
              <a-switch
                v-model:checked="config.perf.common.start"
                checked-children="开"
                un-checked-children="关"
              ></a-switch>
            </div>
            <div class="settings-item-li">
              <div class="label">空格执行</div>
              <a-switch
                v-model:checked="config.perf.common.space"
                checked-children="开"
                un-checked-children="关"
              ></a-switch>
            </div>
          </div>
          <div class="setting-item">
            <div class="title">本地搜索启动</div>
            <div class="settings-item-li">
              <div class="label">搜索启动应用&文件</div>
              <a-switch
                v-model:checked="config.perf.local.search"
                checked-children="开"
                un-checked-children="关"
              ></a-switch>
            </div>
          </div>
        </div>
        <div v-if="currentSelect[0] === 1">
          <div class="setting-item">
            <div class="title">弹出面板</div>
            <a-select value="mouseRight" style="width: 200px" disabled>
              <a-select-option value="mouseRight">长按鼠标右键</a-select-option>
            </a-select>
          </div>
          <div class="setting-item">
            <div class="title">长按以下设置的毫秒响应</div>
            <a-slider
              :step="100"
              v-model:value="config.superPanel.mouseDownTime"
              :min="200"
              :max="1000"
            />
          </div>
        </div>
        <div v-if="currentSelect[0] === 2">
          <a-collapse>
            <a-collapse-panel key="1" header="说明及示例">
              <div>
                按下快捷键，自动搜索对应关键字，当关键字结果完全匹配，且结果唯一时，会直接指向该功能。
              </div>
              <h3 style="margin-top: 10px;">示例</h3>
              <a-divider style="margin: 5px 0;" />
              <a-list item-layout="horizontal" :data-source="examples">
                <a-list-item slot="renderItem" slot-scope="item, index">
                  <a-list-item-meta :description="item.desc">
                    <div slot="title">{{ item.title }}</div>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-collapse-panel>
          </a-collapse>
          <div class="feature-container">
            <div class="keywords item">
              <div>快捷键</div>
              <a-tooltip placement="top" trigger="click">
                <template slot="title">
                  <span
                    >先按功能键（Ctrl、Shift、Alt、Option、Command），再按其他普通键。或按
                    F1-F12 单键</span
                  >
                </template>
                <div
                  v-for="(item, index) in config.global"
                  class="value"
                  tabIndex="-1"
                  @keyup="(e) => changeGlobalKey(e, index)"
                >
                  {{ item.key }}
                </div>
              </a-tooltip>
            </div>
            <div class="short-cut item">
              <div>功能关键字</div>
              <a-input
                :value="item.value"
                v-for="(item, index) in config.global"
                class="value"
                :disabled="!item.key"
                @change="(e) => changeGlobalValue(index, e.target.value)"
              />
            </div>
          </div>
          <div @click="addConfig" class="add-global">+ 新增全局快捷功能</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import keycodes from "../../../assets/keycode";
import { ipcRenderer, remote } from "electron";

const opConfig = remote.getGlobal("opConfig");

export default {
  data() {
    return {
      currentSelect: [0],
      config: { ...opConfig.get() },
      examples: [
        {
          title: "快捷键 「 Alt + W」 关键字 「 微信」",
          desc: "按下Alt + W 直接打开本地微信应用",
        },
        {
          title: "快捷键 「 Alt + Q」 关键字 「 取色」",
          desc: "按下Alt + Q 直接打开屏幕取色功能",
        },
      ],
    };
  },
  methods: {
    changeShortCut(e, key) {
      let change = false;
      if (e.altKey && e.keyCode !== 18) {
        const compose = `Option+${keycodes[e.keyCode].toUpperCase()}`;
        this.config.perf.shortCut[key] = compose;
        change = true;
      }
      if (e.ctrlKey && e.keyCode !== 17) {
        const compose = `Ctrl+${keycodes[e.keyCode].toUpperCase()}`;
        this.config.perf.shortCut[key] = compose;
        change = true;
      }
      if (e.shiftKey && e.keyCode !== 16) {
        const compose = `Shift+${keycodes[e.keyCode].toUpperCase()}`;
        this.config.perf.shortCut[key] = compose;
        change = true;
      }
      if (e.metaKey && e.keyCode !== 93) {
        const compose = `Command+${keycodes[e.keyCode].toUpperCase()}`;
        this.config.perf.shortCut[key] = compose;
        change = true;
      }
    },
    addConfig() {
      this.config.global.push({
        key: "",
        value: "",
      });
    },
    changeGlobalKey(e, index) {
      let compose;
      if (e.altKey && e.keyCode !== 18) {
        compose = `Alt+${keycodes[e.keyCode].toUpperCase()}`;
      }
      if (e.ctrlKey && e.keyCode !== 17) {
        compose = `Ctrl+${keycodes[e.keyCode].toUpperCase()}`;
      }
      if (e.shiftKey && e.keyCode !== 16) {
        compose = `Shift+${keycodes[e.keyCode].toUpperCase()}`;
      }
      if (e.metaKey && e.keyCode !== 93) {
        compose = `Command+${keycodes[e.keyCode].toUpperCase()}`;
      }
      if (compose) {
        this.$set(this.config.global[index], "key", compose);
      }
      // f1 - f12
      if (e.keyCode >= 112 && e.keyCode <= 123) {
        compose = keycodes[e.keyCode].toUpperCase();
      }
      if (compose) {
        this.$set(this.config.global[index], "key", compose);
      }
    },
    changeGlobalValue(index, value) {
      this.$set(this.config.global[index], "value", value);
    },
  },
  watch: {
    config: {
      deep: true,
      handler() {
        opConfig.set("perf", this.config.perf);
        opConfig.set("superPanel", this.config.superPanel);
        opConfig.set("global", this.config.global);
        ipcRenderer.send("re-register");
      },
    },
  },
};
</script>

<style lang="less">
.pg-settings {
  height: calc(~"100vh - 110px");
  overflow: auto;
  .dev-detail {
    height: 100%;
    display: flex;
    align-items: flex-start;
    background: #fff;
  }
  .settings-detail {
    padding: 20px;
    box-sizing: border-box;
    flex: 1;
    overflow: auto;
    height: 100%;
    .setting-item {
      margin-bottom: 20px;
      .ant-form-item {
        margin-bottom: 0;
      }
      .title {
        color: #6c9fe2;
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
          color: #646464;
        }
        .value {
          width: 300px;
          text-align: center;
          border: 1px solid #ddd;
          color: #6c9fe2;
          font-size: 14px;
          height: 24px;
          font-weight: lighter;
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
    }
    .short-cut {
      margin-left: 20px;
    }
    .value {
      text-align: center;
      border: 1px solid #ddd;
      color: #6c9fe2;
      font-size: 14px;
      height: 24px;
      font-weight: lighter;
      margin-top: 10px;
    }
  }
  .add-global {
    color: #6c9fe2;
    margin-top: 20px;
    width: 100%;
    text-align: center;
    cursor: pointer;
  }
}
</style>
