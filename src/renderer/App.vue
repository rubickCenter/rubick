<template>
  <a-layout id="components-layout">
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
          :placeholder="subPlaceHolder && selected && selected.key === 'plugin-container' ? subPlaceHolder : 'Hi, Rubick'"
          class="main-input"
          @change="e => onSearch({value: e.target.value})"
          :value="searchValue"
          :maxLength="selected && selected.key !== 'plugin-container' ? 0 : 1000"
      >
        <div @click="goMenu" class="suffix-tool" slot="suffix">
          <a-icon v-show="selected && selected.key === 'plugin-container'" class="icon-more" type="more" />
          <img class="icon-tool" v-if="selected && selected.icon" :src="selected.icon" />
          <a-icon  class="icon-tool" v-else type="tool"/>
        </div>

      </a-input>
      <div class="options" v-show="showOptions">
        <a-list item-layout="horizontal" :data-source="options">
          <a-list-item @click="() => item.click($router)" class="op-item"  slot="renderItem" slot-scope="item, index">
            <a-list-item-meta
                :description="item.desc"
            >
              <span slot="title" >{{ item.name }}</span>
              <a-avatar
                  slot="avatar"
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
        <img class="icon-tool-sub" v-if="query && query.icon" :src="query.icon" />
        <a-input
            :placeholder="subPlaceHolder"
            class="sub-input"
            @change="(e) => onSearch({value: e.target.value, searchType: $route.query.searchType})"
            :value="searchValue"
        ></a-input>
      </div>

      <div class="icon-container">
        <a-icon class="icon" type="info-circle" />
        <a-icon class="icon" type="setting" />
      </div>
    </div>
    <router-view></router-view>
  </a-layout>
</template>
<script>
import {mapActions, mapMutations, mapState} from "vuex";
import {ipcRenderer, remote} from "electron";
import {getWindowHeight} from "./assets/common/utils";

const {Menu, MenuItem} = remote;

export default {
  data() {
    return {
      searchType: this.$route.query.searchType ? 'subWindow' : '',
      query: this.$route.query
    }
  },
  mounted() {
    // 注册快捷键
    ipcRenderer.send('init-shortcut');
    ipcRenderer.on('init-rubick', this.closeTag);
    ipcRenderer.on('new-window', this.newWindow);
    const searchNd = document.getElementById('search');
    searchNd && searchNd.addEventListener('keydown', this.checkNeedInit)
  },
  methods: {
    ...mapActions('main', ['onSearch', 'showMainUI']),
    ...mapMutations('main', ['commonUpdate']),
    checkNeedInit(e) {
      // 如果搜索栏无内容，且按了删除键，则清空 tag
      if (this.searchValue === '' && e.keyCode === 8) {
        this.closeTag();
      }
    },
    changePath({key}) {
      this.$router.push({path: `/home/${key}`});
      this.commonUpdate({
        current: [key]
      })
    },
    closeTag(v) {
      this.commonUpdate({
        selected: null,
        showMain: false,
        options: [],
      });
      ipcRenderer.send('changeWindowSize-rubick', {
        height: getWindowHeight([]),
      });
      this.$router.push({
        path: '/home',
      });
    },
    newWindow() {
      ipcRenderer.send('new-window', {
        ...this.selected,
        ...this.$route.query,
      });
      this.closeTag();
    },
    goMenu() {
      if (this.selected && this.selected.key === 'plugin-container') {
        const pluginMenu = [
          {
            label: '分离窗口',
            click: this.newWindow
          },
          {
            label: '开发者工具',
            click: () => {
              const webview = document.getElementById('webview');
              webview.openDevTools()
            }
          },
          {
            label: '当前插件信息',
            submenu: [
              {
                label: '简介',
              },
              {
                label: '功能'
              }
            ]
          },
          {
            label: '隐藏插件',
          },
        ];
        let menu = Menu.buildFromTemplate(pluginMenu);
        menu.popup();
        return;
      }
      this.showMainUI();
      this.changePath({key: 'market'})
    },
  },
  computed: {
    ...mapState('main', ['showMain', 'current', 'options', 'selected', 'searchValue', 'subPlaceHolder']),
    showOptions() {
      // 有选项值，且不在显示主页
      if (this.options.length && !this.showMain) {
        return true;
      }
    }
  }
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
}
.rubick-select, .rubick-select-subMenu {
  display: flex;
  padding-left: 10px;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
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
    .op-item {
      padding: 0 10px;
      height: 60px;
      line-height: 50px;
      max-height: 500px;
      overflow: auto;
      background: #fafafa;
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
}
</style>
