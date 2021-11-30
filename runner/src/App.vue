<template>
  <webview
    id="webview"
    :src="`File://${pluginInfo.indexPath}`"
    :preload="preload"
  />
</template>

<script setup lang="ts">
import { reactive, toRefs, onMounted } from "vue";
const state = reactive({
  pluginInfo: {},
});

window.setPluginInfo = (pluginInfo: any) => {
  console.log(pluginInfo);
  try {
    state.pluginInfo = pluginInfo;
  } catch (e) {
    //
  }
};

onMounted(() => {
  const webview: any = document.querySelector("webview");
  webview.addEventListener("dom-ready", () => {
    webview.openDevTools();
  });
});

const { pluginInfo } = toRefs(state);
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#webview {
  width: 100%;
  height: 100vh;
}
</style>
