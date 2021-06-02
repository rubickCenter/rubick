<template>
  <div>
    <webview style="width: 100%;height: 100vh" id="webview" :src="path"></webview>
  </div>
</template>

<script>
import path from 'path';
import fs from 'fs';
import {getlocalDataFile} from '../../../common/utils';
import { remote } from 'electron';
// import process from 'child_process';

export default {
  name: "index.vue",
  data() {
    return {
      path: `File://${this.$route.query.sourceFile}`,
      preload: path.join(process.cwd(), './api/index.js')
    }
  },
  mounted() {
    console.log(1111, this.$route.query)
    // const webview = document.querySelector('webview')
    // webview.addEventListener('dom-ready', () => {
    //   webview.openDevTools()
    // })
  },
  beforeRouteUpdate() {
    this.path = `File://${this.$route.query.sourceFile}`
  }
}
</script>

<style scoped>

</style>
