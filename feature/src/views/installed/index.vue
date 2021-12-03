<template>
  <div class="installed">
    <div class="installed-list">
      <div :class="currentSelect === index ? 'item active' : 'item'" :key="index" v-for="(plugin, index) in localPlugins">
        <img :src="plugin.logo" />
        <div class="info">
          <div class="title">{{ plugin.pluginName }} <span class="desc">v{{ plugin.version }}</span></div>
          <div class="desc">{{ plugin.description }}</div>
        </div>
      </div>
    </div>
    <div class="plugin-detail">
      <div class="plugin-top">
        <div class="left">
          <div class="title">
            {{ pluginDetail.pluginName }}
            <a-tag>{{ pluginDetail.version }}</a-tag>
          </div>
          <div class="desc">
            开发者：{{`${pluginDetail.author || '未知'}`}}
          </div>
          <div class="desc">
            {{pluginDetail.description}}
          </div>
        </div>
        <div class="right">
          <a-button type="danger" size="small" shape="round" @click="deletePlugin(pluginDetail)">移除</a-button>
        </div>
      </div>
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="功能关键字">
          <div class="feature-container">
            <div class="desc-item" :key="index" v-for="(item, index) in pluginDetail.features">
              <div>{{item.explain}}</div>
              <a-tag
                :key="cmd"
                @click="openPlugin({cmd, plugin: pluginDetail, feature: item, router: $router})"
                v-for="cmd in item.cmds"
              >
                {{cmd}}
              </a-tag>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="详情介绍">
          <div class="detail-container" v-html="readme"></div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed, ref } from "vue";
import path from "path";
import MarkdownIt from "markdown-it";

const { remote } = window.require("electron");
const fs = window.require("fs");
const md = new MarkdownIt();

const appPath = remote.app.getPath("cache");
const baseDir = path.join(appPath, "./rubick-plugins");

const store = useStore();
const localPlugins = computed(() => store.state.localPlugins);
const updateLocalPlugin = () => store.dispatch("updateLocalPlugin");

const currentSelect = ref(0);

const pluginDetail = computed(() => {
  return localPlugins.value[currentSelect.value] || {};
});

const readme = computed(() => {
  if(!pluginDetail.value.name) return "";
  const str = fs.readFileSync(
    path.resolve(baseDir, "node_modules", pluginDetail.value.name, "readme.md"),
    "utf-8"
  );
  return md.render(str);
});

const deletePlugin = async (plugin) => {
  await window.rubick.deletePlugin(plugin);
  updateLocalPlugin();
};
</script>

<style lang="less">
.installed {
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  background: #F3EFEF;
  height: calc(~"100vh - 46px");
  display: flex;
  .installed-list {
    width: 40%;
    background: #fff;
    height: 100%;
    padding: 10px 0;
    border-right: 1px solid #eee;
    .item {
      padding: 10px 20px;
      display: flex;
      align-items: center;
      img {
        width: 40px;
        height: 40px;
        margin-right: 20px;
      }
      .desc {
        color: #999;
      }
      &.active {
        background: #eee;
      }
    }
  }
  .plugin-detail {
    padding: 20px 20px 0 20px;
    box-sizing: border-box;
    width: 60%;
    height: 100%;
    background: #fff;
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
      height: 380px;
      overflow: auto;
      img {
        width: 100%;
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
