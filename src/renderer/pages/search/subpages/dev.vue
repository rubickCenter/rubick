<template>
  <div class="dev-container">
    <div class="dev-detail" v-if="devPlugin.length">
      <a-menu v-model="currentSelect" style="width: 200px; height: 100%" mode="vertical">
        <a-menu-item @click="currentSelect = [index]" v-for="(plugin, index) in devPlugin" :key="index">
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
import {mapState, mapMutations, mapActions} from 'vuex';
import api from "../../../assets/api";
import marked from "marked";
import path from "path";
import fs from "fs";

const rendererMD = new marked.Renderer();

export default {
  data() {
    return {
      currentSelect: [0]
    }
  },
  methods: {
    ...mapMutations('main', ['deleteDevPlugin', 'devPluginStatusChange']),
    ...mapActions('main', ['releasePlugin', 'reloadDevPlugin']),
    release(plugin) {
      if (!plugin.author) return this.$message.error('请填写作者！');
      if (!plugin.status) return this.$message.error('请开启插件！');
      api.plugin.add({
        pluginName: plugin.pluginName,
        author: plugin.author,
        logo: plugin.logo,
        gitUrl: plugin.gitUrl,
        title: plugin.title,
        description: plugin.description,
        version: plugin.version,
        name: plugin.name
      }).then(res => {
        this.$message.success('发布成功！')
      }).catch(e => {
        this.$message.error(e);
      });
    }
  },
  computed: {
    ...mapState('main', ['devPlugins']),
    pluginDetail() {
      return this.devPlugin[this.currentSelect]
    },
    devPlugin() {
      return this.devPlugins.filter(plugin => plugin.type === 'dev')
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
       }
     }
   }
   .dev-detail {
     display: flex;
     align-items: flex-start;
     height: 100%;
     width: 100%;
   }
   .plugin-detail {
     padding: 20px;
     box-sizing: border-box;
     flex: 1;
     .detail-container {
       height: 340px;
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
