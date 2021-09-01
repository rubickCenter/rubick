<template>
  <div @mousedown="drag" >
    <a-layout  id="components-layout">
      <div v-if="!searchType" class="rubick-select">
        <div class="tag-container" v-if="selected">
          <a-tag
            :key="selected.key"
            @close="closeTag"
            class="select-tag"
            color="green"
            closable
          >
            {{ selected.name }}
          </a-tag>
        </div>
        <a-input
          id="search"
          :placeholder="
          subPlaceHolder && selected && selected.key === 'plugin-container'
            ? subPlaceHolder
            : 'Hi, Rubick'
        "
          class="main-input"
          @change="(e) => search({ value: e.target.value })"
          @keydown.ctrl.86="shouldPaste"
          :value="searchValue"
          :maxLength="selected && selected.key !== 'plugin-container' ? 0 : 1000"
          @keydown.down="(e) => changeCurrent(1)"
          @keydown.up="() => changeCurrent(-1)"
          @keypress.enter="
          (e) => targetSearch({ value: e.target.value, type: 'enter' })
        "
          @keypress.space="
          (e) => targetSearch({ value: e.target.value, type: 'space' })
        "
        >
          <div @click="goMenu" class="suffix-tool" slot="suffix">
            <a-icon
              v-show="selected && selected.key === 'plugin-container'"
              class="icon-more"
              type="more"
            />
            <div v-if="selected && selected.icon" style="position: relative">
              <a-spin v-show="pluginLoading" class="loading">
                <a-icon slot="indicator" type="loading" style="font-size: 42px" spin />
              </a-spin>
              <img
                class="icon-tool"
                :src="selected.icon"
              />
            </div>
            <div v-else class="rubick-logo">
              <img src="./assets/imgs/logo.png" />
            </div>
          </div>
        </a-input>
        <div class="options" v-show="showOptions">
          <a-list item-layout="horizontal" :data-source="options">
            <a-list-item
              @click="() => item.click($router)"
              :class="currentSelect === index ? 'active op-item' : 'op-item'"
              slot="renderItem"
              slot-scope="item, index"
            >
              <a-list-item-meta :description="item.desc">
                <span slot="title" v-html="renderTitle(item.name)"></span>
                <a-avatar
                  slot="avatar"
                  style="border-radius: 0"
                  :src="item.icon"
                />
              </a-list-item-meta>
              <a-tag v-show="item.type === 'dev'">开发者</a-tag>
              <a-tag v-show="item.type === 'system'">系统</a-tag>
            </a-list-item>
          </a-list>
        </div>
      </div>
      <div class="rubick-select-subMenu" v-else>
        <div>
          <img
            class="icon-tool-sub"
            v-if="pluginInfo.icon"
            :src="pluginInfo.icon"
          />
          <a-input
            :placeholder="subPlaceHolder"
            class="sub-input"
            @change="
            (e) =>
              search({
                value: e.target.value,
                searchType: pluginInfo.searchType,
              })
          "
            :value="searchValue"
            @keypress.enter="
            (e) => targetSearch({ value: e.target.value, type: 'enter' })
          "
            @keypress.space="
            (e) => targetSearch({ value: e.target.value, type: 'space' })
          "
          ></a-input>
        </div>

        <div class="icon-container">
          <a-icon class="icon" type="info-circle" />
          <a-icon class="icon" @click="goMenu('separate')" type="setting" />
        </div>
      </div>
      <router-view></router-view>
    </a-layout>
  </div>
</template>
<script>
import { mapActions, mapMutations, mapState } from "vuex";
import { ipcRenderer, remote, clipboard } from "electron";
import {
  getWindowHeight,
  debounce,
  searchKeyValues,
  fileLists,
} from "./assets/common/utils";
const opConfig = remote.getGlobal("opConfig");
const { Menu, MenuItem } = remote;

