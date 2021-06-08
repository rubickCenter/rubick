<template>
  <div>
    <webview v-if="!query.subType" id="webview" :src="path" :preload="preload"></webview>
    <div v-else>
      <webview id="webview" :src="templatePath" :preload="preload"></webview>
    </div>
  </div>
</template>

<script>
import path from 'path';
import {mapMutations, mapState} from 'vuex';

export default {
  name: "index.vue",
  data() {
    return {
      path: `File://${this.$route.query.sourceFile}`,
      preload: `File://${path.join(__static, './preload.js')}`,
      webview: null,
      query: this.$route.query,
      config: {},
      templatePath: `File://${path.join(__static, './doc-tpl.html')}?code=${JSON.parse(this.$route.query.detail).code}&targetFile=${encodeURIComponent(this.$route.query.sourceFile)}`,
    }
  },
  mounted() {
    this.webview = document.querySelector('webview');
    this.webview.addEventListener('dom-ready', () => {
      this.webview.send('onPluginReady', this.$route.query);
      this.webview.send('onPluginEnter', this.$route.query);
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
            if (plugin.name === this.query.name) {
              return {
                ...plugin,
                features: [...plugin.features, event.args[0].feature]
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
  beforeRouteUpdate() {
    this.path = `File://${this.$route.query.sourceFile}`
  },
  beforeDestroy() {
    const webview = document.querySelector('webview');
    webview && webview.send('onPluginOut', this.$route.query)
  },
  computed: {
    ...mapState('main', ['searchValue', 'devPlugins']),
    pluginDetail() {
      return (this.devPlugins.filter(plugin => plugin.name === this.query.name)[0] || {}).features
    },
  },
  watch: {
    searchValue() {
      this.webview.send('msg-back-setSubInput', this.searchValue);
    }
  }
}
</script>

<style lang="scss">
#webview {
  width: 100%;
  height: calc(100vh - 60px);
}
</style>
