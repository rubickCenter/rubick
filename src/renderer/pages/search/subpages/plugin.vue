<template>
  <div class="dev-container">
    <div class="dev-detail" v-if="prodPlugin.length">
      <a-menu v-model="currentSelect" style="width: 256px; height: 100%" mode="vertical">
        <a-menu-item @click="currentSelect = [index]" v-for="(plugin, index) in devPlugins" :key="index">
          <div>{{ plugin.pluginName }}</div>
          <div>{{ plugin.description }}</div>
        </a-menu-item>
      </a-menu>
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
            <a-button type="danger" size="small" shape="round" @click="deleteProdPlugin(pluginDetail)">移除</a-button>
          </div>
        </div>
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="功能关键字">
            <div class="desc-item" v-for="item in pluginDetail.features">
              <div>{{item.explain}}</div>
              <a-tag v-for="cmd in item.cmds">{{cmd}}</a-tag>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="详情介绍">
            Content of Tab Pane 2
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <div class="empty" v-else>
      <a-empty description="暂无已安装插件" />
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex';
export default {
  data() {
    return {
      currentSelect: [0]
    }
  },
  methods: {
    ...mapMutations('main', ['deleteProdPlugin'])
  },
  computed: {
    ...mapState('main', ['devPlugins']),
    pluginDetail() {
      return this.devPlugins[this.currentSelect]
    },
    prodPlugin() {
      return this.devPlugins.filter(plugin => plugin.type === 'prod')
    }
  }
}
</script>

<style lang="scss">
.dev-container {
  height: calc(100vh - 110px);
  .dev-detail {
    display: flex;
    align-items: flex-start;
    height: 100%;
  }
  .plugin-detail {
    padding: 20px;
    box-sizing: border-box;
    flex: 1;
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