export default {
  data() {
    return {
      query: this.$route.query,
      searchFn: null,
      config: opConfig.get(),
      currentSelect: 0,
    };
  },

  created() {
    window.setPluginInfo = (pluginInfo) => {
      this.commonUpdate({
        pluginInfo: pluginInfo,
      });
    };
  },

  mounted() {
    ipcRenderer.on("init-rubick", this.closeTag);
    ipcRenderer.on("new-window", this.newWindow);
    // 超级面板打开插件
    ipcRenderer.on("superPanel-openPlugin", (e, args) => {
      this.closeTag();
      ipcRenderer.send("msg-trigger", {
        type: "showMainWindow",
      });
      this.openPlugin({
        cmd: args.cmd,
        plugin: args.plugin,
        feature: args.feature,
        router: this.$router,
        payload: args.data,
      });
    });
    ipcRenderer.on("global-short-key", (e, args) => {
      let config;
      this.devPlugins.forEach((plugin) => {
        // dev 插件未开启
        if (plugin.type === "dev" && !plugin.status) return;
        const feature = plugin.features;
        feature.forEach((fe) => {
          const cmd = searchKeyValues(fe.cmds, args)[0];
          const systemPlugin = fileLists.filter(
            (plugin) => {
              let has = false;
              plugin.keyWords.some(keyWord => {
                if (keyWord.toLocaleUpperCase().indexOf(args.toLocaleUpperCase()) >= 0) {
                  has = keyWord;
                  plugin.name = keyWord;
                  return true;
                }
                return false;
              });
              return has;
            }
          )[0];
          if (cmd) {
            config = {
              cmd: cmd,
              plugin: plugin,
              feature: fe,
              router: this.$router,
            };
          } else if (systemPlugin) {
            config = {
              plugin: systemPlugin,
              router: this.$router,
            };
          }
        });
      });
      config && this.openPlugin(config);
    });
    // 打开偏好设置
    ipcRenderer.on("tray-setting", () => {
      this.showMainUI();
      this.changePath({ key: "settings" });
    });
    const searchNd = document.getElementById("search");
    searchNd && searchNd.addEventListener("keydown", this.checkNeedInit);
  },
  methods: {
    ...mapActions("main", ["onSearch", "showMainUI", "openPlugin"]),
    ...mapMutations("main", ["commonUpdate"]),
    shouldPaste(e) {
      let filePath = '';
      if (process.platform === 'win32') {
        const rawFilePath = clipboard.read('FileNameW');
        filePath = rawFilePath.replace(new RegExp(String.fromCharCode(0), 'g'), '');
        if (filePath.indexOf('plugin.json') >= 0) {
          this.search({
            filePath,
          });
        }
      }
    },
    search(v) {
      if (!this.searchFn) {
        this.searchFn = debounce(this.onSearch, 200);
      }
      this.searchFn(v);
    },
    targetSearch(action) {
      // 在插件界面唤起搜索功能
      if (
        (this.selected && this.selected.key === "plugin-container") ||
        this.searchType === "subWindow"
      ) {
        const webview = document.getElementById("webview");
        if (action.type === "space") {
          if (this.config.perf.common.space) {
            webview.send("msg-back-setSubInput", this.searchValue);
          }
          return;
        }
        webview.send("msg-back-setSubInput", this.searchValue);
      } else if (this.showOptions) {
        const item = this.options[this.currentSelect];
        item.click(this.$router);
      }
    },
    changeCurrent(index) {
      const webview = document.getElementById("webview");
      webview && webview.send("changeCurrent", index);
      if (!this.options) return;
      if (
        this.currentSelect + index > this.options.length - 1 ||
        this.currentSelect + index < 0
      )
        return;
      this.currentSelect = this.currentSelect + index;
    },

    renderTitle(title) {
      if (typeof title !== "string") return;
      const result = title.split(this.searchValue);
      if (result && result.length > 1) {
        return `<div>${result[0]}<span style="color: red">${this.searchValue}</span>${result[1]}</div>`;
      } else {
        return `<div>${result[0]}</div>`;
      }
    },
    checkNeedInit(e) {
      // 如果搜索栏无内容，且按了删除键，则清空 tag
      if (this.searchValue === "" && e.keyCode === 8) {
        this.closeTag();
      }
    },
    changePath({ key }) {
      this.$router.push({ path: `/home/${key}` });
      this.commonUpdate({
        current: [key],
      });
    },
    closeTag(v) {
      this.commonUpdate({
        selected: null,
        showMain: false,
        options: [],
      });
      ipcRenderer.send("changeWindowSize-rubick", {
        height: getWindowHeight([]),
      });
      this.$router.push({
        path: "/home",
      });
    },
    newWindow() {
      ipcRenderer.send("new-window", {
        ...this.pluginInfo,
      });
      this.closeTag();
    },
    goMenu(type) {
      if (
        (this.selected && this.selected.key === "plugin-container") ||
        type === "separate"
      ) {
        const pluginMenu = [
          {
            label: "开发者工具",
            click: () => {
              const webview = document.getElementById("webview");
              webview.openDevTools();
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
            label: "隐藏插件",
          },
        ];
        if (type !== "separate") {
          pluginMenu.unshift({
            label: "分离窗口",
            click: this.newWindow,
          });
        }
        let menu = Menu.buildFromTemplate(pluginMenu);
        menu.popup();
        return;
      }
      this.showMainUI();
      this.changePath({ key: "market" });
    },
    drag() {
      ipcRenderer.send('window-move');
    }
  },
  computed: {
    ...mapState("main", [
      "showMain",
      "devPlugins",
      "current",
      "options",
      "selected",
      "searchValue",
      "subPlaceHolder",
      "pluginInfo",
      "pluginLoading",
    ]),
    showOptions() {
      // 有选项值，且不在显示主页
      if (this.options.length && !this.showMain) {
        return true;
      }
    },
    searchType() {
      return this.pluginInfo.searchType ? "subWindow" : "";
    },
  },
};
</script>
<style lang="less">
* {
  margin: 0;
  padding: 0;
}
#components-layout {
  padding-top: 60px;
  height: 100vh;
  overflow: auto;
  ::-webkit-scrollbar {
    width: 0;
  }
}
.rubick-select,
.rubick-select-subMenu {
  display: flex;
  padding-left: 10px;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  .rubick-logo {
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
  .tag-container {
    display: flex;
    align-items: center;
    background: #fff;

    .select-tag {
      height: 36px;
      font-size: 20px;
      display: flex;
      align-items: center;
    }
  }

  .ant-input:focus {
    border: none;
    box-shadow: none;
  }

  .options {
    position: absolute;
    top: 62px;
    left: 0;
    width: 100%;
    z-index: 99;
    max-height: calc(~"100vh - 60px");
    overflow: auto;
    .op-item {
      padding: 0 10px;
      height: 60px;
      line-height: 50px;
      max-height: 500px;
      overflow: auto;
      background: #fafafa;
      &.active {
        background: #dee2e8;
      }
    }
  }
}
.rubick-select-subMenu {
  -webkit-app-region: drag;
  background: #eee;
  height: 50px;
  padding-left: 200px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .icon-tool-sub {
    width: 30px;
    height: 30px;
    border-radius: 100%;
    margin-right: 10px;
  }
  .icon-container {
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #999;
    .icon {
      margin-right: 10px;
      cursor: pointer;
    }
  }
  .sub-input {
    width: 310px;
    border-radius: 100px;
  }
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
    position:absolute;
    top: 0;
    left: 0;
  }
}
</style>
