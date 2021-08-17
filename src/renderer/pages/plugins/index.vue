<template>
  <div>
    <webview
      v-if="!pluginInfo.subType"
      id="webview"
      :src="path"
      :preload="preload"
    ></webview>
    <div v-else>
      <webview id="webview" :src="templatePath" :preload="preload"></webview>
    </div>
  </div>
</template>

<script>
import path from 'path';
import {mapMutations, mapState} from 'vuex';
import {remote} from "electron";

const currentWindow = remote.getCurrentWindow();
const winId = currentWindow.id;

export default {
  name: "index.vue",
  data() {
    return {
      preload: `File://${path.join(__static, './preload.js')}`,
      webview: null,
      config: {},
    }
  },
  mounted() {
    this.webview = document.querySelector('webview');
    this.webview.addEventListener('dom-ready', () => {
      this.webview.send('onPluginReady', this.pluginInfo);
      this.webview.send('onPluginEnter', this.pluginInfo);
      this.commonUpdate({
        pluginLoading: true,
      });
    });
    this.webview.addEventListener('did-finish-load', () => {
      this.commonUpdate({
        pluginLoading: false,
      });
    });
    this.setSubPlaceHolder('Hi, Rubick');
    this.webview.addEventListener('ipc-message', (event) => {
      if (event.channel === 'setSubInput') {
        this.setSubPlaceHolder(event.args[0].placeHolder);
      }
      if (event.channel === 'removeSubInput') {
        this.commonUpdate({
          searchValue: '',
        });
      }
      if (event.channel === 'setSubInputValue') {
        this.commonUpdate({
          searchValue: event.args[0].text,
        });
        this.webview.send('msg-back-setSubInput', this.searchValue);
      }
      if (event.channel === 'templateConfig') {
        this.config = event.args[0].config;
      }
      if (event.channel === 'getFeatures') {
        this.webview.send('msg-back-getFeatures', this.pluginDetail);
      }
      if (event.channel === 'setFeature') {
        this.commonUpdate({
          devPlugins: this.devPlugins.map(plugin => {
            if (plugin.name === this.pluginInfo.name) {
              return {
                ...plugin,
                features: [...plugin.features, event.args[0].feature]
              }
            }
            return plugin;
          }),
        });
      }
      if (event.channel === 'removeFeature') {
        this.commonUpdate({
          devPlugins: this.devPlugins.map(plugin => {
            if (plugin.name === this.pluginInfo.name) {
              return {
                ...plugin,
                features: plugin.features.filter(fe => fe.code !== event.args[0].code)
              }
            }
            return plugin;
          }),
        });
      }
    })
  },
  methods: {
    ...mapMutations('main', ['setSubPlaceHolder', 'commonUpdate']),
  },
  beforeDestroy() {
    const webview = document.querySelector('webview');
    webview && webview.send('onPluginOut', this.pluginInfo)
  },
  computed: {
    ...mapState('main', ['searchValue', 'devPlugins', 'pluginInfo']),
    pluginDetail() {
      return (this.devPlugins.filter(plugin => plugin.name === this.pluginInfo.name)[0] || {}).features
    },
    path() {
      this.$nextTick(() => {
        this.webview && this.webview.send('onPluginEnter', this.pluginInfo);
      });
      return `File://${this.pluginInfo.sourceFile}`
    },
    templatePath() {
      return `File://${path.join(__static, './plugins/tpl/index.html')}?code=${this.pluginInfo.detail.code}&targetFile=${encodeURIComponent(this.pluginInfo.sourceFile)}&preloadPath=${this.pluginInfo.preload}`;
    }
  }
}
</script>

<style lang="less">
#webview {
  width: 100%;
  height: calc(~'100vh - 60px');
}
</style>
