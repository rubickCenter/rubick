<template>
  <div>
    <webview style="width: 100%;height: 100vh" id="webview" :src="path" :preload="preload"></webview>
  </div>
</template>

<script>
import path from 'path';
import {ipcRenderer} from 'electron';
export default {
  name: "index.vue",
  data() {
    return {
      path: `File://${this.$route.query.sourceFile}`,
      preload: `File://${path.join(__static, './preload.js')}`
    }
  },
  mounted() {
    const webview = document.querySelector('webview');
    webview.addEventListener('dom-ready', () => {
      webview.openDevTools();
      webview.send('onPluginReady', this.$route.query);
      webview.send('onPluginEnter', this.$route.query)
    });
  },
  beforeRouteUpdate() {
    this.path = `File://${this.$route.query.sourceFile}`
  },
  beforeDestroy() {
    const webview = document.querySelector('webview');
    webview.send('onPluginOut', this.$route.query)
  }
}
</script>

<style scoped>

</style>
