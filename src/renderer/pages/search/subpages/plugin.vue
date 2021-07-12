<template>
  <div class="dev-container">
    <div class="dev-detail" v-if="prodPlugin.length">
      <a-menu v-model="currentSelect" style="width: 256px; height: 100%" mode="vertical">
        <a-menu-item @click="currentSelect = [index]" v-for="(plugin, index) in prodPlugin" :key="index">
          <div class="menu-item">
            <img width="40" height="40" :src="plugin.icon" />
            <div>
              <div class="title">{{ plugin.pluginName }}</div>
              <div class="desc">{{ plugin.description }}</div>
            </div>
          </div>
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
            <div class="feature-container">
              <div class="desc-item" v-for="item in pluginDetail.features">
                <div>{{item.explain}}</div>
                <a-tag @click="openPlugin({cmd, plugin: pluginDetail, feature: item, router: $router})" v-for="cmd in item.cmds">{{cmd}}</a-tag>
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
      <a-empty description="暂无已安装插件" />
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex';
import marked from 'marked';
import fs from 'fs';
import path from 'path';
const rendererMD = new marked.Renderer();

export default {
  data() {
    return {
      currentSelect: [0]
    }
  },
  methods: {
    ...mapMutations('main', ['deleteProdPlugin']),
    ...mapActions('main', ['openPlugin']),
  },
  computed: {
    ...mapState('main', ['devPlugins']),
    pluginDetail() {
      return this.prodPlugin[this.currentSelect]
    },
    prodPlugin() {
      return this.devPlugins.filter(plugin => plugin.type === 'prod')
    },
    readme() {
      marked.setOptions({
        renderer: rendererMD,
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false
      });
      try {
        const mdFile = path.join(this.pluginDetail.sourceFile, '../README.md');
        return marked(fs.readFileSync(mdFile, 'utf8'));
      } catch (e) {
        return '暂无描述信息'
      }

    }
  }
}
</script>

<style lang="less">
.dev-container {
  height: calc(~'100vh - 110px');
  overflow: auto;
  .dev-detail {
    display: flex;
    align-items: flex-start;
    height: 100%;
    overflow: auto;
  }
  .plugin-detail {
    padding: 20px 20px 0 20px;
    box-sizing: border-box;
    flex: 1;
    height: 100%;
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
    .detail-container, .feature-container {
      height: 340px;
      overflow: auto;
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
