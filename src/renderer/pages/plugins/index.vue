<template>
  <div>
    <webview id="webview" :src="path" :preload="preload"></webview>
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
    })
  },
  methods: {
    ...mapMutations('main', ['setSubPlaceHolder']),
  },
  beforeRouteUpdate() {
    this.path = `File://${this.$route.query.sourceFile}`
  },
  beforeDestroy() {
    const webview = document.querySelector('webview');
    webview && webview.send('onPluginOut', this.$route.query)
  },
  computed: {
    ...mapState('main', ['searchValue'])
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
