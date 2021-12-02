<template>
  <webview
    v-if="preload"
    id="webview"
    :src="`File://${pluginInfo.indexPath}`"
    :preload="preload"
  />
</template>

<script setup >
import { reactive, toRefs, onMounted } from "vue";
const state = reactive({
  pluginInfo: {},
});

window.setPluginInfo = (pluginInfo) => {
  console.log(pluginInfo);
  try {
    state.pluginInfo = pluginInfo;
  } catch (e) {
    //
  }
};

const { pluginInfo, preload } = toRefs(state);
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
