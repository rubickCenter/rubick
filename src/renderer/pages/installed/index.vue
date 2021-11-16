<template>
  <div class="dev-container">
    <div class="dev-detail" v-if="uiPlugins.length">
      <div class="left-menu" style="width: 256px; height: 100%" >
        <div class="top-info">
          <span>已安装{{uiPlugins.length}}个插件</span>
          <a-dropdown>
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              {{filterName[sort]}} <a-icon type="down" />
            </a>
            <a-menu slot="overlay" @click="({key}) => (this.sort = key) ">
              <a-menu-item key="time">
                <span>按时间顺序</span>
              </a-menu-item>
              <a-menu-item key="type">
                <span>按插件类型</span>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
        <a-menu v-model="currentSelect" style="width: 256px; height: 100%" mode="vertical">
          <a-menu-item @click="currentSelect = [index]" v-for="(plugin, index) in plugins" :key="index">
            <div class="menu-item">
              <img width="40" height="40" :src="plugin.icon" />
              <div>
                <div class="title">{{ plugin.pluginName }}</div>
                <div class="desc">{{ plugin.description }}</div>
              </div>
            </div>
          </a-menu-item>
        </a-menu>
      </div>
      <div class="plugin-detail">
        <div class="plugin-top">
          <div class="left">
            <div class="title">
              {{pluginDetail.pluginName}}
              <a-tag>{{pluginDetail.version}}</a-tag>
            </div>
            <div class="desc">
              开发者：{{`${pluginDetail.author || '未知'}`}}
            </div>
            <div class="desc">
              {{pluginDetail.description}}
            </div>
          </div>
          <div class="right">
            <a-switch :checked="pluginDetail.status" @change="devPluginStatusChange(pluginDetail)" />
          </div>
        </div>
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="管理">
            <div class="desc-item">
              <div class="desc-title">
                <p>重新加载</p>
                <a-button type="link" @click="reloadDevPlugin(pluginDetail)">重载</a-button>
              </div>
              <div class="desc-info">
                如果你修改了plugin.json文件需要重新加载以应用最近版本
              </div>
            </div>
            <div class="desc-item">
              <div class="desc-title">
                <p>发布</p>
                <a-button @click="release(pluginDetail)" type="link">发布</a-button>
              </div>
              <div class="desc-info">
                发布后用户可以通过插件中心下载，且享受最新的更新
              </div>
            </div>
            <div class="desc-item">
              <div class="desc-title">
                <p>删除</p>
                <a-button type="link" @click="deleteDevPlugin(pluginDetail)">删除</a-button>
              </div>
              <div class="desc-info">
                删除这个插件不可以恢复
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="详情介绍">
            <div class="detail-container" v-html="readme"></div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <div class="empty" v-else>
      <a-empty description="暂无开发中的插件" />
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  data () {
    return {
      currentSelect: [0],
      sort: 'time',
      filterName: {
        time: '按安装时间顺序',
        type: '按插件类型顺序'
      }
    }
  },
  methods: {
    release (plugin) {
      if (!plugin.author) return this.$message.error('请填写作者！')
      if (!plugin.status) return this.$message.error('请开启插件！')
      // todo release
    }
  },
  computed: {
    ...mapState('search', ['uiPlugins', 'sysPlugins']),
    pluginDetail () {
      return this.uiPlugins[this.currentSelect]
    },
    plugins () {
      // todo filter
      return [...this.uiPlugins, ...this.sysPlugins]
    },
    readme () {
      return ''
    }
  }
}
</script>

<style lang="less">
.dev-container {
  height: 100vh;
  width: 100%;
  .ant-menu-item {
    height: 60px !important;
    display: flex;
    align-items: center;
    .menu-item {
      display: flex;
      align-items: center;
      line-height: 22px !important;
      img {
        margin-right: 10px;
      }
      .title {
        color: rgba(0,0,0,0.8);
      }
      .desc {
        color: #999;
        width: 180px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
  }
  .dev-detail {
    display: flex;
    align-items: flex-start;
    height: 100%;
    width: 100%;
    background: #fff;
    overflow: hidden;
    .top-info {
      font-size: 12px;
      padding: 8px 16px 5px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-right: 1px solid #e8e8e8;
    }
  }
  .plugin-detail {
    padding: 20px 20px 0 20px;
    box-sizing: border-box;
    flex: 1;
    width: 500px;
    .detail-container {
      height: 320px;
      overflow: auto;
      max-height: 320px;
      width: 100%;
      margin: 0;
      padding: 0;

      * {
        width: 100%;
      }
    }
    .plugin-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      .title {
        font-size: 20px;
        display: flex;
        align-items: center;
      }
      .desc {
        font-size: 13px;
        color: #999;
      }
    }
    .desc-item {
      border-bottom: 1px solid #ddd;
      padding: 10px 0;
      width: 100%;
      overflow: auto;
      .desc-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .desc-info {
        color: #999;
      }
    }
  }
  .empty {
    padding-top: 20px;
  }
}
</style>
