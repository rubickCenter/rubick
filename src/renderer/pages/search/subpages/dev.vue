<template>
  <div class="dev-container">
    <div class="dev-detail" v-if="devPlugins.length">
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
            <a-switch />
          </div>
        </div>
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="管理">
            <div class="desc-item">
              <div class="desc-title">
                <p>重新加载</p>
                <a-button type="link">重载</a-button>
              </div>
              <div class="desc-info">
                如果你修改了plugin.json文件需要重新加载以应用最近版本
              </div>
            </div>
            <div class="desc-item">
              <div class="desc-title">
                <p>发布</p>
                <a-button type="link">发布</a-button>
              </div>
              <div class="desc-info">
                发布后用户可以通过插件中心下载，且享受最新的更新
              </div>
            </div>
            <div class="desc-item">
              <div class="desc-title">
                <p>删除</p>
                <a-button type="link">删除</a-button>
              </div>
              <div class="desc-info">
                删除这个插件不可以恢复
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="详情介绍">
            Content of Tab Pane 2
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
export default {
  data() {
    return {
      currentSelect: [0]
    }
  },
  computed: {
    ...mapState('main', ['devPlugins']),
    pluginDetail() {
      console.log(this.$store)
      return this.devPlugins[this.currentSelect]
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
 }
</style>
